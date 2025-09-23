# InverseMod Algorithm Review

## Summary
- The original Go/JS implementations capture the intended iterative k, r process and succeed on many inputs.
- The algorithm is not complete: it can fail on coprime pairs (e.g., 5 mod 12) due to k choices that produce a remainder dividing y.
- The fixed JS version adds helpful GCD pre-check and termination rules but regresses on x=1 due to initial k calculation; this is corrected in this branch.
- One test expectation (31 mod 37) was incorrect; corrected to 6.

## Key Findings
- k-selection as implemented effectively uses k = ceil(y/a) at each step (with a = current remainder). When y % a == 0 was allowed to use k = y/a, it violated y < a·k and produced r = 0 for x = 1.
- Strictly enforcing y < a·k < a + y is overly restrictive and can make Step 1 impossible (e.g., x = 1), and can risk non-termination.
- A small tweak/backtrack strategy recovers many failing coprime cases without abandoning the core idea.

## Corrections in this branch
- inverseModFixed.js: initial k now always floor(y/currentX) + 1 (ceil), avoiding r = 0 for divisible cases such as x = 1.
- testFixed.js: corrected expected inverse for 31 mod 37 from 27 to 6.
- ALGORITHM_ANALYSIS.md: clarified that 100% success on coprime pairs was for a restricted set; added guidance on tweak/backtracking; reframed novelty as a Euclidean-style presentation.

## Recommendations
- Replace strict upper-bound enforcement with a heuristic search on k: start at ceil(y/a), increment by small offsets when r == 0 or r ≥ a; if needed, backtrack one level.
- Keep GCD pre-check and termination safeguards; optionally fall back to extended Euclid to guarantee completeness.
- In the paper, present the method as a co-remainder, multiplicative-accumulation variant of Euclid; analyze when it succeeds/fails and relate tweaks to continued fractions.

## Next Steps
- Implement the tweak/backtrack search in both JS and Go versions with a small offset window and depth cap.
- Add tests covering 5 mod 12 and additional coprime pairs that currently fail.
- Provide a hybrid mode with extended Euclid fallback for guaranteed results.