import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Star, Calendar, MessageSquare, CheckCircle2, Award } from 'lucide-react';

const LAWYERS = [
  {
    id: 'l1',
    name: 'Adv. Rajeshwari Iyer',
    barCouncil: 'BCI/D/1492/2012 (Delhi High Court)',
    specialty: 'Real Estate, Tenancy & Property Contracts',
    rating: '4.9',
    reviews: 142,
    fee: '₹499 / 15-min consultation',
    experience: '14+ Years',
    availableToday: true
  },
  {
    id: 'l2',
    name: 'Adv. Siddharth Deshmukh',
    barCouncil: 'MAH/5829/2015 (Bombay High Court)',
    specialty: 'Startups, NDAs & Freelancer IP Agreements',
    rating: '5.0',
    reviews: 210,
    fee: '₹599 / 15-min consultation',
    experience: '11+ Years',
    availableToday: true
  },
  {
    id: 'l3',
    name: 'Adv. Arvind K. Swamy',
    barCouncil: 'KAR/2311/2010 (Karnataka High Court)',
    specialty: 'Commercial Contracts & MSMED Dispute Resolution',
    rating: '4.8',
    reviews: 98,
    fee: '₹499 / 15-min consultation',
    experience: '16+ Years',
    availableToday: false
  }
];

export default function LawyerConnectModal({ isOpen, onClose, docHash }) {
  const [selectedLawyer, setSelectedLawyer] = useState(LAWYERS[0]);
  const [userNote, setUserNote] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleBook = () => {
    setBookingConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Seek Legal Advice from Verified Advocate
              </h3>
              <p className="text-xs text-slate-500">
                Bar Council of India Verified Advocates for 1-on-1 Contract Audit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {bookingConfirmed ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">
                Consultation Request Submitted!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your draft document (Ref: <span className="font-mono text-indigo-600 font-bold">{docHash || 'KM-IN-2026-DOC'}</span>) has been forwarded securely to <strong>{selectedLawyer.name}</strong>. You will receive a WhatsApp & Email confirmation with the video link.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
              >
                Close Window
              </button>
            </div>
          ) : (
            <>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-500 font-medium">Attaching Document:</span>
                <span className="font-mono text-indigo-700 font-bold">{docHash || 'Current Draft'}</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Select Legal Expert:
                </label>

                {LAWYERS.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    onClick={() => setSelectedLawyer(lawyer)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedLawyer.id === lawyer.id
                        ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-400/30 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900">{lawyer.name}</h4>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{lawyer.barCouncil}</p>
                        <p className="text-xs text-indigo-700 font-semibold mt-1">{lawyer.specialty}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-amber-800 block font-mono">{lawyer.fee}</span>
                        <div className="flex items-center justify-end space-x-1 text-[11px] text-slate-500 mt-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="font-bold">{lawyer.rating}</span>
                          <span>({lawyer.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Describe specific questions or doubts for the advocate (optional):
                </label>
                <textarea
                  rows={2}
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="e.g. Please verify if the lock-in penalty clause is enforceable under Delhi High Court precedents..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBook}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Confirm Expert Review Booking
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
