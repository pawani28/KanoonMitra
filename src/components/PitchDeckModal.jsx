import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Scale, Sparkles, Shield, Cpu, Users, Lock, CheckCircle2 } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "1. The Problem: The Indian Legal Divide",
    subtitle: "Why 90%+ Individuals & MSMEs sign contracts blindly",
    badge: "Hackathon Challenge Context",
    icon: Scale,
    content: (
      <div className="space-y-4 text-xs sm:text-sm text-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
            <span className="text-2xl font-extrabold text-rose-700 block">₹5,000+</span>
            <span className="text-[11px] text-slate-600 font-medium">Average lawyer fee for basic agreement drafting</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-2xl font-extrabold text-amber-800 block">Legalese</span>
            <span className="text-[11px] text-slate-600 font-medium">Complex archaic terms incomprehensible to non-lawyers</span>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
            <span className="text-2xl font-extrabold text-indigo-700 block">6.3 Crore</span>
            <span className="text-[11px] text-slate-600 font-medium">Indian MSMEs operating with informal / zero written contracts</span>
          </div>
        </div>
        <p className="leading-relaxed">
          Individuals, tenants, freelancers, and small business owners frequently fall prey to unfair terms (e.g. unlawful forfeiture of security deposits, unilateral contract cancellations, and uncapped indemnities) simply because they cannot understand what they are signing.
        </p>
      </div>
    )
  },
  {
    id: 2,
    title: "2. The Solution: KanoonMitra (कानून मित्र)",
    subtitle: "AI-Powered Legal Documentation Assistant for Bharat",
    badge: "Core Innovation",
    icon: Sparkles,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-slate-700">
        <p className="font-bold text-slate-900">
          KanoonMitra democratizes legal access through 4 key breakthroughs:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h5 className="font-bold text-indigo-700 text-xs">✨ Dual-Pane Generation</h5>
            <p className="text-[11px] text-slate-600">Generates both court-enforceable text AND 5th-grade plain English & Saral Hindi summaries side-by-side.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h5 className="font-bold text-blue-700 text-xs">🏛️ Indian Law Grounded</h5>
            <p className="text-[11px] text-slate-600">Trained and grounded on Indian Contract Act 1872, Transfer of Property Act 1882, IT Act 2000, MSMED Act 2006.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h5 className="font-bold text-rose-700 text-xs">🛡️ AI Red-Flag & Fairness Audit</h5>
            <p className="text-[11px] text-slate-600">Instant scan of any contract to calculate Fairness Score (0-100) and highlight predatory clauses.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h5 className="font-bold text-emerald-700 text-xs">📊 State Stamp Duty Calculator</h5>
            <p className="text-[11px] text-slate-600">Calculates exact e-Stamping requirements for Maharashtra, Delhi, Karnataka, UP, and Tamil Nadu.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "3. Technical Architecture & Data Flow",
    subtitle: "Scalable, High-Performance, Privacy-First Design",
    badge: "System Architecture",
    icon: Cpu,
    content: (
      <div className="space-y-3 text-xs text-slate-700">
        <div className="p-4 rounded-2xl bg-slate-50 border border-indigo-200 space-y-2 font-mono text-[11px]">
          <div className="flex items-center space-x-2 text-indigo-700 font-bold">
            <span>[Client Layer]</span>
            <span>React + Tailwind CSS + Lucide + Print Engine</span>
          </div>
          <div className="pl-4 text-slate-500">↓ Structured JSON State & Intake Wizard</div>
          <div className="flex items-center space-x-2 text-amber-700 font-bold">
            <span>[AI Reasoning Layer]</span>
            <span>Google Gemini 1.5 Flash / 2.0 with Structured JSON Output</span>
          </div>
          <div className="pl-4 text-slate-500">↓ Indian Acts Grounding + State Stamp Rules Engine</div>
          <div className="flex items-center space-x-2 text-emerald-700 font-bold">
            <span>[Output Engine]</span>
            <span>Printable A4 Sheet + Cryptographic Hash + e-Sign + Lawyer Escalation</span>
          </div>
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          <strong>Data Requirements:</strong> Uses publicly available statutes (India Code), Supreme Court case law benchmarks, and state-specific stamp duty notifications.
        </p>
      </div>
    )
  },
  {
    id: 4,
    title: "4. Social & Economic Impact on India",
    subtitle: "Accelerating Ease of Doing Business & Access to Justice",
    badge: "Bharat Impact",
    icon: Users,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <h5 className="font-bold text-emerald-800">💰 Economic Savings</h5>
            <p className="text-[11px] text-slate-600 mt-1">Saves millions of rupees annually for bootstrapped startups and individual freelancers on standard documentation.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
            <h5 className="font-bold text-indigo-800">⚖️ Court Congestion Relief</h5>
            <p className="text-[11px] text-slate-600 mt-1">Clear drafting with mandatory Sole Arbitrator clauses resolves disputes privately, reducing court backlogs.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <h5 className="font-bold text-amber-900">🗣️ Vernacular Inclusivity</h5>
            <p className="text-[11px] text-slate-600 mt-1">Saral Hindi summaries empower non-English speaking landlords, shopkeepers, and workers across Tier-2/Tier-3 India.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
            <h5 className="font-bold text-blue-800">🛡️ MSME Protection</h5>
            <p className="text-[11px] text-slate-600 mt-1">Enforces statutory 45-day payment protections under Section 15 & 16 of the MSMED Act 2006.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "5. Ethics, Privacy & DPDP Act 2023",
    subtitle: "Responsible AI & Indian Data Protection Compliance",
    badge: "Trust & Ethics",
    icon: Lock,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-slate-700">
        <div className="space-y-2.5">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p><strong className="text-slate-900">Zero Data Retention on Server:</strong> Document drafting executes in stateless sessions without storing confidential business trade secrets.</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p><strong className="text-slate-900">DPDP Act 2023 Aligned:</strong> Respects user privacy and masks Aadhaar identification numbers by default.</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p><strong className="text-slate-900">Transparent AI Disclaimer & Lawyer Escalation:</strong> Clearly informs users of AI boundaries and provides 1-click access to verified Advocates for complex litigation.</p>
          </div>
        </div>
      </div>
    )
  }
];

export default function PitchDeckModal({ isOpen, onClose }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!isOpen) return null;

  const currentSlide = SLIDES[currentSlideIndex];
  const IconComp = currentSlide.icon;

  const handlePrev = () => {
    if (currentSlideIndex > 0) setCurrentSlideIndex(currentSlideIndex - 1);
  };

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) setCurrentSlideIndex(currentSlideIndex + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentSlideIndex + 1}/{SLIDES.length}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                Hackathon Presentation Deck
              </span>
              <h3 className="text-sm font-extrabold text-slate-900">
                KanoonMitra (कानून मित्र)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {currentSlide.badge}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Slide {currentSlide.id} of {SLIDES.length}</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {currentSlide.title}
            </h2>
            <p className="text-xs font-bold text-amber-800 mt-1">
              {currentSlide.subtitle}
            </p>
          </div>

          <div className="pt-2">
            {currentSlide.content}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Dots */}
          <div className="flex items-center space-x-1.5">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlideIndex === idx ? 'bg-indigo-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlideIndex === SLIDES.length - 1}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
