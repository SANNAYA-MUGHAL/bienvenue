"""
Survival Mode (Life Situation Roleplay) Router for Bienvenue.
"""

from fastapi import APIRouter, HTTPException
from pathlib import Path
import json
from backend.app.models import SurvivalTurnRequest, SurvivalTurnResponse

router = APIRouter(prefix="/api/survival", tags=["survival"])

DATA_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "survival_scenarios.json"

def load_scenarios():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

SCENARIOS = load_scenarios()

@router.get("/scenarios")
def list_scenarios(lang: str = "ur"):
    output = []
    for sc in SCENARIOS:
        desc = sc.get("descriptions", {}).get(lang, sc.get("descriptions", {}).get("ur", ""))
        output.append({
            "id": sc["id"],
            "title_fr": sc["title_fr"],
            "icon": sc.get("icon", "🥐"),
            "category": sc.get("category", "Survival"),
            "description": desc,
            "total_steps": len(sc.get("dialogue_steps", []))
        })
    return output

@router.get("/scenario/{scenario_id}")
def get_scenario(scenario_id: str, lang: str = "ur"):
    for sc in SCENARIOS:
        if sc["id"] == scenario_id:
            # Localize dialogue translations
            localized = dict(sc)
            steps = []
            for st in sc.get("dialogue_steps", []):
                s_copy = dict(st)
                s_copy["translation_native"] = st.get("translations", {}).get(lang, st.get("translations", {}).get("ur", ""))
                steps.append(s_copy)
            localized["dialogue_steps"] = steps
            return localized
    raise HTTPException(status_code=404, detail="Scenario not found")

@router.post("/turn", response_model=SurvivalTurnResponse)
def handle_turn(req: SurvivalTurnRequest):
    target_sc = None
    for sc in SCENARIOS:
        if sc["id"] == req.scenario_id:
            target_sc = sc
            break

    if not target_sc:
        raise HTTPException(status_code=404, detail="Scenario not found")

    steps = target_sc.get("dialogue_steps", [])
    current_idx = req.current_step

    if current_idx < 0 or current_idx >= len(steps):
        raise HTTPException(status_code=400, detail="Invalid step index")

    current_step_data = steps[current_idx]
    accepted = current_step_data.get("accepted_keywords", [])
    
    # Check keyword overlap or generic positive response
    user_lower = req.user_response.lower()
    matched_keywords = [kw for kw in accepted if kw in user_lower]
    
    vocab_rating = 5 if len(matched_keywords) >= 1 else 3
    grammar_rating = 4
    pronunciation_rating = 4
    naturalness_rating = 5 if len(user_lower.split()) >= 3 else 3

    is_last_step = (current_idx + 1) >= len(steps)

    if not is_last_step:
        next_step_data = steps[current_idx + 1]
        clerk_fr = next_step_data.get("message_fr")
        clerk_native = next_step_data.get("translations", {}).get(req.native_lang, next_step_data.get("translations", {}).get("ur", ""))
        return SurvivalTurnResponse(
            is_complete=False,
            next_step=current_idx + 1,
            clerk_reply_fr=clerk_fr,
            clerk_reply_native=clerk_native,
            feedback={
                "understood": True,
                "matched_keywords": matched_keywords,
                "encouragement": "Très bien ! Le vendeur a compris votre demande."
            }
        )
    else:
        # Simulation complete
        return SurvivalTurnResponse(
            is_complete=True,
            next_step=current_idx + 1,
            clerk_reply_fr="Merci beaucoup, bonne journée ! Au revoir !",
            clerk_reply_native="بہت شکریہ، آپ کا دن اچھا گزرے! خدا حافظ!",
            feedback={
                "understood": True,
                "congratulations": "Félicitations ! Vous avez terminé ce dialogue de survie avec succès."
            },
            scorecard={
                "vocabulary": vocab_rating,
                "grammar": grammar_rating,
                "pronunciation": pronunciation_rating,
                "naturalness": naturalness_rating
            }
        )
