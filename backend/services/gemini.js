import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Call Gemini API with structured JSON output
 */
async function callGemini(prompt, systemInstruction = "") {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null; // Triggers fallback to deterministic legal engine
  }

  try {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: "application/json"
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini API Status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(rawText);
  } catch (error) {
    console.error("Backend Gemini Call Error:", error.message);
    return null;
  }
}

/**
 * Generate Dual-Pane Legal Document via Gemini AI
 */
export async function draftLegalDocument(templateId, formData, customInstructions = "") {
  const systemPrompt = `You are KanoonMitra (कानून मित्र), an expert Indian Senior Advocate & Legal AI Architect.
Your role is to draft legally enforceable, comprehensive agreements under Indian Law (Indian Contract Act 1872, Transfer of Property Act 1882, IT Act 2000, MSMED Act 2006).
Output strictly valid JSON matching this schema:
{
  "title": "Full Formal Document Title",
  "hindiTitle": "हिन्दी शीर्षक",
  "actReference": "Statutory Act Governing this document (e.g. Indian Contract Act 1872 / Transfer of Property Act 1882)",
  "stampDutyNotice": "State stamping and execution recommendation",
  "preamble": "This AGREEMENT is executed on this [Day] day of [Month], [Year] by and between...",
  "preamblePlain": "यह अनुबंध [तारीख] को [पक्ष 1] और [पक्ष 2] के बीच सहमति से किया गया है।",
  "recitals": ["WHEREAS clause 1", "WHEREAS clause 2"],
  "clauses": [
    {
      "id": "c1",
      "number": "1",
      "heading": "Clause Heading",
      "legalText": "Formal court-enforceable legal text in English...",
      "plainEnglish": "Simple 5th-grade explanation of what this clause means and what rights it gives.",
      "plainHindi": "सरल हिन्दी में इस शर्त का स्पष्ट मतलब और आपकी ज़िम्मेदारी।",
      "riskLevel": "low" | "medium" | "high",
      "riskTip": "Pro-tip or safeguard for signers regarding Indian law."
    }
  ],
  "execution": {
    "jurisdiction": "Governing court and arbitration city in India",
    "signingNote": "Instructions on witness signing, e-stamping, and notary."
  }
}`;

  const userPrompt = `Draft an Indian legal agreement for template "${templateId}".
Input Parameters: ${JSON.stringify(formData, null, 2)}
Additional Instructions: ${customInstructions || "Standard balanced fair terms under Indian Law"}.
Include at least 6-8 comprehensive clauses covering core obligations, payment/consideration, termination notice, default remedies, IP/property rights, confidentiality, and arbitration under the Arbitration & Conciliation Act 1996.`;

  const aiResult = await callGemini(userPrompt, systemPrompt);
  return aiResult;
}

/**
 * Audit Contract Risk & Red Flags
 */
export async function auditContractRisk(contractText) {
  const systemPrompt = `You are a Chief Legal Auditor for Indian contracts.
Analyze the provided contract and output strictly valid JSON:
{
  "fairnessScore": 75,
  "summary": "Brief 2-line executive summary of the contract",
  "riskRating": "Low" | "Moderate" | "High" | "Critical",
  "redFlags": [
    {
      "clauseSnippet": "Snippet of problematic text",
      "issue": "Why this is dangerous or unfair under Indian Law (e.g. Section 27 ICA 1872 void non-compete, unilateral cancellation, uncapped indemnity)",
      "severity": "high" | "medium" | "low",
      "recommendation": "Suggested amendment to protect the party"
    }
  ],
  "missingClauses": [
    "List of essential protective clauses missing (e.g. MSMED statutory interest under Section 16, limitation of liability, notice cure period)"
  ],
  "plainSummaryHindi": "सरल हिन्दी में इस अनुबंध का पूरा सार और मुख्य जोखिम।"
}`;

  const aiResult = await callGemini(`Audit this Indian contract:\n\n${contractText.slice(0, 15000)}`, systemPrompt);
  return aiResult;
}

/**
 * AI Clause Refiner / Auto-Fixer
 */
export async function refineClause(clauseText, instruction) {
  const prompt = `Rewrite this Indian contract clause based on the instruction.
Current Clause: "${clauseText}"
Instruction: "${instruction}"
Output strictly JSON:
{
  "revisedLegalText": "Formal revised court-enforceable text...",
  "revisedPlainEnglish": "Simplified plain English explainer...",
  "revisedPlainHindi": "सरल हिन्दी अनुवाद...",
  "changeSummary": "What was improved"
}`;

  return await callGemini(prompt, "You are an Indian contract drafting expert.");
}
