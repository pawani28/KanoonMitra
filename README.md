# ⚖️ KanoonMitra (कानून मित्र) - AI Legal Documentation & User Auth Website for Bharat 🇮🇳

> **A Full-Stack AI-Powered Legal Documentation, User Authentication & Risk Auditing Website designed specifically for Individuals, Freelancers, and MSMEs in India.**
> **🚀 Zero Vite Dependency: Runs directly with Node.js & Express in a single command!**

[![Fullstack Node.js + Express](https://img.shields.io/badge/Stack-Node.js%20%2B%20Express-green.svg)](https://nodejs.org/)
[![Vanilla CSS & JS](https://img.shields.io/badge/Frontend-Pure%20HTML5%20%2B%20Vanilla%20CSS%20%26%20JS-blue.svg)](https://developer.mozilla.org/)
[![Google Gemini AI](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%201.5%2F2.0-orange.svg)](https://aistudio.google.com/)
[![Indian Legal Statutes](https://img.shields.io/badge/Jurisdiction-Indian%20Contract%20Act%201872-darkgreen.svg)](https://www.indiacode.nic.in/)
[![Zero Vite](https://img.shields.io/badge/Build%20Tool-Zero%20Vite%20Required-success.svg)](#)

---

## 📖 1. Project Overview & Hackathon Objective

In India, over **90% of individuals and 6.3 crore MSMEs** enter agreements without formal written contracts due to prohibitive legal fees (₹5,000+ per draft), intimidation by complex archaic legal jargon (*Legalese*), and lack of awareness about state stamp duty laws.

**KanoonMitra (कानून मित्र)** is a full-stack web platform that bridges this gap:
1. **User Authentication & Role-Based Profiles**: Complete Sign In, Sign Up, and Profile Dashboard supporting 4 distinct Indian user personas: **Citizen (नागरिक)**, **Freelancer (फ्रीलांसर)**, **MSME Business Owner (उद्यमी)**, and **Advocate (अधिवक्ता)**. Includes instant 1-click demo logins for evaluation.
2. **Plain-Language Dual-Pane Drafting**: Generates legally enforceable Indian agreements alongside **Saral Hindi (सरल हिन्दी)** & 5th-grade plain English summaries so signers understand every single clause.
3. **AI Risk & Red-Flag Audit**: Analyzes any contract to detect predatory terms (e.g. void non-competes under Section 27 ICA 1872, unilateral cancellation, uncapped indemnities) and awards a **Fairness Score (0-100)**.
4. **State-Wise Indian Stamp Duty Calculator**: Calculates real-time e-Stamping requirements for Maharashtra (GRAS), Delhi (SHCIL), Karnataka (Kaveri 2.0), UP (IGRSUP), and Tamil Nadu.
5. **Advocate Escalation Portal**: Connects users to Bar Council of India verified advocates for complex legal review.
6. **In-App Pitch Deck Presentation**: Live interactive presentation slides embedded directly in the website for hackathon judges!

---

## 🏛️ 2. Full-Stack System Architecture (Zero Vite Required)

```
KanoonMitra (Full-Stack Website)/
├── backend/                       # Node.js + Express REST API Server
│   ├── server.js                  # Main server entry: static file host & API routes
│   ├── package.json               # Backend dependencies (Express, CORS, Helmet, Morgan)
│   ├── .env.example               # Environment variables template (Gemini API Key)
│   ├── database/
│   │   ├── store.js               # JSON store with auth, demo accounts & documents
│   │   └── documents.json         # Persistent JSON database
│   └── services/
│       ├── gemini.js              # Google Gemini 1.5/2.0 API service
│       └── legalEngine.js         # Deterministic Indian Legal Rules & fallback engine
│
├── public/                        # Complete Frontend Web Application (NO VITE)
│   ├── index.html                 # Master SPA entry with tabs, login & dashboard
│   ├── css/
│   │   └── style.css              # Custom Vanilla CSS design system (Parchment, Glassmorphism)
│   └── js/
│       ├── app.js                 # App controller, tab router, dual-pane studio & calculator
│       ├── auth.js                # Auth service (Sign In, Sign Up, Demo Logins, Profile Sync)
│       ├── templates.js           # Indian templates schema (Rent, Freelance, NDA, Loan, Notice)
│       └── legalEngine.js         # Client-side legal procedural engine & risk auditor
│
├── package.json                   # Root package.json with 1-command startup scripts
└── README.md                      # Comprehensive master documentation
```

---

## 🚀 3. Quick Start Guide (Kaise Run Karein)

### Step 1: Install Dependencies
Open your terminal in the `KanoonMitra` directory:

```bash
# Install backend dependencies
cd backend
npm install
cd ..
```

---

### Step 2: Start the Complete Full-Stack Web App (1 Command!)
Run in your terminal:

```bash
npm start
```
*(or `node backend/server.js`)*

The server will automatically start and serve the complete website on:
👉 **`http://localhost:5000`**

---

## 👤 4. User Login & Authentication System

KanoonMitra includes a full-featured authentication system with persistent session management:

### 1-Click Demo Evaluation Accounts
On the **Sign In / Login page**, you can click any of the 4 pre-configured demo buttons to test instantly:
- 👤 **Citizen Demo**: `pawan@kanoonmitra.in` | Password: `password123`
- 💻 **Freelancer Demo**: `ananya@creatives.in` | Password: `password123`
- 🏢 **MSME Founder Demo**: `vikram@zentech.in` | Password: `password123`
- ⚖️ **Advocate Demo**: `advocate.sharma@delhibar.in` | Password: `password123`

### User Roles & Personas
- **Citizen / Tenant (नागरिक)**: Focuses on residential leave & license agreements, security deposits, and personal affidavits.
- **Freelancer / Creator (फ्रीलांसर)**: Focuses on independent service agreements, milestone payments, and copyright/IP transfer protection.
- **MSME Business Owner (उद्यमी)**: Focuses on Section 16 MSMED Act 45-day payment protections and vendor contracts.
- **Advocate (अधिवक्ता / वकील)**: Verified legal counsel managing consultations and legal notices.

### User Profile Dashboard
- Personal details, city, mobile, and verification badge.
- **My Saved Legal Documents**: View, re-open in Dual-Studio, download as text, print A4, or delete saved contracts.
- **Usage Statistics**: Total contracts drafted, audits run, and consultations requested.

---

## 📡 5. Backend REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account (with role) |
| `POST` | `/api/auth/login` | Sign in with email/password |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `POST` | `/api/auth/profile` | Update user profile & jurisdiction |
| `GET` | `/api/auth/demo-users` | Retrieve list of demo accounts |
| `GET` | `/api/user/documents` | Get current user's saved legal contracts |
| `POST` | `/api/user/documents` | Save/link drafted contract to user |
| `DELETE` | `/api/user/documents/:id` | Delete document from user history |
| `GET` | `/api/user/stats` | Get user statistics (contracts, audits, consults) |
| `POST` | `/api/draft` | Draft dual-view Indian contract with AI |
| `POST` | `/api/audit` | Audit contract for red flags & fairness score |
| `POST` | `/api/refine` | Refine a single clause with custom instruction |
| `POST` | `/api/consult` | Submit lawyer consultation request |
| `GET` | `/api/health` | Check server and Gemini AI status |

---

## 🔒 6. Ethics, Privacy & DPDP Act 2023 Compliance

- **Zero Central Storage of Private Data**: Drafting runs in stateless browser sessions; confidential financial details are never sold or retained.
- **DPDP Act 2023 Aligned**: Aadhaar and identity numbers are masked by default (`XXXX-1234`).
- **Cryptographic Verification**: Every generated contract includes a SHA-256 derived verification hash (`KM-IN-2026-XXXX`).

---

**Crafted with ❤️ for Bharat 🇮🇳 | KanoonMitra Legal AI**
