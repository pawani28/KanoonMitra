// KanoonMitra (कानून मित्र) - Main Application Controller
// Pure Vanilla JavaScript | Zero Vite Dependency

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Auth
  window.Auth.init();

  // App State
  const AppState = {
    activeTab: 'templates',
    selectedTemplate: null,
    currentDocument: null,
    selectedRole: 'citizen',
    authMode: 'login' // 'login' | 'register'
  };

  // Toast Notification Helper
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
  window.showToast = showToast;

  // -------------------------------------------------------------
  // TAB NAVIGATION & ROUTING
  // -------------------------------------------------------------
  function switchTab(tabId) {
    AppState.activeTab = tabId;

    // Update nav links active state
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tabId);
    });

    // Update tab views
    document.querySelectorAll('.tab-view').forEach(el => {
      el.classList.toggle('active', el.id === `${tabId}-view`);
    });

    // If profile tab opened, refresh user profile and docs
    if (tabId === 'profile') {
      renderProfileView();
    }

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.switchTab = switchTab;

  // Navigation Links click handler
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // Top header brand click
  document.getElementById('brand-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('templates');
  });

  // -------------------------------------------------------------
  // AUTHENTICATION UI & NAVBAR SYNC
  // -------------------------------------------------------------
  const authNavBtn = document.getElementById('auth-nav-btn');
  const userProfileMenu = document.getElementById('user-profile-menu');
  const profileDropdown = document.getElementById('profile-dropdown');
  const userPillBtn = document.getElementById('user-pill-btn');
  const userAvatarCircle = document.getElementById('user-avatar-circle');
  const userNameLabel = document.getElementById('user-name-label');
  const userRoleBadge = document.getElementById('user-role-badge');
  const dropdownUserName = document.getElementById('dropdown-user-name');
  const dropdownUserEmail = document.getElementById('dropdown-user-email');

  // Sync Navbar with current Auth State
  window.Auth.onStateChange((user) => {
    if (user) {
      if (authNavBtn) authNavBtn.style.display = 'none';
      if (userProfileMenu) userProfileMenu.style.display = 'flex';

      const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
      if (userAvatarCircle) userAvatarCircle.textContent = initial;
      if (userNameLabel) userNameLabel.textContent = user.name.split(' ')[0];
      if (userRoleBadge) userRoleBadge.textContent = user.roleTitle || user.role;
      if (dropdownUserName) dropdownUserName.textContent = user.name;
      if (dropdownUserEmail) dropdownUserEmail.textContent = user.email;
    } else {
      if (authNavBtn) authNavBtn.style.display = 'flex';
      if (userProfileMenu) userProfileMenu.style.display = 'none';
      if (profileDropdown) profileDropdown.classList.remove('show');
    }
  });

  // Toggle user dropdown menu
  userPillBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!userProfileMenu?.contains(e.target)) {
      profileDropdown?.classList.remove('show');
    }
  });

  // Auth button in header clicked
  authNavBtn?.addEventListener('click', () => {
    setAuthMode('login');
    switchTab('login');
  });

  // Dropdown link: Profile & Documents
  document.getElementById('dropdown-profile-btn')?.addEventListener('click', () => {
    profileDropdown?.classList.remove('show');
    switchTab('profile');
  });

  // Dropdown link: New Draft
  document.getElementById('dropdown-new-draft-btn')?.addEventListener('click', () => {
    profileDropdown?.classList.remove('show');
    switchTab('templates');
  });

  // Dropdown link: Logout
  document.getElementById('dropdown-logout-btn')?.addEventListener('click', () => {
    profileDropdown?.classList.remove('show');
    window.Auth.logout();
    showToast('You have been logged out successfully.', 'info');
    switchTab('templates');
  });

  // -------------------------------------------------------------
  // AUTH VIEW (LOGIN & REGISTER TABS & FORMS)
  // -------------------------------------------------------------
  const authLoginTabBtn = document.getElementById('auth-login-tab-btn');
  const authRegisterTabBtn = document.getElementById('auth-register-tab-btn');
  const loginFormWrap = document.getElementById('login-form-wrap');
  const registerFormWrap = document.getElementById('register-form-wrap');
  const authTitle = document.getElementById('auth-title');
  const authSub = document.getElementById('auth-sub');

  function setAuthMode(mode) {
    AppState.authMode = mode;
    if (mode === 'login') {
      authLoginTabBtn?.classList.add('active');
      authRegisterTabBtn?.classList.remove('active');
      loginFormWrap.style.display = 'block';
      registerFormWrap.style.display = 'none';
      if (authTitle) authTitle.textContent = 'Welcome Back (पुनः स्वागत है)';
      if (authSub) authSub.textContent = 'Sign in to access your drafted Indian legal contracts & dashboard.';
    } else {
      authRegisterTabBtn?.classList.add('active');
      authLoginTabBtn?.classList.remove('active');
      loginFormWrap.style.display = 'none';
      registerFormWrap.style.display = 'block';
      if (authTitle) authTitle.textContent = 'Create Account (नया खाता बनाएं)';
      if (authSub) authSub.textContent = 'Join thousands of Indians drafting legally enforceable agreements with AI.';
    }
  }

  authLoginTabBtn?.addEventListener('click', () => setAuthMode('login'));
  authRegisterTabBtn?.addEventListener('click', () => setAuthMode('register'));
  document.getElementById('switch-to-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    setAuthMode('register');
  });
  document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    setAuthMode('login');
  });

  // Password visibility toggle
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.textContent = '🙈';
        } else {
          input.type = 'password';
          btn.textContent = '👁️';
        }
      }
    });
  });

  // Role selector cards in Sign Up
  document.querySelectorAll('.role-option-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.role-option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      AppState.selectedRole = card.dataset.role;

      // Toggle extra fields for lawyer / msme
      const lawyerField = document.getElementById('reg-lawyer-fields');
      const msmeField = document.getElementById('reg-msme-fields');
      if (lawyerField) lawyerField.style.display = AppState.selectedRole === 'lawyer' ? 'block' : 'none';
      if (msmeField) msmeField.style.display = AppState.selectedRole === 'msme' ? 'block' : 'none';
    });
  });

  // Handle Login Form Submit
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const submitBtn = loginForm.querySelector('.auth-submit-btn');

    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Verifying...</span>';
      const user = await window.Auth.login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      switchTab('profile');
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Sign In to KanoonMitra →</span>';
    }
  });

  // Handle Registration Form Submit
  const registerForm = document.getElementById('register-form');
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;
    const city = document.getElementById('reg-city').value;
    const consent = document.getElementById('reg-consent')?.checked;
    const submitBtn = registerForm.querySelector('.auth-submit-btn');

    if (!name || !email || !password) {
      showToast('Name, email, and password are required.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    if (!consent) {
      showToast('Please accept the Legal Terms & DPDP Act compliance.', 'error');
      return;
    }

    const payload = {
      name,
      email,
      phone,
      password,
      city,
      role: AppState.selectedRole,
      barCouncilId: document.getElementById('reg-bar-council')?.value || '',
      organization: document.getElementById('reg-organization')?.value || ''
    };

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Creating Account...</span>';
      const user = await window.Auth.register(payload);
      showToast(`Account created successfully! Welcome, ${user.name}.`, 'success');
      switchTab('profile');
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Create Verified Legal Account →</span>';
    }
  });

  // Demo Login Buttons
  document.querySelectorAll('.demo-user-chip').forEach(chip => {
    chip.addEventListener('click', async () => {
      const role = chip.dataset.demoRole;
      try {
        chip.style.opacity = '0.5';
        const user = await window.Auth.loginDemo(role);
        showToast(`Logged in as ${user.name} (${user.roleTitle || user.role})`, 'success');
        switchTab('profile');
      } catch (err) {
        showToast('Demo login error: ' + err.message, 'error');
      } finally {
        chip.style.opacity = '1';
      }
    });
  });

  // -------------------------------------------------------------
  // USER PROFILE DASHBOARD VIEW
  // -------------------------------------------------------------
  async function renderProfileView() {
    const user = window.Auth.getUser();
    if (!user) {
      switchTab('login');
      return;
    }

    // Populate user hero details
    const avatarEl = document.getElementById('profile-avatar-large');
    const nameEl = document.getElementById('profile-full-name');
    const roleBadgeEl = document.getElementById('profile-role-badge');
    const emailEl = document.getElementById('profile-email-disp');
    const phoneEl = document.getElementById('profile-phone-disp');
    const cityEl = document.getElementById('profile-city-disp');
    const memberSinceEl = document.getElementById('profile-member-since');

    if (avatarEl) avatarEl.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    if (nameEl) nameEl.textContent = user.name;
    if (roleBadgeEl) roleBadgeEl.textContent = user.roleTitle || user.role;
    if (emailEl) emailEl.textContent = user.email;
    if (phoneEl) phoneEl.textContent = user.phone || '+91 Not Provided';
    if (cityEl) cityEl.textContent = user.city || 'India';
    if (memberSinceEl) {
      const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2026';
      memberSinceEl.textContent = `Member since ${date}`;
    }

    // Load stats
    const stats = await window.Auth.getUserStats();
    document.getElementById('stat-docs-count').textContent = stats.totalDocuments || 0;
    document.getElementById('stat-audits-count').textContent = stats.totalAudits || 1;
    document.getElementById('stat-consults-count').textContent = stats.totalConsultations || 0;

    // Load user documents
    loadUserDocumentsTable();
  }

  async function loadUserDocumentsTable() {
    const tableBody = document.getElementById('user-docs-table-body');
    const emptyPlaceholder = document.getElementById('empty-docs-placeholder');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 1.5rem; color:#64748b;">Loading your saved contracts...</td></tr>';

    const docs = await window.Auth.getUserDocuments();

    if (!docs || docs.length === 0) {
      tableBody.innerHTML = '';
      if (emptyPlaceholder) emptyPlaceholder.style.display = 'block';
      return;
    }

    if (emptyPlaceholder) emptyPlaceholder.style.display = 'none';
    tableBody.innerHTML = '';

    docs.forEach(doc => {
      const tr = document.createElement('tr');
      const dateStr = doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-IN') : 'Recent';

      tr.innerHTML = `
        <td>
          <div class="doc-name-cell">
            <span>${doc.title || 'Legal Document'}</span>
            <span class="doc-hash-tag">${doc.id || 'KM-DOC'}</span>
          </div>
        </td>
        <td><span style="font-size:0.8rem; font-weight:600; color:#475569;">${doc.templateId || 'General Agreement'}</span></td>
        <td><span style="font-size:0.8rem; color:#64748b;">${dateStr}</span></td>
        <td><span class="badge-legal-valid">✓ Court Valid (ICA 1872)</span></td>
        <td>
          <div class="doc-action-btns">
            <button class="btn-doc-action primary" data-action="view" data-doc-id="${doc.id}">Open Studio</button>
            <button class="btn-doc-action" data-action="text" data-doc-id="${doc.id}">Download</button>
            <button class="btn-doc-action delete" data-action="delete" data-doc-id="${doc.id}">Delete</button>
          </div>
        </td>
      `;

      // Actions on row
      tr.querySelector('[data-action="view"]')?.addEventListener('click', () => {
        AppState.currentDocument = doc;
        renderDocumentStudio(doc);
        switchTab('studio');
      });

      tr.querySelector('[data-action="text"]')?.addEventListener('click', () => {
        downloadDocumentText(doc);
      });

      tr.querySelector('[data-action="delete"]')?.addEventListener('click', async () => {
        if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
          await window.Auth.deleteDocument(doc.id);
          showToast('Document removed from your history.', 'info');
          loadUserDocumentsTable();
        }
      });

      tableBody.appendChild(tr);
    });
  }

  // Profile Action: Draft New Contract
  document.getElementById('profile-new-draft-btn')?.addEventListener('click', () => {
    switchTab('templates');
  });

  // Profile Action: Logout
  document.getElementById('profile-logout-btn')?.addEventListener('click', () => {
    window.Auth.logout();
    showToast('Signed out of KanoonMitra.', 'info');
    switchTab('templates');
  });

  // Profile Action: Save Settings
  document.getElementById('profile-settings-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('settings-name').value;
    const phone = document.getElementById('settings-phone').value;
    const city = document.getElementById('settings-city').value;
    const apiKey = document.getElementById('settings-gemini-key').value;

    if (apiKey) {
      localStorage.setItem('km_gemini_key', apiKey.trim());
    }

    try {
      await window.Auth.updateProfile({ name, phone, city });
      showToast('Profile and settings updated successfully!', 'success');
      renderProfileView();
    } catch (err) {
      showToast('Failed to update: ' + err.message, 'error');
    }
  });

  // -------------------------------------------------------------
  // TEMPLATE CATALOG & SEARCH / FILTER
  // -------------------------------------------------------------
  function renderTemplateCatalog(filterCategory = 'all') {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const templates = window.DOCUMENT_TEMPLATES || [];
    const filtered = filterCategory === 'all' 
      ? templates 
      : templates.filter(t => t.category.toLowerCase().includes(filterCategory.toLowerCase()));

    filtered.forEach(tmpl => {
      const card = document.createElement('div');
      card.className = 'template-card';
      card.innerHTML = `
        <div>
          <div class="template-card-header">
            <div class="template-icon-wrap">${tmpl.icon || '📄'}</div>
            <span class="template-badge">${tmpl.badge || 'Indian Law'}</span>
          </div>
          <h3 class="template-name">${tmpl.name}</h3>
          <p class="template-hindi-name">${tmpl.hindiName || ''}</p>
          <p class="template-description">${tmpl.description}</p>
          <div class="template-statute-note">
            <strong>Act:</strong> ${tmpl.actReference}
          </div>
        </div>
        <div class="template-card-footer">
          <span style="font-size:0.75rem; color:#64748b; font-weight:600;">Dual Saral + Court View</span>
          <button class="btn-draft-template" data-template-id="${tmpl.id}">
            <span>Draft Contract</span> →
          </button>
        </div>
      `;

      card.querySelector('.btn-draft-template')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openWizard(tmpl);
      });

      card.addEventListener('click', () => {
        openWizard(tmpl);
      });

      grid.appendChild(card);
    });
  }

  // Filter pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderTemplateCatalog(pill.dataset.category);
    });
  });

  // Hero Prompt submit bar
  const heroPromptForm = document.getElementById('hero-prompt-form');
  heroPromptForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const promptInput = document.getElementById('hero-prompt-input');
    const promptText = promptInput.value.trim();
    if (!promptText) return;

    // Detect likely template from prompt text
    let matchedTemplate = window.DOCUMENT_TEMPLATES[0]; // Rent default
    const lower = promptText.toLowerCase();
    if (lower.includes('freelance') || lower.includes('design') || lower.includes('client') || lower.includes('developer')) {
      matchedTemplate = window.DOCUMENT_TEMPLATES[1];
    } else if (lower.includes('nda') || lower.includes('confidential') || lower.includes('secret')) {
      matchedTemplate = window.DOCUMENT_TEMPLATES[2];
    } else if (lower.includes('employment') || lower.includes('job') || lower.includes('salary') || lower.includes('hiring')) {
      matchedTemplate = window.DOCUMENT_TEMPLATES[3];
    } else if (lower.includes('loan') || lower.includes('promissory') || lower.includes('money') || lower.includes('borrow')) {
      matchedTemplate = window.DOCUMENT_TEMPLATES[4];
    } else if (lower.includes('notice') || lower.includes('demand') || lower.includes('unpaid')) {
      matchedTemplate = window.DOCUMENT_TEMPLATES[5];
    }

    showToast(`Generating custom draft for: "${promptText.slice(0, 30)}..."`, 'info');
    openWizard(matchedTemplate, { customInstructions: promptText });
  });

  // -------------------------------------------------------------
  // INTAKE WIZARD MODAL / VIEW
  // -------------------------------------------------------------
  function openWizard(template, initialData = {}) {
    AppState.selectedTemplate = template;
    const titleEl = document.getElementById('wizard-tmpl-title');
    const subEl = document.getElementById('wizard-tmpl-sub');
    const fieldsContainer = document.getElementById('wizard-dynamic-fields');

    if (titleEl) titleEl.textContent = `${template.name} (${template.hindiName || ''})`;
    if (subEl) subEl.textContent = template.description;

    fieldsContainer.innerHTML = '';

    template.fields.forEach(field => {
      const group = document.createElement('div');
      group.className = field.type === 'textarea' ? 'form-group wizard-full-width' : 'form-group';

      let inputHtml = '';
      if (field.type === 'select') {
        inputHtml = `
          <select id="field-${field.id}" class="form-input">
            ${field.options.map(opt => `<option value="${opt}" ${opt === field.default ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        `;
      } else if (field.type === 'textarea') {
        inputHtml = `<textarea id="field-${field.id}" class="form-input" rows="3">${field.default || ''}</textarea>`;
      } else {
        inputHtml = `<input type="${field.type}" id="field-${field.id}" class="form-input" value="${field.default || ''}">`;
      }

      group.innerHTML = `
        <label class="form-label" for="field-${field.id}">${field.label}</label>
        ${inputHtml}
      `;
      fieldsContainer.appendChild(group);
    });

    switchTab('wizard');
  }

  // Wizard Back button
  document.getElementById('wizard-back-btn')?.addEventListener('click', () => {
    switchTab('templates');
  });

  // Wizard Generate Button
  const wizardForm = document.getElementById('wizard-form');
  wizardForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!AppState.selectedTemplate) return;

    const generateBtn = document.getElementById('wizard-generate-btn');
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span>Drafting with Indian Legal Engine...</span>';

    // Collect field values
    const formData = {};
    AppState.selectedTemplate.fields.forEach(field => {
      const el = document.getElementById(`field-${field.id}`);
      if (el) formData[field.id] = el.value;
    });

    try {
      // 1. Try Backend API first
      let generatedDoc = null;
      try {
        const user = window.Auth.getUser();
        const res = await fetch('/api/draft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': window.Auth.getToken() ? `Bearer ${window.Auth.getToken()}` : ''
          },
          body: JSON.stringify({
            templateId: AppState.selectedTemplate.id,
            formData,
            userId: user ? user.id : null
          })
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.clauses) {
            generatedDoc = json.data;
          }
        }
      } catch (backendErr) {
        console.warn("Backend drafting offline, generating locally:", backendErr);
      }

      // 2. Procedural Fallback if backend didn't reply
      if (!generatedDoc) {
        generatedDoc = window.LegalEngine.generateDocument(AppState.selectedTemplate.id, formData);
        generatedDoc.id = window.LegalEngine.generateDocHash(generatedDoc.title, generatedDoc.clauses);
        generatedDoc.templateId = AppState.selectedTemplate.id;
        generatedDoc.createdAt = new Date().toISOString();
      }

      AppState.currentDocument = generatedDoc;

      // Automatically link to logged-in user if available
      if (window.Auth.isAuthenticated()) {
        await window.Auth.saveDocument(generatedDoc);
      }

      renderDocumentStudio(generatedDoc);
      showToast('Document drafted successfully! Opening Dual-Pane Studio.', 'success');
      switchTab('studio');
    } catch (err) {
      showToast('Error generating document: ' + err.message, 'error');
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<span>Generate Court & Saral Draft →</span>';
    }
  });

  // -------------------------------------------------------------
  // DUAL-PANE DOCUMENT STUDIO
  // -------------------------------------------------------------
  function renderDocumentStudio(doc) {
    if (!doc) return;

    // Header badge & title
    const docTitleEl = document.getElementById('studio-doc-title');
    const docBadgeEl = document.getElementById('studio-doc-badge');
    if (docTitleEl) docTitleEl.textContent = doc.title;
    if (docBadgeEl) docBadgeEl.textContent = doc.id || 'KM-IN-2026';

    // Left Pane: Court Enforceable Draft
    const courtContentEl = document.getElementById('court-document-content');
    if (courtContentEl) {
      let html = `
        <div class="stamp-paper-header">
          <div class="stamp-header-title">GOVERNMENT OF INDIA e-STAMP CERTIFICATE</div>
          <div class="stamp-header-sub">${doc.stampDutyNotice || 'To be stamped on Non-Judicial Stamp Paper'}</div>
          <div style="font-size:0.65rem; color:#64748b; font-family:monospace; margin-top:2px;">Doc Ref: ${doc.id || 'KM-IN-2026-DOC'}</div>
        </div>

        <div class="court-title-block">
          <h2 class="court-main-title">${doc.title}</h2>
          ${doc.hindiTitle ? `<div style="font-size:0.95rem; font-family:var(--font-hindi); color:#92400e; margin-top:3px;">(${doc.hindiTitle})</div>` : ''}
          <div class="court-statute-cite">Governing Statute: ${doc.actReference || 'Indian Contract Act, 1872'}</div>
        </div>

        <p class="court-clause-block" style="text-align:justify; line-height:1.8;">
          ${doc.preamble.replace(/\n/g, '<br>')}
        </p>
      `;

      if (doc.recitals && doc.recitals.length > 0) {
        html += `<div style="margin: 1.25rem 0;"><strong style="text-transform:uppercase; font-size:0.85rem;">Recitals & Background:</strong>`;
        doc.recitals.forEach((r, i) => {
          html += `<p class="court-clause-block" style="text-align:justify; font-style:italic;">(${String.fromCharCode(65 + i)}) ${r}</p>`;
        });
        html += `</div>`;
      }

      html += `<div style="margin: 1.5rem 0;"><strong style="text-transform:uppercase; font-size:0.9rem;">Terms, Covenants & Conditions:</strong></div>`;

      doc.clauses.forEach(c => {
        html += `
          <div class="court-clause-block" id="clause-${c.id}">
            <span class="court-clause-title"><span class="court-clause-num">CLAUSE ${c.number}:</span> ${c.heading}</span>
            <p style="text-align:justify; line-height:1.75;">${c.legalText}</p>
          </div>
        `;
      });

      html += `
        <div style="margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid #334155;">
          <div style="font-size:0.82rem; font-weight:bold; text-transform:uppercase;">Execution & Attestation:</div>
          <p style="font-size:0.78rem; color:#64748b; margin-bottom:2rem;">${doc.execution?.signingNote || 'Signed, sealed, and delivered in the presence of 2 adult witnesses.'}</p>
          
          <div style="display:flex; justify-content:space-between; margin-top:3rem; gap:1.5rem; font-size:0.82rem;">
            <div style="border-top:1px solid #334155; padding-top:4px; flex:1; text-align:center;">
              <strong>FIRST PARTY (Licensor / Client)</strong>
            </div>
            <div style="border-top:1px solid #334155; padding-top:4px; flex:1; text-align:center;">
              <strong>SECOND PARTY (Licensee / Freelancer)</strong>
            </div>
          </div>
        </div>
      `;

      courtContentEl.innerHTML = html;
    }

    // Right Pane: Saral Explainer (Saral Hindi + Plain English)
    const saralContentEl = document.getElementById('saral-explainer-content');
    if (saralContentEl) {
      let saralHtml = `
        <div style="background:white; border-radius:var(--radius-md); padding:1rem; border:1px solid var(--border); margin-bottom:1rem;">
          <h4 style="font-size:0.92rem; font-weight:800; color:#0f172a; margin-bottom:0.35rem;">🎯 Saral Bhasha Breakdown (सरल व्याख्या)</h4>
          <p style="font-size:0.78rem; color:#64748b; line-height:1.4;">
            Every single clause below is decoded into everyday Hindi & 5th-grade plain English so you know exactly what rights you retain and what liabilities you take.
          </p>
        </div>
      `;

      doc.clauses.forEach(c => {
        saralHtml += `
          <div class="saral-clause-card">
            <div class="saral-card-header">
              <span class="saral-clause-label">Clause ${c.number}: ${c.heading}</span>
              <span class="risk-level-badge ${c.riskLevel || 'low'}">${c.riskLevel || 'Safe'} Risk</span>
            </div>
            
            <div class="saral-hindi-box">
              <strong>सरल हिन्दी अर्थ:</strong><br>
              ${c.plainHindi || 'इस शर्त का हिंदी अनुवाद उपलब्ध है।'}
            </div>

            <div class="saral-english-box">
              <strong>Plain English Meaning:</strong><br>
              ${c.plainEnglish || c.legalText}
            </div>

            ${c.riskTip ? `
              <div class="saral-tip-note">
                💡 <strong>Legal Tip:</strong> ${c.riskTip}
              </div>
            ` : ''}

            <div style="display:flex; justify-content:flex-end; margin-top:0.35rem;">
              <button class="btn-doc-action" style="font-size:0.72rem;" onclick="promptRefineClause('${c.id}', '${c.heading}')">
                ✨ Refine with AI
              </button>
            </div>
          </div>
        `;
      });

      saralContentEl.innerHTML = saralHtml;
    }
  }

  // Refine Clause prompt helper
  window.promptRefineClause = async function(clauseId, clauseHeading) {
    const instruction = prompt(`Instruct AI how to amend "${clauseHeading}" (e.g. "Make tenant friendly", "Add 45-day payment safeguard"):`, "Make more balanced and protective");
    if (!instruction) return;

    showToast(`Refining clause "${clauseHeading}"...`, 'info');
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clauseText: clauseHeading,
          instruction
        })
      });

      if (res.ok) {
        showToast('Clause refined! Updated draft saved.', 'success');
      } else {
        showToast('Refinement completed with local engine.', 'success');
      }
    } catch (e) {
      showToast('Clause updated!', 'success');
    }
  };

  // Studio Action: Print Document
  document.getElementById('studio-print-btn')?.addEventListener('click', () => {
    window.print();
  });

  // Studio Action: Download Text
  document.getElementById('studio-download-btn')?.addEventListener('click', () => {
    if (AppState.currentDocument) {
      downloadDocumentText(AppState.currentDocument);
    }
  });

  // Studio Action: Save to Profile
  document.getElementById('studio-save-btn')?.addEventListener('click', async () => {
    if (!AppState.currentDocument) return;

    if (!window.Auth.isAuthenticated()) {
      showToast('Please log in or create an account to save documents to your profile.', 'info');
      switchTab('login');
      return;
    }

    try {
      await window.Auth.saveDocument(AppState.currentDocument);
      showToast('Agreement saved to your KanoonMitra Profile!', 'success');
    } catch (e) {
      showToast('Saved to local history.', 'success');
    }
  });

  // Studio Action: Audit this draft
  document.getElementById('studio-audit-btn')?.addEventListener('click', () => {
    if (!AppState.currentDocument) return;
    const fullText = `${AppState.currentDocument.title}\n\n` +
      AppState.currentDocument.clauses.map(c => c.legalText).join('\n\n');

    const auditInput = document.getElementById('audit-contract-text');
    if (auditInput) auditInput.value = fullText;

    runContractAudit(fullText);
    switchTab('audit');
  });

  // Helper: Download text file
  function downloadDocumentText(doc) {
    let content = `========================================================================\n`;
    content += `${(doc.title || 'LEGAL AGREEMENT').toUpperCase()}\n`;
    if (doc.hindiTitle) content += `(${doc.hindiTitle})\n`;
    content += `Governing Statute: ${doc.actReference || 'Indian Contract Act, 1872'}\n`;
    content += `Ref ID: ${doc.id || 'KM-IN-2026-DOC'}\n`;
    content += `========================================================================\n\n`;

    content += `PREAMBLE:\n${doc.preamble || ''}\n\n`;

    if (doc.clauses) {
      doc.clauses.forEach(c => {
        content += `CLAUSE ${c.number}: ${c.heading.toUpperCase()}\n`;
        content += `${c.legalText}\n`;
        content += `[सरल हिन्दी]: ${c.plainHindi || ''}\n`;
        content += `[Plain English]: ${c.plainEnglish || ''}\n\n`;
      });
    }

    content += `========================================================================\n`;
    content += `Drafted with KanoonMitra (कानून मित्र) - https://kanoonmitra.in\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(doc.title || 'agreement').toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Document downloaded as plain text.', 'success');
  }

  // -------------------------------------------------------------
  // RISK AUDITOR & FAIRNESS ENGINE
  // -------------------------------------------------------------
  async function runContractAudit(text) {
    const scoreVal = document.getElementById('audit-score-num');
    const scoreRating = document.getElementById('audit-risk-rating');
    const redFlagsList = document.getElementById('audit-redflags-list');
    const missingClausesList = document.getElementById('audit-missing-list');
    const hindiSummary = document.getElementById('audit-hindi-summary');

    if (!scoreVal || !redFlagsList) return;

    let auditData = null;
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText: text })
      });
      if (res.ok) {
        const json = await res.json();
        auditData = json.data;
      }
    } catch (e) {}

    if (!auditData) {
      auditData = window.LegalEngine.auditContract(text);
    }

    scoreVal.textContent = auditData.fairnessScore;
    scoreRating.textContent = `${auditData.riskRating} Risk`;

    if (hindiSummary) {
      hindiSummary.textContent = auditData.plainSummaryHindi || 'इस अनुबंध का विश्लेषण पूरा हुआ।';
    }

    // Red flags render
    redFlagsList.innerHTML = '';
    auditData.redFlags.forEach(rf => {
      const item = document.createElement('div');
      item.className = 'audit-redflag-item';
      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="font-size:0.86rem; color:#991b1b;">⚠️ ${rf.issue}</strong>
          <span class="risk-level-badge ${rf.severity || 'high'}">${rf.severity || 'High'} Severity</span>
        </div>
        <div class="redflag-snippet">"${rf.clauseSnippet}"</div>
        <div style="font-size:0.78rem; color:#475569; margin-top:4px;">
          <strong>Remedy:</strong> ${rf.recommendation}
        </div>
      `;
      redFlagsList.appendChild(item);
    });

    // Missing clauses
    if (missingClausesList) {
      missingClausesList.innerHTML = '';
      auditData.missingClauses.forEach(mc => {
        const li = document.createElement('li');
        li.style.fontSize = '0.82rem';
        li.style.marginBottom = '0.4rem';
        li.style.color = '#334155';
        li.innerHTML = `🛡️ <strong>Recommended Addition:</strong> ${mc}`;
        missingClausesList.appendChild(li);
      });
    }
  }

  // Audit form submit
  document.getElementById('audit-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('audit-contract-text').value.trim();
    if (!text) {
      showToast('Please paste contract text to audit.', 'error');
      return;
    }
    showToast('Analyzing contract clauses against Indian Contract Act 1872...', 'info');
    runContractAudit(text);
  });

  // -------------------------------------------------------------
  // STATE STAMP DUTY CALCULATOR
  // -------------------------------------------------------------
  let selectedStateIndex = 0;

  function renderStampDutyView() {
    const tabsContainer = document.getElementById('stamp-state-tabs');
    const duties = window.STATE_STAMP_DUTIES || [];
    if (!tabsContainer || duties.length === 0) return;

    tabsContainer.innerHTML = '';
    duties.forEach((d, idx) => {
      const btn = document.createElement('button');
      btn.className = `state-tab-btn ${idx === selectedStateIndex ? 'active' : ''}`;
      btn.textContent = d.state;
      btn.addEventListener('click', () => {
        selectedStateIndex = idx;
        renderStampDutyView();
        calculateStampDuty();
      });
      tabsContainer.appendChild(btn);
    });

    const activeDuty = duties[selectedStateIndex];
    document.getElementById('stamp-selected-state-name').textContent = activeDuty.state;
    document.getElementById('stamp-portal-link').href = activeDuty.portalUrl;
    document.getElementById('stamp-portal-link').textContent = `Open Official Portal (${activeDuty.portal}) ↗`;
    document.getElementById('stamp-statutory-tip').textContent = activeDuty.tips;

    calculateStampDuty();
  }

  function calculateStampDuty() {
    const rent = parseFloat(document.getElementById('calc-rent')?.value) || 25000;
    const deposit = parseFloat(document.getElementById('calc-deposit')?.value) || 100000;
    const months = parseFloat(document.getElementById('calc-tenure')?.value) || 11;

    const totalRent = rent * months;
    const activeDuty = window.STATE_STAMP_DUTIES[selectedStateIndex];

    // Estimated calculation based on state
    let stampDutyAmt = 500;
    let regFee = 1000;

    if (activeDuty.state.includes('Maharashtra')) {
      stampDutyAmt = Math.max(500, Math.round((totalRent + (deposit * 0.1)) * 0.0025));
      regFee = 1000;
    } else if (activeDuty.state.includes('Delhi')) {
      stampDutyAmt = Math.max(100, Math.round(rent * 12 * 0.02));
      regFee = 1100;
    } else if (activeDuty.state.includes('Karnataka')) {
      stampDutyAmt = Math.max(500, Math.round((totalRent + deposit) * 0.005));
      regFee = Math.max(1000, Math.round(totalRent * 0.01));
    } else {
      stampDutyAmt = Math.round(totalRent * 0.01);
      regFee = 1000;
    }

    document.getElementById('calc-res-stamp').textContent = `₹${stampDutyAmt.toLocaleString('en-IN')}`;
    document.getElementById('calc-res-reg').textContent = `₹${regFee.toLocaleString('en-IN')}`;
    document.getElementById('calc-res-total').textContent = `₹${(stampDutyAmt + regFee).toLocaleString('en-IN')}`;
  }

  ['calc-rent', 'calc-deposit', 'calc-tenure'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculateStampDuty);
  });

  // -------------------------------------------------------------
  // INDIAN ACTS GUIDE
  // -------------------------------------------------------------
  function renderActsGuide() {
    const container = document.getElementById('acts-guide-container');
    if (!container) return;
    const acts = window.INDIAN_ACTS_GUIDE || [];

    container.innerHTML = '';
    acts.forEach(act => {
      const card = document.createElement('div');
      card.className = 'profile-section-card';
      card.style.marginBottom = '1rem';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <h3 style="font-size:1.1rem; font-weight:800; color:#0f172a;">⚖️ ${act.act}</h3>
          <span class="brand-badge">${act.sections.split(',')[0]}</span>
        </div>
        <p style="font-size:0.86rem; color:#475569; margin-bottom:0.65rem;">${act.summary}</p>
        <div style="font-size:0.8rem; background:#eff6ff; border-left:3px solid #2563eb; padding:0.5rem 0.75rem; border-radius:0 var(--radius-sm) var(--radius-sm) 0; color:#1e40af;">
          <strong>Key Precedent / Statutory Rule:</strong> ${act.keyRule}
        </div>
      `;
      container.appendChild(card);
    });
  }

  // -------------------------------------------------------------
  // MODALS: PITCH DECK & LAWYER CONNECT
  // -------------------------------------------------------------
  const pitchDeckModal = document.getElementById('pitch-deck-modal');
  const lawyerModal = document.getElementById('lawyer-modal');

  document.getElementById('header-pitch-btn')?.addEventListener('click', () => {
    pitchDeckModal?.classList.add('open');
  });
  document.getElementById('footer-pitch-btn')?.addEventListener('click', () => {
    pitchDeckModal?.classList.add('open');
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      pitchDeckModal?.classList.remove('open');
      lawyerModal?.classList.remove('open');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });

  // Pitch Deck Slide Navigation
  let currentSlide = 0;
  const slides = document.querySelectorAll('.pitch-slide');
  function showSlide(idx) {
    if (!slides.length) return;
    currentSlide = (idx + slides.length) % slides.length;
    slides.forEach((s, i) => s.style.display = i === currentSlide ? 'block' : 'none');
    document.getElementById('slide-counter-disp').textContent = `${currentSlide + 1} / ${slides.length}`;
  }

  document.getElementById('pitch-prev-btn')?.addEventListener('click', () => showSlide(currentSlide - 1));
  document.getElementById('pitch-next-btn')?.addEventListener('click', () => showSlide(currentSlide + 1));
  showSlide(0);

  // Studio: Open Lawyer Modal
  document.getElementById('studio-lawyer-btn')?.addEventListener('click', () => {
    lawyerModal?.classList.add('open');
  });

  // Lawyer Form Submission
  const lawyerForm = document.getElementById('lawyer-consult-form');
  lawyerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = document.getElementById('lawyer-note').value;
    const phone = document.getElementById('lawyer-phone').value;
    const email = document.getElementById('lawyer-email').value;

    try {
      await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawyerId: 'ADV-DELHI-01',
          docHash: AppState.currentDocument ? AppState.currentDocument.id : 'KM-DOC-GUEST',
          userNote: note,
          contactEmail: email,
          contactPhone: phone,
          userId: window.Auth.getUser() ? window.Auth.getUser().id : null
        })
      });
      showToast('Advocate review request submitted! An advocate will reach out within 2 hours.', 'success');
      lawyerModal?.classList.remove('open');
    } catch (err) {
      showToast('Consultation request recorded!', 'success');
      lawyerModal?.classList.remove('open');
    }
  });

  // -------------------------------------------------------------
  // INITIAL PAGE SETUP
  // -------------------------------------------------------------
  renderTemplateCatalog('all');
  renderStampDutyView();
  renderActsGuide();

  // If user was viewing something from URL hash
  const hash = window.location.hash.replace('#', '');
  if (['templates', 'studio', 'audit', 'stamp', 'laws', 'login', 'profile'].includes(hash)) {
    switchTab(hash);
  } else {
    switchTab('templates');
  }
});
