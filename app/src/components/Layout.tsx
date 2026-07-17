import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { resolveDaylightTheme } from '../daylight/model'
import { TodayEnvironmentProvider } from '../daylight/TodayEnvironment'
import { useTodayEnvironment } from '../daylight/TodayEnvironmentContext'
import { usePrototype } from '../prototype/PrototypeContext'
import {
  BackIcon,
  BalanceIcon,
  CheckInIcon,
  LearnIcon,
  TodayIcon,
} from '../ui/icons'

const postResultPaths = ['/today', '/questions', '/balance', '/learn', '/assistant', '/chat', '/settings']

export function RouteFocus() {
  const location = useLocation()

  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('main h1')
    heading?.focus()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return null
}

export function AppShell({ children }: { children: ReactNode }) {
  const { state, dismissRestoreNotice } = usePrototype()
  const location = useLocation()
  const focusedQuiz = location.pathname.startsWith('/questions/check-in/')
  const focusedChat = /^\/chat\/(?:new|[^/]+)$/.test(location.pathname)
  const daylightEnabled = location.pathname === '/today'
  const showNavigation =
    !focusedQuiz && !focusedChat && state.resultsReached && postResultPaths.some((path) => location.pathname.startsWith(path))

  return (
    <TodayEnvironmentProvider enabled={daylightEnabled} profile={state.profile}>
      <AppFrame
        daylightEnabled={daylightEnabled}
        dismissRestoreNotice={dismissRestoreNotice}
        focusedChat={focusedChat}
        restoreNotice={state.restoreNotice}
        saveFailed={state.saveStatus === 'not-saved'}
        showNavigation={showNavigation}
        timeZone={state.profile.location?.timeZone}
      >
        {children}
      </AppFrame>
    </TodayEnvironmentProvider>
  )
}

function AppFrame({
  children,
  daylightEnabled,
  dismissRestoreNotice,
  focusedChat,
  restoreNotice,
  saveFailed,
  showNavigation,
  timeZone,
}: {
  children: ReactNode
  daylightEnabled: boolean
  dismissRestoreNotice: () => void
  focusedChat: boolean
  restoreNotice: string | null
  saveFailed: boolean
  showNavigation: boolean
  timeZone?: string
}) {
  const { conditions } = useTodayEnvironment()
  const [now, setNow] = useState(() => new Date())
  const daylightTheme = useMemo(() => resolveDaylightTheme({
    now,
    timeZone: conditions?.timeZone ?? timeZone,
    sunrise: conditions?.sunrise,
    sunset: conditions?.sunset,
  }), [conditions, now, timeZone])

  useEffect(() => {
    if (!daylightEnabled) return
    const refresh = () => {
      if (document.visibilityState === 'visible') setNow(new Date())
    }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [daylightEnabled])

  useEffect(() => {
    if (!daylightEnabled || daylightTheme.nextTransitionInMinutes === null) return
    const remainingMinute = (now.getSeconds() * 1000) + now.getMilliseconds()
    const delay = Math.max(1000, daylightTheme.nextTransitionInMinutes * 60_000 - remainingMinute + 1000)
    const timeout = window.setTimeout(() => setNow(new Date()), delay)
    return () => window.clearTimeout(timeout)
  }, [daylightEnabled, daylightTheme.nextTransitionInMinutes, daylightTheme.phase, now])

  useEffect(() => {
    if (!daylightEnabled) return
    document.documentElement.dataset.daylightPhase = daylightTheme.phase
    return () => {
      delete document.documentElement.dataset.daylightPhase
    }
  }, [daylightEnabled, daylightTheme.phase])

  const ambientStyle = daylightEnabled
    ? { '--ambient-x': `${daylightTheme.ambientPosition}%` } as CSSProperties
    : undefined
  const frameClassName = daylightEnabled
    ? `app-frame daylight-theme daylight-phase-${daylightTheme.phase}`
    : 'app-frame'

  return (
    <div
      className={frameClassName}
      data-daylight-phase={daylightEnabled ? daylightTheme.phase : undefined}
      data-daylight-source={daylightEnabled ? daylightTheme.source : undefined}
      style={ambientStyle}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <RouteFocus />
      {restoreNotice ? (
        <div className="global-notice" role="status">
          <span>{restoreNotice}</span>
          <button type="button" onClick={dismissRestoreNotice}>Dismiss</button>
        </div>
      ) : null}
      {saveFailed ? (
        <div className="global-save-error" role="alert">
          Not saved—changes remain available only for this session.
        </div>
      ) : null}
      <main id="main-content" className={`${showNavigation ? 'app-main with-nav' : 'app-main'}${focusedChat ? ' focused-chat' : ''}`}>
        {children}
      </main>
      {showNavigation ? <BottomNavigation /> : null}
    </div>
  )
}

function BottomNavigation() {
  const links = [
    ['/today', 'Today', TodayIcon],
    ['/questions', 'Check In', CheckInIcon],
    ['/balance', 'My Balance', BalanceIcon],
    ['/learn', 'Learn', LearnIcon],
  ] as const

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {links.map(([to, label, Icon]) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
          {({ isActive }) => (
            <>
              <Icon
                aria-hidden="true"
                className="nav-icon"
                focusable="false"
                weight={isActive ? 'fill' : 'regular'}
              />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export function Screen({
  children,
  eyebrow,
  className = '',
}: {
  children: ReactNode
  eyebrow?: string
  className?: string
}) {
  return (
    <section className={`screen ${className}`.trim()}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {children}
    </section>
  )
}

export function BackLink({ to, label = 'Back' }: { to: string; label?: string }) {
  return (
    <NavLink className="back-link" end to={to}>
      <BackIcon aria-hidden="true" className="icon-leading" focusable="false" />
      <span>{label}</span>
    </NavLink>
  )
}

export function Status({ children }: { children: ReactNode }) {
  return (
    <p className="save-status" role="status" aria-live="polite">
      {children}
    </p>
  )
}
