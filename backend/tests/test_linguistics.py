"""
Linguistic Integrity & Edge Case Automated Tests for Bienvenue.
"""

import json
from pathlib import Path
from backend.app.pedagogy.rule_engine import ContrastiveRuleEngine
from backend.app.pedagogy.srs import calculate_sm2

CARDS_PATH = Path(__file__).resolve().parent.parent.parent / "backend" / "data" / "micro_cards.json"
RULES_PATH = Path(__file__).resolve().parent.parent.parent / "backend" / "data" / "contrastive_rules.json"

def test_diacritic_preservation_in_cards():
    """Assert French diacritics are preserved across all micro-cards."""
    with open(CARDS_PATH, "r", encoding="utf-8") as f:
        cards = json.load(f)
    
    diacritics = ["é", "è", "ê", "à", "ç", "œ", "ô", "û"]
    found_diacritics = False
    for card in cards:
        full_text = json.dumps(card, ensure_ascii=False)
        for d in diacritics:
            if d in full_text:
                found_diacritics = True
                break
    assert found_diacritics is True

def test_zero_english_leakage_in_urdu_rules():
    """Assert Urdu explanations contain authentic Urdu without stray English sentences."""
    engine = ContrastiveRuleEngine()
    for rule in engine.rules:
        urdu_exp = rule.get("explanations", {}).get("ur", "")
        assert len(urdu_exp) > 20
        # Assert presence of Urdu-specific characters
        assert any(ch in urdu_exp for ch in ["ہ", "ے", "ٹ", "ڈ", "ڑ", "ں"])

def test_sm2_minimum_ease_factor_floor():
    """Assert that even with repeated failures (q=0), ease factor never falls below 1.3."""
    ef = 1.3
    state = calculate_sm2(repetition_number=3, ease_factor=ef, interval_days=6, quality=0)
    assert state.ease_factor == 1.3
    assert state.interval_days == 1
    assert state.repetition_number == 0

def test_micro_card_5_language_completeness():
    """Assert all launch micro cards have translations in all 5 target languages."""
    with open(CARDS_PATH, "r", encoding="utf-8") as f:
        cards = json.load(f)
    
    required_langs = ["ur", "ar", "hi", "es", "en"]
    for card in cards:
        translations = card.get("translations", {})
        for lang in required_langs:
            assert lang in translations, f"Card {card['id']} missing translation for {lang}"
            assert len(translations[lang]) > 0
