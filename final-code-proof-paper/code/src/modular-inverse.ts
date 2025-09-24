/**
 * Modular Inverse Algorithm - Final Implementation
 *
 * This TypeScript implementation provides a robust solution for finding
 * modular multiplicative inverses using Cody Weber's iterative k-remainder approach.
 *
 * Key improvements incorporated from AI analysis:
 * 1. GCD pre-validation to ensure inverse exists
 * 2. Proper k-value calculation with bounds checking
 * 3. Backtracking/tweaking when remainders get stuck
 * 4. Edge case handling (x=1, etc.)
 * 5. Comprehensive error handling and progress tracking
 */

export interface ModularInverseResult {
  success: boolean
  inverse: number | null
  method: 'heuristic' | 'extended-gcd' | 'none'
  details?: {
    multipliers: number[]
    remainders: number[]
    exploredNodes: number
    iterations: number
  }
  reason?: string
  executionTime?: number
}

export interface ModularInverseOptions {
  maxIterations?: number
  maxNodes?: number
  multiplierOffsets?: number[]
  fallbackToExtendedGcd?: boolean
  enableProgressTracking?: boolean
}

/**
 * Compute the greatest common divisor using Euclidean algorithm
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const remainder = a % b
    a = b
    b = remainder
  }
  return a
}

/**
 * Compute ceiling division for positive integers
 */
export function ceilDiv(numerator: number, denominator: number): number {
  return Math.floor((numerator + denominator - 1) / denominator)
}

/**
 * Extended Euclidean algorithm for guaranteed inverse computation
 */
export function extendedGcd(a: number, b: number): { gcd: number; x: number; y: number } {
  if (b === 0) {
    return { gcd: a, x: 1, y: 0 }
  }

  const result = extendedGcd(b, a % b)
  return {
    gcd: result.gcd,
    x: result.y,
    y: result.x - Math.floor(a / b) * result.y
  }
}

/**
 * Core heuristic algorithm with backtracking for finding modular inverse
 */
export function findInverseWithHeuristic(
  base: number,
  modulus: number,
  options: ModularInverseOptions = {}
): ModularInverseResult {
  const startTime = Date.now()
  const settings = {
    maxIterations: options.maxIterations ?? 1000,
    maxNodes: options.maxNodes ?? 5000,
    multiplierOffsets: options.multiplierOffsets ?? [0, 1, 2, 3],
    enableProgressTracking: options.enableProgressTracking ?? false
  }

  // Normalize base to be in range [0, modulus-1]
  const normalizedBase = ((base % modulus) + modulus) % modulus

  // Check if base is 0 (multiple of modulus)
  if (normalizedBase === 0) {
    return {
      success: false,
      inverse: null,
      method: 'none',
      reason: `${base} is a multiple of ${modulus}, no inverse exists`,
      executionTime: Date.now() - startTime
    }
  }

  // Special case: base is 1
  if (normalizedBase === 1) {
    return {
      success: true,
      inverse: 1,
      method: 'heuristic',
      details: {
        multipliers: [1],
        remainders: [1],
        exploredNodes: 1,
        iterations: 1
      },
      executionTime: Date.now() - startTime
    }
  }

  let exploredNodes = 0
  let bestResult: ModularInverseResult | null = null

  // Depth-first search with backtracking
  function dfs(
    currentRemainder: number,
    depth: number,
    chosenMultipliers: number[],
    remainderHistory: number[]
  ): boolean {
    exploredNodes++

    if (exploredNodes >= settings.maxNodes) {
      return false
    }

    if (currentRemainder === 1) {
      const inverse = chosenMultipliers.reduce((acc, mult) => (acc * mult) % modulus, 1)
      bestResult = {
        success: true,
        inverse,
        method: 'heuristic',
        details: {
          multipliers: [...chosenMultipliers],
          remainders: [...remainderHistory],
          exploredNodes,
          iterations: depth
        },
        executionTime: Date.now() - startTime
      }
      return true
    }

    if (depth >= settings.maxIterations) {
      return false
    }

    const baseMultiplier = ceilDiv(modulus, currentRemainder)

    // Try different multiplier offsets
    for (const offset of settings.multiplierOffsets) {
      const multiplier = baseMultiplier + offset

      if (multiplier <= 0) continue

      const nextRemainder = (currentRemainder * multiplier) % modulus

      // Skip if remainder is 0 or not making progress
      if (nextRemainder === 0) continue
      if (nextRemainder >= currentRemainder && depth > 0) continue

      // Avoid revisiting the same remainder sequence
      if (remainderHistory.includes(nextRemainder)) continue

      if (dfs(
        nextRemainder,
        depth + 1,
        [...chosenMultipliers, multiplier],
        [...remainderHistory, nextRemainder]
      )) {
        return true
      }
    }

    return false
  }

  // Start the search
  dfs(normalizedBase, 0, [], [normalizedBase])

  if (bestResult) {
    return bestResult
  }

  return {
    success: false,
    inverse: null,
    method: 'none',
    reason: `Heuristic search exhausted after ${exploredNodes} nodes`,
    details: {
      multipliers: [],
      remainders: [normalizedBase],
      exploredNodes,
      iterations: settings.maxIterations
    },
    executionTime: Date.now() - startTime
  }
}

