"""
Contrastive Pedagogical Error Diagnostic Rule Engine.
Analyzes learner submissions and generates native-language explanations comparing L1 and L2 syntax.
"""

import json
import re
from pathlib import Path
from typing import Dict, Any, Optional

DATA_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "contrastive_rules.json"

class ContrastiveRuleEngine:
    def __init__(self, rules_file: Optional[Path] = None):
        path = rules_file or DATA_PATH
        with open(path, "r", encoding="utf-8") as f:
            self.rules = json.load(f)

    def diagnose_submission(self, text: str, native_lang: str = "ur") -> Dict[str, Any]:
        """
        Diagnoses a French sentence submission against contrastive linguistic rules.
        """
        cleaned = text.strip().lower()
        # Remove terminal punctuation for cleaner regex match
        cleaned = re.sub(r"[.!?]+$", "", cleaned).strip()

        for rule in self.rules:
            pattern = rule.get("pattern")
            if pattern and re.search(pattern, cleaned, re.IGNORECASE):
                explanations = rule.get("explanations", {})
                explanation_native = explanations.get(
                    native_lang,
                    explanations.get("ur", explanations.get("en", "Erreur grammaticale."))
                )
                phonetics = rule.get("phonetic_transcriptions", {})
                phonetic_native = phonetics.get(native_lang, phonetics.get("ur", ""))

                return {
                    "is_error": True,
                    "rule_id": rule.get("id"),
                    "category": rule.get("category"),
                    "matched_pattern": pattern,
                    "explanation_native": explanation_native,
                    "corrected_fr": rule.get("correct_fr"),
                    "phonetic_transcription": phonetic_native,
                    "tip": "Save this concept to your Spaced Repetition queue to master it."
                }

        return {
            "is_error": False,
            "category": "CORRECT_OR_UNMATCHED",
            "message": "Aucune erreur contrastive majeure détectée. Bien joué !"
        }

# Global singleton instance
engine = ContrastiveRuleEngine()
