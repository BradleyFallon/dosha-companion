import { birthYearError } from './birthYear'
import type { ProfileState } from '../prototype/state'

export type ProfileRequirement =
  | 'preferredName'
  | 'birthYear'
  | 'location'
  | 'dietaryPattern'
  | 'allergyStatus'
  | 'allergyDetails'
  | 'exclusionStatus'
  | 'exclusionDetails'

export function getProfileReadiness(profile: ProfileState) {
  const missing: ProfileRequirement[] = []
  if (!profile.preferredName.trim()) missing.push('preferredName')
  if (!profile.birthYear || birthYearError(profile.birthYear)) missing.push('birthYear')
  if (!profile.location) missing.push('location')
  if (!profile.dietaryPattern) missing.push('dietaryPattern')
  if (profile.hasFoodAllergies === null) missing.push('allergyStatus')
  if (profile.hasFoodAllergies === true && !profile.allergies.trim()) missing.push('allergyDetails')
  if (profile.hasFoodExclusions === null) missing.push('exclusionStatus')
  if (profile.hasFoodExclusions === true && !profile.exclusions.trim()) missing.push('exclusionDetails')

  return {
    ready: missing.length === 0,
    missing,
    nameReady: !missing.some((item) => item === 'preferredName' || item === 'birthYear'),
    locationReady: !missing.includes('location'),
    foodReady: !missing.some((item) => item === 'dietaryPattern' || item.startsWith('allergy') || item.startsWith('exclusion')),
  }
}
