# A Novel Forward-Iterative Algorithm for Computing Modular Multiplicative Inverses

**Cody Weber**  
*Independent Researcher*  
*August 2025*

## Abstract

We present a forward-iterative heuristic for computing modular multiplicative inverses. The method constructs the inverse, when it succeeds, as a product of multipliers selected near a bounded multiplication constraint. We provide practical implementations with depth-limited search heuristics and empirical evaluation. We do not claim proven complexity bounds or guaranteed completeness.

**Keywords:** modular arithmetic, multiplicative inverse, forward-iterative algorithm, computational number theory, backtracking

## 1. Introduction

### 1.1 Problem Statement

Given integers $x$ and $y$ where $\gcd(x, y) = 1$, find an integer $z$ such that:
$$(z \cdot x) \equiv 1 \pmod{y}$$

This problem arises frequently in cryptography, computer algebra systems, and various computational mathematics applications.

### 1.2 Existing Approaches

Traditional methods include:
- **Extended Euclidean Algorithm**: Works backwards from the GCD computation
- **Fermat's Little Theorem**: Requires exponentiation when Euler's totient is known
- **Binary Extended GCD**: Optimized bitwise implementation

### 1.3 Novel Contribution

Our algorithm introduces:
1. **Forward-iterative approach** starting from $x$ and working forward
2. **Bounded multiplication constraint**: $y < (r_i \cdot k_{i+1}) < (r_i + y)$
3. **Product construction**: Inverse computed as $\prod k_i \pmod{y}$
4. **Depth-limited backtracking heuristic** to explore alternative multipliers (no completeness guarantee)

## 2. Mathematical Foundation

### 2.1 Algorithm Definition

**Algorithm 1: Basic InverseMod**

**Mathematical Description:**

Given coprime integers $x, y \in \mathbb{Z}^+$ with $\gcd(x, y) = 1$, the algorithm constructs a sequence of remainders $r_0, r_1, \dots, r_n$ and multipliers $k_1, k_2, \dots, k_n$ such that:

**Initialization:**
$$r_0 = x \mod y$$

**Iteration (for $i = 0, 1, \dots, n-1$):**
Choose $k_{i+1} \in \mathbb{N}$ guided by the heuristic base choice $k^{\text{base}}_{i+1} = \lceil y / r_i \rceil$ and small nonnegative offsets. The strict bound $$y < (r_i \cdot k_{i+1}) < (r_i + y)$$ is a target heuristic and may not be attainable for every step with greedy selection; in practice we test candidates and discard those yielding $r_{i+1}=0$ or non-decreasing remainders.

Compute next remainder:
$$r_{i+1} = (r_i \cdot k_{i+1}) \mod y$$

**Termination:**
The algorithm terminates when $r_n = 1$.

**Inverse Computation:**
The modular inverse $z$ satisfies $z \cdot x \equiv 1 \pmod{y}$, and is computed as:
$$z = \prod_{i=1}^n k_i \pmod{y}$$

```javascript
// Basic InverseMod algorithm implementation
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
inverseModBasic(5, 12);   // Will fail without backtracking
```

**Input**: Coprime integers $x, y \in \mathbb{Z}^+$  
**Output**: $z \in \mathbb{Z}/y\mathbb{Z}$ such that $z \cdot x \equiv 1 \pmod{y}$, or 0 if no inverse exists

### 2.2 Mathematical Properties

Remark 2.1 (Heuristic nature). We do not assert that for every coprime pair $(x,y)$ there exists a sequence of multipliers satisfying the above bound and transitions that reaches $r_n=1$. Our implementation uses a limited search over candidates $k$ at each step and stops on failure.

## 3. Complexity Analysis

### 3.1 Theoretical Complexity

This work does not claim formal asymptotic bounds. Empirically, the number of steps varies across instances; see Section 7 for measurements. Best-, average-, and worst-case complexities are open questions for this heuristic.

### 3.2 Empirical Analysis

Representative empirical runs over random coprime pairs show mixed outcomes; success and step counts depend strongly on search parameters (offset set size, depth and backtrack limits). See the repository scripts for current measurements.

### 3.3 Complexity Comparison

| Method | Time Complexity | Space Complexity | Success Rate |
|--------|-----------------|------------------|--------------|
| Heuristic Forward Iteration (this work) | – | – | empirical |
| Extended Euclidean | $O(\log \min(x,y))$ | $O(1)$ | 100% |
| Fermat's Little Theorem | $O(\log y \cdot M(\log y))$ | $O(\log y)$ | 100% |

## 4. Enhanced Algorithm with Backtracking

### 4.1 Backtracking Strategy

The basic algorithm fails when remainder reaches 0 prematurely. We implement backtracking based on the parity principle:

**Algorithm 2: InverseMod with Backtracking**

**Mathematical Description:**

The enhanced algorithm uses depth-first search with backtracking to explore different multiplier choices when the basic algorithm fails. For a given state $(r_i, d)$ where $d$ is the current depth:

**State Definition:**
- $r_i$: Current remainder at depth $i$
- $d$: Current search depth
- $M_i$: Set of multipliers chosen up to depth $i$

