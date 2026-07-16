import { useEffect, useRef, useState, type FormEvent } from 'react'
import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useNavigate } from 'react-router-dom'
import { BackLink, Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import type { LocationProfile } from '../prototype/state'
import { StepHeader } from './Onboarding'

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/bright'
const DEFAULT_MAP_LOCATION = { latitude: 39.5, longitude: -98.35 }

function currentTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

function inferredUnits(): LocationProfile['units'] {
  const region = navigator.language.split('-')[1]?.toUpperCase()
  return region === 'US' || region === 'LR' || region === 'MM' ? 'us' : 'metric'
}

function blankLocation(
  source: LocationProfile['source'],
  units: LocationProfile['units'],
): LocationProfile {
  return {
    source,
    latitude: null,
    longitude: null,
    accuracyMeters: null,
    timeZone: currentTimeZone(),
    units,
    displayLabel: null,
  }
}

export function LocationProfileScreen() {
  const { state, dispatch } = usePrototype()
  const navigate = useNavigate()
  const editingExistingProfile = state.profileCompleted
  const returnPath = editingExistingProfile ? '/balance' : '/profile/food'
  const saved = state.profile.location
  const [selection, setSelection] = useState<LocationProfile | null>(
    saved?.source !== 'skipped' ? saved : null,
  )
  const [units, setUnits] = useState<LocationProfile['units']>(
    saved?.units ?? inferredUnits(),
  )
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [manualLabel, setManualLabel] = useState('')
  const [locating, setLocating] = useState(false)

  const secureLocationAvailable = window.isSecureContext

  useEffect(() => {
    document.querySelector<HTMLElement>('.location-screen h1')?.focus()
  }, [selection])

  function useDeviceLocation() {
    setError('')
    setStatus('')

    if (!secureLocationAvailable) {
      setError('Device location requires HTTPS. Choose on map, search manually, or skip for now.')
      return
    }
    if (!navigator.geolocation) {
      setError('This browser does not provide device location. Choose on map or skip for now.')
      return
    }

    setLocating(true)
    setStatus('Waiting for location permission…')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelection({
          source: 'device',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
          timeZone: currentTimeZone(),
          units,
          displayLabel: 'Approximate device location',
        })
        setLocating(false)
        setStatus('Location selected. Check the pin before continuing.')
      },
      (positionError) => {
        const message =
          positionError.code === positionError.PERMISSION_DENIED
            ? 'Location permission was not granted. Choose on map or skip for now.'
            : positionError.code === positionError.TIMEOUT
              ? 'Finding your location took too long. Try again or choose on map.'
              : 'Your location is currently unavailable. Choose on map or skip for now.'
        setError(message)
        setStatus('')
        setLocating(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 300_000,
      },
    )
  }

  function chooseOnMap() {
    setError('')
    setSelection({
      source: 'map',
      ...DEFAULT_MAP_LOCATION,
      accuracyMeters: null,
      timeZone: currentTimeZone(),
      units,
      displayLabel: 'Approximate selected area',
    })
    setStatus('Move the pin to your general area.')
  }

  function chooseManual(event: FormEvent) {
    event.preventDefault()
    const label = manualLabel.trim()
    if (!label) {
      setError('Enter a city or region, or use another location option.')
      return
    }
    setError('')
    setSelection({
      ...blankLocation('map', units),
      displayLabel: label,
    })
    setStatus('Manual location selected.')
  }

  function confirmLocation() {
    if (!selection) return
    dispatch({
      type: 'update-profile',
      values: { location: { ...selection, units } },
    })
    navigate(returnPath)
  }

  function skipLocation() {
    dispatch({
      type: 'update-profile',
      values: { location: blankLocation('skipped', units) },
    })
    navigate(returnPath)
  }

  function chooseAgain() {
    setSelection(null)
    setStatus('')
    setError('')
  }

  return (
    <Screen className="location-screen">
      <BackLink
        to={editingExistingProfile ? '/balance' : '/profile/name'}
        label={editingExistingProfile ? 'My Balance' : 'Back'}
      />
      {editingExistingProfile ? null : <StepHeader step={2} />}
      {selection ? (
        <LocationConfirmation
          location={{ ...selection, units }}
          onChange={setSelection}
          onConfirm={confirmLocation}
          onChooseAgain={chooseAgain}
          units={units}
          onUnitsChange={setUnits}
        />
      ) : (
        <>
          <p className="eyebrow">Optional location</p>
          <h1 tabIndex={-1}>Use your location</h1>
          <p className="lede">This may help adjust future guidance for your local season, time of day, and climate.</p>
          {!secureLocationAvailable ? (
            <p className="secure-context-note" role="note">
              Device location is unavailable on this connection because it is not HTTPS. Map selection and skipping still work.
            </p>
          ) : null}
          <button
            className="button primary location-primary"
            type="button"
            onClick={useDeviceLocation}
            disabled={locating || !secureLocationAvailable}
          >
            {locating ? 'Finding your location…' : 'Use my current location'}
          </button>
          <div className="choice-divider" aria-hidden="true"><span>or</span></div>
          <button className="button secondary" type="button" onClick={chooseOnMap}>Choose on map</button>
          <p className="privacy-line"><span aria-hidden="true">◇</span> We will not make your location public or track it continuously.</p>
          <details className="manual-location">
            <summary>Search manually instead</summary>
            <form onSubmit={chooseManual}>
              <label htmlFor="manual-location">City or region</label>
              <input
                id="manual-location"
                type="search"
                placeholder="For example, Portland, Oregon"
                value={manualLabel}
                onChange={(event) => setManualLabel(event.target.value)}
              />
              <p className="field-hint">Prototype backup: this saves only the label you enter and does not contact a geocoding service.</p>
              <button className="button secondary" type="submit">Use manual location</button>
            </form>
          </details>
          <button className="text-button centered-action" type="button" onClick={skipLocation}>Skip for now</button>
        </>
      )}
      {status ? <p className="location-status" role="status" aria-live="polite">{status}</p> : null}
      {error ? <p className="field-error location-error" role="alert">{error}</p> : null}
    </Screen>
  )
}

