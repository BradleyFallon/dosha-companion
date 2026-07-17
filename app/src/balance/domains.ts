import type { ComponentType } from 'react'
import {
  AppetiteIcon,
  DigestionIcon,
  EnergyIcon,
  RoutineIcon,
  SleepIcon,
  StressIcon,
  type IconProps,
} from '../ui/icons'

export type BalanceDomain =
  | 'sleep'
  | 'energy'
  | 'appetite'
  | 'digestion'
  | 'routine'
  | 'stress'

export type DomainInformationState = 'available' | 'uncertain' | 'missing'

export interface BalanceDomainDefinition {
  id: BalanceDomain
  label: string
  icon: ComponentType<IconProps>
  baselineCategory: string
  currentCategory: string
}

export const balanceDomains: readonly BalanceDomainDefinition[] = [
  { id: 'sleep', label: 'Sleep', icon: SleepIcon, baselineCategory: 'sleep', currentCategory: 'sleep' },
  { id: 'energy', label: 'Energy', icon: EnergyIcon, baselineCategory: 'energy', currentCategory: 'energy' },
  { id: 'appetite', label: 'Appetite', icon: AppetiteIcon, baselineCategory: 'appetite', currentCategory: 'appetite' },
  { id: 'digestion', label: 'Digestion', icon: DigestionIcon, baselineCategory: 'digestion', currentCategory: 'digestion' },
  { id: 'routine', label: 'Routine', icon: RoutineIcon, baselineCategory: 'routine', currentCategory: 'routine' },
  { id: 'stress', label: 'Stress', icon: StressIcon, baselineCategory: 'stress_response', currentCategory: 'stress_response' },
] as const

export function isBalanceDomain(value: string | undefined): value is BalanceDomain {
  return balanceDomains.some((domain) => domain.id === value)
}

export function informationState(answerKind: string | null, skipped = false): DomainInformationState {
  if (skipped || (answerKind && answerKind !== 'ordinary')) return 'uncertain'
  return answerKind === 'ordinary' ? 'available' : 'missing'
}

export function informationStateLabel(state: DomainInformationState) {
  if (state === 'available') return 'information available'
  if (state === 'uncertain') return 'not enough information'
  return 'no recent information'
}
