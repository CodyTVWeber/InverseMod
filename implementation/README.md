<!--
This work is licensed under a Creative Commons Attribution 4.0 International License.
See LICENSE-CC-BY-4.0.md for details.
-->

# Proof-as-Code Implementation

This directory contains the executable version of the paper's core theorem:

> If a forward multiplier sequence reaches remainder 1,  
> the product of those multipliers (mod y) is an inverse of x (mod y).

The code is intentionally small and explicit.

## Files

- `src/forward-proof.js` - theorem-oriented implementation
- `src/index.js` - exports
- `src/demo.js` - runnable examples
- `tests/forward-proof.test.js` - correctness tests

## Run

```bash
npm install
npm test
npm run demo
```

## API

### `forwardInverse(x, y, options?)`

Searches for a forward certificate and returns:

- `success`
- `inverse` (when successful)
- `certificate` (multipliers)
- `remainders`
- `steps`
- `proofChecked` (theorem verified in code)
- `method` (`forward-certificate` or `euclid-fallback`)

### `verifyCertificate(x, y, multipliers)`

Checks the theorem directly for a given multiplier sequence.

### `euclidInverse(x, y)`

Classical guaranteed fallback.