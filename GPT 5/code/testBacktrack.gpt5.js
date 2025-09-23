/**
 * Test file for Backtracking InverseMod Algorithm (GPT-5)
 */

const InverseModBacktrack = require('./inverseModBacktrack.gpt5.js');
const InverseModFixed = require('./inverseModFixed.gpt5.js');

function testCase(x, y, expectedZ, testName) {
    console.log(`\n=== ${testName} ===`);
    console.log(`Testing: inverse of ${x} mod ${y}`);
    const res = InverseModBacktrack.runInverseMod(x, y, true);
    console.log(res.result);
    const valid = (res.z * x) % y === 1;
    console.log(`Result z = ${res.z} | valid: ${valid}`);
    if (typeof expectedZ === 'number') {
        console.log(`Expected z = ${expectedZ} | match: ${res.z === expectedZ}`);
    }
}

function stressCompare() {
    console.log("\n=== Stress Compare: Backtrack vs Fixed ===");
    const testValues = [3,5,7,11,13,17,19,23,29,31];
    let fixedSuccess = 0, backtrackSuccess = 0, total = 0;
    for (let i = 0; i < testValues.length; i++) {
        for (let j = i + 1; j < testValues.length; j++) {
            const x = testValues[i];
            const y = testValues[j];
            if (InverseModBacktrack.gcd(x, y) !== 1) continue;
            total++;
            const f = InverseModFixed.runInverseMod(x, y, false);
            const b = InverseModBacktrack.runInverseMod(x, y, false);
            if ((f.z * x) % y === 1) fixedSuccess++;
            if ((b.z * x) % y === 1) backtrackSuccess++;
            if (((f.z * x) % y === 1) !== ((b.z * x) % y === 1)) {
                console.log(`Diff at ${x} mod ${y}: fixed z=${f.z}, backtrack z=${b.z}`);
            }
        }
    }
    console.log(`Fixed success: ${fixedSuccess}/${total}`);
    console.log(`Backtrack success: ${backtrackSuccess}/${total}`);
}

function targetedParityCases() {
    console.log("\n=== Targeted Parity Cases ===");
    // From Claude's example: 5 mod 12 should work and often needs parity handling
    testCase(5, 12, 5, "5 mod 12 parity/backtrack");

    // Even remainder with even modulus progression traps
    testCase(7, 12, 7, "7 mod 12 (coprime, avoid even trap)");
    testCase(11, 14, undefined, "11 mod 14 (even modulus)");

    // Odd remainder mod even modulus cases aiming to avoid gcd-induced zeros
    testCase(9, 20, undefined, "9 mod 20 (even modulus)");

    // More cases similar to 5 mod 12
    // y = 14
    testCase(9, 14, undefined, "9 mod 14 (even modulus)");
    // y = 16
    testCase(5, 16, undefined, "5 mod 16 (even modulus)");
    testCase(7, 16, undefined, "7 mod 16 (even modulus)");
    testCase(9, 16, undefined, "9 mod 16 (even modulus)");
    testCase(11, 16, undefined, "11 mod 16 (even modulus)");
    // y = 18
    testCase(5, 18, undefined, "5 mod 18 (even modulus)");
    testCase(7, 18, undefined, "7 mod 18 (even modulus)");
    testCase(11, 18, undefined, "11 mod 18 (even modulus)");
    testCase(13, 18, undefined, "13 mod 18 (even modulus)");
    // y = 20
    testCase(11, 20, undefined, "11 mod 20 (even modulus)");
    testCase(13, 20, undefined, "13 mod 20 (even modulus)");
    testCase(17, 20, undefined, "17 mod 20 (even modulus)");
}

function main() {
    console.log("=== InverseMod Algorithm - Backtracking Variant Tests ===\n");
    targetedParityCases();
    stressCompare();
}

if (require.main === module) {
    main();
}

