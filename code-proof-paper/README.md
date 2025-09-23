Code-Backed Mathematical Proof Project

This repository scaffolds a formal paper that uses code as the primary vehicle for a proof, alongside a traditional exposition. It includes a LaTeX paper template, a code-proof scaffold with tests, reproducibility scripts, and peer-review/submission materials.

## Goals
- Present a rigorous argument where the core proof artifacts are executable and testable.
- Maintain standard mathematical structure and terminology for academic audiences.
- Provide full reproducibility and archiving for peer review and publication.

## Repository Layout
- `paper/`: LaTeX source for the paper
  - `sections/`: modular sections
  - `figures/`: figures and diagrams
- `code/`: proof artifacts (source and tests)
- `notebooks/`: exploratory analysis or didactic demos
- `scripts/`: build and reproducibility scripts
- `docs/`: outline, process, venue selection, checklists

## Quick Start
1. Bootstrap environment: `bash scripts/setup_environment.sh`
2. Build the paper PDF: `bash scripts/build_paper.sh`
3. Run tests for proof code: `bash scripts/test.sh`

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

## Code-Backed Proof Guidelines
- Define a clear specification (preconditions, postconditions, invariants) in `code/`.
- Encode logical obligations as executable checks or property tests.
- Separate the proof kernel (minimal trusted core) from convenience layers.
- Provide counterexample generators where appropriate.
- Link paper claims to exact code artifacts and tests.

## Reproducibility & Archival
- Pin dependencies (see `requirements.txt`).
- Provide one-command builds for paper and tests (`scripts/` and `Makefile`).
- Record environment info (OS, versions) in the appendix and `docs/environment.txt`.
- Maintain `docs/ARTIFACTS.md` mapping claims to files/tests/commands.

## Contributing & Review
- Use pull requests for feedback; see `docs/review_checklists.md`.
- For external peer review, share the compiled PDF and the artifact archive.

## License & Citation
- Choose a license in `LICENSE` (code) and, optionally, a docs license.
- Provide a `CITATION.cff` for academic citation.

# Code-Backed Mathematical Proof Project

This repository scaffolds a formal paper that uses code as the primary vehicle for a proof, alongside a traditional exposition. It includes a LaTeX paper template, code-proof scaffold with tests, reproducibility scripts, and peer-review/submission materials.

## Goals
- Present a rigorous argument where the core proof artifacts are executable and testable.
- Maintain standard mathematical structure and terminology for academic audiences.
- Provide full reproducibility and archiving for peer review and publication.

## Repository Layout
- `paper/`: LaTeX source for the paper
  - `sections/`: modular sections
  - `figures/`: figures and diagrams
- `code/`: proof artifacts (source and tests)
- `notebooks/`: exploratory analysis or didactic demos
- `scripts/`: build and reproducibility scripts
- `docs/`: process docs (outline, venues, checklist, review templates)

## Quick Start
1. Install dependencies (see `scripts/setup_environment.sh`).
2. Build the paper: `make -C paper` or `scripts/build_paper.sh`.
3. Run tests for proof code: `scripts/test.sh`.

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

## Code-Backed Proof Guidelines
- Define a clear specification (preconditions, postconditions, invariants) in `code/`.
- Encode the core logical steps as executable checks or property tests.
- Separate proof kernel (minimal trusted core) from convenience layers.
- Provide small counterexample generators where appropriate.
- Document links between paper statements and code artifacts.

## Reproducibility & Archival
- Pin dependencies (requirements/lock files).
- Provide one-command builds for paper and tests.
- Record environment info (OS, versions) in the PDF appendix.
- Generate an `ARTIFACTS.md` mapping claims to files and tests.

## Contributing & Review
- Use pull requests for feedback; include checklists in `docs/review_checklists.md`.
- For external peer review, share a compiled PDF and the `artifact` archive.

## License & Citation
- Choose a license in `LICENSE`.
- Provide a `CITATION.cff` for academic citation.

