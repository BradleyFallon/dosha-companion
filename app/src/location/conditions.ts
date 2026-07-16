import type { RegionalLocation } from '../prototype/state'

export interface LocalConditions {
  temperature: number
  temperatureUnit: string
  weatherCode: number
  sunrise: string
  sunset: string
  timeZone: string
  season: string
}

export async function loadLocalConditions(location: RegionalLocation, signal?: AbortSignal): Promise<LocalConditions> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(location.latitude))
  url.searchParams.set('longitude', String(location.longitude))
  url.searchParams.set('current', 'temperature_2m,weather_code')
  url.searchParams.set('daily', 'sunrise,sunset')
  url.searchParams.set('temperature_unit', location.units === 'us' ? 'fahrenheit' : 'celsius')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '1')
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('Local conditions are unavailable right now.')
  const data = await response.json() as { current?: { temperature_2m?: number; weather_code?: number }; current_units?: { temperature_2m?: string }; daily?: { sunrise?: string[]; sunset?: string[] }; timezone?: string }
  const temperature = data.current?.temperature_2m
  const weatherCode = data.current?.weather_code
  const sunrise = data.daily?.sunrise?.[0]
  const sunset = data.daily?.sunset?.[0]
  if (typeof temperature !== 'number' || typeof weatherCode !== 'number' || !sunrise || !sunset) throw new Error('Local conditions returned incomplete data.')
  return { temperature, temperatureUnit: data.current_units?.temperature_2m ?? (location.units === 'us' ? '°F' : '°C'), weatherCode, sunrise, sunset, timeZone: data.timezone ?? location.timeZone, season: seasonFor(new Date(), location.latitude) }
}

export function seasonFor(date: Date, latitude: number) {
  const month = date.getMonth() + 1
  const north = month >= 3 && month <= 5 ? 'Spring' : month <= 8 && month >= 6 ? 'Summer' : month >= 9 && month <= 11 ? 'Autumn' : 'Winter'
  if (latitude >= 0) return north
  return { Spring: 'Autumn', Summer: 'Winter', Autumn: 'Spring', Winter: 'Summer' }[north]
}

export function weatherLabel(code: number) {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Partly cloudy'
  if (code === 45 || code === 48) return 'Foggy'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Rain showers'
  if (code <= 86) return 'Snow showers'
  return 'Thunderstorms'
}
