"""
Search & Micro-Learning Cards Router for Bienvenue.
Provides sub-50ms instant bilingual search across French and 5 source languages
with full diacritic/accent insensitivity, Wiktionary dynamic resolution,
reverse-language lookups, and typo correction.
"""

from fastapi import APIRouter, Query, HTTPException
from pathlib import Path
import json
import unicodedata
import re
from typing import Optional, List
from backend.app.models import SearchResponse, SearchResultItem, MicroCardDetail
from backend.app.services.dictionary_resolver import resolver

router = APIRouter(prefix="/api", tags=["search"])

DATA_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "micro_cards.json"
LEXICON_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "lexicon.json"

def strip_accents(text: str) -> str:
    """Normalize unicode and strip diacritics for accent-insensitive search."""
    if not text:
        return ""
    nfd = unicodedata.normalize('NFD', text)
    stripped = "".join(c for c in nfd if unicodedata.category(c) != 'Mn')
    return stripped.lower().strip()

def load_cards() -> List[dict]:
    if not DATA_PATH.exists():
        return []
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def load_lexicon() -> dict:
    if not LEXICON_PATH.exists():
        return {}
    try:
        with open(LEXICON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

@router.get("/search", response_model=SearchResponse)
def search_terms(
    q: str = Query(..., min_length=1, description="Search query in French or native script"),
    lang: str = Query("ur", description="Active native language code (ur, ar, hi, es, en)")
):
    query_raw = q.strip()
    query_norm = strip_accents(query_raw)
    cards = load_cards()
    results: List[SearchResultItem] = []
    did_you_mean: Optional[str] = None

    scored_results = []

    # 1. Tier 1: Match against Curated Micro-Cards
    for card in cards:
        fr_term = card.get("french_term", "")
        fr_norm = strip_accents(fr_term)
        translations = card.get("translations", {})
        phonetics = card.get("phonetics", {})

        score = 0

        # Exact French match
        if query_norm and fr_norm == query_norm:
            score = 1000
        # French term starts with query
        elif query_norm and fr_norm.startswith(query_norm):
            score = 700 - len(fr_norm)
        # Whole word match in French term
        elif query_norm and query_norm in fr_norm.split():
            score = 500
        # Substring match (3+ chars)
        elif len(query_norm) >= 3 and query_norm in fr_norm:
            score = 300 - len(fr_norm)

        # Active native language translation matches (never match arbitrary substrings in unused languages)
        active_trans = translations.get(lang, "")
        active_trans_norm = strip_accents(active_trans)
        if query_norm and active_trans_norm == query_norm:
            score = max(score, 600)
        elif query_norm and query_norm in active_trans_norm.split():
            score = max(score, 350)
        elif len(query_norm) >= 3 and query_norm in active_trans_norm:
            score = max(score, 150)

        # Active phonetic transliteration matches
        active_phone = phonetics.get(lang, "")
        active_phone_norm = strip_accents(active_phone)
        if query_norm and query_norm in active_phone_norm.split():
            score = max(score, 250)

        if score > 0:
            rules = card.get("pedagogical_rules", {})
            rule_summary = rules.get(lang, rules.get("ur", ""))
            native_trans = translations.get(lang, translations.get("ur", fr_term))
            native_phone = phonetics.get(lang, phonetics.get("ur", ""))

            scored_results.append((score, SearchResultItem(
                id=card["id"],
                french_term=card["french_term"],
                ipa=card.get("ipa"),
                concept_type=card.get("concept_type"),
                phonetic_native=native_phone,
                translation_native=native_trans,
                rule_summary=rule_summary,
                source="curated"
            )))

    # Sort scored curated cards by score descending
    scored_results.sort(key=lambda x: x[0], reverse=True)
    results = [item for _, item in scored_results[:8]]

    # 2. Tier 2 & 3: Dynamic Open Dictionary Resolution
    # If no exact match in curated dictionary, resolve query dynamically
    has_exact_curated = any(strip_accents(r.french_term) == query_norm for r in results)
    
    if not has_exact_curated and len(query_raw) >= 2:
        resolved = resolver.resolve_word(query_raw, lang)
        if resolved:
            dyn_item = SearchResultItem(
                id=resolved["id"],
                french_term=resolved["french_term"],
                ipa=resolved.get("ipa"),
                concept_type=resolved.get("concept_type"),
                phonetic_native=resolved["phonetics"].get(lang, resolved["phonetics"].get("ur", "")),
                translation_native=resolved["translations"].get(lang, resolved["translations"].get("en", resolved["french_term"])),
                rule_summary=resolved["pedagogical_rules"].get(lang, resolved["pedagogical_rules"].get("ur", "")),
                source=resolved.get("source", "wiktionary")
            )
            # Insert at top if it matches the query exactly
            results.insert(0, dyn_item)

    # 3. Tier 4: Reverse Search Lookup from Active Learner Language (English, Urdu, Arabic, Hindi, Spanish)
    if not results and len(query_raw) >= 2:
        # First check local cache for translated terms (instant offline / sandboxed support)
        cached_trans = resolver.find_cached_by_translation(query_raw, lang)
        for c in cached_trans:
            results.append(SearchResultItem(
                id=c["id"],
                french_term=c["french_term"],
                ipa=c.get("ipa"),
                concept_type=c.get("concept_type"),
                phonetic_native=c["phonetics"].get(lang, c["phonetics"].get("ur", "")),
                translation_native=c["translations"].get(lang, c["translations"].get("en", c["french_term"])),
                rule_summary=c["pedagogical_rules"].get(lang, c["pedagogical_rules"].get("ur", "")),
                source=c.get("source", "wiktionary")
            ))

        if not results:
            rev_fr = resolver.reverse_lookup_french(query_raw, lang)
            if rev_fr:
                # First check if rev_fr is in curated cards
                for card in cards:
                    if strip_accents(card.get("french_term", "")) == strip_accents(rev_fr):
                        rules = card.get("pedagogical_rules", {})
                        translations = card.get("translations", {})
                        phonetics = card.get("phonetics", {})
                        results.append(SearchResultItem(
                            id=card["id"],
                            french_term=card["french_term"],
                            ipa=card.get("ipa"),
                            concept_type=card.get("concept_type"),
                            phonetic_native=phonetics.get(lang, phonetics.get("ur", "")),
                            translation_native=translations.get(lang, translations.get("ur", "")),
                            rule_summary=rules.get(lang, rules.get("ur", "")),
                            source="curated"
                        ))
                        break

                # If not in curated cards, resolve dynamically
                if not results:
                    resolved_rev = resolver.resolve_word(rev_fr, lang)
                    if resolved_rev:
                        results.append(SearchResultItem(
                            id=resolved_rev["id"],
                            french_term=resolved_rev["french_term"],
                            ipa=resolved_rev.get("ipa"),
                            concept_type=resolved_rev.get("concept_type"),
                            phonetic_native=resolved_rev["phonetics"].get(lang, resolved_rev["phonetics"].get("ur", "")),
                            translation_native=resolved_rev["translations"].get(lang, resolved_rev["translations"].get("en", resolved_rev["french_term"])),
                            rule_summary=resolved_rev["pedagogical_rules"].get(lang, resolved_rev["pedagogical_rules"].get("ur", "")),
                            source=resolved_rev.get("source", "wiktionary")
                        ))

    # 4. Post-Lexical Fallback: Typo Correction (Damerau-Levenshtein)
    # STRICT INVARIANT: Typo correction is ONLY triggered if the query is NOT a valid word
    if not results and len(query_raw) >= 3:
        fuzzy_match = resolver.find_fuzzy_match(query_raw)
        if fuzzy_match:
            did_you_mean = fuzzy_match
            for card in cards:
                if strip_accents(card.get("french_term", "")) == strip_accents(fuzzy_match):
                    rules = card.get("pedagogical_rules", {})
                    translations = card.get("translations", {})
                    phonetics = card.get("phonetics", {})
                    results.append(SearchResultItem(
                        id=card["id"],
                        french_term=card["french_term"],
                        ipa=card.get("ipa"),
                        concept_type=card.get("concept_type"),
                        phonetic_native=phonetics.get(lang, phonetics.get("ur", "")),
                        translation_native=translations.get(lang, translations.get("ur", "")),
                        rule_summary=rules.get(lang, rules.get("ur", "")),
                        did_you_mean=fuzzy_match,
                        source="curated"
                    ))
                    break

            if not results:
                resolved_fuzzy = resolver.resolve_word(fuzzy_match, lang)
                if resolved_fuzzy:
                    results.append(SearchResultItem(
                        id=resolved_fuzzy["id"],
                        french_term=resolved_fuzzy["french_term"],
                        ipa=resolved_fuzzy.get("ipa"),
                        concept_type=resolved_fuzzy.get("concept_type"),
                        phonetic_native=resolved_fuzzy["phonetics"].get(lang, resolved_fuzzy["phonetics"].get("ur", "")),
                        translation_native=resolved_fuzzy["translations"].get(lang, resolved_fuzzy["translations"].get("en", resolved_fuzzy["french_term"])),
                        rule_summary=resolved_fuzzy["pedagogical_rules"].get(lang, resolved_fuzzy["pedagogical_rules"].get("ur", "")),
                        did_you_mean=fuzzy_match,
                        source=resolved_fuzzy.get("source", "wiktionary")
                    ))

    return SearchResponse(
        query=q,
        lang=lang,
        total_matches=len(results),
        did_you_mean=did_you_mean,
        results=results
    )

@router.get("/card/{card_id}", response_model=MicroCardDetail)
def get_card(card_id: str):
    cards = load_cards()
    for card in cards:
        if card["id"] == card_id:
            return MicroCardDetail(**card)

    # Handle dynamically synthesized & Wiktionary cards
    if card_id.startswith("wiki_") or card_id.startswith("dyn_"):
        raw_slug = card_id.replace("wiki_", "").replace("dyn_", "")
        cached = resolver.get_cached_by_slug(raw_slug)
        if cached:
            return MicroCardDetail(**cached)
        raw_word = raw_slug.replace("_", " ")
        resolved = resolver.resolve_word(raw_word)
        if resolved:
            return MicroCardDetail(**resolved)

    raise HTTPException(status_code=404, detail="Micro-card not found")

@router.get("/cards/all")
def get_all_cards():
    cards = load_cards()
    return {"total": len(cards), "cards": cards}
