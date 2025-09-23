/**
 * Test file for InverseMod Algorithm
 * Tests various cases to help identify bugs
 */

// Import the algorithm (if running in Node.js)
let InverseMod;
if (typeof require !== 'undefined') {
    InverseMod = require('./inverseMod.js');
} else {
    // Browser environment - assumes InverseMod is loaded
    InverseMod = window.InverseMod;
}

/**
 * Tests a specific case and compares with expected result
 * @param {number} x - First number
 * @param {number} y - Second number
 * @param {number} expectedZ - Expected result
 * @param {string} testName - Name of the test
 */
function testCase(x, y, expectedZ, testName) {
    console.log(`\n=== ${testName} ===`);
    console.log(`Testing: inverse of ${x} mod ${y}`);
    
    try {
        const result = InverseMod.runInverseMod(x, y, true);
        console.log(result.result);
        
        if (result.success) {
            const isValid = (result.z * x) % y === 1;
            console.log(`\nResult: z = ${result.z}`);
            console.log(`Expected: z = ${expectedZ}`);
            console.log(`Validation: (${result.z} * ${x}) mod ${y} = ${(result.z * x) % y} ${isValid ? '✓' : '✗'}`);
            console.log(`Test ${result.z === expectedZ ? 'PASSED' : 'FAILED'}`);
        } else {
            console.log(`Test FAILED: ${result.result}`);
        }
    } catch (error) {
        console.log(`Test ERROR: ${error.message}`);
    }
}

/**
 * Tests edge cases and potential problem scenarios
 */
function runTests() {
    console.log("=== InverseMod Algorithm Tests ===\n");
    
    // Test 1: Simple case that should work
    testCase(3, 7, 5, "Simple Case: 3 mod 7");
    
    // Test 2: Another simple case
    testCase(5, 12, 5, "Simple Case: 5 mod 12");
    
    // Test 3: Case where x > y
    testCase(8, 5, 2, "Case where x > y: 8 mod 5");
    
    // Test 4: Case where x and y are coprime
    testCase(7, 11, 8, "Coprime case: 7 mod 11");
    
    // Test 5: Edge case - x = 1
    testCase(1, 10, 1, "Edge case: 1 mod 10");
    
    // Test 6: Edge case - x = y-1
    testCase(6, 7, 6, "Edge case: 6 mod 7");
    
    // Test 7: Larger numbers
    testCase(17, 23, 19, "Larger numbers: 17 mod 23");
    
    // Test 8: Problematic case that might fail
    testCase(4, 6, 0, "Problematic case: 4 mod 6 (no inverse exists)");
    
    // Test 9: Another case that might have issues
    testCase(2, 4, 0, "Problematic case: 2 mod 4 (no inverse exists)");
    
    // Test 10: Case where algorithm might get stuck
    testCase(9, 15, 0, "Problematic case: 9 mod 15 (no inverse exists)");
    
    console.log("\n=== Testing Invalid Inputs ===");
    
    // Test invalid inputs
    console.log("\nTesting x = 0, y = 5:");
    console.log(InverseMod.runInverseMod(0, 5, true).result);
    
    console.log("\nTesting x = 5, y = 0:");
    console.log(InverseMod.runInverseMod(5, 0, true).result);
    
    console.log("\nTesting x = 10, y = 5 (multiple):");
    console.log(InverseMod.runInverseMod(10, 5, true).result);
}

/**
 * Tests the algorithm with a range of values to find patterns
 */
function stressTest() {
    console.log("\n=== Stress Test ===");
    
    const testValues = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    let successCount = 0;
    let totalTests = 0;
    
    for (let i = 0; i < testValues.length; i++) {
        for (let j = i + 1; j < testValues.length; j++) {
            const x = testValues[i];
            const y = testValues[j];
            
            // Only test if gcd(x, y) = 1 (coprime)
            if (gcd(x, y) === 1) {
                totalTests++;
                const result = InverseMod.runInverseMod(x, y, false);
                if (result.success && (result.z * x) % y === 1) {
                    successCount++;
                } else {
                    console.log(`Failed: ${x} mod ${y} -> z = ${result.z}`);
                }
            }
        }
    }
    
    console.log(`\nStress test results: ${successCount}/${totalTests} successful (${(successCount/totalTests*100).toFixed(1)}%)`);
}

/**
 * Simple GCD function for testing
 */
function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

/**
 * Analyzes a specific failing case in detail
 */
function analyzeCase(x, y) {
    console.log(`\n=== Detailed Analysis: ${x} mod ${y} ===`);
    
    const { result, z } = InverseMod.inverseModFull(x, y);
    console.log(result);
    
    // Check if gcd(x, y) = 1
    const gcdValue = gcd(x, y);
    console.log(`\nGCD(${x}, ${y}) = ${gcdValue}`);
    console.log(`Inverse should exist: ${gcdValue === 1 ? 'Yes' : 'No'}`);
    
    if (gcdValue === 1) {
        // Try to find the correct inverse using extended Euclidean algorithm
        const correctInverse = extendedGcd(x, y);
        console.log(`Correct inverse (using extended Euclidean): ${correctInverse}`);
        console.log(`Your algorithm result: ${z}`);
        console.log(`Your algorithm correct: ${(z * x) % y === 1 ? 'Yes' : 'No'}`);
    }
}

/**
 * Extended Euclidean algorithm to find the correct inverse
 */
function extendedGcd(a, b) {
    if (b === 0) {
        return { x: 1, y: 0, gcd: a };
    }
    
    const result = extendedGcd(b, a % b);
    return {
        x: result.y,
        y: result.x - Math.floor(a / b) * result.y,
        gcd: result.gcd
    };
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    runTests();
    stressTest();
    
    // Analyze specific problematic cases
    analyzeCase(4, 6);
    analyzeCase(9, 15);
}