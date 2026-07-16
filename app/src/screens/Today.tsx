import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import { selectDailyRecommendation } from '../content/recommendations'
import { shortModeAllowed } from '../quiz/assessment'

export function TodayScreen() {
  const { state, dispatch } = usePrototype()
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
    recommendationHistory: state.recommendationHistory,
    activeRecommendationId: state.todayRecommendationId,
    fixtureActive,
  })
  const currentRecord = state.recommendationHistory.find((record) =>
    record.recommendationId === recommendation.id && record.date === recommendation.selectionDate,
  )
  const timeZone = state.profile.location?.timeZone
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone,
  }).format(new Date())
  const greeting = greetingForTime(new Date(), timeZone)

  useEffect(() => {
    if (!currentRecord) dispatch({ type: 'show-recommendation', recommendationId: recommendation.id, date: recommendation.selectionDate })
  }, [currentRecord, dispatch, recommendation.id, recommendation.selectionDate])

  function updateRecommendation(status: 'completed' | 'dismissed') {
    dispatch({ type: 'recommendation-status', recommendationId: recommendation.id, date: recommendation.selectionDate, status })
    if (status === 'dismissed') dispatch({ type: 'clear-active-recommendation' })
  }

  return (
    <Screen className="today-screen">
      {fixtureActive ? <p className="fixture-banner">Development fixture visible · not calculated from your answers</p> : null}
      <header className="today-header">
        <div><p className="eyebrow">{date}</p><h1 tabIndex={-1}>{greeting}, {name}</h1></div>
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
        <h2>{recommendation.title}</h2>
        <p>{recommendation.guidance}</p>
        <div className="practical-action">
          <p className="eyebrow">Try this</p>
          <strong>{recommendation.action}</strong>
          {recommendation.checkInSetId ? <Link to={`/questions/check-in/new?set=${recommendation.checkInSetId}`}>Start this check-in →</Link> : null}
        </div>
        {currentRecord?.status === 'completed' ? <p className="completion-note" role="status">Marked complete for today.</p> : null}
        <div className="recommendation-actions">
          <button className="button primary" type="button" disabled={currentRecord?.status === 'completed'} onClick={() => updateRecommendation('completed')}>Mark complete</button>
          <button className="button secondary" type="button" onClick={() => updateRecommendation('dismissed')}>Dismiss</button>
          <button className="text-button" type="button" onClick={() => dispatch({ type: 'clear-active-recommendation' })}>Show another</button>
        </div>
        <Link className="text-link" to={`/learn/${recommendation.relatedArticleId}`}>Read related guidance →</Link>
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
      <Link className="assistant-card" to="/assistant"><strong>Search the learning catalog</strong><span>Open deterministic guided help →</span></Link>
    </Screen>
  )
}

function greetingForTime(now: Date, timeZone?: string) {
  let hour = now.getHours()
  try {
    const value = new Intl.DateTimeFormat('en-US', { hour: '2-digit', hourCycle: 'h23', timeZone }).formatToParts(now).find((part) => part.type === 'hour')?.value
    hour = Number(value ?? hour)
  } catch {
    // Browser-local time remains the honest fallback for an invalid saved zone.
  }
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
}
