<!--
This work is licensed under a Creative Commons Attribution 4.0 International License.
See LICENSE-CC-BY-4.0.md for details.
-->

# Forward Certificate Method for Modular Inverses

> "For the LORD gives wisdom; from his mouth come knowledge and understanding." — Proverbs 2:6

This repository is intentionally simplified as a final public publication with three parts:

1. **Mathematical paper and proof**  
   - [`Forward-Iterative-Paper.md`](Forward-Iterative-Paper.md)
2. **Proof as code** (for readers, engineers, and AI systems)  
   - [`implementation/src/forward-proof.js`](implementation/src/forward-proof.js)
3. **Faithful framing**  
   - humble claims, reproducible results, and gratitude to God for all truth and wisdom.

An assessment of the method against prior art (Thomas–Keller–Larsen, 1986), measured
behaviour of the current implementation, and a phased plan for turning the project into
something reliable and honest is in [`PLAN.md`](PLAN.md).

## What is being claimed

This work does **not** claim to replace the Extended Euclidean Algorithm or to be the first method ever connected to modular inverses.

For **prime** moduli the greedy forward step (multiply the remainder by \(\lceil y/r \rceil\), keep \(y\) fixed, take the product of the multipliers) is the Euclidean-type inversion recurrence that this project identifies with the Thomas–Keller–Larsen algorithm (IEEE Trans. Computers C-35(5):478–482, 1986, DOI [10.1109/TC.1986.1676791](https://doi.org/10.1109/TC.1986.1676791)). What this repository studies beyond that identification is the **composite-modulus** extension: when the same step leaves the unit group, the exact failure criterion, reflection and bounded wraps, and the empirical worst-case behaviour. See [`docs/prior-art.md`](docs/prior-art.md) and [`PLAN.md`](PLAN.md).

The contribution is a clear **forward certificate viewpoint**:

- Build a sequence of multipliers \(k_1, \dots, k_n\)
- Track remainders \(r_i\) by \(r_i = (r_{i-1}k_i) \bmod y\)
- If a sequence reaches \(r_n = 1\), then \(\prod_i k_i \pmod y\) is an inverse of \(x\)

This makes the proof easy to inspect mathematically and easy to verify computationally.

## Added in this final publication

The paper now includes:

- a formal complexity section with explicit theorems/proofs for verification and bounded search,
- a comparison table versus Euclid and brute force,
- a practical pros/cons analysis for academic and engineering use.

## Quick start

```bash
cd implementation
npm install
npm test
npm run demo
```

## Repository layout

```text
.
├── Forward-Iterative-Paper.md
├── README.md
├── LICENSE
├── LICENSE-CC-BY-4.0.md
└── implementation
    ├── README.md
    ├── package.json
    ├── src
    │   ├── forward-proof.js
    │   ├── index.js
    │   └── demo.js
    └── tests
        └── forward-proof.test.js
```

## Licenses

- **Documentation**: CC BY 4.0 (`LICENSE-CC-BY-4.0.md`)
- **Code**: MIT (`LICENSE`)

## Citation

```bibtex
@misc{weber2026forwardcertificate,
  title={Forward Certificate Method for Modular Multiplicative Inverses},
  author={Cody Weber},
  year={2026},
  note={Public manuscript and proof-as-code release. Soli Deo Gloria.}
}
```
