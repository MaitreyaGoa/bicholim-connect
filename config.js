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
    { id: 'emergency',     label: 'Emergency & Safety',               icon: '🚨', count: 12, services: ['Ambulance Services','Hospitals','Clinics','Pharmacies','Police Station','Fire Brigade','Blood Bank','Veterinary Emergency','Disaster Management Help','Women Helpline','Child Helpline','24x7 Medical Stores'] },
    { id: 'healthcare',    label: 'Healthcare & Wellness',            icon: '🏥', count: 12, services: ['General Physicians','Dentists','Eye Specialists','Physiotherapists','Diagnostic Labs','X-Ray Centers','Nursing Services','Home Healthcare','Ayurvedic Clinics','Yoga Centers','Fitness Trainers','Mental Health Counselors'] },
    { id: 'home',          label: 'Home Maintenance & Construction',  icon: '🏠', count: 16, services: ['Electricians','Plumbers','Carpenters','Painters','Welders','Tile Workers','Mason Contractors','Waterproofing Services','Pest Control','House Cleaning','Sofa Cleaning','Water Tank Cleaning','CCTV Installation','Interior Designers','Modular Kitchen Services','Furniture Repair'] },
    { id: 'repairs',       label: 'Appliance & Technical Repairs',    icon: '🔧', count: 12, services: ['AC Repair','Refrigerator Repair','Washing Machine Repair','TV Repair','Mobile Repair','Laptop Repair','Computer Repair','Printer Repair','RO Water Purifier Service','Inverter Repair','Solar Panel Maintenance','Generator Repair'] },
    { id: 'transport',     label: 'Vehicle & Transport',              icon: '🚗', count: 12, services: ['Taxi Services','Auto Rickshaw Services','Bike Rental','Car Rental','School Bus Services','Driving Schools','Bike Repair Garages','Car Garages','Tyre Puncture Repair','Car Washing Centers','Towing Services','Fuel Stations'] },
    { id: 'food',          label: 'Food & Daily Needs',               icon: '🍔', count: 14, services: ['Grocery Stores','Supermarkets','Vegetable Vendors','Fruit Shops','Bakeries','Restaurants','Fast Food Centers','Tiffin Services','Catering Services','Sweet Shops','Meat & Fish Shops','Water Can Suppliers','Milk Suppliers','Organic Food Stores'] },
    { id: 'education',     label: 'Education & Learning',             icon: '🎓', count: 12, services: ['Schools','Colleges','Coaching Classes','Tuition Teachers','Computer Institutes','Spoken English Classes','Competitive Exam Coaching','Music Classes','Dance Classes','Art Classes','Library Services','Day Care Centers'] },
    { id: 'professional',  label: 'Professional & Business Services', icon: '💼', count: 10, services: ['Chartered Accountants','Lawyers','Notary Services','Insurance Agents','Real Estate Agents','Document Typing Centers','Xerox & Printing Shops','Internet Service Providers','Courier Services','Travel Agencies'] }
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
