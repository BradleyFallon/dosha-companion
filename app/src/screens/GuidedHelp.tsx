import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { BackLink, Screen } from '../components/Layout'
import { searchLearningContent, type ContentSearchResult } from '../content/repository'
import { selectDailyRecommendation } from '../content/recommendations'
import { usePrototype } from '../prototype/PrototypeContext'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import {
  GlossaryIcon,
  GuidedHelpIcon,
  LearnIcon,
  SearchIcon,
  WarningIcon,
  WhyIcon,
} from '../ui/icons'

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
      <BackLink to="/today" label="Today" /><p className="eyebrow">Deterministic content search</p><h1 className="section-title-with-icon" tabIndex={-1}><GuidedHelpIcon aria-hidden="true" className="heading-icon" focusable="false" weight="duotone" />Guided help</h1>
      <p className="lede">Search the editable learning catalog and glossary. This is not a conversational AI.</p>
      <form className="help-search" onSubmit={submit}><label htmlFor="help-query">What would you like to understand?</label><input id="help-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="button primary icon-label" type="submit"><SearchIcon aria-hidden="true" className="icon-leading" focusable="false" />Search content</button></form>
      <div className="suggestion-list" aria-label="Suggested searches">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => search(suggestion)}>{suggestion}</button>)}</div>
      {todayExplanation ? <section className="search-explanation" aria-labelledby="today-explanation"><h2 className="section-title-with-icon" id="today-explanation"><WhyIcon aria-hidden="true" className="icon-leading" focusable="false" />Why Today chose its recommendation</h2><ul>{todayExplanation.map((reason) => <li key={reason}>{reason}</li>)}</ul></section> : null}
      {results.length > 0 ? <section aria-labelledby="search-results"><h2 id="search-results">Matching content</h2><div className="search-results">{results.map((result) => { const ResultIcon = result.type === 'article' ? LearnIcon : GlossaryIcon; return <Link key={`${result.type}-${result.id}`} to={result.href}><span className="search-result-kind"><ResultIcon aria-hidden="true" className="icon-leading" focusable="false" /><small>{result.type}</small></span><strong>{result.title}</strong><span>{result.summary}</span></Link> })}</div></section> : null}
      {searched && results.length === 0 && !todayExplanation ? <p className="empty-state icon-label" role="status"><WarningIcon aria-hidden="true" className="icon-leading" focusable="false" />No matching catalog content was found. Try a dosha name, check-ins, routine, or daily guidance.</p> : null}
      <p className="boundary-note">Guided help searches local published content. It cannot assess symptoms, diagnose, or recommend medication changes.</p>
    </Screen>
  )
}
