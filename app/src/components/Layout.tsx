import { useEffect, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { usePrototype } from '../prototype/PrototypeContext'
import {
  BackIcon,
  BalanceIcon,
  LearnIcon,
  QuestionsIcon,
  TodayIcon,
} from '../ui/icons'

const postResultPaths = ['/today', '/questions', '/balance', '/learn', '/assistant', '/settings']

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
  const { state, resetPrototype, dismissRestoreNotice } = usePrototype()
  const location = useLocation()
  const navigate = useNavigate()
  const showNavigation =
    state.resultsReached && postResultPaths.some((path) => location.pathname.startsWith(path))

  function reset() {
    if (!window.confirm('Reset all browser-local prototype progress?')) return
    resetPrototype()
    navigate('/')
  }

  return (
    <div className="app-frame">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <RouteFocus />
      {state.restoreNotice ? (
        <div className="global-notice" role="status">
          <span>{state.restoreNotice}</span>
          <button type="button" onClick={dismissRestoreNotice}>Dismiss</button>
        </div>
      ) : null}
      {state.saveStatus === 'not-saved' ? (
        <div className="global-save-error" role="alert">
          Not saved—changes remain available only for this session.
        </div>
      ) : null}
      <main id="main-content" className={showNavigation ? 'app-main with-nav' : 'app-main'}>
        {children}
      </main>
      {showNavigation ? <BottomNavigation /> : null}
      <button className="prototype-reset" type="button" onClick={reset}>
        Reset prototype
      </button>
    </div>
  )
}

function BottomNavigation() {
  const links = [
    ['/today', 'Today', TodayIcon],
    ['/questions', 'Questions', QuestionsIcon],
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
    <NavLink className="back-link" to={to}>
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
