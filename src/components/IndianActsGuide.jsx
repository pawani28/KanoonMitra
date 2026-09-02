import React from 'react';
import { INDIAN_ACTS_GUIDE } from '../constants/indianLaws';
import { BookOpen, Scale, ShieldCheck, CheckCircle2, Landmark } from 'lucide-react';

export default function IndianActsGuide() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Statutory Indian Jurisprudence Grounding</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Indian Legal Frameworks & Statutory Compliance
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Every clause drafted by KanoonMitra is strictly aligned with the Constitution of India and foundational Indian business & civil enactments.
        </p>
      </div>

      {/* Grid of Acts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INDIAN_ACTS_GUIDE.map((actItem, idx) => (
          <div 
            key={idx}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-md shadow-slate-200/50 space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {actItem.act}
                </h3>
                <span className="text-[11px] font-mono text-amber-700 font-bold">
                  {actItem.sections}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {actItem.summary}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-800">Practical Enforceability Rule: </span>
                <span className="font-medium text-slate-700">{actItem.keyRule}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
