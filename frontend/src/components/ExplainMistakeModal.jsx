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
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-coral/15 border border-coral/30 flex items-center justify-center text-coral-dark">
              <AlertCircle size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-french font-sans">
                {nativeLang === 'ur' ? '💡 نکتہ برائے اصلاح (Diagnostic)' : 'Diagnostic Linguistique'}
              </h3>
              <p className="text-[10px] text-slate-500 font-sans">
                {nativeLang === 'ur' ? 'فرانسیسی اور مادری زبان کا تقابل' : 'Contrastive grammar feedback'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          
          {/* User's mistake */}
          <div className="p-4 rounded-2xl bg-coral-50 border border-coral-200/80 space-y-1">
            <span className="text-[11px] font-bold text-coral-700 uppercase tracking-wider block font-sans">
              {nativeLang === 'ur' ? 'آپ کا جملہ (غلطی):' : 'Votre phrase (erreur) :'}
            </span>
            <p lang="fr" translate="no" className="notranslate text-base font-semibold text-coral-900 line-through font-french">
              "{userSentence || 'Je suis 25 ans.'}"
            </p>
          </div>

          {/* Native Contrastive Explanation */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-sans">
              {nativeLang === 'ur' ? 'گرامر کی وضاحت (اپنی زبان میں):' : 'Explication Contrastive :'}
            </span>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-slate-800 text-sm leading-relaxed font-urdu shadow-2xs">
              {diagnosis.explanation_native}
            </div>
          </div>

          {/* Corrected French Model Sentence */}
          {diagnosis.corrected_fr && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                  <CheckCircle size={14} />
                  {nativeLang === 'ur' ? 'درست فرانسیسی جملہ:' : 'Phrase Correcte :'}
                </span>
                <p lang="fr" translate="no" className="notranslate text-xl font-bold text-emerald-950 font-french">
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
                className="w-11 h-11 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 flex items-center justify-center transition shrink-0 shadow-xs hover:scale-105 active:scale-95"
                title="Écouter"
              >
                <Volume2 size={20} />
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 font-sans">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-100 font-bold text-xs sm:text-sm text-slate-700 transition flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            <span>{nativeLang === 'ur' ? 'دوبارہ کوشش کریں' : 'Réessayer'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xs ${
              saved 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-french/10 hover:bg-french/20 text-french border border-french/30'
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
