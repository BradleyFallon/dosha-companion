import type { ReactNode } from 'react'
import { Screen } from './Layout'

interface QuestionViewportProps {
  actions: ReactNode
  children: ReactNode
  className?: string
  header: ReactNode
}

export function QuestionViewport({
  actions,
  children,
  className = '',
  header,
}: QuestionViewportProps) {
  return (
    <Screen className={`question-screen${className ? ` ${className}` : ''}`}>
      <div className="question-fixed-header">{header}</div>
      <div className="question-scroll-region">
        <div className="question-content">{children}</div>
      </div>
      <div className="question-action-shell">
        <div className="question-action-content">{actions}</div>
      </div>
    </Screen>
  )
}

interface QuestionProgressProps {
  context?: string
  current: number
  label?: string
  total: number
  variant: 'bar' | 'dots'
}

export function QuestionProgress({
  context,
  current,
  label,
  total,
  variant,
}: QuestionProgressProps) {
  if (variant === 'dots') {
    return (
      <>
        <div className="check-in-progress-dots" aria-hidden="true">
          {Array.from({ length: total }, (_, index) => (
            <span className={index + 1 < current ? 'complete' : index + 1 === current ? 'active' : ''} key={index} />
          ))}
        </div>
        <progress aria-label={`Question ${current} of ${total}`} className="sr-only" value={current} max={total} />
      </>
    )
  }

  return (
    <div className="question-progress">
      <div className="question-progress-row">
        {label ? <p className="eyebrow">{label}</p> : <span />}
        <div className="progress-copy">
          <span>Question {current} of {total}</span>
          {context ? <span>{context}</span> : null}
        </div>
      </div>
      <progress aria-label={`Question ${current} of ${total}`} value={current} max={total}>Question {current} of {total}</progress>
    </div>
  )
}

interface AnswerChoice {
  id: string
  text: string
}

interface AnswerChoiceListProps {
  answers: readonly AnswerChoice[]
  name: string
  onSelect: (answerId: string) => void
  selectedId: string | null
}

export function AnswerChoiceList({
  answers,
  name,
  onSelect,
  selectedId,
}: AnswerChoiceListProps) {
  return (
    <fieldset className="answer-list">
      <legend className="sr-only">Choose one answer</legend>
      {answers.map((answer) => (
        <label className={selectedId === answer.id ? 'answer-option selected' : 'answer-option'} key={answer.id}>
          <input
            type="radio"
            name={name}
            value={answer.id}
            checked={selectedId === answer.id}
            onChange={() => onSelect(answer.id)}
          />
          <span className="radio-mark" aria-hidden="true">{selectedId === answer.id ? '✓' : ''}</span>
          <span>{answer.text}</span>
        </label>
      ))}
    </fieldset>
  )
}

interface QuestionActionsProps {
  disabled: boolean
  onPrimary: () => void
  primaryLabel: string
  secondary?: {
    label: string
    onSelect: () => void
  }
  showKeyboardHint?: boolean
}

export function QuestionActions({
  disabled,
  onPrimary,
  primaryLabel,
  secondary,
  showKeyboardHint = false,
}: QuestionActionsProps) {
  return (
    <>
      {showKeyboardHint ? <p className="keyboard-hint">Arrow keys to choose · Enter to continue</p> : null}
      <div className={secondary ? 'question-actions with-secondary' : 'question-actions'}>
        {secondary ? <button className="button secondary" type="button" onClick={secondary.onSelect}>{secondary.label}</button> : null}
        <button className="button primary" type="button" disabled={disabled} onClick={onPrimary}>{primaryLabel}</button>
      </div>
    </>
  )
}
