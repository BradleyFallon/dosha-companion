import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import { selectDailyRecommendation } from '../content/recommendations'
import { shortModeAllowed } from '../quiz/assessment'

export function TodayScreen() {
  const { state } = usePrototype()
  const location = useLocation()
  const [whyOpen, setWhyOpen] = useState(false)
  const name = state.profile.preferredName || 'there'
  const fixtureActive =
    shortModeAllowed() && new URLSearchParams(location.search).get('fixture') === 'profile'
  const coverage = calculateAssessmentCoverage({
    submittedAnswers: state.submittedAnswers,
    skippedQuestionIds: state.skippedQuestionIds,
  })
  const recommendation = selectDailyRecommendation({
    coverage,
    profile: state.profile,
    submittedAnswers: state.submittedAnswers,
    fixtureActive,
  })
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <Screen className="today-screen">
      {fixtureActive ? <p className="fixture-banner">Development fixture visible · not calculated from your answers</p> : null}
      <header className="today-header">
        <div><p className="eyebrow">{date}</p><h1 tabIndex={-1}>Good morning, {name}</h1></div>
        <Link className="settings-shortcut" to="/settings" aria-label="Open profile settings">Settings</Link>
      </header>
      <Link className="balance-summary" to="/balance">
        <span>
          <small>Assessment coverage · {coverage.ready ? 'ready' : 'needs information'}</small>
          <strong>{coverage.current.substantive} of {coverage.current.total} recent answers are usable</strong>
        </span>
        <span aria-hidden="true">→</span>
      </Link>
      <article className="daily-focus">
        <p className="provisional-badge">{recommendation.label}</p>
        <p className="eyebrow">Today’s focus</p>
        <h2>{recommendation.headline}</h2>
        <p>{recommendation.guidance}</p>
        <div className="practical-action">
          <p className="eyebrow">Try this</p>
          <strong>{recommendation.action}</strong>
          {recommendation.actionHref ? <Link to={recommendation.actionHref}>Start this check-in →</Link> : null}
        </div>
      </article>
      <section className={recommendation.food.status === 'withheld' ? 'today-secondary withheld' : 'today-secondary'} aria-labelledby="food-title">
        <p className="provisional-badge">{recommendation.label}</p>
        <p className="eyebrow">Optional food prompt</p>
        <h2 id="food-title">{recommendation.food.title}</h2>
        <p>{recommendation.food.body}</p>
      </section>
      <button className="disclosure" type="button" aria-expanded={whyOpen} onClick={() => setWhyOpen(!whyOpen)}>
        Why this was chosen <span aria-hidden="true">{whyOpen ? '−' : '+'}</span>
      </button>
      {whyOpen ? (
        <div className="disclosure-panel">
          <ul>{recommendation.why.map((reason) => <li key={reason}>{reason}</li>)}</ul>
          <p>{recommendation.food.reason}</p>
        </div>
      ) : null}
      <Link className="question-count" to="/questions">
        <strong>{coverage.ready ? 'Review assessment coverage' : 'More information is useful'}</strong>
        <span>{coverage.ready ? 'See answer coverage →' : 'Answer the next useful question →'}</span>
      </Link>
      <Link className="assistant-card" to="/assistant"><strong>Ask about your profile or guidance</strong><span>Open the unavailable assistant placeholder →</span></Link>
    </Screen>
  )
}
