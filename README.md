# ⚖️ KanoonMitra (कानून मित्र) - AI Legal Documentation Website for Bharat 🇮🇳

> **A Full-Stack AI-Powered Legal Documentation & Risk Auditing Website designed specifically for Individuals, Freelancers, and MSMEs in India.**

[![Fullstack React + Node.js](https://img.shields.io/badge/Stack-React%20%2B%20Node.js%20Express-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%201.5%2F2.0-orange.svg)](https://aistudio.google.com/)
[![Indian Legal Statutes](https://img.shields.io/badge/Jurisdiction-Indian%20Contract%20Act%201872-green.svg)](https://www.indiacode.nic.in/)

---

## 📖 1. Project Overview

In India, over **90% of individuals and 6.3 crore MSMEs** enter agreements without formal written contracts due to prohibitive legal fees, intimidation by complex legal jargon (*Legalese*), and lack of awareness about state stamp duty laws.

**KanoonMitra (कानून मित्र)** is a full-stack web platform that bridges this gap:
1. **Plain-Language Dual-Pane Drafting**: Generates legally enforceable Indian agreements alongside **Saral Hindi (सरल हिन्दी)** & plain English summaries so signers understand every single clause.
2. **AI Risk & Red-Flag Audit**: Analyzes any contract to detect predatory terms (e.g. void non-competes under Section 27 ICA 1872, unilateral termination, uncapped indemnities) and awards a **Fairness Score (0-100)**.
3. **State-Wise Indian Stamp Duty Calculator**: Calculates real-time e-Stamping requirements for Maharashtra (GRAS), Delhi (SHCIL), Karnataka (Kaveri 2.0), UP (IGRSUP), and Tamil Nadu.
4. **Lawyer Escalation Portal**: Connects users to Bar Council of India verified advocates for complex review.
5. **In-App Pitch Deck Presentation**: Live interactive presentation slides embedded directly in the website for hackathon judges!

---

## 🏛️ 2. Full-Stack System Architecture

```
KanoonMitra (Full-Stack Website)/
├── backend/                       # Node.js + Express REST API Server
│   ├── server.js                  # Main server entry & API route controller
│   ├── package.json               # Backend dependencies (Express, CORS, Helmet, Gemini SDK)
│   ├── .env.example               # Environment variables template
│   ├── database/
│   │   ├── store.js               # Persistent JSON database (documents, audit logs, consultations)
│   │   └── documents.json         # Auto-created storage file
│   └── services/
│       ├── gemini.js              # Google Gemini 1.5/2.0 API service with structured JSON output
│       └── legalEngine.js         # Deterministic Indian Legal Rules & fallback engine
│
├── src/                           # React 18 + Vite Frontend Website
│   ├── main.jsx                   # React root mount
│   ├── index.css                  # Legal document paper styling, watermarks, print layout
│   ├── App.jsx                    # Root website controller & tab orchestrator
│   ├── components/                # Modular UI components:
│   │   ├── Navbar.jsx             # Top bar, branding, active navigation, pitch deck trigger
│   │   ├── HeroSection.jsx        # Catchy hero, prompt-to-draft box, quick templates
│   │   ├── TemplateCatalog.jsx    # Indian contract templates catalog
│   │   ├── DocumentWizard.jsx     # Step-by-step interactive intake wizard
│   │   ├── DualDocumentStudio.jsx # Flagship Split-Screen Editor & Saral Explainer
│   │   ├── RiskAnalyzer.jsx       # AI Red-Flag detector & fairness score meter
│   │   ├── StampDutyCalculator.jsx# Indian state-wise stamp duty calculator
│   │   ├── IndianActsGuide.jsx    # Indian statutes reference guide (ICA 1872, MSMED 2006)
│   │   ├── LawyerConnectModal.jsx # Advocate review & booking modal
│   │   ├── PitchDeckModal.jsx     # In-app hackathon presentation slides for judges
│   │   ├── ApiKeyModal.jsx        # Google Gemini API key configuration modal
│   │   └── Footer.jsx             # Statutory disclosures & legal disclaimers
│   ├── constants/
│   │   ├── templates.js           # Pre-configured Indian templates & fields
│   │   ├── stampDuties.js         # State stamp duty portals & rates
│   │   └── indianLaws.js          # Indian statutory sections & legal rules
│   └── services/
│       ├── geminiService.js       # Client API connector with offline fallback
│       └── pdfService.js          # A4 print engine, hash generator & text export
│
├── package.json                   # Root package.json with fullstack execution scripts
└── README.md                      # Comprehensive master documentation
```

---

## 🚀 3. Step-by-Step Setup Guide (Kaise Run Karein)

### Step 1: Install Dependencies
Open your terminal / PowerShell in the root `KanoonMitra` directory and run:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

---

### Step 2: Start the Backend Server (Optional but Recommended)
In a terminal tab, run:

```bash
# Start backend API on http://localhost:5000
npm run dev:backend
```

*(Note: Backend automatically loads port 5000 with health checks and local DB persistence).*

---

### Step 3: Start the Frontend Website
In another terminal tab (or the same if running frontend only), run:

```bash
# Start React + Vite development website
npm run dev
```

The website will automatically open at **`http://localhost:3000`** (or `http://localhost:5173`).

---

## 🔑 4. Google Gemini API Key Setup (Optional)

The website works **100% out of the box** using the built-in Indian Legal Procedural Engine. To activate **Live Generative Gemini AI**:

1. Get a free API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Option A: Click the **"API Key"** button in the top navbar on the website and paste your key.
3. Option B: Create a `.env` file in `backend/.env`:
   ```env
   PORT=5000
   GEMINI_API_KEY=AIzaSyYourKeyHere
   ```

---

## 🌟 5. Complete Website Features Walkthrough

### 1. Dual-Pane Document Studio (Court Enforceable + Saral Bhasha)
- **Court Draft View**: Complete legal agreement with preambles, recitals, and covenants governed by the Indian Contract Act 1872.
- **Saral Bhasha View**: Clause-by-clause translation into **Saral Hindi (सरल हिन्दी)** and plain English.
- **AI Clause Refiner**: Click any clause and instruct the AI: *"Make tenant-friendly"*, *"Simplify words"*, or *"Add MSMED statutory interest"*.

### 2. Interactive Intake Wizard
- Rent Agreement (किरायानामा), Freelancer Contract, NDA, Employment Agreement, Loan Promissory Note, and Legal Notice.
- Natural Language Prompt Bar: Type *"Draft an agreement between a Delhi bakery and delivery rider"* $\rightarrow$ AI generates full customized contract in 3 seconds.

### 3. AI Risk & Red-Flag Audit Engine
- Paste or upload any third-party contract.
- Provides a **Fairness Score (0-100)** and risk rating (Low, Moderate, High).
- Flags predatory clauses:
  - Strict post-employment non-competes (**Void under Section 27 Indian Contract Act 1872**).
  - Unilateral termination without notice.
  - Uncapped indemnity clauses.
  - Missing mandatory 45-day payment interest under **Section 16 of the MSMED Act 2006**.

### 4. Indian State Stamp Duty & E-Stamping Calculator
- Integrated calculators for **Maharashtra (GRAS / e-ASR)**, **Delhi (SHCIL e-Stamping)**, **Karnataka (Kaveri 2.0)**, **UP (IGRSUP)**, and **Tamil Nadu**.
- Provides exact stamp duty amounts and direct government portal links.

### 5. Bar Council Verified Advocate Connect
- 1-click consultation booking with verified advocates for complex legal escalation.

### 6. Hackathon Presentation Slide Deck
- Click **"Hackathon Presentation"** in the navbar to open an interactive presentation deck explaining Architecture, Impact, and Ethics directly to judges.

---

## 📡 6. Backend REST API Endpoints

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Check server and Gemini AI status | None |
| `POST` | `/api/draft` | Draft dual-view Indian contract | `{ templateId, formData, customInstructions }` |
| `POST` | `/api/audit` | Audit contract for red flags | `{ contractText }` |
| `POST` | `/api/refine` | Refine a single clause | `{ clauseText, instruction }` |
| `GET` | `/api/documents` | Get saved document history | None |
| `GET` | `/api/documents/:id` | Get document by ID | None |
| `POST` | `/api/consult` | Submit lawyer consultation | `{ lawyerId, docHash, userNote }` |

---

## 🔒 7. Ethics, Privacy & DPDP Act 2023 Compliance

- **Zero Central Storage of Private Data**: Drafting runs in stateless browser/ephemeral sessions; confidential financial details are never sold or retained.
- **DPDP Act 2023 Aligned**: Aadhaar and identity numbers are masked by default.
- **Transparent AI Boundaries**: Includes clear statutory disclaimers advising users when to escalate to an advocate for active court litigation.

---

**Crafted with ❤️ for Bharat 🇮🇳 | KanoonMitra Legal AI**
