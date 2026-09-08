# Deliverable 18 — Design System & Component Guidelines

**Product**: Bienvenue  
**Focus**: Color Tokens, Multi-Script Typography & Reusable Component Library  
**Status**: Approved & Baseline  

---

## 1. Brand Palette & Color Tokens

Bienvenue blends classical French typographic elegance with modern product warmth, avoiding cold clinical blues or gaudy neon gamification:

```
┌────────────────────────────────────────────────────────┐
│ PRIMARY BRAND COLORS                                   │
│  [ French Navy #1B2A4A ]  - Authority, Stability, Core │
│  [ Warm Linen  #FDFBF7 ]  - Background, Comfort, Paper │
│  [ Pure White  #FFFFFF ]  - Card Surfaces, Containers  │
│  [ Terracotta  #E05A47 ]  - Accent, Primary Action, CTAs│
│  [ French Gold #D4AF37 ]  - Streaks, Badges, Mastery   │
├────────────────────────────────────────────────────────┤
│ SEMANTIC & FEEDBACK COLORS                             │
│  [ Sage Green  #2D7A4D ]  - Correct, Mastered (>85%)   │
│  [ Amber Glow  #D97706 ]  - In Review, Pending SRS     │
│  [ Crimson Alert #DC2626 ]- Error, Urgent Diagnostic   │
│  [ Slate 600   #475569 ]  - Body Text, Secondary Labels│
│  [ Slate 200   #E2E8F0 ]  - Borders, Dividers          │
└────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Script Typography Scale

```css
/* Typography Design Tokens */
:root {
  /* Font Families */
  --font-latin: 'Inter', system-ui, -apple-system, sans-serif;
  --font-urdu: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
  --font-arabic: 'Amiri', 'Noto Naskh Arabic', serif;
  --font-hindi: 'Noto Sans Devanagari', sans-serif;

  /* Font Scales */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */

  /* Line Heights for Script Integrity */
  --leading-latin: 1.5;
  --leading-arabic: 1.8;
  --leading-urdu: 2.2; /* Vital for Nastaliq calligraphic stacks */
}
```

---

## 3. Core Reusable Component Library

### 3.1 The Micro-Learning Card (`<MicroCard />`)
- **Container**: Rounded `rounded-2xl`, background `#FFFFFF`, subtle shadow `shadow-sm`, border `border border-slate-200`.
- **Header**: French word in bold Navy (`text-2xl font-bold text-[#1B2A4A]`) paired with inline IPA badge and audio icon.
- **Transliteration Badge**: Pill with `#F1F5F9` background, showing phonetic guide in learner's script.
- **Contrastive Note Box**: Soft Amber accent box (`bg-amber-50 border-r-4 border-amber-500` in RTL mode) containing native pedagogical tip.

### 3.2 The Survival Dialogue Bubble (`<DialogueBubble />`)
- **Clerk / Native Voice**: Left-aligned (or right in RTL for incoming message), muted navy background (`bg-[#1B2A4A] text-white`), with integrated audio replay icon.
- **Learner Voice**: Warm linen background (`bg-[#FDFBF7] border border-[#E2E8F0] text-slate-800`), with instant pronunciation badge.

### 3.3 The Pronunciation Trigger Button (`<AudioButton />`)
- Circular 40x40px button with Terracotta / Navy active wave animation (`animate-pulse` on speaking).
