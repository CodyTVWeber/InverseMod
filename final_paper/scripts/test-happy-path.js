/**
 * Happy Path Test Cases
 * These are cases where the algorithm works smoothly without backtracking
 */

const { inverseMod, printResult } = require('./inverse-mod.js');

console.log('\n' + '█'.repeat(60));
console.log('HAPPY PATH TEST CASES');
console.log('Cases where the algorithm succeeds without extensive backtracking');
console.log('█'.repeat(60));

// Test case 1: Simple case
console.log('\n### Test 1: 3 mod 7 ###');
console.log('Expected: 5 (because 5 × 3 = 15 ≡ 1 mod 7)');
printResult(inverseMod(3, 7, { method: 'novel' }));

// Test case 2: Another simple case
console.log('\n### Test 2: 7 mod 11 ###');
console.log('Expected: 8 (because 8 × 7 = 56 ≡ 1 mod 11)');
printResult(inverseMod(7, 11, { method: 'novel' }));

// Test case 3: Larger numbers
console.log('\n### Test 3: 17 mod 23 ###');
console.log('Expected: 19 (because 19 × 17 = 323 ≡ 1 mod 23)');
printResult(inverseMod(17, 23, { method: 'novel' }));

// Test case 4: x = 1 edge case (trivial inverse)
console.log('\n### Test 4: 1 mod 10 ###');
console.log('Expected: 1 (trivial case)');
printResult(inverseMod(1, 10, { method: 'novel' }));

// Test case 5: x = y - 1 (always has inverse = y - 1)
console.log('\n### Test 5: 6 mod 7 ###');
console.log('Expected: 6 (because 6 × 6 = 36 ≡ 1 mod 7)');
printResult(inverseMod(6, 7, { method: 'novel' }));

// Test case 6: Coprime pairs
console.log('\n### Test 6: 31 mod 37 ###');
console.log('Expected: 6 (because 6 × 31 = 186 ≡ 1 mod 37)');
printResult(inverseMod(31, 37, { method: 'novel' }));

// Test case 7: Another working case
console.log('\n### Test 7: 8 mod 5 (normalized to 3 mod 5) ###');
console.log('Expected: 2 (because 2 × 3 = 6 ≡ 1 mod 5)');
printResult(inverseMod(8, 5, { method: 'novel' }));

// Test case 8: Medium sized numbers
console.log('\n### Test 8: 123 mod 257 ###');
printResult(inverseMod(123, 257, { method: 'novel' }));

// Summary
console.log('\n' + '█'.repeat(60));
console.log('HAPPY PATH TESTS COMPLETE');
console.log('█'.repeat(60) + '\n');