/**
 * Main function to compute modular inverse with fallback options
 */
export function computeModularInverse(
  base: number,
  modulus: number,
  options: ModularInverseOptions = {}
): ModularInverseResult {
  const startTime = Date.now()

  // Input validation
  if (!Number.isInteger(base) || !Number.isInteger(modulus) || modulus <= 0) {
    return {
      success: false,
      inverse: null,
      method: 'none',
      reason: 'Inputs must be integers with modulus > 0',
      executionTime: Date.now() - startTime
    }
  }

  // Check if inverse exists
  const gcdValue = gcd(base, modulus)
  if (gcdValue !== 1) {
    return {
      success: false,
      inverse: null,
      method: 'none',
      reason: `No inverse exists; gcd(${base}, ${modulus}) = ${gcdValue}`,
      executionTime: Date.now() - startTime
    }
  }

  // Try heuristic approach first
  const heuristicResult = findInverseWithHeuristic(base, modulus, options)

  if (heuristicResult.success || !options.fallbackToExtendedGcd) {
    return heuristicResult
  }

  // Fallback to extended GCD (guaranteed to work)
  const egcd = extendedGcd(base, modulus)
  let inverse = egcd.x % modulus
  if (inverse < 0) inverse += modulus

  return {
    success: true,
    inverse,
    method: 'extended-gcd',
    reason: 'Heuristic failed, used extended GCD as fallback',
    executionTime: Date.now() - startTime
  }
}

/**
 * Convenience function to get just the inverse number
 */
export function modularInverse(base: number, modulus: number, options?: ModularInverseOptions): number | null {
  const result = computeModularInverse(base, modulus, options)
  return result.success ? result.inverse : null
}

/**
 * Detailed explanation of the algorithm execution
 */
export function explainInverseComputation(base: number, modulus: number, options?: ModularInverseOptions): string {
  const result = computeModularInverse(base, modulus, options)

  let explanation = `Computing inverse of ${base} modulo ${modulus}:\n\n`

  if (!result.success) {
    explanation += `❌ ${result.reason}\n`
    if (result.details) {
      explanation += `Explored ${result.details.exploredNodes} nodes in ${result.executionTime}ms\n`
    }
    return explanation
  }

  explanation += `✅ Success using ${result.method} method\n`
  explanation += `Result: ${result.inverse}\n`
  explanation += `Execution time: ${result.executionTime}ms\n\n`

  if (result.details && result.method === 'heuristic') {
    explanation += `📊 Algorithm Details:\n`
    explanation += `Multipliers: [${result.details.multipliers.join(', ')}]\n`
    explanation += `Remainders: [${result.details.remainders.join(' → ')}]\n`
    explanation += `Iterations: ${result.details.iterations}\n`
    explanation += `Nodes explored: ${result.details.exploredNodes}\n\n`
    explanation += `🔍 Validation: (${result.inverse} × ${base}) % ${modulus} = ${(result.inverse! * base) % modulus}`
  }

  return explanation
}

/**
 * Performance analysis utility
 */
