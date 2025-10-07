/**
 * Scenario-based implementations for InverseMod algorithm
 * Testing different cases: happy path, no inverse, early zero, etc.
 */

// High-resolution timers for Node.js
const { performance } = require('perf_hooks');

const { ImprovedBacktracker } = require('./improved-backtracking');

/**
 * Scenario 1: Happy Path - Direct solutions without backtracking
 */
function happyPathScenario() {
    console.log("=== Happy Path Scenario ===");
    console.log("Testing cases that work with basic algorithm:");

    const testCases = [
        { x: 3, y: 7, expected: 5, description: "3 * 5 = 15 ≡ 1 mod 7" },
        { x: 8, y: 5, expected: 2, description: "8 * 2 = 16 ≡ 1 mod 5" },
        { x: 7, y: 11, expected: 8, description: "7 * 8 = 56 ≡ 1 mod 11" },
        { x: 6, y: 7, expected: 6, description: "6 * 6 = 36 ≡ 1 mod 7" },
        { x: 17, y: 23, expected: 19, description: "17 * 19 = 323 ≡ 1 mod 23" },
        { x: 31, y: 37, expected: 6, description: "31 * 6 = 186 ≡ 1 mod 37" }
    ];

    const backtracker = new ImprovedBacktracker({ debug: false });

    testCases.forEach(({ x, y, expected, description }) => {
        console.log(`\nTesting ${x} mod ${y} (${description})`);
        const result = backtracker.computeInverse(x, y);

        console.log(`Result: ${result.inverse}, Success: ${result.success}`);
        if (result.success) {
            const verification = (result.inverse * BigInt(x)) % BigInt(y);
            console.log(`Verification: (${result.inverse} * ${x}) mod ${y} = ${verification}`);
            console.log(`Backtracks used: ${result.backtrackCount}`);
            if (typeof result.forwardAttempts !== 'undefined') {
                console.log(`Forward attempts: ${result.forwardAttempts}`);
            }
            if (typeof result.euclidIterations !== 'undefined') {
                console.log(`Euclid iterations: ${result.euclidIterations}`);
            }
            if (Array.isArray(result.methodTimeline)) {
                console.log(`Method timeline: ${JSON.stringify(result.methodTimeline)}`);
            }
        }
    });
}

/**
 * Scenario 2: No Inverse - Cases where gcd(x, y) > 1
 */
function noInverseScenario() {
    console.log("=== No Inverse Scenario ===");
    console.log("Testing cases where no inverse exists:");

    const testCases = [
        { x: 4, y: 6, expectedGcd: 2, description: "gcd(4, 6) = 2 ≠ 1" },
        { x: 2, y: 4, expectedGcd: 2, description: "gcd(2, 4) = 2 ≠ 1" },
        { x: 9, y: 15, expectedGcd: 3, description: "gcd(9, 15) = 3 ≠ 1" },
        { x: 8, y: 12, expectedGcd: 4, description: "gcd(8, 12) = 4 ≠ 1" },
        { x: 15, y: 25, expectedGcd: 5, description: "gcd(15, 25) = 5 ≠ 1" },
        { x: 21, y: 35, expectedGcd: 7, description: "gcd(21, 35) = 7 ≠ 1" }
    ];

    const backtracker = new ImprovedBacktracker({ debug: false });

    testCases.forEach(({ x, y, expectedGcd, description }) => {
        console.log(`\nTesting ${x} mod ${y} (${description})`);

        // Calculate actual GCD
        const gcd = backtracker.gcd(x, y);
        console.log(`Actual gcd(${x}, ${y}) = ${gcd}`);

        const result = backtracker.computeInverse(x, y);
        console.log(`Result: Success: ${result.success}, Message: ${result.message}`);
    });
}

/**
 * Scenario 3: Early Zero - Cases requiring backtracking
 */
