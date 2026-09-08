<!--
This work is licensed under a Creative Commons Attribution 4.0 International License.
See LICENSE-CC-BY-4.0.md for details.
-->

# Prior art: Thomas–Keller–Larsen and related inversion algorithms

**Date of this note:** 2026-09-08  
**Purpose:** Task 0.1 of `PLAN.md` — confirm what Thomas–Keller–Larsen 1986 actually contains, in the notation of this repository (`x`, `y`, `r`, `k`).

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
