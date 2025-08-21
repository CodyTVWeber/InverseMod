# Humanized Modular Inverse

This module computes the modular multiplicative inverse in a way that is easy to read and reason about. It combines:

- Cody Weber's iterative multiplier–remainder idea (with clear names)
- Small, bounded backtracking to avoid known failure modes
- A guaranteed fallback to the extended Euclidean algorithm

## What it returns

`computeModularInverse(base, modulus)` returns:

```
{
	success: boolean,
	inverse: number | null,
	method: 'heuristic' | 'extended_euclid' | 'none',
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
- Otherwise the module falls back to `extended_euclid` and returns that inverse.

## Why this is readable

- We use names like `remainder`, `multiplier`, and `computeGreatestCommonDivisor` instead of single letters.
- We separate concerns: GCD check, heuristic search, and fallback.
- The heuristic search explores only a tiny set of multipliers at each step (ceil(modulus/remainder) plus a few small offsets) and backtracks a limited depth.

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

Start from `currentRemainder = base % modulus`. Choose `multiplier = ceil(modulus/currentRemainder) + offset` for small offsets (0,1,2,3). Update `currentRemainder = (currentRemainder * multiplier) % modulus`. If the remainder reaches 1, the inverse is the product of chosen multipliers (mod modulus). If the remainder becomes 0 or stops decreasing, backtrack and try a different small offset. If the bounded search exhausts options, we return the inverse from the extended Euclidean algorithm.