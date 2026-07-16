import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { initialAssessment } from '../generated/initialAssessment'
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

describe('limited MVP results and settings', () => {
  it('shows a real insufficient-coverage result without fixture labels', () => {
    renderAt('/results', { resultsReached: true, submittedAnswers: {} })
    expect(screen.getByRole('heading', { name: 'A little more information is needed' })).toBeInTheDocument()
    expect(screen.queryByText('Vata–Pitta')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Answer next useful question' })).toBeInTheDocument()
  })

  it('shows coverage-ready and unavailable-scoring states', () => {
    renderAt('/results', {
      resultsReached: true,
      assessmentMode: 'full',
      submittedAnswers: allOrdinaryAnswers(),
    })
    expect(screen.getByRole('heading', { name: 'Your assessment summary' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dosha scoring is not available yet' })).toBeInTheDocument()
    expect(screen.queryByText('Vata–Pitta')).not.toBeInTheDocument()
  })

  it('returns directly to Results after a coverage-repair answer', async () => {
    const user = userEvent.setup()
    const first = getAssessmentQuestions('short', true)[0]
    renderAt(`/assessment/question/${first.id}?return=results`, { resultsReached: true })
    await user.click(screen.getAllByRole('radio')[0])
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('heading', { name: 'A little more information is needed' })).toBeInTheDocument()
  })

  it('saves profile edits without removing assessment answers', async () => {
    const user = userEvent.setup()
    const first = initialAssessment.questions[0]
    renderAt('/settings', {
      resultsReached: true,
      submittedAnswers: { [first.id]: first.answers[0].id },
      profile: completedProfile('Alex'),
    })
    const name = screen.getByLabelText('Preferred name')
    await user.clear(name)
    await user.type(name, 'Jordan')
    await user.click(screen.getByRole('button', { name: 'Save profile changes' }))

    await waitFor(() => expect(screen.getByText('Saved on this device')).toBeInTheDocument())
    const snapshot = JSON.parse(localStorage.getItem('dosha-companion-prototype-state') ?? '{}')
    expect(snapshot.state.profile.preferredName).toBe('Jordan')
    expect(snapshot.state.submittedAnswers[first.id]).toBe(first.answers[0].id)
  })

  it('shows a truthful global failure message when persistence fails', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    const user = userEvent.setup()
    renderAt('/settings', { resultsReached: true, profile: completedProfile('Alex') })
    await user.selectOptions(screen.getByLabelText(/Dietary pattern/), 'Vegan')
    await user.click(screen.getByRole('button', { name: 'Save profile changes' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Not saved—changes remain available only for this session.')
  })

  it('renders Learn items as unavailable information, not interactive controls', () => {
    renderAt('/learn', { resultsReached: true })
    expect(screen.getByText('Ayurveda basics')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Ayurveda basics/i })).not.toBeInTheDocument()
    expect(screen.getAllByText('Unavailable pending expert review')).toHaveLength(6)
  })
})

function allOrdinaryAnswers() {
  return Object.fromEntries(initialAssessment.questions.map((question) => [
    question.id,
    question.answers.find((answer) => answer.kind === 'ordinary')?.id ?? '',
  ]))
}

function completedProfile(preferredName: string) {
  return {
    preferredName,
    ageBand: '',
    location: {
      source: 'skipped' as const,
      latitude: null,
      longitude: null,
      accuracyMeters: null,
      timeZone: 'UTC',
      units: 'us' as const,
      displayLabel: null,
    },
    dietaryPattern: '',
    allergies: '',
    exclusions: '',
  }
}
