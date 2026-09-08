<!--
This work is licensed under a Creative Commons Attribution 4.0 International License.
See LICENSE-CC-BY-4.0.md for details.
-->

# The Engel Expansion as a Modular Inverse: Composite Moduli, Reflection, and Empirical Worst-Case Behaviour

**Author:** Cody Weber  
**Version:** Public revision (2026)  
**Dedication:** *Soli Deo Gloria* — To God alone be the glory.

> "For the LORD gives wisdom; from his mouth come knowledge and understanding." — Proverbs 2:6

---

## Origin and honesty note

This method began as my own exploration of a simple question: can one build a modular inverse by always multiplying the current remainder forward, keeping the modulus fixed, until the remainder is 1? I was curious whether that viewpoint was new.

It is not. The core step is the Engel expansion of \(x/y\), known since 1913. The certificate theorem (the product of the multipliers is an inverse) is elementary. The method is not faster than the Extended Euclidean algorithm. Whether the 1986 Thomas–Keller–Larsen paper also uses this recurrence could not be confirmed (the IEEE article is paywalled; the only detailed secondary transcription is a different, Mersenne-specific binary algorithm).

AI systems (Cursor cloud agents) took the exploration further than the original work: they identified the prior art, derived the exact failure criterion on composite moduli, measured the behaviour, and built the tested BigInt implementation and experiment harness in `implementation/`.

What remains open is the worst-case length question Q1, which is the known Erdős–Shallit problem on Engel length (restricted here to prime denominators, and with an optional reflection). What remains useful is the pedagogical trace and the small, tested implementation.

Offered with thanks to God for every true thing in this note, and with no claim that the core idea was mine to name. *Soli Deo Gloria.*

---

## Abstract

Given coprime integers \(x, y\), a multiplicative inverse of \(x\) modulo \(y\) can be built by the fixed-modulus recurrence
\[
r \leftarrow r\cdot\lceil y/r\rceil - y,
\]
taking the product of the multipliers \(\lceil y/r\rceil\) as the inverse. This recurrence **is** the classical Engel expansion of the rational \(x/y\) (F. Engel, 1913). This note does not claim that core step as new.

The contributions are:

