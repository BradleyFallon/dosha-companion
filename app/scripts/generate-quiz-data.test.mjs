import { describe, expect, it } from 'vitest'
import { validateAnswerMetadata, validateScoreRow } from './generate-quiz-data.mjs'

const currentQuestion = { assessment_type: 'current' }
const allowedIcons = new Set(['moon-stars', 'lightning'])
const checkControlled = (group, value, label) => {
  const valid = group === 'balance_icon_key'
    ? allowedIcons.has(value)
    : group === 'score_target' && ['baseline', 'current', 'none'].includes(value)
  if (!valid) {
    throw new Error(`Quiz generation failed: ${label} uses unknown ${group} value "${value}"`)
  }
}

function score(values = {}) {
  return {
    scoring_model_version: '0.1-draft',
    score_target: 'current',
    vata_weight: '1',
    pitta_weight: '0',
    kapha_weight: '0',
    reliability_weight: '1',
    ...values,
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

describe('prototype score generation', () => {
  it('accepts one explicit unit direction and an explicit no-elevation response', () => {
    expect(validateScoreRow(score(), answer(), currentQuestion, checkControlled)).toMatchObject({
      modelVersion: '0.1-draft',
      target: 'current',
      weights: { vata: 1, pitta: 0, kapha: 0 },
      reliability: 1,
    })
    expect(validateScoreRow(score({ vata_weight: '0' }), answer(), currentQuestion, checkControlled).weights).toEqual({
      vata: 0,
      pitta: 0,
      kapha: 0,
    })
  })

  it('rejects missing, multi-direction, and mismatched score values', () => {
    expect(() => validateScoreRow(score({ vata_weight: '' }), answer(), currentQuestion, checkControlled)).toThrow(/must be a number/)
    expect(() => validateScoreRow(score({ pitta_weight: '1' }), answer(), currentQuestion, checkControlled)).toThrow(/more than one prototype direction/)
    expect(() => validateScoreRow(score({ score_target: 'baseline' }), answer(), currentQuestion, checkControlled)).toThrow(/does not match current question/)
  })

  it('keeps fallback and context records fully non-scoring', () => {
    const fallback = answer({ answer_kind: 'not_sure' })
    expect(validateScoreRow(score({ score_target: 'none', vata_weight: '0', reliability_weight: '0' }), fallback, currentQuestion, checkControlled).target).toBe('none')
    expect(() => validateScoreRow(score(), fallback, currentQuestion, checkControlled)).toThrow(/fallback.*cannot contribute/)
  })
})
