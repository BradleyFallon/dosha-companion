import { describe, expect, it } from 'vitest'
import { initialAssessment } from '../generated/initialAssessment'
import { calculateAssessmentCoverage, COVERAGE_POLICY_VERSION } from './coverage'
import { resolveAssessmentOutcome } from './result'

const baseline = initialAssessment.questions.filter((question) => question.assessmentType === 'baseline')
const current = initialAssessment.questions.filter((question) => question.assessmentType === 'current')
const context = initialAssessment.questions.filter((question) => question.assessmentType === 'context')

describe('assessment coverage', () => {
  it('is ready at the exact 22/14/4 boundary', () => {
    const submittedAnswers = answersFor(baseline.slice(0, 14), 'ordinary')
    Object.assign(submittedAnswers, answersFor(current.slice(0, 4), 'ordinary'))
    Object.assign(submittedAnswers, answersFor(context, 'ordinary'))
    Object.assign(submittedAnswers, answersFor(baseline.slice(14, 17), 'fallback'))

    const coverage = calculateAssessmentCoverage({ submittedAnswers, skippedQuestionIds: [] })
    expect(coverage.policyVersion).toBe(COVERAGE_POLICY_VERSION)
    expect(coverage.submittedOverall).toBe(22)
    expect(coverage.baseline.substantive).toBe(14)
    expect(coverage.current.substantive).toBe(4)
    expect(coverage.ready).toBe(true)
  })

  it('does not treat Not sure, fallback, or skip as substantive', () => {
    const submittedAnswers = {
      ...answersFor(baseline.slice(0, 13), 'ordinary'),
      ...answersFor(baseline.slice(13, 19), 'fallback'),
      ...answersFor(current.slice(0, 4), 'ordinary'),
    }
    const skippedQuestionIds = [current[4].id]
    const coverage = calculateAssessmentCoverage({ submittedAnswers, skippedQuestionIds })
    expect(coverage.baseline.substantive).toBe(13)
    expect(coverage.baseline.fallback).toBe(6)
    expect(coverage.current.skipped).toBe(1)
    expect(coverage.unmetRequirements).toContain('substantive-baseline')
  })

  it('keeps baseline, current, context, and category coverage separate', () => {
    const coverage = calculateAssessmentCoverage({
      submittedAnswers: {
        ...answersFor(baseline.slice(0, 2), 'ordinary'),
        ...answersFor(current.slice(0, 1), 'ordinary'),
        ...answersFor(context, 'ordinary'),
      },
      skippedQuestionIds: [],
    })
    expect(coverage.baseline.categoriesCovered).toBe(2)
    expect(coverage.current.categoriesCovered).toBe(1)
    expect(coverage.context.substantive).toBe(1)
    expect(coverage.context.submitted).toBe(1)
  })

  it('prioritizes baseline then current repair questions', () => {
    const baselineGap = calculateAssessmentCoverage({
      submittedAnswers: answersFor(current, 'ordinary'),
      skippedQuestionIds: [baseline[2].id],
    })
    expect(baselineGap.nextQuestionId).toBe(baseline[2].id)

    const currentGap = calculateAssessmentCoverage({
      submittedAnswers: answersFor(baseline.slice(0, 19), 'ordinary'),
      skippedQuestionIds: [current[3].id],
    })
    expect(currentGap.nextQuestionId).toBe(current[3].id)
  })

  it('produces an auditable unavailable-scoring result and explicit fixture', () => {
    const submittedAnswers = {
      ...answersFor(baseline, 'ordinary'),
      ...answersFor(current, 'ordinary'),
      ...answersFor(context, 'ordinary'),
    }
    const real = resolveAssessmentOutcome({ submittedAnswers, skippedQuestionIds: [] })
    expect(real.kind).toBe('coverage-ready')
    expect(real.scoring).toMatchObject({ kind: 'unavailable', scoringModelVersion: null })
    expect(real.coverage.submittedAnswerIds).toHaveLength(27)

    const fixture = resolveAssessmentOutcome(
      { submittedAnswers: {}, skippedQuestionIds: [] },
      { allowDevelopmentFixture: true, fixtureRequested: true },
    )
    expect(fixture.kind).toBe('development-fixture')
    if (fixture.kind === 'development-fixture') {
      expect(fixture.fixture.notice).toContain('not calculated')
    }
  })
})

function answersFor(
  questions: readonly (typeof initialAssessment.questions)[number][],
  kind: 'ordinary' | 'fallback',
) {
  return Object.fromEntries(questions.map((question) => {
    const answer = kind === 'ordinary'
      ? question.answers.find((candidate) => candidate.kind === 'ordinary')
      : question.answers.find((candidate) => candidate.kind !== 'ordinary')
    if (!answer) throw new Error(`Missing ${kind} answer for ${question.id}`)
    return [question.id, answer.id]
  }))
}
