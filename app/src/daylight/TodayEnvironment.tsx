import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadLocalConditions, type LocalConditions } from '../location/conditions'
import { resolveTemperatureUnit } from '../location/units'
import type { ProfileState } from '../prototype/state'
import { localDateKey } from './model'
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
  const [refreshVersion, setRefreshVersion] = useState(0)
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
  }, [enabled, location, refreshVersion, temperatureUnit])

  useEffect(() => {
    if (!enabled || !location || !conditions) return
    const refreshIfStale = () => {
      if (
        document.visibilityState === 'visible' &&
        conditions.forecastDate !== localDateKey(new Date(), conditions.timeZone)
      ) {
        setRefreshVersion((version) => version + 1)
      }
    }
    window.addEventListener('focus', refreshIfStale)
    document.addEventListener('visibilitychange', refreshIfStale)
    return () => {
      window.removeEventListener('focus', refreshIfStale)
      document.removeEventListener('visibilitychange', refreshIfStale)
    }
  }, [conditions, enabled, location])

  const value = useMemo(() => ({
    conditions,
    conditionsError,
    loading: enabled && Boolean(location) && !conditions && !conditionsError,
  }), [conditions, conditionsError, enabled, location])

  return <TodayEnvironmentContext.Provider value={value}>{children}</TodayEnvironmentContext.Provider>
}
