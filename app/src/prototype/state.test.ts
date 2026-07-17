import { describe, expect, it } from 'vitest'
import { initialAssessment } from '../generated/initialAssessment'
import { createChatMessage, createChatThread } from '../chat/thread'
import { resolveChatContext } from '../chat/context'
import {
  defaultState,
  coarsenLocationForStorage,
  persistState,
  prototypeReducer,
  removePersistedState,
  restoreState,
  serializeState,
  STORAGE_KEY,
  STORAGE_VERSION,
  type PrototypeState,
} from './state'

const firstQuestion = initialAssessment.questions[0]
const firstAnswer = firstQuestion.answers[0]
const currentQuestion = initialAssessment.questions.find((question) => question.assessmentType === 'current')!

describe('prototype state and persistence', () => {
  it('records a Not sure answer by stable answer ID', () => {
    const answerId = 'a_baseline_natural_pace_001_unsure_or_none_fit'
    const state = prototypeReducer(defaultState, {
      type: 'submit-answer',
      questionId: firstQuestion.id,
      answerId,
      nextIndex: 1,
    })
    expect(state.submittedAnswers[firstQuestion.id]).toBe(answerId)
    expect(state.saveStatus).toBe('saving')
  })

  it('records a skip without recording an answer and advances', () => {
    const state = prototypeReducer(defaultState, {
      type: 'skip-question',
      questionId: firstQuestion.id,
      nextIndex: 1,
    })
    expect(state.submittedAnswers[firstQuestion.id]).toBeUndefined()
    expect(state.skippedQuestionIds).toContain(firstQuestion.id)
    expect(state.currentIndex).toBe(1)
  })

  it('never serializes a password, transient selection, or restore notice', () => {
    const value = serializeState({
      ...defaultState,
      selectedAnswerId: 'transient-answer',
      restoreNotice: 'transient notice',
      password: 'do-not-store',
    } as PrototypeState & { password: string })
    expect(value).not.toContain('do-not-store')
    expect(value).not.toContain('transient-answer')
    expect(value).not.toContain('transient notice')
    expect(value).not.toContain('password')
  })

  it('restores and validates submitted progress', () => {
    const progress = completedState({
      currentIndex: 2,
      submittedAnswers: {
        [firstQuestion.id]: firstAnswer.id,
        unknown_question: 'unknown_answer',
      },
      skippedQuestionIds: [firstQuestion.id, 'unknown_question'],
    })
    const storage = new Map<string, string>([[STORAGE_KEY, serializeState(progress)]])
    const restored = restoreState({ getItem: (key) => storage.get(key) ?? null })
    expect(restored.state.currentIndex).toBe(2)
    expect(restored.state.submittedAnswers[firstQuestion.id]).toBe(firstAnswer.id)
    expect(restored.state.submittedAnswers.unknown_question).toBeUndefined()
    expect(restored.state.skippedQuestionIds).not.toContain(firstQuestion.id)
    expect(restored.state.selectedAnswerId).toBeNull()
  })

  it('clamps an invalid current index and drops an answer attached to the wrong question', () => {
    const wrongAnswer = initialAssessment.questions[1].answers[0].id
    const value = JSON.stringify({
      version: STORAGE_VERSION,
      state: {
        ...persistableState(completedState()),
        currentIndex: 999,
        submittedAnswers: { [firstQuestion.id]: wrongAnswer },
      },
    })
    const restored = restoreState({ getItem: () => value })
    expect(restored.state.currentIndex).toBe(26)
    expect(restored.state.submittedAnswers).toEqual({})
  })

  it('migrates version 2 location-profile state', () => {
    const value = JSON.stringify({ version: 2, state: persistableState(completedState()) })
    const restored = restoreState({ getItem: () => value })
    expect(restored.state.profile.location?.source).toBe('city')
    expect(restored.notice).toContain('version 2')
  })

  it('migrates version 3 state with empty recommendation and check-in collections', () => {
    const legacy = persistableState(completedState())
    delete legacy.recommendationHistory
    delete legacy.todayRecommendationId
    delete legacy.checkIns
    const restored = restoreState({ getItem: () => JSON.stringify({ version: 3, state: legacy }) })
    expect(restored.state.recommendationHistory).toEqual([])
    expect(restored.state.checkIns).toEqual([])
    expect(restored.notice).toContain('version 3')
  })

  it('migrates an older age band without inventing a birth year', () => {
    const legacy = persistableState(completedState())
    legacy.profile.ageBand = '35–44'
    delete legacy.profile.birthYear
    const restored = restoreState({ getItem: () => JSON.stringify({ version: 4, state: legacy }) })
    expect(restored.state.profile.birthYear).toBe('')
    expect(restored.notice).toContain('version 4')
  })

  it('migrates location-level units to automatic profile preference', () => {
    const legacy = persistableState(completedState())
    delete legacy.profile.temperatureUnitPreference
    legacy.profile.location.units = 'metric'
    const restored = restoreState({ getItem: () => JSON.stringify({ version: 7, state: legacy }) })
    expect(restored.state.profile.temperatureUnitPreference).toBe('automatic')
    expect(restored.state.profile.location).not.toHaveProperty('units')
    expect(restored.notice).toContain('version 7')
  })

  it('preserves assessment and results for a core-complete profile without location', () => {
    const legacy = persistableState(completedState({ resultsReached: true, todayVisited: true, submittedAnswers: { [firstQuestion.id]: firstAnswer.id } }))
    legacy.profile.location = null
    const restored = restoreState({ getItem: () => JSON.stringify({ version: STORAGE_VERSION, state: legacy }) }).state
    expect(restored.profileCompleted).toBe(true)
    expect(restored.assessmentStarted).toBe(true)
    expect(restored.resultsReached).toBe(true)
    expect(restored.todayVisited).toBe(true)
    expect(restored.submittedAnswers[firstQuestion.id]).toBe(firstAnswer.id)
    expect(restored.profile.temperatureUnitPreference).toBe('automatic')
  })

  it('migrates version 8 snapshots with empty conversation history', () => {
    const legacy = persistableState(completedState())
    delete legacy.chatThreads
    const restored = restoreState({ getItem: () => JSON.stringify({ version: 8, state: legacy }) })
    expect(restored.state.chatThreads).toEqual([])
    expect(restored.notice).toContain('version 8')
  })

  it('persists at most 20 newest threads and 40 messages with sanitized references', () => {
    const base = completedState({ resultsReached: true })
    const context = resolveChatContext({ type: 'article', id: 'vata', sourcePath: '/unsafe' }, base)!
    const threads = Array.from({ length: 24 }, (_, index) => {
      const thread = createChatThread(context, new Date(`2026-07-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`))
      thread.messages = Array.from({ length: 45 }, (__, messageIndex) =>
        createChatMessage(messageIndex % 2 ? 'assistant' : 'user', `Message ${messageIndex}`, 'complete', new Date(`2026-07-16T10:${String(messageIndex).padStart(2, '0')}:00.000Z`)),
      )
      return thread
    })
    const restored = restoreState({
      getItem: () => JSON.stringify({
        version: STORAGE_VERSION,
        state: { ...persistableState(base), chatThreads: threads },
      }),
    }).state
    expect(restored.chatThreads).toHaveLength(20)
    expect(restored.chatThreads[0].updatedAt).toBe('2026-07-24T10:00:00.000Z')
    expect(restored.chatThreads[0].messages).toHaveLength(40)
    expect(restored.chatThreads[0].context[0].sourcePath).toBe('/learn/vata')
  })

  it('sanitizes recommendation history and check-in answer references independently', () => {
    const validAnswer = currentQuestion.answers[0].id
    const value = JSON.stringify({
      version: STORAGE_VERSION,
      state: {
        ...persistableState(completedState()),
        recommendationHistory: [
          { recommendationId: 'general-steady-point', date: '2026-07-16', status: 'completed' },
          { recommendationId: 'unknown', date: 'wrong', status: 'shown' },
        ],
        todayRecommendationId: 'general-steady-point',
        checkIns: [{
          id: 'valid-checkin',
          setId: 'quick-current',
          startedAt: '2026-07-16T10:00:00.000Z',
          completedAt: null,
          answers: { [currentQuestion.id]: validAnswer, unknown_question: 'bad' },
        }],
      },
    })
    const restored = restoreState({ getItem: () => value }).state
    expect(restored.recommendationHistory).toEqual([{ recommendationId: 'general-steady-point', date: '2026-07-16', status: 'completed' }])
    expect(restored.todayRecommendationId).toBe('general-steady-point')
    expect(restored.checkIns[0].answers).toEqual({ [currentQuestion.id]: validAnswer })
  })

  it('records check-in progress and recommendation status without changing initial answers', () => {
    const initial = { ...defaultState, submittedAnswers: { [firstQuestion.id]: firstAnswer.id } }
    const started = prototypeReducer(initial, { type: 'start-check-in', checkIn: { id: 'checkin-1', setId: 'quick-current', startedAt: '2026-07-16T10:00:00.000Z', completedAt: null, answers: {} } })
    const answered = prototypeReducer(started, { type: 'answer-check-in', checkInId: 'checkin-1', questionId: currentQuestion.id, answerId: currentQuestion.answers[0].id })
    const shown = prototypeReducer(answered, { type: 'show-recommendation', recommendationId: 'general-steady-point', date: '2026-07-16' })
    const completed = prototypeReducer(shown, { type: 'recommendation-status', recommendationId: 'general-steady-point', date: '2026-07-16', status: 'completed' })
    expect(completed.submittedAnswers).toEqual(initial.submittedAnswers)
    expect(completed.checkIns[0].answers[currentQuestion.id]).toBe(currentQuestion.answers[0].id)
    expect(completed.recommendationHistory[0].status).toBe('completed')
  })

  it('migrates version 1 country fields to incomplete regional setup', () => {
    const legacy = persistableState(completedState())
    const value = JSON.stringify({
      version: 1,
      state: {
        ...legacy,
        profile: {
          preferredName: 'Alex',
          ageBand: '',
          country: 'United States',
          region: 'Oregon',
          city: 'Portland',
          units: 'us',
          dietaryPattern: '',
          allergies: '',
          exclusions: '',
        },
      },
    })
    const restored = restoreState({ getItem: () => value })
    expect(restored.state.profile.location).toBeNull()
    expect(restored.notice).toContain('version 1')
  })

  it('recovers safely from corrupt and incompatible snapshots', () => {
    expect(restoreState({ getItem: () => '{broken' }).notice).toContain('corrupt')
    const future = JSON.stringify({ version: 99, state: {} })
    const restored = restoreState({ getItem: () => future })
    expect(restored.state).toEqual(defaultState)
    expect(restored.notice).toContain('incompatible')
  })

  it('handles storage read, write, and removal failures without throwing', () => {
    const read = restoreState({ getItem: () => { throw new Error('denied') } })
    expect(read.state.saveStatus).toBe('not-saved')
    expect(read.notice).toContain('unavailable')
    expect(persistState(defaultState, { setItem: () => { throw new Error('quota') } })).toMatchObject({ ok: false })
    expect(removePersistedState({ removeItem: () => { throw new Error('denied') } })).toMatchObject({ ok: false })
  })

  it('preserves an already normalized region for persistence', () => {
    expect(
      coarsenLocationForStorage({
        source: 'device', latitude: 45.5, longitude: -122.7,
        areaId: 'grid-v1:45.5:-122.7', precisionKm: 10,
        displayName: 'Portland, Oregon, United States', countryCode: 'US', admin1Code: 'OR',
        timeZone: 'America/Los_Angeles',
        produceRegionId: 'us-pacific-northwest',
      }),
    ).toMatchObject({
      latitude: 45.5,
      longitude: -122.7,
      areaId: 'grid-v1:45.5:-122.7',
      precisionKm: 10,
    })
  })
})

function completedState(values: Partial<PrototypeState> = {}): PrototypeState {
  return {
    ...defaultState,
    accountCreated: true,
    profile: {
      ...defaultState.profile,
      preferredName: 'Alex',
      birthYear: '1990',
      location: {
        source: 'city', latitude: 45.5, longitude: -122.7,
        areaId: 'grid-v1:45.5:-122.7', precisionKm: 10,
        displayName: 'Portland, Oregon, United States', countryCode: 'US', admin1Code: 'OR',
        timeZone: 'America/Los_Angeles', produceRegionId: 'us-pacific-northwest',
      },
      dietaryPattern: 'Omnivore',
      hasFoodAllergies: false,
      hasFoodExclusions: false,
    },
    profileCompleted: true,
    assessmentStarted: true,
    ...values,
  }
}

function persistableState(state: PrototypeState) {
  return JSON.parse(serializeState(state)).state
}
