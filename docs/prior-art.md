<!--
This work is licensed under a Creative Commons Attribution 4.0 International License.
See LICENSE-CC-BY-4.0.md for details.
-->

# Prior art: Engel expansion, and an unconfirmed TKL lead

**Date of this note:** 2026-09-08 (reframed same day after review).

## Primary identification: Engel expansion

The implemented recurrence
\[
r \leftarrow r\cdot\lceil y/r\rceil - y = (-y)\bmod r
\]
with **fixed** modulus \(y\) **is** the classical **Engel expansion** of the rational \(x/y\).

- F. Engel, “Entwicklung der Zahlen nach Stammbrüchen,” 1913.
- Wikipedia, “Engel expansion,” accessed 2026-09-08: if \(u_i\) is a rational \(x/y\), then \(u_{i+1} = ((-y)\bmod x)/y\).
- The Engel expansion terminates at numerator 0. When every intermediate numerator stays coprime to \(y\), it passes through numerator 1 and the last digit is \(y\). The forward chain is the Engel digits of \(x/y\) minus that final \(y\); the modular inverse is the product of all Engel digits except the last.
- Length \(E(x,y)\): Erdős–Rényi–Szüsz (1958) \(E \le x\); Erdős–Shallit (1991) \(E = O(y^{1/3+\varepsilon})\) and \(E > c\log y\) infinitely often; they conjecture \(O((\log y)^2)\) for the sibling Pierce length (Pierce is \(r \leftarrow y \bmod r\)). A 2011 Berkeley undergraduate note gives an explicit \(\Omega(\log y)\) family of Engel length exactly \(x\).
- **Q1 without reflection** is that length question restricted to prime denominators. **Q1 with reflection** is a variant. Both are **known open problems**, not new ones.

The rest of this file is the Task 0.1/0.2 log on Thomas–Keller–Larsen 1986, which **PLAN.md A.3 identified with high confidence** and which **was not confirmed**. That material is retained as a search record; it is not the primary identification.

---

## Thomas–Keller–Larsen 1986 (unconfirmed)

**Purpose of this section (original Task 0.1):** confirm what TKL 1986 contains. **Outcome:** the PDF was not obtained; the only detailed secondary transcription (Öztürk Algorithm X) is a binary/shift Euclid loop for Mersenne primes, not the Engel remainder map. TKL is **possibly related, unconfirmed**.

## Access status

The primary paper is paywalled. It was **not obtained** as full text:

