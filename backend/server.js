import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './database/store.js';
import { draftLegalDocument, auditContractRisk, refineClause } from './services/gemini.js';
import { generateLegalDocumentProcedural, auditContractProcedural } from './services/legalEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../public');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware (Permissive CSP for fonts, inline styles, and standalone client-side usage)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Serve Frontend Static Assets directly from ../public (No Vite required!)
app.use(express.static(publicPath));

// Helper: Extract current user from Authorization header or req body
function getAuthenticatedUserId(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Simple bearer token format: user-id:email
    const [userId] = token.split(':');
    return userId || null;
  }
  return req.headers['x-user-id'] || req.body?.userId || req.query?.userId || null;
}

// -------------------------------------------------------------
// USER AUTHENTICATION & PROFILE ROUTES
// -------------------------------------------------------------

// 1. Get Demo Accounts for quick 1-click evaluation
app.get('/api/auth/demo-users', (req, res) => {
  res.json({
    success: true,
    demoAccounts: [
      {
        name: 'Pawan Kumar',
        email: 'pawan@kanoonmitra.in',
        password: 'password123',
        role: 'citizen',
        roleTitle: 'Citizen / Tenant (नागरिक)'
      },
      {
        name: 'Ananya Patel',
        email: 'ananya@creatives.in',
        password: 'password123',
        role: 'freelancer',
        roleTitle: 'Freelance Designer (फ्रीलांसर)'
      },
      {
        name: 'Vikram Mehta',
        email: 'vikram@zentech.in',
        password: 'password123',
        role: 'msme',
        roleTitle: 'MSME Business Founder (उद्यमी)'
      },
      {
        name: 'Adv. Rajesh Sharma',
        email: 'advocate.sharma@delhibar.in',
        password: 'password123',
        role: 'lawyer',
        roleTitle: 'High Court Advocate (अधिवक्ता)'
      }
    ]
  });
});

// 2. User Registration
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phone, password, role, city, organization, barCouncilId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const newUser = db.createUser({
      name,
      email,
      phone,
      password,
      role: role || 'citizen',
      city: city || 'India',
      organization,
      barCouncilId
    });

    const token = `${newUser.id}:${Buffer.from(newUser.email).toString('base64')}`;

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to KanoonMitra.',
      user: newUser,
      token
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// 3. User Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
    }

    const token = `${user.id}:${Buffer.from(user.email).toString('base64')}`;

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user,
      token
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Login failed due to an internal error' });
  }
});

// 4. Get Current User Profile (by Token or Header)
app.get('/api/auth/me', (req, res) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const user = db.findUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  res.json({
    success: true,
    user
  });
});

// 5. Update Profile
app.post('/api/auth/profile', (req, res) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const updated = db.updateUserProfile(userId, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'User not found.' });
  }

  res.json({
    success: true,
    message: 'Profile updated successfully!',
    user: updated
  });
});

// 6. User Specific Documents & Stats
app.get('/api/user/documents', (req, res) => {
  const userId = getAuthenticatedUserId(req);
  const docs = db.getDocuments(userId);
  res.json({
    success: true,
    count: docs.length,
    data: docs
  });
});

// 7. Save Document to User
app.post('/api/user/documents', (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const docData = req.body;
    const saved = db.saveDocument({
      ...docData,
      userId: userId || null
    });

    res.json({
      success: true,
      message: 'Document saved to your profile!',
      data: saved
    });
  } catch (error) {
    console.error("Save doc error:", error);
    res.status(500).json({ error: 'Failed to save document' });
  }
});

// 8. Delete User Document
app.delete('/api/user/documents/:id', (req, res) => {
  const userId = getAuthenticatedUserId(req);
  const success = db.deleteDocument(req.params.id, userId);
  if (!success) {
    return res.status(404).json({ error: 'Document not found or permission denied' });
  }
  res.json({ success: true, message: 'Document deleted successfully' });
});

// 9. User Dashboard Stats
app.get('/api/user/stats', (req, res) => {
  const userId = getAuthenticatedUserId(req);
  const docs = db.getDocuments(userId);
  const audits = db.getAudits(userId);
  const consultations = db.getConsultations(userId);

  res.json({
    success: true,
    stats: {
      totalDocuments: docs.length,
      totalAudits: audits.length,
      totalConsultations: consultations.length
    }
  });
});

// -------------------------------------------------------------
// CORE LEGAL AI ROUTES
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
    const { templateId, formData, customInstructions, userId } = req.body;
    const effectiveUserId = userId || getAuthenticatedUserId(req);

    if (!templateId || !formData) {
      return res.status(400).json({ error: 'Missing templateId or formData in request body' });
    }

    console.log(`[DRAFT REQUEST] Template: ${templateId} for User: ${effectiveUserId || 'Guest'}`);

    // Try Gemini AI first, fallback to procedural engine
    let docData = await draftLegalDocument(templateId, formData, customInstructions);
    if (!docData || !docData.clauses || docData.clauses.length === 0) {
      console.log(`[FALLBACK] Using Procedural Legal Engine for ${templateId}`);
      docData = generateLegalDocumentProcedural(templateId, formData);
    }

    // Save to local DB history
    const saved = db.saveDocument({
      templateId,
      userId: effectiveUserId || null,
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
    const { contractText, userId } = req.body;
    const effectiveUserId = userId || getAuthenticatedUserId(req);

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
      userId: effectiveUserId || null,
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

// 5. Get Saved Documents History (Public/all or by ID)
app.get('/api/documents', (req, res) => {
  const documents = db.getDocuments();
  res.json({
    success: true,
    count: documents.length,
    data: documents
  });
});

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

// 6. Submit Advocate Consultation Request
app.post('/api/consult', (req, res) => {
  try {
    const { lawyerId, docHash, userNote, contactEmail, contactPhone, userId } = req.body;
    const effectiveUserId = userId || getAuthenticatedUserId(req);

    const entry = db.saveConsultation({
      lawyerId,
      docHash,
      userNote,
      contactEmail,
      contactPhone,
      userId: effectiveUserId || null
    });

    res.json({
      success: true,
      message: 'Consultation request submitted successfully! An advocate will reach out within 2 hours.',
      data: entry
    });
  } catch (error) {
    console.error("Consultation error:", error);
    res.status(500).json({ error: 'Failed to submit consultation request' });
  }
});

// Wildcard Frontend Route: Return index.html for all non-API paths (SPA support)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚖️  KanoonMitra Legal AI Full-Stack Server Running!`);
  console.log(`🌐 Website URL: http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🚀 Mode: Pure Node.js & Express (Zero Vite Required!)`);
  console.log(`=======================================================`);
});
