# Deliverable 10 — Acceptance Criteria (Given-When-Then / Gherkin)

**Product**: Bienvenue  
**Focus**: BDD Specifications & Verification Rules for Core User Stories  
**Status**: Approved & Baseline  

---

## 1. Quality & Verification Standards

All acceptance criteria follow the **Given-When-Then (Gherkin)** behavioral format. A story is considered Done only when all test conditions evaluate to TRUE in automated or manual test runs.

---

## 2. Acceptance Criteria Scenarios

### Scenario AC-101: Language Selection and RTL Inversion (US-101)
```gherkin
Feature: Multi-Script Onboarding Localization

  Scenario: User selects Urdu and UI flips to RTL
    Given the user is on the Bienvenue Onboarding Language Selection screen
    When the user selects "اردو (Urdu)" as their native language
    Then the application directionality must immediately switch to 'rtl'
    And the primary UI font family must render as "Noto Nastaliq Urdu"
    And all navigation arrows, back buttons, and input text align to the right margin
    And zero English placeholder labels remain visible on subsequent onboarding screens

  Scenario: User selects Arabic and UI flips to RTL
    Given the user is on the Bienvenue Onboarding Language Selection screen
    When the user selects "العربية (Arabic)" as their native language
    Then the application directionality must switch to 'rtl'
    And the primary UI font family must render as "Amiri" or "Noto Naskh Arabic"
    And layout spacing matches Arabic typographic line-height standards
```

---

### Scenario AC-201: Instant Search & Micro-Card Retrieval (US-201 & US-202)
```gherkin
Feature: Instant Bilingual Search & Micro-Learning Cards

  Scenario: User searches a French term and receives contrastive card
    Given the user is on the Home dashboard with native language set to "Urdu"
    When the user types "mais" into the global search input
    Then search suggestions appear within 50 milliseconds
    And selecting "mais" opens the Micro-Learning Card modal
    And the card displays:
      | Field                  | Expected Value                                              |
      | French Term            | mais                                                        |
      | IPA Transcription      | /mɛ/                                                        |
      | Phonetic Transliteration| مے                                                         |
      | Native Translation     | لیکن                                                        |
      | Contrastive Tip        | یہ لفظ دو متضاد باتوں کو جوڑنے کے لیے استعمال ہوتا ہے...   |
    And tapping the speaker icon plays the native French pronunciation audio

  Scenario: User searches by native language keyword
    Given the user is on the Home dashboard with native language set to "Hindi"
    When the user types "लेकिन" into the global search input
    Then the system returns "mais" as the top matching card within 50ms
```

---

### Scenario AC-401: Survival Mode Bakery Roleplay (US-401)
```gherkin
Feature: Survival Roleplay Dialogue & Scoring

  Scenario: User completes a bakery order with correct etiquette
    Given the user enters the "La Boulangerie" survival roleplay scenario
    And the AI clerk opens with "Bonjour ! Vous désirez ?"
    When the user responds: "Je voudrais une baguette, s'il vous plaît."
    Then the AI clerk replies with: "Très bien ! Et avec ceci ?"
    And the user responds: "C'est tout, merci. Ça fait combien ?"
    And the simulation terminates successfully
    Then a completion scorecard is displayed with ratings for:
      | Metric         | Rating Threshold |
      | Vocabulary     | >= 4 Stars       |
      | Grammar        | >= 4 Stars       |
      | Pronunciation  | >= 3 Stars       |
      | Naturalness    | >= 4 Stars       |
    And the summary is explained in the user's native language
```

---

### Scenario AC-501: "Explain My Mistake" Contrastive Copula Diagnostic (US-501)
```gherkin
Feature: Contrastive Error Diagnostics

  Scenario: User uses être instead of avoir for expressing age
    Given the user is doing a French sentence completion exercise
    When the user submits the phrase: "Je suis 25 ans"
    Then the system identifies the error category as "COPULA_AGE_CONFUSION"
    And the system displays the "Explain My Mistake" modal
    And the explanation in Urdu states:
      """
      فرانسیسی میں عمر بتانے کے لیے 'avoir' (to have) کا فعل استعمال ہوتا ہے، نہ کہ 'être'۔
      اردو میں ہم کہتے ہیں 'میری عمر 25 سال ہے'، فرانسیسی میں اس کا ڈھانچہ 'میرے پاس 25 سال ہیں' کی طرح ہوتا ہے۔
      """
    And the modal displays the correct French sentence: "J'ai 25 ans."
    And tapping "Add to Review" schedules "avoir + âge" into the user's SM-2 queue
```

---

### Scenario AC-601: SuperMemo-2 Spaced Repetition Scheduling (US-601)
```gherkin
Feature: SuperMemo-2 (SM-2) Algorithm Verification

  Scenario: User successfully recalls a word with quality 5
    Given a flashcard with repetition count n=0, ease factor EF=2.5, interval I=0
    When the user rates recall quality as q=5 (perfect response)
    Then the repetition count increments to n=1
    And the new interval is set to I=1 day
    And the ease factor remains EF=2.6 (+0.1 adjustment)

  Scenario: User fails recall with quality 1
    Given a flashcard with repetition count n=3, ease factor EF=2.4, interval I=6
    When the user rates recall quality as q=1 (incorrect response)
    Then the repetition count resets to n=0
    And the new interval resets to I=1 day
    And the ease factor decreases according to the SM-2 formula but remains >= 1.3
```
