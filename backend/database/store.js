import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'documents.json');

// Initialize local JSON database file if it doesn't exist
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      documents: [],
      auditReports: [],
      consultations: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

initDb();

function readDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error("DB Read Error:", e);
    return { documents: [], auditReports: [], consultations: [] };
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
  // Save generated document
  saveDocument: (doc) => {
    const current = readDb();
    const newDoc = {
      id: doc.id || `KM-DOC-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...doc
    };
    current.documents.unshift(newDoc);
    writeDb(current);
    return newDoc;
  },

  // Get all documents
  getDocuments: () => {
    return readDb().documents;
  },

  // Get document by ID
  getDocumentById: (id) => {
    const current = readDb();
    return current.documents.find(d => d.id === id);
  },

  // Save Risk Audit Report
  saveAudit: (audit) => {
    const current = readDb();
    const entry = {
      id: `KM-AUDIT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...audit
    };
    current.auditReports.unshift(entry);
    writeDb(current);
    return entry;
  },

  // Save Lawyer Consultation Request
  saveConsultation: (consultation) => {
    const current = readDb();
    const entry = {
      id: `KM-CONSULT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'PENDING_REVIEW',
      ...consultation
    };
    current.consultations.unshift(entry);
    writeDb(current);
    return entry;
  }
};
