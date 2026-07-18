import { describe, expect, it } from 'vitest'
import { getProfileReadiness } from './readiness'
import { defaultState } from '../prototype/state'

describe('profile readiness', () => {
  it('reports every unanswered required field', () => {
    expect(getProfileReadiness(defaultState.profile)).toMatchObject({ coreReady: false, onboardingReady: false, nameReady: false, locationReady: false, localizedContentReady: false, foodReady: false })
  })

  it('keeps onboarding incomplete without location after explicit food-safety answers', () => {
    const profile = { ...defaultState.profile, preferredName: 'Alex', birthYear: '1990', dietaryPattern: 'Omnivore', hasFoodAllergies: false, hasFoodExclusions: false }
    expect(getProfileReadiness(profile)).toMatchObject({ coreReady: true, onboardingReady: false, foodReady: true, locationReady: false, localizedContentReady: false, missingCore: [], missingFood: [] })
  })

  it('makes onboarding ready when identity, location, and food safety are complete', () => {
    const profile = {
      ...defaultState.profile,
      preferredName: 'Alex',
      birthYear: '1990',
      dietaryPattern: 'Omnivore',
      hasFoodAllergies: false,
      hasFoodExclusions: false,
      location: {
        source: 'city' as const,
        latitude: 45.5,
        longitude: -122.7,
        areaId: 'grid-v1:45.5:-122.7',
        precisionKm: 10 as const,
        displayName: 'Portland, Oregon, United States',
        countryCode: 'US',
        admin1Code: 'OR',
        timeZone: 'America/Los_Angeles',
        produceRegionId: 'us-pacific-northwest',
      },
    }
    expect(getProfileReadiness(profile)).toMatchObject({ coreReady: true, onboardingReady: true, locationReady: true, localizedContentReady: true })
  })

  it('requires details after an explicit Yes', () => {
    const readiness = getProfileReadiness({ ...defaultState.profile, hasFoodAllergies: true })
    expect(readiness.missingCore).toContain('allergyDetails')
    expect(readiness.missingFood).toContain('allergyDetails')
    expect(readiness.foodReady).toBe(false)
  })
})
