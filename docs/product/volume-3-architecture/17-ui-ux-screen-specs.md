# Deliverable 17 — UI/UX Screen-by-Screen Specifications

**Product**: Bienvenue  
**Focus**: Layout Wireframes, Interaction States & Component Specs  
**Status**: Approved & Baseline  

---

## 1. Screen 1: Frictionless Onboarding (4 Steps)

```
┌────────────────────────────────────────────────────────┐
│ [Step Indicator: ● ○ ○ ○]                     [Skip]   │
│                                                        │
│                    BIENVENUE 🇫🇷                        │
│          French in the language you understand         │
│                                                        │
│ What is your native language?                          │
│                                                        │
│  [🇵🇰  اردو (Urdu)             RTL]  <-- User Taps      │
│  [🇸🇦  العربية (Arabic)        RTL]                     │
│  [🇮🇳  हिन्दी (Hindi)           LTR]                     │
│  [🇪🇸  Español                 LTR]                     │
│  [🇺🇸  English                 LTR]                     │
│                                                        │
│  [ Continue -> ] (Immediately switches to RTL on Urdu) │
└────────────────────────────────────────────────────────┘
```
- **Component**: `OnboardingLanguageStep`
- **State Machine**:
  - `INITIAL`: Displays list of 5 flags and native script titles.
  - `SELECTED`: Selected card receives primary navy border + terracotta checkmark.
  - `TRANSITION`: On "Continue", triggers global i18n hook, setting `document.dir = 'rtl'` if Urdu/Arabic.

---

## 2. Screen 2: Home Dashboard ("Today's Mission")

```
┌────────────────────────────────────────────────────────┐
│ Bonjour, Sana 👋           [🔥 7 Jours]   [🇫🇷 A1: 28%] │
├────────────────────────────────────────────────────────┤
│ 🔍 Search French in Urdu... (e.g. mais / لیکن)         │
├────────────────────────────────────────────────────────┤
│                                                        │
│  🎯 TODAY'S 10-MINUTE MISSION                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🧠 5 Words to Master (SM-2 Review)      [Start >]│  │
│  │ 🎧 Audio: "Commander à la boulangerie"  [Listen>]│  │
│  │ 🗣️ Speaking: "Demander le prix"         [Speak >]│  │
│  │ 📖 Grammar: Être vs Avoir (Urdu guide)  [Read >] │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  🥖 SURVIVAL LIFE SITUATIONS                           │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐  │
│  │ Boulangerie  │ │ Pharmacie    │ │ CAF / Préfect. │  │
│  │ 4 dialogues  │ │ 3 dialogues  │ │ 5 dialogues    │  │
│  └──────────────┘ └──────────────┘ └────────────────┘  │
│                                                        │
├────────────────────────────────────────────────────────┤
│   [🏠 Mission]   [🥖 Survival]   [🧠 Brain Map]   [⚙️] │
└────────────────────────────────────────────────────────┘
```

---

## 3. Screen 3: Instant Search & Micro-Learning Card Modal

```
┌────────────────────────────────────────────────────────┐
│ [✕ Close]                                              │
│                                                        │
│  MAIS                      🔊 [Ecouter /mɛ/]           │
│  Conjunction • Contrast                                │
│                                                        │
│  اردو ترجمہ:  لیکن                                    │
│  تلفظ:  مے (Meh)                                      │
│                                                        │
│  📖 قاعدہ (Grammar Rule):                              │
│  یہ لفظ دو متضاد باتوں کو جوڑنے کے لیے استعمال ہوتا    │
│  ہے۔ جملے کے درمیان آتا ہے۔                            │
│                                                        │
│  💬 مثالیں (Examples):                                 │
│  1. Je veux sortir, mais il pleut.                     │
│     میں باہر جانا چاہتی ہوں، لیکن بارش ہو رہی ہے۔      │
│  2. Je suis fatiguée mais heureuse.                    │
│     میں تھکی ہوئی ہوں لیکن خوش ہوں۔                    │
│                                                        │
│  🎤 کہئے (Say It):                                     │
│  [ 🎙️ Tap to Speak Sentence 1 ]                        │
│  Pronunciation Score: 88% ⭐⭐⭐⭐                     │
│                                                        │
│  [ + Add to My Brain Map ]                             │
└────────────────────────────────────────────────────────┘
```

---

## 4. Screen 4: Survival Mode (Interactive Roleplay)

```
┌────────────────────────────────────────────────────────┐
│ [← Back]          La Boulangerie 🥐           [Help ?] │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Clerk 👩‍🍳]                                          │
│  "Bonjour ! Vous désirez ?"               🔊 [Listen]  │
│  (سلام! آپ کو کیا چاہیے؟)                              │
│                                                        │
│                               [You 🙋‍♀️]                 │
│                               "Je voudrais deux        │
│                               croissants, s'il vous    │
│                               plaît."                  │
│                                                        │
│  [Clerk 👩‍🍳]                                          │
│  "Très bien, et avec ceci ?"              🔊 [Listen]  │
│  (بہت خوب، اور اس کے ساتھ؟)                            │
│                                                        │
├────────────────────────────────────────────────────────┤
│  [ 🎙️ Hold to Speak ]  OR  [ ⌨️ Type response... ]     │
│  Suggested: "Une baguette, s'il vous plaît."           │
└────────────────────────────────────────────────────────┘
```

---

## 5. Screen 5: "Explain My Mistake" Diagnostic Drawer

```
┌────────────────────────────────────────────────────────┐
│ 💡 نکتہ برائے اصلاح (Grammar Diagnostic)      [✕ Done] │
├────────────────────────────────────────────────────────┤
│  آپ کا جملہ:                                          │
│  ❌ "Je suis 25 ans."                                  │
│                                                        │
│  فرانسیسی میں عمر بتانے کا اصول:                       │
│  یہاں فعل 'avoir' (رکھنا) استعمال ہوتا ہے، نہ کہ      │
│  'être' (ہونا)۔                                        │
│                                                        │
│  اردو میں ہم کہتے ہیں 'میری عمر 25 سال ہے'، لیکن       │
│  فرانسیسی زبان میں تصور یہ ہے کہ 'میرے پاس 25 سال      │
│  ہیں'۔                                                 │
│                                                        │
│  درست جملہ:                                            │
│  ✅ "J'ai 25 ans."                        🔊 [Listen]  │
│                                                        │
│  [ 🔁 اس کی دوبارہ مشق کریں (Practice Again) ]        │
│  [ 📌 Save to My Weak Points Queue ]                   │
└────────────────────────────────────────────────────────┘
```

---

## 6. Screen 6: French Brain Map (Visual Mastery Tracker)

```
┌────────────────────────────────────────────────────────┐
│ French Brain Map          [A1: 32% Mastered] [Level 1] │
├────────────────────────────────────────────────────────┤
│                                                        │
│         [ 🟢 Greetings (100%) ]                        │
│                    │                                   │
│         [ 🟢 Tu vs Vous (100%) ]                       │
│                    │                                   │
│         [ 🟡 Être vs Avoir (65%) ] <-- Needs review    │
│              /           \                             │
│  [ 🟢 Numbers (90%) ]   [ 🔴 Survival Boulangerie ]    │
│                                                        │
│  Color Legend:                                         │
│  🟢 Mastered (>85%)  🟡 In Progress  🔴 Review Overdue │
│                                                        │
│  [ ⚡ Review 3 Overdue Nodes (5 min) ]                 │
└────────────────────────────────────────────────────────┘
```
