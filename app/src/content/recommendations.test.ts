import { describe, expect, it } from 'vitest'
import { createTestState } from '../prototype/state'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import { initialAssessment } from '../generated/initialAssessment'
import { selectDailyRecommendation } from './recommendations'

const state = createTestState()
const fullAnswers = Object.fromEntries(initialAssessment.questions.map((question) => [question.id, question.answers.find((answer) => answer.kind === 'ordinary')?.id ?? '']))

function select(values: Partial<Parameters<typeof selectDailyRecommendation>[0]> = {}) {
  const submittedAnswers = values.submittedAnswers ?? fullAnswers
  return selectDailyRecommendation({
    coverage: values.coverage ?? calculateAssessmentCoverage({ submittedAnswers, skippedQuestionIds: [] }),
    profile: values.profile ?? state.profile,
    submittedAnswers,
    now: values.now ?? new Date('2026-07-16T16:00:00Z'),
    ...values,
  })
}

describe('catalog recommendation selector', () => {
  it('uses context precedence and explains the no-scoring boundary', () => {
    const item = select({ submittedAnswers: { ...fullAnswers, q_context_major_change_001: 'a_context_major_change_001_recent_travel_major_schedule' } })
    expect(item.contexts).toContain('travel')
    expect(item.why).toContain('No dosha score was calculated or used.')
  })

  it('uses current coverage before time of day', () => {
    const answers = Object.fromEntries(initialAssessment.questions.filter((question) => question.assessmentType === 'baseline').map((question) => [question.id, question.answers[0].id]))
    const item = select({ submittedAnswers: answers, coverage: calculateAssessmentCoverage({ submittedAnswers: answers, skippedQuestionIds: [] }) })
    expect(item.contexts).toContain('insufficient-current')
    expect(item.checkInSetId).toBe('quick-current')
  })

  it('keeps an active shown item and rotates away from history otherwise', () => {
    const first = select()
    const history = [{ recommendationId: first.id, date: first.selectionDate, status: 'shown' as const }]
    expect(select({ recommendationHistory: history, activeRecommendationId: first.id }).id).toBe(first.id)
    expect(select({ recommendationHistory: history, activeRecommendationId: null }).id).not.toBe(first.id)
  })

  it('withholds food whenever allergies or exclusions are present', () => {
    const ready = { ...state.profile, dietaryPattern: 'Vegetarian', hasFoodAllergies: false, hasFoodExclusions: false }
    expect(select({ profile: { ...ready, dietaryPattern: 'Vegan', hasFoodAllergies: true, allergies: 'Nuts' } }).food.status).toBe('withheld')
    expect(select({ profile: { ...ready, hasFoodExclusions: true, exclusions: 'Soy' } }).food.status).toBe('withheld')
    expect(select({ profile: ready }).food.status).toBe('shown')
  })
})
