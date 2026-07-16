import { initialAssessment } from '../generated/initialAssessment'

export type AssessmentMode = 'full' | 'short'
export type AssessmentQuestion = (typeof initialAssessment.questions)[number]

export function shortModeAllowed() {
  return import.meta.env.DEV || import.meta.env.MODE === 'test'
}

export function getAssessmentQuestions(
  mode: AssessmentMode,
  allowShort = shortModeAllowed(),
): readonly AssessmentQuestion[] {
  if (mode !== 'short' || !allowShort) return initialAssessment.questions

  const baseline = initialAssessment.questions
    .filter((question) => question.assessmentType === 'baseline')
    .slice(0, 3)
  const current = initialAssessment.questions
    .filter((question) => question.assessmentType === 'current')
    .slice(0, 2)

  return [...baseline, ...current]
}

export function firstQuestionId(mode: AssessmentMode) {
  return getAssessmentQuestions(mode)[0]?.id
}

export function sectionLabel(type: AssessmentQuestion['assessmentType']) {
  if (type === 'baseline') return 'Your usual nature'
  if (type === 'current') return 'Your current balance'
  return 'Your current context'
}
