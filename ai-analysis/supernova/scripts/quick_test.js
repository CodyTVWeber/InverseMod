/**
 * Supernova Analysis: Quick Test for InverseMod Algorithm
 * Author: Code-Supernova (AI Assistant)
 * Date: September 23, 2025
 */

const { testAlgorithm } = require('../code/algorithm_test.js');

// Quick test cases
const testCases = [
    [3, 7, "3 mod 7"],
    [5, 12, "5 mod 12"],
    [1, 10, "1 mod 10"],
    [1, 7, "1 mod 7"],
    [2, 3, "2 mod 3"],
    [4, 5, "4 mod 5"],
    [4, 6, "4 mod 6 (no inverse)"],
    [123, 456, "123 mod 456"]
];

console.log("Running quick test suite...\n");
const results = testAlgorithm(testCases);