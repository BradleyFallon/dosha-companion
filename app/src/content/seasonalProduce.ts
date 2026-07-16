import { seasonalProduceCatalog } from '../generated/contentCatalog'
import type { ProfileState } from '../prototype/state'

export function getSeasonalProduce(profile: ProfileState, month = new Date().getMonth() + 1) {
  const regionId = profile.location?.produceRegionId
  if (!regionId) return []
  const diet = profile.dietaryPattern.toLowerCase() || 'unspecified'
  const exclusions = `${profile.allergies} ${profile.exclusions}`.toLowerCase()
  return seasonalProduceCatalog.filter((item) =>
    item.produceRegionIds.includes(regionId) &&
    item.months.includes(month) &&
    (item.diets.includes('all') || item.diets.includes(diet)) &&
    !exclusions.includes(item.name.toLowerCase()),
  )
}
