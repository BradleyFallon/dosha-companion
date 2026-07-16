import { describe, expect, it } from 'vitest'
import {
  ClearWeatherIcon,
  FogWeatherIcon,
  PartlyCloudyWeatherIcon,
  RainWeatherIcon,
  SnowWeatherIcon,
  StormWeatherIcon,
} from '../ui/icons'
import { weatherPresentation } from './weatherPresentation'

describe('weather presentation', () => {
  it.each([
    [0, 'Clear', ClearWeatherIcon],
    [2, 'Partly cloudy', PartlyCloudyWeatherIcon],
    [45, 'Foggy', FogWeatherIcon],
    [63, 'Rain', RainWeatherIcon],
    [75, 'Snow', SnowWeatherIcon],
    [95, 'Thunderstorms', StormWeatherIcon],
  ] as const)('maps WMO code %i to one semantic label and icon', (code, label, Icon) => {
    expect(weatherPresentation(code)).toEqual({ label, Icon })
  })
})
