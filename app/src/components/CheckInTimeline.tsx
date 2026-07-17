import { Link } from 'react-router-dom'
import type { CheckInTimelineItem } from '../balance/model'

export function CheckInTimeline({ items }: { items: CheckInTimelineItem[] }) {
  if (!items.length) {
    return <p className="balance-timeline-empty">Your completed check-ins will appear here.</p>
  }

  const labeled = new Set([0, items.length - 1])
  if (items.length > 3) labeled.add(Math.floor((items.length - 1) / 2))

  return (
    <ol aria-label="Recent check-ins" className="check-in-timeline">
      {items.map((checkIn, index) => {
        const accessibleDate = longDate(checkIn.completedAt)
        return (
          <li className={index === items.length - 1 ? 'latest' : ''} key={checkIn.id}>
            <Link aria-label={`Open check-in from ${accessibleDate}`} to={checkIn.href}>
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