1. The **exact failure criterion** on composite \(y\): a greedy step stays in \((\mathbb{Z}/y\mathbb{Z})^*\) if and only if \(\gcd(k, y) = 1\), equivalently \(\gcd(r', y) = 1\).
2. **Reflection** (\(r > y/2 \mapsto y-r\)) and **bounded \(m\)-wraps** \(k = \lceil m y/r\rceil\), with measured trade-offs.
3. An empirical study of the worst-case multiply-step count \(W(y)\) on primes just above \(2^k\) (\(k = 10\ldots 22\)). Without reflection this is the Erdős–Shallit Engel-length question restricted to prime denominators; with reflection it is a variant. Both remain open.
4. A verified BigInt implementation that emits the multiplier trace and falls back to Extended Euclid when the greedy step leaves the unit group.

Every numerical table below is reproduced by `cd implementation && npm run experiments` from the committed CSVs in `implementation/experiments/out/`, or is cited to a named reference.

---

## 1. The algorithm

Let \(1 < r < y\) with \(\gcd(r, y) = 1\), and write \(y = q r + s\) with \(0 < s < r\). All arithmetic in this section is exact.

### Theorem 1 (Unique greedy multiplier)

The open interval \(y < r k < r + y\) contains **exactly one** integer, namely \(k = \lceil y/r\rceil = q+1\).

**Proof.** \(k > y/r\) and \(k < y/r + 1\) is an open real interval of length 1, hence contains one integer. \(\square\)

### Theorem 2 (Next remainder)

The greedy step produces
\[
r' = r\cdot\lceil y/r\rceil - y = r - s = (-y) \bmod r \in (0, r).
\]

**Proof.** Substitute \(\lceil y/r\rceil = q+1\): \(r(q+1) - y = r - (y - q r) = r - s\). \(\square\)

The modulus \(y\) is **fixed**. Euclid instead replaces the pair \((y, r)\) by \((r, y \bmod r)\).

### Theorem 3 (Certificate / product of multipliers)

If \(r_0 = x \bmod y\) and \(r_i \equiv r_{i-1} k_i \pmod{y}\) with \(r_n = 1\), then
\[
z \equiv \prod_{i=1}^n k_i \pmod{y}
\]
satisfies \(x z \equiv 1 \pmod{y}\).

**Proof.** \(r_n \equiv r_0 \prod k_i \equiv x z \pmod{y}\). \(\square\)

This is the only “certificate theorem.” Checking \(x z \equiv 1 \pmod{y}\) is \(O(1)\) and strictly stronger; the multiplier list is an *explanation*, not a better proof of correctness.

### Theorem 4 (Exact composite failure criterion)

Assume \(\gcd(r, y) = 1\) and \(r' = r k \bmod y\). Then \(r'\) is invertible modulo \(y\) if and only if \(\gcd(k, y) = 1\). Equivalently, \(\gcd(r', y) = 1\).

**Proof.** \(\gcd(r', y) = \gcd(r k, y) = \gcd(k, y)\) because \(\gcd(r, y) = 1\). \(\square\)

In particular, if \(y\) is **prime** then every \(k < y\) is coprime to \(y\), so the greedy chain never leaves the unit group.

### Theorem 5 (Reflection)

If \(r > y/2\), the replacement \(r \mapsto y - r\) is multiplication by \(y-1 \equiv -1 \pmod{y}\). It preserves coprimality, and \(\operatorname{inv}(r) \equiv -\operatorname{inv}(y-r) \pmod{y}\).

**Proof.** \((y-r) \equiv (y-1)r \pmod{y}\). \(\gcd(y-r, y) = \gcd(r, y)\). \(\square\)

### Theorem 6 (Wraps)

For integer \(m\) with \(1 \le m < r\), set \(k_m = \lceil m y / r\rceil\) and \(r'_m = r k_m - m y = r - (m y \bmod r)\). As \(m\) runs through \(1, \ldots, r-1\), the values \(r'_m\) run through all of \(1, \ldots, r-1\).

**Proof.** \(\gcd(y, r) = 1\), so \(m \mapsto m y \bmod r\) is a bijection of \(\{1, \ldots, r-1\}\). \(\square\)

Choosing the \(m\) that yields \(r' = 1\) in one step requires \(m \equiv -y^{-1} \pmod{r}\). Unbounded wraps are therefore Extended Euclid in disguise. Bounded wraps (\(m \le M\)) are a completeness/cost trade-off, measured in §3.

The implementation (`forwardChainInverse`) applies reflection when enabled, then tries \(m = 1, \ldots, M\) and keeps the first \(k_m\) with \(\gcd(r'_m, y) = 1\). If none exists it finishes with Extended Euclid from the current remainder.

---

## 2. Prior art

A longer source log is `docs/prior-art.md`.

**Engel expansion (primary identification).** F. Engel, “Entwicklung der Zahlen nach Stammbrüchen,” 1913. For a positive real the Engel series is \(u = 1/a_1 + 1/(a_1 a_2) + 1/(a_1 a_2 a_3) + \cdots\) with nondecreasing positive integers \(a_i\). On a rational \(x/y\), Wikipedia’s article “Engel expansion” (accessed 2026-09-08) states the update outright: if \(u_i = x/y\), then \(u_{i+1} = ((-y) \bmod x)/y\). In this repository’s remainder language that is
\[
r \leftarrow r\cdot\lceil y/r\rceil - y = (-y)\bmod r,
\]
with \(y\) fixed. The Engel expansion of \(x/y\) terminates at numerator 0; when every intermediate numerator stays coprime to \(y\), it passes through numerator 1 and the last Engel digit is \(y\). The forward chain is then the Engel digits of \(x/y\) minus that final \(y\), and the modular inverse is the product of all Engel digits except the last.

Length \(E(x,y)\) of a terminating Engel expansion: Erdős–Rényi–Szüsz (1958) prove \(E \le x\); Erdős–Shallit (1991) prove \(E = O(y^{1/3+\varepsilon})\) and \(E > c\log y\) infinitely often, and conjecture \(O((\log y)^2)\) for the sibling **Pierce** length (Pierce is \(r \leftarrow y \bmod r\); Shallit’s Open Problem Garden entry “A discrete iteration related to Pierce expansions” carries a \$50 prize). A 2011 Berkeley undergraduate note constructs rationals \(x/(k\cdot\mathrm{lcm}(2,\ldots,x)+1)\) of Engel length exactly \(x\), an explicit \(\Omega(\log y)\) family. Mays (1987) presents the same remainder iteration as “iterating the division algorithm.”

**Thomas–Keller–Larsen 1986 (possibly related, unconfirmed — paywalled).** E. J. Thomas, J. M. Keller, G. N. Larsen, “The Calcualtion of Multiplicative Inverses Over GF(P) Efficiently Where P is a Mersenne Prime,” *IEEE Trans. Computers* C-35(5):478–482, May 1986. DOI [10.1109/TC.1986.1676791](https://doi.org/10.1109/TC.1986.1676791). The IEEE **abstract** describes a Euclidean-type inversion with Euclid-like iteration counts, specialized to Mersenne primes. The body was not obtained. The only detailed secondary transcription (Öztürk 2005, “Algorithm X”) is a binary/shift extended-Euclid loop for \(p = 2^q-1\), not the \(\lceil y/r\rceil\) map. This note does **not** identify the core step with TKL.

**Collins 1969.** G. E. Collins, “Computing Multiplicative Inverses in GF(\(p\)),” *Math. Comp.* 23(105):197–200. Distinguishes forward and backward Extended Euclid (changing modulus).

**Modern cryptographic inversion.** Bernstein–Yang, “Fast constant-time gcd computation and modular inversion,” *TCHES* 2019; Pornin, “Optimized Binary GCD for Modular Inversion,” IACR ePrint 2020/972. Variable-time division methods, including this one, are not competitive there. Hars, “Modular Inverse Algorithms Without Multiplications,” *EURASIP J. Embedded Systems* 2006, surveys Euclid-type iteration counts.

Nothing in that literature was found that (i) states Theorem 4, (ii) measures greedy success on composite \(y\), or (iii) tabulates reflected \(W(y)\) on primes just above \(2^k\). See `docs/prior-art.md`.

---

## 3. Composite moduli

### 3.1 What fails

On composite \(y\), Theorem 4 is sharp. Example \(x = 11\), \(y = 26\): \(11\cdot 3 = 33 \equiv 7\), then the greedy \(k = 4\) would give \(7\cdot 4 = 28 \equiv 2\) and \(\gcd(2, 26) = 2\). The chain has left \((\mathbb{Z}/26\mathbb{Z})^*\). With wrap bound \(M \ge 4\), \(m = 4\) gives \(k = 15\) and \(7\cdot 15 = 105 \equiv 1\), so \(z \equiv 3\cdot 15 = 19 \pmod{26}\). With \(M = 1\) the implementation records `fallbackAt = 7` and finishes by inverting \(7\) with Euclid: \(7^{-1} \equiv 15\), combined inverse \(3\cdot 15 \equiv 19\).

Example \(x = 500\), \(y = 1001 = 7\cdot 11\cdot 13\): greedy \(M = 1\) runs
\[
500 \to 499 \to 496 \to 487 \to 460 \to 379 \to 136 \to 87 \to 43 \to 31
\]
and blocks (next would be \(22\), \(\gcd(22, 1001) = 11\)). Inverse \(999\) comes from the Euclid tail. These traces are the demo output of `npm run demo`.

### 3.2 Measured success rates

Source: `implementation/experiments/out/success-rate.csv`. Uniform coprime pairs \((x, y)\), greedy **without** reflection, no Euclid fallback, \(n = 20{,}000\) per cell. `success_rate` is the fraction of pairs whose chain reaches remainder \(1\). `mean_steps` is the mean multiply-step count **among successes**. `mean_euclid_steps` is Extended Euclid’s mean division count on the same pairs.

**Greedy \(M = 1\), split by modulus class** (selected rows):

| Range | prime | even | odd composite | mixed |
|---|---:|---:|---:|---:|
| \(y < 10^3\) | 1.0000 | 0.0605 | 0.4788 | 0.4874 |
| \(y < 10^4\) | 1.0000 | 0.0195 | 0.4284 | 0.4026 |
| \(y < 10^6\) | 1.0000 | 0.0018 | 0.3718 | 0.3252 |
| \(y < 10^7\) | 1.0000 | 0.0007 | 0.3583 | 0.3080 |
| \(y < 10^8\) | 1.0000 | 0.0001 | 0.3441 | 0.2967 |
| \(y < 10^9\) | 1.0000 | 0.0000 | 0.3404 | 0.2829 |
| 64-bit | 1.0000 | 0.0000 | 0.2972 | 0.2203 |
| 128-bit | 1.0000 | 0.0000 | 0.2686 | 0.1910 |

Prime moduli never fail (Theorem 4). Even moduli fail like a coin-flip per step on the parity of \(k\), so success decays roughly as \(2^{-L}\) with chain length \(L\). Odd composites decay slowly.

**Wrap bound \(M\), mixed \(y < 10^7\)** (same CSV):

| \(M\) | success | mean forward steps | mean Euclid steps |
|---:|---:|---:|---:|
| 1 | 0.3080 | 14.7260 | 13.2119 |
| 2 | 0.3822 | 14.6318 | 13.2119 |
| 4 | 0.5321 | 14.1606 | 13.2119 |
| 8 | 0.7201 | 13.6384 | 13.2119 |
| 16 | 0.8531 | 13.2623 | 13.2119 |
| 32 | 0.9294 | 13.0464 | 13.2119 |

Larger \(M\) raises success toward 1 while mean successful-chain length stays comparable to Euclid. Completeness still requires unbounded \(M\) or an Euclid tail: exhaustively for \(y \le 300\), PLAN.md §A.4 recorded a largest necessary wrap of 76 (at \(x = 151\), \(y = 300\)).

### 3.3 Heuristic for Q2

For a *fixed* odd composite \(y\), each greedy \(k\) is an integer near \(y/r > 1\). Modelling \(k \bmod p\) as roughly uniform for each prime \(p \mid y\), one step survives with probability \(\prod_{p\mid y}(1-1/p)\), and a chain of length \(L\) survives with probability about
\[
\prod_{p \mid y}\bigl(1 - 1/p\bigr)^{L}.
\]
This is a heuristic, not a theorem: the \(k_i\) are deterministic functions of \(r_i\), and \(L\) itself depends on \(x\). Averaging over random odd composite \(y\) mixes many factorizations, which is why the measured odd-composite column falls only from 0.4788 (\(y < 10^3\), mean successful \(L = 5.16\)) to 0.3404 (\(y < 10^9\), \(L = 19.34\)) rather than collapsing like the even column. The CSV is the evidence; the product formula is the picture that matches the split by parity and the slow odd-composite decay.

---

## 4. Worst-case behaviour

### 4.1 Exhaustive \(W(y)\) on primes just above \(2^k\)

Let \(W(y)\) be the maximum, over \(x \in \{1, \ldots, y-1\}\), of the **multiply-step** count of greedy+reflection (reflections are free in this count). Source: `implementation/experiments/out/worst-case.csv`, exhaustive, \(k = 10\ldots 22\).

| \(k\) | \(y\) | mean | \(W(y)\) | argmax \(x\) | \(W/\log_2 y\) | Euclid worst |
|---:|---:|---:|---:|---:|---:|---:|
| 10 | 1031 | 5.3553 | 11 | 450 | 1.0989 | 12 |
| 11 | 2053 | 7.0507 | 15 | 967 | 1.3632 | 13 |
| 12 | 4099 | 6.7960 | 17 | 2010 | 1.4165 | 14 |
| 13 | 8209 | 8.5465 | 19 | 4092 | 1.4612 | 15 |
| 14 | 16411 | 7.9889 | 19 | 8089 | 1.3569 | 16 |
| 15 | 32771 | 9.7285 | 22 | 16361 | 1.4667 | 19 |
| 16 | 65537 | 9.4139 | 23 | 32720 | 1.4375 | 19 |
| 17 | 131101 | 12.7393 | 31 | 65539 | 1.8235 | 20 |
| 18 | 262147 | 12.8364 | 28 | 125974 | 1.5556 | 21 |
| 19 | 524309 | 11.9482 | 29 | 261507 | 1.5263 | 22 |
| 20 | 1048583 | 13.8608 | 35 | 344040 | 1.7500 | 24 |
| 21 | 2097169 | 14.4092 | 33 | 987730 | 1.5714 | 25 |
| 22 | 4194319 | 13.5989 | 39 | 2097159 | 1.7727 | 26 |

Euclid’s worst/\(\log_2 y\) is essentially flat (about \(1.18\)). The forward ratio **rises** from \(1.10\) to \(1.77\). Every recorded \(W(y)\) is still below \(2\log_2 y\).

### 4.2 Structure of the argmax

Full \((q_i, s_i) = (\lfloor y/r_i\rfloor, y \bmod r_i)\) traces: `implementation/experiments/out/worst-case-structure.md`.

PLAN.md §A.4 conjectured that worst cases are runs with constant \(q\) and \(s_{i+1} = s_i(q+1)\). That pattern **holds for some but not all** \(k\) in the table (holds for \(k \in \{12,13,14,15,16,17,19,20,22\}\); fails for \(k \in \{10,11,18,21\}\)).

The clean case is \(k = 22\), \(y = 4{,}194{,}319\), \(x = 2{,}097{,}159 = (y-1)/2\): thirteen opening steps with \(q = 2\) and \(s = 1, 3, 9, 27, 81, \ldots\). The k = 10 argmax \(x = 450\) (midpoint would be 515) instead has strictly increasing \(q\) from the first step.

### 4.3 Question Q1 (the Erdős–Shallit length question)

Without reflection, the multiply-step count from \(x\) to \(1\) modulo prime \(y\) is the Engel length \(E(x,y)\) minus one (the final digit \(y\) is dropped). So **Q1 without reflection is the Erdős–Rényi–Szüsz / Erdős–Shallit length question restricted to prime denominators.** Known bounds: \(E \le x\) (1958); \(E = O(y^{1/3+\varepsilon})\) and \(E > c\log y\) infinitely often (1991); an explicit \(\Omega(\log y)\) family of length exactly \(x\) (2011 Berkeley note). The true order is open; Erdős–Shallit conjecture \(O((\log y)^2)\) for the sibling Pierce length. **With reflection**, Q1 is a variant of that same open problem (remainders are folded into \((0, y/2]\)).

This note adds exhaustive \(W(y)\) on primes just above \(2^k\) for \(k = 10\ldots 22\), with reflection. No proof either way is offered.

Task 2.5 tried families \(x = (y-1)/2\), \(x = \lfloor y/3\rfloor\), next prime of \(\operatorname{lcm}(1..n)+1\), and next prime of primorial\((n)+1\) (`out/worst-case-families.csv`). None produced a \(W(y)/\log_2 y\) that grew without bound on the computed range. The midpoint family is the best practical source of hard instances and coincides with the exhaustive argmax at \(k = 22\).

---

## 5. Comparison

| Method | Completeness | Worst-case iterations (this data / literature) | Constant-time? | Uses general division? | Explanatory \(k\)-trace? |
|---|---|---|---|---|---|
| Greedy+reflection (prime \(y\)) | Yes (Thm. 4) | \(W(y) \le 39\) at 22-bit primes; Q1 is the Erdős–Shallit Engel-length question (open) | No | Yes | Yes |
| Greedy+\(M\)-wrap, no fallback | No (bounded \(M\)) | Same order when it succeeds; see §3.2 | No | Yes | Yes, if it finishes |
| Greedy+Euclid fallback | Yes | \(O(\log y)\) via the tail; partial trace plus Bézout | No | Yes | Partial |
| Extended Euclid | Yes | Lamé: at most \(\approx 5\log_{10} y\) divisions for \(\gcd\); here Euclid worst \(\approx 1.18\log_2 y\) | No | Yes | Bézout coefficients |
| Bernstein–Yang / Pornin binary gcd | Yes | \(O(\log y)\) bit operations, fixed iteration count | Yes | No | No |

For production inversion, use Extended Euclid or a constant-time binary gcd. This chain exists to be *read*.

---

## 6. Pedagogical use

The selling point is a trace a student can check by hand.

**Example.** \(x = 11\), \(y = 26\), wrap bound \(M = 4\):

\[
\begin{align*}
11 \times 3 &= 33 \equiv 7 \pmod{26},\\
7 \times 15 &= 105 \equiv 1 \pmod{26}.
\end{align*}
\]

Certificate \([3, 15]\), product \(45 \equiv 19 \pmod{26}\), and \(11\cdot 19 = 209 = 8\cdot 26 + 1\).

With default \(M = 1\) the same start blocks at remainder 7 (next would be \(2\), \(\gcd(2, 26) = 2\)). That is a picture of Theorem 4, not a bug. Euclid then inverts 7.

Reflection: \(x = 17\), \(y = 23\) gives \(17 \mapsto 6\) (multiply by 22) then \(6\times 4 = 24 \equiv 1\). Certificate \([22, 4]\), inverse \(19\).

Self-inverse of \(-1\): \(x = 1{,}000{,}002\), \(y = 1{,}000{,}003\). One reflection; without reflection the greedy chain takes exactly 33 multiplies (`npm test` and `npm run demo`).

Run `cd implementation && npm run demo` for these traces, or `node src/cli.js 11 26 --max-wrap 4`.

Verification of a claimed certificate is \(O(n)\) modular multiplies (`verifyCertificate`). The inverse \(z\) itself is still the right \(O(1)\) check.

---

## 7. Limitations

- **Not a novel core algorithm.** The core step is the Engel expansion of \(x/y\) (1913). Whether TKL 1986 also uses it is unconfirmed.
- **Not faster than Extended Euclid.** On mixed random moduli the greedy \(M=1\) chain succeeds on \(0.3080\) of pairs with \(y < 10^7\) and \(0.1910\) at 128-bit (`success-rate.csv`); the implementation still returns a correct inverse via the Euclid tail. Euclid alone is simpler when no trace is needed.
- **Not of cryptographic interest.** Variable-time, division-based, and on composite moduli incomplete without a fallback. Bernstein–Yang / Pornin win on every axis that matters there.
- **The multiplier list is not a distinguished proof object.** \(z\) with \(xz \equiv 1 \pmod{y}\) is the certificate. The list is a lesson.
- **Bounded wraps are incomplete.** A complete forward search with unbounded \(m\) *is* Euclid.
- **Q1 is open, and it is a known open problem.** Without reflection it is Engel length on prime denominators (Erdős–Shallit 1991); with reflection it is a variant. Rising \(W/\log_2 y\) on 10–22-bit primes is not a proof of \(\omega(\log y)\).
- **TKL 1986 was not obtained.** The identification of this chain with TKL is withdrawn. See `docs/prior-art.md`.

---

## 8. Implementation

`implementation/src/forward-chain.js` (CommonJS, BigInt):

- `forwardChainInverse(x, y, { reflect, maxWrap, euclidFallback })`
- `verifyCertificate(x, y, multipliers)`
- `euclidInverse`, `gcd`

Tests: exhaustive agreement with Euclid for \(3 \le y \le 300\); 10,000 random pairs with \(y < 2^{53}\) and 200 pairs with 256-bit \(y\); prime moduli never fall back; the documented examples of §6; a performance guard (10,000 calls in under two seconds). `cd implementation && npm test`.

---

## References

1. F. Engel, “Entwicklung der Zahlen nach Stammbrüchen,” *Verhandlungen der 52. Versammlung deutscher Philologen und Schulmänner in Marburg*, 1913, pp. 190–191.
2. P. Erdős, A. Rényi, P. Szüsz, “On Engel’s and Sylvester’s series,” *Ann. Univ. Sci. Budapest. Eötvös Sect. Math.* 1 (1958), 7–32.
3. P. Erdős, J. O. Shallit, “New bounds on the length of finite Pierce and Engel series,” *J. Théor. Nombres Bordeaux* 3 (1991), 43–53.
4. “Engel expansion,” *Wikipedia*, accessed 2026-09-08. https://en.wikipedia.org/wiki/Engel_expansion
5. M. E. Mays, “Iterating the Division Algorithm,” *Fibonacci Quarterly* 25 (1987), 204–213.
6. G. E. Collins, “Computing Multiplicative Inverses in GF(\(p\)),” *Math. Comp.* 23(105):197–200, 1969. DOI 10.1090/S0025-5718-1969-0242345-5.
7. E. J. Thomas, J. M. Keller, G. N. Larsen, “The Calcualtion of Multiplicative Inverses Over GF(P) Efficiently Where P is a Mersenne Prime,” *IEEE Trans. Computers* C-35(5):478–482, 1986. DOI 10.1109/TC.1986.1676791. (Abstract only; identification with the Engel recurrence is unconfirmed.)
8. E. Öztürk, *Low Power Elliptic Curve Cryptography*, M.S. thesis, Worcester Polytechnic Institute, 2005. Appendix B.
9. L. Hars, “Modular Inverse Algorithms Without Multiplications for Cryptographic Applications,” *EURASIP J. Embedded Systems* 2006, 32192. DOI 10.1155/ES/2006/32192.
10. D. J. Bernstein, B.-Y. Yang, “Fast constant-time gcd computation and modular inversion,” *IACR Trans. Cryptographic Hardware and Embedded Systems*, 2019.
11. T. Pornin, “Optimized Binary GCD for Modular Inversion,” Cryptology ePrint Archive 2020/972.
12. Committed measurements: `implementation/experiments/out/success-rate.csv`, `worst-case.csv`, `worst-case-families.csv`, and `worst-case-structure.md`.

---

*Soli Deo Gloria.*
