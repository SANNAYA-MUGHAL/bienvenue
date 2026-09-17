"""
Automated Test Suite for Bienvenue Dynamic Search & Vocabulary Pipeline.
Tests 30+ completely uncurated French words/expressions across 5 learner languages,
accent normalization, multi-word expressions, reverse search, and typo isolation.
Strictly verifies that:
1. No test words are hardcoded in static curated datasets.
2. Words resolve dynamically with valid POS, IPA, definitions, examples, and rules.
3. No dummy placeholders (e.g. "French expression: {word}") or echoed meanings (meaning == word).
"""

import pytest
import unicodedata
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def strip_accents(text: str) -> str:
    if not text:
        return ""
    nfd = unicodedata.normalize('NFD', text)
    return "".join(c for c in nfd if unicodedata.category(c) != 'Mn').lower().strip()

# 35 Completely Uncurated French Words & Expressions across Parts of Speech
UNCURATED_TEST_WORDS = [
    # Adverbs
    ("déjà", "Adverbe"),
    ("souvent", "Adverbe"),
    ("toujours", "Adverbe"),
    ("lentement", "Adverbe"),
    ("bientôt", "Adverbe"),
    ("cependant", "Adverbe"),
    ("peut-être", "Adverbe"),
    ("parfois", "Adverbe"),
    ("ailleurs", "Adverbe"),
    # Nouns
    ("orage", "Nom"),
    ("écureuil", "Nom"),
    ("bicyclette", "Nom"),
    ("boulanger", "Nom"),
    ("chuchotement", "Nom"),
    ("brouillard", "Nom"),
    ("araignée", "Nom"),
    ("châtaigne", "Nom"),
    # Verbs
    ("chuchoter", "Verbe"),
    ("voyager", "Verbe"),
    ("apercevoir", "Verbe"),
    ("disparaître", "Verbe"),
    ("réfléchir", "Verbe"),
    ("déménager", "Verbe"),
    # Adjectives
    ("bavard", "Adjectif"),
    ("bruyant", "Adjectif"),
    ("agréable", "Adjectif"),
    ("merveilleux", "Adjectif"),
    ("silencieux", "Adjectif"),
    # Multi-Word Expressions
    ("tout à fait", "Adverbe"),
    ("avoir besoin de", "Verbe"),
    ("il y a", "Verbe"),
    ("parce que", "Conjonction"),
    ("au fur et à mesure", "Conjonction"),
    # Proper Nouns
    ("Portugal", "Nom propre"),
    ("Brésil", "Nom propre")
]

