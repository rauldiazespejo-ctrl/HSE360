// ================================================================
// HSE 360 — Plataforma Integral de Seguridad, Salud y Medio Ambiente
// Sistema de Gestión HSE — Chile 2026
// Ley 16.744 · DS 594 · Protocolos MINSAL · Ley 19.628
// ================================================================

const API = axios.create({ baseURL: '/api' });

// ================================================================
// APP STATE
// ================================================================
const App = {
  currentView: 'dashboard',
  currentUser: null,
  params: {},
  data: {},
  charts: {},
  centroActivo: null,
  token: null
};

// ================================================================
// AUTH — LOGIN / LOGOUT / SESSION
// ================================================================
function checkSession() {
  const saved = sessionStorage.getItem('hse360_session');
  if (saved) {
    try {
      const session = JSON.parse(saved);
      App.currentUser = session.user;
      App.token = session.token;
      App.centroActivo = session.centroActivo || null;
      API.defaults.headers.common['Authorization'] = `Bearer ${App.token}`;
      return true;
    } catch { return false; }
  }
  return false;
}

function saveSession(user, token) {
  App.currentUser = user;
  App.token = token;
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  sessionStorage.setItem('hse360_session', JSON.stringify({ user, token, centroActivo: App.centroActivo }));
}

function clearSession() {
  App.currentUser = null;
  App.token = null;
  App.centroActivo = null;
  sessionStorage.removeItem('hse360_session');
  delete API.defaults.headers.common['Authorization'];
}

function isSuperAdmin() {
  return App.currentUser?.rol === 'superadmin';
}

function canDo(perm) {
  if (!App.currentUser) return false;
  if (isSuperAdmin()) return true;
  return (App.currentUser.permisos || []).some(p => p === perm || p.startsWith(perm.split(':')[0] + ':all'));
}

// ================================================================
// LOGIN SCREEN
// ================================================================
function renderLogin() {
  document.getElementById('app').innerHTML = `
    <div class="login-page">
      <div class="login-card fade-in">
        <div class="text-center mb-6">
          <div class="login-logo"><span>360</span></div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">HSE 360</h1>
          <p class="text-sm text-gray-500 mt-1">Plataforma Integral de Gestión HSE</p>
          <div class="flex items-center justify-center gap-2 mt-2">
            <span class="text-xs text-gray-400">Ley 16.744 · DS 594 · MINSAL</span>
          </div>
        </div>

        <div id="login-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
          <i class="fas fa-circle-exclamation"></i><span id="login-error-msg"></span>
        </div>

        <div class="space-y-4">
          <div>
            <label class="form-label">Correo electrónico</label>
            <input id="login-email" type="email" class="form-input" placeholder="usuario@empresa.cl"
              value="" onkeydown="if(event.key==='Enter')doLogin()">
          </div>
          <div>
            <label class="form-label">Contraseña</label>
            <div class="relative">
              <input id="login-pass" type="password" class="form-input pr-10" placeholder="••••••••"
                onkeydown="if(event.key==='Enter')doLogin()">
              <button type="button" onclick="togglePassVis()" class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <i class="fas fa-eye text-sm"></i>
              </button>
            </div>
          </div>
          <button onclick="doLogin()" id="login-btn" class="btn btn-primary w-full justify-center py-3 text-base">
            <i class="fas fa-right-to-bracket"></i> Ingresar al Sistema
          </button>
        </div>

        <div class="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500">
          <div class="font-semibold text-gray-600 mb-2"><i class="fas fa-circle-info mr-1"></i> Accesos de demostración</div>
          <div class="space-y-1.5">
            <div class="flex justify-between cursor-pointer hover:text-gray-700" onclick="fillLogin('raul.diaz@hse360.cl','HSE360admin!')">
              <span><i class="fas fa-crown text-yellow-500 mr-1"></i>Super Admin</span>
              <span class="font-mono">raul.diaz@hse360.cl</span>
            </div>
            <div class="flex justify-between cursor-pointer hover:text-gray-700" onclick="fillLogin('claudia.torres@hse360.cl','Prev2026!')">
              <span><i class="fas fa-shield-halved text-blue-500 mr-1"></i>Prevencionista</span>
              <span class="font-mono">claudia.torres@hse360.cl</span>
            </div>
            <div class="flex justify-between cursor-pointer hover:text-gray-700" onclick="fillLogin('dr.morales@hse360.cl','Med2026!')">
              <span><i class="fas fa-stethoscope text-green-600 mr-1"></i>Médico</span>
              <span class="font-mono">dr.morales@hse360.cl</span>
            </div>
          </div>
        </div>

        <div class="mt-4 text-center text-xs text-gray-400">
          © 2026 HSE 360 · Cumplimiento Ley 19.628
        </div>

        <div class="mt-5 pt-4 border-t border-gray-100 flex flex-col items-center gap-1">
          <div class="text-xs text-gray-400 mb-1">Desarrollado por</div>
          <div class="nexusforge-badge">
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="nf-grad-login" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#6366f1"/>
                  <stop offset="100%" stop-color="#0ea5e9"/>
                </linearGradient>
              </defs>
              <rect width="40" height="40" rx="9" fill="url(#nf-grad-login)"/>
              <path d="M8 28 L8 12 L16 12 L24 24 L24 12 L32 12 L32 28 L24 28 L16 16 L16 28 Z" fill="white" opacity="0.95"/>
              <circle cx="32" cy="28" r="4" fill="#22d3ee" opacity="0.9"/>
            </svg>
            <div class="nexusforge-text">
              <span class="nf-name">NexusForge</span>
              <span class="nf-tagline">Software &amp; Apps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function fillLogin(email, pass) {
  document.getElementById('login-email').value = email;
  document.getElementById('login-pass').value = pass;
}

function togglePassVis() {
  const input = document.getElementById('login-pass');
  input.type = input.type === 'password' ? 'text' : 'password';
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-pass').value;
  const btn = document.getElementById('login-btn');
  const errDiv = document.getElementById('login-error');
  const errMsg = document.getElementById('login-error-msg');

  if (!email || !password) {
    errMsg.textContent = 'Por favor ingresa tu correo y contraseña.';
    errDiv.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<div class="spinner w-5 h-5 border-2"></div> Ingresando...';

  try {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      saveSession(res.data.data.user, res.data.data.token);
      showToast(`Bienvenido/a, ${App.currentUser.nombres}`, 'success');
      renderApp();
    }
  } catch (err) {
    const msg = err.response?.data?.error || 'Error de conexión. Intente nuevamente.';
    errMsg.textContent = msg;
    errDiv.classList.remove('hidden');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-right-to-bracket"></i> Ingresar al Sistema';
  }
}

function doLogout() {
  clearSession();
  Object.values(App.charts).forEach(ch => { try { ch.destroy(); } catch {} });
  App.charts = {};
  renderLogin();
  showToast('Sesión cerrada correctamente', 'success');
}

// ================================================================
// ROUTER
// ================================================================
function navigate(view, params = {}) {
  App.currentView = view;
  App.params = params;
  updateActiveNav(view);
  renderView(view, params);
}

function updateActiveNav(view) {
  document.querySelectorAll('.nav-item').forEach(el => {
    const matches = el.dataset.view === view ||
      (view === 'protocol-detail' && el.dataset.view === 'protocol-detail' && el.dataset.pid === App.params?.id);
    el.classList.toggle('active', matches);
  });
}

async function renderView(view, params) {
  const content = document.getElementById('page-content');
  if (!content) return;
  content.innerHTML = '<div class="flex items-center justify-center py-24"><div class="spinner"></div></div>';
  try {
    switch (view) {
      case 'dashboard':        await renderDashboard(); break;
      case 'centros':          await renderCentros(); break;
      case 'users':            await renderUsers(); break;
      case 'workers':          await renderWorkers(); break;
      case 'worker-detail':    await renderWorkerDetail(params.id); break;
      case 'protocols':        await renderProtocols(); break;
      case 'protocol-detail':  await renderProtocolDetail(params.id); break;
      case 'accidents':        await renderAccidents(); break;
      case 'epp':              await renderEPP(); break;
      case 'capacitations':    await renderCapacitations(); break;
      case 'alerts':           await renderAlerts(); break;
      case 'miper':            await renderMIPER(); break;
      case 'reports':          await renderReports(); break;
      default: content.innerHTML = '<div class="p-8 text-center text-gray-400"><i class="fas fa-compass-slash text-3xl mb-3"></i><div>Vista no encontrada</div></div>';
    }
  } catch (e) {
    console.error(e);
    content.innerHTML = `<div class="p-8 text-center text-red-400"><i class="fas fa-circle-exclamation text-3xl mb-3"></i><div class="font-semibold">Error al cargar la vista</div><div class="text-sm mt-1 text-gray-400">${e.message}</div></div>`;
  }
}

// ================================================================
// MAIN APP LAYOUT
// ================================================================
function renderApp() {
  document.getElementById('app').innerHTML = buildLayout();
  setupCentroSelector();
  navigate('dashboard');
}

function buildLayout() {
  const u = App.currentUser;
  const isSA = isSuperAdmin();

  return `
    <aside id="sidebar">
      <div class="sidebar-logo">
        <div class="hse360-brand">
          <div class="hse360-logo-box">360</div>
          <div>
            <div class="hse360-title">HSE 360</div>
            <div class="hse360-subtitle">Gestión HSE · Chile 2026</div>
          </div>
        </div>
        <div class="sidebar-user-card flex items-center gap-2">
          <div class="sidebar-user-avatar">${u?.avatar_iniciales || u?.nombres?.[0] || 'U'}</div>
          <div class="min-w-0">
            <div class="text-white font-semibold text-xs truncate">${u?.nombres} ${u?.apellidos}</div>
            <div class="text-xs mt-0.5" style="color:rgba(134,239,172,0.8)">${u?.cargo}</div>
          </div>
        </div>
      </div>

      <nav class="py-2">
        <div class="nav-section-label">Principal</div>
        <a class="nav-item" data-view="dashboard" onclick="navigate('dashboard')">
          <span class="nav-icon"><i class="fas fa-chart-pie"></i></span>Dashboard
        </a>
        <a class="nav-item" data-view="alerts" onclick="navigate('alerts')">
          <span class="nav-icon"><i class="fas fa-bell"></i></span>Alertas
          <span class="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">!</span>
        </a>

        ${isSA ? `
        <div class="nav-section-label mt-1">Administración</div>
        <a class="nav-item" data-view="centros" onclick="navigate('centros')">
          <span class="nav-icon"><i class="fas fa-building"></i></span>Centros de Trabajo
        </a>
        <a class="nav-item" data-view="users" onclick="navigate('users')">
          <span class="nav-icon"><i class="fas fa-user-shield"></i></span>Gestión de Usuarios
          <span class="ml-auto badge-crown badge text-xs py-0.5 px-1.5" style="font-size:9px">SA</span>
        </a>
        ` : ''}

        <div class="nav-section-label mt-1">Gestión</div>
        <a class="nav-item" data-view="workers" onclick="navigate('workers')">
          <span class="nav-icon"><i class="fas fa-users"></i></span>Trabajadores
        </a>
        <a class="nav-item" data-view="accidents" onclick="navigate('accidents')">
          <span class="nav-icon"><i class="fas fa-file-medical-alt"></i></span>DIAT / DIEP
        </a>
        <a class="nav-item" data-view="epp" onclick="navigate('epp')">
          <span class="nav-icon"><i class="fas fa-hard-hat"></i></span>Control de EPP
        </a>
        <a class="nav-item" data-view="capacitations" onclick="navigate('capacitations')">
          <span class="nav-icon"><i class="fas fa-graduation-cap"></i></span>Capacitaciones
        </a>

        <div class="nav-section-label mt-1">Protocolos MINSAL</div>
        <a class="nav-item" data-view="protocols" onclick="navigate('protocols')">
          <span class="nav-icon"><i class="fas fa-clipboard-list"></i></span>Todos los Protocolos
        </a>
        ${[
          ['PREXOR','fa-ear-deaf','Ruido Ocupacional'],
          ['PLANESI','fa-lungs','Exposición a Sílice'],
          ['TMERT','fa-person-walking','Ergonomía TMERT'],
          ['PSICOSOCIAL','fa-brain','Riesgos Psicosociales'],
          ['UV','fa-sun','Radiación UV'],
          ['MMC','fa-box','Manejo Manual Cargas'],
          ['VOZ','fa-microphone','Trastornos de Voz'],
        ].map(([id,ic,label]) => `
          <a class="nav-item" data-view="protocol-detail" data-pid="${id}" onclick="navigate('protocol-detail',{id:'${id}'})">
            <span class="nav-icon"><i class="fas ${ic}"></i></span><span class="truncate text-xs">${label}</span>
          </a>
        `).join('')}

        <div class="nav-section-label mt-1">Análisis y Reportes</div>
        <a class="nav-item" data-view="miper" onclick="navigate('miper')">
          <span class="nav-icon"><i class="fas fa-triangle-exclamation"></i></span>Matriz MIPER
        </a>
        <a class="nav-item" data-view="reports" onclick="navigate('reports')">
          <span class="nav-icon"><i class="fas fa-chart-bar"></i></span>Reportería
        </a>
      </nav>

      <div class="p-4 mt-auto" style="border-top:1px solid rgba(255,255,255,0.08)">
        <button onclick="doLogout()" class="btn btn-outline-green w-full justify-center text-xs py-2">
          <i class="fas fa-right-from-bracket"></i> Cerrar Sesión
        </button>
        <div class="text-center mt-2 text-xs" style="color:rgba(255,255,255,0.25)">v2.0 · HSE 360 · 2026</div>
        <div class="nexusforge-sidebar-footer" onclick="navigate('reports')" title="NexusForge — Desarrollos y Arquitectura de Software & Apps">
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nf-grad-sb" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#818cf8"/>
                <stop offset="100%" stop-color="#38bdf8"/>
              </linearGradient>
            </defs>
            <rect width="40" height="40" rx="9" fill="url(#nf-grad-sb)"/>
            <path d="M8 28 L8 12 L16 12 L24 24 L24 12 L32 12 L32 28 L24 28 L16 16 L16 28 Z" fill="white" opacity="0.95"/>
            <circle cx="32" cy="28" r="4" fill="#22d3ee" opacity="0.9"/>
          </svg>
          <span class="nf-sb-text">NexusForge</span>
        </div>
      </div>
    </aside>

    <div id="main-content">
      <header class="topbar">
        <div class="flex items-center gap-3">
          <button id="sidebar-toggle" class="btn btn-secondary p-2" onclick="toggleSidebar()">
            <i class="fas fa-bars text-sm"></i>
          </button>
          <div>
            <div id="page-title" class="font-bold text-gray-800 text-lg leading-tight">Dashboard</div>
            <div id="page-subtitle" class="text-xs text-gray-400">HSE 360 · Gestión Integral de Seguridad y Salud</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div id="centro-selector-btn" class="topbar-center-selector hidden cursor-pointer select-none">
            <span class="ct-dot"></span>
            <span id="centro-nombre-topbar">Todos los centros</span>
            <i class="fas fa-chevron-down text-xs"></i>
          </div>
          <div class="relative cursor-pointer" onclick="navigate('alerts')">
            <div class="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <i class="fas fa-bell text-sm"></i>
            </div>
            <div class="notif-dot"></div>
          </div>
          <div class="flex items-center gap-2 cursor-pointer" onclick="${isSA ? "navigate('users')" : ''}">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style="background:var(--hse-green)">
              ${u?.avatar_iniciales || 'U'}
            </div>
            ${isSA ? '<span class="badge badge-crown text-xs hidden sm:inline-flex"><i class="fas fa-crown mr-1"></i>SA</span>' : ''}
          </div>
        </div>
      </header>
      <main id="page-content" class="p-6 fade-in"></main>
    </div>
  `;
}

async function setupCentroSelector() {
  const btn = document.getElementById('centro-selector-btn');
  if (!btn) return;
  btn.classList.remove('hidden');
  // Cargar centros para el dropdown
  try {
    const res = await API.get('/centros');
    const centros = res.data.data.filter(c => c.activo);
    window._centrosList = centros;
    updateCentroDisplay();
    // Cambiar comportamiento del btn para abrir selector
    btn.onclick = (e) => { e.stopPropagation(); showCentroSelectorDropdown(centros); };
  } catch {}
}

function updateCentroDisplay() {
  const nombre = document.getElementById('centro-nombre-topbar');
  if (!nombre) return;
  if (App.centroActivo) {
    const c = (window._centrosList || []).find(x => x.id === App.centroActivo);
    nombre.textContent = c ? c.nombre : 'Centro #' + App.centroActivo;
  } else {
    nombre.textContent = 'Todos los centros';
  }
}

function showCentroSelectorDropdown(centros) {
  // Eliminar dropdown previo
  const prev = document.getElementById('centro-dropdown');
  if (prev) { prev.remove(); return; }
  
  const dropdown = document.createElement('div');
  dropdown.id = 'centro-dropdown';
  dropdown.style.cssText = 'position:fixed;top:64px;right:16px;z-index:9999;background:white;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.18);min-width:260px;overflow:hidden;border:1px solid #e5e7eb;';
  
  dropdown.innerHTML = `
    <div style="padding:12px 16px;background:linear-gradient(135deg,var(--hse-green),var(--hse-green-dark));color:white;">
      <div style="font-weight:700;font-size:13px">Seleccionar Centro de Trabajo</div>
      <div style="font-size:11px;opacity:0.8;margin-top:2px">Filtra toda la vista por centro</div>
    </div>
    <div style="padding:8px;">
      <button onclick="setCentroActivo(null)" style="width:100%;text-align:left;padding:8px 12px;border-radius:8px;font-size:13px;border:none;cursor:pointer;display:flex;align-items:center;gap:8px;background:${!App.centroActivo?'var(--hse-green-light)':'transparent'};color:${!App.centroActivo?'var(--hse-green)':'#374151'};font-weight:${!App.centroActivo?'600':'400'}">
        <i class="fas fa-globe" style="width:16px;text-align:center"></i> Todos los centros
        ${!App.centroActivo ? '<i class="fas fa-check ml-auto text-xs" style="color:var(--hse-green)"></i>' : ''}
      </button>
      ${centros.map(c => `
        <button onclick="setCentroActivo(${c.id})" style="width:100%;text-align:left;padding:8px 12px;border-radius:8px;font-size:13px;border:none;cursor:pointer;display:flex;align-items:center;gap:8px;background:${App.centroActivo===c.id?'var(--hse-green-light)':'transparent'};color:${App.centroActivo===c.id?'var(--hse-green)':'#374151'};font-weight:${App.centroActivo===c.id?'600':'400'}">
          <i class="fas fa-building" style="width:16px;text-align:center"></i>
          <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.nombre}</span>
          ${App.centroActivo===c.id ? '<i class="fas fa-check text-xs" style="color:var(--hse-green)"></i>' : ''}
        </button>
      `).join('')}
    </div>
    ${isSuperAdmin() ? `
    <div style="padding:8px;border-top:1px solid #f3f4f6;">
      <button onclick="document.getElementById('centro-dropdown')?.remove();navigate('centros')" 
        style="width:100%;text-align:left;padding:8px 12px;border-radius:8px;font-size:12px;border:none;cursor:pointer;color:var(--hse-green);background:transparent;display:flex;align-items:center;gap:8px;">
        <i class="fas fa-plus" style="width:16px;text-align:center"></i> Gestionar centros
      </button>
    </div>` : ''}
  `;
  
  document.body.appendChild(dropdown);
  setTimeout(() => document.addEventListener('click', () => { dropdown.remove(); }, { once: true }), 50);
}

function setCentroActivo(id) {
  App.centroActivo = id;
  sessionStorage.setItem('hse360_session', JSON.stringify({
    user: App.currentUser,
    token: App.token,
    centroActivo: id
  }));
  updateCentroDisplay();
  document.getElementById('centro-dropdown')?.remove();
  // Refrescar vista actual
  navigate(App.currentView, App.params);
  showToast(id ? 'Filtro de centro aplicado' : 'Mostrando todos los centros', 'info');
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
  sidebar.classList.toggle('mobile-open');
}

function setPageTitle(title, subtitle) {
  const t = document.getElementById('page-title');
  const s = document.getElementById('page-subtitle');
  if (t) t.textContent = title;
  if (s) s.textContent = subtitle || 'HSE 360 · Gestión Integral de Seguridad y Salud';
}

// ================================================================
// CENTROS DE TRABAJO
// ================================================================
async function renderCentros() {
  setPageTitle('Centros de Trabajo', 'Gestión multicentro — Solo accesible para Super Administrador');
  const res = await API.get('/centros');
  const centros = res.data.data;
  const content = document.getElementById('page-content');

  content.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Centros de Trabajo Registrados</h2>
        <p class="text-sm text-gray-500 mt-1">Administra y monitorea cada centro de trabajo con sus protocolos HSE</p>
      </div>
      ${isSuperAdmin() ? `
      <button class="btn btn-primary" onclick="showAddCentroModal()">
        <i class="fas fa-plus"></i> Nuevo Centro
      </button>` : ''}
    </div>

    <!-- Stats strip -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="card p-4 text-center hse-accent-top">
        <div class="text-2xl font-bold" style="color:var(--hse-green)">${centros.length}</div>
        <div class="text-xs text-gray-500">Total centros</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-green-500">
        <div class="text-2xl font-bold text-green-600">${centros.filter(c=>c.activo).length}</div>
        <div class="text-xs text-gray-500">Activos</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-blue-500">
        <div class="text-2xl font-bold text-blue-600">${centros.reduce((s,c) => s + c.n_trabajadores, 0)}</div>
        <div class="text-xs text-gray-500">Total trabajadores</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-purple-500">
        <div class="text-2xl font-bold text-purple-600">${Math.round(centros.reduce((s,c) => s + c.estado_cumplimiento, 0) / centros.length)}%</div>
        <div class="text-xs text-gray-500">Cumplimiento promedio</div>
      </div>
    </div>

    <!-- Centro cards grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      ${centros.map(ct => renderCentroCard(ct)).join('')}
    </div>
  `;
}

