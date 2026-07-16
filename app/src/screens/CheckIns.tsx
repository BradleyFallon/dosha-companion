import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Screen, Status } from '../components/Layout'
import { getCheckInQuestionSet } from '../content/repository'
import { initialAssessment } from '../generated/initialAssessment'
import { usePrototype } from '../prototype/PrototypeContext'
import { CompleteIcon, QuestionsIcon } from '../ui/icons'
import { useQuestionKeyboard } from '../quiz/useQuestionKeyboard'

export function NewCheckInScreen() {
  const { dispatch } = usePrototype()
  const navigate = useNavigate()
  const location = useLocation()
  const setId = new URLSearchParams(location.search).get('set') ?? 'quick-current'
  const set = getCheckInQuestionSet(setId) ?? getCheckInQuestionSet('quick-current')
  const checkInId = useMemo(() => `checkin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, [])

  useEffect(() => {
    if (!set) return
    dispatch({ type: 'start-check-in', checkIn: { id: checkInId, setId: set.id, startedAt: new Date().toISOString(), completedAt: null, answers: {} } })
    navigate(`/questions/check-in/${checkInId}`, { replace: true })
  }, [checkInId, dispatch, navigate, set])
  return <Screen><p role="status">Starting check-in…</p></Screen>
}

export function CheckInScreen() {
  const { id } = useParams()
  const { state, dispatch } = usePrototype()
  const checkIn = state.checkIns.find((item) => item.id === id)
  const set = checkIn ? getCheckInQuestionSet(checkIn.setId) : null
  const questions = set?.questionIds.flatMap((questionId) => {
    const question = initialAssessment.questions.find((item) => item.id === questionId)
    return question ? [question] : []
  }) ?? []
  const index = checkIn ? questions.findIndex((question) => !checkIn.answers[question.id]) : -1
  const question = index >= 0 ? questions[index] : null
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => setSelected(null), [question?.id])
  useEffect(() => {
    if (checkIn && !checkIn.completedAt && questions.length > 0 && index < 0) {
      dispatch({ type: 'complete-check-in', checkInId: checkIn.id, completedAt: new Date().toISOString() })
    }
  }, [checkIn, dispatch, index, questions.length])

  function submit() {
    if (!selected || !question || !checkIn) return
    dispatch({ type: 'answer-check-in', checkInId: checkIn.id, questionId: question.id, answerId: selected })
    if (index === questions.length - 1) dispatch({ type: 'complete-check-in', checkInId: checkIn.id, completedAt: new Date().toISOString() })
  }

  useQuestionKeyboard({
    answerIds: question?.answers.map((answer) => answer.id) ?? [],
    selectedId: selected,
    onSelect: setSelected,
    onConfirm: submit,
  })

  if (!checkIn || !set) return <Navigate to="/questions" replace />

  if (checkIn.completedAt || !question) {
    if (!checkIn.completedAt) return <Screen><p role="status">Finishing check-in…</p></Screen>
    return (
      <Screen><p className="stage-badge icon-label"><CompleteIcon aria-hidden="true" className="icon-leading" focusable="false" weight="fill" />Check-in complete</p><h1 tabIndex={-1}>Your recent answers were saved</h1><p className="lede">This dated record stays separate from your initial assessment. No dosha score was calculated.</p><Link className="button primary" to="/today">Return to Today</Link><Link className="button secondary icon-label" to="/questions"><QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />View check-in history</Link></Screen>
    )
  }

  return (
    <Screen className="question-screen">
      <div className="question-fixed-header">
        <div className="assessment-topline"><Link to="/questions">Finish later</Link><Status>{state.saveStatus === 'saved' ? 'Saved on this device' : state.saveStatus}</Status></div>
        <div className="question-progress-row"><p className="eyebrow">{set.title}</p><div className="progress-copy"><span>Question {index + 1} of {questions.length}</span><span>Past seven days</span></div></div>
        <progress value={index + 1} max={questions.length}>Question {index + 1} of {questions.length}</progress>
      </div>
      <div className="question-scroll-region">
        <h1 tabIndex={-1}>{question.text}</h1>
        <fieldset className="answer-list"><legend className="sr-only">Choose one answer</legend>{question.answers.map((answer) => <label className={selected === answer.id ? 'answer-option selected' : 'answer-option'} key={answer.id}><input type="radio" name={question.id} checked={selected === answer.id} onChange={() => setSelected(answer.id)} /><span className="radio-mark" aria-hidden="true">{selected === answer.id ? '✓' : ''}</span><span>{answer.text}</span></label>)}</fieldset>
        <p className="boundary-note">Check-in answers are saved as a dated record and are not scored.</p>
      </div>
      <div className="question-action-shell">
        <p className="keyboard-hint">Arrow keys to choose · Enter to continue</p>
        <button className="button primary icon-label" type="button" disabled={!selected} onClick={submit}>{index === questions.length - 1 ? <CompleteIcon aria-hidden="true" className="icon-leading" focusable="false" /> : <QuestionsIcon aria-hidden="true" className="icon-leading" focusable="false" />}{index === questions.length - 1 ? 'Complete check-in' : 'Continue'}</button>
      </div>
    </Screen>
  )
}
