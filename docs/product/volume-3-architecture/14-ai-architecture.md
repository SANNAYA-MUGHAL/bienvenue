# Deliverable 14 — AI & Contrastive Prompt Architecture

**Product**: Bienvenue  
**Focus**: Two-Tier Orchestration, Contrastive Prompt Guardrails & Zero-Cost Inference  
**Status**: Approved & Baseline  

---

## 1. The Two-Tier AI Architecture

To achieve sub-50ms latency, zero hallucination on foundational grammar, and \$0.00 operating cost, Bienvenue does not blindly route every student keystroke to an expensive LLM. Instead, it deploys a **Two-Tier Engine**:

```mermaid
graph TD
    Input[Student Input / Query / Error] --> Classifier{Tier 1: Curated Rule Matcher}
    Classifier -->|Match Found (80%+ of queries)| CacheDB[(Local Curated Rule DB)]
    CacheDB --> Output[Instant Native Explanation <10ms, $0.00]

    Classifier -->|Novel / Contextual Query| LLMOrchestrator[Tier 2: Contrastive LLM Engine]
    LLMOrchestrator --> Guardrails[Linguistic Guardrails & Few-Shot Templates]
    Guardrails --> Inference[Ollama Local / Free-tier Gemini / Groq API]
    Inference --> FormatValidator{JSON & Zero-English Validation}
    FormatValidator -->|Valid| CacheBack[Write to Query Cache]
    CacheBack --> Output
    FormatValidator -->|Invalid / Leaked English| Fallback[Safe Curated Pedagogical Fallback]
```

---

## 2. Strict Contrastive System Prompts

### 2.1 The "Zero English Leak" Constraint
Every dynamic prompt enforces a strict constraint:
> *"You are an elite bilingual FLE (Français Langue Étrangère) professor. The student's native language is {L1_NAME}. Explain the French grammatical structure directly in {L1_NAME}. Do not use English words, English linguistic terminology, or English intermediate translations. Anchor your explanation to the syntactic structures of {L1_NAME}."*

### 2.2 Concrete System Prompt Example (Urdu Contrastive Rule)
```text
SYSTEM:
You are an expert French instructor specializing in contrastive linguistics for native Urdu speakers.
The student made the following French error:
STUDENT_SENTENCE: "Je suis 25 ans."
TARGET_CONCEPT: "Expressing age in French using avoir vs être."

TASK:
1. Explain in clear, natural Urdu why "suis" (être) is ungrammatical here.
2. Explain that French uses "avoir" (to have), drawing a comparison to how Urdu expresses age ("میری عمر 25 سال ہے") where the structure does not equate the person to the number.
3. Provide the corrected sentence: "J'ai 25 ans."
4. Provide the phonetic pronunciation in Urdu script: "ژے وینٹ سانک آں".

FORMAT: Return strictly valid JSON:
{
  "is_error": true,
  "category": "COPULA_AGE_AVOIR",
  "explanation_native": "فرانسیسی میں عمر بتانے کے لیے 'avoir' (رکھنا / ہونا) کا فعل استعمال کیا جاتا ہے، نہ کہ 'être' (ہونا)۔ اردو میں ہم کہتے ہیں 'میری عمر 25 سال ہے'، فرانسیسی زبان میں اس کا بنیادی تصور یہ ہے کہ آپ کے پاس اتنے سال ہیں۔ اس لیے 'Je suis 25 ans' غلط ہے اور 'J'ai 25 ans' درست ہے۔",
  "corrected_fr": "J'ai 25 ans.",
  "phonetic_transcription_native": "ژے وینٹ سانک آں"
}
```

---

## 3. Open-Source & Zero-Cost Inference Setup

- **Local Development / Self-Hosted**: Compatible with **Ollama** running `llama3.2:3b` or `mistral:7b` locally on developer or user hardware with zero API keys.
- **Production Free-Tier**: Compatible with Groq Free Tier (Llama 3 70B @ 300 tokens/sec) or Google Gemini Flash free tier.
- **Deterministic Offline Mode**: 500 pre-compiled canonical error rules bundled directly into SQLite/JSON, ensuring the app functions 100% offline.
