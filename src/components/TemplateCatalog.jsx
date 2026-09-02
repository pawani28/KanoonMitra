import React, { useState } from 'react';
import { DOCUMENT_TEMPLATES } from '../constants/templates';
import { 
  Home, 
  Briefcase, 
  ShieldCheck, 
  UserCheck, 
  Coins, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Eye, 
  X,
  Scale,
  Sparkles
} from 'lucide-react';

const iconMap = {
  Home,
  Briefcase,
  ShieldCheck,
  UserCheck,
  Coins,
  AlertTriangle
};

const CATEGORIES = [
  'All Templates',
  'Real Estate / Property',
  'Business & Freelancing',
  'Corporate & Startups',
  'Human Resources',
  'Finance & Lending'
];

export default function TemplateCatalog({ onSelectTemplate }) {
  const [selectedCategory, setSelectedCategory] = useState('All Templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const filteredTemplates = DOCUMENT_TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === 'All Templates' || tmpl.category === selectedCategory;
    const matchesSearch = 
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.actReference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center space-x-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Indian Legal Catalog</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Choose a Legal Agreement Template
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compliant with Indian statutory codes, state stamp laws, and instant Saral Hindi translation.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, acts, Hindi..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tmpl) => {
            const IconComp = iconMap[tmpl.icon] || Briefcase;

            return (
              <div
                key={tmpl.id}
                className="group bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-indigo-300 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0 shadow-xs">
                      <IconComp className="w-6 h-6" />
                    </div>

                    {tmpl.badge && (
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border max-w-[170px] truncate ${
                        tmpl.popular 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      }`}>
                        {tmpl.badge}
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                    {tmpl.category}
                  </span>

                  {/* English Name */}
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-1.5">
                    {tmpl.name}
                  </h3>

                  {/* Hindi Name */}
                  <p className="text-xs font-bold text-amber-700 mb-3 flex items-center space-x-1.5">
                    <span>🇮🇳</span>
                    <span>{tmpl.hindiName}</span>
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {tmpl.description}
                  </p>

                  {/* Act Reference Chip */}
                  <div className="mb-4 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{tmpl.actReference}</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(tmpl);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Quick Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTemplate(tmpl)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all transform group-hover:scale-105"
                  >
                    <span>Draft Now</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl shadow-xs">
          <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-900">No Templates Found</h4>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for "Rent", "NDA", "Freelancer" or select "All Templates".
          </p>
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{previewTemplate.name}</h3>
              </div>
              <button onClick={() => setPreviewTemplate(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <p><strong>🇮🇳 Hindi Name:</strong> {previewTemplate.hindiName}</p>
              <p><strong>🏛️ Governing Act:</strong> {previewTemplate.actReference}</p>
              <p><strong>📝 What it Covers:</strong> {previewTemplate.description}</p>
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 font-medium">
                ✅ Includes standard clause toggles: Consideration fees, dispute arbitration in India, and termination grace periods.
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const tmpl = previewTemplate;
                  setPreviewTemplate(null);
                  onSelectTemplate(tmpl);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
              >
                Proceed to Drafting Wizard →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
