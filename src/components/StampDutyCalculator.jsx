import React, { useState } from 'react';
import { STATE_STAMP_DUTIES } from '../constants/stampDuties';
import { Calculator, ExternalLink, ShieldCheck, Info, CheckCircle2, Landmark, Sparkles } from 'lucide-react';

export default function StampDutyCalculator() {
  const [selectedStateName, setSelectedStateName] = useState('National Capital Territory of Delhi');
  const [docType, setDocType] = useState('rent');
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [tenureMonths, setTenureMonths] = useState(11);
  const [deposit, setDeposit] = useState(100000);
  const [contractValue, setContractValue] = useState(100000);

  const selectedState = STATE_STAMP_DUTIES.find(s => s.state === selectedStateName) || STATE_STAMP_DUTIES[0];

  const calculateDuty = () => {
    if (docType === 'rent') {
      const totalRentForTenure = monthlyRent * tenureMonths;
      
      if (selectedStateName.includes('Maharashtra')) {
        const taxable = totalRentForTenure + deposit;
        const duty = Math.max(500, Math.round(taxable * 0.0025));
        return {
          duty: `₹${duty.toLocaleString('en-IN')}`,
          regFee: '₹1,000 (Urban Area)',
          total: `₹${(duty + 1000).toLocaleString('en-IN')}`,
          rule: '0.25% under Article 36A of Maharashtra Stamp Act'
        };
      } else if (selectedStateName.includes('Delhi')) {
        const duty = tenureMonths <= 11 ? '₹100 (Standard E-Stamp)' : `₹${Math.round(totalRentForTenure * 0.02).toLocaleString('en-IN')}`;
        const numDuty = tenureMonths <= 11 ? 100 : Math.round(totalRentForTenure * 0.02);
        return {
          duty: duty,
          regFee: tenureMonths <= 11 ? '₹0 (Notarized)' : '₹1,100',
          total: tenureMonths <= 11 ? '₹100 (e-Stamp) + Notary' : `₹${(numDuty + 1100).toLocaleString('en-IN')}`,
          rule: 'Article 35 Delhi Stamp Rules'
        };
      } else if (selectedStateName.includes('Karnataka')) {
        const duty = Math.max(500, Math.round((monthlyRent * 12) * 0.005));
        return {
          duty: `₹${duty.toLocaleString('en-IN')}`,
          regFee: '₹1,000 flat',
          total: `₹${(duty + 1000).toLocaleString('en-IN')}`,
          rule: '0.5% under Karnataka Stamp Act (Article 30)'
        };
      } else {
        return {
          duty: '₹100 to ₹500',
          regFee: '1% to 2% of total lease value',
          total: 'Approx ₹500 - ₹1,500',
          rule: 'State Specific Stamp Duty Manual'
        };
      }
    } else {
      return {
        duty: selectedState.serviceContractDuty || '₹100 e-Stamp',
        regFee: '₹0 (No registration mandatory)',
        total: selectedState.serviceContractDuty || '₹100',
        rule: 'Article 5(h) / General Agreement Stamp'
      };
    }
  };

  const result = calculateDuty();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Calculator className="w-4 h-4" />
          <span>Interactive Indian E-Stamping Calculator</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          State-Wise Stamp Duty & Registration Guide
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Calculate legal stamp paper fees across Maharashtra, Delhi, Karnataka, UP, and Tamil Nadu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md shadow-slate-200/50 space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Select Indian State / Territory (राज्य)
            </label>
            <select
              value={selectedStateName}
              onChange={(e) => setSelectedStateName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 font-bold"
            >
              {STATE_STAMP_DUTIES.map(s => (
                <option key={s.state} value={s.state}>{s.state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Agreement Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDocType('rent')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all ${
                  docType === 'rent'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🏠 Rent / Lease
              </button>
              <button
                type="button"
                onClick={() => setDocType('contract')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all ${
                  docType === 'contract'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                💼 Service / NDA / Loan
              </button>
            </div>
          </div>

          {docType === 'rent' ? (
            <div className="space-y-4 pt-2">
              
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700">Monthly Rent:</span>
                  <span className="font-extrabold text-emerald-700 font-mono text-sm">₹{monthlyRent.toLocaleString('en-IN')}/mo</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={200000}
                  step={1000}
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700">Security Deposit:</span>
                  <span className="font-extrabold text-amber-700 font-mono text-sm">₹{deposit.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={1000000}
                  step={10000}
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Lease Duration (Tenure)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[11, 24, 36].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenureMonths(m)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        tenureMonths === m
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700">Contract Value:</span>
                  <span className="font-extrabold text-emerald-700 font-mono text-sm">₹{contractValue.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={2000000}
                  step={10000}
                  value={contractValue}
                  onChange={(e) => setContractValue(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          )}

        </div>

        {/* Right: Results Breakdown & Portal (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="bg-gradient-to-br from-indigo-50/70 via-white to-emerald-50/70 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                Official Stamping Estimate for {selectedState.state}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                SHCIL e-Stamp Compatible
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-semibold">Stamp Duty Fee</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 block font-mono">
                  {result.duty}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block font-semibold">Registration Fee</span>
                <span className="text-xl sm:text-2xl font-black text-slate-800 mt-1 block font-mono">
                  {result.regFee}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs">
                <span className="text-xs text-amber-800 block font-bold">Total Estimated Cost</span>
                <span className="text-xl sm:text-2xl font-black text-amber-700 mt-1 block font-mono">
                  {result.total}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-center space-x-2.5 font-medium">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Statutory Legal Rule: <strong>{result.rule}</strong></span>
            </div>
          </div>

          {/* Portal Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md shadow-slate-200/50 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Landmark className="w-4 h-4 text-amber-600" />
              <span>State Government e-Stamping Authority</span>
            </h4>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 font-medium">
              <p>🏛️ <strong>Authorized Department:</strong> {selectedState.portal}</p>
              <p>💡 <strong>State Advisory:</strong> {selectedState.tips}</p>
            </div>

            <div className="flex items-center space-x-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>KanoonMitra documents come formatted with standard stamp paper margins for instant execution.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
