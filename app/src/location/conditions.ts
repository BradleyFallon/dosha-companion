import type { RegionalLocation } from '../prototype/state'
import { temperatureUnitSymbol, type TemperatureUnit } from './units'

export interface LocalConditions {
  temperature: number
  apparentTemperature: number
  temperatureUnit: string
  weatherCode: number
  highTemperature: number
  lowTemperature: number
  precipitationProbability: number
  forecastDate: string
  sunrise: string
  sunset: string
  timeZone: string
  season: string
}

export async function loadLocalConditions(location: RegionalLocation, temperatureUnit: TemperatureUnit, signal?: AbortSignal): Promise<LocalConditions> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(location.latitude))
  url.searchParams.set('longitude', String(location.longitude))
  url.searchParams.set('current', 'temperature_2m,apparent_temperature,weather_code')
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset')
  url.searchParams.set('temperature_unit', temperatureUnit)
  url.searchParams.set('timezone', location.timeZone)
  url.searchParams.set('forecast_days', '1')
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('Local conditions are unavailable right now.')
  const data = await response.json() as {
    current?: { temperature_2m?: number; apparent_temperature?: number; weather_code?: number }
    daily?: { time?: string[]; temperature_2m_max?: number[]; temperature_2m_min?: number[]; precipitation_probability_max?: number[]; sunrise?: string[]; sunset?: string[] }
    timezone?: string
  }
  const temperature = data.current?.temperature_2m
  const apparentTemperature = data.current?.apparent_temperature
  const weatherCode = data.current?.weather_code
  const highTemperature = data.daily?.temperature_2m_max?.[0]
  const lowTemperature = data.daily?.temperature_2m_min?.[0]
  const precipitationProbability = data.daily?.precipitation_probability_max?.[0]
  const sunrise = data.daily?.sunrise?.[0]
  const sunset = data.daily?.sunset?.[0]
  if ([temperature, apparentTemperature, weatherCode, highTemperature, lowTemperature, precipitationProbability].some((value) => typeof value !== 'number') || !sunrise || !sunset) throw new Error('Local conditions returned incomplete data.')
  return {
    temperature: temperature!,
    apparentTemperature: apparentTemperature!,
    temperatureUnit: temperatureUnitSymbol(temperatureUnit),
    weatherCode: weatherCode!,
    highTemperature: highTemperature!,
    lowTemperature: lowTemperature!,
    precipitationProbability: precipitationProbability!,
    forecastDate: data.daily?.time?.[0] ?? sunrise.slice(0, 10),
    sunrise,
    sunset,
    timeZone: data.timezone ?? location.timeZone,
    season: seasonFor(new Date(), location.latitude),
  }
}

export function seasonFor(date: Date, latitude: number) {
  const month = date.getMonth() + 1
  const north = month >= 3 && month <= 5 ? 'Spring' : month <= 8 && month >= 6 ? 'Summer' : month >= 9 && month <= 11 ? 'Autumn' : 'Winter'
  if (latitude >= 0) return north
  return { Spring: 'Autumn', Summer: 'Winter', Autumn: 'Spring', Winter: 'Summer' }[north]
}
