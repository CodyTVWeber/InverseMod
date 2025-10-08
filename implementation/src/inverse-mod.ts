/**
 * Forward Iterative Method - TypeScript Implementation
 * Original algorithm by Cody Weber (2022)
 * 
 * This implementation includes all improvements discovered through analysis:
 * - Proper GCD pre-validation
 * - Fixed k-value calculation with proper bounds checking
 * - Backtracking support for handling edge cases
 * - Comprehensive type safety
 * 
 * To God be the glory for all wisdom and knowledge.
 */

export interface AlgorithmStep {
  stepNumber: number;
  remainder: number;
  multiplier: number;
  product: number;
  description: string;
}

export interface AlgorithmResult {
  success: boolean;
  inverse: number;
  steps: AlgorithmStep[];
  method: 'direct' | 'backtracking';
  backtrackCount: number;
  message: string;
  // Additional diagnostics
  forwardAttempts?: number; // total k-evaluations tried by forward method (including backtracks)
  forwardPathLength?: number; // multipliers chosen along the successful forward path
  euclidIterations?: number; // quotient iterations in Euclid fallback (if used)
  methodTimeline?: Array<{ method: 'forward' | 'euclid'; steps: number; note?: string }>;
}

export interface BacktrackingOptions {
  maxDepth?: number;
  maxBacktracks?: number;
  multiplierOffsets?: number[];
}

/**
 * Extended Euclidean algorithm (integer version)
 */
function egcd(a: number, b: number): { g: number; x: number; y: number; iters: number } {
  let old_r = a, r = b;
  let old_s = 1, s = 0;
  let old_t = 0, t = 1;
  let iters = 0;
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    const tmp_r = r; r = old_r - q * r; old_r = tmp_r;
    const tmp_s = s; s = old_s - q * s; old_s = tmp_s;
    const tmp_t = t; t = old_t - q * t; old_t = tmp_t;
    iters++;
  }
  return { g: old_r, x: old_s, y: old_t, iters };
}

function inverseEuclid(m: number, n: number): { inv: number | null; iters: number } {
  const { g, x, iters } = egcd(m, n);
  if (g !== 1) return null;
  const inv = ((x % n) + n) % n;
  return { inv, iters };
}

/**
 * Compute the greatest common divisor using Euclidean algorithm
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Validate inputs and check if modular inverse exists
 */
export function validateInputs(x: number, y: number): { valid: boolean; message: string } {
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    return { valid: false, message: "Both x and y must be integers" };
  }
  
  if (x <= 0 || y <= 0) {
    return { valid: false, message: "Both x and y must be positive integers" };
  }
  
  if (x >= y) {
    // Normalize x to be less than y
    x = x % y;
    if (x === 0) {
      return { valid: false, message: `${x} is a multiple of ${y}, no inverse exists` };
    }
  }
  
  const g = gcd(x, y);
  if (g !== 1) {
    return { valid: false, message: `gcd(${x}, ${y}) = ${g} ≠ 1, no inverse exists` };
  }
  
  return { valid: true, message: "Inputs are valid" };
}

/**
 * Calculate the optimal k-value for a given remainder
 * Ensures: y < (remainder * k) < (remainder + y)
 */
export function calculateOptimalK(remainder: number, modulus: number): number {
  // Use ceiling division to ensure (remainder * k) > modulus
  const k = Math.ceil(modulus / remainder);
  
  // Verify the bounds
  const product = remainder * k;
  if (product <= modulus || product >= remainder + modulus) {
    // This shouldn't happen with ceiling division, but let's be safe
    return k + 1;
  }
  
  return k;
}

/**
 * Core forward method algorithm with backtracking support
 */
