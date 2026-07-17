import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadLocalConditions, type LocalConditions } from '../location/conditions'
import { resolveTemperatureUnit } from '../location/units'
import type { ProfileState } from '../prototype/state'
import { TodayEnvironmentContext } from './TodayEnvironmentContext'

export function TodayEnvironmentProvider({
  children,
  enabled,
  profile,
}: {
  children: ReactNode
  enabled: boolean
  profile: ProfileState
}) {
  const [conditions, setConditions] = useState<LocalConditions | null>(null)
  const [conditionsError, setConditionsError] = useState('')
  const location = profile.location
  const temperatureUnit = resolveTemperatureUnit(location, profile.temperatureUnitPreference)

  useEffect(() => {
    setConditions(null)
    setConditionsError('')
    if (!enabled || !location) return

    const controller = new AbortController()
    loadLocalConditions(location, temperatureUnit, controller.signal)
      .then(setConditions)
      .catch((reason) => {
        if (!controller.signal.aborted) {
          setConditionsError(reason instanceof Error ? reason.message : 'Local conditions are unavailable right now.')
        }
      })
    return () => controller.abort()
  }, [enabled, location, temperatureUnit])

  const value = useMemo(() => ({
    conditions,
    conditionsError,
    loading: enabled && Boolean(location) && !conditions && !conditionsError,
  }), [conditions, conditionsError, enabled, location])

  return <TodayEnvironmentContext.Provider value={value}>{children}</TodayEnvironmentContext.Provider>
}
