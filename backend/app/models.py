"""
Pydantic Data Models for Bienvenue API.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SearchResultItem(BaseModel):
    id: str
    french_term: str
    ipa: Optional[str] = None
    concept_type: Optional[str] = None
    phonetic_native: str
    translation_native: str
    rule_summary: Optional[str] = None
    did_you_mean: Optional[str] = None
    source: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    lang: str
    total_matches: int
    did_you_mean: Optional[str] = None
    results: List[SearchResultItem]

class ExampleSentence(BaseModel):
    fr: str
    translations: Dict[str, str]

class MicroCardDetail(BaseModel):
    id: str
    french_term: str
    ipa: Optional[str] = None
    concept_type: Optional[str] = None
    phonetics: Dict[str, str]
    translations: Dict[str, str]
    pedagogical_rules: Dict[str, str]
    examples: List[Dict[str, Any]]
    practice_prompt: Optional[Dict[str, Any]] = None

class ExplainMistakeRequest(BaseModel):
    sentence: str
    native_lang: str = "ur"

class ExplainMistakeResponse(BaseModel):
    is_error: bool
    category: str
    rule_id: Optional[str] = None
    matched_pattern: Optional[str] = None
    explanation_native: str
    corrected_fr: Optional[str] = None
    phonetic_transcription: Optional[str] = None
    tip: Optional[str] = None

class SurvivalDialogueStep(BaseModel):
    step_index: int
    speaker: str
    speaker_name: str
    message_fr: str
    translations: Dict[str, str]
    suggested_reply: Optional[str] = None
    accepted_keywords: List[str] = []

class SurvivalScenario(BaseModel):
    id: str
    title_fr: str
    icon: str
    category: str
    descriptions: Dict[str, str]
    dialogue_steps: List[SurvivalDialogueStep]

class SurvivalTurnRequest(BaseModel):
    scenario_id: str
    current_step: int
    user_response: str
    native_lang: str = "ur"

class SurvivalTurnResponse(BaseModel):
    is_complete: bool
    next_step: int
    clerk_reply_fr: Optional[str] = None
    clerk_reply_native: Optional[str] = None
    feedback: Dict[str, Any]
    scorecard: Optional[Dict[str, int]] = None

class SRSReviewRequest(BaseModel):
    card_id: str
    repetition_number: int = 0
    ease_factor: float = 2.5
    interval_days: int = 0
    quality: int = Field(ge=0, le=5)

class SRSReviewResponse(BaseModel):
    card_id: str
    repetition_number: int
    ease_factor: float
    interval_days: int
    next_review_date: str

class BrainMapNode(BaseModel):
    id: str
    cefr_level: str
    title_fr: str
    category: str
    status: str  # "mastered", "in_progress", "review_due"
    mastery_percentage: int
    prerequisites: List[str]

class BrainMapResponse(BaseModel):
    cefr_level: str
    overall_progress: int
    total_nodes: int
    mastered_nodes: int
    nodes: List[BrainMapNode]
