import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Screen } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import { shortModeAllowed } from '../quiz/assessment'

export function ResultScreen() {
  const { dispatch } = usePrototype()
  const navigate = useNavigate()
  const location = useLocation()
  const missingPreview =
    shortModeAllowed() && new URLSearchParams(location.search).get('coverage') === 'missing'

  if (missingPreview) return <MoreInformationNeeded />

  function goToToday() {
    dispatch({ type: 'visit-today' })
    navigate('/today')
  }

  return (
    <Screen className="results-screen">
      <p className="stage-badge">Preliminary profile</p>
      <h1 tabIndex={-1}>Your starting profile</h1>
      <p className="supporting">This static fixture demonstrates the result hierarchy. No quiz scoring has been performed.</p>
      <article className="result-card nature-card">
        <p className="eyebrow">Your nature</p>
        <p className="time-context">Usual adult tendencies when generally well</p>
        <h2>Vata–Pitta</h2>
        <p>This example describes a pattern with both changeable and focused qualities. Expert review and approved scoring are still required.</p>
      </article>
      <article className="result-card current-card">
        <p className="eyebrow">Your current balance</p>
        <p className="time-context">Based on the past seven days</p>
        <h2>Vata is currently more prominent</h2>
        <p>Updated today · Static prototype fixture</p>
      </article>
      <section className="profile-detail" aria-labelledby="profile-detail-title">
        <h2 id="profile-detail-title">Profile detail</h2>
        <div className="qualitative-track"><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /></div>
        <p><strong>Preliminary.</strong> You have a useful starting point, and future answers may refine it.</p>
      </section>
      <p className="boundary-note">Based on self-reported information. Educational, not a medical diagnosis.</p>
      <button className="button primary" type="button" onClick={goToToday}>Go to Today</button>
      <Link className="button secondary" to="/questions">Continue refining profile</Link>
      {shortModeAllowed() ? (
        <div className="dev-control">
          <strong>Developer preview</strong>
          <Link to="/results?coverage=missing">View “More information needed” state</Link>
        </div>
      ) : null}
    </Screen>
  )
}

function MoreInformationNeeded() {
  return (
    <Screen>
      <p className="eyebrow">Coverage preview</p>
      <h1 tabIndex={-1}>A little more information is needed</h1>
      <p className="lede">You can still skip questions. We need better coverage across a few areas before preparing a useful preliminary profile.</p>
      <div className="info-card"><strong>Next useful area</strong><p>Usual sleep pattern</p></div>
      <Link className="button primary" to="/assessment">Answer next useful question</Link>
      <Link className="button secondary" to="/results">Return to fixture result</Link>
      <p className="boundary-note">This is a development-only state preview. We do not need medical details.</p>
    </Screen>
  )
}
