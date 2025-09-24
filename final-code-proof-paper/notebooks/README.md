# 📄 Paper Section: Jupyter Notebook

This directory contains the **educational paper** - a Jupyter notebook that explains and demonstrates mathematical concepts through interactive code examples.

## Purpose

The notebook serves as your **mathematical paper/exposition**:
- Algorithm walkthroughs and explanations
- Interactive code demonstrations
- Problem analysis and edge cases
- Educational examples and visualizations
- Step-by-step reasoning with executable code

## Structure

- **`paper-outline.ipynb`** - Main paper notebook with embedded JavaScript demonstrations
- **`lab/`** - Browser-based JupyterLite setup for easy access

## Relationship to Code

- **Notebook** = **Teaching/Explanation** 📚
  - Shows "how" and "why" with examples
  - Educational demonstrations
  - Interactive exploration

- **Code** (`../code/`) = **Implementation** ⚙️
  - Production algorithms
  - Comprehensive testing
  - Performance optimization
  - Reusable modules

## Workflow

1. **Demonstrate concepts** in the notebook with explanatory code
2. **Reference implementations** from the `../code/` directory when needed
3. **Focus on pedagogy** - make complex ideas accessible
4. **Use executable examples** to validate mathematical claims

## Zero-install (recommended): JupyterLite in your browser

This runs fully in the browser; no Python or local installs.

1) Open the JupyterLite demo in your browser (search for "JupyterLite demo").
2) Create a new notebook with a JavaScript kernel (if available), or upload `paper-outline.ipynb` and change its kernel to JavaScript.
3) Write your content using the prompts.
4) Export:
   - Download as HTML from the JupyterLite menu and print to PDF in your browser, or
   - Save the notebook (`.ipynb`) for later editing.

Note: Some JupyterLite builds may not include a JavaScript kernel by default. If you need a custom JupyterLite build that bundles a JavaScript kernel, I can add a minimal static site here that you can open locally.

## Local JavaScript kernels (requires Jupyter server)

If you are OK with installing a minimal Jupyter server (Python) to host notebooks locally, you can still keep all execution in JavaScript using one of these kernels:

### Option A: Deno kernel (JS/TS)
- Install Deno (see `https://deno.land`)
- Register the kernel:
```bash
deno jupyter --unstable --install
```
- Launch Jupyter (Notebook or Lab), open `paper-outline.ipynb`, and select the Deno kernel.

### Option B: IJavascript kernel (Node.js)
- Install Node.js and npm (see `https://nodejs.org`)
- Install the IJavascript kernel:
```bash
npm install -g ijavascript
ijsinstall
```
- Launch Jupyter, open `paper-outline.ipynb`, and pick the "Javascript (Node.js)" kernel.

## Exporting (without LaTeX)

- From JupyterLite or JupyterLab, export/download as HTML and print to PDF in your browser.
- Alternatively in JupyterLab, use "Save and Export As → HTML". Avoid LaTeX-dependent PDF exporters if you want a Python-free toolchain.

## Workflow tips

- Draft bullets before prose; one idea per paragraph; lead with the takeaway.
- Keep figures/tables readable in grayscale; prefer vector formats.
- Use the checklist in the notebook to track progress.

---
Authorship note: This scaffold helps you structure and write the paper yourself; it does not generate prose.
