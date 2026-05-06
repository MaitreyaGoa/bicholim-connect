// ============================================================
// BICHOLIM CONNECT — Frontend Configuration
// ============================================================
// IMPORTANT: Apps Script POST requests cause CORS errors in browsers.
// Solution: ALL requests (including form submissions) use GET with
// URL parameters. Apps Script GET requests are CORS-friendly.
// ============================================================

const BC_CONFIG = {
  // ← PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
  API_URL: 'https://script.google.com/macros/s/AKfycbwcXr0bCuLYAoXJWNCOtFHtU8TwJs-BcX2rD0eait1o0W5P1fkYp7oznQVF3CoRqPPN0g/exec',

  APP_NAME:      'Bicholim Connect',
  LOCATION:      'Bicholim, Goa',
  CONTACT_PHONE: '7358425108',

  CATEGORIES: [
    { id: 'emergency',    label: 'Emergency',      icon: '🚨' },
    { id: 'home',         label: 'Home Services',  icon: '🏠' },
    { id: 'repairs',      label: 'Repairs',        icon: '🔧' },
    { id: 'transport',    label: 'Transport',      icon: '🚗' },
    { id: 'food',         label: 'Food & Daily',   icon: '🍔' },
    { id: 'education',    label: 'Education',      icon: '🎓' },
    { id: 'professional', label: 'Professional',   icon: '💼' },
    { id: 'other',        label: 'Other',          icon: '🧰' }
  ],

  // ── ALL requests go as GET with URL params (CORS-safe) ──
  async call(action, params = {}) {
    const url = new URL(this.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
    const res = await fetch(url.toString(), { redirect: 'follow' });
    if (!res.ok) throw new Error('Network error: ' + res.status);
    return res.json();
  },

  // Kept for backwards compat — both now use GET
  async get(action, params = {}) {
    return this.call(action, params);
  },

  // POST-like actions are sent as GET with all fields as params
  async post(action, data = {}) {
    return this.call(action, data);
  },

  // Session helpers
  getToken()  { return localStorage.getItem('bc_admin_token'); },
  setToken(t) { localStorage.setItem('bc_admin_token', t); },
  clearToken(){ localStorage.removeItem('bc_admin_token'); },

  async checkAdminSession() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await this.call('verifySession', { token });
      return res.valid === true;
    } catch(e) { return false; }
  }
};
