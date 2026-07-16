import { Link } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import { CoverageDetail } from './Results'
import { getCheckInQuestionSet } from '../content/repository'
import { initialAssessment } from '../generated/initialAssessment'
import {
  CompleteIcon,
  CurrentBalanceIcon,
  ForwardIcon,
  LearnIcon,
  LocationIcon,
  NatureIcon,
  QuestionsIcon,
  SettingsIcon,
  WarningIcon,
} from '../ui/icons'
import { locationEntryPath } from '../location/returnTargets'

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
      <h1 className="section-title-with-icon" tabIndex={-1}><QuestionsIcon aria-hidden="true" className="heading-icon" focusable="false" weight="duotone" />Questions</h1>
      <p className="lede">
        Answer missing initial questions or create a separate, dated current-balance check-in.
      </p>
      <div className="queue-list">
        <article><p className="eyebrow">Your usual nature</p><h2>{coverage.baseline.substantive} of {coverage.baseline.total} usable</h2><p>{coverage.baseline.fallback} fallback · {coverage.baseline.skipped} skipped · {coverage.baseline.unanswered} unanswered</p></article>
        <article><p className="eyebrow">Your current check-in</p><h2>{coverage.current.substantive} of {coverage.current.total} usable</h2><p>{coverage.current.fallback} fallback · {coverage.current.skipped} skipped · {coverage.current.unanswered} unanswered</p></article>
      </div>
      <CoverageDetail coverage={coverage} />
      {coverage.nextQuestionId ? (
        <Link className="button secondary icon-label" to={`/assessment/question/${coverage.nextQuestionId}?return=questions`}><QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />Answer next useful initial question</Link>
      ) : (
        <p className="completion-note icon-label"><CompleteIcon aria-hidden="true" className="icon-leading" focusable="false" weight="fill" />Initial coverage requirements are met.</p>
      )}
      <Link className="button secondary icon-label" to={`/assessment/question/${initialAssessment.questions[0].id}?return=questions`}><QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />Review initial assessment answers</Link>
      <section className="check-in-section" aria-labelledby="current-checkins"><h2 className="section-title-with-icon" id="current-checkins"><CurrentBalanceIcon aria-hidden="true" className="icon-leading" focusable="false" weight="duotone" />Current check-ins</h2><p>Each check-in is a new record about the past seven days. It does not overwrite your baseline.</p>{incomplete ? <Link className="button primary icon-label" to={`/questions/check-in/${incomplete.id}`}><QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />Continue incomplete check-in</Link> : <Link className="button primary icon-label" to="/questions/check-in/new?set=quick-current"><QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />Start current check-in</Link>}<Link className="text-link icon-label" to="/questions/check-in/new?set=full-current"><QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />Start extended 7-question check-in</Link></section>
      <section aria-labelledby="recent-checkins"><h2 className="section-title-with-icon" id="recent-checkins"><QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />Recent check-ins</h2>{recent.length > 0 ? <ul className="history-list">{recent.map((checkIn) => { const set = getCheckInQuestionSet(checkIn.setId); const StatusIcon = checkIn.completedAt ? CompleteIcon : CurrentBalanceIcon; return <li key={checkIn.id}><span><strong>{set?.title ?? 'Current check-in'}</strong><small>Started {formatDate(checkIn.startedAt)}</small></span><span className="icon-label"><StatusIcon aria-hidden="true" className="icon-leading" focusable="false" weight={checkIn.completedAt ? 'fill' : 'regular'} />{checkIn.completedAt ? `Completed · ${Object.keys(checkIn.answers).length} answers` : `In progress · ${Object.keys(checkIn.answers).length} answers`}</span>{!checkIn.completedAt ? <Link to={`/questions/check-in/${checkIn.id}`}>Resume</Link> : null}</li> })}</ul> : <p className="empty-state">No repeatable check-ins yet.</p>}</section>
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
      <CoverageCard kind="nature" title="Your usual nature" timeframe="Usual adult tendencies" substantive={coverage.baseline.substantive} total={coverage.baseline.total} categories={coverage.baseline.categoriesCovered} />
      <CoverageCard kind="current" title="Your current check-in" timeframe="Past seven days" substantive={coverage.current.substantive} total={coverage.current.total} categories={coverage.current.categoriesCovered} />
      <article className="result-card"><p className="eyebrow section-title-with-icon"><QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />Repeatable current check-ins</p><h2>{completed.length} completed</h2><p>{latest?.completedAt ? `Latest completed ${formatDate(latest.completedAt)}.` : 'No dated current check-in has been completed yet.'}</p>{incomplete ? <Link className="icon-label" to={`/questions/check-in/${incomplete.id}`}>Continue incomplete check-in<ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" /></Link> : <Link className="icon-label" to="/questions/check-in/new?set=quick-current">Start a current check-in<ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" /></Link>}</article>
      <div className="scoring-boundary"><h2 className="section-title-with-icon"><WarningIcon aria-hidden="true" className="icon-leading" focusable="false" />No dosha result calculated</h2><p>The repository contains no approved numerical answer weights or result thresholds.</p></div>
      <CoverageDetail coverage={coverage} />
      {coverage.nextQuestionId ? <Link className="button primary" to={`/assessment/question/${coverage.nextQuestionId}?return=results`}>Improve coverage</Link> : null}
      <Link className="button secondary icon-label" to="/questions"><QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />Review answers and check-in history</Link>
      <Link className="button secondary icon-label" to="/learn/nature-and-current-balance"><LearnIcon aria-hidden="true" className="icon-leading" focusable="false" />Learn about nature and current balance</Link>
      <Link className="button secondary icon-label" to="/settings"><SettingsIcon aria-hidden="true" className="icon-leading" focusable="false" />Edit profile settings</Link>
      {state.profile.location ? <Link className="button secondary icon-label" to={locationEntryPath('/balance')}><LocationIcon aria-hidden="true" className="icon-leading" focusable="false" />Change regional location</Link> : null}
    </Screen>
  )
}

function CoverageCard({ kind, title, timeframe, substantive, total, categories }: { kind: 'nature' | 'current'; title: string; timeframe: string; substantive: number; total: number; categories: number }) {
  const Icon = kind === 'nature' ? NatureIcon : CurrentBalanceIcon
  return (
    <article className="result-card">
      <p className="eyebrow section-title-with-icon"><Icon aria-hidden="true" className="icon-leading" focusable="false" weight="duotone" />{title}</p><p className="time-context">{timeframe}</p>
      <h2>{substantive} of {total} usable answers</h2>
      <p>{categories} categories have substantive coverage. No dosha interpretation was applied.</p>
    </article>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}
