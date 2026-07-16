import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { initialAssessment } from '../generated/initialAssessment'
import { AppRoutes } from '../App'
import { PrototypeProvider } from '../prototype/PrototypeContext'
import { createTestState } from '../prototype/state'
import { getAssessmentQuestions } from '../quiz/assessment'
import { getCheckInQuestionSet } from '../content/repository'

function renderAt(path: string, values = {}) {
  const state = createTestState({
    accountCreated: true,
    profileCompleted: true,
    assessmentStarted: true,
    assessmentMode: 'short',
    profile: completedProfile('Alex'),
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

  it('supports arrow-key selection and Enter confirmation', async () => {
    const user = userEvent.setup()
    const questions = getAssessmentQuestions('short', true)
    renderAt(`/assessment/question/${questions[0].id}`)
    await user.keyboard('{ArrowDown}')
    expect(screen.getAllByRole('radio')[0]).toBeChecked()
    await user.keyboard('{Enter}')
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
    for (const label of ['Today', 'Questions', 'My Balance', 'Learn']) {
      const link = screen.getByRole('link', { name: label })
      const icon = link.querySelector('svg')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('aria-hidden', 'true')
      expect(icon).toHaveAttribute('focusable', 'false')
    }
    expect(navigation.querySelectorAll('svg')).toHaveLength(4)
  })

  it('renders the temporary dosha mark as three decorative, unfocusable icons', () => {
    const { container } = renderAt('/', { resultsReached: false })
    const mark = container.querySelector('.welcome-mark')
    expect(mark).toHaveAttribute('aria-hidden', 'true')
    expect(mark?.querySelectorAll('svg')).toHaveLength(3)
    mark?.querySelectorAll('svg').forEach((icon) => {
      expect(icon).toHaveAttribute('focusable', 'false')
      expect(icon).not.toHaveAttribute('tabindex')
    })
  })

  it('preserves accessible names and keeps Today icons out of the tab order', () => {
    const { container } = renderAt('/today', { resultsReached: true })
    expect(screen.getByRole('link', { name: 'Open profile settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark complete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show another' })).toBeInTheDocument()
    container.querySelectorAll('svg').forEach((icon) => {
      expect(icon).toHaveAttribute('focusable', 'false')
      expect(icon).not.toHaveAttribute('tabindex')
    })
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

    await waitFor(() => expect(screen.getAllByText('Saved on this device').length).toBeGreaterThan(0))
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

  it('loads and filters published Learn articles without editorial status labels', async () => {
    const user = userEvent.setup()
    renderAt('/learn', { resultsReached: true })
    expect(screen.getByText('Ayurveda basics')).toBeInTheDocument()
    expect(screen.queryByText('Provisional · not expert-approved')).not.toBeInTheDocument()
    await user.type(screen.getByLabelText('Search articles'), 'Vata')
    expect(screen.getByText('2 articles')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /An educational overview of qualities commonly associated with Vata/i }))
    expect(screen.getByRole('heading', { name: 'Vata' })).toBeInTheDocument()
  })

  it('completes a repeatable check-in without changing initial answers', async () => {
    const user = userEvent.setup()
    const set = getCheckInQuestionSet('quick-current')!
    const checkIn = { id: 'checkin-test', setId: set.id, startedAt: '2026-07-16T10:00:00.000Z', completedAt: null, answers: {} }
    const initial = { [initialAssessment.questions[0].id]: initialAssessment.questions[0].answers[0].id }
    renderAt('/questions/check-in/checkin-test', { resultsReached: true, assessmentMode: 'full', submittedAnswers: initial, checkIns: [checkIn] })
    for (let index = 0; index < set.questionIds.length; index += 1) {
      await user.click(screen.getAllByRole('radio')[0])
      await user.click(screen.getByRole('button', { name: index === set.questionIds.length - 1 ? 'Complete check-in' : 'Continue' }))
    }
    expect(screen.getByRole('heading', { name: 'Your recent answers were saved' })).toBeInTheDocument()
    const snapshot = JSON.parse(localStorage.getItem('dosha-companion-prototype-state') ?? '{}')
    expect(snapshot.state.submittedAnswers).toEqual(initial)
    expect(snapshot.state.checkIns[0].completedAt).toBeTruthy()
  })

  it('searches catalog content and explains the current recommendation', async () => {
    const user = userEvent.setup()
    renderAt('/assistant', { resultsReached: true, assessmentMode: 'full', submittedAnswers: allOrdinaryAnswers(), profile: completedProfile('Alex') })
    await user.click(screen.getByRole('button', { name: 'What is Vata?' }))
    expect(screen.getByRole('heading', { name: 'Matching content' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /articleVataAn educational overview/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Why was this recommendation shown?' }))
    expect(screen.getByRole('heading', { name: 'Why Today chose its recommendation' })).toBeInTheDocument()
    expect(screen.getByText('No dosha score was calculated or used.')).toBeInTheDocument()
  })

  it('records Today completion and rotates to another catalog item', async () => {
    const user = userEvent.setup()
    renderAt('/today', { resultsReached: true, assessmentMode: 'full', submittedAnswers: allOrdinaryAnswers(), profile: completedProfile('Alex') })
    await user.click(screen.getByRole('button', { name: 'Mark complete' }))
    expect(screen.getByText('Marked complete for today.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show another' }))
    await waitFor(() => expect(screen.queryByText('Marked complete for today.')).not.toBeInTheDocument())
    const snapshot = JSON.parse(localStorage.getItem('dosha-companion-prototype-state') ?? '{}')
    expect(snapshot.state.recommendationHistory.some((record: { status: string }) => record.status === 'completed')).toBe(true)
    expect(snapshot.state.recommendationHistory.length).toBeGreaterThan(1)
  })

  it('exports and confirms before clearing local data', async () => {
    const user = userEvent.setup()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderAt('/settings', { resultsReached: true, profile: completedProfile('Alex') })
    await user.click(screen.getByRole('button', { name: 'Export local data as JSON' }))
    expect(click).toHaveBeenCalled()
    expect(screen.getByText('Local data export prepared.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear local data and restart' }))
    expect(confirm).toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
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
    birthYear: '1990',
    location: {
      source: 'city' as const,
      latitude: 45.5,
      longitude: -122.7,
      areaId: 'grid-v1:45.5:-122.7',
      precisionKm: 10 as const,
      displayName: 'Portland, Oregon, United States',
      countryCode: 'US',
      admin1Code: 'OR',
      timeZone: 'America/Los_Angeles',
      produceRegionId: 'us-pacific-northwest',
      units: 'us' as const,
    },
    dietaryPattern: 'Omnivore',
    hasFoodAllergies: false,
    allergies: '',
    hasFoodExclusions: false,
    exclusions: '',
  }
}
