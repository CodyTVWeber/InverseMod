# The Forward Iterative Method for Modular Multiplicative Inverses

> *"The fear of the Lord is the beginning of knowledge: but fools despise wisdom and instruction."*  
> — Proverbs 1:7 (KJV)

## Dedication

We humbly present this work with the sole purpose of giving glory to God, from whom all wisdom, knowledge, and understanding flow. This research is offered not as a monument to human achievement, but as a humble acknowledgment that every discovery in mathematics and science ultimately points back to the Creator who ordained the very principles we seek to understand.

The motivation for developing this method is to honor God through the pursuit of wisdom and the careful study of His creation. We recognize that any insight gained or contribution made comes not from our own merit, but by God's grace.

*Soli Deo Gloria* — To God alone be the glory

## Author
**Cody Weber**

## About

This repository contains a forward iterative method for computing modular multiplicative inverses, developed in 2022. The method provides a forward-iterative approach to finding modular multiplicative inverses using bounded multiplication constraints and remainder tracking.

A formal research paper documenting this method is available at the root of this repository: [`inverseMod-paper.md`](inverseMod-paper.md)

## Method Overview

The forward method finds the modular multiplicative inverse $z$ such that $(z \times x) \equiv 1 \pmod{y}$, where $x$ and $y$ are coprime positive integers.

### Core Approach

The method uses a forward-iterative approach with bounded multiplication:

1. **Initialization**: Start with $r_0 = x \bmod y$
2. **Iteration**: For each step $i$:
   - Choose multiplier $k_{i+1}$ such that $y < (r_i \times k_{i+1}) < (r_i + y)$
   - Compute next remainder: $r_{i+1} = (r_i \times k_{i+1}) \bmod y$
3. **Termination**: Continue until $r_n = 1$
4. **Result**: $z = \prod_{i=1}^n k_i \pmod{y}$

### Key Features

- **Forward-iterative construction** starting from the input value
- **Bounded multiplication constraint** for optimal k-value selection
- **Backtracking support** with parity-aware heuristics
- **Empirical O(log y)** average-case behavior
- **Reflection preconditioning** for improved convergence

## Repository Structure

```
├── inverseMod-paper.md          # Formal research paper
├── README.md                     # This file
├── LICENSE                       # MIT License
│
├── implementation/               # Primary implementation (TypeScript/JavaScript)
│   ├── src/
│   │   ├── inverse-mod.ts       # Core TypeScript implementation
│   │   ├── inverse-mod.test.ts  # Comprehensive test suite
│   │   ├── improved-backtracking.js  # Backtracking implementation
│   │   ├── demo.js              # Usage demonstrations
│   │   ├── test-framework.js    # Testing framework
│   │   ├── scenarios.js         # Scenario-based tests
│   │   └── mathematical-analysis.js  # Complexity analysis
│   ├── package.json
│   └── README.md                # Implementation documentation
│
├── originalImplementation/       # Original Go implementation
│   └── go/
│       ├── InverseMod.go        # Go HTTP server
│       └── server.bin           # Compiled binary
│
└── ai-analysis/                  # Independent AI analysis
    ├── claude/                   # Analysis and verification
    ├── gpt5/                     # Additional analysis
    └── supernova/                # Further verification
```

## Quick Start

### TypeScript/JavaScript Implementation (Recommended)

```bash
cd implementation
npm install
npm run demo              # Run demonstration
npm run test              # Run comprehensive tests
npm run test:quick        # Quick functionality test
npm run test:scenarios    # Scenario-based tests
```

### Example Usage

```javascript
import { inverseMod } from './src/inverse-mod';

// Compute 5⁻¹ mod 12
const result = inverseMod(5, 12);
console.log(result.inverse);  // 5
console.log(result.success);  // true

// Verify: (5 × 5) mod 12 = 1 ✓
```

### Original Go Implementation

The Go implementation provides HTTP endpoints:

```bash
cd originalImplementation/go
go run InverseMod.go
```

Endpoints:
- `/inverse-mod?x=<int>&y=<int>` - Detailed steps
- `/inverse-mod-z?x=<int>&y=<int>` - Result only
- `/inverse-mod-explanation` - Algorithm explanation

## Testing & Analysis

### Run Tests

```bash
cd implementation

# Core test suite (27 tests)
npx vitest run

# Comprehensive framework tests
npm run test

# Individual test categories
npm run test:quick       # Quick validation
npm run test:scenarios   # Scenario-based tests
npm run steps -- 17 23   # Step-by-step trace
```

### Complexity Analysis

The implementation includes tools for empirical complexity analysis:

```bash
cd implementation
npm run analysis         # Mathematical complexity analysis
```

**Empirical Observations:**
- Average-case behavior appears consistent with **O(log y)** iterations
- Step counts correlate strongly with log₂(y)
- Success rate >95% on random coprime pairs with backtracking
- Reflection preconditioning improves convergence for large remainders

*Note: These are empirical observations; formal complexity proofs remain open research.*

## Independent Verification

The method has been independently analyzed by multiple AI systems:

- **Claude Analysis** (`ai-analysis/claude/`) - Verification and complexity studies
- **GPT-5 Analysis** (`ai-analysis/gpt5/`) - Alternative implementation approaches  
- **Supernova Analysis** (`ai-analysis/supernova/`) - Additional verification

Key findings from independent analysis:
- Forward-iterative approach confirmed as novel
- Bounded multiplication constraint is effective
- Backtracking with parity awareness significantly improves success rates
- Empirical evidence supports logarithmic average-case behavior

## Research Paper

The formal research paper is available at [`inverseMod-paper.md`](inverseMod-paper.md) and includes:

- Complete mathematical foundation and algorithm definition
- Empirical complexity analysis and performance metrics
- Enhanced implementations with backtracking
- Comprehensive testing framework documentation
- Proposed improvements and future research directions

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Citation

If you use this work in your research, please cite:

```bibtex
@misc{weber2025forwardmethod,
  title={The Forward Iterative Method for Modular Multiplicative Inverses},
  author={Cody Weber},
  year={2025},
  note={To the glory of God. Soli Deo Gloria}
}
```

---

*All glory to God, from whom all wisdom and knowledge flow.*