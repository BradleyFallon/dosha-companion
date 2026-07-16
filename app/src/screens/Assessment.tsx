import { useEffect } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BackLink, Screen, Status } from '../components/Layout'
import { usePrototype } from '../prototype/PrototypeContext'
import {
  getAssessmentQuestions,
  sectionLabel,
  shortModeAllowed,
  type AssessmentMode,
} from '../quiz/assessment'

export function AssessmentIntroScreen() {
  const { state, dispatch } = usePrototype()
  const location = useLocation()
  const navigate = useNavigate()
  const demoQuery = new URLSearchParams(location.search).get('demo')
  const selectedMode: AssessmentMode =
    demoQuery === 'short' && shortModeAllowed()
      ? 'short'
      : demoQuery === 'full'
        ? 'full'
        : state.assessmentMode

  function begin() {
    dispatch({ type: 'start-assessment', mode: selectedMode })
    const questions = getAssessmentQuestions(selectedMode)
    const index = Math.min(state.currentIndex, Math.max(questions.length - 1, 0))
    navigate(`/assessment/question/${questions[index]?.id}`)
  }

  return (
    <Screen>
      <BackLink to="/profile/food" />
      <p className="eyebrow">Your wellness profile</p>
      <h1 tabIndex={-1}>Before the assessment</h1>
      <p className="lede">Allow about ten minutes for the full 27-question draft.</p>
      <div className="info-card">
        <h2>Two kinds of questions</h2>
        <p><strong>Your usual nature</strong><br />Tendencies across adult life when you are generally well.</p>
        <p><strong>Your current balance</strong><br />How you have felt during the past seven days.</p>
      </div>
      <ul className="check-list">
        <li>Progress is saved on this device</li>
        <li>You may choose Not sure or skip</li>
        <li>You can leave and resume later</li>
      </ul>
      <p className="boundary-note">Results are educational and based on self-report. They are not a medical diagnosis.</p>
      {shortModeAllowed() ? (
        <div className="dev-control">
          <strong>Developer preview</strong>
          <p>{selectedMode === 'short' ? 'Short mode: 3 baseline + 2 current questions.' : 'Full mode: all 27 questions.'}</p>
          <Link to={selectedMode === 'short' ? '/assessment?demo=full' : '/assessment?demo=short'}>
            Switch to {selectedMode === 'short' ? 'full' : 'short'} mode
          </Link>
        </div>
      ) : null}
      <button className="button primary" type="button" onClick={begin}>
        {state.assessmentStarted ? 'Resume assessment' : 'Begin assessment'}
      </button>
      <Link className="text-link centered" to="/">Exit for now</Link>
    </Screen>
  )
}

