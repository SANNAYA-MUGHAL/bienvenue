import React, { useState, useEffect } from 'react';
import { 
  Home, Compass, Brain, Settings, Globe, Flame, 
  Sparkles, Check, ChevronDown, RotateCcw 
} from 'lucide-react';
import Onboarding from './components/Onboarding';
import HomeMission from './components/HomeMission';
import SurvivalRoleplay from './components/SurvivalRoleplay';
import BrainMap from './components/BrainMap';
import MicroCardModal from './components/MicroCardModal';
import ExplainMistakeModal from './components/ExplainMistakeModal';
import { api } from './services/api';

const SUPPORTED_LANGS = [
  { code: 'ur', flag: '🇵🇰', name: 'اردو', dir: 'rtl', font: 'font-urdu' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية', dir: 'rtl', font: 'font-arabic' },
  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी', dir: 'ltr', font: 'font-hindi' },
  { code: 'es', flag: '🇪🇸', name: 'Español', dir: 'ltr', font: 'font-sans' },
  { code: 'en', flag: '🇺🇸', name: 'English', dir: 'ltr', font: 'font-sans' },
];

export default function App() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('bienvenue_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('mission'); // 'mission' | 'survival' | 'brainmap'
  const [activeCard, setActiveCard] = useState(null);
  const [mistakeModalData, setMistakeModalData] = useState(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const activeLangCode = profile?.lang || 'ur';
  const activeLangObj = SUPPORTED_LANGS.find(l => l.code === activeLangCode) || SUPPORTED_LANGS[0];
  const isRTL = activeLangObj.dir === 'rtl';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const handleOnboardingComplete = (data) => {
    const newProfile = {
      username: 'Sana',
      lang: data.lang,
      goal: data.goal,
      dailyMinutes: data.dailyMinutes,
      streakDays: 7,
      createdAt: new Date().toISOString()
    };
    setProfile(newProfile);
    localStorage.setItem('bienvenue_profile', JSON.stringify(newProfile));
  };

  const handleLanguageChange = (code) => {
    const updated = { ...profile, lang: code };
    setProfile(updated);
    localStorage.setItem('bienvenue_profile', JSON.stringify(updated));
    setShowLangDropdown(false);
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('bienvenue_profile');
    setProfile(null);
  };

  const handleOpenCard = async (cardItem) => {
    try {
      const fullCard = await api.getCard(cardItem.id);
      setActiveCard(fullCard);
    } catch (err) {
      setActiveCard(cardItem);
    }
  };

  // If user has not onboarded yet, show the full onboarding flow
  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} initialLang="ur" />;
  }

  return (
    <div 
      className={`min-h-screen bg-[#FDFBF7] text-slate-900 pb-24 ${activeLangObj.font}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 1. Global Navigation Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('mission')}>
            <span className="text-2xl">🇫🇷</span>
            <div>
              <span className="font-black text-lg text-[#1B2A4A] tracking-tight block leading-none font-sans">
                BIENVENUE
              </span>
              <span className="text-[10px] text-slate-400 font-sans tracking-wide block">
                French in your language
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-2xs">
              <Flame size={14} className="text-amber-500 fill-amber-500" />
              <span>{profile.streakDays || 7} j</span>
            </div>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                <span>{activeLangObj.flag}</span>
                <span className="hidden sm:inline font-sans">{activeLangObj.name}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 divide-y divide-slate-100 animate-fadeIn">
                  {SUPPORTED_LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left rtl:text-right hover:bg-amber-50/50 transition ${
                        lang.code === activeLangCode ? 'bg-[#FDEEEB] text-[#E05A47] font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                      {lang.code === activeLangCode && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Onboarding / Test Mode Button */}
            <button
              onClick={handleResetOnboarding}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Recommencer l'onboarding (Reset)"
            >
              <RotateCcw size={15} />
            </button>

          </div>
        </div>
      </header>

      {/* 2. Main Tab View Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'mission' && (
          <HomeMission
            nativeLang={activeLangCode}
            onOpenCard={handleOpenCard}
            onStartSurvival={() => setActiveTab('survival')}
            onTriggerMistakeModal={(diag, sentence) => {
              setMistakeModalData({ diagnosis: diag, userSentence: sentence });
            }}
          />
        )}

        {activeTab === 'survival' && (
          <SurvivalRoleplay
            nativeLang={activeLangCode}
            onBack={() => setActiveTab('mission')}
          />
        )}

        {activeTab === 'brainmap' && (
          <BrainMap
            nativeLang={activeLangCode}
            onSelectNode={(node) => {
              // Open first card of concept if applicable
              handleOpenCard({
                id: 'card_mais',
                french_term: node.title_fr,
                translation_native: 'اس تصور کی مشق کریں',
                pedagogical_rules: { [activeLangCode]: 'یہ بنیادی A1 نوڈ ہے۔' }
              });
            }}
          />
        )}
      </main>

      {/* 3. Persistent Mobile/Desktop Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-4 py-2 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          
          <button
            onClick={() => setActiveTab('mission')}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition ${
              activeTab === 'mission'
                ? 'text-[#E05A47] font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home size={20} />
            <span className="text-[11px] font-sans">Mission</span>
          </button>

          <button
            onClick={() => setActiveTab('survival')}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition ${
              activeTab === 'survival'
                ? 'text-[#E05A47] font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass size={20} />
            <span className="text-[11px] font-sans">Survie</span>
          </button>

          <button
            onClick={() => setActiveTab('brainmap')}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition ${
              activeTab === 'brainmap'
                ? 'text-[#E05A47] font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Brain size={20} />
            <span className="text-[11px] font-sans">Brain Map</span>
          </button>

        </div>
      </nav>

      {/* 4. Active Micro-Learning Card Modal */}
      {activeCard && (
        <MicroCardModal
          card={activeCard}
          nativeLang={activeLangCode}
          onClose={() => setActiveCard(null)}
          onAddToSRS={() => {
            console.log('Saved card to SRS:', activeCard.id);
          }}
        />
      )}

      {/* 5. Active "Explain My Mistake" Diagnostic Modal */}
      {mistakeModalData && (
        <ExplainMistakeModal
          diagnosis={mistakeModalData.diagnosis}
          userSentence={mistakeModalData.userSentence}
          nativeLang={activeLangCode}
          onClose={() => setMistakeModalData(null)}
          onSaveToQueue={() => {
            console.log('Saved mistake to SRS queue');
            setMistakeModalData(null);
          }}
        />
      )}
    </div>
  );
}