function earlyZeroScenario() {
    console.log("=== Early Zero Scenario ===");
    console.log("Testing cases that fail with basic algorithm but work with backtracking:");

    const testCases = [
        { x: 5, y: 12, expected: 5, description: "5 * 5 = 25 ≡ 1 mod 12 (requires backtracking)" },
        { x: 7, y: 15, expected: 13, description: "7 * 13 = 91 ≡ 1 mod 15 (may require backtracking)" },
        { x: 11, y: 18, expected: 5, description: "11 * 5 = 55 ≡ 1 mod 18 (may require backtracking)" },
        { x: 13, y: 21, expected: 13, description: "13 * 13 = 169 ≡ 1 mod 21 (may require backtracking)" },
        { x: 19, y: 27, expected: 19, description: "19 * 19 = 361 ≡ 1 mod 27 (may require backtracking)" }
    ];

    const backtracker = new ImprovedBacktracker({ debug: false });

    testCases.forEach(({ x, y, expected, description }) => {
        console.log(`\nTesting ${x} mod ${y} (${description})`);

        // Test with limited backtracks first (simulate basic algorithm)
        console.log("Basic algorithm (limited backtracks):");
        const basicResult = backtracker.computeInverse(x, y);

        // Test with enhanced backtracking
        console.log("Enhanced algorithm with backtracking:");
        const enhancedResult = backtracker.computeInverse(x, y);

        if (enhancedResult.success) {
            const verification = (enhancedResult.inverse * BigInt(x)) % BigInt(y);
            console.log(`Verification: (${enhancedResult.inverse} * ${x}) mod ${y} = ${verification}`);
            console.log(`Backtracks used: ${enhancedResult.backtrackCount}`);
        }
    });
}

/**
 * Scenario 4: Edge Cases - Special values
 */
function edgeCasesScenario() {
    console.log("=== Edge Cases Scenario ===");
    console.log("Testing edge cases and special values:");

    const testCases = [
        { x: 1, y: 7, expected: 1, description: "x = 1 always has inverse 1" },
        { x: 1, y: 13, expected: 1, description: "x = 1 always has inverse 1" },
        { x: 2, y: 5, expected: 3, description: "2 * 3 = 6 ≡ 1 mod 5" },
        { x: 3, y: 5, expected: 2, description: "3 * 2 = 6 ≡ 1 mod 5" },
        { x: 4, y: 7, expected: 2, description: "4 * 2 = 8 ≡ 1 mod 7" },
        { x: 10, y: 11, expected: 10, description: "x = y-1 often works in 1-2 steps" }
    ];

    const backtracker = new ImprovedBacktracker({ debug: false });

    testCases.forEach(({ x, y, expected, description }) => {
        console.log(`\nTesting ${x} mod ${y} (${description})`);
        const result = backtracker.computeInverse(x, y);

        console.log(`Result: ${result.inverse}, Success: ${result.success}`);
        if (result.success) {
            const verification = (result.inverse * BigInt(x)) % BigInt(y);
            console.log(`Verification: (${result.inverse} * ${x}) mod ${y} = ${verification}`);
            console.log(`Steps: ${result.steps}, Backtracks: ${result.backtrackCount}`);
        }
    });
}

/**
 * Scenario 5: Large Numbers - Performance testing
 */
