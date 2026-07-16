import { describe, expect, it } from 'vitest'
import { initialAssessment } from '../generated/initialAssessment'
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
})
