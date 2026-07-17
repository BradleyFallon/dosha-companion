import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { NatureIcon } from '../ui/icons'
import { CheckInTimeline } from './CheckInTimeline'
import { PatternCoverageRing } from './PatternCoverageRing'

describe('balance graphics', () => {
  it('gives a segmented ring an exact non-visual summary', () => {
    const { container } = render(
      <MemoryRouter>
        <PatternCoverageRing href="/questions/assessment" icon={NatureIcon} label="Usual" represented={14} total={19} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Usual pattern: 14 of 19 areas represented' })).toBeInTheDocument()
    expect(container.querySelectorAll('.pattern-ring-graphic circle')).toHaveLength(19)
    expect(container.querySelectorAll('.pattern-ring-graphic circle.represented')).toHaveLength(14)
  })

  it('shows only the five latest completed check-ins with dated links', () => {
    const checkIns = Array.from({ length: 5 }, (_, index) => ({
      id: `check-in-${index}`,
      completedAt: `2026-07-${String(index + 1).padStart(2, '0')}T10:05:00.000Z`,
      href: `/questions/check-in/check-in-${index}`,
    }))
    render(<MemoryRouter><CheckInTimeline items={checkIns} /></MemoryRouter>)
    const links = screen.getAllByRole('link', { name: /Open check-in from/ })
    expect(links).toHaveLength(5)
    expect(links.at(-1)).toHaveAttribute('href', '/questions/check-in/check-in-4')
  })
})
