#!/usr/bin/env node

const { forwardInverse, verifyCertificate } = require("./index");

function showCase(x, y) {
  const result = forwardInverse(x, y, { maxDepth: 12, maxOffset: 12 });
  console.log(`\nCase: x=${x}, y=${y}`);
  console.log(`Success: ${result.success}`);
  console.log(`Method: ${result.method}`);
  console.log(`Message: ${result.message}`);
  if (!result.success) {
    return;
  }

  console.log(`Inverse: ${result.inverse}`);
  console.log(`Check: (${x} * ${result.inverse}) mod ${y} = ${(x * result.inverse) % y}`);
  if (result.certificate) {
    console.log(`Certificate k-sequence: [${result.certificate.join(", ")}]`);
    const proof = verifyCertificate(x, y, result.certificate);
    console.log(`Proof check passed: ${proof.valid}`);
    console.log(`Remainders: [${proof.remainders.join(", ")}]`);
  }
}

function main() {
  console.log("Forward Certificate Method Demo");
  console.log("Soli Deo Gloria");
  showCase(11, 26);
  showCase(5, 12);
  showCase(17, 23);
}

if (require.main === module) {
  main();
}

module.exports = { main };