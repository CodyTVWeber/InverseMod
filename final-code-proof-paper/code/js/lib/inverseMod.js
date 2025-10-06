// InverseMod algorithm - JavaScript version (ESM)
// Incorporates validation, optimal k calculation, and backtracking with configurable options

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function validateInputs(x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    return { valid: false, message: "Both x and y must be integers" };
  }
  if (x <= 0 || y <= 0) {
    return { valid: false, message: "Both x and y must be positive integers" };
  }
  if (x >= y) {
    const nx = x % y;
    if (nx === 0) {
      return { valid: false, message: `${x} is a multiple of ${y}, no inverse exists` };
    }
    x = nx;
  }
  const g = gcd(x, y);
  if (g !== 1) {
    return { valid: false, message: `gcd(${x}, ${y}) = ${g} ≠ 1, no inverse exists` };
  }
  return { valid: true, message: "Inputs are valid" };
}

export function calculateOptimalK(remainder, modulus) {
  const k = Math.ceil(modulus / remainder);
  const product = remainder * k;
  if (product <= modulus || product >= remainder + modulus) {
    return k + 1;
  }
  return k;
}

export function inverseMod(x, y, options = {}) {
  const maxDepth = options.maxDepth ?? 64;
  const maxBacktracks = options.maxBacktracks ?? 100;
  const maxOffset = Math.min(20, y - 1);
  const defaultOffsets = Array.from({ length: maxOffset + 1 }, (_, i) => i);
  const multiplierOffsets = options.multiplierOffsets ?? defaultOffsets;

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

  const normalizedX = x % y;
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

  let backtrackCount = 0;

  function dfs(currentRemainder, depth, steps) {
    if (depth > maxDepth) return null;
    if (currentRemainder === 1) return { found: true, steps };
    if (currentRemainder === 0) return null;

    const baseK = calculateOptimalK(currentRemainder, y);

    for (const offset of multiplierOffsets) {
      const k = baseK + offset;
      if (k <= 0) continue;

      const product = currentRemainder * k;
      const nextRemainder = product % y;

      if (nextRemainder === 0 && depth < maxDepth - 1) continue;
      if (nextRemainder >= currentRemainder && nextRemainder !== 1) continue;

      const newStep = {
        stepNumber: depth + 1,
        remainder: currentRemainder,
        multiplier: k,
        product,
        description: `${y} < (${currentRemainder} × ${k} = ${product}) < ${currentRemainder + y}, remainder = ${nextRemainder}`
      };

      const result = dfs(nextRemainder, depth + 1, [...steps, newStep]);
      if (result) return result;

      if (offset > 0) {
        backtrackCount++;
        if (backtrackCount > maxBacktracks) return null;
      }
    }

    return null;
  }

  const initialStep = {
    stepNumber: 0,
    remainder: normalizedX,
    multiplier: 1,
    product: normalizedX,
    description: `Starting with x = ${x} ≡ ${normalizedX} (mod ${y})`
  };

  const result = dfs(normalizedX, 0, [initialStep]);
  if (!result) {
    return {
      success: false,
      inverse: 0,
      steps: [initialStep],
      method: 'backtracking',
      backtrackCount,
      message: `Failed to find inverse after ${backtrackCount} backtracks`
    };
  }

  let inverse = 1;
  for (let i = 1; i < result.steps.length; i++) {
    const k = result.steps[i].multiplier;
    inverse = (inverse * k) % y;
  }

  const validationStep = {
    stepNumber: result.steps.length,
    remainder: 1,
    multiplier: inverse,
    product: (inverse * x) % y,
    description: `Validation: (${inverse} × ${x}) mod ${y} = ${(inverse * x) % y}`
  };

  result.steps.push(validationStep);

  return {
    success: true,
    inverse,
    steps: result.steps,
    method: backtrackCount > 0 ? 'backtracking' : 'direct',
    backtrackCount,
    message: `Found inverse ${inverse} using ${backtrackCount > 0 ? 'backtracking' : 'direct'} method`
  };
}

export function formatResult(result) {
  const lines = [];
  lines.push('InverseMod Algorithm Result');
  lines.push('===========================');
  lines.push(`Success: ${result.success}`);
  lines.push(`Method: ${result.method}`);
  if (result.backtrackCount > 0) lines.push(`Backtracks: ${result.backtrackCount}`);
  lines.push(`Message: ${result.message}`);
  lines.push('');
  if (result.steps.length > 0) {
    lines.push('Steps:');
    for (const step of result.steps) {
      lines.push(`  ${step.description}`);
    }
  }
  if (result.success) {
    lines.push('');
    lines.push(`Final Answer: ${result.inverse}`);
  }
  return lines.join('\n');
}

export function getAlgorithmExplanation() {
  return [
    'InverseMod Algorithm (Cody Weber, 2022)',
    '=====================================',
    '',
    'Given: x mod y, find z such that (z × x) mod y = 1',
    '',
    'Algorithm Steps:',
    '1. Validate that gcd(x, y) = 1 (inverse exists only for coprime numbers)',
    '2. Find k₁ such that y < (x × k₁) < (x + y)',
    '3. Compute r₁ = (x × k₁) mod y',
    '4. For each rᵢ > 1:',
    '   - Find kᵢ₊₁ such that y < (rᵢ × kᵢ₊₁) < (rᵢ + y)',
    '   - Compute rᵢ₊₁ = (rᵢ × kᵢ₊₁) mod y',
    '5. When rₙ = 1, compute z = (k₁ × k₂ × ... × kₙ) mod y',
    '',
    'Key Improvements:',
    '- Pre-validation using GCD check',
    '- Optimal k-value calculation using ceiling division',
    '- Backtracking when remainder becomes 0 or stops decreasing',
    '- Multiple k-value offsets to explore different paths',
  ].join('\n');
}

// ESM named exports above
