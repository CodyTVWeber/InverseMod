/**
 * Forward Method Library
 * Main entry point exporting all functionality
 * 
 * To God be the glory for all wisdom and knowledge.
 */

// Core algorithm implementations
const { ImprovedBacktracker, inverseModImproved } = require('./improved-backtracking');

// Scenario-based testing
const {
    happyPathScenario,
    noInverseScenario,
    earlyZeroScenario,
    edgeCasesScenario,
    largeNumbersScenario,
    stressTestScenario,
    runAllScenarios
} = require('./scenarios');

// Alternative approaches
const {
    ConstraintProgrammingApproach,
    DynamicProgrammingApproach,
    SATSMTApproach,
    AStarApproach,
    MCTSApproach,
    GeneticAlgorithmApproach,
    BeamSearchApproach,
    compareApproaches,
    demonstrateAlternatives
} = require('./alternative-approaches');

// Testing framework
const { TestFramework, quickTest, runScenarioTests } = require('./test-framework');

// Mathematical analysis
const { MathematicalAnalysis } = require('./mathematical-analysis');

// Utility functions
const utils = {
    /**
     * Calculate GCD using Euclidean algorithm
     */
    gcd: function(a, b) {
        a = BigInt(Math.abs(a));
        b = BigInt(Math.abs(b));
        while (b !== 0n) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    },

    /**
     * Check if numbers are coprime
     */
    areCoprime: function(a, b) {
        return utils.gcd(a, b) === 1n;
    },

    /**
     * Generate random coprime pair
     */
    randomCoprimePair: function(maxValue = 1000) {
        let x, y;
        do {
            x = Math.floor(Math.random() * maxValue) + 2;
            y = Math.floor(Math.random() * maxValue) + 2;
        } while (!utils.areCoprime(x, y));
        return { x, y };
    }
};

// Export everything
module.exports = {
    // Core algorithms
    ImprovedBacktracker,
    inverseModImproved,

    // Scenarios
    happyPathScenario,
    noInverseScenario,
    earlyZeroScenario,
    edgeCasesScenario,
    largeNumbersScenario,
    stressTestScenario,
    runAllScenarios,

    // Alternative approaches
    ConstraintProgrammingApproach,
    DynamicProgrammingApproach,
    SATSMTApproach,
    AStarApproach,
    MCTSApproach,
    GeneticAlgorithmApproach,
    BeamSearchApproach,
    compareApproaches,
    demonstrateAlternatives,

    // Testing
    TestFramework,
    quickTest,
    runScenarioTests,

    // Mathematical analysis
    MathematicalAnalysis,

    // Utilities
    utils
};

// Convenience function for quick inverse computation
const inverseMod = (x, y, options = {}) => {
    const backtracker = new ImprovedBacktracker(options);
    return backtracker.computeInverse(x, y);
};

// Also export as default
module.exports.inverseMod = inverseMod;
module.exports.default = module.exports;