import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadMission();
  }, [nativeLang]);

  const loadMission = async () => {
    try {
      const data = await api.getDailyMission(nativeLang);
      setMission(data);
    } catch (err) {
      console.error('Failed to load mission:', err);
    }
  };

  const handleSearchChange = async (val) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const res = await api.searchTerms(val, nativeLang);
      setSearchResults(res.results || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
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
      <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="space-y-0.5 text-left rtl:text-right">
          <h2 className="text-xl sm:text-2xl font-black text-[#1B2A4A] tracking-tight">
            Bonjour, Sana 👋
          </h2>
          <p className="text-xs text-slate-500 font-urdu">
            {nativeLang === 'ur' ? 'آج کی 10 منٹ مشن مکمل کریں اور روانی بڑھائیں۔' : 'Accomplissez votre mission du jour en 10 minutes.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 font-bold text-xs shadow-xs">
            <Flame size={16} className="text-amber-500 fill-amber-500" />
            <span>7 Jours</span>
          </div>

          <div className="text-right rtl:text-left">
            <span className="text-xs font-bold text-[#1B2A4A] block">A1: 28%</span>
            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-[#E05A47] h-full rounded-full" style={{ width: '28%' }} />
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
            className="w-full pl-11 pr-10 rtl:pl-10 rtl:pr-11 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-[#E05A47] focus:outline-none text-sm bg-white shadow-sm transition font-sans"
          />
          {isSearching ? (
            <Loader2 className="absolute right-4 rtl:right-auto rtl:left-4 text-terracotta animate-spin" size={18} />
          ) : searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
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
            { fr: 'mais', ur: 'لیکن' },
            { fr: 'pourtant', ur: 'حالانکہ' },
            { fr: 'bail', ur: 'کرایہ نامہ' },
            { fr: 'loyer', ur: 'کرایہ' },
            { fr: 'rendez-vous', ur: 'ملاقات' }
          ].map((chip) => (
            <button
              key={chip.fr}
              type="button"
              onClick={() => handleSearchChange(chip.fr)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-terracotta text-slate-700 transition font-medium border border-slate-200/60"
            >
              <span className="font-sans font-bold">{chip.fr}</span>
              {nativeLang === 'ur' && <span className="font-urdu ml-1 mr-1 text-slate-500 text-[11px]">({chip.ur})</span>}
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
                  className="p-3.5 hover:bg-amber-50/40 cursor-pointer flex items-center justify-between transition text-left rtl:text-right"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1B2A4A] text-base font-sans">
                        {card.french_term}
                      </span>
                      {card.ipa && (
                        <span className="text-[11px] font-mono text-slate-400">
                          {card.ipa}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-urdu mt-0.5">
                      {card.translation_native} • {card.phonetic_native}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-terracotta bg-orange-50 px-2 py-1 rounded-full font-sans">
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
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="font-black text-lg text-[#1B2A4A] uppercase tracking-wide">
              {nativeLang === 'ur' ? 'آج کا مشن (10 منٹ)' : 'Mission du Jour (10 min)'}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#E05A47]">
            4 Éléments
          </span>
        </div>

        {/* 4 Mission Pillars */}
        <div className="space-y-3">
          
          {/* Pillar 1: 5 Words to Master */}
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200/80 hover:border-slate-300 transition space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1B2A4A]">
                <Brain size={16} className="text-terracotta" />
                <span>{nativeLang === 'ur' ? 'حافظے کے 5 الفاظ (SM-2 Spaced Repetition)' : '5 Mots à Maîtriser (SRS)'}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Répétition espacée</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {mission?.vocabulary_review?.map((word) => (
                <button
                  key={word.id}
                  onClick={() => onOpenCard(word)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#E05A47] text-xs font-semibold text-slate-800 transition flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="font-sans font-bold">{word.french_term}</span>
                  <span className="text-slate-400 text-[11px] font-urdu">({word.translation_native})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pillar 2: Listening snippet */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="space-y-1 text-left rtl:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                🎧 {nativeLang === 'ur' ? 'سماعت و تفہیم (Listening)' : 'Compréhension Orale'}
              </span>
              <p className="text-sm font-semibold text-[#1B2A4A] font-sans">
                "Bonjour Madame, une table pour deux s'il vous plaît."
              </p>
            </div>
            <button
              onClick={() => speakFrench("Bonjour Madame, une table pour deux s'il vous plaît.")}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-[#E05A47] hover:text-white text-slate-700 flex items-center justify-center transition shrink-0"
              title="Écouter"
            >
              <Volume2 size={18} />
            </button>
          </div>

          {/* Pillar 3: Speaking challenge */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="space-y-1 text-left rtl:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                🗣️ {nativeLang === 'ur' ? 'بول چال (Speaking Challenge)' : 'Expression Orale'}
              </span>
              <p className="text-sm font-semibold text-[#1B2A4A] font-sans">
                "Je voudrais un croissant et un café, s'il vous plaît."
              </p>
              <p className="text-xs text-slate-500 font-urdu">
                {nativeLang === 'ur' ? 'مجھے برائے مہربانی ایک کرواساں اور کافی چاہیے۔' : 'Je voudrais commander.'}
              </p>
            </div>
            <button
              onClick={() => speakFrench("Je voudrais un croissant et un café, s'il vous plaît.")}
              className="w-10 h-10 rounded-xl bg-orange-50 hover:bg-[#E05A47] text-terracotta hover:text-white flex items-center justify-center transition shrink-0"
              title="Écouter puis répéter"
            >
              <Mic size={18} />
            </button>
          </div>

          {/* Pillar 4: Contrastive Grammar */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between gap-3">
            <div className="space-y-1 text-left rtl:text-right">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">
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
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition shrink-0 shadow-xs"
            >
              Tester
            </button>
          </div>

        </div>
      </div>

      {/* 4. Signature Feature Demo: "Explain My Mistake" Interactive Simulator */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <h3 className="font-bold text-base text-[#1B2A4A]">
              {nativeLang === 'ur' ? 'غلطی کی فوری تشریح (Explain My Mistake Demo)' : 'Testeur d\'Erreurs Contrastives'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Signature Feature</span>
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
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#E05A47] text-sm font-sans"
            placeholder="Je suis 25 ans"
          />
          <button
            onClick={() => handleTestMistake(testSentenceInput)}
            className="px-4 py-2.5 rounded-xl bg-[#E05A47] hover:bg-[#C84635] text-white font-bold text-xs transition shadow-sm"
          >
            Diagnostiquer
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[11px] text-slate-400">Exemples rapides :</span>
          <button
            onClick={() => { setTestSentenceInput('Je suis 25 ans'); handleTestMistake('Je suis 25 ans'); }}
            className="text-[11px] underline text-terracotta hover:text-slate-800"
          >
            "Je suis 25 ans"
          </button>
          <span className="text-slate-300">•</span>
          <button
            onClick={() => { setTestSentenceInput('Je suis faim'); handleTestMistake('Je suis faim'); }}
            className="text-[11px] underline text-terracotta hover:text-slate-800"
          >
            "Je suis faim"
          </button>
        </div>
      </div>

      {/* 5. Survival Life Situations Quick-Access Row */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#1B2A4A]">
              🥖 {nativeLang === 'ur' ? 'زندگی کے ہنگامی حالات (Survival Packs)' : 'Survie Pratique en France'}
            </h3>
            <p className="text-xs text-slate-500 font-urdu mt-0.5">
              {nativeLang === 'ur' ? 'بیکری، فارمیسی، کاف اور پیرس میٹرو' : 'Boulangerie, Pharmacie, CAF et Métro'}
            </p>
          </div>

          <button
            onClick={onStartSurvival}
            className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1"
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
              className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-[#E05A47] hover:shadow-xs transition cursor-pointer text-center space-y-1 bg-[#FDFBF7]"
            >
              <span className="text-2xl block">{item.icon}</span>
              <span className="font-bold text-xs text-[#1B2A4A] block font-sans">{item.title}</span>
              <span className="text-[10px] text-slate-400 block">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
