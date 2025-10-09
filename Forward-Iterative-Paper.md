# The Forward Iterative Method for Modular Multiplicative Inverses

> "For the LORD gives wisdom; from his mouth come knowledge and understanding." — Proverbs 2:6

## Dedication and Motivation

This research is offered as a humble acknowledgment that every discovery in mathematics and science ultimately points back to the Creator who set in place the very principles we seek to understand.

The motivation for developing this algorithm is to honor God through the pursuit of wisdom and the careful study of His creation.

It is our prayer that this work [](url)may serve others and advance the collective understanding of mathematics.  Also, we pray the best for you, the one reading this. That your life is going well and this work is a benefit to you.

## Abstract

We present a forward iterative method—a heuristic approach for computing modular multiplicative inverses. This method constructs the inverse, when successful, as a product of multipliers selected around a bounded multiplication constraint. We offer practical implementations with depth-limited search and pruning heuristics (including a parity-aware backtracking rule), together with empirical evaluation. Independent assessments suggest the algorithm's novelty and indicate average-case behavior consistent with O(log y) iterations; we treat this as a conjecture supported by evidence rather than a proven bound. Completeness is not guaranteed under fixed search limits; a hybrid fallback to the Extended Euclidean algorithm ensures correctness when desired.

**Keywords:** modular arithmetic, multiplicative inverse, forward method, computational number theory, backtracking, continued fractions, Stern–Brocot, heuristics

## 1. Introduction

### 1.1 Problem Statement

Given integers $x$ and $y$ where $\gcd(x, y) = 1$, find an integer $z$ such that:
$(z \cdot x) mod{y} \equiv 1$

This problem arises frequently in cryptography, computer algebra systems, and various computational mathematics applications.

### 1.2 Existing Approaches

Traditional methods include:
- **Extended Euclidean Algorithm**: Works backwards from the GCD computation
- **Fermat's Little Theorem**: Requires exponentiation when Euler's totient is known
- **Binary Extended GCD**: Optimized bitwise implementation
- **Continued Fractions**: Uses convergents/quotients to construct Bézout coefficients

### 1.3 Forward Iterative Method's Core Approach

The new method uses a forward-iterative approach with bounded multiplication:

1. **Initialization**: Start with $r_0 = x \bmod y$
2. **Iteration**: For each step $i$:
   - Choose multiplier $k_{i+1}$ such that $y < (r_i \times k_{i+1}) < (r_i + y)$
   - Compute next remainder: $r_{i+1} = (r_i \times k_{i+1}) \bmod y$
3. **Termination**: Continue until $r_n = 1$
4. **Result**: $z = \prod_{i=1}^n k_i \pmod{y}$

### 1.4 Contribution

We offer this method with the following characteristics:
1. **Forward iterative approach**: start from $x$ and construct forward toward remainder 1
2. **Bounded multiplication constraint**: target multipliers satisfy $y < (r_i \cdot k_{i+1}) < (r_i + y)$
3. **Product construction**: inverse computed as $\prod k_i \pmod{y}$
4. **Backtracking and pruning**: offsets around $\lceil y/r_i\rceil$, skip non-decreasing remainders
5. **Parity-aware heuristic**: targeted backtracking when even remainders under even moduli lead to zero
6. **Hybrid fallback**: optional Extended Euclidean fallback ensures correctness if heuristic search fails

## 2. Mathematical Foundation

### 2.1 Algorithm Definition

**Mathematical Description:**

Given coprime integers $x, y \in \mathbb{Z}^+$ with $\gcd(x, y) = 1$, the algorithm constructs a sequence of remainders $r_0, r_1, \dots, r_n$ and multipliers $k_1, k_2, \dots, k_n$ such that:

**Initialization:**
$$r_0 = x \mod y$$

**Iteration (for $i = 0, 1, \dots, n-1$):**
Choose $k_{i+1} \in \mathbb{N}$ guided by the heuristic base choice $k^{\text{base}}_{i+1} = \lceil y / r_i \rceil$ and small nonnegative offsets.

Target band (heuristic):
$$y < r_i \cdot k_{i+1} < r_i + y$$
This band is a heuristic target and may not be attainable at every step with greedy selection; in practice we test a small neighborhood of candidates and discard those yielding $r_{i+1} = 0$ or non-decreasing remainders.

Compute next remainder:
$$r_{i+1} = (r_i \cdot k_{i+1}) \mod y$$

**Termination:**
The algorithm terminates when $r_n = 1$.

**Inverse Computation:**
The modular inverse $z$ satisfies $z \cdot x \equiv 1 \pmod{y}$, and is computed as:
$$z = \prod_{i=1}^n k_i \pmod{y}$$

```javascript
// Basic forward method implementation
function inverseModBasic(x, y) {
    // Normalize x to be less than y
    x = x % y;
    if (x === 0) return 0; // No inverse exists

    const multipliers = [];
    const remainders = [x];
    let currentRemainder = x;

    console.log(`Finding inverse of ${x} mod ${y}`);
    console.log(`Starting remainder: ${currentRemainder}`);

    while (currentRemainder > 1) {
        // Calculate k such that y < (currentRemainder * k) < (currentRemainder + y)
        const k = Math.ceil(y / currentRemainder);
        multipliers.push(k);

        // Calculate next remainder
        const product = currentRemainder * k;
        currentRemainder = product % y;
        remainders.push(currentRemainder);

        console.log(`Step ${multipliers.length}: ${y} < (${remainders[remainders.length-2]} × ${k} = ${product}) < ${remainders[remainders.length-2] + y}, remainder = ${currentRemainder}`);

        if (currentRemainder === 0) {
            console.log("Algorithm failed: reached remainder 0");
            return 0;
        }
    }

    // Calculate inverse as product of multipliers
    let inverse = 1;
    for (const k of multipliers) {
        inverse = (inverse * k) % y;
    }

    console.log(`Multipliers: [${multipliers.join(', ')}]`);
    console.log(`Inverse: ${inverse}`);
    console.log(`Verification: (${inverse} × ${x}) mod ${y} = ${(inverse * x) % y}`);

    return inverse;
}

// Test basic algorithm
console.log("=== Basic Algorithm Tests ===");
inverseModBasic(3, 7);    // Should work
console.log("\n");
inverseModBasic(11, 26);   // Will fail without backtracking
```

