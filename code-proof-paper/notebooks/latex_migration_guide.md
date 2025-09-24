# LaTeX to Notebook Migration Guide

This guide helps you understand how your existing LaTeX structure maps to the interactive notebook system and how to migrate content back and forth.

## Structure Mapping

### LaTeX → Notebook Correspondence

| LaTeX File | Notebook Section | Purpose |
|------------|------------------|---------|
| `paper/main.tex` | Complete notebook structure | Overall document organization |
| `sections/abstract.tex` | Abstract section | Problem statement, results |
| `sections/introduction.tex` | Introduction section | Context and motivation |
| `sections/related.tex` | Related Work section | Prior work comparison |
| `sections/preliminaries.tex` | Preliminaries section | Definitions and foundations |
| `sections/results.tex` | Main Results section | Theorems and claims |
| `sections/strategy.tex` | Strategy section | Proof methodology |
| `sections/proofsketch.tex` | Proof Sketch section | Mathematical narrative |
| `sections/implementation.tex` | Implementation section | Technical details |
| `sections/validation.tex` | Validation section | Testing and verification |
| `sections/limitations.tex` | Limitations section | Scope and constraints |
| `sections/discussion.tex` | Discussion section | Future work |
| `sections/conclusion.tex` | Conclusion section | Summary |
| `sections/artifacts.tex` | Code integration areas | Reproducibility |

## Current LaTeX Content

Based on your existing files, here's what you have:

### Abstract (`sections/abstract.tex`)
```latex
\begin{abstract}
We present a proof in which the core logical obligations are discharged by executable code. The paper follows standard mathematical exposition while linking each claim to code artifacts and tests. This dual presentation improves transparency, reproducibility, and auditability of the argument.
\end{abstract}
```

**Migration to Notebook:**
Copy this into the Abstract writing area and expand with:
- Specific problem statement
- Precise main results
- Quantitative claims (validate with code)
- Key limitations

### Introduction (`sections/introduction.tex`)
```latex
This work explores a code-backed approach to rigorous proof. We motivate the setting, summarize contributions, and outline how executable artifacts complement the traditional narrative.
```

**Migration to Notebook:**
This is a good start. Expand with:
- Mathematical context of your specific problem
- Why traditional proofs are insufficient
- Detailed contribution list
- Paper roadmap

### Existing Paper Structure (`paper/main.tex`)
Your LaTeX structure is well-organized:

```latex
\section{Introduction}
\input{sections/introduction}

\section{Related Work}
\input{sections/related}

\section{Preliminaries and Definitions}
\input{sections/preliminaries}

\section{Main Results}
\input{sections/results}

\section{Code-Backed Proof Strategy}
\input{sections/strategy}

\section{Formal Proof Sketch}
\input{sections/proofsketch}

\section{Implementation Details}
\input{sections/implementation}

\section{Validation and Testing}
\input{sections/validation}

\section{Limitations}
\input{sections/limitations}

\section{Discussion and Future Work}
\input{sections/discussion}

\section{Conclusion}
\input{sections/conclusion}
```

This maps perfectly to the notebook sections!

## Migration Workflow

### Phase 1: Notebook → Content Development
1. **Use the notebook** to develop content for each section
2. **Integrate your algorithms** to validate claims as you write
3. **Build up substantial content** in each writing area
4. **Test and refine** your code integrations

### Phase 2: Content → LaTeX Transfer
When ready to submit:

1. **Copy writing area content** to corresponding `.tex` files
2. **Convert code snippets** to LaTeX format
3. **Add mathematical notation** using LaTeX commands
4. **Update references** and citations

### Detailed Migration Steps

#### Step 1: Transfer Abstract
```bash
# From notebook Abstract writing area
# Copy content to:
nano /workspace/code-proof-paper/paper/sections/abstract.tex
```

**Example transformation:**
```
Notebook: "We present a code-backed approach to proving modular inverse existence..."

LaTeX: 
\begin{abstract}
We present a code-backed approach to proving modular inverse existence...
\end{abstract}
```