export function analyzePerformance(
  testCases: Array<{ base: number; modulus: number }>,
  options?: ModularInverseOptions
): {
  totalTests: number
  successfulTests: number
  averageTime: number
  methodDistribution: Record<string, number>
  failures: Array<{ base: number; modulus: number; reason: string }>
  complexityAnalysis: {
    linear: number
    logarithmic: number
    quadratic: number
    correlation: 'linear' | 'logarithmic' | 'quadratic' | 'mixed'
  }
} {
  const results: ModularInverseResult[] = []
  let totalTime = 0

  for (const testCase of testCases) {
    const result = computeModularInverse(testCase.base, testCase.modulus, options)
    results.push(result)
    totalTime += result.executionTime || 0
  }

  const successfulTests = results.filter(r => r.success).length
  const averageTime = totalTime / testCases.length

  const methodDistribution = results.reduce((acc, result) => {
    acc[result.method] = (acc[result.method] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const failures = results
    .filter(r => !r.success)
    .map(r => ({
      base: testCases[results.indexOf(r)].base,
      modulus: testCases[results.indexOf(r)].modulus,
      reason: r.reason || 'Unknown'
    }))

  // Complexity analysis based on modulus size
  const moduli = testCases.map(tc => tc.modulus)
  const minModulus = Math.min(...moduli)
  const maxModulus = Math.max(...moduli)
  const avgModulus = moduli.reduce((a, b) => a + b, 0) / moduli.length

  // Linear regression analysis
  const n = moduli.length
  const sumX = moduli.reduce((a, b) => a + b, 0)
  const sumY = results.map(r => r.executionTime || 0).reduce((a, b) => a + b, 0)
  const sumXY = moduli.reduce((sum, x, i) => sum + x * (results[i].executionTime || 0), 0)
  const sumXX = moduli.reduce((sum, x) => sum + x * x, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Determine complexity pattern
  let correlation: 'linear' | 'logarithmic' | 'quadratic' | 'mixed' = 'mixed'
  if (Math.abs(slope) < 0.1) correlation = 'logarithmic'
  else if (slope < 1) correlation = 'linear'
  else correlation = 'quadratic'

  return {
    totalTests: testCases.length,
    successfulTests,
    averageTime,
    methodDistribution,
    failures,
    complexityAnalysis: {
      linear: slope,
      logarithmic: Math.abs(slope) < 0.1 ? 1 : 0,
      quadratic: slope > 1 ? slope : 0,
      correlation
    }
  }
}

/**
 * Generate complexity comparison data
 */
export function generateComplexityData(
  maxModulus: number = 1000,
  numSamples: number = 100
): Array<{ modulus: number; base: number; iterations: number; time: number; success: boolean }> {
  const data: Array<{ modulus: number; base: number; iterations: number; time: number; success: boolean }> = []

  for (let i = 0; i < numSamples; i++) {
    const modulus = Math.floor(Math.random() * maxModulus) + 2
    let base: number

    // Ensure we have a coprime pair
    do {
      base = Math.floor(Math.random() * modulus)
    } while (gcd(base, modulus) !== 1)

    const startTime = Date.now()
    const result = computeModularInverse(base, modulus)
    const endTime = Date.now()

    data.push({
      modulus,
      base,
      iterations: result.details?.iterations || 0,
      time: endTime - startTime,
      success: result.success
    })
  }

  return data.sort((a, b) => a.modulus - b.modulus)
}

/**
 * Analyze algorithm complexity patterns
 */
export function analyzeComplexity(
  data: Array<{ modulus: number; base: number; iterations: number; time: number; success: boolean }>
): {
  averageIterationsByModulus: Record<number, number>
  averageTimeByModulus: Record<number, number>
  successRateByModulus: Record<number, number>
  complexityTrend: 'linear' | 'logarithmic' | 'quadratic' | 'mixed'
  recommendations: string[]
} {
  const groupedByModulus: Record<number, Array<typeof data[0]>> = {}

  // Group data by modulus ranges
  data.forEach(item => {
    const range = Math.floor(item.modulus / 50) * 50 // Group into ranges of 50
    if (!groupedByModulus[range]) groupedByModulus[range] = []
    groupedByModulus[range].push(item)
  })

  const averageIterationsByModulus: Record<number, number> = {}
  const averageTimeByModulus: Record<number, number> = {}
  const successRateByModulus: Record<number, number> = {}

  Object.entries(groupedByModulus).forEach(([range, items]) => {
    const avgIterations = items.reduce((sum, item) => sum + item.iterations, 0) / items.length
    const avgTime = items.reduce((sum, item) => sum + item.time, 0) / items.length
    const successRate = items.filter(item => item.success).length / items.length

    averageIterationsByModulus[parseInt(range)] = avgIterations
    averageTimeByModulus[parseInt(range)] = avgTime
    successRateByModulus[parseInt(range)] = successRate
  })

  // Determine complexity trend
  const ranges = Object.keys(averageTimeByModulus).map(Number).sort((a, b) => a - b)
  const times = ranges.map(range => averageTimeByModulus[range])

  let trend: 'linear' | 'logarithmic' | 'quadratic' | 'mixed' = 'mixed'
  if (ranges.length >= 3) {
    // Check if time grows linearly, quadratically, or logarithmically with modulus
    const midIndex = Math.floor(ranges.length / 2)
    const earlyTime = times[midIndex]
    const lateTime = times[times.length - 1]
    const modulusRatio = ranges[ranges.length - 1] / ranges[midIndex]

    if (lateTime / earlyTime < modulusRatio * 1.5) trend = 'linear'
    else if (lateTime / earlyTime < (modulusRatio * modulusRatio) * 1.5) trend = 'quadratic'
    else trend = 'logarithmic'
  }

  const recommendations = []
  const overallSuccessRate = data.filter(d => d.success).length / data.length

  if (overallSuccessRate < 0.9) {
    recommendations.push('Consider increasing maxIterations or maxNodes for better success rate')
  }

  if (trend === 'quadratic') {
    recommendations.push('Algorithm shows quadratic complexity - consider optimization for large moduli')
  }

  if (Object.values(successRateByModulus).some(rate => rate < 0.8)) {
    recommendations.push('Some modulus ranges have low success rates - investigate edge cases')
  }

  return {
    averageIterationsByModulus,
    averageTimeByModulus,
    successRateByModulus,
    complexityTrend: trend,
    recommendations
  }
}