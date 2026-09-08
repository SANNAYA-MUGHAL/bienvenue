import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Volume2, BookmarkCheck, RotateCcw } from 'lucide-react';
import { speakFrench } from '../services/speech';

export default function ExplainMistakeModal({ diagnosis, userSentence, onClose, nativeLang = 'ur', onSaveToQueue }) {
  if (!diagnosis) return null;

  const [saved, setSaved] = useState(false);

  const handleAudio = () => {
    if (diagnosis.corrected_fr) {
      speakFrench(diagnosis.corrected_fr);
    }
  };

  const handleSave = () => {
    setSaved(true);
    if (onSaveToQueue) onSaveToQueue(diagnosis);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-amber-200" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              {nativeLang === 'ur' ? '💡 نکتہ برائے اصلاح (Diagnostic)' : 'Diagnostic Linguistique'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          
          {/* User's mistake */}
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 space-y-1">
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
              {nativeLang === 'ur' ? 'آپ کا جملہ (غلطی):' : 'Votre phrase :'}
            </span>
            <p className="text-base font-semibold text-red-900 line-through">
              "{userSentence || 'Je suis 25 ans.'}"
            </p>
          </div>

          {/* Native Contrastive Explanation */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {nativeLang === 'ur' ? 'گرامر کی وضاحت (اپنی زبان میں):' : 'Explication Contrastive :'}
            </span>
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200 text-slate-800 text-sm leading-relaxed font-urdu">
              {diagnosis.explanation_native}
            </div>
          </div>

          {/* Corrected French Model Sentence */}
          {diagnosis.corrected_fr && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle size={14} />
                  {nativeLang === 'ur' ? 'درست فرانسیسی جملہ:' : 'Phrase Correcte :'}
                </span>
                <p className="text-lg font-bold text-emerald-950 font-sans">
                  {diagnosis.corrected_fr}
                </p>
                {diagnosis.phonetic_transcription && (
                  <p className="text-xs text-emerald-700 font-urdu">
                    تلفظ: {diagnosis.phonetic_transcription}
                  </p>
                )}
              </div>

              <button
                onClick={handleAudio}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition shrink-0 shadow-sm"
                title="Écouter"
              >
                <Volume2 size={18} />
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-100 font-bold text-sm text-slate-700 transition flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            <span>{nativeLang === 'ur' ? 'دوبارہ کوشش کریں' : 'Réessayer'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              saved 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-[#1B2A4A] hover:bg-[#0F1A2E] text-white shadow-sm'
            }`}
          >
            <BookmarkCheck size={16} />
            <span>{saved ? (nativeLang === 'ur' ? 'محفوظ شدہ' : 'Sauvegardé') : (nativeLang === 'ur' ? 'کمزور نکات میں شامل کریں' : 'Ajouter aux Révisions')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
