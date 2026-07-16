import type { ProfileState, RecommendationHistoryRecord } from '../prototype/state'
import type { AssessmentCoverage } from '../quiz/coverage'
import type { RecommendationContent } from '../generated/contentCatalog'
import { getRecommendations } from './repository'

const CONTEXT_ANSWERS = {
  physicalChange: 'a_context_major_change_001_recent_illness_injury_medication',
  travel: 'a_context_major_change_001_recent_travel_major_schedule',
  lifeEvent: 'a_context_major_change_001_significant_stress_major_life',
} as const

export interface FoodRecommendation {
  status: 'shown' | 'withheld'
  title: string
  body: string
  reason: string
}

export interface DailyRecommendation extends RecommendationContent {
  selectionDate: string
  why: string[]
  food: FoodRecommendation
}

export interface RecommendationInput {
  coverage: AssessmentCoverage
  profile: ProfileState
  submittedAnswers: Record<string, string>
  recommendationHistory?: RecommendationHistoryRecord[]
  activeRecommendationId?: string | null
  now?: Date
}

export function selectDailyRecommendation(input: RecommendationInput): DailyRecommendation {
  const {
    coverage,
    profile,
    submittedAnswers,
    recommendationHistory = [],
    activeRecommendationId = null,
    now = new Date(),
  } = input
  const local = localTime(now, profile.location?.timeZone)
  const selectionDate = local.date
  const { context, explanation } = recommendationContext(submittedAnswers, coverage, local.hour)
  const all = getRecommendations()
  const primaryCatalog = all.filter((item) => item.category !== 'food')
  const candidates = eligibleForContext(primaryCatalog, context, local.hour)
  const active = activeRecommendationId
    ? candidates.find((item) => item.id === activeRecommendationId && recommendationHistory.some(
      (record) => record.recommendationId === item.id && record.date === selectionDate,
    ))
    : undefined

  const recentIds = new Set(recommendationHistory.slice(-12).map((record) => record.recommendationId))
  const fresh = candidates.filter((item) => !recentIds.has(item.id))
  const pool = fresh.length > 0 ? fresh : candidates
  const selected = active ?? pool[stableIndex(`${selectionDate}:${context}`, pool.length)] ?? primaryCatalog[0]
  if (!selected) throw new Error('No published recommendation content is available.')

  const why = [selected.rationale, explanation]
  if (!active && fresh.length === 0 && candidates.length > 1) {
    why.push('All eligible alternatives appeared recently, so the daily rotation reused the stable catalog order.')
  } else if (!active && recentIds.size > 0) {
    why.push('Recently shown items were deprioritized when an eligible alternative was available.')
  }
  why.push('No dosha score was calculated or used.')

  return {
    ...selected,
    selectionDate,
    why,
    food: selectFoodRecommendation(profile, all),
  }
}

function eligibleForContext(catalog: RecommendationContent[], context: string, hour: number) {
  const exact = catalog.filter((item) => item.contexts.includes(context))
  if (exact.length > 0) return exact
  const time = hour >= 5 && hour < 12 ? 'morning' : hour >= 18 ? 'evening' : 'day'
  const timed = catalog.filter((item) => item.contexts.includes('general') && item.times.includes(time))
  const anytime = catalog.filter((item) => item.contexts.includes('general') && item.times.includes('any'))
  return [...timed, ...anytime]
}

function recommendationContext(submittedAnswers: Record<string, string>, coverage: AssessmentCoverage, hour: number) {
  const answer = submittedAnswers.q_context_major_change_001
  if (answer === CONTEXT_ANSWERS.physicalChange) return { context: 'physical-change', explanation: 'The major physical-change answer activates the strongest content safety boundary.' }
  if (answer === CONTEXT_ANSWERS.travel) return { context: 'travel', explanation: 'The recent travel or schedule-change answer takes priority over time-of-day prompts.' }
  if (answer === CONTEXT_ANSWERS.lifeEvent) return { context: 'life-event', explanation: 'The significant-life-event answer takes priority over time-of-day prompts.' }
  if (coverage.current.substantive < 4) return { context: 'insufficient-current', explanation: `The initial assessment has ${coverage.current.substantive} substantive current answers; the coverage policy asks for 4.` }
  return { context: 'general', explanation: hour >= 5 && hour < 12 ? 'It is morning in the selected time zone.' : hour >= 18 ? 'It is evening in the selected time zone.' : 'No higher-priority context matched, so the general daytime catalog was used.' }
}

function selectFoodRecommendation(profile: ProfileState, catalog: RecommendationContent[]): FoodRecommendation {
  if (profile.allergies.trim() || profile.exclusions.trim()) {
    return {
      status: 'withheld',
      title: 'Food suggestion withheld',
      body: 'You listed allergies or exclusions, and ingredient-level filtering is not available.',
      reason: 'Your allergy or exclusion fields activated the food-content safety filter.',
    }
  }
  const food = catalog.find((item) => item.category === 'food')
  const pattern = profile.dietaryPattern || 'unspecified'
  return {
    status: 'shown',
    title: food?.title ?? 'Choose a familiar meal you already tolerate',
    body: `${food?.guidance ?? 'Choose familiar food you already tolerate.'} Stated dietary pattern: ${pattern}.`,
    reason: food?.rationale ?? 'No allergy or exclusion was supplied.',
  }
}

function stableIndex(seed: string, length: number) {
  if (length <= 1) return 0
  let hash = 0
  for (const character of seed) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0
  return Math.abs(hash) % length
}

function localTime(now: Date, requestedTimeZone?: string) {
  const fallback = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  const timeZone = requestedTimeZone || fallback
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23', timeZone,
    }).formatToParts(now)
    const value = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
    return { hour: Number(value('hour')), date: `${value('year')}-${value('month')}-${value('day')}` }
  } catch {
    return { hour: now.getHours(), date: now.toISOString().slice(0, 10) }
  }
}
