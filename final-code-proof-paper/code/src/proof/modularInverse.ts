export interface HeuristicOptions {
  maxDepth?: number
  maxNodes?: number
  multiplierOffsets?: number[]
  progressRequired?: boolean
  fallbackToExtendedEuclid?: boolean
}

export interface HeuristicDetails {
  multipliers: number[]
  remainders: number[]
  exploredNodes: number
}

export interface InverseResult {
  success: boolean
  inverse: number | null
  method: 'heuristic' | 'euclid' | 'none'
  details: HeuristicDetails | null
  reason?: string
}

export function computeGreatestCommonDivisor(a: number, b: number): number {
  let valueA = Math.abs(a)
  let valueB = Math.abs(b)
  while (valueB !== 0) {
    const remainder = valueA % valueB
    valueA = valueB
    valueB = remainder
  }
  return valueA
}

export function ceilDiv(numerator: number, denominator: number): number {
  if (denominator === 0) throw new Error('denominator must be non-zero')
  const q = Math.floor((numerator + denominator - 1) / denominator)
  return q
}

export function extendedEuclidInverse(base: number, modulus: number): { gcd: number; inverse: number | null } {
  let s = 0, oldS = 1
  let t = 1, oldT = 0
  let r = modulus, oldR = base

  while (r !== 0) {
    const quotient = Math.floor(oldR / r)
    const tempR = r
    r = oldR - quotient * r
    oldR = tempR

    const tempS = s
    s = oldS - quotient * s
    oldS = tempS

    const tempT = t
    t = oldT - quotient * t
    oldT = tempT
  }

  const gcd = Math.abs(oldR)
  if (gcd !== 1) return { gcd, inverse: null }
  let inv = oldS % modulus
  if (inv < 0) inv += modulus
  return { gcd, inverse: inv }
}

function findInverseWithBacktracking(base: number, modulus: number, options: HeuristicOptions): {
  found: boolean
  inverse: number
  multipliers: number[]
  remainders: number[]
  exploredNodes: number
} {
  const settings = {
    maxDepth: options.maxDepth ?? 64,
    maxNodes: options.maxNodes ?? 2000,
    multiplierOffsets: options.multiplierOffsets ?? [0, 1, 2, 3],
    progressRequired: options.progressRequired ?? true,
  }

  const normalizedBase = ((base % modulus) + modulus) % modulus
  if (normalizedBase === 0) {
    return { found: false, inverse: 0, multipliers: [], remainders: [0], exploredNodes: 0 }
  }
  if (normalizedBase === 1) {
    return { found: true, inverse: 1, multipliers: [1], remainders: [1], exploredNodes: 1 }
  }

  let exploredNodes = 0

  function dfs(currentRemainder: number, depth: number, chosenMultipliers: number[], remainderHistory: number[]): {
    multipliers: number[]
    remainders: number[]
  } | null {
    if (exploredNodes >= settings.maxNodes) return null
    exploredNodes++

    if (currentRemainder === 1) {
      return { multipliers: chosenMultipliers.slice(), remainders: remainderHistory.slice() }
    }
    if (depth >= settings.maxDepth) return null

    const baseMultiplier = ceilDiv(modulus, currentRemainder)

    for (const offset of settings.multiplierOffsets) {
      const multiplier = baseMultiplier + offset
      if (multiplier <= 0) continue

      const nextRemainder = (currentRemainder * multiplier) % modulus
      if (nextRemainder === 0) {
        continue
      }
      if (settings.progressRequired && nextRemainder >= currentRemainder) {
        continue
      }

      const result = dfs(
        nextRemainder,
        depth + 1,
        [...chosenMultipliers, multiplier],
        [...remainderHistory, nextRemainder]
      )
      if (result) return result
    }
    return null
  }

  const initialRemainder = normalizedBase
  const searchResult = dfs(initialRemainder, 0, [], [initialRemainder])
  if (!searchResult) {
    return { found: false, inverse: 0, multipliers: [], remainders: [initialRemainder], exploredNodes }
  }

  let inverse = 1
  for (const multiplier of searchResult.multipliers) {
    inverse = (inverse * multiplier) % modulus
  }
  return { found: true, inverse, multipliers: searchResult.multipliers, remainders: searchResult.remainders, exploredNodes }
}

export function computeModularInverse(base: number, modulus: number, options: HeuristicOptions = {}): InverseResult {
  if (!Number.isInteger(base) || !Number.isInteger(modulus) || modulus <= 0) {
    return { success: false, inverse: null, method: 'none', details: null, reason: 'Inputs must be integers with modulus > 0' }
  }

  const g = computeGreatestCommonDivisor(base, modulus)
  if (g !== 1) {
    return { success: false, inverse: null, method: 'none', details: null, reason: `No inverse exists; gcd(${base}, ${modulus}) = ${g}` }
  }

  const heuristic = findInverseWithBacktracking(base, modulus, options)
  if (heuristic.found) {
    return {
      success: true,
      inverse: heuristic.inverse,
      method: 'heuristic',
      details: {
        multipliers: heuristic.multipliers,
        remainders: heuristic.remainders,
        exploredNodes: heuristic.exploredNodes,
      },
    }
  }

  if (options.fallbackToExtendedEuclid) {
    const eg = extendedEuclidInverse(base, modulus)
    if (eg.inverse !== null) {
      return { success: true, inverse: eg.inverse, method: 'euclid', details: null }
    }
  }

  return { success: false, inverse: null, method: 'none', details: null, reason: 'Heuristic search did not find an inverse within bounds' }
}

export function modularInverse(base: number, modulus: number, options: HeuristicOptions = {}): number | null {
  const result = computeModularInverse(base, modulus, options)
  return result.success ? (result.inverse as number) : null
}

export function explainHeuristicRun(base: number, modulus: number, options: HeuristicOptions = {}): string {
  const g = computeGreatestCommonDivisor(base, modulus)
  if (g !== 1) {
    return `No inverse exists because gcd(${base}, ${modulus}) = ${g}`
  }
  const attempt = findInverseWithBacktracking(base, modulus, options)
  const lines: string[] = []
  lines.push(`Calculating inverse of ${base} mod ${modulus}...`)
  if (!attempt.found) {
    lines.push(`Heuristic search failed after exploring ${attempt.exploredNodes} nodes.`)
    return lines.join('\n')
  }
  lines.push(`Heuristic found a solution after exploring ${attempt.exploredNodes} nodes.`)
  lines.push(`Remainders: ${attempt.remainders.join(' -> ')}`)
  lines.push(`Multipliers: ${attempt.multipliers.join(' × ')}`)
  lines.push(`Inverse = (product of multipliers) mod ${modulus} = ${attempt.inverse}`)
  lines.push(`Validation: (${attempt.inverse} * ${base}) % ${modulus} = ${(attempt.inverse * base) % modulus}`)
  return lines.join('\n')
}

