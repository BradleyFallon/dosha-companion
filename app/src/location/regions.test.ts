import { describe, expect, it } from 'vitest'
import { normalizeCity } from './regions'
import { seasonFor } from './conditions'

describe('regional location adapters', () => {
  it('normalizes a city to the same 10 km regional shape', () => {
    expect(normalizeCity({ id: 1, name: 'Portland', latitude: 45.523, longitude: -122.676, countryCode: 'US', country: 'United States', admin1: 'Oregon', admin1Code: 'OR', timeZone: 'America/Los_Angeles' })).toMatchObject({ source: 'city', areaId: 'grid-v1:45.5:-122.7', latitude: 45.5, longitude: -122.7, precisionKm: 10, countryCode: 'US', produceRegionId: 'us-pacific-northwest' })
  })

  it('derives broad seasons by hemisphere', () => {
    expect(seasonFor(new Date('2026-07-16T00:00:00Z'), 45)).toBe('Summer')
    expect(seasonFor(new Date('2026-07-16T00:00:00Z'), -33)).toBe('Winter')
  })
})