function LocationConfirmation({
  location,
  onChange,
  onConfirm,
  onChooseAgain,
  units,
  onUnitsChange,
}: {
  location: LocationProfile
  onChange: (location: LocationProfile) => void
  onConfirm: () => void
  onChooseAgain: () => void
  units: LocationProfile['units']
  onUnitsChange: (units: LocationProfile['units']) => void
}) {
  const hasCoordinates = location.latitude !== null && location.longitude !== null

  return (
    <>
      <p className="eyebrow">Location selected</p>
      <h1 tabIndex={-1}>{location.displayLabel ?? 'Approximate selected area'}</h1>
      {hasCoordinates ? (
        <LocationMap location={location} onChange={onChange} />
      ) : (
        <div className="manual-location-confirmation"><span aria-hidden="true">⌖</span><p>{location.displayLabel}</p></div>
      )}
      <p className="map-help">
        {hasCoordinates ? 'Drag the pin or tap the map if this is not correct.' : 'Only this general label will be saved.'}
      </p>
      <fieldset className="inline-options location-units">
        <legend>Units</legend>
        <label><input type="radio" name="units" value="us" checked={units === 'us'} onChange={() => onUnitsChange('us')} /> US</label>
        <label><input type="radio" name="units" value="metric" checked={units === 'metric'} onChange={() => onUnitsChange('metric')} /> Metric</label>
      </fieldset>
      <button className="button primary" type="button" onClick={onConfirm}>Use this location</button>
      <button className="button secondary" type="button" onClick={onChooseAgain}>Choose again</button>
      <p className="privacy-line">Only a coarse version is saved by this prototype. You can reset it at any time.</p>
    </>
  )
}

function LocationMap({
  location,
  onChange,
}: {
  location: LocationProfile
  onChange: (location: LocationProfile) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRef = useRef<Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current || location.latitude === null || location.longitude === null) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [location.longitude, location.latitude],
      zoom: location.source === 'device' ? 11 : 3,
      attributionControl: { compact: true },
    })
    const marker = new maplibregl.Marker({ draggable: true })
      .setLngLat([location.longitude, location.latitude])
      .addTo(map)

    function updateLocation(longitude: number, latitude: number) {
      onChange({
        ...location,
        source: location.source === 'device' ? 'device' : 'map',
        longitude,
        latitude,
        accuracyMeters: location.source === 'device' ? location.accuracyMeters : null,
        displayLabel:
          location.source === 'device'
            ? 'Approximate device location'
            : 'Approximate selected area',
      })
    }

    marker.on('dragend', () => {
      const point = marker.getLngLat()
      updateLocation(point.lng, point.lat)
    })
    map.on('click', (event) => {
      marker.setLngLat(event.lngLat)
      updateLocation(event.lngLat.lng, event.lngLat.lat)
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    mapRef.current = map
    markerRef.current = marker

    return () => {
      marker.remove()
      map.remove()
      markerRef.current = null
      mapRef.current = null
    }
    // Map is intentionally created once for this confirmation state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerRef}
      className="location-map"
      role="group"
      aria-label="Map showing an adjustable location pin"
    />
  )
}
