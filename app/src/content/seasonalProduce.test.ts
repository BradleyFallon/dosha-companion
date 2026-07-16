import { describe, expect, it } from 'vitest'
import { createDemoState } from '../prototype/state'
import { getSeasonalProduce } from './seasonalProduce'

describe('seasonal produce selection', () => {
  it('uses region, month, diet, and exclusions', () => {
    const profile = createDemoState().profile
    const july = getSeasonalProduce(profile, 7)
    expect(july.map((item) => item.name)).toContain('Cherries')
    expect(getSeasonalProduce({ ...profile, exclusions: 'cherries', hasFoodExclusions: true }, 7).map((item) => item.name)).not.toContain('Cherries')
    expect(getSeasonalProduce({ ...profile, location: { ...profile.location!, produceRegionId: null } }, 7)).toEqual([])
  })
})
