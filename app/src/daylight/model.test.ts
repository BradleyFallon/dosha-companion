import { describe, expect, it } from 'vitest'
import { localDateKey, resolveDaylightTheme } from './model'

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

  it.each([
    {
      label: 'Portland winter',
      now: new Date('2026-01-17T20:00:00.000Z'),
      timeZone: 'America/Los_Angeles',
      sunrise: '2026-01-17T07:42',
      sunset: '2026-01-17T16:55',
    },
    {
      label: 'Sydney summer',
      now: new Date('2026-01-17T01:00:00.000Z'),
      timeZone: 'Australia/Sydney',
      sunrise: '2026-01-17T05:58',
      sunset: '2026-01-17T20:09',
    },
    {
      label: 'Sydney winter',
      now: new Date('2026-07-17T02:00:00.000Z'),
      timeZone: 'Australia/Sydney',
      sunrise: '2026-07-17T06:56',
      sunset: '2026-07-17T17:06',
    },
    {
      label: 'India half-hour time zone',
      now: new Date('2026-07-17T06:30:00.000Z'),
      timeZone: 'Asia/Kolkata',
      sunrise: '2026-07-17T05:35',
      sunset: '2026-07-17T18:40',
    },
    {
      label: 'Portland DST transition day',
      now: new Date('2026-03-08T19:00:00.000Z'),
      timeZone: 'America/Los_Angeles',
      sunrise: '2026-03-08T07:31',
      sunset: '2026-03-08T19:08',
    },
  ])('uses supplied local solar times for $label', ({ now, timeZone, sunrise, sunset }) => {
    expect(resolveDaylightTheme({ now, timeZone, sunrise, sunset })).toMatchObject({
      phase: 'midday',
      source: 'solar',
    })
  })

  it.each([
    ['05:14', 'night'],
    ['05:15', 'twilight'],
    ['05:16', 'twilight'],
    ['05:59', 'twilight'],
    ['06:00', 'midday'],
    ['06:01', 'midday'],
    ['16:59', 'midday'],
    ['17:00', 'sunset'],
    ['17:01', 'sunset'],
    ['18:29', 'sunset'],
    ['18:30', 'twilight'],
    ['18:31', 'twilight'],
    ['19:29', 'twilight'],
    ['19:30', 'night'],
    ['19:31', 'night'],
  ] as const)('selects %s as %s at solar boundaries', (clock, phase) => {
    expect(resolveDaylightTheme({
      now: new Date(`2026-07-17T${clock}:00.000Z`),
      timeZone: 'UTC',
      sunrise: '2026-07-17T06:00',
      sunset: '2026-07-17T18:00',
    })).toMatchObject({ phase, source: 'solar' })
  })

  it.each([
    ['missing sunrise', undefined, '2026-07-17T18:00'],
    ['missing sunset', '2026-07-17T06:00', undefined],
    ['equal sunrise and sunset', '2026-07-17T06:00', '2026-07-17T06:00'],
    ['very short daylight', '2026-07-17T10:00', '2026-07-17T12:00'],
    ['very long daylight', '2026-07-17T01:00', '2026-07-17T23:00'],
  ] as const)('uses timezone fallback for %s', (_label, sunrise, sunset) => {
    expect(resolveDaylightTheme({
      now: new Date('2026-07-17T12:00:00.000Z'),
      timeZone: 'UTC',
      sunrise,
      sunset,
    })).toMatchObject({ phase: 'midday', source: 'timezone' })
  })

  it('calculates the saved-zone date independently of the browser date', () => {
    const instant = new Date('2026-07-17T01:30:00.000Z')
    expect(localDateKey(instant, 'America/Los_Angeles')).toBe('2026-07-16')
    expect(localDateKey(instant, 'Asia/Kolkata')).toBe('2026-07-17')
  })
})
