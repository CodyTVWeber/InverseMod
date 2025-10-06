#!/usr/bin/env node
import { inverseMod } from '../lib/inverseMod.js';
import { modInverseEuclid } from '../other/extendedEuclid.js';

function run(x, y) {
  const ours = inverseMod(x, y);
  const euclid = modInverseEuclid(x, y);
  const agree = ours.success && euclid !== 0 && ours.inverse === euclid;
  console.log(`x=${x}, y=${y} | ours=${ours.inverse} (${ours.method}) | euclid=${euclid} | agree=${agree}`);
}

function main() {
  const cases = [
    [3, 7],
    [5, 12],
    [31, 37],
    [17, 23],
    [4, 6],
  ];
  for (const [x, y] of cases) run(x, y);
}

main();
