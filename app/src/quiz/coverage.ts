import { initialAssessment } from '../generated/initialAssessment'

export const COVERAGE_POLICY_VERSION = 'coverage-policy-0.1'

export const COVERAGE_REQUIREMENTS = {
  submittedOverall: 22,
  substantiveBaseline: 14,
  substantiveCurrent: 4,
} as const

export type QuestionResponseStatus =
  | 'substantive'
  | 'fallback'
  | 'skipped'
  | 'unanswered'

export type AssessmentSection = 'baseline' | 'current' | 'context'

export interface SectionCoverage {
  total: number
  submitted: number
  substantive: number
  fallback: number
  skipped: number
  unanswered: number
  categoriesTotal: number
  categoriesCovered: number
  coveredCategories: string[]
  missingCategories: string[]
}

export type CoverageRequirement =
  | 'submitted-overall'
  | 'substantive-baseline'
  | 'substantive-current'

export interface QuestionCoverageRecord {
  questionId: string
  answerId: string | null
  assessmentType: AssessmentSection
  category: string
  status: QuestionResponseStatus
}

export interface AssessmentCoverage {
  policyVersion: typeof COVERAGE_POLICY_VERSION
  ready: boolean
  submittedOverall: number
  substantiveOverall: number
  baseline: SectionCoverage
  current: SectionCoverage
  context: SectionCoverage
  unmetRequirements: CoverageRequirement[]
  nextQuestionId: string | null
  submittedAnswerIds: string[]
  substantiveAnswerIds: string[]
  fallbackAnswerIds: string[]
  skippedQuestionIds: string[]
  unansweredQuestionIds: string[]
  records: QuestionCoverageRecord[]
}

export interface CoverageInput {
  submittedAnswers: Record<string, string>
  skippedQuestionIds: readonly string[]
}

const questions = initialAssessment.questions

export function calculateAssessmentCoverage(input: CoverageInput): AssessmentCoverage {
  const skipped = new Set(input.skippedQuestionIds)
  const records: QuestionCoverageRecord[] = questions.map((question) => {
    const answerId = input.submittedAnswers[question.id] ?? null
    const answer = answerId
      ? question.answers.find((candidate) => candidate.id === answerId)
      : undefined

    let status: QuestionResponseStatus = 'unanswered'
    if (answer) status = answer.kind === 'ordinary' ? 'substantive' : 'fallback'
    else if (skipped.has(question.id)) status = 'skipped'

    return {
      questionId: question.id,
      answerId: answer?.id ?? null,
      assessmentType: question.assessmentType,
      category: question.category,
      status,
    }
  })

  const baseline = sectionCoverage(records, 'baseline')
  const current = sectionCoverage(records, 'current')
  const context = sectionCoverage(records, 'context')
  const submittedOverall = records.filter(
    (record) => record.status === 'substantive' || record.status === 'fallback',
  ).length
  const substantiveOverall = records.filter(
    (record) => record.status === 'substantive',
  ).length
  const unmetRequirements: CoverageRequirement[] = []

  if (submittedOverall < COVERAGE_REQUIREMENTS.submittedOverall) {
    unmetRequirements.push('submitted-overall')
  }
  if (baseline.substantive < COVERAGE_REQUIREMENTS.substantiveBaseline) {
    unmetRequirements.push('substantive-baseline')
  }
  if (current.substantive < COVERAGE_REQUIREMENTS.substantiveCurrent) {
    unmetRequirements.push('substantive-current')
  }

  return {
    policyVersion: COVERAGE_POLICY_VERSION,
    ready: unmetRequirements.length === 0,
    submittedOverall,
    substantiveOverall,
    baseline,
    current,
    context,
    unmetRequirements,
    nextQuestionId: chooseNextQuestion(records, unmetRequirements),
    submittedAnswerIds: records.flatMap((record) =>
      record.answerId && (record.status === 'substantive' || record.status === 'fallback')
        ? [record.answerId]
        : [],
    ),
    substantiveAnswerIds: records.flatMap((record) =>
      record.answerId && record.status === 'substantive' ? [record.answerId] : [],
    ),
    fallbackAnswerIds: records.flatMap((record) =>
      record.answerId && record.status === 'fallback' ? [record.answerId] : [],
    ),
    skippedQuestionIds: records.flatMap((record) =>
      record.status === 'skipped' ? [record.questionId] : [],
    ),
    unansweredQuestionIds: records.flatMap((record) =>
      record.status === 'unanswered' ? [record.questionId] : [],
    ),
    records,
  }
}

function sectionCoverage(
  records: QuestionCoverageRecord[],
  section: AssessmentSection,
): SectionCoverage {
  const relevant = records.filter((record) => record.assessmentType === section)
  const categories = [...new Set(relevant.map((record) => record.category))]
  const coveredCategories = categories.filter((category) =>
    relevant.some(
      (record) => record.category === category && record.status === 'substantive',
    ),
  )

  return {
    total: relevant.length,
    submitted: relevant.filter(
      (record) => record.status === 'substantive' || record.status === 'fallback',
    ).length,
    substantive: relevant.filter((record) => record.status === 'substantive').length,
    fallback: relevant.filter((record) => record.status === 'fallback').length,
    skipped: relevant.filter((record) => record.status === 'skipped').length,
    unanswered: relevant.filter((record) => record.status === 'unanswered').length,
    categoriesTotal: categories.length,
    categoriesCovered: coveredCategories.length,
    coveredCategories,
    missingCategories: categories.filter((category) => !coveredCategories.includes(category)),
  }
}

function chooseNextQuestion(
  records: QuestionCoverageRecord[],
  unmet: CoverageRequirement[],
): string | null {
  if (unmet.length === 0) return null

  const targetSection = unmet.includes('substantive-baseline')
    ? 'baseline'
    : unmet.includes('substantive-current')
      ? 'current'
      : null
  const candidates = records.filter(
    (record) =>
      record.status !== 'substantive' &&
      (targetSection === null || record.assessmentType === targetSection),
  )
  const statusPriority: Record<QuestionResponseStatus, number> = {
    skipped: 0,
    unanswered: 1,
    fallback: 2,
    substantive: 3,
  }

  candidates.sort((left, right) => {
    const statusDifference = statusPriority[left.status] - statusPriority[right.status]
    if (statusDifference !== 0) return statusDifference
    const leftOrder = questions.find((question) => question.id === left.questionId)?.defaultOrder ?? 0
    const rightOrder = questions.find((question) => question.id === right.questionId)?.defaultOrder ?? 0
    return leftOrder - rightOrder
  })

  return candidates[0]?.questionId ?? null
}

export function coverageRequirementText(requirement: CoverageRequirement) {
  if (requirement === 'substantive-baseline') {
    return `Answer at least ${COVERAGE_REQUIREMENTS.substantiveBaseline} usual-nature questions with a choice other than Not sure.`
  }
  if (requirement === 'substantive-current') {
    return `Answer at least ${COVERAGE_REQUIREMENTS.substantiveCurrent} recent-balance questions with a choice other than Not sure.`
  }
  return `Submit answers to at least ${COVERAGE_REQUIREMENTS.submittedOverall} questions overall.`
}
