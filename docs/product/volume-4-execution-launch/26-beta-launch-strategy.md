# Deliverable 26 — 1,000-User Beta Launch Strategy

**Product**: Bienvenue  
**Focus**: Closed Beta Playbook, Cohort Segmentation & Feedback Loops  
**Status**: Approved & Baseline  

---

## 1. Beta Cohort Segmentation (Target: 1,000 Users)

To stress-test linguistic accuracy, script rendering, and pedagogical retention across diverse cognitive backgrounds, the 1,000-user beta cohort is deliberately balanced:

```
┌────────────────────────────────────────────────────────┐
│ 1,000-USER CLOSED BETA COMPOSITION                     │
│  • Urdu Cohort (35% - 350 users): Paris students & expat│
│    families from Pakistan / diaspora.                  │
│  • Arabic Cohort (35% - 350 users): Maghreb & Middle   │
│    Eastern engineers, tech workers, and students.      │
│  • Hindi Cohort (15% - 150 users): TEF Canada & student │
│    candidates in India & Montreal.                     │
│  • Spanish Cohort (10% - 100 users): Latin American &  │
│    Spanish exchange students in France.                │
│  • English Control Cohort (5% - 50 users): International│
│    baseline benchmark.                                 │
└────────────────────────────────────────────────────────┘
```

---

## 2. Beta Recruitment & Screener Criteria

### 2.1 Screener Form Questions
1. *"What is your native mother tongue?"* (Must match target cohorts).
2. *"Where are you currently living?"* (Prioritize users in France or planning relocation within 90 days).
3. *"What is your primary French goal?"* (Moving to France, University, TEF/TCF, Survival).
4. *"Are you willing to complete a 5-minute weekly feedback survey?"* (Yes required).

### 2.2 Distribution Rails
- **iOS**: Apple TestFlight (1,000 seats allocated).
- **Android**: Google Play Internal / Closed Beta Track.
- **Web**: Password-protected staging deployment at `beta.bienvenue.app`.

---

## 3. Weekly Feedback Loops & In-App Diagnostics

- **Micro-Survey Trigger (Day 3 & Day 14)**:
  - *"Did the Urdu/Arabic explanation make the French grammar clearer than English apps? (1 to 5 Stars)"*
  - *"Did you encounter any broken Arabic/Urdu typography or awkward phrasing? [Text input]"*
- **Community Telegram / WhatsApp VIP Channel**:
  - Direct, synchronous channel connecting beta testers to the PM and engineering leads.
  - Bug bounties awarded for identifying linguistic mistakes or font clipping.

---

## 4. Beta Exit & General Availability (GA) Criteria

The application will be greenlit for global public launch only when:
1. **Day-7 Retention**: $\ge 32\%$ across the 1,000 beta cohort.
2. **Weekly French Mastery Actions**: Average $\ge 12$ actions per active weekly user.
3. **Linguistic Satisfaction Score**: $\ge 88\%$ positive rating on native-language grammar clarity.
4. **Crash-Free Sessions**: $\ge 99.7\%$ on both iOS and Android.
