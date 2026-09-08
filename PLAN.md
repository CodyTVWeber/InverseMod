<!--
This work is licensed under a Creative Commons Attribution 4.0 International License.
See LICENSE-CC-BY-4.0.md for details.
-->

# Assessment and Implementation Plan: Forward Iterative Modular Inverse

**Purpose of this document.** Part A is an honest technical assessment of what this
repository contains, what is and is not new, and where real value can come from.
Part B is a step-by-step implementation plan written so that a less capable
(cheaper) AI model, or a junior engineer, can execute it with minimal judgment
calls. Every task has a concrete deliverable and an acceptance check.

Nothing in this plan requires context outside this repository plus the cited papers.

---

## Part A — Assessment

### A.1 Verdict in one paragraph

The mathematics in this repository is correct but not new. The core step
(multiply the remainder by `ceil(y/r)`, keep the modulus fixed, take the product
of the multipliers as the inverse) is the **Thomas–Keller–Larsen (TKL) algorithm**
published in *IEEE Transactions on Computers* in 1986 for prime moduli. The
"certificate theorem" (Theorem 1 of the paper) is an elementary fact about
products in a group. The current JavaScript implementation is slower than the
Extended Euclidean algorithm by four to six orders of magnitude on four-digit
inputs and silently falls back to Euclid about a third of the time.

There **is** a way forward that produces genuine value, but only if the project
pivots from "a novel algorithm" to "a careful study and clean implementation of a
little-known 1986 algorithm, extended to composite moduli, with one open
question investigated properly." Concretely, the valuable outputs are:

1. A correct, fast (`O(log y)`), BigInt-capable implementation that still emits
   the step-by-step multiplier trace (the pedagogical feature that is the real
   selling point).
2. A reproducible empirical study of two questions that we could not find
   answered in the literature (Section A.5).
3. A rewritten paper that cites prior art and makes only claims the data supports.
4. Optionally, an interactive visualizer for teaching.

### A.2 What the method actually is (the algebra, compressed)

Let `1 < r < y`, `gcd(r, y) = 1`, and write `y = q·r + s` with `0 < s < r`.

| Statement | Why |
|---|---|
| The "band" `y < r·k < r + y` is satisfied by **exactly one** integer, `k = ceil(y/r)`. | `k > y/r` and `k < y/r + 1` pin down one integer. The "band constraint" is therefore not a search space; it is a single deterministic rule. |
| The new remainder is `r' = r·ceil(y/r) − y = r − (y mod r) = (−y) mod r`. | Direct substitution. The forward method is the recurrence `r ← (−y) mod r` with **fixed** `y`. Euclid instead is `(y, r) ← (r, y mod r)`, changing the modulus each step. |
| A step keeps the remainder invertible **iff** `gcd(k, y) = 1`, equivalently **iff** `gcd(r', y) = 1`. | `gcd(r', y) = gcd(r·k, y) = gcd(k, y)` because `gcd(r, y) = 1`. This is the exact failure criterion. The old "parity heuristic" was a special case (`p = 2`). |
| For **prime** `y` the greedy chain never fails. | Every `k < y` is coprime to a prime `y`. |
| Allowing `m` "wraps", `k_m = ceil(m·y/r)`, gives `r'_m = r − (m·y mod r)`; as `m` ranges over `1..r−1`, `r'_m` ranges over **all** of `1..r−1`. | `gcd(y, r) = 1` so `m·y mod r` is a bijection on nonzero residues. |
| Choosing the `m` that gives `r' = 1` directly requires `m ≡ −y⁻¹ (mod r)`. | So the "complete" forward search with unbounded `m` is the classical recursive formula `x⁻¹ mod y` from `y⁻¹ mod x` — i.e. Extended Euclid in disguise. |
| Reflection: if `r > y/2`, replace `r` by `y − r` (multiply by `y − 1 ≡ −1`). | Preserves coprimality, halves the working range, and removes the pathological `x ≈ y` cases (see A.4). Already noted in an earlier version of the paper (git history, "Section 2.4"). |

Consequence for the "certificate" idea: the inverse `z` itself is already an
`O(1)`-verifiable certificate (`x·z mod y = 1`). A multiplier sequence is a
strictly weaker certificate (it needs `O(n)` work to check). Its only value is
**explanatory**: it shows *how* the inverse was built from small, human-checkable
steps. That is a legitimate pedagogical value; it is not a cryptographic or
complexity-theoretic one.