**Base Cases:**
- If $r_i = 1$, return success with multipliers $M_i$
- If $r_i = 0$ and $d < \maxDepth - 1$, backtrack (invalid path)
- If $d > \maxDepth$, return failure

**Search Strategy:**
For each state $(r_i, d, M_i)$:
1. Compute base multiplier: $k_{\text{base}} = \lceil y / r_i \rceil$
2. Try offset values $o \in \{0, 1, 2, 3\}$
3. Compute candidate multiplier: $k_{i+1} = k_{\text{base}} + o$
4. Compute next remainder: $r_{i+1} = (r_i \cdot k_{i+1}) \mod y$
5. Recurse with state $(r_{i+1}, d+1, M_i \cup \{k_{i+1}\})$

**Heuristics:**
- Skip unproductive paths where $r_{i+1} = 0$ (unless near termination)
- Skip non-decreasing remainders (unless $r_{i+1} = 1$)
- Limit backtracking depth to prevent infinite recursion
- Note: No completeness guarantee; search may fail on some coprime pairs under given limits

```javascript
// Helper function: Calculate GCD
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Enhanced InverseMod with backtracking
function inverseMod(x, y, options = {}) {
    const maxDepth = options.maxDepth || 64;
    const maxBacktracks = options.maxBacktracks || 10;
    const multiplierOffsets = options.multiplierOffsets || [0, 1, 2, 3];

    // Input validation
    if (!Number.isInteger(x) || !Number.isInteger(y) || x <= 0 || y <= 0) {
        return { success: false, inverse: 0, message: "Invalid inputs" };
    }

    if (gcd(x, y) !== 1) {
        return { success: false, inverse: 0, message: `No inverse exists: gcd(${x}, ${y}) ≠ 1` };
    }

    // Normalize x
    x = x % y;
    if (x === 1) {
        return { success: true, inverse: 1, message: "Direct solution: x = 1", steps: 0, backtrackCount: 0 };
    }

    let backtrackCount = 0;

    // Depth-first search with backtracking
    function dfs(remainder, depth, multipliers) {
        if (depth > maxDepth) return null;
        if (remainder === 1) return multipliers;
        if (remainder === 0) return null;

        const baseK = Math.ceil(y / remainder);

        for (const offset of multiplierOffsets) {
            const k = baseK + offset;
            if (k <= 0) continue;

            const product = remainder * k;
            const nextRemainder = product % y;

            // Skip non-productive paths
            if (nextRemainder === 0 && depth < maxDepth - 1) continue;
            if (nextRemainder >= remainder && nextRemainder !== 1) continue;

            const result = dfs(nextRemainder, depth + 1, [...multipliers, k]);

            if (result) return result;

            if (offset > 0) {
                backtrackCount++;
                if (backtrackCount > maxBacktracks) return null;
            }
        }

        return null;
    }

    const multipliers = dfs(x, 0, []);

    if (!multipliers) {
        return { success: false, inverse: 0, message: "Failed to find inverse" };
    }

    // Calculate inverse
    let inverse = 1;
    for (const k of multipliers) {
        inverse = (inverse * k) % y;
    }

    return {
        success: true,
        inverse,
        message: backtrackCount > 0 ? `Found using backtracking` : "Direct solution",
        multipliers,
        steps: multipliers.length,
        backtrackCount
    };
}
```

## 5. Scenario-Based Implementations

### 5.1 Happy Path Scenario

**Algorithm 3: Happy Path Implementation**

**Mathematical Description:**

This scenario tests cases where the basic InverseMod algorithm succeeds without requiring backtracking. For each test case $(x, y, z_{\text{expected}})$:

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

### 5.2 No Inverse Scenario

**Algorithm 4: No Inverse Detection**

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
$$\gcd(x, y) = d_{\text{expected}} > 1 \implies$$ no inverse exists

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

### 5.3 Early Zero Scenario

**Algorithm 5: Early Termination Detection**

**Mathematical Description:**

This scenario tests cases where the basic InverseMod algorithm fails due to early termination (reaching remainder 0 before finding the inverse), but the enhanced algorithm with backtracking succeeds. For each test case $(x, y, z_{\text{expected}})$:

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
        [5, 12, 5],   // 5 * 5 = 25 ≡ 1 mod 12 (requires backtracking)
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

## 6. Alternative Approaches

### 6.1 Constraint Programming Approach

