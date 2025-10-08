#!/usr/bin/env node

/**
 * Demonstration of the Forward Method Library
 * Shows basic usage and key features
 */

const {
    inverseMod,
    utils,
    runAllScenarios,
    compareApproaches,
    quickTest,
    MathematicalAnalysis
} = require('./index');

console.log('='.repeat(60));
console.log('FORWARD METHOD LIBRARY DEMONSTRATION');
console.log('='.repeat(60));

/**
 * Basic usage examples
 */
function basicUsageDemo() {
    console.log('\n1. BASIC USAGE EXAMPLES');
    console.log('-'.repeat(40));

    // Example 1: Simple inverse computation
    console.log('\nExample 1: 5 mod 12');
    const result1 = inverseMod(5, 12);
    console.log(`Inverse: ${result1.inverse}`);
    console.log(`Success: ${result1.success}`);
    console.log(`Verification: (5 × ${result1.inverse}) mod 12 = ${(BigInt(5) * result1.inverse) % BigInt(12)}`);

    // Example 2: Case with no inverse
    console.log('\nExample 2: 4 mod 6 (no inverse exists)');
    const result2 = inverseMod(4, 6);
    console.log(`Success: ${result2.success}`);
    console.log(`Message: ${result2.message}`);

    // Example 3: Using utility functions
    console.log('\nExample 3: Utility functions');
    console.log(`GCD(15, 25): ${utils.gcd(15, 25)}`);
    console.log(`Are 7 and 15 coprime? ${utils.areCoprime(7, 15)}`);
    console.log(`Random coprime pair:`, utils.randomCoprimePair(50));
}

/**
 * Advanced features demo
 */
function advancedFeaturesDemo() {
    console.log('\n\n2. ADVANCED FEATURES');
    console.log('-'.repeat(40));

    // Custom options
    console.log('\nCustom backtracking options:');
    const result = inverseMod(5, 12, {
        maxBacktracks: 50,
        maxDepth: 100,
        debug: false
    });
    console.log(`With custom options - Steps: ${result.steps}, Backtracks: ${result.backtrackCount}`);
}

/**
 * Mathematical analysis demo
 */
function mathAnalysisDemo() {
    console.log('\n\n3. MATHEMATICAL ANALYSIS');
    console.log('-'.repeat(40));

    const analysis = new MathematicalAnalysis();

    console.log('\nConvergence proof demonstration:');
    analysis.proveConvergence(5, 12);

    console.log('\nComplexity analysis:');
    const complexity = analysis.proveLogarithmicComplexity(100);
    console.log(`Complexity ratio: ${complexity.ratio.toFixed(2)}`);
}

/**
 * Performance demo
 */
function performanceDemo() {
    console.log('\n\n4. PERFORMANCE DEMONSTRATION');
    console.log('-'.repeat(40));

    console.log('\nRunning quick tests...');
    quickTest().then(results => {
        console.log(`Completed ${results.length} quick tests`);
    }).catch(console.error);
}

/**
 * Alternative approaches demo
 */
function alternativesDemo() {
    console.log('\n\n5. ALTERNATIVE APPROACHES');
    console.log('-'.repeat(40));

    console.log('\nComparing approaches for 5 mod 12:');
    compareApproaches(5, 12);
}

/**
 * Main demonstration
 */
async function main() {
    try {
        basicUsageDemo();
        advancedFeaturesDemo();
        mathAnalysisDemo();

        // Run performance demo (commented out for faster demo)
        // await performanceDemo();

        alternativesDemo();

        console.log('\n\n' + '='.repeat(60));
        console.log('DEMONSTRATION COMPLETE');
        console.log('='.repeat(60));
        console.log('\nFor more examples, run:');
        console.log('  npm run test:scenarios    # Scenario-based tests');
        console.log('  npm run test:quick       # Quick functionality tests');
        console.log('  npm run analysis         # Mathematical analysis');
        console.log('  npm run alternatives     # Alternative approaches');

    } catch (error) {
        console.error('Demo error:', error);
    }
}

// Run the demo if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main, basicUsageDemo, advancedFeaturesDemo, mathAnalysisDemo, performanceDemo, alternativesDemo };