### A.3 Prior art (must be cited in any future version of the paper)

| Reference | Relationship |
|---|---|
| E. J. Thomas, J. M. Keller, G. N. Larsen, "The Calculation of Multiplicative Inverses Over GF(P) Efficiently Where P is a Mersenne Prime," *IEEE Trans. Computers* C-35(5):478–482, May 1986. DOI 10.1109/TC.1986.1676791. | Same algorithm: fixed modulus, multiply by the quotient `floor(p/s)+1`, inverse = product of quotients. Abstract states it has "approximately the same number of average iterations and maximum number of iterations" as Extended Euclid — matching our measurements. **Confidence: high, based on the abstract and secondary descriptions; Task 0.1 below is to obtain the paper and confirm the pseudocode line by line.** |
| G. E. Collins, "Computing Multiplicative Inverses in GF(p)," *Math. Comp.* 23(105):197–200, 1969. | Distinguishes "forward" and "backward" versions of Extended Euclid; relevant to the "forward vs backward" framing used in this repo. |
| D. J. Bernstein, B.-Y. Yang, "Fast constant-time gcd computation and modular inversion," *TCHES* 2019. T. Pornin, "Optimized Binary GCD for Modular Inversion," ePrint 2020/972. | State of the art for real-world (cryptographic) inversion. Any performance comparison must be against these, and the honest conclusion is that a variable-time, division-based method is not competitive. |
| L. Hars, "Modular Inverse Algorithms Without Multiplications for Cryptographic Applications," *EURASIP J. Embedded Systems*, 2006. | Survey of Euclid-type inversion variants and their iteration counts; useful for the comparison section. |

The earlier AI-written "novelty assessments" in this repository's history (e.g.
`ai-analysis/supernova/docs/NOVELTY_ASSESSMENT.md`, removed in commit `ea6f68e`)
concluded "genuinely novel, publication-worthy" **without a literature search**.
Treat them as unreliable.

### A.4 Measured behaviour (reproduce these before changing anything)

All numbers below were produced with throwaway Node.js scripts against the code
at commit `4cd9e7e`. Phase 2 of the plan turns them into a committed, reproducible
harness.

**Greedy chain (`m = 1`, no reflection), exhaustive over all coprime `(x, y)`, `3 ≤ y ≤ 400`:**

| Modulus type | Pairs | Success | Mean steps | Max steps | Euclid mean / max divisions |
|---|---:|---:|---:|---:|---|
| prime `y` | 13,731 | 100.0% | 5.33 | 19 | 5.10 / 11 |
| composite `y` | 34,547 | 28.9% | — | — | — |

**Greedy chain success on random composite `y`, split by parity:**

| Range | even `y` | odd composite `y` |
|---|---:|---:|
| `y < 10^4` | 1.7% | 42.6% |
| `y < 10^6` | 0.2% | 38.1% |
| `y < 10^8` | 0.0% | 34.9% |

(Even `y`: every step has roughly a 50% chance of producing an even `k`, so
success probability decays like `2^-steps`. Odd composites decay slowly because
success requires every `k_i` to avoid every prime factor of `y`.)

**Shipped `forwardInverse()` (defaults `maxDepth=20`, `maxOffset=12`), random coprime pairs:**

| Range | Used forward certificate | Fell back to Euclid | Mean time / call | Worst observed |
|---|---:|---:|---:|---|
| `y < 100` | 93.1% | 6.9% | negligible | — |
| `y < 10^3` | 80.0% | 20.0% | ms | — |
| `y < 10^4` (n=237) | 65.0% | 35.0% | 61.5 ms | 3,098 ms for `x=4745, y=4806` (then fell back anyway) |

A 3,000-pair run at `y < 10^4` did not finish within 5 minutes. Extended Euclid
on the same inputs takes microseconds. The exponential DFS in
`implementation/src/forward-proof.js` is the cause; the `requireDecrease` filter
prunes almost every offset for small `r`, so the branching mostly explores dead
ends before giving up.

**Greedy chain with reflection, exhaustive over `x`, primes just above `2^k`:**

