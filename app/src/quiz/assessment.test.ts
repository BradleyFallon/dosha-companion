import { describe, expect, it } from 'vitest'
import { balanceIconKeys, initialAssessment } from '../generated/initialAssessment'
import { getAssessmentQuestions } from './assessment'

describe('generated initial assessment', () => {
  it('contains 27 active initial-assessment questions in full mode', () => {
    const questions = getAssessmentQuestions('full')
    expect(questions).toHaveLength(27)
    expect(questions.every((question) => question.status === 'draft')).toBe(true)
    expect(questions.filter((question) => question.assessmentType === 'baseline')).toHaveLength(19)
    expect(questions.filter((question) => question.assessmentType === 'current')).toHaveLength(7)
    expect(questions.filter((question) => question.assessmentType === 'context')).toHaveLength(1)
  })

  it('keeps the question-set ordering emitted from question-set-items.csv', () => {
    expect(initialAssessment.questions.map((question) => question.defaultOrder)).toEqual(
      Array.from({ length: 27 }, (_, index) => index + 1),
    )
    expect(initialAssessment.questions[0].slug).toBe('natural-pace')
    expect(initialAssessment.questions.at(-1)?.slug).toBe('changes-from-usual-state')
  })

  it('uses three baseline and two current questions in development short mode', () => {
    const questions = getAssessmentQuestions('short', true)
    expect(questions.map((question) => question.assessmentType)).toEqual([
      'baseline', 'baseline', 'baseline', 'current', 'current',
    ])
  })

  it('includes validated editor display metadata for current answers', () => {
    const currentAnswers: Array<{
      kind: string
      shortLabel: string | null
      iconKey: string | null
      patternKey: string | null
    }> = []
    for (const question of initialAssessment.questions) {
      if (question.assessmentType === 'current') currentAnswers.push(...question.answers)
    }
    const ordinary = currentAnswers.filter((answer) => answer.kind === 'ordinary')
    const fallback = currentAnswers.filter((answer) => answer.kind !== 'ordinary')
    const knownIcons = new Set<string>(balanceIconKeys)

    expect(ordinary.every((answer) => answer.shortLabel && answer.patternKey)).toBe(true)
    expect(ordinary.every((answer) => answer.iconKey && knownIcons.has(answer.iconKey))).toBe(true)
    expect(fallback.every((answer) => !answer.patternKey || answer.patternKey === 'uncertain')).toBe(true)
  })

  it('includes explicit versioned prototype weights for every answer', () => {
    expect(initialAssessment.scoringModelVersion).toBe('0.1-draft')
    const answers: Array<{
      kind: string
      score: {
        modelVersion: string
        target: string
        weights: { vata: number; pitta: number; kapha: number }
        reliability: number
      }
    }> = []
    for (const question of initialAssessment.questions) answers.push(...question.answers)
    expect(answers).toHaveLength(117)
    expect(answers.every((answer) => answer.score.modelVersion === initialAssessment.scoringModelVersion)).toBe(true)
    expect(answers.every((answer) => {
      const total = answer.score.weights.vata + answer.score.weights.pitta + answer.score.weights.kapha
      return total === 0 || total === 1
    })).toBe(true)
    expect(answers.filter((answer) => answer.kind !== 'ordinary').every((answer) =>
      answer.score.target === 'none' && answer.score.reliability === 0)).toBe(true)
  })
})
