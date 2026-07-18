import { useEffect, useRef, useState, type FormEvent } from 'react'
import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { BackLink, Screen } from '../components/Layout'
import { normalizeCity, normalizeCoordinates, searchCities, type CityResult } from '../location/regions'
import { usePrototype } from '../prototype/PrototypeContext'
import type { RegionalLocation } from '../prototype/state'
import { LocationIcon, PrivacyIcon, SearchIcon } from '../ui/icons'
import { locationReturnPath } from '../location/returnTargets'
import { StepHeader } from './Onboarding'

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/bright'
const DEFAULT_MAP_LOCATION = { latitude: 45.5, longitude: -122.7 }

interface LocationDraft {
  source: 'device' | 'map'
  latitude: number
  longitude: number
}

export function LocationProfileScreen() {
  const { state, dispatch } = usePrototype()
  const navigate = useNavigate()
  const routeLocation = useLocation()
  const onboarding = !state.resultsReached && !new URLSearchParams(routeLocation.search).get('return')
  const fallbackPath = state.resultsReached ? '/balance' : '/profile/food'
  const returnPath = locationReturnPath(routeLocation.search, fallbackPath)
  const backPath = onboarding ? '/profile/name' : returnPath
  const backLabel = returnPath === '/settings' ? 'Settings' : returnPath === '/today' ? 'Today' : returnPath === '/learn' ? 'Learn' : returnPath === '/balance' ? 'My Balance' : 'Profile'
  const [selection, setSelection] = useState<LocationDraft | RegionalLocation | null>(state.profile.location)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [cityQuery, setCityQuery] = useState('')
  const [cityResults, setCityResults] = useState<CityResult[]>([])

  useEffect(() => { document.querySelector<HTMLElement>('.location-screen h1')?.focus() }, [selection])

  function useDeviceLocation() {
    setError('')
    if (!window.isSecureContext || !navigator.geolocation) {
      setError('Device location is unavailable. Choose on map or search for your city.')
      return
    }
    setLocating(true)
    setStatus('Waiting for location permission…')
    navigator.geolocation.getCurrentPosition((position) => {
      setSelection({ source: 'device', latitude: position.coords.latitude, longitude: position.coords.longitude })
      setLocating(false)
      setStatus('Check the general area before continuing.')
    }, () => {
      setLocating(false)
      setStatus('')
      setError('Location permission was not granted. Choose on map or search for your city.')
    }, { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 })
  }

  function chooseOnMap() {
    setError('')
    setSelection({ source: 'map', ...DEFAULT_MAP_LOCATION })
    setStatus('Move the pin to your general area.')
  }

  async function findCity(event: FormEvent) {
    event.preventDefault()
    if (cityQuery.trim().length < 2) return setError('Enter a city or region.')
    setError('')
    setStatus('Searching cities…')
    try {
      const results = await searchCities(cityQuery)
      setCityResults(results)
      setStatus(results.length ? 'Choose the matching city.' : '')
      if (!results.length) setError('No matching cities were found.')
    } catch (reason) {
      setStatus('')
      setError(reason instanceof Error ? reason.message : 'City search is unavailable right now.')
    }
  }

  async function confirmLocation() {
    if (!selection) return
    setResolving(true)
    setError('')
    setStatus('Saving your regional location…')
    try {
      const normalized = 'areaId' in selection
        ? selection
        : await normalizeCoordinates(selection)
      dispatch({ type: 'update-profile', values: { location: normalized } })
      navigate(returnPath)
    } catch (reason) {
      setResolving(false)
      setStatus('')
      setError(reason instanceof Error ? reason.message : 'Regional details could not be loaded.')
    }
  }

  return (
    <Screen className="location-screen">
      <BackLink to={backPath} label={onboarding ? 'Back' : backLabel} />
      {onboarding ? <StepHeader step={2} /> : null}
      {selection ? (
        <>
          <p className="eyebrow">Regional location</p>
          <h1 tabIndex={-1}>{'displayName' in selection ? selection.displayName : selection.source === 'device' ? 'Approximate device area' : 'Selected map area'}</h1>
          <LocationMap location={selection} onChange={(longitude, latitude) => setSelection({ source: selection.source === 'device' ? 'device' : 'map', longitude, latitude })} />
          <p className="map-help">Drag the pin or tap the map to adjust the general area. Exact coordinates are discarded.</p>
          <button className="button primary icon-label" type="button" disabled={resolving} onClick={confirmLocation}><LocationIcon aria-hidden="true" className="icon-leading" focusable="false" />{resolving ? 'Saving region…' : 'Use this regional location'}</button>
          <button className="button secondary" type="button" onClick={() => { setSelection(null); setStatus(''); setError('') }}>Choose again</button>
        </>
      ) : (
        <>
          <p className="eyebrow">Regional location</p><h1 tabIndex={-1}>Choose your general area</h1>
          <p className="lede">Used for local time, daylight, weather, season, and regional food content.</p>
          <button className="button primary location-primary icon-label" type="button" onClick={useDeviceLocation} disabled={locating}><LocationIcon aria-hidden="true" className="icon-leading" focusable="false" />{locating ? 'Finding your area…' : 'Use my current location'}</button>
          <button className="button secondary icon-label" type="button" onClick={chooseOnMap}><LocationIcon aria-hidden="true" className="icon-leading" focusable="false" />Choose on map</button>
          <form className="city-search" onSubmit={findCity}><label htmlFor="city-search">Search for your city</label><input id="city-search" type="search" value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder="City or region" /><button className="button secondary icon-label" type="submit"><SearchIcon aria-hidden="true" className="icon-leading" focusable="false" />Search cities</button></form>
          {cityResults.length ? <ul className="city-results">{cityResults.map((result) => <li key={result.id}><button type="button" onClick={() => setSelection(normalizeCity(result))}><strong>{result.name}</strong><span>{[result.admin1, result.country].filter(Boolean).join(', ')}</span></button></li>)}</ul> : null}
          <p className="privacy-line"><PrivacyIcon aria-hidden="true" className="icon-leading" focusable="false" />Only a roughly 10 km region is saved. Location lookup uses Open-Meteo and OpenStreetMap data.</p>
        </>
      )}
      {status ? <p className="location-status" role="status" aria-live="polite">{status}</p> : null}
      {error ? <p className="field-error location-error" role="alert">{error}</p> : null}
    </Screen>
  )
}

function LocationMap({ location, onChange }: { location: Pick<RegionalLocation, 'latitude' | 'longitude'> | LocationDraft; onChange: (longitude: number, latitude: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRef = useRef<Marker | null>(null)
  const initialLocationRef = useRef(location)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    if (!containerRef.current) return
    const initial = initialLocationRef.current
    const map = new maplibregl.Map({ container: containerRef.current, style: MAP_STYLE, center: [initial.longitude, initial.latitude], zoom: 8, attributionControl: { compact: true } })
    const marker = new maplibregl.Marker({ draggable: true }).setLngLat([initial.longitude, initial.latitude]).addTo(map)
    marker.on('dragend', () => { const point = marker.getLngLat(); onChangeRef.current(point.lng, point.lat) })
    map.on('click', (event) => { marker.setLngLat(event.lngLat); onChangeRef.current(event.lngLat.lng, event.lngLat.lat) })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    mapRef.current = map; markerRef.current = marker
    return () => { marker.remove(); map.remove(); mapRef.current = null; markerRef.current = null }
  }, [])
  return <div ref={containerRef} className="location-map" role="group" aria-label="Map showing an adjustable regional pin" />
}
