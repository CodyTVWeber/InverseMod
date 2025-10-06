import { calculateOptimalK } from './src/inverse-mod';

console.log('Testing k calculation for 11 mod 12:');
const baseK = calculateOptimalK(11, 12);
console.log('Base k value:', baseK);
console.log('ceil(12/11) =', Math.ceil(12/11));

// Test the bounds
console.log('\nTesting bounds:');
for (let k = baseK; k <= baseK + 10; k++) {
  const product = 11 * k;
  const inBounds = product > 12 && product < 11 + 12;
  const remainder = product % 12;
  console.log(`k=${k}: 11 × ${k} = ${product}, in bounds: ${inBounds}, remainder: ${remainder}`);
}