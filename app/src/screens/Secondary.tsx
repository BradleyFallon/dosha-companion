import { Link } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import { CoverageDetail } from './Results'
import { getCheckInQuestionSet } from '../content/repository'
import { initialAssessment } from '../generated/initialAssessment'

export function QuestionsScreen() {
  const { state } = usePrototype()
  const coverage = calculateAssessmentCoverage({
    submittedAnswers: state.submittedAnswers,
    skippedQuestionIds: state.skippedQuestionIds,
  })
  const incomplete = state.checkIns.find((checkIn) => !checkIn.completedAt)
  const recent = state.checkIns.slice(0, 5)

  return (
    <Screen>
      <p className="eyebrow">Assessment and check-ins</p>
      <h1 tabIndex={-1}>Questions</h1>
      <p className="lede">
        Answer missing initial questions or create a separate, dated current-balance check-in.
      </p>
      <div className="queue-list">
        <article><p className="eyebrow">Your usual nature</p><h2>{coverage.baseline.substantive} of {coverage.baseline.total} usable</h2><p>{coverage.baseline.fallback} fallback · {coverage.baseline.skipped} skipped · {coverage.baseline.unanswered} unanswered</p></article>
        <article><p className="eyebrow">Your current check-in</p><h2>{coverage.current.substantive} of {coverage.current.total} usable</h2><p>{coverage.current.fallback} fallback · {coverage.current.skipped} skipped · {coverage.current.unanswered} unanswered</p></article>
      </div>
      <CoverageDetail coverage={coverage} />
      {coverage.nextQuestionId ? (
        <Link className="button secondary" to={`/assessment/question/${coverage.nextQuestionId}?return=questions`}>Answer next useful initial question</Link>
      ) : (
        <p className="completion-note">Initial coverage requirements are met.</p>
      )}
      <Link className="button secondary" to={`/assessment/question/${initialAssessment.questions[0].id}?return=questions`}>Review initial assessment answers</Link>
      <section className="check-in-section" aria-labelledby="current-checkins"><h2 id="current-checkins">Current check-ins</h2><p>Each check-in is a new record about the past seven days. It does not overwrite your baseline.</p>{incomplete ? <Link className="button primary" to={`/questions/check-in/${incomplete.id}`}>Continue incomplete check-in</Link> : <Link className="button primary" to="/questions/check-in/new?set=quick-current">Start current check-in</Link>}<Link className="text-link" to="/questions/check-in/new?set=full-current">Start extended 7-question check-in</Link></section>
      <section aria-labelledby="recent-checkins"><h2 id="recent-checkins">Recent check-ins</h2>{recent.length > 0 ? <ul className="history-list">{recent.map((checkIn) => { const set = getCheckInQuestionSet(checkIn.setId); return <li key={checkIn.id}><span><strong>{set?.title ?? 'Current check-in'}</strong><small>Started {formatDate(checkIn.startedAt)}</small></span><span>{checkIn.completedAt ? `Completed · ${Object.keys(checkIn.answers).length} answers` : `In progress · ${Object.keys(checkIn.answers).length} answers`}</span>{!checkIn.completedAt ? <Link to={`/questions/check-in/${checkIn.id}`}>Resume</Link> : null}</li> })}</ul> : <p className="empty-state">No repeatable check-ins yet.</p>}</section>
      <p className="boundary-note">There is no daily requirement. Coverage is not diagnostic confidence, and no dosha score has been calculated.</p>
    </Screen>
  )
}

export function BalanceScreen() {
  const { state } = usePrototype()
  const coverage = calculateAssessmentCoverage({
    submittedAnswers: state.submittedAnswers,
    skippedQuestionIds: state.skippedQuestionIds,
  })
  const completed = state.checkIns.filter((checkIn) => checkIn.completedAt)
  const incomplete = state.checkIns.find((checkIn) => !checkIn.completedAt)
  const latest = completed[0]

  return (
    <Screen>
      <p className="stage-badge">{coverage.ready ? 'Coverage ready' : 'More information useful'}</p>
      <h1 tabIndex={-1}>My Balance</h1>
      <p className="supporting">This screen reports answer coverage only. Dosha labels and relative measurements are unavailable until expert scoring is approved.</p>
      <CoverageCard title="Your usual nature" timeframe="Usual adult tendencies" substantive={coverage.baseline.substantive} total={coverage.baseline.total} categories={coverage.baseline.categoriesCovered} />
      <CoverageCard title="Your current check-in" timeframe="Past seven days" substantive={coverage.current.substantive} total={coverage.current.total} categories={coverage.current.categoriesCovered} />
      <article className="result-card"><p className="eyebrow">Repeatable current check-ins</p><h2>{completed.length} completed</h2><p>{latest?.completedAt ? `Latest completed ${formatDate(latest.completedAt)}.` : 'No dated current check-in has been completed yet.'}</p>{incomplete ? <Link to={`/questions/check-in/${incomplete.id}`}>Continue incomplete check-in →</Link> : <Link to="/questions/check-in/new?set=quick-current">Start a current check-in →</Link>}</article>
      <div className="scoring-boundary"><h2>No dosha result calculated</h2><p>The repository contains no approved numerical answer weights or result thresholds.</p></div>
      <CoverageDetail coverage={coverage} />
      {coverage.nextQuestionId ? <Link className="button primary" to={`/assessment/question/${coverage.nextQuestionId}?return=results`}>Improve coverage</Link> : null}
      <Link className="button secondary" to="/questions">Review answers and check-in history</Link>
      <Link className="button secondary" to="/learn/nature-and-current-balance">Learn about nature and current balance</Link>
      <Link className="button secondary" to="/settings">Edit profile settings</Link>
      <Link className="button secondary" to="/profile/location">Edit or remove location</Link>
    </Screen>
  )
}

function CoverageCard({ title, timeframe, substantive, total, categories }: { title: string; timeframe: string; substantive: number; total: number; categories: number }) {
  return (
    <article className="result-card">
      <p className="eyebrow">{title}</p><p className="time-context">{timeframe}</p>
      <h2>{substantive} of {total} usable answers</h2>
      <p>{categories} categories have substantive coverage. No dosha interpretation was applied.</p>
    </article>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}