#### Step 2: Transfer Introduction  
```bash
nano /workspace/code-proof-paper/paper/sections/introduction.tex
```

**Add mathematical notation:**
```
Notebook: "For integers a and m where gcd(a,m) = 1..."

LaTeX: "For integers $a$ and $m$ where $\gcd(a,m) = 1$..."
```

#### Step 3: Convert Code Snippets
**Notebook code:**
```javascript
function modularInverse(a, m) {
    // Extended Euclidean algorithm
    return result;
}
```

**LaTeX equivalent:**
```latex
\begin{algorithm}
\caption{Modular Inverse Computation}
\begin{algorithmic}
\Function{ModularInverse}{$a, m$}
    \Comment{Extended Euclidean algorithm}
    \State \Return $result$
\EndFunction
\end{algorithmic}
\end{algorithm}
```

Or using listings:
```latex
\begin{lstlisting}[language=JavaScript, caption=Modular Inverse Implementation]
function modularInverse(a, m) {
    // Extended Euclidean algorithm
    return result;
}
\end{lstlisting}
```

#### Step 4: Mathematical Notation Conversion

**Common conversions:**

| Notebook Text | LaTeX Equivalent |
|---------------|------------------|
| `gcd(a,b)` | `$\gcd(a,b)$` |
| `a ≡ b (mod m)` | `$a \equiv b \pmod{m}$` |
| `O(log n)` | `$O(\log n)$` |
| `a^(-1)` | `$a^{-1}$` |
| `∀ a ∈ Z` | `$\forall a \in \mathbb{Z}$` |
| `∃ x` | `$\exists x$` |

#### Step 5: Reference Integration
Add to `paper/references.bib`:

```bibtex
@article{your_algorithm_paper,
    title={Your Algorithm Title},
    author={Your Name},
    journal={Target Journal},
    year={2025},
    note={Code available at: \url{https://github.com/yourrepo}}
}
```

## Code Integration Conversion

### Notebook Code → LaTeX Artifacts

#### Test Results → Tables
**Notebook output:**
```javascript
{
  "testCases": 1000,
  "passed": 998,
  "failureRate": 0.002,
  "averageTime": 1.5
}
```

**LaTeX table:**
```latex
\begin{table}[h]
\centering
\begin{tabular}{lr}
\toprule
Metric & Value \\
\midrule
Test Cases & 1000 \\
Passed & 998 \\
Failure Rate & 0.2\% \\
Average Time (ms) & 1.5 \\
\bottomrule
\end{tabular}
\caption{Algorithm Validation Results}
\label{tab:validation}
\end{table}
```

#### Complexity Analysis → Figures
**Notebook analysis:**
```javascript
const complexityData = analyzeComplexity();
// Generates: [{size: 100, time: 1.2}, {size: 1000, time: 15.3}, ...]
```

**LaTeX figure:**
```latex
\begin{figure}[h]
\centering
\includegraphics[width=0.8\textwidth]{figures/complexity_analysis.pdf}
\caption{Algorithm complexity: runtime vs input size}
\label{fig:complexity}
\end{figure}
```

## Automation Scripts

### Script 1: Extract Notebook Content
```bash
#!/bin/bash
# extract_content.sh - Extract content from saved notebook

# This would parse the localStorage JSON and extract text content
echo "Extracting content from notebook save data..."

# You can manually export from the notebook interface
# or write a script to parse the JSON structure
```

### Script 2: Build Complete Paper
```bash
#!/bin/bash
# build_paper.sh - Build final LaTeX paper

cd /workspace/code-proof-paper/paper/
make clean
make all

echo "Paper built successfully!"
echo "Output: main.pdf"
```

### Script 3: Sync Notebook ↔ LaTeX
```bash
#!/bin/bash
# sync_content.sh - Bidirectional sync between notebook and LaTeX

# Notebook → LaTeX
echo "Syncing notebook content to LaTeX..."
# Implementation would extract from notebook JSON

# LaTeX → Notebook  
echo "Syncing LaTeX content to notebook..."
# Implementation would parse .tex files and populate notebook
```

