/**
 * InverseMod Algorithm - Enhanced Implementation
 * Original algorithm by Cody Weber (2022)
 * 
 * This is an improved version incorporating all learnings from AI analysis.
 * It uses a hybrid approach combining the original k-multiplier iteration
 * with intelligent backtracking and alternative strategies.
 */

/**
 * Compute GCD using Euclidean algorithm
 */
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

/**
 * Ceiling division for positive integers
 */
function ceilDiv(numerator, denominator) {
    return Math.floor((numerator + denominator - 1) / denominator);
}

/**
 * Basic k-value calculation (original approach)
 * Find k such that: y < (remainder * k) < (remainder + y)
 */
function calculateBaseK(remainder, modulus) {
    return ceilDiv(modulus, remainder);
}

/**
 * Forward-iterative approach with depth-first search and backtracking
 * This addresses the "early zero" problem by exploring multiple k-value paths
 */
function inverseModWithSearch(x, y, options = {}) {
    const settings = {
        maxDepth: options.maxDepth || 64,
        maxNodes: options.maxNodes || 50000,
        multiplierOffsets: options.multiplierOffsets || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        enablePruning: options.enablePruning !== false,
        allowNonDecreasing: options.allowNonDecreasing || false
    };

    // Validate inputs
    if (!Number.isInteger(x) || !Number.isInteger(y) || x <= 0 || y <= 0) {
        return {
            success: false,
            inverse: 0,
            message: "Invalid inputs: x and y must be positive integers",
            steps: []
        };
    }

    // Check if inverse exists
    if (gcd(x, y) !== 1) {
        return {
            success: false,
            inverse: 0,
            message: `No inverse exists: gcd(${x}, ${y}) = ${gcd(x, y)} ≠ 1`,
            steps: []
        };
    }

    // Normalize x
    const normalizedX = x % y;
    if (normalizedX === 0) {
        return {
            success: false,
            inverse: 0,
            message: "x is a multiple of y",
            steps: []
        };
    }

    if (normalizedX === 1) {
        return {
            success: true,
            inverse: 1,
            message: "Direct solution: x = 1",
            multipliers: [],
            remainders: [1],
            steps: ["x = 1, therefore inverse = 1"],
            exploredNodes: 1
        };
    }

    let exploredNodes = 0;
    const steps = [];

    /**
     * Depth-first search exploring different k-value choices
     */
    function dfs(currentRemainder, depth, multipliers, remainders) {
        if (exploredNodes >= settings.maxNodes) {
            return null;
        }
        exploredNodes++;

        // Success condition
        if (currentRemainder === 1) {
            return { multipliers: [...multipliers], remainders: [...remainders] };
        }

        // Depth limit
        if (depth >= settings.maxDepth) {
            return null;
        }

        // Calculate base k-value
        const baseK = calculateBaseK(currentRemainder, y);

        // Try different k-value offsets (this is the backtracking/search)
        for (const offset of settings.multiplierOffsets) {
            const k = baseK + offset;
            
            // Guard: k must be positive
            if (k <= 0) continue;

            // Calculate next remainder
            const product = currentRemainder * k;
            const nextRemainder = product % y;

            // Pruning strategies
            if (settings.enablePruning) {
                // Avoid zero remainders (this is the "early zero" problem)
                if (nextRemainder === 0) {
                    continue;
                }

                // Avoid non-decreasing remainders (no progress)
                // But allow it if explicitly enabled (for harder cases)
                if (!settings.allowNonDecreasing && nextRemainder >= currentRemainder) {
                    continue;
                }
            }

            // Recursively explore this path
            const result = dfs(
                nextRemainder,
                depth + 1,
                [...multipliers, k],
                [...remainders, nextRemainder]
            );

            if (result) {
                return result;
            }
        }

        return null;
    }

    // Start search with strict pruning
    let searchResult = dfs(normalizedX, 0, [], [normalizedX]);

    // If failed, try again with relaxed constraints (allow some non-decreasing remainders)
    if (!searchResult && !settings.allowNonDecreasing) {
        exploredNodes = 0;
        settings.allowNonDecreasing = true;
        searchResult = dfs(normalizedX, 0, [], [normalizedX]);
    }

    if (!searchResult) {
        return {
            success: false,
            inverse: 0,
            message: `Failed to find inverse after exploring ${exploredNodes} nodes`,
            steps: [],
            exploredNodes
        };
    }

    // Calculate inverse from multipliers
    let inverse = 1;
    for (const k of searchResult.multipliers) {
        inverse = (inverse * k) % y;
    }

    // Build step-by-step explanation
    let currentVal = normalizedX;
    steps.push(`Starting with x = ${normalizedX} mod ${y}`);
    
    for (let i = 0; i < searchResult.multipliers.length; i++) {
        const k = searchResult.multipliers[i];
        const nextR = searchResult.remainders[i + 1];
        const product = currentVal * k;
        steps.push(
            `Step ${i + 1}: ${y} < (${currentVal} × ${k} = ${product}) < ${currentVal + y}, ` +
            `remainder = ${product} mod ${y} = ${nextR}`
        );
        currentVal = nextR;
    }

    steps.push(`Multipliers: [${searchResult.multipliers.join(', ')}]`);
    steps.push(`Inverse = (${searchResult.multipliers.join(' × ')}) mod ${y} = ${inverse}`);
    steps.push(`Verification: (${inverse} × ${normalizedX}) mod ${y} = ${(inverse * normalizedX) % y}`);

    return {
        success: true,
        inverse,
        message: exploredNodes > 1 ? "Found using backtracking search" : "Direct solution",
        multipliers: searchResult.multipliers,
        remainders: searchResult.remainders,
        steps,
        exploredNodes
    };
}

