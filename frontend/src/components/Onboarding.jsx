import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles, Globe, Compass, Clock, GraduationCap } from 'lucide-react';

const LANGUAGES = [
  { code: 'ur', flag: '🇵🇰', name: 'اردو', nativeName: 'Urdu', dir: 'rtl', font: 'font-urdu' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية', nativeName: 'Arabic', dir: 'rtl', font: 'font-arabic' },
  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी', nativeName: 'Hindi', dir: 'ltr', font: 'font-hindi' },
  { code: 'es', flag: '🇪🇸', name: 'Español', nativeName: 'Spanish', dir: 'ltr', font: 'font-sans' },
  { code: 'en', flag: '🇺🇸', name: 'English', nativeName: 'English', dir: 'ltr', font: 'font-sans' },
];

const GOALS = [
  { id: 'moving_to_france', icon: '🇫🇷', title: { ur: 'فرانس منتقلی (CAF اور مکان)', ar: 'الانتقال إلى فرنسا (السكن والإقامة)', hi: 'फ़्रांस प्रवास (आवास और प्रशासन)', es: 'Mudarse a Francia (Vivienda)', en: 'Moving to France (Housing & Admin)' } },
  { id: 'university', icon: '🎓', title: { ur: 'یونیورسٹی اور اعلیٰ تعلیم', ar: 'الدراسة الجامعية والبحث', hi: 'विश्वविद्यालय और उच्च शिक्षा', es: 'Estudios universitarios', en: 'University & Studies' } },
  { id: 'exam_tef', icon: '🇨🇦', title: { ur: 'کینیڈا امیگریشن / TEF امتحان', ar: 'هجرة كندا / امتحان TEF', hi: 'कनाडा आप्रवासन / TEF परीक्षा', es: 'Examen TEF / Inmigración Canadá', en: 'TEF / TCF Exam (Canada Immigration)' } },
  { id: 'work', icon: '💼', title: { ur: 'ملازمت اور پیشہ ورانہ زندگی', ar: 'العمل والتطور المهني', hi: 'नौकरी और व्यवसाय', es: 'Trabajo y negocios', en: 'Work & Professional' } },
  { id: 'conversation', icon: '🗣️', title: { ur: 'روزمرہ گفتگو اور سفر', ar: 'المحادثة اليومية والسياحة', hi: 'दैनिक बातचीत और यात्रा', es: 'Conversación cotidiana', en: 'Everyday Conversation' } },
];

const TIMES = [
  { minutes: 5, label: '5 min / jour', sub: { ur: 'ہلکی شروعات', ar: 'بداية ميسرة', hi: 'धीमी शुरुआत', es: 'Fácil', en: 'Light pace' } },
  { minutes: 10, label: '10 min / jour', sub: { ur: 'بہترین توازن (تجویز کردہ)', ar: 'المعدل المثالي', hi: 'सर्वोत्तम (सुझावित)', es: 'Recomendado', en: 'Optimal (Recommended)' } },
  { minutes: 20, label: '20 min / jour', sub: { ur: 'تیز رفتار سیکھنا', ar: 'تعلم سريع', hi: 'तेज़ गति', es: 'Intensivo', en: 'Accelerated' } },
];

export default function Onboarding({ onComplete, initialLang = 'ur' }) {
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState(initialLang);
  const [selectedGoal, setSelectedGoal] = useState('moving_to_france');
  const [selectedTime, setSelectedTime] = useState(10);

  const activeLangObj = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
  const isRTL = activeLangObj.dir === 'rtl';

  const handleLanguageSelect = (code) => {
    setSelectedLang(code);
    const target = LANGUAGES.find(l => l.code === code);
    if (target) {
      document.documentElement.dir = target.dir;
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        lang: selectedLang,
        goal: selectedGoal,
        dailyMinutes: selectedTime,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 sm:p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 relative overflow-hidden">
        
        {/* Top Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-10 bg-coral' : s < step ? 'w-6 bg-french' : 'w-4 bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">
            Étape {step} / 3
          </span>
        </div>

        {/* STEP 1: Select Native Language */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-french/10 text-3xl mb-1 shadow-inner">
                🇫🇷
              </div>
              <h1 className="text-2xl sm:text-3xl font-french font-bold text-french tracking-tight">
                Bienvenue
              </h1>
              <p className="text-sm text-slate-500 font-sans">
                French in the language you understand
              </p>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1 font-sans">
                آپ کی مادری زبان کون سی ہے؟ / Choose your language:
              </label>
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-coral bg-coral-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="text-left rtl:text-right">
                        <span className={`block font-bold text-lg text-slate-800 ${lang.font}`}>
                          {lang.name}
                        </span>
                        <span className="text-xs text-slate-500 font-sans">
                          {lang.nativeName}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-coral/20 text-coral-dark border border-coral/30 flex items-center justify-center shadow-xs">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Goal Selection */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-coral/10 text-coral mb-1">
                <Compass size={28} />
              </div>
              <h2 className="text-2xl font-french font-bold text-french">
                {selectedLang === 'ur' ? 'آپ فرانسیسی کیوں سیکھ رہے ہیں؟' : 'Pourquoi apprenez-vous le français ?'}
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                {selectedLang === 'ur' ? 'ہم آپ کے مقاصد کے مطابق کورس ترتیب دیں گے۔' : 'Nous adapterons votre parcours à votre objectif réel.'}
              </p>
            </div>

            <div className="space-y-2.5">
              {GOALS.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                const titleText = goal.title[selectedLang] || goal.title.en;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-coral bg-coral-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <span className={`text-base font-semibold text-slate-800 ${activeLangObj.font}`}>
                        {titleText}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-coral/20 text-coral-dark border border-coral/30 flex items-center justify-center shadow-xs">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Time & Placement */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-french/10 text-french mb-1">
                <Clock size={28} />
              </div>
              <h2 className="text-2xl font-french font-bold text-french">
                {selectedLang === 'ur' ? 'روزانہ کتنا وقت دے سکتے ہیں؟' : 'Combien de temps par jour ?'}
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                {selectedLang === 'ur' ? 'تھوڑا پڑھیں، لیکن روزانہ اور مستقل مزاجی سے۔' : 'La régularité est le secret de la maîtrise.'}
              </p>
            </div>

            <div className="space-y-3">
              {TIMES.map((time) => {
                const isSelected = selectedTime === time.minutes;
                const subText = time.sub[selectedLang] || time.sub.en;
                return (
                  <button
                    key={time.minutes}
                    onClick={() => setSelectedTime(time.minutes)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-coral bg-coral-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="block font-bold text-lg text-slate-800 font-sans">
                        ⚡ {time.label}
                      </span>
                      <span className={`text-xs text-slate-500 font-semibold ${activeLangObj.font}`}>
                        {subText}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-coral/20 text-coral-dark border border-coral/30 flex items-center justify-center shadow-xs">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Beginner confirmation pill */}
            <div className="p-4 rounded-2xl bg-french/5 border border-french/20 flex items-center gap-3">
              <GraduationCap className="text-french shrink-0" size={24} />
              <div className="text-left rtl:text-right">
                <p className="text-xs font-bold text-french font-sans">
                  {selectedLang === 'ur' ? 'سطح: مکمل مبتدی (A1 Foundation)' : 'Niveau : Débutant complet (A1)'}
                </p>
                <p className="text-[11px] text-slate-500 font-sans">
                  {selectedLang === 'ur' ? 'ہم بنیادی حروف، تلفظ اور ضروری جملوں سے آغاز کریں گے۔' : 'Nous démarrerons par les sons, les salutations et les bases.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 flex gap-3 font-sans">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
              aria-label="Previous step"
            >
              <ArrowLeft className="rtl:rotate-180" size={20} />
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-coral/15 hover:bg-coral/25 text-coral-dark border-2 border-coral/40 font-bold py-3.5 px-6 rounded-2xl transition shadow-xs flex items-center justify-center gap-2"
          >
            <span>
              {step === 3 
                ? (selectedLang === 'ur' ? 'سیکھنا شروع کریں 🚀' : 'Commencer 🚀')
                : (selectedLang === 'ur' ? 'آگے بڑھیں' : 'Continuer')
              }
            </span>
            <ArrowRight className="rtl:rotate-180" size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
