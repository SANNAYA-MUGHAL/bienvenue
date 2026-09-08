# Deliverable 22 — Analytics Events & Tracking Taxonomy

**Product**: Bienvenue  
**Focus**: Product Instrumentation, Event Tracking Taxonomy (PostHog/Mixpanel)  
**Status**: Approved & Baseline  

---

## 1. Instrumentation Principles

1. **Privacy-First**: No Personally Identifiable Information (PII) or student voice recordings are logged in event properties.
2. **Standardized Syntax**: Event names follow the `noun_verb` pattern (e.g. `micro_card_viewed`, `search_submitted`).
3. **Linguistic Context**: Every user action is tagged with their active `native_language` to identify cross-linguistic friction points.

---

## 2. Core Event Taxonomy

| Event Name | Trigger | Key Properties | Strategic Value |
|---|---|---|---|
| `onboarding_started` | User opens first onboarding screen | `referrer`, `device_platform` | Measures top of funnel |
| `onboarding_completed` | User finishes language & goal selection | `native_lang`, `learning_driver`, `daily_goal_minutes`, `duration_seconds` | Core activation metric |
| `word_searched` | User submits query in search bar | `query_text`, `query_language`, `match_found`, `latency_ms` | Identifies missing dictionary terms |
| `micro_card_viewed` | User opens a micro-card modal | `card_id`, `french_term`, `native_lang`, `source` (`search` vs `mission`) | Engagement tracking |
| `audio_played` | User taps speaker button | `card_id`, `audio_type` (`word` vs `example`) | Audio demand |
| `pronunciation_attempted` | User speaks phrase into mic | `card_id`, `score_percentage`, `duration_ms` | Active learning measurement |
| `survival_session_started`| User launches a survival scenario | `scenario_id` (`boulangerie`, `caf`), `native_lang` | High-stakes scenario interest |
| `survival_session_completed`| User reaches end of dialogue | `scenario_id`, `turns_count`, `vocab_score`, `grammar_score`, `naturalness_score` | Practical fluency validation |
| `mistake_diagnosed` | User submits error; diagnostic shows | `error_category`, `concept_id`, `native_lang`, `time_to_dismiss_sec` | Core moat: monitors L1 error patterns |
| `srs_card_reviewed` | User grades flashcard recall | `card_id`, `recall_quality` (0-5), `new_interval_days`, `ease_factor` | SM-2 retention engine metrics |

---

## 3. User State Properties

- `user_id`: Anonymous UUID
- `native_language`: `ur`, `ar`, `hi`, `es`, `en`
- `learning_driver`: `moving_to_france`, `university`, `exam_tef`, `work`, `conversation`
- `current_cefr_level`: `A0`, `A1`, `A2`
- `cefr_progress_pct`: Percentage of A1 knowledge graph mastered (0–100)
- `streak_count`: Consecutive active days
- `total_wfma_count`: Lifetime Weekly French Mastery Actions completed
