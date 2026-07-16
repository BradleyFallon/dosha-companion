import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'

export function TodayScreen() {
  const { state } = usePrototype()
  const [whyOpen, setWhyOpen] = useState(false)
  const name = state.profile.preferredName || 'there'
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <Screen className="today-screen">
      <header className="today-header">
        <div><p className="eyebrow">{date}</p><h1 tabIndex={-1}>Good morning, {name}</h1></div>
        <Link className="ai-shortcut" to="/assistant" aria-label="Open AI assistant placeholder">AI</Link>
      </header>
      <Link className="balance-summary" to="/balance">
        <span><small>Current balance · updated today</small><strong>Vata is currently more prominent</strong></span>
        <span aria-hidden="true">→</span>
      </Link>
      <article className="daily-focus">
        <p className="eyebrow">Today’s focus · approved-copy placeholder</p>
        <h2>Create a steadier start</h2>
        <p>A regular pause can make a busy day feel easier to navigate. This sample guidance demonstrates placement only; it is not personalized or clinically validated.</p>
        <div className="practical-action">
          <p className="eyebrow">Try this</p>
          <strong>Choose one consistent time for your next meal or short break.</strong>
        </div>
      </article>
      <section className="today-secondary" aria-labelledby="food-title">
        <p className="eyebrow">Optional food idea</p>
        <h2 id="food-title">Choose a familiar, compatible meal</h2>
        <p>Placeholder only. Allergies and exclusions would be checked by deterministic rules before a suggestion appears.</p>
      </section>
      <button className="disclosure" type="button" aria-expanded={whyOpen} onClick={() => setWhyOpen(!whyOpen)}>
        Why this was chosen <span aria-hidden="true">{whyOpen ? '−' : '+'}</span>
      </button>
      {whyOpen ? <p className="disclosure-panel">Static signals shown for testing: the fixture’s current-balance label and a general routine topic. No raw answers or numeric scores are used.</p> : null}
      <Link className="question-count" to="/questions"><strong>3 questions available</strong><span>Refinement + current check-in →</span></Link>
      <Link className="assistant-card" to="/assistant"><strong>Ask about your profile or guidance</strong><span>Open the static premium-feature placeholder →</span></Link>
    </Screen>
  )
}