| `y` | `log2 y` | Mean steps | Worst steps | Worst / `log2 y` | Euclid worst divisions |
|---:|---:|---:|---:|---:|---:|
| 1,031 | 10.0 | 5.36 | 11 | 1.10 | 12 |
| 4,099 | 12.0 | 6.80 | 17 | 1.42 | 14 |
| 16,411 | 14.0 | 7.99 | 19 | 1.36 | 16 |
| 65,537 | 16.0 | 9.41 | 23 | 1.44 | 19 |
| 262,147 | 18.0 | 12.84 | 28 | 1.56 | 21 |
| 1,048,583 | 20.0 | 13.86 | 35 | 1.75 | 24 |
| 4,194,319 | 22.0 | 13.60 | 39 | 1.77 | 26 |

Euclid's worst/`log2 y` ratio is flat (~1.18). The forward chain's ratio is
**rising**, which suggests its worst case may be super-logarithmic. Worst cases
cluster near `x ≈ (y−1)/2` (e.g. `x = 2,097,159` for `y = 4,194,319`), where
`y = 2r + 1`, `y mod r = 1`, and the remainder decreases only by
`1, 3, 9, 27, …` for about `log3(y)` steps.

**Illustrative single cases:**

| `x`, `y` | Greedy steps | With reflection | Euclid divisions | Note |
|---|---:|---:|---:|---|
| 1,000,002, 1,000,003 | 33 | 1 (one reflection) | 2 | `r = y − 2^i` pattern |
| 100, 101 | 12 | 1 | 2 | same pattern |
| 500, 1,001 | fails | fails | 2 | `1001 = 7·11·13` |

**"m-wrap" variant (`k = ceil(m·y/r)`, first `m ≤ 8` with `gcd(k, y) = 1`), no fallback:**

| Range | Success | Mean steps (forward / Euclid) |
|---|---:|---|
| `y < 10^3` | 92.6% | 5.07 / 5.46 |
| `y < 10^5` | 81.4% | 9.38 / 9.32 |
| `y < 10^7` | 72.4% | 13.77 / 13.25 |
| `y < 10^9` | 65.7% | 18.16 / 17.13 |

Exhaustively for `y ≤ 300`, the largest `m` ever needed for completeness was
76 (at `x = 151, y = 300`), confirming that a bounded `m` cannot be complete.

### A.5 Where the genuine value is

Ranked by value-to-effort:

1. **A correct, fast reference implementation with a trace.** Replace the DFS
   with TKL-greedy + reflection + coprimality check + Euclid fallback. This is
   `O(log y)` per call, never wrong, works on BigInt, and still prints the
   human-readable multiplier chain. This is the minimum needed for the repo to be
   usable at all.

2. **Two small, answerable research questions** (not yet addressed in the
   literature as far as we can tell — Task 0.1 must double-check):
   - **Q1 (worst case).** Let `W(y) = max_x` (steps of greedy+reflection from
     `x` to `1` mod prime `y`). Is `W(y) = Θ(log y)` with a constant larger than
     Euclid's, or is it `ω(log y)`? The rising ratio in A.4 makes this a real
     question. A clean answer either way (a proof of `O(log y)`, or a family of
     `(x, y)` with `W ≥ c·log y·log log y`, or `c·log² y`) would be a modest but
     honest contribution suitable for a short note or an expository article.
   - **Q2 (composite failure probability).** For random odd composite `y`, the
     greedy chain succeeds ~35–43% of the time with slow decay. Derive and
     verify the heuristic `P(success) ≈ ∏_{p | y} (1 − 1/p)^{L}` where `L` is the
     chain length, and quantify how `M` in the m-wrap variant trades off against
     success rate.

3. **A rewritten paper** positioned as: "TKL's algorithm revisited: composite
   moduli, an exact failure criterion, reflection, and empirical worst-case
   behaviour." This is publishable as an expository/experimental note (e.g.
   arXiv math.NT/cs.DS, *Mathematics Magazine*, *College Mathematics Journal*
   style) and is defensible under scrutiny. The current paper is not.

4. **An interactive teaching page** showing the forward chain and Euclid side by
   side. The "multiply forward until you hit 1" view is a genuinely nice way to
   introduce inverses to students, and this is the one place the "certificate"
   framing shines.

Things that are **not** a way forward and should be removed from the claims:

- Any suggestion of cryptographic relevance or speed advantage. Variable-time,
  division-based inversion loses to Bernstein–Yang/Pornin on every axis that
  matters there.
- "Novel algorithm," "not found in the literature," or "publication-worthy with
  high novelty" — false given TKL 1986.
- The certificate as a verification primitive. `z` itself is the better certificate.
- The `O(B^D)` DFS as a method. It is dominated by the deterministic chain.

