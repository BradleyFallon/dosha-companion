import type { ProfileState } from '../prototype/state'
import type { AssessmentCoverage } from '../quiz/coverage'

export const PROVISIONAL_CONTENT_LABEL = 'Provisional · not expert-approved'

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

export interface DailyRecommendation {
  id:
    | 'major-physical-change'
    | 'travel-anchor'
    | 'manageable-priority'
    | 'refresh-current-check-in'
    | 'morning-pause'
    | 'evening-transition'
    | 'general-anchor'
  label: typeof PROVISIONAL_CONTENT_LABEL
  headline: string
  guidance: string
  action: string
  actionHref: string | null
  why: string[]
  food: FoodRecommendation
}

export interface RecommendationInput {
  coverage: AssessmentCoverage
  profile: ProfileState
  submittedAnswers: Record<string, string>
  now?: Date
  fixtureActive?: boolean
}

export function selectDailyRecommendation({
  coverage,
  profile,
  submittedAnswers,
  now = new Date(),
  fixtureActive = false,
}: RecommendationInput): DailyRecommendation {
  const contextAnswer = submittedAnswers.q_context_major_change_001
  const time = localHour(now, profile.location?.timeZone)
  const why: string[] = []
  let content: Pick<DailyRecommendation, 'id' | 'headline' | 'guidance' | 'action' | 'actionHref'>

  if (contextAnswer === CONTEXT_ANSWERS.physicalChange) {
    content = {
      id: 'major-physical-change',
      headline: 'Keep today’s guidance general',
      guidance: 'You noted a major physical change. This limited MVP will avoid stronger personalization and stay with familiar, low-stakes routines.',
      action: 'Keep to a familiar routine and consult a qualified professional before changing medical care.',
      actionHref: null,
    }
    why.push('You selected the major physical-change context option, which activates a safety boundary.')
  } else if (contextAnswer === CONTEXT_ANSWERS.travel) {
    content = {
      id: 'travel-anchor',
      headline: 'Choose one reliable anchor',
      guidance: 'Travel or a major schedule change can make the day harder to orient around. One familiar point is enough for this provisional suggestion.',
      action: 'Choose one consistent meal, rest, or wake-time cue for today.',
      actionHref: null,
    }
    why.push('You reported recent travel or a major schedule change.')
  } else if (contextAnswer === CONTEXT_ANSWERS.lifeEvent) {
    content = {
      id: 'manageable-priority',
      headline: 'Choose one manageable priority',
      guidance: 'A major life event can make a long list feel less useful. This provisional guidance keeps the focus intentionally small.',
      action: 'Pick one necessary task and one short pause; let the rest remain optional today.',
      actionHref: null,
    }
    why.push('You reported significant stress or a major life event.')
  } else if (coverage.current.substantive < 4) {
    content = {
      id: 'refresh-current-check-in',
      headline: 'Refresh your recent check-in',
      guidance: 'There is not enough substantive recent information to personalize the current-balance area, so the most useful next step is another check-in.',
      action: 'Answer the next useful recent-balance question.',
      actionHref: coverage.nextQuestionId
        ? `/assessment/question/${coverage.nextQuestionId}?return=results`
        : '/questions',
    }
    why.push(`Your current check-in has ${coverage.current.substantive} substantive answers; the provisional coverage policy requires 4.`)
  } else if (time.hour >= 5 && time.hour < 12) {
    content = {
      id: 'morning-pause',
      headline: 'Begin with a deliberate pause',
      guidance: 'This small, general wellness prompt is selected for the morning in your saved time zone.',
      action: 'Before the next task, pause for two unhurried minutes and decide what matters first.',
      actionHref: null,
    }
    why.push(`It is morning in ${time.label}.`)
  } else if (time.hour >= 18 && time.hour < 24) {
    content = {
      id: 'evening-transition',
      headline: 'Create a quieter transition',
      guidance: 'This small, general wellness prompt is selected for the evening in your saved time zone.',
      action: 'Choose one clear stopping point for work or errands before the day ends.',
      actionHref: null,
    }
    why.push(`It is evening in ${time.label}.`)
  } else {
    content = {
      id: 'general-anchor',
      headline: 'Choose one steady point today',
      guidance: 'No approved dosha scoring is available, so this provisional suggestion remains general and practical.',
      action: 'Pick one familiar time for your next meal, pause, or transition.',
      actionHref: null,
    }
    why.push('No higher-priority context or time rule matched, so the general fallback was selected.')
  }

  if (fixtureActive) {
    why.push('A development fixture is visible, but it was not used to choose this guidance.')
  }
  why.push('No dosha score was calculated or used.')

  return {
    ...content,
    label: PROVISIONAL_CONTENT_LABEL,
    why,
    food: selectFoodRecommendation(profile),
  }
}

function selectFoodRecommendation(profile: ProfileState): FoodRecommendation {
  if (profile.allergies.trim() || profile.exclusions.trim()) {
    return {
      status: 'withheld',
      title: 'Food suggestion withheld',
      body: 'You listed allergies or exclusions, and this limited MVP does not have reviewed ingredient-level filtering.',
      reason: 'Safety filtering took precedence over dietary personalization.',
    }
  }

  const pattern = profile.dietaryPattern.toLowerCase()
  const title = pattern === 'vegan' || pattern === 'vegetarian'
    ? 'Choose a familiar plant-based meal you already tolerate'
    : pattern === 'pescatarian'
      ? 'Choose a familiar pescatarian meal you already tolerate'
      : 'Choose a familiar meal you already tolerate'

  return {
    status: 'shown',
    title,
    body: 'No recipe or ingredient claim is being made. This provisional prompt reflects only your stated dietary pattern.',
    reason: profile.dietaryPattern
      ? `Your dietary pattern is ${profile.dietaryPattern}.`
      : 'No dietary pattern or food exclusions were supplied.',
  }
}

function localHour(now: Date, requestedTimeZone?: string) {
  const fallback = Intl.DateTimeFormat().resolvedOptions().timeZone || 'your browser time zone'
  const timeZone = requestedTimeZone || fallback

  try {
    const hourPart = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      hourCycle: 'h23',
      timeZone,
    }).formatToParts(now).find((part) => part.type === 'hour')?.value
    return { hour: Number(hourPart ?? now.getHours()), label: timeZone }
  } catch {
    return { hour: now.getHours(), label: fallback }
  }
}
