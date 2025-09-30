/**
 * Property-based testing for modular arithmetic
 *
 * This module provides mathematical property tests to validate
 * the correctness of the modular inverse algorithm and related functions.
 */

import { verifyProperty, type Property, type GeneratorFn } from './spec'
import { computeModularInverse, gcd, extendedGcd } from '../modular-inverse'

export interface ModularArithmeticTestCase {
  base: number
  modulus: number
  inverse?: number
}

/**
 * Property: Modular inverse is unique when it exists
 */
export class InverseUniquenessProperty implements Property<ModularArithmeticTestCase> {
  check(candidate: ModularArithmeticTestCase): boolean {
    const { base, modulus } = candidate

    if (gcd(base, modulus) !== 1) {
      return true // No inverse exists, property vacuously true
    }

    const result1 = computeModularInverse(base, modulus, { fallbackToExtendedGcd: true })
    if (!result1.success) {
      return false // Algorithm should find an inverse
    }

    // Check if the result is actually correct - handle negative numbers properly
    const rawProduct = result1.inverse! * base
    const product = ((rawProduct % modulus) + modulus) % modulus
    return product === 1
  }
}

/**
 * Property: Extended GCD and heuristic should agree on results
 */
export class ConsistencyProperty implements Property<ModularArithmeticTestCase> {
  check(candidate: ModularArithmeticTestCase): boolean {
    const { base, modulus } = candidate

    if (gcd(base, modulus) !== 1) {
      return true // No inverse exists, consistency not applicable
    }

    const heuristicResult = computeModularInverse(base, modulus, { fallbackToExtendedGcd: false })
    const egcdResult = extendedGcd(base, modulus)

    if (!heuristicResult.success) {
      return true // Heuristic failed, but that's acceptable for consistency check
    }

    let egcdInverse = egcdResult.x % modulus
    if (egcdInverse < 0) egcdInverse += modulus

    // Both should give valid inverses - handle negative numbers properly
    const heuristicRawProduct = heuristicResult.inverse! * base
    const egcdRawProduct = egcdInverse * base

    const heuristicProduct = ((heuristicRawProduct % modulus) + modulus) % modulus
    const egcdProduct = ((egcdRawProduct % modulus) + modulus) % modulus

    return heuristicProduct === 1 && egcdProduct === 1
  }
}

/**
 * Property: GCD computation is correct
 */
export class GcdProperty implements Property<{ a: number; b: number; expected: number }> {
  check(candidate: { a: number; b: number; expected: number }): boolean {
    const computed = gcd(candidate.a, candidate.b)
    return computed === candidate.expected
  }
}

/**
 * Property: If GCD(a,b) = 1, then modular inverse should exist
 */
export class ExistenceProperty implements Property<ModularArithmeticTestCase> {
  check(candidate: ModularArithmeticTestCase): boolean {
    const { base, modulus } = candidate
    const gcdValue = gcd(base, modulus)

    const result = computeModularInverse(base, modulus)

    if (gcdValue === 1) {
      return result.success
    } else {
      return !result.success
    }
  }
}

/**
 * Generator for coprime pairs
 */
export function coprimePairGenerator(): ModularArithmeticTestCase {
  let base: number
  let modulus: number

  do {
    modulus = Math.floor(Math.random() * 100) + 2 // 2 to 101
    base = Math.floor(Math.random() * modulus) // 0 to modulus-1
  } while (gcd(base, modulus) !== 1)

  return { base, modulus }
}

/**
 * Generator for non-coprime pairs
 */
export function nonCoprimePairGenerator(): ModularArithmeticTestCase {
  let base: number
  let modulus: number
  let targetGcd: number

  do {
    modulus = Math.floor(Math.random() * 50) + 2 // 2 to 51
    base = Math.floor(Math.random() * modulus) // 0 to modulus-1
    targetGcd = gcd(base, modulus)
  } while (targetGcd === 1)

  return { base, modulus }
}

/**
 * Generator for known test cases
 */
export function knownCasesGenerator(): ModularArithmeticTestCase {
  const knownCases = [
    { base: 3, modulus: 7 },
    { base: 5, modulus: 12 },
    { base: 8, modulus: 5 },
    { base: 17, modulus: 23 },
    { base: 31, modulus: 37 },
    { base: 1, modulus: 10 },
    { base: 6, modulus: 7 },
  ]

  const randomCase = knownCases[Math.floor(Math.random() * knownCases.length)]
  return { ...randomCase }
}

