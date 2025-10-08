/**
 * Comprehensive Test Framework for Forward Method
 * Includes performance testing, correctness verification, and statistical analysis
 */

// High-resolution timers for Node.js
const { performance } = require('perf_hooks');

const { ImprovedBacktracker } = require('./improved-backtracking');
const {
    happyPathScenario,
    noInverseScenario,
    earlyZeroScenario,
    edgeCasesScenario,
    largeNumbersScenario,
    stressTestScenario
} = require('./scenarios');

class TestFramework {
    constructor() {
        this.results = [];
        this.startTime = null;
        this.backtracker = new ImprovedBacktracker({ debug: false });
    }

    /**
     * Run a single test case
     */
    async runTest(x, y, expected = null, description = '') {
        const testStart = performance.now();

        const result = this.backtracker.computeInverse(x, y);

        const testEnd = performance.now();
        const duration = testEnd - testStart;

        const testResult = {
            x,
            y,
            expected,
            description,
            success: result.success,
            inverse: result.inverse ? result.inverse.toString() : null,
            message: result.message,
            steps: result.steps,
            backtrackCount: result.backtrackCount,
            duration,
            timestamp: new Date().toISOString()
        };

        // Always verify correctness when an inverse is returned
        if (result.success) {
            const actual = (BigInt(result.inverse) * BigInt(x)) % BigInt(y);
            testResult.verified = actual === 1n;
            if (expected !== null) {
                testResult.expectedInverse = expected;
            }
        }

        this.results.push(testResult);
        return testResult;
    }

    /**
     * Run multiple test cases
     */
    async runTestSuite(testCases) {
        console.log(`Running test suite with ${testCases.length} cases...\n`);

        const suiteResults = [];

        for (const testCase of testCases) {
            const result = await this.runTest(
                testCase.x,
                testCase.y,
                testCase.expected,
                testCase.description
            );

            suiteResults.push(result);

            // Show progress for large test suites
            if (testCases.length > 10 && suiteResults.length % 10 === 0) {
                console.log(`Completed ${suiteResults.length}/${testCases.length} tests`);
            }
        }

        return suiteResults;
    }

    /**
     * Generate random coprime pairs for testing
     */
    generateRandomCoprimePairs(count, maxValue = 1000) {
        const pairs = [];

        while (pairs.length < count) {
            const x = Math.floor(Math.random() * maxValue) + 2;
            const y = Math.floor(Math.random() * maxValue) + 2;

            if (this.backtracker.gcd(x, y) === 1n) {
                pairs.push({ x, y, description: `Random coprime pair ${pairs.length + 1}` });
            }
        }

        return pairs;
    }

    /**
     * Statistical analysis of test results
     */
    analyzeResults(results) {
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        const analysis = {
            total: results.length,
            successful: successful.length,
            failed: failed.length,
            successRate: (successful.length / results.length) * 100,

            // Performance metrics
            avgDuration: results.reduce((sum, r) => sum + r.duration, 0) / results.length,
            avgSteps: successful.reduce((sum, r) => sum + r.steps, 0) / successful.length,
            avgBacktracks: successful.reduce((sum, r) => sum + r.backtrackCount, 0) / successful.length,

            // Verification metrics
            verified: successful.filter(r => r.verified === true).length,
            verificationRate: successful.length > 0 ?
                (successful.filter(r => r.verified === true).length / successful.length) * 100 : 0,

            // Error analysis
            errorTypes: this.categorizeErrors(failed),

            // Performance distribution
            durationDistribution: this.getDistribution(results.map(r => r.duration), 10),
            stepsDistribution: this.getDistribution(successful.map(r => r.steps), 10),
            backtrackDistribution: this.getDistribution(successful.map(r => r.backtrackCount), 10)
        };

        return analysis;
    }

    /**
     * Categorize different types of failures
     */
    categorizeErrors(failedResults) {
        const categories = {};

        failedResults.forEach(result => {
            const message = result.message;
            if (!categories[message]) {
                categories[message] = [];
            }
            categories[message].push(result);
        });

        return categories;
    }

