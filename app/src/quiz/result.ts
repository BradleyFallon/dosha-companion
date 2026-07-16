import type { AssessmentCoverage, CoverageInput } from './coverage'
import { calculateAssessmentCoverage } from './coverage'

export const SCORING_UNAVAILABLE_REASON =
  'Numerical answer weights and result thresholds have not been approved by the Ayurvedic expert.'

export interface CalculatedDoshaResult {
  kind: 'calculated'
  scoringModelVersion: string
  baselineLabel: string
  currentLabel: string
  contributingAnswerIds: string[]
  ruleIds: string[]
}

export interface UnavailableScoringResult {
  kind: 'unavailable'
  scoringModelVersion: null
  reason: typeof SCORING_UNAVAILABLE_REASON
}

export type ScoringResult = CalculatedDoshaResult | UnavailableScoringResult

export interface DevelopmentFixture {
  fixtureId: 'vata-pitta-vata-current-v1'
  baselineLabel: 'Vata–Pitta'
  currentLabel: 'Vata is currently more prominent'
  notice: 'Development fixture — not calculated from your answers'
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
      scoring: UnavailableScoringResult
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
  const scoring: UnavailableScoringResult = {
    kind: 'unavailable',
    scoringModelVersion: null,
    reason: SCORING_UNAVAILABLE_REASON,
  }

  if (options.allowDevelopmentFixture && options.fixtureRequested) {
    return {
      kind: 'development-fixture',
      coverage,
      scoring,
      fixture: {
        fixtureId: 'vata-pitta-vata-current-v1',
        baselineLabel: 'Vata–Pitta',
        currentLabel: 'Vata is currently more prominent',
        notice: 'Development fixture — not calculated from your answers',
      },
    }
  }

  return coverage.ready
    ? { kind: 'coverage-ready', coverage, scoring }
    : { kind: 'insufficient-coverage', coverage, scoring }
}