/**
 * Extended Euclidean Algorithm (fallback method)
 * This is the standard approach for comparison
 */
function inverseModExtendedGCD(x, y) {
    if (gcd(x, y) !== 1) {
        return {
            success: false,
            inverse: 0,
            message: `No inverse exists: gcd(${x}, ${y}) ≠ 1`,
            steps: []
        };
    }

    const steps = [];
    let [oldR, r] = [x, y];
    let [oldS, s] = [1, 0];
    let [oldT, t] = [0, 1];

    steps.push(`Starting Extended GCD for ${x} mod ${y}`);

    while (r !== 0) {
        const quotient = Math.floor(oldR / r);
        [oldR, r] = [r, oldR - quotient * r];
        [oldS, s] = [s, oldS - quotient * s];
        [oldT, t] = [t, oldT - quotient * t];
        
        steps.push(`q = ${quotient}, r = ${r}, s = ${s}, t = ${t}`);
    }

    let inverse = oldS;
    if (inverse < 0) {
        inverse = ((inverse % y) + y) % y;
    }

    steps.push(`Inverse = ${inverse}`);
    steps.push(`Verification: (${inverse} × ${x}) mod ${y} = ${(inverse * x) % y}`);

    return {
        success: true,
        inverse,
        message: "Extended Euclidean Algorithm",
        steps
    };
}

/**
 * Hybrid approach: Try the novel method first, fallback to Extended GCD
 */
function inverseMod(x, y, options = {}) {
    const useHybrid = options.hybrid !== false;
    const method = options.method || 'auto'; // 'auto', 'novel', 'extgcd'

    if (method === 'extgcd') {
        return inverseModExtendedGCD(x, y);
    }

    if (method === 'novel' || method === 'auto') {
        const result = inverseModWithSearch(x, y, options);
        
        if (result.success) {
            return result;
        }

        // Fallback to Extended GCD if novel method fails and hybrid is enabled
        if (useHybrid && method === 'auto') {
            const extGcdResult = inverseModExtendedGCD(x, y);
            extGcdResult.message = `Novel method failed, used Extended GCD fallback`;
            return extGcdResult;
        }

        return result;
    }

    throw new Error(`Unknown method: ${method}`);
}

/**
 * Pretty print the result
 */
function printResult(result) {
    console.log('\n' + '='.repeat(60));
    if (result.success) {
        console.log(`✓ SUCCESS: Inverse found = ${result.inverse}`);
        console.log(`Method: ${result.message}`);
        if (result.exploredNodes) {
            console.log(`Explored nodes: ${result.exploredNodes}`);
        }
        if (result.multipliers) {
            console.log(`Multipliers: [${result.multipliers.join(', ')}]`);
            console.log(`Steps taken: ${result.multipliers.length}`);
        }
    } else {
        console.log(`✗ FAILED: ${result.message}`);
    }
    
    if (result.steps && result.steps.length > 0) {
        console.log('\nStep-by-step:');
        result.steps.forEach(step => console.log(`  ${step}`));
    }
    console.log('='.repeat(60) + '\n');
}

// Export functions
module.exports = {
    inverseMod,
    inverseModWithSearch,
    inverseModExtendedGCD,
    gcd,
    ceilDiv,
    calculateBaseK,
    printResult
};

// Allow running from command line
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Usage: node inverse-mod.js <x> <y> [options]');
        console.log('Options:');
        console.log('  --method=novel|extgcd|auto  (default: auto)');
        console.log('  --no-hybrid                 (disable fallback)');
        process.exit(1);
    }

    const x = parseInt(args[0]);
    const y = parseInt(args[1]);
    
    const options = {};
    for (let i = 2; i < args.length; i++) {
        if (args[i].startsWith('--method=')) {
            options.method = args[i].split('=')[1];
        } else if (args[i] === '--no-hybrid') {
            options.hybrid = false;
        }
    }

    const result = inverseMod(x, y, options);
    printResult(result);
}
