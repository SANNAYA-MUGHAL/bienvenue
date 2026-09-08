# Bienvenue Full-Stack MVP & 28-Part PM Portfolio Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author the complete 28-deliverable Product Management portfolio package across 4 volumes, and implement a fully functional, 100% open-source full-stack multilingual French learning MVP (FastAPI + React/Expo web frontend + SQLite/Postgres + contrastive pedagogical engine + native speech audio).

**Architecture:** A decoupled client-server architecture. The backend (FastAPI) provides instant full-text search across French and 5 source languages (Urdu, Arabic, Hindi, Spanish, English), contrastive mistake diagnostics, roleplay simulation, and SM-2 spaced repetition tracking. The frontend provides a responsive mobile/web experience with full RTL mirroring for Urdu and Arabic, native browser/device TTS and speech recognition, and instant micro-learning card interactions.

**Tech Stack:** 
- Documentation: Markdown + Mermaid.js diagrams
- Backend: Python 3.11+, FastAPI, Pydantic v2, Uvicorn, Pytest, HTTPX, SQLite/PostgreSQL
- Frontend: React / Vite / Tailwind CSS with Expo-compatible architecture, Lucide icons, Web Speech API (speech synthesis & recognition), RTL CSS layout engine
- Data/AI: JSON Knowledge Graph (CEFR A1), deterministic contrastive grammar rule engine, SM-2 SRS engine, Ollama/OpenAI-compatible prompt hooks

