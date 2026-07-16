import { describe, expect, it } from 'vitest'
import {
  defaultState,
  coarsenLocationForStorage,
  prototypeReducer,
  restoreState,
  serializeState,
  STORAGE_KEY,
  type PrototypeState,
} from './state'

describe('prototype state and persistence', () => {
  it('records a Not sure answer by stable answer ID', () => {
    const answerId = 'a_baseline_natural_pace_001_unsure_or_none_fit'
    const state = prototypeReducer(defaultState, {
      type: 'submit-answer',
      questionId: 'q_baseline_natural_pace_001',
      answerId,
      nextIndex: 1,
    })
    expect(state.submittedAnswers.q_baseline_natural_pace_001).toBe(answerId)
  })

  it('records a skip without recording an answer and advances', () => {
    const state = prototypeReducer(defaultState, {
      type: 'skip-question',
      questionId: 'q_baseline_natural_pace_001',
      nextIndex: 1,
    })
    expect(state.submittedAnswers.q_baseline_natural_pace_001).toBeUndefined()
    expect(state.skippedQuestionIds).toContain('q_baseline_natural_pace_001')
    expect(state.currentIndex).toBe(1)
  })

  it('never serializes a password or transient selected answer', () => {
    const value = serializeState({
      ...defaultState,
      selectedAnswerId: 'transient-answer',
      password: 'do-not-store',
    } as PrototypeState & { password: string })
    expect(value).not.toContain('do-not-store')
    expect(value).not.toContain('transient-answer')
    expect(value).not.toContain('password')
  })

  it('restores submitted progress for refresh and resume', () => {
    const progress = {
      ...defaultState,
      accountCreated: true,
      assessmentStarted: true,
      assessmentMode: 'short' as const,
      currentIndex: 2,
      submittedAnswers: { q_baseline_natural_pace_001: 'answer-1' },
    }
    const storage = new Map<string, string>([[STORAGE_KEY, serializeState(progress)]])
    const restored = restoreState({ getItem: (key) => storage.get(key) ?? null })
    expect(restored.currentIndex).toBe(2)
    expect(restored.submittedAnswers.q_baseline_natural_pace_001).toBe('answer-1')
    expect(restored.selectedAnswerId).toBeNull()
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
