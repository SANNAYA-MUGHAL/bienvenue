"""
Integration API Tests for Bienvenue FastAPI Backend.
"""

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "version": "1.0.0"}

def test_search_french_term():
    response = client.get("/api/search?q=mais&lang=ur")
    assert response.status_code == 200
    data = response.json()
    assert data["total_matches"] >= 1
    first = data["results"][0]
    assert first["french_term"] == "mais"
    assert first["translation_native"] == "لیکن"
    assert "دو متضاد باتوں" in first["rule_summary"]

def test_search_native_keyword():
    response = client.get("/api/search?q=لیکن&lang=ur")
    assert response.status_code == 200
    data = response.json()
    assert data["total_matches"] >= 1
    assert data["results"][0]["french_term"] == "mais"

def test_get_card_detail():
    response = client.get("/api/card/card_mais")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "card_mais"
    assert data["french_term"] == "mais"
    assert "translations" in data
    assert data["translations"]["ur"] == "لیکن"
    assert len(data["examples"]) >= 1

def test_explain_mistake_endpoint():
    payload = {
        "sentence": "Je suis 25 ans",
        "native_lang": "ur"
    }
    response = client.post("/api/pedagogy/explain-mistake", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_error"] is True
    assert data["category"] == "COPULA_AGE_AVOIR"
    assert data["corrected_fr"] == "J'ai 25 ans."
    assert "avoir" in data["explanation_native"]

def test_survival_scenarios_list():
    response = client.get("/api/survival/scenarios?lang=ur")
    assert response.status_code == 200
    scenarios = response.json()
    assert len(scenarios) >= 3
    boulangerie = next(s for s in scenarios if s["id"] == "scenario_boulangerie")
    assert boulangerie["title_fr"] == "La Boulangerie"

def test_survival_turn():
    payload = {
        "scenario_id": "scenario_boulangerie",
        "current_step": 0,
        "user_response": "Je voudrais une baguette et un croissant s'il vous plaît",
        "native_lang": "ur"
    }
    response = client.post("/api/survival/turn", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_complete"] is False
    assert data["next_step"] == 1
    assert "clerk_reply_fr" in data

def test_srs_review_endpoint():
    payload = {
        "card_id": "card_mais",
        "repetition_number": 0,
        "ease_factor": 2.5,
        "interval_days": 0,
        "quality": 5
    }
    response = client.post("/api/progress/srs-review", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["repetition_number"] == 1
    assert data["interval_days"] == 1

def test_brain_map_endpoint():
    response = client.get("/api/progress/brain-map")
    assert response.status_code == 200
    data = response.json()
    assert data["cefr_level"] == "A1"
    assert data["total_nodes"] >= 5
    assert len(data["nodes"]) >= 5

def test_fuzzy_search_typo_correction():
    response = client.get("/api/search?q=chein&lang=en")
    assert response.status_code == 200
    data = response.json()
    assert data["did_you_mean"] == "chien"
    assert len(data["results"]) >= 1
    assert data["results"][0]["french_term"] == "chien"
    assert "dog" in data["results"][0]["translation_native"].lower()

def test_wiktionary_resolver_search():
    response = client.get("/api/search?q=grenouille&lang=en")
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) >= 1
    first = data["results"][0]
    assert first["french_term"] == "grenouille"
    assert "frog" in first["translation_native"].lower()
    
    # Test card detail endpoint
    card_resp = client.get(f"/api/card/{first['id']}")
    assert card_resp.status_code == 200
    card_data = card_resp.json()
    assert card_data["french_term"] == "grenouille"
    assert "translations" in card_data