## Best Practices

### During Notebook Phase
1. **Focus on content development** - don't worry about LaTeX formatting
2. **Use code extensively** - validate every claim you can
3. **Write substantial content** - aim for complete sections
4. **Test algorithms thoroughly** - the code is part of your proof

### During Migration Phase
1. **Preserve mathematical rigor** - ensure notation is precise
2. **Convert code appropriately** - use algorithm environments or listings
3. **Maintain traceability** - link claims to code artifacts
4. **Update references** - ensure all citations are complete

### Final Polish
1. **Check mathematical notation** - ensure consistency
2. **Verify code artifacts** - all referenced code should be available
3. **Test reproducibility** - ensure others can run your code
4. **Proofread thoroughly** - academic writing standards apply

## Specific Integration Points

### Your Modular Inverse Algorithms
Your existing implementations can be integrated at multiple points:

1. **Introduction**: Demonstrate problem complexity
2. **Implementation**: Detail your algorithm improvements  
3. **Validation**: Show correctness and performance testing
4. **Artifacts**: Provide complete reproduction instructions

### Your Complexity Analysis
Your CSV data files can be used for:

1. **Results section**: Performance validation
2. **Implementation**: Complexity analysis
3. **Validation**: Empirical verification
4. **Figures**: Visual performance comparison

### Your AI Analysis
The AI-generated insights can inform:

1. **Related Work**: Comparison with automated approaches
2. **Strategy**: Novel verification methodologies
3. **Discussion**: Future directions for AI-assisted proofs
4. **Limitations**: Boundaries of automated verification

## Example Complete Migration

Here's how a complete section might look:

### Notebook Version (Implementation Section)
```
Writing Area:
"Our implementation uses the extended Euclidean algorithm with optimizations 
for performance. The algorithm achieves O(log min(a,m)) complexity..."

Code Area:
function modularInverse(a, m) {
    const result = extendedGCD(a, m);
    if (result.gcd !== 1) throw new Error("No inverse exists");
    return ((result.x % m) + m) % m;
}

Output:
Complexity validation: [{size: 100, time: 1.2}, {size: 1000, time: 15.3}]
```

### LaTeX Version
```latex
\section{Implementation Details}

Our implementation uses the extended Euclidean algorithm with optimizations 
for performance. The algorithm achieves $O(\log \min(a,m))$ complexity.

\begin{algorithm}
\caption{Modular Inverse Computation}
\begin{algorithmic}
\Function{ModularInverse}{$a, m$}
    \State $result \gets \Call{ExtendedGCD}{a, m}$
    \If{$result.gcd \neq 1$}
        \State \textbf{throw} \text{"No inverse exists"}
    \EndIf
    \State \Return $((result.x \bmod m) + m) \bmod m$
\EndFunction
\end{algorithmic}
\end{algorithm}

Performance validation confirms the theoretical complexity bounds, as shown 
in Table~\ref{tab:complexity}.

\begin{table}[h]
\centering
\begin{tabular}{rr}
\toprule
Input Size & Time (ms) \\
\midrule
100 & 1.2 \\
1,000 & 15.3 \\
\bottomrule
\end{tabular}
\caption{Complexity Validation Results}
\label{tab:complexity}
\end{table}
```

## Final Checklist

Before submitting your paper, ensure:

- [ ] All notebook content has been migrated to LaTeX
- [ ] Mathematical notation is properly formatted
- [ ] Code artifacts are appropriately presented
- [ ] All claims are supported by executable validation
- [ ] References are complete and properly formatted
- [ ] Figures and tables are properly captioned and referenced
- [ ] The paper builds successfully with `make`
- [ ] All code artifacts are accessible and documented
- [ ] Reproduction instructions are complete

This migration approach allows you to leverage the interactive development environment while producing a publication-ready LaTeX paper. The key is to use the notebook for development and the LaTeX system for final presentation.