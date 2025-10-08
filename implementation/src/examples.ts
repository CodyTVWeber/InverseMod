/**
 * Example usage of the Forward Method
 * Demonstrates various cases and how to interpret results
 */

import { inverseMod, formatResult, getAlgorithmExplanation } from './inverse-mod';

console.log('Forward Method - Example Usage');
console.log('====================================\n');

// Print algorithm explanation
console.log(getAlgorithmExplanation());
console.log('\n' + '='.repeat(60) + '\n');

// Example 1: Simple case that works directly
console.log('Example 1: Finding inverse of 3 mod 7');
console.log('-'.repeat(40));
const result1 = inverseMod(3, 7);
console.log(formatResult(result1));
console.log('\n');

// Example 2: Case that requires backtracking (previously failed)
console.log('Example 2: Finding inverse of 5 mod 12 (requires backtracking)');
console.log('-'.repeat(40));
const result2 = inverseMod(5, 12);
console.log(formatResult(result2));
console.log('\n');

// Example 3: Edge case - x = 1
console.log('Example 3: Edge case - inverse of 1 mod 10');
console.log('-'.repeat(40));
const result3 = inverseMod(1, 10);
console.log(formatResult(result3));
console.log('\n');

// Example 4: No inverse exists
console.log('Example 4: No inverse exists - 4 mod 6');
console.log('-'.repeat(40));
const result4 = inverseMod(4, 6);
console.log(formatResult(result4));
console.log('\n');

// Example 5: Large numbers
console.log('Example 5: Large numbers - 12345 mod 67890');
console.log('-'.repeat(40));
const result5 = inverseMod(12345, 67890);
console.log(formatResult(result5));
console.log('\n');

// Example 6: The case from the AI analysis
console.log('Example 6: From AI analysis - 31 mod 37');
console.log('-'.repeat(40));
const result6 = inverseMod(31, 37);
console.log(formatResult(result6));
console.log('\n');

// Performance comparison
console.log('Performance Analysis');
console.log('-'.repeat(40));
console.log('Testing 1000 random coprime pairs...\n');

let directCount = 0;
let backtrackCount = 0;
let totalSteps = 0;
let maxSteps = 0;
const start = Date.now();

for (let i = 0; i < 1000; i++) {
  const x = Math.floor(Math.random() * 1000) + 1;
  const y = Math.floor(Math.random() * 1000) + 2;
  
  // Only test coprime pairs
  let g = x;
  let temp = y;
  while (temp !== 0) {
    const r = g % temp;
    g = temp;
    temp = r;
  }
  
  if (g === 1) {
    const result = inverseMod(x, y);
    if (result.success) {
      if (result.method === 'direct') {
        directCount++;
      } else {
        backtrackCount++;
      }
      totalSteps += result.steps.length;
      maxSteps = Math.max(maxSteps, result.steps.length);
    }
  }
}

const elapsed = Date.now() - start;
const totalTests = directCount + backtrackCount;
const avgSteps = totalTests > 0 ? (totalSteps / totalTests).toFixed(2) : 0;

console.log(`Total coprime pairs tested: ${totalTests}`);
console.log(`Direct solutions: ${directCount} (${((directCount / totalTests) * 100).toFixed(1)}%)`);
console.log(`Backtracking solutions: ${backtrackCount} (${((backtrackCount / totalTests) * 100).toFixed(1)}%)`);
console.log(`Average steps: ${avgSteps}`);
console.log(`Maximum steps: ${maxSteps}`);
console.log(`Time elapsed: ${elapsed}ms`);
console.log(`Average time per inverse: ${(elapsed / totalTests).toFixed(2)}ms`);

// Demonstrate the algorithm's novelty
console.log('\n' + '='.repeat(60));
console.log('Algorithm Novelty');
console.log('='.repeat(60));
console.log(`
This algorithm is fundamentally different from the Extended Euclidean Algorithm:

Extended Euclidean (for 35 mod 12):
- Works backwards from GCD
- 35 = 2(12) + 11
- 12 = 1(11) + 1
- Back-substitution gives inverse

Forward Method (for 35 mod 12):
- Works forward iteratively
- Normalizes: 35 ≡ 11 (mod 12)
- Finds k values with bounded multiplication
- Product of k values gives inverse

The forward-iterative approach with bounded multiplication constraint
y < (x × k) < (x + y) is a novel contribution to computational number theory.
`);