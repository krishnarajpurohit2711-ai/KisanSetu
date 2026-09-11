const AUTH_KEY = 'kisansetu_auth';
const API_BASE = 'http://127.0.0.1:8000/api/v1';
const DEMO_OTP = '123456';
const DEMO_PASSWORD = 'demo123';
const DEMO_MODE = false;

const demoAccounts = {
  'farmer@demo.com': { password: DEMO_PASSWORD, role: 'FARMER', name: 'Ramesh', mobile: '9876543210' },
  'buyer@demo.com': { password: DEMO_PASSWORD, role: 'BUYER', name: 'Priya', mobile: '9876543211' },
  'rajesh@demo.com': { password: DEMO_PASSWORD, role: 'BUYER', name: 'Rajesh', mobile: '9876543213' },
  'meera@demo.com': { password: DEMO_PASSWORD, role: 'BUYER', name: 'Meera', mobile: '9876543214' },
  'admin@demo.com': { password: DEMO_PASSWORD, role: 'ADMIN', name: 'Admin', mobile: '9876543212' },
};

const demoByRole = {
  farmer: { email: 'farmer@demo.com', role: 'FARMER', name: 'Ramesh' },
  buyer: { email: 'buyer@demo.com', role: 'BUYER', name: 'Priya' },
  admin: { email: 'admin@demo.com', role: 'ADMIN', name: 'Admin' },
};

const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.hidden = !message;
  el.textContent = message || '';
}

function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveAuth(user, remember) {
  const payload = JSON.stringify(user);
  if (remember) {
    localStorage.setItem(AUTH_KEY, payload);
    sessionStorage.removeItem(AUTH_KEY);
  } else {
    sessionStorage.setItem(AUTH_KEY, payload);
    localStorage.removeItem(AUTH_KEY);
  }
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
}

function redirectForRole(role) {
  if (role === 'FARMER') return 'farmer-dashboard.html';
  if (role === 'BUYER') return 'buyer-dashboard.html';
  return 'admin-dashboard.html';
}

function roleLabel(role) {
  if (role === 'BUYER') return t('common.buyer');
  if (role === 'ADMIN') return t('common.admin');
  return t('common.farmer');
}

function tabRoleToApi(tabRole) {
  if (tabRole === 'buyer') return 'BUYER';
  if (tabRole === 'admin') return 'ADMIN';
  return 'FARMER';
}

function getSelectedTabRole() {
  return document.querySelector('.role-switch .active')?.dataset.role || 'farmer';
}

function looksLikePhone(value) {
  return /^\d{6,12}$/.test(String(value).replace(/\s+/g, ''));
}

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

function normalizeIdentifier(raw) {
  const value = String(raw || '').trim().toLowerCase();
  const phone = digitsOnly(value);
  if ((looksLikePhone(phone) || phone.length === 10) && !value.includes('@')) {
    const match = Object.entries(demoAccounts).find(([, account]) => account.mobile === phone);
    return match ? match[0] : `${phone}@demo.kisansetu`;
  }
  return value;
}

