/**
 * Improved Backtracking Implementation for Forward Method
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
        this.recordTrace = options.recordTrace || false;
        this.maxNodes = options.maxNodes || 25000; // hard cap on explored nodes
        this._nodesVisited = 0;
        this._initialX = 0n;
        this.trace = [];
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
     * Apply multipliers sequentially starting from an initial remainder
     * Returns the final remainder.
     */
    applyMultipliers(initialRemainder, multipliers, y) {
        let remainder = BigInt(initialRemainder);
        for (const k of multipliers) {
            remainder = (remainder * k) % BigInt(y);
        }
        return remainder;
    }

    /**
     * Enhanced DFS with parity-aware backtracking
     */
    dfs(remainder, depth, multipliers, y, backtrackCount, counters) {
        if (this.debug) {
            console.log(`Depth ${depth}, Remainder: ${remainder}, Multipliers: [${multipliers.join(', ')}]`);
        }

        if (depth > this.maxDepth) {
            if (this.recordTrace) this.trace.push({ type: 'limit', reason: 'maxDepth', depth });
            return null;
        }

        if (remainder === 1n) {
            if (this.recordTrace) this.trace.push({ type: 'success', depth, multipliers: [...multipliers], backtrackCount });
            return { multipliers, backtrackCount };
        }

        if (remainder === 0n) {
            if (this.recordTrace) this.trace.push({ type: 'dead_end', depth, remainder });
            return null;
        }

        // Global node cap to prevent hangs
        this._nodesVisited++;
        if (this._nodesVisited > this.maxNodes) {
            if (this.recordTrace) this.trace.push({ type: 'limit', reason: 'maxNodes', visited: this._nodesVisited });
            return null;
        }

        const baseK = this.ceilDiv(BigInt(y), remainder);

        // Try different k-values
        for (const offset of this.multiplierOffsets) {
            const k = baseK + BigInt(offset);
            if (k <= 0n) continue;

            const product = remainder * k;
            let nextRemainder = product % BigInt(y);

            // Count an attempt for this k evaluation
            if (counters) counters.forwardAttempts++;

            // Skip non-productive paths
            if (nextRemainder === 0n && depth < this.maxDepth - 1) continue;
            if (nextRemainder >= remainder && nextRemainder !== 1n) continue;

            if (this.recordTrace) {
                this.trace.push({
                    type: 'step',
                    depth,
                    remainder,
                    k: k,
                    product,
                    nextRemainder
                });
            }

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

                    // Recompute remainder after applying updated multipliers from initial remainder
                    const recalculatedRemainder = this.applyMultipliers(this._initialX, backtrackedMultipliers, y);

                    if (this.recordTrace) {
                        this.trace.push({
                            type: 'parity_backtrack',
                            depth,
                            oddKIndex,
                            updatedK: backtrackedMultipliers[oddKIndex],
                            resultingRemainder: recalculatedRemainder
                        });
                    }

                    // Continue DFS from the backtracked position
                    const backtrackResult = this.dfs(
                        recalculatedRemainder,
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
            const result = this.dfs(nextRemainder, depth + 1, [...multipliers, k], y, backtrackCount, counters);

            if (result) {
                return result;
            }

            // Branch failed, count a backtrack and check limits
            if (offset >= 0) {
                backtrackCount += 1;
                if (this.recordTrace) this.trace.push({ type: 'backtrack', depth, kTried: k, newBacktrackCount: backtrackCount });
                if (backtrackCount > this.maxBacktracks) {
                    if (this.recordTrace) this.trace.push({ type: 'limit', reason: 'maxBacktracks', count: backtrackCount });
                    return null;
                }
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
        this._initialX = x;
        this._nodesVisited = 0;
        if (this.recordTrace) this.trace = [];

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
        const counters = { forwardAttempts: 0 };
        const result = this.dfs(startRemainder, 0, [], y, 0, counters);

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
                backtrackCount: 0,
                forwardAttempts: counters.forwardAttempts,
                euclidIterations: undefined
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

        const response = {
            success: true,
            inverse,
            message: result.backtrackCount > 0 ? `Found using backtracking (${result.backtrackCount} backtracks)` : "Direct solution",
            multipliers: result.multipliers,
            steps: result.multipliers.length,
            backtrackCount: result.backtrackCount,
            forwardAttempts: counters.forwardAttempts
        };

        if (this.recordTrace) {
            response.trace = this.trace;
        }

        return response;
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

// Self-test only when executed directly
if (require.main === module) {
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
}

module.exports = { ImprovedBacktracker, inverseModImproved };