import { Link } from 'react-router-dom'
import { Screen } from '../components/Layout'

export function QuestionsScreen() {
  return (
    <Screen>
      <p className="eyebrow">Profile freshness · updated today</p>
      <h1 tabIndex={-1}>Questions</h1>
      <p className="lede">Three suggested questions can refine this preliminary profile. There is no daily requirement.</p>
      <div className="queue-list">
        <article><p className="eyebrow">Refinement</p><h2>Clarify a usual tendency</h2><p>Improves long-term profile detail.</p></article>
        <article><p className="eyebrow">Current check-in</p><h2>How has your energy felt?</h2><p>Refers to the past seven days.</p></article>
        <article><p className="eyebrow">Current check-in</p><h2>Has your routine changed?</h2><p>Refers to the past seven days.</p></article>
      </div>
      <button className="button primary" type="button">Answer suggested questions</button>
      <button className="text-button" type="button">Answer more</button>
      <p className="boundary-note">Your profile remains useful if you stop here.</p>
    </Screen>
  )
}

export function BalanceScreen() {
  return (
    <Screen>
      <p className="stage-badge">Preliminary</p>
      <h1 tabIndex={-1}>My Balance</h1>
      <p className="supporting">Qualitative fixtures only—no percentages or calculated scores.</p>
      <BalanceCard title="Your nature" timeframe="Usual adult tendencies" label="Vata–Pitta" emphasis={['prominent', 'prominent', 'present']} />
      <BalanceCard title="Your current balance" timeframe="Past seven days · updated today" label="Vata is more prominent" emphasis={['more prominent', 'present', 'less prominent']} />
      <Link className="button primary" to="/questions">Answer more questions</Link>
    </Screen>
  )
}

function BalanceCard({ title, timeframe, label, emphasis }: { title: string; timeframe: string; label: string; emphasis: string[] }) {
  return (
    <article className="result-card">
      <p className="eyebrow">{title}</p><p className="time-context">{timeframe}</p><h2>{label}</h2>
      <ul className="dosha-list"><li><strong>Vata</strong><span>{emphasis[0]}</span></li><li><strong>Pitta</strong><span>{emphasis[1]}</span></li><li><strong>Kapha</strong><span>{emphasis[2]}</span></li></ul>
    </article>
  )
}

export function LearnScreen() {
  const items = ['Ayurveda basics', 'Vata', 'Pitta', 'Kapha', 'Constitution versus current balance', 'Glossary']
  return (
    <Screen><p className="eyebrow">Approved learning library · placeholder</p><h1 tabIndex={-1}>Learn</h1><p className="lede">Explore the concepts behind your educational wellness profile.</p><div className="learn-list">{items.map((item) => <button type="button" key={item}>{item}<span aria-hidden="true">→</span></button>)}</div><p className="boundary-note">No generated or unreviewed articles appear in this prototype.</p></Screen>
  )
}

export function AssistantScreen() {
  return (
    <Screen><Link className="back-link" to="/today">← Today</Link><p className="eyebrow">Static premium feature</p><h1 tabIndex={-1}>AI assistant</h1><div className="assistant-placeholder"><h2>Ask about approved educational content</h2><p>A future assistant may use approved sources and a limited profile summary. This prototype does not call an AI service, retain chat history, or evaluate symptoms.</p><button className="button primary" type="button" disabled>Start subscription</button><p>Today, Questions, My Balance, and Learn remain available without this feature.</p></div><p className="boundary-note">The assistant cannot diagnose, assess emergencies, or recommend medication changes.</p></Screen>
  )
}
