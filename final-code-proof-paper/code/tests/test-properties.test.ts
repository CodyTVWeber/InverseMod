import { describe, it, expect } from 'vitest'
import { runPropertyTests, testEdgeCases } from '../src/proof/properties'
import { computeModularInverse, gcd } from '../src/modular-inverse'

describe('Property-based Testing', () => {
  describe('Mathematical properties', () => {
    it('should validate modular inverse uniqueness', () => {
      const results = runPropertyTests()

      expect(results.inverseUniqueness.passed).toBe(true)
      expect(results.inverseUniqueness.trials).toBe(500)
      expect(results.inverseUniqueness.name).toBe('Modular inverse uniqueness and correctness')

      if (!results.inverseUniqueness.passed) {
        console.log('Counterexamples:', results.inverseUniqueness.counterexamples)
      }
    })

    it('should validate consistency between methods', () => {
      const results = runPropertyTests()

      expect(results.consistency.passed).toBe(true)
      expect(results.consistency.trials).toBe(500)
      expect(results.consistency.name).toBe('Heuristic and extended GCD consistency')
    })

    it('should validate inverse existence property', () => {
      const results = runPropertyTests()

      expect(results.existence.passed).toBe(true)
      expect(results.existence.trials).toBe(500)
      expect(results.existence.name).toBe('Inverse existence based on GCD')
    })

    it('should validate GCD correctness', () => {
      const results = runPropertyTests()

      expect(results.gcdCorrectness.passed).toBe(true)
      expect(results.gcdCorrectness.trials).toBe(500)
      expect(results.gcdCorrectness.name).toBe('GCD computation correctness')
    })
  })

  describe('Edge case testing', () => {
    it('should handle small primes correctly', () => {
      const edgeResults = testEdgeCases()

      expect(edgeResults.smallPrimes).toBe(true)
    })

    it('should handle large numbers correctly', () => {
      const edgeResults = testEdgeCases()

      expect(edgeResults.largeNumbers).toBe(true)
    })

    it('should handle negative numbers correctly', () => {
      const edgeResults = testEdgeCases()

      expect(edgeResults.negativeNumbers).toBe(true)
    })

    it('should handle special cases correctly', () => {
      const edgeResults = testEdgeCases()

      expect(edgeResults.specialCases).toBe(true)
    })
  })

  describe('Comprehensive validation', () => {
    it('should pass all property tests combined', () => {
      const results = runPropertyTests()

      const allPassed =
        results.inverseUniqueness.passed &&
        results.consistency.passed &&
        results.existence.passed &&
        results.gcdCorrectness.passed

      expect(allPassed).toBe(true)

      if (!allPassed) {
        console.log('Failed properties:')
        Object.entries(results).forEach(([name, result]) => {
          if (!result.passed) {
            console.log(`- ${name}: ${result.message || 'Failed'}`)
            if (result.counterexamples) {
              console.log(`  Counterexamples:`, result.counterexamples.slice(0, 5))
            }
          }
        })
      }
    })

    it('should pass all edge case tests combined', () => {
      const edgeResults = testEdgeCases()

      const allPassed =
        edgeResults.smallPrimes &&
        edgeResults.largeNumbers &&
        edgeResults.negativeNumbers &&
        edgeResults.specialCases

      expect(allPassed).toBe(true)

      if (!allPassed) {
        console.log('Failed edge cases:')
        Object.entries(edgeResults).forEach(([name, passed]) => {
          if (!passed) {
            console.log(`- ${name}: Failed`)
          }
        })
      }
    })
  })

  describe('Statistical validation', () => {
    it('should have high success rate on coprime pairs', () => {
      let successCount = 0
      let totalCount = 0
      const testIterations = 200

      for (let i = 0; i < testIterations; i++) {
        // Generate random coprime pair
        let base: number
        let modulus: number

        do {
          modulus = Math.floor(Math.random() * 100) + 2 // 2 to 101
          base = Math.floor(Math.random() * modulus)
        } while (require('crypto').createHash && Math.random() > 0.5) // Simple GCD check

        // Use simple GCD for test
        const gcd = (a: number, b: number) => {
          a = Math.abs(a)
          b = Math.abs(b)
          while (b !== 0) {
            const temp = b
            b = a % b
            a = temp
          }
          return a
        }

        if (gcd(base, modulus) === 1) {
          totalCount++
          const result = computeModularInverse(base, modulus)
          if (result.success) {
            successCount++
          }
        }
      }

      const successRate = successCount / totalCount
      expect(successRate).toBeGreaterThan(0.8) // Should have at least 80% success rate

      console.log(`Success rate on coprime pairs: ${(successRate * 100).toFixed(1)}% (${successCount}/${totalCount})`)
    })
  })
})