function renderCentroCard(ct) {
  const pct = ct.estado_cumplimiento;
  const pctColor = pct >= 80 ? '#16a34a' : pct >= 60 ? '#d97706' : '#dc2626';
  return `
    <div class="centro-card">
      <div class="centro-card-header">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="font-bold text-white text-base">${ct.nombre}</div>
            <div class="text-green-300 text-xs mt-0.5">${ct.razon_social}</div>
          </div>
          <div class="compliance-circle flex-shrink-0 text-sm font-black"
            style="background:${pctColor};width:50px;height:50px;font-size:14px">
            ${pct}%
          </div>
        </div>
        <div class="flex flex-wrap gap-2 mt-3">
          <span class="badge badge-hse text-xs"><i class="fas fa-building mr-1"></i>${ct.mutualidad}</span>
          <span class="badge badge-hse text-xs"><i class="fas fa-users mr-1"></i>${ct.n_trabajadores} trab.</span>
          ${ct.activo ? '<span class="badge badge-green text-xs">Activo</span>' : '<span class="badge badge-red text-xs">Inactivo</span>'}
        </div>
      </div>
      <div class="p-4">
        <div class="grid grid-cols-2 gap-3 text-xs mb-3">
          <div><div class="text-gray-400">RUT Empresa</div><div class="font-semibold text-gray-700">${ct.rut_empresa}</div></div>
          <div><div class="text-gray-400">Región</div><div class="font-semibold text-gray-700">${ct.region}</div></div>
          <div class="col-span-2"><div class="text-gray-400">Dirección</div><div class="font-semibold text-gray-700">${ct.direccion}, ${ct.ciudad}</div></div>
          <div><div class="text-gray-400">Responsable HSE</div><div class="font-semibold text-gray-700 truncate">${ct.responsable_prevencion}</div></div>
          <div><div class="text-gray-400">Médico Ocupacional</div><div class="font-semibold text-gray-700 truncate">${ct.responsable_medico}</div></div>
        </div>

        <!-- Protocols chips -->
        <div class="mb-3">
          <div class="text-xs text-gray-400 mb-1.5">Protocolos activos</div>
          <div class="flex flex-wrap gap-1">
            ${ct.protocolos_activos.map(p => `
              <button class="badge badge-blue text-xs cursor-pointer hover:bg-blue-200"
                onclick="navigate('protocol-detail',{id:'${p}'})">${p}</button>
            `).join('')}
            ${ct.protocolos_activos.length === 0 ? '<span class="text-xs text-gray-400">Sin protocolos asignados</span>' : ''}
          </div>
        </div>

        <!-- Progress bar -->
        <div class="mb-3">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-gray-500">Cumplimiento HSE</span>
            <span class="font-bold" style="color:${pctColor}">${pct}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${pct}%;background:${pctColor}"></div>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="btn btn-primary flex-1 justify-center text-xs py-2" onclick="navigate('dashboard')">
            <i class="fas fa-chart-pie"></i> Ver Dashboard
          </button>
          ${isSuperAdmin() ? `
          <button class="btn btn-secondary py-2 px-3 text-xs" onclick="showEditCentroModal(${ct.id})" title="Editar centro">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger py-2 px-3 text-xs" onclick="confirmDeleteCentro(${ct.id})" title="Desactivar centro">
            <i class="fas fa-trash-alt"></i>
          </button>` : ''}
        </div>
      </div>
    </div>
  `;
}

