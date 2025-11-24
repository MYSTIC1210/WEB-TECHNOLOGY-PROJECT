const BACKEND_URL = (window.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');
const regForm = document.getElementById('registerForm');
const regErr = document.getElementById('err');

regForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  regErr.textContent = '';
  const username = document.getElementById('r_username').value.trim();
  const email = document.getElementById('r_email').value.trim();
  const password = document.getElementById('r_password').value;

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      regErr.textContent = json?.message || `Registration failed (${res.status})`;
      return;
    }
    localStorage.setItem('sims_token', json.token);
    localStorage.setItem('sims_user', JSON.stringify(json.user));
    window.location.href = './index.html';
  } catch (err) {
    console.error('Register error:', err);
    regErr.textContent = 'Network error: could not reach backend at ' + BACKEND_URL;
  }
});