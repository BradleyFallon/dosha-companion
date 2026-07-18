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
  it('routes a core-ready profile without location to the onboarding location step', () => {
    expect(nextResumePath(createTestState({ profile: coreProfile, profileCompleted: true }))).toBe('/profile/location')
  })

  it('routes completed legacy results without location through location setup', () => {
    const state = createTestState({ profile: coreProfile, profileCompleted: true, assessmentStarted: true, resultsReached: true, todayVisited: true })
    expect(nextResumePath(state)).toBe('/profile/location')
  })

  it('still routes incomplete food safety to the food step', () => {
    expect(nextResumePath(createTestState({
      profile: {
        ...coreProfile,
        location: {
          source: 'city',
          latitude: 45.5,
          longitude: -122.7,
          areaId: 'grid-v1:45.5:-122.7',
          precisionKm: 10,
          displayName: 'Portland, Oregon, United States',
          countryCode: 'US',
          admin1Code: 'OR',
          timeZone: 'America/Los_Angeles',
          produceRegionId: 'us-pacific-northwest',
        },
        hasFoodAllergies: null,
      },
    }))).toBe('/profile/food')
  })
})