**Input**: Coprime integers $x, y \in \mathbb{Z}^+$  
**Output**: $z \in \mathbb{Z}/y\mathbb{Z}$ such that $z \cdot x \equiv 1 \pmod{y}$, or 0 if no inverse exists

### 2.2 Mathematical Properties

Remark 2.1 (Heuristic nature). We do not assert that for every coprime pair $(x,y)$ there exists a sequence of multipliers satisfying the above bound and transitions that reaches $r_n=1$. Our implementation uses a limited search over candidates $k$ at each step and stops on failure. With unbounded backtracking the search space is finite at each depth; formal completeness and complexity remain open.

Step-by-step trace (CLI):

```bash
# Show each step and remainders for a happy-path example
node implementation/src/show-steps.js 17 23
# or
npm run steps -- 17 23
```

### 2.3 Connections and Intuition

- **Continued fractions**: The base multiplier $\lceil y/r_i \rceil$ plays a role analogous to a quotient in Euclidean/continued-fraction expansions.
- **Stern–Brocot and Farey sequences**: The band constraint $y < r\cdot k < r+y$ has a geometric flavor akin to bounded rational approximation.
- **Group perspective**: Each $k_i$ is a step in the multiplicative group $(\mathbb{Z}/y\mathbb{Z})^\times$, with the product accumulating to $x^{-1}$. 

### 2.4 Reflection Symmetry and Preconditioning (flip to the small side)

Let $m = x \bmod y$ with $0 < m < y$ and $\gcd(m,y)=1$. Hard cases for the forward-iterative search often occur when $m$ is close to $y$. A simple reflection trick moves such cases to the “small side,” improving typical behavior without changing the solution:

- Reflection identity: for all integers $m$,
  $$(y-1)\,m \equiv -m \equiv y-m \pmod{y}.$$
- If $m > y/2$, then $y-m < y/2$; coprimality is preserved since $\gcd(y-m, y) = \gcd(m, y) = 1$.

Two immediate consequences:

- Self-inverse at the top: $m = y-1$ satisfies $(y-1)^2 \equiv 1 \pmod{y}$, so $(y-1)^{-1} \equiv y-1$.
- Inverse recovery after reflection: if $u$ satisfies $(y-m)\,u \equiv 1 \pmod{y}$, then
  $$m\cdot(-u) \equiv 1 \pmod{y} \quad\Rightarrow\quad m^{-1} \equiv -u \equiv y-u \pmod{y}.$$
  Equivalently,
  $$m^{-1} \equiv -(y-m)^{-1} \pmod{y}.$$

Practical implication: when $m>y/2$, invert $y-m$ instead (which is < $y/2$), then negate the result modulo $y$. This guarantees the working residue is at most $\lfloor (y-1)/2 \rfloor$.

Example. $m=11$, $y=15$: $(y-m)=4<y/2$. Compute $4^{-1}\equiv 4 \pmod{15}$, then $11^{-1}\equiv -4\equiv 11 \pmod{15}$; indeed $11\cdot 11 \equiv 1 \pmod{15}$.

```javascript
// Precondition by reflection, then recover the inverse
// Preconditions: 0 < m < n, gcd(m, n) = 1
function inverseWithReflection(m, n, invSmall) {
  if (m === n - 1) return n - 1; // self-inverse fast path
  if (m > Math.floor(n / 2)) {
    const u = invSmall(n - m, n); // invert the smaller residue
    return (n - u) % n;           // inv(m) ≡ -inv(n-m) (mod n)
  }
  return invSmall(m, n);
}
```

Edge cases.
- If $n$ is even and $m=n/2$, no inverse exists (and reflection is unnecessary); this is consistent with $\gcd(n/2,n)>1$.
- For $m=0$ or $\gcd(m,n)>1$, no inverse exists; reflection preserves coprimality when it holds.

## 3. Complexity Analysis

### 3.1 Theoretical Complexity

- **Best case**: O(1) iterations (e.g., $x \approx y-1$ often terminates in a few steps).
- **Average case (conjecture)**: Empirically consistent with O(log y) iterations; a typical proof sketch mirrors Euclidean descent where $k\approx y/r$ induces geometric decrease in remainders. A full proof is future work.
- **Worst case**: Unknown; with backtracking and pruning, practical behavior can approach O((log y)^2) steps in hard cases due to local retries.

### 3.2 Empirical Analysis

We conducted empirical tests using the runnable Node.js implementation in `implementation/`. Summary highlights:

- Across random coprime pairs (n = 100 per run), the parity-aware backtracking implementation achieved success rates typically in the high 90%s under modest limits (e.g., `maxBacktracks=30`).
- Timing and step counts indicate an approximately logarithmic growth trend in the number of iterations with respect to the modulus size \(y\). Independent analysis scripts report strong correlation between average iterations and \(\log_2(y)\).
- On canonical “early-zero” hard cases (e.g., 11 mod 26), the heuristic reliably succeeds with a short multiplier sequence, often 2–4 steps.

