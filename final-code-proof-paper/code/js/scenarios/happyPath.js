#!/usr/bin/env node
import { inverseMod, formatResult } from '../lib/inverseMod.js';

function main() {
  const x = 3;
  const y = 7;
  const result = inverseMod(x, y);
  console.log(formatResult(result));
}

main();
