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

## 7. Complexity analysis and proofs

We separate three tasks:

1. **certificate verification** (certificate already provided),
2. **certificate search** (bounded DFS),
3. **hybrid execution** (bounded DFS + Euclidean fallback).

### 7.1 Complexity of certificate verification

### Theorem 2 (verification cost)

Given \(x,y\) and a certificate of length \(n\), checking
\[
r_i=(r_{i-1}k_i)\bmod y,\quad r_n=1,\quad
x\cdot\Big(\prod_{i=1}^n k_i \bmod y\Big)\equiv 1\pmod y
\]
requires \(O(n)\) modular multiplications and \(O(1)\) auxiliary memory (or \(O(n)\) if all remainders are stored for audit output).

### Proof

The verifier performs one modular update for each \(k_i\), so exactly \(n\) transition steps. It also updates the running product modulo \(y\) once per step, again \(n\) operations. No nested loops over \(n\) are required. Therefore runtime is linear in certificate length. Memory is constant if only current state is retained; it is linear if the full trace is materialized. \(\square\)

### 7.2 Complexity of bounded DFS search

Let:

- \(D\): maximum recursion depth (`maxDepth`);
- \(O_f\): maximum offset (`maxOffset`);
- \(B = O_f + 1\): branching factor upper bound per node.

### Theorem 3 (bounded search upper bound)

The bounded DFS search in the implementation runs in
\[
O(B^D)
\]
node expansions in the worst case and uses \(O(D)\) stack space.

### Proof

At each depth, at most \(B\) candidates are explored. The DFS exploration tree is therefore bounded by a full \(B\)-ary tree of depth \(D\), with
\[
1 + B + B^2 + \cdots + B^D = \frac{B^{D+1}-1}{B-1}
\]
nodes (for \(B>1\)). This is \(O(B^D)\).  
DFS keeps only one active path on the recursion stack, so stack memory is \(O(D)\), aside from optional output traces. \(\square\)

### Corollary 3.1 (with strict decrease filter)

If the transition rule enforces \(0 < r_{i+1} < r_i\), then any single path has length at most \(r_0-1 \le y-1\). Hence the effective depth is
\[
D^\*=\min(D, y-1),
\]
giving worst-case bound \(O(B^{D^\*})\).

### 7.3 Hybrid with Euclidean fallback

### Theorem 4 (hybrid worst-case bound)

For the hybrid method (bounded forward search followed by Extended Euclid on failure), total arithmetic steps are bounded by
\[
O(B^D + \log y),
\]
where the \(\log y\) term comes from the Euclidean fallback.

### Proof sketch

By Theorem 3, bounded search contributes \(O(B^D)\). If search fails, Extended Euclid runs with logarithmic iteration complexity in the modulus scale. Adding both terms yields \(O(B^D + \log y)\). \(\square\)

## 8. Comparison with standard approaches

| Method | Guarantee | Worst-case time (high level) | Interpretability of proof artifact |
|---|---|---:|---|
| Forward certificate **verification** (certificate given) | Yes | \(O(n)\) in certificate length | Excellent (explicit \(k\)-sequence + remainder trace) |
| Forward certificate **search** (bounded DFS) | No (bounded heuristic) | \(O(B^D)\) | High |
| Forward + Euclid fallback | Yes | \(O(B^D + \log y)\) | High (forward attempt + guaranteed fallback) |
| Extended Euclidean algorithm | Yes | \(O(\log y)\) | Medium (Bézout coefficient trace) |
| Brute-force scan of \(z\) | Yes | \(O(y)\) | Low |

Practical reading: for production-critical systems, Extended Euclid is usually preferred for predictable performance; the forward approach is strongest as an explanatory and certificate-oriented method, optionally backed by Euclid.

## 9. Pros and cons

### Pros

1. **Proof artifact is explicit:** the multiplier certificate is easy to inspect and verify.
2. **Pedagogically clear:** "forward construction" can be intuitive for learners and non-specialists.
3. **AI-readable trace:** discrete, stepwise transitions are straightforward for programmatic validation.
4. **Composable:** can be safely combined with Euclidean fallback for guaranteed completion.

### Cons

1. **Search can be expensive:** bounded DFS can grow exponentially in depth bound.
2. **Parameter sensitivity:** outcomes depend on `maxDepth`, `maxOffset`, and pruning rules.
3. **No standalone bounded completeness guarantee:** without fallback, bounded search may fail.
4. **Not generally faster than Euclid:** classical algorithms remain the default for efficiency-critical use.

## 10. Conclusion

This work contributes a transparent forward certificate lens for modular inverses:

- mathematically sound once a certificate is produced;
- easy to verify by hand and by code;
- suitable for teaching, implementation, and AI-readable reasoning.

Offered humbly, with thanks to God for all wisdom and truth.

---

## References

1. Euclidean algorithm and Extended Euclidean algorithm (standard number theory texts).  
2. Elementary modular arithmetic and Bézout identities.
