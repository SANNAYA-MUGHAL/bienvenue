"""
Pedagogy & Contrastive Diagnostics Router for Bienvenue.
"""

from fastapi import APIRouter
from backend.app.models import ExplainMistakeRequest, ExplainMistakeResponse
from backend.app.pedagogy.rule_engine import engine

router = APIRouter(prefix="/api/pedagogy", tags=["pedagogy"])

@router.post("/explain-mistake", response_model=ExplainMistakeResponse)
def explain_mistake(req: ExplainMistakeRequest):
    result = engine.diagnose_submission(req.sentence, native_lang=req.native_lang)
    return ExplainMistakeResponse(
        is_error=result.get("is_error", False),
        category=result.get("category", "UNKNOWN"),
        rule_id=result.get("rule_id"),
        matched_pattern=result.get("matched_pattern"),
        explanation_native=result.get("explanation_native", result.get("message", "")),
        corrected_fr=result.get("corrected_fr"),
        phonetic_transcription=result.get("phonetic_transcription"),
        tip=result.get("tip")
    )

@router.get("/rules")
def get_all_rules():
    return {"total_rules": len(engine.rules), "rules": engine.rules}