    /**
     * Get distribution of values in buckets
     */
    getDistribution(values, bucketCount) {
        if (values.length === 0) return {};

        const min = Math.min(...values);
        const max = Math.max(...values);

        // When all values are the same, avoid NaN buckets by returning a single bucket
        if (min === max) {
            const key = `${min.toFixed(2)}-${max.toFixed(2)}`;
            return { [key]: values.length };
        }

        const range = max - min;
        const safeBucketCount = Math.max(1, bucketCount | 0);
        const bucketSize = range / safeBucketCount;

        const distribution = {};

        values.forEach(value => {
            // Guard against floating point edge cases
            let bucketIndex = Math.floor((value - min) / bucketSize);
            if (!Number.isFinite(bucketIndex) || bucketIndex < 0) bucketIndex = 0;
            if (bucketIndex >= safeBucketCount) bucketIndex = safeBucketCount - 1;

            const bucketStart = min + bucketIndex * bucketSize;
            const bucketEnd = bucketStart + bucketSize;
            const bucketKey = `${bucketStart.toFixed(2)}-${bucketEnd.toFixed(2)}`;

            if (!distribution[bucketKey]) {
                distribution[bucketKey] = 0;
            }
            distribution[bucketKey]++;
        });

        return distribution;
    }

    /**
     * Print detailed analysis report
     */
    printAnalysisReport(analysis) {
        console.log("\n" + "=".repeat(60));
        console.log("TEST ANALYSIS REPORT");
        console.log("=".repeat(60));

        console.log(`\nOverall Results:`);
        console.log(`Total tests: ${analysis.total}`);
        console.log(`Successful: ${analysis.successful} (${analysis.successRate.toFixed(1)}%)`);
        console.log(`Failed: ${analysis.failed}`);

        console.log(`\nPerformance Metrics:`);
        console.log(`Average duration: ${analysis.avgDuration.toFixed(3)}ms`);
        console.log(`Average steps: ${analysis.avgSteps.toFixed(1)}`);
        console.log(`Average backtracks: ${analysis.avgBacktracks.toFixed(1)}`);

        console.log(`\nVerification:`);
        console.log(`Verified correct: ${analysis.verified}/${analysis.successful} (${analysis.verificationRate.toFixed(1)}%)`);

        console.log(`\nError Analysis:`);
        Object.entries(analysis.errorTypes).forEach(([errorType, cases]) => {
            console.log(`  ${errorType}: ${cases.length} cases`);
        });

        console.log(`\nPerformance Distribution (Duration in ms):`);
        Object.entries(analysis.durationDistribution).forEach(([bucket, count]) => {
            console.log(`  ${bucket}: ${count} tests`);
        });

        console.log(`\nSteps Distribution:`);
        Object.entries(analysis.stepsDistribution).forEach(([bucket, count]) => {
            console.log(`  ${bucket}: ${count} tests`);
        });

        console.log(`\nBacktrack Distribution:`);
        Object.entries(analysis.backtrackDistribution).forEach(([bucket, count]) => {
            console.log(`  ${bucket}: ${count} tests`);
        });
    }

    /**
     * Run comprehensive test suite
     */
    async runComprehensiveTests() {
        console.log("Running comprehensive test suite...\n");

        // Define comprehensive test cases
        const testCases = [
            // Happy path cases
            { x: 3, y: 7, expected: 5, description: "Happy path: 3 mod 7" },
            { x: 8, y: 5, expected: 2, description: "Happy path: 8 mod 5" },
            { x: 7, y: 11, expected: 8, description: "Happy path: 7 mod 11" },
            { x: 6, y: 7, expected: 6, description: "Happy path: 6 mod 7" },

            // Cases requiring backtracking
            { x: 5, y: 12, expected: 5, description: "Backtracking: 5 mod 12" },
            { x: 7, y: 15, expected: 13, description: "Backtracking: 7 mod 15" },
            { x: 11, y: 18, expected: 5, description: "Backtracking: 11 mod 18" },

            // No inverse cases
            { x: 4, y: 6, expected: null, description: "No inverse: gcd=2" },
            { x: 9, y: 15, expected: null, description: "No inverse: gcd=3" },
            { x: 8, y: 12, expected: null, description: "No inverse: gcd=4" },

            // Edge cases
            { x: 1, y: 7, expected: 1, description: "Edge case: x=1" },
            { x: 2, y: 5, expected: 3, description: "Edge case: small numbers" },
            { x: 10, y: 11, expected: 10, description: "Edge case: x=y-1" },

            // Random coprime pairs
            ...this.generateRandomCoprimePairs(20, 100)
        ];

        const results = await this.runTestSuite(testCases);
        const analysis = this.analyzeResults(results);

        this.printAnalysisReport(analysis);

        return { results, analysis };
    }

