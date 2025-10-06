#!/usr/bin/env node
import { inverseMod, formatResult } from '../lib/inverseMod.js';

function main() {
  const x = 4;
  const y = 6; // gcd != 1 -> no inverse
  const result = inverseMod(x, y);
  console.log(formatResult(result));
}

main();
