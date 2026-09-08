# Deliverable 13 — Database Schema & Data Models

**Product**: Bienvenue  
**Focus**: Relational ERD, PostgreSQL / SQLite Schemas & JSONB Specs  
**Status**: Approved & Baseline  

---

## 1. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ USER_MASTERY_SRS : tracks
    USERS ||--o{ ROLEPLAY_HISTORY : records
    LANGUAGES ||--o{ CONTRASTIVE_ADAPTERS : provides
    FRENCH_CONCEPTS ||--o{ CONTRASTIVE_ADAPTERS : has
    FRENCH_CONCEPTS ||--o{ MICRO_CARDS : contains
    MICRO_CARDS ||--o{ EXAMPLES : illustrates
    MICRO_CARDS ||--o{ USER_MASTERY_SRS : schedules
    SURVIVAL_SCENARIOS ||--o{ ROLEPLAY_HISTORY : runs

    USERS {
        uuid id PK
        string username
        string email
        string native_language_code FK
        string learning_driver
        int daily_goal_minutes
        int streak_days
        timestamp created_at
    }

    LANGUAGES {
        string code PK
        string name_native
        string script_direction
        string primary_font
    }

    FRENCH_CONCEPTS {
        string id PK
        string cefr_level
        string title_fr
        string category
        jsonb prerequisites
    }

    CONTRASTIVE_ADAPTERS {
        string id PK
        string concept_id FK
        string language_code FK
        text rule_explanation_native
        text cognitive_trap_warning
        jsonb syntax_mapping
    }

    MICRO_CARDS {
        string id PK
        string concept_id FK
        string french_term
        string ipa
        string concept_type
        jsonb phonetic_transcriptions
        jsonb translations
        jsonb pedagogical_rules
        string audio_url
    }

    EXAMPLES {
        string id PK
        string card_id FK
        text sentence_fr
        jsonb translations
        string audio_url
    }

    USER_MASTERY_SRS {
        uuid id PK
        uuid user_id FK
        string card_id FK
        int repetition_number
        float ease_factor
        int interval_days
        date next_review_date
        timestamp last_reviewed_at
    }

    SURVIVAL_SCENARIOS {
        string id PK
        string title_fr
        string category
        jsonb titles_native
        jsonb dialogue_tree
    }

    ROLEPLAY_HISTORY {
        uuid id PK
        uuid user_id FK
        string scenario_id FK
        int vocabulary_score
        int grammar_score
        int pronunciation_score
        int naturalness_score
        timestamp completed_at
    }
```

---

## 2. PostgreSQL DDL (with SQLite Compatibility)

```sql
-- Languages Table
CREATE TABLE IF NOT EXISTS languages (
    code VARCHAR(5) PRIMARY KEY,
    name_native VARCHAR(64) NOT NULL,
    script_direction VARCHAR(3) DEFAULT 'ltr',
    primary_font VARCHAR(64) NOT NULL
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(128) UNIQUE,
    native_language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
    learning_driver VARCHAR(32) DEFAULT 'moving_to_france',
    daily_goal_minutes INTEGER DEFAULT 10,
    streak_days INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- French Knowledge Graph Concept Nodes
CREATE TABLE IF NOT EXISTS french_concepts (
    id VARCHAR(64) PRIMARY KEY,
    cefr_level VARCHAR(4) NOT NULL, -- A1, A2, B1
    title_fr VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    prerequisites TEXT -- JSON-encoded array of concept IDs
);

-- Micro-Learning Cards Table
CREATE TABLE IF NOT EXISTS micro_cards (
    id VARCHAR(64) PRIMARY KEY,
    concept_id VARCHAR(64) REFERENCES french_concepts(id),
    french_term VARCHAR(128) NOT NULL,
    ipa VARCHAR(64),
    concept_type VARCHAR(64),
    phonetics_json TEXT, -- JSON map: {"ur": "مے", "ar": "ميه", "hi": "मे"}
    translations_json TEXT, -- JSON map: {"ur": "لیکن", "ar": "لكن", "hi": "लेकिन"}
    rules_json TEXT, -- JSON map of contrastive pedagogical explanations
    examples_json TEXT, -- JSON array of bilingual sentence pairs
    audio_url VARCHAR(256)
);

-- SuperMemo-2 (SM-2) Spaced Repetition Table
CREATE TABLE IF NOT EXISTS user_mastery_srs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    card_id VARCHAR(64) NOT NULL REFERENCES micro_cards(id),
    repetition_number INTEGER DEFAULT 0,
    ease_factor REAL DEFAULT 2.5,
    interval_days INTEGER DEFAULT 0,
    next_review_date DATE NOT NULL,
    last_reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pre-seeded Launch Languages
INSERT OR IGNORE INTO languages (code, name_native, script_direction, primary_font) VALUES
('ur', 'اردو', 'rtl', 'Noto Nastaliq Urdu'),
('ar', 'العربية', 'rtl', 'Amiri'),
('hi', 'हिन्दी', 'ltr', 'Noto Sans Devanagari'),
('es', 'Español', 'ltr', 'Inter'),
('en', 'English', 'ltr', 'Inter');
```
