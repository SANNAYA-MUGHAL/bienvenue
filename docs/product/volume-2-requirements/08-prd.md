# Deliverable 08 — Product Requirements Document (PRD)

**Product**: Bienvenue  
**Document Version**: 1.0.0  
**Target Release**: MVP v1.0 (Web & Mobile)  
**Status**: Ready for Engineering Execution  

---

## 1. Document Overview & Objectives

### 1.1 Purpose
This document defines the functional and non-functional specifications for the **Bienvenue** language learning platform. It serves as the primary contract between Product Management, Systems Engineering, and Quality Assurance.

### 1.2 Business & Product Goals
- **G-1 (Activation)**: Achieve $\ge 80\%$ onboarding completion within 90 seconds of first launch.
- **G-2 (Engagement)**: Drive an average of $\ge 5$ Weekly French Mastery Actions (WFMA) per active user.
- **G-3 (Retention)**: Attain Day-7 retention $\ge 35\%$ and Day-30 retention $\ge 22\%$ for new arrival cohorts.
- **G-4 (Linguistic Accuracy)**: $100\%$ zero-English leakage across non-English language pairs.

---

## 2. Functional Requirements (FR)

### FR-1: Multi-Script Frictionless Onboarding
- **FR-1.1**: The system shall present a language picker supporting: Urdu (اردو), Arabic (العربية), Hindi (हिन्दी), Spanish (Español), English.
- **FR-1.2**: Upon selecting Urdu or Arabic, the client UI shall immediately invert directionality to Right-to-Left (RTL) and load appropriate typographic fonts (Noto Nastaliq Urdu or Amiri) without page reload.
- **FR-1.3**: The system shall prompt the user for their primary goal: Moving to France, University, Exam Preparation (TEF/TCF), Work, Everyday Conversation.
- **FR-1.4**: The system shall allow selecting a daily target: 5, 10, 20, or 30+ minutes.
- **FR-1.5**: The system shall provide an option to start at A0 (complete beginner) or take an optional 3-minute placement diagnostic.

### FR-2: Instant Search & Micro-Learning Cards
- **FR-2.1**: The system shall expose a persistent search bar on the home screen accepting inputs in French or the user’s native language.
- **FR-2.2**: The search shall match terms via prefix and substring indexing with response latency $<50\text{ms}$.
- **FR-2.3**: Selecting a search result shall display a Micro-Learning Card modal containing:
  - French term and International Phonetic Alphabet (IPA) transcription.
  - Native script phonetic transliteration (e.g. *مے / meh*).
  - Categorized concept tag (e.g., Conjunction, Auxiliary Verb, Greeting).
  - Contrastive pedagogical explanation in the user's native tongue.
  - At least two real-world bilingual example sentences.
  - Audio playback button using French text-to-speech.
  - 1-tap interactive practice challenge (speaking attempt or fill-in-the-blank).

### FR-3: "Today's Mission" Dashboard
- **FR-3.1**: The dashboard shall display a personalized greeting (*"Bonjour, [Name]"*), current active streak, and CEFR A1 progress percentage.
- **FR-3.2**: The dashboard shall assemble a daily 10-minute mission consisting of:
  - 5 Spaced Repetition (SM-2) vocabulary words.
  - 1 Native audio listening comprehension snippet.
  - 1 Speaking drill.
  - 1 Contrastive grammar micro-lesson.
- **FR-3.3**: Completing each mission module shall immediately increment the user's daily progress and award a completion badge.

### FR-4: Survival Mode (Life Situation Roleplay)
- **FR-4.1**: The system shall offer 4 launch survival scenarios:
  1. *La Boulangerie* (Ordering bread, asking for prices).
  2. *La Pharmacie* (Explaining ailments, requesting medication).
  3. *Le Bureau de la CAF / Préfecture* (Document presentation, appointment checks).
  4. *Le Métro et les Billets* (Buying Navigo passes, asking for platform directions).
- **FR-4.2**: The AI conversation partner shall speak and respond in natural French, accompanied by native-language subtitles.
- **FR-4.3**: At the end of the simulation, the system shall provide a multi-factor scorecard evaluating: Vocabulary, Grammar, Pronunciation, and Naturalness.

### FR-5: "Explain My Mistake" Contrastive Diagnostics
- **FR-5.1**: During any typing or speaking exercise, incorrect responses shall trigger the Contrastive Error Engine.
- **FR-5.2**: The diagnostic response shall:
  - Highlight the exact incorrect token.
  - Provide a clear explanation in the user's native language referencing native grammatical structures (e.g., explaining why French uses *avoir* for age, contrasting with the user's native idiom).
  - Display the correct model sentence.
  - Provide a 1-tap action to add the concept to the user’s Spaced Repetition queue.

### FR-6: French Brain Map & Spaced Repetition (SRS)
- **FR-6.1**: The system shall track memory retention using the SuperMemo-2 (SM-2) algorithm:
  - Calculating ease factor ($EF$), interval ($I$), and repetition count ($n$) based on review quality ($q \in [0, 5]$).
- **FR-6.2**: The system shall render an interactive visual knowledge tree representing CEFR A1 competencies with status indicators (Mastered, Review Due, In Learning).

---

## 3. Non-Functional Requirements (NFR)

### NFR-1: Performance & Latency
- Search query response time: $\le 50\text{ms}$ for cached items; $\le 200\text{ms}$ for database queries under 1,000 concurrent requests.
- Audio playback initialization: $\le 150\text{ms}$.

### NFR-2: Internationalization & Accessibility (i18n & a11y)
- Dynamic RTL mirroring compliant with WCAG 2.1 AA standards.
- Contrast ratios $\ge 4.5:1$ for all body text.
- Full screen-reader accessibility labels on all interactive buttons.

### NFR-3: Reliability & Offline Capabilities
- System uptime $\ge 99.9\%$.
- Graceful offline degradation: cached vocabulary and completed lessons must remain accessible without an active internet connection.

### NFR-4: Security & Privacy
- Zero persistent storage of raw student voice recordings without explicit consent.
- Minimal data collection: email/username and learning telemetry only.
- Strict compliance with GDPR and CCPA.
