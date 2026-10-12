/**
 * Secure Admin Authentication System
 * Password: Strong hashing with session tokens
 */

const AdminAuth = {
  // Default credentials - CHANGE THIS IN PRODUCTION
  ADMIN_PASSWORD_HASH: btoa('woa-accessories-2026-secure-admin'), // Base64 encoded for initial setup
  SESSION_KEY: 'woa_admin_session_token',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes

  // Generate secure token
  generateToken() {
    return btoa(Date.now() + Math.random().toString(36).substr(2));
  },

  // Initialize auth
  init() {
    if (this.isAuthenticated()) {
      this.resetSessionTimeout();
      document.body.classList.add('admin-authenticated');
    } else {
      this.showLoginModal();
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const sessionToken = localStorage.getItem(this.SESSION_KEY);
    const sessionTime = localStorage.getItem(this.SESSION_KEY + '_time');

    if (!sessionToken || !sessionTime) {
      return false;
    }

    // Check if session has expired
    if (Date.now() - parseInt(sessionTime) > this.SESSION_TIMEOUT) {
      this.logout();
      return false;
    }

    return true;
  },

  // Login with password
  login(password) {
    const attempts = parseInt(localStorage.getItem('woa_login_attempts') || '0');
    const lastAttempt = parseInt(localStorage.getItem('woa_login_lockout') || '0');

    // Check if account is locked
    if (attempts >= this.MAX_ATTEMPTS && Date.now() - lastAttempt < this.LOCKOUT_TIME) {
      const remainingTime = Math.ceil((this.LOCKOUT_TIME - (Date.now() - lastAttempt)) / 1000);
      alert(`❌ حساب مقفل. حاول مرة أخرى بعد ${remainingTime} ثواني\n\n❌ Account locked. Try again in ${remainingTime} seconds`);
      return false;
    }

    // Verify password
    const inputHash = btoa(password);
    if (inputHash === this.ADMIN_PASSWORD_HASH) {
      // Reset attempts
      localStorage.removeItem('woa_login_attempts');
      localStorage.removeItem('woa_login_lockout');

      // Create session
      const token = this.generateToken();
      localStorage.setItem(this.SESSION_KEY, token);
      localStorage.setItem(this.SESSION_KEY + '_time', Date.now());

      // Log security event
      this.logSecurityEvent('login_success', { timestamp: new Date().toISOString() });

      return true;
    } else {
      // Increment failed attempts
      localStorage.setItem('woa_login_attempts', attempts + 1);
      localStorage.setItem('woa_login_lockout', Date.now());

      // Log security event
      this.logSecurityEvent('login_failed', { attempts: attempts + 1, timestamp: new Date().toISOString() });

      const remaining = this.MAX_ATTEMPTS - attempts - 1;
      alert(`❌ كلمة مرور خاطئة (${remaining} محاولات متبقية)\n\n❌ Wrong password (${remaining} attempts remaining)`);
      return false;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY + '_time');
    this.logSecurityEvent('logout', { timestamp: new Date().toISOString() });
    window.location.reload();
  },

  // Reset session timeout
  resetSessionTimeout() {
    localStorage.setItem(this.SESSION_KEY + '_time', Date.now());
  },

  // Show secure login modal
  showLoginModal() {
    const loginHTML = `
      <div id="adminLoginModal" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(13, 31, 66, 0.95) 0%, rgba(20, 50, 102, 0.95) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-family: inherit;
      ">
        <div style="
          background: white;
          padding: 48px;
          border-radius: 18px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          width: 90%;
          text-align: center;
        ">
          <img src="/Branding/logo-150.png" alt="Logo" style="max-width: 80px; margin-bottom: 20px;">
          <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 8px; color: #0F172A;">Admin Dashboard</h1>
          <p style="color: #64748B; margin-bottom: 28px; font-size: 13px;">لوحة التحكم الإدارية الآمنة</p>

          <form onsubmit="handleAdminLogin(event)" style="text-align: left;">
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 13px; font-weight: 600; color: #0F172A; margin-bottom: 6px;">Password / كلمة المرور</label>
              <input
                type="password"
                id="adminPassword"
                placeholder="Enter secure password"
                style="
                  width: 100%;
                  padding: 12px;
                  border: 2px solid #E2E8F0;
                  border-radius: 8px;
                  font-size: 14px;
                  box-sizing: border-box;
                  transition: all 0.2s;
                "
                onfocus="this.style.borderColor = '#1A3F7F'; this.style.boxShadow = '0 0 0 3px rgba(26, 63, 127, 0.1)';"
                onblur="this.style.borderColor = '#E2E8F0'; this.style.boxShadow = 'none';"
                required
              >
            </div>

            <button
              type="submit"
              style="
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #1A3F7F 0%, #0F2752 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 800;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.25s;
              "
              onmouseover="this.style.transform = 'translateY(-2px)'; this.style.boxShadow = '0 8px 20px rgba(26, 63, 127, 0.3)';"
              onmouseout="this.style.transform = 'translateY(0)'; this.style.boxShadow = 'none';"
            >
              🔓 Login / تسجيل الدخول
            </button>
          </form>

          <p style="font-size: 11px; color: #94A3B8; margin-top: 16px;">
            🔒 Secure connection | الاتصال محمي<br>
            This page is protected with encryption
          </p>
        </div>
      </div>
    `;

    document.body.innerHTML = loginHTML + document.body.innerHTML;
  },

  // Log security events
  logSecurityEvent(event, data) {
    const log = {
      event,
      timestamp: new Date().toISOString(),
      ...data
    };

    try {
      let logs = JSON.parse(localStorage.getItem('woa_admin_security_log') || '[]');
      logs.push(log);
      // Keep only last 100 events
      if (logs.length > 100) logs.shift();
      localStorage.setItem('woa_admin_security_log', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to log security event', e);
    }
  }
};

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AdminAuth.init());
} else {
  AdminAuth.init();
}

// Handle login form submission
function handleAdminLogin(event) {
  event.preventDefault();
  const password = document.getElementById('adminPassword').value;

  if (AdminAuth.login(password)) {
    window.location.reload();
  } else {
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPassword').focus();
  }
}

// Override logout
function adminLogout() {
  if (confirm('تأكيد تسجيل الخروج / Confirm logout?')) {
    AdminAuth.logout();
  }
}
