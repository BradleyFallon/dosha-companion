import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BackLink, Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { nextResumePath } from '../prototype/resume'

export function WelcomeScreen() {
  const { state } = usePrototype()
  const hasProgress = state.accountCreated

  return (
    <Screen className="welcome-screen">
      <div className="welcome-mark" aria-hidden="true">DC</div>
      <p className="eyebrow">Dosha Companion</p>
      <h1 tabIndex={-1}>Understand what supports you today.</h1>
      <p className="lede">
        A personalized Ayurvedic wellness companion for learning about your nature and checking in with your current balance.
      </p>
      {hasProgress ? (
        <Link className="button primary" to={nextResumePath(state)}>
          Resume prototype
        </Link>
      ) : (
        <Link className="button primary" to="/create-account">
          Create account
        </Link>
      )}
      <Link className="button secondary" to="/create-account?mode=signin">
        Sign in
      </Link>
      <details className="boundary-details">
        <summary>Read the wellness disclaimer</summary>
        <p>
          This prototype provides educational wellness information. It does not diagnose conditions or replace professional medical care.
        </p>
      </details>
    </Screen>
  )
}

export function AccountScreen() {
  const { dispatch } = usePrototype()
  const navigate = useNavigate()
  const location = useLocation()
  const signIn = new URLSearchParams(location.search).get('mode') === 'signin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!email.includes('@') || !password || !accepted) {
      setError('Enter an email and password, then accept the prototype terms.')
      return
    }
    dispatch({ type: 'account-created' })
    navigate('/profile/name')
  }

  return (
    <Screen>
      <BackLink to="/" />
      <p className="eyebrow">Simulated account</p>
      <h1 tabIndex={-1}>{signIn ? 'Sign in' : 'Create your account'}</h1>
      <p className="supporting">Nothing entered here is sent or stored. This form only unlocks the prototype flow.</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete={signIn ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} />
        <label className="check-row" htmlFor="terms">
          <input id="terms" type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
          <span>I accept the prototype terms and understand this is wellness education, not medical care.</span>
        </label>
        {error ? <p className="field-error" id="account-error" role="alert">{error}</p> : null}
        <button className="button primary" type="submit">Continue</button>
      </form>
    </Screen>
  )
}

function StepHeader({ step }: { step: number }) {
  return (
    <div className="step-header">
      <span>Profile setup</span>
      <span>Step {step} of 3</span>
      <progress value={step} max={3}>Step {step} of 3</progress>
    </div>
  )
}

export function NameProfileScreen() {
  const { state, dispatch } = usePrototype()
  const navigate = useNavigate()
  const [name, setName] = useState(state.profile.preferredName)
  const [ageBand, setAgeBand] = useState(state.profile.ageBand)
  const [error, setError] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Enter the name you would like us to use.')
      return
    }
    dispatch({ type: 'update-profile', values: { preferredName: name.trim(), ageBand } })
    navigate('/profile/location')
  }

  return (
    <Screen>
      <BackLink to="/create-account" />
      <StepHeader step={1} />
      <h1 tabIndex={-1}>Let’s personalize the experience</h1>
      <form onSubmit={submit}>
        <label htmlFor="preferred-name">Preferred name</label>
        <input id="preferred-name" value={name} onChange={(event) => setName(event.target.value)} aria-describedby={error ? 'name-error' : undefined} />
        {error ? <p className="field-error" id="name-error" role="alert">{error}</p> : null}
        <label htmlFor="age-band">Age band <span className="optional">Optional</span></label>
        <select id="age-band" value={ageBand} onChange={(event) => setAgeBand(event.target.value)}>
          <option value="">Select an age band</option>
          <option>18–24</option><option>25–34</option><option>35–44</option><option>45–54</option><option>55–64</option><option>65+</option><option>Prefer not to say</option>
        </select>
        <p className="field-hint">Used for appropriate content and safety—not dosha points.</p>
        <button className="button primary" type="submit">Continue</button>
      </form>
    </Screen>
  )
}

export function LocationProfileScreen() {
  const { state, dispatch } = usePrototype()
  const navigate = useNavigate()
  const [country, setCountry] = useState(state.profile.country)
  const [region, setRegion] = useState(state.profile.region)
  const [city, setCity] = useState(state.profile.city)
  const [units, setUnits] = useState(state.profile.units)
  const [error, setError] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!country.trim()) {
      setError('Enter a country or region to continue.')
      return
    }
    dispatch({ type: 'update-profile', values: { country: country.trim(), region: region.trim(), city: city.trim(), units } })
    navigate('/profile/food')
  }

  return (
    <Screen>
      <BackLink to="/profile/name" />
      <StepHeader step={2} />
      <h1 tabIndex={-1}>Where are you generally located?</h1>
      <form onSubmit={submit}>
        <label htmlFor="country">Country or region</label>
        <input id="country" value={country} onChange={(event) => setCountry(event.target.value)} aria-describedby={error ? 'country-error' : undefined} />
        {error ? <p className="field-error" id="country-error" role="alert">{error}</p> : null}
        <label htmlFor="region">State or province <span className="optional">Optional</span></label>
        <input id="region" value={region} onChange={(event) => setRegion(event.target.value)} />
        <label htmlFor="city">City or postal prefix <span className="optional">Optional</span></label>
        <input id="city" value={city} onChange={(event) => setCity(event.target.value)} />
        <fieldset className="inline-options">
          <legend>Units</legend>
          <label><input type="radio" name="units" value="us" checked={units === 'us'} onChange={() => setUnits('us')} /> US</label>
          <label><input type="radio" name="units" value="metric" checked={units === 'metric'} onChange={() => setUnits('metric')} /> Metric</label>
        </fieldset>
        <button className="button primary" type="submit">Continue</button>
      </form>
    </Screen>
  )
}

export function FoodProfileScreen() {
  const { state, dispatch } = usePrototype()
  const navigate = useNavigate()
  const [dietaryPattern, setDietaryPattern] = useState(state.profile.dietaryPattern)
  const [allergies, setAllergies] = useState(state.profile.allergies)
  const [exclusions, setExclusions] = useState(state.profile.exclusions)

  function submit(event: FormEvent) {
    event.preventDefault()
    dispatch({ type: 'update-profile', values: { dietaryPattern, allergies, exclusions } })
    dispatch({ type: 'complete-profile' })
    navigate('/assessment')
  }

  return (
    <Screen>
      <BackLink to="/profile/location" />
      <StepHeader step={3} />
      <h1 tabIndex={-1}>Food preferences and exclusions</h1>
      <form onSubmit={submit}>
        <label htmlFor="diet">Dietary pattern <span className="optional">Optional</span></label>
        <select id="diet" value={dietaryPattern} onChange={(event) => setDietaryPattern(event.target.value)}>
          <option value="">No preference</option><option>Omnivore</option><option>Vegetarian</option><option>Vegan</option><option>Pescatarian</option><option>Other</option>
        </select>
        <label htmlFor="allergies">Allergies <span className="optional">Optional</span></label>
        <input id="allergies" placeholder="Enter allergies, or leave blank" value={allergies} onChange={(event) => setAllergies(event.target.value)} />
        <label htmlFor="exclusions">Other exclusions <span className="optional">Optional</span></label>
        <input id="exclusions" value={exclusions} onChange={(event) => setExclusions(event.target.value)} />
        <p className="field-hint">These fields are only demonstrated locally. No food recommendation engine is connected.</p>
        <button className="button primary" type="submit">Save and continue</button>
      </form>
    </Screen>
  )
}
