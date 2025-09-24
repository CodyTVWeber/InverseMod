/**
 * InverseMod Algorithm - GPT-5 Backtracking Variant
 * Based on Cody Weber's algorithm with parity-aware backtracking inspired by Claude notes
 *
 * Goal: Improve success rate by detecting parity traps (even remainder with even modulus leading to 0)
 * and backtracking to the earliest odd k, incrementing it by 2 to change parity and avoid r = 0.
 */

/**
 * Simple GCD function
 */
function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

/**
 * Extended Euclidean algorithm to find the correct inverse for validation
 */
function extendedGcd(a, b) {
    if (b === 0) {
        return { x: 1, y: 0, gcd: a };
    }
    const result = extendedGcd(b, a % b);
    return {
        x: result.y,
        y: result.x - Math.floor(a / b) * result.y,
        gcd: result.gcd
    };
}

/**
 * Checks for special cases that would prevent finding an inverse
 * @param {number} x
 * @param {number} y
 * @returns {{isSpecialCase:boolean, message:string}}
 */
function checkSpecialCases(x, y) {
    let isSpecialCase = false;
    let message = "";

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

    if (gcd(x, y) !== 1) {
        isSpecialCase = true;
        message += `${x} and ${y} are not coprime (GCD = ${gcd(x, y)}), no inverse exists`;
    }
    return { isSpecialCase, message };
}

/**
 * Ensure strict lower bound y < (r * k). Upper bound is relaxed to avoid impossibility when r | y.
 */
function normalizeKForBounds(rValue, y, initialK) {
    let k = initialK;
    while (k * rValue <= y) {
        k++;
    }
    return k;
}

/**
 * Compute next k value using the fixed-rule plus bounds normalization.
 */
function computeNextK(rValue, y) {
    let k = Math.floor(y / rValue) + 1;
    return normalizeKForBounds(rValue, y, k);
}

/**
 * Recalculate remainders from start up to current k list.
 * Returns { r, resultLogAppend, failedAtZero:boolean }
 */
function recalcRemaindersWithGivenK(x, y, kList) {
    let r = [];
    let log = "";
    let current = x % y;
    if (current === 0) {
        return { r: [0], resultLogAppend: log, failedAtZero: true };
    }

    for (let i = 0; i < kList.length; i++) {
        const k = normalizeKForBounds(i === 0 ? current : r[i - 1], y, kList[i]);
        kList[i] = k; // persist normalized
        const prevR = i === 0 ? current : r[i - 1];
        const newR = (prevR * k) % y;
        r.push(newR);
        log += `Step ${i + 1}: ${y} < (${prevR} * ${k}) < (${prevR} + ${y}), ((${prevR} * ${k}) % ${y}) = ${newR}\n`;
        if (newR === 0) {
            return { r, resultLogAppend: log, failedAtZero: true };
        }
    }
    return { r, resultLogAppend: log, failedAtZero: false };
}

/**
 * Finds index of earliest odd k in k[] (returns -1 if none)
 */
function findEarliestOddKIndex(kList) {
    for (let i = 0; i < kList.length; i++) {
        if (kList[i] % 2 === 1) return i;
    }
    return -1;
}

/**
 * Try small local adjustments to current k to avoid r = 0 or non-decreasing remainder.
 * Returns { adjustedK, adjustedR } or null if no good adjustment found.
 */
function tryLocalAdjustK(prevR, y, currentK) {
    const maxTweak = 5;
    for (let tweak = 1; tweak <= maxTweak; tweak++) {
        const candidateK = currentK + tweak;
        const candidateR = (prevR * candidateK) % y;
        if (candidateR !== 0 && candidateR < prevR) {
            return { adjustedK: candidateK, adjustedR: candidateR };
        }
    }
    return null;
}

/**
 * InverseMod with parity-aware backtracking
 * @returns {{result:string, z:number}}
 */
