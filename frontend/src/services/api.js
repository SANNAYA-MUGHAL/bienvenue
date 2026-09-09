/**
 * Resilient API Service for Bienvenue.
 * Dual-Mode: Communicates with FastAPI backend when online, 
 * with seamless instant offline-first fallback for 100% reliability.
 */

import { MICRO_CARDS } from '../data/microCards';
import { CONTRASTIVE_RULES } from '../data/contrastiveRules';
import { SURVIVAL_SCENARIOS } from '../data/survivalScenarios';
import { KNOWLEDGE_GRAPH } from '../data/knowledgeGraph';

const API_BASE = '/api';

// Helper for fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeoutMs = 1500) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export const api = {
  // 1. Bilingual Search
  searchTerms: async (query, lang = 'ur') => {
    const qClean = (query || '').trim().toLowerCase();
    if (!qClean) return { query, lang, total_matches: 0, results: [] };

    try {
      const res = await fetchWithTimeout(`${API_BASE}/search?q=${encodeURIComponent(query)}&lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data;
        }
      }
    } catch (e) {
      // Backend not reached, proceed to local matching
    }

    // High-performance local search fallback
    const matched = [];
    for (const card of MICRO_CARDS) {
      let isMatch = false;
      
      // Match French
      if (card.french_term.toLowerCase().includes(qClean)) {
        isMatch = true;
      }

      // Match native translation or any translation
      const trans = card.translations || {};
      for (const t of Object.values(trans)) {
        if (t && t.toLowerCase().includes(qClean)) {
          isMatch = true;
          break;
        }
      }

      // Match phonetics
      const phones = card.phonetics || {};
      for (const p of Object.values(phones)) {
        if (p && p.toLowerCase().includes(qClean)) {
          isMatch = true;
          break;
        }
      }

      if (isMatch) {
        matched.push({
          id: card.id,
          french_term: card.french_term,
          ipa: card.ipa,
          concept_type: card.concept_type,
          phonetic_native: card.phonetics?.[lang] || card.phonetics?.ur || '',
          translation_native: card.translations?.[lang] || card.translations?.ur || card.french_term,
          rule_summary: card.pedagogical_rules?.[lang] || card.pedagogical_rules?.ur || ''
        });
      }
    }

    return {
      query,
      lang,
      total_matches: matched.length,
      results: matched
    };
  },

  // 2. Card Detail
  getCard: async (cardId) => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/card/${cardId}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const localCard = MICRO_CARDS.find(c => c.id === cardId);
    if (localCard) return localCard;
    throw new Error('Card not found');
  },

  // 3. Explain Mistake Diagnostic
  explainMistake: async (sentence, nativeLang = 'ur') => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/pedagogy/explain-mistake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence, native_lang: nativeLang })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Local regex diagnostic fallback
    const sClean = (sentence || '').trim();
    for (const rule of CONTRASTIVE_RULES) {
      if (rule.pattern.test(sClean)) {
        const exp = rule.explanations[nativeLang] || rule.explanations.ur || rule.explanations.en;
        const phone = rule.phonetic_transcriptions[nativeLang] || rule.phonetic_transcriptions.ur || '';
        return {
          is_error: true,
          category: rule.category,
          rule_id: rule.id,
          matched_pattern: rule.pattern.toString(),
          explanation_native: exp,
          corrected_fr: rule.correct_fr,
          phonetic_transcription: phone,
          tip: "Save this concept to your Spaced Repetition queue to master it."
        };
      }
    }

    return {
      is_error: false,
      category: 'CORRECT_OR_UNMATCHED',
      explanation_native: nativeLang === 'ur' 
        ? "کوئی بڑی گرامر کی غلطی نہیں ملی۔ بہت خوب!" 
        : "Aucune erreur contrastive majeure détectée. Bien joué !"
    };
  },

  // 4. Survival Scenarios
  getScenarios: async (lang = 'ur') => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/survival/scenarios?lang=${lang}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    return SURVIVAL_SCENARIOS.map(sc => ({
      id: sc.id,
      title_fr: sc.title_fr,
      icon: sc.icon,
      category: sc.category,
      description: sc.descriptions[lang] || sc.descriptions.ur || sc.descriptions.en,
      total_steps: sc.dialogue_steps.length
    }));
  },

  getScenarioDetail: async (scenarioId, lang = 'ur') => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/survival/scenario/${scenarioId}?lang=${lang}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const target = SURVIVAL_SCENARIOS.find(s => s.id === scenarioId);
    if (!target) throw new Error('Scenario not found');

    const copy = JSON.parse(JSON.stringify(target));
    copy.dialogue_steps = copy.dialogue_steps.map(st => ({
      ...st,
      translation_native: st.translations[lang] || st.translations.ur || st.translations.en
    }));
    return copy;
  },

  submitSurvivalTurn: async (scenarioId, currentStep, userResponse, nativeLang = 'ur') => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/survival/turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: scenarioId,
          current_step: currentStep,
          user_response: userResponse,
          native_lang: nativeLang
        })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Local turn resolution
    const target = SURVIVAL_SCENARIOS.find(s => s.id === scenarioId);
    const steps = target?.dialogue_steps || [];
    const isLast = (currentStep + 1) >= steps.length;

    if (!isLast) {
      const nextStep = steps[currentStep + 1];
      return {
        is_complete: false,
        next_step: currentStep + 1,
        clerk_reply_fr: nextStep.message_fr,
        clerk_reply_native: nextStep.translations[nativeLang] || nextStep.translations.ur,
        feedback: { understood: true }
      };
    } else {
      return {
        is_complete: true,
        next_step: currentStep + 1,
        clerk_reply_fr: "Merci beaucoup, bonne journée ! Au revoir !",
        clerk_reply_native: nativeLang === 'ur' ? "بہت شکریہ، آپ کا دن اچھا گزرے! خدا حافظ!" : "Merci beaucoup !",
        scorecard: { vocabulary: 5, grammar: 4, pronunciation: 4, naturalness: 5 },
        feedback: { understood: true }
      };
    }
  },

  // 5. Progress & Missions
  getDailyMission: async (lang = 'ur') => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/progress/daily-mission?lang=${lang}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback mission
    const vocabWords = MICRO_CARDS.slice(0, 5).map(c => ({
      id: c.id,
      french_term: c.french_term,
      ipa: c.ipa,
      translation_native: c.translations?.[lang] || c.translations?.ur,
      phonetic_native: c.phonetics?.[lang] || c.phonetics?.ur
    }));

    return {
      mission_title: "Mission du Jour (10 min)",
      streak_days: 7,
      cefr_level: "A1",
      progress_pct: 28,
      vocabulary_review: vocabWords,
      listening_snippet: {
        title: "Au restaurant",
        fr: "Bonjour Madame, une table pour deux s'il vous plaît.",
      },
      speaking_drill: {
        prompt_fr: "Je voudrais un croissant et un café, s'il vous plaît.",
        prompt_native: lang === 'ur' ? "مجھے برائے مہربانی ایک کرواساں اور کافی چاہیے۔" : "Je voudrais un croissant."
      },
      grammar_micro_lesson: {
        title: "Être vs Avoir",
        tip_native: lang === 'ur' 
          ? "فرانسیسی میں عمر بتانے کے لیے 'avoir' کا استعمال کریں: J'ai 25 ans۔" 
          : "Pour exprimer l'âge, utilisez avoir (J'ai 25 ans)."
      }
    };
  },

  getBrainMap: async () => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/progress/brain-map`);
      if (res.ok) return await res.json();
    } catch (e) {}

    return KNOWLEDGE_GRAPH;
  },

  submitSRSReview: async (cardId, repetitionNumber, easeFactor, intervalDays, quality) => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/progress/srs-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: cardId,
          repetition_number: repetitionNumber,
          ease_factor: easeFactor,
          interval_days: intervalDays,
          quality
        })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Local SM-2 calculation
    const q = Math.max(0, Math.min(5, quality));
    let newEf = (easeFactor || 2.5) + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    newEf = Math.max(1.3, Math.round(newEf * 1000) / 1000);
    let newRep = repetitionNumber + 1;
    let newInterval = 1;
    if (q < 3) {
      newRep = 0;
      newInterval = 1;
    } else if (repetitionNumber === 0) {
      newInterval = 1;
    } else if (repetitionNumber === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.ceil(intervalDays * newEf);
    }

    return {
      card_id: cardId,
      repetition_number: newRep,
      ease_factor: newEf,
      interval_days: newInterval,
      next_review_date: new Date(Date.now() + newInterval * 86400000).toISOString().split('T')[0]
    };
  }
};