function displayNameFromEmail(email, fallback) {
  if (fallback) return fallback;
  const local = String(email || 'user').split('@')[0];
  return local.replace(/[._-]/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function togglePrefix(input, prefix) {
  if (!input || !prefix) return;
  const value = String(input.value || '').trim();
  prefix.hidden = value.includes('@');
}

function setBusy(button, busy, labelKey) {
  if (!button) return;
  button.disabled = busy;
  const label = button.querySelector('span');
  if (label) label.textContent = t(busy ? 'login.signingIn' : labelKey);
}

function applyRoleCopy(tabRole) {
  const storyKeys = {
    farmer: {
      title: 'login.farmerStoryTitle',
      text: 'login.farmerStoryText',
      quote: 'login.farmerQuote',
      author: 'login.farmerAuthor',
      subtitle: 'login.farmerSubtitle',
    },
    buyer: {
      title: 'login.buyerStoryTitle',
      text: 'login.buyerStoryText',
      quote: 'login.buyerQuote',
      author: 'login.buyerAuthor',
      subtitle: 'login.buyerSubtitle',
    },
    admin: {
      title: 'login.adminStoryTitle',
      text: 'login.adminStoryText',
      quote: 'login.adminQuote',
      author: 'login.adminAuthor',
      subtitle: 'login.adminSubtitle',
    },
  };
  const keys = storyKeys[tabRole] || storyKeys.farmer;
  const title = document.getElementById('story-title');
  const subtitle = document.getElementById('story-subtitle');
  const quote = document.getElementById('story-quote');
  const author = document.getElementById('story-author');
  const cardSubtitle = document.getElementById('card-subtitle');
  if (title) title.innerHTML = t(keys.title);
  if (subtitle) subtitle.textContent = t(keys.text);
  if (quote) quote.textContent = t(keys.quote);
  if (author) author.textContent = t(keys.author);
  if (cardSubtitle) cardSubtitle.textContent = t(keys.subtitle);
}

function setActiveRole(tabRole, { fillEmpty = true } = {}) {
  document.querySelectorAll('.role-switch button').forEach((tab) => {
    const active = tab.dataset.role === tabRole;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  applyRoleCopy(tabRole);
  const demo = demoByRole[tabRole];
  const loginId = document.getElementById('login-id');
  const password = document.getElementById('password');
  if (fillEmpty && loginId && !loginId.value.trim() && demo) loginId.value = demo.email;
  if (fillEmpty && password && !password.value.trim()) password.value = DEMO_PASSWORD;
  togglePrefix(loginId, document.getElementById('id-prefix'));
}

function showView(name) {
  document.querySelectorAll('.auth-view').forEach((view) => {
    view.hidden = view.dataset.view !== name;
  });
  const focusMap = {
    password: '#login-id',
    otp: '#otp-mobile',
    signup: '#signup-name',
    forgot: '#forgot-id',
  };
  requestAnimationFrame(() => document.querySelector(focusMap[name])?.focus());
}

async function loginWithBackend(email, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const profileResponse = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: 'Bearer ' + data.access_token },
    });
    const profile = profileResponse.ok ? await profileResponse.json() : null;
    const local = demoAccounts[email] || {};
    return {
      email: profile?.email || email,
      role: profile?.role || local.role || 'FARMER',
      name: profile?.name || displayNameFromEmail(profile?.email || email, local.name),
      mobile: profile?.mobile || local.mobile,
      token: data.access_token,
    };
  } catch {
    return null;
  }

  async function requestOtp(mobile) {
    const response = await fetch(`${API_BASE}/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
    });
    if (!response.ok) throw new Error('OTP request failed');
    return response.json();
  }

  async function verifyOtp(mobile, code) {
    const response = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, code }),
    });
    if (!response.ok) throw new Error('OTP verification failed');
    return response.json();
  }

  async function loginWithOtp(mobile, code) {
    const response = await fetch(`${API_BASE}/auth/otp/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, code }),
    });
    if (!response.ok) throw new Error('OTP login failed');
    const data = await response.json();
    const profileResponse = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    if (!profileResponse.ok) throw new Error('Unable to load account');
    return profileResponse.json();
  }
}

async function registerWithBackend(email, password, role, name, mobile) {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, name, mobile }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function localAuthenticate(email, password) {
  const account = demoAccounts[email];
  if (account && account.password === password) {
    return { email, role: account.role, name: account.name, mobile: account.mobile };
  }
  const registered = JSON.parse(localStorage.getItem('kisansetu_registered') || '{}');
  const record = registered[email];
  if (record && record.password === password) {
    return { email, role: record.role, name: record.name, mobile: record.mobile };
  }
  return null;
}

function storeRegistered(email, password, role, name) {
  const registered = JSON.parse(localStorage.getItem('kisansetu_registered') || '{}');
  registered[email] = { password, role, name };
  localStorage.setItem('kisansetu_registered', JSON.stringify(registered));
}

async function completeLogin(user, remember, toastKey = 'login.toastDemo') {
  saveAuth(user, remember);
  showToast(t(toastKey));
  window.location.href = redirectForRole(user.role);
}

