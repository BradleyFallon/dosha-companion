import type { ProfileState, RegionalLocation } from '../prototype/state'

export type TemperatureUnit = 'fahrenheit' | 'celsius'

export function inferredTemperatureUnit(location: RegionalLocation | null): TemperatureUnit {
  return location?.countryCode === 'US' ? 'fahrenheit' : 'celsius'
}

export function resolveTemperatureUnit(
  location: RegionalLocation | null,
  preference: ProfileState['temperatureUnitPreference'],
): TemperatureUnit {
  return preference === 'automatic' ? inferredTemperatureUnit(location) : preference
}

export function temperatureUnitSymbol(unit: TemperatureUnit) {
  return unit === 'fahrenheit' ? '°F' : '°C'
}
