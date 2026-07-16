import { describe, expect, it } from 'vitest'
import { locationEntryPath, locationReturnPath } from './returnTargets'

describe('location return targets', () => {
  it('builds semantic return links for known internal destinations', () => {
    expect(locationEntryPath('/today')).toBe('/profile/location?return=today')
    expect(locationEntryPath('/settings')).toBe('/profile/location?return=settings')
  })

  it('rejects unknown and path-shaped query values', () => {
    expect(locationReturnPath('?return=https://example.com', '/profile/food')).toBe('/profile/food')
    expect(locationReturnPath('?return=/today', '/profile/food')).toBe('/profile/food')
    expect(locationReturnPath('?return=learn', '/profile/food')).toBe('/learn')
  })
})
