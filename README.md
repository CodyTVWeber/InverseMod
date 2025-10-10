<!--
This work is licensed under a Creative Commons Attribution 4.0 International License.
See LICENSE-CC-BY-4.0.md for details.
-->

# The Forward Iterative Method for Modular Multiplicative Inverses 

> (*Soli Deo Gloria*) "For the LORD gives wisdom; from his mouth come knowledge and understanding." — Proverbs 2:6 

## About

This repository contains a forward iterative method for computing modular multiplicative inverses, developed in 2022. The method provides a forward-iterative approach to finding modular multiplicative inverses using bounded multiplication constraints and remainder tracking.

## Research Paper

The formal research paper is available at [`Forward-Iterative-Paper.md`](Forward-Iterative-Paper.md) and includes:

- Complete mathematical foundation and algorithm definition
- Empirical complexity analysis and performance metrics
- Enhanced implementations with backtracking
- Comprehensive testing framework documentation
- Proposed improvements and future research directions

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
├── Forward-Iterative-Paper.md    # Formal research paper
├── README.md                     # This file
├── LICENSE                       # MIT License
│
├── implementation/               # Primary AI implementation (TypeScript/JavaScript)
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
├── originalImplementation/       # Original Go implementation developed by Cody Weber
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

### TypeScript/JavaScript AI Implementation (Recommended)

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

### AI Complexity Analysis

The implementation includes tools for empirical complexity analysis:

```bash
cd implementation
npm run analysis         # Mathematical complexity analysis
```

**AI Empirical Observations:**
- Average-case behavior appears consistent with **O(log y)** iterations
- Step counts correlate strongly with log₂(y)
- Success rate >95% on random coprime pairs with backtracking
- Reflection preconditioning improves convergence for large remainders

*Note: These are empirical observations; formal complexity proofs remain open research.*

## AI Verification

The method has been independently analyzed by multiple AI systems:

- **Claude Analysis** (`ai-analysis/claude/`) - Verification and complexity studies
- **GPT-5 Analysis** (`ai-analysis/gpt5/`) - Alternative implementation approaches  
- **Supernova Analysis** (`ai-analysis/supernova/`) - Additional verification

Findings from AI analysis:
- Forward-iterative approach seems to be novel
- Bounded multiplication constraint is effective
- Backtracking with parity awareness improves success rates
- Empirical evidence supports logarithmic average-case behavior

## License

This project uses a dual licensing structure:

### Documentation & Written Content (Markdown Files)
All documentation, markdown files, and written content (including the research paper, README files, and analysis documents) are licensed under:

**Creative Commons Attribution 4.0 International (CC BY 4.0)**
- See [LICENSE-CC-BY-4.0.md](LICENSE-CC-BY-4.0.md) for full text
- You are free to share and adapt with proper attribution

### Source Code
All source code (including implementations in TypeScript, JavaScript, Go, and related code files) is licensed under:

**MIT License**
- See [LICENSE](LICENSE) file for full text
- Free to use, modify, and distribute

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

## Author
**Cody Weber**
