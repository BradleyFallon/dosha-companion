import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSeasonalProduce } from '../content/seasonalProduce'
import { loadLocalConditions, type LocalConditions } from '../location/conditions'
import { resolveTemperatureUnit } from '../location/units'
import { weatherPresentation } from '../location/weatherPresentation'
import type { ProfileState } from '../prototype/state'
import {
  HighTemperatureIcon,
  LowTemperatureIcon,
  PrecipitationIcon,
  SeasonIcon,
  SunriseIcon,
  SunsetIcon,
} from '../ui/icons'

export function LocalizedTodayContent({ profile }: { profile: ProfileState }) {
  const [conditions, setConditions] = useState<LocalConditions | null>(null)
  const [conditionsError, setConditionsError] = useState('')
  const location = profile.location
  const temperatureUnit = resolveTemperatureUnit(location, profile.temperatureUnitPreference)
  const seasonalProduce = getSeasonalProduce(profile).slice(0, 4)

  useEffect(() => {
    if (!location) return
    const controller = new AbortController()
    setConditions(null)
    setConditionsError('')
    loadLocalConditions(location, temperatureUnit, controller.signal).then(setConditions).catch((reason) => {
      if (!controller.signal.aborted) setConditionsError(reason instanceof Error ? reason.message : 'Local conditions are unavailable right now.')
    })
    return () => controller.abort()
  }, [location, temperatureUnit])

  if (!location) return null
  const presentation = conditions ? weatherPresentation(conditions.weatherCode) : null
  const WeatherIcon = presentation?.Icon

  return (
    <div className="localized-today-content">
      <section className="local-conditions" aria-labelledby="local-conditions-title">
        <p className="eyebrow">Near you</p><h2 id="local-conditions-title">Local conditions</h2>
        <p className="forecast-location">Forecast for <strong>{location.displayName}</strong></p>
        {conditions && presentation && WeatherIcon ? (
          <>
            <div className="conditions-current">
              <WeatherIcon aria-hidden="true" className="weather-current-icon" focusable="false" weight="duotone" />
              <div><strong>{formatTemperature(conditions.temperature, conditions.temperatureUnit)}</strong><span>{presentation.label}</span><small>Feels like {formatTemperature(conditions.apparentTemperature, conditions.temperatureUnit)}</small></div>
            </div>
            <div className="conditions-grid">
              <WeatherMetric Icon={HighTemperatureIcon} label="High" value={formatTemperature(conditions.highTemperature, conditions.temperatureUnit)} />
              <WeatherMetric Icon={LowTemperatureIcon} label="Low" value={formatTemperature(conditions.lowTemperature, conditions.temperatureUnit)} />
              <WeatherMetric Icon={PrecipitationIcon} label="Precipitation" value={`${Math.round(conditions.precipitationProbability)}%`} />
              <WeatherMetric Icon={SunriseIcon} label="Sunrise" value={formatClock(conditions.sunrise)} />
              <WeatherMetric Icon={SunsetIcon} label="Sunset" value={formatClock(conditions.sunset)} />
              <WeatherMetric Icon={SeasonIcon} label="General season" value={conditions.season} />
            </div>
          </>
        ) : conditionsError ? <p className="supporting">{conditionsError}</p> : <p role="status" className="supporting">Loading local weather and daylight…</p>}
      </section>
      <section className="seasonal-card" aria-labelledby="seasonal-title">
        <p className="eyebrow">Regional food guide</p><h2 id="seasonal-title">In season near you</h2>
        {!location.produceRegionId ? <p>Regional food guidance is not available for this area yet.</p> : seasonalProduce.length ? <ul>{seasonalProduce.map((item) => <li key={item.id}><Link to={`/learn/${item.articleId}`}>{item.name}</Link></li>)}</ul> : <p>No matching regional foods are available for your preferences this month.</p>}
        {location.produceRegionId ? <p className="field-hint">Regional seasonality varies by source and growing conditions. These foods are not a calculated dosha recommendation.</p> : null}
      </section>
    </div>
  )
}

function WeatherMetric({ Icon, label, value }: { Icon: typeof HighTemperatureIcon; label: string; value: string }) {
  return <div><Icon aria-hidden="true" className="weather-metric-icon" focusable="false" /><span><strong>{value}</strong><small>{label}</small></span></div>
}

function formatClock(value: string) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

function formatTemperature(value: number, unit: string) {
  return `${Math.round(value)}${unit}`
}
