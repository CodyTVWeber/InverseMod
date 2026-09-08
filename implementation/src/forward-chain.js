/**
 * Greedy forward chain for modular inverses (BigInt).
 *
 * Remainder map: r ← r · ceil(m y / r) − m y, modulus y fixed.
 * Inverse = product of the applied multipliers (reflection contributes y − 1).
 * On composite y the greedy step is skipped when it would leave (Z/yZ)*;
 * Extended Euclid finishes from the last invertible remainder if enabled.
 */

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

function euclidInverse(xIn, yIn) {
  const y = toBigInt(yIn);
  if (y <= 1n) return null;
  let oldR = ((toBigInt(xIn) % y) + y) % y;
  if (oldR === 0n) return null;
  let r = y;
  let oldS = 1n;
  let s = 0n;
  while (r !== 0n) {
    const q = oldR / r;
    const nextR = oldR - q * r;
    const nextS = oldS - q * s;
    oldR = r;
    r = nextR;
    oldS = s;
    s = nextS;
  }
  if (oldR !== 1n) return null;
  return ((oldS % y) + y) % y;
}

function fail(message, extra = {}) {
  return {
    success: false,
    inverse: null,
    method: "none",
    steps: extra.steps || [],
    certificate: extra.certificate || [],
    fallbackAt: extra.fallbackAt == null ? null : extra.fallbackAt,
    message
  };
}

/**
 * forwardChainInverse(x, y, options) -> {
 *   success: boolean,
 *   inverse: bigint | null,
 *   method: 'forward' | 'forward+euclid' | 'none',
 *   steps: Array<{ kind: 'multiply' | 'reflect', k: bigint, before: bigint, after: bigint }>,
 *   certificate: bigint[],
 *   fallbackAt: bigint | null,
 *   message: string
 * }
 * options: { reflect = true, maxWrap = 1, euclidFallback = true }
 */
function forwardChainInverse(xIn, yIn, options = {}) {
  const { reflect = true, maxWrap = 1, euclidFallback = true } = options;
  const y = toBigInt(yIn);
  if (y <= 1n) return fail("no inverse");
  let r = ((toBigInt(xIn) % y) + y) % y;
  if (r === 0n || gcd(r, y) !== 1n) return fail("no inverse");

  const steps = [];
  const certificate = [];
  let z = 1n;

  while (r !== 1n) {
    if (reflect && 2n * r > y) {
      const before = r;
      r = y - r;
      z = (z * (y - 1n)) % y;
      steps.push({ kind: "reflect", k: y - 1n, before, after: r });
      certificate.push(y - 1n);
      continue;
    }
    let applied = false;
    for (let m = 1n; m <= BigInt(maxWrap) && m < r; m++) {
      const k = (m * y + r - 1n) / r; // ceil(m*y / r)
      const next = r * k - m * y; // == (r*k) mod y, in (0, r)
      if (gcd(next, y) === 1n) {
        steps.push({ kind: "multiply", k, before: r, after: next });
        certificate.push(k);
        z = (z * k) % y;
        r = next;
        applied = true;
        break;
      }
    }
    if (!applied) {
      if (!euclidFallback) {
        return fail("greedy step left the unit group", {
          steps,
          certificate,
          fallbackAt: r
        });
      }
      const inv = euclidInverse(r, y);
      return {
        success: true,
        inverse: (z * inv) % y,
        method: "forward+euclid",
        steps,
        certificate,
        fallbackAt: r,
        message: "forward chain blocked; finished with Extended Euclid"
      };
    }
  }

  return {
    success: true,
    inverse: z,
    method: "forward",
    steps,
    certificate,
    fallbackAt: null,
    message: "forward chain reached 1"
  };
}

/**
 * Verify a multiplier certificate: r_i = (r_{i-1} * k_i) mod y, r_n = 1,
 * and x * product(k) ≡ 1 (mod y). Reflection steps contribute k = y - 1.
 */
function verifyCertificate(xIn, yIn, multipliers) {
  const y = toBigInt(yIn);
  if (y <= 1n) {
    return {
      valid: false,
      reason: "y must be > 1",
      remainders: [],
      inverseFromProduct: null
    };
  }

  const x = toBigInt(xIn);
  const r0 = ((x % y) + y) % y;
  if (r0 === 0n || gcd(r0, y) !== 1n) {
    return {
      valid: false,
      reason: "no inverse",
      remainders: [],
      inverseFromProduct: null
    };
  }

  if (!Array.isArray(multipliers)) {
    return {
      valid: false,
      reason: "certificate must be a multiplier array",
      remainders: [r0],
      inverseFromProduct: null
    };
  }

  const remainders = [r0];
  let r = r0;
  let productMod = 1n;

  for (const raw of multipliers) {
    let k;
    try {
      k = toBigInt(raw);
    } catch {
      return {
        valid: false,
        reason: `invalid multiplier: ${raw}`,
        remainders,
        inverseFromProduct: null
      };
    }
    if (k <= 0n) {
      return {
        valid: false,
        reason: "invalid multiplier",
        remainders,
        inverseFromProduct: null
      };
    }
    r = (r * k) % y;
    remainders.push(r);
    productMod = (productMod * k) % y;
  }

  const theoremCheck = (r0 * productMod) % y === 1n;
  const terminalCheck = remainders[remainders.length - 1] === 1n;
  const valid = theoremCheck && terminalCheck;

  return {
    valid,
    reason: valid
      ? "certificate is valid"
      : terminalCheck
        ? "product is not an inverse"
        : "certificate does not terminate at remainder 1",
    remainders,
    inverseFromProduct: theoremCheck ? productMod : null
  };
}

module.exports = {
  gcd,
  euclidInverse,
  forwardChainInverse,
  verifyCertificate
};
