# Humanized Modular Inverse

This module computes the modular multiplicative inverse using Cody Weber's iterative multiplier–remainder idea, written with clear, self-documenting names. It uses a bounded backtracking heuristic only (no extended Euclidean fallback in this module).

## What it returns

`computeModularInverse(base, modulus)` returns:

```
{
	success: boolean,
	inverse: number | null,
	method: 'heuristic' | 'none',
	details?: {
		multipliers: number[],
		remainders: number[],
		exploredNodes: number
	},
	reason?: string
}
```

- If `gcd(base, modulus) !== 1`, no inverse exists and `success` is false.
- If the heuristic succeeds, `method` is `heuristic` and includes the multipliers and remainders it used.
- If the bounded search exhausts options without success, `success` is false.

## Why this is readable

- Names like `remainder`, `multiplier`, and `computeGreatestCommonDivisor` instead of single letters.
- Clear separation of concerns: GCD check and heuristic search.
- Tiny, bounded exploration using `ceil(modulus/remainder)` plus small offsets.

## Quick start

```js
const {
	computeModularInverse,
	modularInverse,
	explainHeuristicRun
} = require('./modularInverse');

console.log(modularInverse(5, 12));
// -> 5

console.log(computeModularInverse(31, 37));
// -> { success: true, inverse: 6, method: 'heuristic', details: { ... } }

console.log(explainHeuristicRun(5, 12));
// Human-readable step summary
```

## Heuristic in one paragraph

Start from `currentRemainder = base % modulus`. Choose `multiplier = ceil(modulus/currentRemainder) + offset` for small offsets (0,1,2,3). Update `currentRemainder = (currentRemainder * multiplier) % modulus`. If the remainder reaches 1, the inverse is the product of chosen multipliers (mod modulus). If the remainder becomes 0 or stops decreasing, backtrack and try a different small offset. If the bounded search exhausts options, the function returns `success: false` and does not fall back to other algorithms.