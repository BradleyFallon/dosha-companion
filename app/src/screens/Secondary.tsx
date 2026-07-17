import { Link } from 'react-router-dom'
import { BackLink, Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { calculateAssessmentCoverage, COVERAGE_REQUIREMENTS } from '../quiz/coverage'
import { CoverageDetail } from './Results'
import { getCheckInQuestionSet } from '../content/repository'
import { initialAssessment } from '../generated/initialAssessment'
import type { CheckIn } from '../prototype/state'
import {
  AssessmentIcon,
  CheckInIcon,
  CompleteIcon,
  CurrentBalanceIcon,
  ForwardIcon,
  HistoryIcon,
  LearnIcon,
  LocationIcon,
  NatureIcon,
  SettingsIcon,
  WarningIcon,
} from '../ui/icons'
import { locationEntryPath } from '../location/returnTargets'
import { ContextChatLink } from '../components/ContextChatLink'

export function QuestionsScreen() {
  const { state } = usePrototype()
  const coverage = calculateAssessmentCoverage({
    submittedAnswers: state.submittedAnswers,
    skippedQuestionIds: state.skippedQuestionIds,
  })
  const incomplete = state.checkIns.find((checkIn) => !checkIn.completedAt)
  const completed = completedCheckIns(state.checkIns)
  const latest = completed[0]
  const recent = completed.slice(1, 3)
  const incompleteSet = incomplete ? getCheckInQuestionSet(incomplete.setId) : null
  const incompleteAnswered = incomplete ? Object.keys(incomplete.answers).length : 0
  const incompleteTotal = incompleteSet?.questionIds.length ?? 0
  const assessmentStatus = coverage.ready ? 'Complete' : `${assessmentRemaining(coverage)} remaining`

  return (
    <Screen className="check-in-screen">
      <h1 tabIndex={-1}>Check In</h1>

      <section className="check-in-primary" aria-labelledby="check-in-primary-title">
        <CurrentBalanceIcon aria-hidden="true" className="check-in-primary-icon" focusable="false" weight="duotone" />
        <p className="check-in-timeframe">Past seven days</p>
        <h2 id="check-in-primary-title">{incomplete ? 'Continue where you left off' : 'How have you felt lately?'}</h2>
        {incomplete ? <p>{incompleteAnswered} of {incompleteTotal} answered</p> : null}
        <Link className="button primary" to={incomplete ? `/questions/check-in/${incomplete.id}` : '/questions/check-in/new?set=quick-current'}>
          {incomplete ? 'Continue' : 'Start check-in'}
        </Link>
        {!incomplete ? (
          <details className="check-in-options">
            <summary>More options</summary>
            <Link className="text-link" to="/questions/check-in/new?set=full-current">Detailed check-in</Link>
          </details>
        ) : null}
      </section>

      {latest ? (
        <section className="check-in-latest" aria-labelledby="last-check-in-title">
          <h2 id="last-check-in-title">Last check-in</h2>
          <ul className="compact-check-in-list"><CheckInRow checkIn={latest} showChat /></ul>
        </section>
      ) : null}

      {recent.length ? (
        <section className="check-in-recent" aria-labelledby="recent-check-in-title">
          <h2 id="recent-check-in-title">Recent</h2>
          <ul className="compact-check-in-list">{recent.map((checkIn) => <CheckInRow checkIn={checkIn} key={checkIn.id} />)}</ul>
          {completed.length > 3 ? <Link className="text-link" to="/questions/history">View all</Link> : null}
        </section>
      ) : null}

      <Link className="compact-destination-row" to="/questions/assessment">
        <AssessmentIcon aria-hidden="true" focusable="false" />
        <span><strong>Initial assessment</strong><small>{assessmentStatus}</small></span>
        <ForwardIcon aria-hidden="true" focusable="false" />
      </Link>
    </Screen>
  )
}

export function CheckInHistoryScreen() {
  const { state } = usePrototype()
  const completed = completedCheckIns(state.checkIns)

  return (
    <Screen className="check-in-history-screen">
      <BackLink label="Check In" to="/questions" />
      <HistoryIcon aria-hidden="true" className="focused-screen-icon" focusable="false" weight="duotone" />
      <h1 tabIndex={-1}>Check-in history</h1>
      {completed.length ? <ul className="compact-check-in-list">{completed.map((checkIn) => <CheckInRow checkIn={checkIn} key={checkIn.id} showChat />)}</ul> : <p>No completed check-ins yet.</p>}
    </Screen>
  )
}

export function AssessmentManagementScreen() {
  const { state } = usePrototype()
  const coverage = calculateAssessmentCoverage({
    submittedAnswers: state.submittedAnswers,
    skippedQuestionIds: state.skippedQuestionIds,
  })
  const remaining = assessmentRemaining(coverage)

  return (
    <Screen className="assessment-management-screen">
      <BackLink label="Check In" to="/questions" />
      <AssessmentIcon aria-hidden="true" className="focused-screen-icon" focusable="false" weight="duotone" />
      <h1 tabIndex={-1}>Initial assessment</h1>
      <p className={coverage.ready ? 'assessment-status complete' : 'assessment-status'}>{coverage.ready ? 'Complete' : `${remaining} ${remaining === 1 ? 'question' : 'questions'} remaining`}</p>
      {coverage.nextQuestionId ? <Link className="button primary" to={`/assessment/question/${coverage.nextQuestionId}?return=assessment`}>Continue assessment</Link> : null}
      <Link className="text-link" to={`/assessment/question/${initialAssessment.questions[0].id}?return=assessment`}>Review answers</Link>
      <details className="coverage-detail assessment-coverage">
        <summary>Coverage details</summary>
        <dl>
          <div><dt>Answered clearly</dt><dd>{coverage.baseline.substantive + coverage.current.substantive}</dd></div>
          <div><dt>Not sure</dt><dd>{coverage.fallbackAnswerIds.length}</dd></div>
          <div><dt>Skipped</dt><dd>{coverage.skippedQuestionIds.length}</dd></div>
          <div><dt>Remaining</dt><dd>{coverage.unansweredQuestionIds.length}</dd></div>
          <div><dt>Areas covered</dt><dd>{coverage.baseline.categoriesCovered + coverage.current.categoriesCovered}</dd></div>
        </dl>
        <p>No answer weights or dosha rules were applied.</p>
      </details>
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
      <article className="result-card"><p className="eyebrow section-title-with-icon"><CheckInIcon aria-hidden="true" className="icon-leading" focusable="false" />Recent check-ins</p><h2>{completed.length} completed</h2><p>{latest?.completedAt ? `Latest completed ${formatDate(latest.completedAt)}.` : 'No dated current check-in has been completed yet.'}</p>{incomplete ? <Link className="icon-label" to={`/questions/check-in/${incomplete.id}`}>Continue incomplete check-in<ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" /></Link> : <Link className="icon-label" to="/questions/check-in/new?set=quick-current">Start a check-in<ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" /></Link>}</article>
      <div className="scoring-boundary"><h2 className="section-title-with-icon"><WarningIcon aria-hidden="true" className="icon-leading" focusable="false" />No dosha result calculated</h2><p>The repository contains no approved numerical answer weights or result thresholds.</p></div>
      <CoverageDetail coverage={coverage} />
      {coverage.nextQuestionId ? <Link className="button primary" to={`/assessment/question/${coverage.nextQuestionId}?return=results`}>Improve coverage</Link> : null}
      <Link className="button secondary icon-label" to="/questions"><CheckInIcon aria-hidden="true" className="icon-leading" focusable="false" />Check in and review history</Link>
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

function CheckInRow({ checkIn, showChat = false }: { checkIn: CheckIn; showChat?: boolean }) {
  const date = formatCheckInDate(checkIn.completedAt ?? checkIn.startedAt)
  return (
    <li>
      <CompleteIcon aria-hidden="true" focusable="false" weight="fill" />
      <Link aria-label={`Review ${date} check-in`} to={`/questions/check-in/${checkIn.id}`}><span>{date}</span></Link>
      {showChat ? <ContextChatLink ariaLabel={`Talk through ${date} check-in`} className="icon-control" context={{ type: 'check-in', id: checkIn.id }} returnTo="/questions" /> : null}
      <ForwardIcon aria-hidden="true" focusable="false" />
    </li>
  )
}

function completedCheckIns(checkIns: CheckIn[]) {
  return checkIns
    .filter((checkIn): checkIn is CheckIn & { completedAt: string } => Boolean(checkIn.completedAt))
    .sort((left, right) => new Date(right.completedAt).getTime() - new Date(left.completedAt).getTime())
}

function assessmentRemaining(coverage: ReturnType<typeof calculateAssessmentCoverage>) {
  if (coverage.ready) return 0
  const submittedDeficit = Math.max(0, COVERAGE_REQUIREMENTS.submittedOverall - coverage.submittedOverall)
  const baselineDeficit = Math.max(0, COVERAGE_REQUIREMENTS.substantiveBaseline - coverage.baseline.substantive)
  const currentDeficit = Math.max(0, COVERAGE_REQUIREMENTS.substantiveCurrent - coverage.current.substantive)
  return Math.max(submittedDeficit, baselineDeficit + currentDeficit, 1)
}

function formatCheckInDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value))
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}
