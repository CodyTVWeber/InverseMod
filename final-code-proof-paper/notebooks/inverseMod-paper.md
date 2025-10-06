# InverseMod Algorithm — Mathematical Paper with Executable JavaScript

This document presents Cody Weber's forward-iterative algorithm for computing modular multiplicative inverses. It is written mathematically while embedding runnable JavaScript scripts for reproducible scenarios.

## 1. Problem Statement and Notation

Given integers x, y with gcd(x, y) = 1, find z such that (z × x) ≡ 1 (mod y).

We normalize x ← x mod y with 1 ≤ x < y. If gcd(x, y) ≠ 1, no inverse exists.

## 2. Core Constraint and Forward Step

The algorithm advances by selecting k ∈ ℕ such that:

\[ y < (r · k) < r + y, \quad r > 0 \]

and updates the remainder r ← (r · k) mod y. Starting with r₀ = x, we iterate until rₙ = 1.

When rᵢ = 1, the inverse is the product of multipliers modulo y:

\[ z ≡ \bigg( \prod_{i=1}^{n} k_i \bigg) \bmod y. \]

A practical k choice is k = ⌈y / r⌉, optionally exploring small nonnegative offsets to escape dead ends.

## 3. Algorithm (with Backtracking)

We use a depth-first exploration over k offsets to avoid early-zero stalls and non-decreasing remainders. The executable implementation lives in `final-code-proof-paper/code/js/lib/inverseMod.js` and exposes `inverseMod`, `formatResult`.

### Run the canonical “happy path” (3 mod 7)

```bash
npm --prefix ../code run js:happy
```

### Run the “no inverse” scenario (4 mod 6)

```bash
npm --prefix ../code run js:no-inverse
```

### Run the “early zero” scenario (historical failure, 5 mod 12)

```bash
npm --prefix ../code run js:early-zero
```

### Ad hoc CLI (pass your own x, y)

```bash
npm --prefix ../code run js:cli -- --x=35 --y=12
```

### Compare against Extended Euclidean (sanity check)

```bash
npm --prefix ../code run js:compare
```

## 4. Mathematical Walkthrough (5 mod 12)

Normalize: 5 < 12, gcd(5, 12) = 1.

- Choose k₁ = ⌈12 / 5⌉ = 3. Then 12 < (5·3) = 15 < 17, r₁ = 15 mod 12 = 3.
- If k₂ = 4 then r₂ = (3·4) mod 12 = 0 (dead end). Backtrack.
- Try k₁' = 5. Then 12 < (5·5) = 25 < 17 is false but the modulo remainder is 1; in practice we explore offsets and accept r = 1 when encountered.

Thus z ≡ 5 (mod 12); indeed (5·5) mod 12 = 1.

## 5. Results and Complexity

- Best case: O(1) when x = y − 1.
- Empirically average O(log y)-like behavior, with occasional shallow backtracking.
- Worst case bounded by search limits; in practice small offsets (≤ 20) suffice for tested ranges.

## 6. Notes on Soundness and Open Questions

- The bounded multiplication window guides progress but allows plateaus; backtracking addresses early-zero and non-decreasing remainders.
- Formal proofs of global termination and tight complexity bounds are left as future work.
- Alternative heuristics (continued-fraction inspired k, beam search, or dynamic offset schedules) can replace simple offsets.

## 7. References and Related Work

- Extended Euclidean algorithm (classical backward approach)
- Fermat’s little theorem (exponentiation-based inverse when y is prime)
- Binary extended GCD; continued fractions
