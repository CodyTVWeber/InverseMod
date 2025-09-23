/**
 * Simple test for InverseMod algorithm
 */

// Test specific cases
console.log("=== Manual Algorithm Analysis ===\n");

// Test case: 5 mod 12
console.log("Testing 5 mod 12:");
console.log("Expected: 5 (since 5*5 = 25 ≡ 1 mod 12)");

let x = 5, y = 12;
let k = [];
let r = [];

// First k value
let k1 = Math.floor(y / x) + 1; // 12/5 = 2 + 1 = 3
k.push(k1);
r.push((x * k1) % y); // (5*3) % 12 = 15 % 12 = 3
console.log(`k1 = ${k1}, r1 = ${r[0]}`);

let n = 1;
while (r[n-1] > 1) {
    let nextK = Math.floor(y / r[n-1]) + 1; // 12/3 = 4 + 1 = 5
    k.push(nextK);
    r.push((r[n-1] * nextK) % y); // (3*5) % 12 = 15 % 12 = 3
    console.log(`k${n+1} = ${nextK}, r${n+1} = ${r[n]}`);
    n++;

    if (n > 10) break; // Safety
}

let z = 1;
for (let i = 0; i < k.length; i++) {
    z *= k[i];
}
z = z % y;
console.log(`z = ${z}`);
console.log(`Validation: ${(z * x) % y} === 1? ${((z * x) % y) === 1}`);

console.log("\n=== Analysis ===");
console.log("Issues identified:");
console.log("1. Remainders are not decreasing properly");
console.log("2. Algorithm gets stuck in loops");
console.log("3. k-value calculation doesn't ensure bounds");