import { initialAssessment } from '../generated/initialAssessment'
import type { AssessmentCoverage, CoverageInput } from './coverage'
import { calculateAssessmentCoverage } from './coverage'

export const PROTOTYPE_SCORING_RULE_ID = 'prototype-unit-dominance-0.1'
export const PROTOTYPE_MIXED_RATIO = 0.75

export type Dosha = 'vata' | 'pitta' | 'kapha'
export type DoshaTotals = Record<Dosha, number>

export interface DoshaSectionResult {
  label: string
  doshas: Dosha[]
  totals: DoshaTotals
  scoredAnswerCount: number
}

export interface CalculatedDoshaResult {
  kind: 'calculated'
  scoringModelVersion: string
  baselineLabel: string
  currentLabel: string
  baseline: DoshaSectionResult
  current: DoshaSectionResult
  contributingAnswerIds: string[]
  ruleIds: string[]
  prototype: true
}

export interface UnavailableScoringResult {
  kind: 'unavailable'
  scoringModelVersion: null
  reason: string
}

export type ScoringResult = CalculatedDoshaResult | UnavailableScoringResult

export interface PrototypeDoshaScoringInput extends CoverageInput {
  currentAnswers?: Record<string, string>
}

export const DEVELOPMENT_DOSHA_FIXTURE = {
  fixtureId: 'vata-pitta-vata-current-v1',
  baselineLabel: 'Vata–Pitta',
  currentLabel: 'Vata is currently more prominent',
  notice: 'Development fixture — prototype labels for interface review',
} as const

export type DevelopmentFixture = typeof DEVELOPMENT_DOSHA_FIXTURE

export function getDevelopmentDoshaFixture(fixtureId: string | null) {
  return fixtureId === DEVELOPMENT_DOSHA_FIXTURE.fixtureId
    ? DEVELOPMENT_DOSHA_FIXTURE
    : null
}

export type AssessmentOutcome =
  | {
      kind: 'insufficient-coverage'
      coverage: AssessmentCoverage
      scoring: UnavailableScoringResult
    }
  | {
      kind: 'coverage-ready'
      coverage: AssessmentCoverage
      scoring: CalculatedDoshaResult
    }
  | {
      kind: 'development-fixture'
      coverage: AssessmentCoverage
      scoring: UnavailableScoringResult
      fixture: DevelopmentFixture
    }

export function resolveAssessmentOutcome(
  input: CoverageInput,
  options: { allowDevelopmentFixture?: boolean; fixtureRequested?: boolean } = {},
): AssessmentOutcome {
  const coverage = calculateAssessmentCoverage(input)

  if (options.allowDevelopmentFixture && options.fixtureRequested) {
    return {
      kind: 'development-fixture',
      coverage,
      scoring: unavailable('This development fixture is a controlled interface example.'),
      fixture: DEVELOPMENT_DOSHA_FIXTURE,
    }
  }

  if (!coverage.ready) {
    return {
      kind: 'insufficient-coverage',
      coverage,
      scoring: unavailable('More substantive assessment answers are needed for a prototype estimate.'),
    }
  }

  const scoring = calculatePrototypeDoshaResult(input)
  if (scoring.kind === 'unavailable') {
    return { kind: 'insufficient-coverage', coverage, scoring }
  }
  return { kind: 'coverage-ready', coverage, scoring }
}

export function calculatePrototypeDoshaResult(input: PrototypeDoshaScoringInput): ScoringResult {
  const coverage = calculateAssessmentCoverage(input)
  if (!coverage.ready) {
    return unavailable('More substantive assessment answers are needed for a prototype estimate.')
  }

  const baseline = scoreSection('baseline', input.submittedAnswers)
  const current = scoreSection('current', input.currentAnswers ?? input.submittedAnswers)
  if (!baseline.doshas.length) {
    return unavailable('The answered baseline questions did not produce a prototype dosha direction.')
  }

  const contributingAnswerIds = initialAssessment.questions.flatMap((question) => {
    if (question.assessmentType !== 'baseline' && question.assessmentType !== 'current') return []
    const source = question.assessmentType === 'current'
      ? input.currentAnswers ?? input.submittedAnswers
      : input.submittedAnswers
    const answer = question.answers.find((candidate) => candidate.id === source[question.id])
    if (!answer || answer.score.target === 'none') return []
    return [answer.id]
  })

  return {
    kind: 'calculated',
    scoringModelVersion: initialAssessment.scoringModelVersion,
    baselineLabel: baseline.label,
    currentLabel: current.scoredAnswerCount === 0
      ? 'Not enough recent information'
      : current.doshas.length
        ? `${current.label} ${current.doshas.length === 1 ? 'is' : 'are'} currently more prominent`
        : 'No recent dosha elevation detected',
    baseline,
    current,
    contributingAnswerIds,
    ruleIds: [PROTOTYPE_SCORING_RULE_ID],
    prototype: true,
  }
}

function scoreSection(section: 'baseline' | 'current', answers: Record<string, string>): DoshaSectionResult {
  const totals: DoshaTotals = { vata: 0, pitta: 0, kapha: 0 }
  let scoredAnswerCount = 0
  for (const question of initialAssessment.questions) {
    if (question.assessmentType !== section) continue
    const answer = question.answers.find((candidate) => candidate.id === answers[question.id])
    if (!answer || answer.score.target !== section) continue
    totals.vata += answer.score.weights.vata * answer.score.reliability
    totals.pitta += answer.score.weights.pitta * answer.score.reliability
    totals.kapha += answer.score.weights.kapha * answer.score.reliability
    scoredAnswerCount += 1
  }

  const order: Dosha[] = ['vata', 'pitta', 'kapha']
  const ranked = [...order].sort((left, right) => totals[right] - totals[left] || order.indexOf(left) - order.indexOf(right))
  const maximum = totals[ranked[0]]
  const doshas = maximum === 0
    ? []
    : ranked.filter((dosha) => totals[dosha] >= maximum * PROTOTYPE_MIXED_RATIO)

  return {
    label: doshas.map(doshaLabel).join('–'),
    doshas,
    totals,
    scoredAnswerCount,
  }
}

function doshaLabel(dosha: Dosha) {
  return dosha.charAt(0).toUpperCase() + dosha.slice(1)
}

function unavailable(reason: string): UnavailableScoringResult {
  return { kind: 'unavailable', scoringModelVersion: null, reason }
}