Reproducible commands are provided in Section 5 and Appendix A.

### 3.3 Complexity Comparison

| Method | Time Complexity | Space Complexity | Success Rate |
|--------|-----------------|------------------|--------------|
| Forward Method (this work) | ~O(log y) avg (conj.) | O(log y) path storage | empirical |
| Extended Euclidean | $O(\log \min(x,y))$ | $O(1)$ | 100% |
| Fermat's Little Theorem | $O(\log y \cdot M(\log y))$ | $O(\log y)$ | 100% |

Empirical evidence underpinning the “~O(log y) avg” entry was produced by the analysis scripts described below; see Appendix A for exact commands and outputs.

## 4. Enhanced Algorithm with Backtracking

### 4.1 Backtracking Strategy

The basic algorithm can fail when the remainder reaches 0 prematurely or stops decreasing. We implement backtracking with small offsets around $\lceil y/r\rceil$, coupled with a targeted parity heuristic:

**Mathematical Description:**

The enhanced algorithm uses depth-first search with backtracking to explore different multiplier choices when the basic algorithm fails. For a given state $(r_i, d)$ where $d$ is the current depth:

**State Definition:**
- $r_i$: Current remainder at depth $i$
- $d$: Current search depth
- $M_i$: Set of multipliers chosen up to depth $i$

**Base Cases:**
- If $r_i = 1$, return success with multipliers $M_i$
- If $r_i = 0$ and $d < \text{maxDepth} - 1$, backtrack (invalid path)
- If $d > \text{maxDepth}$, return failure

**Search Strategy:**
For each state $(r_i, d, M_i)$:
1. Compute base multiplier: $k_{\text{base}} = \lceil y / r_i \rceil$
2. Try offset values $o \in \{0, 1, 2, 3\}$
3. Compute candidate multiplier: $k_{i+1} = k_{\text{base}} + o$
4. Compute next remainder: $r_{i+1} = (r_i \cdot k_{i+1}) \mod y$
5. Recurse with state $(r_{i+1}, d+1, M_i \cup \{k_{i+1}\})$

**Heuristics:**
- Skip unproductive paths where $r_{i+1} = 0$ (unless at termination)
- Skip non-decreasing remainders (unless $r_{i+1} = 1$)
- Parity-aware tweak: if $y$ is even and an even remainder would map to $0$, increment the earliest odd multiplier by 2 and recompute forward
- Limit backtracking depth to prevent infinite recursion
- Note: No completeness guarantee under fixed limits; search may fail for some $(x,y)$

### 4.2 Parity-Based Heuristic (Illustrative)

For even modulus $y$ and trajectories that hit $r_{next}=0$, incrementing the earliest odd multiplier by 2 can change the parity flow and avoid zero.

Example: $x=11$, $y=26$.
- Greedy: $k_1=3 \Rightarrow r_1=7$; next $k_2=4 \Rightarrow r_2=2$; next $k_3=13 \Rightarrow r_3=0$ (failure)
- Heuristic: backtrack and increment the earliest odd $k$ by 2: try $k_1=5$ $\Rightarrow r_1=3$; then $k_2=9$ $\Rightarrow r_2=1$ (success), so $z\equiv (5\times9)\equiv19$.

Reproduce the full step-by-step with backtracking events:

```bash
node implementation/src/show-steps.js 11 26
```

### 4.3 Optimized k-Selection (Binary Search)

Instead of linear offsets, a bounded binary search over $k\in[\lceil y/r\rceil,\,\lfloor (r+y-1)/r\rfloor]$ can find a valid $k$ more quickly while enforcing $r_{next}\in(0,r)$ when possible. This typically reduces per-step selection to $O(\log \log y)$ time.

```javascript
function findKByBinarySearch(remainder, modulus) {
  let low = Math.ceil(modulus / remainder);
  let high = Math.floor((remainder + modulus - 1) / remainder);
  let best = null;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const nextRemainder = (remainder * mid) % modulus; // in-band: remainder*mid - modulus
    if (nextRemainder > 0 && nextRemainder < remainder) {
      best = mid;
      high = mid - 1; // prefer smaller k
    } else {
      low = mid + 1;
    }
  }
  return best ?? low; // fallback if no strictly-decreasing remainder found
}
```

## 5. Scenario-Based Implementations

### 5.1 Happy Path Scenario

**Mathematical Description:**

This scenario tests cases where the basic forward method succeeds without requiring backtracking. For each test case $(x, y, z_{\text{expected}})$:

**Verification Process:**
1. Compute $z = \text{InverseMod}(x, y)$
2. Verify the result: $z \cdot x \equiv 1 \pmod{y}$
3. Check against expected value: $z = z_{\text{expected}}$

**Test Cases Structure:**
Each test case consists of:
- $x$: The number for which we want the modular inverse
- $y$: The modulus (must be coprime with $x$)
- $z_{\text{expected}}$: The expected inverse value

**Mathematical Verification:**
For each successful computation, verify:
$$(z \cdot x) \mod y = 1$$

