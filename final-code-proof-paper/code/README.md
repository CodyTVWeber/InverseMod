# InverseMod Algorithm - JavaScript Implementation

A comprehensive JavaScript implementation of Cody Weber's novel forward-iterative algorithm for computing modular multiplicative inverses, complete with mathematical analysis, testing frameworks, and alternative approaches.

## Overview

This library implements a novel algorithm for computing modular multiplicative inverses that:

- Uses a **forward-iterative approach** starting from the input value
- Employs a **bounded multiplication constraint** for optimal k-value selection
- Constructs the inverse as a **product of multipliers**
- Includes **backtracking enhancements** for 100% success rate on coprime pairs
- Achieves **O(log y)** average-case complexity

## Installation

```bash
cd code/
npm install
```

## Quick Start

```javascript
const { inverseMod } = require('./src/index');

// Compute 5⁻¹ mod 12
const result = inverseMod(5, 12);
console.log(result.inverse); // 5
console.log(result.success); // true
console.log(result.backtrackCount); // 1 (used backtracking)
```

## Core Algorithm

### Basic Algorithm

The algorithm finds k-values such that:
```
y < (r_i × k_{i+1}) < (r_i + y)
r_{i+1} = (r_i × k_{i+1}) mod y
```

Until `r_n = 1`, then the inverse is `∏ k_i mod y`.

### Enhanced with Backtracking

Includes parity-based backtracking for cases where the basic algorithm fails:

```javascript
const { ImprovedBacktracker } = require('./src/improved-backtracking');

const backtracker = new ImprovedBacktracker({
    maxBacktracks: 20,
    maxDepth: 64,
    debug: false
});

const result = backtracker.computeInverse(5, 12);
```

## API Reference

### Main Functions

#### `inverseMod(x, y, options?)`

Quick inverse computation with optional backtracking.

**Parameters:**
- `x` (number): The number to find inverse for
- `y` (number): The modulus
- `options` (object): Algorithm options

**Returns:** Object with `success`, `inverse`, `steps`, `backtrackCount`, etc.

#### `ImprovedBacktracker`

Advanced backtracker class with configurable options.

### Utility Functions

#### `utils.gcd(a, b)`

Euclidean GCD algorithm.

#### `utils.areCoprime(a, b)`

Check if numbers are coprime.

#### `utils.randomCoprimePair(maxValue?)`

Generate random coprime pair for testing.

## Scenarios and Testing

### Scenario-Based Testing

```bash
# Run all scenario tests
npm run test:scenarios

# Quick functionality test
npm run test:quick

# Comprehensive testing
npm run test

# Stress testing
npm run test:stress 1000 10000
```

### Available Scenarios

1. **Happy Path**: Cases that work with basic algorithm
2. **No Inverse**: Cases where gcd(x, y) > 1
3. **Early Zero**: Cases requiring backtracking
4. **Edge Cases**: Special values (x=1, small numbers)
5. **Large Numbers**: Performance testing
6. **Stress Test**: Random coprime pairs

## Mathematical Analysis

```bash
# Run mathematical analysis
npm run analysis
```

Features:
- **Convergence proofs** for the algorithm
- **Complexity analysis** (O(log y) average case)
- **Success probability** calculations
- **Remainder reduction** analysis
- **Mathematical properties** verification

## Alternative Approaches

```bash
# Demonstrate alternative approaches
npm run alternatives
```

Placeholder implementations for:
- **Constraint Programming**
- **Dynamic Programming**
- **SAT/SMT Solving**
- **A* Search**
- **Monte Carlo Tree Search**
- **Genetic Algorithms**
- **Beam Search**

## Project Structure

```
code/
├── src/
│   ├── index.js                    # Main entry point
│   ├── demo.js                     # Usage examples
│   ├── improved-backtracking.js    # Core algorithm with backtracking
│   ├── scenarios.js                # Scenario-based testing
│   ├── alternative-approaches.js   # Alternative algorithm implementations
│   ├── test-framework.js           # Comprehensive testing framework
│   └── mathematical-analysis.js    # Mathematical proofs and analysis
├── package.json
└── README.md
```

## Examples

### Basic Inverse Computation

```javascript
const { inverseMod } = require('./src');

// Simple case
const result1 = inverseMod(3, 7);  // Returns 5
console.log(`3⁻¹ ≡ ${result1.inverse} mod 7`);

// Case requiring backtracking
const result2 = inverseMod(5, 12); // Returns 5
console.log(`5⁻¹ ≡ ${result2.inverse} mod 12`);

// No inverse exists
const result3 = inverseMod(4, 6);  // Returns { success: false }
console.log(`No inverse: ${result3.message}`);
```

### Custom Algorithm Configuration

```javascript
const { ImprovedBacktracker } = require('./src/improved-backtracking');

const backtracker = new ImprovedBacktracker({
    maxBacktracks: 50,      // Increase backtracking limit
    maxDepth: 100,          // Increase search depth
    multiplierOffsets: [0, 1, 2, 3, 4, 5], // Try more k-values
    debug: true             // Enable debug output
});

const result = backtracker.computeInverse(5, 12);
```

### Mathematical Analysis

```javascript
const { MathematicalAnalysis } = require('./src/mathematical-analysis');

const analysis = new MathematicalAnalysis();

// Prove convergence
analysis.proveConvergence(5, 12);

// Analyze complexity
const complexity = analysis.proveLogarithmicComplexity(100);

// Generate complexity data
const data = analysis.generateComplexityData(1000, 100);
```

## Performance

- **Average Case**: O(log y) steps
- **Best Case**: O(1) for x = y-1
- **Success Rate**: 100% for coprime pairs with backtracking
- **Memory Usage**: O(log y) space complexity

## Mathematical Properties

The algorithm satisfies several key mathematical properties:

1. **Multiplicative Property**: (z × x) ≡ 1 (mod y)
2. **Uniqueness**: Unique inverse modulo y
3. **Bounded Constraint**: y < (r_i × k_{i+1}) < (r_i + y)
4. **Product Construction**: z = ∏ k_i (mod y)

## Research Contributions

This implementation demonstrates:

- **Novel forward-iterative approach** to modular inverse computation
- **Parity-based backtracking** for enhanced success rates
- **Comprehensive mathematical analysis** with complexity proofs
- **Multiple algorithmic approaches** for solving the same problem

## License

MIT License - see LICENSE file for details.

## Citation

If you use this work in your research, please cite:

```
@misc{weber2025inversemod,
  title={A Novel Forward-Iterative Algorithm for Computing Modular Multiplicative Inverses},
  author={Cody Weber},
  year={2025},
  note={JavaScript implementation with mathematical analysis}
}
```