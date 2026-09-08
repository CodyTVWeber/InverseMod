const fs = require("fs");
const path = require("path");

function toBigInt(value) {
  return BigInt(value);
}

function gcd(aIn, bIn) {
  let a = toBigInt(aIn);
  let b = toBigInt(bIn);
  if (a < 0n) a = -a;
  if (b < 0n) b = -b;
  while (b !== 0n) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function gcdNumber(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function modPow(base, exp, mod) {
  base %= mod;
  let result = 1n;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}

const MR_WITNESSES_64 = [2n, 3n, 5n, 7n, 11n, 13n, 23n];
const MR_WITNESSES_BIG = [
  2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n
];

function millerRabin(n, witnesses) {
  const nMinus1 = n - 1n;
  let s = 0n;
  let d = nMinus1;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s += 1n;
  }
  witnessLoop: for (const a0 of witnesses) {
    const a = a0 % n;
    if (a === 0n) continue;
    let x = modPow(a, d, n);
    if (x === 1n || x === nMinus1) continue;
    for (let i = 1n; i < s; i++) {
      x = (x * x) % n;
      if (x === nMinus1) continue witnessLoop;
    }
    return false;
  }
  return true;
}

function isPrime(nIn) {
  const n = toBigInt(nIn);
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if ((n & 1n) === 0n) return false;
  const small = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n];
  for (const p of small) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }
  if (n < 2n ** 64n) return millerRabin(n, MR_WITNESSES_64);
  return millerRabin(n, MR_WITNESSES_BIG);
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function randomBits(rng, bits) {
  let n = 1n << BigInt(bits - 1);
  for (let i = 0; i < bits - 1; i++) {
    if (rng() < 0.5) n |= 1n << BigInt(i);
  }
  return n;
}

function randomCoprimePair(bits, rng = mulberry32(1)) {
  for (;;) {
    let y = randomBits(rng, bits);
    if (y < 3n) continue;
    let x = randomBits(rng, bits) % y;
    if (x === 0n) x = 1n;
    if (gcd(x, y) === 1n) return { x, y };
  }
}

function randomInt(rng, min, maxExclusive) {
  return min + Math.floor(rng() * (maxExclusive - min));
}

function primesJustAbove(twoToTheK) {
  let n = toBigInt(twoToTheK) + 1n;
  if ((n & 1n) === 0n) n += 1n;
  while (!isPrime(n)) n += 2n;
  return n;
}

function euclidSteps(xIn, yIn) {
  let a = toBigInt(xIn);
  let b = toBigInt(yIn);
  if (a < 0n) a = -a;
  if (b < 0n) b = -b;
  let steps = 0;
  while (b !== 0n) {
    const t = a % b;
    a = b;
    b = t;
    steps += 1;
  }
  // Count divisions that produce a non-zero remainder (exclude the terminating 0).
  return steps === 0 ? 0 : steps - 1;
}

function euclidStepsNumber(x, y) {
  let a = Math.abs(x);
  let b = Math.abs(y);
  let steps = 0;
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
    steps += 1;
  }
  return steps === 0 ? 0 : steps - 1;
}

/**
 * Greedy forward chain. Counts multiply steps only (not reflections).
 * Returns { success, multiplySteps, reflectSteps, fallbackAt }.
 */
function greedySteps(xIn, yIn, options = {}) {
  const { reflect = true, maxWrap = 1 } = options;
  const y = toBigInt(yIn);
  let r = ((toBigInt(xIn) % y) + y) % y;
  if (y <= 1n || r === 0n || gcd(r, y) !== 1n) {
    return { success: false, multiplySteps: 0, reflectSteps: 0, fallbackAt: r };
  }
  let multiplySteps = 0;
  let reflectSteps = 0;
  const maxW = toBigInt(maxWrap);
  while (r !== 1n) {
    if (reflect && 2n * r > y) {
      r = y - r;
      reflectSteps += 1;
      continue;
    }
    let applied = false;
    for (let m = 1n; m <= maxW && m < r; m++) {
      const k = (m * y + r - 1n) / r;
      const next = r * k - m * y;
      if (gcd(next, y) === 1n) {
        r = next;
        multiplySteps += 1;
        applied = true;
        break;
      }
    }
    if (!applied) {
      return { success: false, multiplySteps, reflectSteps, fallbackAt: r };
    }
  }
  return { success: true, multiplySteps, reflectSteps, fallbackAt: null };
}

/** Fast path for prime y that fits in Number; multiply steps only. */
function greedyMultiplyStepsPrimeNumber(x, y, reflect = true) {
  let r = x % y;
  if (r === 0) return null;
  let steps = 0;
  while (r !== 1) {
    if (reflect && 2 * r > y) {
      r = y - r;
      continue;
    }
    const k = Math.floor((y + r - 1) / r);
    r = r * k - y;
    steps += 1;
  }
  return steps;
}

/** Fast path for y that fits in Number; no reflection. */
function greedyWrapNumber(x, y, maxWrap) {
  let r = x % y;
  if (r === 0 || gcdNumber(r, y) !== 1) {
    return { success: false, multiplySteps: 0 };
  }
  let multiplySteps = 0;
  while (r !== 1) {
    let applied = false;
    const maxM = Math.min(maxWrap, r - 1);
    for (let m = 1; m <= maxM; m++) {
      const k = Math.floor((m * y + r - 1) / r);
      const next = r * k - m * y;
      if (gcdNumber(next, y) === 1) {
        r = next;
        multiplySteps += 1;
        applied = true;
        break;
      }
    }
    if (!applied) return { success: false, multiplySteps };
  }
  return { success: true, multiplySteps };
}

function writeCsv(filePath, headers, rows) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => row[h]).join(","));
  }
  fs.writeFileSync(filePath, lines.join("\n") + "\n");
}

function outPath(name) {
  return path.join(__dirname, "out", name);
}

module.exports = {
  gcd,
  gcdNumber,
  isPrime,
  mulberry32,
  randomBits,
  randomCoprimePair,
  randomInt,
  primesJustAbove,
  euclidSteps,
  euclidStepsNumber,
  greedySteps,
  greedyMultiplyStepsPrimeNumber,
  greedyWrapNumber,
  writeCsv,
  outPath,
  toBigInt
};
