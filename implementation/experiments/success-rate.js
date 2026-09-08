#!/usr/bin/env node

const {
  isPrime,
  gcd,
  gcdNumber,
  mulberry32,
  randomInt,
  randomBits,
  greedySteps,
  greedyWrapNumber,
  euclidSteps,
  euclidStepsNumber,
  writeCsv,
  outPath
} = require("./lib");

const SAMPLE_N = Number(process.env.SUCCESS_SAMPLES || 20000);
const SEED = Number(process.env.SUCCESS_SEED || 20260908);
const M_VALUES = [1, 2, 4, 8, 16, 32];
const CLASSES = ["prime", "even", "odd-composite", "mixed"];

const DECADES = [3, 4, 5, 6, 7, 8, 9].map((e) => ({
  label: `y<1e${e}`,
  max: 10 ** e,
  bits: null
}));

const BIT_RANGES = [64, 128].map((bits) => ({
  label: `${bits}-bit`,
  max: null,
  bits
}));

function classOfNumber(y) {
  if (y % 2 === 0) return "even";
  if (isPrime(y)) return "prime";
  return "odd-composite";
}

function classOfBig(y) {
  if ((y & 1n) === 0n) return "even";
  if (isPrime(y)) return "prime";
  return "odd-composite";
}

function sampleCoprimeNumber(rng, max, cls) {
  for (;;) {
    const y = randomInt(rng, 3, max);
    const x = randomInt(rng, 1, y);
    if (gcdNumber(x, y) !== 1) continue;
    if (cls !== "mixed" && classOfNumber(y) !== cls) continue;
    return { x, y };
  }
}

function sampleCoprimeBits(rng, bits, cls) {
  for (;;) {
    let y = randomBits(rng, bits);
    if (y < 3n) continue;
    let x = randomBits(rng, bits) % y;
    if (x === 0n) continue;
    if (gcd(x, y) !== 1n) continue;
    if (cls !== "mixed" && classOfBig(y) !== cls) continue;
    return { x, y };
  }
}

function runNumberPair(x, y, M) {
  const g = greedyWrapNumber(x, y, M);
  const e = euclidStepsNumber(x, y);
  return { success: g.success, steps: g.multiplySteps, euclid: e };
}

function runBigPair(x, y, M) {
  const g = greedySteps(x, y, { reflect: false, maxWrap: M });
  const e = euclidSteps(x, y);
  return { success: g.success, steps: g.multiplySteps, euclid: e };
}

function rate(sum, n) {
  return n === 0 ? "" : (sum / n).toFixed(4);
}

function mean(sum, n) {
  return n === 0 ? "" : (sum / n).toFixed(4);
}

function run() {
  const rng = mulberry32(SEED);
  const rows = [];
  const ranges = DECADES.concat(BIT_RANGES);

  for (const range of ranges) {
    for (const cls of CLASSES) {
      process.stderr.write(`sampling ${range.label} ${cls} n=${SAMPLE_N}\n`);
      const acc = {};
      for (const M of M_VALUES) {
        acc[M] = { success: 0, stepSum: 0, stepN: 0, euclidSum: 0 };
      }
      for (let i = 0; i < SAMPLE_N; i++) {
        let x;
        let y;
        let numberPath = range.bits == null && range.max <= Number.MAX_SAFE_INTEGER;
        if (range.bits == null) {
          ({ x, y } = sampleCoprimeNumber(rng, range.max, cls));
        } else {
          ({ x, y } = sampleCoprimeBits(rng, range.bits, cls));
          numberPath = false;
        }
        for (const M of M_VALUES) {
          const r = numberPath
            ? runNumberPair(x, y, M)
            : runBigPair(BigInt(x), BigInt(y), M);
          acc[M].euclidSum += r.euclid;
          if (r.success) {
            acc[M].success += 1;
            acc[M].stepSum += r.steps;
            acc[M].stepN += 1;
          }
        }
      }
      for (const M of M_VALUES) {
        const a = acc[M];
        rows.push({
          range: range.label,
          class: cls,
          M,
          n: SAMPLE_N,
          success_rate: rate(a.success, SAMPLE_N),
          mean_steps: mean(a.stepSum, a.stepN),
          mean_euclid_steps: mean(a.euclidSum, SAMPLE_N)
        });
      }
    }
  }

  const csvPath = outPath("success-rate.csv");
  writeCsv(
    csvPath,
    ["range", "class", "M", "n", "success_rate", "mean_steps", "mean_euclid_steps"],
    rows
  );
  process.stderr.write(`wrote ${csvPath}\n`);
}

run();