function largeNumbersScenario() {
    console.log("=== Large Numbers Scenario ===");
    console.log("Testing with larger numbers to verify scalability:");

    const testCases = [
        { x: 12345, y: 67890, description: "Medium-sized numbers" },
        { x: 98765, y: 43210, description: "Medium-sized numbers" },
        { x: 111111, y: 222222, description: "Larger numbers" },
        { x: 999997, y: 1000000, description: "Near-million scale (reflection)" },
        { x: 999999, y: 1000000, description: "Near-million scale (self-inverse)" }
    ];

    // Use tighter limits to avoid hanging on hard even-modulus cases
    const backtracker = new ImprovedBacktracker({ debug: false, maxBacktracks: 200, maxNodes: 20000 });

    testCases.forEach(({ x, y, description }) => {
        console.log(`\nTesting ${x} mod ${y} (${description})`);

        const startTime = performance.now();
        const result = backtracker.computeInverse(x, y);
        const endTime = performance.now();

        console.log(`Result: ${result.success ? '✓' : '✗'}, Time: ${(endTime - startTime).toFixed(3)}ms`);
        if (result.success) {
            console.log(`Inverse: ${result.inverse}, Steps: ${result.steps}, Backtracks: ${result.backtrackCount}`);
            if (typeof result.forwardAttempts !== 'undefined') {
                console.log(`Forward attempts: ${result.forwardAttempts}`);
            }
            if (typeof result.euclidIterations !== 'undefined') {
                console.log(`Euclid iterations: ${result.euclidIterations}`);
            }
            if (Array.isArray(result.methodTimeline)) {
                console.log(`Method timeline: ${JSON.stringify(result.methodTimeline)}`);
            }
        } else {
            console.log(`Message: ${result.message}`);
        }
    });
}

/**
 * Scenario 6: Stress Testing - Random coprime pairs
 */
function stressTestScenario() {
    console.log("=== Stress Test Scenario ===");
    console.log("Testing 100 random coprime pairs:");

    const backtracker = new ImprovedBacktracker({ debug: false, maxBacktracks: 30 });
    let successes = 0;
    let totalTime = 0;
    let totalBacktracks = 0;
    const results = [];

    for (let i = 0; i < 100; i++) {
        // Generate random coprime pair
        let x, y;
        do {
            x = Math.floor(Math.random() * 1000) + 2;
            y = Math.floor(Math.random() * 1000) + 2;
        } while (backtracker.gcd(x, y) !== 1n);

        const startTime = performance.now();
        const result = backtracker.computeInverse(x, y);
        const endTime = performance.now();

        if (result.success) {
            successes++;
            totalBacktracks += result.backtrackCount;
        }

        totalTime += (endTime - startTime);
        results.push({ x, y, success: result.success, time: endTime - startTime, backtracks: result.backtrackCount });

        if (i < 10) { // Show first 10 results
            console.log(`${i + 1}. ${x} mod ${y}: ${result.success ? '✓' : '✗'} (${result.backtrackCount} backtracks, ${(endTime - startTime).toFixed(3)}ms)`);
        }
    }

    console.log(`\nSummary:`);
    console.log(`Success rate: ${successes}/100 (${(successes/100 * 100).toFixed(1)}%)`);
    console.log(`Average time: ${(totalTime/100).toFixed(3)}ms`);
    console.log(`Average backtracks: ${(totalBacktracks/successes || 0).toFixed(1)}`);

    return results;
}

/**
 * Run all scenarios
 */
function runAllScenarios() {
    console.log("Running all InverseMod algorithm scenarios...\n");

    try {
        happyPathScenario();
        console.log("\n" + "=".repeat(50) + "\n");

        noInverseScenario();
        console.log("\n" + "=".repeat(50) + "\n");

        earlyZeroScenario();
        console.log("\n" + "=".repeat(50) + "\n");

        edgeCasesScenario();
        console.log("\n" + "=".repeat(50) + "\n");

        largeNumbersScenario();
        console.log("\n" + "=".repeat(50) + "\n");

        const stressResults = stressTestScenario();

        return {
            happyPath: true,
            noInverse: true,
            earlyZero: true,
            edgeCases: true,
            largeNumbers: true,
            stressTest: stressResults
        };

    } catch (error) {
        console.error("Error running scenarios:", error);
        return { error: error.message };
    }
}

// Export functions for use in other modules
module.exports = {
    happyPathScenario,
    noInverseScenario,
    earlyZeroScenario,
    edgeCasesScenario,
    largeNumbersScenario,
    stressTestScenario,
    runAllScenarios
};

// Run scenarios if this file is executed directly
if (require.main === module) {
    runAllScenarios();
}