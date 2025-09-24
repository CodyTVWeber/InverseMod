# Jupyter + JavaScript (Deno) for Writing the Paper

This folder contains a notebook scaffold to help you outline and write your paper using JavaScript/TypeScript in Jupyter.

- Notebook: `paper-outline.ipynb`
- Recommended kernel: Deno (JavaScript/TypeScript)
- Optional: Node.js via IJavascript

## 1) Install JupyterLab

If you don't have Jupyter yet:

```bash
pip install jupyterlab
```

## 2) Install Deno and the Deno Jupyter kernel (recommended)

Install Deno:

```bash
# Linux/macOS (see https://deno.land for alternatives)
curl -fsSL https://deno.land/install.sh | sh
# Then restart your shell or ensure Deno is on PATH
```

Register the Jupyter kernel:

```bash
deno jupyter --unstable
```

After this, launch JupyterLab and select the "Deno" kernel for the notebook.

```bash
jupyter lab
```

Notes:
- Deno supports both JavaScript and TypeScript out of the box.
- You can import from URLs or npm (e.g., `import * as _ from "npm:lodash";`).

## 3) Optional: Node.js via IJavascript

If you prefer Node.js:

```bash
# Ensure Node.js and npm are installed first
npm install -g ijavascript
ijsinstall
```

Then open JupyterLab and pick the "JavaScript (Node.js)" kernel.

## 4) Open the outline notebook

```bash
jupyter lab notebooks/paper-outline.ipynb
```

Fill in the prompts; keep content in your own words. The notebook only contains guidance checklists and prompts.

## 5) Exporting options (no LaTeX required)

You can export from JupyterLab via the UI (File → Save and Export As) or use the CLI:

- HTML:
```bash
jupyter nbconvert notebooks/paper-outline.ipynb --to html --output paper-outline.html
```

- Markdown (useful to move to Google Docs or a journal template):
```bash
jupyter nbconvert notebooks/paper-outline.ipynb --to markdown --output paper-outline.md
```

- PDF (requires a system PDF exporter; if LaTeX is not installed, try HTML → print to PDF):
```bash
jupyter nbconvert notebooks/paper-outline.ipynb --to pdf --output paper-outline.pdf
```

Tip: If PDF export fails due to missing LaTeX packages, export to HTML first and print to PDF from your browser.

## 6) Quick start

1. Install JupyterLab and Deno
2. Run `deno jupyter --unstable`
3. `jupyter lab` and open `paper-outline.ipynb`
4. Select the Deno kernel
5. Start outlining using the prompts

## Troubleshooting

- Kernel not listed: re-run `deno jupyter --unstable` and restart JupyterLab.
- `deno` not found: ensure your shell PATH includes Deno (see installer output).
- Export errors: try exporting to Markdown/HTML and convert to PDF using your browser.

---
Authorship note: This scaffold helps you structure and write the paper yourself; it does not generate prose.