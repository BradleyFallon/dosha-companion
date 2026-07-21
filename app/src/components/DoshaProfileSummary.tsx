import { Link } from 'react-router-dom'
import {
  getDevelopmentDoshaFixture,
  type Dosha,
  type ScoringResult,
} from '../quiz/result'
import type { PrototypeState } from '../prototype/state'
import { ForwardIcon, KaphaIcon, PittaIcon, VataIcon } from '../ui/icons'

interface DoshaProfileSummaryProps {
  fixtureId: PrototypeState['doshaFixtureId']
  result: ScoringResult
  href?: string
  prominent?: boolean
}

export function DoshaProfileSummary({ fixtureId, href, prominent = false, result }: DoshaProfileSummaryProps) {
  const fixture = getDevelopmentDoshaFixture(fixtureId)
  const className = `dosha-profile-summary${prominent ? ' prominent' : ''}${fixture ? ' sample' : ` ${result.kind}`}`
  const accessibleLabel = fixture
    ? 'Sample dosha profile. Usual nature: Vata and Pitta. Current pattern: Vata is more prominent.'
    : result.kind === 'calculated'
      ? `Prototype dosha estimate. Usual nature: ${result.baselineLabel}. Current pattern: ${result.currentLabel}.`
      : 'Dosha profile: not enough information for a prototype estimate.'
  const content = fixture ? (
    <>
      <div aria-hidden="true" className="dosha-profile-symbols">
        <VataIcon className="dosha-icon-vata" focusable="false" weight="duotone" />
        <PittaIcon className="dosha-icon-pitta" focusable="false" weight="duotone" />
      </div>
      <div className="dosha-profile-copy">
        <p className="eyebrow">Sample dosha profile</p>
        <strong>{fixture.baselineLabel}</strong>
        <span>{fixture.currentLabel}</span>
        <small>Controlled example for interface review</small>
      </div>
      {href ? <ForwardIcon aria-hidden="true" className="dosha-profile-forward" focusable="false" /> : null}
    </>
  ) : result.kind === 'calculated' ? (
    <>
      <div aria-hidden="true" className="dosha-profile-symbols">
        {result.baseline.doshas.map((dosha) => <DoshaSymbol dosha={dosha} key={dosha} />)}
      </div>
      <div className="dosha-profile-copy">
        <p className="eyebrow">Prototype dosha estimate</p>
        <strong>{result.baselineLabel}</strong>
        <span>{result.currentLabel}</span>
        <small>Answer-derived using draft unit weights</small>
      </div>
      {href ? <ForwardIcon aria-hidden="true" className="dosha-profile-forward" focusable="false" /> : null}
    </>
  ) : (
    <>
      <div aria-hidden="true" className="dosha-profile-symbols muted">
        <VataIcon focusable="false" />
        <PittaIcon focusable="false" />
      </div>
      <div className="dosha-profile-copy">
        <p className="eyebrow">Your dosha profile</p>
        <strong>Not enough information</strong>
        <small>Complete more assessment questions for a prototype estimate</small>
      </div>
      {href ? <ForwardIcon aria-hidden="true" className="dosha-profile-forward" focusable="false" /> : null}
    </>
  )

  return href ? (
    <Link aria-label={accessibleLabel} className={className} to={href}>{content}</Link>
  ) : (
    <section aria-label={accessibleLabel} className={className}>{content}</section>
  )
}

function DoshaSymbol({ dosha }: { dosha: Dosha }) {
  if (dosha === 'vata') return <VataIcon className="dosha-icon-vata" focusable="false" weight="duotone" />
  if (dosha === 'pitta') return <PittaIcon className="dosha-icon-pitta" focusable="false" weight="duotone" />
  return <KaphaIcon className="dosha-icon-kapha" focusable="false" weight="duotone" />
}
