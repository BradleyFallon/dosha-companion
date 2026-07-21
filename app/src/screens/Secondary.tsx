import { Link, Navigate, useParams } from 'react-router-dom'
import { BackLink, Screen } from '../components/Layout'
import { CheckInTimeline } from '../components/CheckInTimeline'
import { PatternCoverageRing } from '../components/PatternCoverageRing'
import {
  isBalanceDomain,
} from '../balance/domains'
import { balanceIconFor } from '../balance/domainIcons'
import {
  buildBalanceViewModel,
  comparisonAccessibleLabel,
  comparisonLabel,
  type BalanceComparisonState,
} from '../balance/model'
import { usePrototype } from '../prototype/PrototypeContext'
import { calculateAssessmentCoverage, COVERAGE_REQUIREMENTS } from '../quiz/coverage'
import { getCheckInQuestionSet } from '../content/repository'
import { initialAssessment } from '../generated/initialAssessment'
import { calculatePrototypeDoshaResult } from '../quiz/result'
import type { CheckIn } from '../prototype/state'
import {
  AssessmentIcon,
  CheckInIcon,
  CompleteIcon,
  CurrentBalanceIcon,
  ForwardIcon,
  HistoryIcon,
  NatureIcon,
  InfoIcon,
} from '../ui/icons'
import { ContextChatLink } from '../components/ContextChatLink'
import { DoshaProfileSummary } from '../components/DoshaProfileSummary'

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
  const { domain: domainId } = useParams()
  const { state } = usePrototype()
  if (domainId && !isBalanceDomain(domainId)) return <Navigate replace to="/balance" />

  const incomplete = state.checkIns.find((checkIn) => !checkIn.completedAt)
  const view = buildBalanceViewModel(state)
  const latestCheckIn = state.checkIns.find((checkIn) => checkIn.id === view.latestCheckInId)
  const doshaResult = calculatePrototypeDoshaResult({
    submittedAnswers: state.submittedAnswers,
    skippedQuestionIds: state.skippedQuestionIds,
    currentAnswers: latestCheckIn?.answers,
  })
  const selected = domainId ? view.domains.find((domain) => domain.id === domainId) : null
  const SelectedIcon = selected ? balanceIconFor(selected.iconKey) : null
  const recentHref = view.latestCheckInId ? `/questions/check-in/${view.latestCheckInId}` : '/questions'

  return (
    <Screen className="balance-screen">
      <div className="balance-heading">
        <h1 tabIndex={-1}>My Balance</h1>
        <details className="balance-info">
          <summary aria-label="About My Balance"><InfoIcon aria-hidden="true" focusable="false" /></summary>
          <p>This view includes an answer-derived prototype dosha estimate. It uses draft unit weights for interface testing and is not a diagnosis.</p>
        </details>
      </div>

      <DoshaProfileSummary fixtureId={state.doshaFixtureId} prominent result={doshaResult} />

      <div aria-label="Pattern information" className="pattern-rings">
        <PatternCoverageRing
          href="/questions/assessment"
          icon={NatureIcon}
          label="Usual"
          represented={view.usual.represented}
          total={view.usual.total}
        />
        <PatternCoverageRing
          href={recentHref}
          icon={CurrentBalanceIcon}
          label="Recent"
          represented={view.recent.represented}
          total={view.recent.total}
        />
      </div>

      <div aria-label="Recent balance areas" className="balance-domain-grid">
        {view.domains.map((domain) => {
          const Icon = balanceIconFor(domain.iconKey)
          const label = comparisonAccessibleLabel(domain.comparison)
          return (
            <Link
              aria-label={`${domain.label}: ${label}`}
              className={`balance-domain-control ${domain.comparison}`}
              key={domain.id}
              to={`/balance/${domain.id}`}
            >
              <span className="balance-domain-icon"><Icon aria-hidden="true" focusable="false" weight="duotone" /></span>
              <span>{domain.label}</span>
            </Link>
          )
        })}
      </div>

      {selected ? (
        <section aria-labelledby="balance-domain-title" className={`balance-domain-detail ${selected.comparison}`}>
          <Link aria-label={`Close ${selected.label} details`} className="balance-detail-close" to="/balance">Close</Link>
          {SelectedIcon ? <SelectedIcon aria-hidden="true" focusable="false" weight="duotone" /> : null}
          <h2 id="balance-domain-title">{selected.label}</h2>
          <dl>
            <div><dt>Recent</dt><dd>{selected.recent?.shortLabel ?? 'No recent information'}</dd></div>
            <div><dt>Usual</dt><dd>{selected.usual?.shortLabel ?? 'No usual information'}</dd></div>
          </dl>
          <p className="balance-comparison-label"><span aria-hidden="true">{comparisonSymbol(selected.comparison)}</span>{comparisonLabel(selected.comparison)}</p>
          <ContextChatLink context={{ type: 'balance-domain', id: selected.id }} returnTo="/balance">Ask about this</ContextChatLink>
          {(selected.recent || selected.usual) ? (
            <details className="compact-details balance-response-details">
              <summary>View response details</summary>
              {selected.recent ? <p><strong>Recent:</strong> {selected.recent.fullText}</p> : null}
              {selected.usual ? <p><strong>Usual:</strong> {selected.usual.fullText}</p> : null}
            </details>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="balance-timeline-title" className="balance-timeline-section">
        <h2 className="sr-only" id="balance-timeline-title">Check-in timeline</h2>
        <CheckInTimeline items={view.timeline} />
      </section>

      <Link className="button primary balance-primary-action" to={incomplete ? `/questions/check-in/${incomplete.id}` : '/questions/check-in/new?set=quick-current'}>
        <CheckInIcon aria-hidden="true" className="icon-leading" focusable="false" />
        {incomplete ? 'Continue' : 'Check In'}
      </Link>
    </Screen>
  )
}

function comparisonSymbol(comparison: BalanceComparisonState) {
  if (comparison === 'close-to-usual') return '≈'
  if (comparison === 'changed-from-usual') return '↔'
  if (comparison === 'recent-only') return '●'
  if (comparison === 'usual-only') return '○'
  return '·'
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
