// ============================================================
// BICHOLIM CONNECT — Frontend Configuration
// File: config.js  (shared across all pages)
// ============================================================

const BC_CONFIG = {
  // ← PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE after deploying
  API_URL: 'https://script.google.com/macros/s/https://script.google.com/macros/s/AKfycbwcXr0bCuLYAoXJWNCOtFHtU8TwJs-BcX2rD0eait1o0W5P1fkYp7oznQVF3CoRqPPN0g/exec/exec',

  APP_NAME: 'Bicholim Connect',
  LOCATION: 'Bicholim, Goa',
  CONTACT_PHONE: '7358425108',

  CATEGORIES: [
    { id: 'emergency',    label: 'Emergency',       icon: '🚨' },
    { id: 'home',         label: 'Home Services',   icon: '🏠' },
    { id: 'repairs',      label: 'Repairs',         icon: '🔧' },
    { id: 'transport',    label: 'Transport',       icon: '🚗' },
    { id: 'food',         label: 'Food & Daily',    icon: '🍔' },
    { id: 'education',    label: 'Education',       icon: '🎓' },
    { id: 'professional', label: 'Professional',    icon: '💼' },
    { id: 'other',        label: 'Other',           icon: '🧰' }
  ],

  // API helpers
  async get(action, params = {}) {
    const url = new URL(this.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString());
    return res.json();
  },

  async post(action, data = {}) {
    const res = await fetch(this.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data })
    });
    return res.json();
  },

  // Session helpers
  getToken()        { return localStorage.getItem('bc_admin_token'); },
  setToken(t)       { localStorage.setItem('bc_admin_token', t); },
  clearToken()      { localStorage.removeItem('bc_admin_token'); },

  async checkAdminSession() {
    const token = this.getToken();
    if (!token) return false;
    const res = await this.get('verifySession', { token });
    return res.valid === true;
  }
};
