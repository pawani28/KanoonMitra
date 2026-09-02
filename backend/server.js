import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { db } from './database/store.js';
import { draftLegalDocument, auditContractRisk, refineClause } from './services/gemini.js';
import { generateLegalDocumentProcedural, auditContractProcedural } from './services/legalEngine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health & Config Check
app.get('/api/health', (req, res) => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  res.json({
    status: 'ONLINE',
    service: 'KanoonMitra Legal AI Backend',
    version: '1.0.0',
    geminiAiActive: hasGeminiKey,
    timestamp: new Date().toISOString()
  });
});

// 2. Draft Legal Document (Court enforceable + Saral Hindi/English)
app.post('/api/draft', async (req, res) => {
  try {
    const { templateId, formData, customInstructions } = req.body;

    if (!templateId || !formData) {
      return res.status(400).json({ error: 'Missing templateId or formData in request body' });
    }

    console.log(`[DRAFT REQUEST] Template: ${templateId}`);

    // Try Gemini AI first, fallback to procedural engine
    let docData = await draftLegalDocument(templateId, formData, customInstructions);
    if (!docData || !docData.clauses || docData.clauses.length === 0) {
      console.log(`[FALLBACK] Using Procedural Legal Engine for ${templateId}`);
      docData = generateLegalDocumentProcedural(templateId, formData);
    }

    // Save to local DB history
    const saved = db.saveDocument({
      templateId,
      ...docData
    });

    res.json({
      success: true,
      data: saved
    });
  } catch (error) {
    console.error("Draft Error:", error);
    res.status(500).json({ error: 'Failed to draft document', details: error.message });
  }
});

// 3. AI Risk & Predatory Clause Audit
app.post('/api/audit', async (req, res) => {
  try {
    const { contractText } = req.body;

    if (!contractText || contractText.trim().length === 0) {
      return res.status(400).json({ error: 'contractText is required' });
    }

    console.log(`[AUDIT REQUEST] Scanning contract length: ${contractText.length} chars`);

    let auditData = await auditContractRisk(contractText);
    if (!auditData || typeof auditData.fairnessScore !== 'number') {
      console.log(`[FALLBACK] Using Procedural Audit Engine`);
      auditData = auditContractProcedural(contractText);
    }

    // Save audit log
    const savedAudit = db.saveAudit({
      contractLength: contractText.length,
      ...auditData
    });

    res.json({
      success: true,
      data: savedAudit
    });
  } catch (error) {
    console.error("Audit Error:", error);
    res.status(500).json({ error: 'Failed to audit contract', details: error.message });
  }
});

// 4. Refine a Single Clause
app.post('/api/refine', async (req, res) => {
  try {
    const { clauseText, instruction } = req.body;

    if (!clauseText || !instruction) {
      return res.status(400).json({ error: 'clauseText and instruction are required' });
    }

    let result = await refineClause(clauseText, instruction);
    if (!result || !result.revisedLegalText) {
      result = {
        revisedLegalText: `${clauseText}\n\n[AMENDED AS PER INSTRUCTION: ${instruction}]`,
        revisedPlainEnglish: `Updated with safeguard: ${instruction}`,
        revisedPlainHindi: `संशोधित शर्त: ${instruction}`,
        changeSummary: `Clause updated to incorporate: ${instruction}`
      };
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Refine Error:", error);
    res.status(500).json({ error: 'Failed to refine clause', details: error.message });
  }
});

// 5. Get Saved Documents History
app.get('/api/documents', (req, res) => {
  const documents = db.getDocuments();
  res.json({
    success: true,
    count: documents.length,
    data: documents
  });
});

// 6. Get Document By ID
app.get('/api/documents/:id', (req, res) => {
  const doc = db.getDocumentById(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json({
    success: true,
    data: doc
  });
});

// 7. Submit Advocate Consultation Request
app.post('/api/consult', (req, res) => {
  try {
    const { lawyerId, docHash, userNote, contactEmail, contactPhone } = req.body;
    const entry = db.saveConsultation({
      lawyerId,
      docHash,
      userNote,
      contactEmail,
      contactPhone
    });

    res.json({
      success: true,
      message: 'Consultation request submitted successfully',
      data: entry
    });
  } catch (error) {
    console.error("Consultation error:", error);
    res.status(500).json({ error: 'Failed to submit consultation request' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚖️  KanoonMitra Legal AI Backend Server Running!`);
  console.log(`🌐 Port: http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
