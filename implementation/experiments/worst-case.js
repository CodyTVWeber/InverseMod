#!/usr/bin/env node

const {
  primesJustAbove,
  greedyMultiplyStepsPrimeNumber,
  euclidStepsNumber,
  writeCsv,
  outPath
} = require("./lib");

const K_MIN = Number(process.env.WORST_K_MIN || 10);
const K_MAX = Number(process.env.WORST_K_MAX || 22);

function runOne(k) {
  const y = Number(primesJustAbove(2n ** BigInt(k)));
  const t0 = Date.now();
  let worst = 0;
  let worstX = 1;
  let sum = 0;
  let n = 0;
  let euclidWorst = 0;
  for (let x = 1; x < y; x++) {
    const s = greedyMultiplyStepsPrimeNumber(x, y, true);
    sum += s;
    n += 1;
    if (s > worst) {
      worst = s;
      worstX = x;
    }
    const e = euclidStepsNumber(x, y);
    if (e > euclidWorst) euclidWorst = e;
  }
  const mean = sum / n;
  const log2y = Math.log2(y);
  const elapsedMs = Date.now() - t0;
  process.stderr.write(
    `k=${k} y=${y} mean=${mean.toFixed(2)} worst=${worst} worst_x=${worstX} euclid_worst=${euclidWorst} ${elapsedMs}ms\n`
  );
  return {
    k,
    y,
    mean: mean.toFixed(4),
    worst,
    worst_x: worstX,
    worst_over_log2y: (worst / log2y).toFixed(4),
    euclid_worst: euclidWorst,
    elapsed_ms: elapsedMs
  };
}

function run() {
  const rows = [];
  for (let k = K_MIN; k <= K_MAX; k++) {
    rows.push(runOne(k));
  }
  const csvPath = outPath("worst-case.csv");
  writeCsv(
    csvPath,
    ["k", "y", "mean", "worst", "worst_x", "worst_over_log2y", "euclid_worst"],
    rows
  );
  process.stderr.write(`wrote ${csvPath}\n`);
}

run();
