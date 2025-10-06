/**
 * Supernova Analysis: Working InverseMod Algorithm
 * Author: Code-Supernova (AI Assistant)
 * Date: September 23, 2025
 */

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

// Working version with backtracking
function inverseModWorking(x, y) {
    // Check if inverse exists
    if (gcd(x, y) !== 1) {
        return { z: 0, correct: false, error: "No inverse exists" };
    }

    x = x % y;
    if (x === 0) x = y;

    let k = [];
    let r = [];
    let currentX = x;
    let attempts = 0;
    const maxAttempts = 10000;

    // First step
    // Choose smallest k1 that ensures product > y; avoid strict upper bound to prevent deadlocks
    let k1 = Math.floor(y / currentX) + 1;
    k.push(k1);
    r.push((currentX * k[0]) % y);

    let step = 1;
    let backtrackCount = 0;

    while (r[r.length - 1] !== 1 && attempts < maxAttempts) {
        attempts++;

        // Check for cycles
        if (r.length > 1 && r[r.length - 1] === r[r.length - 2]) {
            backtrackCount++;
            if (backtrackCount > 5) {
                return { z: 0, correct: false, error: "Too many backtracks" };
            }
            // Backtrack: try different k value
            k.pop();
            r.pop();
            if (k.length === 0) break;
            k[k.length - 1]++;
            r.push((currentX * k[k.length - 1]) % y);
            continue;
        }

        // Normal step
        // Pick minimal multiplier to ensure product > y; do not enforce strict < r+y
        let nextK = Math.floor(y / r[r.length - 1]) + 1;

        k.push(nextK);
        r.push((r[r.length - 1] * nextK) % y);
        step++;

        // Reset backtrack count on successful step
        backtrackCount = 0;
    }

    if (r[r.length - 1] === 1) {
        let z = 1;
        for (const val of k) {
            z = (z * val) % y;
        }
        const correct = (z * x) % y === 1;
        return { z, correct, iterations: step, k, r };
    } else {
        return { z: 0, correct: false, error: "Failed to find inverse", iterations: step };
    }
}

// Quick test
function quickTest() {
    console.log("=== Working Algorithm Test ===\n");

    const tests = [
        [5, 12],
        [1, 10],
        [2, 3],
        [3, 7]
    ];

    tests.forEach(([x, y]) => {
        console.log(`Testing ${x} mod ${y}:`);
        const result = inverseModWorking(x, y);
        console.log(`  Result: ${result.z}`);
        console.log(`  Correct: ${result.correct}`);
        console.log(`  Iterations: ${result.iterations}`);
        if (result.error) {
            console.log(`  Error: ${result.error}`);
        }
        console.log("");
    });
}

quickTest();