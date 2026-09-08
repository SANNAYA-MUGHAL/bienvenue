"""
Unit tests for SM-2 Algorithm and Contrastive Pedagogical Rule Engine.
"""

from datetime import date
from backend.app.pedagogy.srs import calculate_sm2
from backend.app.pedagogy.rule_engine import ContrastiveRuleEngine

def test_sm2_initial_correct_review():
    state = calculate_sm2(repetition_number=0, ease_factor=2.5, interval_days=0, quality=5, current_date=date(2026, 9, 8))
    assert state.repetition_number == 1
    assert state.interval_days == 1
    assert state.next_review_date == "2026-09-09"
    assert state.ease_factor == 2.6

def test_sm2_second_correct_review():
    state = calculate_sm2(repetition_number=1, ease_factor=2.6, interval_days=1, quality=4, current_date=date(2026, 9, 8))
    assert state.repetition_number == 2
    assert state.interval_days == 6
    assert state.next_review_date == "2026-09-14"

def test_sm2_failure_resets_interval():
    state = calculate_sm2(repetition_number=4, ease_factor=2.4, interval_days=15, quality=1, current_date=date(2026, 9, 8))
    assert state.repetition_number == 0
    assert state.interval_days == 1
    assert state.next_review_date == "2026-09-09"
    assert state.ease_factor < 2.4

def test_contrastive_engine_age_rule_urdu():
    engine = ContrastiveRuleEngine()
    result = engine.diagnose_submission("Je suis 25 ans", native_lang="ur")
    assert result["is_error"] is True
    assert result["category"] == "COPULA_AGE_AVOIR"
    assert "avoir" in result["explanation_native"]
    assert "J'ai 25 ans." == result["corrected_fr"]
    assert "عمر" in result["explanation_native"]

def test_contrastive_engine_hunger_rule_arabic():
    engine = ContrastiveRuleEngine()
    result = engine.diagnose_submission("Je suis faim", native_lang="ar")
    assert result["is_error"] is True
    assert result["category"] == "COPULA_SENSATION_AVOIR"
    assert "J'ai faim." == result["corrected_fr"]
    assert "avoir" in result["explanation_native"]
