import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle2, Clock, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function BrainMap({ nativeLang = 'ur', onSelectNode }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMap();
  }, []);

  const loadMap = async () => {
    try {
      setLoading(true);
      const res = await api.getBrainMap();
      setData(res);
    } catch (err) {
      console.error('Failed to load brain map:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="py-16 text-center text-slate-400">
        <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
        <span>Génération de votre French Brain Map...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral text-2xl">
              <Brain size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-french font-bold text-french tracking-tight">
                {nativeLang === 'ur' ? 'فرانسیسی برین میپ (Brain Map)' : 'French Brain Map'}
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                {nativeLang === 'ur' ? 'آپ کا ذاتی علمی گراف اور حافظے کا ریکارڈ' : 'Graphe de connaissances CEFR A1 et rétention SM-2'}
              </p>
            </div>
          </div>

          <div className="text-right rtl:text-left font-sans">
            <span className="text-3xl font-black text-coral">
              {data.overall_progress}%
            </span>
            <span className="block text-[11px] text-slate-500 uppercase font-bold">
              Niveau CEFR A1
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-coral h-full rounded-full transition-all duration-500"
            style={{ width: `${data.overall_progress}%` }}
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-1 font-sans">
          <span>{data.mastered_nodes} / {data.total_nodes} compétences maîtrisées</span>
          <span className="text-coral-dark font-bold">SuperMemo-2 Activé</span>
        </div>
      </div>

      {/* Visual Legend */}
      <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-600 bg-white py-2.5 px-4 rounded-2xl border border-slate-200/80 shadow-2xs font-sans">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>{nativeLang === 'ur' ? 'مکمل مہارت (>85%)' : 'Maîtrisé'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-lavender" />
          <span>{nativeLang === 'ur' ? 'زیرِ مشق' : 'En cours'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-coral" />
          <span>{nativeLang === 'ur' ? 'دہرائی ضروری (SRS)' : 'À réviser'}</span>
        </div>
      </div>

      {/* Interactive Competency Graph Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {data.nodes.map((node) => {
          const isMastered = node.status === 'mastered';
          const isReview = node.status === 'review_due';

          const borderStyle = isMastered
            ? 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/20'
            : isReview
            ? 'border-coral/40 hover:border-coral bg-coral-50/20'
            : 'border-lavender/40 hover:border-lavender bg-lavender/5';

          const badgeColor = isMastered
            ? 'bg-emerald-100 text-emerald-800'
            : isReview
            ? 'bg-coral/15 text-coral'
            : 'bg-lavender/15 text-lavender';

          return (
            <div
              key={node.id}
              className={`p-4 rounded-3xl border-2 ${borderStyle} bg-white shadow-2xs transition hover:shadow-md space-y-3 cursor-pointer`}
              onClick={() => onSelectNode && onSelectNode(node)}
            >
              <div className="flex items-start justify-between font-sans">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {node.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                  {node.mastery_percentage}%
                </span>
              </div>

              <div>
                <h4 className="text-lg font-french font-bold text-french">
                  {node.title_fr}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  {isMastered ? (
                    <CheckCircle2 size={14} className="text-emerald-600" />
                  ) : isReview ? (
                    <AlertTriangle size={14} className="text-coral" />
                  ) : (
                    <Clock size={14} className="text-lavender" />
                  )}
                  <span>
                    {isMastered 
                      ? (nativeLang === 'ur' ? 'مکمل محفوظ' : 'Retenu') 
                      : isReview 
                      ? (nativeLang === 'ur' ? 'دہرائی درکار' : 'Révision due')
                      : (nativeLang === 'ur' ? 'جاری ہے' : 'En apprentissage')}
                  </span>
                </div>
              </div>

              {/* Node Mini Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isMastered ? 'bg-emerald-500' : isReview ? 'bg-coral' : 'bg-lavender'
                  }`}
                  style={{ width: `${node.mastery_percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
