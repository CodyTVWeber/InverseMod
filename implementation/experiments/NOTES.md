# Experiment notes

Scripts live in `implementation/experiments/`. Regenerated CSVs are in `out/`.
Shared helpers: `lib.js`. Seed for success-rate sampling: `20260908` (override with `SUCCESS_SEED`).
Default sample size: 20,000 pairs per (range, class) (`SUCCESS_SAMPLES`).

## How far the worst-case run went

`worst-case.js` was run exhaustively for **k = 10..22** (the default). Environment variables `WORST_K_MIN` and `WORST_K_MAX` change the range. k = 22 is about 4.2 million residues and finished in under two seconds in Node 22 on this machine. k = 26 was not run; it is about 67 million residues and is expected to take on the order of half a minute to a few minutes.

Multiply steps only (reflections are not counted). Euclid’s column is the number of non-terminating remainder divisions.

The k = 10, 12, 14, 16, 18, 20, 22 rows match PLAN.md §A.4 exactly (mean to two decimals after rounding, worst steps, Euclid worst).

| k | y | mean | worst | worst_x | worst/log2 y | Euclid worst |
|---|---:|---:|---:|---:|---:|---:|
| 10 | 1031 | 5.36 | 11 | 450 | 1.10 | 12 |
| 12 | 4099 | 6.80 | 17 | 2010 | 1.42 | 14 |
| 14 | 16411 | 7.99 | 19 | 8089 | 1.36 | 16 |
| 16 | 65537 | 9.41 | 23 | 32720 | 1.44 | 19 |
| 18 | 262147 | 12.84 | 28 | 125974 | 1.56 | 21 |
| 20 | 1048583 | 13.86 | 35 | 344040 | 1.75 | 24 |
| 22 | 4194319 | 13.60 | 39 | 2097159 | 1.77 | 26 |

The ratio `W(y)/log2(y)` is rising on this range (1.10 → 1.77). That is the empirical content of Q1; it is not a proof of `ω(log y)`.

## Task 2.4 — worst-case structure

Full remainder traces for every `worst_x` are in `out/worst-case-structure.md`.

Hypothesis from PLAN.md A.4: worst cases are runs where `s_i = y mod r_i` grows geometrically by factor `q_i + 1` while `q_i = floor(y/r_i)` stays constant.

**The hypothesis did not hold for every k.** It held for k ∈ {12, 13, 14, 15, 16, 17, 19, 20, 22} and failed for k ∈ {10, 11, 18, 21}.

The cleanest hit is k = 22, y = 4,194,319, x = 2,097,159 = (y−1)/2. Here `q = 2` for thirteen steps and `s` is `1, 3, 9, 27, 81, …` (factor `q+1 = 3`), matching A.4’s sketch. k = 13 and k = 17 show the same `q = 2`, `s *= 3` prefix, but those argmax residues are not exactly `(y−1)/2`.

Counterexamples: k = 10, y = 1031, x = 450 (not the midpoint 515) has strictly increasing `q` from the first step (`2, 3, 4, 5, 7, …`) and no geometric `s`. k = 18’s argmax (x = 125,974 vs midpoint 131,073) has only a short `q = 2` run.

So the `y = 2r+1` pattern *produces* some of the recorded worst cases, especially the largest in this range, but it is not the only worst-case shape.

## Q1 status

Still **open**. Evidence for a super-logarithmic worst case is the rising `W/log2 y` column; evidence against a fast blow-up is that every measured `W(y)` stayed below `2 log2 y` through 22-bit primes. No closed-form bound is claimed.

## Q2 status

`out/success-rate.csv` (20,000 uniform coprime pairs per cell, no reflection, no Euclid fallback).

Greedy `M = 1` success on composite `y`, compared with PLAN.md A.4 (all within ±2 percentage points at `y < 10^7`):

| Range | even y (CSV / A.4) | odd composite (CSV / A.4) |
|---|---|---|
| y < 10^4 | 1.95% / 1.7% | 42.84% / 42.6% |
| y < 10^6 | 0.18% / 0.2% | 37.18% / 38.1% |
| y < 10^8 | 0.01% / 0.0% | 34.41% / 34.9% |

m-wrap `M = 8`, mixed `y` (CSV / A.4):

| Range | success | mean forward steps | mean Euclid steps |
|---|---|---|---|
| y < 10^3 | 92.61% / 92.6% | 5.07 / 5.07 | 5.46 / 5.46 |
| y < 10^5 | 80.84% / 81.4% | 9.38 / 9.38 | 9.32 / 9.32 |
| y < 10^7 | 72.01% / 72.4% | 13.64 / 13.77 | 13.21 / 13.25 |
| y < 10^9 | 64.91% / 65.7% | 18.10 / 18.16 | 17.09 / 17.13 |

Prime `y` is 100% success for every `M` (as required by `gcd(k, y) = 1` for `k < y`). Even `y` collapses for `M = 1` (≈ 2^(−steps)). Odd composites decay slowly: 47.9% at y < 10^3 down to 34.0% at y < 10^9 and 26.9% at 128-bit.

Heuristic `P(success) ≈ ∏_{p|y} (1 − 1/p)^L` with `L` the mean chain length: for a typical odd semiprime with small factors this is the right order of magnitude (a 10^6 odd composite with a factor 3 has a 2/3 survival per step; `L ≈ 12` gives (2/3)^12 ≈ 0.8% if 3 always divides y, but most odd composites are not divisible by 3, so the mixture sits near 35–40%). The CSV is the measurement; the product formula is a heuristic, not a theorem.

Larger `M` buys success, especially on even `y`: at y < 10^7, even moduli go from 0.07% (`M=1`) to 45.6% (`M=8`) to 86.0% (`M=32`). On mixed y < 10^7, `M=32` reaches 92.9% with mean steps still comparable to Euclid (13.05 vs 13.21).

## Task 2.5 — candidate families for a Q1 lower bound

Script: `worst-case-families.js`. CSV: `out/worst-case-families.csv`.
No proof is claimed. `W_full` is exhaustive `W(y)` when `y < 500000`; otherwise only `W` at a distinguished `x` is recorded.

1. **Midpoint `x = (y−1)/2` on the same primes as Task 2.3.** This is the `y = 2r+1` family. At k = 22 it *is* the exhaustive worst case (`W = 39`). At smaller k it is often close but not always the argmax (k = 10: midpoint 10 steps vs worst 11; k = 16: 15 vs 23). Ratio `W_at_x / k` oscillates between about 0.86 and 1.77 and does not blow up on this range.

2. **`x = floor(y/3)` (`y ≈ 3r+1`).** Ratios stay between 0.47 and 0.80 — milder than the midpoint family.

3. **`y =` next prime of `lcm(1..n)+1`.** Exhaustive `W` where cheap: y = 421 has `W = 16` and `W/log2 y = 1.84`, the largest ratio seen in this family. Larger members (y = 12,252,259 and 232,792,561) were only probed at the midpoint (`W_at_x` = 32 and 44). Ratios are not monotonically increasing.

4. **`y =` next prime of primorial(n)+1.** Exhaustive `W` through y = 30,047 (`W = 21`, ratio 1.41). Larger probes do not show a runaway ratio.

**Conclusion:** none of the tested families gives `W(y)/log2(y)` growing without bound on the computed range. The midpoint / `y = 2r+1` family remains the best *practical* source of hard instances, but it is not a demonstrated `ω(log y)` construction.

