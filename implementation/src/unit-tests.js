#!/usr/bin/env node
/**
 * Lightweight unit tests (no external deps)
 */

const assert = require('assert');
const { ImprovedBacktracker } = require('./improved-backtracking');
const { TestFramework } = require('./test-framework');

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) { const t = b; b = a % b; a = t; }
  return a;
}

// ImprovedBacktracker correctness on simple cases
test('3 mod 7 -> 5', () => {
  const backtracker = new ImprovedBacktracker({ debug: false });
  const r = backtracker.computeInverse(3, 7);
  assert.strictEqual(r.success, true);
  assert.strictEqual(Number((r.inverse * 3n) % 7n), 1);
});

test('17 mod 23 -> 19', () => {
  const backtracker = new ImprovedBacktracker({ debug: false });
  const r = backtracker.computeInverse(17, 23);
  assert.strictEqual(r.success, true);
  assert.strictEqual(Number((r.inverse * 17n) % 23n), 1);
});

test('5 mod 12 requires backtracking but succeeds', () => {
  const backtracker = new ImprovedBacktracker({ debug: false });
  const r = backtracker.computeInverse(5, 12);
  assert.strictEqual(r.success, true);
  assert.strictEqual(Number((r.inverse * 5n) % 12n), 1);
});

test('4 mod 6 -> no inverse (gcd>1)', () => {
  const backtracker = new ImprovedBacktracker({ debug: false });
  const r = backtracker.computeInverse(4, 6);
  assert.strictEqual(r.success, false);
  assert.ok(String(r.message).includes('No inverse'));
});

// Histogram: zero-range should not produce NaN bucket labels
test('Histogram single-bucket for identical values', () => {
  const tf = new TestFramework();
  const dist = tf.getDistribution([0, 0, 0], 10);
  const keys = Object.keys(dist);
  assert.strictEqual(keys.length, 1);
  assert.strictEqual(dist[keys[0]], 3);
  assert.ok(/^-?\d+\.\d{2}-\-?\d+\.\d{2}$/.test(keys[0]), 'bucket label should be numeric range');
});

// Hard case: ensure we return quickly under limits (no hang)
test('999999 mod 1000000 returns promptly under caps', () => {
  assert.strictEqual(gcd(999999, 1000000), 1); // coprime
  const backtracker = new ImprovedBacktracker({ debug: false, maxBacktracks: 50, maxNodes: 5000 });
  const r = backtracker.computeInverse(999999, 1000000);
  assert.ok(typeof r.success === 'boolean');
});

// Trace recording
test('recordTrace produces step events', () => {
  const backtracker = new ImprovedBacktracker({ debug: false, recordTrace: true });
  const r = backtracker.computeInverse(17, 23);
  assert.strictEqual(r.success, true);
  assert.ok(Array.isArray(r.trace));
  assert.ok(r.trace.some(e => e && e.type === 'step'));
});

async function run() {
  const failures = [];
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`\u2713 ${name}`);
    } catch (err) {
      failures.push({ name, err });
      console.error(`\u2717 ${name}`);
      console.error(err && err.stack ? err.stack : err);
    }
  }
  console.log(`\n${tests.length - failures.length}/${tests.length} tests passed`);
  process.exit(failures.length === 0 ? 0 : 1);
}

if (require.main === module) {
  run();
}
