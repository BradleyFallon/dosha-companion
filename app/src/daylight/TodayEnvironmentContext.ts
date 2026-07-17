import { createContext, useContext } from 'react'
import type { LocalConditions } from '../location/conditions'

export interface TodayEnvironmentValue {
  conditions: LocalConditions | null
  conditionsError: string
  loading: boolean
}

export const TodayEnvironmentContext = createContext<TodayEnvironmentValue | null>(null)

export function useTodayEnvironment() {
  const value = useContext(TodayEnvironmentContext)
  if (!value) throw new Error('useTodayEnvironment must be used inside TodayEnvironmentProvider')
  return value
}