    /**
     * Performance stress test
     */
    async runStressTest(testCount = 1000, maxValue = 10000) {
        console.log(`\nRunning stress test with ${testCount} cases (max value: ${maxValue})...\n`);

        const testCases = this.generateRandomCoprimePairs(testCount, maxValue);
        const startTime = performance.now();

        const results = await this.runTestSuite(testCases);

        const endTime = performance.now();
        const totalTime = endTime - startTime;

        const analysis = this.analyzeResults(results);

        console.log(`\nStress Test Summary:`);
        console.log(`Total time: ${totalTime.toFixed(2)}ms`);
        console.log(`Average time per test: ${(totalTime / testCount).toFixed(3)}ms`);
        console.log(`Tests per second: ${(testCount / (totalTime / 1000)).toFixed(0)}`);

        this.printAnalysisReport(analysis);

        return { results, analysis, totalTime };
    }

    /**
     * Export results to JSON
     */
    exportResults(filename = 'test-results.json') {
        const fs = require('fs');
        const exportData = {
            metadata: {
                timestamp: new Date().toISOString(),
                algorithm: 'ImprovedBacktracking',
                testFramework: 'v1.0'
            },
            results: this.results
        };

        fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
        console.log(`Results exported to ${filename}`);
    }
}

/**
 * Quick test runner for development
 */
async function quickTest() {
    console.log("Quick Test Run\n");

    const framework = new TestFramework();

    // Run a few key test cases
    const quickTests = [
        { x: 5, y: 12, expected: 5, description: "Key backtracking case" },
        { x: 3, y: 7, expected: 5, description: "Basic functionality" },
        { x: 4, y: 6, expected: null, description: "No inverse case" }
    ];

    const results = await framework.runTestSuite(quickTests);
    const analysis = framework.analyzeResults(results);

    console.log("\nQuick Test Analysis:");
    console.log(`Success rate: ${analysis.successRate.toFixed(1)}%`);
    console.log(`Average time: ${analysis.avgDuration.toFixed(3)}ms`);

    return results;
}

/**
 * Run specific scenario tests
 */
async function runScenarioTests() {
    console.log("Running scenario-based tests...\n");

    try {
        happyPathScenario();
        noInverseScenario();
        earlyZeroScenario();
        edgeCasesScenario();
        largeNumbersScenario();

        console.log("\nAll scenario tests completed successfully!");
    } catch (error) {
        console.error("Error running scenario tests:", error);
    }
}

// Export for use in other modules
module.exports = {
    TestFramework,
    quickTest,
    runScenarioTests
};

// Run tests if this file is executed directly
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.includes('--quick')) {
        quickTest().catch(console.error);
    } else if (args.includes('--scenarios')) {
        runScenarioTests().catch(console.error);
    } else if (args.includes('--comprehensive')) {
        const framework = new TestFramework();
        framework.runComprehensiveTests().catch(console.error);
    } else if (args.includes('--stress')) {
        const framework = new TestFramework();
        const testCount = parseInt(args[1]) || 1000;
        const maxValue = parseInt(args[2]) || 10000;
        framework.runStressTest(testCount, maxValue).catch(console.error);
    } else {
        console.log("Usage:");
        console.log("  node test-framework.js --quick          # Run quick tests");
        console.log("  node test-framework.js --scenarios     # Run scenario tests");
        console.log("  node test-framework.js --comprehensive # Run comprehensive tests");
        console.log("  node test-framework.js --stress [count] [max] # Run stress test");
    }
}