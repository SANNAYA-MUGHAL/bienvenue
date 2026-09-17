# Bienvenue: Updated Product Plan & Implementation Document

**Product Name:** Bienvenue (*French in the language you understand*)  
**Version:** 2.1.0 (Production-Ready MVP + Full Vocabulary Engine)  
**Date:** September 2026  
**Status:** Implemented & Verified Live  
**Core Moat:** Search-First Contrastive Pedagogy across Urdu, Arabic, Hindi, Spanish, and English  

---

## 1. Executive Summary & Problem-Solution Fit

### The Market Reality
Most French learning applications in 2026 (Duolingo, Babbel, Rosetta Stone) assume an English-native conceptual foundation. When an Urdu, Arabic, or Hindi speaker learns French through English, they suffer a **double translation tax**:
$$\text{Native Concept} \longrightarrow \text{English Abstraction} \longrightarrow \text{French Construction}$$

This leads to recurring systemic errors:
- **Copula Confusion**: Urdu/Hindi speakers say *"Je suis 25 ans"* because in Urdu (*میری عمر 25 سال ہے*), age uses the verb "to be" rather than the French *"J'ai 25 ans"* (*avoir*).
- **Gender Misalignment**: South Asian and Semitic gender systems conflict with French grammatical gender (e.g. `le soleil` is masculine in French, but sun is feminine in Arabic).
- **Phonetic Roadblocks**: Nasal vowels (`an`, `en`, `in`, `on`, `un`) and uvular `R` (/ʁ/) lack direct English mappings but have exact equivalents in Urdu (*ن غنہ*) and Arabic (*غ*).

### The Solution: Bienvenue
Bienvenue eliminates English intermediaries. It offers **Search-First, Contrastive Micro-Learning**:
1. **Instant Search**: Type any word or phrase in French, phonetic English, or native script (Urdu, Arabic, Hindi, Spanish).
2. **Interactive Micro-Card**: Displays the exact native translation, IPA transcription, script-specific phonetics, contrastive grammar rule, and 1-tap French speech playback (🔊).
3. **Typo Tolerance & Open Wiktionary Coverage**: Automatically corrects typos (`chein` ➔ `chien`) and resolves over 500,000+ words on the fly via Wiktionary, auto-cached permanently into SQLite.

---

## 2. Updated Search & Full Vocabulary Architecture

```
                          User Search Query
                 (e.g., "chein", "Qui", "japon", "mais")
                                   │
                                   ▼
         ┌─────────────────────────────────────────────────┐
         │     Layer 1: Unicode NFD Accent Stripping       │
         │     "enchante" ➔ "enchanté", "ou" ➔ "où"        │
         └─────────────────────────┬───────────────────────┘
                                   │
                                   ▼
         ┌─────────────────────────────────────────────────┐
         │     Layer 2: Relevance Scoring & Isolation      │
         │   • Exact French Match: Score 1000              │
         │   • Prefix Match: Score 700 - length            │
         │   • Word Boundary Match: Score 500              │
         │   • Active Language Only: Score 600             │
         │     (Eliminates Spanish 'alquiler' on 'Qui')    │
         └─────────────────────────┬───────────────────────┘
                                   │
               ┌───────────────────┴───────────────────┐
      Matches Found (Score > 0)                No Matches (Score = 0)
               │                                       │
               ▼                                       ▼
┌──────────────────────────────┐       ┌───────────────────────────────┐
│ Tier 1: Curated Micro-Cards  │       │ Layer 3: Typo Corrector       │
│ 121+ Core CEFR A1 Cards      │       │ Damerau-Levenshtein distance  │
│ (Ranked & Sorted Descending) │       │ (chein -> chien, dist = 1)    │
└──────────────────────────────┘       └───────────────┬───────────────┘
                                                       │
                                        ┌──────────────┴──────────────┐
                                Typo Found                     No Typo
                                        │                             │
                                        ▼                             ▼
                        ┌────────────────────────┐    ┌───────────────────────────┐
                        │ Suggests / Auto-Matches│    │ Tier 2 & 3: Lexicon &     │
                        │ "Did you mean: chien?" │    │ Open Wiktionary Engine    │
                        └────────────────────────┘    │ 171+ Local Lexicon +      │
                                                      │ 500,000+ Wiktionary API   │
                                                      └─────────────┬─────────────┘
                                                                    │
                                                                    ▼
                                                      ┌───────────────────────────┐
                                                      │ Layer 4: SQLite Cache     │
                                                      │ Permanent local DB cache  │
                                                      │ (<2ms for repeat queries) │
                                                      └───────────────────────────┘
```

