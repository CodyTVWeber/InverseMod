#!/usr/bin/env node

/**
 * Stretch (Task 2.5): measure W(y) on candidate super-logarithmic families.
 * Families:
 *   - y = next prime ≥ 2r+1  (so x=(y-1)/2 gives y=2r+1)
 *   - y = next prime ≥ 3r+1
 *   - y = next prime of form lcm(1..n)+1
 *   - y = next prime of form primorial(n)+1
 */

const {
  isPrime,
  primesJustAbove,
  greedyMultiplyStepsPrimeNumber,
  greedySteps,
  writeCsv,
  outPath
} = require("./lib");

function nextPrime(n) {
  let y = BigInt(n);
  if (y < 3n) y = 3n;
  if ((y & 1n) === 0n) y += 1n;
  while (!isPrime(y)) y += 2n;
  return y;
}

function primorial(n) {
  let p = 1n;
  let q = 2n;
  let count = 0;
  while (count < n) {
    if (isPrime(q)) {
      p *= q;
      count += 1;
    }
    q += 1n;
  }
  return p;
}

function lcmTo(n) {
  let l = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    const g = gcdBig(l, i);
    l = (l / g) * i;
  }
  return l;
}

function gcdBig(a, b) {
  while (b !== 0n) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function WprimeNumber(y) {
  const yn = Number(y);
  let worst = 0;
  let worstX = 1;
  for (let x = 1; x < yn; x++) {
    const s = greedyMultiplyStepsPrimeNumber(x, yn, true);
    if (s > worst) {
      worst = s;
      worstX = x;
    }
  }
  return { worst, worstX };
}

function WfromX(x, y) {
  const g = greedySteps(x, y, { reflect: true, maxWrap: 1 });
  return g.success ? g.multiplySteps : null;
}

function run() {
  const rows = [];

  process.stderr.write("family 2r+1 (prime y just above 2^k, x=(y-1)/2)\n");
  for (let k = 8; k <= 22; k++) {
    const y = primesJustAbove(2n ** BigInt(k));
    const x = (y - 1n) / 2n;
    const steps = Number(y) < Number.MAX_SAFE_INTEGER
      ? greedyMultiplyStepsPrimeNumber(Number(x), Number(y), true)
      : WfromX(x, y);
    rows.push({
      family: "2r+1-midpoint",
      k,
      y: y.toString(),
      x: x.toString(),
      W_at_x: steps,
      W_full: "",
      W_over_log2y: (steps / k).toFixed(4)
    });
  }

  process.stderr.write("family 3r+1 midpoint-like x=floor(y/3)\n");
  for (let k = 8; k <= 20; k++) {
    const y = primesJustAbove(2n ** BigInt(k));
    const x = y / 3n;
    if (x <= 1n) continue;
    const steps = greedyMultiplyStepsPrimeNumber(Number(x), Number(y), true);
    rows.push({
      family: "3r+1-floor-y/3",
      k,
      y: y.toString(),
      x: x.toString(),
      W_at_x: steps,
      W_full: "",
      W_over_log2y: (steps / k).toFixed(4)
    });
  }

  process.stderr.write("family lcm(1..n)+1 when prime, exhaustive W if y is small\n");
  for (let n = 6; n <= 20; n++) {
    const y = nextPrime(lcmTo(n) + 1n);
    const k = y.toString(2).length - 1;
    let full = "";
    let worstX = "";
    let at = "";
    if (y < 500000n) {
      const w = WprimeNumber(y);
      full = w.worst;
      worstX = w.worstX;
      at = greedyMultiplyStepsPrimeNumber(Number((y - 1n) / 2n), Number(y), true);
    } else if (y < 2n ** 53n) {
      at = greedyMultiplyStepsPrimeNumber(Number((y - 1n) / 2n), Number(y), true);
    }
    rows.push({
      family: "lcm1n-plus1",
      k,
      y: y.toString(),
      x: worstX || ((y - 1n) / 2n).toString(),
      W_at_x: at,
      W_full: full,
      W_over_log2y: full === "" ? "" : (full / Math.log2(Number(y))).toFixed(4)
    });
  }

  process.stderr.write("family primorial+1\n");
  for (let n = 3; n <= 8; n++) {
    const y = nextPrime(primorial(n) + 1n);
    if (y >= 2n ** 53n) continue;
    const yn = Number(y);
    const w = yn < 400000 ? WprimeNumber(y) : { worst: "", worstX: Number((y - 1n) / 2n) };
    const mid = greedyMultiplyStepsPrimeNumber(Number((y - 1n) / 2n), yn, true);
    rows.push({
      family: "primorial-plus1",
      k: yn.toString(2).length - 1,
      y: y.toString(),
      x: w.worstX.toString(),
      W_at_x: mid,
      W_full: w.worst,
      W_over_log2y: w.worst === "" ? "" : (w.worst / Math.log2(yn)).toFixed(4)
    });
  }

  const csvPath = outPath("worst-case-families.csv");
  writeCsv(
    csvPath,
    ["family", "k", "y", "x", "W_at_x", "W_full", "W_over_log2y"],
    rows
  );
  process.stderr.write(`wrote ${csvPath}\n`);
}

run();
