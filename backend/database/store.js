import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'documents.json');

// Seed demo users for instant 1-click evaluation
const DEFAULT_USERS = [
  {
    id: 'KM-USER-001',
    name: 'Pawan Kumar',
    email: 'pawan@kanoonmitra.in',
    phone: '+91 98765 43210',
    password: 'password123',
    role: 'citizen',
    roleTitle: 'Citizen / Tenant (नागरिक)',
    city: 'Bengaluru, Karnataka',
    createdAt: '2026-01-15T10:00:00.000Z',
    bio: 'Looking for verified residential rent agreements and personal affidavits in Bangalore.'
  },
  {
    id: 'KM-USER-002',
    name: 'Ananya Patel',
    email: 'ananya@creatives.in',
    phone: '+91 98220 11223',
    password: 'password123',
    role: 'freelancer',
    roleTitle: 'Freelance UI/UX Designer & Creator (फ्रीलांसर)',
    city: 'Pune, Maharashtra',
    createdAt: '2026-02-10T12:30:00.000Z',
    bio: 'Independent digital product designer executing cross-border and Indian vendor contracts.'
  },
  {
    id: 'KM-USER-003',
    name: 'Vikram Mehta',
    email: 'vikram@zentech.in',
    phone: '+91 99100 55443',
    password: 'password123',
    role: 'msme',
    roleTitle: 'MSME Business Founder (उद्यमी)',
    organization: 'ZenTech Innovations Pvt. Ltd.',
    city: 'Gurugram, Haryana',
    createdAt: '2026-03-01T09:15:00.000Z',
    bio: 'Registered MSME owner relying on Section 16 MSMED Act 45-day payment protections.'
  },
  {
    id: 'KM-USER-004',
    name: 'Advocate Rajesh Sharma',
    email: 'advocate.sharma@delhibar.in',
    phone: '+91 98111 23456',
    password: 'password123',
    role: 'lawyer',
    roleTitle: 'Bar Council of India Verified Advocate (अधिवक्ता)',
    barCouncilId: 'D/1482/2012',
    city: 'New Delhi, Delhi',
    createdAt: '2025-11-20T08:00:00.000Z',
    bio: 'Senior contract attorney specializing in ICA 1872 litigation and commercial arbitration.'
  }
];

// Initialize local JSON database file if it doesn't exist
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: DEFAULT_USERS,
      documents: [],
      auditReports: [],
      consultations: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } else {
    // Ensure 'users' array exists in current DB
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (!data.users || data.users.length === 0) {
        data.users = DEFAULT_USERS;
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error("Init check error:", e);
    }
  }
}

initDb();

function readDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.users) data.users = [...DEFAULT_USERS];
    if (!data.documents) data.documents = [];
    if (!data.auditReports) data.auditReports = [];
    if (!data.consultations) data.consultations = [];
    return data;
  } catch (e) {
    console.error("DB Read Error:", e);
    return { users: [...DEFAULT_USERS], documents: [], auditReports: [], consultations: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error("DB Write Error:", e);
    return false;
  }
}

export const db = {
  // ---------------------------------------------------------
  // USER AUTHENTICATION & MANAGEMENT
  // ---------------------------------------------------------
  getAllUsers: () => {
    return readDb().users.map(({ password, ...u }) => u);
  },

  findUserByEmail: (email) => {
    if (!email) return null;
    const current = readDb();
    return current.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  },

  findUserById: (id) => {
    const current = readDb();
    const user = current.users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  createUser: (userData) => {
    const current = readDb();
    const existing = current.users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: `KM-USER-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone || '',
      password: userData.password,
      role: userData.role || 'citizen',
      roleTitle: userData.roleTitle || (userData.role === 'lawyer' ? 'Advocate (अधिवक्ता)' : userData.role === 'msme' ? 'MSME Owner' : userData.role === 'freelancer' ? 'Freelancer' : 'Citizen (नागरिक)'),
      organization: userData.organization || '',
      barCouncilId: userData.barCouncilId || '',
      city: userData.city || 'India',
      createdAt: new Date().toISOString(),
      bio: userData.bio || 'KanoonMitra User'
    };

    current.users.unshift(newUser);
    writeDb(current);

    const { password, ...safeUser } = newUser;
    return safeUser;
  },

  authenticateUser: (email, password) => {
    const current = readDb();
    const user = current.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return null;
    if (user.password !== password) return null;

    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  updateUserProfile: (userId, updates) => {
    const current = readDb();
    const index = current.users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    // Do not allow overwriting ID or email via simple profile update
    const user = current.users[index];
    const updated = {
      ...user,
      name: updates.name || user.name,
      phone: updates.phone || user.phone,
      city: updates.city || user.city,
      bio: updates.bio !== undefined ? updates.bio : user.bio,
      organization: updates.organization !== undefined ? updates.organization : user.organization,
      barCouncilId: updates.barCouncilId !== undefined ? updates.barCouncilId : user.barCouncilId
    };

    current.users[index] = updated;
    writeDb(current);
    const { password, ...safeUser } = updated;
    return safeUser;
  },

  // ---------------------------------------------------------
  // DOCUMENT MANAGEMENT
  // ---------------------------------------------------------
  saveDocument: (doc) => {
    const current = readDb();
    const newDoc = {
      id: doc.id || `KM-DOC-${Date.now()}`,
      createdAt: new Date().toISOString(),
      userId: doc.userId || null,
      ...doc
    };
    current.documents.unshift(newDoc);
    writeDb(current);
    return newDoc;
  },

  getDocuments: (userId = null) => {
    const docs = readDb().documents;
    if (userId) {
      return docs.filter(d => d.userId === userId || !d.userId);
    }
    return docs;
  },

  getDocumentById: (id) => {
    const current = readDb();
    return current.documents.find(d => d.id === id);
  },

  deleteDocument: (id, userId = null) => {
    const current = readDb();
    const index = current.documents.findIndex(d => d.id === id && (!userId || d.userId === userId));
    if (index === -1) return false;
    current.documents.splice(index, 1);
    writeDb(current);
    return true;
  },

  // ---------------------------------------------------------
  // RISK AUDIT REPORTS
  // ---------------------------------------------------------
  saveAudit: (audit) => {
    const current = readDb();
    const entry = {
      id: `KM-AUDIT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: audit.userId || null,
      ...audit
    };
    current.auditReports.unshift(entry);
    writeDb(current);
    return entry;
  },

  getAudits: (userId = null) => {
    const reports = readDb().auditReports;
    if (userId) {
      return reports.filter(r => r.userId === userId || !r.userId);
    }
    return reports;
  },

  // ---------------------------------------------------------
  // LAWYER CONSULTATIONS
  // ---------------------------------------------------------
  saveConsultation: (consultation) => {
    const current = readDb();
    const entry = {
      id: `KM-CONSULT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'PENDING_REVIEW',
      userId: consultation.userId || null,
      ...consultation
    };
    current.consultations.unshift(entry);
    writeDb(current);
    return entry;
  },

  getConsultations: (userId = null) => {
    const items = readDb().consultations;
    if (userId) {
      return items.filter(c => c.userId === userId || !c.userId);
    }
    return items;
  }
};
