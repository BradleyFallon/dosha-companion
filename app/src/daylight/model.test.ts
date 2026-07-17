import { describe, expect, it } from 'vitest'
import { resolveDaylightTheme } from './model'

const solarTimes = {
  timeZone: 'America/Los_Angeles',
  sunrise: '2026-07-17T05:40',
  sunset: '2026-07-17T20:55',
}

function atLosAngelesTime(hour: number, minute = 0) {
  return new Date(Date.UTC(2026, 6, 17, hour + 7, minute))
}

describe('daylight theme model', () => {
  it.each([
    [12, 0, 'midday'],
    [20, 15, 'sunset'],
    [21, 45, 'twilight'],
    [23, 0, 'night'],
    [5, 10, 'twilight'],
  ] as const)('uses reviewed solar phases at %s:%s', (hour, minute, phase) => {
    expect(resolveDaylightTheme({ now: atLosAngelesTime(hour, minute), ...solarTimes })).toMatchObject({
      phase,
      source: 'solar',
    })
  })

  it('moves the ambient light across the daylight period without treating it as a value chart', () => {
    const morning = resolveDaylightTheme({ now: atLosAngelesTime(7), ...solarTimes })
    const afternoon = resolveDaylightTheme({ now: atLosAngelesTime(16), ...solarTimes })
    expect(morning.ambientPosition).toBeGreaterThanOrEqual(12)
    expect(afternoon.ambientPosition).toBeGreaterThan(morning.ambientPosition)
    expect(afternoon.ambientPosition).toBeLessThanOrEqual(88)
  })

  it('uses the saved time zone before the browser clock when solar data is unavailable', () => {
    expect(resolveDaylightTheme({
      now: new Date('2026-07-17T02:30:00.000Z'),
      timeZone: 'America/Los_Angeles',
    })).toMatchObject({ phase: 'sunset', source: 'timezone' })
  })

  it('falls back to the browser clock when the saved time zone is invalid', () => {
    const now = new Date(2026, 6, 17, 23, 0)
    expect(resolveDaylightTheme({ now, timeZone: 'Not/A_Timezone' })).toMatchObject({
      phase: 'night',
      source: 'browser',
    })
  })

  it('uses a neutral daytime theme for an invalid clock', () => {
    expect(resolveDaylightTheme({ now: new Date(Number.NaN), ...solarTimes })).toEqual({
      phase: 'midday',
      ambientPosition: 50,
      source: 'neutral',
      nextTransitionInMinutes: null,
    })
  })

  it('returns the next boundary so the UI can update without a continuous timer', () => {
    expect(resolveDaylightTheme({
      now: atLosAngelesTime(20, 15),
      ...solarTimes,
    }).nextTransitionInMinutes).toBe(70)
  })
})
