import type { BalanceIconKey } from '../generated/initialAssessment'
import { initialAssessment } from '../generated/initialAssessment'
import type { PrototypeState } from '../prototype/state'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import { balanceDomains, type BalanceDomain } from './domains'

export type BalanceComparisonState =
  | 'close-to-usual'
  | 'changed-from-usual'
  | 'recent-only'
  | 'usual-only'
  | 'uncertain'
  | 'missing'

export interface PatternCoverageSummary {
  represented: number
  total: number
}

export interface DomainAnswerDisplay {
  answerId: string
  fullText: string
  shortLabel: string
  patternKey: string | null
  iconKey: BalanceIconKey | null
  kind: string
}

export interface BalanceDomainViewModel {
  id: BalanceDomain
  label: string
  iconKey: BalanceIconKey
  usual: DomainAnswerDisplay | null
  recent: DomainAnswerDisplay | null
  comparison: BalanceComparisonState
}

export interface CheckInTimelineItem {
  id: string
  completedAt: string
  href: string
}

export interface BalanceViewModel {
  usual: PatternCoverageSummary
  recent: PatternCoverageSummary
  domains: BalanceDomainViewModel[]
  timeline: CheckInTimelineItem[]
  latestCheckInId: string | null
}

export function buildBalanceViewModel(state: PrototypeState): BalanceViewModel {
  const coverage = calculateAssessmentCoverage({
    submittedAnswers: state.submittedAnswers,
    skippedQuestionIds: state.skippedQuestionIds,
  })
  const completed = state.checkIns
    .filter((checkIn): checkIn is typeof checkIn & { completedAt: string } => Boolean(checkIn.completedAt))
    .sort((left, right) => new Date(right.completedAt).getTime() - new Date(left.completedAt).getTime())
  const latest = completed[0] ?? null
  const recentAnswers = latest?.answers ?? state.submittedAnswers
  const currentQuestions = initialAssessment.questions.filter((question) => question.assessmentType === 'current')
  const recentRepresented = currentQuestions.filter((question) => {
    const answer = question.answers.find((candidate) => candidate.id === recentAnswers[question.id])
    return answer?.kind === 'ordinary'
  }).length

  const domains = balanceDomains.map((definition): BalanceDomainViewModel => {
    const usualQuestion = initialAssessment.questions.find((question) =>
      question.assessmentType === 'baseline' && question.category === definition.baselineCategory)
    const recentQuestion = currentQuestions.find((question) => question.category === definition.currentCategory)
    const usual = answerDisplay(usualQuestion, usualQuestion ? state.submittedAnswers[usualQuestion.id] : undefined)
    const recent = answerDisplay(recentQuestion, recentQuestion ? recentAnswers[recentQuestion.id] : undefined)
    const recentSkipped = !latest && recentQuestion ? state.skippedQuestionIds.includes(recentQuestion.id) : false
    const comparison = recentSkipped ? 'uncertain' : compareDomainAnswers(usual, recent)
    return {
      id: definition.id,
      label: definition.label,
      iconKey: recent?.iconKey ?? usual?.iconKey ?? definition.defaultIconKey,
      usual,
      recent,
      comparison,
    }
  })

  return {
    usual: {
      represented: coverage.baseline.categoriesCovered,
      total: coverage.baseline.categoriesTotal,
    },
    recent: {
      represented: recentRepresented,
      total: coverage.current.categoriesTotal,
    },
    domains,
    timeline: completed.slice(0, 5).reverse().map((checkIn) => ({
      id: checkIn.id,
      completedAt: checkIn.completedAt,
      href: `/questions/check-in/${checkIn.id}`,
    })),
    latestCheckInId: latest?.id ?? null,
  }
}

export function compareDomainAnswers(
  usual: DomainAnswerDisplay | null,
  recent: DomainAnswerDisplay | null,
): BalanceComparisonState {
  if ((usual && usual.kind !== 'ordinary') || (recent && recent.kind !== 'ordinary')) return 'uncertain'
  if (!usual && !recent) return 'missing'
  if (usual && !recent) return 'usual-only'
  if (!usual && recent) return 'recent-only'
  if (!usual?.patternKey || !recent?.patternKey) return 'uncertain'
  if (recent.patternKey.endsWith('_usual') || usual.patternKey === recent.patternKey) return 'close-to-usual'
  return 'changed-from-usual'
}

export function comparisonLabel(comparison: BalanceComparisonState) {
  if (comparison === 'close-to-usual') return 'Close to usual'
  if (comparison === 'changed-from-usual') return 'Changed recently'
  if (comparison === 'recent-only') return 'Recent information only'
  if (comparison === 'usual-only') return 'Usual information only'
  return 'Not enough information'
}

export function comparisonAccessibleLabel(comparison: BalanceComparisonState) {
  if (comparison === 'uncertain') return 'uncertain information'
  if (comparison === 'missing') return 'no information available'
  return comparisonLabel(comparison).toLowerCase()
}

function answerDisplay(
  question: (typeof initialAssessment.questions)[number] | undefined,
  answerId: string | undefined,
): DomainAnswerDisplay | null {
  const answer = question?.answers.find((candidate) => candidate.id === answerId)
  if (!answer) return null
  return {
    answerId: answer.id,
    fullText: answer.text,
    shortLabel: answer.shortLabel ?? answer.text,
    patternKey: answer.patternKey,
    iconKey: answer.iconKey,
    kind: answer.kind,
  }
}
