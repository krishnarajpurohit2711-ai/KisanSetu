const toast = document.querySelector('.toast');
let toastTimer;

function readSavedAuth() {
  try {
    return JSON.parse(localStorage.getItem('kisansetu_auth') || sessionStorage.getItem('kisansetu_auth') || 'null');
  } catch {
    return null;
  }
}

function dashboardForRole(role) {
  if (role === 'FARMER') return 'farmer-dashboard.html';
  if (role === 'BUYER') return 'buyer-dashboard.html';
  if (role === 'ADMIN') return 'admin-dashboard.html';
  return 'login.html';
}

const savedAuth = readSavedAuth();
const loginLink = document.querySelector('.header-actions a[href="login.html"]');
if (savedAuth && loginLink) {
  loginLink.href = dashboardForRole(savedAuth.role);
  loginLink.textContent = 'Dashboard';
  loginLink.dataset.i18n = 'nav.dashboard';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.scroll;
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});

document.querySelectorAll('[data-toast-i18n]').forEach((button) => {
  button.addEventListener('click', () => showToast(t(button.dataset.toastI18n)));
});
document.querySelectorAll('.chart-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.chart-tabs button').forEach((tab) => tab.classList.remove('active'));
    button.classList.add('active');
    showToast(t('common.priceTrendSelected').replace('{period}', button.textContent));
  });
});

document.querySelector('.menu-button')?.addEventListener('click', () => {
  showToast(t('common.useSections'));
});
