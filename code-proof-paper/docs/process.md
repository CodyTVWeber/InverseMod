Process: From Draft to Publication

## Phase A: Authoring
- Create an initial outline and target theorem statements.
- Draft sections in `paper/sections/` and link to code artifacts.
- Add invariants and tests incrementally; keep a running `docs/ARTIFACTS.md`.

## Phase B: Internal Review
- Share PDF and repo with trusted peers.
- Use `docs/review_checklists.md` for feedback.
- Address clarity, correctness, and reproducibility issues.

## Phase C: External Peer Review
- Choose venue (journal/conference) and format per `docs/venues.md`.
- Prepare artifact package: source, `requirements.txt`, `Makefile`, `docs/ARTIFACTS.md`.
- Ensure anonymization if double-blind.

## Phase D: Submission & Revision
- Submit PDF and supplementary artifacts per venue guidelines.
- Track reviewer comments and revisions.
- Archive camera-ready version and tag a release in VCS.

## Phase E: Publication & Post-Publication
- Deposit artifacts in an archival repository (Zenodo/OSF) with a DOI.
- Publish `CITATION.cff` and badge.
- Write a short companion blog/README.

## Roles and Tools
- Typesetting: LaTeX with BibTeX, `paper/Makefile`.
- Testing: unit/property tests (pytest or similar).
- Packaging: top-level `Makefile`, scripts in `scripts/`.

# Process: From Draft to Publication

## Phase A: Authoring
- Create an initial outline and target theorem statements.
- Draft sections in `paper/sections/` and link to code artifacts.
- Add invariants and tests incrementally; keep a running `ARTIFACTS.md`.

## Phase B: Internal Review
- Share PDF and repo with trusted peers.
- Use `docs/review_checklists.md` for feedback.
- Address clarity, correctness, and reproducibility issues.

## Phase C: External Peer Review
- Choose venue (journal/conference) and format per `docs/venues.md`.
- Prepare artifact package: source, binaries, `requirements`, `Makefile`, `ARTIFACTS.md`.
- Ensure anonymization if double-blind.

## Phase D: Submission & Revision
- Submit PDF and supplementary artifacts per venue guidelines.
- Track reviewer comments and revisions.
- Archive camera-ready version and tag release in VCS.

## Phase E: Publication & Post-Publication
- Deposit artifacts in an archival repository (Zenodo/OSF) with DOI.
- Publish `CITATION.cff` and badge.
- Write a short companion blog/README.

## Roles and Tools
- Typesetting: LaTeX with BibTeX.
- Testing: property-based and unit tests (pytest or similar).
- Packaging: `make`, scripts in `scripts/`.