**Spec:** [`docs/superpowers/specs/2026-09-08-bienvenue-product-and-mvp-design.md`](file:///Users/sannayamughal/Projects/bienvenue/docs/superpowers/specs/2026-09-08-bienvenue-product-and-mvp-design.md)

## Global Constraints
- Native language first: All explanations in Urdu, Arabic, Hindi, Spanish, or English without intermediate English translation.
- RTL compliance: Complete mirroring and proper typographic rendering for Urdu and Arabic scripts.
- Open-source and free: Zero required paid APIs; default to local contrastive rule engine, SQLite, and native browser/device TTS & STT.
- Verification: Every backend endpoint and pedagogical rule verified via automated Pytest tests.

---

### Task 1: Project Scaffolding & Directory Architecture
**Files:**
- Create: `README.md`
- Create: `docs/product/` directory tree (Volumes 1-4)
- Create: `backend/` directory tree
- Create: `frontend/` directory tree

- [ ] Step 1: Initialize directory structure for documentation, backend, and frontend.
- [ ] Step 2: Add initial root `.gitignore` and `README.md` project overview.
- [ ] Step 3: Commit scaffolding.

---

### Task 2: Deliver Phase 1 PM Portfolio Suite (Volume 1: Strategy & Market Positioning)
**Files:**
- Create: `docs/product/volume-1-strategy/01-product-vision.md`
- Create: `docs/product/volume-1-strategy/02-market-competitor-analysis.md`
- Create: `docs/product/volume-1-strategy/03-user-personas.md`
- Create: `docs/product/volume-1-strategy/04-problem-statement.md`
- Create: `docs/product/volume-1-strategy/05-value-proposition.md`
- Create: `docs/product/volume-1-strategy/06-product-strategy-moat.md`

- [ ] Step 1: Author 01-product-vision.md (Mission, 5 pillars, core differentiator).
- [ ] Step 2: Author 02-market-competitor-analysis.md (Duolingo, Babbel, Busuu, Speak, feature-by-feature matrix, Blue Ocean canvas).
- [ ] Step 3: Author 03-user-personas.md (Sana from Lahore/Paris, Tariq from Casablanca/Lyon, Rahul from Delhi/Montreal).
- [ ] Step 4: Author 04-problem-statement.md (The English intermediary tax, cognitive load, tourist vs. survival disconnect).
- [ ] Step 5: Author 05-value-proposition.md (Value prop canvas, multi-script messaging matrix in Urdu, Arabic, Hindi, Spanish, English).
- [ ] Step 6: Author 06-product-strategy-moat.md (The 5 moats: contrastive error graph, pedagogical DB, local survival packs).
- [ ] Step 7: Commit Volume 1.

---

### Task 3: Deliver Phase 2 PM Portfolio Suite (Volume 2: Product Requirements & UX)
**Files:**
- Create: `docs/product/volume-2-requirements/07-mvp-scope-definition.md`
- Create: `docs/product/volume-2-requirements/08-prd.md`
- Create: `docs/product/volume-2-requirements/09-user-stories.md`
- Create: `docs/product/volume-2-requirements/10-acceptance-criteria.md`
- Create: `docs/product/volume-2-requirements/11-user-journeys.md`
- Create: `docs/product/volume-2-requirements/12-information-architecture.md`

- [ ] Step 1: Author 07-mvp-scope-definition.md (MoSCoW matrix, non-goals, release gates).
- [ ] Step 2: Author 08-prd.md (Comprehensive PRD: functional specs, performance SLAs, i18n rules).
- [ ] Step 3: Author 09-user-stories.md (Epics: Onboarding, Search, Micro-Cards, Survival, Mistake Diagnostic, Brain Map).
- [ ] Step 4: Author 10-acceptance-criteria.md (Given-When-Then BDD scenarios for all critical user actions).
- [ ] Step 5: Author 11-user-journeys.md (Day 1, Day 7, Day 30 emotional and milestone journey maps).
- [ ] Step 6: Author 12-information-architecture.md (App sitemap, navigation taxonomy, search-first hierarchy).
- [ ] Step 7: Commit Volume 2.

---

### Task 4: Deliver Phase 3 PM Portfolio Suite (Volume 3: Architecture & Pedagogy)
**Files:**
- Create: `docs/product/volume-3-architecture/13-database-data-model.md`
- Create: `docs/product/volume-3-architecture/14-ai-architecture.md`
- Create: `docs/product/volume-3-architecture/15-multilingual-architecture.md`
- Create: `docs/product/volume-3-architecture/16-french-a1-curriculum.md`
- Create: `docs/product/volume-3-architecture/17-ui-ux-screen-specs.md`
- Create: `docs/product/volume-3-architecture/18-design-system.md`
- Create: `docs/product/volume-3-architecture/19-technical-architecture.md`

- [ ] Step 1: Author 13-database-data-model.md (ERD, PostgreSQL DDL, JSONB schemas for cards and user mastery).
- [ ] Step 2: Author 14-ai-architecture.md (System prompts, few-shot contrastive templates, token budgeting, Ollama/OpenAI hooks).
- [ ] Step 3: Author 15-multilingual-architecture.md (RTL/LTR switching, script typography, zero-English leak guarantee).
- [ ] Step 4: Author 16-french-a1-curriculum.md (30-day modular CEFR A1 Knowledge Graph with milestones).
- [ ] Step 5: Author 17-ui-ux-screen-specs.md (6 core screens, UI state machines, edge states).
- [ ] Step 6: Author 18-design-system.md (Color palette, typography scale for 4 scripts, reusable UI components).
- [ ] Step 7: Author 19-technical-architecture.md (Full-stack architecture, API contracts, deployment options).
- [ ] Step 8: Commit Volume 3.

---

### Task 5: Deliver Phase 4 PM Portfolio Suite (Volume 4: Execution, QA, GTM & Venture)
**Files:**
- Create: `docs/product/volume-4-execution-launch/20-development-roadmap.md`
- Create: `docs/product/volume-4-execution-launch/21-qa-test-strategy.md`
- Create: `docs/product/volume-4-execution-launch/22-analytics-events.md`
- Create: `docs/product/volume-4-execution-launch/23-north-star-kpis.md`
- Create: `docs/product/volume-4-execution-launch/24-monetization-strategy.md`
- Create: `docs/product/volume-4-execution-launch/25-go-to-market-strategy.md`
- Create: `docs/product/volume-4-execution-launch/26-beta-launch-strategy.md`
- Create: `docs/product/volume-4-execution-launch/27-investor-pitch-deck.md`
- Create: `docs/product/volume-4-execution-launch/28-product-portfolio-case-study.md`
- Create: `docs/product/README.md` (Master Table of Contents and Portfolio Navigation)

- [ ] Step 1: Author 20-development-roadmap.md (90-day sprint schedule).
- [ ] Step 2: Author 21-qa-test-strategy.md (Test matrix, automated suites, QA test cases, RTL edge cases).
- [ ] Step 3: Author 22-analytics-events.md (Tracking taxonomy, events, user properties).
- [ ] Step 4: Author 23-north-star-kpis.md (WFMA - Weekly French Mastery Actions, funnel targets).
- [ ] Step 5: Author 24-monetization-strategy.md (Freemium mechanics, B2B university/OFII pilots).
- [ ] Step 6: Author 25-go-to-market-strategy.md (Student ambassadorship, diaspora community hooks, viral micro-cards).
- [ ] Step 7: Author 26-beta-launch-strategy.md (1,000-user closed beta cohort playbook).
- [ ] Step 8: Author 27-investor-pitch-deck.md (12-slide venture narrative).
- [ ] Step 9: Author 28-product-portfolio-case-study.md (Executive case study for PM hiring managers).
- [ ] Step 10: Author `docs/product/README.md` master index.
- [ ] Step 11: Commit Volume 4.

---

### Task 6: Contrastive Pedagogical Data & Rule Engine
**Files:**
- Create: `backend/data/knowledge_graph.json`
- Create: `backend/data/micro_cards.json`
- Create: `backend/data/contrastive_rules.json`
- Create: `backend/data/survival_scenarios.json`
- Create: `backend/app/pedagogy/rule_engine.py`
- Create: `backend/app/pedagogy/srs.py`

- [ ] Step 1: Assemble the comprehensive multilingual dataset for French ↔ (Urdu, Arabic, Hindi, Spanish, English).
- [ ] Step 2: Implement SuperMemo-2 (SM-2) algorithm in `srs.py`.
- [ ] Step 3: Implement contrastive diagnostic rule matcher in `rule_engine.py`.
- [ ] Step 4: Write unit tests for SM-2 and rule matcher.
- [ ] Step 5: Run tests and verify pass.
- [ ] Step 6: Commit.

---

### Task 7: FastAPI Backend Implementation
**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/app/main.py`
- Create: `backend/app/models.py`
- Create: `backend/app/routes/search.py`
- Create: `backend/app/routes/pedagogy.py`
- Create: `backend/app/routes/survival.py`
- Create: `backend/app/routes/progress.py`
- Create: `backend/tests/test_api.py`

- [ ] Step 1: Set up FastAPI application with CORS, health check, and schema validation.
- [ ] Step 2: Implement `/api/search` endpoint (sub-20ms search across French and 5 source languages).
- [ ] Step 3: Implement `/api/card/{id}` and `/api/explain-mistake` endpoints.
- [ ] Step 4: Implement `/api/survival/scenarios` and `/api/survival/dialogue` endpoints.
- [ ] Step 5: Implement `/api/progress/srs-review` and `/api/progress/brain-map` endpoints.
- [ ] Step 6: Write API test suite with Pytest and verify all endpoints return 200 with valid data.
- [ ] Step 7: Commit backend.

---

### Task 8: Interactive Frontend MVP Implementation
**Files:**
- Create: `frontend/package.json`
- Create: `frontend/index.html`
- Create: `frontend/src/index.css`
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/components/Onboarding.jsx`
- Create: `frontend/src/components/HomeMission.jsx`
- Create: `frontend/src/components/MicroCardModal.jsx`
- Create: `frontend/src/components/SurvivalRoleplay.jsx`
- Create: `frontend/src/components/ExplainMistakeModal.jsx`
- Create: `frontend/src/components/BrainMap.jsx`
- Create: `frontend/src/services/speech.js`
- Create: `frontend/src/services/api.js`

- [ ] Step 1: Scaffold frontend with Tailwind CSS, multi-script fonts, and Lucide icons.
- [ ] Step 2: Implement speech synthesis (French TTS) and voice recording/STT service using browser native APIs.
- [ ] Step 3: Implement dynamic RTL/LTR directionality and script typography switching.
- [ ] Step 4: Build Onboarding flow, Home "Today's Mission" dashboard, and Instant Search bar.
- [ ] Step 5: Build Micro-Learning Card modal with pronunciation scoring and active practice.
- [ ] Step 6: Build Life Situation Mode (Boulangerie, Pharmacie, CAF, Métro) with interactive dialogue.
- [ ] Step 7: Build "Explain My Mistake" diagnostic drawer.
- [ ] Step 8: Build French Brain Map visual mastery tracker.
- [ ] Step 9: Build and verify frontend functionality.
- [ ] Step 10: Commit frontend.

---

### Task 9: Automated Verification & Test Suite
**Files:**
- Test: `backend/tests/test_api.py`
- Test: `backend/tests/test_pedagogy.py`
- Test: `backend/tests/test_linguistics.py`

- [ ] Step 1: Run comprehensive backend test suite (asserting zero English leak in Urdu/Arabic, correct SM-2 scheduling, sub-50ms search latency).
- [ ] Step 2: Validate frontend build and component rendering across all 5 language modes.
- [ ] Step 3: Commit verification suite.

---

### Task 10: Portfolio Packaging & Walkthrough
**Files:**
- Create: `walkthrough.md` in artifact directory
- Update: `README.md` in project root with execution instructions, screenshots, and portfolio links

- [ ] Step 1: Generate comprehensive walkthrough documentation detailing every deliverable, technical component, test output, and user guide.
- [ ] Step 2: Final git commit and status review.
