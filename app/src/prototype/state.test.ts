import { describe, expect, it } from 'vitest'
import { initialAssessment } from '../generated/initialAssessment'
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
    expect(restored.state.profile.location?.source).toBe('skipped')
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

  it('migrates version 1 country fields to a manual coarse location', () => {
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
    expect(restored.state.profile.location).toMatchObject({
      source: 'map',
      latitude: null,
      longitude: null,
      displayLabel: 'Portland, Oregon, United States',
    })
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

  it('coarsens exact coordinates before persistence', () => {
    expect(
      coarsenLocationForStorage({
        source: 'device',
        latitude: 45.5231,
        longitude: -122.6765,
        accuracyMeters: 25,
        timeZone: 'America/Los_Angeles',
        units: 'us',
        displayLabel: 'Approximate device location',
      }),
    ).toMatchObject({
      latitude: 45.52,
      longitude: -122.68,
      accuracyMeters: 1000,
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
      location: {
        source: 'skipped',
        latitude: null,
        longitude: null,
        accuracyMeters: null,
        timeZone: 'America/Los_Angeles',
        units: 'us',
        displayLabel: null,
      },
    },
    profileCompleted: true,
    assessmentStarted: true,
    ...values,
  }
}

function persistableState(state: PrototypeState) {
  return JSON.parse(serializeState(state)).state
}
