import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Check, ChevronRight, Shield, Info, HelpCircle } from 'lucide-react';

export default function DocumentWizard({ template, onBack, onGenerate, isGenerating }) {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    template.fields.forEach(f => {
      initial[f.id] = f.default || '';
    });
    return initial;
  });

  const [customInstructions, setCustomInstructions] = useState('');
  const [activeStep, setActiveStep] = useState(1);

  const step1Fields = template.fields.slice(0, Math.ceil(template.fields.length / 2));
  const step2Fields = template.fields.slice(Math.ceil(template.fields.length / 2));

  const handleChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (activeStep === 1) setActiveStep(2);
  };

  const handlePrevious = () => {
    if (activeStep === 2) setActiveStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(template.id, formData, customInstructions);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Templates</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <span>Statutory Act:</span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
            {template.actReference}
          </span>
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-50/60 via-white to-blue-50/60 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Step-by-Step Guided Intake
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {template.name}
              </h1>
              <p className="text-xs font-bold text-amber-700 mt-1">
                🇮🇳 {template.hindiName}
              </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
              <div className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-xl ${
                activeStep === 1 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'
              }`}>
                <span>1</span>
                <span>Parties</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <div className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-xl ${
                activeStep === 2 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'
              }`}>
                <span>2</span>
                <span>Terms & AI Rules</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          
          {/* STEP 1: Parties & Identity */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 text-slate-800 text-sm font-bold">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>Parties & Contact Information (पक्षकारों का विवरण)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {step1Fields.map(field => (
                  <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      {field.label}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formData[field.id]}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-2xs"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={formData[field.id]}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-2xs"
                      >
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.id]}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-2xs"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all"
                >
                  <span>Continue to Terms & Conditions</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Commercial Terms, Clauses & AI Instructions */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 text-slate-800 text-sm font-bold">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Financial Terms, Dates & State Jurisdiction (शर्तें एवं अधिकार क्षेत्र)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {step2Fields.map(field => (
                  <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      {field.label}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formData[field.id]}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-2xs"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={formData[field.id]}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-2xs"
                      >
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.id]}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-2xs"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Special AI Instructions Box */}
              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 shadow-xs">
                <label className="flex items-center space-x-2 text-xs font-bold text-indigo-900 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Special Instructions / Custom Rules (वैकल्पिक विशेष निर्देश)</span>
                </label>
                <textarea
                  rows={2}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Include 10% rent escalation after 11 months; Add AC servicing responsibility for tenant..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  💡 Gemini AI will convert your instructions into legally enforceable clauses under Indian Law.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors"
                >
                  Back to Parties
                </button>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-xs font-extrabold flex items-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all transform hover:scale-[1.02] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isGenerating ? 'Drafting Dual Agreement...' : 'Generate Legal Draft & Saral Summary'}</span>
                </button>
              </div>
            </div>
          )}

        </form>
      </div>

    </div>
  );
}
