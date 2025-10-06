#!/usr/bin/env node
import { inverseMod, formatResult } from '../lib/inverseMod.js';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const [k, v] = argv[i].split('=');
    if (v === undefined) continue;
    args[k.replace(/^--/, '')] = Number(v);
  }
  return args;
}

function main() {
  const { x = 3, y = 7 } = parseArgs(process.argv);
  const result = inverseMod(Number(x), Number(y));
  console.log(formatResult(result));
}

main();