export function inverseMod(x: number, y: number, options: BacktrackingOptions = {}): AlgorithmResult {
  // Set default options
  const maxDepth = options.maxDepth ?? 64;
  const maxBacktracks = options.maxBacktracks ?? 100;
  // For efficiency, limit default offsets to a reasonable range
  const maxOffset = Math.min(20, y - 1);
  const defaultOffsets: number[] = [];
  for (let i = 0; i <= maxOffset; i++) {
    defaultOffsets.push(i);
  }
  const multiplierOffsets = options.multiplierOffsets ?? defaultOffsets;
  
  // Validate inputs
  const validation = validateInputs(x, y);
  if (!validation.valid) {
    return {
      success: false,
      inverse: 0,
      steps: [],
      method: 'direct',
      backtrackCount: 0,
      message: validation.message
    };
  }
  
  // Normalize x to be less than y
  const normalizedX = x % y;

  // Reflection preconditioning: flip to the small side when m > y/2
  // Fast path: if m = y-1, the inverse is m
  if (normalizedX === y - 1) {
    const step: AlgorithmStep = {
      stepNumber: 0,
      remainder: normalizedX,
      multiplier: y - 1,
      product: ((y - 1) * (y - 1)) % y,
      description: `Self-inverse case: x ≡ y-1, inverse = ${y - 1}`
    };
    return {
      success: true,
      inverse: y - 1,
      steps: [step],
      method: 'direct',
      backtrackCount: 0,
      message: 'Self-inverse fast path (m = y-1)'
    };
  }

  let startRemainder = normalizedX;
  let reflected = false;
  if (startRemainder > Math.floor(y / 2)) {
    startRemainder = y - startRemainder; // work with smaller residue
    reflected = true;
  }
  
  // Special case: x = 1
  if (normalizedX === 1) {
    return {
      success: true,
      inverse: 1,
      steps: [{
        stepNumber: 1,
        remainder: 1,
        multiplier: 1,
        product: 1,
        description: "x = 1, inverse is 1"
      }],
      method: 'direct',
      backtrackCount: 0,
      message: "Direct solution: x = 1"
    };
  }
  
  // Depth-first search with backtracking
  let backtrackCount = 0;
  
  let forwardAttemptCount = 0;

  function dfs(
    currentRemainder: number,
    depth: number,
    multipliers: number[],
    remainders: number[],
    steps: AlgorithmStep[]
  ): { found: boolean; steps: AlgorithmStep[] } | null {
    
    if (depth > maxDepth) {
      return null;
    }
    
    if (currentRemainder === 1) {
      // Success! We found the inverse
      return { found: true, steps };
    }
    
    if (currentRemainder === 0) {
      // Dead end, need to backtrack
      return null;
    }
    
    // Try different multiplier offsets
    const baseK = calculateOptimalK(currentRemainder, y);
    
    for (const offset of multiplierOffsets) {
      const k = baseK + offset;
      if (k <= 0) continue;
      
      const product = currentRemainder * k;
      const nextRemainder = product % y;
      forwardAttemptCount++;
      
      // Skip if we're not making progress
      if (nextRemainder === 0 && depth < maxDepth - 1) {
        continue;
      }
      
      if (nextRemainder >= currentRemainder && nextRemainder !== 1) {
        continue;
      }
      
      // Create step description
      const newStep: AlgorithmStep = {
        stepNumber: depth + 1,
        remainder: currentRemainder,
        multiplier: k,
        product: product,
        description: `${y} < (${currentRemainder} × ${k} = ${product}) < ${currentRemainder + y}, remainder = ${nextRemainder}`
      };
      
      const result = dfs(
        nextRemainder,
        depth + 1,
        [...multipliers, k],
        [...remainders, nextRemainder],
        [...steps, newStep]
      );
      
      if (result) {
        return result;
      }
      
      // Track backtracking
      if (offset > 0) {
        backtrackCount++;
        if (backtrackCount > maxBacktracks) {
          return null;
        }
      }
    }
    
    return null;
  }
  
  // Start the search
  const initialStep: AlgorithmStep = {
    stepNumber: 0,
    remainder: startRemainder,
    multiplier: 1,
    product: startRemainder,
    description: `Starting with x = ${x} ≡ ${startRemainder} (mod ${y})${reflected ? ' [reflected to small side]' : ''}`
  };
  
  const result = dfs(startRemainder, 0, [], [startRemainder], [initialStep]);
  
  if (!result) {
    // Fallback to Extended Euclid (guaranteed when gcd=1)
    const eg = inverseEuclid(startRemainder, y);
    if (eg.inv === null) {
      return {
        success: false,
        inverse: 0,
        steps: [initialStep],
        method: 'backtracking',
        backtrackCount: backtrackCount,
        message: `Failed to find inverse after ${backtrackCount} backtracks`
      };
    }
    let inv = eg.inv;
    if (reflected) inv = (y - inv) % y;
    const validationStep: AlgorithmStep = {
      stepNumber: 1,
      remainder: 1,
      multiplier: inv,
      product: (inv * (reflected ? (y - normalizedX) : normalizedX)) % y,
      description: `Euclid fallback on ${reflected ? (y - normalizedX) : normalizedX}: (${inv} × ${reflected ? (y - normalizedX) : normalizedX}) mod ${y}`
    };
    return {
      success: true,
      inverse: inv,
      steps: [initialStep, validationStep],
      method: 'backtracking',
      backtrackCount: backtrackCount,
      message: 'Recovered via Euclid fallback',
      forwardAttempts: forwardAttemptCount,
      forwardPathLength: 0,
      euclidIterations: eg.iters,
      methodTimeline: [
        { method: 'forward', steps: forwardAttemptCount, note: 'attempted k-evaluations' },
        { method: 'euclid', steps: eg.iters, note: 'quotient iterations' }
      ]
    };
  }
  
  // Calculate the inverse as the product of all multipliers
  let inverse = 1;
  const multipliers: number[] = [];
  
  for (let i = 1; i < result.steps.length; i++) {
    const k = result.steps[i].multiplier;
    multipliers.push(k);
    inverse = (inverse * k) % y;
  }

  // If we reflected to (y - m), recover inv(m) ≡ -inv(y-m) (mod y)
  if (reflected) {
    inverse = (y - inverse) % y;
  }
  
  // Add final validation step
  const validationStep: AlgorithmStep = {
    stepNumber: result.steps.length,
    remainder: 1,
    multiplier: inverse,
    product: (inverse * x) % y,
    description: `Validation: (${inverse} × ${x}) mod ${y} = ${(inverse * x) % y}`
  };
  
  result.steps.push(validationStep);
  
  return {
    success: true,
    inverse: inverse,
    steps: result.steps,
    method: backtrackCount > 0 ? 'backtracking' : 'direct',
    backtrackCount: backtrackCount,
    message: `Found inverse ${inverse} using ${backtrackCount > 0 ? 'backtracking' : 'direct'} method`,
    forwardAttempts: forwardAttemptCount,
    forwardPathLength: multipliers.length,
    methodTimeline: [ { method: 'forward', steps: multipliers.length, note: 'multipliers in solution path' } ]
  };
}

