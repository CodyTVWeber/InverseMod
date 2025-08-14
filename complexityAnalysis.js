/**
 * Complexity Analysis for InverseMod Algorithm
 * Author: Verification Analysis
 * Date: August 14, 2025
 * 
 * This script analyzes the computational complexity of the InverseMod algorithm
 * through empirical testing and statistical analysis.
 */

const { inverseMod, inverseModFull } = require('./inverseMod.js');
const { inverseMod: inverseModFixed, inverseModFull: inverseModFullFixed } = require('./inverseModFixed.js');

// Performance measurement utilities
class PerformanceAnalyzer {
    constructor() {
        this.results = [];
    }

    /**
     * Measure the number of iterations for the algorithm
     */
    measureIterations(x, y, implementation = 'original') {
        let iterations = 0;
        let k = [];
        let r = [];
        
        // Normalize x
        let currentX = x % y;
        if (currentX === 0) return { iterations: 0, success: false };
        
        // First iteration
        if (y % currentX === 0) {
            k.push(Math.floor(y / currentX));
        } else {
            k.push(Math.floor(y / currentX) + 1);
        }
        r.push((currentX * k[0]) % y);
        iterations = 1;
        
        // Subsequent iterations
        let n = 1;
        while (r[n - 1] > 1 && n < 100) {
            let prevR = r[n - 1];
            
            if (y % prevR === 0) {
                k.push(Math.floor(y / prevR));
            } else {
                k.push(Math.floor(y / prevR) + 1);
            }
            
            let newR = (prevR * k[n]) % y;
            r.push(newR);
            iterations++;
            
            if (newR === 0) {
                return { iterations, success: false, remainders: r };
            }
            
            n++;
        }
        
        return { 
            iterations, 
            success: r[r.length - 1] === 1,
            remainders: r,
            kValues: k
        };
    }

    /**
     * Analyze complexity for a range of values
     */
    analyzeRange(minY, maxY, samplesPerY = 10) {
        const results = [];
        
        for (let y = minY; y <= maxY; y++) {
            const yResults = {
                y: y,
                samples: [],
                avgIterations: 0,
                maxIterations: 0,
                minIterations: Infinity,
                successRate: 0
            };
            
            // Sample random x values coprime to y
            let validSamples = 0;
            for (let i = 0; i < samplesPerY; i++) {
                const x = Math.floor(Math.random() * (y - 1)) + 1;
                
                // Check if coprime
                if (this.gcd(x, y) === 1) {
                    const result = this.measureIterations(x, y);
                    if (result.success) {
                        yResults.samples.push({
                            x: x,
                            iterations: result.iterations
                        });
                        validSamples++;
                    }
                }
            }
            
            if (validSamples > 0) {
                yResults.successRate = validSamples / samplesPerY;
                const iterations = yResults.samples.map(s => s.iterations);
                yResults.avgIterations = iterations.reduce((a, b) => a + b, 0) / iterations.length;
                yResults.maxIterations = Math.max(...iterations);
                yResults.minIterations = Math.min(...iterations);
                results.push(yResults);
            }
        }
        
        return results;
    }

    /**
     * Analyze relationship between y and iterations
     */
    analyzeComplexityGrowth(results) {
        const analysis = {
            yValues: [],
            avgIterations: [],
            maxIterations: [],
            logY: [],
            sqrtY: [],
            correlations: {}
        };
        
        results.forEach(r => {
            analysis.yValues.push(r.y);
            analysis.avgIterations.push(r.avgIterations);
            analysis.maxIterations.push(r.maxIterations);
            analysis.logY.push(Math.log2(r.y));
            analysis.sqrtY.push(Math.sqrt(r.y));
        });
        
        // Calculate correlations with different complexity classes
        analysis.correlations.linear = this.pearsonCorrelation(analysis.yValues, analysis.avgIterations);
        analysis.correlations.logarithmic = this.pearsonCorrelation(analysis.logY, analysis.avgIterations);
        analysis.correlations.sqrtCorrelation = this.pearsonCorrelation(analysis.sqrtY, analysis.avgIterations);
        
        // Estimate complexity class
        const absCorrelations = {
            'O(n)': Math.abs(analysis.correlations.linear),
            'O(log n)': Math.abs(analysis.correlations.logarithmic),
            'O(√n)': Math.abs(analysis.correlations.sqrtCorrelation)
        };
        
        analysis.likelyComplexity = Object.keys(absCorrelations).reduce((a, b) => 
            absCorrelations[a] > absCorrelations[b] ? a : b
        );
        
        return analysis;
    }

    /**
     * Compare iterations with GCD algorithm
     */
    compareWithGCD(samples = 1000) {
        const results = {
            inverseMod: [],
            extendedGCD: []
        };
        
        for (let i = 0; i < samples; i++) {
            const y = Math.floor(Math.random() * 1000) + 10;
            const x = Math.floor(Math.random() * (y - 1)) + 1;
            
            if (this.gcd(x, y) === 1) {
                // Measure InverseMod iterations
                const invModResult = this.measureIterations(x, y);
                if (invModResult.success) {
                    results.inverseMod.push(invModResult.iterations);
                    
                    // Measure Extended GCD iterations
                    const gcdIterations = this.extendedGCDIterations(x, y);
                    results.extendedGCD.push(gcdIterations);
                }
            }
        }
        
        return {
            avgInverseMod: results.inverseMod.reduce((a, b) => a + b, 0) / results.inverseMod.length,
            avgExtendedGCD: results.extendedGCD.reduce((a, b) => a + b, 0) / results.extendedGCD.length,
            samples: results.inverseMod.length
        };
    }

