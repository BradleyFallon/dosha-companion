import { birthYearError } from './birthYear'
import type { ProfileState } from '../prototype/state'

export type ProfileRequirement =
  | 'preferredName'
  | 'birthYear'
  | 'dietaryPattern'
  | 'allergyStatus'
  | 'allergyDetails'
  | 'exclusionStatus'
  | 'exclusionDetails'

export interface ProfileReadiness {
  coreReady: boolean
  foodReady: boolean
  nameReady: boolean
  locationReady: boolean
  localizedContentReady: boolean
  missingCore: ProfileRequirement[]
  missingFood: ProfileRequirement[]
}

export function getProfileReadiness(profile: ProfileState): ProfileReadiness {
  const missingName: ProfileRequirement[] = []
  const missingFood: ProfileRequirement[] = []
  if (!profile.preferredName.trim()) missingName.push('preferredName')
  if (!profile.birthYear || birthYearError(profile.birthYear)) missingName.push('birthYear')
  if (!profile.dietaryPattern) missingFood.push('dietaryPattern')
  if (profile.hasFoodAllergies === null) missingFood.push('allergyStatus')
  if (profile.hasFoodAllergies === true && !profile.allergies.trim()) missingFood.push('allergyDetails')
  if (profile.hasFoodExclusions === null) missingFood.push('exclusionStatus')
  if (profile.hasFoodExclusions === true && !profile.exclusions.trim()) missingFood.push('exclusionDetails')
  const missingCore = [...missingName, ...missingFood]
  const locationReady = profile.location !== null

  return {
    coreReady: missingCore.length === 0,
    foodReady: missingFood.length === 0,
    nameReady: missingName.length === 0,
    locationReady,
    localizedContentReady: locationReady,
    missingCore,
    missingFood,
  }
}