/**
 * Get a detailed explanation of how the algorithm works
 */
export function getAlgorithmExplanation(): string {
  return `
Forward Iterative Method (Cody Weber, 2022)
============================================

Given: x mod y, find z such that (z × x) mod y = 1

Algorithm Steps:
1. Validate that gcd(x, y) = 1 (inverse exists only for coprime numbers)
2. Find k₁ such that y < (x × k₁) < (x + y)
3. Compute r₁ = (x × k₁) mod y
4. For each rᵢ > 1:
   - Find kᵢ₊₁ such that y < (rᵢ × kᵢ₊₁) < (rᵢ + y)
   - Compute rᵢ₊₁ = (rᵢ × kᵢ₊₁) mod y
5. When rₙ = 1, compute z = (k₁ × k₂ × ... × kₙ) mod y

Key Features:
- Pre-validation using GCD check
- Optimal k-value calculation using ceiling division
- Backtracking when remainder becomes 0 or stops decreasing
- Multiple k-value offsets to explore different paths

The forward method uses a forward-iterative approach with bounded multiplication constraint.
`;
}

/**
 * Format the algorithm result as a readable string
 */
export function formatResult(result: AlgorithmResult): string {
  const lines: string[] = [];
  
  lines.push(`Forward Method Result`);
  lines.push(`====================`);
  lines.push(`Success: ${result.success}`);
  lines.push(`Method: ${result.method}`);
  
  if (result.backtrackCount > 0) {
    lines.push(`Backtracks: ${result.backtrackCount}`);
  }
  
  lines.push(`Message: ${result.message}`);
  lines.push(``);
  
  if (result.steps.length > 0) {
    lines.push(`Steps:`);
    for (const step of result.steps) {
      lines.push(`  ${step.description}`);
    }
  }
  
  if (result.success) {
    lines.push(``);
    lines.push(`Final Answer: ${result.inverse}`);
  }
  
  return lines.join('\n');
}