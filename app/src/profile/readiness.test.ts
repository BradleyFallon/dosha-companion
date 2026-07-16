import { describe, expect, it } from 'vitest'
import { getProfileReadiness } from './readiness'
import { defaultState } from '../prototype/state'

describe('profile readiness', () => {
  it('reports every unanswered required field', () => {
    expect(getProfileReadiness(defaultState.profile)).toMatchObject({ coreReady: false, nameReady: false, locationReady: false, localizedContentReady: false, foodReady: false })
  })

  it('makes the core profile ready without location after explicit food-safety answers', () => {
    const profile = { ...defaultState.profile, preferredName: 'Alex', birthYear: '1990', dietaryPattern: 'Omnivore', hasFoodAllergies: false, hasFoodExclusions: false }
    expect(getProfileReadiness(profile)).toMatchObject({ coreReady: true, foodReady: true, locationReady: false, localizedContentReady: false, missingCore: [], missingFood: [] })
  })

  it('requires details after an explicit Yes', () => {
    const readiness = getProfileReadiness({ ...defaultState.profile, hasFoodAllergies: true })
    expect(readiness.missingCore).toContain('allergyDetails')
    expect(readiness.missingFood).toContain('allergyDetails')
    expect(readiness.foodReady).toBe(false)
  })
})
