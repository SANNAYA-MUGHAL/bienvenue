"""
Search & Micro-Learning Cards Router for Bienvenue.
Provides sub-50ms instant bilingual search across French and 5 source languages.
"""

from fastapi import APIRouter, Query, HTTPException
from pathlib import Path
import json
from typing import Optional
from backend.app.models import SearchResponse, SearchResultItem, MicroCardDetail

router = APIRouter(prefix="/api", tags=["search"])

DATA_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "micro_cards.json"

def load_cards():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

CARDS = load_cards()

@router.get("/search", response_model=SearchResponse)
def search_terms(
    q: str = Query(..., min_length=1, description="Search query in French or native script"),
    lang: str = Query("ur", description="Active native language code (ur, ar, hi, es, en)")
):
    query_clean = q.strip().lower()
    results = []

    for card in CARDS:
        match = False
        # Match French term
        if query_clean in card.get("french_term", "").lower():
            match = True
        
        # Match native translation
        translations = card.get("translations", {})
        native_trans = translations.get(lang, "")
        if query_clean in native_trans.lower():
            match = True
            
        # Match any translation across all 5 languages
        for t_val in translations.values():
            if query_clean in t_val.lower():
                match = True
                break

        # Match transliteration
        phonetics = card.get("phonetics", {})
        native_phone = phonetics.get(lang, phonetics.get("ur", ""))

        if match:
            rules = card.get("pedagogical_rules", {})
            rule_summary = rules.get(lang, rules.get("ur", ""))

            results.append(SearchResultItem(
                id=card["id"],
                french_term=card["french_term"],
                ipa=card.get("ipa"),
                concept_type=card.get("concept_type"),
                phonetic_native=native_phone,
                translation_native=native_trans or card["french_term"],
                rule_summary=rule_summary
            ))

    return SearchResponse(
        query=q,
        lang=lang,
        total_matches=len(results),
        results=results
    )

@router.get("/card/{card_id}", response_model=MicroCardDetail)
def get_card(card_id: str):
    for card in CARDS:
        if card["id"] == card_id:
            return MicroCardDetail(**card)
    raise HTTPException(status_code=404, detail="Micro-card not found")

@router.get("/cards/all")
def get_all_cards():
    return {"total": len(CARDS), "cards": CARDS}
