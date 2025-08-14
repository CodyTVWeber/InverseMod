# InverseMod Algorithm

## Author
**Cody Weber**

## About
This repository contains an implementation of a modular multiplicative inverse algorithm that I developed around 2022 during my college studies. The algorithm represents my original mathematical research and approach to solving modular arithmetic problems.

## Research Intentions
I am currently working to develop this algorithm into a formal research mathematics paper. The algorithm provides a novel approach to finding modular multiplicative inverses using iterative k-value calculations and remainder tracking.

## Algorithm Overview
The algorithm finds the modular multiplicative inverse z such that (z * x) mod y = 1, where x and y are positive integers.

### Core Concept
The algorithm uses a series of k-values and r-values where:
1. y < (x * k₁) < (x + y), ((x * k₁) % y) = r₁
2. y < (r₁ * k₂) < (r₁ + y), ((r₁ * k₂) % y) = r₂, r₂ < r₁
3. Continue until rₙ = 1 (or 0 if unsuccessful)
4. z = (k₁ * k₂ * ... * kₙ) mod y

### Validation
The result is validated by checking if (z * x) mod y == 1

## Implementation
- **Go**: Original implementation with HTTP server endpoints
- **JavaScript**: Port of the algorithm for web-based usage

## Usage
The Go implementation provides HTTP endpoints:
- `/inverse-mod?x=<integer>&y=<integer>` - Shows detailed steps
- `/inverse-mod-z?x=<integer>&y=<integer>` - Returns just the result
- `/inverse-mod-explanation` - Algorithm explanation

## Complexity Analysis
- We provide an empirical analysis script that measures the number of iteration steps as a function of y.
- Run:
```bash
node scripts/complexityAnalysis.js 200    # scan y up to 200, full coprime x
node scripts/complexityAnalysis.js 200 5  # sample 5 x-values per y
```
- Outputs CSV under `out/` and prints summary with a regression against log2(y).

## Research Status
This algorithm is under active development for formal mathematical publication. The implementation may contain bugs that are being investigated and resolved.