export function QuestionScreen() {
  const { state, dispatch } = usePrototype()
  const { id } = useParams()
  const navigate = useNavigate()
  const routeLocation = useLocation()
  const questions = getAssessmentQuestions(state.assessmentMode)
  const index = questions.findIndex((question) => question.id === id)
  const question = questions[index]

  useEffect(() => {
    if (!question) return
    const stored = state.submittedAnswers[question.id] ?? null
    if (state.currentIndex !== index || (state.selectedAnswerId === null && stored)) {
      dispatch({ type: 'go-to-index', index, selectedAnswerId: stored })
    }
  }, [dispatch, index, question, state.currentIndex, state.selectedAnswerId, state.submittedAnswers])

  if (!question) return <Navigate to="/assessment" replace />

  const selected = state.selectedAnswerId ?? state.submittedAnswers[question.id] ?? null
  const total = questions.length

  function advance(answerId?: string) {
    const nextIndex = index + 1
    if (answerId) {
      dispatch({ type: 'submit-answer', questionId: question.id, answerId, nextIndex })
    } else {
      dispatch({ type: 'skip-question', questionId: question.id, nextIndex })
    }

    if (new URLSearchParams(routeLocation.search).get('return') === 'results') {
      navigate('/results')
      return
    }

    if (nextIndex >= total) {
      dispatch({ type: 'reach-results' })
      navigate('/results')
      return
    }

    const next = questions[nextIndex]
    if (question.assessmentType === 'baseline' && next.assessmentType === 'current') {
      navigate('/assessment/transition')
      return
    }
    navigate(`/assessment/question/${next.id}`)
  }

  function goBack() {
    if (index === 0) {
      navigate('/assessment')
      return
    }
    const previous = questions[index - 1]
    if (question.assessmentType === 'current' && previous.assessmentType === 'baseline') {
      navigate('/assessment/transition')
      return
    }
    dispatch({
      type: 'go-to-index',
      index: index - 1,
      selectedAnswerId: state.submittedAnswers[previous.id] ?? null,
    })
    navigate(`/assessment/question/${previous.id}`)
  }

  return (
    <Screen className="question-screen">
      <div className="assessment-topline">
        <Link to="/">Save and exit</Link>
        <Status>{state.saveStatus === 'saved' ? 'Saved on this device' : state.saveStatus}</Status>
      </div>
      <p className="eyebrow">{sectionLabel(question.assessmentType)}</p>
      <div className="progress-copy">
        <span>Question {index + 1} of {total}</span>
        {question.assessmentType === 'current' ? <span>Past seven days</span> : null}
      </div>
      <progress value={index + 1} max={total}>Question {index + 1} of {total}</progress>
      <h1 tabIndex={-1}>{question.text}</h1>
      {question.helpText ? <p className="field-hint">{question.helpText}</p> : null}
      {question.assessmentType === 'baseline' ? (
        <details className="question-help">
          <summary>What does “usual nature” mean?</summary>
          <p>Think about most of your adult life when generally well—not only how you feel this week.</p>
        </details>
      ) : null}
      <fieldset className="answer-list">
        <legend className="sr-only">Choose one answer</legend>
        {question.answers.map((answer) => (
          <label className={selected === answer.id ? 'answer-option selected' : 'answer-option'} key={answer.id}>
            <input
              type="radio"
              name={question.id}
              value={answer.id}
              checked={selected === answer.id}
              onChange={() => dispatch({ type: 'select-answer', answerId: answer.id })}
            />
            <span className="radio-mark" aria-hidden="true">{selected === answer.id ? '✓' : ''}</span>
            <span>{answer.text}</span>
          </label>
        ))}
      </fieldset>
      {question.skippable ? (
        <button className="text-button skip-action" type="button" onClick={() => advance()}>
          Skip for now
        </button>
      ) : null}
      <div className="assessment-actions">
        <button className="button secondary" type="button" onClick={goBack}>Back</button>
        <button className="button primary" type="button" disabled={!selected} onClick={() => selected && advance(selected)}>Continue</button>
      </div>
    </Screen>
  )
}

export function TransitionScreen() {
  const { state, dispatch } = usePrototype()
  const navigate = useNavigate()
  const questions = getAssessmentQuestions(state.assessmentMode)
  const currentIndex = questions.findIndex((question) => question.assessmentType === 'current')
  const currentQuestion = questions[currentIndex]

  if (!currentQuestion) return <Navigate to="/results" replace />

  function continueToCurrent() {
    dispatch({ type: 'complete-transition' })
    dispatch({ type: 'go-to-index', index: currentIndex, selectedAnswerId: state.submittedAnswers[currentQuestion.id] ?? null })
    navigate(`/assessment/question/${currentQuestion.id}`)
  }

  function backToBaseline() {
    const previousIndex = Math.max(currentIndex - 1, 0)
    const previous = questions[previousIndex]
    dispatch({ type: 'go-to-index', index: previousIndex, selectedAnswerId: state.submittedAnswers[previous.id] ?? null })
    navigate(`/assessment/question/${previous.id}`)
  }

  return (
    <Screen className="transition-screen">
      <Status>Part 1 saved</Status>
      <p className="eyebrow">Part 1 complete</p>
      <h1 tabIndex={-1}>Now let’s look at how you’ve been feeling recently.</h1>
      <p className="lede">Think only about the past seven days. These answers help us understand your current balance separately from your usual nature.</p>
      <div className="time-shift" aria-hidden="true"><span>Usual nature</span><span>→</span><strong>Past 7 days</strong></div>
      <button className="button primary" type="button" onClick={continueToCurrent}>Continue</button>
      <button className="button secondary" type="button" onClick={backToBaseline}>Back to last question</button>
      <Link className="text-link centered" to="/">Save and exit</Link>
    </Screen>
  )
}
