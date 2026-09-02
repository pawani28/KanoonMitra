import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw,
  Scale
} from 'lucide-react';
import { auditContractRisk } from '../services/geminiService';

export default function RiskAnalyzer({ currentDocText, onApplyFix }) {
  const [inputText, setInputText] = useState(currentDocText || '');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const samplePredatoryContract = `SERVICES AGREEMENT
1. The Service Provider shall work exclusively for Client and shall not undertake any competing work for 2 years post termination.
2. The Client may terminate this agreement immediately at its sole discretion without any notice or compensation.
3. The Service Provider shall unconditionally indemnify and hold harmless the Client against any and all claims without limitation of liability.
4. Payment shall be released within 120 days of invoice approval at Client's convenience.`;

  const handleRunAudit = async () => {
    if (!inputText.trim()) return;
    setIsAuditing(true);
    try {
      const res = await auditContractRisk(inputText);
      setAuditResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleLoadSample = () => {
    setInputText(samplePredatoryContract);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>AI Fairness & Red-Flag Audit Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Contract Red-Flag & Predatory Clause Detector
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload or paste any Indian contract to detect illegal terms, void non-competes, one-sided penalties, and missing statutory safeguards.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-colors shrink-0"
        >
          Load Risky Contract Sample
        </button>
      </div>

      {/* Input / Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Text (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md shadow-slate-200/50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                Paste Agreement Text to Audit
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {inputText.length} chars
              </span>
            </div>

            <textarea
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste contract clauses or full agreement here to analyze..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 font-mono focus:outline-none focus:border-rose-500 focus:bg-white leading-relaxed resize-none transition-colors"
            />

            <button
              onClick={handleRunAudit}
              disabled={isAuditing || !inputText.trim()}
              className="w-full mt-4 py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/25 disabled:opacity-50 transition-all"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning against Indian Contract Act...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Run AI Red-Flag & Fairness Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Benchmark Banner */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2 shadow-xs">
            <p className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Scale className="w-4 h-4 text-indigo-600" />
              <span>Key Audit Benchmarks:</span>
            </p>
            <p>• <strong>Sec 27 Indian Contract Act 1872:</strong> Post-employment non-competes are void in India.</p>
            <p>• <strong>Sec 16 MSMED Act 2006:</strong> Mandatory compound interest if payment delayed &gt; 45 days.</p>
            <p>• <strong>Sec 74 ICA 1872:</strong> Liquidated damages must be reasonable and cannot be punitive.</p>
          </div>
        </div>

        {/* Right: Audit Results (7 cols) */}
        <div className="lg:col-span-7">
          
          {auditResult ? (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Score Meter Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                
                <div className="flex items-center space-x-5">
                  <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-slate-50 border-4 border-slate-200 shadow-inner shrink-0">
                    <div className="text-center">
                      <span className={`text-3xl font-black ${
                        auditResult.fairnessScore > 75 ? 'text-emerald-600' :
                        auditResult.fairnessScore > 50 ? 'text-amber-600' :
                        'text-rose-600'
                      }`}>
                        {auditResult.fairnessScore}
                      </span>
                      <span className="text-[10px] text-slate-400 block -mt-1 font-bold">/100</span>
                    </div>
                  </div>

                  <div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      auditResult.riskRating === 'Low' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' :
                      auditResult.riskRating === 'Moderate' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                      'bg-rose-50 text-rose-800 border border-rose-300'
                    }`}>
                      {auditResult.riskRating} Risk Rating
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">
                      Contract Fairness Analysis
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {auditResult.summary}
                    </p>
                  </div>
                </div>

              </div>

              {/* Saral Hindi Summary */}
              {auditResult.plainSummaryHindi && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs">
                  <span className="font-bold text-amber-900 block mb-1">
                    🇮🇳 सरल भाषा में निष्कर्ष (Plain Hindi Summary):
                  </span>
                  <p className="text-amber-950 leading-relaxed font-sans font-medium">
                    {auditResult.plainSummaryHindi}
                  </p>
                </div>
              )}

              {/* Detected Red Flags */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md shadow-slate-200/50">
                <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Detected Red Flags & Predatory Clauses ({auditResult.redFlags?.length || 0})</span>
                </h4>

                <div className="space-y-3">
                  {auditResult.redFlags?.map((flag, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-rose-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-slate-700 italic bg-white px-2.5 py-1 rounded-lg border border-slate-200 truncate max-w-[280px]">
                          "{flag.clauseSnippet}"
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          flag.severity === 'high' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {flag.severity} risk
                        </span>
                      </div>

                      <p className="text-rose-900 font-bold">
                        ⚠️ <strong>Problem:</strong> {flag.issue}
                      </p>

                      <div className="p-3 rounded-xl bg-white border border-emerald-200 text-emerald-900 font-medium">
                        <span className="font-bold text-emerald-700">💡 Recommended Fix: </span>
                        {flag.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[350px] bg-white border border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Audit Executed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Paste contract text on the left or click "Load Risky Contract Sample" to see Gemini AI detect legal red flags in real-time.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
