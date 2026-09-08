<!--
This work is licensed under a Creative Commons Attribution 4.0 International License.
See LICENSE-CC-BY-4.0.md for details.
-->

# Forward-chain modular inverse

Greedy remainder chain with a fixed modulus: multiply `r` by
`k = ceil(m·y/r)`, keep `y` fixed, and take the product of the multipliers as
the inverse. Reflection (`r > y/2` maps to `y − r`) is on by default. When a
step would leave `(ℤ/yℤ)*` the implementation finishes with Extended Euclid.

The code is CommonJS and uses `BigInt` throughout.

## Files

- `src/forward-chain.js` — `forwardChainInverse`, `verifyCertificate`, `gcd`, `euclidInverse`
- `src/index.js` — public exports
- `src/demo.js` — documented traces
- `src/cli.js` — command-line driver
- `tests/forward-chain.test.js` — correctness and performance tests
- `experiments/` — reproducible success-rate and worst-case measurements

## Run

```bash
npm install
npm test
npm run demo
node src/cli.js 11 26 --max-wrap 4
npm run experiments
```

`npm run experiments` regenerates CSVs under `experiments/out/`. Defaults: 20,000 pairs per success-rate cell; exhaustive worst-case for primes just above `2^k` with `k = 10..22` (`WORST_K_MIN` / `WORST_K_MAX` override). See `experiments/NOTES.md`.

## API

All numeric arguments accept `number | bigint | string` and are computed in `BigInt`.

### `forwardChainInverse(x, y, options?)`

Options: `{ reflect = true, maxWrap = 1, euclidFallback = true }`.

Returns:

- `success` — `false` only when no inverse exists, or when the chain is blocked and `euclidFallback` is `false`
- `inverse` — `bigint` or `null`
- `method` — `'forward' | 'forward+euclid' | 'none'`
- `steps` — `{ kind: 'multiply' | 'reflect', k, before, after }[]`
- `certificate` — every applied multiplier, in order (a reflection contributes `y - 1`)
- `fallbackAt` — remainder that left the unit group, else `null`
- `message`

Examples (from `PLAN.md`):

```js
forwardChainInverse(11, 26)
// method 'forward+euclid', inverse 19n, fallbackAt 7n, certificate [3n]

forwardChainInverse(11, 26, { maxWrap: 4 })
// method 'forward', inverse 19n, certificate [3n, 15n]

forwardChainInverse(17, 23)
// method 'forward', inverse 19n, certificate [22n, 4n]
```

### `verifyCertificate(x, y, multipliers)`

Checks `r_i = (r_{i-1} · k_i) mod y`, terminal remainder `1`, and
`x · ∏ k_i ≡ 1 (mod y)`. Returns `{ valid, remainders, inverseFromProduct, reason }`.

A complete `'forward'` certificate verifies; a partial `'forward+euclid'`
certificate does not (the Euclid tail is not part of the multiplier list).

### `euclidInverse(x, y)`

Extended Euclid. Returns the inverse as `bigint`, or `null` if none exists.

### `gcd(a, b)`

Binary-safe Euclid on `BigInt`.
