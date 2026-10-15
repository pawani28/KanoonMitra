// KanoonMitra Template Catalog, Indian Statutes & Stamp Duty Data

window.DOCUMENT_TEMPLATES = [
  {
    id: 'rent-agreement',
    name: 'Residential Rent Agreement',
    hindiName: 'मकान किरायानामा (Leave & License)',
    category: 'Property & Rental',
    badge: 'Most Popular in India',
    icon: '🏠',
    description: 'Court-compliant 11-month or multi-year rental agreement between Landlord and Tenant with stamp duty guidelines and security deposit safeguards.',
    actReference: 'Transfer of Property Act, 1882 & State Rent Control Acts',
    fields: [
      { id: 'landlordName', label: 'Landlord Full Name (मकान मालिक)', type: 'text', default: 'Ramesh Chandra Sharma' },
      { id: 'landlordAddress', label: 'Landlord Address & Aadhaar (Last 4)', type: 'text', default: 'Flat 402, Shanti Heights, Malad West, Mumbai (XXXX-1234)' },
      { id: 'tenantName', label: 'Tenant Full Name (किरायेदार)', type: 'text', default: 'Priya Sundaram' },
      { id: 'tenantAddress', label: 'Tenant Permanent Address', type: 'text', default: 'H-12, Sector 62, Noida, Uttar Pradesh' },
      { id: 'propertyAddress', label: 'Rented Property Address (किराये का पता)', type: 'text', default: 'Flat No 301, 3rd Floor, Green Woods, Indiranagar, Bengaluru - 560038' },
      { id: 'monthlyRent', label: 'Monthly Rent (रुपये/माह)', type: 'number', default: '25000' },
      { id: 'securityDeposit', label: 'Security Deposit (सिक्योरिटी डिपॉजिट)', type: 'number', default: '100000' },
      { id: 'leaseTenure', label: 'Tenure (अवधि)', type: 'select', options: ['11 Months', '22 Months', '36 Months'], default: '11 Months' },
      { id: 'commenceDate', label: 'Commencement Date', type: 'date', default: '2026-10-15' },
      { id: 'noticePeriod', label: 'Notice Period', type: 'select', options: ['1 Month', '2 Months', '15 Days'], default: '1 Month' },
      { id: 'lockInPeriod', label: 'Lock-in Period', type: 'select', options: ['None', '3 Months', '6 Months'], default: '3 Months' },
      { id: 'petPolicy', label: 'Pets Allowed?', type: 'select', options: ['Permitted', 'Not Permitted', 'Permitted with prior consent'], default: 'Permitted with prior consent' },
      { id: 'jurisdictionCity', label: 'Jurisdiction City (कोर्ट अधिकार क्षेत्र)', type: 'text', default: 'Bengaluru' }
    ]
  },
  {
    id: 'freelance-contract',
    name: 'Freelancer / Service Contract',
    hindiName: 'फ्रीलांसर / सेवा अनुबंध',
    category: 'Business & Freelance',
    badge: 'Essential for Creators & MSMEs',
    icon: '💼',
    description: 'Service agreement protecting independent contractors and clients regarding deliverables, milestone payments, IP ownership transfer, and late payment interest.',
    actReference: 'Indian Contract Act, 1872 & Copyright Act, 1957',
    fields: [
      { id: 'clientName', label: 'Client / Company Name (ग्राहक)', type: 'text', default: 'ZenTech Innovations Pvt. Ltd.' },
      { id: 'clientRepresentative', label: 'Authorized Signatory', type: 'text', default: 'Vikram Mehta, Director' },
      { id: 'freelancerName', label: 'Freelancer / Agency Name (सेवा प्रदाता)', type: 'text', default: 'Ananya Patel' },
      { id: 'scopeOfWork', label: 'Scope of Work / Deliverables (काम का विवरण)', type: 'textarea', default: 'Full UI/UX Design for Mobile Application, Design System in Figma, and up to 3 revision rounds.' },
      { id: 'totalFee', label: 'Total Agreed Fee (₹ INR)', type: 'number', default: '75000' },
      { id: 'paymentTerms', label: 'Payment Schedule', type: 'select', options: ['50% Advance, 50% on Delivery', '30% Advance, 40% Milestone, 30% Final', '100% Post Completion within 15 days'], default: '50% Advance, 50% on Delivery' },
      { id: 'deadlineDate', label: 'Delivery Deadline', type: 'date', default: '2026-11-30' },
      { id: 'ipOwnership', label: 'IP Rights Transfer', type: 'select', options: ['Transfers to Client ONLY upon full payment', 'Retained by Freelancer with license to client', 'Transfers immediately upon creation'], default: 'Transfers to Client ONLY upon full payment' },
      { id: 'lateFeePercent', label: 'Late Payment Interest', type: 'select', options: ['1.5% per month', '2% per month under MSMED Act', 'None'], default: '1.5% per month' },
      { id: 'jurisdictionCity', label: 'Jurisdiction City', type: 'text', default: 'Pune' }
    ]
  },
  {
    id: 'nda-agreement',
    name: 'Non-Disclosure Agreement (NDA)',
    hindiName: 'गोपनीयता समझौता (NDA)',
    category: 'Corporate & Startups',
    badge: 'Confidentiality Shield',
    icon: '🛡️',
    description: 'Protects proprietary secrets, confidential source code, customer lists, and financial figures between startups, partners, and vendors.',
    actReference: 'Indian Contract Act, 1872 (Section 27 compliance)',
    fields: [
      { id: 'disclosingParty', label: 'Disclosing Party Name (डेटा देने वाला)', type: 'text', default: 'Apex AI Labs LLP' },
      { id: 'receivingParty', label: 'Receiving Party Name (डेटा पाने वाला)', type: 'text', default: 'Suresh Varma' },
      { id: 'ndaType', label: 'NDA Type', type: 'select', options: ['Mutual (Two-way)', 'Unilateral (One-way)'], default: 'Mutual (Two-way)' },
      { id: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', default: 'Exploring joint AI technology partnership, algorithm evaluation, and commercial investment.' },
      { id: 'confidentialityTerm', label: 'Confidentiality Duration', type: 'select', options: ['2 Years', '3 Years', '5 Years', 'Perpetual for Trade Secrets'], default: '3 Years' },
      { id: 'nonSolicitation', label: 'Non-Solicitation of Employees', type: 'select', options: ['Included (12 Months)', 'Included (24 Months)', 'Excluded'], default: 'Included (12 Months)' },
      { id: 'jurisdictionCity', label: 'Governing Court Jurisdiction', type: 'text', default: 'Mumbai' }
    ]
  },
  {
    id: 'employment-contract',
    name: 'Employment Offer & Agreement',
    hindiName: 'रोजगार अनुबंध / नियुक्ति पत्र',
    category: 'Human Resources',
    badge: 'MSME HR Ready',
    icon: '👤',
    description: 'Comprehensive employment letter with probation terms, salary CTC breakdown, IP assignment, notice period, and statutory leave policies.',
    actReference: 'Industrial Disputes Act, 1947 & State Shops & Establishment Acts',
    fields: [
      { id: 'employerName', label: 'Company / Employer Name', type: 'text', default: 'Bharat NextGen Technologies Pvt. Ltd.' },
      { id: 'employeeName', label: 'Candidate Full Name', type: 'text', default: 'Rohit K. Nair' },
      { id: 'designation', label: 'Job Title / Designation', type: 'text', default: 'Senior Full Stack Engineer' },
      { id: 'annualCtc', label: 'Annual CTC (₹ INR)', type: 'number', default: '1200000' },
      { id: 'probationPeriod', label: 'Probation Period', type: 'select', options: ['3 Months', '6 Months', 'None (Direct Permanent)'], default: '3 Months' },
      { id: 'noticePeriodDays', label: 'Notice Period Duration', type: 'select', options: ['30 Days', '60 Days', '90 Days'], default: '30 Days' },
      { id: 'workMode', label: 'Work Mode', type: 'select', options: ['Hybrid (Office + Remote)', 'Fully Remote', 'On-site Office'], default: 'Hybrid (Office + Remote)' },
      { id: 'jurisdictionCity', label: 'Jurisdiction City', type: 'text', default: 'Hyderabad' }
    ]
  },
  {
    id: 'promissory-note',
    name: 'Promissory Note / Loan Agreement',
    hindiName: 'प्रॉमिसरी नोट / ऋण समझौता (उधारनामा)',
    category: 'Finance & Lending',
    badge: 'Legally Recoverable Debt',
    icon: '💰',
    description: 'Binding promise to repay borrowed money with clear interest rate, monthly EMI or lumpsum schedule, and default recovery terms.',
    actReference: 'Negotiable Instruments Act, 1881 (Section 4)',
    fields: [
      { id: 'lenderName', label: 'Lender Full Name (ऋणदाता / पैसा देने वाला)', type: 'text', default: 'Gopal Krishna Agarwal' },
      { id: 'borrowerName', label: 'Borrower Full Name (ऋणी / कर्जदार)', type: 'text', default: 'Manoj Kumar Gupta' },
      { id: 'principalAmount', label: 'Principal Loan Amount (₹ INR)', type: 'number', default: '300000' },
      { id: 'interestRate', label: 'Annual Interest Rate (%)', type: 'select', options: ['0% (Interest-free loan)', '6% per annum', '9% per annum', '12% per annum', '18% per annum'], default: '9% per annum' },
      { id: 'repaymentType', label: 'Repayment Structure', type: 'select', options: ['Monthly Equated Installments (EMIs)', 'Single Lumpsum with Interest'], default: 'Monthly Equated Installments (EMIs)' },
      { id: 'dueDate', label: 'Final Repayment Due Date', type: 'date', default: '2027-03-31' },
      { id: 'jurisdictionCity', label: 'City of Execution', type: 'text', default: 'Jaipur' }
    ]
  },
  {
    id: 'legal-notice',
    name: 'Legal Notice for Unpaid Dues / Breach',
    hindiName: 'कानूनी नोटिस (बकाया भुगतान / अनुबंध उल्लंघन)',
    category: 'Litigation & Notice',
    badge: 'Pre-Litigation Demand',
    icon: '⚠️',
    description: 'Formal legal demand notice sent demanding payment of overdue invoice or rectifying contract breach within 15 days before filing suit.',
    actReference: 'Code of Civil Procedure, 1908 & Section 138 NI Act',
    fields: [
      { id: 'senderName', label: 'Aggrieved Party / Sender (भेजने वाला)', type: 'text', default: 'Apex Digital Solutions LLP' },
      { id: 'recipientName', label: 'Defaulting Party / Recipient (पाने वाला)', type: 'text', default: 'Orbit Retailers Pvt. Ltd.' },
      { id: 'recipientAddress', label: 'Recipient Registered Address', type: 'text', default: 'Plot 44, Okhla Industrial Area Phase 3, New Delhi' },
      { id: 'outstandingAmount', label: 'Overdue Amount (₹ INR)', type: 'number', default: '185000' },
      { id: 'invoiceDetails', label: 'Invoice No. & Date Reference', type: 'text', default: 'Invoice #ADS/2026/089 dated 10th June 2026' },
      { id: 'rectificationWindow', label: 'Cure / Payment Demand Period', type: 'select', options: ['15 Days from receipt', '7 Days from receipt', '30 Days from receipt'], default: '15 Days from receipt' },
      { id: 'jurisdictionCity', label: 'City of Advocate/Sender', type: 'text', default: 'New Delhi' }
    ]
  }
];

window.STATE_STAMP_DUTIES = [
  {
    state: 'Maharashtra',
    portal: 'GRAS Maharashtra / IGR Maharashtra (e-ASR)',
    portalUrl: 'https://gras.maharashtra.gov.in/',
    rentDuty: '0.25% of total rent + deposit for the tenure',
    registrationFee: '₹1,000 (Urban) / ₹500 (Rural)',
    serviceContractDuty: '₹500 under Article 5(h)',
    ndaDuty: '₹500 Non-Judicial Stamp',
    tips: 'Mandatory online registration for Leave & License under Section 55 of Maharashtra Rent Control Act 1999.'
  },
  {
    state: 'National Capital Territory of Delhi',
    portal: 'Stock Holding Corporation of India (SHCIL) Delhi',
    portalUrl: 'https://www.shcilestamp.com/',
    rentDuty: '2% of average annual rent',
    registrationFee: '₹1,100 flat fee',
    serviceContractDuty: '₹100 e-Stamp paper',
    ndaDuty: '₹100 e-Stamp paper',
    tips: 'Agreements under 11 months traditionally executed on ₹100 e-stamp with notary attestation.'
  },
  {
    state: 'Karnataka (Bengaluru)',
    portal: 'Kaveri 2.0 / SHCIL Karnataka',
    portalUrl: 'https://kaveri.karnataka.gov.in/',
    rentDuty: '0.5% of annual rent + deposit or min ₹500',
    registrationFee: '1% of consideration value',
    serviceContractDuty: '₹200 to ₹500 under Article 5(j)',
    ndaDuty: '₹200 e-Stamp paper',
    tips: 'Karnataka Stamp Act mandates e-Stamping via Kaveri 2.0 or authorized nationalized banks.'
  },
  {
    state: 'Uttar Pradesh (Noida / Lucknow)',
    portal: 'IGRSUP (Integrated Grievance & Registration System UP)',
    portalUrl: 'https://igrsup.gov.in/',
    rentDuty: '2% of consideration value',
    registrationFee: '2% of consideration value',
    serviceContractDuty: '₹100 e-Stamp',
    ndaDuty: '₹100 e-Stamp',
    tips: 'Online e-stamping certificates generated directly via SHCIL and verified on IGRSUP.'
  },
  {
    state: 'Tamil Nadu (Chennai)',
    portal: 'TNREGINET (Tamil Nadu Registration Department)',
    portalUrl: 'https://tnreginet.gov.in/',
    rentDuty: '1% of total rent for lease period',
    registrationFee: '1% of consideration (Max ₹20,000)',
    serviceContractDuty: '₹300 under Schedule I Article 5',
    ndaDuty: '₹300 Non-Judicial Stamp',
    tips: 'Tamil Nadu Tenancy Act 2017 mandates registration on the state tenancy portal.'
  }
];

window.INDIAN_ACTS_GUIDE = [
  {
    act: 'Indian Contract Act, 1872',
    sections: 'Section 10 (Valid Contract), Section 23 (Lawful Object), Section 27 (Restraint of Trade / Non-competes)',
    summary: 'The primary legislation governing all agreements in India. Requires free consent, competent parties, lawful consideration, and lawful object.',
    keyRule: 'Section 27 renders post-termination non-competes void against employees; non-solicitation and NDA protections remain enforceable.'
  },
  {
    act: 'Information Technology Act, 2000 & IT Amendment 2008',
    sections: 'Section 10A (Electronic Contracts), Section 43A (Data Protection), Section 5 (Digital Signatures)',
    summary: 'Recognizes digital agreements concluded over email or online platforms as valid and admissible in Indian courts.',
    keyRule: 'Aadhaar OTP e-signatures carry statutory evidentiary parity with physical ink signatures under Section 5 & 10A.'
  },
  {
    act: 'Transfer of Property Act, 1882 & Registration Act, 1908',
    sections: 'Section 105 (Leases Defined), Section 17 (Compulsory Registration of leases over 11 months)',
    summary: 'Mandates that any lease or tenancy exceeding 11 months must be compulsorily registered with the Sub-Registrar.',
    keyRule: '11-Month agreements are structured as Leave & License to avoid standard tenancy rights and streamline eviction.'
  },
  {
    act: 'Micro, Small and Medium Enterprises Development (MSMED) Act, 2006',
    sections: 'Section 15 (Mandatory 45-day Payment), Section 16 (Compound Interest at 3x RBI Bank Rate)',
    summary: 'Vital statutory protection for Indian MSMEs & registered freelancers against delayed payments by corporate buyers.',
    keyRule: 'Statutory interest is mandatory if payment is delayed beyond 45 days, overriding contrary contract terms.'
  },
  {
    act: 'Digital Personal Data Protection (DPDP) Act, 2023',
    sections: 'Section 4 (Grounds for processing), Section 6 (Consent Notice)',
    summary: 'India’s comprehensive digital privacy framework governing notice, collection, and storage of Aadhaar and personal data.',
    keyRule: 'Aadhaar masking and zero central storage of identity documents ensure complete compliance.'
  }
];
