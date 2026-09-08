/**
 * Client API Client for Bienvenue Backend.
 */

const API_BASE = '/api';

export const api = {
  // Search
  searchTerms: async (query, lang = 'ur') => {
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&lang=${lang}`);
      if (!res.ok) throw new Error('Search failed');
      return await res.json();
    } catch (err) {
      console.warn('API fetch failed, fallback to local match', err);
      return { query, lang, total_matches: 0, results: [] };
    }
  },

  // Get Card Details
  getCard: async (cardId) => {
    const res = await fetch(`${API_BASE}/card/${cardId}`);
    if (!res.ok) throw new Error('Failed to load card');
    return await res.json();
  },

  // Explain Mistake
  explainMistake: async (sentence, nativeLang = 'ur') => {
    const res = await fetch(`${API_BASE}/pedagogy/explain-mistake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence, native_lang: nativeLang })
    });
    if (!res.ok) throw new Error('Failed to diagnose error');
    return await res.json();
  },

  // Survival Scenarios
  getScenarios: async (lang = 'ur') => {
    const res = await fetch(`${API_BASE}/survival/scenarios?lang=${lang}`);
    if (!res.ok) throw new Error('Failed to load scenarios');
    return await res.json();
  },

  getScenarioDetail: async (scenarioId, lang = 'ur') => {
    const res = await fetch(`${API_BASE}/survival/scenario/${scenarioId}?lang=${lang}`);
    if (!res.ok) throw new Error('Failed to load scenario detail');
    return await res.json();
  },

  submitSurvivalTurn: async (scenarioId, currentStep, userResponse, nativeLang = 'ur') => {
    const res = await fetch(`${API_BASE}/survival/turn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario_id: scenarioId,
        current_step: currentStep,
        user_response: userResponse,
        native_lang: nativeLang
      })
    });
    if (!res.ok) throw new Error('Failed to process dialogue turn');
    return await res.json();
  },

  // Progress & Missions
  getDailyMission: async (lang = 'ur') => {
    const res = await fetch(`${API_BASE}/progress/daily-mission?lang=${lang}`);
    if (!res.ok) throw new Error('Failed to load daily mission');
    return await res.json();
  },

  getBrainMap: async () => {
    const res = await fetch(`${API_BASE}/progress/brain-map`);
    if (!res.ok) throw new Error('Failed to load brain map');
    return await res.json();
  },

  submitSRSReview: async (cardId, repetitionNumber, easeFactor, intervalDays, quality) => {
    const res = await fetch(`${API_BASE}/progress/srs-review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        card_id: cardId,
        repetition_number: repetitionNumber,
        ease_factor: easeFactor,
        interval_days: intervalDays,
        quality: quality
      })
    });
    if (!res.ok) throw new Error('Failed to update SRS');
    return await res.json();
  }
};
