import { useState, type ElementType, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BackLink, Screen, Status } from '../components/Layout'
import { inferredTemperatureUnit, temperatureUnitSymbol } from '../location/units'
import { locationEntryPath } from '../location/returnTargets'
import { birthYearBounds, birthYearError, birthYearInput } from '../profile/birthYear'
import { getProfileReadiness } from '../profile/readiness'
import { usePrototype } from '../prototype/PrototypeContext'
import { serializeState } from '../prototype/state'
import {
  ChatIcon,
  ClearDataIcon,
  CompleteIcon,
  ExportDataIcon,
  ForwardIcon,
  LocationIcon,
  PrivacyIcon,
  ProfileIcon,
  ResetIcon,
  StorageIcon,
  TemperatureIcon,
  WarningIcon,
  type IconProps,
} from '../ui/icons'

type SettingsSection = 'profile' | 'location' | 'units' | 'conversations' | 'data'

export function SettingsScreen() {
  const { state, dispatch, resetPrototype, seedDemo } = usePrototype()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(null)
  const [preferredName, setPreferredName] = useState(state.profile.preferredName)
  const [birthYear, setBirthYear] = useState(state.profile.birthYear)
  const [dietaryPattern, setDietaryPattern] = useState(state.profile.dietaryPattern)
  const [hasFoodAllergies, setHasFoodAllergies] = useState(state.profile.hasFoodAllergies)
  const [allergies, setAllergies] = useState(state.profile.allergies)
  const [hasFoodExclusions, setHasFoodExclusions] = useState(state.profile.hasFoodExclusions)
  const [exclusions, setExclusions] = useState(state.profile.exclusions)
  const [error, setError] = useState('')
  const [yearError, setYearError] = useState('')
  const [dataMessage, setDataMessage] = useState('')
  const { minimum, maximum } = birthYearBounds()
  const inferredUnit = inferredTemperatureUnit(state.profile.location)

  function toggle(section: SettingsSection) {
    setActiveSection((current) => current === section ? null : section)
    setDataMessage('')
  }

  function save(event: FormEvent) {
    event.preventDefault()
    if (!preferredName.trim()) {
      setError('Enter the name you would like us to use.')
      return
    }
    const invalidYear = birthYear ? birthYearError(birthYear) : `Enter a year from ${minimum} to ${maximum}.`
    if (invalidYear) {
      setYearError(invalidYear)
      return
    }
    const values = { ...state.profile, preferredName: preferredName.trim(), birthYear, dietaryPattern, hasFoodAllergies, allergies: hasFoodAllergies ? allergies.trim() : '', hasFoodExclusions, exclusions: hasFoodExclusions ? exclusions.trim() : '' }
    if (!getProfileReadiness(values).coreReady) {
      setError('Complete every required profile and food-safety field.')
      return
    }
    setError('')
    setYearError('')
    dispatch({ type: 'update-profile', values })
    setDataMessage('Profile saved.')
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
    if (!window.confirm('Clear all browser-local profile, assessment, check-in, recommendation, and conversation history?')) return
    resetPrototype()
    navigate('/')
  }

  function clearConversationHistory() {
    if (!window.confirm('Clear all conversations saved in this browser?')) return
    dispatch({ type: 'clear-chat-history' })
    setDataMessage('Conversation history cleared.')
  }

  function loadDemo() {
    if (!window.confirm('Replace this browser-local session with an example profile?')) return
    seedDemo()
    navigate('/today')
  }

  return (
    <Screen className="settings-screen">
      <BackLink to="/today" label="Today" />
      <div className="settings-heading">
        <h1 tabIndex={-1}>Settings</h1>
        <Status>{state.saveStatus === 'saving' ? 'Saving…' : state.saveStatus === 'saved' ? 'Saved' : 'Not saved'}</Status>
      </div>

      <div className="settings-rows">
        <SettingsRow active={activeSection === 'profile'} icon={ProfileIcon} id="profile" label="Profile" onClick={() => toggle('profile')} value={state.profile.preferredName} />
        <SettingsRow active={activeSection === 'location'} icon={LocationIcon} id="location" label="Location" onClick={() => toggle('location')} value={state.profile.location?.displayName.split(',')[0] ?? 'Add'} />
        {state.profile.location ? <SettingsRow active={activeSection === 'units'} icon={TemperatureIcon} id="units" label="Units" onClick={() => toggle('units')} value={state.profile.temperatureUnitPreference === 'automatic' ? temperatureUnitSymbol(inferredUnit) : state.profile.temperatureUnitPreference === 'fahrenheit' ? '°F' : '°C'} /> : null}
        <SettingsRow active={activeSection === 'conversations'} icon={ChatIcon} id="conversations" label="Conversations" onClick={() => toggle('conversations')} value={String(state.chatThreads.length)} />
        <SettingsRow active={activeSection === 'data'} icon={StorageIcon} id="data" label="Local data" onClick={() => toggle('data')} />
      </div>

      {activeSection === 'profile' ? (
        <section className="settings-section-panel" id="settings-panel-profile">
          <h2>Profile</h2>
          <form onSubmit={save}>
            <label htmlFor="settings-name">Preferred name</label>
            <input id="settings-name" value={preferredName} onChange={(event) => setPreferredName(event.target.value)} aria-describedby={error ? 'settings-name-error' : undefined} />
            {error ? <p className="field-error" id="settings-name-error" role="alert">{error}</p> : null}
            <label htmlFor="settings-birth-year">Year of birth</label>
            <input id="settings-birth-year" type="text" inputMode="numeric" autoComplete="bday-year" pattern="[0-9]{4}" placeholder="YYYY" minLength={4} maxLength={4} value={birthYear} onChange={(event) => setBirthYear(birthYearInput(event.target.value))} aria-describedby={yearError ? 'settings-birth-year-error' : 'settings-birth-year-hint'} />
            {yearError ? <p className="field-error" id="settings-birth-year-error" role="alert">{yearError}</p> : <p className="field-hint" id="settings-birth-year-hint">{minimum}–{maximum}</p>}
            <label htmlFor="settings-diet">Dietary pattern</label>
            <select id="settings-diet" value={dietaryPattern} onChange={(event) => setDietaryPattern(event.target.value)}>
              <option value="">Choose a dietary pattern</option><option>Omnivore</option><option>Vegetarian</option><option>Vegan</option><option>Pescatarian</option><option>Other</option>
            </select>
            <fieldset className="required-choice"><legend>Food allergies?</legend><label><input type="radio" name="settings-has-allergies" checked={hasFoodAllergies === false} onChange={() => { setHasFoodAllergies(false); setAllergies('') }} /> No</label><label><input type="radio" name="settings-has-allergies" checked={hasFoodAllergies === true} onChange={() => setHasFoodAllergies(true)} /> Yes</label></fieldset>
            {hasFoodAllergies ? <><label htmlFor="settings-allergies">Food allergies</label><input id="settings-allergies" value={allergies} onChange={(event) => setAllergies(event.target.value)} /></> : null}
            <fieldset className="required-choice"><legend>Other foods you avoid?</legend><label><input type="radio" name="settings-has-exclusions" checked={hasFoodExclusions === false} onChange={() => { setHasFoodExclusions(false); setExclusions('') }} /> No</label><label><input type="radio" name="settings-has-exclusions" checked={hasFoodExclusions === true} onChange={() => setHasFoodExclusions(true)} /> Yes</label></fieldset>
            {hasFoodExclusions ? <><label htmlFor="settings-exclusions">Foods you avoid</label><input id="settings-exclusions" value={exclusions} onChange={(event) => setExclusions(event.target.value)} /></> : null}
            <button className="button primary icon-label" type="submit"><CompleteIcon aria-hidden="true" className="icon-leading" focusable="false" />Save profile</button>
          </form>
        </section>
      ) : null}

      {activeSection === 'location' ? (
        <section className="settings-section-panel" id="settings-panel-location">
          <h2>Location</h2>
          {state.profile.location ? <><p>{state.profile.location.displayName}</p><Link className="button secondary icon-label" to={locationEntryPath('/settings')}><LocationIcon aria-hidden="true" className="icon-leading" focusable="false" />Change regional location</Link></> : <><p>Add your general area for local weather and seasonal foods.</p><Link className="button secondary icon-label" to={locationEntryPath('/settings')}><LocationIcon aria-hidden="true" className="icon-leading" focusable="false" />Add regional location</Link></>}
        </section>
      ) : null}

      {activeSection === 'units' && state.profile.location ? (
        <section className="settings-section-panel" id="settings-panel-units">
          <h2>Temperature units</h2>
          <fieldset className="settings-temperature-units"><legend className="sr-only">Temperature units</legend><label><input type="radio" name="temperature-units" checked={state.profile.temperatureUnitPreference === 'automatic'} onChange={() => dispatch({ type: 'update-profile', values: { temperatureUnitPreference: 'automatic' } })} /> Automatic ({temperatureUnitSymbol(inferredUnit)})</label><label><input type="radio" name="temperature-units" checked={state.profile.temperatureUnitPreference === 'fahrenheit'} onChange={() => dispatch({ type: 'update-profile', values: { temperatureUnitPreference: 'fahrenheit' } })} /> Fahrenheit (°F)</label><label><input type="radio" name="temperature-units" checked={state.profile.temperatureUnitPreference === 'celsius'} onChange={() => dispatch({ type: 'update-profile', values: { temperatureUnitPreference: 'celsius' } })} /> Celsius (°C)</label></fieldset>
        </section>
      ) : null}

      {activeSection === 'conversations' ? (
        <section className="settings-section-panel" id="settings-panel-conversations">
          <h2>Conversations</h2>
          <p>{state.chatThreads.length} saved on this device.</p>
          <button className="button danger-button icon-label" disabled={state.chatThreads.length === 0} onClick={clearConversationHistory} type="button"><ClearDataIcon aria-hidden="true" className="icon-leading" focusable="false" />Clear conversation history</button>
          {import.meta.env.DEV ? <p className="field-hint">Chat mode: {import.meta.env.VITE_CHAT_MODE === 'api' ? 'API' : 'Mock'}</p> : null}
        </section>
      ) : null}

      {activeSection === 'data' ? (
        <section className="settings-section-panel" id="settings-panel-data">
          <h2>Local data</h2>
          <dl className="storage-summary"><div><dt>Assessment answers</dt><dd>{Object.keys(state.submittedAnswers).length}</dd></div><div><dt>Check-ins</dt><dd>{state.checkIns.length}</dd></div></dl>
          {state.saveStatus === 'not-saved' ? <p className="secure-context-note icon-label"><WarningIcon aria-hidden="true" className="icon-leading" focusable="false" />Changes are available only for this session.</p> : null}
          <button className="button secondary icon-label" type="button" onClick={exportData}><ExportDataIcon aria-hidden="true" className="icon-leading" focusable="false" />Export local data</button>
          <button className="button danger-button icon-label" type="button" onClick={clearData}><ClearDataIcon aria-hidden="true" className="icon-leading" focusable="false" />Clear local data and restart</button>
          {import.meta.env.DEV ? <button className="button secondary icon-label" type="button" onClick={loadDemo}><ResetIcon aria-hidden="true" className="icon-leading" focusable="false" />Load example profile</button> : null}
          <p className="privacy-line"><PrivacyIcon aria-hidden="true" className="icon-leading" focusable="false" />Stored only in this browser.</p>
        </section>
      ) : null}
      {dataMessage ? <Status>{dataMessage}</Status> : null}
    </Screen>
  )
}

function SettingsRow({ active, icon: Icon, id, label, onClick, value }: { active: boolean; icon: ElementType<IconProps>; id: SettingsSection; label: string; onClick: () => void; value?: string }) {
  return (
    <button aria-controls={`settings-panel-${id}`} aria-expanded={active} aria-label={label} className={active ? 'settings-row active' : 'settings-row'} onClick={onClick} type="button">
      <Icon aria-hidden="true" focusable="false" />
      <span>{label}</span>
      {value ? <small>{value}</small> : null}
      <ForwardIcon aria-hidden="true" focusable="false" />
    </button>
  )
}