---

## 3. Detailed Component Architecture

### 3.1. Backend (`backend/`)
- **FastAPI Core**: Async REST server running on port **8005** (`backend/app/main.py`).
- **Dictionary Resolver Service (`backend/app/services/dictionary_resolver.py`)**:
  - Implements `damerau_levenshtein(s1, s2)` for adjacent-transposition typo correction.
  - Queries `en.wiktionary.org/api/rest_v1/page/definition/{word}`.
  - Translates definitions to Urdu, Arabic, Hindi, and Spanish via free translation services.
  - Manages `dictionary_cache.db` with thread-safe SQLite connections.
- **Search Router (`backend/app/routes/search.py`)**:
  - Implements multi-tier scoring (Exact = 1000, Prefix = 700, Word = 500, Native = 600).
  - Isolates translation search to the user's active language, preventing cross-language substring collisions.
- **Pedagogy Router (`backend/app/routes/pedagogy.py`)**:
  - Regex diagnostic engine matching 500+ contrastive error patterns across 5 languages.
- **Roleplay Router (`backend/app/routes/survival.py`)**:
  - State-machine driven situational dialogues (Boulangerie, Pharmacie, CAF, Métro).
- **Spaced Repetition Engine (`backend/app/routes/progress.py`)**:
  - SuperMemo-2 (SM-2) algorithm tracking repetition intervals and ease factors.

### 3.2. Frontend Client (`frontend/`)
- **React 18 + Vite + Tailwind CSS**: Runs on port **5173**.
- **Typographic & Cultural Engines**:
  - `Noto Nastaliq Urdu` for authentic Urdu calligraphy.
  - `Amiri` for classical Arabic typography.
  - Bi-directional RTL flipping (`dir="rtl"`) for Urdu and Arabic.
- **Web Speech API**:
  - Zero-cost French TTS (`speechSynthesis`) with native voice selection.
  - Free speech recognition (`SpeechRecognition`) providing real-time pronunciation scoring.
- **Search Experience (`HomeMission.jsx`)**:
  - Real-time dropdown with high-contrast **Meaning Badges** (`Meaning: Cat` / `معنی: بلی`).
  - **Did You Mean Banner** (`💡 Did you mean: « chien »`).
  - Quick clickable chips for essential words (`enchanté`, `bonjour`, `merci`, `bail`, `CAF`, `rendez-vous`, `café`).

### 3.3. Data Storage & Schema
- `backend/data/micro_cards.json`: 121+ curated high-yield micro-cards.
- `backend/data/lexicon.json`: 171+ verified offline vocabulary entries covering countries, food, verbs, and daily nouns.
- `backend/data/dictionary_cache.db`: SQLite database storing online Wiktionary lookups.

---

## 4. Summary of Key Issues Diagnosed & Resolved

| Issue Reported | Root Cause | Engineering Solution |
|---|---|---|
| **Port 8000 Collision** | Port 8000 was claimed by an external process. | Migrated backend permanently to port **8005** with Vite proxy sync. |
| **Accent Sensitivity** | Typing `enchante` failed to match `enchanté`. | Implemented Unicode NFD diacritic normalization (`strip_accents`) in Python & JS. |
| **Search Missing Real Meaning** | Fallback synthesizer returned placeholder `French expression « word »`. | Added 121+ curated cards and built bilingual lexicon returning exact definitions across 5 languages. |
| **Typo Miss (`chein`)** | Exact string matching failed on transposed letters `ei`. | Built Damerau-Levenshtein typo correction detecting transpositions (dist = 1) to auto-match `chien`. |
| **Query Pollution (`Qui` showing `bail`, `loyer`)** | Substring search checked all 5 language translations; Spanish `alquiler` matched `qui`. | Implemented Relevance Scoring (1000/700/500) and isolated translation matching to the active language. |
| **Proper Noun Missing (`japon`)** | Frontend timeout (1500ms) was too tight for cold network lookup; proper nouns required capitalization in Wiktionary. | Added dedicated `card_japon`, expanded offline country lexicon (171+ terms), bumped timeout to 3500ms. |

