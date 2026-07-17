import { Link } from 'react-router-dom'
import type { CheckIn } from '../prototype/state'

export function CheckInTimeline({ checkIns }: { checkIns: CheckIn[] }) {
  const completed = checkIns
    .filter((checkIn): checkIn is CheckIn & { completedAt: string } => Boolean(checkIn.completedAt))
    .sort((left, right) => new Date(left.completedAt).getTime() - new Date(right.completedAt).getTime())
    .slice(-5)

  if (!completed.length) {
    return <p className="balance-timeline-empty">Your completed check-ins will appear here.</p>
  }

  const labeled = new Set([0, completed.length - 1])
  if (completed.length > 3) labeled.add(Math.floor((completed.length - 1) / 2))

  return (
    <ol aria-label="Recent check-ins" className="check-in-timeline">
      {completed.map((checkIn, index) => {
        const accessibleDate = longDate(checkIn.completedAt)
        return (
          <li className={index === completed.length - 1 ? 'latest' : ''} key={checkIn.id}>
            <Link aria-label={`Open check-in from ${accessibleDate}`} to={`/questions/check-in/${checkIn.id}`}>
              <span aria-hidden="true" className="timeline-dot" />
              <span aria-hidden={!labeled.has(index)} className={labeled.has(index) ? 'timeline-date' : 'sr-only'}>
                {shortDate(checkIn.completedAt)}
              </span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

function shortDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value))
}

function longDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric' }).format(new Date(value))
}
