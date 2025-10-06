import { inverseMod, gcd } from './src/inverse-mod';

console.log('Testing large numbers:');
console.log('gcd(12345, 67890) =', gcd(12345, 67890));

// They're not coprime! Let's find a coprime pair
console.log('\nFinding coprime pair:');
const x = 12347;
const y = 67891;
console.log(`gcd(${x}, ${y}) =`, gcd(x, y));

if (gcd(x, y) === 1) {
  const result = inverseMod(x, y);
  console.log(`Result: success=${result.success}, inverse=${result.inverse}`);
  if (result.success) {
    console.log(`Verification: (${result.inverse} × ${x}) mod ${y} =`, (result.inverse * x) % y);
  }
}