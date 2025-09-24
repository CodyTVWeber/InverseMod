import { inverseMod, gcd } from './src/inverse-mod';

console.log('Testing 35 mod 12:');
console.log('gcd(35, 12) =', gcd(35, 12));

const result = inverseMod(35, 12);
console.log('Result:', result);