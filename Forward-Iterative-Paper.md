<!--
This work is licensed under a Creative Commons Attribution 4.0 International License.
See LICENSE-CC-BY-4.0.md for details.
-->

# A Forward Certificate Method for Modular Multiplicative Inverses

**Author:** Cody Weber  
**Version:** Public release (2026)  
**Dedication:** *Soli Deo Gloria* — To God alone be the glory.

---

## Abstract

Given coprime integers \(x,y\), we seek \(z\) such that
\[
xz \equiv 1 \pmod y.
\]
This manuscript presents a forward certificate viewpoint: build multipliers
\(k_1,\dots,k_n\) and remainders
\[
r_0 = x \bmod y,\qquad r_i \equiv r_{i-1}k_i \pmod y.
\]
If \(r_n=1\), then \(\prod_{i=1}^n k_i \pmod y\) is an inverse of \(x\).

The main theorem is simple and exact; search procedures for finding a certificate are heuristic unless a complete fallback (e.g., Extended Euclid) is used. The goal of this work is clarity and accessibility, not inflated claims of exclusivity.

## 1. Positioning and claim scope

This publication makes a modest claim:

1. The **forward certificate framing** is a useful and understandable way to explain inverse construction.
2. The framing can be implemented directly in code and mechanically verified.
3. It is compatible with classical methods and can be paired with Euclidean fallback for guaranteed completion.

This publication does **not** claim:

- that modular inverse computation is new;
- that this approach outperforms all classical methods;
- a complete complexity proof for bounded heuristic search.

## 2. Definitions

Let \(x,y\in\mathbb Z_{>0}\) with \(\gcd(x,y)=1\).  
Let \(r_0 = x \bmod y\), so \(0 < r_0 < y\).

A **forward certificate** of length \(n\) is a tuple
\[
(k_1,\dots,k_n)
\]
such that the induced sequence
\[
r_i = (r_{i-1}k_i)\bmod y,\quad i=1,\dots,n
\]
satisfies \(r_n=1\).

Define
\[
K = \prod_{i=1}^n k_i.
\]

## 3. Main theorem and proof

### Theorem 1 (Forward certificate correctness)

If \((k_1,\dots,k_n)\) is a forward certificate for \((x,y)\), then
\[
z \equiv K \pmod y
\]
is a multiplicative inverse of \(x\) modulo \(y\), i.e.
\[
xz \equiv 1 \pmod y.
\]

### Proof

By construction,
\[
r_1 \equiv r_0k_1 \pmod y,\;
r_2 \equiv r_1k_2 \pmod y,\;\dots,\;
r_n \equiv r_{n-1}k_n \pmod y.
\]
Substitute recursively:
\[
r_n \equiv r_0\prod_{i=1}^n k_i \equiv (x \bmod y)\,K \equiv xK \pmod y.
\]
Since \(r_n=1\), we get
\[
xK \equiv 1 \pmod y.
\]
Therefore \(K \bmod y\) is an inverse of \(x\) modulo \(y\). \(\square\)

## 4. Constructive search idea

The theorem above is exact once a certificate is found.  
The practical task is to find such a certificate.

A common forward heuristic is:

1. Start from \(r\).
2. Pick candidate \(k\) near \(\lceil y/r\rceil\), optionally with small positive offsets.
3. Compute \(r'=(rk)\bmod y\).
4. Prefer nonzero and often decreasing remainders; backtrack if needed.

This can succeed quickly on many instances, but bounded search is heuristic.  
For guaranteed completion, pair it with Extended Euclid fallback.

## 5. Proof-as-code mapping

The accompanying implementation includes:

- certificate search (heuristic DFS);
- certificate verification;
- theorem check \(x\cdot(\prod k_i)\equiv 1\pmod y\);
- optional Euclidean fallback.

The code is intentionally explicit so non-specialists and AI systems can trace each logical step without hidden algebra.

See:

- `implementation/src/forward-proof.js`
- `implementation/tests/forward-proof.test.js`

## 6. Example

For \(x=11, y=26\), one valid certificate is \([5,9]\):
\[
r_0=11,\quad
r_1=(11\cdot5)\bmod 26=3,\quad
r_2=(3\cdot9)\bmod 26=1.
\]
Thus
\[
K=5\cdot9=45,\quad 45 \bmod 26 = 19.
\]
Check:
\[
11\cdot 19 = 209 \equiv 1 \pmod{26}.
\]

## 7. Complexity notes

- The theorem itself is constant-cost once a certificate is known.
- Runtime depends on the search strategy.
- Bounded DFS/backtracking has parameter-dependent behavior; worst-case growth remains open in this manuscript.
- Euclidean fallback provides guaranteed completion in \(O(\log y)\)-style arithmetic complexity.

## 8. Conclusion

This work contributes a transparent forward certificate lens for modular inverses:

- mathematically sound once a certificate is produced;
- easy to verify by hand and by code;
- suitable for teaching, implementation, and AI-readable reasoning.

Offered humbly, with thanks to God for all wisdom and truth.

---

## References

1. Euclidean algorithm and Extended Euclidean algorithm (standard number theory texts).  
2. Elementary modular arithmetic and Bézout identities.
