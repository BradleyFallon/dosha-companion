import { describe, expect, it } from 'vitest'
import { getCheckInQuestionSet } from '../content/repository'
import { getSeasonalProduce } from '../content/seasonalProduce'
import { initialAssessment } from '../generated/initialAssessment'
import { createTestState, type PrototypeState } from '../prototype/state'
import { validateChatApiResponse, type ChatApiRequest } from './api'
import { MockChatClient } from './client'
import { resolveChatContext } from './context'
import { buildSafeProfileContext } from './profile'
import { retrieveChatSources } from './retrieval'
import {
  chatEntryPath,
  chatReferenceFromSearch,
  chatReturnPath,
} from './returnTargets'
import type { ResolvedChatContext } from './types'

describe('chat contexts and grounding', () => {
  it('resolves recommendation, article, seasonal-food, check-in, balance-domain, and general contexts', () => {
    const state = completedState()
    const seasonalFood = getSeasonalProduce(state.profile)[0]
    expect(resolveChatContext({ type: 'recommendation', id: 'general-steady-point', sourcePath: '/unsafe' }, state)).toMatchObject({
      reference: { type: 'recommendation', sourcePath: '/today' },
    })
    expect(resolveChatContext({ type: 'article', id: 'vata', sourcePath: '/unsafe' }, state)).toMatchObject({
      title: 'Vata',
      sourcePath: '/learn/vata',
    })
    expect(seasonalFood).toBeTruthy()
    expect(resolveChatContext({ type: 'seasonal-food', id: seasonalFood.id, sourcePath: '/unsafe' }, state)).toMatchObject({
      title: seasonalFood.name,
      sourcePath: '/today',
    })
    expect(resolveChatContext({ type: 'check-in', id: 'checkin-chat', sourcePath: '/unsafe' }, state)).toMatchObject({
      reference: { type: 'check-in' },
      sourcePath: '/questions',
    })
    expect(resolveChatContext({ type: 'balance-domain', id: 'sleep', sourcePath: '/unsafe' }, state)).toMatchObject({
      reference: { type: 'balance-domain' },
      title: 'Sleep',
      sourcePath: '/balance/sleep',
    })
    expect(resolveChatContext({ type: 'general', id: 'general', sourcePath: '/learn' }, state)).toMatchObject({
      title: 'General conversation',
      sourcePath: '/learn',
    })
  })

  it('returns a recoverable null for invalid or unavailable references', () => {
    const state = completedState()
    expect(resolveChatContext({ type: 'article', id: 'missing', sourcePath: '/learn' }, state)).toBeNull()
    expect(resolveChatContext({ type: 'check-in', id: 'missing', sourcePath: '/questions' }, state)).toBeNull()
    expect(resolveChatContext({ type: 'balance-domain', id: 'missing', sourcePath: '/balance' }, state)).toBeNull()
  })

  it('builds purposefully limited profile context without coordinates or assessment answers', () => {
    const state = completedState()
    const context = resolveChatContext({ type: 'seasonal-food', id: getSeasonalProduce(state.profile)[0].id, sourcePath: '/today' }, state)!
    const safe = buildSafeProfileContext(state, context)
    expect(safe).toMatchObject({
      preferredName: 'Alex',
      dietaryPattern: 'Omnivore',
      regionalLocationLabel: 'Portland, Oregon, United States',
    })
    expect(JSON.stringify(safe)).not.toContain('45.5')
    expect(safe).not.toHaveProperty('submittedAnswers')
    expect(safe).not.toHaveProperty('chatThreads')
  })

  it('reuses deterministic catalog search and returns only known app sources', () => {
    const state = completedState()
    const context = resolveChatContext({ type: 'article', id: 'vata', sourcePath: '/learn/vata' }, state)!
    const sources = retrieveChatSources({ question: 'How does Vata relate to current balance?', context, state })
    expect(sources.length).toBeGreaterThanOrEqual(3)
    expect(sources.length).toBeLessThanOrEqual(5)
    expect(sources.every((source) => source.href.startsWith('/'))).toBe(true)
    expect(sources.some((source) => source.id === 'vata')).toBe(true)
  })
})

