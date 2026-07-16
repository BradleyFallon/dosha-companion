import { afterEach, describe, expect, it, vi } from 'vitest'
import type { RegionalLocation } from '../prototype/state'
import { loadLocalConditions } from './conditions'
import { inferredTemperatureUnit, resolveTemperatureUnit } from './units'

const location: RegionalLocation = {
  source: 'city',
  areaId: 'grid-v1:45.5:-122.7',
  latitude: 45.5,
  longitude: -122.7,
  precisionKm: 10,
  displayName: 'Portland, Oregon, United States',
  countryCode: 'US',
  admin1Code: 'OR',
  timeZone: 'America/Los_Angeles',
  produceRegionId: 'us-pacific-northwest',
}

afterEach(() => vi.unstubAllGlobals())

describe('temperature units', () => {
  it('infers Fahrenheit only for US locations and honors an override', () => {
    expect(inferredTemperatureUnit(location)).toBe('fahrenheit')
    expect(inferredTemperatureUnit({ ...location, countryCode: 'CA' })).toBe('celsius')
    expect(resolveTemperatureUnit(location, 'celsius')).toBe('celsius')
    expect(resolveTemperatureUnit({ ...location, countryCode: 'CA' }, 'automatic')).toBe('celsius')
  })
})

describe('local conditions', () => {
  it('loads daily essentials for the exact saved regional center', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        timezone: 'America/Los_Angeles',
        current: { temperature_2m: 72, apparent_temperature: 70, weather_code: 1 },
        daily: {
          temperature_2m_max: [78],
          temperature_2m_min: [58],
          precipitation_probability_max: [20],
          sunrise: ['2026-07-16T05:40'],
          sunset: ['2026-07-16T20:55'],
        },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadLocalConditions(location, 'fahrenheit')).resolves.toMatchObject({
      temperature: 72,
      apparentTemperature: 70,
      temperatureUnit: '°F',
      highTemperature: 78,
      lowTemperature: 58,
      precipitationProbability: 20,
    })
    const url = new URL(fetchMock.mock.calls[0][0])
    expect(url.searchParams.get('latitude')).toBe('45.5')
    expect(url.searchParams.get('longitude')).toBe('-122.7')
    expect(url.searchParams.get('timezone')).toBe('America/Los_Angeles')
    expect(url.searchParams.get('temperature_unit')).toBe('fahrenheit')
  })

  it('rejects incomplete provider data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ current: { temperature_2m: 72 }, daily: {} }) }))
    await expect(loadLocalConditions(location, 'fahrenheit')).rejects.toThrow('incomplete')
  })

  it('reports a provider failure without parsing a response body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    await expect(loadLocalConditions(location, 'fahrenheit')).rejects.toThrow('unavailable')
  })
})
