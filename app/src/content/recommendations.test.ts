import { describe, expect, it } from 'vitest'
import { initialAssessment } from '../generated/initialAssessment'
import { defaultState } from '../prototype/state'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import { selectDailyRecommendation } from './recommendations'

const allOrdinary = Object.fromEntries(initialAssessment.questions.map((question) => [
  question.id,
  question.answers.find((answer) => answer.kind === 'ordinary')?.id ?? '',
]))
const readyCoverage = calculateAssessmentCoverage({ submittedAnswers: allOrdinary, skippedQuestionIds: [] })

describe('daily recommendation selection', () => {
  it('uses safety context before travel, coverage, or time rules', () => {
    const recommendation = selectDailyRecommendation({
      coverage: readyCoverage,
      profile: profile(),
      submittedAnswers: {
        ...allOrdinary,
        q_context_major_change_001: 'a_context_major_change_001_recent_illness_injury_medication',
      },
      now: new Date('2026-07-16T08:00:00Z'),
    })
    expect(recommendation.id).toBe('major-physical-change')
    expect(recommendation.why.at(-1)).toBe('No dosha score was calculated or used.')
  })

  it('selects travel and life-event rules deterministically', () => {
    const travel = selectDailyRecommendation({
      coverage: readyCoverage,
      profile: profile(),
      submittedAnswers: { ...allOrdinary, q_context_major_change_001: 'a_context_major_change_001_recent_travel_major_schedule' },
    })
    const lifeEvent = selectDailyRecommendation({
      coverage: readyCoverage,
      profile: profile(),
      submittedAnswers: { ...allOrdinary, q_context_major_change_001: 'a_context_major_change_001_significant_stress_major_life' },
    })
    expect(travel.id).toBe('travel-anchor')
    expect(lifeEvent.id).toBe('manageable-priority')
  })

  it('prioritizes missing current coverage before local time', () => {
    const coverage = calculateAssessmentCoverage({ submittedAnswers: {}, skippedQuestionIds: [] })
    const recommendation = selectDailyRecommendation({
      coverage,
      profile: profile(),
      submittedAnswers: {},
      now: new Date('2026-07-16T08:00:00Z'),
    })
    expect(recommendation.id).toBe('refresh-current-check-in')
    expect(recommendation.actionHref).toContain('return=results')
  })

  it('uses saved time zone for morning and evening rules', () => {
    const morning = selectDailyRecommendation({
      coverage: readyCoverage,
      profile: profile('UTC'),
      submittedAnswers: allOrdinary,
      now: new Date('2026-07-16T08:00:00Z'),
    })
    const evening = selectDailyRecommendation({
      coverage: readyCoverage,
      profile: profile('UTC'),
      submittedAnswers: allOrdinary,
      now: new Date('2026-07-16T20:00:00Z'),
    })
    expect(morning.id).toBe('morning-pause')
    expect(evening.id).toBe('evening-transition')
  })

  it('falls back safely when a saved time zone is invalid', () => {
    expect(() => selectDailyRecommendation({
      coverage: readyCoverage,
      profile: profile('Not/A_Real_Time_Zone'),
      submittedAnswers: allOrdinary,
      now: new Date('2026-07-16T14:00:00Z'),
    })).not.toThrow()
  })

  it('withholds food guidance for any allergy or exclusion', () => {
    const recommendation = selectDailyRecommendation({
      coverage: readyCoverage,
      profile: { ...profile(), dietaryPattern: 'Vegan', allergies: 'Tree nuts' },
      submittedAnswers: allOrdinary,
    })
    expect(recommendation.food.status).toBe('withheld')
    expect(recommendation.food.reason).toContain('Safety filtering')
  })

  it('uses a dietary variant and keeps fixtures out of selection', () => {
    const recommendation = selectDailyRecommendation({
      coverage: readyCoverage,
      profile: { ...profile('UTC'), dietaryPattern: 'Vegetarian' },
      submittedAnswers: allOrdinary,
      now: new Date('2026-07-16T08:00:00Z'),
      fixtureActive: true,
    })
    expect(recommendation.food.title).toContain('plant-based')
    expect(recommendation.id).toBe('morning-pause')
    expect(recommendation.why).toContain('A development fixture is visible, but it was not used to choose this guidance.')
  })
})

function profile(timeZone = 'America/Los_Angeles') {
  return {
    ...defaultState.profile,
    preferredName: 'Alex',
    location: {
      source: 'skipped' as const,
      latitude: null,
      longitude: null,
      accuracyMeters: null,
      timeZone,
      units: 'us' as const,
      displayLabel: null,
    },
  }
}
