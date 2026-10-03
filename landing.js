/* ============================================================
   Landing Page — landing.js
   Auth + UI logic for the marketing landing page
   ============================================================ */

var API_URL = 'https://taiva.in/Admin%20pannel/api.php';
var API_TOKEN = 'MilesToken@2026';

// ---- DATA HELPERS ----
function getData(key, defaults) {
  try {
    var d = localStorage.getItem('taiva_' + key);
    return d ? JSON.parse(d) : (defaults || []);
  } catch (e) { return defaults || []; }
}
function setData(key, data) {
  localStorage.setItem('taiva_' + key, JSON.stringify(data));
}
function getUsers() { return getData('users', []); }
function saveUsers(u) { setData('users', u); }

// ---- SERVER SYNC ----
async function milesLoad(key) {
  try {
    var url = API_URL + '?action=load&token=' + encodeURIComponent(API_TOKEN) + '&key=' + encodeURIComponent(key);
    var r = await fetch(url);
    return await r.json();
  } catch (e) { return null; }
}
async function milesSave(key, data) {
  try {
    var url = API_URL + '?action=save&token=' + encodeURIComponent(API_TOKEN);
    var r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: key, data: JSON.stringify(data) })
    });
    return await r.json();
  } catch (e) { return null; }
}
async function syncUsersFromServer() {
  var r = await milesLoad('users');
  if (!r || !r.success || !r.data) return false;
  var remote = [];
  try { remote = JSON.parse(r.data) || []; } catch (e) { remote = []; }
  if (!Array.isArray(remote) || !remote.length) return false;
  var local = getUsers();
  var map = {};
  var i;
  for (i = 0; i < local.length; i++) if (local[i]) map[local[i].id || local[i].username] = local[i];
  for (i = 0; i < remote.length; i++) if (remote[i]) map[remote[i].id || remote[i].username] = remote[i];
  var merged = Object.keys(map).map(function (k) { return map[k]; });
  saveUsers(merged);
  return true;
}

// ---- SEED DEFAULTS ----
function seedDefaults() {
  var users = getUsers();
  var defaults = [
    { id: 'USR001', username: 'Admin', password: 'Taiva@2026FB', name: 'Super Admin', role: 'super_admin', status: 'active', createdAt: new Date().toISOString() },
    { id: 'USR002', username: 'Shivam', password: 'Admin@123', name: 'Shivam', role: 'manager', status: 'active', createdAt: new Date().toISOString() }
  ];
  var needsSave = false;
  defaults.forEach(function (d) {
    if (!users.some(function (u) { return u.username === d.username; })) {
      users.push(d); needsSave = true;
    }
  });
  if (needsSave) saveUsers(users);
}

// ---- AUTH ----
async function handleLogin() {
  var username = document.getElementById('loginUsername').value.trim();
  var password = document.getElementById('loginPassword').value;
  var errorEl = document.getElementById('loginError');

  if (!username || !password) {
    showAuthError(errorEl, 'Please enter username and password.', 'error');
    return;
  }

  showAuthError(errorEl, 'Signing in...', 'success');
  await syncUsersFromServer();
  seedDefaults();

  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password && users[i].status === 'active') {
      var u = users[i];
      sessionStorage.setItem('taiva_admin', JSON.stringify({ user: u.username, name: u.name, role: u.role, id: u.id }));
      showAuthError(errorEl, 'Login successful! Redirecting...', 'success');
      setTimeout(function () { window.location.href = 'dashboard.html'; }, 800);
      return;
    }
  }
  showAuthError(errorEl, 'Invalid username or password.', 'error');
}

async function handleSignup() {
  var name = document.getElementById('signupName').value.trim();
  var username = document.getElementById('signupUsername').value.trim();
  var password = document.getElementById('signupPassword').value;
  var role = document.getElementById('signupRole').value;
  var errorEl = document.getElementById('signupError');

  if (!name || !username || !password) {
    showAuthError(errorEl, 'Please fill in all fields.', 'error');
    return;
  }
  if (username.length < 3) {
    showAuthError(errorEl, 'Username must be at least 3 characters.', 'error');
    return;
  }
  if (password.length < 6) {
    showAuthError(errorEl, 'Password must be at least 6 characters.', 'error');
    return;
  }

  showAuthError(errorEl, 'Creating account...', 'success');
  await syncUsersFromServer();
  seedDefaults();

  var users = getUsers();
  if (users.some(function (u) { return u.username === username; })) {
    showAuthError(errorEl, 'Username already exists. Choose another.', 'error');
    return;
  }

  var newUser = {
    id: 'USR' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase(),
    username: username,
    password: password,
    name: name,
    role: role,
    status: 'active',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  await milesSave('users', users);

  sessionStorage.setItem('taiva_admin', JSON.stringify({ user: newUser.username, name: newUser.name, role: newUser.role, id: newUser.id }));
  showAuthError(errorEl, 'Account created! Redirecting...', 'success');
  setTimeout(function () { window.location.href = 'dashboard.html'; }, 800);
}

function quickLogin(role) {
  seedDefaults();
  var creds = { manager: 'Shivam', agent: 'Agent' };
  var uname = creds[role];
  if (!uname) return;

  var users = getUsers();
  if (!users.some(function (u) { return u.username === uname; })) {
    users.push({
      id: 'USR' + Date.now().toString(36).toUpperCase(),
      username: uname, password: 'Agent@123', name: uname, role: 'agent',
      status: 'active', createdAt: new Date().toISOString()
    });
    saveUsers(users);
  }

  switchTab('login');
  document.getElementById('loginUsername').value = uname;
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginPassword').focus();
}

// ---- UI HELPERS ----
function switchTab(tab) {
  var tabLogin = document.getElementById('tabLogin');
  var tabSignup = document.getElementById('tabSignup');
  var loginForm = document.getElementById('loginForm');
  var signupForm = document.getElementById('signupForm');

  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
  } else {
    tabLogin.classList.remove('active');
    tabSignup.classList.add('active');
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  }
  clearErrors();
}

function showAuthError(el, msg, type) {
  el.textContent = msg;
  el.className = 'auth-error show ' + type;
}

function clearErrors() {
  document.getElementById('loginError').className = 'auth-error';
  document.getElementById('signupError').className = 'auth-error';
}

function toggleMobile() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ---- NAVBAR SCROLL ----
window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- FADE-UP ON SCROLL ----
function initFadeUp() {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(function (el) {
    observer.observe(el);
  });
}

// ---- ENTER KEY SUPPORT ----
document.addEventListener('DOMContentLoaded', function () {
  initFadeUp();
  syncUsersFromServer().then(function () { seedDefaults(); });

  document.getElementById('loginPassword').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleLogin();
  });
  document.getElementById('loginUsername').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleLogin();
  });

  var signupInputs = document.querySelectorAll('#signupForm input, #signupForm select');
  signupInputs.forEach(function (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleSignup();
    });
  });
});