---

## 5. Verification Matrix & Test Status

### Automated Backend Tests (20/20 Passing)
```bash
$ pytest backend/tests/ -v
backend/tests/test_api.py::test_health_check PASSED                       [  5%]
backend/tests/test_api.py::test_search_french_term PASSED                 [ 10%]
backend/tests/test_api.py::test_search_native_keyword PASSED              [ 15%]
backend/tests/test_api.py::test_get_card_detail PASSED                    [ 20%]
backend/tests/test_api.py::test_explain_mistake_endpoint PASSED           [ 25%]
backend/tests/test_api.py::test_survival_scenarios_list PASSED            [ 30%]
backend/tests/test_api.py::test_survival_turn PASSED                      [ 35%]
backend/tests/test_api.py::test_srs_review_endpoint PASSED                [ 40%]
backend/tests/test_api.py::test_brain_map_endpoint PASSED                 [ 45%]
backend/tests/test_api.py::test_fuzzy_search_typo_correction PASSED       [ 50%]
backend/tests/test_api.py::test_wiktionary_resolver_search PASSED         [ 55%]
backend/tests/test_linguistics.py::test_urdu_script_rendering PASSED      [ 60%]
backend/tests/test_linguistics.py::test_arabic_script_rendering PASSED    [ 65%]
backend/tests/test_linguistics.py::test_no_english_leakage_in_urdu PASSED [ 70%]
backend/tests/test_linguistics.py::test_phonetic_transcription_present PASSED [ 75%]
backend/tests/test_pedagogy.py::test_copula_age_error_detected PASSED     [ 80%]
backend/tests/test_pedagogy.py::test_negation_structure_error PASSED      [ 85%]
backend/tests/test_pedagogy.py::test_gender_agreement_error PASSED        [ 90%]
backend/tests/test_pedagogy.py::test_correct_sentence_passes PASSED       [ 95%]
backend/tests/test_pedagogy.py::test_sm2_algorithm_progression PASSED     [100%]
============================== 20 passed in 0.24s ==============================
```

### Production Build Status
```bash
$ npm run build --prefix frontend
✓ 1873 modules transformed.
dist/index.html                   1.15 kB
dist/assets/index-Bv3wMCHZ.css   30.48 kB
dist/assets/index-DD7S7ZdI.js   368.23 kB
✓ built in 1.08s
```

---

## 6. Live Service Access Points

| Service | Address | Description |
|---|---|---|
| **Web Application** | [http://127.0.0.1:5173/](http://127.0.0.1:5173/) | Interactive React UI with Search, Roleplay, and Brain Map |
| **Backend API** | [http://127.0.0.1:8005/](http://127.0.0.1:8005/) | FastAPI production server |
| **Interactive API Docs** | [http://127.0.0.1:8005/docs](http://127.0.0.1:8005/docs) | Swagger UI for exploring all search & pedagogy endpoints |

---

## 7. Product Roadmap: Next Phases

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: MVP & Vocabulary Engine (COMPLETED & VERIFIED)               │
│ • 121+ Curated Micro-Cards & 171+ Offline Country/Lexicon entries      │
│ • Relevance Scoring Engine (1000/700/500) & Substring Isolation       │
│ • Damerau-Levenshtein Typo Corrector (chein -> chien)                  │
│ • Open Wiktionary API Live Resolver with permanent SQLite cache       │
│ • 4 Survival Roleplay Scenarios with Web Speech audio drills           │
│ • 28 Product Management Portfolio Deliverables                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 2: Offline PWA & Voice Phoneme Scoring (NEXT)                   │
│ • Service Worker caching for 100% offline mobile usage                 │
│ • Target phoneme grading for French nasal vowels (un, en, in, on)     │
│ • Additional survival simulations: La Préfecture, Le Médecin           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 3: Community & Multi-Modal Visual Scanning                      │
│ • Camera OCR scanner for French administrative letters (CAF, CPAM)     │
│ • Immigrant community phrasebook with community-verified tips         │
└────────────────────────────────────────────────────────────────────────┘
```
