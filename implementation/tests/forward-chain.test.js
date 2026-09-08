const {
  gcd,
  verifyCertificate,
  forwardChainInverse,
  euclidInverse
} = require("../src/forward-chain");

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

function randomInt(rng, min, maxExclusive) {
  return min + Math.floor(rng() * (maxExclusive - min));
}

function randomCoprimePairBelow(rng, maxY) {
  for (;;) {
    const y = randomInt(rng, 3, maxY);
    const x = randomInt(rng, 1, y);
    if (gcd(x, y) === 1n) return { x, y };
  }
}

function randomBigIntBits(rng, bits) {
  let n = 1n << BigInt(bits - 1);
  for (let i = 0; i < bits - 1; i++) {
    if (rng() < 0.5) n |= 1n << BigInt(i);
  }
  return n;
}

function randomCoprimePairBits(rng, bits) {
  for (;;) {
    let y = randomBigIntBits(rng, bits);
    if (y % 2n === 0n) y += 1n;
    if (y < 3n) continue;
    let x = randomBigIntBits(rng, bits) % y;
    if (x === 0n) x = 1n;
    if (gcd(x, y) === 1n) return { x, y };
  }
}

describe("documented acceptance values", () => {
  it("matches the four PLAN.md examples", () => {
    const a = forwardChainInverse(11, 26);
    expect(a.success).toBe(true);
    expect(a.inverse).toBe(19n);
    expect(a.method).toBe("forward+euclid");
    expect(a.fallbackAt).toBe(7n);
    expect(a.certificate).toEqual([3n]);

    const b = forwardChainInverse(11, 26, { maxWrap: 4 });
    expect(b.method).toBe("forward");
    expect(b.certificate).toEqual([3n, 15n]);
    expect(b.inverse).toBe(19n);
    expect(verifyCertificate(11, 26, b.certificate).valid).toBe(true);

    const c = forwardChainInverse(17, 23);
    expect(c.method).toBe("forward");
    expect(c.certificate).toEqual([22n, 4n]);
    expect(c.inverse).toBe(19n);

    const d = forwardChainInverse(500, 1001);
    expect(d.method).toBe("forward+euclid");
    expect(d.fallbackAt).toBe(31n);
    expect(d.inverse).toBe(999n);
  });
});

describe("agreement with Euclid", () => {
  it("agrees on all coprime pairs 3 ≤ y ≤ 300", () => {
    let checked = 0;
    for (let y = 3; y <= 300; y++) {
      for (let x = 1; x < y; x++) {
        if (gcd(x, y) !== 1n) continue;
        const a = forwardChainInverse(x, y);
        const b = euclidInverse(x, y);
        expect(a.success).toBe(true);
        expect(b).not.toBeNull();
        expect(a.inverse).toBe(b);
        expect((BigInt(x) * a.inverse) % BigInt(y)).toBe(1n);
        if (a.method === "forward") {
          expect(verifyCertificate(x, y, a.certificate).valid).toBe(true);
        }
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(10000);
  });
});

describe("random pairs", () => {
  it("inverts 10,000 random pairs with y < 2^53 and 200 pairs with 256-bit y", () => {
    const rng = mulberry32(20260908);
    for (let i = 0; i < 10000; i++) {
      const { x, y } = randomCoprimePairBelow(rng, 2 ** 53);
      const result = forwardChainInverse(x, y);
      expect(result.success).toBe(true);
      expect((BigInt(x) * result.inverse) % BigInt(y)).toBe(1n);
      if (result.method === "forward") {
        expect(verifyCertificate(x, y, result.certificate).valid).toBe(true);
      }
    }
    for (let i = 0; i < 200; i++) {
      const { x, y } = randomCoprimePairBits(rng, 256);
      const result = forwardChainInverse(x, y);
      expect(result.success).toBe(true);
      expect((x * result.inverse) % y).toBe(1n);
      if (result.method === "forward") {
        expect(verifyCertificate(x, y, result.certificate).valid).toBe(true);
      }
    }
  });
});

describe("prime moduli never fall back", () => {
  it("uses method forward for 200 random x on each listed prime", () => {
    const rng = mulberry32(65537);
    const primes = [1009n, 65537n, 2n ** 31n - 1n, 2n ** 61n - 1n];
    for (const y of primes) {
      for (let i = 0; i < 200; i++) {
        let x = 1n + BigInt(Math.floor(rng() * Number.MAX_SAFE_INTEGER)) % (y - 1n);
        if (x === 0n) x = 1n;
        const result = forwardChainInverse(x, y);
        expect(result.success).toBe(true);
        expect(result.method).toBe("forward");
        expect(result.fallbackAt).toBeNull();
        expect((x * result.inverse) % y).toBe(1n);
        expect(verifyCertificate(x, y, result.certificate).valid).toBe(true);
      }
    }
  });
});

describe("composite documented cases", () => {
  it("returns a valid certificate for 11 mod 26 with wraps, and falls back on 500 mod 1001", () => {
    const wrapped = forwardChainInverse(11, 26, { maxWrap: 4 });
    expect(verifyCertificate(11, 26, wrapped.certificate).valid).toBe(true);
    expect(wrapped.inverse).toBe(19n);

    const blocked = forwardChainInverse(500, 1001, { maxWrap: 1 });
    expect(blocked.method).toBe("forward+euclid");
    expect(blocked.fallbackAt).not.toBeNull();
    expect(blocked.fallbackAt).toBe(31n);
    expect(blocked.inverse).toBe(999n);
  });
});

describe("reflection", () => {
  it("takes 33 multiplies without reflection and one reflect with it", () => {
    const off = forwardChainInverse(1000002, 1000003, { reflect: false });
    expect(off.method).toBe("forward");
    expect(off.steps.every((s) => s.kind === "multiply")).toBe(true);
    expect(off.steps).toHaveLength(33);
    expect(off.inverse).toBe(1000002n);

    const on = forwardChainInverse(1000002, 1000003, { reflect: true });
    expect(on.steps).toHaveLength(1);
    expect(on.steps[0].kind).toBe("reflect");
    expect(on.certificate).toEqual([1000002n]);
    expect(on.inverse).toBe(1000002n);
  });
});

describe("non-invertible inputs", () => {
  it("returns success false for (4,6), y ≤ 1, and x ≡ 0", () => {
    expect(forwardChainInverse(4, 6).success).toBe(false);
    expect(forwardChainInverse(3, 1).success).toBe(false);
    expect(forwardChainInverse(5, 0).success).toBe(false);
    expect(forwardChainInverse(0, 11).success).toBe(false);
    expect(forwardChainInverse(22, 11).success).toBe(false);
  });
});

describe("verifyCertificate", () => {
  it("rejects non-positive multipliers", () => {
    const zero = verifyCertificate(11, 26, [0n]);
    expect(zero.valid).toBe(false);
    expect(zero.reason).toBe("invalid multiplier");
    const neg = verifyCertificate(11, 26, [-3n]);
    expect(neg.valid).toBe(false);
    expect(neg.reason).toBe("invalid multiplier");
  });
});

describe("performance guard", () => {
  it("completes 10,000 random calls with y < 2^53 in under 2 seconds", () => {
    const rng = mulberry32(42);
    const pairs = [];
    for (let i = 0; i < 10000; i++) {
      pairs.push(randomCoprimePairBelow(rng, 2 ** 53));
    }
    const start = Date.now();
    for (const { x, y } of pairs) {
      const result = forwardChainInverse(x, y);
      if (!result.success) {
        throw new Error("unexpected failure");
      }
    }
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(2000);
  });
});
