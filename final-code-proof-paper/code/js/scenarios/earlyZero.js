#!/usr/bin/env node
import { inverseMod, formatResult } from '../lib/inverseMod.js';

function main() {
  // A case that historically reached remainder 0 early for naive approach
  const x = 5;
  const y = 12;
  const result = inverseMod(x, y, { maxBacktracks: 100 });
  console.log(formatResult(result));
}

main();
