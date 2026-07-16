import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BackLink, Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { nextResumePath } from '../prototype/resume'
import { DoshaTrioMark } from '../ui/icons'
import { birthYearBounds, birthYearError, birthYearInput } from '../profile/birthYear'

export function WelcomeScreen() {
  const { state } = usePrototype()
  const hasProgress = state.accountCreated

  return (
    <Screen className="welcome-screen">
      <DoshaTrioMark className="welcome-mark" />
      <p className="eyebrow">Dosha Companion</p>
      <h1 tabIndex={-1}>Understand what supports you today.</h1>
      <p className="lede">
        A personalized Ayurvedic wellness companion for learning about your nature and checking in with your current balance.
      </p>
      {hasProgress ? (
        <Link className="button primary" to={nextResumePath(state)}>
          Resume
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
          This app provides educational wellness information. It does not diagnose conditions or replace professional medical care.
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
      setError('Enter an email and password, then confirm the wellness-education notice.')
      return
    }
    dispatch({ type: 'account-created' })
    navigate('/profile/name')
  }

  return (
    <Screen>
      <BackLink to="/" />
      <p className="eyebrow">Your account</p>
      <h1 tabIndex={-1}>{signIn ? 'Sign in' : 'Create your account'}</h1>
      <p className="supporting">Account details entered here are not sent or saved.</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete={signIn ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} />
        <label className="check-row" htmlFor="terms">
          <input id="terms" type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
          <span>I understand this is wellness education, not medical care.</span>
        </label>
        {error ? <p className="field-error" id="account-error" role="alert">{error}</p> : null}
        <button className="button primary" type="submit">Continue</button>
      </form>
    </Screen>
  )
}

export function StepHeader({ step }: { step: number }) {
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
  const [birthYear, setBirthYear] = useState(state.profile.birthYear)
  const [error, setError] = useState('')
  const [yearError, setYearError] = useState('')
  const { minimum, maximum } = birthYearBounds()

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Enter the name you would like us to use.')
      return
    }
    const invalidYear = birthYearError(birthYear)
    if (invalidYear) {
      setYearError(invalidYear)
      return
    }
    setYearError('')
    dispatch({ type: 'update-profile', values: { preferredName: name.trim(), birthYear } })
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
        <label htmlFor="birth-year">Year of birth <span className="optional">Optional</span></label>
        <input id="birth-year" type="text" inputMode="numeric" autoComplete="bday-year" pattern="[0-9]{4}" placeholder="YYYY" minLength={4} maxLength={4} value={birthYear} onChange={(event) => setBirthYear(birthYearInput(event.target.value))} aria-describedby={yearError ? 'birth-year-error' : 'birth-year-hint'} />
        {yearError ? <p className="field-error" id="birth-year-error" role="alert">{yearError}</p> : <p className="field-hint" id="birth-year-hint">Enter a year from {minimum} to {maximum}. We do not need your full birth date.</p>}
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
        <p className="field-hint">These preferences are stored only on this device and help filter food guidance.</p>
        <button className="button primary" type="submit">Save and continue</button>
      </form>
    </Screen>
  )
}