---

## Part B — Implementation Plan

Conventions for the implementing AI:

- Work in `implementation/` (Node.js ≥ 18, CommonJS, Vitest already configured).
- Do not delete git history. Do not touch `LICENSE*`.
- Every phase ends with `npm test` passing and a commit. One commit per task.
- Never write a claim into `README.md` or the paper that is not backed by a
  number produced by the harness in Phase 2 or by a cited reference.
- If a task's acceptance check fails and you cannot fix it in a reasonable
  effort, stop and report which check failed rather than weakening the check.

### Phase 0 — Establish the facts (docs only)

**Task 0.1 — Confirm the TKL pseudocode.**
- Obtain Thomas–Keller–Larsen 1986 (DOI 10.1109/TC.1986.1676791) via a library
  or the IEEE site. Transcribe its inversion algorithm into
  `docs/prior-art.md` in the same notation used in this repo (`x, y, r, k`).
- State explicitly which of the following TKL already includes: the fixed-modulus
  quotient multiply, the product-of-quotients inverse, the reflection step, any
  composite-modulus handling.
- Acceptance: `docs/prior-art.md` exists, contains the transcribed algorithm,
  and a table "TKL has / this repo adds" with each row marked yes/no.

**Task 0.2 — Literature check for Q1 and Q2.**
- Search (Google Scholar, arXiv, MathSciNet if available) for analyses of the
  recurrence `r ← (−y) mod r` / "fixed modulus Euclidean inversion" worst case,
  and for TKL follow-ups. Record queries and results in `docs/prior-art.md`.
- Acceptance: a section "Open questions status" listing Q1 and Q2 each as
  `open`, `partially answered (ref)`, or `answered (ref)`.

**Task 0.3 — Correct the top-level claims now.**
- Edit `README.md` "What is being claimed": add one paragraph stating the method
  coincides with TKL 1986 for prime moduli and that this repo studies the
  composite-modulus extension. Remove nothing else yet.
- Acceptance: README cites TKL with DOI.

### Phase 1 — Replace the algorithm core

**Task 1.1 — New module `implementation/src/forward-chain.js` (BigInt).**

Implement exactly this API. Accept `number | bigint | string`, compute in BigInt.

```js
/**
 * forwardChainInverse(x, y, options) -> {
 *   success: boolean,
 *   inverse: bigint | null,
 *   method: 'forward' | 'forward+euclid' | 'none',
 *   steps: Array<{ kind: 'multiply' | 'reflect', k: bigint, before: bigint, after: bigint }>,
 *   certificate: bigint[],        // every multiplier applied, in order (reflect contributes y-1)
 *   fallbackAt: bigint | null,    // remainder at which greedy left the unit group, else null
 *   message: string
 * }
 * options: { reflect = true, maxWrap = 1, euclidFallback = true }
 */
```

Reference algorithm (this is the specification; keep the code this simple):

```js
function forwardChainInverse(xIn, yIn, options = {}) {
  const { reflect = true, maxWrap = 1, euclidFallback = true } = options;
  const y = BigInt(yIn);
  let r = ((BigInt(xIn) % y) + y) % y;
  if (y <= 1n || r === 0n || gcd(r, y) !== 1n) return fail("no inverse");
  const steps = [], certificate = [];
  let z = 1n;
  while (r !== 1n) {
    if (reflect && 2n * r > y) {
      const before = r; r = y - r; z = (z * (y - 1n)) % y;
      steps.push({ kind: "reflect", k: y - 1n, before, after: r }); certificate.push(y - 1n);
      continue;
    }
    let applied = false;
    for (let m = 1n; m <= BigInt(maxWrap) && m < r; m++) {
      const k = (m * y + r - 1n) / r;          // ceil(m*y / r)
      const next = r * k - m * y;              // == (r*k) mod y, in (0, r)
      if (gcd(next, y) === 1n) {
        steps.push({ kind: "multiply", k, before: r, after: next }); certificate.push(k);
        z = (z * k) % y; r = next; applied = true; break;
      }
    }
    if (!applied) {
      if (!euclidFallback) return { success: false, inverse: null, method: "none", steps, certificate, fallbackAt: r, message: "greedy step left the unit group" };
      const inv = euclidInverse(r, y);         // inverse of the current remainder
      return { success: true, inverse: (z * inv) % y, method: "forward+euclid", steps, certificate, fallbackAt: r, message: "forward chain blocked; finished with Extended Euclid" };
    }
  }
  return { success: true, inverse: z, method: "forward", steps, certificate, fallbackAt: null, message: "forward chain reached 1" };
}
```

