#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if command -v python3 >/dev/null 2>&1; then
	PY=python3
else
	echo "Python3 not found. Please install Python 3.9+" >&2
	exit 1
fi

$PY -m venv "$ROOT_DIR/.venv"
source "$ROOT_DIR/.venv/bin/activate"
python -m pip install --upgrade pip
pip install -r "$ROOT_DIR/requirements.txt"

echo ""
echo "Python environment ready. Activate with: source $ROOT_DIR/.venv/bin/activate"
echo ""
echo "To build the PDF, you need a TeX distribution (e.g., TeX Live) with latexmk, pdflatex, and bibtex."
echo "On Ubuntu/Debian: sudo apt-get update && sudo apt-get install -y texlive-full latexmk"