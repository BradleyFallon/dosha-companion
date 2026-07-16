import { Link } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import { CoverageDetail } from './Results'

export function QuestionsScreen() {
  const { state } = usePrototype()
  const coverage = calculateAssessmentCoverage({
    submittedAnswers: state.submittedAnswers,
    skippedQuestionIds: state.skippedQuestionIds,
  })

  return (
    <Screen>
      <p className="eyebrow">Assessment coverage</p>
      <h1 tabIndex={-1}>Questions</h1>
      <p className="lede">
        {coverage.ready
          ? 'The provisional initial-coverage requirements are met.'
          : 'Another substantive answer would improve the most important missing area.'}
      </p>
      <div className="queue-list">
        <article><p className="eyebrow">Your usual nature</p><h2>{coverage.baseline.substantive} of {coverage.baseline.total} usable</h2><p>{coverage.baseline.fallback} fallback · {coverage.baseline.skipped} skipped · {coverage.baseline.unanswered} unanswered</p></article>
        <article><p className="eyebrow">Your current check-in</p><h2>{coverage.current.substantive} of {coverage.current.total} usable</h2><p>{coverage.current.fallback} fallback · {coverage.current.skipped} skipped · {coverage.current.unanswered} unanswered</p></article>
      </div>
      <CoverageDetail coverage={coverage} />
      {coverage.nextQuestionId ? (
        <Link className="button primary" to={`/assessment/question/${coverage.nextQuestionId}?return=results`}>Answer next useful question</Link>
      ) : (
        <button className="button primary" type="button" disabled>Initial coverage complete</button>
      )}
      <button className="button secondary" type="button" disabled>Refinement questions unavailable pending expert review</button>
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

  return (
    <Screen>
      <p className="stage-badge">{coverage.ready ? 'Coverage ready' : 'More information useful'}</p>
      <h1 tabIndex={-1}>My Balance</h1>
      <p className="supporting">This screen reports answer coverage only. Dosha labels and relative measurements are unavailable until expert scoring is approved.</p>
      <CoverageCard title="Your usual nature" timeframe="Usual adult tendencies" substantive={coverage.baseline.substantive} total={coverage.baseline.total} categories={coverage.baseline.categoriesCovered} />
      <CoverageCard title="Your current check-in" timeframe="Past seven days" substantive={coverage.current.substantive} total={coverage.current.total} categories={coverage.current.categoriesCovered} />
      <div className="scoring-boundary"><h2>No dosha result calculated</h2><p>The repository contains no approved numerical answer weights or result thresholds.</p></div>
      <CoverageDetail coverage={coverage} />
      {coverage.nextQuestionId ? <Link className="button primary" to={`/assessment/question/${coverage.nextQuestionId}?return=results`}>Improve coverage</Link> : null}
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

export function LearnScreen() {
  const items = ['Ayurveda basics', 'Vata', 'Pitta', 'Kapha', 'Constitution versus current balance', 'Glossary']
  return (
    <Screen>
      <p className="eyebrow">Learning library</p>
      <h1 tabIndex={-1}>Learn</h1>
      <p className="lede">The repository contains article placeholders, but none have completed expert review.</p>
      <div className="learn-list">
        {items.map((item) => <div className="unavailable-item" key={item}><strong>{item}</strong><span>Unavailable pending expert review</span></div>)}
      </div>
      <p className="boundary-note">Draft or unapproved material is not presented as published educational content.</p>
    </Screen>
  )
}

export function AssistantScreen() {
  return (
    <Screen><Link className="back-link" to="/today">← Today</Link><p className="eyebrow">Unavailable feature</p><h1 tabIndex={-1}>AI assistant</h1><div className="assistant-placeholder"><h2>Not connected in this milestone</h2><p>A future assistant may use approved sources and a limited profile summary. This app does not call an AI service, retain chat history, or evaluate symptoms.</p><button className="button primary" type="button" disabled>AI assistant unavailable</button><p>Today, Questions, My Balance, Settings, and Learn remain available without this feature.</p></div><p className="boundary-note">The assistant cannot diagnose, assess emergencies, or recommend medication changes.</p></Screen>
  )
}