async function authenticate(identifier, password, remember, submitButton, labelKey) {
  const email = normalizeIdentifier(identifier);
  setBusy(submitButton, true, labelKey);
  const backendUser = await loginWithBackend(email, password);
  if (backendUser) {
    const selected = tabRoleToApi(getSelectedTabRole());
    if (backendUser.role !== selected) {
      const tab = backendUser.role.toLowerCase();
      setActiveRole(tab === 'farmer' || tab === 'buyer' || tab === 'admin' ? tab : 'farmer', { fillEmpty: false });
      showToast(t('login.toastRoleSwitch').replace('{role}', roleLabel(backendUser.role)));
    }
    await completeLogin(backendUser, remember);
    return true;
  }
  const localUser = localAuthenticate(email, password);
  setBusy(submitButton, false, labelKey);
  if (!localUser) {
    showError('login-error', t('login.toastInvalid'));
    showToast(t('login.toastInvalid'));
    return false;
  }
  if (localUser.role !== tabRoleToApi(getSelectedTabRole())) {
    const tab = localUser.role.toLowerCase();
    setActiveRole(tab, { fillEmpty: false });
    showToast(t('login.toastRoleSwitch').replace('{role}', roleLabel(localUser.role)));
  }
  await completeLogin(localUser, remember);
  return true;
}

function readOtpDigits() {
  return [...document.querySelectorAll('.otp-digit')].map((input) => input.value).join('');
}

function bindOtpInputs() {
  const digits = [...document.querySelectorAll('.otp-digit')];
  digits.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(-1);
      if (input.value && digits[index + 1]) digits[index + 1].focus();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' && !input.value && digits[index - 1]) digits[index - 1].focus();
    });
    input.addEventListener('paste', (event) => {
      event.preventDefault();
      const pasted = (event.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
      pasted.split('').forEach((ch, i) => {
        if (digits[i]) digits[i].value = ch;
      });
      digits[Math.min(pasted.length, 5)]?.focus();
    });
  });
}

function renderContinueBanner() {
  const auth = getAuth();
  const banner = document.getElementById('continue-banner');
  const text = document.getElementById('continue-text');
  if (!banner || !text) return;
  if (!auth) {
    banner.hidden = true;
    return;
  }
  text.textContent = t('login.continueAs').replace('{name}', auth.name || roleLabel(auth.role));
  banner.hidden = false;
}

function initFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const role = (params.get('role') || '').toLowerCase();
  if (role === 'buyer' || role === 'admin' || role === 'farmer') {
    setActiveRole(role);
  } else {
    setActiveRole('farmer');
  }
}

document.querySelectorAll('.role-switch button').forEach((button) => {
  button.addEventListener('click', () => setActiveRole(button.dataset.role));
});

document.querySelectorAll('[data-demo]').forEach((chip) => {
  chip.addEventListener('click', () => {
    const demo = demoByRole[chip.dataset.demo];
    if (!demo) return;
    setActiveRole(chip.dataset.demo, { fillEmpty: false });
    showView('password');
    document.getElementById('login-id').value = demo.email;
    document.getElementById('password').value = DEMO_PASSWORD;
    togglePrefix(document.getElementById('login-id'), document.getElementById('id-prefix'));
    document.getElementById('login-submit')?.focus();
  });
});

const loginId = document.getElementById('login-id');
loginId?.addEventListener('input', () => togglePrefix(loginId, document.getElementById('id-prefix')));
document.getElementById('otp-mobile')?.addEventListener('input', (event) => {
  togglePrefix(event.target, document.getElementById('otp-prefix'));
});
document.getElementById('signup-id')?.addEventListener('input', (event) => {
  togglePrefix(event.target, document.getElementById('signup-prefix'));
});
document.getElementById('forgot-id')?.addEventListener('input', (event) => {
  togglePrefix(event.target, document.getElementById('forgot-prefix'));
});

