// KanoonMitra User Authentication & Profile Management System
// Zero Vite Dependency | Full-Stack Express Connected

window.Auth = {
  currentUser: null,
  token: null,
  listeners: [],

  init: function() {
    // Load persisted session
    try {
      const storedUser = localStorage.getItem('km_user');
      const storedToken = localStorage.getItem('km_token');
      if (storedUser && storedToken) {
        this.currentUser = JSON.parse(storedUser);
        this.token = storedToken;
      }
    } catch (e) {
      console.error("Auth init storage error:", e);
      this.clearSession();
    }

    // Try refreshing profile from backend if online
    if (this.currentUser && this.currentUser.id) {
      this.fetchCurrentProfile().catch(() => {});
    }

    this.notifyListeners();
  },

  onStateChange: function(fn) {
    this.listeners.push(fn);
    fn(this.currentUser);
  },

  notifyListeners: function() {
    this.listeners.forEach(fn => {
      try { fn(this.currentUser); } catch (e) { console.error(e); }
    });
  },

  isAuthenticated: function() {
    return !!this.currentUser;
  },

  getUser: function() {
    return this.currentUser;
  },

  getToken: function() {
    return this.token;
  },

  setSession: function(user, token) {
    this.currentUser = user;
    this.token = token || `${user.id}:token`;
    localStorage.setItem('km_user', JSON.stringify(user));
    localStorage.setItem('km_token', this.token);
    this.notifyListeners();
  },

  clearSession: function() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('km_user');
    localStorage.removeItem('km_token');
    this.notifyListeners();
  },

  // 1. Login with Email & Password
  login: async function(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      this.setSession(data.user, data.token);
      return data.user;
    } catch (err) {
      // Offline fallback: check seeded accounts in localStorage
      const fallbackUser = this.getFallbackUser(email, password);
      if (fallbackUser) {
        this.setSession(fallbackUser, `${fallbackUser.id}:offline-token`);
        return fallbackUser;
      }
      throw err;
    }
  },

  // 2. Register New User Account
  register: async function(userData) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      this.setSession(data.user, data.token);
      return data.user;
    } catch (err) {
      // Offline fallback support
      const newUser = {
        id: `KM-USER-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role || 'citizen',
        roleTitle: userData.role === 'lawyer' ? 'Advocate (अधिवक्ता)' : userData.role === 'msme' ? 'MSME Owner' : userData.role === 'freelancer' ? 'Freelancer' : 'Citizen (नागरिक)',
        city: userData.city || 'India',
        organization: userData.organization || '',
        barCouncilId: userData.barCouncilId || '',
        createdAt: new Date().toISOString()
      };
      this.setSession(newUser, `${newUser.id}:offline-token`);
      return newUser;
    }
  },

  // 3. Quick 1-Click Demo Login
  loginDemo: async function(role = 'citizen') {
    const demoCredentials = {
      citizen: { email: 'pawan@kanoonmitra.in', password: 'password123' },
      freelancer: { email: 'ananya@creatives.in', password: 'password123' },
      msme: { email: 'vikram@zentech.in', password: 'password123' },
      lawyer: { email: 'advocate.sharma@delhibar.in', password: 'password123' }
    };

    const cred = demoCredentials[role] || demoCredentials.citizen;
    return await this.login(cred.email, cred.password);
  },

  // 4. Fetch Current Profile
  fetchCurrentProfile: async function() {
    if (!this.currentUser) return null;
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'X-User-Id': this.currentUser.id
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          this.currentUser = { ...this.currentUser, ...data.user };
          localStorage.setItem('km_user', JSON.stringify(this.currentUser));
          this.notifyListeners();
          return this.currentUser;
        }
      }
    } catch (e) {
      // Backend unavailable; keep cached user
    }
    return this.currentUser;
  },

  // 5. Update Profile
  updateProfile: async function(updates) {
    if (!this.currentUser) throw new Error("Not logged in");
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'X-User-Id': this.currentUser.id
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      this.currentUser = data.user;
      localStorage.setItem('km_user', JSON.stringify(this.currentUser));
      this.notifyListeners();
      return data.user;
    } catch (e) {
      this.currentUser = { ...this.currentUser, ...updates };
      localStorage.setItem('km_user', JSON.stringify(this.currentUser));
      this.notifyListeners();
      return this.currentUser;
    }
  },

  // 6. Fetch User's Saved Legal Documents
  getUserDocuments: async function() {
    if (!this.currentUser) return [];
    try {
      const res = await fetch('/api/user/documents', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'X-User-Id': this.currentUser.id
        }
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (e) {
      console.warn("Could not fetch user documents from server, checking local history:", e);
    }

    // Local fallback: retrieve documents saved locally
    try {
      const localDocs = JSON.parse(localStorage.getItem('km_user_documents') || '[]');
      return localDocs.filter(d => !d.userId || d.userId === this.currentUser.id);
    } catch (e) {
      return [];
    }
  },

  // 7. Save Document for Current User
  saveDocument: async function(docData) {
    const docWithUser = {
      ...docData,
      userId: this.currentUser ? this.currentUser.id : null,
      savedAt: new Date().toISOString()
    };

    // Save to local storage cache first
    try {
      const existing = JSON.parse(localStorage.getItem('km_user_documents') || '[]');
      existing.unshift(docWithUser);
      localStorage.setItem('km_user_documents', JSON.stringify(existing));
    } catch (e) {}

    // Save to backend API
    try {
      const res = await fetch('/api/user/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'X-User-Id': this.currentUser ? this.currentUser.id : ''
        },
        body: JSON.stringify(docWithUser)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn("Server save error:", e);
    }
    return docWithUser;
  },

  // 8. Delete Document
  deleteDocument: async function(docId) {
    // Delete from local cache
    try {
      let existing = JSON.parse(localStorage.getItem('km_user_documents') || '[]');
      existing = existing.filter(d => d.id !== docId);
      localStorage.setItem('km_user_documents', JSON.stringify(existing));
    } catch (e) {}

    // Delete from backend API
    try {
      await fetch(`/api/user/documents/${docId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'X-User-Id': this.currentUser ? this.currentUser.id : ''
        }
      });
    } catch (e) {}
    return true;
  },

  // 9. Fetch User Stats
  getUserStats: async function() {
    if (!this.currentUser) return { totalDocuments: 0, totalAudits: 0, totalConsultations: 0 };
    try {
      const res = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'X-User-Id': this.currentUser.id
        }
      });
      if (res.ok) {
        const json = await res.json();
        return json.stats;
      }
    } catch (e) {}

    const docs = await this.getUserDocuments();
    return {
      totalDocuments: docs.length,
      totalAudits: 1,
      totalConsultations: 0
    };
  },

  // 10. Logout
  logout: function() {
    this.clearSession();
  },

  // Helper: Offline Fallback Users
  getFallbackUser: function(email, password) {
    const list = [
      {
        id: 'KM-USER-001',
        name: 'Pawan Kumar',
        email: 'pawan@kanoonmitra.in',
        phone: '+91 98765 43210',
        password: 'password123',
        role: 'citizen',
        roleTitle: 'Citizen / Tenant (नागरिक)',
        city: 'Bengaluru, Karnataka',
        bio: 'Looking for verified residential rent agreements and personal affidavits.'
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
        bio: 'Registered MSME owner relying on Section 16 MSMED Act 45-day payment protections.'
      },
      {
        id: 'KM-USER-004',
        name: 'Advocate Rajesh Sharma',
        email: 'advocate.sharma@delhibar.in',
        phone: '+91 98111 23456',
        password: 'password123',
        role: 'lawyer',
        roleTitle: 'Bar Council Verified Advocate (अधिवक्ता)',
        barCouncilId: 'D/1482/2012',
        city: 'New Delhi, Delhi',
        bio: 'Senior contract attorney specializing in ICA 1872 litigation and commercial arbitration.'
      }
    ];

    const match = list.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (match && match.password === password) {
      const { password: _, ...safe } = match;
      return safe;
    }
    return null;
  }
};