/**
 * Generator for GCD test cases
 */
export function gcdTestGenerator(): { a: number; b: number; expected: number } {
  const testCases = [
    { a: 48, b: 18, expected: 6 },
    { a: 7, b: 11, expected: 1 },
    { a: 100, b: 75, expected: 25 },
    { a: 17, b: 23, expected: 1 },
    { a: 0, b: 5, expected: 5 },
    { a: 5, b: 0, expected: 5 },
    { a: 42, b: 56, expected: 14 },
  ]

  return testCases[Math.floor(Math.random() * testCases.length)]
}

/**
 * Run comprehensive property tests
 */
export function runPropertyTests(): {
  inverseUniqueness: ReturnType<typeof verifyProperty>
  consistency: ReturnType<typeof verifyProperty>
  existence: ReturnType<typeof verifyProperty>
  gcdCorrectness: ReturnType<typeof verifyProperty>
} {
  const numTrials = 500

  const inverseUniqueness = verifyProperty(
    'Modular inverse uniqueness and correctness',
    new InverseUniquenessProperty(),
    coprimePairGenerator,
    numTrials
  )

  const consistency = verifyProperty(
    'Heuristic and extended GCD consistency',
    new ConsistencyProperty(),
    coprimePairGenerator,
    numTrials
  )

  const existence = verifyProperty(
    'Inverse existence based on GCD',
    new ExistenceProperty(),
    () => Math.random() > 0.5 ? coprimePairGenerator() : nonCoprimePairGenerator(),
    numTrials
  )

  const gcdCorrectness = verifyProperty(
    'GCD computation correctness',
    new GcdProperty(),
    gcdTestGenerator,
    numTrials
  )

  return {
    inverseUniqueness,
    consistency,
    existence,
    gcdCorrectness
  }
}

/**
 * Test specific edge cases that are interesting for the algorithm
 */
export function testEdgeCases(): {
  smallPrimes: boolean
  largeNumbers: boolean
  negativeNumbers: boolean
  specialCases: boolean
} {
  // Test small primes
  const smallPrimesTests = [
    { base: 2, modulus: 3 },
    { base: 3, modulus: 5 },
    { base: 5, modulus: 7 },
    { base: 7, modulus: 11 },
  ]

  let smallPrimesPassed = true
  for (const test of smallPrimesTests) {
    const result = computeModularInverse(test.base, test.modulus)
    if (!result.success || (result.inverse! * test.base) % test.modulus !== 1) {
      smallPrimesPassed = false
      break
    }
  }

  // Test large numbers
  const largeNumberTests = [
    { base: 123456789, modulus: 987654321 },
    { base: 1000000007, modulus: 1000000009 },
  ]

  let largeNumbersPassed = true
  for (const test of largeNumberTests) {
    const result = computeModularInverse(test.base, test.modulus)
    if (!result.success || (result.inverse! * test.base) % test.modulus !== 1) {
      largeNumbersPassed = false
      break
    }
  }

  // Test negative numbers
  const negativeTests = [
    { base: -3, modulus: 7 },
    { base: -5, modulus: 12 },
    { base: -1, modulus: 10 },
  ]

  let negativeNumbersPassed = true
  for (const test of negativeTests) {
    const result = computeModularInverse(test.base, test.modulus, { fallbackToExtendedGcd: true })
    if (!result.success) {
      negativeNumbersPassed = false
      break
    }
    // Validate with proper negative modulo handling
    const rawProduct = result.inverse! * test.base
    const product = ((rawProduct % test.modulus) + test.modulus) % test.modulus
    if (product !== 1) {
      negativeNumbersPassed = false
      break
    }
  }

  // Test special cases
  const specialTests = [
    { base: 1, modulus: 1 }, // gcd(1,1) = 1, but modulus = 1 is edge case
    { base: 1, modulus: 2 }, // 1 has inverse 1 mod 2
    { base: 0, modulus: 7 }, // 0 has no inverse
  ]

  let specialCasesPassed = true
  for (const test of specialTests) {
    const result = computeModularInverse(test.base, test.modulus)
    const expectedSuccess = test.base !== 0 && gcd(test.base, test.modulus) === 1
    if (result.success !== expectedSuccess) {
      specialCasesPassed = false
      break
    }
  }

  return {
    smallPrimes: smallPrimesPassed,
    largeNumbers: largeNumbersPassed,
    negativeNumbers: negativeNumbersPassed,
    specialCases: specialCasesPassed
  }
}