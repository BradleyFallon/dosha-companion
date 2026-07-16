import type { RegionalLocation } from '../prototype/state'

const CITY_SEARCH_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search'
const REVERSE_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse'
const TIME_ZONE_ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

export interface CityResult {
  id: number
  name: string
  latitude: number
  longitude: number
  countryCode: string
  country: string
  admin1: string | null
  admin1Code: string | null
  timeZone: string
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<CityResult[]> {
  const url = new URL(CITY_SEARCH_ENDPOINT)
  url.searchParams.set('name', query.trim())
  url.searchParams.set('count', '5')
  url.searchParams.set('language', navigator.language.split('-')[0] || 'en')
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('City search is unavailable right now.')
  const payload = await response.json() as { results?: Array<Record<string, unknown>> }
  return (payload.results ?? []).flatMap((item) => {
    if (typeof item.id !== 'number' || typeof item.name !== 'string' || typeof item.latitude !== 'number' || typeof item.longitude !== 'number' || typeof item.country_code !== 'string' || typeof item.country !== 'string' || typeof item.timezone !== 'string') return []
    return [{ id: item.id, name: item.name, latitude: item.latitude, longitude: item.longitude, countryCode: item.country_code.toUpperCase(), country: item.country, admin1: typeof item.admin1 === 'string' ? item.admin1 : null, admin1Code: item.admin1_id ? String(item.admin1_id) : null, timeZone: item.timezone }]
  })
}

export function normalizeCity(result: CityResult): RegionalLocation {
  return normalizeRegion({ source: 'city', latitude: result.latitude, longitude: result.longitude, displayName: [result.name, result.admin1, result.country].filter(Boolean).join(', '), countryCode: result.countryCode, admin1Code: result.admin1Code, timeZone: result.timeZone })
}

export async function normalizeCoordinates(input: { source: 'device' | 'map'; latitude: number; longitude: number }): Promise<RegionalLocation> {
  const coarse = gridCenter(input.latitude, input.longitude)
  const reverseUrl = new URL(REVERSE_ENDPOINT)
  reverseUrl.searchParams.set('lat', String(coarse.latitude))
  reverseUrl.searchParams.set('lon', String(coarse.longitude))
  reverseUrl.searchParams.set('format', 'jsonv2')
  reverseUrl.searchParams.set('addressdetails', '1')
  reverseUrl.searchParams.set('zoom', '10')
  const timeUrl = new URL(TIME_ZONE_ENDPOINT)
  timeUrl.searchParams.set('latitude', String(coarse.latitude))
  timeUrl.searchParams.set('longitude', String(coarse.longitude))
  timeUrl.searchParams.set('timezone', 'auto')
  timeUrl.searchParams.set('forecast_days', '1')

  const [reverseResponse, timeResponse] = await Promise.all([fetch(reverseUrl), fetch(timeUrl)])
  if (!reverseResponse.ok || !timeResponse.ok) throw new Error('Regional details could not be loaded. Try a city search instead.')
  const reverse = await reverseResponse.json() as { display_name?: string; address?: Record<string, string> }
  const time = await timeResponse.json() as { timezone?: string }
  const address = reverse.address ?? {}
  const countryCode = address.country_code?.toUpperCase()
  if (!countryCode) throw new Error('A country could not be identified. Try a city search instead.')
  const displayName = [address.city ?? address.town ?? address.village ?? address.county, address.state, address.country].filter(Boolean).join(', ')
  return normalizeRegion({ ...input, ...coarse, displayName: displayName || reverse.display_name || 'Selected region', countryCode, admin1Code: address['ISO3166-2-lvl4'] ?? address.state ?? null, timeZone: time.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone })
}

function normalizeRegion(input: Omit<RegionalLocation, 'areaId' | 'precisionKm' | 'produceRegionId'>): RegionalLocation {
  const center = gridCenter(input.latitude, input.longitude)
  return { ...input, ...center, areaId: `grid-v1:${center.latitude.toFixed(1)}:${center.longitude.toFixed(1)}`, precisionKm: 10, produceRegionId: produceRegionId(input.countryCode, input.admin1Code) }
}

function gridCenter(latitude: number, longitude: number) {
  return { latitude: Number((Math.round(latitude * 10) / 10).toFixed(1)), longitude: Number((Math.round(longitude * 10) / 10).toFixed(1)) }
}

function produceRegionId(countryCode: string, admin1Code: string | null) {
  const admin = admin1Code?.toUpperCase() ?? ''
  if (countryCode === 'US' && (admin.includes('OR') || admin.includes('WA') || admin === '4100' || admin === '5300')) return 'us-pacific-northwest'
  if (countryCode === 'US' && (admin.includes('CA') || admin === '0600')) return 'us-california'
  if (countryCode === 'US') return 'us-general'
  if (countryCode === 'CA') return 'canada-general'
  if (countryCode === 'GB') return 'uk-general'
  return null
}
