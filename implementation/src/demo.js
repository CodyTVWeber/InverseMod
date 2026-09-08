#!/usr/bin/env node

const {
  gcd,
  forwardChainInverse,
  verifyCertificate,
  euclidInverse
} = require("./forward-chain");

function formatMultiply(step, y, index) {
  const product = step.before * step.k;
  return `step ${index}: r=${step.before} × k=${step.k} = ${product} ≡ ${step.after} (mod ${y})`;
}

function formatReflect(step) {
  return `reflect: r=${step.before} → y−r=${step.after}`;
}

function blockedStepLine(r, y) {
  const k = (y + r - 1n) / r;
  const product = r * k;
  const next = product % y;
  const g = gcd(next, y);
  return `r=${r} × k=${k} = ${product} ≡ ${next}, gcd(${next}, ${y}) = ${g} — leaves the unit group`;
}

function showCase(x, y, options = {}, label = "") {
  const result = forwardChainInverse(x, y, options);
  const yB = BigInt(y);
  const title = label || `x=${x}, y=${y}`;
  console.log(`\n=== ${title} ===`);
  console.log(`method = ${result.method}`);
  console.log(`message: ${result.message}`);

  let stepIndex = 0;
  for (const step of result.steps) {
    if (step.kind === "reflect") {
      console.log(formatReflect(step));
    } else {
      stepIndex += 1;
      console.log(formatMultiply(step, yB, stepIndex));
    }
  }

  if (result.method === "forward+euclid") {
    const r = result.fallbackAt;
    const z = result.certificate.reduce((acc, k) => (acc * k) % yB, 1n);
    const invR = euclidInverse(r, yB);
    console.log(`partial certificate: [${result.certificate.join(", ")}]`);
    console.log(`blocked at r = ${r}`);
    console.log(blockedStepLine(r, yB));
    console.log(`Euclid tail: ${r}^{-1} ≡ ${invR} (mod ${yB})`);
    console.log(`combined inverse = ${z} × ${invR} ≡ ${result.inverse} (mod ${yB})`);
  } else if (result.certificate.length) {
    console.log(`certificate: [${result.certificate.join(", ")}]`);
  }

  if (!result.success) {
    console.log(`success = false`);
    if (result.fallbackAt != null && result.method !== "forward+euclid") {
      console.log(`blocked at r = ${result.fallbackAt}`);
      console.log(blockedStepLine(result.fallbackAt, yB));
    }
    return result;
  }

  console.log(`inverse = ${result.inverse}`);
  if (result.method === "forward+euclid") {
    console.log("partial certificate (not a complete chain; Euclid tail used): verified = n/a");
  } else {
    const proof = verifyCertificate(x, y, result.certificate);
    console.log(`certificate verified: ${proof.valid}`);
  }
  return result;
}

function main() {
  console.log("Forward chain modular inverse");
  console.log("Soli Deo Gloria");

  showCase(11, 26, {}, "x=11, y=26 (defaults)");
  showCase(11, 26, { maxWrap: 4 }, "x=11, y=26 (maxWrap 4)");
  showCase(17, 23, {}, "x=17, y=23");
  showCase(500, 1001, {}, "x=500, y=1001");
  showCase(1000002, 1000003, { reflect: true }, "x=1000002, y=1000003 (reflection on)");
  showCase(1000002, 1000003, { reflect: false }, "x=1000002, y=1000003 (reflection off)");
}

if (require.main === module) {
  main();
}

module.exports = { main, showCase };