    /**
     * Analyze worst-case scenarios
     */
    findWorstCases(maxY = 100) {
        const worstCases = [];
        
        for (let y = 2; y <= maxY; y++) {
            let maxIterations = 0;
            let worstX = 0;
            
            for (let x = 1; x < y; x++) {
                if (this.gcd(x, y) === 1) {
                    const result = this.measureIterations(x, y);
                    if (result.success && result.iterations > maxIterations) {
                        maxIterations = result.iterations;
                        worstX = x;
                    }
                }
            }
            
            if (maxIterations > 0) {
                worstCases.push({
                    x: worstX,
                    y: y,
                    iterations: maxIterations,
                    ratio: maxIterations / Math.log2(y)
                });
            }
        }
        
        // Sort by iteration count
        worstCases.sort((a, b) => b.iterations - a.iterations);
        
        return worstCases;
    }

    // Helper functions
    gcd(a, b) {
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    extendedGCDIterations(a, b) {
        let iterations = 0;
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
            iterations++;
        }
        return iterations;
    }

    pearsonCorrelation(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
        const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
        const sumY2 = y.reduce((total, yi) => total + yi * yi, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    }
}

// Run the analysis
function runComplexityAnalysis() {
    console.log('=== InverseMod Algorithm Complexity Analysis ===\n');
    
    const analyzer = new PerformanceAnalyzer();
    
    // 1. Analyze complexity growth
    console.log('1. Analyzing Complexity Growth (y = 10 to 1000)...');
    const rangeResults = analyzer.analyzeRange(10, 1000, 20);
    const growthAnalysis = analyzer.analyzeComplexityGrowth(rangeResults);
    
    console.log('\nComplexity Growth Analysis:');
    console.log(`- Likely complexity class: ${growthAnalysis.likelyComplexity}`);
    console.log(`- Correlation with O(n): ${growthAnalysis.correlations.linear.toFixed(3)}`);
    console.log(`- Correlation with O(log n): ${growthAnalysis.correlations.logarithmic.toFixed(3)}`);
    console.log(`- Correlation with O(√n): ${growthAnalysis.correlations.sqrtCorrelation.toFixed(3)}`);
    
    // 2. Compare with Extended GCD
    console.log('\n2. Comparing with Extended GCD Algorithm...');
    const comparison = analyzer.compareWithGCD(1000);
    console.log(`- Average InverseMod iterations: ${comparison.avgInverseMod.toFixed(2)}`);
    console.log(`- Average Extended GCD iterations: ${comparison.avgExtendedGCD.toFixed(2)}`);
    console.log(`- Ratio: ${(comparison.avgInverseMod / comparison.avgExtendedGCD).toFixed(2)}x`);
    
    // 3. Find worst cases
    console.log('\n3. Finding Worst-Case Scenarios...');
    const worstCases = analyzer.findWorstCases(100);
    console.log('Top 10 worst cases:');
    worstCases.slice(0, 10).forEach((wc, i) => {
        console.log(`  ${i + 1}. ${wc.x} mod ${wc.y}: ${wc.iterations} iterations (${wc.ratio.toFixed(2)}x log₂(y))`);
    });
    
    // 4. Statistical analysis
    console.log('\n4. Statistical Summary:');
    const allIterations = rangeResults.flatMap(r => r.samples.map(s => s.iterations));
    const mean = allIterations.reduce((a, b) => a + b, 0) / allIterations.length;
    const variance = allIterations.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / allIterations.length;
    const stdDev = Math.sqrt(variance);
    
    console.log(`- Total samples analyzed: ${allIterations.length}`);
    console.log(`- Mean iterations: ${mean.toFixed(2)}`);
    console.log(`- Standard deviation: ${stdDev.toFixed(2)}`);
    console.log(`- Min iterations: ${Math.min(...allIterations)}`);
    console.log(`- Max iterations: ${Math.max(...allIterations)}`);
    
    // 5. Generate CSV data for external analysis
    console.log('\n5. Generating CSV data...');
    generateCSVData(rangeResults, 'complexity_data.csv');
    console.log('Data saved to complexity_data.csv');
    
    return {
        growthAnalysis,
        comparison,
        worstCases,
        statistics: { mean, stdDev, min: Math.min(...allIterations), max: Math.max(...allIterations) }
    };
}

// Generate CSV for external analysis
function generateCSVData(results, filename) {
    const fs = require('fs');
    let csv = 'y,x,iterations,success_rate,avg_iterations,max_iterations,log2_y,sqrt_y\n';
    
    results.forEach(r => {
        r.samples.forEach(s => {
            csv += `${r.y},${s.x},${s.iterations},${r.successRate},${r.avgIterations.toFixed(2)},${r.maxIterations},${Math.log2(r.y).toFixed(3)},${Math.sqrt(r.y).toFixed(3)}\n`;
        });
    });
    
    fs.writeFileSync(filename, csv);
}

// Export for use in other scripts
module.exports = {
    PerformanceAnalyzer,
    runComplexityAnalysis
};

// Run if called directly
if (require.main === module) {
    runComplexityAnalysis();
}