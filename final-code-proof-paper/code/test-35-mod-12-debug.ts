import { inverseMod, gcd } from './src/inverse-mod';

console.log('Testing 35 mod 12 with more backtracks:');
console.log('gcd(35, 12) =', gcd(35, 12));

// Try with more backtracks allowed
const result1 = inverseMod(35, 12, { maxBacktracks: 20 });
console.log('Result with 20 backtracks:', result1);

// Let's also test 11 mod 12 directly (since 35 ≡ 11 mod 12)
console.log('\nTesting 11 mod 12:');
const result2 = inverseMod(11, 12);
console.log('Result:', result2);

// Test the known inverse manually
console.log('\nManual verification:');
console.log('(11 × 11) mod 12 =', (11 * 11) % 12);