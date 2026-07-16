import { describe, expect, it } from 'vitest'
import { createTestState, defaultState } from './state'
import { nextResumePath } from './resume'

const coreProfile = {
  ...defaultState.profile,
  preferredName: 'Alex',
  birthYear: '1990',
  dietaryPattern: 'Omnivore',
  hasFoodAllergies: false,
  hasFoodExclusions: false,
}

describe('resume routing', () => {
  it('resumes a core-ready profile without location at the assessment', () => {
    expect(nextResumePath(createTestState({ profile: coreProfile, profileCompleted: true }))).toBe('/assessment')
  })

  it('resumes completed results without location in the app', () => {
    const state = createTestState({ profile: coreProfile, profileCompleted: true, assessmentStarted: true, resultsReached: true, todayVisited: true })
    expect(nextResumePath(state)).toBe('/today')
  })

  it('still routes incomplete food safety to the food step', () => {
    expect(nextResumePath(createTestState({ profile: { ...coreProfile, hasFoodAllergies: null } }))).toBe('/profile/food')
  })
})
