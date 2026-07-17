import { describe, expect, it } from 'vitest'
import {
  balanceDomains,
  informationState,
  isBalanceDomain,
} from './domains'

describe('balance domain definitions', () => {
  it('defines the six calm primary domains with baseline and current categories', () => {
    expect(balanceDomains.map((domain) => domain.id)).toEqual([
      'sleep',
      'energy',
      'appetite',
      'digestion',
      'routine',
      'stress',
    ])
    expect(balanceDomains.every((domain) => domain.baselineCategory && domain.currentCategory && domain.defaultIconKey)).toBe(true)
    expect(balanceDomains.find((domain) => domain.id === 'stress')).toMatchObject({
      baselineCategory: 'stress_response',
      currentCategory: 'stress_response',
    })
  })

  it('validates deep-link ids and derives non-judgmental information states', () => {
    expect(isBalanceDomain('sleep')).toBe(true)
    expect(isBalanceDomain('unknown')).toBe(false)
    expect(informationState('ordinary')).toBe('available')
    expect(informationState('not_sure')).toBe('uncertain')
    expect(informationState(null, true)).toBe('uncertain')
    expect(informationState(null)).toBe('missing')
  })
})
