<!--
This work is licensed under a Creative Commons Attribution 4.0 International License.
See LICENSE-CC-BY-4.0.md for details.
-->

# Forward Iterative Modular Inverse

> "For the LORD gives wisdom; from his mouth come knowledge and understanding." — Proverbs 2:6

A small, honest study of a modular inverse that keeps the modulus
fixed: multiply the remainder \(r\) by \(k = \lceil y/r\rceil\), take the product
of the \(k\)'s. That recurrence is the classical **Engel expansion** of the
rational \(x/y\) (F. Engel, 1913). This repository studies the composite-modulus
extension, reflection, measured worst-case behaviour, and a BigInt
implementation with a step-by-step trace. Whether Thomas–Keller–Larsen 1986
(DOI [10.1109/TC.1986.1676791](https://doi.org/10.1109/TC.1986.1676791)) also
uses the same step is unconfirmed (paywalled).

1. **Note** — [`Forward-Iterative-Paper.md`](Forward-Iterative-Paper.md)
2. **Code** — [`implementation/`](implementation/)
3. **Measurements** — [`implementation/experiments/out/`](implementation/experiments/out/)
4. **Prior-art log** — [`docs/prior-art.md`](docs/prior-art.md)
5. **Teaching visualizer** — [`docs/visualizer.html`](docs/visualizer.html) (open in a browser; no build step)
6. **Assessment / plan** — [`PLAN.md`](PLAN.md)

## Origin and honesty note

The method began as Cody Weber's own exploration; he was curious whether it was novel.

The answer, stated plainly: the core step is the Engel expansion of \(x/y\), known since 1913; the certificate theorem is elementary; it is not faster than Extended Euclid; whether the 1986 Thomas–Keller–Larsen paper also uses it could not be confirmed.

AI systems (Cursor cloud agents) took the exploration further than the original work — identified the prior art, derived the exact composite-modulus failure criterion, measured behaviour, and built the tested implementation and experiments.

What remains open is the worst-case length question, which is the known Erdős–Shallit problem on Engel length (with an optional reflection, and here restricted to prime denominators). What remains useful is the trace for teaching and the clean implementation.

Offered with thanks to God for all wisdom and truth. *Soli Deo Gloria.*

## What is being claimed

- **Correctness.** If a multiplier list takes the remainder to 1, its product modulo \(y\) is an inverse (elementary). Reflection is multiplication by \(y-1\).
- **Composite moduli.** A greedy step stays invertible iff \(\gcd(k, y) = 1\) iff \(\gcd(r', y) = 1\). Prime \(y\) never fails. Even \(y\) almost always fails for \(M = 1\); odd composites succeed on a slowly decaying fraction (about 43% at \(y < 10^4\), 34% at \(y < 10^9\); see `success-rate.csv`).
- **Performance.** Not faster than Extended Euclid. The implementation is \(O(\log y)\) per call with Euclid fallback and never silently wrong.
- **Worst case (open).** On primes just above \(2^k\), \(k = 10\ldots 22\), greedy+reflection's worst multiply-step count over \(\log_2 y\) rises from 1.10 to 1.77 (`worst-case.csv`). This is the Erdős–Shallit Engel-length question (a known open problem), with reflection. No proof that \(W(y)\) is \(\Theta(\log y)\) or \(\omega(\log y)\).
- **Not claimed:** cryptographic relevance, speed advantage, or novelty of the core step.

Numbers in the paper and in this README come from `implementation/experiments/out/*.csv` or from cited references.

## Quick start

```bash
cd implementation
npm install
npm test
npm run demo
node src/cli.js 11 26 --max-wrap 4
npm run experiments
```

`npm run experiments` regenerates the CSVs (about two minutes: 20,000 pairs per success-rate cell; exhaustive worst-case for \(k = 10\ldots 22\)). Override with `SUCCESS_SAMPLES`, `WORST_K_MIN`, `WORST_K_MAX`.

## Repository layout

```text
.
├── Forward-Iterative-Paper.md
├── PLAN.md
├── README.md
├── docs/prior-art.md
├── docs/visualizer.html
├── LICENSE
├── LICENSE-CC-BY-4.0.md
└── implementation
    ├── README.md
    ├── package.json
    ├── src
    │   ├── forward-chain.js
    │   ├── index.js
    │   ├── demo.js
    │   └── cli.js
    ├── tests/forward-chain.test.js
    └── experiments
        ├── lib.js
        ├── success-rate.js
        ├── worst-case.js
        ├── worst-case-structure.js
        ├── worst-case-families.js
        ├── NOTES.md
        └── out/*.csv
```

## Licenses

- **Documentation**: CC BY 4.0 (`LICENSE-CC-BY-4.0.md`)
- **Code**: MIT (`LICENSE`)

## Citation

```bibtex
@misc{weber2026engel-inverse,
  title={The Engel Expansion as a Modular Inverse:
         Composite Moduli, Reflection, and Empirical Worst-Case Behaviour},
  author={Cody Weber},
  year={2026},
  note={Public manuscript and implementation. Soli Deo Gloria.}
}
```
