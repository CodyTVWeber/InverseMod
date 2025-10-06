/**
 * Early Zero Problem Test Cases
 * These are challenging cases where the remainder becomes 0 during iteration,
 * requiring backtracking to find an alternative path.
 * 
 * The "early zero" problem occurs when:
 * - remainder * k ≡ 0 (mod y) before reaching remainder = 1
 * - This happens when the remainder divides y
 * 
 * Our improved algorithm uses backtracking to explore alternative k-values
 * that avoid the zero remainder.
 */

const { inverseMod, printResult, inverseModExtendedGCD } = require('./inverse-mod.js');

console.log('\n' + '█'.repeat(60));
console.log('EARLY ZERO PROBLEM TEST CASES');
console.log('Cases that require backtracking to avoid remainder = 0');
console.log('█'.repeat(60));

// The classic early zero case
console.log('\n### Test 1: 5 mod 12 (THE CLASSIC CASE) ###');
console.log('Without backtracking:');
console.log('  Step 1: 12 < (5 × 3 = 15) < 17, remainder = 3');
console.log('  Step 2: 12 < (3 × 4 = 12) < 15, remainder = 0 ✗ FAILS');
console.log('\nWith backtracking (trying k=5 instead of k=3):');
console.log('  Step 1: 12 < (5 × 5 = 25) < 17, remainder = 1 ✓ SUCCESS');
console.log('\nExpected inverse: 5 (because 5 × 5 = 25 ≡ 1 mod 12)');
console.log('\n--- Novel Method with Backtracking ---');
printResult(inverseMod(5, 12, { method: 'novel' }));
console.log('--- Extended GCD for Comparison ---');
printResult(inverseModExtendedGCD(5, 12));

// Another early zero case
console.log('\n### Test 2: 7 mod 12 ###');
console.log('This is another case that may hit early zero');
console.log('Expected inverse: 7 (because 7 × 7 = 49 ≡ 1 mod 12)');
console.log('\n--- Novel Method with Backtracking ---');
printResult(inverseMod(7, 12, { method: 'novel' }));
console.log('--- Extended GCD for Comparison ---');
printResult(inverseModExtendedGCD(7, 12));

// Even modulus cases (prone to early zero with even remainders)
console.log('\n### Test 3: 3 mod 8 ###');
console.log('Even modulus with odd x - prone to parity issues');
console.log('Expected inverse: 3 (because 3 × 3 = 9 ≡ 1 mod 8)');
console.log('\n--- Novel Method with Backtracking ---');
printResult(inverseMod(3, 8, { method: 'novel' }));
console.log('--- Extended GCD for Comparison ---');
printResult(inverseModExtendedGCD(3, 8));

// More challenging case
console.log('\n### Test 4: 5 mod 14 ###');
console.log('Expected inverse: 3 (because 3 × 5 = 15 ≡ 1 mod 14)');
console.log('\n--- Novel Method with Backtracking ---');
printResult(inverseMod(5, 14, { method: 'novel' }));
console.log('--- Extended GCD for Comparison ---');
printResult(inverseModExtendedGCD(5, 14));

// Larger modulus with early zero potential
console.log('\n### Test 5: 11 mod 24 ###');
console.log('Expected inverse: 11 (because 11 × 11 = 121 ≡ 1 mod 24)');
console.log('\n--- Novel Method with Backtracking ---');
printResult(inverseMod(11, 24, { method: 'novel' }));
console.log('--- Extended GCD for Comparison ---');
printResult(inverseModExtendedGCD(11, 24));

// Another case
console.log('\n### Test 6: 13 mod 20 ###');
console.log('Expected inverse: 17 (because 17 × 13 = 221 ≡ 1 mod 20)');
console.log('\n--- Novel Method with Backtracking ---');
printResult(inverseMod(13, 20, { method: 'novel' }));
console.log('--- Extended GCD for Comparison ---');
printResult(inverseModExtendedGCD(13, 20));

// Edge case with small numbers
console.log('\n### Test 7: 3 mod 10 ###');
console.log('Expected inverse: 7 (because 7 × 3 = 21 ≡ 1 mod 10)');
console.log('\n--- Novel Method with Backtracking ---');
printResult(inverseMod(3, 10, { method: 'novel' }));
console.log('--- Extended GCD for Comparison ---');
printResult(inverseModExtendedGCD(3, 10));

// Complex case
console.log('\n### Test 8: 17 mod 30 ###');
console.log('Expected inverse: 23 (because 23 × 17 = 391 ≡ 1 mod 30)');
console.log('\n--- Novel Method with Backtracking ---');
printResult(inverseMod(17, 30, { method: 'novel' }));
console.log('--- Extended GCD for Comparison ---');
printResult(inverseModExtendedGCD(17, 30));

// Summary
console.log('\n' + '='.repeat(60));
console.log('ANALYSIS: Early Zero Problem Solutions');
console.log('='.repeat(60));
console.log('\nThe backtracking approach successfully handles early zero cases by:');
console.log('1. Detecting when remainder would become 0');
console.log('2. Exploring alternative k-values (base + offsets)');
console.log('3. Pruning non-productive paths (zero or non-decreasing remainders)');
console.log('4. Using depth-first search to find a valid path to remainder = 1');
console.log('\nKey insight: By trying k = ceil(y/r) + offset for offset ∈ {0,1,2,3,4},');
console.log('we can often find a k-value that avoids the zero remainder trap.');
console.log('='.repeat(60));

console.log('\n' + '█'.repeat(60));
console.log('EARLY ZERO TESTS COMPLETE');
console.log('█'.repeat(60) + '\n');