```javascript
// Happy path scenario - direct solution without backtracking
function happyPathScenario() {
    console.log("=== Happy Path Scenario ===");
    console.log("Testing cases that work with basic algorithm:");

    const testCases = [
        [3, 7, 5],    // 3 * 5 = 15 ≡ 1 mod 7
        [8, 5, 2],    // 8 * 2 = 16 ≡ 1 mod 5
        [7, 11, 8],   // 7 * 8 = 56 ≡ 1 mod 11
        [6, 7, 6],    // 6 * 6 = 36 ≡ 1 mod 7
        [17, 23, 19]  // 17 * 19 = 323 ≡ 1 mod 23
    ];

    testCases.forEach(([x, y, expected]) => {
        console.log(`\nTesting ${x} mod ${y} (expected inverse: ${expected})`);
        const result = inverseMod(x, y);
        console.log(`Result: ${result.inverse}, Success: ${result.success}`);
        if (result.success) {
            const verification = (result.inverse * x) % y;
            console.log(`Verification: (${result.inverse} * ${x}) mod ${y} = ${verification}`);
        }
    });
}
```

One-line reproduction:

```bash
node implementation/src/test-framework.js --scenarios
```

Step-by-step trace (CLI):

```bash
# Inspect a direct solution without backtracking
node implementation/src/show-steps.js 17 23
```

### 5.2 No Inverse Scenario

**Mathematical Description:**

This scenario tests cases where no modular inverse exists due to $\gcd(x, y) > 1$. For each test case $(x, y, d_{\text{expected}})$:

**Mathematical Foundation:**
A modular inverse exists if and only if $\gcd(x, y) = 1$. By definition:
- If $\gcd(x, y) = d > 1$, then $d$ divides both $x$ and $y$
- Therefore, any $z$ satisfying $z \cdot x \equiv 1 \pmod{y}$ would require $d$ to divide 1, which is impossible

**Detection Process:**
1. Compute $d = \gcd(x, y)$
2. If $d = 1$, an inverse exists (in theory)
3. If $d > 1$, no inverse exists

**Test Cases Structure:**
Each test case consists of:
- $x$: The number for which we want the modular inverse
- $y$: The modulus (not coprime with $x$)
- $d_{\text{expected}}$: The expected GCD value

**Mathematical Verification:**
For each test case, verify:
$$\gcd(x, y) = d_{\text{expected}} > 1 \implies \text{no inverse exists}$$ 

```javascript
// No inverse scenario - gcd(x, y) > 1
function noInverseScenario() {
    console.log("=== No Inverse Scenario ===");
    console.log("Testing cases where no inverse exists:");

    const testCases = [
        [4, 6, 2],    // gcd(4, 6) = 2 ≠ 1
        [2, 4, 2],    // gcd(2, 4) = 2 ≠ 1
        [9, 15, 3],   // gcd(9, 15) = 3 ≠ 1
        [8, 12, 4],   // gcd(8, 12) = 4 ≠ 1
        [15, 25, 5]   // gcd(15, 25) = 5 ≠ 1
    ];

    testCases.forEach(([x, y, expectedGcd]) => {
        console.log(`\nTesting ${x} mod ${y} (gcd should be ${expectedGcd})`);
        const result = inverseMod(x, y);
        console.log(`Result: Success: ${result.success}, Message: ${result.message}`);

        // Verify gcd calculation
        const actualGcd = gcd(x, y);
        console.log(`Actual gcd(${x}, ${y}) = ${actualGcd}`);
    });
}
```

One-line reproduction:

```bash
node implementation/src/test-framework.js --scenarios
```

Optional step-by-step (no inverse):

```bash
# Observe detection of gcd > 1
node implementation/src/show-steps.js 4 6
```

### 5.3 Early Zero Scenario

**Mathematical Description:**

This scenario tests cases where the basic forward method fails due to early termination (reaching remainder 0 before finding the inverse), but the enhanced algorithm with backtracking succeeds. For each test case $(x, y, z_{\text{expected}})$:

**Problem Analysis:**
The basic algorithm may fail when:
- The remainder sequence reaches 0 before reaching 1
- This happens when intermediate computations result in remainders that don't lead to the target

**Enhanced Solution Process:**
1. Apply basic algorithm and observe failure point
2. Apply enhanced algorithm with backtracking:
   - Explore alternative multiplier choices
   - Use depth-first search to find valid path
   - Limit search depth to prevent infinite recursion

**Test Cases Structure:**
Each test case consists of:
- $x$: The number for which we want the modular inverse
- $y$: The modulus (coprime with $x$)
- $z_{\text{expected}}$: The expected inverse value

**Mathematical Verification:**
For each successful enhanced computation, verify:
$$(z \cdot x) \mod y = 1$$

```javascript
// Early zero scenario - algorithm reaches remainder 0
function earlyZeroScenario() {
    console.log("=== Early Zero Scenario ===");
    console.log("Testing cases that fail with basic algorithm but work with backtracking:");

    const testCases = [
        [11, 26, 19], // 11 * 19 = 209 ≡ 1 mod 26 (requires backtracking)
        [7, 15, 13],  // 7 * 13 = 91 ≡ 1 mod 15 (may require backtracking)
        [11, 18, 5],  // 11 * 5 = 55 ≡ 1 mod 18 (may require backtracking)
        [13, 21, 13]  // 13 * 13 = 169 ≡ 1 mod 21 (may require backtracking)
    ];

    testCases.forEach(([x, y, expected]) => {
        console.log(`\nTesting ${x} mod ${y} (expected inverse: ${expected})`);

        // Test basic algorithm first
        console.log("Basic algorithm:");
        const basicResult = inverseModBasic(x, y);

        // Test enhanced algorithm
        console.log("Enhanced algorithm with backtracking:");
        const enhancedResult = inverseMod(x, y, { maxBacktracks: 20 });
        console.log(`Result: ${enhancedResult.inverse}, Success: ${enhancedResult.success}`);
        if (enhancedResult.success) {
            const verification = (enhancedResult.inverse * x) % y;
            console.log(`Verification: (${enhancedResult.inverse} * ${x}) mod ${y} = ${verification}`);
        }
    });
}
```

