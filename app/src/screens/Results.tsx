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
    dispatch({
      type: 'set-dosha-fixture',
      fixtureId: outcome.kind === 'development-fixture' ? outcome.fixture.fixtureId : null,
    })
    dispatch({ type: 'visit-today' })
    navigate('/today')
  }

  if (outcome.kind === 'insufficient-coverage') {
    return <MoreInformationNeeded coverage={outcome.coverage} />
  }

  if (outcome.kind === 'development-fixture') {
    return (
      <Screen className="results-screen">
        <p className="stage-badge">Sample profile</p>
        <h1 tabIndex={-1}>Profile overview</h1>
        <p className="supporting">This controlled sample shows the post-assessment layout before enough answers are available for an estimate.</p>
        <article className="result-card nature-card">
          <p className="eyebrow">Your nature</p>
          <h2>{outcome.fixture.baselineLabel}</h2>
          <p>Controlled example for reviewing the profile layout.</p>
        </article>
        <article className="result-card current-card">
          <p className="eyebrow">Your current balance</p>
          <h2>{outcome.fixture.currentLabel}</h2>
          <p>Controlled example for reviewing the current-balance layout.</p>
        </article>
        <CoverageDetail coverage={outcome.coverage} />
        <button className="button primary" type="button" onClick={goToToday}>Continue to Today</button>
        <Link className="button secondary" to="/results">Return to real coverage result</Link>
      </Screen>
    )
  }

  return (
    <Screen className="results-screen">
      <p className="stage-badge">Prototype estimate</p>
      <h1 tabIndex={-1}>Your dosha profile</h1>
      <p className="supporting">This answer-derived estimate uses simple draft weights so you can evaluate the experience. It keeps your usual nature separate from your recent pattern.</p>
      <article className="result-card nature-card">
        <p className="eyebrow">Your usual nature</p>
        <p className="time-context">Usual adult tendencies when generally well</p>
        <h2>{outcome.scoring.baselineLabel}</h2>
        <p>{outcome.coverage.baseline.substantive} substantive answers contributed to this prototype estimate.</p>
      </article>
      <article className="result-card current-card">
        <p className="eyebrow">Your recent pattern</p>
        <p className="time-context">Based on the past seven days</p>
        <h2>{outcome.scoring.currentLabel}</h2>
        <p>{outcome.coverage.current.substantive} recent answers contributed to this prototype estimate.</p>
      </article>
      <details className="coverage-detail profile-detail">
        <summary>How this prototype estimate works</summary>
        <p>Each directional answer adds one draft point to Vata, Pitta, or Kapha. A second dosha is included when its total is at least 75% of the leading total. Recent “close to usual” answers add no elevation.</p>
        <p>Model {outcome.scoring.scoringModelVersion}; rule {outcome.scoring.ruleIds.join(', ')}.</p>
      </details>
      <CoverageDetail coverage={outcome.coverage} />
      <p className="boundary-note">Prototype estimate based on self-reported information. Educational, not a medical diagnosis.</p>
      <button className="button primary" type="button" onClick={goToToday}>Go to Today</button>
      <Link className="button secondary" to="/questions/assessment">Manage initial assessment</Link>
      {shortModeAllowed() ? (
        <div className="dev-control">
          <strong>Sample profile</strong>
          <Link to="/results?fixture=profile">View complete sample</Link>
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
          <strong>Sample profile</strong>
          <p>Open a complete sample when reviewing post-assessment screens.</p>
          <Link to="/results?fixture=profile">View complete sample</Link>
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
      <p>Coverage is calculated separately from the prototype dosha estimate.</p>
    </details>
  )
}
