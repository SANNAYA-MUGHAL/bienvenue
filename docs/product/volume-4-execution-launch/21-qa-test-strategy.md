# Deliverable 21 — Comprehensive QA Test Strategy & Quality Plan

**Product**: Bienvenue  
**Document Owner**: QA Lead / Senior PM  
**Focus**: Verification Architecture, Automated Suites, Linguistic Integrity & RTL Edge Cases  
**Status**: Approved & Baseline  

---

## 1. Quality Assurance Philosophy

> *"In a multilingual pedagogical application, a software bug is not merely an inconvenience; a linguistic or typographical defect destroys trust and misinforms learners. Our QA bar requires absolute linguistic fidelity, strict RTL symmetry, and mathematical accuracy in spaced repetition."*

---

## 2. Multi-Tier Test Pyramid

```
                ▲
               / \
              /   \
             / E2E \       Playwright / Cypress (Web)
            / Tests \      User Flows: Onboarding -> Search -> Roleplay
           /─────────\
          /  Linguistic\    Automated Script & Zero-English Leakage Tests
         /  & RTL Tests \   Bi-directional layout, Unicode normalization
        /────────────────\
       /   Integration    \  Pytest + HTTPX for FastAPI Endpoints
      /     API Tests      \ Response schemas, <50ms Search latency SLAs
     /──────────────────────\
    /      Unit Tests        \  Pytest for SM-2 Algorithm &
   /──────────────────────────\ Contrastive Rule Engine Matchers
```

---

## 3. Detailed Test Matrix & Traceability

| Test ID | PRD Req | Test Scope | Tool / Framework | Pass Criteria |
|---|---|---|---|---|
| **TC-UNIT-01** | FR-6.1 | SuperMemo-2 Interval Formula | `pytest` | Validates $I(1)=1$, $I(2)=6$, $EF \ge 1.3$, correct interval growth on $q=5$. |
| **TC-UNIT-02** | FR-5.1 | Contrastive Copula Matcher | `pytest` | Submitting *"Je suis 25 ans"* triggers `COPULA_AGE_AVOIR` with 100% confidence. |
| **TC-LING-01** | FR-1.2 | Zero English Leakage | Custom Python Runner | Asserts that in Urdu/Arabic response payloads, 0% of characters are Latin (outside French quotes). |
| **TC-LING-02** | FR-1.2 | French Diacritic Integrity | `pytest` | Asserts accented characters (*é, è, ê, à, ç, œ*) are preserved across all JSON payloads. |
| **TC-RTL-01** | FR-1.2 | Bidirectional Layout Mirroring | Playwright / Jest | Asserts `dir="rtl"` applied to DOM, elements aligned to right, icons flipped. |
| **TC-API-01** | FR-2.2 | Instant Search Latency SLA | `pytest-benchmark` / HTTPX | 95th percentile response time for `/api/search` is $<50\text{ms}$ under load. |
| **TC-E2E-01** | FR-4.1 | Survival Bakery Flow | Playwright E2E | Completes dialogue turn in La Boulangerie and renders 4-criteria scorecard. |

---

## 4. Linguistic & Script Edge Cases Handled

1. **The Nastaliq Stacking Bug**: Nastaliq characters stack diagonally. Standard CSS line-height causes top diacritics (*zer/zabar/pesh*) to be clipped by parent containers. QA verifies `line-height >= 2.2` and `overflow: visible` on all Urdu text containers.
2. **Punctuation Flipping in LTR/RTL Mixed Text**: When a French sentence (*"Je suis fatiguée."*) is embedded inside an Urdu sentence, a browser may move the period to the right side of the French word. QA mandates and tests `<span dir="ltr">` wrapper encapsulation.
3. **Unicode Normalization (NFC vs NFD)**: French accents can be represented as pre-composed characters (*é* = `\u00E9`) or combining characters (*e* + `\u0301`). The backend normalizes all search strings to Unicode NFC before index lookup.

---

## 5. Defect Severity & Release Gate Criteria

- **Blocker (P0)**: Any English leak in non-English modes; RTL layout truncation; search crash; incorrect SM-2 interval.
- **Critical (P1)**: Audio TTS failure on iOS/Android; search latency $>200\text{ms}$; incorrect pronunciation score calculation.
- **Major (P2)**: Translation typo; non-critical styling misalignment in landscape mode.
- **Minor (P3)**: Cosmetic padding discrepancy $<4\text{px}$.

**Release Policy**: Zero P0 or P1 defects permitted in any production or beta release.