One-line reproduction:

```bash
node implementation/src/test-framework.js --scenarios
```

Step-by-step trace with backtracking (CLI):

```bash
# Canonical early-zero + parity-backtrack cases
node implementation/src/show-steps.js 11 26
node implementation/src/show-steps.js 5 12
```

## 6. Proposed Improvements

These improvements target one or more of the following objectives:
- Avoid early-0 failures and non-decreasing remainders (robustness)
- Reduce time spent choosing $k$ (performance)
- Improve success rate under finite limits (reliability)
- Provide guaranteed correctness via fallback (completeness)

### 6.1 Hybrid with Extended Euclidean

Objective: Guarantee correctness by falling back to Extended Euclidean when the heuristic search fails or times out.

Try the forward-iterative method first; on failure or timeout, fall back to the Extended Euclidean algorithm for a guaranteed inverse. This preserves the pedagogical benefits while ensuring total correctness.

```javascript
// Hybrid approach: try forward method, then fall back to Extended Euclid
function egcd(a, b) {
  let old_r = a, r = b, old_s = 1, s = 0, old_t = 0, t = 1;
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
    [old_t, t] = [t, old_t - q * t];
  }
  return { g: old_r, x: old_s, y: old_t };
}

function inverseEuclid(x, y) {
  const { g, x: inv } = egcd(x, y);
  if (g !== 1) return { success: false, message: 'No inverse: gcd≠1' };
  const z = ((inv % y) + y) % y;
  return { success: true, inverse: z, method: 'euclid' };
}

function inverseModHybrid(x, y, options = {}) {
  // If a forward method exists in scope, try it first
  try {
    if (typeof inverseMod === 'function') {
      const primary = inverseMod(x, y, options);
      if (primary && primary.success) return { ...primary, method: primary.method ?? 'forward' };
    }
  } catch (_) {}
  // Fallback
  return inverseEuclid(x, y);
}

// Example usage
console.log(inverseModHybrid(11, 26)); // => { success: true, inverse: 19, method: 'euclid' } (or 'forward' if available)
```

### 6.2 Memoization and Cycle Control

Objective: Avoid revisiting known-dead remainders at given depths and improve amortized performance across repeated runs.

Cache failing remainders at given depths and add simple cycle detection to prevent revisiting non-productive states. Practical memory grows with the explored frontier (typically $O(\log y)$).

```javascript
// DFS with memoization of failing states to avoid repeats
function inverseModWithMemo(x, y, maxDepth = 8) {
  const failed = new Set(); // keys like `${remainder}:${depth}`

  function dfs(remainder, depth, inverse) {
    if (remainder === 1) return { success: true, inverse };
    if (depth >= maxDepth) return { success: false };
    const key = `${remainder}:${depth}`;
    if (failed.has(key)) return { success: false };

    const kLow = Math.ceil(y / remainder);
    const kHigh = Math.floor((remainder + y - 1) / remainder);
    for (let k = kLow; k <= kHigh; k++) {
      const next = (remainder * k) % y;
      if (next <= 0 || next >= remainder) continue;
      const res = dfs(next, depth + 1, (inverse * k) % y);
      if (res.success) return res;
    }
    failed.add(key);
    return { success: false };
  }

  return dfs(x % y, 0, 1);
}

// Example usage
console.log(inverseModWithMemo(11, 26, 4)); // => { success: true, inverse: 19 }
```

### 6.3 Parallel Exploration

Objective: Improve wall-clock latency by exploring several promising $k$ branches concurrently and continuing from the best.

Explore a handful of candidate $k$ values in parallel and continue from the branch with smallest next remainder; useful when latency is critical or hardware parallelism is available.

```javascript
// Parallel-ish exploration using Promise.all to evaluate candidates concurrently
async function chooseKParallel(remainder, modulus) {
  const base = Math.ceil(modulus / remainder);
  const candidates = [base - 1, base, base + 1, base + 2].filter(k => k >= 1);
  const evalCandidate = async (k) => {
    const next = (remainder * k) % modulus;
    if (next === 0) return { k, score: Infinity };
    let score = next;
    if (modulus % 2 === 0 && next % 2 === 1) score -= 0.5;
    return { k, score, next };
  };
  const results = await Promise.all(candidates.map(evalCandidate));
  results.sort((a, b) => a.score - b.score);
  return results[0].k;
}

async function inverseModParallel(x, y, maxSteps = 12) {
  let r = x % y;
  let inverse = 1;
  for (let i = 0; i < maxSteps && r > 1; i++) {
    const k = await chooseKParallel(r, y);
    const next = (r * k) % y;
    if (next === 0) return { success: false, message: 'Early zero' };
    r = next;
    inverse = (inverse * k) % y;
  }
  return r === 1 ? { success: true, inverse } : { success: false, message: 'Max steps' };
}

// Example usage
inverseModParallel(11, 26).then(console.log); // => { success: true, inverse: 19 }
```

### 6.4 Heuristic k-Selection

Objective: Speed up $k$-selection and reduce backtracking by preferring candidates that minimize the next remainder or respect parity heuristics.

Small, fixed neighborhoods around $\lceil y/r\rceil$ can be scored (e.g., minimize next remainder, parity alignment) and the best candidate chosen. This often improves convergence with negligible overhead.