function showAddCentroModal() {
  showModal('Registrar Nuevo Centro de Trabajo', `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-building mr-2"></i>Datos del Centro</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Nombre del Centro *</label>
            <input id="ct-nombre" class="form-input" placeholder="Ej: Planta Industrial Norte"></div>
          <div class="col-span-2"><label class="form-label">Razón Social *</label>
            <input id="ct-razon" class="form-input" placeholder="Nombre legal de la empresa"></div>
          <div><label class="form-label">RUT Empresa *</label>
            <input id="ct-rut" class="form-input" placeholder="76.543.210-1"></div>
          <div><label class="form-label">Mutualidad *</label>
            <select id="ct-mutual" class="form-input">
              <option>ACHS</option><option>IST</option>
              <option>Mutual de Seguridad CChC</option><option>ISL (empresa sin mutual)</option>
            </select></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-map-marker-alt mr-2"></i>Ubicación</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Dirección *</label>
            <input id="ct-dir" class="form-input" placeholder="Av. Industrial 1450"></div>
          <div><label class="form-label">Ciudad</label>
            <input id="ct-ciudad" class="form-input" placeholder="Santiago"></div>
          <div><label class="form-label">Región</label>
            <select id="ct-region" class="form-input">
              <option>Metropolitana</option><option>Valparaíso</option><option>Biobío</option>
              <option>La Araucanía</option><option>Antofagasta</option><option>O'Higgins</option>
              <option>Maule</option><option>Los Lagos</option><option>Tarapacá</option>
              <option>Atacama</option><option>Coquimbo</option><option>Ñuble</option>
              <option>Los Ríos</option><option>Arica y Parinacota</option>
              <option>Aysén</option><option>Magallanes</option>
            </select></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-users mr-2"></i>Responsables y Datos Laborales</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">N° Trabajadores</label>
            <input id="ct-ntrab" type="number" class="form-input" placeholder="50" min="1"></div>
          <div><label class="form-label">Actividad Económica (CIIU)</label>
            <input id="ct-ciiu" class="form-input" placeholder="Ej: 2891 — Fab. productos metálicos"></div>
          <div><label class="form-label">Responsable Prevención</label>
            <input id="ct-prevenc" class="form-input" placeholder="Nombre del prevencionista"></div>
          <div><label class="form-label">Email de Contacto</label>
            <input id="ct-email" type="email" class="form-input" placeholder="seguridad@empresa.cl"></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-clipboard-list mr-2"></i>Protocolos MINSAL a aplicar</div>
        <div class="grid grid-cols-3 gap-2">
          ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','VOZ'].map(p => `
            <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
              <input type="checkbox" class="ct-protocolo" value="${p}" class="w-4 h-4">
              <span class="text-sm font-medium text-gray-700">${p}</span>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveCentro()"><i class="fas fa-save mr-1"></i>Registrar Centro</button>
  `);
}

async function saveCentro() {
  const protocolos = [...document.querySelectorAll('.ct-protocolo:checked')].map(cb => cb.value);
  const body = {
    nombre: document.getElementById('ct-nombre').value.trim(),
    razon_social: document.getElementById('ct-razon').value.trim(),
    rut_empresa: document.getElementById('ct-rut').value.trim(),
    mutualidad: document.getElementById('ct-mutual').value,
    direccion: document.getElementById('ct-dir').value.trim(),
    ciudad: document.getElementById('ct-ciudad').value.trim(),
    region: document.getElementById('ct-region').value,
    n_trabajadores: parseInt(document.getElementById('ct-ntrab').value) || 0,
    actividad_economica: document.getElementById('ct-ciiu').value.trim(),
    responsable_prevencion: document.getElementById('ct-prevenc').value.trim(),
    email_contacto: document.getElementById('ct-email').value.trim(),
    protocolos_activos: protocolos
  };
  if (!body.nombre || !body.razon_social || !body.rut_empresa) {
    showToast('Completa los campos obligatorios (*)','error'); return;
  }
  try {
    await API.post('/centros', body);
    showToast('Centro registrado exitosamente', 'success');
    closeModal();
    navigate('centros');
  } catch { showToast('Error al guardar el centro', 'error'); }
}

async function showEditCentroModal(id) {
  const res = await API.get(`/centros/${id}`);
  const ct = res.data.data;
  showModal(`Editar Centro: ${ct.nombre}`, `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-building mr-2"></i>Datos del Centro</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Nombre</label>
            <input id="ect-nombre" class="form-input" value="${ct.nombre}"></div>
          <div class="col-span-2"><label class="form-label">Razón Social</label>
            <input id="ect-razon" class="form-input" value="${ct.razon_social}"></div>
          <div><label class="form-label">RUT Empresa</label>
            <input id="ect-rut" class="form-input" value="${ct.rut_empresa}"></div>
          <div><label class="form-label">Mutualidad</label>
            <select id="ect-mutual" class="form-input">
              ${['ACHS','IST','Mutual de Seguridad CChC','ISL (empresa sin mutual)'].map(m =>
                `<option ${ct.mutualidad===m?'selected':''}>${m}</option>`).join('')}
            </select></div>
          <div class="col-span-2"><label class="form-label">Dirección</label>
            <input id="ect-dir" class="form-input" value="${ct.direccion}"></div>
          <div><label class="form-label">N° Trabajadores</label>
            <input id="ect-ntrab" type="number" class="form-input" value="${ct.n_trabajadores}"></div>
          <div><label class="form-label">Responsable Prevención</label>
            <input id="ect-prevenc" class="form-input" value="${ct.responsable_prevencion}"></div>
          <div class="col-span-2"><label class="form-label">Email de Contacto</label>
            <input id="ect-email" type="email" class="form-input" value="${ct.email_contacto}"></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-clipboard-list mr-2"></i>Protocolos activos</div>
        <div class="grid grid-cols-3 gap-2">
          ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','VOZ'].map(p => `
            <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
              <input type="checkbox" class="ect-protocolo" value="${p}" ${ct.protocolos_activos.includes(p)?'checked':''}>
              <span class="text-sm font-medium text-gray-700">${p}</span>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="updateCentro(${id})"><i class="fas fa-save mr-1"></i>Guardar Cambios</button>
  `);
}

async function updateCentro(id) {
  const protocolos = [...document.querySelectorAll('.ect-protocolo:checked')].map(cb => cb.value);
  const body = {
    nombre: document.getElementById('ect-nombre').value.trim(),
    razon_social: document.getElementById('ect-razon').value.trim(),
    rut_empresa: document.getElementById('ect-rut').value.trim(),
    mutualidad: document.getElementById('ect-mutual').value,
    direccion: document.getElementById('ect-dir').value.trim(),
    n_trabajadores: parseInt(document.getElementById('ect-ntrab').value) || 0,
    responsable_prevencion: document.getElementById('ect-prevenc').value.trim(),
    email_contacto: document.getElementById('ect-email').value.trim(),
    protocolos_activos: protocolos
  };
  try {
    await API.put(`/centros/${id}`, body);
    showToast('Centro actualizado exitosamente', 'success');
    closeModal(); navigate('centros');
  } catch { showToast('Error al actualizar', 'error'); }
}

function confirmDeleteCentro(id) {
  showModal('⚠️ Confirmar Desactivación', `
    <div class="info-box-red">
      <p class="text-sm text-red-700 font-medium">¿Estás seguro de que deseas desactivar este centro de trabajo?</p>
      <p class="text-xs text-red-600 mt-2">El centro quedará inactivo pero sus datos se conservarán. Podrás reactivarlo posteriormente.</p>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="deleteCentro(${id})"><i class="fas fa-trash-alt mr-1"></i>Desactivar Centro</button>
  `);
}

async function deleteCentro(id) {
  try {
    await API.delete(`/centros/${id}`);
    showToast('Centro desactivado', 'success');
    closeModal(); navigate('centros');
  } catch { showToast('Error al desactivar', 'error'); }
}

// ================================================================
// USERS — SOLO SUPERADMIN
// ================================================================
async function renderUsers() {
  if (!isSuperAdmin()) {
    document.getElementById('page-content').innerHTML = `
      <div class="card p-10 text-center max-w-md mx-auto">
        <i class="fas fa-lock text-4xl text-gray-300 mb-3"></i>
        <h3 class="font-bold text-gray-600">Acceso Restringido</h3>
        <p class="text-sm text-gray-400 mt-2">Solo el Super Administrador puede gestionar usuarios.</p>
      </div>`;
    return;
  }
  setPageTitle('Gestión de Usuarios', 'Solo accesible para Super Administrador — Raúl Díaz Espejo');
  const [usersRes, rolesRes] = await Promise.all([API.get('/users'), API.get('/users/roles')]);
  const users = usersRes.data.data;
  const roles = rolesRes.data.data;
  const content = document.getElementById('page-content');

  content.innerHTML = `
    <!-- SA banner -->
    <div class="mb-5 p-4 rounded-xl flex items-start gap-3" style="background:linear-gradient(135deg,#fef3c7,#fffbeb);border:1.5px solid #fbbf24">
      <i class="fas fa-crown text-yellow-500 text-xl mt-0.5"></i>
      <div>
        <div class="font-bold text-yellow-800">Panel de Super Administrador</div>
        <div class="text-sm text-yellow-700 mt-0.5">Gestionas los accesos al sistema HSE 360. Solo tú, <strong>Raúl Díaz Espejo</strong>, tienes este privilegio. El rol Superadmin no puede ser asignado a otros usuarios.</div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
      <div class="card p-3 text-center hse-accent-top">
        <div class="text-2xl font-bold" style="color:var(--hse-green)">${users.length}</div>
        <div class="text-xs text-gray-500">Total usuarios</div>
      </div>
      ${Object.entries(roles).filter(([k]) => k !== 'superadmin').map(([k,v]) => `
        <div class="card p-3 text-center">
          <div class="text-2xl font-bold text-gray-700">${users.filter(u => u.rol === k).length}</div>
          <div class="text-xs text-gray-500">${v.label.split(' ')[0]}</div>
        </div>
      `).join('')}
    </div>

    <!-- Action bar -->
    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <input id="search-users" type="text" placeholder="Buscar usuario..." class="form-input flex-1" oninput="filterUsers()">
      <select id="filter-rol" class="form-input w-48" onchange="filterUsers()">
        <option value="all">Todos los roles</option>
        ${Object.entries(roles).filter(([k]) => k !== 'superadmin').map(([k,v]) =>
          `<option value="${k}">${v.label}</option>`).join('')}
      </select>
      <button class="btn btn-primary" onclick="showAddUserModal()">
        <i class="fas fa-user-plus"></i> Nuevo Usuario
      </button>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table" id="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>RUT</th>
              <th>Rol</th>
              <th>Centro de Trabajo</th>
              <th>Último acceso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="users-tbody">
            ${renderUsersRows(users)}
          </tbody>
        </table>
      </div>
    </div>
  `;
  window._allUsers = users;
  window._allRoles = roles;
  // Guardar mapa de centros
  try {
    const centrosRes = await API.get('/centros');
    window._centrosMap = {};
    centrosRes.data.data.forEach(c => { window._centrosMap[c.id] = c.nombre; });
  } catch { window._centrosMap = {}; }
}

function renderUsersRows(users) {
  const centrosMap = window._centrosMap || { 1: 'Planta Norte', 2: 'Bodega Sur', 3: 'Oficinas Admin.' };
  return users.map(u => `
    <tr id="user-row-${u.id}">
      <td>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-white"
            style="background:${u.rol==='superadmin'?'#d97706':u.rol==='prevencionista'?'#1d4ed8':u.rol==='medico'?'#16a34a':u.rol==='rrhh'?'#7c3aed':'#64748b'}">
            ${u.avatar_iniciales || '?'}
          </div>
          <div>
            <div class="font-semibold text-sm">${u.nombres} ${u.apellidos}</div>
            <div class="text-xs text-gray-400">${u.email}</div>
            <div class="text-xs text-gray-400">${u.cargo}</div>
          </div>
        </div>
      </td>
      <td class="font-mono text-xs text-gray-500">${u.rut}</td>
      <td>
        <span class="user-role-badge role-${u.rol}">
          <i class="fas ${u.rol_info?.icon} text-xs"></i>
          ${u.rol_info?.label || u.rol}
          ${u.rol==='superadmin'?'<i class="fas fa-crown text-xs ml-1"></i>':''}
        </span>
      </td>
      <td class="text-sm text-gray-600">
        ${u.centro_trabajo_id ? centrosMap[u.centro_trabajo_id] || 'Centro #'+u.centro_trabajo_id : '<span class="text-green-600 font-medium text-xs"><i class="fas fa-globe mr-1"></i>Todos</span>'}
      </td>
      <td class="text-xs text-gray-500">${u.ultimo_acceso ? formatDateTime(u.ultimo_acceso) : '<span class="text-gray-300">Sin acceso</span>'}</td>
      <td>
        ${u.activo
          ? '<span class="badge badge-green"><i class="fas fa-circle text-xs mr-1"></i>Activo</span>'
          : '<span class="badge badge-red"><i class="fas fa-circle text-xs mr-1"></i>Inactivo</span>'}
      </td>
      <td>
        ${u.rol !== 'superadmin' ? `
        <div class="flex gap-1">
          <button class="btn btn-secondary py-1 px-2 text-xs" onclick="showEditUserModal(${u.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-secondary py-1 px-2 text-xs" onclick="showResetPassModal(${u.id})" title="Reset contraseña">
            <i class="fas fa-key"></i>
          </button>
          ${u.activo
            ? `<button class="btn btn-danger py-1 px-2 text-xs" onclick="toggleUserStatus(${u.id},false)" title="Desactivar"><i class="fas fa-ban"></i></button>`
            : `<button class="btn btn-success py-1 px-2 text-xs" onclick="toggleUserStatus(${u.id},true)" title="Reactivar"><i class="fas fa-check"></i></button>`
          }
        </div>` : `<span class="text-xs text-gray-300 italic">Protegido</span>`}
      </td>
    </tr>
  `).join('');
}

function filterUsers() {
  const search = document.getElementById('search-users').value.toLowerCase();
  const rol = document.getElementById('filter-rol').value;
  let filtered = window._allUsers || [];
  if (search) filtered = filtered.filter(u =>
    (u.nombres + ' ' + u.apellidos).toLowerCase().includes(search) ||
    u.email.toLowerCase().includes(search) || u.rut.includes(search));
  if (rol !== 'all') filtered = filtered.filter(u => u.rol === rol);
  const tbody = document.getElementById('users-tbody');
  if (tbody) tbody.innerHTML = renderUsersRows(filtered);
}

async function showAddUserModal() {
  let centros = [];
  try { const r = await API.get('/centros'); centros = r.data.data.filter(c => c.activo); } catch {}
  const centroOpts = centros.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
  showModal('Crear Nuevo Usuario', `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-user mr-2"></i>Datos Personales</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Nombres *</label><input id="nu-nombres" class="form-input" placeholder="Nombres"></div>
          <div><label class="form-label">Apellidos *</label><input id="nu-apellidos" class="form-input" placeholder="Apellidos"></div>
          <div><label class="form-label">RUT *</label><input id="nu-rut" class="form-input" placeholder="12.345.678-9"></div>
          <div><label class="form-label">Cargo</label><input id="nu-cargo" class="form-input" placeholder="Cargo en la empresa"></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-shield-halved mr-2"></i>Acceso al Sistema</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Email (usuario de acceso) *</label>
            <input id="nu-email" type="email" class="form-input" placeholder="usuario@empresa.cl"></div>
          <div><label class="form-label">Contraseña *</label>
            <input id="nu-pass" type="password" class="form-input" placeholder="Mín. 8 caracteres"></div>
          <div><label class="form-label">Rol *</label>
            <select id="nu-rol" class="form-input">
              <option value="prevencionista">Prevencionista de Riesgos</option>
              <option value="medico">Médico / Enfermera Ocupacional</option>
              <option value="rrhh">RRHH</option>
              <option value="trabajador">Trabajador</option>
            </select></div>
          <div class="col-span-2"><label class="form-label">Centro de Trabajo asignado</label>
            <select id="nu-centro" class="form-input">
              <option value="">Sin asignación específica (acceso global)</option>
              ${centroOpts}
            </select></div>
        </div>
      </div>
      <div class="info-box">
        <p class="text-xs text-green-800"><i class="fas fa-info-circle mr-1"></i>
        El usuario recibirá acceso según los permisos de su rol. El rol <strong>Super Administrador</strong> está reservado exclusivamente para <strong>Raúl Díaz Espejo</strong> y no puede ser asignado.</p>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveNewUser()"><i class="fas fa-user-plus mr-1"></i>Crear Usuario</button>
  `);
}

async function saveNewUser() {
  const body = {
    nombres: document.getElementById('nu-nombres').value.trim(),
    apellidos: document.getElementById('nu-apellidos').value.trim(),
    rut: document.getElementById('nu-rut').value.trim(),
    cargo: document.getElementById('nu-cargo').value.trim(),
    email: document.getElementById('nu-email').value.trim(),
    password: document.getElementById('nu-pass').value,
    rol: document.getElementById('nu-rol').value,
    centro_trabajo_id: parseInt(document.getElementById('nu-centro').value) || null
  };
  if (!body.nombres || !body.apellidos || !body.email || !body.password || !body.rut) {
    showToast('Completa todos los campos obligatorios (*)','error'); return;
  }
  if (body.password.length < 8) { showToast('La contraseña debe tener al menos 8 caracteres','error'); return; }
  try {
    await API.post('/users', body);
    showToast('Usuario creado exitosamente', 'success');
    closeModal(); navigate('users');
  } catch(err) {
    showToast(err.response?.data?.error || 'Error al crear usuario','error');
  }
}

async function showEditUserModal(id) {
  const [userRes, centrosRes] = await Promise.all([
    API.get(`/users/${id}`),
    API.get('/centros')
  ]);
  const u = userRes.data.data;
  const centros = centrosRes.data.data.filter(c => c.activo);
  showModal(`Editar Usuario: ${u.nombres} ${u.apellidos}`, `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-user mr-2"></i>Datos Personales</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Nombres</label><input id="eu-nombres" class="form-input" value="${u.nombres}"></div>
          <div><label class="form-label">Apellidos</label><input id="eu-apellidos" class="form-input" value="${u.apellidos}"></div>
          <div><label class="form-label">RUT</label><input id="eu-rut" class="form-input" value="${u.rut}"></div>
          <div><label class="form-label">Cargo</label><input id="eu-cargo" class="form-input" value="${u.cargo}"></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-shield-halved mr-2"></i>Acceso</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Email</label>
            <input id="eu-email" type="email" class="form-input" value="${u.email}"></div>
          <div><label class="form-label">Rol</label>
            <select id="eu-rol" class="form-input">
              <option value="prevencionista" ${u.rol==='prevencionista'?'selected':''}>Prevencionista de Riesgos</option>
              <option value="medico" ${u.rol==='medico'?'selected':''}>Médico / Enfermera Ocupacional</option>
              <option value="rrhh" ${u.rol==='rrhh'?'selected':''}>RRHH</option>
              <option value="trabajador" ${u.rol==='trabajador'?'selected':''}>Trabajador</option>
            </select></div>
          <div><label class="form-label">Centro de Trabajo</label>
            <select id="eu-centro" class="form-input">
              <option value="">Sin asignación específica (acceso global)</option>
              ${centros.map(c => `<option value="${c.id}" ${u.centro_trabajo_id==c.id?'selected':''}>${c.nombre}</option>`).join('')}
            </select></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="updateUser(${id})"><i class="fas fa-save mr-1"></i>Guardar Cambios</button>
  `);
}

async function updateUser(id) {
  const body = {
    nombres: document.getElementById('eu-nombres').value.trim(),
    apellidos: document.getElementById('eu-apellidos').value.trim(),
    rut: document.getElementById('eu-rut').value.trim(),
    cargo: document.getElementById('eu-cargo').value.trim(),
    email: document.getElementById('eu-email').value.trim(),
    rol: document.getElementById('eu-rol').value,
    centro_trabajo_id: parseInt(document.getElementById('eu-centro').value) || null
  };
  try {
    await API.put(`/users/${id}`, body);
    showToast('Usuario actualizado', 'success');
    closeModal(); navigate('users');
  } catch(err) { showToast(err.response?.data?.error || 'Error','error'); }
}

function showResetPassModal(id) {
  showModal('Restablecer Contraseña', `
    <div class="space-y-3">
      <div class="info-box-yellow text-sm text-yellow-800">
        <i class="fas fa-exclamation-triangle mr-1"></i>
        Esta acción restablecerá la contraseña del usuario. El usuario deberá iniciar sesión con la nueva contraseña.
      </div>
      <div><label class="form-label">Nueva Contraseña</label>
        <input id="np-pass" type="password" class="form-input" placeholder="Mín. 8 caracteres">
      </div>
      <div><label class="form-label">Confirmar Contraseña</label>
        <input id="np-pass2" type="password" class="form-input" placeholder="Repetir contraseña">
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="doResetPass(${id})"><i class="fas fa-key mr-1"></i>Restablecer</button>
  `);
}

async function doResetPass(id) {
  const p1 = document.getElementById('np-pass').value;
  const p2 = document.getElementById('np-pass2').value;
  if (p1.length < 8) { showToast('Mínimo 8 caracteres','error'); return; }
  if (p1 !== p2) { showToast('Las contraseñas no coinciden','error'); return; }
  try {
    await API.put(`/users/${id}`, { password: p1 });
    showToast('Contraseña restablecida', 'success');
    closeModal();
  } catch { showToast('Error al restablecer','error'); }
}

async function toggleUserStatus(id, activate) {
  try {
    if (activate) {
      await API.patch(`/users/${id}/reactivar`);
      showToast('Usuario reactivado', 'success');
    } else {
      await API.delete(`/users/${id}`);
      showToast('Usuario desactivado', 'success');
    }
    navigate('users');
  } catch(err) { showToast(err.response?.data?.error || 'Error','error'); }
}


// ================================================================
// DASHBOARD
// ================================================================
async function renderDashboard() {
  setPageTitle('Dashboard HSE 360', 'Resumen ejecutivo — ' + new Date().toLocaleDateString('es-CL',{year:'numeric',month:'long'}));
  const [kpisRes, chartAccRes, chartProtRes] = await Promise.all([
    API.get('/dashboard/kpis'),
    API.get('/dashboard/chart-accidentes'),
    API.get('/dashboard/chart-protocolos'),
  ]);
  const k = kpisRes.data.data;
  const ca = chartAccRes.data.data;
  const cp = chartProtRes.data.data;
  const content = document.getElementById('page-content');

  content.innerHTML = `
    <!-- Header strip -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
          style="background:linear-gradient(135deg,var(--hse-green),var(--hse-green-dark))">360</div>
        <div>
          <div class="text-sm font-semibold text-gray-700">${new Date().toLocaleDateString('es-CL',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
          <div class="text-xs text-gray-400">Bienvenido/a, ${App.currentUser?.nombres} ${App.currentUser?.apellidos}</div>
        </div>
      </div>
      <div class="flex gap-2">
        <span class="badge badge-hse"><i class="fas fa-circle-check mr-1"></i>Sistema Operativo</span>
        <span class="badge badge-blue">HSE 360 · 2026</span>
      </div>
    </div>

    <!-- KPI Row 1 — Big metrics -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      ${kpiCard('Trabajadores Activos', k.trabajadores.activos, k.trabajadores.total + ' registrados', 'fa-users', 'from-blue-600 to-blue-800', k.trabajadores.con_examenes_pendientes + ' con exámenes pendientes')}
      ${kpiCard('Tasa Accidentabilidad', k.accidentabilidad.tasa + '%', 'Meta: ≤ ' + k.accidentabilidad.meta + '%', 'fa-triangle-exclamation', k.accidentabilidad.tasa <= k.accidentabilidad.meta ? 'from-green-600 to-green-800' : 'from-red-600 to-red-800', (k.accidentabilidad.variacion > 0 ? '▲' : '▼') + ' ' + Math.abs(k.accidentabilidad.variacion) + '% vs 2025')}
      ${kpiCard('Tasa Siniestralidad', k.siniestralidad.tasa + '%', 'Meta: ≤ ' + k.siniestralidad.meta + '%', 'fa-bed-pulse', k.siniestralidad.tasa <= k.siniestralidad.meta ? 'from-green-600 to-green-800' : 'from-orange-600 to-orange-800', k.accidentabilidad.dias_perdidos + ' días perdidos YTD 2026')}
      ${kpiCard('Alertas Activas', k.alertas_activas, '3 críticas · 5 altas', 'fa-bell', 'from-red-500 to-red-700', 'Requieren atención inmediata')}
    </div>

    <!-- KPI Row 2 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <div class="card p-4 hse-accent-top">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Protocolos MINSAL</div>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:var(--hse-green-light)">
            <i class="fas fa-clipboard-list text-sm" style="color:var(--hse-green)"></i>
          </div>
        </div>
        <div class="text-2xl font-bold text-gray-800">${k.protocolos.cumplimiento_pct}%</div>
        <div class="text-xs text-gray-500 mb-2">Cumplimiento general</div>
        <div class="progress-bar"><div class="progress-fill" style="width:${k.protocolos.cumplimiento_pct}%;background:var(--hse-green)"></div></div>
        <div class="flex gap-3 mt-2 text-xs">
          <span class="text-green-600 font-medium">${k.protocolos.al_dia} al día</span>
          <span class="text-yellow-600 font-medium">${k.protocolos.por_vencer} por vencer</span>
          <span class="text-red-600 font-medium">${k.protocolos.criticos} crítico</span>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Exámenes Médicos</div>
          <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"><i class="fas fa-stethoscope text-green-600 text-sm"></i></div>
        </div>
        <div class="text-2xl font-bold text-gray-800">${k.examenes.total_vigentes}</div>
        <div class="text-xs text-gray-500 mb-2">Vigentes actualmente</div>
        <div class="flex flex-col gap-1 text-xs">
          <div class="flex justify-between"><span class="text-yellow-600">Por vencer (90d)</span><span class="font-bold">${k.examenes.por_vencer}</span></div>
          <div class="flex justify-between"><span class="text-red-600">Vencidos</span><span class="font-bold text-red-600">${k.examenes.vencidos}</span></div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Inventario EPP</div>
          <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center"><i class="fas fa-hard-hat text-orange-600 text-sm"></i></div>
        </div>
        <div class="text-2xl font-bold text-gray-800">${k.epp.items_criticos}</div>
        <div class="text-xs text-gray-500 mb-2">Ítems en stock crítico</div>
        <div class="flex flex-col gap-1 text-xs">
          <div class="flex justify-between"><span class="text-yellow-600">Stock bajo</span><span class="font-bold">${k.epp.items_bajo_stock}</span></div>
          <div class="flex justify-between"><span class="text-blue-600">Firmas pendientes</span><span class="font-bold">${k.epp.entregas_pendientes}</span></div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Capacitaciones ODI</div>
          <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><i class="fas fa-graduation-cap text-indigo-600 text-sm"></i></div>
        </div>
        <div class="text-2xl font-bold text-gray-800">${k.capacitaciones.cobertura_odi}%</div>
        <div class="text-xs text-gray-500 mb-2">Cobertura ODI 2026</div>
        <div class="progress-bar mb-2"><div class="progress-fill bg-indigo-500" style="width:${k.capacitaciones.cobertura_odi}%"></div></div>
        <div class="flex gap-2 text-xs">
          <span class="text-red-600 font-medium">${k.capacitaciones.vencidas} vencidas</span>
          <span class="text-yellow-600 font-medium">${k.capacitaciones.por_vencer} por vencer</span>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-bold text-gray-800">Accidentabilidad 2026</h3>
            <p class="text-xs text-gray-400">Accidentes y días perdidos por mes — Ley 16.744</p>
          </div>
          <span class="badge badge-hse">YTD 2026</span>
        </div>
        <canvas id="chart-accidentes" height="200"></canvas>
      </div>
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-bold text-gray-800">Cumplimiento Protocolos MINSAL</h3>
            <p class="text-xs text-gray-400">% cumplimiento por protocolo — 2026</p>
          </div>
          <button class="btn btn-secondary text-xs py-1.5" onclick="navigate('protocols')">Ver detalle</button>
        </div>
        <canvas id="chart-protocolos" height="200"></canvas>
      </div>
    </div>

    <!-- Alerts preview + quick actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div class="lg:col-span-2 card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800">Alertas Prioritarias</h3>
          <button class="btn btn-secondary text-xs py-1.5" onclick="navigate('alerts')">Ver todas</button>
        </div>
        <div id="alerts-preview"><div class="spinner mx-auto w-6 h-6"></div></div>
      </div>
      <div class="card p-5">
        <h3 class="font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
        <div class="flex flex-col gap-2">
          <button class="btn btn-secondary justify-start text-sm" onclick="navigate('workers')"><i class="fas fa-user-plus" style="color:var(--hse-green)"></i> Nuevo Trabajador</button>
          <button class="btn btn-secondary justify-start text-sm" onclick="navigate('accidents')"><i class="fas fa-file-medical-alt text-red-500"></i> Registrar Accidente (DIAT)</button>
          <button class="btn btn-secondary justify-start text-sm" onclick="navigate('epp')"><i class="fas fa-hard-hat text-orange-500"></i> Entrega de EPP</button>
          <button class="btn btn-secondary justify-start text-sm" onclick="navigate('capacitations')"><i class="fas fa-graduation-cap text-purple-500"></i> Nueva Capacitación</button>
          <button class="btn btn-secondary justify-start text-sm" onclick="navigate('miper')"><i class="fas fa-triangle-exclamation text-yellow-500"></i> Actualizar MIPER</button>
          ${isSuperAdmin() ? `
          <button class="btn btn-secondary justify-start text-sm" onclick="navigate('centros')"><i class="fas fa-building text-blue-500"></i> Gestionar Centros</button>
          <button class="btn btn-secondary justify-start text-sm" onclick="navigate('users')"><i class="fas fa-user-shield text-amber-600"></i> Gestionar Usuarios</button>
          ` : ''}
        </div>
      </div>
    </div>

    <!-- NexusForge mini brand footer -->
    <div class="mt-5 flex items-center justify-between px-1 pb-1">
      <div class="text-xs text-gray-400">HSE 360 v2.0 · Sistema de Gestión Integral de Seguridad y Salud · Chile 2026</div>
      <div class="nexusforge-badge-mini" onclick="navigate('reports')" title="NexusForge — Desarrollos y Arquitectura de Software & Apps">
        <svg width="18" height="18" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="nf-grad-dash" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#6366f1"/>
              <stop offset="100%" stop-color="#0ea5e9"/>
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="9" fill="url(#nf-grad-dash)"/>
          <path d="M8 28 L8 12 L16 12 L24 24 L24 12 L32 12 L32 28 L24 28 L16 16 L16 28 Z" fill="white" opacity="0.95"/>
          <circle cx="32" cy="28" r="4" fill="#22d3ee" opacity="0.9"/>
        </svg>
        <span class="nf-mini-text">Desarrollado por <strong>NexusForge</strong></span>
      </div>
    </div>
  `;

  renderChartAccidentes(ca);
  renderChartProtocolos(cp);

  try {
    const alertsRes = await API.get('/alerts');
    const alerts = alertsRes.data.data.filter(a => a.prioridad === 'critica' || a.prioridad === 'alta').slice(0, 5);
    document.getElementById('alerts-preview').innerHTML = alerts.length ? alerts.map(a => `
      <div class="alert-${a.prioridad} rounded-lg p-3 mb-2 flex items-start gap-3">
        <div class="mt-0.5"><i class="fas fa-${a.prioridad === 'critica' ? 'circle-exclamation text-red-500' : 'triangle-exclamation text-orange-500'}"></i></div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-sm text-gray-800 truncate">${a.titulo}</div>
          <div class="text-xs text-gray-500 mt-0.5 line-clamp-1">${a.descripcion}</div>
        </div>
        <span class="badge ${a.prioridad === 'critica' ? 'badge-red' : 'badge-orange'} text-xs flex-shrink-0">${a.prioridad}</span>
      </div>
    `).join('') : '<div class="text-center py-6 text-gray-400 text-sm"><i class="fas fa-check-circle text-green-500 text-2xl mb-2"></i><div>Sin alertas críticas</div></div>';
  } catch {}
}

function kpiCard(title, value, sub, icon, gradient, footer) {
  return `
    <div class="kpi-card bg-gradient-to-br ${gradient} text-white">
      <div class="flex items-start justify-between">
        <div>
          <div class="text-xs font-semibold opacity-75 uppercase tracking-wide mb-1">${title}</div>
          <div class="text-3xl font-bold">${value}</div>
          <div class="text-xs opacity-75 mt-1">${sub}</div>
        </div>
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:rgba(255,255,255,0.15)">
          <i class="fas ${icon}"></i>
        </div>
      </div>
      <div class="text-xs mt-3 opacity-60 border-t border-white border-opacity-20 pt-2">${footer}</div>
    </div>`;
}

function renderChartAccidentes(data) {
  const ctx = document.getElementById('chart-accidentes');
  if (!ctx) return;
  if (App.charts.accidentes) App.charts.accidentes.destroy();
  App.charts.accidentes = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        { label: 'Accidentes 2026', data: data.accidentes, backgroundColor: 'rgba(220,38,38,0.8)', borderRadius: 4 },
        { label: 'Accidentes 2025', data: data.año_anterior, backgroundColor: 'rgba(203,213,225,0.6)', borderRadius: 4 },
        { label: 'Días Perdidos', data: data.dias_perdidos, type: 'line', borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.1)', tension: 0.4, yAxisID: 'y1', fill: true }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } } },
        y1: { position: 'right', beginAtZero: true, ticks: { font: { size: 11 } }, grid: { drawOnChartArea: false } }
      }
    }
  });
}

function renderChartProtocolos(data) {
  const ctx = document.getElementById('chart-protocolos');
  if (!ctx) return;
  if (App.charts.protocolos) App.charts.protocolos.destroy();
  App.charts.protocolos = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{ label: '% Cumplimiento 2026', data: data.cumplimiento, backgroundColor: data.colores, borderRadius: 6 }]
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%', font: { size: 11 } } },
        y: { ticks: { font: { size: 11 } } }
      }
    }
  });
}

// ================================================================
// WORKERS
// ================================================================
async function renderWorkers() {
  setPageTitle('Trabajadores', 'Ficha integral y gestión de personal — 2026');
  const res = await API.get('/workers');
  const workers = res.data.data;
  const content = document.getElementById('page-content');
  const areas = [...new Set(workers.map(w => w.area))];

  content.innerHTML = `
    <div class="flex flex-col sm:flex-row gap-3 mb-5">
      <input id="search-workers" type="text" placeholder="Buscar por nombre, RUT, cargo..." class="form-input flex-1" oninput="filterWorkers()">
      <select id="filter-area" class="form-input w-48" onchange="filterWorkers()">
        <option value="all">Todas las áreas</option>
        ${areas.map(a => `<option value="${a}">${a}</option>`).join('')}
      </select>
      <button class="btn btn-primary" onclick="showAddWorkerModal()"><i class="fas fa-user-plus"></i> Agregar Trabajador</button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      <div class="card p-3 text-center hse-accent-top"><div class="text-2xl font-bold" style="color:var(--hse-green)">${workers.length}</div><div class="text-xs text-gray-500">Total trabajadores</div></div>
      <div class="card p-3 text-center border-t-4 border-green-500"><div class="text-2xl font-bold text-green-600">${workers.filter(w=>w.estado==='activo').length}</div><div class="text-xs text-gray-500">Activos</div></div>
      <div class="card p-3 text-center border-t-4 border-yellow-400"><div class="text-2xl font-bold text-yellow-600">${workers.filter(w=>w.examenes_pendientes>0).length}</div><div class="text-xs text-gray-500">Exámenes pendientes</div></div>
      <div class="card p-3 text-center border-t-4 border-purple-500"><div class="text-2xl font-bold text-purple-600">${workers.filter(w=>w.protocolos_activos?.length>0).length}</div><div class="text-xs text-gray-500">En protocolos activos</div></div>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table sticky-header" id="workers-table">
          <thead><tr>
            <th>Trabajador</th><th>RUT</th><th>Cargo / Área</th>
            <th>Mutualidad</th><th>Ingreso</th><th>Protocolos</th>
            <th>Exámenes</th><th>Estado</th><th>Acciones</th>
          </tr></thead>
          <tbody id="workers-tbody">${renderWorkersRows(workers)}</tbody>
        </table>
      </div>
    </div>
  `;
  window._allWorkers = workers;
}

function renderWorkersRows(workers) {
  return workers.map(w => `
    <tr>
      <td>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style="background:${stringToColor(w.nombres)}">
            ${(w.nombres[0]||'')+(w.apellidos[0]||'')}
          </div>
          <div>
            <div class="font-semibold text-sm">${w.nombres} ${w.apellidos}</div>
            <div class="text-xs text-gray-400">${w.email}</div>
          </div>
        </div>
      </td>
      <td class="font-mono text-xs text-gray-500">${w.rut}</td>
      <td>
        <div class="text-sm font-medium">${w.cargo}</div>
        <div class="text-xs text-gray-400">${w.area}</div>
      </td>
      <td><span class="badge badge-blue text-xs">${w.mutualidad}</span></td>
      <td class="text-xs text-gray-500">${formatDate(w.fecha_ingreso)}</td>
      <td>
        ${(w.protocolos_activos||[]).slice(0,3).map(p=>`<span class="badge badge-hse text-xs mr-0.5">${p}</span>`).join('')}
        ${(w.protocolos_activos||[]).length > 3 ? `<span class="text-xs text-gray-400">+${w.protocolos_activos.length-3}</span>` : ''}
      </td>
      <td>
        ${w.examenes_pendientes > 0
          ? `<span class="badge badge-red text-xs">${w.examenes_pendientes} pendientes</span>`
          : '<span class="badge badge-green text-xs">Al día</span>'}
      </td>
      <td>${estadoBadgeGeneric(w.estado)}</td>
      <td>
        <div class="flex gap-1">
          <button class="btn btn-secondary py-1 px-2 text-xs" onclick="navigate('worker-detail',{id:${w.id}})" title="Ver ficha">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-secondary py-1 px-2 text-xs" onclick="showEditWorkerModal(${w.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterWorkers() {
  const s = document.getElementById('search-workers').value.toLowerCase();
  const area = document.getElementById('filter-area').value;
  let filtered = window._allWorkers || [];
  if (s) filtered = filtered.filter(w => (w.nombres+' '+w.apellidos+w.rut+w.cargo).toLowerCase().includes(s));
  if (area !== 'all') filtered = filtered.filter(w => w.area === area);
  const tbody = document.getElementById('workers-tbody');
  if (tbody) tbody.innerHTML = renderWorkersRows(filtered);
}

async function renderWorkerDetail(id) {
  const res = await API.get(`/workers/${id}`);
  const w = res.data.data;
  setPageTitle(`${w.nombres} ${w.apellidos}`, 'Ficha integral del trabajador — ID #' + id);
  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="flex items-center gap-3 mb-5">
      <button class="btn btn-secondary text-sm" onclick="navigate('workers')"><i class="fas fa-arrow-left mr-1"></i>Volver</button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Left: Profile card -->
      <div class="card p-5">
        <div class="text-center mb-4">
          <div class="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white font-bold text-2xl mb-3"
            style="background:${stringToColor(w.nombres)}">${w.nombres[0]}${w.apellidos[0]}</div>
          <h2 class="font-bold text-gray-800 text-lg">${w.nombres} ${w.apellidos}</h2>
          <div class="text-sm text-gray-500">${w.cargo}</div>
          <div class="text-xs text-gray-400 mt-1">${w.area}</div>
          <div class="mt-2">${estadoBadgeGeneric(w.estado)}</div>
        </div>
        <hr class="section-sep">
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-gray-500">RUT</span><span class="font-mono font-semibold">${w.rut}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Nacimiento</span><span>${formatDate(w.fecha_nacimiento)}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Ingreso</span><span>${formatDate(w.fecha_ingreso)}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Mutualidad</span><span class="badge badge-blue text-xs">${w.mutualidad}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Teléfono</span><span>${w.telefono || '—'}</span></div>
          <div class="text-xs text-gray-400 mt-1 break-all">${w.email}</div>
        </div>
        <hr class="section-sep">
        <div class="flex gap-2 mt-3">
          <button class="btn btn-primary flex-1 justify-center text-xs" onclick="showEditWorkerModal(${w.id})"><i class="fas fa-edit"></i> Editar</button>
        </div>
      </div>
      <!-- Right: Details -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Protocolos asignados -->
        <div class="card p-4">
          <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-clipboard-list mr-2" style="color:var(--hse-green)"></i>Protocolos MINSAL Asociados</h3>
          <div class="flex flex-wrap gap-2">
            ${(w.protocolos_activos||[]).map(p => `
              <button class="badge badge-blue cursor-pointer hover:bg-blue-200 text-sm"
                onclick="navigate('protocol-detail',{id:'${p}'})">${p}</button>
            `).join('')}
            ${(!w.protocolos_activos || w.protocolos_activos.length===0) ? '<span class="text-sm text-gray-400">Sin protocolos asignados</span>' : ''}
          </div>
        </div>
        <!-- Exámenes -->
        <div class="card p-4">
          <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-stethoscope mr-2 text-green-600"></i>Exámenes Médicos</h3>
          <div class="space-y-2">
            ${(w.examenes||[]).map(e => `
              <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <div class="font-medium text-sm">${e.tipo}</div>
                  <div class="text-xs text-gray-400">${formatDate(e.fecha)} · Vigencia hasta ${formatDate(e.vigencia)}</div>
                </div>
                ${estadoBadgeGeneric(e.estado)}
              </div>
            `).join('') || '<div class="text-sm text-gray-400">Sin exámenes registrados</div>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

function showAddWorkerModal() {
  showModal('Registrar Nuevo Trabajador', `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-user mr-2"></i>Datos Personales</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">RUT *</label><input id="w-rut" class="form-input" placeholder="12.345.678-9"></div>
          <div><label class="form-label">Nombres *</label><input id="w-nombres" class="form-input" placeholder="Nombres"></div>
          <div><label class="form-label">Apellidos *</label><input id="w-apellidos" class="form-input" placeholder="Apellidos"></div>
          <div><label class="form-label">Fecha de Nacimiento</label><input id="w-nacimiento" type="date" class="form-input"></div>
          <div><label class="form-label">Sexo</label>
            <select id="w-sexo" class="form-input"><option value="M">Masculino</option><option value="F">Femenino</option></select></div>
          <div><label class="form-label">Teléfono</label><input id="w-tel" class="form-input" placeholder="+56 9 1234 5678"></div>
          <div class="col-span-2"><label class="form-label">Email</label><input id="w-email" type="email" class="form-input" placeholder="trabajador@empresa.cl"></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-briefcase mr-2"></i>Datos Laborales</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Cargo *</label><input id="w-cargo" class="form-input" placeholder="Cargo en la empresa"></div>
          <div><label class="form-label">Área</label>
            <select id="w-area" class="form-input">
              <option>Producción</option><option>Administración</option><option>Logística</option>
              <option>Mantenimiento</option><option>Bodega</option><option>Terreno</option><option>Taller</option>
            </select></div>
          <div><label class="form-label">Fecha de Ingreso *</label><input id="w-ingreso" type="date" class="form-input"></div>
          <div><label class="form-label">Turno</label>
            <select id="w-turno" class="form-input">
              <option>Diurno</option><option>Nocturno</option><option>Mixto</option><option>4x4</option><option>Administrativo</option>
            </select></div>
          <div><label class="form-label">Mutualidad *</label>
            <select id="w-mutual" class="form-input">
              <option>ACHS</option><option>IST</option><option>Mutual de Seguridad CChC</option><option>ISL</option>
            </select></div>
          <div><label class="form-label">Tipo de Contrato</label>
            <select id="w-contrato" class="form-input">
              <option>Indefinido</option><option>Plazo fijo</option><option>Por obra o faena</option><option>Part-time</option>
            </select></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-clipboard-list mr-2"></i>Protocolos MINSAL aplicables</div>
        <div class="grid grid-cols-3 gap-2">
          ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','VOZ'].map(p => `
            <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
              <input type="checkbox" class="w-proto" value="${p}">
              <span class="text-sm font-medium text-gray-700">${p}</span>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveWorker()"><i class="fas fa-save mr-1"></i>Registrar Trabajador</button>
  `);
}

async function showEditWorkerModal(id) {
  const res = await API.get(`/workers/${id}`);
  const w = res.data.data;
  showModal(`Editar: ${w.nombres} ${w.apellidos}`, `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-user mr-2"></i>Datos Personales</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">RUT</label><input id="ew-rut" class="form-input" value="${w.rut}" disabled></div>
          <div><label class="form-label">Nombres</label><input id="ew-nombres" class="form-input" value="${w.nombres}"></div>
          <div><label class="form-label">Apellidos</label><input id="ew-apellidos" class="form-input" value="${w.apellidos}"></div>
          <div><label class="form-label">Teléfono</label><input id="ew-tel" class="form-input" value="${w.telefono||''}"></div>
          <div class="col-span-2"><label class="form-label">Email</label><input id="ew-email" type="email" class="form-input" value="${w.email}"></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-briefcase mr-2"></i>Datos Laborales</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Cargo</label><input id="ew-cargo" class="form-input" value="${w.cargo}"></div>
          <div><label class="form-label">Área</label><input id="ew-area" class="form-input" value="${w.area}"></div>
          <div><label class="form-label">Mutualidad</label>
            <select id="ew-mutual" class="form-input">
              ${['ACHS','IST','Mutual de Seguridad CChC','ISL'].map(m=>`<option ${w.mutualidad===m?'selected':''}>${m}</option>`).join('')}
            </select></div>
          <div><label class="form-label">Estado</label>
            <select id="ew-estado" class="form-input">
              <option value="activo" ${w.estado==='activo'?'selected':''}>Activo</option>
              <option value="inactivo" ${w.estado==='inactivo'?'selected':''}>Inactivo</option>
              <option value="licencia" ${w.estado==='licencia'?'selected':''}>Con licencia</option>
            </select></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="updateWorker(${id})"><i class="fas fa-save mr-1"></i>Guardar Cambios</button>
  `);
}

async function updateWorker(id) {
  const body = {
    nombres: document.getElementById('ew-nombres').value.trim(),
    apellidos: document.getElementById('ew-apellidos').value.trim(),
    telefono: document.getElementById('ew-tel').value.trim(),
    email: document.getElementById('ew-email').value.trim(),
    cargo: document.getElementById('ew-cargo').value.trim(),
    area: document.getElementById('ew-area').value.trim(),
    mutualidad: document.getElementById('ew-mutual').value,
    estado: document.getElementById('ew-estado').value
  };
  try {
    await API.put(`/workers/${id}`, body);
    showToast('Trabajador actualizado', 'success');
    closeModal(); navigate('workers');
  } catch { showToast('Error al actualizar','error'); }
}

function saveWorker() {
  const protocolos = [...document.querySelectorAll('.w-proto:checked')].map(cb => cb.value);
  const body = {
    rut: document.getElementById('w-rut').value.trim(),
    nombres: document.getElementById('w-nombres').value.trim(),
    apellidos: document.getElementById('w-apellidos').value.trim(),
    fecha_nacimiento: document.getElementById('w-nacimiento').value,
    sexo: document.getElementById('w-sexo').value,
    telefono: document.getElementById('w-tel').value.trim(),
    email: document.getElementById('w-email').value.trim(),
    cargo: document.getElementById('w-cargo').value.trim(),
    area: document.getElementById('w-area').value,
    fecha_ingreso: document.getElementById('w-ingreso').value,
    turno: document.getElementById('w-turno').value,
    mutualidad: document.getElementById('w-mutual').value,
    tipo_contrato: document.getElementById('w-contrato').value,
    protocolos_activos: protocolos,
    estado: 'activo'
  };
  if (!body.rut || !body.nombres || !body.apellidos || !body.cargo) {
    showToast('Completa los campos obligatorios (*)','error'); return;
  }
  showToast('Trabajador registrado exitosamente', 'success');
  closeModal();
  navigate('workers');
}


// ================================================================
// EPP — Control de Equipos de Protección Personal
// ================================================================
async function renderEPP() {
  setPageTitle('Control de EPP', 'Inventario y entregas — Ley 16.744 Art. 68');
  const [invRes, statsRes, delRes] = await Promise.all([
    API.get('/epp/inventario'),
    API.get('/epp/stats'),
    API.get('/epp/entregas')
  ]);
  const inv = invRes.data.data;
  const stats = statsRes.data.data;
  const entregas = delRes.data.data;
  const content = document.getElementById('page-content');

  content.innerHTML = `
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      ${kpiCard('Total Ítems EPP', stats.total_items, 'En inventario', 'fa-hard-hat', 'from-slate-600 to-slate-800', 'Actualizado hoy')}
      ${kpiCard('Stock Crítico', stats.items_criticos, 'Requieren reposición urgente', 'fa-circle-exclamation', 'from-red-600 to-red-800', 'Acción inmediata requerida')}
      ${kpiCard('Stock Bajo', stats.items_bajo_stock, 'Por debajo del mínimo', 'fa-triangle-exclamation', 'from-orange-500 to-orange-700', 'Programar reposición')}
      ${kpiCard('Firmas Pendientes', stats.entregas_pendientes_firma, 'Entregas sin firma digital', 'fa-signature', 'from-purple-600 to-purple-800', 'Requieren confirmación')}
    </div>

    <!-- Tabs -->
    <div class="card overflow-hidden">
      <div class="flex border-b border-gray-100">
        <button id="tab-inv" class="tab-btn active px-5 py-3 text-sm font-semibold" onclick="switchTab('inv','epp')">
          <i class="fas fa-boxes-stacked mr-2"></i>Inventario
        </button>
        <button id="tab-entregas" class="tab-btn px-5 py-3 text-sm font-semibold" onclick="switchTab('entregas','epp')">
          <i class="fas fa-hand-holding mr-2"></i>Historial Entregas
        </button>
      </div>

      <!-- Inventario -->
      <div id="panel-inv" class="p-4">
        <div class="flex flex-col sm:flex-row gap-3 mb-4">
          <input id="search-epp" type="text" placeholder="Buscar EPP..." class="form-input flex-1" oninput="filterEPP()">
          <select id="filter-cat" class="form-input w-48" onchange="filterEPP()">
            <option value="all">Todas las categorías</option>
            ${[...new Set(inv.map(i => i.categoria))].map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
          ${canDo('epp:write') ? `<button class="btn btn-primary" onclick="showAddEPPModal()"><i class="fas fa-plus"></i> Agregar Ítem</button>` : ''}
        </div>
        <div class="overflow-x-auto">
          <table class="data-table" id="epp-table">
            <thead><tr>
              <th>EPP</th><th>Categoría</th><th>Marca / Modelo</th><th>Stock Actual</th>
              <th>Stock Mínimo</th><th>Norma</th><th>Vencimiento Lote</th><th>Estado</th><th>Acciones</th>
            </tr></thead>
            <tbody id="epp-tbody">${renderEPPRows(inv)}</tbody>
          </table>
        </div>
      </div>

      <!-- Entregas -->
      <div id="panel-entregas" class="p-4 hidden">
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead><tr>
              <th>Trabajador</th><th>EPP Entregado</th><th>Cantidad</th>
              <th>Fecha Entrega</th><th>Próxima Renovación</th><th>Firma Digital</th><th>Estado</th>
            </tr></thead>
            <tbody>
              ${entregas.map(e => `
                <tr>
                  <td><div class="font-medium text-sm">${e.trabajador_nombre}</div><div class="text-xs text-gray-400">${e.trabajador_rut}</div></td>
                  <td class="font-medium text-sm">${e.epp_nombre}</td>
                  <td class="text-center font-bold">${e.cantidad}</td>
                  <td class="text-xs text-gray-500">${formatDate(e.fecha_entrega)}</td>
                  <td class="text-xs ${e.dias_para_renovacion <= 30 ? 'text-red-600 font-bold' : 'text-gray-500'}">${formatDate(e.proxima_renovacion)}</td>
                  <td>
                    ${e.firma_digital
                      ? '<span class="badge badge-green text-xs"><i class="fas fa-check mr-1"></i>Firmado</span>'
                      : `<button class="btn btn-primary py-1 px-2 text-xs" onclick="registrarFirma(${e.id})"><i class="fas fa-signature mr-1"></i>Firmar</button>`}
                  </td>
                  <td>${estadoBadgeGeneric(e.estado_registro)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  window._allEPP = inv;
}

function renderEPPRows(items) {
  return items.map(item => `
    <tr>
      <td>
        <div class="font-semibold text-sm">${item.nombre}</div>
        <div class="text-xs text-gray-400">${item.descripcion || ''}</div>
      </td>
      <td><span class="badge badge-blue text-xs">${item.categoria}</span></td>
      <td class="text-sm text-gray-600">${item.marca} / ${item.modelo}</td>
      <td>
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold ${item.stock_actual <= item.stock_minimo ? 'text-red-600' : item.stock_actual <= item.stock_minimo * 1.5 ? 'text-yellow-600' : 'text-green-600'}">${item.stock_actual}</span>
          <span class="text-xs text-gray-400">uds</span>
        </div>
      </td>
      <td class="text-sm text-gray-500">${item.stock_minimo} uds</td>
      <td class="text-xs font-mono text-gray-500">${item.norma_tecnica || '—'}</td>
      <td class="text-xs ${item.dias_vencimiento <= 60 ? 'text-red-600 font-bold' : 'text-gray-500'}">${formatDate(item.fecha_vencimiento_lote)}</td>
      <td>${stockBadge(item.stock_actual, item.stock_minimo)}</td>
      <td>
        <div class="flex gap-1">
          <button class="btn btn-primary py-1 px-2 text-xs" onclick="showEntregaEPPModal(${item.id})" title="Registrar entrega">
            <i class="fas fa-hand-holding"></i>
          </button>
          ${canDo('epp:write') ? `
          <button class="btn btn-secondary py-1 px-2 text-xs" onclick="showEditEPPModal(${item.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function filterEPP() {
  const s = document.getElementById('search-epp').value.toLowerCase();
  const cat = document.getElementById('filter-cat').value;
  let filtered = window._allEPP || [];
  if (s) filtered = filtered.filter(i => (i.nombre + i.categoria + i.marca).toLowerCase().includes(s));
  if (cat !== 'all') filtered = filtered.filter(i => i.categoria === cat);
  const tbody = document.getElementById('epp-tbody');
  if (tbody) tbody.innerHTML = renderEPPRows(filtered);
}

function switchTab(tab, module) {
  const panels = { inv: 'panel-inv', entregas: 'panel-entregas' };
  Object.values(panels).forEach(p => { const el = document.getElementById(p); if (el) el.classList.add('hidden'); });
  const target = document.getElementById('panel-' + tab);
  if (target) target.classList.remove('hidden');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('tab-' + tab);
  if (btn) btn.classList.add('active');
}

function showEntregaEPPModal(eppId) {
  showModal('Registrar Entrega de EPP', `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-hand-holding mr-2"></i>Datos de la Entrega</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Trabajador (RUT o Nombre) *</label>
            <input id="ent-trab" class="form-input" placeholder="Buscar trabajador..."></div>
          <div><label class="form-label">Cantidad *</label>
            <input id="ent-cant" type="number" min="1" class="form-input" placeholder="1" value="1"></div>
          <div><label class="form-label">Fecha de Entrega *</label>
            <input id="ent-fecha" type="date" class="form-input" value="${new Date().toISOString().split('T')[0]}"></div>
          <div class="col-span-2"><label class="form-label">Próxima Renovación</label>
            <input id="ent-renovacion" type="date" class="form-input"></div>
          <div class="col-span-2"><label class="form-label">Observaciones</label>
            <textarea id="ent-obs" class="form-input" rows="2" placeholder="Instrucciones de uso, estado del EPP..."></textarea></div>
        </div>
      </div>
      <div class="info-box">
        <p class="text-xs text-green-800"><i class="fas fa-info-circle mr-1"></i>
        La entrega quedará registrada. Se solicitará firma digital al trabajador al momento de la entrega física. DS 594 Art. 53 y Ley 16.744 Art. 68.</p>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveEntregaEPP(${eppId})"><i class="fas fa-save mr-1"></i>Registrar Entrega</button>
  `);
}

async function saveEntregaEPP(eppId) {
  const cant = parseInt(document.getElementById('ent-cant').value);
  if (!cant || cant < 1) { showToast('Ingresa una cantidad válida', 'error'); return; }
  showToast('Entrega registrada exitosamente', 'success');
  closeModal();
  navigate('epp');
}

function registrarFirma(entregaId) {
  showModal('Firma Digital de Recepción', `
    <div class="space-y-4">
      <div class="info-box-yellow">
        <p class="text-sm text-yellow-800 font-medium"><i class="fas fa-signature mr-2"></i>Firma de recepción conforme</p>
        <p class="text-xs text-yellow-700 mt-1">El trabajador declara haber recibido el EPP indicado en perfectas condiciones y se compromete a usarlo correctamente según DS 594.</p>
      </div>
      <div>
        <label class="form-label">Nombre completo del trabajador</label>
        <input id="firma-nombre" class="form-input" placeholder="Ingresar nombre para confirmar">
      </div>
      <div id="firma-pad" class="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm cursor-pointer"
        onclick="this.innerHTML='<div class=\\'text-green-600 font-bold text-lg\\'>✓ Firma registrada</div>';this.classList.add('border-green-400','bg-green-50')">
        <i class="fas fa-pen mr-2"></i>Área de firma — Clic para firmar
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-success" onclick="closeModal();showToast('Firma registrada exitosamente','success')"><i class="fas fa-check mr-1"></i>Confirmar Firma</button>
  `);
}

function showAddEPPModal() {
  showModal('Agregar Ítem al Inventario EPP', `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-hard-hat mr-2"></i>Datos del EPP</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Nombre del EPP *</label>
            <input id="nepp-nombre" class="form-input" placeholder="Ej: Casco de Seguridad Clase E"></div>
          <div><label class="form-label">Categoría *</label>
            <select id="nepp-cat" class="form-input">
              <option>Protección Cabeza</option><option>Protección Auditiva</option>
              <option>Protección Visual</option><option>Protección Respiratoria</option>
              <option>Protección Manos</option><option>Protección Pies</option>
              <option>Protección Caídas</option><option>Ropa de Trabajo</option>
            </select></div>
          <div><label class="form-label">Marca</label>
            <input id="nepp-marca" class="form-input" placeholder="3M, MSA, Honeywell..."></div>
          <div><label class="form-label">Modelo</label>
            <input id="nepp-modelo" class="form-input" placeholder="Modelo del producto"></div>
          <div><label class="form-label">Stock Actual *</label>
            <input id="nepp-stock" type="number" min="0" class="form-input" placeholder="0"></div>
          <div><label class="form-label">Stock Mínimo *</label>
            <input id="nepp-min" type="number" min="1" class="form-input" placeholder="5"></div>
          <div><label class="form-label">Norma Técnica</label>
            <input id="nepp-norma" class="form-input" placeholder="NCh, ISO, EN..."></div>
          <div><label class="form-label">Vencimiento del Lote</label>
            <input id="nepp-venc" type="date" class="form-input"></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Ítem EPP agregado al inventario','success')"><i class="fas fa-save mr-1"></i>Guardar</button>
  `);
}

function showEditEPPModal(id) {
  const item = (window._allEPP || []).find(e => e.id === id);
  if (!item) return;
  showModal(`Editar EPP: ${item.nombre}`, `
    <div class="space-y-4">
      <div class="form-section">
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Nombre</label>
            <input id="eepp-nombre" class="form-input" value="${item.nombre}"></div>
          <div><label class="form-label">Stock Actual</label>
            <input id="eepp-stock" type="number" class="form-input" value="${item.stock_actual}"></div>
          <div><label class="form-label">Stock Mínimo</label>
            <input id="eepp-min" type="number" class="form-input" value="${item.stock_minimo}"></div>
          <div><label class="form-label">Norma Técnica</label>
            <input id="eepp-norma" class="form-input" value="${item.norma_tecnica || ''}"></div>
          <div><label class="form-label">Vencimiento Lote</label>
            <input id="eepp-venc" type="date" class="form-input" value="${item.fecha_vencimiento_lote || ''}"></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('EPP actualizado correctamente','success')"><i class="fas fa-save mr-1"></i>Guardar</button>
  `);
}

// ================================================================
// CAPACITACIONES
// ================================================================
async function renderCapacitations() {
  setPageTitle('Capacitaciones', 'Gestión ODI y programa anual de capacitación — DS 40');
  const [capsRes, statsRes] = await Promise.all([
    API.get('/capacitations'),
    API.get('/capacitations/stats')
  ]);
  const caps = capsRes.data.data;
  const stats = statsRes.data.data;
  const content = document.getElementById('page-content');

  content.innerHTML = `
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <div class="card p-4 hse-accent-top">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Vigentes</div>
          <i class="fas fa-graduation-cap" style="color:var(--hse-green)"></i>
        </div>
        <div class="text-3xl font-bold" style="color:var(--hse-green)">${stats.vigentes}</div>
        <div class="text-xs text-gray-400">Capacitaciones activas</div>
      </div>
      <div class="card p-4 border-t-4 border-yellow-400">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Por Vencer</div>
          <i class="fas fa-clock text-yellow-500"></i>
        </div>
        <div class="text-3xl font-bold text-yellow-600">${stats.por_vencer}</div>
        <div class="text-xs text-gray-400">En los próximos 60 días</div>
      </div>
      <div class="card p-4 border-t-4 border-red-500">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Vencidas</div>
          <i class="fas fa-circle-xmark text-red-500"></i>
        </div>
        <div class="text-3xl font-bold text-red-600">${stats.vencidas}</div>
        <div class="text-xs text-gray-400">Requieren renovación</div>
      </div>
      <div class="card p-4 border-t-4 border-indigo-500">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Cobertura ODI</div>
          <i class="fas fa-chart-pie text-indigo-500"></i>
        </div>
        <div class="text-3xl font-bold text-indigo-600">${stats.cobertura_odi}%</div>
        <div class="progress-bar mt-2"><div class="progress-fill bg-indigo-500" style="width:${stats.cobertura_odi}%"></div></div>
      </div>
    </div>

    <!-- ODI alert -->
    <div class="mb-5 p-4 rounded-xl flex items-start gap-3" style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1.5px solid #3b82f6">
      <i class="fas fa-book-open text-blue-600 text-lg mt-0.5"></i>
      <div>
        <div class="font-bold text-blue-800">Obligación DS 40 Art. 21 — ODI (Obligación de Informar)</div>
        <div class="text-sm text-blue-700 mt-0.5">Todo empleador debe informar oportuna y convenientemente a sus trabajadores sobre los riesgos que entrañan sus labores, las medidas preventivas y los métodos de trabajo correctos. Debe realizarse al inicio de cada año y al incorporar un nuevo trabajador.</div>
      </div>
    </div>

    <!-- Action bar -->
    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <input id="search-cap" type="text" placeholder="Buscar capacitación..." class="form-input flex-1" oninput="filterCapacitations()">
      <select id="filter-cap-estado" class="form-input w-48" onchange="filterCapacitations()">
        <option value="all">Todos los estados</option>
        <option value="vigente">Vigentes</option>
        <option value="por_vencer">Por vencer</option>
        <option value="vencida">Vencidas</option>
      </select>
      ${canDo('capacitations:all') ? `<button class="btn btn-primary" onclick="showNewCapModal()"><i class="fas fa-plus"></i> Nueva Capacitación</button>` : ''}
    </div>

    <!-- List -->
    <div id="cap-list" class="space-y-3">
      ${caps.map(cap => renderCapCard(cap)).join('')}
    </div>
  `;
  window._allCaps = caps;
}

function renderCapCard(cap) {
  const stateColors = { vigente: 'badge-green', por_vencer: 'badge-orange', vencida: 'badge-red', programada: 'badge-blue' };
  const badge = stateColors[cap.estado] || 'badge-gray';
  const pct = calcCoverage(cap);
  return `
    <div class="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
          style="background:${cap.estado==='vigente'?'#16a34a':cap.estado==='por_vencer'?'#d97706':cap.estado==='vencida'?'#dc2626':'#3b82f6'}">
          <i class="fas fa-graduation-cap text-sm"></i>
        </div>
        <div class="min-w-0 flex-1">
          <div class="font-bold text-gray-800 truncate">${cap.nombre}</div>
          <div class="text-xs text-gray-500 mt-0.5 flex flex-wrap gap-2">
            <span><i class="fas fa-calendar mr-1"></i>${formatDate(cap.fecha_realizacion)}</span>
            <span><i class="fas fa-clock mr-1"></i>${cap.duracion_horas}h</span>
            <span><i class="fas fa-user-tie mr-1"></i>${cap.relator}</span>
            <span><i class="fas fa-users mr-1"></i>${cap.participantes_real} participantes</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3 flex-shrink-0">
        <div class="text-center">
          <div class="text-lg font-bold ${pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'}">${pct}%</div>
          <div class="text-xs text-gray-400">cobertura</div>
        </div>
        <span class="badge ${badge} text-xs">${cap.estado.replace('_',' ')}</span>
        <button class="btn btn-secondary py-1 px-3 text-xs" onclick="showCapDetail(${cap.id})">
          <i class="fas fa-eye mr-1"></i>Detalle
        </button>
      </div>
    </div>
  `;
}

function calcCoverage(cap) {
  if (!cap.participantes_objetivo || cap.participantes_objetivo === 0) return 0;
  return Math.min(100, Math.round((cap.participantes_real / cap.participantes_objetivo) * 100));
}

function filterCapacitations() {
  const s = document.getElementById('search-cap').value.toLowerCase();
  const est = document.getElementById('filter-cap-estado').value;
  let filtered = window._allCaps || [];
  if (s) filtered = filtered.filter(c => c.nombre.toLowerCase().includes(s) || c.relator.toLowerCase().includes(s));
  if (est !== 'all') filtered = filtered.filter(c => c.estado === est);
  const list = document.getElementById('cap-list');
  if (list) list.innerHTML = filtered.map(c => renderCapCard(c)).join('') || '<div class="text-center py-8 text-gray-400">No se encontraron capacitaciones</div>';
}

function showCapDetail(id) {
  const cap = (window._allCaps || []).find(c => c.id === id);
  if (!cap) return;
  const pct = calcCoverage(cap);
  showModal(cap.nombre, `
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div><div class="text-gray-400 text-xs">Tipo</div><div class="font-semibold">${cap.tipo}</div></div>
        <div><div class="text-gray-400 text-xs">Estado</div><div>${estadoBadgeGeneric(cap.estado)}</div></div>
        <div><div class="text-gray-400 text-xs">Fecha Realización</div><div class="font-semibold">${formatDate(cap.fecha_realizacion)}</div></div>
        <div><div class="text-gray-400 text-xs">Próxima Renovación</div><div class="font-semibold ${cap.estado==='vencida'?'text-red-600':''}">${formatDate(cap.proxima_realizacion)}</div></div>
        <div><div class="text-gray-400 text-xs">Duración</div><div class="font-semibold">${cap.duracion_horas} horas</div></div>
        <div><div class="text-gray-400 text-xs">Relator</div><div class="font-semibold">${cap.relator}</div></div>
        <div><div class="text-gray-400 text-xs">Participantes objetivo</div><div class="font-semibold">${cap.participantes_objetivo}</div></div>
        <div><div class="text-gray-400 text-xs">Participantes reales</div><div class="font-semibold">${cap.participantes_real}</div></div>
      </div>
      <div>
        <div class="flex justify-between text-xs mb-1"><span class="text-gray-500">Cobertura</span><span class="font-bold ${pct>=80?'text-green-600':'text-yellow-600'}">${pct}%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${pct>=80?'#16a34a':'#d97706'}"></div></div>
      </div>
      ${cap.descripcion ? `<div class="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">${cap.descripcion}</div>` : ''}
      ${cap.protocolo_asociado ? `<div class="info-box text-xs text-green-800"><i class="fas fa-link mr-1"></i>Protocolo asociado: <strong>${cap.protocolo_asociado}</strong></div>` : ''}
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
    ${canDo('capacitations:all') ? `<button class="btn btn-primary" onclick="closeModal();showEditCapModal(${cap.id})"><i class="fas fa-edit mr-1"></i>Editar</button>` : ''}
  `);
}

function showNewCapModal() {
  showModal('Registrar Nueva Capacitación', `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-graduation-cap mr-2"></i>Datos de la Capacitación</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Nombre de la Capacitación *</label>
            <input id="nc-nombre" class="form-input" placeholder="Ej: ODI 2026 — Riesgos Planta Norte"></div>
          <div><label class="form-label">Tipo *</label>
            <select id="nc-tipo" class="form-input">
              <option>ODI</option><option>Protocolo MINSAL</option><option>Emergencias</option>
              <option>Uso correcto EPP</option><option>Primeros Auxilios</option><option>Trabajo en altura</option>
              <option>Manejo Defensivo</option><option>Inducción</option>
            </select></div>
          <div><label class="form-label">Fecha de Realización *</label>
            <input id="nc-fecha" type="date" class="form-input" value="${new Date().toISOString().split('T')[0]}"></div>
          <div><label class="form-label">Duración (horas) *</label>
            <input id="nc-dur" type="number" min="1" class="form-input" placeholder="2"></div>
          <div><label class="form-label">Relator *</label>
            <input id="nc-relator" class="form-input" placeholder="Nombre del instructor"></div>
          <div><label class="form-label">N° Participantes objetivo</label>
            <input id="nc-obj" type="number" min="1" class="form-input" placeholder="20"></div>
          <div><label class="form-label">N° Participantes reales</label>
            <input id="nc-real" type="number" min="0" class="form-input" placeholder="0"></div>
          <div><label class="form-label">Próxima Realización</label>
            <input id="nc-prox" type="date" class="form-input"></div>
          <div class="col-span-2"><label class="form-label">Protocolo Asociado</label>
            <select id="nc-proto" class="form-input">
              <option value="">Sin protocolo específico</option>
              ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','VOZ'].map(p=>`<option value="${p}">${p}</option>`).join('')}
            </select></div>
          <div class="col-span-2"><label class="form-label">Descripción / Temario</label>
            <textarea id="nc-desc" class="form-input" rows="3" placeholder="Temas tratados, objetivos de la capacitación..."></textarea></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveNewCap()"><i class="fas fa-save mr-1"></i>Registrar</button>
  `);
}

async function saveNewCap() {
  const nombre = document.getElementById('nc-nombre').value.trim();
  if (!nombre) { showToast('El nombre es obligatorio', 'error'); return; }
  showToast('Capacitación registrada exitosamente', 'success');
  closeModal();
  navigate('capacitations');
}

// ================================================================
// ACCIDENTES — DIAT / DIEP
// ================================================================
async function renderAccidents() {
  setPageTitle('DIAT / DIEP', 'Registro y gestión de accidentes y enfermedades profesionales — Ley 16.744');
  const [accRes, statsRes] = await Promise.all([
    API.get('/accidents'),
    API.get('/accidents/stats')
  ]);
  const accidents = accRes.data.data;
  const stats = statsRes.data.data;
  const content = document.getElementById('page-content');

  content.innerHTML = `
    <!-- KPIs -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      ${kpiCard('Tasa Accidentabilidad', stats.tasa_accidentabilidad + '%', 'Meta: ≤ 2.5%', 'fa-triangle-exclamation',
        stats.tasa_accidentabilidad <= 2.5 ? 'from-green-600 to-green-800' : 'from-red-600 to-red-800',
        stats.accidentes_ytd + ' accidentes YTD 2026')}
      ${kpiCard('Días Perdidos', stats.dias_perdidos_total, 'Total acumulado 2026', 'fa-bed-pulse', 'from-orange-500 to-orange-700',
        'Tasa siniestralidad: ' + stats.tasa_siniestralidad + '%')}
      ${kpiCard('Enf. Profesionales', stats.enfermedades_profesionales, 'Diagnosticadas 2026', 'fa-lungs',
        'from-purple-600 to-purple-800', 'DS 109 — MINSAL')}
      ${kpiCard('Tasa Mortalidad', stats.tasa_mortalidad + '%', 'Accidentes fatales', 'fa-heart-pulse',
        stats.tasa_mortalidad === 0 ? 'from-green-600 to-green-800' : 'from-red-800 to-red-950',
        stats.tasa_mortalidad === 0 ? 'Sin fatalidades en 2026' : '⚠ Revisar inmediatamente')}
    </div>

    <!-- Action bar -->
    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <input id="search-acc" type="text" placeholder="Buscar por folio, trabajador..." class="form-input flex-1" oninput="filterAccidents()">
      <select id="filter-tipo" class="form-input w-36" onchange="filterAccidents()">
        <option value="all">DIAT + DIEP</option>
        <option value="DIAT">Solo DIAT</option>
        <option value="DIEP">Solo DIEP</option>
      </select>
      <select id="filter-acc-estado" class="form-input w-40" onchange="filterAccidents()">
        <option value="all">Todos los estados</option>
        <option value="abierto">Abiertos</option>
        <option value="cerrado">Cerrados</option>
      </select>
      ${canDo('accidents:all') ? `<button class="btn btn-danger" onclick="showNewAccidentModal()"><i class="fas fa-plus"></i> Registrar Accidente</button>` : ''}
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table" id="accidents-table">
          <thead><tr>
            <th>Folio</th><th>Tipo</th><th>Trabajador</th><th>Fecha</th>
            <th>Lesión / Diagnóstico</th><th>Gravedad</th><th>Días Perdidos</th>
            <th>Mutual</th><th>Estado</th><th>Acciones</th>
          </tr></thead>
          <tbody id="accidents-tbody">${renderAccidentsRows(accidents)}</tbody>
        </table>
      </div>
    </div>
  `;
  window._allAccidents = accidents;
}

function renderAccidentsRows(accidents) {
  return accidents.map(a => `
    <tr>
      <td class="font-mono text-xs font-bold text-gray-600">${a.folio}</td>
      <td><span class="badge ${a.tipo==='DIAT'?'badge-red':'badge-purple'} text-xs">${a.tipo}</span></td>
      <td>
        <div class="font-medium text-sm">${a.trabajador_nombre}</div>
        <div class="text-xs text-gray-400">${a.trabajador_rut}</div>
      </td>
      <td class="text-xs text-gray-500">${formatDate(a.fecha_accidente)}</td>
      <td class="text-sm max-w-xs truncate">${a.lesion_diagnostico}</td>
      <td>${gravedadBadge(a.gravedad)}</td>
      <td class="text-center font-bold ${a.dias_perdidos > 0 ? 'text-red-600' : 'text-green-600'}">${a.dias_perdidos}</td>
      <td><span class="badge badge-blue text-xs">${a.mutualidad}</span></td>
      <td>${estadoBadgeGeneric(a.estado_denuncia)}</td>
      <td>
        <div class="flex gap-1">
          <button class="btn btn-secondary py-1 px-2 text-xs" onclick="showAccidentDetail(${a.id})" title="Ver detalle">
            <i class="fas fa-eye"></i>
          </button>
          ${canDo('accidents:all') ? `
          <button class="btn btn-secondary py-1 px-2 text-xs" title="Generar PDF" onclick="showToast('Generando PDF...','info')">
            <i class="fas fa-file-pdf text-red-500"></i>
          </button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function filterAccidents() {
  const s = document.getElementById('search-acc').value.toLowerCase();
  const tipo = document.getElementById('filter-tipo').value;
  const est = document.getElementById('filter-acc-estado').value;
  let filtered = window._allAccidents || [];
  if (s) filtered = filtered.filter(a => (a.folio + a.trabajador_nombre + a.lesion_diagnostico).toLowerCase().includes(s));
  if (tipo !== 'all') filtered = filtered.filter(a => a.tipo === tipo);
  if (est !== 'all') filtered = filtered.filter(a => a.estado_denuncia === est);
  const tbody = document.getElementById('accidents-tbody');
  if (tbody) tbody.innerHTML = renderAccidentsRows(filtered);
}

function showAccidentDetail(id) {
  const a = (window._allAccidents || []).find(x => x.id === id);
  if (!a) return;
  showModal(`${a.tipo} N° ${a.folio}`, `
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div><div class="text-xs text-gray-400">Folio</div><div class="font-mono font-bold">${a.folio}</div></div>
        <div><div class="text-xs text-gray-400">Tipo</div><div><span class="badge ${a.tipo==='DIAT'?'badge-red':'badge-purple'} text-xs">${a.tipo}</span></div></div>
        <div><div class="text-xs text-gray-400">Trabajador</div><div class="font-semibold">${a.trabajador_nombre}</div></div>
        <div><div class="text-xs text-gray-400">RUT</div><div class="font-mono">${a.trabajador_rut}</div></div>
        <div><div class="text-xs text-gray-400">Fecha</div><div class="font-semibold">${formatDate(a.fecha_accidente)}</div></div>
        <div><div class="text-xs text-gray-400">Hora</div><div>${a.hora_accidente || '—'}</div></div>
        <div><div class="text-xs text-gray-400">Lugar</div><div>${a.lugar_accidente}</div></div>
        <div><div class="text-xs text-gray-400">Gravedad</div><div>${gravedadBadge(a.gravedad)}</div></div>
        <div><div class="text-xs text-gray-400">Días Perdidos</div><div class="font-bold ${a.dias_perdidos>0?'text-red-600':'text-green-600'}">${a.dias_perdidos}</div></div>
        <div><div class="text-xs text-gray-400">Mutualidad</div><div class="badge badge-blue text-xs">${a.mutualidad}</div></div>
        <div><div class="text-xs text-gray-400">Estado</div><div>${estadoBadgeGeneric(a.estado_denuncia)}</div></div>
      </div>
      <div class="p-3 bg-gray-50 rounded-lg">
        <div class="text-xs text-gray-400 mb-1">Lesión / Diagnóstico</div>
        <div class="text-sm font-medium">${a.lesion_diagnostico}</div>
      </div>
      ${a.descripcion ? `<div class="p-3 bg-gray-50 rounded-lg"><div class="text-xs text-gray-400 mb-1">Descripción del accidente</div><div class="text-sm">${a.descripcion}</div></div>` : ''}
      ${a.causa_inmediata ? `<div class="info-box-red"><div class="text-xs text-red-600 mb-1 font-semibold">Causa Inmediata</div><div class="text-sm text-red-800">${a.causa_inmediata}</div></div>` : ''}
      ${a.medidas_correctivas ? `<div class="info-box"><div class="text-xs text-green-600 mb-1 font-semibold">Medidas Correctivas</div><div class="text-sm text-green-800">${a.medidas_correctivas}</div></div>` : ''}
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-primary" onclick="showToast('Generando PDF del ${a.tipo}...','info');closeModal()"><i class="fas fa-file-pdf mr-1"></i>Generar PDF</button>
  `);
}

function showNewAccidentModal() {
  showModal('Registrar Accidente / Enfermedad Profesional', `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-file-medical-alt mr-2"></i>Tipo de Denuncia</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2 flex gap-3">
            <label class="flex-1 border-2 rounded-xl p-3 cursor-pointer has-[:checked]:border-red-500 has-[:checked]:bg-red-50 text-center" id="tipo-diat-label">
              <input type="radio" name="acc-tipo" value="DIAT" class="sr-only" onchange="document.getElementById('tipo-diat-label').classList.add('border-red-500','bg-red-50');document.getElementById('tipo-diep-label').classList.remove('border-purple-500','bg-purple-50')">
              <i class="fas fa-bolt text-red-500 text-lg mb-1"></i>
              <div class="font-bold text-sm">DIAT</div>
              <div class="text-xs text-gray-500">Accidente del Trabajo</div>
            </label>
            <label class="flex-1 border-2 rounded-xl p-3 cursor-pointer has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 text-center" id="tipo-diep-label">
              <input type="radio" name="acc-tipo" value="DIEP" class="sr-only" onchange="document.getElementById('tipo-diep-label').classList.add('border-purple-500','bg-purple-50');document.getElementById('tipo-diat-label').classList.remove('border-red-500','bg-red-50')">
              <i class="fas fa-lungs text-purple-500 text-lg mb-1"></i>
              <div class="font-bold text-sm">DIEP</div>
              <div class="text-xs text-gray-500">Enfermedad Profesional</div>
            </label>
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-calendar mr-2"></i>Datos del Incidente</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Fecha *</label><input id="acc-fecha" type="date" class="form-input" value="${new Date().toISOString().split('T')[0]}"></div>
          <div><label class="form-label">Hora</label><input id="acc-hora" type="time" class="form-input"></div>
          <div class="col-span-2"><label class="form-label">Trabajador afectado (nombre o RUT) *</label>
            <input id="acc-trab" class="form-input" placeholder="Buscar trabajador..."></div>
          <div class="col-span-2"><label class="form-label">Lugar del accidente *</label>
            <input id="acc-lugar" class="form-input" placeholder="Área, sector, equipo..."></div>
          <div><label class="form-label">Gravedad *</label>
            <select id="acc-grav" class="form-input">
              <option value="leve">Leve</option>
              <option value="grave">Grave</option>
              <option value="gravísimo">Gravísimo</option>
              <option value="fatal">Fatal</option>
            </select></div>
          <div><label class="form-label">Días de reposo</label>
            <input id="acc-dias" type="number" min="0" class="form-input" placeholder="0" value="0"></div>
          <div class="col-span-2"><label class="form-label">Lesión / Diagnóstico *</label>
            <input id="acc-lesion" class="form-input" placeholder="Descripción de la lesión o diagnóstico médico"></div>
          <div class="col-span-2"><label class="form-label">Mutualidad</label>
            <select id="acc-mutual" class="form-input">
              <option>ACHS</option><option>IST</option><option>Mutual de Seguridad CChC</option><option>ISL</option>
            </select></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-search mr-2"></i>Investigación</div>
        <div class="grid grid-cols-1 gap-3">
          <div><label class="form-label">Descripción del accidente</label>
            <textarea id="acc-desc" class="form-input" rows="3" placeholder="Relato detallado de cómo ocurrió el accidente..."></textarea></div>
          <div><label class="form-label">Causa Inmediata</label>
            <input id="acc-causa" class="form-input" placeholder="Acto subestándar / Condición subestándar"></div>
          <div><label class="form-label">Medidas Correctivas</label>
            <textarea id="acc-medidas" class="form-input" rows="2" placeholder="Acciones tomadas para evitar la recurrencia..."></textarea></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="saveAccident()"><i class="fas fa-save mr-1"></i>Registrar Denuncia</button>
  `);
}

async function saveAccident() {
  const lesion = document.getElementById('acc-lesion').value.trim();
  const trab = document.getElementById('acc-trab').value.trim();
  if (!lesion || !trab) { showToast('Completa los campos obligatorios (*)', 'error'); return; }
  showToast('Accidente registrado exitosamente', 'success');
  closeModal();
  navigate('accidents');
}

function gravedadBadge(g) {
  const map = { leve: 'badge-green', grave: 'badge-orange', gravísimo: 'badge-red', fatal: 'badge-fatal' };
  return `<span class="badge ${map[g] || 'badge-gray'} text-xs">${g || '—'}</span>`;
}

// ================================================================
// ALERTAS
// ================================================================
async function renderAlerts() {
  setPageTitle('Alertas del Sistema', 'Notificaciones y alertas de cumplimiento HSE — 2026');
  const res = await API.get('/alerts');
  const alerts = res.data.data;
  const content = document.getElementById('page-content');

  const counts = {
    critica: alerts.filter(a => a.prioridad === 'critica').length,
    alta: alerts.filter(a => a.prioridad === 'alta').length,
    media: alerts.filter(a => a.prioridad === 'media').length,
    baja: alerts.filter(a => a.prioridad === 'baja').length,
  };

  content.innerHTML = `
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      ${kpiCard('Críticas', counts.critica, 'Requieren acción INMEDIATA', 'fa-circle-exclamation', 'from-red-700 to-red-900', 'Riesgo alto para el sistema')}
      ${kpiCard('Altas', counts.alta, 'Atender en 24 horas', 'fa-triangle-exclamation', 'from-orange-500 to-orange-700', 'Monitorear de cerca')}
      ${kpiCard('Medias', counts.media, 'Atender esta semana', 'fa-bell', 'from-yellow-500 to-yellow-700', 'En seguimiento')}
      ${kpiCard('Total Activas', alerts.filter(a=>!a.resuelta).length, 'Alertas sin resolver', 'fa-bell-slash', 'from-slate-600 to-slate-800', 'Gestionar oportunamente')}
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button class="btn btn-secondary active text-xs py-1.5" onclick="filterAlertsByPrio('all',this)">Todas (${alerts.length})</button>
      <button class="btn btn-secondary text-xs py-1.5" style="border-color:#dc2626;color:#dc2626" onclick="filterAlertsByPrio('critica',this)">
        <i class="fas fa-circle-exclamation mr-1"></i>Críticas (${counts.critica})
      </button>
      <button class="btn btn-secondary text-xs py-1.5" style="border-color:#ea580c;color:#ea580c" onclick="filterAlertsByPrio('alta',this)">
        <i class="fas fa-triangle-exclamation mr-1"></i>Altas (${counts.alta})
      </button>
      <button class="btn btn-secondary text-xs py-1.5" style="border-color:#d97706;color:#d97706" onclick="filterAlertsByPrio('media',this)">
        <i class="fas fa-bell mr-1"></i>Medias (${counts.media})
      </button>
      <button class="btn btn-secondary text-xs py-1.5" style="border-color:#2563eb;color:#2563eb" onclick="filterAlertsByPrio('baja',this)">
        <i class="fas fa-info-circle mr-1"></i>Bajas (${counts.baja})
      </button>
    </div>

    <div id="alerts-list" class="space-y-3">
      ${alerts.map(a => renderAlertCard(a)).join('')}
    </div>
  `;
  window._allAlerts = alerts;
}

function renderAlertCard(a) {
  const prioMap = {
    critica: { border: 'alert-critica', icon: 'fa-circle-exclamation', color: '#dc2626', bg: '#fef2f2' },
    alta: { border: 'alert-alta', icon: 'fa-triangle-exclamation', color: '#ea580c', bg: '#fff7ed' },
    media: { border: 'alert-media', icon: 'fa-bell', color: '#d97706', bg: '#fffbeb' },
    baja: { border: 'alert-baja', icon: 'fa-info-circle', color: '#2563eb', bg: '#eff6ff' }
  };
  const p = prioMap[a.prioridad] || prioMap.baja;
  return `
    <div id="alert-card-${a.id}" class="card ${p.border} p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${a.resuelta ? 'opacity-50' : ''}">
      <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style="background:${p.bg}">
        <i class="fas ${p.icon}" style="color:${p.color}"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start gap-2 flex-wrap">
          <span class="font-bold text-gray-800 text-sm">${a.titulo}</span>
          <span class="badge text-xs" style="background:${p.bg};color:${p.color};border:1px solid ${p.color}">${a.prioridad}</span>
          ${a.resuelta ? '<span class="badge badge-green text-xs">Resuelta</span>' : ''}
        </div>
        <div class="text-sm text-gray-600 mt-0.5 line-clamp-2">${a.descripcion}</div>
        <div class="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-400">
          <span><i class="fas fa-tag mr-1"></i>${a.categoria}</span>
          <span><i class="fas fa-calendar mr-1"></i>${formatDate(a.fecha_generacion)}</span>
          ${a.fecha_vencimiento ? `<span class="text-red-500 font-medium"><i class="fas fa-clock mr-1"></i>Vence: ${formatDate(a.fecha_vencimiento)}</span>` : ''}
          ${a.responsable ? `<span><i class="fas fa-user mr-1"></i>${a.responsable}</span>` : ''}
        </div>
      </div>
      <div class="flex gap-2 flex-shrink-0">
        ${!a.resuelta ? `
        <button class="btn btn-success py-1.5 px-3 text-xs" onclick="resolveAlert(${a.id})">
          <i class="fas fa-check mr-1"></i>Resolver
        </button>` : ''}
        <button class="btn btn-secondary py-1.5 px-3 text-xs" onclick="showAlertDetail(${a.id})">
          <i class="fas fa-eye mr-1"></i>Detalle
        </button>
      </div>
    </div>
  `;
}

function filterAlertsByPrio(prio, btn) {
  document.querySelectorAll('#alerts-list').forEach(() => {});
  let filtered = window._allAlerts || [];
  if (prio !== 'all') filtered = filtered.filter(a => a.prioridad === prio);
  const list = document.getElementById('alerts-list');
  if (list) list.innerHTML = filtered.map(a => renderAlertCard(a)).join('');
}

function resolveAlert(id) {
  const card = document.getElementById('alert-card-' + id);
  if (card) card.classList.add('opacity-50');
  showToast('Alerta marcada como resuelta', 'success');
}

function showAlertDetail(id) {
  const a = (window._allAlerts || []).find(x => x.id === id);
  if (!a) return;
  showModal(a.titulo, `
    <div class="space-y-3">
      <div class="flex gap-2 flex-wrap">
        <span class="badge badge-${a.prioridad === 'critica' ? 'red' : a.prioridad === 'alta' ? 'orange' : a.prioridad === 'media' ? 'yellow' : 'blue'}">${a.prioridad}</span>
        <span class="badge badge-gray">${a.categoria}</span>
      </div>
      <p class="text-sm text-gray-700">${a.descripcion}</p>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div><div class="text-xs text-gray-400">Generada</div><div class="font-semibold">${formatDate(a.fecha_generacion)}</div></div>
        ${a.fecha_vencimiento ? `<div><div class="text-xs text-gray-400">Vencimiento</div><div class="font-semibold text-red-600">${formatDate(a.fecha_vencimiento)}</div></div>` : ''}
        ${a.responsable ? `<div class="col-span-2"><div class="text-xs text-gray-400">Responsable</div><div class="font-semibold">${a.responsable}</div></div>` : ''}
      </div>
      ${a.accion_recomendada ? `
        <div class="info-box">
          <div class="text-xs font-semibold text-green-700 mb-1"><i class="fas fa-lightbulb mr-1"></i>Acción Recomendada</div>
          <div class="text-sm text-green-800">${a.accion_recomendada}</div>
        </div>` : ''}
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
    ${!a.resuelta ? `<button class="btn btn-success" onclick="resolveAlert(${a.id});closeModal()"><i class="fas fa-check mr-1"></i>Marcar como Resuelta</button>` : ''}
  `);
}

// ================================================================
// MIPER — Matriz de Identificación de Peligros y Evaluación de Riesgos
// ================================================================
async function renderMIPER() {
  setPageTitle('Matriz MIPER', 'Identificación de Peligros y Evaluación de Riesgos — NCh ISO 45001');
  const res = await API.get('/miper');
  const miper = res.data.data;
  const content = document.getElementById('page-content');

  const totals = {
    intolerable: miper.filter(m => m.nivel_riesgo === 'Intolerable').length,
    importante: miper.filter(m => m.nivel_riesgo === 'Importante').length,
    moderado: miper.filter(m => m.nivel_riesgo === 'Moderado').length,
    tolerable: miper.filter(m => m.nivel_riesgo === 'Tolerable').length,
  };

  content.innerHTML = `
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <div class="kpi-card bg-gradient-to-br from-red-700 to-red-900 text-white">
        <div class="flex items-start justify-between">
          <div><div class="text-xs font-semibold opacity-75 uppercase tracking-wide mb-1">Intolerable</div>
          <div class="text-3xl font-bold">${totals.intolerable}</div></div>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:rgba(255,255,255,0.15)"><i class="fas fa-skull"></i></div>
        </div>
        <div class="text-xs mt-3 opacity-60 border-t border-white border-opacity-20 pt-2">Acción inmediata obligatoria</div>
      </div>
      <div class="kpi-card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
        <div class="flex items-start justify-between">
          <div><div class="text-xs font-semibold opacity-75 uppercase tracking-wide mb-1">Importante</div>
          <div class="text-3xl font-bold">${totals.importante}</div></div>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:rgba(255,255,255,0.15)"><i class="fas fa-triangle-exclamation"></i></div>
        </div>
        <div class="text-xs mt-3 opacity-60 border-t border-white border-opacity-20 pt-2">Corregir a la brevedad</div>
      </div>
      <div class="kpi-card bg-gradient-to-br from-yellow-500 to-yellow-700 text-white">
        <div class="flex items-start justify-between">
          <div><div class="text-xs font-semibold opacity-75 uppercase tracking-wide mb-1">Moderado</div>
          <div class="text-3xl font-bold">${totals.moderado}</div></div>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:rgba(255,255,255,0.15)"><i class="fas fa-exclamation"></i></div>
        </div>
        <div class="text-xs mt-3 opacity-60 border-t border-white border-opacity-20 pt-2">Control periódico</div>
      </div>
      <div class="kpi-card bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div class="flex items-start justify-between">
          <div><div class="text-xs font-semibold opacity-75 uppercase tracking-wide mb-1">Tolerable / Trivial</div>
          <div class="text-3xl font-bold">${totals.tolerable + miper.filter(m=>m.nivel_riesgo==='Trivial').length}</div></div>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:rgba(255,255,255,0.15)"><i class="fas fa-check"></i></div>
        </div>
        <div class="text-xs mt-3 opacity-60 border-t border-white border-opacity-20 pt-2">Monitorear rutinariamente</div>
      </div>
    </div>

    <!-- Tabs: Tabla + Matriz -->
    <div class="card overflow-hidden">
      <div class="flex border-b border-gray-100">
        <button id="tab-tabla" class="tab-btn active px-5 py-3 text-sm font-semibold" onclick="switchMiperTab('tabla')">
          <i class="fas fa-table mr-2"></i>Tabla MIPER
        </button>
        <button id="tab-matriz" class="tab-btn px-5 py-3 text-sm font-semibold" onclick="switchMiperTab('matriz')">
          <i class="fas fa-grid mr-2"></i>Matriz de Riesgos
        </button>
      </div>

      <!-- Tabla -->
      <div id="miper-tabla" class="p-4">
        <div class="flex flex-col sm:flex-row gap-3 mb-4">
          <input id="search-miper" type="text" placeholder="Buscar peligro, área..." class="form-input flex-1" oninput="filterMIPER()">
          <select id="filter-miper-nivel" class="form-input w-44" onchange="filterMIPER()">
            <option value="all">Todos los niveles</option>
            <option value="Intolerable">Intolerable</option>
            <option value="Importante">Importante</option>
            <option value="Moderado">Moderado</option>
            <option value="Tolerable">Tolerable</option>
            <option value="Trivial">Trivial</option>
          </select>
          ${canDo('miper:all') ? `<button class="btn btn-primary" onclick="showNewMIPERModal()"><i class="fas fa-plus"></i> Nuevo Peligro</button>` : ''}
        </div>
        <div class="overflow-x-auto">
          <table class="data-table" id="miper-table">
            <thead><tr>
              <th>Área / Tipo</th><th>Peligro / Protocolo</th><th>Consecuencia</th>
              <th>Prob.</th><th>Sev.</th><th>NR / Nivel</th>
              <th>Controles</th><th>Responsable / Plazo</th><th>Estado Acción</th><th>Acciones</th>
            </tr></thead>
            <tbody id="miper-tbody">${renderMIPERRows(miper)}</tbody>
          </table>
        </div>
      </div>

      <!-- Matriz -->
      <div id="miper-matriz" class="p-5 hidden">
        <h3 class="font-bold text-gray-700 mb-4">Matriz de Riesgos — Probabilidad vs Severidad</h3>
        <div class="overflow-x-auto">
          <table class="text-xs text-center border-collapse w-full">
            <thead>
              <tr>
                <th class="p-2 bg-gray-100 border border-gray-200">Prob \\ Sev</th>
                <th class="p-3 bg-gray-100 border border-gray-200">Leve</th>
                <th class="p-3 bg-gray-100 border border-gray-200">Media</th>
                <th class="p-3 bg-gray-100 border border-gray-200">Alta</th>
                <th class="p-3 bg-gray-100 border border-gray-200">Crítica</th>
              </tr>
            </thead>
            <tbody>
              ${[
                ['Alta', '#Trivial','#Importante','#Intolerable','#Intolerable'],
                ['Media', '#Trivial','#Moderado','#Importante','#Intolerable'],
                ['Baja', '#Trivial','#Tolerable','#Moderado','#Importante']
              ].map(([prob, ...cells]) => `
                <tr>
                  <td class="p-3 font-bold bg-gray-100 border border-gray-200">${prob}</td>
                  ${cells.map(cell => {
                    const nivel = cell.replace('#','');
                    const colors = {Trivial:'#dcfce7', Tolerable:'#d1fae5', Moderado:'#fef9c3', Importante:'#fed7aa', Intolerable:'#fecaca'};
                    const textColors = {Trivial:'#166534', Tolerable:'#166534', Moderado:'#713f12', Importante:'#7c2d12', Intolerable:'#7f1d1d'};
                    return `<td class="p-3 border border-gray-200 font-bold" style="background:${colors[nivel]||'#f9fafb'};color:${textColors[nivel]||'#374151'}">${nivel}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          ${[
            ['Intolerable', '#fecaca', '#7f1d1d', 'No iniciar trabajo. Acción inmediata.'],
            ['Importante', '#fed7aa', '#7c2d12', 'No iniciar sin medidas de control.'],
            ['Moderado', '#fef9c3', '#713f12', 'Controles documentados y seguimiento.'],
            ['Tolerable', '#d1fae5', '#166534', 'Monitorear. Sin acción urgente.'],
            ['Trivial', '#dcfce7', '#166534', 'Aceptable. Revisión rutinaria.']
          ].map(([nivel, bg, color, desc]) => `
            <div class="p-3 rounded-lg text-xs" style="background:${bg};color:${color}">
              <div class="font-bold">${nivel}</div>
              <div class="opacity-80 mt-0.5">${desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  window._allMIPER = miper;
}

function renderMIPERRows(items) {
  return items.map(item => {
    const riskColors = {
      Intolerable: 'miper-intolerable', Importante: 'miper-importante',
      Moderado: 'miper-moderado', Tolerable: 'miper-tolerable', Trivial: 'miper-trivial'
    };
    const estadoColors = {
      'CRÍTICO — Atención inmediata': 'badge-red',
      'Pendiente': 'badge-yellow',
      'En proceso': 'badge-blue',
      'Completado': 'badge-green',
    };
    const estadoCls = estadoColors[item.estado_accion] || 'badge-gray';
    const nr = item.nr || (item.probabilidad * item.severidad);
    const nivel = item.nivel || item.nivel_riesgo || '—';
    return `
      <tr>
        <td><span class="badge badge-blue text-xs">${item.area}</span></td>
        <td>
          <div class="text-sm font-medium">${item.peligro}</div>
          <div class="text-xs text-gray-400 mt-0.5">${item.tipo_riesgo}</div>
          ${item.protocolo ? `<span class="badge badge-hse text-xs mt-0.5">${item.protocolo}</span>` : ''}
        </td>
        <td class="text-xs text-gray-500 max-w-xs">${item.consecuencia}</td>
        <td class="text-center font-bold text-lg">${item.probabilidad}</td>
        <td class="text-center font-bold text-lg">${item.severidad}</td>
        <td class="text-center">
          <div class="font-black text-lg">${nr}</div>
          <span class="badge ${riskColors[nivel] || 'badge-gray'} text-xs mt-0.5">${nivel}</span>
        </td>
        <td class="text-xs text-gray-600 max-w-xs">
          <div>${item.medidas_existentes || '—'}</div>
          ${item.medidas_propuestas ? `<div class="text-green-600 mt-0.5"><i class="fas fa-arrow-right text-xs mr-1"></i>${item.medidas_propuestas}</div>` : ''}
        </td>
        <td>
          <div class="text-xs text-gray-500">${item.responsable}</div>
          ${item.plazo ? `<div class="text-xs text-red-500 mt-0.5"><i class="fas fa-calendar mr-1"></i>${formatDate(item.plazo)}</div>` : ''}
        </td>
        <td><span class="badge ${estadoCls} text-xs">${item.estado_accion || '—'}</span></td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-secondary py-1 px-2 text-xs" onclick="showEditMIPERModal(${item.id})" title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger py-1 px-2 text-xs" onclick="confirmDeleteMIPER(${item.id})" title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterMIPER() {
  const s = document.getElementById('search-miper').value.toLowerCase();
  const nivel = document.getElementById('filter-miper-nivel').value;
  let filtered = window._allMIPER || [];
  if (s) filtered = filtered.filter(m => (m.area + m.peligro + m.tipo_riesgo + (m.responsable||'')).toLowerCase().includes(s));
  if (nivel !== 'all') filtered = filtered.filter(m => (m.nivel || m.nivel_riesgo) === nivel);
  const tbody = document.getElementById('miper-tbody');
  if (tbody) tbody.innerHTML = renderMIPERRows(filtered);
}

function switchMiperTab(tab) {
  ['tabla','matriz'].forEach(t => {
    const el = document.getElementById('miper-' + t);
    if (el) el.classList.toggle('hidden', t !== tab);
    const btn = document.getElementById('tab-' + t);
    if (btn) btn.classList.toggle('active', t === tab);
  });
}

function showNewMIPERModal() {
  showModal('Nuevo Peligro en MIPER', `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-triangle-exclamation mr-2"></i>Identificación del Peligro</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Área *</label>
            <select id="nm-area" class="form-input">
              <option>Producción</option><option>Mantenimiento</option><option>Logística</option>
              <option>Bodega</option><option>Administración</option><option>Terreno</option>
              <option>Taller Soldadura</option><option>Exterior / Logística</option><option>Todas las áreas</option>
            </select></div>
          <div><label class="form-label">Puesto de Trabajo</label>
            <input id="nm-puesto" class="form-input" placeholder="Ej: Operador de Maquinaria"></div>
          <div><label class="form-label">Tipo de Riesgo</label>
            <select id="nm-tipo" class="form-input">
              <option>Físico</option><option>Químico</option><option>Biológico</option>
              <option>Ergonómico</option><option>Psicosocial</option><option>Mecánico</option>
              <option>Eléctrico</option><option>Locativo</option>
            </select></div>
          <div><label class="form-label">Protocolo MINSAL</label>
            <select id="nm-proto" class="form-input">
              <option value="">Sin protocolo</option>
              ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','VOZ'].map(p=>`<option value="${p}">${p}</option>`).join('')}
            </select></div>
          <div class="col-span-2"><label class="form-label">Descripción del Peligro *</label>
            <textarea id="nm-peligro" class="form-input" rows="2" placeholder="Describa el peligro identificado..."></textarea></div>
          <div class="col-span-2"><label class="form-label">Consecuencia potencial</label>
            <input id="nm-consec" class="form-input" placeholder="Ej: Lesión auditiva, fractura, incendio..."></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-calculator mr-2"></i>Valoración del Riesgo (Probabilidad × Severidad = NR)</div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="form-label">Probabilidad (1-5) *</label>
            <select id="nm-prob" class="form-input" onchange="calcNR()">
              <option value="1">1 — Muy baja</option>
              <option value="2">2 — Baja</option>
              <option value="3" selected>3 — Media</option>
              <option value="4">4 — Alta</option>
              <option value="5">5 — Muy alta</option>
            </select>
          </div>
          <div>
            <label class="form-label">Severidad (1-5) *</label>
            <select id="nm-sev" class="form-input" onchange="calcNR()">
              <option value="1">1 — Leve</option>
              <option value="2">2 — Moderada</option>
              <option value="3" selected>3 — Grave</option>
              <option value="4">4 — Muy grave</option>
              <option value="5">5 — Mortal</option>
            </select>
          </div>
          <div class="col-span-2">
            <div class="p-3 rounded-xl text-center font-bold" id="nr-preview" style="background:#fef9c3;color:#713f12">
              NR = 9 — Nivel: <strong>Moderado</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-shield-halved mr-2"></i>Medidas de Control</div>
        <div class="grid grid-cols-1 gap-3">
          <div><label class="form-label">Medidas existentes</label>
            <textarea id="nm-ctrl-ex" class="form-input" rows="2" placeholder="EPP actuales, procedimientos existentes..."></textarea></div>
          <div><label class="form-label">Medidas propuestas</label>
            <textarea id="nm-ctrl-prop" class="form-input" rows="2" placeholder="Nuevas medidas de control recomendadas..."></textarea></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="form-label">Responsable</label>
              <input id="nm-resp" class="form-input" placeholder="Nombre del responsable"></div>
            <div><label class="form-label">Plazo de ejecución</label>
              <input id="nm-plazo" type="date" class="form-input"></div>
          </div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveNewMIPER()"><i class="fas fa-save mr-1"></i>Guardar Peligro</button>
  `);
  calcNR();
}

function calcNR() {
  const prob = parseInt(document.getElementById('nm-prob')?.value || 3);
  const sev = parseInt(document.getElementById('nm-sev')?.value || 3);
  const nr = prob * sev;
  const niveles = [
    { max: 4, nivel: 'Trivial', bg: '#dcfce7', color: '#166534' },
    { max: 8, nivel: 'Tolerable', bg: '#d1fae5', color: '#166534' },
    { max: 12, nivel: 'Moderado', bg: '#fef9c3', color: '#713f12' },
    { max: 17, nivel: 'Importante', bg: '#fed7aa', color: '#7c2d12' },
    { max: 25, nivel: 'Intolerable', bg: '#fecaca', color: '#7f1d1d' },
  ];
  const n = niveles.find(x => nr <= x.max) || niveles[4];
  const preview = document.getElementById('nr-preview');
  if (preview) {
    preview.style.background = n.bg;
    preview.style.color = n.color;
    preview.innerHTML = 'NR = <strong>' + nr + '</strong> (' + prob + ' × ' + sev + ') — Nivel de Riesgo: <strong>' + n.nivel + '</strong>';
  }
}

async function saveNewMIPER() {
  const peligro = document.getElementById('nm-peligro').value.trim();
  if (!peligro) { showToast('La descripción del peligro es obligatoria', 'error'); return; }
  const body = {
    area: document.getElementById('nm-area').value,
    puesto: document.getElementById('nm-puesto').value.trim(),
    tipo_riesgo: document.getElementById('nm-tipo').value,
    protocolo: document.getElementById('nm-proto').value || null,
    peligro,
    consecuencia: document.getElementById('nm-consec').value.trim(),
    probabilidad: parseInt(document.getElementById('nm-prob').value),
    severidad: parseInt(document.getElementById('nm-sev').value),
    medidas_existentes: document.getElementById('nm-ctrl-ex').value.trim(),
    medidas_propuestas: document.getElementById('nm-ctrl-prop').value.trim(),
    responsable: document.getElementById('nm-resp').value.trim(),
    plazo: document.getElementById('nm-plazo').value,
    estado_accion: 'Pendiente'
  };
  try {
    await API.post('/miper', body);
    showToast('Peligro registrado en la MIPER exitosamente', 'success');
    closeModal();
    navigate('miper');
  } catch { showToast('Error al guardar el peligro', 'error'); }
}

async function showEditMIPERModal(id) {
  const res = await API.get('/miper');
  const item = res.data.data.find(m => m.id === id);
  if (!item) return;
  showModal('Editar Peligro MIPER #' + id, `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-triangle-exclamation mr-2"></i>Identificación del Peligro</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Área</label>
            <input id="em-area" class="form-input" value="${item.area}"></div>
          <div><label class="form-label">Puesto</label>
            <input id="em-puesto" class="form-input" value="${item.puesto || ''}"></div>
          <div class="col-span-2"><label class="form-label">Descripción del Peligro</label>
            <textarea id="em-peligro" class="form-input" rows="2">${item.peligro}</textarea></div>
          <div class="col-span-2"><label class="form-label">Consecuencia</label>
            <input id="em-consec" class="form-input" value="${item.consecuencia}"></div>
          <div><label class="form-label">Probabilidad (1-5)</label>
            <select id="em-prob" class="form-input">
              ${[1,2,3,4,5].map(n=>'<option value="' + n + '" ' + (item.probabilidad==n?'selected':'') + '>' + n + '</option>').join('')}
            </select></div>
          <div><label class="form-label">Severidad (1-5)</label>
            <select id="em-sev" class="form-input">
              ${[1,2,3,4,5].map(n=>'<option value="' + n + '" ' + (item.severidad==n?'selected':'') + '>' + n + '</option>').join('')}
            </select></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-shield-halved mr-2"></i>Controles y Seguimiento</div>
        <div class="grid grid-cols-1 gap-3">
          <div><label class="form-label">Medidas existentes</label>
            <textarea id="em-ctrl-ex" class="form-input" rows="2">${item.medidas_existentes || ''}</textarea></div>
          <div><label class="form-label">Medidas propuestas</label>
            <textarea id="em-ctrl-prop" class="form-input" rows="2">${item.medidas_propuestas || ''}</textarea></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="form-label">Estado de Acción</label>
              <select id="em-estado" class="form-input">
                ${['Pendiente','En proceso','Completado','CRÍTICO — Atención inmediata'].map(s=>'<option ' + (item.estado_accion===s?'selected':'') + '>' + s + '</option>').join('')}
              </select></div>
            <div><label class="form-label">Plazo</label>
              <input id="em-plazo" type="date" class="form-input" value="${item.plazo || ''}"></div>
          </div>
          <div><label class="form-label">Responsable</label>
            <input id="em-resp" class="form-input" value="${item.responsable || ''}"></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="updateMIPER(${id})"><i class="fas fa-save mr-1"></i>Guardar Cambios</button>
  `);
}

async function updateMIPER(id) {
  const body = {
    area: document.getElementById('em-area').value.trim(),
    puesto: document.getElementById('em-puesto').value.trim(),
    peligro: document.getElementById('em-peligro').value.trim(),
    consecuencia: document.getElementById('em-consec').value.trim(),
    probabilidad: parseInt(document.getElementById('em-prob').value),
    severidad: parseInt(document.getElementById('em-sev').value),
    medidas_existentes: document.getElementById('em-ctrl-ex').value.trim(),
    medidas_propuestas: document.getElementById('em-ctrl-prop').value.trim(),
    estado_accion: document.getElementById('em-estado').value,
    plazo: document.getElementById('em-plazo').value,
    responsable: document.getElementById('em-resp').value.trim()
  };
  try {
    await API.put('/miper/' + id, body);
    showToast('Peligro actualizado correctamente', 'success');
    closeModal();
    navigate('miper');
  } catch { showToast('Error al actualizar', 'error'); }
}

function confirmDeleteMIPER(id) {
  showModal('Confirmar Eliminación', `
    <div class="info-box-red">
      <p class="text-sm text-red-700 font-medium">¿Deseas eliminar este peligro de la MIPER?</p>
      <p class="text-xs text-red-600 mt-2">Esta acción no se puede deshacer.</p>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="deleteMIPER(${id})"><i class="fas fa-trash mr-1"></i>Eliminar</button>
  `);
}

async function deleteMIPER(id) {
  try {
    await API.delete('/miper/' + id);
    showToast('Peligro eliminado de la MIPER', 'success');
    closeModal();
    navigate('miper');
  } catch { showToast('Error al eliminar', 'error'); }
}

// ================================================================
// PROTOCOLOS MINSAL
// ================================================================
async function renderProtocols() {
  setPageTitle('Protocolos MINSAL', 'Gestión y seguimiento de protocolos de vigilancia de la salud ocupacional');
  const res = await API.get('/protocols');
  const data = res.data;
  const content = document.getElementById('page-content');

  const protocols = [
    { id: 'PREXOR', icon: 'fa-ear-deaf', title: 'PREXOR', desc: 'Exposición Ocupacional al Ruido', color: '#dc2626', activo: true },
    { id: 'PLANESI', icon: 'fa-lungs', title: 'PLANESI', desc: 'Exposición a Sílice', color: '#7c3aed', activo: true },
    { id: 'TMERT', icon: 'fa-person-walking', title: 'TMERT', desc: 'Trastornos Músculo-Esqueléticos', color: '#2563eb', activo: true },
    { id: 'PSICOSOCIAL', icon: 'fa-brain', title: 'PSICOSOCIAL', desc: 'Riesgos Psicosociales — CEAL-SM', color: '#7c3aed', activo: true },
    { id: 'UV', icon: 'fa-sun', title: 'UV', desc: 'Exposición Solar Radiación UV', color: '#d97706', activo: true },
    { id: 'MMC', icon: 'fa-box', title: 'MMC', desc: 'Manejo Manual de Cargas', color: '#16a34a', activo: true },
    { id: 'VOZ', icon: 'fa-microphone', title: 'VOZ', desc: 'Disfonía Ocupacional', color: '#0891b2', activo: false },
  ];

  const cumplimiento = { PREXOR: 72, PLANESI: 55, TMERT: 88, PSICOSOCIAL: 65, UV: 91, MMC: 80, VOZ: 30 };

  content.innerHTML = `
    <div class="mb-5 p-4 rounded-xl flex items-start gap-3" style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #16a34a">
      <i class="fas fa-shield-halved text-green-600 text-xl mt-0.5"></i>
      <div>
        <div class="font-bold text-green-800">Protocolos de Vigilancia de Salud Ocupacional — MINSAL</div>
        <div class="text-sm text-green-700 mt-0.5">Según Ley 16.744, DS 594 y Circulares MINSAL. El empleador debe implementar los protocolos según los factores de riesgo presentes en cada puesto de trabajo e informar a los trabajadores.</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      ${protocols.map(p => {
        const pct = cumplimiento[p.id] || 0;
        return `
          <div class="protocol-card" onclick="navigate('protocol-detail',{id:'${p.id}'})">
            <div class="protocol-card-header" style="background:linear-gradient(135deg,${p.color}dd,${p.color})">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background:rgba(255,255,255,0.2)">
                  <i class="fas ${p.icon} text-white text-lg"></i>
                </div>
                <div>
                  <div class="font-black text-white text-lg">${p.title}</div>
                  <div class="text-sm text-white opacity-80">${p.desc}</div>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-3">
                ${p.activo
                  ? '<span class="badge badge-green text-xs">Activo</span>'
                  : '<span class="badge badge-gray text-xs">Sin implementar</span>'}
                <div class="text-white font-bold text-lg ml-auto">${pct}%</div>
              </div>
            </div>
            <div class="p-4">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-500">Cumplimiento</span>
                <span class="font-bold ${pct>=80?'text-green-600':pct>=60?'text-yellow-600':'text-red-600'}">${pct}%</span>
              </div>
              <div class="progress-bar mb-3">
                <div class="progress-fill" style="width:${pct}%;background:${pct>=80?'#16a34a':pct>=60?'#d97706':'#dc2626'}"></div>
              </div>
              <button class="btn btn-primary w-full justify-center text-sm" style="background:${p.color};border-color:${p.color}">
                <i class="fas fa-eye mr-1"></i>Ver Protocolo
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

async function renderProtocolDetail(id) {
  setPageTitle('Protocolo ' + id, 'Gestión y cumplimiento — MINSAL 2026');
  const res = await API.get('/protocols/' + id);
  const proto = res.data.data;
  const content = document.getElementById('page-content');

  const protocolMeta = {
    PREXOR: { icon: 'fa-ear-deaf', color: '#dc2626', norma: 'DS 594 Art. 74-83 · Circ. MINSAL 3E/168', desc: 'Protocolo de Exposición Ocupacional al Ruido. Obliga la vigilancia auditiva de trabajadores expuestos a niveles de ruido ≥ 82 dB(A).' },
    PLANESI: { icon: 'fa-lungs', color: '#7c3aed', norma: 'DS 594 Art. 61-67 · Circ. MINSAL 3E/163', desc: 'Plan Nacional de Erradicación de la Silicosis. Vigilancia de trabajadores expuestos a polvo de sílice.' },
    TMERT: { icon: 'fa-person-walking', color: '#2563eb', norma: 'Circ. MINSAL 3E/170 · ISO 11228', desc: 'Protocolo de Vigilancia para TMERT-EESS. Identifica y controla factores de riesgo ergonómicos.' },
    PSICOSOCIAL: { icon: 'fa-brain', color: '#7c3aed', norma: 'Circ. MINSAL 3E/187 · CEAL-SM/SUSESO', desc: 'Protocolo de Vigilancia de Riesgos Psicosociales. Aplicación del cuestionario CEAL-SM.' },
    UV: { icon: 'fa-sun', color: '#d97706', norma: 'Ley 20.096 · DS 594 · Circ. MINSAL', desc: 'Protocolo de Exposición Ocupacional a Radiación UV Solar. Protección de trabajadores expuestos al sol.' },
    MMC: { icon: 'fa-box', color: '#16a34a', norma: 'DS 63/2005 MINTRAB · Guía ACHS', desc: 'Manejo Manual de Cargas y Tareas de Bajo Esfuerzo. Ergonomía y prevención de lesiones musculoesqueléticas.' },
    VOZ: { icon: 'fa-microphone', color: '#0891b2', norma: 'Circ. MINSAL 3E/186 · FONASA', desc: 'Protocolo de Vigilancia de Trabajadores Expuestos a Trastornos de Voz. Para docentes, teleoperadores, etc.' },
  };
  const meta = protocolMeta[id] || { icon: 'fa-clipboard-list', color: '#374151', norma: '—', desc: '—' };

  content.innerHTML = `
    <div class="flex items-center gap-3 mb-5">
      <button class="btn btn-secondary text-sm" onclick="navigate('protocols')"><i class="fas fa-arrow-left mr-1"></i>Volver</button>
    </div>

    <!-- Header card -->
    <div class="card mb-5 overflow-hidden">
      <div class="p-5 text-white" style="background:linear-gradient(135deg,${meta.color}dd,${meta.color})">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style="background:rgba(255,255,255,0.2)">
            <i class="fas ${meta.icon} text-3xl text-white"></i>
          </div>
          <div>
            <h2 class="text-2xl font-black">Protocolo ${id}</h2>
            <p class="text-sm opacity-90 mt-1">${meta.desc}</p>
            <div class="flex flex-wrap gap-2 mt-3">
              <span class="badge text-xs" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3)">
                <i class="fas fa-gavel mr-1"></i>${meta.norma}
              </span>
              <span class="badge text-xs" style="background:rgba(255,255,255,0.2);color:white">
                <i class="fas fa-calendar mr-1"></i>Vigencia 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Info básica -->
      <div class="space-y-4">
        <div class="card p-4">
          <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-chart-pie mr-2" style="color:var(--hse-green)"></i>Cumplimiento</h3>
          <div class="text-4xl font-black text-center mb-2" style="color:${meta.color}">${proto?.cumplimiento_pct || 72}%</div>
          <div class="progress-bar mb-3">
            <div class="progress-fill" style="width:${proto?.cumplimiento_pct || 72}%;background:${meta.color}"></div>
          </div>
          <div class="space-y-1.5 text-xs">
            <div class="flex justify-between"><span class="text-gray-500">Trabajadores expuestos</span><span class="font-bold">${proto?.n_trabajadores || '—'}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Con evaluación al día</span><span class="font-bold text-green-600">${proto?.evaluaciones_al_dia || '—'}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Pendientes</span><span class="font-bold text-red-600">${proto?.evaluaciones_pendientes || '—'}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Última medición</span><span class="font-bold">${proto?.ultima_medicion ? formatDate(proto.ultima_medicion) : '—'}</span></div>
          </div>
        </div>
        <div class="card p-4">
          <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-lightbulb mr-2 text-yellow-500"></i>Acciones Rápidas</h3>
          <div class="flex flex-col gap-2">
            <button class="btn btn-primary justify-start text-xs" onclick="showNewEvalModal('${id}')"><i class="fas fa-plus mr-1"></i>Nueva Evaluación</button>
            <button class="btn btn-secondary justify-start text-xs" onclick="navigate('workers')"><i class="fas fa-users mr-1"></i>Ver Trabajadores Expuestos</button>
            <button class="btn btn-secondary justify-start text-xs" onclick="showToast('Generando reporte PDF...','info')"><i class="fas fa-file-pdf text-red-500 mr-1"></i>Generar Informe</button>
          </div>
        </div>
      </div>

      <!-- Evaluaciones -->
      <div class="lg:col-span-2 card p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-700"><i class="fas fa-clipboard-check mr-2" style="color:var(--hse-green)"></i>Evaluaciones de Trabajadores</h3>
          <button class="btn btn-primary text-xs py-1.5" onclick="showNewEvalModal('${id}')"><i class="fas fa-plus mr-1"></i>Nueva Evaluación</button>
        </div>
        ${proto?.evaluaciones && proto.evaluaciones.length > 0 ? `
          <div class="overflow-x-auto">
            <table class="data-table">
              <thead><tr>
                <th>Trabajador</th><th>Fecha</th><th>Resultado</th><th>NSE/Nivel</th>
                <th>Próxima Eval.</th><th>Estado</th>
              </tr></thead>
              <tbody>
                ${proto.evaluaciones.map(ev => `
                  <tr>
                    <td><div class="font-medium text-sm">${ev.trabajador_nombre || ev.worker_id}</div></td>
                    <td class="text-xs text-gray-500">${formatDate(ev.fecha_evaluacion)}</td>
                    <td class="text-sm">${ev.resultado_evaluacion}</td>
                    <td><span class="badge badge-blue text-xs">${ev.nse_nivel || '—'}</span></td>
                    <td class="text-xs text-gray-500">${formatDate(ev.proxima_evaluacion)}</td>
                    <td>${estadoBadgeGeneric(ev.estado)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="text-center py-10 text-gray-400">
            <i class="fas fa-clipboard text-3xl mb-3 text-gray-200"></i>
            <div class="font-medium">Sin evaluaciones registradas</div>
            <div class="text-sm mt-1">Inicia registrando la primera evaluación del protocolo</div>
            <button class="btn btn-primary mt-4 text-sm" onclick="showNewEvalModal('${id}')"><i class="fas fa-plus mr-1"></i>Primera Evaluación</button>
          </div>
        `}
      </div>
    </div>
  `;
}

function showNewEvalModal(protocolId) {
  showModal(`Nueva Evaluación — Protocolo ${protocolId}`, `
    <div class="space-y-4">
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-user mr-2"></i>Trabajador</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Trabajador *</label>
            <input id="eval-trab" class="form-input" placeholder="Nombre o RUT del trabajador"></div>
          <div><label class="form-label">Fecha de evaluación *</label>
            <input id="eval-fecha" type="date" class="form-input" value="${new Date().toISOString().split('T')[0]}"></div>
          <div><label class="form-label">Resultado</label>
            <select id="eval-result" class="form-input">
              <option value="normal">Normal</option>
              <option value="alterado">Alterado</option>
              <option value="pendiente">Pendiente confirmación</option>
            </select></div>
          <div><label class="form-label">NSE / Nivel de riesgo</label>
            <select id="eval-nse" class="form-input">
              <option value="I">NSE I — Sin riesgo relevante</option>
              <option value="II">NSE II — Riesgo leve</option>
              <option value="III">NSE III — Riesgo moderado</option>
              <option value="IV">NSE IV — Riesgo severo</option>
            </select></div>
          <div><label class="form-label">Próxima evaluación</label>
            <input id="eval-prox" type="date" class="form-input"></div>
          <div class="col-span-2"><label class="form-label">Observaciones</label>
            <textarea id="eval-obs" class="form-input" rows="2" placeholder="Hallazgos clínicos, recomendaciones..."></textarea></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Evaluación registrada exitosamente','success')"><i class="fas fa-save mr-1"></i>Guardar Evaluación</button>
  `);
}

// ================================================================
// REPORTES
// ================================================================
async function renderReports() {
  setPageTitle('Reportería HSE', 'Informes y estadísticas — Ley 16.744 · DS 594 · 2026');
  const content = document.getElementById('page-content');
  
  // Cargamos KPIs para las estadísticas
  let kpis = null;
  let centros = [];
  let miper = [];
  try {
    const [kRes, cRes, mRes] = await Promise.all([
      API.get('/dashboard/kpis'),
      API.get('/centros'),
      API.get('/miper')
    ]);
    kpis = kRes.data.data;
    centros = cRes.data.data;
    miper = mRes.data.data;
  } catch {}

  const reports = [
    { id: 'accidentabilidad', icon: 'fa-triangle-exclamation', title: 'Informe de Accidentabilidad', desc: 'Tasas, días perdidos, tipos de accidentes y tendencias. Obligatorio para mutualidad.', color: '#dc2626', periodo: '2026' },
    { id: 'protocolos', icon: 'fa-clipboard-list', title: 'Cumplimiento Protocolos MINSAL', desc: 'Estado de implementación de los 7 protocolos de vigilancia de la salud ocupacional.', color: '#7c3aed', periodo: '2026' },
    { id: 'examenes', icon: 'fa-stethoscope', title: 'Estado de Exámenes Médicos', desc: 'Vigentes, por vencer y vencidos. Nómina de trabajadores pendientes de evaluación.', color: '#16a34a', periodo: '2026' },
    { id: 'epp', icon: 'fa-hard-hat', title: 'Inventario y Entregas EPP', desc: 'Stock actual, entregas realizadas, firmas digitales y renovaciones pendientes.', color: '#d97706', periodo: '2026' },
    { id: 'capacitaciones', icon: 'fa-graduation-cap', title: 'Plan de Capacitación Anual', desc: 'Cumplimiento del programa ODI, coberturas y certificaciones. DS 40 Art. 21.', color: '#2563eb', periodo: '2026' },
    { id: 'miper', icon: 'fa-triangle-exclamation', title: 'Informe Matriz MIPER', desc: 'Mapa de riesgos, peligros identificados, controles implementados y estado de gestión.', color: '#f59e0b', periodo: '2026' },
    { id: 'trabajador', icon: 'fa-user-circle', title: 'Ficha Individual del Trabajador', desc: 'Historial completo: protocolos, exámenes, EPP, accidentes y capacitaciones.', color: '#0891b2', periodo: 'Según selección' },
    { id: 'estadisticas', icon: 'fa-chart-bar', title: 'Estadísticas Globales HSE 360', desc: 'Dashboard ejecutivo con todos los KPIs de la plataforma HSE 360 para directivos.', color: '#374151', periodo: '2026' },
  ];

  const centrosFiltro = centros.filter(c => c.activo);
  const miperIntolerable = miper.filter(m => (m.nivel||m.nivel_riesgo) === 'Intolerable').length;
  const miperImportante = miper.filter(m => (m.nivel||m.nivel_riesgo) === 'Importante').length;

  content.innerHTML = `
    <!-- Resumen estadístico en tiempo real -->
    ${kpis ? `
    <div class="card p-5 mb-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-800"><i class="fas fa-chart-line mr-2" style="color:var(--hse-green)"></i>Resumen Ejecutivo HSE 360 — ${new Date().toLocaleDateString('es-CL',{month:'long',year:'numeric'})}</h3>
        <span class="badge badge-hse">Actualizado en tiempo real</span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div class="p-3 rounded-xl text-center" style="background:#f0fdf4;border:1px solid #86efac">
          <div class="text-2xl font-black text-green-700">${kpis.trabajadores.activos}</div>
          <div class="text-xs text-green-600 mt-1">Trabajadores Activos</div>
          <div class="text-xs text-gray-400 mt-0.5">de ${kpis.trabajadores.total} registrados</div>
        </div>
        <div class="p-3 rounded-xl text-center" style="background:${kpis.accidentabilidad.tasa > kpis.accidentabilidad.meta ? '#fef2f2' : '#f0fdf4'};border:1px solid ${kpis.accidentabilidad.tasa > kpis.accidentabilidad.meta ? '#fecaca' : '#86efac'}">
          <div class="text-2xl font-black ${kpis.accidentabilidad.tasa > kpis.accidentabilidad.meta ? 'text-red-700' : 'text-green-700'}">${kpis.accidentabilidad.tasa}%</div>
          <div class="text-xs ${kpis.accidentabilidad.tasa > kpis.accidentabilidad.meta ? 'text-red-600' : 'text-green-600'} mt-1">Tasa Accidentabilidad</div>
          <div class="text-xs text-gray-400 mt-0.5">Meta: ≤ ${kpis.accidentabilidad.meta}%</div>
        </div>
        <div class="p-3 rounded-xl text-center" style="background:#fffbeb;border:1px solid #fde68a">
          <div class="text-2xl font-black text-yellow-700">${kpis.protocolos.cumplimiento_pct}%</div>
          <div class="text-xs text-yellow-600 mt-1">Cumplimiento Protocolos</div>
          <div class="text-xs text-gray-400 mt-0.5">${kpis.protocolos.al_dia} al día · ${kpis.protocolos.criticos} crítico</div>
        </div>
        <div class="p-3 rounded-xl text-center" style="background:#fef2f2;border:1px solid #fecaca">
          <div class="text-2xl font-black text-red-700">${kpis.alertas_activas}</div>
          <div class="text-xs text-red-600 mt-1">Alertas Activas</div>
          <div class="text-xs text-gray-400 mt-0.5">Requieren atención</div>
        </div>
      </div>

      <!-- Fila 2: datos detallados -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="p-3 bg-gray-50 rounded-xl text-xs">
          <div class="font-bold text-gray-600 mb-2"><i class="fas fa-stethoscope mr-1 text-green-600"></i>Exámenes Médicos</div>
          <div class="flex justify-between"><span>Vigentes</span><span class="font-bold text-green-600">${kpis.examenes.total_vigentes}</span></div>
          <div class="flex justify-between"><span>Por vencer (90d)</span><span class="font-bold text-yellow-600">${kpis.examenes.por_vencer}</span></div>
          <div class="flex justify-between"><span>Vencidos</span><span class="font-bold text-red-600">${kpis.examenes.vencidos}</span></div>
        </div>
        <div class="p-3 bg-gray-50 rounded-xl text-xs">
          <div class="font-bold text-gray-600 mb-2"><i class="fas fa-hard-hat mr-1 text-orange-500"></i>EPP</div>
          <div class="flex justify-between"><span>Ítems críticos</span><span class="font-bold text-red-600">${kpis.epp.items_criticos}</span></div>
          <div class="flex justify-between"><span>Stock bajo</span><span class="font-bold text-yellow-600">${kpis.epp.items_bajo_stock}</span></div>
          <div class="flex justify-between"><span>Firmas pendientes</span><span class="font-bold text-blue-600">${kpis.epp.entregas_pendientes}</span></div>
        </div>
        <div class="p-3 bg-gray-50 rounded-xl text-xs">
          <div class="font-bold text-gray-600 mb-2"><i class="fas fa-graduation-cap mr-1 text-purple-600"></i>Capacitaciones</div>
          <div class="flex justify-between"><span>Cobertura ODI</span><span class="font-bold text-indigo-600">${kpis.capacitaciones.cobertura_odi}%</span></div>
          <div class="flex justify-between"><span>Vencidas</span><span class="font-bold text-red-600">${kpis.capacitaciones.vencidas}</span></div>
          <div class="flex justify-between"><span>Por vencer</span><span class="font-bold text-yellow-600">${kpis.capacitaciones.por_vencer}</span></div>
        </div>
        <div class="p-3 bg-gray-50 rounded-xl text-xs">
          <div class="font-bold text-gray-600 mb-2"><i class="fas fa-triangle-exclamation mr-1 text-yellow-600"></i>Matriz MIPER</div>
          <div class="flex justify-between"><span>Peligros totales</span><span class="font-bold text-gray-700">${miper.length}</span></div>
          <div class="flex justify-between"><span>Intolerables</span><span class="font-bold text-red-600">${miperIntolerable}</span></div>
          <div class="flex justify-between"><span>Importantes</span><span class="font-bold text-orange-600">${miperImportante}</span></div>
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Centros de trabajo -->
    <div class="card p-4 mb-5">
      <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-building mr-2" style="color:var(--hse-green)"></i>Centros de Trabajo Activos (${centrosFiltro.length})</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        ${centrosFiltro.map(c => `
          <div class="p-3 rounded-xl border" style="border-color:${c.estado_cumplimiento>=80?'#86efac':c.estado_cumplimiento>=60?'#fde68a':'#fecaca'}">
            <div class="flex items-center justify-between mb-2">
              <div class="font-semibold text-sm text-gray-700 truncate">${c.nombre}</div>
              <span class="font-black text-sm flex-shrink-0 ml-2" style="color:${c.estado_cumplimiento>=80?'#16a34a':c.estado_cumplimiento>=60?'#d97706':'#dc2626'}">${c.estado_cumplimiento}%</span>
            </div>
            <div class="text-xs text-gray-400">${c.n_trabajadores} trabajadores · ${c.mutualidad}</div>
            <div class="progress-bar mt-2"><div class="progress-fill" style="width:${c.estado_cumplimiento}%;background:${c.estado_cumplimiento>=80?'#16a34a':c.estado_cumplimiento>=60?'#d97706':'#dc2626'}"></div></div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Generación de informes -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-gray-800"><i class="fas fa-file-export mr-2" style="color:var(--hse-green)"></i>Generar Informes</h3>
      <div class="flex items-center gap-2">
        <label class="text-xs text-gray-500">Centro:</label>
        <select id="report-centro" class="form-input w-48 text-xs py-1.5">
          <option value="">Todos los centros</option>
          ${centrosFiltro.map(c => `<option value="${c.id}" ${App.centroActivo===c.id?'selected':''}>${c.nombre}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      ${reports.map(r => `
        <div class="card overflow-hidden hover:shadow-md transition-shadow">
          <div class="p-4 text-white" style="background:linear-gradient(135deg,${r.color}dd,${r.color})">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(255,255,255,0.2)">
                <i class="fas ${r.icon} text-lg"></i>
              </div>
              <div class="min-w-0">
                <div class="font-bold text-sm leading-tight">${r.title}</div>
                <div class="text-xs opacity-75 mt-0.5">Período: ${r.periodo}</div>
              </div>
            </div>
          </div>
          <div class="p-4">
            <p class="text-xs text-gray-600 mb-4 leading-relaxed">${r.desc}</p>
            <div class="flex gap-2">
              <button class="btn btn-danger flex-1 justify-center text-xs py-2" onclick="generateReport('${r.id}','pdf')">
                <i class="fas fa-file-pdf mr-1"></i>PDF
              </button>
              <button class="btn btn-success flex-1 justify-center text-xs py-2" onclick="generateReport('${r.id}','excel')">
                <i class="fas fa-file-excel mr-1"></i>Excel
              </button>
              <button class="btn btn-secondary py-2 px-3 text-xs" onclick="generateReport('${r.id}','view')" title="Vista previa">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Pie con info legal -->
    <div class="mt-6 p-4 rounded-xl text-xs text-gray-500" style="background:#f8fafc;border:1px solid #e2e8f0">
      <div class="flex items-center gap-2 mb-2">
        <i class="fas fa-balance-scale text-gray-400"></i>
        <strong>Base Legal — Reportería Obligatoria</strong>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>• <strong>Ley 16.744</strong>: Accidentes y enf. profesionales</div>
        <div>• <strong>DS 594</strong>: Condiciones sanitarias y ambientales</div>
        <div>• <strong>DS 40 Art. 21</strong>: ODI - Obligación de informar</div>
        <div>• <strong>Protocolos MINSAL</strong>: Vigilancia de salud</div>
      </div>
    </div>

    <!-- Banner NexusForge destacado -->
    <div class="nexusforge-banner mt-6">
      <div class="nf-banner-glow"></div>
      <div class="nf-banner-inner">
        <div class="nf-banner-left">
          <svg width="52" height="52" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="nf-banner-svg">
            <defs>
              <linearGradient id="nf-grad-banner" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="100%" stop-color="#0ea5e9"/>
              </linearGradient>
            </defs>
            <rect width="40" height="40" rx="9" fill="url(#nf-grad-banner)"/>
            <path d="M8 28 L8 12 L16 12 L24 24 L24 12 L32 12 L32 28 L24 28 L16 16 L16 28 Z" fill="white" opacity="0.95"/>
            <circle cx="32" cy="28" r="4" fill="#22d3ee" opacity="0.9"/>
          </svg>
          <div>
            <div class="nf-banner-title">NexusForge</div>
            <div class="nf-banner-sub">Desarrollos y Arquitectura de Software &amp; Apps</div>
          </div>
        </div>
        <div class="nf-banner-right">
          <div class="nf-banner-chips">
            <span class="nf-chip"><i class="fas fa-code mr-1"></i>Hono Framework</span>
            <span class="nf-chip"><i class="fas fa-cloud mr-1"></i>Cloudflare Workers</span>
            <span class="nf-chip"><i class="fas fa-database mr-1"></i>D1 SQLite</span>
            <span class="nf-chip"><i class="fas fa-shield-halved mr-1"></i>Edge Security</span>
            <span class="nf-chip"><i class="fas fa-bolt mr-1"></i>Edge Computing</span>
          </div>
          <div class="nf-banner-meta">HSE 360 v2.0 · Plataforma Integral de Seguridad y Salud · Chile 2026</div>
        </div>
      </div>
    </div>
  `;
}

async function generateReport(type, format) {
  const reportNames = {
    accidentabilidad: 'Informe de Accidentabilidad 2026',
    protocolos: 'Cumplimiento Protocolos MINSAL 2026',
    examenes: 'Estado Exámenes Médicos',
    epp: 'Inventario y Entregas EPP',
    capacitaciones: 'Plan de Capacitación 2026',
    trabajador: 'Ficha Individual del Trabajador',
    miper: 'Informe Matriz MIPER 2026',
    estadisticas: 'Estadísticas Globales HSE 360',
  };
  const centro = document.getElementById('report-centro')?.value;
  const centroNombre = centro ? (window._centrosList||[]).find(c=>c.id==centro)?.nombre : 'Todos los centros';
  
  if (format === 'view') {
    showModal(`Vista previa: ${reportNames[type]}`, `
      <div class="space-y-3">
        <div class="info-box">
          <div class="text-xs text-green-800">
            <i class="fas fa-info-circle mr-1"></i>
            <strong>${reportNames[type]}</strong> · Centro: ${centroNombre || 'Todos'} · Generado: ${new Date().toLocaleDateString('es-CL')}
          </div>
        </div>
        <div class="p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
          <p class="font-bold text-gray-800 mb-2">HSE 360 — Plataforma Integral de Seguridad y Salud</p>
          <p class="text-xs">Este informe contiene información confidencial según Ley 19.628. Su distribución debe ser autorizada por el Super Administrador.</p>
          <div class="mt-3 p-3 border rounded-lg bg-white">
            <div class="text-xs font-bold text-gray-500 mb-2">CONTENIDO DEL INFORME:</div>
            <div class="text-xs space-y-1 text-gray-600">
              <div>• Período de análisis: Enero - ${new Date().toLocaleDateString('es-CL',{month:'long'})} 2026</div>
              <div>• Centro: ${centroNombre || 'Todos los centros'}</div>
              <div>• Generado por: ${App.currentUser?.nombres} ${App.currentUser?.apellidos}</div>
              <div>• Fecha: ${new Date().toLocaleString('es-CL')}</div>
            </div>
          </div>
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
      <button class="btn btn-danger" onclick="closeModal();generateReport('${type}','pdf')"><i class="fas fa-file-pdf mr-1"></i>Exportar PDF</button>
    `);
    return;
  }
  
  showToast(`Generando ${reportNames[type]} en ${format.toUpperCase()}...`, 'info');
  await new Promise(r => setTimeout(r, 1500));
  showToast(`✓ ${reportNames[type]}.${format === 'pdf' ? 'pdf' : 'xlsx'} listo para descargar`, 'success');
}

// ================================================================
// MODAL HELPERS
// ================================================================
function showModal(title, body, footer = '') {
  const existing = document.getElementById('hse-modal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'hse-modal';
  modal.className = 'modal-overlay fade-in';
  modal.innerHTML = `
    <div class="modal-box" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3 class="font-bold text-gray-800 text-base pr-4">${title}</h3>
        <button onclick="closeModal()" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex-shrink-0">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">${body}</div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    </div>
  `;
  modal.addEventListener('click', closeModal);
  document.body.appendChild(modal);
}

function closeModal() {
  const modal = document.getElementById('hse-modal');
  if (modal) modal.remove();
}

// ================================================================
// TOAST NOTIFICATIONS
// ================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
  const colors = { success: '#16a34a', error: '#dc2626', info: '#2563eb', warning: '#d97706' };
  const id = 'toast-' + Date.now();
  const toast = document.createElement('div');
  toast.id = id;
  toast.className = 'toast fade-in';
  toast.innerHTML = `
    <div class="flex items-center gap-2 bg-white shadow-lg rounded-xl px-4 py-3 border-l-4 min-w-64 max-w-sm"
      style="border-left-color:${colors[type]}">
      <i class="fas ${icons[type] || icons.info} text-sm flex-shrink-0" style="color:${colors[type]}"></i>
      <span class="text-sm text-gray-700 flex-1">${message}</span>
      <button onclick="document.getElementById('${id}').remove()" class="text-gray-300 hover:text-gray-500 ml-1">
        <i class="fas fa-times text-xs"></i>
      </button>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => { const el = document.getElementById(id); if (el) el.remove(); }, 4000);
}

// ================================================================
// UTILIDADES
// ================================================================
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return dateStr; }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  } catch { return dateStr; }
}

function estadoBadgeGeneric(estado) {
  const map = {
    activo: 'badge-green', inactivo: 'badge-red', licencia: 'badge-orange',
    vigente: 'badge-green', vencido: 'badge-red', vencida: 'badge-red',
    por_vencer: 'badge-orange', pendiente: 'badge-yellow', programada: 'badge-blue',
    abierto: 'badge-orange', cerrado: 'badge-green', completado: 'badge-green',
    en_proceso: 'badge-blue', sin_firma: 'badge-gray', firmado: 'badge-green',
    normal: 'badge-green', alterado: 'badge-red',
  };
  const label = (estado || '').replace(/_/g,' ');
  const cls = map[estado] || 'badge-gray';
  return `<span class="badge ${cls} text-xs">${label || '—'}</span>`;
}

function stockBadge(actual, minimo) {
  if (actual <= 0) return '<span class="badge badge-red text-xs">Sin stock</span>';
  if (actual <= minimo) return '<span class="badge badge-red text-xs">Crítico</span>';
  if (actual <= minimo * 1.5) return '<span class="badge badge-orange text-xs">Bajo</span>';
  return '<span class="badge badge-green text-xs">OK</span>';
}

function stringToColor(str) {
  if (!str) return '#64748b';
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const colors = ['#1d4ed8','#7c3aed','#db2777','#dc2626','#d97706','#16a34a','#0891b2','#64748b'];
  return colors[Math.abs(hash) % colors.length];
}

// ================================================================
// INICIALIZACIÓN
// ================================================================
(function init() {
  if (checkSession()) {
    renderApp();
  } else {
    renderLogin();
  }
})();
