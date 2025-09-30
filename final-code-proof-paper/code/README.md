# Modular Inverse Algorithm Implementation

This directory contains the **production-ready implementation** of Cody Weber's modular multiplicative inverse algorithm. The implementation provides robust, well-tested code for finding modular inverses with comprehensive error handling, performance analysis, and mathematical validation.

## Algorithm Overview

The algorithm finds the modular multiplicative inverse z such that (z * x) mod y = 1, where x and y are coprime positive integers. Key features include:

- **Heuristic Search**: Iterative k-multiplier approach with bounded backtracking
- **GCD Validation**: Pre-checks ensure inverse existence before computation
- **Fallback Mechanism**: Extended Euclidean algorithm fallback for edge cases
- **Performance Analysis**: Complexity analysis and benchmarking utilities
- **Property Testing**: Mathematical property validation framework

## Implementation Details

### Core Components

- **`src/modular-inverse.ts`** - Main algorithm implementation with:
  - `computeModularInverse()` - Primary API function
  - `findInverseWithHeuristic()` - Heuristic search with backtracking
  - `analyzePerformance()` - Performance and complexity analysis
  - `analyzeComplexity()` - Detailed complexity pattern analysis

- **`src/proof/spec.ts`** - Property-based testing framework
- **`src/proof/properties.ts`** - Mathematical property definitions and generators

### Test Coverage

- **`tests/test-modular-inverse.test.ts`** - Core algorithm tests
- **`tests/test-properties.test.ts`** - Property-based testing validation

### Key Features

- **Robust Error Handling**: Comprehensive input validation and error reporting
- **Multiple Methods**: Heuristic search with extended GCD fallback
- **Performance Monitoring**: Execution time tracking and complexity analysis
- **Edge Case Handling**: Special cases like x=1, negative numbers, large moduli

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build TypeScript
npm run build
```

## Key Differences from Notebook

**Notebook (Paper/Explanation):**
- Educational code snippets
- Step-by-step algorithm walkthroughs
- Interactive demonstrations
- Error cases and edge conditions
- Pedagogical explanations

**Code (Implementation):**
- Production-ready algorithms
- Comprehensive test coverage
- Performance optimizations
- Error handling and validation
- Reusable modules and APIs

## Integration

The notebook in `../notebooks/paper-outline.ipynb` demonstrates concepts using code from this directory. The two work together:

1. **Notebook** shows "how and why" with examples
2. **Code** provides the actual implementation
3. Tests ensure correctness across both

## Adding New Algorithms

1. Implement in `src/` with TypeScript
2. Add comprehensive tests in `tests/`
3. Document in the implementation
4. Demonstrate usage in the notebook

This separation allows for both educational value (notebook) and production quality (code).