- E. J. Thomas, J. M. Keller, G. N. Larsen, “The Calcualtion of Multiplicative Inverses Over GF(P) Efficiently Where P is a Mersenne Prime,” *IEEE Transactions on Computers* C-35(5):478–482, May 1986. DOI [10.1109/TC.1986.1676791](https://doi.org/10.1109/TC.1986.1676791). (The title spelling “Calcualtion” is the published IEEE title.)

Attempts to retrieve the PDF from IEEE Xplore (`ieeexplore.ieee.org/document/1676791`, the Crossref `ielx5` stamp URL) returned the IEEE login/paywall page, not the article. No legal open preprint was found on arXiv, institutional repositories, or the authors’ sites.

**Therefore nothing in this note is a line-by-line transcription of the TKL paper.** Where an algorithm is written in this repository’s notation, it is labelled as either (a) quoted/paraphrased from the IEEE **abstract**, (b) transcribed from a **named secondary source**, or (c) a **reconstruction** that is not attributed to TKL as a quotation.

## What was confirmed from primary text (IEEE abstract + Crossref record)

**Source:** IEEE abstract of DOI 10.1109/TC.1986.1676791, plus Crossref work metadata (volume C-35, issue 5, pages 478–482, 16 references, 6 citations recorded by Crossref).

Confirmed statements (paraphrase of the abstract, not a quotation of the body):

1. The usual method for multiplicative inverses over finite fields and rings of integers is the **extended Euclidean algorithm**.
2. The algorithm TKL presents has **approximately the same number of average iterations and the same maximum number of iterations** as that Euclidean method.
3. When the modulus `P` is a **Mersenne prime**, implementing the algorithm on a processor designed for mod-`P` arithmetic uses fewer program statements and fewer operations.
4. Heuristically, when division and multiplication are performed simultaneously, **Euclid has fewer subiterations**.

Confirmed bibliographic facts from Crossref (not from the paper body): TKL cites Collins, “Computing Multiplicative Inverses in GF(p),” *Math. Comp.* 23 (1969) (DOI 10.2307/2005073), Knuth TAOCP vol. 2, and several DSP/residue-arithmetic papers. zbMATH DE 3941647 indexes the paper with keywords *multiplicative inverse*, *Mersenne prime*, *Euclid's algorithm*, *modified Euclidean algorithm*.

**Confidence in these abstract-level facts: high.**

The abstract does **not** state pseudocode, does **not** mention `ceil(P/s)`, product-of-quotients certificates, reflection (`r ↦ P−r`), or composite-modulus failure criteria.

## What was taken from named secondary sources

### 1. Öztürk 2005 — “Algorithm X” attributed to TKL86

Erkay Öztürk, *Low Power Elliptic Curve Cryptography*, M.S. thesis, Worcester Polytechnic Institute, 2005. Digital WPI etd-050405-143155. Appendix B is titled “Inversion Algorithm for Mersenne Primes of the Form \(2^q-1\)” and is explicitly attributed to Thomas–Keller–Larsen 1986.

The following is a transcription of that appendix into this repository’s notation, **not** a transcription of TKL’s PDF. In Öztürk, the Mersenne prime is `p = 2^q − 1`; the input whose inverse is sought is `a`; the output inverse is `b`. Mapping: `y := p`, `x := a`, and the running remainder is `u` (playing the role of `r`).

**Algorithm X (Öztürk’s secondary transcription of TKL, Mersenne case)**

```
Input:  x in [1, y-1], y prime, y = 2^q - 1
Output: z = x^{-1} (mod y)

1. (z, c, r, v) := (1, 0, x, y)
2. Find e such that 2^e exactly divides r          // 2^e || r
3. r := r / 2^e                                    // shift off trailing zeros
4. z := (2^{q-e} * z) mod y                        // circular left shift mod a Mersenne prime
5. if r = 1: return z
6. (z, c, r, v) := (z + c, z, r + v, r)
7. go to step 2
```

Öztürk states the loop invariant `z / r ≡ 1 / x (mod y)` (or, in the division variant, `z / r ≡ d / x (mod y)`). The only comparison in the loop is against the constant `1` (or a small scale `s`). Steps 3–4 are bit shifts, not a general integer division `ceil(y/r)`.

The same thesis notes that changing step 4 to `z := −(2^{q−e} z) (mod y)` adapts the method to moduli of the form `2^q + 1`, and that initializing `z` with `d` instead of `1` computes `d·x^{-1}` (a division).

**Confidence that Öztürk’s Algorithm X is a faithful restatement of TKL’s Mersenne-specialized procedure: medium-high** (named appendix, matching title and date; the thesis body discusses it as a binary extended-Euclidean method). **Confidence that this is the only algorithm in the TKL paper: low** — the paper is five pages and the IEEE abstract first compares iteration counts with Euclid in general, then specializes to Mersenne primes, so a general Euclidean variant may precede Algorithm X. That general variant was **not** found in Öztürk.

### 2. PLAN.md’s identification (assessment hypothesis, not primary text)

`PLAN.md` §A.3 identifies TKL with the **fixed-modulus quotient-multiply** recurrence used in this repository:

- `k = ceil(y / r) = floor(y / r) + 1` (when `r` does not divide `y`),
- next remainder `r' = r·k − y`,
- inverse = product of the `k`’s.

That identification is **inferred from the IEEE abstract** (similar average and maximum iteration counts to Euclid) plus the assessor’s reading of secondary descriptions. It was **not** confirmed against TKL’s body, and it does **not** match Öztürk’s Algorithm X, which is a binary/shift method.

A reconstruction of that quotient-multiply procedure, written here so the rest of the repository has a single reference, follows. **This is a reconstruction in this repository’s notation. It is not TKL’s pseudocode and must not be quoted as such.**

```
Input:  1 < r < y, gcd(r, y) = 1, y prime
Output: z = r^{-1} (mod y), built as a product of multipliers k

z := 1
while r ≠ 1:
    k := ceil(y / r)          # uniquely determined; = floor(y/r)+1
    r := r * k - y            # = (−y) mod r, strictly in (0, r)
    z := (z * k) mod y
return z
```

For prime `y` every `k < y` is coprime to `y`, so the loop cannot leave the unit group. The reconstruction does **not** include reflection, m-wrap, or a composite-modulus test; those are this repository’s additions (see the table below).

**Confidence that this reconstruction is literally TKL’s general algorithm: low to medium.** It is a natural modified-Euclid recurrence with the iteration-count behaviour the abstract claims, but the only detailed secondary transcription we have (Öztürk) is a different, Mersenne-specific binary algorithm.

### 3. Collins 1969 (cited by TKL)

George E. Collins, “Computing Multiplicative Inverses in GF(p),” *Mathematics of Computation* 23(105):197–200, 1969. DOI [10.1090/S0025-5718-1969-0242345-5](https://doi.org/10.1090/S0025-5718-1969-0242345-5).

Confirmed from the paper’s own abstract (primary for Collins, not for TKL): Collins compares the extended Euclidean algorithm with Fermat inversion `a^{p-2} (mod p)`, and for each distinguishes a **forward** and a **backward** version. The “forward” Euclidean method keeps all intermediate integers bounded by the larger input. This is relevant to the “forward vs backward” language used in this repository, but Collins’ forward Euclid is the usual Bézout recurrence (changing modulus), not the fixed-`y` remainder map `r ← (−y) mod r`.

### 4. Closest named match to the core step: Engel’s algorithm (not TKL)

The greedy remainder update `r ← r·ceil(y/r) − y` with **fixed** dividend `y` is exactly the classical **Engel algorithm** for the Engel series of a rational, as stated e.g. by Mays, “Iterating the Division Algorithm,” *Fibonacci Quarterly* 25 (1987), 204–213, and by Erdős–Shallit, “New bounds on the length of finite Pierce and Engel series,” *J. Théor. Nombres Bordeaux* 3 (1991), 43–53:

```
y = r * q1 - r1
y = r1 * q2 - r2
...
```

with `0 < r_{i+1} < r_i` and `q_i = ceil(y / r_{i-1})`. This is **not** a claim that TKL invented Engel’s algorithm; it is the correct classical name for the recurrence this repository studies. Product-of-quotients inversion is the group-theoretic reading of those `q_i`.

## TKL has / this repo adds

Each row is **yes/no** for “does TKL 1986 already contain this?”, with a confidence tag. “Unknown” is recorded as **no** for the “TKL has” column when the feature was not found in the abstract or in Öztürk’s Algorithm X, i.e. we do not treat absence of evidence as a positive finding.

| Feature | TKL has? | This repo adds? | Evidence / confidence |
|---|---|---|---|
| Euclidean-type inversion with iteration counts comparable to extended Euclid | **yes** | no (already classical) | IEEE abstract. Confidence: high. |
| Mersenne-prime specialization (shifts / circular rotation mod `2^q−1`) | **yes** | **no** | Paper title + Öztürk Algorithm X. Confidence: high for the specialization existing; medium-high for the exact shift procedure. |
| Fixed-modulus quotient multiply `k = ceil(y/r)`, `r ← r·k − y` | **no** | **yes** (as the implemented core) | Not in the abstract; Öztürk’s TKL transcription is binary, not quotient-multiply. PLAN.md hypothesized **yes**; that hypothesis is **unconfirmed**. Confidence that TKL *lacks* it: medium (could still appear in the unread body). |
| Inverse as the product of the successive quotients / multipliers | **no** | **yes** (certificate / trace) | Not in the abstract or Algorithm X (which updates a Bézout-style accumulator `z`). Confidence: medium, same caveat. |
| Reflection step `r > y/2 ⇒ r ← y−r` (multiply by `y−1`) | **no** | **yes** | No mention in abstract or Algorithm X. Confidence: high that the published Algorithm X does not include it. |
| Composite-modulus handling / exact failure criterion `gcd(k,y)=1 ⇔ gcd(r',y)=1` | **no** | **yes** | Abstract mentions rings of integers only as the setting of Euclid, not as a worked composite analysis. Algorithm X assumes prime `y = 2^q−1`. Confidence: high that the exact criterion is not in the cited secondary sources. |
| Bounded m-wrap `k = ceil(m·y/r)` | **no** | **yes** | No evidence in abstract or Algorithm X. Confidence: high. |
| Extended-Euclid fallback when the greedy step leaves `(Z/yZ)*` | **no** | **yes** | Implementation choice of this repository. Confidence: high. |
| Explanatory multiplier-trace as a pedagogical certificate | **no** | **yes** | Not discussed in the sources above. Confidence: high. |

## How this repository will cite TKL

Until the PDF is read, citations of TKL in the paper and README will be limited to facts supported by the IEEE abstract (Euclidean-type inversion; comparable iteration counts; Mersenne-prime implementation advantage) and to Öztürk’s Algorithm X as a secondary restatement of the Mersenne case. The implemented greedy chain will be described as the Engel remainder recurrence (fixed dividend, `ceil` quotients) studied here for inversion, **not** as a verbatim TKL listing.

If a later reader obtains the TKL PDF and the general (non-Mersenne) procedure *is* the quotient-multiply loop, the “TKL has?” cells for those two rows should be flipped to **yes** and the confidence raised. That confirmation is still outstanding.

---

# Open questions status (Task 0.2)

`PLAN.md` §A.5 poses two questions that this repository treats as the research content:

- **Q1 (worst case).** Let `W(y) = max_x` (multiply-steps of greedy+reflection from `x` to `1` modulo a prime `y`). Is `W(y) = Θ(log y)` with a larger constant than Euclid, or is it `ω(log y)`?
- **Q2 (composite failure probability).** For random odd composite `y`, the greedy chain (`m = 1`) succeeds on a slowly decaying fraction of coprime `x`. Does the heuristic `P(success) ≈ ∏_{p | y} (1 − 1/p)^L` (with `L` the chain length) hold, and how does the wrap bound `M` trade off against success rate?

Neither Google Scholar, MathSciNet, nor a dedicated arXiv API was available in this environment. Searches were run via web search (and direct fetches of PDFs that those searches returned). Queries and what they returned are recorded below so the search can be repeated.

## Queries run and what they returned

| # | Query | What came back |
|---|---|---|
| 1 | `Thomas Keller Larsen Calculation of Multiplicative Inverses Over GF(P) Efficiently Where P is a Mersenne Prime algorithm` | IEEE abstract (DOI 10.1109/TC.1986.1676791); MaRDI/zbMATH DE 3941647; Crossref record (6 citations). No open PDF. |
| 2 | `Thomas Keller Larsen modular inverse "floor(p/s)+1" Mersenne prime algorithm` | No hit that restates TKL as `floor(p/s)+1`. Hits were Fermat inversion for pseudo-Mersenne primes (Scott ePrint 2018/1038; Dey–Sarkar ePrint 2018/985). |
| 3 | `"Thomas" "Keller" "Larsen" multiplicative inverses Mersenne citing papers algorithm description` | Öztürk WPI M.S. thesis 2005 and the CHES 2004 paper *Low-Power Elliptic Curve Cryptography Using Scaled Modular Arithmetic* (Öztürk–Sunar–Savaş), both of which restate TKL as **Algorithm X** (binary/shift Euclid for `2^q−1`). Tuffner/Öztürk Appendix B is the only line-by-line secondary pseudocode found. |
| 4 | `fixed modulus Euclidean inversion worst case recurrence remainder "(-y) mod r" modular inverse` | No paper on this exact map. Standard Euclid / Bézout sources; cp-algorithms recursive inverse (changing modulus) with a pointer to Pierce-expansion length. |
| 5 | `arxiv "Thomas" "Keller" "Larsen" inverse Mersenne OR "fixed modulus" Euclidean inversion worst-case steps` | No arXiv preprint of TKL and no arXiv analysis of `r ← (−y) mod r`. Bernstein–Yang *TCHES* 2019 (constant-time gcd / inversion) appeared as the modern baseline, not as a TKL follow-up. |
| 6 | `zbMATH Thomas Keller Larsen multiplicative inverses Mersenne "modified Euclidean" review algorithm` | zbMATH DE 3941647 keywords only; no review text restating the algorithm. |
| 7 | `Hars "Modular Inverse Algorithms Without Multiplications" Thomas Keller Larsen` | Hars, *EURASIP J. Embedded Systems* 2006, DOI 10.1155/ES/2006/32192: left-shift / right-shift / Euclidean inverse survey. **Does not cite TKL** in the snippets retrieved. Useful comparison paper; not a TKL follow-up. |
| 8 | `Pierce expansions length modular inverse recurrence worst case "ceil" remainder` | Erdős–Shallit, *J. Théor. Nombres Bordeaux* 3 (1991), 43–53 (PDF fetched); OEIS A006784; Mays, *Fibonacci Quart.* 25 (1987), 204–213. **Engel’s algorithm is the greedy `ceil` remainder recurrence with fixed dividend.** |
| 9 | `Engel expansion modular inverse "ceil(p/a)" product of quotients algorithm worst case` | Same Engel/Pierce cluster; no inversion-complexity paper treating the product of Engel quotients as a modular inverse. |
| 10 | `Hirzebruch-Jung continued fraction worst case length rational "ceil" Euclidean algorithm fixed modulus` | HJ continued fractions use `ceil` quotients but **change both arguments** (like Euclid), not a fixed modulus. Worst-case HJ expansions can be long (runs of 2’s). Related but not Q1. |
| 11 | `Mays "Iterating the division algorithm" Fibonacci Quarterly 1987 remainder recurrence` | Confirmed: Mays studies Euclid, Pierce (`b = a q + r` iterated with fixed `b`), and related remainder recurrences. Open PDF at `https://www.fq.math.ca/Scanned/25-3/mays.pdf`. |
| 12 | `Collins "Computing Multiplicative Inverses in GF(p)" 1969 forward backward Euclidean inversion` | Collins 1969 abstract confirmed (forward vs backward Euclid / Fermat). Not the fixed-modulus map. |
| 13 | `composite modulus multiplicative inverse "gcd" quotient fails Euclidean "not coprime" success probability` | Only the elementary fact that inverses exist iff `gcd(x,y)=1`. **No paper** on the success probability of a greedy `ceil(y/r)` chain on composite `y`. |
| 14 | `ieeexplore 1676791 Thomas Keller Larsen multiplicative inverses algorithm description keywords` | Abstract + citation count; no body. |
| 15 | Direct fetch of DOI, IEEE stamp URL, and Crossref `ielx5` PDF URL | Paywall HTML (HTTP 418 / login page). Crossref JSON confirmed metadata and the Collins citation. |

No MathSciNet session was available. No additional TKL follow-up that analyses worst-case `W(y)` or composite success rates was found among the six Crossref citations or the Öztürk/Hars/Bernstein–Yang/Pornin cluster.

## Status of Q1

**Verdict: `open` — this is the known Erdős–Shallit Engel-length question, not a new problem.**

- Without reflection the multiply-step count is Engel length \(E(x,y)\) minus the final digit \(y\). Erdős–Rényi–Szüsz (1958): \(E \le x\). Erdős–Shallit (1991): \(E = O(y^{1/3+\varepsilon})\) and \(E > c\log y\) infinitely often; Pierce-length conjecture \(O((\log y)^2)\). Explicit \(\Omega(\log y)\) family (2011 Berkeley note). Restricted to prime \(y\), this is still open.
- With reflection (`r > y/2 ⇒ r ← y−r`) it is a variant of the same question. No source was found that studies the reflected map.
- Hirzebruch–Jung continued fractions use `ceil` quotients but change both arguments (Euclid-like) and do not bound \(W(y)\).
- TKL’s abstract (if it even concerns this recurrence) is unconfirmed and is not a length bound.

Phase 2’s exhaustive reflected \(W(y)\) table on primes just above \(2^k\) is measurement of that known open problem, not a new question.

## Status of Q2

**Verdict: `open`.**

The identity `gcd(r', y) = gcd(k, y)` when `gcd(r, y) = 1` is elementary and was not found stated for this chain. No paper was found that measures greedy-chain success rates on even vs odd composite moduli, nor that writes the heuristic `∏_{p|y} (1−1/p)^L` or studies the wrap bound `M` as a success/cost trade-off.

The cp-algorithms recursive inverse (changing modulus: `inv(a) = m − ⌊m/a⌋·inv(m mod a)`) is a different failure mode and is usually stated only for prime `m`.

## References used in this note

1. E. J. Thomas, J. M. Keller, G. N. Larsen, “The Calcualtion of Multiplicative Inverses Over GF(P) Efficiently Where P is a Mersenne Prime,” *IEEE Trans. Comput.* C-35(5):478–482, 1986. DOI 10.1109/TC.1986.1676791. (Abstract + Crossref metadata only.)
2. G. E. Collins, “Computing Multiplicative Inverses in GF(p),” *Math. Comp.* 23(105):197–200, 1969. DOI 10.1090/S0025-5718-1969-0242345-5.
3. E. Öztürk, *Low Power Elliptic Curve Cryptography*, M.S. thesis, WPI, 2005. Appendix B.
4. E. Öztürk, B. Sunar, E. Savaş, “Low-Power Elliptic Curve Cryptography Using Scaled Modular Arithmetic,” in *CHES 2004*, LNCS 3156, Springer, 2004. DOI 10.1007/978-3-540-28632-5_7.
5. M. E. Mays, “Iterating the Division Algorithm,” *Fibonacci Quart.* 25 (1987), 204–213.
6. P. Erdős, J. O. Shallit, “New bounds on the length of finite Pierce and Engel series,” *J. Théor. Nombres Bordeaux* 3 (1991), 43–53.
7. F. Engel, “Entwicklung der Zahlen nach Stammbrüchen,” 1913.
8. P. Erdős, A. Rényi, P. Szüsz, “On Engel’s and Sylvester’s series,” *Ann. Univ. Sci. Budapest. Eötvös Sect. Math.* 1 (1958), 7–32.
9. “Engel expansion,” Wikipedia, accessed 2026-09-08. https://en.wikipedia.org/wiki/Engel_expansion
10. L. Hars, “Modular Inverse Algorithms Without Multiplications for Cryptographic Applications,” *EURASIP J. Embedded Systems* 2006, 32192. DOI 10.1155/ES/2006/32192.
8. D. J. Bernstein, B.-Y. Yang, “Fast constant-time gcd computation and modular inversion,” *TCHES* 2019.
9. T. Pornin, “Optimized Binary GCD for Modular Inversion,” Cryptology ePrint 2020/972.
