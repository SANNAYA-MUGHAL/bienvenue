# 🇫🇷 BIENVENUE: French in the Language You Understand

> **The first contrastive French language learning platform designed to dissolve the "English Intermediary Tax" for billions of global learners.**  
> *French explained, practiced, and diagnosed directly in your native tongue — featuring Urdu, Arabic, Hindi, Spanish, and English.*

---

## 🚀 Quick Start (Running the App)

You can launch both the **FastAPI Backend** and the **Interactive Web Frontend** with a single command:

```bash
cd /Users/sannayamughal/Projects/bienvenue
./start.sh
```

Or run them individually in separate terminals:

### 1. Start the FastAPI Backend
```bash
cd /Users/sannayamughal/Projects/bienvenue
PYTHONPATH=. backend/venv/bin/uvicorn backend.app.main:app --reload --port 8000
```
- **API URL**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Start the React/Tailwind Frontend
```bash
cd /Users/sannayamughal/Projects/bienvenue/frontend
npm run dev
```
- **Web App**: [http://localhost:5173](http://localhost:5173)

### 3. Run the Automated Test Suite (18 Tests)
```bash
cd /Users/sannayamughal/Projects/bienvenue
PYTHONPATH=. backend/venv/bin/pytest backend/tests/ -v
```

---

## 🌟 The 5 Signature Features

1. **Direct Native-Bridge Pedagogy (Zero English Leak)**: All contrastive grammar rules, idioms, and hints are presented in the learner's chosen language (with full Right-to-Left Nastaliq/Arabic script mirroring).
2. **Instant Search & Micro-Learning Cards**: Search any French word or native keyword (e.g. *mais*, *pourtant*, *bail*, *لیکن*) to reveal interactive cards with audio pronunciation, native script transliteration, contrastive rules, and 1-tap speaking practice.
3. **High-Stakes Survival Roleplay**: Authentic interactive dialogues for real-life emergencies in France (*La Boulangerie*, *La Pharmacie*, *L'Administration / CAF*, *Le Métro*).
4. **"Explain My Mistake" Diagnostic Engine**: Type or speak a common error like *"Je suis 25 ans"* and receive an instant native-language explanation contrasting French auxiliary structure (*avoir*) with your native idiom.
5. **French Brain Map & SM-2 Spaced Repetition**: Visual CEFR A1 knowledge graph tracking memory decay intervals and active recall accuracy.

---

## 📂 Product Management Portfolio Suite (The 28 Deliverables)

All 28 PM deliverables are authored in `docs/product/` across 4 publication-ready volumes:

### [Volume 1: Strategy & Market Positioning](docs/product/volume-1-strategy/)
- [01 — Product Vision](docs/product/volume-1-strategy/01-product-vision.md)
- [02 — Market & Competitor Analysis](docs/product/volume-1-strategy/02-market-competitor-analysis.md)
- [03 — User Personas & Empathy Maps](docs/product/volume-1-strategy/03-user-personas.md)
- [04 — Problem Statement & Root Cause Analysis](docs/product/volume-1-strategy/04-problem-statement.md)
- [05 — Value Proposition & Multi-Script Matrix](docs/product/volume-1-strategy/05-value-proposition.md)
- [06 — Product Strategy & Defensible Moats](docs/product/volume-1-strategy/06-product-strategy-moat.md)

### [Volume 2: Product Requirements & UX Architecture](docs/product/volume-2-requirements/)
- [07 — MVP Scope & MoSCoW Prioritization](docs/product/volume-2-requirements/07-mvp-scope-definition.md)
- [08 — Product Requirements Document (PRD)](docs/product/volume-2-requirements/08-prd.md)
- [09 — User Stories (INVEST Framework)](docs/product/volume-2-requirements/09-user-stories.md)
- [10 — Acceptance Criteria (Gherkin BDD Scenarios)](docs/product/volume-2-requirements/10-acceptance-criteria.md)
- [11 — Complete User Journey Maps (Day 1 to 30)](docs/product/volume-2-requirements/11-user-journeys.md)
- [12 — Information Architecture & Sitemap](docs/product/volume-2-requirements/12-information-architecture.md)

### [Volume 3: Architecture, Pedagogy & Design Systems](docs/product/volume-3-architecture/)
- [13 — Database Schema & Data Models](docs/product/volume-3-architecture/13-database-data-model.md)
- [14 — AI & Contrastive Prompt Architecture](docs/product/volume-3-architecture/14-ai-architecture.md)
- [15 — Multilingual & RTL Architecture](docs/product/volume-3-architecture/15-multilingual-architecture.md)
- [16 — French CEFR A1 Curriculum Specification](docs/product/volume-3-architecture/16-french-a1-curriculum.md)
- [17 — UI/UX Screen-by-Screen Specifications](docs/product/volume-3-architecture/17-ui-ux-screen-specs.md)
- [18 — Design System & Component Guidelines](docs/product/volume-3-architecture/18-design-system.md)
- [19 — Full-Stack Technical Architecture](docs/product/volume-3-architecture/19-technical-architecture.md)

### [Volume 4: Execution, QA, GTM & Venture Portfolio](docs/product/volume-4-execution-launch/)
- [20 — 90-Day Development Roadmap](docs/product/volume-4-execution-launch/20-development-roadmap.md)
- [21 — Comprehensive QA Test Strategy](docs/product/volume-4-execution-launch/21-qa-test-strategy.md)
- [22 — Analytics Events & Tracking Taxonomy](docs/product/volume-4-execution-launch/22-analytics-events.md)
- [23 — North Star Metric & KPI Framework (WFMA)](docs/product/volume-4-execution-launch/23-north-star-kpis.md)
- [24 — Monetization Strategy & Unit Economics](docs/product/volume-4-execution-launch/24-monetization-strategy.md)
- [25 — Go-To-Market (GTM) Strategy](docs/product/volume-4-execution-launch/25-go-to-market-strategy.md)
- [26 — 1,000-User Beta Launch Strategy](docs/product/volume-4-execution-launch/26-beta-launch-strategy.md)
- [27 — 12-Slide Venture Investor Pitch Deck](docs/product/volume-4-execution-launch/27-investor-pitch-deck.md)
- [28 — Product Management Portfolio Case Study](docs/product/volume-4-execution-launch/28-product-portfolio-case-study.md)

---

## 🛠️ Open-Source Tech Stack

| Layer | Technologies Used | License / Cost |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Web Speech API (TTS & STT) | MIT • **100% Free** |
| **Backend API** | Python 3.11+, FastAPI, Pydantic v2, Uvicorn | MIT • **100% Free** |
| **Audio & Speech** | Native Browser & System French Voices (`speechSynthesis` + `webkitSpeechRecognition`) | Built-in • **$0.00 Cloud Cost** |
| **Pedagogical Engine** | SuperMemo-2 (SM-2) Spaced Repetition + Local Contrastive Rule Matcher | Open Source • **$0.00 Cloud Cost** |
| **Quality Assurance** | Pytest, HTTPX, Linguistic Diacritic Integrity Suite | Open Source • **100% Automated** |