document.querySelector('.show-password')?.addEventListener('click', (event) => {
  const password = document.getElementById('password');
  const visible = password.type === 'text';
  password.type = visible ? 'password' : 'text';
  event.currentTarget.textContent = visible ? t('common.show') : t('common.hide');
  event.currentTarget.setAttribute('aria-pressed', String(!visible));
  event.currentTarget.setAttribute('aria-label', visible ? t('common.show') : t('common.hide'));
});

document.getElementById('login-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  showError('login-error', '');
  const identifier = document.getElementById('login-id').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!identifier || !password) {
    showError('login-error', t('login.formError'));
    return;
  }
  await authenticate(
    identifier,
    password,
    document.getElementById('remember-me')?.checked !== false,
    document.getElementById('login-submit'),
    'login.submit'
  );
});

document.getElementById('otp-entry-btn')?.addEventListener('click', () => {
  const current = document.getElementById('login-id').value.trim();
  const otpMobile = document.getElementById('otp-mobile');
  if (otpMobile && !otpMobile.value) {
    otpMobile.value = current || demoByRole[getSelectedTabRole()].email;
    togglePrefix(otpMobile, document.getElementById('otp-prefix'));
  }
  showView('otp');
  showToast(t('login.toastOtpSent'));
});

document.getElementById('get-otp-btn')?.addEventListener('click', () => {
  const mobile = document.getElementById('otp-mobile').value.replace(/\D/g, '');
  if (mobile.length !== 10) {
    showError('otp-error', 'Enter a valid 10-digit phone number first.');
    return;
  }
  requestOtp(mobile).then(() => showToast(t('login.toastOtpSent'))).catch(() => showError('otp-error', 'SMS OTP is temporarily unavailable.'));
});

document.getElementById('signup-get-otp')?.addEventListener('click', () => {
  const mobile = document.getElementById('signup-mobile').value.replace(/\D/g, '');
  if (mobile.length !== 10) {
    showError('signup-error', 'Enter a valid 10-digit phone number first.');
    return;
  }
  requestOtp(mobile).then(() => showToast(t('login.toastOtpSent'))).catch(() => showError('signup-error', 'SMS OTP is temporarily unavailable.'));
});

document.getElementById('demo-login-btn')?.addEventListener('click', async () => {
  const demo = demoByRole[getSelectedTabRole()];
  document.getElementById('login-id').value = demo.email;
  document.getElementById('password').value = DEMO_PASSWORD;
  await authenticate(
    demo.email,
    DEMO_PASSWORD,
    document.getElementById('remember-me')?.checked !== false,
    document.getElementById('login-submit'),
    'login.submit'
  );
});

document.getElementById('otp-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  showError('otp-error', '');
  const code = readOtpDigits();
  const mobile = document.getElementById('otp-mobile').value.replace(/\D/g, '');
  if (!DEMO_MODE && mobile.length !== 10) {
    showError('otp-error', 'Enter a valid 10-digit phone number.');
    return;
  }
  if (DEMO_MODE && code !== DEMO_OTP) {
    showError('otp-error', t('login.toastOtpInvalid'));
    showToast(t('login.toastOtpInvalid'));
    return;
  }
  if (!DEMO_MODE) {
    try {
      const user = await loginWithOtp(mobile, code);
      await completeLogin(user, document.getElementById('otp-remember')?.checked !== false, 'login.toastDemo');
      return;
    } catch {
      showError('otp-error', 'Invalid or expired OTP.');
      return;
    }
  }
  const identifier = document.getElementById('otp-mobile').value.trim();
  const email = normalizeIdentifier(identifier || demoByRole[getSelectedTabRole()].email);
  const account = demoAccounts[email];
  const resolvedEmail = account ? email : demoByRole[getSelectedTabRole()].email;
  const password = demoAccounts[resolvedEmail]?.password || DEMO_PASSWORD;
  await authenticate(
    resolvedEmail,
    password,
    document.getElementById('otp-remember')?.checked !== false,
    document.getElementById('otp-submit'),
    'login.otpVerify'
  );
});

