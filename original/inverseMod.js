/**
 * InverseMod Algorithm - JavaScript Implementation
 * Original algorithm by Cody Weber (2022)
 * 
 * This algorithm finds the modular multiplicative inverse z such that (z * x) mod y = 1
 */

/**
 * Checks for special cases that would prevent finding an inverse
 * @param {number} x - First positive integer
 * @param {number} y - Second positive integer  
 * @returns {Object} - {isSpecialCase: boolean, message: string}
 */
function checkSpecialCases(x, y) {
    let isSpecialCase = false;
    let message = "";

    // Case 1: x or y cannot be 0
    if (x === 0) {
        isSpecialCase = true;
        message += "Error: x cannot be zero.";
    }
    if (y === 0) {
        isSpecialCase = true;
        message += "Error: y cannot be zero.";
    }
    if (isSpecialCase) {
        return { isSpecialCase, message };
    }

    // Case 2: x cannot be a multiple of y
    if (x % y === 0) {
        isSpecialCase = true;
        message += `${x} is a multiple of ${y} which gives z = 0, no inverse`;
    }

    return { isSpecialCase, message };
}

/**
 * Returns explanation of how the inverseMod algorithm works
 * @returns {string} Algorithm explanation
 */
function inverseModExplanation() {
    return `
Here is the algorithm written by Cody Weber

x mod y, where x and y are members of the positive non-zero integers.
z is a member of the positive non-zero integers
k values are a group of values that are members of the non-negative integers.
r values are a group of values that are members of the non-negative integers. The goal is to get the last r value to equal 1, thus finding the inverse.
*Note: This does not always work. There is some tweaking needed to get this algorithm to hit the goal much more often, but I will tweak in later versions.

So steps:
So for x mod y,
1. y < (x * k[1]) < (x + y), ((x * k[1]) % y) = r[1]
2. y < (r[1] * k[2]) < (r[1] + y), ((r[1] * k[2]) % y) = r[2], r[2] < r[1]
...
n. y < (r[n-1] * k[n]) < (r[n-1] + y), ((r[n-1] * k[n]) % y) = r[n] = 1 (or 0 if it did not work)

(k[1] * k[2] * ... * k[n]) mod y = z

Validation step:
(z * x) mod y == 1
`;
}

/**
 * Performs the full inverseMod algorithm with detailed steps
 * @param {number} x - First positive integer
 * @param {number} y - Second positive integer
 * @returns {Object} - {result: string, z: number}
 */
function inverseModFull(x, y) {
    let k = [];
    let r = [];
    let z = 0;

    let result = `\n\nCalculating the inverse of ${x} mod ${y}...\n`;

    // Checking for special cases
    const specialCase = checkSpecialCases(x, y);
    if (specialCase.isSpecialCase) {
        result += specialCase.message;
        return { result, z: 0 };
    }

    // Performing do-while logic
    if (x % y === 0) {
        k.push(Math.floor(y / x));
    } else {
        k.push(Math.floor(y / x) + 1);
    }
    
    r.push((x * k[0]) % y);
    result += `Step 1: ${y} < (${x} * ${k[0]}) < (${y} + ${x}), ((${x} * ${k[0]}) % ${y}) = ${r[0]}\n`;

    let n = 1;
    while (r[n - 1] > 1) {
        // Calculating if multiple comes out to 0 or a non-zero remainder
        if (y % r[n - 1] === 0) {
            k.push(Math.floor(y / r[n - 1]));
        } else {
            k.push(Math.floor(y / r[n - 1]) + 1);
        }

        r.push((r[n - 1] * k[n]) % y);
        result += `Step ${n + 1}: ${y} < (${r[n - 1]} * ${k[n]}) < (${y} + ${r[n - 1]}), ((${r[n - 1]} * ${k[n]}) % ${y}) = ${r[n]}\n`;
        n++;
    }

    z = 1;
    for (const valueK of k) {
        z *= valueK;
    }
    z = z % y;
    result += `(k[1] * k[2] * ... * k[n]) mod y = ${z}\n`;

    result += `\n\nFinal Values:\n`;
    result += `x = ${x}\n`;
    result += `y = ${y}\n`;
    result += `k[] = [${k.join(', ')}]\n`;
    result += `r[] = [${r.join(', ')}]\n`;
    result += `z = ${z}\n`;

    result += `\n\nValidation step:\n`;
    result += `((${z} * ${x}) mod ${y}) == 1 is ${((z * x) % y) === 1}\n`;

    return { result, z };
}

/**
 * Shows the steps of the inverse calculation
 * @param {number} x - First positive integer
 * @param {number} y - Second positive integer
 * @returns {string} Detailed steps
 */
function inverseModSteps(x, y) {
    const { result } = inverseModFull(x, y);
    return result;
}

/**
 * Finds just the answer of the inverse
 * @param {number} x - First positive integer
 * @param {number} y - Second positive integer
 * @returns {number} The modular multiplicative inverse z
 */
function inverseMod(x, y) {
    const { z } = inverseModFull(x, y);
    return z;
}

/**
 * Validates if a number is a positive integer
 * @param {any} value - Value to check
 * @returns {boolean} True if positive integer
 */
function isPositiveInteger(value) {
    const num = parseInt(value);
    return !isNaN(num) && num > 0 && Number.isInteger(num);
}

/**
 * Main function to run the algorithm with input validation
 * @param {string|number} xInput - First number
 * @param {string|number} yInput - Second number
 * @param {boolean} showSteps - Whether to show detailed steps
 * @returns {Object} - {success: boolean, result: string, z: number}
 */
function runInverseMod(xInput, yInput, showSteps = true) {
    // Input validation
    if (!isPositiveInteger(xInput) || !isPositiveInteger(yInput)) {
        return {
            success: false,
            result: "Error: x and y must be positive integers",
            z: 0
        };
    }

    const x = parseInt(xInput);
    const y = parseInt(yInput);

    if (showSteps) {
        const { result, z } = inverseModFull(x, y);
        return { success: true, result, z };
    } else {
        const z = inverseMod(x, y);
        return { success: true, result: `Inverse of ${x} mod ${y} = ${z}`, z };
    }
}

// Export functions for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        inverseMod,
        inverseModSteps,
        inverseModFull,
        inverseModExplanation,
        checkSpecialCases,
        runInverseMod,
        isPositiveInteger
    };
} else if (typeof window !== 'undefined') {
    // Browser environment
    window.InverseMod = {
        inverseMod,
        inverseModSteps,
        inverseModFull,
        inverseModExplanation,
        checkSpecialCases,
        runInverseMod,
        isPositiveInteger
    };
}