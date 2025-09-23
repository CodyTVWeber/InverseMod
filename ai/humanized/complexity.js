const fs = require('fs');
const path = require('path');

const Original = require('../inverseMod.js');
const Fixed = require('../inverseModFixed.js');
const Human = require('./modularInverse.js');

function runOne(x, y) {
	function runOriginal() {
		const z = Original.inverseMod(x,y);
		const success = (z * x) % y === 1;
		return { steps: null, success, z };
	}
	function runFixed() {
		const s = Fixed.inverseModFull(x,y);
		const stepMatches = s.result.match(/Step \d+:/g) || [];
		const steps = stepMatches.length;
		const success = ((s.z * x) % y) === 1;
		return { steps, success, z: s.z };
	}
	function runHuman() {
		const r = Human.computeModularInverse(x,y);
		return { steps: (r.details ? r.details.remainders.length : null), success: r.success, z: r.inverse };
	}
	return { original: runOriginal(), fixed: runFixed(), human: runHuman() };
}

function analyze(maxY = 200, samplePerY = 0) {
	const rows = [];
	for (let y=2; y<=maxY; y++) {
		const xs = [];
		if (samplePerY > 0) {
			let x = 1;
			while (xs.length < samplePerY && x < 10*samplePerY) {
				if (Human.computeGreatestCommonDivisor(x,y) === 1) xs.push(x);
				x++;
			}
			if (xs.length === 0) xs.push(1);
		} else {
			for (let x=1; x<y; x++) if (Human.computeGreatestCommonDivisor(x,y) === 1) xs.push(x);
		}
		for (const x of xs) {
			const r = runOne(x,y);
			rows.push({ x,y,
				orig_success: r.original.success ? 1:0,
				fix_success: r.fixed.success ? 1:0,
				human_success: r.human.success ? 1:0,
				fix_steps: r.fixed.steps ?? '',
				human_steps: r.human.steps ?? ''
			});
		}
	}
	return rows;
}

function writeCsv(rows, outPath) {
	const header = 'x,y,orig_success,fix_success,human_success,fix_steps,human_steps\n';
	const lines = rows.map(r => `${r.x},${r.y},${r.orig_success},${r.fix_success},${r.human_success},${r.fix_steps},${r.human_steps}`).join('\n');
	fs.writeFileSync(outPath, header + lines);
}

function summarize(rows) {
	const byY = new Map();
	for (const r of rows) {
		if (!byY.has(r.y)) byY.set(r.y, []);
		byY.get(r.y).push(r);
	}
	const summary = [];
	for (const [y, arr] of byY.entries()) {
		const n = arr.length;
		const origSuccess = arr.reduce((a,b)=>a+b.orig_success,0) / n;
		const fixSuccess = arr.reduce((a,b)=>a+b.fix_success,0) / n;
		const humanSuccess = arr.reduce((a,b)=>a+b.human_success,0) / n;
		const fixStepsVals = arr.map(a=>a.fix_steps).filter(v=>v!==''), humanStepsVals = arr.map(a=>a.human_steps).filter(v=>v!=='');
		const avgFixSteps = fixStepsVals.length? (fixStepsVals.reduce((a,b)=>a+b,0)/fixStepsVals.length): null;
		const avgHumanSteps = humanStepsVals.length? (humanStepsVals.reduce((a,b)=>a+b,0)/humanStepsVals.length): null;
		summary.push({ y, origSuccess, fixSuccess, humanSuccess, avgFixSteps, avgHumanSteps });
	}
	summary.sort((a,b)=>a.y-b.y);
	return summary;
}

function main() {
	const maxY = parseInt(process.argv[2] || '200', 10);
	const sample = parseInt(process.argv[3] || '0', 10);
	console.log(`Analyzing up to y=${maxY} samplePerY=${sample} ...`);
	const rows = analyze(maxY, sample);
	const outPath = path.join(__dirname, 'complexity.csv');
	writeCsv(rows, outPath);
	console.log(`CSV written: ${outPath}`);
	const summary = summarize(rows);
	console.log('y, origSuccess, fixSuccess, humanSuccess, avgFixSteps, avgHumanSteps, log2y');
	for (const s of summary) {
		console.log(`${s.y}, ${(s.origSuccess*100).toFixed(1)}%, ${(s.fixSuccess*100).toFixed(1)}%, ${(s.humanSuccess*100).toFixed(1)}%, ${s.avgFixSteps??''}, ${s.avgHumanSteps??''}, ${Math.log2(s.y).toFixed(3)}`);
	}
}

if (require.main === module) main();