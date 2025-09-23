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

### Project Structure
- `original/` — canonical original code and artifacts
  - `original/js/` — browser/Node implementations and tests (`inverseMod.js`, `inverseModFixed.js`, `inverseModRobust.js`, `test.js`, `testFixed.js`, `demo.html`)
  - `original/go/` — Go server entry (`InverseMod.go`), server binary (`server.bin`)
  - `original/scripts/` — scripts that operate on original code (`complexityAnalysis.js`)
  - `original/out/` — generated CSVs from complexity runs
- `ai/` — AI analyses and implementations
  - `ai/claude/` — Claude 4.1 Opus analysis, complexity scripts, visualization
  - `ai/gpt5/` — GPT‑5 analyses, scripts, code snapshots
  - `ai/supernova/` — Supernova analysis, tests, docs
  - `ai/humanized/` — Humanized module with clean API + tests
- `docs/` — canonical docs: `ALGORITHM_ANALYSIS.md`, `ALGORITHM_REVIEW.md`, `AI_FINDINGS.md`
- `data/` — datasets and generated artifacts (`data/original/complexity_data.csv`)

## Usage
The Go implementation provides HTTP endpoints:
- `/inverse-mod?x=<integer>&y=<integer>` - Shows detailed steps
- `/inverse-mod-z?x=<integer>&y=<integer>` - Returns just the result
- `/inverse-mod-explanation` - Algorithm explanation

Run the Go server locally:
```bash
cd original/go
# build/run with your Go toolchain (module `inversemod`)
go run InverseMod.go
```

### JS Demo
Open `original/js/demo.html` in a browser. It loads `inverseMod.js`, `inverseModFixed.js`, and `inverseModRobust.js` from the same directory.

## Complexity Analysis
- Empirical analysis against the fixed implementation:
```bash
node original/scripts/complexityAnalysis.js 200    # scan y up to 200, full coprime x
node original/scripts/complexityAnalysis.js 200 5  # sample 5 x-values per y
```
- Outputs CSV under `original/out/` and prints a regression summary.

Additional AI analyses:
- Claude: `ai/claude/complexityAnalysis.js`, `ai/claude/complexityVisualization.js`
- Humanized vs Original/Fixed comparison: `ai/humanized/complexity.js`, tests in `ai/humanized/test.js`

## AI Findings
See `docs/AI_FINDINGS.md` for a deduplicated summary of overlapping AI analyses (Claude, GPT‑5, Supernova, Humanized).

Highlights:
- Novel iterative k–remainder approach; fix initial k and add GCD pre-check
- Bounded tweaks/backtracking greatly improve success on coprime pairs
- Empirical behavior small; correlates with O(log y)–O(√y) ranges

## Research Status
This algorithm is under active development for formal mathematical publication. The implementation may contain bugs that are being investigated and resolved.