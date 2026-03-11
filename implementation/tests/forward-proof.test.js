const {
  gcd,
  verifyCertificate,
  forwardInverse,
  euclidInverse
} = require("../src/index");

describe("forward certificate theorem", () => {
  it("verifies known valid certificate for 11 mod 26", () => {
    const proof = verifyCertificate(11, 26, [5, 9]);
    expect(proof.valid).toBe(true);
    expect(proof.inverseFromProduct).toBe(19);
    expect((11 * proof.inverseFromProduct) % 26).toBe(1);
  });

  it("rejects invalid certificates", () => {
    const proof = verifyCertificate(11, 26, [3, 4, 13]);
    expect(proof.valid).toBe(false);
  });
});

describe("algorithm behavior", () => {
  it("computes inverse for basic cases", () => {
    const cases = [
      [3, 7, 5],
      [5, 12, 5],
      [17, 23, 19],
      [8, 5, 2]
    ];

    for (const [x, y, expected] of cases) {
      const result = forwardInverse(x, y);
      expect(result.success).toBe(true);
      expect(result.inverse).toBe(expected);
      expect((x * result.inverse) % y).toBe(1);
      expect(result.proofChecked).toBe(true);
    }
  });

  it("uses Euclid fallback when forward search is constrained", () => {
    const result = forwardInverse(11, 26, {
      maxDepth: 1,
      maxOffset: 0,
      allowEuclidFallback: true
    });
    expect(result.success).toBe(true);
    expect(result.method).toBe("euclid-fallback");
    expect((11 * result.inverse) % 26).toBe(1);
  });

  it("reports failure when no inverse exists", () => {
    const result = forwardInverse(4, 6);
    expect(result.success).toBe(false);
  });
});

describe("sanity checks", () => {
  it("matches Euclid inverse on random coprime pairs", () => {
    let checked = 0;
    for (let y = 3; y <= 60; y++) {
      for (let x = 1; x < y; x++) {
        if (gcd(x, y) !== 1) continue;
        const a = forwardInverse(x, y);
        const b = euclidInverse(x, y);
        expect(a.success).toBe(true);
        expect(b.success).toBe(true);
        expect(a.inverse).toBe(b.inverse);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(300);
  });
});
