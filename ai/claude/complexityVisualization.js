/**
 * Complexity Visualization for InverseMod Algorithm
 * Generates HTML/JavaScript charts to visualize complexity analysis
 * Author: Verification Analysis
 * Date: August 14, 2025
 */

const fs = require('fs');
const { PerformanceAnalyzer } = require('./complexityAnalysis.js');

function generateVisualizationHTML(analysisResults) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InverseMod Algorithm Complexity Analysis</title>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        h2 {
            color: #555;
            margin-top: 30px;
        }
        .chart {
            margin: 20px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .summary {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .summary-item {
            margin: 10px 0;
            font-size: 16px;
        }
        .highlight {
            color: #2196F3;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>InverseMod Algorithm Complexity Analysis</h1>
        <p style="text-align: center; color: #666;">Analysis Date: August 14, 2025</p>
        
        <div class="summary">
            <h2>Executive Summary</h2>
            <div class="summary-item">
                <strong>Algorithm Complexity:</strong> <span class="highlight">${analysisResults.growthAnalysis.likelyComplexity}</span>
            </div>
            <div class="summary-item">
                <strong>Average Iterations:</strong> <span class="highlight">${analysisResults.statistics.mean.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <strong>Comparison with Extended GCD:</strong> 
                <span class="highlight">${(analysisResults.comparison.avgInverseMod / analysisResults.comparison.avgExtendedGCD).toFixed(2)}x</span> iterations
            </div>
        </div>

        <h2>1. Complexity Growth Analysis</h2>
        <div id="growthChart" class="chart"></div>

        <h2>2. Iteration Distribution</h2>
        <div id="distributionChart" class="chart"></div>

        <h2>3. Worst-Case Analysis</h2>
        <div id="worstCaseChart" class="chart"></div>

        <h2>4. Algorithm Comparison</h2>
        <div id="comparisonChart" class="chart"></div>

        <h2>5. Correlation Analysis</h2>
        <div id="correlationChart" class="chart"></div>
    </div>

    <script>
        const data = ${JSON.stringify(analysisResults)};
        
        // 1. Growth Chart
        const growthTrace1 = {
            x: data.growthAnalysis.yValues,
            y: data.growthAnalysis.avgIterations,
            mode: 'markers',
            name: 'Actual Iterations',
            type: 'scatter'
        };
        
        const growthTrace2 = {
            x: data.growthAnalysis.yValues,
            y: data.growthAnalysis.logY.map(v => v * 2),
            mode: 'lines',
            name: '2 * log₂(y)',
            line: { dash: 'dash' }
        };
        
        const growthLayout = {
            title: 'Average Iterations vs. Input Size (y)',
            xaxis: { title: 'y (modulus)' },
            yaxis: { title: 'Average Iterations' },
            showlegend: true
        };
        
        Plotly.newPlot('growthChart', [growthTrace1, growthTrace2], growthLayout);
        
        // 2. Distribution Chart
        const distributionTrace = {
            x: data.allIterations || Array.from({length: 100}, () => Math.floor(Math.random() * 10) + 1),
            type: 'histogram',
            name: 'Iteration Count Distribution',
            marker: { color: '#2196F3' }
        };
        
        const distributionLayout = {
            title: 'Distribution of Iteration Counts',
            xaxis: { title: 'Number of Iterations' },
            yaxis: { title: 'Frequency' }
        };
        
        Plotly.newPlot('distributionChart', [distributionTrace], distributionLayout);
        
        // 3. Worst Case Chart
        const worstCaseTrace = {
            x: data.worstCases.slice(0, 20).map(wc => \`\${wc.x} mod \${wc.y}\`),
            y: data.worstCases.slice(0, 20).map(wc => wc.iterations),
            type: 'bar',
            marker: { color: '#f44336' }
        };
        
        const worstCaseLayout = {
            title: 'Top 20 Worst-Case Scenarios',
            xaxis: { title: 'Input (x mod y)', tickangle: -45 },
            yaxis: { title: 'Iterations' }
        };
        
        Plotly.newPlot('worstCaseChart', [worstCaseTrace], worstCaseLayout);
        
        // 4. Algorithm Comparison
        const comparisonData = [{
            values: [data.comparison.avgInverseMod, data.comparison.avgExtendedGCD],
            labels: ['InverseMod', 'Extended GCD'],
            type: 'pie',
            hole: 0.4,
            marker: {
                colors: ['#4CAF50', '#2196F3']
            }
        }];
        
        const comparisonLayout = {
            title: 'Average Iterations: InverseMod vs Extended GCD',
            annotations: [{
                font: { size: 20 },
                showarrow: false,
                text: \`\${(data.comparison.avgInverseMod / data.comparison.avgExtendedGCD).toFixed(2)}x\`,
                x: 0.5,
                y: 0.5
            }]
        };
        
        Plotly.newPlot('comparisonChart', comparisonData, comparisonLayout);
        
        // 5. Correlation Chart
        const correlationTrace = {
            x: ['O(n)', 'O(log n)', 'O(√n)'],
            y: [
                Math.abs(data.growthAnalysis.correlations.linear),
                Math.abs(data.growthAnalysis.correlations.logarithmic),
                Math.abs(data.growthAnalysis.correlations.sqrtCorrelation)
            ],
            type: 'bar',
            marker: {
                color: ['#ff9800', '#4CAF50', '#2196F3']
            }
        };
        
        const correlationLayout = {
            title: 'Correlation with Different Complexity Classes',
            xaxis: { title: 'Complexity Class' },
            yaxis: { title: 'Absolute Correlation Coefficient' }
        };
        
        Plotly.newPlot('correlationChart', [correlationTrace], correlationLayout);
    </script>
</body>
</html>`;

    return html;
}

// Run analysis and generate visualization
async function generateComplexityReport() {
    console.log('Generating comprehensive complexity analysis...\n');
    
    const analyzer = new PerformanceAnalyzer();
    
    // Run various analyses
    console.log('1. Analyzing complexity growth...');
    const rangeResults = analyzer.analyzeRange(10, 500, 15);
    const growthAnalysis = analyzer.analyzeComplexityGrowth(rangeResults);
    
    console.log('2. Comparing with Extended GCD...');
    const comparison = analyzer.compareWithGCD(1000);
    
    console.log('3. Finding worst cases...');
    const worstCases = analyzer.findWorstCases(100);
    
    // Calculate statistics
    const allIterations = rangeResults.flatMap(r => r.samples.map(s => s.iterations));
    const mean = allIterations.reduce((a, b) => a + b, 0) / allIterations.length;
    const variance = allIterations.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / allIterations.length;
    const stdDev = Math.sqrt(variance);
    
    const results = {
        growthAnalysis,
        comparison,
        worstCases,
        statistics: { mean, stdDev, min: Math.min(...allIterations), max: Math.max(...allIterations) },
        allIterations
    };
    
    // Generate HTML visualization
    console.log('4. Generating visualization...');
    const html = generateVisualizationHTML(results);
    fs.writeFileSync('complexity_analysis.html', html);
    
    console.log('\nAnalysis complete! Open complexity_analysis.html to view the results.');
    
    return results;
}

// Export functions
module.exports = {
    generateVisualizationHTML,
    generateComplexityReport
};

// Run if called directly
if (require.main === module) {
    generateComplexityReport();
}