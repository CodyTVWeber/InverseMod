/**
 * Supernova Analysis: InverseMod with Backtracking Implementation
 * Author: Code-Supernova (AI Assistant)
 * Date: September 23, 2025
 *
 * This implementation demonstrates the backtracking enhancement
 * and several alternative strategies for the InverseMod algorithm.
 */

// Utility functions
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function modInverse(a, m) {
    let m0 = m, t, q;
    let x0 = 0, x1 = 1;

    if (m === 1) return 0;

    while (a > 1) {
        q = Math.floor(a / m);
        t = m;
        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0) x1 += m0;
    return x1;
}

// === BACKTRACKING IMPLEMENTATION ===

function inverseModWithBacktracking(x, y) {
    let k = [];
    let r = [];

    // Check if inverse exists
    if (gcd(x, y) !== 1) {
        return { z: 0, correct: false, error: "No inverse exists" };
    }

    // Normalize x
    x = x % y;
    if (x === 0) x = y;

    // First step
    let k1 = Math.ceil(y / x);
    while (k1 * x <= y || k1 * x >= x + y) {
        k1++;
    }
    k.push(k1);
    r.push((x * k1) % y);

    let step = 1;
    let maxSteps = 1000;
    let backtrackCount = 0;
    let maxBacktracks = 100;

    while (r[step - 1] !== 1 && step < maxSteps) {
        // Find next k-value
        let nextK = Math.ceil(y / r[step - 1]);
        let nextR = (r[step - 1] * nextK) % y;

        // Check if valid
        let isValid = nextR > 0 && nextR < r[step - 1];

        // Backtracking logic
        while (!isValid && backtrackCount < maxBacktracks) {
            nextK++;
            nextR = (r[step - 1] * nextK) % y;
            isValid = nextR > 0 && nextR < r[step - 1];
            backtrackCount++;
        }

        if (!isValid) {
            return { z: 0, correct: false, error: "Backtracking exhausted" };
        }

        // Valid step found
        k.push(nextK);
        r.push(nextR);
        step++;
        backtrackCount = 0; // Reset
    }

    if (r[r.length - 1] === 1) {
        let z = 1;
        for (const val of k) {
            z = (z * val) % y;
        }
        const correct = (z * x) % y === 1;
        return { z, correct, iterations: step, k, r };
    } else {
        return { z: 0, correct: false, error: "Failed to reach 1" };
    }
}

// === BINARY SEARCH STRATEGY ===

function inverseModWithBinarySearch(x, y) {
    let k = [];
    let r = [];

    if (gcd(x, y) !== 1) {
        return { z: 0, correct: false, error: "No inverse exists" };
    }

    x = x % y;
    if (x === 0) x = y;

    // Binary search for first k
    let k1 = binarySearchK(x, y);
    k.push(k1);
    r.push((x * k1) % y);

    let step = 1;
    while (r[step - 1] !== 1 && step < 1000) {
        let nextK = binarySearchK(r[step - 1], y);
        let nextR = (r[step - 1] * nextK) % y;

        if (nextR === 0 || nextR >= r[step - 1]) {
            return { z: 0, correct: false, error: "Binary search failed" };
        }

        k.push(nextK);
        r.push(nextR);
        step++;
    }

    if (r[r.length - 1] === 1) {
        let z = 1;
        for (const val of k) {
            z = (z * val) % y;
        }
        const correct = (z * x) % y === 1;
        return { z, correct, iterations: step, k, r };
    } else {
        return { z: 0, correct: false, error: "Failed to reach 1" };
    }
}

function binarySearchK(currentX, y) {
    let low = Math.ceil(y / currentX);
    let high = Math.floor((currentX + y - 1) / currentX);

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        let remainder = (currentX * mid) % y;

        if (remainder === 0) {
            low = mid + 1;
        } else if (remainder >= currentX) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return low;
}

// === HEURISTIC STRATEGY ===

function inverseModWithHeuristics(x, y) {
    let k = [];
    let r = [];

    if (gcd(x, y) !== 1) {
        return { z: 0, correct: false, error: "No inverse exists" };
    }

    x = x % y;
    if (x === 0) x = y;

    // First k with heuristic
    let k1 = heuristicK(x, y);
    k.push(k1);
    r.push((x * k1) % y);

    let step = 1;
    while (r[step - 1] !== 1 && step < 1000) {
        let nextK = heuristicK(r[step - 1], y);
        let nextR = (r[step - 1] * nextK) % y;

        if (nextR === 0 || nextR >= r[step - 1]) {
            return { z: 0, correct: false, error: "Heuristic failed" };
        }

        k.push(nextK);
        r.push(nextR);
        step++;
    }

    if (r[r.length - 1] === 1) {
        let z = 1;
        for (const val of k) {
            z = (z * val) % y;
        }
        const correct = (z * x) % y === 1;
        return { z, correct, iterations: step, k, r };
    } else {
        return { z: 0, correct: false, error: "Failed to reach 1" };
    }
}

