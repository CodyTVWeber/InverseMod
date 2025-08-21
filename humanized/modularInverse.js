/**
 * Humanized Modular Inverse Module
 *
 * Goal: Given integers base and modulus, find inverse such that
 * (inverse * base) % modulus === 1, if it exists.
 *
 * This implementation follows Cody Weber's k-multiplier/remainder iteration idea
 * with practical safeguards and bounded backtracking.
 *
 * Design principles applied:
 * - Clear, descriptive names (no single-letter r/k)
 * - Guard clauses and explicit edge handling
 * - Bounded search with small, explainable heuristics
 * - Self-documenting code and structured result objects
 */

/**
 * Compute the greatest common divisor using the standard Euclidean algorithm.
 * Returns a non-negative integer.
 */
function computeGreatestCommonDivisor(a, b) {
	let valueA = Math.abs(a);
	let valueB = Math.abs(b);
	while (valueB !== 0) {
		const remainder = valueA % valueB;
		valueA = valueB;
		valueB = remainder;
	}
	return valueA;
}

/**
 * Compute the ceiling of division (as integer) for positive integers.
 */
function ceilDiv(numerator, denominator) {
	return Math.floor((numerator + denominator - 1) / denominator);
}

/**
 * Attempt to find a modular inverse using the k-multiplier heuristic with bounded backtracking.
 *
 * High-level idea:
 * - Start with currentValue = base % modulus
 * - Choose multiplier so that currentValue * multiplier > modulus (ceil(modulus/currentValue))
 * - Update remainder = (currentValue * multiplier) % modulus; iterate until remainder === 1
 * - If we get remainder === 0 or remainder does not decrease, backtrack and try slightly larger multipliers
 *
 * The search explores multiplier choices with small offsets (e.g., +0, +1, +2, +3), and backtracks up to a depth.
 */
function findInverseWithBacktracking(base, modulus, options = {}) {
	const settings = {
		maxDepth: options.maxDepth ?? 64,
		maxNodes: options.maxNodes ?? 2000,
		multiplierOffsets: options.multiplierOffsets ?? [0, 1, 2, 3],
		progressRequired: true,
	};

	const normalizedBase = ((base % modulus) + modulus) % modulus;
	if (normalizedBase === 0) {
		return { found: false, inverse: 0, multipliers: [], remainders: [0], exploredNodes: 0 };
	}
	if (normalizedBase === 1) {
		return { found: true, inverse: 1, multipliers: [1], remainders: [1], exploredNodes: 1 };
	}

	let exploredNodes = 0;

	// Depth-first search over multiplier choices
	function dfs(currentRemainder, depth, chosenMultipliers, remainderHistory) {
		if (exploredNodes >= settings.maxNodes) {
			return null;
		}
		exploredNodes++;

		if (currentRemainder === 1) {
			return { multipliers: chosenMultipliers.slice(), remainders: remainderHistory.slice() };
		}
		if (depth >= settings.maxDepth) {
			return null;
		}

		const baseMultiplier = ceilDiv(modulus, currentRemainder);

		for (const offset of settings.multiplierOffsets) {
			const multiplier = baseMultiplier + offset;
			// Guard: multiplier must be positive
			if (multiplier <= 0) continue;

			const nextRemainder = (currentRemainder * multiplier) % modulus;

			// Avoid obviously hopeless branches
			if (nextRemainder === 0) {
				continue;
			}
			if (settings.progressRequired && nextRemainder >= currentRemainder) {
				continue;
			}

			const result = dfs(
				nextRemainder,
				depth + 1,
				[...chosenMultipliers, multiplier],
				[...remainderHistory, nextRemainder]
			);
			if (result) return result;
		}
		return null;
	}

	const initialRemainder = normalizedBase;
	const searchResult = dfs(initialRemainder, 0, [], [initialRemainder]);
	if (!searchResult) {
		return { found: false, inverse: 0, multipliers: [], remainders: [initialRemainder], exploredNodes };
	}

	// Compute the inverse as the product of multipliers modulo modulus
	let inverse = 1;
	for (const multiplier of searchResult.multipliers) {
		inverse = (inverse * multiplier) % modulus;
	}
	return { found: true, inverse, multipliers: searchResult.multipliers, remainders: searchResult.remainders, exploredNodes };
}

/**
 * Public API: compute the modular inverse using heuristic search only.
 *
 * Returns an object:
 * {
 *   success: boolean,
 *   inverse: number | null,
 *   method: 'heuristic' | 'none',
 *   details: { multipliers, remainders, exploredNodes } | null
 * }
 */
function computeModularInverse(base, modulus, options = {}) {
	// Validate inputs
	if (!Number.isInteger(base) || !Number.isInteger(modulus) || modulus <= 0) {
		return { success: false, inverse: null, method: 'none', details: null, reason: 'Inputs must be integers with modulus > 0' };
	}

	// If gcd > 1, inverse does not exist
	const gcd = computeGreatestCommonDivisor(base, modulus);
	if (gcd !== 1) {
		return { success: false, inverse: null, method: 'none', details: null, reason: `No inverse exists; gcd(${base}, ${modulus}) = ${gcd}` };
	}

	// Heuristic with backtracking only
	const heuristic = findInverseWithBacktracking(base, modulus, options);
	if (heuristic.found) {
		return {
			success: true,
			inverse: heuristic.inverse,
			method: 'heuristic',
			details: {
				multipliers: heuristic.multipliers,
				remainders: heuristic.remainders,
				exploredNodes: heuristic.exploredNodes
			}
		};
	}

	return { success: false, inverse: null, method: 'none', details: null, reason: 'Heuristic search did not find an inverse within bounds' };
}

/**
 * Convenience: compute only the inverse or null.
 */
function modularInverse(base, modulus, options = {}) {
	const result = computeModularInverse(base, modulus, options);
	return result.success ? result.inverse : null;
}

/**
 * Pretty explanation of the heuristic process for a given input.
 */
function explainHeuristicRun(base, modulus, options = {}) {
	const gcd = computeGreatestCommonDivisor(base, modulus);
	if (gcd !== 1) {
		return `No inverse exists because gcd(${base}, ${modulus}) = ${gcd}`;
	}
	const attempt = findInverseWithBacktracking(base, modulus, options);
	let lines = [];
	lines.push(`Calculating inverse of ${base} mod ${modulus}...`);
	if (!attempt.found) {
		lines.push(`Heuristic search failed after exploring ${attempt.exploredNodes} nodes.`);
		return lines.join('\n');
	}
	lines.push(`Heuristic found a solution after exploring ${attempt.exploredNodes} nodes.`);
	lines.push(`Remainders: ${attempt.remainders.join(' -> ')}`);
	lines.push(`Multipliers: ${attempt.multipliers.join(' × ')}`);
	lines.push(`Inverse = (product of multipliers) mod ${modulus} = ${attempt.inverse}`);
	lines.push(`Validation: (${attempt.inverse} * ${base}) % ${modulus} = ${(attempt.inverse * base) % modulus}`);
	return lines.join('\n');
}

module.exports = {
	computeGreatestCommonDivisor,
	computeModularInverse,
	modularInverse,
	explainHeuristicRun,
	findInverseWithBacktracking,
	ceilDiv
};