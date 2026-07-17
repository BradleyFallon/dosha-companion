import { describe, expect, it } from 'vitest'
import { validateAnswerMetadata } from './generate-quiz-data.mjs'

const currentQuestion = { assessment_type: 'current' }
const allowedIcons = new Set(['moon-stars', 'lightning'])
const checkControlled = (group, value, label) => {
  if (group !== 'balance_icon_key' || !allowedIcons.has(value)) {
    throw new Error(`Quiz generation failed: ${label} uses unknown ${group} value "${value}"`)
  }
}

function answer(values = {}) {
  return {
    answer_id: 'answer-test',
    answer_kind: 'ordinary',
    short_label: 'Light and interrupted',
    icon_key: 'moon-stars',
    pattern_key: 'sleep_variable',
    ...values,
  }
}

describe('quiz balance metadata generation', () => {
  it('accepts valid concise labels, controlled icons, and neutral pattern keys', () => {
    expect(validateAnswerMetadata(answer(), currentQuestion, checkControlled)).toEqual({
      shortLabel: 'Light and interrupted',
      iconKey: 'moon-stars',
      patternKey: 'sleep_variable',
    })
  })

  it('rejects an unknown icon key', () => {
    expect(() => validateAnswerMetadata(answer({ icon_key: 'made-up-icon' }), currentQuestion, checkControlled)).toThrow(/unknown balance_icon_key/)
  })

  it('rejects malformed pattern keys', () => {
    expect(() => validateAnswerMetadata(answer({ pattern_key: 'Sleep Variable!' }), currentQuestion, checkControlled)).toThrow(/malformed pattern_key/)
  })

  it('requires a short label for ordinary current answers', () => {
    expect(() => validateAnswerMetadata(answer({ short_label: '', pattern_key: '' }), currentQuestion, checkControlled)).toThrow(/blank short_label/)
  })

  it('prevents fallback answers from creating false comparisons', () => {
    expect(() => validateAnswerMetadata(answer({ answer_kind: 'not_sure', pattern_key: 'sleep_variable' }), currentQuestion, checkControlled)).toThrow(/must use pattern_key "uncertain"/)
    expect(validateAnswerMetadata(answer({ answer_kind: 'not_sure', pattern_key: 'uncertain' }), currentQuestion, checkControlled).patternKey).toBe('uncertain')
  })
})
