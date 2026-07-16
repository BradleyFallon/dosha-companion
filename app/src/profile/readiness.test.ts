import { describe, expect, it } from 'vitest'
import { getProfileReadiness } from './readiness'
import { defaultState } from '../prototype/state'

describe('profile readiness', () => {
  it('reports every unanswered required field', () => {
    expect(getProfileReadiness(defaultState.profile)).toMatchObject({ ready: false, nameReady: false, locationReady: false, foodReady: false })
  })

  it('distinguishes explicit No from unanswered food safety', () => {
    const profile = { ...defaultState.profile, preferredName: 'Alex', birthYear: '1990', dietaryPattern: 'Omnivore', hasFoodAllergies: false, hasFoodExclusions: false, location: { source: 'map' as const, latitude: 45.5, longitude: -122.7, accuracyMeters: 10_000, areaId: 'grid-v1:45.5:-122.7', precisionKm: 10, timeZone: 'America/Los_Angeles', units: 'us' as const, displayLabel: 'Portland area' } }
    expect(getProfileReadiness(profile)).toMatchObject({ ready: true, foodReady: true })
  })

  it('requires details after an explicit Yes', () => {
    const readiness = getProfileReadiness({ ...defaultState.profile, hasFoodAllergies: true })
    expect(readiness.missing).toContain('allergyDetails')
  })
})
