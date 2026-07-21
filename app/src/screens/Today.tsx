import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContextChatLink } from '../components/ContextChatLink'
import { LocalizedTodayContent } from '../components/LocalizedTodayContent'
import { LocationBenefitCard } from '../components/LocationBenefitCard'
import { DoshaProfileSummary } from '../components/DoshaProfileSummary'
import { Screen } from '../components/Layout'
import { selectDailyRecommendation } from '../content/recommendations'
import { usePrototype } from '../prototype/PrototypeContext'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import { calculatePrototypeDoshaResult } from '../quiz/result'
import {
  CompleteIcon,
  DailyRoutineIcon,
  DismissIcon,
  InfoIcon,
  LearnIcon,
  QuestionsIcon,
  SettingsIcon,
  ShowAnotherIcon,
} from '../ui/icons'

export function TodayScreen() {
  const { state, dispatch } = usePrototype()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const coverage = calculateAssessmentCoverage({
    submittedAnswers: state.submittedAnswers,
    skippedQuestionIds: state.skippedQuestionIds,
  })
  const latestCheckIn = [...state.checkIns]
    .filter((checkIn) => checkIn.completedAt)
    .sort((left, right) => Date.parse(right.completedAt ?? '') - Date.parse(left.completedAt ?? ''))[0]
  const doshaResult = calculatePrototypeDoshaResult({
    submittedAnswers: state.submittedAnswers,
    skippedQuestionIds: state.skippedQuestionIds,
    currentAnswers: latestCheckIn?.answers,
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
  const now = new Date()
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone,
  }).format(now)
  const greeting = greetingForTime(now, timeZone)
  const name = state.profile.preferredName || 'there'

  useEffect(() => {
    if (!currentRecord) dispatch({ type: 'show-recommendation', recommendationId: recommendation.id, date: recommendation.selectionDate })
  }, [currentRecord, dispatch, recommendation.id, recommendation.selectionDate])

  useEffect(() => setJustCompleted(false), [recommendation.id, recommendation.selectionDate])

  function updateRecommendation(status: 'completed' | 'dismissed') {
    setJustCompleted(status === 'completed')
    dispatch({ type: 'recommendation-status', recommendationId: recommendation.id, date: recommendation.selectionDate, status })
    if (status === 'dismissed') dispatch({ type: 'clear-active-recommendation' })
  }

  function showAnotherRecommendation() {
    setJustCompleted(false)
    dispatch({ type: 'clear-active-recommendation' })
  }

  const recommendationComplete = currentRecord?.status === 'completed'
  const focusClassName = `daily-focus${recommendationComplete ? ' recommendation-complete' : ''}${justCompleted ? ' recommendation-just-completed' : ''}`

  return (
    <Screen className="today-screen">
      <header className="today-header">
        <div><p className="today-date">{date}</p><h1 tabIndex={-1}>{greeting}, {name}</h1></div>
        <Link className="icon-control" to="/settings" aria-label="Open settings"><SettingsIcon aria-hidden="true" focusable="false" /></Link>
      </header>

      <DoshaProfileSummary fixtureId={state.doshaFixtureId} href="/balance" result={doshaResult} />

      <article className={focusClassName}>
        <button className="icon-control recommendation-info-control" type="button" aria-label={detailsOpen ? 'Hide recommendation details' : 'Show recommendation details'} aria-expanded={detailsOpen} onClick={() => setDetailsOpen(!detailsOpen)}><InfoIcon aria-hidden="true" focusable="false" /></button>
        <DailyRoutineIcon aria-hidden="true" className="recommendation-icon" focusable="false" weight="duotone" />
        <h2>{recommendation.title}</h2>
        <p className="recommendation-action">{recommendation.action}</p>
        {recommendationComplete ? <p className="completion-note icon-label" role="status"><CompleteIcon aria-hidden="true" className="icon-leading" focusable="false" weight="fill" />Complete for today</p> : null}
        <div className="recommendation-icon-actions" aria-label="Recommendation actions" role="group">
          <button className="recommendation-action-control primary-recommendation-action" type="button" aria-label="Mark recommendation complete" disabled={recommendationComplete} onClick={() => updateRecommendation('completed')}><CompleteIcon aria-hidden="true" focusable="false" weight={recommendationComplete ? 'fill' : 'regular'} /><span>Done</span></button>
          <button className="recommendation-action-control" type="button" aria-label="Show another recommendation" onClick={showAnotherRecommendation}><ShowAnotherIcon aria-hidden="true" focusable="false" /><span>Another</span></button>
          <ContextChatLink ariaLabel="Ask about this recommendation" className="recommendation-action-control" context={{ type: 'recommendation', id: recommendation.id }} returnTo="/today">Ask</ContextChatLink>
        </div>
        {detailsOpen ? (
          <div className="recommendation-details">
            <p>{recommendation.guidance}</p>
            {recommendation.checkInSetId ? <Link className="text-link icon-label" to={`/questions/check-in/new?set=${recommendation.checkInSetId}`}><QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />Start this check-in</Link> : null}
            <Link className="text-link icon-label" to={`/learn/${recommendation.relatedArticleId}`}><LearnIcon aria-hidden="true" className="icon-leading" focusable="false" />Read related guidance</Link>
            <p className={recommendation.food.status === 'withheld' ? 'recommendation-food withheld' : 'recommendation-food'}><strong>{recommendation.food.title}</strong><span>{recommendation.food.body}</span></p>
            <h3>Why it was chosen</h3>
            <ul>{recommendation.why.map((reason) => <li key={reason}>{reason}</li>)}</ul>
            <button className="text-button icon-label" type="button" onClick={() => updateRecommendation('dismissed')}><DismissIcon aria-hidden="true" className="icon-leading" focusable="false" />Dismiss for today</button>
          </div>
        ) : null}
      </article>

      {state.profile.location ? <LocalizedTodayContent profile={state.profile} /> : <LocationBenefitCard returnTo="/today" />}

      <nav className="today-destinations" aria-label="Today shortcuts">
        <Link to="/questions"><QuestionsIcon aria-hidden="true" focusable="false" /><span><strong>Check in</strong><small>{latestCheckInLabel(state.checkIns)}</small></span></Link>
        <Link to="/learn"><LearnIcon aria-hidden="true" focusable="false" /><span><strong>Learn</strong><small>Browse the library</small></span></Link>
      </nav>
    </Screen>
  )
}

function latestCheckInLabel(checkIns: Array<{ completedAt: string | null }>) {
  const latest = checkIns.find((item) => item.completedAt)
  return latest?.completedAt ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(latest.completedAt)) : 'Whenever you’re ready'
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
