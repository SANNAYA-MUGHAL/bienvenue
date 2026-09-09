export const CONTRASTIVE_RULES = [
  {
    "id": "rule_age_avoir",
    "pattern": /je suis \d+ ans/i,
    "category": "COPULA_AGE_AVOIR",
    "wrong_example": "Je suis 25 ans.",
    "correct_fr": "J'ai 25 ans.",
    "phonetic_transcriptions": {
      "ur": "ژے وینٹ سانک آں",
      "ar": "جيه فان سانك أون",
      "hi": "जे वैंत सांक आं",
      "es": "ye van-sank an",
      "en": "zhay vant sank ahn"
    },
    "explanations": {
      "ur": "فرانسیسی میں عمر بتانے کے لیے 'avoir' (رکھنا) استعمال ہوتا ہے، نہ کہ 'être' (ہونا)۔ اردو میں ہم کہتے ہیں 'میری عمر 25 سال ہے'، فرانسیسی زبان میں بنیادی ساخت 'میرے پاس 25 سال ہیں' کی طرح ہوتی ہے۔ اس لیے 'Je suis 25 ans' غلط ہے، درست جملہ 'J'ai 25 ans' ہے۔",
      "ar": "في اللغة الفرنسية، نستخدم دائماً فعل الملكية 'avoir' للتعبير عن العمر وليس فعل الكينونة 'être'. التركيب الحرفي هو 'أنا أملك 25 سنة'، لذا العبارة الصحيحة هي 'J'ai 25 ans'.",
      "hi": "फ़्रेंच में उम्र बताने के लिए 'avoir' (पास होना) क्रिया का प्रयोग होता है, न कि 'être' (होना) का। जैसे हिंदी में हम कहते हैं 'मेरी उम्र 25 वर्ष है', फ़्रेंच में 'J'ai 25 ans' कहा जाता है।",
      "es": "En francés, al igual que en español, se utiliza el verbo tener ('avoir' = tener) para expresar la edad, nunca el verbo ser ('être'). Se dice 'J'ai 25 ans' (Tengo 25 años).",
      "en": "In French, age is expressed using 'avoir' (to have), not 'être' (to be). Literally 'I have 25 years', so the correct phrase is 'J'ai 25 ans'."
    }
  },
  {
    "id": "rule_hunger_avoir",
    "pattern": /je suis faim/i,
    "category": "COPULA_SENSATION_AVOIR",
    "wrong_example": "Je suis faim.",
    "correct_fr": "J'ai faim.",
    "phonetic_transcriptions": {
      "ur": "ژے فاں",
      "ar": "جيه فان",
      "hi": "जे फैं",
      "es": "ye fan",
      "en": "zhay fahn"
    },
    "explanations": {
      "ur": "فرانسیسی زبان میں جسمانی احساسات جیسے بھوک، پیاس یا سردی کے لیے فعل 'avoir' استعمال ہوتا ہے۔ جیسے اردو میں ہم کہتے ہیں 'مجھے بھوک لگی ہے' (نہ کہ 'میں بھوک ہوں')، اسی طرح فرانسیسی میں 'J'ai faim' کہا جاتا ہے۔",
      "ar": "للتعبير عن المشاعر الجسدية كالجوء والعطش، تستخدم الفرنسية فعل 'avoir'. تماماً كما نقول 'عندي جوع'، الصيغة السليمة هي 'J'ai faim' وليس 'Je suis faim'.",
      "hi": "भूख, प्यास या ठंड जैसी शारीरिक संवेदनाओं के लिए फ़्रेंच में 'avoir' क्रिया का उपयोग होता है। जैसे हिंदी में 'मुझे भूख लगी है', फ़्रेंच में 'J'ai faim' सही है।",
      "es": "Sensaciones corporales como el hambre o la sed se expresan con 'avoir' (Tengo hambre = J'ai faim), nunca con 'être'.",
      "en": "Physical sensations like hunger and thirst require 'avoir' (to have), equivalent to 'I have hunger'. Thus 'J'ai faim' is correct."
    }
  }
];
