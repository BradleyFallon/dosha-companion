import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Screen, Status } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'

export function SettingsScreen() {
  const { state, dispatch } = usePrototype()
  const [preferredName, setPreferredName] = useState(state.profile.preferredName)
  const [ageBand, setAgeBand] = useState(state.profile.ageBand)
  const [dietaryPattern, setDietaryPattern] = useState(state.profile.dietaryPattern)
  const [allergies, setAllergies] = useState(state.profile.allergies)
  const [exclusions, setExclusions] = useState(state.profile.exclusions)
  const [error, setError] = useState('')

  function save(event: FormEvent) {
    event.preventDefault()
    if (!preferredName.trim()) {
      setError('Enter the name you would like us to use.')
      return
    }
    setError('')
    dispatch({
      type: 'update-profile',
      values: {
        preferredName: preferredName.trim(),
        ageBand,
        dietaryPattern,
        allergies: allergies.trim(),
        exclusions: exclusions.trim(),
      },
    })
  }

  return (
    <Screen>
      <Link className="back-link" to="/today">← Today</Link>
      <div className="settings-heading">
        <div><p className="eyebrow">Browser-local profile</p><h1 tabIndex={-1}>Settings</h1></div>
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
        <label htmlFor="settings-age">Age band <span className="optional">Optional</span></label>
        <select id="settings-age" value={ageBand} onChange={(event) => setAgeBand(event.target.value)}>
          <option value="">Select an age band</option>
          <option>18–24</option><option>25–34</option><option>35–44</option><option>45–54</option><option>55–64</option><option>65+</option><option>Prefer not to say</option>
        </select>
        <label htmlFor="settings-diet">Dietary pattern <span className="optional">Optional</span></label>
        <select id="settings-diet" value={dietaryPattern} onChange={(event) => setDietaryPattern(event.target.value)}>
          <option value="">No preference</option><option>Omnivore</option><option>Vegetarian</option><option>Vegan</option><option>Pescatarian</option><option>Other</option>
        </select>
        <label htmlFor="settings-allergies">Allergies <span className="optional">Optional</span></label>
        <input id="settings-allergies" value={allergies} onChange={(event) => setAllergies(event.target.value)} />
        <label htmlFor="settings-exclusions">Other exclusions <span className="optional">Optional</span></label>
        <input id="settings-exclusions" value={exclusions} onChange={(event) => setExclusions(event.target.value)} />
        <button className="button primary" type="submit">Save profile changes</button>
      </form>
      <section className="settings-location" aria-labelledby="settings-location-title">
        <h2 id="settings-location-title">Location and units</h2>
        <p>{state.profile.location?.displayLabel ?? (state.profile.location?.source === 'skipped' ? 'Location skipped' : 'No location saved')} · {state.profile.location?.units === 'metric' ? 'Metric' : 'US'} units</p>
        <Link className="button secondary" to="/profile/location?return=settings">Edit or remove location</Link>
      </section>
      <p className="boundary-note">This milestone stores the profile only in this browser. It does not synchronize to an account or backend.</p>
    </Screen>
  )
}
