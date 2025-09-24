# Code Implementation

This directory contains the **production-ready implementation** of the mathematical algorithms and proofs. Unlike the Jupyter notebook which focuses on explanation and demonstration, this is the **actual working code** with proper testing, error handling, and performance optimizations.

## Structure

- **`src/`** - Source code for algorithms and mathematical implementations
  - `proof/` - Core proof implementations and mathematical utilities
- **`tests/`** - Comprehensive test suites using Vitest
- **`package.json`** - Node.js dependencies and scripts
- **`tsconfig.json`** - TypeScript configuration

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
