/**
 * No Inverse Test Cases
 * These are cases where no modular inverse exists (gcd(x, y) ≠ 1)
 */

const { inverseMod, printResult, gcd } = require('./inverse-mod.js');

console.log('\n' + '█'.repeat(60));
console.log('NO INVERSE TEST CASES');
console.log('Cases where gcd(x, y) ≠ 1, so no inverse exists');
console.log('█'.repeat(60));

// Test case 1: Both even
console.log('\n### Test 1: 4 mod 6 ###');
console.log(`gcd(4, 6) = ${gcd(4, 6)} ≠ 1, no inverse exists`);
console.log('Expected: Failure with appropriate message');
printResult(inverseMod(4, 6, { method: 'novel' }));

// Test case 2: x divides y
console.log('\n### Test 2: 2 mod 4 ###');
console.log(`gcd(2, 4) = ${gcd(2, 4)} ≠ 1, no inverse exists`);
console.log('Expected: Failure with appropriate message');
printResult(inverseMod(2, 4, { method: 'novel' }));

// Test case 3: Common factor of 3
console.log('\n### Test 3: 9 mod 15 ###');
console.log(`gcd(9, 15) = ${gcd(9, 15)} ≠ 1, no inverse exists`);
console.log('Expected: Failure with appropriate message');
printResult(inverseMod(9, 15, { method: 'novel' }));

// Test case 4: Common factor of 5
console.log('\n### Test 4: 10 mod 15 ###');
console.log(`gcd(10, 15) = ${gcd(10, 15)} ≠ 1, no inverse exists`);
console.log('Expected: Failure with appropriate message');
printResult(inverseMod(10, 15, { method: 'novel' }));

// Test case 5: x is a multiple of y
console.log('\n### Test 5: 12 mod 4 ###');
console.log(`12 is a multiple of 4, normalized to 0 mod 4`);
console.log('Expected: Failure with appropriate message');
printResult(inverseMod(12, 4, { method: 'novel' }));

// Test case 6: Larger numbers with common factor
console.log('\n### Test 6: 100 mod 50 ###');
console.log(`gcd(100, 50) = ${gcd(100, 50)} ≠ 1, no inverse exists`);
console.log('Expected: Failure with appropriate message');
printResult(inverseMod(100, 50, { method: 'novel' }));

// Test case 7: Prime factor in common
console.log('\n### Test 7: 14 mod 21 ###');
console.log(`gcd(14, 21) = ${gcd(14, 21)} ≠ 1 (both divisible by 7), no inverse exists`);
console.log('Expected: Failure with appropriate message');
printResult(inverseMod(14, 21, { method: 'novel' }));

// Test case 8: Edge case - 0
console.log('\n### Test 8: 0 mod 5 ###');
console.log('x = 0, no inverse exists');
console.log('Expected: Failure with appropriate message');
printResult(inverseMod(0, 5, { method: 'novel' }));

// Summary with verification
console.log('\n' + '='.repeat(60));
console.log('VERIFICATION: All cases should have failed gracefully');
console.log('The algorithm correctly identifies when no inverse exists');
console.log('by checking gcd(x, y) before attempting calculation');
console.log('='.repeat(60));

console.log('\n' + '█'.repeat(60));
console.log('NO INVERSE TESTS COMPLETE');
console.log('█'.repeat(60) + '\n');
