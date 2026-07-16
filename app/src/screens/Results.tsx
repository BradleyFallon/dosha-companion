import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import {
  COVERAGE_REQUIREMENTS,
  coverageRequirementText,
  type AssessmentCoverage,
} from '../quiz/coverage'
import { resolveAssessmentOutcome } from '../quiz/result'
import { shortModeAllowed } from '../quiz/assessment'

export function ResultScreen() {
  const { state, dispatch } = usePrototype()
  const navigate = useNavigate()
  const location = useLocation()
  const fixtureRequested =
    shortModeAllowed() && new URLSearchParams(location.search).get('fixture') === 'profile'
  const outcome = resolveAssessmentOutcome(
    {
      submittedAnswers: state.submittedAnswers,
      skippedQuestionIds: state.skippedQuestionIds,
    },
    { allowDevelopmentFixture: shortModeAllowed(), fixtureRequested },
  )

  function goToToday() {
    dispatch({ type: 'visit-today' })
    navigate(outcome.kind === 'development-fixture' ? '/today?fixture=profile' : '/today')
  }

  if (outcome.kind === 'insufficient-coverage') {
    return <MoreInformationNeeded coverage={outcome.coverage} />
  }

  if (outcome.kind === 'development-fixture') {
    return (
      <Screen className="results-screen">
        <p className="fixture-banner" role="status">{outcome.fixture.notice}</p>
        <p className="stage-badge">Development preview</p>
        <h1 tabIndex={-1}>Fixture profile hierarchy</h1>
        <p className="supporting">These labels are provided only to test the post-result interface. They do not use your answers or a scoring model.</p>
        <article className="result-card nature-card">
          <p className="eyebrow">Fixture · your nature</p>
          <h2>{outcome.fixture.baselineLabel}</h2>
          <p>Not calculated. Expert-approved weights and thresholds are still required.</p>
        </article>
        <article className="result-card current-card">
          <p className="eyebrow">Fixture · your current balance</p>
          <h2>{outcome.fixture.currentLabel}</h2>
          <p>Not calculated from recent answers.</p>
        </article>
        <CoverageDetail coverage={outcome.coverage} />
        <button className="button primary" type="button" onClick={goToToday}>Preview Today with fixture</button>
        <Link className="button secondary" to="/results">Return to real coverage result</Link>
      </Screen>
    )
  }

  return (
    <Screen className="results-screen">
      <p className="stage-badge">Coverage ready</p>
      <h1 tabIndex={-1}>Your assessment summary</h1>
      <p className="supporting">You provided enough usable information for the draft assessment. A dosha result cannot be calculated until numerical weights and thresholds receive expert approval.</p>
      <article className="result-card nature-card">
        <p className="eyebrow">Your usual nature</p>
        <p className="time-context">Usual adult tendencies when generally well</p>
        <h2>{outcome.coverage.baseline.substantive} of {outcome.coverage.baseline.total} usable answers</h2>
        <p>{outcome.coverage.baseline.categoriesCovered} baseline categories have substantive coverage. No constitution label has been inferred.</p>
      </article>
      <article className="result-card current-card">
        <p className="eyebrow">Your current check-in</p>
        <p className="time-context">Based on the past seven days</p>
        <h2>{outcome.coverage.current.substantive} of {outcome.coverage.current.total} usable answers</h2>
        <p>{outcome.coverage.current.categoriesCovered} recent categories have substantive coverage. No current dosha label has been inferred.</p>
      </article>
      <div className="scoring-boundary">
        <h2>Dosha scoring is not available yet</h2>
        <p>{outcome.scoring.reason}</p>
      </div>
      <CoverageDetail coverage={outcome.coverage} />
      <p className="boundary-note">Based on self-reported information. Educational, not a medical diagnosis.</p>
      <button className="button primary" type="button" onClick={goToToday}>Go to Today</button>
      <Link className="button secondary" to="/questions">Review coverage</Link>
      {shortModeAllowed() ? (
        <div className="dev-control">
          <strong>Developer preview</strong>
          <Link to="/results?fixture=profile">View explicit fixture-only result</Link>
        </div>
      ) : null}
    </Screen>
  )
}

function MoreInformationNeeded({ coverage }: { coverage: AssessmentCoverage }) {
  const nextQuestion = coverage.nextQuestionId

  return (
    <Screen>
      <p className="eyebrow">Assessment coverage</p>
      <h1 tabIndex={-1}>A little more information is needed</h1>
      <p className="lede">You can still skip questions. We need a few more substantive answers before marking the assessment coverage ready.</p>
      <ul className="coverage-requirements">
        {coverage.unmetRequirements.map((requirement) => (
          <li key={requirement}>{coverageRequirementText(requirement)}</li>
        ))}
      </ul>
      <CoverageDetail coverage={coverage} />
      {nextQuestion ? (
        <Link className="button primary" to={`/assessment/question/${nextQuestion}?return=results`}>
          Answer next useful question
        </Link>
      ) : null}
      <Link className="button secondary" to="/">Save and exit</Link>
      {shortModeAllowed() ? (
        <div className="dev-control">
          <strong>Development only</strong>
          <p>Short mode cannot satisfy the real {COVERAGE_REQUIREMENTS.submittedOverall}/{COVERAGE_REQUIREMENTS.substantiveBaseline}/{COVERAGE_REQUIREMENTS.substantiveCurrent} policy.</p>
          <Link to="/results?fixture=profile">Open the explicit fixture preview</Link>
        </div>
      ) : null}
      <p className="boundary-note">Coverage describes how much usable self-reported information is present. It is not diagnostic confidence.</p>
    </Screen>
  )
}

export function CoverageDetail({ coverage }: { coverage: AssessmentCoverage }) {
  return (
    <details className="coverage-detail">
      <summary>How coverage was determined</summary>
      <dl>
        <div><dt>Policy</dt><dd>{coverage.policyVersion}</dd></div>
        <div><dt>Submitted overall</dt><dd>{coverage.submittedOverall} of {COVERAGE_REQUIREMENTS.submittedOverall} needed</dd></div>
        <div><dt>Usable usual-nature answers</dt><dd>{coverage.baseline.substantive} of {COVERAGE_REQUIREMENTS.substantiveBaseline} needed</dd></div>
        <div><dt>Usable recent answers</dt><dd>{coverage.current.substantive} of {COVERAGE_REQUIREMENTS.substantiveCurrent} needed</dd></div>
        <div><dt>Not sure or fallback answers</dt><dd>{coverage.fallbackAnswerIds.length}</dd></div>
        <div><dt>Skipped</dt><dd>{coverage.skippedQuestionIds.length}</dd></div>
        <div><dt>Unanswered</dt><dd>{coverage.unansweredQuestionIds.length}</dd></div>
      </dl>
      <p>No answer weights or dosha rules were applied.</p>
    </details>
  )
}
