# Deliverable 07 — MVP Scope Definition & MoSCoW Prioritization

**Product**: Bienvenue  
**Focus**: Feature Boundaries, MoSCoW Matrix & Release Readiness Gates  
**Status**: Approved & Baseline  

---

## 1. Executive Scope Principle

> *"The fastest way to fail is to launch 100 mediocre language pairs with 50 half-baked features. The fastest way to win is to deliver 5 launch languages with flawless contrastive pedagogy, an addictive search-card engine, and real-world survival utility."*

---

## 2. MoSCoW Prioritization Matrix

```mermaid
graph TD
    subgraph Must Have [MUST HAVE - Day 1 MVP Gate]
        M1["4-Step Frictionless Onboarding (<60s)"]
        M2["5 Source Languages: Urdu, Arabic, Hindi, Spanish, English"]
        M3["Instant French Search with Contrastive Micro-Cards"]
        M4["Survival Roleplay: La Boulangerie, Pharmacie, CAF, Métro"]
        M5["'Explain My Mistake' Diagnostic in Native Language"]
        M6["Spaced Repetition (SM-2) Daily Mission Queue"]
        M7["Native Browser/Device TTS Audio Playback"]
    end

    subgraph Should Have [SHOULD HAVE - v1.1]
        S1["Voice Recording & Speech Recognition Evaluation"]
        S2["Personalized French Brain Map Visualization"]
        S3["Offline Cache for Previously Viewed Lessons"]
        S4["Dark Mode Support"]
    end

    subgraph Could Have [COULD HAVE - v1.2]
        C1["Community Bilingual Correction Upvoting"]
        C2["TEF/TCF Exam Simulation Timer Mode"]
        C3["French Around Me (Camera OCR Object Translation)"]
    end

    subgraph Won't Have [WON'T HAVE - MVP Non-Goals]
        W1["100+ Source Languages (Strictly 5 for MVP)"]
        W2["B2 / C1 Complex Literature Curriculum"]
        W3["Gamified Avatar Clothes & Pet Mascots"]
        W4["P2P Video Chat or Paid Tutor Marketplace"]
    end
```

---

## 3. Detailed MVP Feature Boundaries

| Module | In Scope for MVP (v1.0) | Explicit Non-Goals for MVP |
|---|---|---|
| **Curriculum & Levels** | Complete CEFR A1 foundation (greetings, essentials, *être/avoir*, gender, present regular verbs, survival situations). | A2/B1/B2/C1 curriculum tracks (deferred to Phase 2). |
| **Languages Supported** | Urdu (اردو), Arabic (العربية), Hindi (हिन्दी), Spanish (Español), English. | 100+ global languages. |
| **Search Engine** | Fast prefix & full-text search across French terms and native language keywords; renders interactive Micro-Card. | Complex semantic query parsing across full French legal treatises. |
| **Voice & Speech** | Native device speech synthesis (TTS) for all French words & Web Speech API STT for speech practice. | Proprietary custom neural voice cloning. |
| **Error Diagnostics** | 500+ curated high-frequency contrastive errors (age with *avoir*, nominal copula in Arabic, SOV word order). | Open-domain essays grading or thesis correction. |
| **Monetization** | 100% Free Core experience; clean upgrade preview for B2B/Premium. | Hard paywalls or intrusive pop-up advertisements. |

---

## 4. Release Readiness Quality Gates

An MVP release build is blocked from deployment unless it passes all 5 criteria:

1. **Gate 1: Linguistic Integrity**: Zero English words appear in explanations when the selected language is Urdu, Arabic, Hindi, or Spanish.
2. **Gate 2: Script & Layout Fidelity**: Right-to-Left (RTL) layout renders without horizontal scroll overflow or misaligned icons on Urdu and Arabic views.
3. **Gate 3: Search Latency**: Query to Micro-Card render time is under **50ms** for cached entries and under **250ms** for database lookups.
4. **Gate 4: Error Diagnostic Accuracy**: 100% of the top 20 canonical error scenarios (e.g. *"Je suis 25 ans"*, *"Je suis faim"*) correctly trigger the native contrastive explanation.
5. **Gate 5: Crash-Free Session Rate**: Greater than **99.5%** during automated E2E session runs.
