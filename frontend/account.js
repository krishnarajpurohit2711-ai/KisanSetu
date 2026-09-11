const auth = JSON.parse(localStorage.getItem('kisansetu_auth') || sessionStorage.getItem('kisansetu_auth') || 'null');
if (!auth) {
  window.location.href = 'login.html';
} else {
  const registered = JSON.parse(localStorage.getItem('kisansetu_registered') || '{}');
  const profile = { ...(registered[auth.email] || {}), ...auth };
  const name = profile.name || profile.email?.split('@')[0] || 'User';
  document.getElementById('account-avatar').textContent = name.trim().charAt(0).toUpperCase();
  document.getElementById('account-name').textContent = name;
  document.getElementById('account-role').textContent = profile.role || '-';
  document.getElementById('account-email').textContent = profile.email || '-';
  document.getElementById('account-mobile').textContent = profile.mobile || 'Not provided';
  document.getElementById('account-back').href = profile.role === 'FARMER' ? 'farmer-dashboard.html' : profile.role === 'BUYER' ? 'buyer-dashboard.html' : 'admin-dashboard.html';
}
document.getElementById('account-logout')?.addEventListener('click', () => {
  localStorage.removeItem('kisansetu_auth');
  sessionStorage.removeItem('kisansetu_auth');
  window.location.href = 'index.html';
});
