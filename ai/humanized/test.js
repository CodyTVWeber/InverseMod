const assert = require('assert');
const path = require('path');

const Human = require('./modularInverse.js');
const Original = require('../inverseMod.js');
const Fixed = require('../inverseModFixed.js');

function expectInverse(moduleName, inverseFn, x, y, expected) {
	const inv = inverseFn(x, y);
	const valid = inv !== null && (inv * x) % y === 1;
	console.log(`${moduleName}: inverse(${x}, ${y}) = ${inv} -> valid=${valid}`);
	if (expected !== null) {
		assert.strictEqual(inv, expected, `${moduleName} expected ${expected} got ${inv}`);
	}
	if (inv !== null) assert.strictEqual((inv * x) % y, 1, `${moduleName} validation failed`);
}

function run() {
	console.log('=== Humanized Modular Inverse Tests ===');

	// Coprime easy cases
	expectInverse('Human', (x,y)=>Human.modularInverse(x,y), 3, 7, 5);
	expectInverse('Human', (x,y)=>Human.modularInverse(x,y), 8, 5, 2);
	expectInverse('Human', (x,y)=>Human.modularInverse(x,y), 31, 37, 6);

	// Edge: x = 1
	expectInverse('Human', (x,y)=>Human.modularInverse(x,y), 1, 10, 1);

	// Parity trap: 5 mod 12 should be 5
	expectInverse('Human', (x,y)=>Human.modularInverse(x,y), 5, 12, 5);

	// Compare vs original and fixed for a sample
	const samples = [
		{ x: 5, y: 12 },
		{ x: 31, y: 37 },
		{ x: 17, y: 23 },
		{ x: 7, y: 11 }
	];
	for (const {x,y} of samples) {
		const human = Human.modularInverse(x,y);
		const orig = Original.inverseMod(x,y);
		const fix = Fixed.inverseMod(x,y);
		console.log(`Compare ${x} mod ${y}: human=${human}, original=${orig}, fixed=${fix}`);
	}

	// Non-coprime cases: should return null in humanized
	const noInverse = [ {x:4,y:6}, {x:2,y:4}, {x:9,y:15} ];
	for (const {x,y} of noInverse) {
		const res = Human.computeModularInverse(x,y);
		assert.strictEqual(res.success, false);
		assert.strictEqual(res.inverse, null);
		console.log(`No inverse as expected for ${x} mod ${y} (${res.reason})`);
	}

	console.log('All humanized tests passed.');
}

if (require.main === module) run();