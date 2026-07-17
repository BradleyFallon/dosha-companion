import { describe, expect, it } from 'vitest'
import { initialAssessment } from '../generated/initialAssessment'
import { createTestState } from '../prototype/state'
import {
  buildBalanceViewModel,
  compareDomainAnswers,
  type DomainAnswerDisplay,
} from './model'

describe('balance view model', () => {
  it('derives coverage rings and uses only the latest completed check-in', () => {
    const submittedAnswers = Object.fromEntries(
      initialAssessment.questions
        .filter((question) => question.assessmentType === 'baseline')
        .map((question) => [question.id, question.answers.find((answer) => answer.kind === 'ordinary')!.id]),
    )
    const sleep = question('current', 'sleep')
    const energy = question('current', 'energy')
    const state = createTestState({
      submittedAnswers,
      checkIns: [
        completedCheckIn('latest', '2026-07-15T10:00:00.000Z', {
          [sleep.id]: answerWithPattern(sleep, 'sleep_variable').id,
        }),
        completedCheckIn('older', '2026-07-06T10:00:00.000Z', {
          [energy.id]: answerWithPattern(energy, 'energy_variable').id,
        }),
      ],
    })

    const view = buildBalanceViewModel(state)
    expect(view.usual).toEqual({ represented: 19, total: 19 })
    expect(view.recent).toEqual({ represented: 1, total: 7 })
    expect(view.latestCheckInId).toBe('latest')
    expect(view.domains.find((domain) => domain.id === 'sleep')?.recent?.shortLabel).toBe('Light and interrupted')
    expect(view.domains.find((domain) => domain.id === 'energy')?.recent).toBeNull()
    expect(view.timeline.map((item) => item.id)).toEqual(['older', 'latest'])
  })

  it('falls back to initial current answers only when no completed check-in exists', () => {
    const sleep = question('current', 'sleep')
    const state = createTestState({
      submittedAnswers: {
        [sleep.id]: answerWithPattern(sleep, 'sleep_heavy').id,
      },
    })
    const view = buildBalanceViewModel(state)
    expect(view.latestCheckInId).toBeNull()
    expect(view.domains.find((domain) => domain.id === 'sleep')?.recent?.shortLabel).toBe('Heavy and prolonged')
  })

  it('derives every neutral comparison without directional meaning', () => {
    const usual = display('sleep_variable')
    const same = display('sleep_variable')
    const changed = display('sleep_heavy')
    const explicitUsual = display('sleep_usual')
    const fallback = display('uncertain', 'not_sure')
    const noMetadata = display(null)

    expect(compareDomainAnswers(usual, same)).toBe('close-to-usual')
    expect(compareDomainAnswers(usual, explicitUsual)).toBe('close-to-usual')
    expect(compareDomainAnswers(usual, changed)).toBe('changed-from-usual')
    expect(compareDomainAnswers(null, same)).toBe('recent-only')
    expect(compareDomainAnswers(usual, null)).toBe('usual-only')
    expect(compareDomainAnswers(usual, fallback)).toBe('uncertain')
    expect(compareDomainAnswers(null, null)).toBe('missing')
    expect(compareDomainAnswers(usual, noMetadata)).toBe('uncertain')
  })
})

function question(section: 'baseline' | 'current', category: string) {
  return initialAssessment.questions.find((candidate) =>
    candidate.assessmentType === section && candidate.category === category)!
}

function answerWithPattern(
  item: ReturnType<typeof question>,
  patternKey: string,
) {
  return item.answers.find((answer) => answer.patternKey === patternKey)!
}

function completedCheckIn(id: string, completedAt: string, answers: Record<string, string>) {
  return {
    id,
    setId: 'quick-current',
    startedAt: completedAt,
    completedAt,
    answers,
  }
}

function display(patternKey: string | null, kind = 'ordinary'): DomainAnswerDisplay {
  return {
    answerId: 'answer',
    fullText: 'Full response',
    shortLabel: 'Short response',
    patternKey,
    iconKey: 'moon-stars',
    kind,
  }
}