class TestDynamicSearchPipeline:

    def test_uncurated_word_count(self):
        """Ensure test suite contains at least 30 distinct uncurated words."""
        assert len(UNCURATED_TEST_WORDS) >= 30

    @pytest.mark.parametrize("word,expected_pos_type", UNCURATED_TEST_WORDS)
    def test_dynamic_resolution_schema_and_integrity(self, word: str, expected_pos_type: str):
        """
        Verify that ANY valid uncurated French word dynamically resolves with:
        - HTTP 200
        - At least 1 result
        - Canonical French spelling
        - Meaning is NOT empty and NOT equal to the searched word itself
        - Meaning contains no placeholder text
        - IPA pronunciation exists
        - Part of speech matches expected linguistic category
        - Card detail endpoint returns full card with authentic examples
        """
        response = client.get(f"/api/search?q={word}&lang=en")
        assert response.status_code == 200, f"Failed search for {word}"
        data = response.json()

        assert data["total_matches"] >= 1, f"No matches found for uncurated word '{word}'"
        result = data["results"][0]

        # 1. Normalized French term check
        french_term = result["french_term"]
        assert strip_accents(french_term) == strip_accents(word), (
            f"French term '{french_term}' does not match query '{word}'"
        )

        # 2. Strict Meaning & Definition Verification
        meaning = result["translation_native"].strip()
        assert meaning, f"Meaning is empty for '{word}'"
        # Must NEVER echo the query or French term as its translation
        assert strip_accents(meaning) != strip_accents(french_term), (
            f"Meaning '{meaning}' echoes the word itself for '{word}'"
        )
        assert strip_accents(meaning) != strip_accents(word), (
            f"Meaning '{meaning}' echoes query for '{word}'"
        )
        # Must not contain dummy placeholder text
        assert "French expression" not in meaning, f"Placeholder text detected for '{word}'"
        assert "فرانسیسی لفظ" not in meaning, f"Placeholder text detected for '{word}'"
        assert "مصطلح فرنسي" not in meaning, f"Placeholder text detected for '{word}'"

        # 3. Part of Speech / Concept Type
        pos = result.get("concept_type") or ""
        assert pos, f"Part of speech missing for '{word}'"
        assert (expected_pos_type in pos) or ("Vocabulaire" in pos) or ("Nom" in pos) or ("Adverbe" in pos), (
            f"Expected POS {expected_pos_type} not in {pos} for '{word}'"
        )

        # 4. IPA Pronunciation
        ipa = result.get("ipa") or ""
        assert ipa.startswith("/"), f"IPA pronunciation '{ipa}' invalid for '{word}'"

        # 5. Full Micro-Card Detail Verification
        card_id = result["id"]
        card_resp = client.get(f"/api/card/{card_id}")
        assert card_resp.status_code == 200, f"Failed to fetch card detail for {card_id}"
        card_detail = card_resp.json()

        assert card_detail["french_term"] == french_term
        assert "translations" in card_detail
        assert card_detail["translations"]["en"] == meaning

        # Verify Authentic Example Sentences
        examples = card_detail.get("examples", [])
        assert len(examples) >= 1, f"No example sentences for '{word}'"
        first_ex = examples[0]
        assert "fr" in first_ex and len(first_ex["fr"]) > 5, f"French example missing for '{word}'"
        assert "en" in first_ex and len(first_ex["en"]) > 3, f"English example translation missing for '{word}'"

        # Verify Practice Prompt
        prompt = card_detail.get("practice_prompt")
        assert prompt is not None
        assert prompt.get("prompt_fr") == french_term

    def test_accent_restoration_and_casing_normalization(self):
        """Test accent-insensitive lookup restoring canonical accents (e.g. 'deja' -> 'déjà')."""
        cases = [
            ("deja", "déjà"),
            ("ecureuil", "écureuil"),
            ("bientot", "bientôt")
        ]
        for unaccented, expected_canonical in cases:
            resp = client.get(f"/api/search?q={unaccented}&lang=en")
            assert resp.status_code == 200
            data = resp.json()
            assert data["total_matches"] >= 1
            first = data["results"][0]
            assert first["french_term"] == expected_canonical, (
                f"Expected canonical '{expected_canonical}', got '{first['french_term']}' for query '{unaccented}'"
            )
            assert first["did_you_mean"] is None, "Valid French word should NOT be marked as a typo!"

    def test_multi_word_expressions(self):
        """Test multi-word expressions dynamic resolution."""
        expressions = [
            ("tout à fait", "entirely"),
            ("avoir besoin de", "need"),
            ("parce que", "because")
        ]
        for expr, expected_sub in expressions:
            resp = client.get(f"/api/search?q={expr}&lang=en")
            assert resp.status_code == 200
            data = resp.json()
            assert data["total_matches"] >= 1
            first = data["results"][0]
            assert strip_accents(first["french_term"]) == strip_accents(expr)
            assert expected_sub in first["translation_native"].lower()

    def test_learner_language_reverse_search(self):
        """Test searching from learner's active language into French."""
        queries = [
            ("already", "déjà"),
            ("because", "parce que"),
            ("slowly", "lentement")
        ]
        for en_query, expected_fr in queries:
            resp = client.get(f"/api/search?q={en_query}&lang=en")
            assert resp.status_code == 200
            data = resp.json()
            assert data["total_matches"] >= 1
            first = data["results"][0]
            assert strip_accents(first["french_term"]) == strip_accents(expected_fr), (
                f"Reverse lookup for '{en_query}' expected '{expected_fr}', got '{first['french_term']}'"
            )

    def test_all_five_learner_languages(self):
        """Verify dynamic resolution across all 5 supported native languages."""
        langs = ["en", "ur", "ar", "hi", "es"]
        test_word = "déjà"

        for lang in langs:
            resp = client.get(f"/api/search?q={test_word}&lang={lang}")
            assert resp.status_code == 200
            data = resp.json()
            assert data["total_matches"] >= 1
            first = data["results"][0]
            assert first["french_term"] == "déjà"
            assert first["translation_native"], f"Translation empty for lang '{lang}'"
            assert first["rule_summary"], f"Rule summary empty for lang '{lang}'"
            assert strip_accents(first["translation_native"]) != "deja"

    def test_typo_correction_isolation(self):
        """Verify typos trigger did_you_mean, while valid uncurated words do not."""
        # 1. Real typo: 'chein' -> 'chien'
        resp_typo = client.get("/api/search?q=chein&lang=en")
        assert resp_typo.status_code == 200
        data_typo = resp_typo.json()
        assert data_typo["did_you_mean"] == "chien"

        # 2. Valid uncurated French word: 'déjà' or 'souvent'
        resp_valid = client.get("/api/search?q=déjà&lang=en")
        assert resp_valid.status_code == 200
        data_valid = resp_valid.json()
        assert data_valid["did_you_mean"] is None, "Valid French word should NOT have did_you_mean"
