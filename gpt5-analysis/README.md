# GPT-5 Analysis

## Complexity Analysis
- We provide an empirical analysis script that measures the number of iteration steps as a function of y.
- Run:
```bash
node gpt5-analysis/scripts/complexityAnalysis.gpt5.js 200    # scan y up to 200, full coprime x
node gpt5-analysis/scripts/complexityAnalysis.gpt5.js 200 5  # sample 5 x-values per y
```
Outputs CSV under `gpt5-analysis/out/` and prints a summary with a regression against log2(y).

## Tests
Run the GPT-5 test harness:
```bash
node gpt5-analysis/code/testFixed.gpt5.js
```