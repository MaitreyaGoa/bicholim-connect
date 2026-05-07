// ============================================================
// BICHOLIM CONNECT — Frontend Configuration
// ============================================================
// Uses JSONP instead of fetch() to bypass CORS issues with
// Google Apps Script on all browsers (desktop + mobile).
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

  // ── JSONP call — works on ALL browsers, no CORS issues ──
  call(action, params = {}) {
    return new Promise((resolve, reject) => {
      // Unique callback name
      const cbName = '_bc_cb_' + Date.now() + '_' + Math.floor(Math.random() * 10000);

      // Timeout after 15 seconds
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('Request timed out. Check your API URL in config.js'));
      }, 15000);

      function cleanup() {
        clearTimeout(timer);
        delete window[cbName];
        const el = document.getElementById(cbName);
        if (el) el.remove();
      }

      // Global callback Apps Script will call
      window[cbName] = function(data) {
        cleanup();
        resolve(data);
      };

      // Build URL with all params + callback
      const url = new URL(BC_CONFIG.API_URL);
      url.searchParams.set('action',   action);
      url.searchParams.set('callback', cbName);
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          url.searchParams.set(k, String(v));
        }
      });

      // Inject script tag
      const script  = document.createElement('script');
      script.id     = cbName;
      script.src    = url.toString();
      script.onerror = () => {
        cleanup();
        reject(new Error('Failed to reach API. Check your Apps Script deployment URL.'));
      };
      document.head.appendChild(script);
    });
  },

  // Aliases so existing page code works unchanged
  async get(action, params = {})  { return this.call(action, params); },
  async post(action, params = {}) { return this.call(action, params); },

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
