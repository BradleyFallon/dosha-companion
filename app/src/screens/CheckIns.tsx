import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BackLink, Screen } from '../components/Layout'
import { ContextChatLink } from '../components/ContextChatLink'
import {
  AnswerChoiceList,
  QuestionActions,
  QuestionProgress,
  QuestionViewport,
} from '../components/QuestionFlow'
import { getCheckInQuestionSet } from '../content/repository'
import { initialAssessment } from '../generated/initialAssessment'
import { usePrototype } from '../prototype/PrototypeContext'
import { useQuestionKeyboard } from '../quiz/useQuestionKeyboard'
import {
  CloseIcon,
  CompleteIcon,
  CurrentBalanceIcon,
  ForwardIcon,
} from '../ui/icons'

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
  const [justCompleted, setJustCompleted] = useState(false)

  useEffect(() => setSelected(null), [question?.id])
  useEffect(() => {
    if (checkIn && !checkIn.completedAt && questions.length > 0 && index < 0) {
      dispatch({ type: 'complete-check-in', checkInId: checkIn.id, completedAt: new Date().toISOString() })
    }
  }, [checkIn, dispatch, index, questions.length])

  function submit() {
    if (!selected || !question || !checkIn) return
    dispatch({ type: 'answer-check-in', checkInId: checkIn.id, questionId: question.id, answerId: selected })
    if (index === questions.length - 1) {
      setJustCompleted(true)
      dispatch({ type: 'complete-check-in', checkInId: checkIn.id, completedAt: new Date().toISOString() })
    }
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
    const date = formatCheckInDate(checkIn.completedAt)
    const answers = questions.flatMap((item) => {
      const answerId = checkIn.answers[item.id]
      const answer = item.answers.find((candidate) => candidate.id === answerId)
      return answer ? [{ question: item.text, answer: answer.text }] : []
    })

    return (
      <Screen className="check-in-summary-screen">
        <BackLink label="Check In" to="/questions" />
        {justCompleted ? (
          <div aria-hidden="true" className="check-in-completion-mark">
            <CompleteIcon className="check-in-complete-icon" focusable="false" weight="fill" />
          </div>
        ) : <CurrentBalanceIcon aria-hidden="true" className="focused-screen-icon" focusable="false" weight="duotone" />}
        <h1 aria-live={justCompleted ? 'polite' : undefined} tabIndex={-1}>{justCompleted ? 'Check-in saved' : date}</h1>
        <p className="check-in-answer-count">{answers.length} answers</p>
        <div className="check-in-summary-actions">
          <Link className="button primary" to="/today">Done</Link>
          <ContextChatLink ariaLabel={`Talk through ${date} check-in`} className="button secondary icon-label" context={{ type: 'check-in', id: checkIn.id }} returnTo="/questions">Talk about it</ContextChatLink>
        </div>
        <details className="check-in-answer-details">
          <summary>Answers <ForwardIcon aria-hidden="true" focusable="false" /></summary>
          <dl>{answers.map((answer) => <div key={answer.question}><dt>{answer.question}</dt><dd>{answer.answer}</dd></div>)}</dl>
        </details>
        <details className="compact-details check-in-about">
          <summary>About this check-in</summary>
          <p>This dated record stays separate from your initial assessment and can update your prototype recent-pattern estimate.</p>
        </details>
      </Screen>
    )
  }

  const lastQuestion = index === questions.length - 1
  const actionLabel = lastQuestion ? 'Complete check-in' : 'Continue'

  return (
    <QuestionViewport
      actions={<QuestionActions disabled={!selected} onPrimary={submit} primaryLabel={actionLabel} />}
      className="check-in-question-screen"
      header={(
        <div className="check-in-question-header">
          <Link aria-label="Finish later" className="icon-control" to="/questions"><CloseIcon aria-hidden="true" focusable="false" /></Link>
          <QuestionProgress current={index + 1} total={questions.length} variant="dots" />
          <span aria-hidden="true" className="check-in-header-spacer" />
        </div>
      )}
    >
      {index === 0 ? <p className="check-in-timeframe">Past seven days</p> : null}
      <h1 tabIndex={-1}>{question.text}</h1>
      <AnswerChoiceList answers={question.answers} name={question.id} onSelect={setSelected} selectedId={selected} />
    </QuestionViewport>
  )
}

function formatCheckInDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value))
}
