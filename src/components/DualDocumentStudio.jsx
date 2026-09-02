import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  Sparkles, 
  ShieldAlert, 
  Languages, 
  BookOpen, 
  UserCheck, 
  Plus, 
  Check, 
  Copy, 
  RefreshCw, 
  FileText, 
  Scale, 
  ChevronRight,
  HelpCircle,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateDocumentHash, printLegalDocument, downloadDocumentAsText } from '../services/pdfService';
import { refineClause } from '../services/geminiService';

export default function DualDocumentStudio({ 
  documentData, 
  setDocumentData, 
  onBackToWizard, 
  onOpenAudit, 
  onOpenLawyerModal 
}) {
  const [viewMode, setViewMode] = useState('split'); // 'court' | 'plain' | 'split'
  const [languageMode, setLanguageMode] = useState('both'); // 'en' | 'hi' | 'both'
  const [paperTheme, setPaperTheme] = useState('light'); // 'light' | 'parchment' | 'dark'
  const [fontSize, setFontSize] = useState(14);
  const [selectedClauseId, setSelectedClauseId] = useState(null);
  const [aiInstruction, setAiInstruction] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [newClauseTitle, setNewClauseTitle] = useState('');

  if (!documentData) return null;

  const docHash = generateDocumentHash(
    documentData.title, 
    documentData.preamble, 
    documentData.clauses
  );

  const handleCopyText = () => {
    const fullText = `${documentData.title}\n\n${documentData.preamble}\n\n` +
      documentData.clauses.map(c => `Clause ${c.number}: ${c.heading}\n${c.legalText}\n[Plain Meaning]: ${c.plainEnglish}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    printLegalDocument('printable-legal-document');
  };

  const handleDownload = () => {
    downloadDocumentAsText(documentData, viewMode === 'plain');
  };

  const handleToggleSpeech = (textToRead) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    const text = textToRead || documentData.clauses.map(c => `${c.heading}. ${languageMode === 'hi' ? c.plainHindi : c.plainEnglish}`).join('. ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleRefineClause = async (clause) => {
    if (!aiInstruction.trim()) return;
    setIsRefining(true);
    try {
      const result = await refineClause(clause.legalText, aiInstruction);
      if (result) {
        setDocumentData(prev => ({
          ...prev,
          clauses: prev.clauses.map(c => {
            if (c.id === clause.id) {
              return {
                ...c,
                legalText: result.revisedLegalText || c.legalText,
                plainEnglish: result.revisedPlainEnglish || c.plainEnglish,
                plainHindi: result.revisedPlainHindi || c.plainHindi
              };
            }
            return c;
          })
        }));
        setAiInstruction('');
      }
    } catch (err) {
      console.error("Failed to refine clause:", err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleAddCustomClause = () => {
    if (!newClauseTitle.trim()) return;
    const newId = `c${documentData.clauses.length + 1}`;
    const newNum = String(documentData.clauses.length + 1);

    const newClause = {
      id: newId,
      number: newNum,
      heading: newClauseTitle,
      legalText: `Both parties mutually agree to observe and enforce the covenants relating to ${newClauseTitle} in full compliance with the statutory provisions of Indian Law.`,
      plainEnglish: `Both parties agreed to follow the rules regarding ${newClauseTitle}.`,
      plainHindi: `दोनों पक्ष ${newClauseTitle} से संबंधित नियमों का पालन करने पर सहमत हैं।`,
      riskLevel: 'low',
      riskTip: 'Ensure specific timelines and responsibilities are written clearly.'
    };

    setDocumentData(prev => ({
      ...prev,
      clauses: [...prev.clauses, newClause]
    }));
    setNewClauseTitle('');
  };

  const selectedClause = documentData.clauses.find(c => c.id === selectedClauseId);

  const getPaperThemeClass = () => {
    if (paperTheme === 'parchment') return 'bg-[#fbf7ee] text-amber-950 border border-amber-200';
    if (paperTheme === 'dark') return 'bg-slate-900 text-slate-100 border border-slate-700';
    return 'bg-white text-slate-900 border border-slate-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Studio Control Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 mb-6 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onBackToWizard}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
          >
            ← Intake Wizard
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                viewMode === 'split' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Dual Comparison</span>
            </button>

            <button
              onClick={() => setViewMode('court')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                viewMode === 'court' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Court Draft</span>
            </button>

            <button
              onClick={() => setViewMode('plain')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                viewMode === 'plain' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Saral Plain View</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setLanguageMode('both')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${languageMode === 'both' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'}`}
            >
              Eng + हिन्दी
            </button>
            <button
              onClick={() => setLanguageMode('hi')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${languageMode === 'hi' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500'}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguageMode('en')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${languageMode === 'en' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'}`}
            >
              English
            </button>
          </div>
        </div>

        {/* Right Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Audio Voice Reader */}
          <button
            onClick={() => handleToggleSpeech()}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isSpeaking 
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
            <span>{isSpeaking ? 'Stop Audio' : 'Listen Saral Hindi'}</span>
          </button>

          {/* Paper Style Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setPaperTheme('light')}
              title="A4 White Paper"
              className={`p-1.5 rounded-lg text-xs ${paperTheme === 'light' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-400'}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPaperTheme('parchment')}
              title="Warm Parchment"
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${paperTheme === 'parchment' ? 'bg-amber-100 text-amber-800 shadow-2xs' : 'text-slate-400'}`}
            >
              📜
            </button>
            <button
              onClick={() => setPaperTheme('dark')}
              title="Dark Mode Sheet"
              className={`p-1.5 rounded-lg text-xs ${paperTheme === 'dark' ? 'bg-slate-800 text-white shadow-2xs' : 'text-slate-400'}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenAudit}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>AI Risk Audit</span>
          </button>

          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/25 transition-all transform hover:scale-105"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Print / PDF</span>
          </button>

        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Interactive Navigator & AI Refiner (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Statutory Stamp Notice Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 text-xs shadow-md shadow-slate-200/50">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold mb-1.5">
              <Scale className="w-4 h-4 text-indigo-600" />
              <span>Statutory Compliance & Stamping</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {documentData.stampDutyNotice || "To be executed on appropriate Non-Judicial Stamp Paper under State Stamp Act."}
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Doc Hash: {docHash}</span>
              <span className="text-emerald-700 font-bold">● Valid under ICA 1872</span>
            </div>
          </div>

          {/* Clause Navigator */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md shadow-slate-200/50">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Document Clauses ({documentData.clauses.length})
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Click to edit with AI</span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {documentData.clauses.map((clause) => (
                <div
                  key={clause.id}
                  onClick={() => setSelectedClauseId(clause.id === selectedClauseId ? null : clause.id)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                    selectedClauseId === clause.id
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-400/30 text-slate-900 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-[10px] shrink-0">
                        {clause.number}
                      </span>
                      <span className="font-bold truncate max-w-[170px]">{clause.heading}</span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      clause.riskLevel === 'high' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      clause.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {clause.riskLevel || 'safe'}
                    </span>
                  </div>

                  {clause.riskTip && (
                    <p className="text-[10px] text-slate-500 mt-1.5 pl-7 line-clamp-1 font-medium">
                      💡 {clause.riskTip}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Add Custom Clause Input */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newClauseTitle}
                  onChange={(e) => setNewClauseTitle(e.target.value)}
                  placeholder="Add custom clause (e.g. AC Maintenance)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAddCustomClause}
                  disabled={!newClauseTitle.trim()}
                  className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold disabled:opacity-50 transition-colors shrink-0 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* AI Clause Assistant Box */}
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/80 border border-indigo-200 rounded-3xl p-5 shadow-lg shadow-indigo-100/50">
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Clause Refiner & Co-Pilot</span>
            </div>

            {selectedClause ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-700">
                  Editing: <span className="font-extrabold text-slate-900">Clause {selectedClause.number}: {selectedClause.heading}</span>
                </p>

                {/* Quick Instruction Chips */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setAiInstruction('Make this clause more tenant-friendly and add a 15-day notice grace period')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-[10px] text-slate-700 border border-slate-200 font-semibold"
                  >
                    🛡️ Tenant-Friendly
                  </button>
                  <button
                    onClick={() => setAiInstruction('Simplify in 5th grade plain words without legalese')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-[10px] text-slate-700 border border-slate-200 font-semibold"
                  >
                    ✨ Simplify Language
                  </button>
                  <button
                    onClick={() => setAiInstruction('Add mandatory Section 16 MSMED statutory interest for delayed payments')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-[10px] text-slate-700 border border-slate-200 font-semibold"
                  >
                    ⚡ MSMED Interest
                  </button>
                </div>

                <input
                  type="text"
                  value={aiInstruction}
                  onChange={(e) => setAiInstruction(e.target.value)}
                  placeholder="Type custom instruction for this clause..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />

                <button
                  onClick={() => handleRefineClause(selectedClause)}
                  disabled={isRefining || !aiInstruction.trim()}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
                >
                  {isRefining ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{isRefining ? 'Synthesizing with Gemini AI...' : 'Apply AI Clause Rewrite'}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-4 px-2 text-slate-500 text-xs">
                <HelpCircle className="w-6 h-6 mx-auto text-indigo-400 mb-1" />
                <span>Select any clause from the list above to activate the AI Refiner.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: The Living Legal Sheet (8 cols) */}
        <div className="lg:col-span-8">
          
          <div className="bg-slate-100/80 p-2 sm:p-5 rounded-3xl border border-slate-200 shadow-inner">
            
            {/* The Actual Legal Sheet */}
            <div 
              id="printable-legal-document" 
              style={{ fontSize: `${fontSize}px` }}
              className={`legal-sheet ${getPaperThemeClass()} p-6 sm:p-12 rounded-2xl max-w-3xl mx-auto shadow-2xl relative overflow-hidden transition-all`}
            >
              
              {/* Subtle watermark */}
              <div className="legal-watermark">
                KANOONMITRA LEGAL
              </div>

              {/* Stamp Paper Placeholder Header Box */}
              <div className="stamp-box border-2 border-dashed border-slate-300 bg-slate-50 p-4 rounded-xl text-center mb-6">
                <p className="font-bold text-xs tracking-wider uppercase text-slate-700">
                  🇮🇳 NON-JUDICIAL E-STAMP DUTY CERTIFICATE / STAMP PAPER AREA
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Governed under {documentData.actReference || 'Indian Contract Act, 1872'} | Ref: {docHash}
                </p>
              </div>

              {/* Document Title */}
              <div className="text-center mb-8 pb-4 border-b border-slate-200">
                <h1 className="text-lg sm:text-2xl font-extrabold uppercase tracking-wide font-serif text-slate-900">
                  {documentData.title}
                </h1>
                {documentData.hindiTitle && (
                  <p className="text-sm font-bold text-amber-800 font-sans mt-1">
                    ({documentData.hindiTitle})
                  </p>
                )}
              </div>

              {/* Preamble */}
              <div className="mb-6 text-xs sm:text-sm text-justify leading-relaxed">
                {viewMode === 'court' || viewMode === 'split' ? (
                  <div className="font-serif whitespace-pre-line mb-3 text-slate-800">
                    {documentData.preamble}
                  </div>
                ) : null}

                {(viewMode === 'plain' || viewMode === 'split') && documentData.preamblePlain && (
                  <div className="p-4 bg-amber-50/90 border-l-4 border-amber-500 rounded-r-2xl text-xs text-amber-950 font-sans mb-3 shadow-xs">
                    <span className="font-bold block mb-1">💡 Saral Bhasha Summary (सरल भाषा सार):</span>
                    {documentData.preamblePlain}
                  </div>
                )}
              </div>

              {/* Recitals */}
              {documentData.recitals && documentData.recitals.length > 0 && (
                <div className="mb-6 space-y-2 text-xs sm:text-sm italic font-serif text-slate-700">
                  {documentData.recitals.map((r, i) => (
                    <p key={i} className="text-justify">
                      <strong className="not-italic mr-1 text-slate-900">{String.fromCharCode(65 + i)}.</strong> {r}
                    </p>
                  ))}
                  <p className="font-bold not-italic pt-2 text-slate-900">
                    NOW THEREFORE, in consideration of the mutual covenants and premises contained herein, the Parties agree as follows:
                  </p>
                </div>
              )}

              {/* Clauses Breakdown */}
              <div className="space-y-6 my-6">
                {documentData.clauses.map((c) => (
                  <div 
                    key={c.id} 
                    id={`clause-render-${c.id}`}
                    className={`clause-highlight p-3.5 rounded-2xl transition-all ${
                      selectedClauseId === c.id ? 'bg-amber-100/60 ring-2 ring-amber-400' : ''
                    }`}
                  >
                    {/* Clause Title */}
                    <div className="flex items-baseline justify-between mb-1.5">
                      <h3 className="font-bold text-xs sm:text-sm font-serif text-slate-950">
                        CLAUSE {c.number}. {c.heading.toUpperCase()}
                      </h3>
                      {c.riskLevel === 'high' && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 uppercase">
                          Review Advised
                        </span>
                      )}
                    </div>

                    {/* Court Legal Text */}
                    {(viewMode === 'court' || viewMode === 'split') && (
                      <p className="text-xs sm:text-sm text-justify font-serif leading-relaxed mb-2.5 text-slate-800">
                        {c.legalText}
                      </p>
                    )}

                    {/* Saral Plain Language Explainer Box */}
                    {(viewMode === 'plain' || viewMode === 'split') && (
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 font-sans shadow-xs">
                        {(languageMode === 'en' || languageMode === 'both') && (
                          <div className="flex items-start space-x-2">
                            <span className="text-indigo-700 font-bold shrink-0">🇬🇧 Plain English:</span>
                            <span className="text-slate-700">{c.plainEnglish}</span>
                          </div>
                        )}

                        {(languageMode === 'hi' || languageMode === 'both') && c.plainHindi && (
                          <div className="flex items-start space-x-2 pt-1 border-t border-slate-200">
                            <span className="text-amber-800 font-bold shrink-0">🇮🇳 सरल हिन्दी:</span>
                            <span className="font-semibold text-slate-800">{c.plainHindi}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Execution & Signature Section */}
              <div className="signature-grid mt-10 pt-6 border-t-2 border-slate-200">
                <div className="text-xs font-serif mb-4 text-slate-700">
                  <p><strong>Jurisdiction:</strong> {documentData.execution?.jurisdiction || 'India'}</p>
                  <p><strong>Signing Note:</strong> {documentData.execution?.signingNote || 'Signed in the presence of witnesses.'}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="border-t border-slate-800 pt-2 text-center">
                    <p className="font-bold text-xs font-serif text-slate-900">FIRST PARTY (Licensor / Client)</p>
                    <p className="text-[10px] text-slate-500 mt-1">Authorized Signatory / Wet Ink / Aadhaar e-Sign</p>
                  </div>
                  <div className="border-t border-slate-800 pt-2 text-center">
                    <p className="font-bold text-xs font-serif text-slate-900">SECOND PARTY (Licensee / Contractor)</p>
                    <p className="text-[10px] text-slate-500 mt-1">Authorized Signatory / Wet Ink / Aadhaar e-Sign</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="border-t border-dashed border-slate-300 pt-2 text-center">
                    <p className="font-semibold text-[11px] text-slate-600">Witness 1 (Name & Aadhaar)</p>
                  </div>
                  <div className="border-t border-dashed border-slate-300 pt-2 text-center">
                    <p className="font-semibold text-[11px] text-slate-600">Witness 2 (Name & Aadhaar)</p>
                  </div>
                </div>

                {/* Footer Verification Bar */}
                <div className="footer-note mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Generated via KanoonMitra AI</span>
                  <span>Verification Hash: {docHash}</span>
                  <span>Legal Enforceability: ICA 1872</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
