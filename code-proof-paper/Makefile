.PHONY: all paper tests clean

all: paper tests

paper:
	$(MAKE) -C paper

tests:
	bash scripts/test.sh

clean:
	$(MAKE) -C paper clean || true
	rm -rf .venv