Notes for the implementer:
- `z` is the product of all applied multipliers mod `y`; when falling back, the
  final inverse is `z · (current r)⁻¹`, which keeps the partial certificate
  meaningful.
- `gcd` must be a BigInt Euclid. `euclidInverse` must be BigInt Extended Euclid.
- Acceptance (these values were verified against the reference code above):
  - `forwardChainInverse(11, 26)` → `success`, `inverse === 19n`,
    `method === 'forward+euclid'`, `fallbackAt === 7n` (from `r = 7` the greedy
    step `k = 4` would give `2`, and `gcd(2, 26) = 2`), `certificate` deep-equals `[3n]`.
  - `forwardChainInverse(11, 26, { maxWrap: 4 })` → `method === 'forward'`,
    `certificate` deep-equals `[3n, 15n]` (`11·3 = 33 ≡ 7`, `7·15 = 105 ≡ 1`),
    `inverse === 19n`.
  - `forwardChainInverse(17, 23)` → `method === 'forward'`, `certificate`
    deep-equals `[22n, 4n]` (one reflection `17 → 6`, then `6·4 = 24 ≡ 1`), `inverse === 19n`.
  - `forwardChainInverse(500, 1001)` → `method === 'forward+euclid'`,
    `fallbackAt === 31n`, `inverse === 999n`.
  - In general, tests must check certificates via `verifyCertificate` rather than
    hard-coding chains, except for the four documented examples above.

**Task 1.2 — Update `verifyCertificate` to BigInt and to accept reflection multipliers.**
- Same semantics as today (`r_i = r_{i-1}·k_i mod y`, terminal `1`, product check),
  BigInt arithmetic, returns `{ valid, remainders, inverseFromProduct, reason }`.
- Acceptance: `verifyCertificate(x, y, result.certificate).valid === true` for
  every successful `forward` result on 10,000 random pairs with `y < 2^53` and
  for 200 random pairs with `y` around `2^256` (BigInt).

**Task 1.3 — Tests (`implementation/tests/forward-chain.test.js`).**
Required cases:
1. Agreement with Euclid on all coprime pairs `3 ≤ y ≤ 300` (exhaustive).
2. 10,000 random pairs `y < 2^53`, and 200 pairs with 256-bit `y`: inverse
   correct (`x·z mod y === 1`).
3. Prime moduli (`y` in `[1009, 65537, 2^31−1, 2^61−1]`, 200 random `x` each):
   `method === 'forward'` always (never falls back).
4. `y = 26, x = 11` returns a valid certificate; `y = 1001, x = 500` returns
   `method === 'forward+euclid'` with `fallbackAt !== null` when `maxWrap = 1`.
5. `reflect: false` on `x = 1000002, y = 1000003` yields exactly 33 multiply
   steps; `reflect: true` yields exactly one step, of `kind === 'reflect'`, and
   `certificate` deep-equals `[1000002n]`.
6. Non-invertible inputs (`4, 6`), `y ≤ 1`, `x ≡ 0` return `success: false`.
7. Performance guard: 10,000 random calls with `y < 2^53` complete in under
   2 seconds total (this test exists to prevent regression to the DFS).
- Acceptance: `npm test` green; the old `forward-proof.test.js` either updated
  to the new API or deleted together with `forward-proof.js` (Task 1.5).

**Task 1.4 — Demo and CLI.**
- `src/demo.js`: print the chain for `(11, 26)` with defaults, `(11, 26)` with
  `maxWrap: 4`, `(17, 23)`, `(500, 1001)`, and `(1000002, 1000003)` with and
  without reflection, in the format
  `step i: r=… × k=… = … ≡ … (mod y)` and `reflect: r=… → y−r=…`. When the
  method is `forward+euclid`, print the partial certificate, the blocked step
  (`r=7 × k=4 = 28 ≡ 2, gcd(2, 26) = 2 — leaves the unit group`), and the
  Euclid tail explicitly so the reader sees exactly where the forward chain stopped.
- `src/cli.js`: `node src/cli.js <x> <y> [--no-reflect] [--max-wrap N] [--no-fallback] [--json]`.
- Acceptance: `npm run demo` output for `(11, 26, maxWrap 4)` ends with
  `inverse = 19` and `certificate verified: true`; the default `(11, 26)` run
  prints `method = forward+euclid` and `blocked at r = 7`.

