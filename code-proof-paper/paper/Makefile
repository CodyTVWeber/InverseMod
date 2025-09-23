PDF=main.pdf
TEX=main.tex

all: $(PDF)

$(PDF): $(TEX) sections/*.tex references.bib
	latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex

clean:
	latexmk -C
	rm -f $(PDF)

.PHONY: all clean

