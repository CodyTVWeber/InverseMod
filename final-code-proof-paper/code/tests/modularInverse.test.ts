import { describe, it, expect } from 'vitest'
import { modularInverse, computeModularInverse, explainHeuristicRun } from '../src/proof/modularInverse'

describe('modularInverse heuristic', () => {
  it('computes simple known inverses', () => {
    expect(modularInverse(3, 7)).toBe(5)
    expect(modularInverse(8, 5)).toBe(2)
    expect(modularInverse(7, 11)).toBe(8)
    expect(modularInverse(6, 7)).toBe(6)
    expect(modularInverse(17, 23)).toBe(19)
  })

  it('handles x = 1 correctly', () => {
    expect(modularInverse(1, 10)).toBe(1)
    expect(modularInverse(1, 7)).toBe(1)
  })

  it('recovers tricky coprime case 5 mod 12 -> 5', () => {
    expect(modularInverse(5, 12)).toBe(5)
  })

  it('returns null when no inverse exists (gcd > 1)', () => {
    expect(modularInverse(4, 6)).toBeNull()
    expect(modularInverse(2, 4)).toBeNull()
    expect(modularInverse(9, 15)).toBeNull()
  })

  it('agrees with known result 31 mod 37 -> 6', () => {
    expect(modularInverse(31, 37)).toBe(6)
  })
})

describe('computeModularInverse metadata', () => {
  it('provides details when heuristic succeeds', () => {
    const res = computeModularInverse(3, 7)
    expect(res.success).toBe(true)
    expect(res.inverse).toBe(5)
    expect(res.method).toBe('heuristic')
    expect(res.details).not.toBeNull()
    if (res.details) {
      expect(res.details.multipliers.length).toBeGreaterThan(0)
      expect(res.details.remainders[0]).toBeGreaterThan(0)
    }
  })

  it('falls back to extended Euclid when enabled and heuristic fails within bounds (synthetic tight bounds)', () => {
    const res = computeModularInverse(5, 12, { maxDepth: 1, maxNodes: 1, fallbackToExtendedEuclid: true })
    expect(res.success).toBe(true)
    expect(res.inverse).toBe(5)
    expect(res.method).toBe('euclid')
  })
})

describe('explainHeuristicRun', () => {
  it('returns a readable explanation with validation line', () => {
    const text = explainHeuristicRun(3, 7)
    expect(text).toMatch(/Calculating inverse of 3 mod 7/)
    expect(text).toMatch(/Validation/)
  })
})

