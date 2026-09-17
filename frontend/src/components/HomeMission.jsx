import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Volume2, Mic, CheckCircle, Flame, Sparkles, BookOpen, 
  Compass, ArrowRight, Brain, AlertCircle, ChevronRight, X, Loader2 
} from 'lucide-react';
import { api } from '../services/api';
import { speakFrench } from '../services/speech';

export default function HomeMission({ 
  nativeLang = 'ur', 
  onOpenCard, 
  onStartSurvival, 
  onTriggerMistakeModal 
}) {
  const [mission, setMission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [testSentenceInput, setTestSentenceInput] = useState('Je suis 25 ans');
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeoutRef = useRef(null);
  const activeQueryRef = useRef('');

  useEffect(() => {
    loadMission();
  }, [nativeLang]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const loadMission = async () => {
    try {
      const data = await api.getDailyMission(nativeLang);
      setMission(data);
    } catch (err) {
      console.error('Failed to load mission:', err);
    }
  };

  const executeSearch = async (queryText) => {
    const trimmed = (queryText || '').trim();
    activeQueryRef.current = trimmed;

    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const res = await api.searchTerms(trimmed, nativeLang);
      if (activeQueryRef.current === trimmed) {
        setSearchResults(res.results || []);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      if (activeQueryRef.current === trimmed) {
        setIsSearching(false);
      }
    }
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!val.trim()) {
      executeSearch('');
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      executeSearch(val);
    }, 250);
  };

  const triggerSearch = (val) => {
    setSearchQuery(val);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    executeSearch(val);
  };

  const handleTestMistake = async (sentence) => {
    try {
      const diag = await api.explainMistake(sentence, nativeLang);
      if (diag.is_error && onTriggerMistakeModal) {
        onTriggerMistakeModal(diag, sentence);
      }
    } catch (err) {
      console.error('Diagnostic error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* 1. Header: Greeting & Gamified Streak */}
      <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-0.5 text-left rtl:text-right">
          <h2 className="text-xl sm:text-2xl font-french font-bold text-french tracking-tight">
            Bonjour, Sana 👋
          </h2>
          <p className="text-xs text-slate-500 font-urdu">
            {nativeLang === 'ur' ? 'آج کا 10 منٹ مشن مکمل کریں اور روانی بڑھائیں۔' : 'Accomplissez votre mission du jour en 10 minutes.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-coral/10 text-coral border border-coral/20 font-bold text-xs shadow-2xs">
            <Flame size={16} className="text-coral fill-coral" />
            <span className="font-sans">7 Jours</span>
          </div>

          <div className="text-right rtl:text-left">
            <span className="text-xs font-bold text-french block font-sans">A1: 28%</span>
            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-coral h-full rounded-full" style={{ width: '28%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sticky Universal Search Bar */}
      <div className="relative space-y-2">
        <div className="relative flex items-center">
          <Search className="absolute left-4 rtl:left-auto rtl:right-4 text-slate-400 pointer-events-none" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSearchResults([]);
              } else if (e.key === 'Enter' && searchResults.length > 0) {
                onOpenCard(searchResults[0]);
                setSearchQuery('');
                setSearchResults([]);
              }
            }}
            placeholder={
              nativeLang === 'ur'
                ? 'فرانسیسی یا اردو میں تلاش کریں... (مثلاً: mais یا لیکن یا bail)'
                : 'Rechercher un mot en français ou dans votre langue...'
            }
            className="w-full pl-11 pr-10 rtl:pl-10 rtl:pr-11 py-3.5 rounded-2xl border-2 border-slate-200/80 focus:border-coral focus:outline-none text-sm bg-white shadow-2xs transition font-sans"
          />
          {isSearching ? (
            <Loader2 className="absolute right-4 rtl:right-auto rtl:left-4 text-coral animate-spin" size={18} />
          ) : searchQuery ? (
            <button
              onClick={() => {
                triggerSearch('');
                setSearchResults([]);
              }}
              className="absolute right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap px-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-400 font-sans">
            {nativeLang === 'ur' ? 'تجربہ کریں:' : 'Suggestions :'}
          </span>
          {[
            { fr: 'enchanté', ur: 'آپ سے مل کر خوشی ہوئی', en: 'nice to meet you' },
            { fr: 'bonjour', ur: 'صبح بخیر / ہیلو', en: 'hello' },
            { fr: 'merci', ur: 'شکریہ', en: 'thank you' },
            { fr: 'bail', ur: 'کرایہ نامہ', en: 'lease' },
            { fr: 'CAF', ur: 'ہاؤسنگ فنڈ', en: 'housing agency' },
            { fr: 'rendez-vous', ur: 'ملاقات', en: 'appointment' },
            { fr: 'café', ur: 'کافی', en: 'coffee' }
          ].map((chip) => (
            <button
              key={chip.fr}
              type="button"
              onClick={() => triggerSearch(chip.fr)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-coral-50 hover:text-coral text-slate-700 transition font-medium border border-slate-200/60"
            >
              <span lang="fr" translate="no" className="notranslate font-french font-semibold">{chip.fr}</span>
              {nativeLang === 'ur' && <span className="font-urdu ml-1 mr-1 text-slate-500 text-[11px]">({chip.ur})</span>}
              {nativeLang === 'en' && <span className="font-sans ml-1 text-slate-500 text-[11px]">({chip.en})</span>}
            </button>
          ))}
        </div>

        {/* Real-Time Search Results Dropdown */}
        {searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-30 divide-y divide-slate-100 max-h-72 overflow-y-auto animate-fadeIn">
            {searchResults.length > 0 ? (
              searchResults.map((card) => (
                <div
                  key={card.id}
                  onClick={() => {
                    onOpenCard(card);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="p-3.5 hover:bg-coral-50/40 cursor-pointer flex items-center justify-between transition text-left rtl:text-right"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span lang="fr" translate="no" className="notranslate font-french font-bold text-french text-lg">
                        {card.french_term}
                      </span>
                      {card.ipa && (
                        <span className="text-[11px] font-mono text-lavender bg-lavender/10 px-1.5 py-0.5 rounded-md">
                          {card.ipa}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-urdu mt-0.5">
                      {card.translation_native} • {card.phonetic_native}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-coral bg-coral/10 px-2.5 py-1 rounded-full font-sans">
                    Micro-Card →
                  </span>
                </div>
              ))
            ) : !isSearching ? (
              <div className="p-4 text-center text-sm text-slate-500">
                <p className="font-medium text-slate-700">
                  {nativeLang === 'ur' ? 'کوئی متعلقہ لفظ نہیں ملا۔' : `Aucun mot trouvé pour « ${searchQuery} »`}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-urdu">
                  {nativeLang === 'ur' 
                    ? 'اوپر دیے گئے کسی لفظ پر کلک کر کے کارڈ کھولیں، یا فرانسیسی یا اردو لفظ ٹائپ کریں۔' 
                    : 'Essayez un mot comme « mais », « pourtant » ou « bail ».'}
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* 3. Today's 10-Minute Mission Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="font-french font-bold text-lg text-french tracking-tight uppercase">
              {nativeLang === 'ur' ? 'آج کا مشن (10 منٹ)' : 'Mission du Jour (10 min)'}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-coral/10 text-coral font-sans">
            4 Éléments
          </span>
        </div>

        {/* 4 Mission Pillars */}
        <div className="space-y-3">
          
          {/* Pillar 1: 5 Words to Master */}
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200/80 hover:border-coral/40 transition space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-french">
                <Brain size={16} className="text-coral" />
                <span>{nativeLang === 'ur' ? 'حافظے کے 5 الفاظ (SM-2 Spaced Repetition)' : '5 Mots à Maîtriser (SRS)'}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 font-sans">Répétition espacée</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {mission?.vocabulary_review?.map((word) => (
                <button
                  key={word.id}
                  onClick={() => onOpenCard(word)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-coral text-xs font-semibold text-slate-800 transition flex items-center gap-1.5 shadow-2xs"
                >
                  <span lang="fr" translate="no" className="notranslate font-french font-bold text-french">{word.french_term}</span>
                  <span className="text-slate-400 text-[11px] font-urdu">({word.translation_native})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pillar 2: Listening snippet */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-1 text-left rtl:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                🎧 {nativeLang === 'ur' ? 'سماعت و تفہیم (Listening)' : 'Compréhension Orale'}
              </span>
              <p lang="fr" translate="no" className="notranslate text-base font-semibold text-french font-french">
                "Bonjour Madame, une table pour deux s'il vous plaît."
              </p>
            </div>
            <button
              onClick={() => speakFrench("Bonjour Madame, une table pour deux s'il vous plaît.")}
              className="w-10 h-10 rounded-xl bg-french/10 hover:bg-french/20 text-french border border-french/20 flex items-center justify-center transition shrink-0 shadow-2xs"
              title="Écouter"
            >
              <Volume2 size={18} />
            </button>
          </div>

          {/* Pillar 3: Speaking challenge */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-1 text-left rtl:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                🗣️ {nativeLang === 'ur' ? 'بول چال (Speaking Challenge)' : 'Expression Orale'}
              </span>
              <p lang="fr" translate="no" className="notranslate text-base font-semibold text-french font-french">
                "Je voudrais un croissant et un café, s'il vous plaît."
              </p>
              <p className="text-xs text-slate-500 font-urdu">
                {nativeLang === 'ur' ? 'مجھے برائے مہربانی ایک کرواساں اور کافی چاہیے۔' : 'Je voudrais commander.'}
              </p>
            </div>
            <button
              onClick={() => speakFrench("Je voudrais un croissant et un café, s'il vous plaît.")}
              className="w-10 h-10 rounded-xl bg-coral/15 hover:bg-coral/25 text-coral-dark border border-coral/30 flex items-center justify-center transition shrink-0 shadow-2xs"
              title="Écouter puis répéter"
            >
              <Mic size={18} />
            </button>
          </div>

          {/* Pillar 4: Contrastive Grammar */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-1 text-left rtl:text-right">
              <span className="text-[10px] uppercase font-bold text-amber-800 block font-sans">
                📖 {nativeLang === 'ur' ? 'گرامر نکتہ: Être بمقابلہ Avoir' : 'Grammaire : Être vs Avoir'}
              </span>
              <p className="text-xs text-slate-800 font-urdu leading-relaxed">
                {nativeLang === 'ur'
                  ? 'فرانسیسی میں عمر اور بھوک بتانے کے لیے être نہیں بلکہ avoir استعمال کریں: J\'ai 25 ans.'
                  : 'Pour exprimer l\'âge et les sensations, utilisez toujours avoir.'}
              </p>
            </div>
            <button
              onClick={() => handleTestMistake("Je suis 25 ans")}
              className="px-3.5 py-1.5 bg-french/10 hover:bg-french/20 text-french border border-french/30 font-bold text-xs rounded-xl transition shrink-0 shadow-2xs"
            >
              Tester
            </button>
          </div>

        </div>
      </div>

      {/* 4. Signature Feature Demo: "Explain My Mistake" Interactive Simulator */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <h3 className="font-french font-bold text-lg text-french">
              {nativeLang === 'ur' ? 'غلطی کی فوری تشریح (Explain My Mistake Demo)' : 'Testeur d\'Erreurs Contrastives'}
            </h3>
          </div>
          <span className="text-[11px] font-sans font-bold px-2 py-0.5 rounded-full bg-lavender/10 text-lavender">
            Signature Feature
          </span>
        </div>

        <p className="text-xs text-slate-500 font-urdu">
          {nativeLang === 'ur'
            ? 'ایک عام غلط جملہ لکھ کر دیکھیں کہ ایپ کس طرح آپ کی زبان میں اس کی گرامر واضح کرتی ہے:'
            : 'Saisissez une erreur typique pour tester l\'explication dans votre langue maternelle :'}
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={testSentenceInput}
            onChange={(e) => setTestSentenceInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-coral text-sm font-sans"
            placeholder="Je suis 25 ans"
          />
          <button
            onClick={() => handleTestMistake(testSentenceInput)}
            className="px-4 py-2.5 rounded-xl bg-coral/15 hover:bg-coral/25 text-coral-dark border border-coral/30 font-bold text-xs transition shadow-2xs"
          >
            Diagnostiquer
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 font-sans">
          <span className="text-[11px] text-slate-400">Exemples rapides :</span>
          <button
            onClick={() => { setTestSentenceInput('Je suis 25 ans'); handleTestMistake('Je suis 25 ans'); }}
            className="text-[11px] underline text-coral hover:text-french font-french font-medium"
          >
            "Je suis 25 ans"
          </button>
          <span className="text-slate-300">•</span>
          <button
            onClick={() => { setTestSentenceInput('Je suis faim'); handleTestMistake('Je suis faim'); }}
            className="text-[11px] underline text-coral hover:text-french font-french font-medium"
          >
            "Je suis faim"
          </button>
        </div>
      </div>

      {/* 5. Survival Life Situations Quick-Access Row */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-french font-bold text-lg text-french">
              🥖 {nativeLang === 'ur' ? 'زندگی کے ہنگامی حالات (Survival Packs)' : 'Survie Pratique en France'}
            </h3>
            <p className="text-xs text-slate-500 font-urdu mt-0.5">
              {nativeLang === 'ur' ? 'بیکری، فارمیسی، کاف اور پیرس میٹرو' : 'Boulangerie, Pharmacie, CAF et Métro'}
            </p>
          </div>

          <button
            onClick={onStartSurvival}
            className="text-xs font-bold text-coral hover:underline flex items-center gap-1 font-sans"
          >
            <span>Voir tout</span>
            <ChevronRight size={14} className="rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'boulangerie', icon: '🥐', title: 'Boulangerie', desc: 'Commander' },
            { id: 'pharmacie', icon: '💊', title: 'Pharmacie', desc: 'Santé' },
            { id: 'caf_admin', icon: '🏛️', title: 'CAF & Bail', desc: 'Logement' },
            { id: 'metro', icon: '🚇', title: 'Métro RATP', desc: 'Billets' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={onStartSurvival}
              className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-coral hover:shadow-xs transition cursor-pointer text-center space-y-1 bg-[#FDFBF7]"
            >
              <span className="text-2xl block">{item.icon}</span>
              <span className="font-bold text-xs text-french block font-sans">{item.title}</span>
              <span className="text-[10px] text-slate-400 block font-sans">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
