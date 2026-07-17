import type { ComponentType } from 'react'
import type { BalanceIconKey } from '../generated/initialAssessment'
import {
  AppetiteIcon,
  BodyQualitiesIcon,
  DigestionIcon,
  EnergyIcon,
  RoutineIcon,
  SleepIcon,
  StressIcon,
  type IconProps,
} from '../ui/icons'

const icons: Record<BalanceIconKey, ComponentType<IconProps>> = {
  'moon-stars': SleepIcon,
  lightning: EnergyIcon,
  'bowl-food': AppetiteIcon,
  spiral: DigestionIcon,
  'arrows-clockwise': RoutineIcon,
  waves: StressIcon,
  'person-simple': BodyQualitiesIcon,
}

export function balanceIconFor(key: BalanceIconKey) {
  return icons[key]
}
