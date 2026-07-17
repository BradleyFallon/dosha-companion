import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  AnswerChoiceList,
  QuestionActions,
  QuestionProgress,
  QuestionViewport,
} from './QuestionFlow'

describe('shared question flow', () => {
  it('renders one controlled native-radio presentation for every quiz', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const { container } = render(
      <AnswerChoiceList
        answers={[{ id: 'steady', text: 'Steady' }, { id: 'variable', text: 'Variable' }]}
        name="energy"
        onSelect={onSelect}
        selectedId="steady"
      />,
    )

    expect(screen.getAllByRole('radio')).toHaveLength(2)
    expect(screen.getByRole('radio', { name: 'Steady' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Steady' }).closest('label')).toHaveClass('answer-option', 'selected')
    expect(container.querySelector('.radio-mark')).toHaveAttribute('aria-hidden', 'true')
    await user.click(screen.getByRole('radio', { name: 'Variable' }))
    expect(onSelect).toHaveBeenCalledWith('variable')
  })

  it('provides visible shared actions with optional assessment context', async () => {
    const user = userEvent.setup()
    const onPrimary = vi.fn()
    const onSecondary = vi.fn()
    render(
      <QuestionActions
        disabled={false}
        onPrimary={onPrimary}
        primaryLabel="Continue"
        secondary={{ label: 'Back', onSelect: onSecondary }}
        showKeyboardHint
      />,
    )

    expect(screen.getByText('Arrow keys to choose · Enter to continue')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveClass('button', 'primary')
    expect(screen.getByRole('button', { name: 'Back' })).toHaveClass('button', 'secondary')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(onPrimary).toHaveBeenCalledOnce()
    expect(onSecondary).toHaveBeenCalledOnce()
  })

  it('keeps bar and dot progress visually distinct but semantically equivalent', () => {
    const { container, rerender } = render(
      <QuestionProgress context="Past seven days" current={2} label="Your current balance" total={5} variant="bar" />,
    )

    expect(screen.getByRole('progressbar', { name: 'Question 2 of 5' })).toHaveAttribute('value', '2')
    expect(screen.getByText('Your current balance')).toBeInTheDocument()
    expect(screen.getByText('Past seven days')).toBeInTheDocument()

    rerender(<QuestionProgress current={3} total={5} variant="dots" />)
    expect(screen.getByRole('progressbar', { name: 'Question 3 of 5' })).toHaveAttribute('value', '3')
    expect(container.querySelectorAll('.check-in-progress-dots span')).toHaveLength(5)
    expect(container.querySelectorAll('.check-in-progress-dots .complete')).toHaveLength(2)
    expect(container.querySelectorAll('.check-in-progress-dots .active')).toHaveLength(1)
  })

  it('keeps header, variable content, and actions in one reusable viewport', () => {
    const { container } = render(
      <QuestionViewport actions={<button type="button">Continue</button>} header={<p>Question header</p>}>
        <h1>Question prompt</h1>
      </QuestionViewport>,
    )

    expect(container.querySelector('.question-screen')).toBeInTheDocument()
    expect(container.querySelector('.question-fixed-header')).toHaveTextContent('Question header')
    expect(container.querySelector('.question-scroll-region .question-content')).toHaveTextContent('Question prompt')
    expect(container.querySelector('.question-action-shell .question-action-content')).toHaveTextContent('Continue')
  })
})