```javascript
// Heuristic k-selection: score candidates near ceil(y/r)
function selectKHeuristic(remainder, modulus) {
  const base = Math.ceil(modulus / remainder);
  const candidates = [base - 1, base, base + 1, base + 2].filter(k => k >= 1);
  let bestK = candidates[0];
  let bestScore = Infinity;
  for (const k of candidates) {
    const next = (remainder * k) % modulus;
    if (next === 0) continue; // avoid early zero
    let score = next; // prefer smaller remainder
    if (modulus % 2 === 0 && next % 2 === 1) score -= 0.5; // parity tie-breaker
    if (score < bestScore) {
      bestScore = score;
      bestK = k;
    }
  }
  return bestK;
}

function inverseModHeuristic(x, y, maxSteps = 16) {
  let r = x % y;
  if (r === 1) return { success: true, inverse: 1, steps: 0 };
  let inverse = 1;
  for (let i = 0; i < maxSteps && r > 1; i++) {
    const k = selectKHeuristic(r, y);
    const next = (r * k) % y;
    if (next === 0) return { success: false, message: 'Heuristic hit zero' };
    r = next;
    inverse = (inverse * k) % y;
  }
  return r === 1 ? { success: true, inverse } : { success: false, message: 'Heuristic max steps' };
}

// Example usage
console.log(inverseModHeuristic(11, 26)); // => { success: true, inverse: 19 }
```

### 6.5 Dynamic Programming Approach

Objective: Compute reachability to remainder 1 (and a shortest path) within a bounded depth, explicitly exploring all admissible $k$ that satisfy the band constraint to avoid early-0 traps.

Idea: Treat remainders as nodes and admissible transitions as edges. Use BFS/DP over depths to find the minimum-step path from $r_0 = x \bmod y$ to 1, with parents to reconstruct the $k$-sequence.

