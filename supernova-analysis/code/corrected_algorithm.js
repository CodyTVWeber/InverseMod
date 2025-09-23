/**
 * Supernova Analysis: Corrected InverseMod Algorithm
 * Author: Code-Supernova (AI Assistant)
 * Date: September 23, 2025
 */

// Extended Euclidean for validation
function extendedEuclidean(x, y) {
    let s = 0, old_s = 1;
    let t = 1, old_t = 0;
    let r = y, old_r = x;

    while (r !== 0) {
        let quotient = Math.floor(old_r / r);
        [old_r, r] = [r, old_r - quotient * r];
        [old_s, s] = [s, old_s - quotient * s];
        [old_t, t] = [t, old_t - quotient * t];
    }

    let gcd = old_r;
    let inverse = (old_s % y + y) % y;
    return { gcd, inverse };
}

// Corrected InverseMod Algorithm
function inverseModCorrected(x, y) {
    let k = [];
    let r = [];
    let z = 0;

    // Check if inverse exists
    const euclid = extendedEuclidean(x, y);
    if (euclid.gcd !== 1) {
        return { z: 0, correct: false, error: `No inverse exists (GCD=${euclid.gcd})`, expected: euclid.inverse };
    }

    // Normalize x mod y
    x = x % y;
    if (x === 0) x = y; // Handle x divisible by y

    // Calculate first k value with proper bounds checking
    let k1 = Math.ceil(y / x);
    while (k1 * x <= y || k1 * x >= x + y) {
        k1++;
    }
    k.push(k1);
    r.push((x * k[0]) % y);

    let n = 1;
    let maxIterations = 1000; // Safety limit

    while (r[n - 1] > 1 && n < maxIterations) {
        // Check for cycles or non-decreasing remainders
        if (r.length > 1 && r[n - 1] >= r[n - 2]) {
            return { z: 0, correct: false, error: "Remainder not decreasing", iterations: n };
        }

        // Calculate next k value with proper bounds checking
        let nextK = Math.ceil(y / r[n - 1]);
        while (nextK * r[n - 1] <= y || nextK * r[n - 1] >= r[n - 1] + y) {
            nextK++;
        }

        k.push(nextK);
        r.push((r[n - 1] * nextK) % y);
        n++;
    }

    // Check if we found the inverse
    if (r[r.length - 1] === 1) {
        z = 1;
        for (const valueK of k) {
            z = (z * valueK) % y;
        }

        const correct = (z * x) % y === 1;
        return { z, correct, iterations: n, k, r, expected: euclid.inverse };
    } else {
        return { z: 0, correct: false, error: "Failed to reach remainder 1", iterations: n };
    }
}

// Test function
function testCases() {
    const testCases = [
        [5, 12, "5 mod 12"],
        [1, 10, "1 mod 10"],
        [1, 7, "1 mod 7"],
        [3, 7, "3 mod 7"],
        [2, 3, "2 mod 3"],
        [4, 5, "4 mod 5"]
    ];

    console.log("=== Corrected Algorithm Test Results ===\n");

    testCases.forEach(([x, y, desc]) => {
        console.log(`Testing: ${desc}`);
        const result = inverseModCorrected(x, y);
        console.log(`  Result: ${result.z}`);
        console.log(`  Correct: ${result.correct}`);
        console.log(`  Expected: ${result.expected}`);
        console.log(`  Iterations: ${result.iterations}`);
        if (result.error) {
            console.log(`  Error: ${result.error}`);
        }
        console.log("");
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        inverseModCorrected,
        extendedEuclidean,
        testCases
    };
}

// Run tests if this is the main module
if (require.main === module) {
    testCases();
}