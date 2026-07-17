import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSeasonalProduce } from '../content/seasonalProduce'
import { loadLocalConditions, type LocalConditions } from '../location/conditions'
import { resolveTemperatureUnit } from '../location/units'
import { weatherPresentation } from '../location/weatherPresentation'
import type { ProfileState } from '../prototype/state'
import {
  CollapseIcon,
  ExpandIcon,
  PrecipitationIcon,
  SeasonIcon,
  SunriseIcon,
  SunsetIcon,
  TemperatureIcon,
} from '../ui/icons'
import { ContextChatLink } from './ContextChatLink'

export function LocalizedTodayContent({ profile }: { profile: ProfileState }) {
  const [conditions, setConditions] = useState<LocalConditions | null>(null)
  const [conditionsError, setConditionsError] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
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
      <section className="weather-summary" aria-labelledby="local-conditions-title">
        <h2 className="sr-only" id="local-conditions-title">Local weather</h2>
        {conditions && presentation && WeatherIcon ? (
          <>
            <div className="weather-primary">
              <WeatherIcon aria-hidden="true" className="weather-current-icon" focusable="false" weight="duotone" />
              <div><strong>{formatTemperature(conditions.temperature, conditions.temperatureUnit)}</strong><span>{presentation.label}</span></div>
            </div>
            <div className="weather-essentials">
              <div><strong>{formatTemperature(conditions.highTemperature, conditions.temperatureUnit)} / {formatTemperature(conditions.lowTemperature, conditions.temperatureUnit)}</strong><small>High / low</small></div>
              <div><PrecipitationIcon aria-hidden="true" focusable="false" /><span><strong>{Math.round(conditions.precipitationProbability)}%</strong><small>Precipitation</small></span></div>
              <button className="icon-control weather-details-control" type="button" aria-label={detailsOpen ? 'Hide weather details' : 'Show weather details'} aria-expanded={detailsOpen} onClick={() => setDetailsOpen(!detailsOpen)}>{detailsOpen ? <CollapseIcon aria-hidden="true" focusable="false" /> : <ExpandIcon aria-hidden="true" focusable="false" />}</button>
            </div>
            {detailsOpen ? (
              <dl className="weather-details">
                <div><dt><TemperatureIcon aria-hidden="true" focusable="false" />Feels like</dt><dd>{formatTemperature(conditions.apparentTemperature, conditions.temperatureUnit)}</dd></div>
                <div><dt><SunriseIcon aria-hidden="true" focusable="false" />Sunrise</dt><dd>{formatClock(conditions.sunrise)}</dd></div>
                <div><dt><SunsetIcon aria-hidden="true" focusable="false" />Sunset</dt><dd>{formatClock(conditions.sunset)}</dd></div>
                <div><dt><SeasonIcon aria-hidden="true" focusable="false" />Season</dt><dd>{conditions.season}</dd></div>
                <div><dt>Forecast area</dt><dd>{location.displayName}</dd></div>
              </dl>
            ) : null}
          </>
        ) : conditionsError ? <p className="supporting">{conditionsError}</p> : <p role="status" className="supporting">Loading local weather…</p>}
      </section>

      <section className="seasonal-card" aria-labelledby="seasonal-title">
        <h2 id="seasonal-title">In season near you</h2>
        {!location.produceRegionId ? <p>Regional food guidance is not available for this area yet.</p> : seasonalProduce.length ? (
          <ul className="seasonal-food-list">{seasonalProduce.map((item) => (
            <li key={item.id}>
              <Link aria-label={`Read about ${item.name}`} className="seasonal-food-main" to={`/learn/${item.articleId}`}><SeasonIcon aria-hidden="true" focusable="false" /><strong>{item.name}</strong></Link>
              <ContextChatLink ariaLabel={`Ask about ${item.name}`} className="icon-control" context={{ type: 'seasonal-food', id: item.id }} returnTo="/today" />
            </li>
          ))}</ul>
        ) : <p>No matching regional foods are available for your preferences this month.</p>}
        {location.produceRegionId ? <details className="compact-details"><summary>About this list</summary><p>Regional seasonality varies. These foods are not a calculated dosha recommendation.</p></details> : null}
      </section>
    </div>
  )
}

function formatClock(value: string) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

function formatTemperature(value: number, unit: string) {
  return `${Math.round(value)}${unit}`
}
