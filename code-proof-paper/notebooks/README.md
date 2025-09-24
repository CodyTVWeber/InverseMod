# Jupyter with Pure JavaScript (no Python in notebooks)

Use this folder to draft your paper entirely in JavaScript using notebooks.

- Notebook: `paper-outline.ipynb` (prompts only; you write the prose)
- Kernels: JavaScript via JupyterLite (browser, zero install) or local JS kernels (Deno/IJavascript)

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