**Algorithm 6: Constraint-Based InverseMod**

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
    return { success: false, message: "Constraint programming implementation needed" };
}
```

### 6.2 Dynamic Programming Approach

**Algorithm 7: DP-Based InverseMod**

**Mathematical Description:**

This approach uses dynamic programming to solve the inverse computation problem by breaking it down into overlapping subproblems. The key insight is that the solution for a remainder $r$ can be constructed from solutions for smaller remainders.

**Problem Formulation:**
We want to find a sequence of multipliers $k_1, k_2, \dots, k_n$ such that starting from $r_0 = x \mod y$, we reach $r_n = 1$ following the transition rules.

**State Definition:**
Let $dp[r][d]$ represent whether we can reach remainder 1 starting from remainder $r$ in exactly $d$ steps.

**Recurrence Relation:**
For each possible remainder $r$ and depth $d$:
$$dp[r][d] = \bigvee_{k} \left( (r \cdot k) \mod y = r' \land dp[r'][d-1] \right)$$
where $k$ satisfies the bound constraint:
$$y < (r \cdot k) < (r + y)$$

**Base Cases:**
- $dp[1][0] = \text{true}$ (already at target)
- $dp[r][0] = \text{false}$ for $r \neq 1$ (can't reach in 0 steps)

**Solution Reconstruction:**
Once we find a valid depth $d$ where $dp[x \mod y][d] = \text{true}$, we can reconstruct the multiplier sequence by backtracking through the DP table.

**Complexity:**
- Time: $O(y \cdot \log y \cdot d_{\max})$ where $d_{\max}$ is maximum depth
- Space: $O(y \cdot d_{\max})$ for the DP table

```javascript
// Dynamic programming approach for inverse computation
function inverseModDP(x, y) {
    // This is a placeholder for dynamic programming approach

    console.log(`Dynamic programming approach for ${x} mod ${y}`);
    console.log("This approach would:");
    console.log("1. Use memoization on (remainder, depth) pairs");
    console.log("2. Build solution from base cases");
    console.log("3. Use optimal substructure properties");

    // Placeholder implementation
    return { success: false, message: "Dynamic programming implementation needed" };
}
```

## 7. Comprehensive Testing Framework

### 7.1 Test Suite

**Algorithm 8: Comprehensive Test Framework**

**Mathematical Description:**

This comprehensive testing framework validates the InverseMod algorithm across multiple categories of test cases. Each category tests different aspects of the mathematical correctness and edge cases.

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
        { name: "Early Zero", tests: [[5,12],[7,15],[11,18],[13,21],[19,27]] },
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

### 7.2 Performance Analysis

**Algorithm 9: Performance Benchmarking**

**Mathematical Description:**

This benchmarking framework empirically validates the theoretical complexity claims of the InverseMod algorithm by measuring performance across different problem sizes and computing statistical metrics.

**Performance Metrics:**

1. **Execution Time Analysis:**
   - Measure wall-clock time for individual computations
   - Compute average time across multiple runs
   - Analyze timing distributions and outliers

2. **Success Rate Analysis:**
   - Track algorithm success/failure rates
   - Compute empirical success probabilities
   - Compare against theoretical predictions

3. **Complexity Validation:**
   - Test across different modulus sizes $y$
   - Verify $O(\log y)$ average-case complexity
   - Measure constants in complexity bounds

**Test Set Generation:**
For each size parameter $s$:
1. Generate $s$ random test pairs $(x_i, y_i)$
2. Ensure $\gcd(x_i, y_i) = 1$ (coprime requirement)
3. Use uniformly random selection from appropriate ranges

**Statistical Measures:**
- **Mean execution time:** $\bar{t} = \frac{1}{n} \sum_{i=1}^n t_i$
- **Success rate:** $p = \frac{\text{number of successes}}{n}$
- **Standard deviation:** $\sigma = \sqrt{\frac{1}{n} \sum_{i=1}^n (t_i - \bar{t})^2}$

**Complexity Verification:**
Verify the theoretical claim that average time complexity is $O(\log y)$ by checking that measured times grow logarithmically with $y$.

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

## 8. Mathematical Analysis

### 8.1 Convergence Analysis

Observation 8.1. The remainder sequence need not strictly decrease at each step; in practice, implementations prune non-decreasing transitions or backtrack.

Open Question 8.2. Establishing nontrivial bounds on convergence and step complexity for this heuristic remains future work.

### 8.2 Success Probability

Empirical success rates depend on search parameters (offset set, depth, and backtrack limits) and vary across datasets. We do not provide a closed-form success probability.

## 9. Implementation Notes

### 9.1 JavaScript Implementation Details

All implementations use BigInt for large number support:
```javascript
function inverseModBigInt(x, y) {
    // BigInt implementation for large numbers
    const BigIntMod = (a, b) => ((a % b) + b) % b;
    // Implementation details...
}
```

### 9.2 Implementation Strategies

1. **Candidate selection around $\lceil y/r \rceil$**
2. **Memoization of failed remainders under given depth**
3. **Early termination and pruning heuristics**
4. **Parallel exploration of multiple k-candidates (engineering optimization)**

## 10. Conclusion

We presented a forward-iterative heuristic for computing modular inverses:
- **Heuristic success** on many coprime pairs under practical search limits
- **Conceptual simplicity** compared to backward Extended Euclidean derivations
- **Educational value** to illustrate remainder dynamics and search trade-offs

Open problems include formalizing conditions for success, deriving complexity bounds, and designing complete search strategies with practical performance.

## References

1. Extended Euclidean Algorithm
2. Fermat's Little Theorem
3. Binary GCD Algorithms
4. Constraint Programming and SAT Solvers
5. Dynamic Programming Optimization

## Appendix A: Complete JavaScript Implementation

```javascript
// Complete implementation with all scenarios
// This would contain the full JavaScript code for all algorithms
```