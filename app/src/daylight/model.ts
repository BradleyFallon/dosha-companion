export type DaylightPhase = 'midday' | 'sunset' | 'twilight' | 'night'

export type DaylightSource = 'solar' | 'timezone' | 'browser' | 'neutral'

export interface DaylightThemeInput {
  now: Date
  timeZone?: string
  sunrise?: string
  sunset?: string
}

export interface DaylightTheme {
  phase: DaylightPhase
  ambientPosition: number
  source: DaylightSource
  nextTransitionInMinutes: number | null
}

const CLOCK_TRANSITIONS = [330, 420, 1080, 1200, 1320]
const MINIMUM_PLAUSIBLE_DAYLIGHT_MINUTES = 180
const MAXIMUM_PLAUSIBLE_DAYLIGHT_MINUTES = 1260

export function resolveDaylightTheme({
  now,
  timeZone,
  sunrise,
  sunset,
}: DaylightThemeInput): DaylightTheme {
  if (!Number.isFinite(now.getTime())) {
    return {
      phase: 'midday',
      ambientPosition: 50,
      source: 'neutral',
      nextTransitionInMinutes: null,
    }
  }

  const localTime = minutesFor(now, timeZone)
  const sunriseMinutes = parseLocalClock(sunrise)
  const sunsetMinutes = parseLocalClock(sunset)
  const daylightDuration = sunriseMinutes !== null && sunsetMinutes !== null
    ? sunsetMinutes - sunriseMinutes
    : null
  const hasSolarWindow =
    localTime.usedRequestedTimeZone &&
    sunriseMinutes !== null &&
    sunsetMinutes !== null &&
    daylightDuration !== null &&
    daylightDuration >= MINIMUM_PLAUSIBLE_DAYLIGHT_MINUTES &&
    daylightDuration <= MAXIMUM_PLAUSIBLE_DAYLIGHT_MINUTES

  if (hasSolarWindow) {
    return solarTheme(localTime.minutes, sunriseMinutes, sunsetMinutes)
  }

  return {
    phase: clockPhase(localTime.minutes),
    ambientPosition: clockAmbientPosition(localTime.minutes),
    source: localTime.usedRequestedTimeZone ? 'timezone' : 'browser',
    nextTransitionInMinutes: minutesUntilNext(localTime.minutes, CLOCK_TRANSITIONS),
  }
}

export function localDateKey(date: Date, timeZone?: string) {
  if (!Number.isFinite(date.getTime())) return ''
  if (timeZone) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone,
      }).formatToParts(date)
      const year = parts.find((part) => part.type === 'year')?.value
      const month = parts.find((part) => part.type === 'month')?.value
      const day = parts.find((part) => part.type === 'day')?.value
      if (year && month && day) return `${year}-${month}-${day}`
    } catch {
      // Browser-local date remains the fallback for an invalid saved zone.
    }
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function solarTheme(nowMinutes: number, sunrise: number, sunset: number): DaylightTheme {
  const transitions = [
    normalizeMinutes(sunrise - 45),
    normalizeMinutes(sunrise),
    normalizeMinutes(sunset - 60),
    normalizeMinutes(sunset + 30),
    normalizeMinutes(sunset + 90),
  ]
  let phase: DaylightPhase = 'night'

  if (isWithin(nowMinutes, sunrise - 45, sunrise)) phase = 'twilight'
  if (isWithin(nowMinutes, sunrise, sunset - 60)) phase = 'midday'
  if (isWithin(nowMinutes, sunset - 60, sunset + 30)) phase = 'sunset'
  if (isWithin(nowMinutes, sunset + 30, sunset + 90)) phase = 'twilight'

  const daylightProgress = clamp((nowMinutes - sunrise) / (sunset - sunrise), 0, 1)
  const ambientPosition = nowMinutes >= sunrise && nowMinutes <= sunset + 90
    ? 12 + daylightProgress * 76
    : nowMinutes < sunrise
      ? 12
      : 88

  return {
    phase,
    ambientPosition: Math.round(ambientPosition * 10) / 10,
    source: 'solar',
    nextTransitionInMinutes: minutesUntilNext(nowMinutes, transitions),
  }
}

function clockPhase(minutes: number): DaylightPhase {
  if (minutes >= 330 && minutes < 420) return 'twilight'
  if (minutes >= 420 && minutes < 1080) return 'midday'
  if (minutes >= 1080 && minutes < 1200) return 'sunset'
  if (minutes >= 1200 && minutes < 1320) return 'twilight'
  return 'night'
}

function clockAmbientPosition(minutes: number) {
  if (minutes < 420) return 12
  if (minutes > 1200) return 88
  return Math.round((12 + ((minutes - 420) / 780) * 76) * 10) / 10
}

function minutesFor(date: Date, requestedTimeZone?: string) {
  if (requestedTimeZone) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: requestedTimeZone,
      }).formatToParts(date)
      const hour = Number(parts.find((part) => part.type === 'hour')?.value)
      const minute = Number(parts.find((part) => part.type === 'minute')?.value)
      if (Number.isFinite(hour) && Number.isFinite(minute)) {
        return { minutes: hour * 60 + minute, usedRequestedTimeZone: true }
      }
    } catch {
      // Browser-local time is the safe fallback for an invalid saved zone.
    }
  }

  return {
    minutes: date.getHours() * 60 + date.getMinutes(),
    usedRequestedTimeZone: false,
  }
}

function parseLocalClock(value?: string) {
  if (!value) return null
  const match = value.match(/(?:T|\s)(\d{2}):(\d{2})/)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour > 23 || minute > 59) return null
  return hour * 60 + minute
}

function isWithin(value: number, rawStart: number, rawEnd: number) {
  const start = normalizeMinutes(rawStart)
  const end = normalizeMinutes(rawEnd)
  if (start < end) return value >= start && value < end
  return value >= start || value < end
}

function minutesUntilNext(current: number, transitions: number[]) {
  return Math.min(...transitions.map((transition) => {
    const difference = normalizeMinutes(transition) - current
    return difference > 0 ? difference : difference + 1440
  }))
}

function normalizeMinutes(value: number) {
  return ((value % 1440) + 1440) % 1440
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}
