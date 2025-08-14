/*
 * Empirical Complexity Analysis for InverseMod (Fixed)
 * Produces CSV of (x,y,steps,success) and prints summary statistics.
 */

const fs = require('fs');
const path = require('path');
const { inverseModStats, gcd } = require('../inverseModFixed');

function analyzeRange(maxY, samplePerY = 0) {
    const rows = [];
    for (let y = 2; y <= maxY; y++) {
        const xs = [];
        if (samplePerY > 0) {
            // sample specific x values relatively prime to y
            let x = 1;
            while (xs.length < samplePerY && x < 5 * samplePerY) {
                if (gcd(x, y) === 1) xs.push(x);
                x++;
            }
            if (xs.length === 0) xs.push(1);
        } else {
            for (let x = 1; x < y; x++) {
                if (gcd(x, y) === 1) xs.push(x);
            }
        }

        for (const x of xs) {
            const { steps, success } = inverseModStats(x, y);
            rows.push({ x, y, steps, success });
        }
    }
    return rows;
}

function writeCsv(rows, outPath) {
    const header = 'x,y,steps,success\n';
    const lines = rows.map(r => `${r.x},${r.y},${r.steps},${r.success ? 1 : 0}`).join('\n');
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
        const succ = arr.filter(r => r.success);
        const avgSteps = arr.reduce((a, b) => a + b.steps, 0) / arr.length;
        const maxSteps = Math.max(...arr.map(r => r.steps));
        const minSteps = Math.min(...arr.map(r => r.steps));
        const successRate = succ.length / arr.length;
        summary.push({ y, avgSteps, maxSteps, minSteps, successRate });
    }

    summary.sort((a, b) => a.y - b.y);
    return summary;
}

function printSummary(summary) {
    console.log('y, avgSteps, maxSteps, minSteps, successRate, log2(y)');
    for (const s of summary) {
        const log2y = Math.log2(s.y);
        console.log(`${s.y}, ${s.avgSteps.toFixed(3)}, ${s.maxSteps}, ${s.minSteps}, ${(s.successRate*100).toFixed(1)}%, ${log2y.toFixed(3)}`);
    }
}

function main() {
    const maxY = parseInt(process.argv[2] || '200', 10);
    const sample = parseInt(process.argv[3] || '0', 10); // 0 means full coprime set

    console.log(`Running empirical complexity up to y=${maxY}${sample>0?`, samplePerY=${sample}`:''} ...`);
    const rows = analyzeRange(maxY, sample);

    const outDir = path.join(__dirname, '..', 'out');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    const outPath = path.join(outDir, `complexity_y${maxY}_s${sample}.csv`);
    writeCsv(rows, outPath);
    console.log(`CSV written: ${outPath}`);

    const summary = summarize(rows);
    printSummary(summary);

    // crude linear fit of avgSteps ~ a*log2(y) + b
    const xs = summary.map(s => Math.log2(s.y));
    const ys = summary.map(s => s.avgSteps);
    const n = xs.length;
    const meanX = xs.reduce((a,b)=>a+b,0)/n;
    const meanY = ys.reduce((a,b)=>a+b,0)/n;
    let num = 0, den = 0;
    for (let i=0;i<n;i++) { num += (xs[i]-meanX)*(ys[i]-meanY); den += (xs[i]-meanX)**2; }
    const a = num/den;
    const b = meanY - a*meanX;
    console.log(`\nRegression avgSteps ≈ ${a.toFixed(3)} * log2(y) + ${b.toFixed(3)} (R^2 not computed)`);
}

if (require.main === module) {
    main();
}