**Task 1.5 — Remove the DFS.**
- Delete `src/forward-proof.js`, its test, and the `maxDepth`/`maxOffset`
  options. Update `src/index.js` exports to `{ gcd, forwardChainInverse,
  verifyCertificate, euclidInverse }`.
- Acceptance: `rg -n "maxDepth|maxOffset|dfs" implementation/src` returns nothing.

**Task 1.6 — Repository hygiene.**
- Delete `originalImplementation/go/server.bin` (8.5 MB compiled binary with no
  source; history retains it). Mention in the commit message.
- Acceptance: `git ls-files | rg '\.bin$'` returns nothing.

### Phase 2 — Reproducible experiments

Create `implementation/experiments/` with plain Node scripts, no extra
dependencies unless plotting is wanted (then `npm i -D` a small charting lib or
emit CSV and plot with Python/matplotlib in a separate optional script).

**Task 2.1 — `experiments/lib.js`**: shared helpers — `isPrime` (deterministic
Miller–Rabin for BigInt), `randomCoprimePair(bits)`, `primesJustAbove(2^k)`,
`euclidSteps(x, y)`, `greedySteps(x, y, {reflect})`, CSV writer.

**Task 2.2 — `experiments/success-rate.js` (Q2 data).**
- For `y` in decades `10^3 … 10^9` (and a BigInt run at 64 and 128 bits),
  sample 20,000 coprime pairs each; record success of greedy `m=1` split by
  `y` prime / even / odd-composite, and success of m-wrap for
  `M ∈ {1, 2, 4, 8, 16, 32}`.
- Output `experiments/out/success-rate.csv` with columns
  `range, class, M, n, success_rate, mean_steps, mean_euclid_steps`.
- Acceptance: CSV reproduces A.4 within ±2 percentage points at `y < 10^7`.

**Task 2.3 — `experiments/worst-case.js` (Q1 data).**
- For each prime `y` just above `2^k`, `k = 10 … 26`, exhaustive over `x`,
  compute `W(y)` for greedy+reflection and the Euclid worst; record the argmax `x`.
  `k = 26` is ~6.7×10^7 values of `x` × ~40 steps — feasible in Node in minutes;
  stop earlier if a run exceeds 30 minutes and note the cutoff.
- Output `experiments/out/worst-case.csv` with columns
  `k, y, mean, worst, worst_x, worst_over_log2y, euclid_worst`.
- Acceptance: CSV reproduces the A.4 table for `k ≤ 22` exactly (the computation
  is deterministic).

**Task 2.4 — `experiments/worst-case-structure.js`.**
- For each `worst_x` from Task 2.3, print the full chain and the sequence of
  `(q_i, s_i) = (floor(y/r_i), y mod r_i)`. Check the hypothesis that worst
  cases are runs where `s_i` grows geometrically by factor `q_i + 1` while `q_i`
  stays constant (see A.4).
- Acceptance: a short `experiments/NOTES.md` stating, with the printed chains as
  evidence, whether the hypothesis held for every `k`.

**Task 2.5 — Attempt a lower-bound construction for Q1 (stretch).**
- Try families `y = 2r + 1`, `y = 3r + 1`, and `y − 1` highly composite
  (`lcm(1..n) + 1` when prime, or primorial `+ 1`). Measure `W`. If any family
  gives `W(y)/log2(y)` growing without bound over the tested range, document it
  as a candidate super-logarithmic family with the data.
- Acceptance: results appended to `experiments/NOTES.md`; no claim of a proof
  unless one is actually written and checked.

**Task 2.6 — `npm run experiments`** script that runs 2.2–2.4 and regenerates
the CSVs. Acceptance: runs to completion from a clean checkout.

### Phase 3 — Rewrite the paper

Rewrite `Forward-Iterative-Paper.md` (keep the dedication if the author wishes;
it does not affect the technical content). Target length 8–12 pages equivalent.
Required structure:

1. **Abstract** — state that the method coincides with TKL 1986 for prime
   moduli; contributions are (i) the exact failure criterion for composite
   moduli, (ii) the reflection and m-wrap extensions with measured trade-offs,
   (iii) empirical worst-case behaviour and the open question Q1, (iv) a
   verified BigInt implementation with an explanatory trace.
