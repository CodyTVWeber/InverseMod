from __future__ import annotations

import itertools

from code.src.proof.spec import verify_property, ProofResult


class AlwaysTrueProperty:
    def check(self, candidate) -> bool:
        return True


def infinite_zeros():
    while True:
        yield 0


def test_verify_property_passes_on_trivial_case():
    result: ProofResult = verify_property("trivial", AlwaysTrueProperty(), infinite_zeros(), num_trials=10)
    assert result.passed is True
    assert result.name == "trivial"

