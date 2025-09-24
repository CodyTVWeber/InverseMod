Jupyter-Based Mathematical Proof Project

This repository scaffolds a formal mathematical paper using **Jupyter notebooks with JavaScript/TypeScript code** as the primary vehicle for proofs. Instead of traditional mathematical notation, proofs are demonstrated through executable code that shows different scenarios and validates claims.

## Goals
- Present rigorous mathematical arguments through **executable JavaScript code**
- Use Jupyter notebooks as the primary paper format (no LaTeX required)
- Demonstrate proofs via **runnable scenarios** rather than static math notation
- Maintain academic structure while making proofs interactive and testable
- Provide full reproducibility through executable code

## Repository Layout

### **📄 Paper Section** (Educational & Explanatory)
- `notebooks/`: **Jupyter notebook paper** with code demonstrations
  - `paper-outline.ipynb`: Main paper with algorithm walkthroughs, examples, and issues
  - `lab/`: Browser-based JupyterLite setup

### **⚙️ Code Section** (Production Implementation)
- `code/`: **Node.js project** with real algorithm implementation
  - `src/`: Production-ready TypeScript algorithms
  - `tests/`: Comprehensive test suites
  - `package.json`: Dependencies and build scripts

### **📚 Supporting Files**
- `scripts/`: Setup and testing scripts
- `docs/`: Documentation, checklists, and process guides

## Requirements
- Node.js 20+ (or 22+) with npm
- Deno (for Jupyter kernel)
- Modern web browser (for JupyterLite fallback)

## Quick Start

### **Option 1: Full Development Setup**
1. **Install dependencies**: `bash scripts/setup_node.sh`
2. **Set up Jupyter**: `pip3 install --user jupyter jupyterlab && deno jupyter --unstable --install`
3. **Start Jupyter Lab**: `export PATH="$HOME/Library/Python/3.9/bin:$PATH" && jupyter lab`
4. **Open the paper**: `notebooks/paper-outline.ipynb` (select Deno kernel)
5. **Test the code**: `bash scripts/test.sh` (runs tests in `code/` directory)

### **Option 2: Code-Only Development**
1. **Go to code directory**: `cd code`
2. **Install dependencies**: `npm install`
3. **Run tests**: `npm test`
4. **Develop algorithms** in `src/` and tests in `tests/`

### **Option 3: Browser-Only (No Python)**
1. Open `notebooks/lab/index.html` in your browser
2. Click "Launch JupyterLite" for browser-based editing

## Paper Structure (Suggested)
1. Abstract
2. Introduction and Motivation
3. Related Work and Context
4. Preliminaries and Definitions
5. Statement of Theorem(s) and Contributions
6. Code-Backed Proof Strategy
7. Formal Proof Sketch (traditional math)
8. Implementation Details and Invariants
9. Validation: Tests, Property Checks, and Edge Cases
10. Limitations and Scope
11. Discussion and Future Work
12. Conclusion
13. References
14. Appendix (Artifacts, Pseudocode, Extended Proofs)

## JavaScript-Based Proof Guidelines
- Define mathematical claims as **executable JavaScript functions** in `code/`
- Use **property testing** to validate claims across different scenarios
- Create **interactive demonstrations** that readers can modify and rerun
- Focus on **computational proofs** rather than symbolic mathematics
- Link notebook sections to specific code implementations and tests

## Reproducibility & Archival
- Pin JavaScript dependencies in `package-lock.json`
- Provide executable notebooks that run in any modern browser
- Record environment info (Node.js, Deno, browser) in `docs/environment.txt`
- Maintain `docs/ARTIFACTS.md` mapping notebook sections to code implementations

## Contributing & Review
- Use pull requests for feedback; see `docs/review_checklists.md`.
- For external peer review, share the Jupyter notebook and executable code artifacts.

## License & Citation
- Choose a license in `LICENSE` (code) and, optionally, a docs license.
- Provide a `CITATION.cff` for academic citation.