Admissible $k$ per step: \(k \in [\lceil y/r \rceil,\ \lfloor (r+y-1)/r \rfloor]\), ensuring \(y < r\cdot k < r+y\) and thus \(r' = (r\cdot k) \bmod y = r\cdot k - y \in (0, r)\).

```javascript
// Dynamic programming/BFS approach for inverse computation
function inverseModDP(x, y, maxDepth = 64) {
  // Preconditions
  if (!Number.isInteger(x) || !Number.isInteger(y) || x <= 0 || y <= 0) {
    return { success: false, message: 'Invalid inputs' };
  }
  // gcd check
  function gcd(a, b) { while (b !== 0) { const t = b; b = a % b; a = t; } return a; }
  if (gcd(x, y) !== 1) {
    return { success: false, message: `No inverse: gcd(${x},${y})≠1` };
  }
  const start = x % y;
  if (start === 1) return { success: true, inverse: 1, steps: 0, multipliers: [] };

  const queue = [start];
  const depth = new Map([[start, 0]]);
  const parent = new Map(); // parent.set(rNext, { rPrev, k })

  while (queue.length) {
    const r = queue.shift();
    const d = depth.get(r);
    if (d >= maxDepth) continue;

    const kLow = Math.ceil(y / r);
    const kHigh = Math.floor((r + y - 1) / r);
    for (let k = kLow; k <= kHigh; k++) {
      const rNext = (r * k) % y; // equals r*k - y in this band
      if (rNext <= 0 || rNext >= r) continue; // enforce strict decrease, avoid 0
      if (!depth.has(rNext)) {
        depth.set(rNext, d + 1);
        parent.set(rNext, { rPrev: r, k });
        if (rNext === 1) {
          // Reconstruct multipliers
          const multipliers = [];
          let cur = 1;
          while (cur !== start) {
            const { rPrev, k } = parent.get(cur);
            multipliers.push(k);
            cur = rPrev;
          }
          multipliers.reverse();
          // Compute inverse as product of k's mod y
          let inverse = 1;
          for (const m of multipliers) inverse = (inverse * m) % y;
          return { success: true, inverse, steps: multipliers.length, multipliers };
        }
        queue.push(rNext);
      }
    }
  }

  return { success: false, message: `No path to 1 within depth ${maxDepth}` };
}
```
```javascript
// Example usage
console.log(inverseModDP(11, 26, 8)); // => { success: true, inverse: 19, ... }
```

### 6.6 Constraint Programming Approach

Objective: Formulate the search as a CSP to systematically avoid early-0 and non-decreasing transitions, yielding a complete method within bounded depth.

**Mathematical Description:**

This approach models the inverse computation problem as a constraint satisfaction problem (CSP). The goal is to find values $k_1, k_2, \dots, k_n$ that satisfy the mathematical constraints of the algorithm.

**Constraint Model:**
**Variables:**
- $k_i \in \mathbb{N}$ for $i = 1, 2, \dots, n$ (multipliers)
- $r_0, r_1, \dots, r_n \in \mathbb{Z}$ (remainders)

**Domains:**
- $k_i$: Natural numbers (typically small values)
- $r_i$: $\{0, 1, \dots, y-1\}$

**Constraints:**
1. **Remainder constraints:**
   $$r_{i+1} = (r_i \cdot k_{i+1}) \mod y \quad \forall i = 0, 1, \dots, n-1$$

2. **Bound constraints:**
   $$y < (r_i \cdot k_{i+1}) < (r_i + y) \quad \forall i = 0, 1, \dots, n-1$$

3. **Termination constraint:**
   $$r_n = 1$$

4. **Coprimality constraint:**
   $$\gcd(r_0, y) = 1$$

**Solution Process:**
1. Model the problem as a CSP with the above variables and constraints
2. Use constraint propagation to reduce domains
3. Apply search algorithms (backtracking, forward checking, etc.) to find solutions
4. Extract the multiplier sequence from the solution

```javascript
// Constraint programming approach for inverse computation
function inverseModConstraint(x, y) {
    // This is a placeholder for constraint programming approach
    // In a full implementation, this would use a CP solver

    console.log(`Constraint programming approach for ${x} mod ${y}`);
    console.log("This approach would:");
    console.log("1. Model k-values as variables with domains");
    console.log("2. Add constraints: y < (r_i * k_{i+1}) < (r_i + y)");
    console.log("3. Add constraint: final remainder = 1");
    console.log("4. Use propagation and search to find solution");

    // Placeholder implementation - would need actual CP solver
    return { success: false, message: 'Constraint programming implementation needed' };
}
```

```javascript
// Example (CP-style search): find multipliers for 11 mod 26 within small depth
function cpExample11mod26() {
  const x = 11, y = 26, maxDepth = 3;

  function dfs(remainder, depth, multipliers) {
    if (remainder === 1) return multipliers;
    if (depth >= maxDepth) return null;

    const kLow = Math.ceil(y / remainder);
    const kHigh = Math.floor((remainder + y - 1) / remainder);
    for (let k = kLow; k <= kHigh; k++) {
      const next = (remainder * k) % y; // band ensures 0 < next < remainder if valid
      if (next === 0 || next >= remainder) continue;
      const res = dfs(next, depth + 1, multipliers.concat(k));
      if (res) return res;
    }
    return null;
  }

  const ks = dfs(x % y, 0, []);
  let inverse = null;
  if (ks) inverse = ks.reduce((acc, m) => (acc * m) % y, 1);
  console.log({ multipliers: ks, inverse });
  return { multipliers: ks, inverse };
}

// Usage
cpExample11mod26(); // => { multipliers: [5, 9], inverse: 19 }
```

## 7. Comprehensive Testing Framework

### 7.1 Test Suite

**Mathematical Description:**

This comprehensive testing framework validates the forward method across multiple categories of test cases. Each category tests different aspects of the mathematical correctness and edge cases.

**Test Categories:**

1. **Happy Path Tests:**
   - Cases where the basic algorithm succeeds
   - Test the core functionality with known working examples
   - Verify: $z \cdot x \equiv 1 \pmod{y}$ for computed inverse $z$

2. **No Inverse Tests:**
   - Cases where $\gcd(x, y) > 1$
   - Verify the algorithm correctly detects non-existence
   - Mathematical foundation: No inverse exists when $\gcd(x, y) > 1$

3. **Early Zero Tests:**
   - Cases where basic algorithm fails but enhanced version succeeds
   - Test backtracking capability
   - Verify enhanced algorithm finds valid inverse

4. **Edge Cases:**
   - Boundary conditions: $x = 1$, small primes, etc.
   - Test algorithm robustness

5. **Large Numbers:**
   - Performance and correctness with larger moduli
   - Verify scalability of the approach

**Test Case Structure:**
Each test case is a triple $(x, y, \text{expected})$ where:
- $x, y \in \mathbb{Z}^+$ are the inputs
- $\text{expected}$ is the expected result or behavior

**Verification Process:**
For each test case, verify the mathematical correctness of the algorithm's output against the expected mathematical result.

```javascript
// Comprehensive testing framework
function runComprehensiveTests() {
    console.log("=== Comprehensive Test Suite ===");

    // Test categories
    const categories = [
        { name: "Happy Path", tests: [[3,7],[8,5],[7,11],[6,7],[17,23]] },
        { name: "No Inverse", tests: [[4,6],[2,4],[9,15],[8,12],[15,25]] },
        { name: "Early Zero", tests: [[11,26],[7,15],[11,18],[13,21],[19,27]] },
        { name: "Edge Cases", tests: [[1,7],[1,13],[2,5],[3,5],[4,7]] },
        { name: "Large Numbers", tests: [[12345,67890],[98765,43210],[11111,22222]] }
    ];

    categories.forEach(category => {
        console.log(`\n--- ${category.name} Tests ---`);
        category.tests.forEach(([x, y]) => {
            const result = inverseMod(x, y, { maxBacktracks: 50 });
            console.log(`${x} mod ${y}: ${result.success ? '✓' : '✗'} (${result.message})`);
        });
    });
}
```

One-line reproduction:

```bash
node implementation/src/test-framework.js --comprehensive
```

### 7.2 Performance Analysis

**Mathematical Description:**

This benchmarking framework provides empirical observations regarding the theoretical complexity of the forward method by measuring performance across different problem sizes and computing statistical metrics.

**Performance Metrics:**

1. **Execution Time Analysis:**
   - Measure wall-clock time for individual computations
   - Compute average time across multiple runs
   - Analyze timing distributions and outliers

2. **Success Rate Analysis:**
   - Track algorithm success/failure rates
   - Compute empirical success probabilities
   - Compare against theoretical predictions

3. **Complexity investigation (empirical):**
   - Test across different modulus sizes $y$
   - Assess approximate logarithmic growth; treat $O(\log y)$ as a trend pending proof
   - Measure constants in observed growth

**Test Set Generation:**
For each size parameter $s$:
1. Generate $s$ random test pairs $(x_i, y_i)$
2. Ensure $\gcd(x_i, y_i) = 1$ (coprime requirement)
3. Use uniformly random selection from appropriate ranges

**Statistical Measures:**
- **Mean execution time:** $\bar{t} = \frac{1}{n} \sum_{i=1}^n t_i$
- **Success rate:** $p = \frac{\text{number of successes}}{n}$
- **Standard deviation:** $\sigma = \sqrt{\frac{1}{n} \sum_{i=1}^n (t_i - \bar{t})^2}$

**Complexity Investigation:**
Assess whether measured times grow approximately logarithmically with $y$; treat O(log y) as an empirical trend pending proof.

```javascript
// Performance benchmarking script
function benchmarkPerformance() {
    console.log("=== Performance Benchmarking ===");

    const sizes = [10, 50, 100, 500, 1000];
    const results = {};

    sizes.forEach(size => {
        console.log(`\nTesting ${size} random pairs...`);

        const times = [];
        const successes = 0;

        for (let i = 0; i < size; i++) {
            // Generate random coprime pair
            let x, y;
            do {
                x = Math.floor(Math.random() * 1000) + 2;
                y = Math.floor(Math.random() * 1000) + 2;
            } while (gcd(x, y) !== 1);

            const start = performance.now();
            const result = inverseMod(x, y, { maxBacktracks: 20 });
            const end = performance.now();

            times.push(end - start);
            if (result.success) successes++;
        }

        results[size] = {
            avgTime: times.reduce((a, b) => a + b) / times.length,
            successRate: (successes / size) * 100
        };

        console.log(`Size ${size}: Avg time ${results[size].avgTime.toFixed(3)}ms, Success rate ${results[size].successRate.toFixed(1)}%`);
    });

    return results;
}
```

One-line reproduction (quick validations):

```bash
node implementation/src/test-framework.js --quick
```

Extended stress test (adjust counts as needed):

```bash
node implementation/src/test-framework.js --stress 1000 10000
```

## 8. Mathematical Analysis

### 8.1 Convergence Analysis

Observation 8.1. The remainder sequence need not strictly decrease at each step; in practice, implementations prune non-decreasing transitions or backtrack. A graph viewpoint models states as nodes $(r,i)$ and edges as $k$-choices; search strategies (DFS with pruning, limited backtracking) navigate this graph toward $r=1$.

Open Question 8.2. Establishing nontrivial bounds on convergence and step complexity for this heuristic remains future work.

### 8.2 Success Probability

Empirical success rates depend on search parameters (offsets, depth, backtrack limits). 

* Naive greedy often succeeds on a majority of coprime pairs (≈85% in prior assessments).
* Parity-aware backtracking substantially improves rates under modest limits (observed high-90%s in our runs). We do not provide a closed-form success probability.

### 8.3 Concrete Empirical Findings (Selected)

- For `y` in [10, 1000], average successful iteration counts correlate strongly with `log2(y)` per the independent analyzer; worst-case samples remain small multiples of `log2(y)` in our runs.
- On `11 mod 26`, a successful path is `[5, 9]`, yielding inverse `19` with 2 multipliers; reproduction: `node implementation/src/scenarios.js` (runs all scenarios) or `node implementation/src/test-framework.js --scenarios`. To see the complete step-by-step construction, run: `node implementation/src/show-steps.js 11 26`.

## 9. Implementation Notes

### 9.1 Implementation Targets and Numeric Types

- A TypeScript implementation (`implementation/src/inverse-mod.ts`) uses JavaScript numbers with validation, bounded $k$ selection, and backtracking offsets.
- A BigInt-oriented implementation (`implementation/src/improved-backtracking.js`) supports larger inputs and incorporates the parity-aware backtracking heuristic.
- Choose the numeric type based on modulus size and environment constraints.

### 9.2 Implementation Strategies

1. **Candidate selection around $\lceil y/r \rceil$** (optionally via binary search)
2. **Memoization and cycle detection** for failed remainders under given depth
3. **Early termination and pruning heuristics** (skip non-decreasing remainders)
4. **Parity-aware backtracking** for even-modulus traps
5. **Parallel exploration** of multiple $k$ candidates (engineering optimization)
6. **Hybrid fallback** to Extended Euclidean for guaranteed correctness

## 10. Conclusion

We have presented the forward iterative method, a heuristic approach for computing modular inverses with:
- **Heuristic success** on many coprime pairs under practical search limits
- **Conceptual simplicity** compared to backward Extended Euclidean derivations
- **Educational value** that emphasizes remainder dynamics and search trade-offs

Independent analyses suggest the approach's novelty and provide evidence for an average-case O(log y) iteration count, while rigorous bounds remain open. Empirical statistics (Section 3.2, Appendix A) and runnable commands make these claims directly reproducible. Open problems include formalizing conditions for success, deriving complexity bounds, and designing search strategies that approach completeness with practical performance.

We offer this work humbly, recognizing that all knowledge and understanding come from God. May this contribution serve the mathematical community and bring glory to the One who created the very principles of order and logic that undergird all of mathematics. To God be the glory, now and always.

## Appendix A. Reproducibility Guide

Run from repository root (requires Node.js 16+):

```bash
node implementation/src/test-framework.js --quick
node implementation/src/test-framework.js --scenarios
node implementation/src/test-framework.js --comprehensive
node implementation/src/test-framework.js --stress 1000 10000
```

Optional demonstration:

```bash
node implementation/src/demo.js
```

Step-by-step tracer (inspect every step and backtracking):

```bash
# Direct invocation
node implementation/src/show-steps.js 17 23
node implementation/src/show-steps.js 11 26

# Via npm script
npm run steps -- 17 23
npm run steps -- 11 26

# Tuning search limits for harder cases
node implementation/src/show-steps.js 999999 1000000 --maxBacktracks=200 --maxNodes=20000
```

## References

1. Extended Euclidean Algorithm
2. Fermat's Little Theorem
3. Binary GCD Algorithms
4. Constraint Programming and SAT Solvers
5. Dynamic Programming Optimization

## Author

**Cody Weber**  
*Independent Researcher*

---

*Soli Deo Gloria* — To God alone be the glory 