function inverseModFull(x, y) {
    let k = [];
    let r = [];
    let z = 0;
    let result = `\n\nCalculating the inverse of ${x} mod ${y}...\n`;

    const special = checkSpecialCases(x, y);
    if (special.isSpecialCase) {
        result += special.message;
        return { result, z: 0 };
    }

    const maxIterations = 200;
    const maxBacktracks = 5;
    let backtrackCount = 0;

    // Initialize
    const xNorm = x % y;
    if (xNorm === 0) {
        result += `${x} is a multiple of ${y}, no inverse exists`;
        return { result, z: 0 };
    }

    // Initial k
    let k1 = Math.floor(y / xNorm);
    if (k1 * xNorm <= y) k1++;
    k1 = normalizeKForBounds(xNorm, y, k1);
    k.push(k1);
    let newR = (xNorm * k1) % y;
    r.push(newR);
    result += `Step 1: ${y} < (${xNorm} * ${k1}) < (${xNorm} + ${y}), ((${xNorm} * ${k1}) % ${y}) = ${newR}\n`;
    if (newR === 0) {
        result += `\nAlgorithm terminated: reached remainder 0, no inverse found\n`;
        return { result, z: 0 };
    }

    let n = 1;
    while (r[n - 1] > 1 && n < maxIterations) {
        const prevR = r[n - 1];
        let kn = computeNextK(prevR, y);
        let tentativeR = (prevR * kn) % y;
        // If immediate failure or stagnation, try local adjustment first
        if (tentativeR === 0 || tentativeR >= prevR || (gcd(prevR, y) > 1 && y % 2 === 0)) {
            const tweak = tryLocalAdjustK(prevR, y, kn);
            if (tweak) {
                kn = tweak.adjustedK;
                tentativeR = tweak.adjustedR;
                result += `Adjusted k locally to ${kn} to avoid trap; new remainder = ${tentativeR}\n`;
            }
        }
        k.push(kn);
        newR = tentativeR;
        r.push(newR);
        result += `Step ${n + 1}: ${y} < (${prevR} * ${kn}) < (${prevR} + ${y}), ((${prevR} * ${kn}) % ${y}) = ${newR}\n`;

        // Parity-aware backtracking trigger: even remainder -> 0 with even modulus
        if (newR === 0 && (y % 2 === 0) && (prevR % 2 === 0) && backtrackCount < maxBacktracks) {
            const idx = findEarliestOddKIndex(k);
            if (idx >= 0) {
                backtrackCount++;
                k[idx] += 2; // keep it odd, move to next odd

                // Recalculate from scratch using current k prefix up to idx
                const kPrefix = k.slice(0, idx + 1);
                const recalc = recalcRemaindersWithGivenK(x, y, kPrefix);
                result += `\nBacktrack ${backtrackCount}: incremented k[${idx + 1}] to ${k[idx]} and recalculated.\n`;
                result += recalc.resultLogAppend;
                if (recalc.failedAtZero) {
                    // Could not fix; continue to try further steps or future backtracks
                    r = recalc.r;
                    n = r.length;
                    continue;
                }

                // Reset to recalculated prefix and continue forward with fresh k choices
                k = kPrefix.slice();
                r = recalc.r.slice();
                n = r.length;
                continue;
            }
        }

        // Generalized backtrack: newR = 0 with gcd(prevR, y) > 1 (covers odd remainder mod even, odd mod odd traps)
        if (newR === 0 && gcd(prevR, y) > 1 && backtrackCount < maxBacktracks) {
            const idx = findEarliestOddKIndex(k);
            if (idx >= 0) {
                backtrackCount++;
                k[idx] += 2;
                const kPrefix = k.slice(0, idx + 1);
                const recalc = recalcRemaindersWithGivenK(x, y, kPrefix);
                result += `\nBacktrack ${backtrackCount} (gcd-based): incremented k[${idx + 1}] to ${k[idx]} and recalculated.\n`;
                result += recalc.resultLogAppend;
                k = kPrefix.slice();
                r = recalc.r.slice();
                n = r.length;
                if (r[r.length - 1] === 0) {
                    // still stuck; continue to attempt further steps
                }
                continue;
            }
        }

        if (newR === 0) {
            result += `\nAlgorithm terminated: reached remainder 0, no inverse found\n`;
            break;
        }

        if (newR >= prevR) {
            result += `\nAlgorithm terminated: remainder not decreasing, may not converge\n`;
            break;
        }
        n++;
    }

    if (r[r.length - 1] === 1) {
        z = 1;
        for (const valueK of k) {
            z *= valueK;
        }
        z = z % y;
        result += `(k[1] * k[2] * ... * k[n]) mod y = ${z}\n`;
    } else {
        z = 0;
        result += `\nAlgorithm failed to find inverse: final remainder = ${r[r.length - 1]}\n`;
        const eg = extendedGcd(x, y);
        if (eg.gcd === 1) {
            let inv = eg.x % y;
            if (inv < 0) inv += y;
            result += `\nNote: Correct inverse (extended Euclidean) = ${inv}\n`;
        }
    }

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

function inverseModSteps(x, y) {
    const { result } = inverseModFull(x, y);
    return result;
}

function inverseMod(x, y) {
    const { z } = inverseModFull(x, y);
    return z;
}

function isPositiveInteger(value) {
    const num = parseInt(value);
    return !isNaN(num) && num > 0 && Number.isInteger(num);
}

function runInverseMod(xInput, yInput, showSteps = true) {
    if (!isPositiveInteger(xInput) || !isPositiveInteger(yInput)) {
        return { success: false, result: "Error: x and y must be positive integers", z: 0 };
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        inverseMod,
        inverseModSteps,
        inverseModFull,
        runInverseMod,
        isPositiveInteger,
        gcd,
        extendedGcd
    };
} else if (typeof window !== 'undefined') {
    window.InverseModBacktrack = {
        inverseMod,
        inverseModSteps,
        inverseModFull,
        runInverseMod,
        isPositiveInteger,
        gcd,
        extendedGcd
    };
}

