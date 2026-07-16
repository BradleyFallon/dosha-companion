import { useEffect, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { usePrototype } from '../prototype/PrototypeContext'

const postResultPaths = ['/today', '/questions', '/balance', '/learn', '/assistant']

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
  const { state, resetPrototype } = usePrototype()
  const location = useLocation()
  const navigate = useNavigate()
  const showNavigation =
    state.resultsReached && postResultPaths.some((path) => location.pathname.startsWith(path))

  function reset() {
    resetPrototype()
    navigate('/')
  }

  return (
    <div className="app-frame">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <RouteFocus />
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
    ['/today', 'Today'],
    ['/questions', 'Questions'],
    ['/balance', 'My Balance'],
    ['/learn', 'Learn'],
  ] as const

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {links.map(([to, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span aria-hidden="true">{label === 'Today' ? '○' : label === 'Questions' ? '?' : label === 'My Balance' ? '≋' : '□'}</span>
          {label}
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
      <span aria-hidden="true">←</span> {label}
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
