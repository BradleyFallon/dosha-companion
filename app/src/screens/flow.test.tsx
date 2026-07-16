import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../App'
import { PrototypeProvider } from '../prototype/PrototypeContext'
import { createTestState } from '../prototype/state'
import { getAssessmentQuestions } from '../quiz/assessment'

function renderAt(path: string, values = {}) {
  const state = createTestState({
    accountCreated: true,
    profileCompleted: true,
    assessmentStarted: true,
    assessmentMode: 'short',
    ...values,
  })
  return render(
    <PrototypeProvider initialState={state}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </PrototypeProvider>,
  )
}

describe('assessment interaction', () => {
  it('selecting an answer does not advance automatically', async () => {
    const user = userEvent.setup()
    const questions = getAssessmentQuestions('short', true)
    renderAt(`/assessment/question/${questions[0].id}`)
    await user.click(screen.getAllByRole('radio')[0])
    expect(screen.getByRole('heading', { name: questions[0].text })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
  })

  it('Continue submits the selected answer and advances', async () => {
    const user = userEvent.setup()
    const questions = getAssessmentQuestions('short', true)
    renderAt(`/assessment/question/${questions[0].id}`)
    await user.click(screen.getAllByRole('radio')[0])
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('heading', { name: questions[1].text })).toBeInTheDocument()
  })

  it('Skip for now records no answer and advances', async () => {
    const user = userEvent.setup()
    const questions = getAssessmentQuestions('short', true)
    renderAt(`/assessment/question/${questions[0].id}`)
    await user.click(screen.getByRole('button', { name: 'Skip for now' }))
    expect(screen.getByRole('heading', { name: questions[1].text })).toBeInTheDocument()
    expect(window.localStorage.getItem('dosha-companion-prototype-state')).not.toContain(
      questions[0].answers[0].id,
    )
  })

  it('baseline completion leads to the current-balance transition', async () => {
    const user = userEvent.setup()
    const questions = getAssessmentQuestions('short', true)
    renderAt(`/assessment/question/${questions[2].id}`, { currentIndex: 2 })
    await user.click(screen.getAllByRole('radio')[0])
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('heading', { name: /how you’ve been feeling recently/i })).toBeInTheDocument()
  })
})

describe('navigation visibility', () => {
  it('keeps bottom navigation hidden before results', () => {
    renderAt('/', { resultsReached: false })
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument()
  })

  it('shows bottom navigation after results on Today', () => {
    renderAt('/today', { resultsReached: true })
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' })
    expect(navigation).toBeInTheDocument()
    expect(navigation.querySelector('a[href="/today"]')).toHaveAttribute('aria-current', 'page')
  })
})
