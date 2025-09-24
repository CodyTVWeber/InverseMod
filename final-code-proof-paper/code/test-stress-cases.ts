import { inverseMod, gcd } from './src/inverse-mod';

const testPairs = [
  [3, 8], [7, 15], [11, 13], [19, 25], [23, 30],
  [5, 7], [9, 10], [13, 17], [21, 22], [25, 27]
];

console.log('Testing stress test pairs:');
for (const [x, y] of testPairs) {
  const g = gcd(x, y);
  const result = inverseMod(x, y);
  console.log(`${x} mod ${y}: gcd=${g}, success=${result.success}, inverse=${result.inverse}, backtrackCount=${result.backtrackCount}`);
  if (!result.success) {
    console.log(`  Failed: ${result.message}`);
  }
}