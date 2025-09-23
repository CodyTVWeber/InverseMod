.PHONY: all paper tests clean

all: paper tests

paper:
	$(MAKE) -C paper

tests:
	bash scripts/setup_node.sh && bash scripts/test.sh

clean:
	$(MAKE) -C paper clean || true
	rm -rf node_modules dist coverage

