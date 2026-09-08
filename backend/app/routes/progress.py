"""
Progress & Spaced Repetition (SRS) Router for Bienvenue.
"""

from fastapi import APIRouter
from pathlib import Path
import json
from backend.app.models import SRSReviewRequest, SRSReviewResponse, BrainMapResponse, BrainMapNode
from backend.app.pedagogy.srs import calculate_sm2

router = APIRouter(prefix="/api/progress", tags=["progress"])

KG_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "knowledge_graph.json"
CARDS_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "micro_cards.json"

@router.post("/srs-review", response_model=SRSReviewResponse)
def review_card(req: SRSReviewRequest):
    updated = calculate_sm2(
        repetition_number=req.repetition_number,
        ease_factor=req.ease_factor,
        interval_days=req.interval_days,
        quality=req.quality
    )
    return SRSReviewResponse(
        card_id=req.card_id,
        repetition_number=updated.repetition_number,
        ease_factor=updated.ease_factor,
        interval_days=updated.interval_days,
        next_review_date=updated.next_review_date
    )

@router.get("/brain-map", response_model=BrainMapResponse)
def get_brain_map():
    with open(KG_PATH, "r", encoding="utf-8") as f:
        kg = json.load(f)
    
    nodes = []
    statuses = ["mastered", "mastered", "in_progress", "in_progress", "review_due", "in_progress", "in_progress", "in_progress", "in_progress"]
    percentages = [100, 100, 65, 45, 80, 50, 30, 20, 15]

    for idx, raw_node in enumerate(kg.get("nodes", [])):
        st = statuses[idx % len(statuses)]
        pct = percentages[idx % len(percentages)]
        nodes.append(BrainMapNode(
            id=raw_node["id"],
            cefr_level=raw_node.get("cefr_level", "A1"),
            title_fr=raw_node.get("title_fr", ""),
            category=raw_node.get("category", "General"),
            status=st,
            mastery_percentage=pct,
            prerequisites=raw_node.get("prerequisites", [])
        ))

    mastered_count = sum(1 for n in nodes if n.status == "mastered")
    overall = int(sum(n.mastery_percentage for n in nodes) / max(1, len(nodes)))

    return BrainMapResponse(
        cefr_level="A1",
        overall_progress=overall,
        total_nodes=len(nodes),
        mastered_nodes=mastered_count,
        nodes=nodes
    )

@router.get("/daily-mission")
def get_daily_mission(lang: str = "ur"):
    with open(CARDS_PATH, "r", encoding="utf-8") as f:
        cards = json.load(f)
    
    # 5 words to review
    vocab_words = []
    for c in cards[:5]:
        vocab_words.append({
            "id": c["id"],
            "french_term": c["french_term"],
            "ipa": c.get("ipa"),
            "translation_native": c.get("translations", {}).get(lang, c.get("translations", {}).get("ur", "")),
            "phonetic_native": c.get("phonetics", {}).get(lang, c.get("phonetics", {}).get("ur", ""))
        })

    return {
        "mission_title": "Mission du Jour (10 min)",
        "streak_days": 7,
        "cefr_level": "A1",
        "progress_pct": 28,
        "vocabulary_review": vocab_words,
        "listening_snippet": {
            "title": "Au restaurant",
            "fr": "Bonjour Madame, une table pour deux s'il vous plaît.",
            "audio_cue": "table_pour_deux"
        },
        "speaking_drill": {
            "prompt_fr": "Je voudrais un croissant et un café, s'il vous plaît.",
            "prompt_native": "مجھے برائے مہربانی ایک کرواساں اور کافی چاہیے۔"
        },
        "grammar_micro_lesson": {
            "title": "Être vs Avoir (عمر اور کیفیت)",
            "tip_native": "فرانسیسی میں عمر بتانے کے لیے 'avoir' کا استعمال کریں: J'ai 25 ans۔"
        }
    }
