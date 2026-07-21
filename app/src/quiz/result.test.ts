import { describe, expect, it } from 'vitest'
import { initialAssessment } from '../generated/initialAssessment'
import { calculatePrototypeDoshaResult, PROTOTYPE_SCORING_RULE_ID, resolveAssessmentOutcome, type Dosha } from './result'

describe('prototype dosha scoring', () => {
  it('derives separate Vata baseline and current results from explicit weights', () => {
    const submittedAnswers = completeAnswers('vata', 'vata')
    const result = calculatePrototypeDoshaResult({ submittedAnswers, skippedQuestionIds: [] })

    expect(result).toMatchObject({
      kind: 'calculated',
      scoringModelVersion: '0.1-draft',
      baselineLabel: 'Vata',
      currentLabel: 'Vata is currently more prominent',
      ruleIds: [PROTOTYPE_SCORING_RULE_ID],
      prototype: true,
    })
    if (result.kind === 'calculated') {
      expect(result.baseline.totals).toEqual({ vata: 19, pitta: 0, kapha: 0 })
      expect(result.current.totals).toEqual({ vata: 7, pitta: 0, kapha: 0 })
    }
  })

  it('uses the documented 75% rule for mixed baseline profiles', () => {
    const submittedAnswers = completeAnswers('vata', 'vata')
    const baseline = initialAssessment.questions.filter((question) => question.assessmentType === 'baseline')
    for (const question of baseline.slice(0, 9)) {
      submittedAnswers[question.id] = directionalAnswer(question, 'pitta').id
    }

    const result = calculatePrototypeDoshaResult({ submittedAnswers, skippedQuestionIds: [] })
    expect(result.kind).toBe('calculated')
    if (result.kind === 'calculated') {
      expect(result.baselineLabel).toBe('Vata–Pitta')
      expect(result.baseline.doshas).toEqual(['vata', 'pitta'])
      expect(result.baseline.totals).toEqual({ vata: 10, pitta: 9, kapha: 0 })
    }
  })

  it('treats explicit close-to-usual answers as no recent elevation', () => {
    const submittedAnswers = completeAnswers('kapha', 'vata')
    for (const question of initialAssessment.questions.filter((item) => item.assessmentType === 'current')) {
      submittedAnswers[question.id] = question.answers.find((answer) =>
        answer.score.target === 'current' &&
        answer.score.weights.vata === 0 &&
        answer.score.weights.pitta === 0 &&
        answer.score.weights.kapha === 0)!.id
    }

    const result = calculatePrototypeDoshaResult({ submittedAnswers, skippedQuestionIds: [] })
    expect(result.kind).toBe('calculated')
    if (result.kind === 'calculated') {
      expect(result.baselineLabel).toBe('Kapha')
      expect(result.currentLabel).toBe('No recent dosha elevation detected')
      expect(result.current.doshas).toEqual([])
      expect(result.current.scoredAnswerCount).toBe(7)
    }
  })

  it('uses one supplied recent record without merging it into initial current answers', () => {
    const submittedAnswers = completeAnswers('vata', 'vata')
    const currentQuestions = initialAssessment.questions.filter((question) => question.assessmentType === 'current')
    const currentAnswers = Object.fromEntries(currentQuestions.slice(0, 5).map((question) => [
      question.id,
      directionalAnswer(question, 'pitta').id,
    ]))
    const result = calculatePrototypeDoshaResult({ submittedAnswers, skippedQuestionIds: [], currentAnswers })

    expect(result.kind).toBe('calculated')
    if (result.kind === 'calculated') {
      expect(result.currentLabel).toBe('Pitta is currently more prominent')
      expect(result.current.totals).toEqual({ vata: 0, pitta: 5, kapha: 0 })
    }
  })

  it('keeps insufficient and fallback-only records unavailable', () => {
    expect(calculatePrototypeDoshaResult({ submittedAnswers: {}, skippedQuestionIds: [] }).kind).toBe('unavailable')

    const submittedAnswers = completeAnswers('vata', 'vata')
    const currentAnswers = Object.fromEntries(
      initialAssessment.questions
        .filter((question) => question.assessmentType === 'current')
        .map((question) => [question.id, question.answers.find((answer) => answer.kind !== 'ordinary')!.id]),
    )
    const result = calculatePrototypeDoshaResult({ submittedAnswers, skippedQuestionIds: [], currentAnswers })
    expect(result.kind).toBe('calculated')
    if (result.kind === 'calculated') expect(result.currentLabel).toBe('Not enough recent information')
  })

  it('returns a calculated coverage-ready assessment outcome', () => {
    const submittedAnswers = completeAnswers('pitta', 'kapha')
    const outcome = resolveAssessmentOutcome({ submittedAnswers, skippedQuestionIds: [] })
    expect(outcome.kind).toBe('coverage-ready')
    expect(outcome.scoring).toMatchObject({
      kind: 'calculated',
      baselineLabel: 'Pitta',
      currentLabel: 'Kapha is currently more prominent',
    })
  })
})

function completeAnswers(baselineDosha: Dosha, currentDosha: Dosha) {
  return Object.fromEntries(initialAssessment.questions.map((question) => {
    const direction = question.assessmentType === 'baseline' ? baselineDosha : currentDosha
    const answer = question.assessmentType === 'context'
      ? question.answers.find((candidate) => candidate.kind === 'ordinary')!
      : directionalAnswer(question, direction)
    return [question.id, answer.id]
  }))
}

function directionalAnswer(
  question: (typeof initialAssessment.questions)[number],
  dosha: Dosha,
) {
  const answer = question.answers.find((candidate) => candidate.score.weights[dosha] === 1)
  if (!answer) throw new Error(`No ${dosha} answer for ${question.id}`)
  return answer
}
