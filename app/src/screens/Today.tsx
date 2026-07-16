import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import { selectDailyRecommendation } from '../content/recommendations'
import {
  BalanceIcon,
  CompleteIcon,
  DismissIcon,
  FoodIcon,
  ForwardIcon,
  GuidedHelpIcon,
  LearnIcon,
  LocationIcon,
  NatureIcon,
  QuestionsIcon,
  SettingsIcon,
  ShowAnotherIcon,
  WhyIcon,
} from '../ui/icons'

export function TodayScreen() {
  const { state, dispatch } = usePrototype()
  const [whyOpen, setWhyOpen] = useState(false)
  const name = state.profile.preferredName || 'there'
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
      <header className="today-header">
        <div><p className="eyebrow">{date}</p><h1 tabIndex={-1}>{greeting}, {name}</h1></div>
        <Link className="settings-shortcut icon-label" to="/settings" aria-label="Open profile settings"><SettingsIcon aria-hidden="true" className="icon-leading" focusable="false" />Settings</Link>
      </header>
      <Link className="balance-summary" to="/balance">
        <BalanceIcon aria-hidden="true" className="card-icon" focusable="false" weight="duotone" />
        <span className="balance-summary-copy">
          <small>Assessment coverage · {coverage.ready ? 'ready' : 'needs information'}</small>
          <strong>{coverage.current.substantive} of {coverage.current.total} recent answers are usable</strong>
        </span>
        <ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" />
      </Link>
      <p className="eyebrow today-feed-label">For today</p>
      <article className="daily-focus">
        <p className="eyebrow">Today’s focus</p>
        <h2>{recommendation.title}</h2>
        <p>{recommendation.guidance}</p>
        <div className="practical-action">
          <p className="eyebrow">Try this</p>
          <strong>{recommendation.action}</strong>
          {recommendation.checkInSetId ? <Link className="icon-label" to={`/questions/check-in/new?set=${recommendation.checkInSetId}`}><QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />Start this check-in<ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" /></Link> : null}
        </div>
        {currentRecord?.status === 'completed' ? <p className="completion-note icon-label" role="status"><CompleteIcon aria-hidden="true" className="icon-leading" focusable="false" weight="fill" />Marked complete for today.</p> : null}
        <div className="recommendation-actions">
          <button className="button primary icon-label" type="button" disabled={currentRecord?.status === 'completed'} onClick={() => updateRecommendation('completed')}><CompleteIcon aria-hidden="true" className="icon-leading" focusable="false" />Mark complete</button>
          <button className="button secondary icon-label" type="button" onClick={() => updateRecommendation('dismissed')}><DismissIcon aria-hidden="true" className="icon-leading" focusable="false" />Dismiss</button>
          <button className="text-button icon-label" type="button" onClick={() => dispatch({ type: 'clear-active-recommendation' })}><ShowAnotherIcon aria-hidden="true" className="icon-leading" focusable="false" />Show another</button>
        </div>
        <Link className="text-link icon-label" to={`/learn/${recommendation.relatedArticleId}`}><LearnIcon aria-hidden="true" className="icon-leading" focusable="false" />Read related guidance<ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" /></Link>
      </article>
      <section className={recommendation.food.status === 'withheld' ? 'today-secondary withheld' : 'today-secondary'} aria-labelledby="food-title">
        <p className="eyebrow">Optional food prompt</p>
        <h2 className="section-title-with-icon" id="food-title"><FoodIcon aria-hidden="true" className="icon-leading" focusable="false" weight="duotone" />{recommendation.food.title}</h2>
        <p>{recommendation.food.body}</p>
      </section>
      <button className="disclosure" type="button" aria-expanded={whyOpen} onClick={() => setWhyOpen(!whyOpen)}>
        <span className="icon-label"><WhyIcon aria-hidden="true" className="icon-leading" focusable="false" />Why this was chosen</span><span aria-hidden="true">{whyOpen ? '−' : '+'}</span>
      </button>
      {whyOpen ? (
        <div className="disclosure-panel">
          <ul>{recommendation.why.map((reason) => <li key={reason}>{reason}</li>)}</ul>
          <p>{recommendation.food.reason}</p>
        </div>
      ) : null}
      <section className="today-guide" aria-labelledby="today-guide-title">
        <p className="eyebrow">Keep close</p>
        <h2 id="today-guide-title">Your guide</h2>
        <div className="today-guide-grid">
          <Link to="/balance">
            <NatureIcon aria-hidden="true" className="card-icon" focusable="false" weight="duotone" />
            <span><strong>Your usual nature</strong><small>Assessment and check-in history</small></span>
            <ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" />
          </Link>
          <Link to="/settings">
            <FoodIcon aria-hidden="true" className="card-icon" focusable="false" weight="duotone" />
            <span><strong>Food preferences</strong><small>{state.profile.dietaryPattern || 'No dietary pattern saved'}</small></span>
            <ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" />
          </Link>
          <Link to="/profile/location">
            <LocationIcon aria-hidden="true" className="card-icon" focusable="false" weight="duotone" />
            <span><strong>Local rhythms</strong><small>{state.profile.location?.displayLabel || (state.profile.location?.areaId ? 'General area saved' : 'Add a general area')}</small></span>
            <ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" />
          </Link>
        </div>
      </section>
      <Link className="question-count" to="/questions">
        <span className="card-link-heading"><QuestionsIcon aria-hidden="true" className="card-icon" focusable="false" weight="duotone" /><strong>{coverage.ready ? 'Review assessment coverage' : 'More information is useful'}</strong></span>
        <span className="icon-label">{coverage.ready ? 'See answer coverage' : 'Answer the next useful question'}<ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" /></span>
      </Link>
      <Link className="assistant-card" to="/assistant"><span className="card-link-heading"><GuidedHelpIcon aria-hidden="true" className="card-icon" focusable="false" weight="duotone" /><strong>Search the learning catalog</strong></span><span className="icon-label">Open deterministic guided help<ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" /></span></Link>
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