describe('mock chat client and API contract', () => {
  it.each([
    ['recommendation', { type: 'recommendation', id: 'general-steady-point', sourcePath: '/today' }],
    ['article', { type: 'article', id: 'vata', sourcePath: '/learn/vata' }],
    ['seasonal-food', null],
    ['check-in', { type: 'check-in', id: 'checkin-chat', sourcePath: '/questions' }],
    ['balance-domain', { type: 'balance-domain', id: 'sleep', sourcePath: '/balance' }],
    ['general', { type: 'general', id: 'general', sourcePath: '/today' }],
  ] as const)('returns a grounded %s response', async (kind, suppliedReference) => {
    const state = completedState()
    const reference = suppliedReference ?? {
      type: 'seasonal-food' as const,
      id: getSeasonalProduce(state.profile)[0].id,
      sourcePath: '/today',
    }
    const context = resolveChatContext(reference, state)!
    const response = await new MockChatClient().send(requestFor(context, state))
    expect(response.answer.length).toBeGreaterThan(40)
    expect(response.answer).not.toContain('What would you like')
    expect(response.citations.every((citation) => citation.href.startsWith('/'))).toBe(true)
    expect(context.payload.type).toBe(kind)
  })

  it.each([
    ['Should I stop taking my medication?', 'medication'],
    ['Do I have an anxiety disorder?', 'medical'],
    ['I cannot breathe and this is a medical emergency', 'emergency'],
  ])('returns a safe boundary for %s', async (message, boundary) => {
    const state = completedState()
    const context = resolveChatContext({ type: 'general', id: 'general', sourcePath: '/today' }, state)!
    const response = await new MockChatClient().send({ ...requestFor(context, state), message })
    expect(response.boundary).toBe(boundary)
    expect(response.citations).toEqual([])
  })

  it('validates future API responses and rejects unsafe citations', () => {
    expect(validateChatApiResponse({
      answer: 'Grounded answer',
      citations: [{ id: 'vata', title: 'Vata', href: '/learn/vata', type: 'article' }],
      suggestedFollowUps: ['Tell me more'],
      boundary: null,
    })).toMatchObject({ answer: 'Grounded answer', boundary: null })
    expect(() => validateChatApiResponse({
      answer: 'Unsafe',
      citations: [{ id: 'outside', title: 'Outside', href: 'https://example.com', type: 'article' }],
      suggestedFollowUps: [],
      boundary: null,
    })).toThrow(/invalid response/)
  })
})

describe('chat return targets', () => {
  it('builds semantic contextual entry paths and rejects arbitrary returns', () => {
    expect(chatEntryPath({ type: 'article', id: 'vata' }, '/learn')).toBe('/chat/new?return=learn&contextType=article&contextId=vata')
    expect(chatReferenceFromSearch('?contextType=article&contextId=vata&return=learn')).toEqual({
      type: 'article',
      id: 'vata',
      sourcePath: '/learn',
    })
    expect(chatReturnPath('?return=https://bad.example', '/today')).toBe('/today')
    expect(chatReferenceFromSearch('?contextType=article&contextId=../../bad')).toBeNull()
  })
})

function requestFor(context: ResolvedChatContext, state: PrototypeState): ChatApiRequest {
  const sources = retrieveChatSources({ question: 'Please explain this', context, state })
  return {
    threadId: 'chat-test',
    message: 'Please explain this',
    context: {
      anchors: [context.payload],
      profile: buildSafeProfileContext(state, context),
      sources,
    },
    history: [],
  }
}

function completedState(): PrototypeState {
  const set = getCheckInQuestionSet('quick-current')!
  const answers = Object.fromEntries(set.questionIds.map((questionId) => {
    const question = initialAssessment.questions.find((candidate) => candidate.id === questionId)!
    return [questionId, question.answers[0].id]
  }))
  return createTestState({
    resultsReached: true,
    profileCompleted: true,
    assessmentStarted: true,
    profile: {
      preferredName: 'Alex',
      birthYear: '1990',
      location: {
        source: 'city',
        areaId: 'grid-v1:45.5:-122.7',
        latitude: 45.5,
        longitude: -122.7,
        precisionKm: 10,
        displayName: 'Portland, Oregon, United States',
        countryCode: 'US',
        admin1Code: 'OR',
        timeZone: 'America/Los_Angeles',
        produceRegionId: 'us-pacific-northwest',
      },
      temperatureUnitPreference: 'automatic',
      dietaryPattern: 'Omnivore',
      hasFoodAllergies: false,
      allergies: '',
      hasFoodExclusions: false,
      exclusions: '',
    },
    checkIns: [{
      id: 'checkin-chat',
      setId: set.id,
      startedAt: '2026-07-16T10:00:00.000Z',
      completedAt: '2026-07-16T10:05:00.000Z',
      answers,
    }],
  })
}
