import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BackLink, Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { nextResumePath } from '../prototype/resume'
import { DoshaTrioMark } from '../ui/icons'
import { birthYearBounds, birthYearError, birthYearInput } from '../profile/birthYear'

export function WelcomeScreen() {
  const { state } = usePrototype()
  const hasProgress = Boolean(state.profile.preferredName || state.profile.birthYear || state.profile.location)

  return (
    <Screen className="welcome-screen">
      <DoshaTrioMark className="welcome-mark" />
      <p className="eyebrow">Dosha Companion</p>
      <h1 tabIndex={-1}>Understand what supports you today.</h1>
      <p className="lede">
        A personalized Ayurvedic wellness companion for learning about your nature and checking in with your current balance.
      </p>
      <Link className="button primary" to={nextResumePath(state)}>
        {hasProgress ? 'Resume' : 'Get started'}
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
    const invalidYear = birthYear ? birthYearError(birthYear) : `Enter a year from ${minimum} to ${maximum}.`
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
      <BackLink to="/" />
      <StepHeader step={1} />
      <h1 tabIndex={-1}>Let’s personalize the experience</h1>
      <form onSubmit={submit}>
        <label htmlFor="preferred-name">Preferred name</label>
        <input id="preferred-name" value={name} onChange={(event) => setName(event.target.value)} aria-describedby={error ? 'name-error' : undefined} />
        {error ? <p className="field-error" id="name-error" role="alert">{error}</p> : null}
        <label htmlFor="birth-year">Year of birth</label>
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
  const [hasFoodAllergies, setHasFoodAllergies] = useState(state.profile.hasFoodAllergies)
  const [allergies, setAllergies] = useState(state.profile.allergies)
  const [hasFoodExclusions, setHasFoodExclusions] = useState(state.profile.hasFoodExclusions)
  const [exclusions, setExclusions] = useState(state.profile.exclusions)
  const [error, setError] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!dietaryPattern || hasFoodAllergies === null || hasFoodExclusions === null) {
      setError('Choose a dietary pattern and answer both food-safety questions.')
      return
    }
    if (hasFoodAllergies && !allergies.trim()) {
      setError('Enter your food allergies, or choose No.')
      return
    }
    if (hasFoodExclusions && !exclusions.trim()) {
      setError('Enter the foods you avoid, or choose No.')
      return
    }
    setError('')
    dispatch({ type: 'update-profile', values: { dietaryPattern, hasFoodAllergies, allergies: hasFoodAllergies ? allergies : '', hasFoodExclusions, exclusions: hasFoodExclusions ? exclusions : '' } })
    dispatch({ type: 'complete-profile' })
    navigate('/assessment')
  }

  return (
    <Screen>
      <BackLink to="/profile/location" />
      <StepHeader step={3} />
      <h1 tabIndex={-1}>Food preferences and exclusions</h1>
      <form onSubmit={submit}>
        <label htmlFor="diet">Dietary pattern</label>
        <select id="diet" value={dietaryPattern} onChange={(event) => setDietaryPattern(event.target.value)}>
          <option value="">Choose a dietary pattern</option><option>Omnivore</option><option>Vegetarian</option><option>Vegan</option><option>Pescatarian</option><option>Other</option>
        </select>
        <fieldset className="required-choice"><legend>Do you have food allergies?</legend><label><input type="radio" name="has-allergies" checked={hasFoodAllergies === false} onChange={() => { setHasFoodAllergies(false); setAllergies('') }} /> No</label><label><input type="radio" name="has-allergies" checked={hasFoodAllergies === true} onChange={() => setHasFoodAllergies(true)} /> Yes</label></fieldset>
        {hasFoodAllergies ? <><label htmlFor="allergies">Food allergies</label><input id="allergies" value={allergies} onChange={(event) => setAllergies(event.target.value)} /></> : null}
        <fieldset className="required-choice"><legend>Do you avoid any foods for other reasons?</legend><label><input type="radio" name="has-exclusions" checked={hasFoodExclusions === false} onChange={() => { setHasFoodExclusions(false); setExclusions('') }} /> No</label><label><input type="radio" name="has-exclusions" checked={hasFoodExclusions === true} onChange={() => setHasFoodExclusions(true)} /> Yes</label></fieldset>
        {hasFoodExclusions ? <><label htmlFor="exclusions">Foods you avoid</label><input id="exclusions" value={exclusions} onChange={(event) => setExclusions(event.target.value)} /></> : null}
        {error ? <p className="field-error" role="alert">{error}</p> : null}
        <p className="field-hint">These preferences are stored only on this device and help filter food guidance.</p>
        <button className="button primary" type="submit">Save and continue</button>
      </form>
    </Screen>
  )
}
