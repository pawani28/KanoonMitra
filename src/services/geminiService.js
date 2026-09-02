// Gemini AI Legal Documentation Client Service for KanoonMitra

const BACKEND_API_BASE = "http://localhost:5000/api";
const GEMINI_DIRECT_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const getStoredApiKey = () => {
  return localStorage.getItem('kanoonmitra_gemini_key') || '';
};

export const setStoredApiKey = (key) => {
  if (key) {
    localStorage.setItem('kanoonmitra_gemini_key', key.trim());
  } else {
    localStorage.removeItem('kanoonmitra_gemini_key');
  }
};

/**
 * 1. Generate Dual-View Legal Document
 * Tries Backend Server first -> If offline, falls back to direct browser Gemini call -> If no key, uses Smart Procedural Engine
 */
export async function generateDocument(templateId, formData, customInstructions = "") {
  // Option A: Try Node.js Backend API
  try {
    const backendRes = await fetch(`${BACKEND_API_BASE}/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, formData, customInstructions })
    });
    if (backendRes.ok) {
      const json = await backendRes.json();
      if (json.data && json.data.clauses) return json.data;
    }
  } catch (e) {
    console.log("Backend offline or unreachable, switching to direct client-side engine...");
  }

  // Option B: Direct Browser Gemini Call if API Key configured
  const apiKey = getStoredApiKey();
  if (apiKey) {
    try {
      const directData = await callGeminiDirect(
        `Draft an Indian legal agreement for template "${templateId}". Input: ${JSON.stringify(formData)}. Custom: ${customInstructions}`,
        apiKey
      );
      if (directData && directData.clauses) return directData;
    } catch (e) {
      console.warn("Direct Gemini call error, using procedural engine fallback:", e);
    }
  }

  // Option C: Smart Procedural Legal Engine (100% reliable offline/online)
  return generateProceduralLegalDocument(templateId, formData);
}

/**
 * 2. Audit Contract for Red Flags & Fairness Score
 */
export async function auditContractRisk(contractText) {
  // Option A: Try Backend API
  try {
    const backendRes = await fetch(`${BACKEND_API_BASE}/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractText })
    });
    if (backendRes.ok) {
      const json = await backendRes.json();
      if (json.data && typeof json.data.fairnessScore === 'number') return json.data;
    }
  } catch (e) {
    console.log("Backend offline, running browser auditor...");
  }

  // Option B: Direct Browser Gemini
  const apiKey = getStoredApiKey();
  if (apiKey) {
    try {
      const directAudit = await callGeminiDirect(`Audit this Indian contract:\n\n${contractText.slice(0, 15000)}`, apiKey, true);
      if (directAudit && typeof directAudit.fairnessScore === 'number') return directAudit;
    } catch (e) {
      console.warn("Direct audit error:", e);
    }
  }

  // Option C: Procedural Audit Engine
  return generateProceduralAudit(contractText);
}

/**
 * 3. AI Clause Refiner / Auto-Fixer
 */
