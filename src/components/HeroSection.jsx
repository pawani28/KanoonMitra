import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck, 
  Landmark, 
  Languages, 
  Mic, 
  Volume2, 
  CheckCircle2, 
  Scale, 
  Zap,
  Lock
} from 'lucide-react';

export default function HeroSection({ onPromptSubmit, onSelectTemplate }) {
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTabPreview, setActiveTabPreview] = useState('plain'); // 'court' | 'plain'

  const handleQuickPrompt = (text) => {
    setPromptInput(text);
  };

  const handleVoiceMock = () => {
    setIsListening(true);
    setTimeout(() => {
      setPromptInput("11-Month Rent Agreement for a 2BHK flat in Indiranagar Bengaluru at ₹28,000 monthly rent with 3 months lock-in");
      setIsListening(false);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setLoading(true);
    onPromptSubmit(promptInput);
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 border-b border-slate-200/80">
      
      {/* Background Soft Mesh Gradients (Modern Stripe/Linear Vibe) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-r from-indigo-200/40 via-sky-200/30 to-amber-200/40 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/4 right-[10%] w-72 h-72 bg-amber-200/30 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-[10%] w-72 h-72 bg-indigo-200/30 blur-[100px] pointer-events-none rounded-full" />

      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>AI Legal Assistant for Bharat 🇮🇳</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Languages className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dual-Pane: Court Draft + Saral Hindi</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Indian Contract Act 1872 Grounded</span>
          </div>
        </div>

        {/* Main Title & Tagline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Complex Indian Legal Jargon,{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-amber-600 bg-clip-text text-transparent">
              Simplified in Saral Bhasha
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Draft court-enforceable agreements in 3 minutes. Understand every single clause in <strong className="text-amber-700 font-bold">सरल हिन्दी (Saral Hindi)</strong> & plain English, and detect predatory red flags before signing.
          </p>
        </div>

        {/* High-End White Glass Search & Prompt Box */}
        <div className="max-w-3xl mx-auto mb-10">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-amber-500 rounded-3xl blur-md opacity-25 group-hover:opacity-60 transition duration-500" />
            
            <div className="relative flex flex-col sm:flex-row items-center bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(30,58,138,0.08)] p-2 gap-2">
              <div className="flex items-center w-full pl-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Describe your agreement in English or Hinglish (e.g. 11-month flat rent in Bengaluru...)"
                  className="w-full bg-transparent px-3 py-3 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0 pr-1">
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleVoiceMock}
                  title="Speak in Hindi/English"
                  className={`p-3 rounded-xl border transition-all ${
                    isListening 
                      ? 'bg-rose-50 border-rose-400 text-rose-600 animate-ping' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Submit Draft Button */}
                <button
                  type="submit"
                  disabled={loading || !promptInput.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all transform hover:scale-[1.02]"
                >
                  <span>{loading ? 'Synthesizing...' : 'Generate AI Contract'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </form>

          {/* Quick Template Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-600">
            <span className="font-bold text-slate-400 flex items-center space-x-1">
              <span>⚡ Try Prompts:</span>
            </span>
            <button 
              onClick={() => handleQuickPrompt('Residential Rent Agreement for Flat in Indiranagar Bengaluru at ₹25,000 monthly rent')}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all shadow-xs"
            >
              🏠 11-Month Rent (Bengaluru)
            </button>
            <button 
              onClick={() => handleQuickPrompt('Freelancer Web Design Contract with 50% advance and late payment interest in Delhi')}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all shadow-xs"
            >
              💼 Freelancer Contract (Delhi)
            </button>
            <button 
              onClick={() => handleQuickPrompt('Mutual Non-Disclosure Agreement for tech startup code sharing in Mumbai')}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all shadow-xs"
            >
              🔒 Startup Mutual NDA (Mumbai)
            </button>
          </div>
        </div>

        {/* Live Comparison Teaser Box (Clean White SaaS Card) */}
        <div className="max-w-4xl mx-auto my-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 p-5 sm:p-7">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-500 ml-2">Live AI Clause Simplifier Preview</span>
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTabPreview('plain')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeTabPreview === 'plain' 
                    ? 'bg-amber-500 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇮🇳 Saral Bhasha (सरल हिन्दी)
              </button>
              <button
                onClick={() => setActiveTabPreview('court')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeTabPreview === 'court' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📜 Court Legal Jargon
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Sample Clause: Security Deposit Deduction
              </span>
              {activeTabPreview === 'court' ? (
                <p className="text-slate-800 font-serif leading-relaxed text-justify">
                  "The Licensor shall retain absolute prerogative to appropriate, set-off, and forfeit the non-interest bearing security deposit against any alleged indemnifiable covenant breach without requirement of preliminary judicial determination."
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-amber-900 font-sans font-semibold text-sm leading-snug">
                    💡 <strong>सरल मतलब:</strong> मकान मालिक आपका सिक्योरिटी डिपॉजिट बिना किसी ठोस कारण के नहीं रख सकता। फ्लैट खाली करने के दिन पूरा पैसा वापस मिलेगा, सिर्फ पेंडिंग बिजली/पानी बिल ही कटेगा।
                  </p>
                  <p className="text-slate-600 font-sans text-[11px] pt-1 border-t border-slate-200">
                    🇬🇧 <strong>Plain English:</strong> The landlord must refund your entire deposit on move-out day. Deductions are only permitted for documented unpaid bills or actual physical damages.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-900 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>AI Legal Protection Shield</span>
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    Safe & Balanced
                  </span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  KanoonMitra automatically balances landlord-tenant and client-contractor rights under the <strong>Indian Contract Act, 1872</strong> to prevent unjustified forfeiture.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-indigo-200 flex items-center justify-between text-[10px] text-slate-500">
                <span>Ref: Section 74 ICA 1872</span>
                <span className="text-indigo-700 font-bold">100% Court Enforceable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200">
          <div className="text-center p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-2xl font-black text-indigo-600 block font-mono">₹0</span>
            <span className="text-[11px] text-slate-500 font-semibold">Cost to Draft Standard Contracts</span>
          </div>
          <div className="text-center p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-2xl font-black text-blue-600 block font-mono">&lt; 3 Mins</span>
            <span className="text-[11px] text-slate-500 font-semibold">Turnaround Time vs 3-5 Days</span>
          </div>
          <div className="text-center p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-2xl font-black text-emerald-600 block font-mono">6.3 Cr</span>
            <span className="text-[11px] text-slate-500 font-semibold">Indian MSMEs Impact Target</span>
          </div>
          <div className="text-center p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-2xl font-black text-amber-600 block font-mono">0%</span>
            <span className="text-[11px] text-slate-500 font-semibold">Jargon Barrier with Saral Hindi</span>
          </div>
        </div>

      </div>
    </div>
  );
}
