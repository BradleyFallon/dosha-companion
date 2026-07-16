import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BackLink, Screen, Status } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { serializeState } from '../prototype/state'
import {
  ClearDataIcon,
  CompleteIcon,
  ExportDataIcon,
  LocationIcon,
  PrivacyIcon,
  ProfileIcon,
  ResetIcon,
  StorageIcon,
  WarningIcon,
} from '../ui/icons'
import { birthYearBounds, birthYearError, birthYearInput } from '../profile/birthYear'

export function SettingsScreen() {
  const { state, dispatch, resetPrototype, seedDemo } = usePrototype()
  const navigate = useNavigate()
  const [preferredName, setPreferredName] = useState(state.profile.preferredName)
  const [birthYear, setBirthYear] = useState(state.profile.birthYear)
  const [dietaryPattern, setDietaryPattern] = useState(state.profile.dietaryPattern)
  const [allergies, setAllergies] = useState(state.profile.allergies)
  const [exclusions, setExclusions] = useState(state.profile.exclusions)
  const [error, setError] = useState('')
  const [yearError, setYearError] = useState('')
  const [dataMessage, setDataMessage] = useState('')
  const { minimum, maximum } = birthYearBounds()

  function save(event: FormEvent) {
    event.preventDefault()
    if (!preferredName.trim()) {
      setError('Enter the name you would like us to use.')
      return
    }
    const invalidYear = birthYearError(birthYear)
    if (invalidYear) {
      setYearError(invalidYear)
      return
    }
    setError('')
    setYearError('')
    dispatch({
      type: 'update-profile',
      values: {
        preferredName: preferredName.trim(),
        birthYear,
        dietaryPattern,
        allergies: allergies.trim(),
        exclusions: exclusions.trim(),
      },
    })
  }

  function exportData() {
    const anchor = document.createElement('a')
    anchor.href = `data:application/json;charset=utf-8,${encodeURIComponent(serializeState(state))}`
    anchor.download = `dosha-companion-local-data-${new Date().toISOString().slice(0, 10)}.json`
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    setDataMessage('Local data export prepared.')
  }

  function clearData() {
    if (!window.confirm('Clear all browser-local profile, assessment, check-in, and recommendation history?')) return
    resetPrototype()
    navigate('/')
  }

  function loadDemo() {
    if (!window.confirm('Replace this browser-local session with an example profile?')) return
    seedDemo()
    navigate('/today')
  }

  return (
    <Screen>
      <BackLink to="/today" label="Today" />
      <div className="settings-heading">
        <div><p className="eyebrow section-title-with-icon"><ProfileIcon aria-hidden="true" className="icon-leading" focusable="false" />Browser-local profile</p><h1 tabIndex={-1}>Settings</h1></div>
        <Status>
          {state.saveStatus === 'saving'
            ? 'Saving…'
            : state.saveStatus === 'saved'
              ? 'Saved on this device'
              : 'Not saved'}
        </Status>
      </div>
      <p className="supporting">Profile changes update Today guidance without removing assessment answers.</p>
      <form onSubmit={save}>
        <label htmlFor="settings-name">Preferred name</label>
        <input id="settings-name" value={preferredName} onChange={(event) => setPreferredName(event.target.value)} aria-describedby={error ? 'settings-name-error' : undefined} />
        {error ? <p className="field-error" id="settings-name-error" role="alert">{error}</p> : null}
        <label htmlFor="settings-birth-year">Year of birth <span className="optional">Optional</span></label>
        <input id="settings-birth-year" type="text" inputMode="numeric" autoComplete="bday-year" pattern="[0-9]{4}" placeholder="YYYY" minLength={4} maxLength={4} value={birthYear} onChange={(event) => setBirthYear(birthYearInput(event.target.value))} aria-describedby={yearError ? 'settings-birth-year-error' : 'settings-birth-year-hint'} />
        {yearError ? <p className="field-error" id="settings-birth-year-error" role="alert">{yearError}</p> : <p className="field-hint" id="settings-birth-year-hint">Enter a year from {minimum} to {maximum}. We do not need your full birth date.</p>}
        <label htmlFor="settings-diet">Dietary pattern <span className="optional">Optional</span></label>
        <select id="settings-diet" value={dietaryPattern} onChange={(event) => setDietaryPattern(event.target.value)}>
          <option value="">No preference</option><option>Omnivore</option><option>Vegetarian</option><option>Vegan</option><option>Pescatarian</option><option>Other</option>
        </select>
        <label htmlFor="settings-allergies">Allergies <span className="optional">Optional</span></label>
        <input id="settings-allergies" value={allergies} onChange={(event) => setAllergies(event.target.value)} />
        <label htmlFor="settings-exclusions">Other exclusions <span className="optional">Optional</span></label>
        <input id="settings-exclusions" value={exclusions} onChange={(event) => setExclusions(event.target.value)} />
        <button className="button primary icon-label" type="submit"><CompleteIcon aria-hidden="true" className="icon-leading" focusable="false" />Save profile changes</button>
      </form>
      <section className="settings-location" aria-labelledby="settings-location-title">
        <h2 className="section-title-with-icon" id="settings-location-title"><LocationIcon aria-hidden="true" className="icon-leading" focusable="false" />Location and units</h2>
        <p>{state.profile.location?.displayLabel ?? (state.profile.location?.source === 'skipped' ? 'Location skipped' : 'No location saved')} · {state.profile.location?.units === 'metric' ? 'Metric' : 'US'} units</p>
        <Link className="button secondary icon-label" to="/profile/location?return=settings"><LocationIcon aria-hidden="true" className="icon-leading" focusable="false" />Edit or remove location</Link>
      </section>
      <section className="settings-data" aria-labelledby="settings-data-title">
        <h2 className="section-title-with-icon" id="settings-data-title"><StorageIcon aria-hidden="true" className="icon-leading" focusable="false" />Local data</h2>
        <dl className="storage-summary"><div><dt>Storage</dt><dd>Browser localStorage</dd></div><div><dt>Status</dt><dd>{state.saveStatus === 'saved' ? 'Saved on this device' : state.saveStatus === 'saving' ? 'Saving…' : 'Not saved; session only'}</dd></div><div><dt>Assessment answers</dt><dd>{Object.keys(state.submittedAnswers).length}</dd></div><div><dt>Check-ins</dt><dd>{state.checkIns.length}</dd></div></dl>
        {state.saveStatus === 'not-saved' ? <p className="secure-context-note icon-label"><WarningIcon aria-hidden="true" className="icon-leading" focusable="false" />Changes are available only for this session.</p> : null}
        <button className="button secondary icon-label" type="button" onClick={exportData}><ExportDataIcon aria-hidden="true" className="icon-leading" focusable="false" />Export local data as JSON</button>
        <button className="button danger-button icon-label" type="button" onClick={clearData}><ClearDataIcon aria-hidden="true" className="icon-leading" focusable="false" />Clear local data and restart</button>
        {import.meta.env.DEV ? <div className="dev-control"><strong>Example profile</strong><p>Replace this session with a complete profile, assessment coverage, and a completed check-in.</p><button className="button secondary icon-label" type="button" onClick={loadDemo}><ResetIcon aria-hidden="true" className="icon-leading" focusable="false" />Load example profile</button></div> : null}
        {dataMessage ? <Status>{dataMessage}</Status> : null}
      </section>
      <p className="boundary-note icon-label"><PrivacyIcon aria-hidden="true" className="icon-leading" focusable="false" />Your profile is stored only in this browser. It does not synchronize to another device.</p>
    </Screen>
  )
}
