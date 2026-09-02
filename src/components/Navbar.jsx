import React from 'react';
import { Scale, Sparkles, FileText, ShieldAlert, Calculator, BookOpen, Key, Presentation, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenApiKeyModal, onOpenPitchDeck, apiKeySet }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 text-slate-800 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('templates')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform shrink-0">
              <Scale className="w-5 h-5 text-white font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 bg-clip-text text-transparent">
                  KanoonMitra
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
                  कानून मित्र
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                AI Legal Documentation for Bharat 🇮🇳
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'templates' || activeTab === 'studio' || activeTab === 'wizard'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Draft Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'audit'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>Red-Flag Audit</span>
            </button>

            <button
              onClick={() => setActiveTab('stamp')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'stamp'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span>Stamp Duty</span>
            </button>

            <button
              onClick={() => setActiveTab('laws')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'laws'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Indian Acts</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenPitchDeck}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 flex items-center space-x-1.5 transition-all transform hover:scale-105"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hackathon Pitch Deck</span>
              <span className="sm:hidden">Pitch</span>
            </button>

            <button
              onClick={onOpenApiKeyModal}
              title="Configure Gemini API Key"
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-colors ${
                apiKeySet 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">{apiKeySet ? 'Gemini AI Active' : 'API Key'}</span>
              {apiKeySet && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
