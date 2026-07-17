import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import type { IconProps } from '../ui/icons'

export interface PatternCoverageRingProps {
  label: string
  represented: number
  total: number
  icon: ComponentType<IconProps>
  href: string
}

export function PatternCoverageRing({
  label,
  represented,
  total,
  icon: Icon,
  href,
}: PatternCoverageRingProps) {
  const safeTotal = Math.max(total, 1)
  const circumference = 2 * Math.PI * 42
  const segmentStride = circumference / safeTotal
  const segmentLength = segmentStride * 0.68

  return (
    <Link
      aria-label={`${label} pattern: ${represented} of ${total} areas represented`}
      className="pattern-ring-link"
      to={href}
    >
      <span className="pattern-ring-graphic">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
          {Array.from({ length: safeTotal }, (_, index) => (
            <circle
              className={index < represented ? 'represented' : 'unrepresented'}
              cx="50"
              cy="50"
              fill="none"
              key={index}
              r="42"
              strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
              strokeDashoffset={-index * segmentStride}
              strokeWidth="7"
              transform="rotate(-90 50 50)"
            />
          ))}
        </svg>
        <Icon aria-hidden="true" focusable="false" weight="duotone" />
      </span>
      <span>{label}</span>
    </Link>
  )
}
