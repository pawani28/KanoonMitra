import React from 'react';
import { Scale, Heart, Shield, Landmark } from 'lucide-react';

export default function Footer({ onOpenPitchDeck }) {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2 text-slate-900">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Scale className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight">KanoonMitra (कानून मित्र)</span>
            </div>
            <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
              Empowering India's citizens, freelancers, and 6.3 crore MSMEs with AI-powered, plain-language legal documentation grounded in Indian statutory law.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-700 font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Grounded in Indian Legal Statutes (ICA 1872)</span>
            </div>
          </div>

          {/* Col 2: Supported Indian Acts */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Indian Statutes
            </h4>
            <ul className="space-y-1 text-slate-500 text-[11px]">
              <li>• Indian Contract Act, 1872</li>
              <li>• Transfer of Property Act, 1882</li>
              <li>• Information Technology Act, 2000</li>
              <li>• MSMED Act, 2006 (Sec 15 & 16)</li>
              <li>• Arbitration & Conciliation Act, 1996</li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Quick Links & Resources
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={onOpenPitchDeck}
                  className="text-indigo-600 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>📊 View Pitch Deck Slides</span>
                </button>
              </li>
              <li className="text-slate-500">• Dual-View Legal + Saral Drafting</li>
              <li className="text-slate-500">• Red-Flag Predatory Clause Detector</li>
              <li className="text-slate-500">• State Stamp Duty Calculator</li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            ⚖️ <strong>Legal Disclaimer:</strong> KanoonMitra is an AI drafting assistant and legal intelligence platform. While grounded in Indian statutory jurisprudence, it does not constitute a substitute for formal legal representation in active litigation.
          </p>
          <div className="shrink-0 flex items-center space-x-1 font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Bharat</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