2. **The algorithm** — the table from A.2, as theorems with two-line proofs.
3. **Prior art** — from `docs/prior-art.md`.
4. **Composite moduli** — failure criterion, success-rate tables from Task 2.2,
   the heuristic formula from Q2 and how well it fits.
5. **Worst-case behaviour** — Task 2.3/2.4 tables and figures; state Q1 as
   open with the evidence; include any Task 2.5 result.
6. **Comparison** — honest table: TKL-greedy+reflection vs Extended Euclid vs
   Bernstein–Yang/Pornin; columns: guarantee, worst-case iterations,
   constant-time?, uses division?, produces explanatory trace?
7. **Pedagogical use** — the certificate/trace as a teaching device, with the
   `(11, 26)` worked example.
8. **Limitations** — everything listed under "not a way forward" in A.5.

Remove: Theorems 3 and 4 about `O(B^D)` DFS (the DFS is gone); any sentence
claiming novelty of the core step; the "AI-readable" claims unless made concrete.

Acceptance: every number in the paper is traceable to a CSV in
`implementation/experiments/out/` or to a cited reference; a reviewer reading
only the paper can reproduce every table with `npm run experiments`.

### Phase 4 — Teaching visualizer (optional, do last)

- Single static file `docs/visualizer.html` (no build step, vanilla JS, BigInt).
- Inputs `x`, `y`; toggles: reflection on/off, show Euclid side by side.
- Renders the chain as a table and as a number line mod `y` with arrows for
  each multiply; highlights the step where a composite modulus breaks the chain.
- Acceptance: opens from the file system in a modern browser; `(11, 26)` renders
  the chain and the inverse 19; `(500, 1001)` shows the blocked step.

### Definition of done (whole plan)

- [ ] `docs/prior-art.md` with the TKL transcription and the has/adds table.
- [ ] `npm test` passes; performance guard test present.
- [ ] No DFS code, no `server.bin`.
- [ ] `npm run experiments` regenerates all CSVs; `experiments/NOTES.md` records Q1/Q2 findings.
- [ ] Paper rewritten per Phase 3; README claims match the paper.
- [ ] (Optional) visualizer works.

---

## Appendix — Quick reference for the implementing AI

Identity cheat-sheet (all with `y = q·r + s`, `0 < s < r`, `gcd(r, y) = 1`):

- `ceil(y/r) = q + 1`
- `r·(q+1) − y = r − s`  (the next remainder; always in `(0, r)`)
- next remainder invertible ⇔ `gcd(r − s, y) = 1` ⇔ `gcd(q + 1, y) = 1`
- reflection: `y − r ≡ (y − 1)·r (mod y)`, and `inv(r) ≡ −inv(y − r) (mod y)`
- m-wrap: `k_m = ceil(m·y/r)`, `r'_m = r − (m·y mod r)`; `m = 1` is plain greedy

Sanity values (verified with the reference implementation in Task 1.1):

- `inv(11, 26) = 19`. Greedy (`m = 1`) goes `11 → 7 → blocked` (next would be
  `2`). Valid pure-forward certificates include `[3, 15]` (found with `maxWrap ≥ 4`)
  and `[5, 9]` (`11·5 = 55 ≡ 3`, `3·9 = 27 ≡ 1`; this is the two-wrap choice at
  the first step, which the reference code does not take because `m = 1` already
  gives a coprime remainder). No reflection occurs since `11 < 13`.
- `inv(17, 23) = 19`; chain with reflection: `[22, 4]` (`17 → 6 → 1`).
- `inv(3, 7) = 5`; chain `[3, 4]` (`3 → 2 → 1`).
- `inv(500, 1001) = 999` (since `500·2 = 1000 ≡ −1`). Greedy runs
  `500 → 499 → 496 → 487 → 460 → 379 → 136 → 87 → 43 → 31 → blocked` (next
  would be `22`, `gcd(22, 1001) = 11`). With `maxWrap = 8` it completes
  in 12 multiplies.
- `inv(1000002, 1000003) = 1000002` (self-inverse of `−1`). Without reflection
  the greedy chain takes 33 multiplies (nineteen of them `k = 2`); with
  reflection it is a single step.
- On 10,000 random pairs with `y < 2^53` (mostly composite `y`), the reference
  implementation returned a correct inverse every time in 46 ms total and used
  the Euclid tail in about 47% of calls. This is the expected behaviour, not a bug.
