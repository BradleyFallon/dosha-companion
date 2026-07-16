import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { searchLearningContent, type ContentSearchResult } from '../content/repository'
import { selectDailyRecommendation } from '../content/recommendations'
import { usePrototype } from '../prototype/PrototypeContext'
import { calculateAssessmentCoverage } from '../quiz/coverage'

const suggestions = ['What is Vata?', 'Nature and current balance', 'How do check-ins work?', 'Why was this recommendation shown?']

export function AssistantScreen() {
  const { state } = usePrototype()
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<ContentSearchResult[]>([])
  const [todayExplanation, setTodayExplanation] = useState<string[] | null>(null)

  function search(value = query) {
    const normalized = value.trim()
    setQuery(value)
    setSearched(true)
    setResults(searchLearningContent(normalized))
    if (/why|today|recommendation|shown/i.test(normalized)) {
      const coverage = calculateAssessmentCoverage({ submittedAnswers: state.submittedAnswers, skippedQuestionIds: state.skippedQuestionIds })
      setTodayExplanation(selectDailyRecommendation({ coverage, profile: state.profile, submittedAnswers: state.submittedAnswers, recommendationHistory: state.recommendationHistory, activeRecommendationId: state.todayRecommendationId }).why)
    } else setTodayExplanation(null)
  }

  function submit(event: FormEvent) { event.preventDefault(); search() }
  return (
    <Screen>
      <Link className="back-link" to="/today">← Today</Link><p className="eyebrow">Deterministic content search</p><h1 tabIndex={-1}>Guided help</h1>
      <p className="lede">Search the editable learning catalog and glossary. This is not a conversational AI.</p>
      <form className="help-search" onSubmit={submit}><label htmlFor="help-query">What would you like to understand?</label><input id="help-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="button primary" type="submit">Search content</button></form>
      <div className="suggestion-list" aria-label="Suggested searches">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => search(suggestion)}>{suggestion}</button>)}</div>
      {todayExplanation ? <section className="search-explanation" aria-labelledby="today-explanation"><h2 id="today-explanation">Why Today chose its recommendation</h2><ul>{todayExplanation.map((reason) => <li key={reason}>{reason}</li>)}</ul></section> : null}
      {results.length > 0 ? <section aria-labelledby="search-results"><h2 id="search-results">Matching content</h2><div className="search-results">{results.map((result) => <Link key={`${result.type}-${result.id}`} to={result.href}><small>{result.type}</small><strong>{result.title}</strong><span>{result.summary}</span></Link>)}</div></section> : null}
      {searched && results.length === 0 && !todayExplanation ? <p className="empty-state" role="status">No matching catalog content was found. Try a dosha name, check-ins, routine, or provisional guidance.</p> : null}
      <p className="boundary-note">Guided help searches local published content. It cannot assess symptoms, diagnose, or recommend medication changes.</p>
    </Screen>
  )
}