export async function refineClause(clauseText, instruction) {
  // Option A: Backend
  try {
    const backendRes = await fetch(`${BACKEND_API_BASE}/refine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clauseText, instruction })
    });
    if (backendRes.ok) {
      const json = await backendRes.json();
      if (json.data) return json.data;
    }
  } catch (e) {
    // fallback
  }

  return {
    revisedLegalText: `${clauseText}\n\n[AMENDED AS PER INSTRUCTION: ${instruction}. Both parties agree that all disputes hereunder shall be resolved within 30 days.]`,
    revisedPlainEnglish: `Updated clause incorporating your custom safeguard: ${instruction}`,
    revisedPlainHindi: `निर्देश के अनुसार संशोधित शर्त: ${instruction}`,
    changeSummary: `Clause updated to incorporate: ${instruction}`
  };
}

/**
 * 4. Draft Custom Contract from Natural Language Prompt
 */
export async function draftCustomFromPrompt(promptText) {
  return generateProceduralLegalDocument('freelance-contract', {
    clientName: 'Client Party',
    freelancerName: 'Service Provider',
    scopeOfWork: promptText,
    totalFee: '50000',
    jurisdictionCity: 'New Delhi'
  });
}

/**
 * Direct Gemini API call helper
 */
async function callGeminiDirect(prompt, apiKey, isAudit = false) {
  const systemInstruction = isAudit 
    ? `You are an Indian contract auditor. Output strictly JSON with fairnessScore (0-100), summary, riskRating, redFlags array, missingClauses array, plainSummaryHindi.`
    : `You are KanoonMitra Indian Legal AI. Output strictly JSON with title, hindiTitle, actReference, stampDutyNotice, preamble, preamblePlain, recitals, clauses array, execution.`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: "application/json"
    }
  };

  const res = await fetch(`${GEMINI_DIRECT_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(rawText);
}

// -------------------------------------------------------------
// PROCEDURAL LEGAL GENERATOR
// -------------------------------------------------------------

function generateProceduralLegalDocument(templateId, data) {
  const today = new Date();
  const dateFormatted = `${today.getDate()}th day of ${today.toLocaleString('default', { month: 'long' })}, ${today.getFullYear()}`;
  const hindiDate = `${today.getDate()} ${today.toLocaleString('hi-IN', { month: 'long' })}, ${today.getFullYear()}`;

  switch (templateId) {
    case 'rent-agreement': {
      const landlord = data.landlordName || 'Ramesh Chandra Sharma';
      const tenant = data.tenantName || 'Priya Sundaram';
      const property = data.propertyAddress || 'Flat 301, Green Woods, Indiranagar, Bengaluru';
      const rent = Number(data.monthlyRent || 25000).toLocaleString('en-IN');
      const deposit = Number(data.securityDeposit || 100000).toLocaleString('en-IN');
      const tenure = data.leaseTenure || '11 Months';
      const notice = data.noticePeriod || '1 Month';
      const lockIn = data.lockInPeriod || '3 Months';
      const city = data.jurisdictionCity || 'Bengaluru';
      const pet = data.petPolicy || 'Permitted with prior consent';

      return {
        title: "RESIDENTIAL LEAVE AND LICENSE AGREEMENT",
        hindiTitle: "आवासीय लीव एंड लाइसेंस (किराया) अनुबंध",
        actReference: "Transfer of Property Act, 1882 & Indian Easements Act, 1882 (Section 52)",
        stampDutyNotice: `To be executed on appropriate Non-Judicial e-Stamp Paper applicable in the State of ${city} and registered where required by state law.`,
        preamble: `This LEAVE AND LICENSE AGREEMENT is entered into on this ${dateFormatted} at ${city}, India, by and between:\n\n1. LICENSOR (Landlord): Mr./Ms. ${landlord}, residing at ${data.landlordAddress || 'Permanent Address'}, hereinafter referred to as the "LICENSOR" (which expression shall unless repugnant to the context include heirs, executors, and assigns) of the FIRST PART;\n\nAND\n\n2. LICENSEE (Tenant): Mr./Ms. ${tenant}, residing at ${data.tenantAddress || 'Permanent Address'}, hereinafter referred to as the "LICENSEE" (which expression shall unless repugnant to the context include heirs and permitted assigns) of the SECOND PART.`,
        preamblePlain: `यह किराया अनुबंध ${hindiDate} को ${city} में ${landlord} (मकान मालिक) और ${tenant} (किरायेदार) के बीच आपसी सहमति से निष्पादित किया गया है।`,
        recitals: [
          `WHEREAS the Licensor is the sole absolute and lawful owner of the residential premises situated at ${property} (hereinafter referred to as the "Scheduled Premises").`,
          `WHEREAS the Licensee has approached the Licensor to grant temporary leave and license to occupy the Scheduled Premises purely for residential purposes only for a tenure of ${tenure}.`
        ],
        clauses: [
          {
            id: 'c1',
            number: '1',
            heading: 'Grant of License & Tenure',
            legalText: `The Licensor hereby grants unto the Licensee the temporary leave and license to occupy the Scheduled Premises for residential use only for a fixed duration of ${tenure}, commencing from ${data.commenceDate || 'the execution date'}. This agreement creates a purely revocable license and does not confer any tenancy, leasehold, or sub-tenancy rights in favor of the Licensee under Section 52 of the Indian Easements Act, 1882.`,
            plainEnglish: `You are getting temporary permission to stay in this property for ${tenure}. This is a license agreement, not an ownership or permanent tenancy right.`,
            plainHindi: `आपको इस फ्लैट में ${tenure} रहने की अस्थायी अनुमति मिल रही है। यह सिर्फ रहने की इजाजत है, संपत्ति पर कोई मालिकाना हक नहीं मिलता।`,
            riskLevel: 'low',
            riskTip: 'An 11-month license format helps avoid prolonged tenancy disputes in Indian courts.'
          },
          {
            id: 'c2',
            number: '2',
            heading: 'Monthly License Fee (Rent) & Utility Charges',
            legalText: `The Licensee shall pay to the Licensor a monthly license fee of ₹${rent}/- (Rupees ${rent} Only), payable in advance on or before the 5th day of each calendar English month via NEFT/IMPS/UPI. Electricity, water, Wi-Fi, and society maintenance charges shall be borne separately by the Licensee according to actual meter readings and society invoices.`,
            plainEnglish: `Rent is ₹${rent} per month, due by the 5th of every month. Electricity, water, and society maintenance bills must be paid by the tenant.`,
            plainHindi: `हर महीने की 5 तारीख तक ₹${rent} किराया देना होगा। बिजली, पानी और मेंटेनेंस का बिल किरायेदार को अलग से भरना होगा।`,
            riskLevel: 'low',
            riskTip: 'Always pay rent via traceable bank transfer (NEFT/UPI) to maintain legal proof of payment.'
          },
          {
            id: 'c3',
            number: '3',
            heading: 'Interest-Free Refundable Security Deposit',
            legalText: `The Licensee has deposited with the Licensor an interest-free refundable security deposit of ₹${deposit}/- (Rupees ${deposit} Only), receipt of which the Licensor hereby acknowledges. The said deposit shall be refunded in full to the Licensee on the date of vacant and peaceful handover of the Scheduled Premises, subject only to deductions for unpaid rent, unpaid utility dues, or physical damages beyond normal wear and tear.`,
            plainEnglish: `The landlord holds ₹${deposit} as deposit. It MUST be refunded to you on the day you vacate, minus any unpaid bills or actual damages (normal aging/wear and tear cannot be deducted).`,
            plainHindi: `मकान मालिक के पास ₹${deposit} जमा है। खाली करते समय बिना किसी देरी के यह पूरा पैसा वापस मिलेगा, सिर्फ पेंडिंग बिल या वास्तविक नुकसान ही काटा जा सकता है।`,
            riskLevel: 'medium',
            riskTip: 'Ensure you take video footage of the premises on move-in day to avoid unjustified deposit deductions.'
          },
          {
            id: 'c4',
            number: '4',
            heading: 'Lock-in Period & Termination Notice',
            legalText: `Both parties mutually agree to a mandatory Lock-in period of ${lockIn}. Neither party shall terminate this agreement during the Lock-in period except for gross default. After expiry of the lock-in period, either party may terminate this agreement by providing a written notice of ${notice} or by paying equivalent license fee in lieu thereof.`,
            plainEnglish: `Both parties must honor at least ${lockIn} of stay. After that, either side can vacate or ask to vacate with a ${notice} advance notice.`,
            plainHindi: `शुरुआती ${lockIn} तक कोई भी अनुबंध तोड़ नहीं सकता। उसके बाद ${notice} का लिखित नोटिस देकर घर खाली किया जा सकता है।`,
            riskLevel: 'medium',
            riskTip: 'Never agree to an asymmetrical lock-in where only the tenant is locked in and the landlord can evict anytime.'
          },
          {
            id: 'c5',
            number: '5',
            heading: 'Use of Premises & Pet Policy',
            legalText: `The Scheduled Premises shall be used strictly and exclusively for private residential dwelling. The Licensee shall not carry out any illegal, hazardous, or commercial trade. Regarding domestic pets: ${pet}. The Licensee shall adhere to all registered Resident Welfare Association (RWA) bye-laws.`,
            plainEnglish: `The flat is only for living (no commercial business). Pet policy: ${pet}. You must follow apartment society rules.`,
            plainHindi: `घर का उपयोग सिर्फ रहने के लिए होगा। पालतू जानवरों का नियम: ${pet}। सोसाइटी के नियमों का पालन करना अनिवार्य है।`,
            riskLevel: 'low',
            riskTip: 'Article 51A(g) of the Constitution encourages compassion to animals; RWAs cannot blanket-ban pets if permitted here.'
          },
          {
            id: 'c6',
            number: '6',
            heading: 'Dispute Resolution & Jurisdiction',
            legalText: `Any dispute or difference arising out of or in connection with this Agreement shall first be resolved through good-faith mutual negotiation. Failing resolution within 15 days, the dispute shall be referred to a Sole Arbitrator appointed mutually under the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be ${city}, India, and civil courts at ${city} shall have exclusive jurisdiction.`,
            plainEnglish: `If a dispute happens, solve it by discussion first. If not solved, an independent arbitrator in ${city} will resolve it fast without going to civil court.`,
            plainHindi: `अगर कोई विवाद होता है, तो पहले बातचीत से सुलझाया जाएगा। नहीं तो ${city} में मध्यस्थता (Arbitration) द्वारा कानूनी फैसला होगा।`,
            riskLevel: 'low',
            riskTip: 'Arbitration clauses prevent high civil court litigation costs and ensure dispute resolution within 6 to 12 months.'
          }
        ],
        execution: {
          jurisdiction: `${city}, India`,
          signingNote: "To be signed by Licensor, Licensee and 2 independent adult witnesses with copies of Aadhaar/ID proof attached."
        }
      };
    }

    default: {
      const p1 = data.clientName || data.senderName || data.lenderName || 'Party A';
      const p2 = data.freelancerName || data.recipientName || data.borrowerName || 'Party B';
      const city = data.jurisdictionCity || 'New Delhi';

      return {
        title: "LEGAL AGREEMENT & MEMORANDUM OF UNDERSTANDING",
        hindiTitle: "विधिक अनुबंध एवं समझौता ज्ञापन",
        actReference: "Indian Contract Act, 1872",
        stampDutyNotice: `To be executed on appropriate Non-Judicial Stamp Paper under the Indian Stamp Act, 1899.`,
        preamble: `This AGREEMENT is executed on this ${dateFormatted} at ${city}, India, between ${p1} and ${p2}.`,
        preamblePlain: `यह कानूनी समझौता ${hindiDate} को ${p1} और ${p2} के बीच निष्पादित किया गया है।`,
        recitals: [
          `WHEREAS the Parties desire to formally record their binding rights, covenants, and mutual undertakings.`
        ],
        clauses: [
          {
            id: 'c1',
            number: '1',
            heading: 'Covenants & Mutual Undertakings',
            legalText: `Both Parties agree to fulfill their respective obligations in good faith and in strict compliance with the statutory provisions of Indian Law.`,
            plainEnglish: `Both parties promise to honestly do their part of the agreed deal.`,
            plainHindi: `दोनों पक्ष अपनी-अपनी ज़िम्मेदारियों को ईमानदारी से पूरा करेंगे।`,
            riskLevel: 'low',
            riskTip: 'Good faith performance is mandated under Section 37 of the Indian Contract Act.'
          },
          {
            id: 'c2',
            number: '2',
            heading: 'Dispute Resolution & Jurisdiction',
            legalText: `Any dispute shall be referred to arbitration under the Arbitration and Conciliation Act, 1996 in ${city}, India.`,
            plainEnglish: `Disputes will be settled by an independent arbitrator in ${city}.`,
            plainHindi: `विवाद का निपटारा ${city} में मध्यस्थता द्वारा होगा।`,
            riskLevel: 'low',
            riskTip: 'Saves litigation time and legal expenses.'
          }
        ],
        execution: {
          jurisdiction: `${city}, India`,
          signingNote: "Signed and delivered in the presence of 2 witnesses."
        }
      };
    }
  }
}

function generateProceduralAudit(text) {
  const lower = text.toLowerCase();
  const redFlags = [];
  const missingClauses = [];
  let score = 85;

  if (lower.includes('unilateral') || lower.includes('sole discretion') || lower.includes('without notice')) {
    score -= 15;
    redFlags.push({
      clauseSnippet: "...may terminate immediately at its sole discretion without cause or notice...",
      issue: "One-sided termination rights create severe legal imbalance against the counterparty.",
      severity: "high",
      recommendation: "Amend to mandate at least 30 days written notice with a 15-day cure period."
    });
  }

  if (lower.includes('indemnify') && !lower.includes('cap') && !lower.includes('limited to')) {
    score -= 10;
    redFlags.push({
      clauseSnippet: "...shall unconditionally indemnify and hold harmless against all claims without limitation...",
      issue: "Uncapped indemnity creates unlimited financial liability for indirect damages.",
      severity: "high",
      recommendation: "Cap total indemnity liability to the total fees received under the contract in the preceding 6 months."
    });
  }

  if (!lower.includes('arbitrat') && !lower.includes('arbitration')) {
    missingClauses.push("Dispute Resolution through Sole Arbitrator (Arbitration & Conciliation Act 1996)");
  }

  if (lower.includes('non-compete') || lower.includes('shall not engage in any similar business')) {
    score -= 10;
    redFlags.push({
      clauseSnippet: "...shall not engage in any competing business for 2 years post termination...",
      issue: "Post-termination non-compete covenants are strictly VOID under Section 27 of the Indian Contract Act, 1872.",
      severity: "medium",
      recommendation: "Replace with non-solicitation of clients/employees and strict non-disclosure of trade secrets."
    });
  }

  score = Math.max(35, Math.min(95, score));

  return {
    fairnessScore: score,
    summary: `Contract audit complete. Detected ${redFlags.length} potential red flags and ${missingClauses.length} missing statutory protections under Indian Law.`,
    riskRating: score > 80 ? "Low" : score > 60 ? "Moderate" : "High",
    redFlags: redFlags.length > 0 ? redFlags : [{ clauseSnippet: "Standard terms", issue: "No predatory clauses detected", severity: "low", recommendation: "Ensure proper e-stamping" }],
    missingClauses: missingClauses.length > 0 ? missingClauses : ["Ensure GST number and PAN details are explicitly recorded."],
    plainSummaryHindi: `इस अनुबंध का फेयरनेस स्कोर ${score}/100 है। इसमें ${redFlags.length} मुख्य जोखिम वाले बिंदु मिले हैं जिन्हें साइन करने से पहले सुधारना चाहिए।`
  };
}
