/**
 * Supernova Analysis: Test Runner for InverseMod Algorithm
 * Author: Code-Supernova (AI Assistant)
 * Date: September 23, 2025
 */

const { testAlgorithm } = require('../code/algorithm_test.js');

// Test cases based on the analysis
const testCases = [
    // Working cases from original analysis
    [3, 7, "3 mod 7"],
    [8, 5, "8 mod 5"],
    [7, 11, "7 mod 11"],
    [6, 7, "6 mod 7"],
    [17, 23, "17 mod 23"],

    // Failing cases from original analysis
    [5, 12, "5 mod 12"],
    [1, 10, "1 mod 10"],
    [1, 7, "1 mod 7"],

    // Edge cases
    [1, 1, "1 mod 1"],
    [2, 3, "2 mod 3"],
    [4, 5, "4 mod 5"],
    [10, 11, "10 mod 11"],
    [100, 101, "100 mod 101"],

    // Impossible cases
    [4, 6, "4 mod 6 (no inverse)"],
    [2, 4, "2 mod 4 (no inverse)"],
    [9, 15, "9 mod 15 (no inverse)"],

    // Larger numbers
    [123, 456, "123 mod 456"],
    [456, 123, "456 mod 123"],
    [1001, 1009, "1001 mod 1009"],
    [2000, 2003, "2000 mod 2003"]
];

console.log("Running comprehensive test suite...\n");
const results = testAlgorithm(testCases);