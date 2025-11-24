// Update if your backend runs on a different host/port
const BACKEND_URL = (window.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

const form = document.getElementById('loginForm');
const errEl = document.getElementById('err');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errEl.textContent = '';
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { message: text }; }

    if (!res.ok) {
      errEl.textContent = data?.message || `Login failed (${res.status})`;
      console.error('Login failed response:', res.status, data);
      return;
    }

    localStorage.setItem('sims_token', data.token);
    localStorage.setItem('sims_user', JSON.stringify(data.user));
    window.location.href = './index.html';
  } catch (err) {
    console.error('Network/login error:', err);
    errEl.textContent = 'Network error: could not reach backend at ' + BACKEND_URL;
  }
});