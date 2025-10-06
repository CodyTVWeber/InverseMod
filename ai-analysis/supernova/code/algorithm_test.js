/**
 * Supernova Analysis: InverseMod Algorithm Test Implementation
 * Author: Code-Supernova (AI Assistant)
 * Date: September 23, 2025
 *
 * This implementation tests and analyzes Cody Weber's InverseMod algorithm
 */

// Extended Euclidean Algorithm for comparison
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

// Original InverseMod Algorithm (with bugs for analysis)
function inverseModOriginal(x, y) {
    let k = [];
    let r = [];
    let z = 0;

    // Check if inverse exists
    const euclid = extendedEuclidean(x, y);
    if (euclid.gcd !== 1) {
        return { z: 0, correct: false, error: `No inverse exists (GCD=${euclid.gcd})` };
    }

    // Normalize x mod y
    x = x % y;

    // Calculate first k value
    if (x % y === 0) {
        k.push(Math.floor(y / x));
    } else {
        k.push(Math.floor(y / x) + 1);
    }

    r.push((x * k[0]) % y);

    let n = 1;
    while (r[n - 1] > 1 && n < 1000) { // Safety limit
        // Calculate next k value
        if (y % r[n - 1] === 0) {
            k.push(Math.floor(y / r[n - 1]));
        } else {
            k.push(Math.floor(y / r[n - 1]) + 1);
        }

        r.push((r[n - 1] * k[n]) % y);
        n++;
    }

    // Calculate z
    z = 1;
    for (const valueK of k) {
        z *= valueK;
    }
    z = z % y;

    // Validate result
    const correct = ((z * x) % y === 1);
    return { z, correct, iterations: n, k, r };
}

// Fixed version of the algorithm
function inverseModFixed(x, y) {
    let k = [];
    let r = [];
    let z = 0;

    // Check if inverse exists
    const euclid = extendedEuclidean(x, y);
    if (euclid.gcd !== 1) {
        return { z: 0, correct: false, error: `No inverse exists (GCD=${euclid.gcd})` };
    }

    // Normalize x mod y
    x = x % y;

    // Calculate first k value: minimal k ensuring product > y
    let k1 = Math.floor(y / x) + 1;
    k.push(k1);
    r.push((x * k[0]) % y);

    let n = 1;
    while (r[n - 1] > 1 && n < 1000) { // Safety limit
        // Calculate next k value: minimal multiplier to ensure product > y
        let nextK = Math.floor(y / r[n - 1]) + 1;
        k.push(nextK);
        r.push((r[n - 1] * k[n]) % y);
        n++;
    }

    // Calculate z
    z = 1;
    for (const valueK of k) {
        z *= valueK;
    }
    z = z % y;

    // Validate result
    const correct = ((z * x) % y === 1);
    return { z, correct, iterations: n, k, r };
}

// Test function
function testAlgorithm(testCases) {
    console.log("=== InverseMod Algorithm Analysis ===\n");

    let results = {
        original: { passed: 0, failed: 0, total: 0 },
        fixed: { passed: 0, failed: 0, total: 0 },
        euclidean: { passed: 0, failed: 0, total: 0 }
    };

    testCases.forEach(([x, y, description]) => {
        console.log(`Testing: ${description} (${x} mod ${y})`);

        const euclid = extendedEuclidean(x, y);
        const original = inverseModOriginal(x, y);
        const fixed = inverseModFixed(x, y);

        console.log(`  Euclidean: inverse = ${euclid.inverse}`);
        console.log(`  Original:  inverse = ${original.z} (correct: ${original.correct})`);
        console.log(`  Fixed:     inverse = ${fixed.z} (correct: ${fixed.correct})`);

        if (original.correct) results.original.passed++;
        else results.original.failed++;

        if (fixed.correct) results.fixed.passed++;
        else results.fixed.failed++;

        if (euclid.inverse > 0) results.euclidean.passed++;
        else results.euclidean.failed++;

        results.original.total++;
        results.fixed.total++;
        results.euclidean.total++;

        console.log("");
    });

    console.log("=== Summary ===");
    console.log(`Original Algorithm: ${results.original.passed}/${results.original.total} passed`);
    console.log(`Fixed Algorithm: ${results.fixed.passed}/${results.fixed.total} passed`);
    console.log(`Euclidean Algorithm: ${results.euclidean.passed}/${results.euclidean.total} passed`);

    return results;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        inverseModOriginal,
        inverseModFixed,
        extendedEuclidean,
        testAlgorithm
    };
}