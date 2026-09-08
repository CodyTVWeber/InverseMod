#!/usr/bin/env node

const {
  forwardChainInverse,
  verifyCertificate
} = require("./forward-chain");

function printUsage() {
  console.error("usage: node src/cli.js <x> <y> [--no-reflect] [--max-wrap N] [--no-fallback] [--json]");
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length < 2) {
    printUsage();
    process.exit(1);
  }
  const x = args[0];
  const y = args[1];
  const options = { reflect: true, maxWrap: 1, euclidFallback: true };
  let json = false;
  for (let i = 2; i < args.length; i++) {
    const a = args[i];
    if (a === "--no-reflect") options.reflect = false;
    else if (a === "--no-fallback") options.euclidFallback = false;
    else if (a === "--json") json = true;
    else if (a === "--max-wrap") {
      const n = args[i + 1];
      if (n == null) {
        printUsage();
        process.exit(1);
      }
      options.maxWrap = Number(n);
      i += 1;
    } else {
      console.error(`unknown option: ${a}`);
      printUsage();
      process.exit(1);
    }
  }
  return { x, y, options, json };
}

function bigintReplacer(_key, value) {
  return typeof value === "bigint" ? value.toString() : value;
}

function main() {
  const { x, y, options, json } = parseArgs(process.argv);
  const result = forwardChainInverse(x, y, options);
  if (json) {
    console.log(JSON.stringify(result, bigintReplacer, 2));
    return;
  }
  console.log(`x = ${x}`);
  console.log(`y = ${y}`);
  console.log(`method = ${result.method}`);
  console.log(`success = ${result.success}`);
  console.log(`message = ${result.message}`);
  if (result.fallbackAt != null) {
    console.log(`blocked at r = ${result.fallbackAt}`);
  }
  if (result.success) {
    console.log(`inverse = ${result.inverse}`);
    const proof = verifyCertificate(x, y, result.certificate);
    console.log(`certificate verified: ${proof.valid}`);
  }
  if (result.certificate.length) {
    console.log(`certificate: [${result.certificate.join(", ")}]`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, parseArgs };