function heuristicK(currentX, y) {
    let baseK = Math.ceil(y / currentX);

    // Size optimization: try to maximize reduction
    let bestK = baseK;
    let bestReduction = 0;

    for (let k = baseK; k < baseK + 5; k++) {
        let remainder = (currentX * k) % y;
        if (remainder > 0 && remainder < currentX) {
            let reduction = currentX / remainder;
            if (reduction > bestReduction) {
                bestReduction = reduction;
                bestK = k;
            }
        }
    }

    return bestK;
}

// === TEST FUNCTION ===

function comprehensiveTest() {
    const testCases = [
        [5, 12, "5 mod 12 (challenging case)"],
        [1, 10, "1 mod 10 (edge case)"],
        [2, 3, "2 mod 3 (simple case)"],
        [7, 11, "7 mod 11 (prime case)"],
        [123, 456, "123 mod 456 (large case)"]
    ];

    console.log("=== Comprehensive Algorithm Test ===\n");

    testCases.forEach(([x, y, desc]) => {
        console.log(`Testing: ${desc}`);

        const backtracking = inverseModWithBacktracking(x, y);
        const binary = inverseModWithBinarySearch(x, y);
        const heuristic = inverseModWithHeuristics(x, y);

        console.log(`  Backtracking: z=${backtracking.z}, correct=${backtracking.correct}, steps=${backtracking.iterations}`);
        console.log(`  Binary Search: z=${binary.z}, correct=${binary.correct}, steps=${binary.iterations}`);
        console.log(`  Heuristic: z=${heuristic.z}, correct=${heuristic.correct}, steps=${heuristic.iterations}`);

        if (backtracking.error) console.log(`  Backtracking error: ${backtracking.error}`);
        if (binary.error) console.log(`  Binary error: ${binary.error}`);
        if (heuristic.error) console.log(`  Heuristic error: ${heuristic.error}`);

        console.log("");
    });
}

// === PERFORMANCE COMPARISON ===

function performanceComparison() {
    console.log("=== Performance Comparison ===\n");

    const testCases = [
        [17, 23], [31, 47], [64, 97], [128, 193], [256, 383]
    ];

    let results = {
        backtracking: { totalTime: 0, successes: 0 },
        binary: { totalTime: 0, successes: 0 },
        heuristic: { totalTime: 0, successes: 0 }
    };

    testCases.forEach(([x, y]) => {
        console.log(`Testing ${x} mod ${y}:`);

        // Backtracking
        let start = Date.now();
        let bt = inverseModWithBacktracking(x, y);
        let btTime = Date.now() - start;
        results.backtracking.totalTime += btTime;
        results.backtracking.successes += bt.correct ? 1 : 0;

        // Binary Search
        start = Date.now();
        let bs = inverseModWithBinarySearch(x, y);
        let bsTime = Date.now() - start;
        results.binary.totalTime += bsTime;
        results.binary.successes += bs.correct ? 1 : 0;

        // Heuristic
        start = Date.now();
        let h = inverseModWithHeuristics(x, y);
        let hTime = Date.now() - start;
        results.heuristic.totalTime += hTime;
        results.heuristic.successes += h.correct ? 1 : 0;

        console.log(`  BT: ${btTime}ms, BS: ${bsTime}ms, H: ${hTime}ms`);
        console.log(`  Success: BT=${bt.correct}, BS=${bs.correct}, H=${h.correct}`);
        console.log("");
    });

    console.log("=== Summary ===");
    console.log(`Backtracking: ${results.backtracking.totalTime}ms total, ${results.backtracking.successes}/${testCases.length} successes`);
    console.log(`Binary Search: ${results.binary.totalTime}ms total, ${results.binary.successes}/${testCases.length} successes`);
    console.log(`Heuristic: ${results.heuristic.totalTime}ms total, ${results.heuristic.successes}/${testCases.length} successes`);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        inverseModWithBacktracking,
        inverseModWithBinarySearch,
        inverseModWithHeuristics,
        comprehensiveTest,
        performanceComparison
    };
}

// Run tests if this is the main module
if (require.main === module) {
    comprehensiveTest();
    performanceComparison();
}