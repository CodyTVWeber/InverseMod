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

## Repository Structure

- `original/`: Original code and demos
  - `go/`: Go implementation and module files
  - `scripts/`: Empirical complexity scripts
  - `demo.html`: Browser demo for original, fixed, and robust versions
  - `inverseMod.js`, `inverseModFixed.js`, `inverseModRobust.js`: JS implementations
- `ai/`: AI analyses and code snapshots
  - `gpt5/`: GPT‑5 analysis (docs, scripts, code, out)
  - `claude/`: Claude analysis (docs, scripts, viz)
  - `supernova/`: Additional AI analysis with code and docs
  - `humanized/`: Humanized variants and measurements
- `docs/`: Top-level algorithm reviews and write-ups
- `data/`: Centralized data artifacts
  - `original/`: CSV outputs from original analysis scripts

The top-level `README.md` stays here and links to key areas.

## Usage

### Browser Demo
Open `original/demo.html` in a browser, pick a version, and compute inverses interactively.

### Go HTTP Endpoints
From `original/go/`:
```
go run InverseMod.go
```
Endpoints:
- `/inverse-mod?x=<integer>&y=<integer>` - Detailed steps
- `/inverse-mod-z?x=<integer>&y=<integer>` - Just the result
- `/inverse-mod-explanation` - Algorithm explanation

## Complexity Analysis
- Empirical analysis script measuring steps vs y lives in `original/scripts/complexityAnalysis.js`.
- Run from the repository root:
```bash
node original/scripts/complexityAnalysis.js 200    # scan y up to 200, full coprime x
node original/scripts/complexityAnalysis.js 200 5  # sample 5 x-values per y
```
- Outputs CSV under `data/original/` and prints summary with a regression against log2(y).

## AI Analyses and Findings
- GPT‑5: see `ai/gpt5/README.md` and `ai/gpt5/docs/` for algorithm reviews and analysis, with scripts under `ai/gpt5/scripts/` and outputs in `ai/gpt5/out/`.
- Claude: see `ai/claude/README.md`, `ai/claude/COMPLEXITY_THEORY.md`, and `ai/claude/VERIFICATION_REPORT.md`.
- Supernova: see `ai/supernova/README.md` and `ai/supernova/docs/`.
- Humanized: see `ai/humanized/README.md` for simplified variants and `complexity.csv`.

## Research Status
This algorithm is under active development for formal mathematical publication. The implementation may contain bugs that are being investigated and resolved.