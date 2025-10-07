#!/usr/bin/env node
/**
 * Show a detailed step-by-step trace for computing modular inverse
 * Includes backtracking events and parity-based adjustments.
 */

const { ImprovedBacktracker } = require('./improved-backtracking');

function usage() {
  console.log('Usage: node src/show-steps.js <x> <y> [--maxBacktracks=N] [--maxDepth=N] [--maxNodes=N]');
  process.exit(1);
}

function formatBigInt(n) {
  return n.toString();
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) usage();

  const x = parseInt(args[0], 10);
  const y = parseInt(args[1], 10);
  if (!Number.isInteger(x) || !Number.isInteger(y) || x <= 0 || y <= 0) usage();

  const options = { debug: false, recordTrace: true };
  for (const arg of args.slice(2)) {
    if (arg.startsWith('--maxBacktracks=')) options.maxBacktracks = parseInt(arg.split('=')[1], 10);
    if (arg.startsWith('--maxDepth=')) options.maxDepth = parseInt(arg.split('=')[1], 10);
    if (arg.startsWith('--maxNodes=')) options.maxNodes = parseInt(arg.split('=')[1], 10);
  }

  const backtracker = new ImprovedBacktracker(options);

  console.log(`Calculating the inverse of ${x} mod ${y}...`);
  const result = backtracker.computeInverse(x, y);

  if (!result.success) {
    console.log(`✗ FAILED: ${result.message}`);
    if (result.trace && result.trace.length) {
      console.log('\nTrace (failed path):');
      for (const event of result.trace) {
        if (event.type === 'step') {
          console.log(`- Step d=${event.depth}: ${y} < (${event.remainder} × ${event.k}) < (${event.remainder} + ${y}), remainder = ${event.nextRemainder}`);
        } else if (event.type === 'parity_backtrack') {
          console.log(`- Parity backtrack at depth ${event.depth}: bump k[${event.oddKIndex}] -> ${event.updatedK}, new remainder ${event.resultingRemainder}`);
        } else if (event.type === 'backtrack') {
          console.log(`- Backtrack at depth ${event.depth}: after trying k=${event.kTried}`);
        } else if (event.type === 'dead_end') {
          console.log(`- Dead end at depth ${event.depth}: remainder became 0`);
        } else if (event.type === 'limit') {
          console.log(`- Limit reached (${event.reason})`);
        }
      }
    }
    process.exit(0);
  }

  // Print the full constructive sequence
  console.log('\nSequence:');
  let remainder = BigInt(x % y);
  const multipliers = result.multipliers;
  const steps = [];

  for (let i = 0; i < multipliers.length; i++) {
    const k = multipliers[i];
    const product = remainder * k;
    const nextRemainder = product % BigInt(y);
    steps.push({ remainder, k, product, nextRemainder });
    remainder = nextRemainder;
  }

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    console.log(`Step ${i + 1}: ${y} < (${s.remainder} × ${s.k}) < (${s.remainder} + ${y}), ((${s.remainder} × ${s.k}) % ${y}) = ${s.nextRemainder}`);
  }

  // Backtracking trace
  if (result.trace && result.trace.length) {
    console.log('\nBacktracking events:');
    for (const event of result.trace) {
      if (event.type === 'parity_backtrack') {
        console.log(`- Parity backtrack: k[${event.oddKIndex}] -> ${event.updatedK}, remainder -> ${event.resultingRemainder}`);
      } else if (event.type === 'backtrack') {
        console.log(`- Backtrack after k=${event.kTried} at depth ${event.depth}`);
      }
    }
  }

  // Final values and validation
  let z = 1n;
  for (const k of multipliers) z = (z * k) % BigInt(y);

  console.log('\nFinal Values:');
  console.log(`x = ${x}`);
  console.log(`y = ${y}`);
  console.log(`k[] = [${multipliers.join(', ')}]`);
  const rList = [];
  remainder = BigInt(x % y);
  for (const k of multipliers) {
    remainder = (remainder * k) % BigInt(y);
    rList.push(remainder);
  }
  console.log(`r[] = [${rList.join(', ')}]`);
  console.log(`z = ${z}`);

  const valid = ((z * BigInt(x)) % BigInt(y)) === 1n;
  console.log('\nValidation step:');
  console.log(`((${z} * ${x}) mod ${y}) == 1 is ${valid}`);
  console.log('\n=== VALIDATION ===');
  console.log(valid ? `✓ VALID: (${z} × ${x}) mod ${y} = 1` : `✗ NOT VALID`);
}

if (require.main === module) {
  main();
}
