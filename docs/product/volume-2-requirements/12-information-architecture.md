# Deliverable 12 — Information Architecture & Navigation

**Product**: Bienvenue  
**Focus**: App Sitemap, Hierarchy, Search-First IA & Modal Flows  
**Status**: Approved & Baseline  

---

## 1. Information Architecture (IA) Philosophy

Traditional language applications use a **rigid linear ladder** (e.g. Lesson 1 $\rightarrow$ Lesson 2 $\rightarrow$ Lesson 3), forcing learners to unlock trivial content sequentially before accessing words they actually need today.

Bienvenue employs a **Dual-Access Information Architecture**:
1. **The Fast Lane (Search-First / Micro-Cards)**: Direct, non-linear entry. Any word, concept, or phrase can be searched and learned in 15 seconds without completing prerequisites.
2. **The Structured Lane (Today's Mission & Brain Map)**: A guided, CEFR-aligned progression backed by spaced repetition (SM-2) for learners wanting daily discipline.

---

## 2. App Sitemap & Navigation Hierarchy

```
BIENVENUE APPLICATION HIERARCHY
│
├── 0.0 Onboarding Flow (First-time user or Language Reset)
│   ├── 0.1 Select Native Language (Urdu, Arabic, Hindi, Spanish, English)
│   ├── 0.2 Select Learning Driver (Move to France, University, Exam, Work, Travel)
│   ├── 0.3 Daily Commitment (5, 10, 20, 30 min)
│   └── 0.4 Placement Diagnostic / A0 Starter
│
├── 1.0 Home / Today's Mission (Primary Dashboard)
│   ├── 1.1 Sticky Universal Search Bar (Always Accessible)
│   │   └── 1.1.1 Micro-Learning Card Modal (Audio, IPA, Contrastive Rules, Practice)
│   ├── 1.2 Daily Streak & CEFR A1 Progress Ring
│   ├── 1.3 Today's 10-Minute Mission Card
│   │   ├── 1.3.1 5-Word Vocabulary Review (SM-2 Spaced Flashcards)
│   │   ├── 1.3.2 Audio Listening Drill
│   │   ├── 1.3.3 Speaking Challenge
│   │   └── 1.3.4 Grammar Micro-Lesson
│   └── 1.4 Quick-Access Survival Packs Carousel
│
├── 2.0 Survival Mode (Life Situation Roleplay)
│   ├── 2.1 Scenario Catalog (Boulangerie, Pharmacie, CAF/Préfecture, Métro)
│   ├── 2.2 Active Roleplay Screen (French Audio, Dual Subtitles, Mic/Text Input)
│   └── 2.3 Evaluation Scorecard (Vocab, Grammar, Pronunciation, Naturalness)
│
├── 3.0 French Brain Map (Visual Mastery DAG)
│   ├── 3.1 CEFR A1 Competency Tree (Nodes: Greetings, Verbs, Gender, Survival)
│   ├── 3.2 Node Status Drilldown (Mastered, Due for Review, In Progress)
│   └── 3.3 Weak Points Direct Review
│
└── 4.0 Profile & Linguistic Settings
    ├── 4.1 Native Language Selector (Instant RTL/LTR UI Re-skin)
    ├── 4.2 Daily Target Adjustment
    └── 4.3 Offline Cache Manager & Data Export
```

---

## 3. Persistent Global Navigation Pattern

```
┌────────────────────────────────────────────────────────┐
│  [Logo: Bienvenue]           [Streak: 🔥 7]  [Lang: 🇵🇰]│
├────────────────────────────────────────────────────────┤
│  🔍 Search any French word or in your language...      │
├────────────────────────────────────────────────────────┤
│                                                        │
│                  MAIN CONTENT VIEW                     │
│    (Today's Mission / Survival / Brain Map / Profile)  │
│                                                        │
├────────────────────────────────────────────────────────┤
│   [🏠 Mission]   [🥖 Survival]   [🧠 Brain Map]   [⚙️] │
└────────────────────────────────────────────────────────┘
```

- **Sticky Top Bar**: Contains the global search bar, active streak, and instant language switcher. Accessible on every screen.
- **Contextual Modals**:
  - *Micro-Learning Card Modal*: Slips up smoothly over any active view when a search term is tapped.
  - *"Explain My Mistake" Drawer*: Automatically surfaces upon an incorrect exercise attempt, presenting contrastive guidance.
- **Bottom Navigation Bar**: 4 key anchors (Mission, Survival, Brain Map, Settings). On RTL languages (Urdu/Arabic), navigation icons mirror appropriately.
