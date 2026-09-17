import React, { useState, useEffect } from 'react';
import { Volume2, Mic, Send, Star, Trophy, RotateCcw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { speakFrench, startSpeechRecognition } from '../services/speech';

export default function SurvivalRoleplay({ nativeLang = 'ur', onBack }) {
  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScenariosList();
  }, [nativeLang]);

  const loadScenariosList = async () => {
    try {
      setLoading(true);
      const data = await api.getScenarios(nativeLang);
      setScenarios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startScenario = async (scId) => {
    try {
      const detail = await api.getScenarioDetail(scId, nativeLang);
      setActiveScenario(detail);
      setCurrentStep(0);
      setIsCompleted(false);
      setScorecard(null);
      setUserInput('');

      // First clerk message
      const firstStep = detail.dialogue_steps[0];
      setMessages([
        {
          speaker: 'clerk',
          name: firstStep.speaker_name,
          fr: firstStep.message_fr,
          native: firstStep.translation_native
        }
      ]);
      speakFrench(firstStep.message_fr);
    } catch (err) {
      console.error('Failed to start scenario:', err);
    }
  };

  const handleSendResponse = async (textToSend) => {
    const text = textToSend || userInput;
    if (!text.trim() || !activeScenario) return;

    // Add user message to dialogue
    const newMessages = [
      ...messages,
      { speaker: 'user', name: 'Vous', fr: text }
    ];
    setMessages(newMessages);
    setUserInput('');

    try {
      const turnRes = await api.submitSurvivalTurn(
        activeScenario.id,
        currentStep,
        text,
        nativeLang
      );

      if (turnRes.clerk_reply_fr) {
        newMessages.push({
          speaker: 'clerk',
          name: activeScenario.dialogue_steps[0]?.speaker_name || 'Clerk',
          fr: turnRes.clerk_reply_fr,
          native: turnRes.clerk_reply_native
        });
        setMessages([...newMessages]);
        speakFrench(turnRes.clerk_reply_fr);
      }

      if (turnRes.is_complete) {
        setIsCompleted(true);
        setScorecard(turnRes.scorecard || {
          vocabulary: 5,
          grammar: 4,
          pronunciation: 4,
          naturalness: 5
        });
      } else {
        setCurrentStep(turnRes.next_step);
      }
    } catch (err) {
      console.error('Error submitting turn:', err);
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(true);
    startSpeechRecognition(
      (result) => {
        setIsRecording(false);
        setUserInput(result.transcript);
        handleSendResponse(result.transcript);
      },
      (err) => {
        setIsRecording(false);
        // Fallback for environment without microphone: insert suggested text
        const currentSuggestion = activeScenario?.dialogue_steps[currentStep]?.suggested_reply;
        if (currentSuggestion) {
          setUserInput(currentSuggestion);
          handleSendResponse(currentSuggestion);
        }
      },
      () => setIsRecording(false)
    );
  };

  // 1. SCENARIO SELECTION LIST
  if (!activeScenario) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <h2 className="text-2xl font-french font-bold text-french tracking-tight">
              🥖 {nativeLang === 'ur' ? 'زندگانی کے حقیقی حالات (Survival Mode)' : 'Situations Réelles de Survie'}
            </h2>
            <p className="text-xs text-slate-500 font-urdu mt-0.5">
              {nativeLang === 'ur' ? 'پیرس میں روزمرہ کی صورتحال کی انٹرایکٹو مشق کریں۔' : 'Pratiquez des dialogues concrets de la vie quotidienne en France.'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-sans">Chargement des scénarios...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                onClick={() => startScenario(sc.id)}
                className="p-5 rounded-3xl bg-white border-2 border-slate-200/80 hover:border-coral hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl p-2.5 rounded-2xl bg-[#FDFBF7] border border-slate-100 group-hover:scale-110 transition">
                      {sc.icon}
                    </span>
                    <span className="text-[11px] font-bold text-coral bg-coral/10 px-2.5 py-1 rounded-full uppercase font-sans">
                      {sc.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-french text-french group-hover:text-coral transition">
                      {sc.title_fr}
                    </h3>
                    <p className="text-xs text-slate-600 font-urdu mt-1 leading-relaxed">
                      {sc.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-french">
                  <span className="font-sans">{sc.total_steps} étapes de dialogue</span>
                  <span className="text-coral group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition font-bold font-sans">
                    Commencer →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. ACTIVE ROLEPLAY CHAT VIEW
  const currentStepData = activeScenario.dialogue_steps[currentStep];

  return (
    <div className="space-y-4 max-w-2xl mx-auto animate-fadeIn">
      {/* Top Scenario Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => setActiveScenario(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-french transition font-sans"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          <span>{nativeLang === 'ur' ? 'واپس فہرست' : 'Retour'}</span>
        </button>

        <div className="text-center">
          <span lang="fr" translate="no" className="notranslate text-base font-french font-bold text-french flex items-center justify-center gap-2">
            <span>{activeScenario.icon}</span>
            <span>{activeScenario.title_fr}</span>
          </span>
          <span className="text-[10px] font-bold text-coral block font-sans">
            🇫🇷 Communication en français
          </span>
        </div>

        <span className="text-xs font-semibold text-slate-400 font-sans">
          Étape {Math.min(currentStep + 1, activeScenario.dialogue_steps.length)} / {activeScenario.dialogue_steps.length}
        </span>
      </div>

      {/* Chat Dialogue Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-4 sm:p-6 min-h-[360px] max-h-[480px] overflow-y-auto space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          {messages.map((m, idx) => {
            const isClerk = m.speaker === 'clerk';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isClerk ? 'items-start' : 'items-end'} space-y-1.5`}
              >
                <div className="flex items-center gap-1.5 px-1 font-sans">
                  <span className="text-[11px] font-bold text-slate-500">
                    {isClerk ? (m.name || 'Le Pharmacien') : (nativeLang === 'ur' ? 'آپ (You)' : 'Vous (You)')}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-french/10 text-french">
                    🇫🇷 Français
                  </span>
                </div>
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                    isClerk
                      ? 'bg-slate-100 border border-slate-200 rounded-tl-sm'
                      : 'bg-coral/10 border border-coral/20 rounded-tr-sm'
                  }`}
                >
                  {/* French communication utterance */}
                  <p 
                    lang="fr" 
                    translate="no" 
                    className={`notranslate font-french font-bold text-base tracking-wide ${
                      isClerk ? 'text-french' : 'text-coral-dark'
                    }`}
                  >
                    {m.fr}
                  </p>

                  {/* Native translation reference */}
                  {m.native && (
                    <div className={`mt-2 pt-1.5 ${isClerk ? 'border-t border-slate-200' : 'border-t border-coral/20'}`}>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase font-sans tracking-wider">
                        {nativeLang === 'ur' ? 'اردو ترجمہ (Translation) :' : `Traduction (${nativeLang.toUpperCase()}) :`}
                      </span>
                      <p className={`text-xs ${isClerk ? 'text-slate-700 font-urdu' : 'text-slate-800 font-urdu'}`}>
                        {m.native}
                      </p>
                    </div>
                  )}
                </div>
                {isClerk && (
                  <button
                    onClick={() => speakFrench(m.fr)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-french px-1 transition"
                  >
                    <Volume2 size={13} />
                    <span>Écouter (Listen)</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Scorecard Modal Overlay */}
        {isCompleted && scorecard && (
          <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-4 animate-fadeIn my-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 mx-auto flex items-center justify-center text-xl shadow-xs">
              <Trophy size={24} className="text-emerald-700" />
            </div>
            <div>
              <h4 className="text-xl font-french font-bold text-french">
                {nativeLang === 'ur' ? 'بہت خوب! گفتگو مکمل ہو گئی 🥐' : 'Dialogue Réussi avec Succès !'}
              </h4>
              <p className="text-xs text-emerald-800 font-urdu mt-1">
                {nativeLang === 'ur' ? 'آپ نے پیرس کی اصل صورتحال کو کامیابی کے ساتھ سنبھال لیا۔' : 'Vous avez complété cette mise en situation avec aisance.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 font-sans">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Vocabulaire</span>
                <div className="flex justify-center text-amber-400 text-sm mt-0.5">
                  {'★'.repeat(scorecard.vocabulary)}
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Grammaire</span>
                <div className="flex justify-center text-amber-400 text-sm mt-0.5">
                  {'★'.repeat(scorecard.grammar)}
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Prononciation</span>
                <div className="flex justify-center text-amber-400 text-sm mt-0.5">
                  {'★'.repeat(scorecard.pronunciation)}
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Aisance</span>
                <div className="flex justify-center text-amber-400 text-sm mt-0.5">
                  {'★'.repeat(scorecard.naturalness)}
                </div>
              </div>
            </div>

            <button
              onClick={() => startScenario(activeScenario.id)}
              className="px-5 py-2.5 rounded-xl bg-french/10 hover:bg-french/20 text-french border border-french/30 font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>{nativeLang === 'ur' ? 'دوبارہ مشق کریں' : 'Rejouer ce scénario'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Suggested Phrase Hint */}
      {!isCompleted && currentStepData?.suggested_reply && (
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-center justify-between gap-3 shadow-2xs">
          <div className="text-left rtl:text-right flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold text-amber-900 uppercase font-sans">
                💡 {nativeLang === 'ur' ? 'فرانسیسی میں تجویز کردہ جواب:' : 'Réponse suggérée en français :'}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200/60 text-amber-900">
                🇫🇷 Expression
              </span>
            </div>
            <p 
              lang="fr" 
              translate="no" 
              className="notranslate text-sm font-french font-bold text-slate-900"
            >
              "{currentStepData.suggested_reply}"
            </p>
            {currentStepData.translations?.[nativeLang] && (
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                {currentStepData.translations[nativeLang]}
              </p>
            )}
          </div>
          <button
            onClick={() => handleSendResponse(currentStepData.suggested_reply)}
            className="px-3.5 py-2 bg-french/10 hover:bg-french/20 text-french border border-french/30 font-bold text-xs rounded-xl transition shrink-0 shadow-xs flex items-center gap-1"
          >
            <span>Utiliser</span>
            <span className="text-[10px] font-sans opacity-70">(Send)</span>
          </button>
        </div>
      )}

      {/* Response Input Bar */}
      {!isCompleted && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleVoiceRecord}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shrink-0 shadow-xs border ${
              isRecording 
                ? 'bg-red-100 text-red-600 border-red-300 animate-pulse' 
                : 'bg-french/10 hover:bg-french/20 text-french border-french/30'
            }`}
            title="Parler au micro"
          >
            <Mic size={20} />
          </button>

          <input
            type="text"
            lang="fr"
            translate="no"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendResponse()}
            placeholder={nativeLang === 'ur' ? 'فرانسیسی میں جواب لکھیں (مثلاً: Bonjour...)' : 'Écrivez votre réponse en français...'}
            className="notranslate flex-1 px-4 py-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:border-coral text-sm bg-white font-sans shadow-2xs"
          />

          <button
            onClick={() => handleSendResponse()}
            className="w-12 h-12 rounded-2xl bg-coral/15 hover:bg-coral/25 text-coral-dark border border-coral/30 flex items-center justify-center transition shrink-0 shadow-xs"
            title="Envoyer"
          >
            <Send size={18} className="rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}
