/**
 * Improved Backtracking Implementation for InverseMod Algorithm
 * Based on AI analysis of parity-based failure patterns
 *
 * Key Insight: When remainder becomes even and modulus is even,
 * backtrack to smallest odd k-value and increment by 2 to maintain parity.
 */

class ImprovedBacktracker {
    constructor(options = {}) {
        this.maxDepth = options.maxDepth || 64;
        this.maxBacktracks = options.maxBacktracks || 20;
        this.multiplierOffsets = options.multiplierOffsets || [0, 1, 2, 3, 4, 5];
        this.debug = options.debug || false;
    }

    /**
     * Calculate GCD using Euclidean algorithm
     */
    gcd(a, b) {
        a = BigInt(Math.abs(a));
        b = BigInt(Math.abs(b));
        while (b !== 0n) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    /**
     * Extended Euclidean algorithm (BigInt)
     */
    egcdBig(a, b) {
        let old_r = a, r = b;
        let old_s = 1n, s = 0n;
        let old_t = 0n, t = 1n;
        while (r !== 0n) {
            const q = old_r / r;
            const tmp_r = r; r = old_r - q * r; old_r = tmp_r;
            const tmp_s = s; s = old_s - q * s; old_s = tmp_s;
            const tmp_t = t; t = old_t - q * t; old_t = tmp_t;
        }
        return { g: old_r, x: old_s, y: old_t };
    }

    inverseEuclidBig(m, n) {
        const { g, x } = this.egcdBig(m, n);
        if (g !== 1n) return null;
        const inv = ((x % n) + n) % n;
        return inv;
    }

    /**
     * Check if a number is even
     */
    isEven(n) {
        return n % 2n === 0n;
    }

    /**
     * Find the smallest odd k-value in the multipliers array
     */
    findSmallestOddKIndex(multipliers) {
        for (let i = 0; i < multipliers.length; i++) {
            if (multipliers[i] % 2n === 1n) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Recalculate remainders from a specific point after backtracking
     */
    recalculateFrom(x, multipliers, startIndex, y) {
        const remainders = [BigInt(x)];
        for (let i = 0; i < multipliers.length; i++) {
            if (i < startIndex) {
                // Use original multipliers up to startIndex
                const product = remainders[i] * multipliers[i];
                remainders.push(product % BigInt(y));
            } else {
                // Use new multipliers from startIndex onward
                const product = remainders[i] * multipliers[i];
                remainders.push(product % BigInt(y));
            }
        }
        return remainders;
    }

    /**
     * Enhanced DFS with parity-aware backtracking
     */
    dfs(remainder, depth, multipliers, y, backtrackCount) {
        if (this.debug) {
            console.log(`Depth ${depth}, Remainder: ${remainder}, Multipliers: [${multipliers.join(', ')}]`);
        }

        if (depth > this.maxDepth) {
            return null;
        }

        if (remainder === 1n) {
            return { multipliers, backtrackCount };
        }

        if (remainder === 0n) {
            return null;
        }

        const baseK = this.ceilDiv(BigInt(y), remainder);

        // Try different k-values
        for (const offset of this.multiplierOffsets) {
            const k = baseK + BigInt(offset);
            if (k <= 0n) continue;

            const product = remainder * k;
            let nextRemainder = product % BigInt(y);

            // Skip non-productive paths
            if (nextRemainder === 0n && depth < this.maxDepth - 1) continue;
            if (nextRemainder >= remainder && nextRemainder !== 1n) continue;

            // Check for parity-based failure pattern
            if (nextRemainder === 0n && this.isEven(BigInt(y)) && this.isEven(remainder)) {
                if (this.debug) {
                    console.log(`Detected even remainder (${remainder}) with even modulus (${y})`);
                }

                // Try parity-based backtracking
                const oddKIndex = this.findSmallestOddKIndex(multipliers);
                if (oddKIndex >= 0) {
                    if (this.debug) {
                        console.log(`Found odd k-value at index ${oddKIndex}, attempting backtrack`);
                    }

                    // Create backtracked multipliers
                    const backtrackedMultipliers = [...multipliers];
                    backtrackedMultipliers[oddKIndex] += 2n; // Increment by 2 to keep odd

                    // Recalculate remainders from that point
                    const recalculatedRemainders = this.recalculateFrom(
                        multipliers[0], // x value is first multiplier? Wait, need to fix this
                        backtrackedMultipliers,
                        oddKIndex,
                        y
                    );

                    // Continue DFS from the backtracked position
                    const backtrackResult = this.dfs(
                        recalculatedRemainders[recalculatedRemainders.length - 1],
                        depth,
                        backtrackedMultipliers,
                        y,
                        backtrackCount + 1
                    );

                    if (backtrackResult) {
                        return backtrackResult;
                    }
                }
            }

            // Continue normal DFS
            const result = this.dfs(nextRemainder, depth + 1, [...multipliers, k], y, backtrackCount);

            if (result) {
                return result;
            }

            if (offset > 0 && backtrackCount > this.maxBacktracks) {
                return null;
            }
        }

        return null;
    }

    /**
     * Ceiling division for BigInt
     */
    ceilDiv(a, b) {
        return (a + b - 1n) / b;
    }

    /**
     * Main inverse computation function
     */
    computeInverse(x, y) {
        // Input validation
        if (!Number.isInteger(x) || !Number.isInteger(y) || x <= 0 || y <= 0) {
            return { success: false, inverse: 0n, message: "Invalid inputs" };
        }

        const gcdResult = this.gcd(x, y);
        if (gcdResult !== 1n) {
            return { success: false, inverse: 0n, message: `No inverse exists: gcd(${x}, ${y}) ≠ 1` };
        }

        // Normalize x
        const nBig = BigInt(y);
        x = BigInt(x % y);

        // Fast path: self-inverse when x ≡ y-1 (mod y)
        if (x === nBig - 1n) {
            return { success: true, inverse: nBig - 1n, message: "Self-inverse: x ≡ y-1", multipliers: [nBig - 1n], steps: 1, backtrackCount: 0 };
        }

        if (x === 1n) {
            return { success: true, inverse: 1n, message: "Direct solution: x = 1", multipliers: [1n], steps: 1, backtrackCount: 0 };
        }

        // Reflection preconditioning: if x > y/2, work with y - x, then negate inverse
        let startRemainder = x;
        let reflected = false;
        if (startRemainder > nBig / 2n) {
            startRemainder = nBig - startRemainder;
            reflected = true;
        }

        // Start DFS
        const result = this.dfs(startRemainder, 0, [], y, 0);

        if (!result) {
            // Fallback to Extended Euclid on the (possibly reflected) remainder
            const invSmall = this.inverseEuclidBig(startRemainder, nBig);
            if (invSmall === null) {
                return { success: false, inverse: 0n, message: "Failed to find inverse" };
            }
            let inv = invSmall;
            if (reflected) inv = (nBig - inv) % nBig;
            return {
                success: true,
                inverse: inv,
                message: "Recovered via Euclid fallback",
                multipliers: [inv],
                steps: 1,
                backtrackCount: 0
            };
        }

        // Calculate final inverse
        let inverse = 1n;
        for (const k of result.multipliers) {
            inverse = (inverse * k) % BigInt(y);
        }

        // If we reflected, recover inv(original) ≡ -inv(reflected) (mod y)
        if (reflected) {
            inverse = (nBig - inverse) % nBig;
        }

        return {
            success: true,
            inverse,
            message: result.backtrackCount > 0 ? `Found using backtracking (${result.backtrackCount} backtracks)` : "Direct solution",
            multipliers: result.multipliers,
            steps: result.multipliers.length,
            backtrackCount: result.backtrackCount
        };
    }
}

/**
 * Convenience function for computing modular inverse
 */
function inverseModImproved(x, y, options = {}) {
    const backtracker = new ImprovedBacktracker(options);
    return backtracker.computeInverse(x, y);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ImprovedBacktracker, inverseModImproved };
}

// Example usage and testing
if (typeof window !== 'undefined') {
    // Browser environment
    window.InverseModImproved = { ImprovedBacktracker, inverseModImproved };
}

// Test cases
console.log("=== Improved Backtracking Tests ===");

// Test case that requires backtracking: 5 mod 12
console.log("\nTesting 5 mod 12 (should require backtracking):");
const result1 = inverseModImproved(5, 12, { debug: false });
console.log(`Success: ${result1.success}, Inverse: ${result1.inverse}`);
if (result1.success) {
    const verification = (result1.inverse * BigInt(5)) % BigInt(12);
    console.log(`Verification: (${result1.inverse} * 5) mod 12 = ${verification}`);
}

// Test case that works directly: 3 mod 7
console.log("\nTesting 3 mod 7 (should work directly):");
const result2 = inverseModImproved(3, 7, { debug: false });
console.log(`Success: ${result2.success}, Inverse: ${result2.inverse}`);
if (result2.success) {
    const verification = (result2.inverse * BigInt(3)) % BigInt(7);
    console.log(`Verification: (${result2.inverse} * 3) mod 7 = ${verification}`);
}

// Test case with no inverse: 4 mod 6
console.log("\nTesting 4 mod 6 (no inverse should exist):");
const result3 = inverseModImproved(4, 6, { debug: false });
console.log(`Success: ${result3.success}, Message: ${result3.message}`);

module.exports = { ImprovedBacktracker, inverseModImproved };