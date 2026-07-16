import { describe, expect, it } from 'vitest'
import { selectArticleIcon } from './articleIcons'
import {
  AyurvedaIcon,
  BalanceIcon,
  DailyRoutineIcon,
  KaphaIcon,
  NatureIcon,
  PittaIcon,
  VataIcon,
} from './icons'

describe('semantic article icon selection', () => {
  it.each([
    ['vata', VataIcon, 'vata'],
    ['pitta', PittaIcon, 'pitta'],
    ['kapha', KaphaIcon, 'kapha'],
  ] as const)('gives the %s tag precedence over category', (tag, Icon, tone) => {
    expect(selectArticleIcon({ category: 'foundations', tags: [tag] })).toEqual({ Icon, tone })
  })

  it('uses a neutral dosha concept for an article covering all three doshas', () => {
    expect(selectArticleIcon({ category: 'doshas', tags: ['vata', 'pitta', 'kapha'] })).toEqual({
      Icon: BalanceIcon,
      tone: 'neutral',
    })
  })

  it('prefers a specific concept tag and otherwise falls back to category', () => {
    expect(selectArticleIcon({ category: 'assessment', tags: ['nature'] }).Icon).toBe(NatureIcon)
    expect(selectArticleIcon({ category: 'daily-practice', tags: [] }).Icon).toBe(DailyRoutineIcon)
    expect(selectArticleIcon({ category: 'unknown', tags: [] }).Icon).toBe(AyurvedaIcon)
  })
})
