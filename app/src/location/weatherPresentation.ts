import type { IconProps } from '../ui/icons'
import type { ComponentType } from 'react'
import {
  ClearWeatherIcon,
  CloudyWeatherIcon,
  FogWeatherIcon,
  PartlyCloudyWeatherIcon,
  RainWeatherIcon,
  SnowWeatherIcon,
  StormWeatherIcon,
} from '../ui/icons'

export interface WeatherPresentation {
  label: string
  Icon: ComponentType<IconProps>
}

export function weatherPresentation(code: number): WeatherPresentation {
  if (code === 0) return { label: 'Clear', Icon: ClearWeatherIcon }
  if (code <= 2) return { label: 'Partly cloudy', Icon: PartlyCloudyWeatherIcon }
  if (code === 3) return { label: 'Cloudy', Icon: CloudyWeatherIcon }
  if (code === 45 || code === 48) return { label: 'Foggy', Icon: FogWeatherIcon }
  if (code <= 67) return { label: 'Rain', Icon: RainWeatherIcon }
  if (code <= 77) return { label: 'Snow', Icon: SnowWeatherIcon }
  if (code <= 82) return { label: 'Rain showers', Icon: RainWeatherIcon }
  if (code <= 86) return { label: 'Snow showers', Icon: SnowWeatherIcon }
  return { label: 'Thunderstorms', Icon: StormWeatherIcon }
}