document.getElementById('signup-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  showError('signup-error', '');
  const name = document.getElementById('signup-name').value.trim();
  const identifier = document.getElementById('signup-id').value.trim().toLowerCase();
  const mobile = document.getElementById('signup-mobile').value.replace(/\D/g, '');
  const otp = document.getElementById('signup-otp').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  if (!name || !identifier || !password || mobile.length !== 10 || !otp) {
    showError('signup-error', t('login.formError'));
    return;
  }
  if (!DEMO_MODE) {
    try { await verifyOtp(mobile, otp); } catch { showError('signup-error', 'Invalid or expired OTP.'); return; }
  } else if (otp !== DEMO_OTP) {
    showError('signup-error', 'Verify your phone before creating the account.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) || password.length < 6) {
    showError('signup-error', t('login.formError'));
    return;
  }
  const email = normalizeIdentifier(identifier);
  const role = tabRoleToApi(getSelectedTabRole());
  const submit = document.getElementById('signup-submit');
  const remember = document.getElementById('signup-remember')?.checked !== false;
  setBusy(submit, true, 'login.signupSubmit');
  await registerWithBackend(email, password, role, name, mobile);
  storeRegistered(email, password, role, name);
  const registered = JSON.parse(localStorage.getItem('kisansetu_registered') || '{}');
  registered[email].mobile = mobile;
  localStorage.setItem('kisansetu_registered', JSON.stringify(registered));
  const backendUser = await loginWithBackend(email, password);
  setBusy(submit, false, 'login.signupSubmit');
  await completeLogin(backendUser || { email, role, name }, remember, 'login.toastSignup');
});

document.getElementById('forgot-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  showError('forgot-error', '');
  const identifier = document.getElementById('forgot-id').value.trim();
  const otp = document.getElementById('forgot-otp').value.trim();
  const password = document.getElementById('forgot-password').value.trim();
  if (!identifier || !password) {
    showError('forgot-error', t('login.formError'));
    return;
  }
  if (otp !== DEMO_OTP) {
    showError('forgot-error', t('login.toastOtpInvalid'));
    return;
  }
  const email = normalizeIdentifier(identifier);
  const registered = JSON.parse(localStorage.getItem('kisansetu_registered') || '{}');
  if (registered[email]) registered[email].password = password;
  else if (demoAccounts[email]) registered[email] = { ...demoAccounts[email], password };
  else registered[email] = { password, role: tabRoleToApi(getSelectedTabRole()), name: displayNameFromEmail(email) };
  localStorage.setItem('kisansetu_registered', JSON.stringify(registered));
  document.getElementById('login-id').value = identifier;
  document.getElementById('password').value = password;
  showView('password');
  showToast(t('login.toastForgot'));
});

document.getElementById('forgot-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  const current = document.getElementById('login-id').value.trim();
  const forgotId = document.getElementById('forgot-id');
  if (forgotId) {
    forgotId.value = current;
    togglePrefix(forgotId, document.getElementById('forgot-prefix'));
  }
  showView('forgot');
  showToast(t('login.toastOtpSent'));
});

document.getElementById('signup-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  showView('signup');
});

document.querySelectorAll('.back-to-login').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showView('password');
  });
});

document.getElementById('continue-btn')?.addEventListener('click', () => {
  const auth = getAuth();
  if (auth) window.location.href = redirectForRole(auth.role);
});

document.getElementById('switch-account-btn')?.addEventListener('click', () => {
  clearAuth();
  document.getElementById('continue-banner').hidden = true;
});

document.addEventListener('kisansetu:languagechange', () => {
  applyRoleCopy(getSelectedTabRole());
  renderContinueBanner();
  const password = document.getElementById('password');
  const toggle = document.querySelector('.show-password');
  if (password && toggle) {
    const visible = password.type === 'text';
    toggle.textContent = visible ? t('common.hide') : t('common.show');
  }
});

bindOtpInputs();
initFromQuery();
renderContinueBanner();
togglePrefix(loginId, document.getElementById('id-prefix'));
document.addEventListener('DOMContentLoaded', () => {
  applyRoleCopy(getSelectedTabRole());
  renderContinueBanner();
});
