/**
 * Test file for Fixed InverseMod Algorithm
 * Tests the bug fixes and improvements
 */

// Import the fixed algorithm
const InverseModFixed = require('./inverseModFixed.gpt5.js');

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
        const result = InverseModFixed.runInverseMod(x, y, true);
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
 * Tests the specific bug cases that were identified
 */
function testBugFixes() {
    console.log("=== Testing Bug Fixes ===\n");
    
    // Test 1: The problematic case that was failing (5 mod 12)
    testCase(5, 12, 5, "BUG FIX: 5 mod 12 (was returning 0, should return 5)");
    
    // Test 2: Cases where no inverse exists
    testCase(4, 6, 0, "BUG FIX: 4 mod 6 (no inverse exists)");
    testCase(2, 4, 0, "BUG FIX: 2 mod 4 (no inverse exists)");
    testCase(9, 15, 0, "BUG FIX: 9 mod 15 (no inverse exists)");
    
    // Test 3: Cases that should still work
    testCase(3, 7, 5, "Should still work: 3 mod 7");
    testCase(7, 11, 8, "Should still work: 7 mod 11");
    testCase(8, 5, 2, "Should still work: 8 mod 5");
}

/**
 * Tests edge cases and boundary conditions
 */
function testEdgeCases() {
    console.log("\n=== Testing Edge Cases ===\n");
    
    // Test cases where x = 1
    testCase(1, 10, 1, "Edge case: 1 mod 10");
    testCase(1, 7, 1, "Edge case: 1 mod 7");
    
    // Test cases where x = y-1
    testCase(6, 7, 6, "Edge case: 6 mod 7");
    testCase(10, 11, 10, "Edge case: 10 mod 11");
    
    // Test cases where x > y
    testCase(8, 5, 2, "Edge case: 8 mod 5");
    testCase(15, 7, 1, "Edge case: 15 mod 7");
    
    // Test larger numbers
    testCase(17, 23, 19, "Larger numbers: 17 mod 23");
    testCase(31, 37, 6, "Larger numbers: 31 mod 37");
}

/**
 * Tests the GCD-based validation
 */
function testGCDValidation() {
    console.log("\n=== Testing GCD Validation ===\n");
    
    // Test cases where GCD > 1 (no inverse should exist)
    console.log("Testing x = 4, y = 6:");
    console.log(InverseModFixed.runInverseMod(4, 6, true).result);
    
    console.log("\nTesting x = 6, y = 9:");
    console.log(InverseModFixed.runInverseMod(6, 9, true).result);
    
    console.log("\nTesting x = 8, y = 12:");
    console.log(InverseModFixed.runInverseMod(8, 12, true).result);
}

/**
 * Stress test to ensure the fixes don't break working cases
 */
function stressTest() {
    console.log("\n=== Stress Test (Fixed Version) ===");
    
    const testValues = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    let successCount = 0;
    let totalTests = 0;
    
    for (let i = 0; i < testValues.length; i++) {
        for (let j = i + 1; j < testValues.length; j++) {
            const x = testValues[i];
            const y = testValues[j];
            
            // Only test if gcd(x, y) = 1 (coprime)
            if (InverseModFixed.gcd(x, y) === 1) {
                totalTests++;
                const result = InverseModFixed.runInverseMod(x, y, false);
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
 * Compares original vs fixed algorithm on problematic cases
 */
function compareAlgorithms() {
    console.log("\n=== Algorithm Comparison ===\n");
    
    // Import original algorithm for comparison
    const InverseMod = require('../../inverseMod.js');
    
    const testCases = [
        { x: 5, y: 12, name: "5 mod 12" },
        { x: 4, y: 6, name: "4 mod 6" },
        { x: 2, y: 4, name: "2 mod 4" },
        { x: 9, y: 15, name: "9 mod 15" }
    ];
    
    for (const testCase of testCases) {
        console.log(`\n--- ${testCase.name} ---`);
        
        const originalResult = InverseMod.runInverseMod(testCase.x, testCase.y, false);
        const fixedResult = InverseModFixed.runInverseMod(testCase.x, testCase.y, false);
        
        console.log(`Original: z = ${originalResult.z}, Valid: ${(originalResult.z * testCase.x) % testCase.y === 1}`);
        console.log(`Fixed:    z = ${fixedResult.z}, Valid: ${(fixedResult.z * testCase.x) % testCase.y === 1}`);
        
        const gcd = InverseModFixed.gcd(testCase.x, testCase.y);
        console.log(`GCD(${testCase.x}, ${testCase.y}) = ${gcd}, Inverse should exist: ${gcd === 1}`);
    }
}

// Run all tests
console.log("=== InverseMod Algorithm - Fixed Version Tests ===\n");

testBugFixes();
testEdgeCases();
testGCDValidation();
stressTest();
compareAlgorithms();

console.log("\n=== Test Summary ===");
console.log("The fixed version should:");
console.log("1. Correctly handle the 5 mod 12 case (return 5 instead of 0)");
console.log("2. Properly detect when no inverse exists (return 0)");
console.log("3. Maintain 100% success rate for coprime pairs");
console.log("4. Use GCD validation to quickly identify impossible cases");