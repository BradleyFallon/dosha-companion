import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { initialAssessment } from '../generated/initialAssessment'
import { AppRoutes } from '../App'
import { PrototypeProvider } from '../prototype/PrototypeContext'
import { createTestState } from '../prototype/state'
import { getAssessmentQuestions } from '../quiz/assessment'
import { getCheckInQuestionSet } from '../content/repository'
import { resolveChatContext } from '../chat/context'
import { createChatMessage, createChatThread } from '../chat/thread'

afterEach(() => vi.unstubAllGlobals())

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
  it('allows the assessment without a location when the core profile is complete', () => {
    renderAt('/assessment', { profile: coreProfileWithoutLocation('Alex'), profileCompleted: true, assessmentStarted: false })
    expect(screen.getByRole('heading', { name: 'Before the assessment' })).toBeInTheDocument()
  })

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

  it('hides bottom navigation during an active repeat check-in', () => {
    renderAt('/questions/check-in/checkin-test', {
      resultsReached: true,
      checkIns: [{ id: 'checkin-test', setId: 'quick-current', startedAt: '2026-07-16T10:00:00.000Z', completedAt: null, answers: {} }],
    })
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
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
    expect(screen.getByRole('link', { name: 'Open settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark recommendation complete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show recommendation details' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'Show another recommendation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ask about this recommendation' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Dismiss for today' })).not.toBeInTheDocument()
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
    await user.click(screen.getByRole('button', { name: 'Profile' }))
    const name = screen.getByLabelText('Preferred name')
    await user.clear(name)
    await user.type(name, 'Jordan')
    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    await waitFor(() => expect(screen.getByText('Profile saved.')).toBeInTheDocument())
    const snapshot = JSON.parse(localStorage.getItem('dosha-companion-prototype-state') ?? '{}')
    expect(snapshot.state.profile.preferredName).toBe('Jordan')
    expect(snapshot.state.submittedAnswers[first.id]).toBe(first.answers[0].id)
  })

  it('offers automatic temperature units with explicit overrides in Settings', async () => {
    const user = userEvent.setup()
    renderAt('/settings', { resultsReached: true, profile: completedProfile('Alex') })
    await user.click(screen.getByRole('button', { name: 'Units' }))
    expect(screen.getByLabelText('Automatic (°F)')).toBeChecked()
    await user.click(screen.getByLabelText('Celsius (°C)'))
    await waitFor(() => expect(JSON.parse(localStorage.getItem('dosha-companion-prototype-state') ?? '{}').state.profile.temperatureUnitPreference).toBe('celsius'))
  })

  it('offers location setup and hides temperature controls when location is not provided yet', async () => {
    const user = userEvent.setup()
    renderAt('/settings', { resultsReached: true, profile: coreProfileWithoutLocation('Alex') })
    expect(screen.queryByRole('button', { name: 'Units' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Location' }))
    expect(screen.getByText(/Add your general area for local weather/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Add regional location' })).toHaveAttribute('href', '/profile/location?return=settings')
    expect(screen.queryByRole('group', { name: 'Temperature units' })).not.toBeInTheDocument()
  })

  it('shows a saved location, change action, and temperature controls in Settings', async () => {
    const user = userEvent.setup()
    renderAt('/settings', { resultsReached: true, profile: completedProfile('Alex') })
    expect(screen.getByRole('button', { name: 'Location' })).toHaveTextContent('Portland')
    expect(screen.getByRole('button', { name: 'Units' })).toHaveTextContent('°F')
    await user.click(screen.getByRole('button', { name: 'Location' }))
    expect(screen.getByText('Portland, Oregon, United States')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Change regional location' })).toHaveAttribute('href', '/profile/location?return=settings')
    await user.click(screen.getByRole('button', { name: 'Units' }))
    expect(screen.getByRole('group', { name: 'Temperature units' })).toBeInTheDocument()
  })

  it('shows a truthful global failure message when persistence fails', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    const user = userEvent.setup()
    renderAt('/settings', { resultsReached: true, profile: completedProfile('Alex') })
    await user.click(screen.getByRole('button', { name: 'Profile' }))
    await user.selectOptions(screen.getByLabelText(/Dietary pattern/), 'Vegan')
    await user.click(screen.getByRole('button', { name: 'Save profile' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Not saved—changes remain available only for this session.')
  })

  it('loads and filters published Learn articles without editorial status labels', async () => {
    const user = userEvent.setup()
    renderAt('/learn', { resultsReached: true })
    expect(screen.getByText('Ayurveda basics')).toBeInTheDocument()
    expect(screen.queryByText('Provisional · not expert-approved')).not.toBeInTheDocument()
    await user.type(screen.getByLabelText('Search articles'), 'Vata')
    expect(screen.getByRole('status')).toHaveTextContent('2 articles')
    expect(screen.queryByText(/An educational overview of qualities commonly associated with Vata/i)).not.toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Vata' }))
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

  it('shows the general chat home and creates a grounded conversation from a suggestion', async () => {
    const user = userEvent.setup()
    renderAt('/assistant', { resultsReached: true, assessmentMode: 'full', submittedAnswers: allOrdinaryAnswers(), profile: completedProfile('Alex') })
    expect(await screen.findByRole('heading', { name: 'What would you like to understand?' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Recent' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /\?/ })).toHaveLength(2)
    expect(screen.queryByText('This is not a conversational AI.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'What is Vata?' }))
    expect(await screen.findByText(/closest match in the app’s learning catalog/)).toBeInTheDocument()
    expect(screen.getByText('Based on')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Vata' })).toHaveAttribute('href', '/learn/vata')
  })

  it('starts a general conversation from the compact composer', async () => {
    const user = userEvent.setup()
    renderAt('/assistant', { resultsReached: true })
    await user.type(screen.getByLabelText('Ask anything'), 'What is Pitta?')
    await user.click(screen.getByRole('button', { name: 'Start conversation' }))
    expect(await screen.findByText(/closest match in the app’s learning catalog/)).toBeInTheDocument()
  })

  it('preserves assistant line breaks in the open message layout', () => {
    const state = createTestState({ resultsReached: true, profile: completedProfile('Alex') })
    const context = resolveChatContext({ type: 'general', id: 'general', sourcePath: '/today' }, state)!
    const thread = createChatThread(context)
    thread.messages.push(createChatMessage('assistant', 'First line\nSecond line'))
    renderAt(`/chat/${thread.id}`, { resultsReached: true, chatThreads: [thread] })
    const response = screen.getByText((_, element) => element?.textContent === 'First line\nSecond line')
    expect(response).toHaveClass('chat-message-content')
    expect(response.textContent).toContain('\n')
  })

  it('opens a focused recommendation thread with context, suggestions, pending state, and citations', async () => {
    const user = userEvent.setup()
    renderAt('/today', { resultsReached: true, assessmentMode: 'full', submittedAnswers: allOrdinaryAnswers(), profile: completedProfile('Alex') })
    await user.click(screen.getByRole('link', { name: 'Ask about this recommendation' }))
    expect(await screen.findByRole('button', { name: /Show context for/ })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Discussing')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Conversation messages' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Why was this recommended?' }))
    expect(screen.getByText('Thinking…')).toBeInTheDocument()
    expect(screen.getByLabelText('Ask a follow-up')).toBeDisabled()
    expect(await screen.findByText(/deterministic guidance rules/)).toBeInTheDocument()
    expect(screen.getByText('Based on')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Routine and consistency|How Today chooses guidance|Self-assessment/ })).toBeInTheDocument()
  })

  it('supports Enter to send, Shift+Enter for a newline, mock failure, and retry', async () => {
    const user = userEvent.setup()
    renderAt('/chat/new?return=today', { resultsReached: true })
    const composer = await screen.findByLabelText('Ask a follow-up')
    await user.type(composer, 'first line{Shift>}{Enter}{/Shift}second line')
    expect(composer).toHaveValue('first line\nsecond line')
    await user.clear(composer)
    await user.type(composer, 'simulate mock failure{Enter}')
    expect(await screen.findByRole('alert')).toHaveTextContent('could not respond')
    await user.click(screen.getByRole('button', { name: 'Retry response' }))
    expect(screen.getByText('Thinking…')).toBeInTheDocument()
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('renders article context and sends suggested questions', async () => {
    const user = userEvent.setup()
    renderAt('/learn/vata', { resultsReached: true })
    await user.click(screen.getByRole('link', { name: 'Ask about this article' }))
    expect(await screen.findByRole('heading', { name: 'Vata' })).toBeInTheDocument()
    expect(screen.queryByText('Learning article')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show context for Vata' }))
    expect(screen.getByRole('link', { name: 'Open Vata' })).toHaveAttribute('href', '/learn/vata')
    await user.click(screen.getByRole('button', { name: 'Can you explain this more simply?' }))
    expect(await screen.findByText(/educational organizing concepts rather than diagnoses/)).toBeInTheDocument()
  })

  it('clears browser-local conversation history from Settings', async () => {
    const user = userEvent.setup()
    const state = createTestState({ resultsReached: true, profile: completedProfile('Alex') })
    const context = resolveChatContext({ type: 'article', id: 'vata', sourcePath: '/learn/vata' }, state)!
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderAt('/settings', { resultsReached: true, chatThreads: [createChatThread(context)] })
    expect(screen.getByRole('button', { name: 'Conversations' })).toHaveTextContent('1')
    await user.click(screen.getByRole('button', { name: 'Conversations' }))
    expect(screen.getByText('1 saved on this device.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear conversation history' }))
    expect(confirm).toHaveBeenCalled()
    expect(screen.getByText('0 saved on this device.')).toBeInTheDocument()
    expect(screen.getByText('Conversation history cleared.')).toBeInTheDocument()
  })

  it('records Today completion and rotates to another catalog item', async () => {
    const user = userEvent.setup()
    renderAt('/today', { resultsReached: true, assessmentMode: 'full', submittedAnswers: allOrdinaryAnswers(), profile: completedProfile('Alex') })
    await user.click(screen.getByRole('button', { name: 'Mark recommendation complete' }))
    expect(screen.getByText('Complete for today')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show another recommendation' }))
    await waitFor(() => expect(screen.queryByText('Complete for today')).not.toBeInTheDocument())
    const snapshot = JSON.parse(localStorage.getItem('dosha-companion-prototype-state') ?? '{}')
    expect(snapshot.state.recommendationHistory.some((record: { status: string }) => record.status === 'completed')).toBe(true)
    expect(snapshot.state.recommendationHistory.length).toBeGreaterThan(1)
  })

  it('shows local conditions, seasonal food, and stable guidance modules', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ timezone: 'America/Los_Angeles', current: { temperature_2m: 72, apparent_temperature: 70, weather_code: 1 }, daily: { temperature_2m_max: [78], temperature_2m_min: [58], precipitation_probability_max: [20], sunrise: ['2026-07-16T05:40'], sunset: ['2026-07-16T20:55'] } }) }))
    const { container } = renderAt('/today', { resultsReached: true, profile: completedProfile('Alex') })
    expect(screen.getByRole('heading', { name: 'Local weather' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'In season near you' })).toBeInTheDocument()
    expect(await screen.findByText('72°F')).toBeInTheDocument()
    expect(screen.getByText('78°F / 58°F')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
    expect(screen.queryByText('Feels like')).not.toBeInTheDocument()
    expect(screen.queryByText('Portland, Oregon, United States')).not.toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Show weather details' }))
    expect(screen.getByText('Feels like')).toBeInTheDocument()
    expect(screen.getByText('70°F')).toBeInTheDocument()
    expect(screen.getByText('Portland, Oregon, United States')).toBeInTheDocument()
    expect(container.querySelector('.weather-current-icon')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.weather-current-icon')).toHaveAttribute('focusable', 'false')
    container.querySelectorAll('.weather-summary svg').forEach((icon) => expect(icon).toHaveAttribute('focusable', 'false'))
  })

  it('shows one contextual location invitation and makes no weather request without location', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    renderAt('/today', { resultsReached: true, profile: coreProfileWithoutLocation('Alex') })
    expect(screen.getByRole('button', { name: 'Mark recommendation complete' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'See what supports you where you live' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Local weather' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'In season near you' })).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
    await user.click(screen.getByRole('link', { name: 'Add my location' }))
    expect(await screen.findByRole('heading', { name: 'Choose your general area' })).toBeInTheDocument()
  })

  it('shows a restrained regional-food limitation when the saved area has no catalog region', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ timezone: 'America/Los_Angeles', current: { temperature_2m: 72, apparent_temperature: 70, weather_code: 1 }, daily: { temperature_2m_max: [78], temperature_2m_min: [58], precipitation_probability_max: [20], sunrise: ['2026-07-16T05:40'], sunset: ['2026-07-16T20:55'] } }) }))
    const saved = completedProfile('Alex')
    const profile = { ...saved, location: { ...saved.location, produceRegionId: null } }
    renderAt('/today', { resultsReached: true, profile })
    expect(await screen.findByText('Regional food guidance is not available for this area yet.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Add my location' })).not.toBeInTheDocument()
  })

  it('keeps Today content usable during weather loading and failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => new Promise(() => {})))
    const loading = renderAt('/today', { resultsReached: true, profile: completedProfile('Alex') })
    expect(screen.getByRole('status')).toHaveTextContent('Loading local weather')
    expect(screen.getByRole('navigation', { name: 'Today shortcuts' })).toBeInTheDocument()
    loading.unmount()

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    renderAt('/today', { resultsReached: true, profile: completedProfile('Alex') })
    expect(await screen.findByText('Local conditions are unavailable right now.')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Today shortcuts' })).toBeInTheDocument()
  })

  it('exports and confirms before clearing local data', async () => {
    const user = userEvent.setup()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderAt('/settings', { resultsReached: true, profile: completedProfile('Alex') })
    await user.click(screen.getByRole('button', { name: 'Local data' }))
    await user.click(screen.getByRole('button', { name: 'Export local data' }))
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
    },
    temperatureUnitPreference: 'automatic' as const,
    dietaryPattern: 'Omnivore',
    hasFoodAllergies: false,
    allergies: '',
    hasFoodExclusions: false,
    exclusions: '',
  }
}

function coreProfileWithoutLocation(preferredName: string) {
  return { ...completedProfile(preferredName), location: null }
}
