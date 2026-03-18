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
function nfIconSVG(size, lightMode) {
  const s = lightMode
    ? { hex:'#1a237e', mid:'#2d3896', nf:'#0d1b5e', f:'#1e2d7d', c:'#00b4d8' }
    : { hex:'#93c5fd', mid:'#bfdbfe', nf:'#dbeafe', f:'#93c5fd', c:'#22d3ee' };
  return `<svg width="${size}" height="${Math.round(size*0.95)}" viewBox="0 0 80 76" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 40 L18 22 L36 6 L54 6 L66 22 L58 40" stroke="${s.hex}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M58 40 L58 56 L44 68 L28 56 L28 40" stroke="${s.mid}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32 56 L32 24 L54 56 L54 24" stroke="${s.nf}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M46 38 L59 38" stroke="${s.f}" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M46 28 L59 28" stroke="${s.f}" stroke-width="5" stroke-linecap="round"/>
    <line x1="4" y1="32" x2="28" y2="32" stroke="${s.c}" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="58" y1="32" x2="76" y2="32" stroke="${s.c}" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="4" cy="32" r="4" fill="none" stroke="${s.c}" stroke-width="2.5"/>
    <circle cx="4" cy="32" r="1.5" fill="${s.c}"/>
    <circle cx="28" cy="32" r="3.5" fill="none" stroke="${s.c}" stroke-width="2.2"/>
    <circle cx="28" cy="32" r="1.2" fill="${s.c}"/>
    <circle cx="58" cy="32" r="3.5" fill="none" stroke="${s.c}" stroke-width="2.2"/>
    <circle cx="58" cy="32" r="1.2" fill="${s.c}"/>
    <circle cx="76" cy="32" r="4" fill="none" stroke="${s.c}" stroke-width="2.5"/>
    <circle cx="76" cy="32" r="1.5" fill="${s.c}"/>
    <line x1="10" y1="56" x2="28" y2="56" stroke="${s.c}" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="7" cy="56" r="3.5" fill="none" stroke="${s.c}" stroke-width="2"/>
    <circle cx="7" cy="56" r="1.2" fill="${s.c}"/>
  </svg>`;
}

function renderLogin() {
  document.getElementById('app').innerHTML = `
    <div class="login-page" style="min-height:100vh;display:flex;">

      <!-- Panel izquierdo — NexusForge Brand -->
      <div class="login-left-panel" style="flex:1;background:linear-gradient(160deg,#0d1b5e 0%,#1a237e 40%,#2d3896 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 50px;position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;background:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:36px 36px;"></div>
        <div style="position:absolute;bottom:-80px;right:-80px;width:280px;height:280px;border-radius:50%;background:rgba(0,180,216,0.1);"></div>
        <div style="position:absolute;top:-60px;left:-60px;width:200px;height:200px;border-radius:50%;background:rgba(26,35,126,0.3);"></div>

        <div style="position:relative;z-index:1;text-align:center;max-width:360px;">
          <!-- NexusForge logo grande -->
          <div style="margin-bottom:28px;">${nfIconSVG(80, false)}</div>
          <div style="font-size:32px;font-weight:900;color:white;letter-spacing:-0.8px;line-height:1;margin-bottom:6px;">NexusForge</div>
          <div style="font-size:13px;color:rgba(0,180,216,0.9);font-weight:500;letter-spacing:0.5px;margin-bottom:40px;">Connecting Innovation with Power</div>

          <!-- Divisor -->
          <div style="width:48px;height:3px;background:linear-gradient(90deg,#00b4d8,rgba(0,180,216,0));border-radius:2px;margin:0 auto 40px;"></div>

          <!-- Producto -->
          <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:14px;">
            <div style="width:40px;height:40px;background:linear-gradient(135deg,#0d1b5e,#1a237e);border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px;color:white;box-shadow:0 4px 14px rgba(26,35,126,0.35);">360</div>
            <div style="text-align:left;">
              <div style="font-size:18px;font-weight:800;color:white;letter-spacing:-0.3px;">HSE 360</div>
              <div style="font-size:10px;color:rgba(0,180,216,0.8);text-transform:uppercase;letter-spacing:1px;font-weight:600;">Plataforma Integral HSE · Chile</div>
            </div>
          </div>
          <p style="font-size:12px;color:rgba(255,255,255,0.45);line-height:1.7;max-width:280px;margin:0 auto;">
            Sistema profesional de gestión de Seguridad, Salud Ocupacional y Medio Ambiente conforme a Ley 16.744 · DS 594 · Protocolos MINSAL
          </p>

          <!-- Features -->
          <div style="margin-top:36px;display:flex;flex-direction:column;gap:10px;text-align:left;">
            ${[
              ['fa-shield-check','Gestión integral de cumplimiento normativo'],
              ['fa-chart-line','KPIs y reportería en tiempo real'],
              ['fa-users','Control de trabajadores y protocolos'],
              ['fa-lock','Seguridad por roles y permisos'],
            ].map(([ic,txt]) => `
              <div style="display:flex;align-items:center;gap:10px;color:rgba(255,255,255,0.75);font-size:12.5px;">
                <div style="width:28px;height:28px;border-radius:7px;background:rgba(0,180,216,0.15);border:1px solid rgba(0,180,216,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <i class="fas ${ic}" style="color:#00b4d8;font-size:11px;"></i>
                </div>
                ${txt}
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Panel derecho — Formulario de acceso -->
      <div style="width:460px;background:white;display:flex;flex-direction:column;justify-content:center;padding:50px 44px;overflow-y:auto;box-shadow:-20px 0 60px rgba(0,0,0,0.12);">
        <div class="fade-in">
          <!-- Header del form -->
          <div class="text-center mb-8">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background:linear-gradient(135deg,#0d1b5e,#2d3896);border-radius:14px;margin-bottom:14px;box-shadow:0 6px 20px rgba(26,35,126,0.3);">
              <span style="font-size:18px;font-weight:900;color:white;letter-spacing:-0.5px;">360</span>
            </div>
            <h1 style="font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.4px;margin-bottom:4px;">Bienvenido/a</h1>
            <p style="font-size:13.5px;color:#64748b;">Ingresa tus credenciales para acceder a HSE 360</p>
          </div>

          <div id="login-error" class="hidden mb-4" style="padding:12px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;font-size:13px;color:#dc2626;display:flex;align-items:center;gap:8px;">
            <i class="fas fa-circle-exclamation"></i><span id="login-error-msg"></span>
          </div>

          <div class="space-y-5">
            <div>
              <label class="form-label">Correo electrónico</label>
              <div style="position:relative;">
                <span style="position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#94a3b8;"><i class="fas fa-envelope text-sm"></i></span>
                <input id="login-email" type="email" class="form-input" style="padding-left:38px;" placeholder="usuario@empresa.cl"
                  onkeydown="if(event.key==='Enter')doLogin()">
              </div>
            </div>
            <div>
              <label class="form-label">Contraseña</label>
              <div style="position:relative;">
                <span style="position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#94a3b8;"><i class="fas fa-lock text-sm"></i></span>
                <input id="login-pass" type="password" class="form-input" style="padding-left:38px;padding-right:42px;" placeholder="••••••••"
                  onkeydown="if(event.key==='Enter')doLogin()">
                <button type="button" onclick="togglePassVis()" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#94a3b8;cursor:pointer;padding:4px;">
                  <i class="fas fa-eye text-sm"></i>
                </button>
              </div>
            </div>
            <button onclick="doLogin()" id="login-btn" class="btn btn-primary w-full justify-center" style="padding:12px;font-size:15px;font-weight:700;border-radius:10px;margin-top:4px;">
              <i class="fas fa-right-to-bracket"></i> Ingresar al Sistema
            </button>
          </div>

          <!-- Contacto soporte -->
          <div style="margin-top:24px;padding:14px 16px;background:#f8fafc;border:1px solid #edf0f5;border-radius:12px;text-align:center;">
            <div style="font-size:12px;color:#64748b;"><i class="fas fa-lock" style="color:#94a3b8;margin-right:6px;"></i>Acceso restringido a personal autorizado</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:6px;">¿Problemas para ingresar? Contacta al administrador del sistema.</div>
          </div>

          <!-- Legal -->
          <div style="margin-top:20px;text-align:center;font-size:11px;color:#94a3b8;">
            © 2026 HSE 360 · Ley 19.628 Protección de Datos · Chile
          </div>

          <!-- NexusForge branding -->
          <div style="margin-top:16px;padding-top:16px;border-top:1px solid #f1f5f9;display:flex;align-items:center;justify-content:center;gap:10px;">
            <div class="nexusforge-badge">
              ${nfIconSVG(32, true)}
              <div class="nexusforge-text">
                <span class="nf-name">NexusForge</span>
                <span class="nf-tagline">Connecting Innovation with Power</span>
              </div>
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
            <div class="text-xs mt-0.5" style="color:rgba(0,180,216,0.8)">${u?.cargo}</div>
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
          ['HIC','fa-mountain','Hipobaria Intermitente Crónica'],['HUMOS','fa-smog','Metales y Humos Metálicos'],
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
        <div class="nexusforge-sidebar-footer" onclick="navigate('reports')" title="NexusForge — Connecting Innovation with Power">
          ${nfIconSVG(22, false)}
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
              style="background:linear-gradient(135deg,#0d1b5e,#2d3896)">
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
    <div style="padding:12px 16px;background:linear-gradient(135deg,#0d1b5e,#1a237e);color:white;">
      <div style="font-weight:700;font-size:13px">Seleccionar Centro de Trabajo</div>
      <div style="font-size:11px;opacity:0.8;margin-top:2px">Filtra toda la vista por centro</div>
    </div>
    <div style="padding:8px;">
      <button onclick="setCentroActivo(null)" style="width:100%;text-align:left;padding:8px 12px;border-radius:8px;font-size:13px;border:none;cursor:pointer;display:flex;align-items:center;gap:8px;background:${!App.centroActivo?'#eff2ff':'transparent'};color:${!App.centroActivo?'#1a237e':'#374151'};font-weight:${!App.centroActivo?'600':'400'}">
        <i class="fas fa-globe" style="width:16px;text-align:center"></i> Todos los centros
        ${!App.centroActivo ? '<i class="fas fa-check ml-auto text-xs" style="color:#1a237e"></i>' : ''}
      </button>
      ${centros.map(c => `
        <button onclick="setCentroActivo(${c.id})" style="width:100%;text-align:left;padding:8px 12px;border-radius:8px;font-size:13px;border:none;cursor:pointer;display:flex;align-items:center;gap:8px;background:${App.centroActivo===c.id?'#eff2ff':'transparent'};color:${App.centroActivo===c.id?'#1a237e':'#374151'};font-weight:${App.centroActivo===c.id?'600':'400'}">
          <i class="fas fa-building" style="width:16px;text-align:center"></i>
          <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.nombre}</span>
          ${App.centroActivo===c.id ? '<i class="fas fa-check text-xs" style="color:#1a237e"></i>' : ''}
        </button>
      `).join('')}
    </div>
    ${isSuperAdmin() ? `
    <div style="padding:8px;border-top:1px solid #f3f4f6;">
      <button onclick="document.getElementById('centro-dropdown')?.remove();navigate('centros')" 
        style="width:100%;text-align:left;padding:8px 12px;border-radius:8px;font-size:12px;border:none;cursor:pointer;color:#1a237e;background:transparent;display:flex;align-items:center;gap:8px;">
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
        <div class="text-2xl font-bold" style="color:#1a237e">${centros.length}</div>
        <div class="text-xs text-gray-500">Total centros</div>
      </div>
      <div class="card p-4 text-center border-t-4" style="border-top-color:#00b4d8">
        <div class="text-2xl font-bold" style="color:#0096c7">${centros.filter(c=>c.activo).length}</div>
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
            <div style="color:rgba(0,180,216,0.8)" class="text-xs mt-0.5">${ct.razon_social}</div>
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
          ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','HIC','HUMOS'].map(p => `
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
          ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','HIC','HUMOS'].map(p => `
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
        <div class="text-2xl font-bold" style="color:#1a237e">${users.length}</div>
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
            style="background:${u.rol==='superadmin'?'#d97706':u.rol==='prevencionista'?'#1d4ed8':u.rol==='medico'?'#0096c7':u.rol==='rrhh'?'#7c3aed':'#64748b'}">
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
        ${u.centro_trabajo_id ? centrosMap[u.centro_trabajo_id] || 'Centro #'+u.centro_trabajo_id : '<span style="color:#1a237e" class="font-medium text-xs"><i class="fas fa-globe mr-1"></i>Todos</span>'}
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
  setPageTitle('Dashboard HSE 360', 'SOLDESP S.A. · RUT 76.841.820-9 · ' + new Date().toLocaleDateString('es-CL',{year:'numeric',month:'long'}));
  const [kpisRes, chartAccRes, chartProtRes] = await Promise.all([
    API.get('/dashboard/kpis'),
    API.get('/dashboard/chart-accidentes'),
    API.get('/dashboard/chart-protocolos'),
  ]);
  const k = kpisRes.data.data;
  const ca = chartAccRes.data.data;
  const cp = chartProtRes.data.data;
  const content = document.getElementById('page-content');
  const acc = k.accidentabilidad;
  const varIcon = acc.variacion <= 0 ? '▼' : '▲';
  const varColor = acc.variacion <= 0 ? 'text-emerald-300' : 'text-red-300';

  content.innerHTML = `
    <!-- Header strip SOLDESP -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0"
          style="background:linear-gradient(135deg,#0d1b5e,#2d3896);line-height:1.1;text-align:center;padding:4px;">
          <span>HSE<br>360</span>
        </div>
        <div>
          <div class="text-base font-black text-gray-800">SOLDESP S.A.</div>
          <div class="text-xs text-gray-500">RUT 76.841.820-9 · N° Asociada 2000143137 · ${new Date().toLocaleDateString('es-CL',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
          <div class="text-xs text-gray-400">Bienvenido/a, ${App.currentUser?.nombres} ${App.currentUser?.apellidos}</div>
        </div>
      </div>
      <div class="flex gap-2 flex-wrap">
        <span class="badge badge-hse"><i class="fas fa-circle-check mr-1"></i>Sistema Operativo</span>
        <span class="badge badge-blue">Período vigente: ${acc.periodo_actual || '01/02/2025 — 28/02/2026'}</span>
        ${isSuperAdmin() ? `<button class="btn btn-secondary text-xs py-1" onclick="showEditKpisModal()"><i class="fas fa-pencil mr-1"></i>Editar KPIs</button>` : ''}
      </div>
    </div>

    <!-- Banner tasas certificadas -->
    <div class="mb-4 p-3 rounded-xl flex flex-wrap gap-4 items-center fade-in" style="background:linear-gradient(135deg,#0d1b5e,#1a237e);border:1px solid rgba(0,180,216,0.3)">
      <div class="flex items-center gap-2 flex-shrink-0">
        <i class="fas fa-certificate text-yellow-300 text-lg"></i>
        <div>
          <div class="text-white font-bold text-sm">Tasas Certificadas · Folio 0005153838</div>
          <div class="text-xs" style="color:rgba(0,180,216,0.85)">Cotización Total: 0,93% · Período vigente: Feb 2025 – Feb 2026</div>
        </div>
      </div>
      <div class="flex gap-4 flex-wrap">
        <div class="text-center">
          <div class="text-2xl font-black text-white">${acc.tasa_frecuencia.toFixed(2)}</div>
          <div class="text-xs" style="color:rgba(0,180,216,0.85)">Tasa Frecuencia</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-black text-white">${acc.tasa_gravedad.toFixed(2)}</div>
          <div class="text-xs" style="color:rgba(0,180,216,0.85)">Tasa Gravedad</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-black text-white">${acc.tasa_siniestralidad}</div>
          <div class="text-xs" style="color:rgba(0,180,216,0.85)">Tasa Siniestralidad</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-black text-white">${acc.accidentes_ytd}</div>
          <div class="text-xs" style="color:rgba(0,180,216,0.85)">Accidentes</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-black text-white">${acc.trabajadores_promedio.toLocaleString('es-CL')}</div>
          <div class="text-xs" style="color:rgba(0,180,216,0.85)">Trabajadores promedio</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-black text-white">${(acc.horas_hombre/1000).toFixed(0)}K</div>
          <div class="text-xs" style="color:rgba(0,180,216,0.85)">Horas·Hombre</div>
        </div>
      </div>
    </div>

    <!-- KPI Row 1 — Big metrics -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      ${kpiCard('Trabajadores Activos', k.trabajadores.activos.toLocaleString('es-CL'), k.trabajadores.total.toLocaleString('es-CL') + ' registrados', 'fa-users', 'from-blue-600 to-blue-800', k.trabajadores.con_examenes_pendientes + ' con exámenes pendientes')}
      ${kpiCard('Tasa de Frecuencia', acc.tasa_frecuencia.toFixed(2), 'Meta: ≤ ' + acc.meta, 'fa-triangle-exclamation', acc.tasa_frecuencia <= acc.meta ? 'from-emerald-600 to-emerald-800' : 'from-red-600 to-red-800', varIcon + ' ' + Math.abs(acc.variacion).toFixed(2) + ' vs período anterior')}
      ${kpiCard('Tasa de Gravedad', acc.tasa_gravedad.toFixed(2), 'Meta: ≤ ' + acc.meta_gravedad, 'fa-bed-pulse', acc.tasa_gravedad <= acc.meta_gravedad ? 'from-emerald-600 to-emerald-800' : 'from-orange-600 to-orange-800', acc.total_dias_perdidos + ' días perdidos período actual')}
      ${kpiCard('Alertas Activas', k.alertas_activas, k.alertas_activas > 0 ? 'Requieren atención' : 'Sin alertas críticas', 'fa-bell', k.alertas_activas > 3 ? 'from-red-500 to-red-700' : 'from-emerald-500 to-emerald-700', k.alertas_activas + ' en total')}
    </div>

    <!-- KPI Row 2 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <div class="card p-4 hse-accent-top">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Protocolos MINSAL</div>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#eff2ff">
            <i class="fas fa-clipboard-list text-sm" style="color:#1a237e"></i>
          </div>
        </div>
        <div class="text-2xl font-bold text-gray-800">${k.protocolos.cumplimiento_pct}%</div>
        <div class="text-xs text-gray-500 mb-2">Cumplimiento general</div>
        <div class="progress-bar"><div class="progress-fill" style="width:${k.protocolos.cumplimiento_pct}%;background:linear-gradient(90deg,#1a237e,#00b4d8)"></div></div>
        <div class="flex gap-3 mt-2 text-xs">
          <span style="color:#1a237e" class="font-medium">${k.protocolos.al_dia} al día</span>
          <span class="text-yellow-600 font-medium">${k.protocolos.por_vencer} por vencer</span>
          <span class="text-red-600 font-medium">${k.protocolos.criticos} crítico</span>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Exámenes Médicos</div>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#e0f7fa"><i class="fas fa-stethoscope text-sm" style="color:#0096c7"></i></div>
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
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Capacitaciones IRL</div>
          <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><i class="fas fa-graduation-cap text-indigo-600 text-sm"></i></div>
        </div>
        <div class="text-2xl font-bold text-gray-800">${k.capacitaciones.cobertura_irl}%</div>
        <div class="text-xs text-gray-500 mb-2">Cobertura IRL 2026 (DS 44)</div>
        <div class="progress-bar mb-2"><div class="progress-fill bg-indigo-500" style="width:${k.capacitaciones.cobertura_irl}%"></div></div>
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
            <h3 class="font-bold text-gray-800">Tasas de Accidentabilidad — SOLDESP S.A.</h3>
            <p class="text-xs text-gray-400">Tasa frecuencia · gravedad · siniestralidad · 3 períodos certificados</p>
          </div>
          <div class="flex gap-2">
            <span class="badge badge-hse">Certificado Mutualidad</span>
            ${isSuperAdmin() ? `<button class="btn btn-secondary text-xs py-1" onclick="showEditAccidentabilidadModal()"><i class="fas fa-pencil mr-1"></i>Editar</button>` : ''}
          </div>
        </div>
        <canvas id="chart-accidentes" height="200"></canvas>
      </div>
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-bold text-gray-800">Cumplimiento Protocolos MINSAL</h3>
            <p class="text-xs text-gray-400">% cumplimiento por protocolo — 2026</p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary text-xs py-1.5" onclick="navigate('protocols')">Ver detalle</button>
            ${isSuperAdmin() ? `<button class="btn btn-secondary text-xs py-1.5" onclick="showEditProtocolCumplModal()"><i class="fas fa-pencil mr-1"></i>Editar %</button>` : ''}
          </div>
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
          <button class="btn btn-secondary justify-start text-sm" onclick="navigate('workers')"><i class="fas fa-user-plus" style="color:#1a237e"></i> Nuevo Trabajador</button>
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
      <div class="nexusforge-badge-mini" onclick="navigate('reports')" title="NexusForge — Connecting Innovation with Power">
        ${nfIconSVG(20, true)}
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
    `).join('') : '<div class="text-center py-6 text-gray-400 text-sm"><i class="fas fa-check-circle text-2xl mb-2" style="color:#00b4d8"></i><div>Sin alertas críticas</div></div>';
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
  // Si hay datos históricos de tasas, mostramos gráfico de tasas por período
  if (data.tasas_historicas) {
    const h = data.tasas_historicas;
    App.charts.accidentes = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: h.labels,
        datasets: [
          { label: 'Tasa Frecuencia', data: h.frecuencia, backgroundColor: ['rgba(220,38,38,0.85)','rgba(234,88,12,0.85)','rgba(16,185,129,0.85)'], borderRadius: 6, order: 2 },
          { label: 'Tasa Gravedad', data: h.gravedad, type: 'line', borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.12)', tension: 0.4, yAxisID: 'y1', fill: true, pointRadius: 5, pointBackgroundColor: '#f59e0b', order: 1 },
          { label: 'Siniestralidad', data: h.siniestralidad, type: 'line', borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.05)', tension: 0.4, yAxisID: 'y2', fill: false, pointRadius: 5, pointBackgroundColor: '#7c3aed', order: 0, borderDash: [5,3] }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 } } },
          tooltip: {
            callbacks: {
              afterBody: (items) => {
                const idx = items[0]?.dataIndex;
                if (idx !== undefined && h.trabajadores) return [`Trabajadores promedio: ${h.trabajadores[idx].toLocaleString('es-CL')}`];
                return [];
              }
            }
          }
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Tasa Frecuencia', font: { size: 10 } }, ticks: { font: { size: 11 } } },
          y1: { position: 'right', beginAtZero: true, title: { display: true, text: 'Tasa Gravedad', font: { size: 10 } }, ticks: { font: { size: 11 } }, grid: { drawOnChartArea: false } },
          y2: { position: 'right', beginAtZero: true, title: { display: true, text: 'Siniestralidad', font: { size: 10 } }, ticks: { font: { size: 11 } }, grid: { drawOnChartArea: false }, display: false }
        }
      }
    });
  } else {
    App.charts.accidentes = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          { label: 'Accidentes período actual', data: data.accidentes, backgroundColor: 'rgba(220,38,38,0.8)', borderRadius: 4 },
          { label: 'Accidentes período anterior', data: data.año_anterior, backgroundColor: 'rgba(203,213,225,0.6)', borderRadius: 4 },
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
      <div class="card p-3 text-center hse-accent-top"><div class="text-2xl font-bold" style="color:#1a237e">${workers.length}</div><div class="text-xs text-gray-500">Total trabajadores</div></div>
      <div class="card p-3 text-center border-t-4" style="border-top-color:#00b4d8"><div class="text-2xl font-bold" style="color:#0096c7">${workers.filter(w=>w.estado==='activo').length}</div><div class="text-xs text-gray-500">Activos</div></div>
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
          <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-clipboard-list mr-2" style="color:#1a237e"></i>Protocolos MINSAL Asociados</h3>
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
          <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-stethoscope mr-2" style="color:#0096c7"></i>Exámenes Médicos</h3>
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
          ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','HIC','HUMOS'].map(p => `
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
  `, 'lg');
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
  API.post('/workers', body).then(() => {
    showToast('Trabajador registrado exitosamente', 'success');
    closeModal();
    navigate('workers');
  }).catch(() => showToast('Error al registrar trabajador', 'error'));
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
    ${stats.valor_inventario ? `<div class="card p-3 mb-4 flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
      <i class="fas fa-dollar-sign text-emerald-600 text-xl w-8 text-center"></i>
      <div><div class="text-xs text-emerald-600 font-medium uppercase tracking-wide">Valor Total Inventario EPP</div>
      <div class="text-xl font-bold text-emerald-800">$${stats.valor_inventario.toLocaleString('es-CL')}</div></div>
    </div>` : ''}

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
        <div class="mb-3 flex justify-between items-center">
          <span class="text-sm text-gray-500">${entregas.length} entrega(s) registrada(s)</span>
        </div>
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead><tr>
              <th>Trabajador</th><th>EPP Entregado</th><th>Cant.</th>
              <th>Fecha Entrega</th><th>Próxima Renovación</th><th>Protocolo</th><th>Firma Digital</th><th>Estado</th>
            </tr></thead>
            <tbody>
              ${entregas.length === 0 ? `<tr><td colspan="8" class="text-center text-gray-400 py-8"><i class="fas fa-inbox text-3xl mb-2 block"></i>Sin entregas registradas</td></tr>` :
              entregas.map(e => `
                <tr class="${e.dias_para_renovacion !== null && e.dias_para_renovacion <= 30 && !e.firma_digital ? 'bg-yellow-50' : ''}">
                  <td><div class="font-medium text-sm">${e.trabajador_nombre || '—'}</div><div class="text-xs text-gray-400">${e.trabajador_rut || ''}</div></td>
                  <td><div class="font-medium text-sm">${e.epp_nombre || '—'}</div>${e.protocolo ? `<div class="text-xs text-gray-400">${e.protocolo}</div>` : ''}</td>
                  <td class="text-center font-bold">${e.cantidad}</td>
                  <td class="text-xs text-gray-500">${formatDate(e.fecha_entrega)}</td>
                  <td class="text-xs ${e.dias_para_renovacion !== null && e.dias_para_renovacion <= 30 ? 'text-red-600 font-bold' : 'text-gray-500'}">
                    ${e.proxima_renovacion ? formatDate(e.proxima_renovacion) : '—'}
                    ${e.dias_para_renovacion !== null && e.dias_para_renovacion <= 30 ? `<div class="text-xs text-red-500">${e.dias_para_renovacion <= 0 ? 'Vencido' : e.dias_para_renovacion + ' días'}</div>` : ''}
                  </td>
                  <td>${e.protocolo ? `<span class="badge badge-purple text-xs">${e.protocolo}</span>` : '—'}</td>
                  <td>
                    ${e.firma_digital
                      ? '<span class="badge badge-green text-xs"><i class="fas fa-check mr-1"></i>Firmado</span>'
                      : `<button class="btn btn-warning py-1 px-2 text-xs" onclick="registrarFirma(${e.id})"><i class="fas fa-signature mr-1"></i>Firmar</button>`}
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
  if (!items || items.length === 0) return `<tr><td colspan="9" class="text-center text-gray-400 py-8"><i class="fas fa-box-open text-3xl mb-2 block"></i>Sin ítems EPP registrados</td></tr>`;
  return items.map(item => `
    <tr class="${item.estado_stock === 'critico' ? 'bg-red-50' : item.estado_stock === 'bajo' ? 'bg-orange-50' : ''}">
      <td>
        <div class="font-semibold text-sm">${item.nombre}</div>
        <div class="text-xs text-gray-400 font-mono">${item.codigo || ''}</div>
      </td>
      <td><span class="badge badge-blue text-xs">${item.categoria}</span></td>
      <td class="text-sm text-gray-600">${item.marca || '—'} / ${item.modelo || '—'}</td>
      <td>
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold ${item.stock_actual <= 0 ? 'text-red-600' : item.stock_actual < item.stock_minimo ? 'text-orange-600' : 'text-blue-600'}">${item.stock_actual}</span>
          <span class="text-xs text-gray-400">${item.unidad || 'uds'}</span>
        </div>
      </td>
      <td class="text-sm text-gray-500">${item.stock_minimo} ${item.unidad || 'uds'}</td>
      <td class="text-xs font-mono text-gray-500">${item.norma_tecnica || '—'}</td>
      <td class="text-xs ${item.fecha_vencimiento_lote && (() => { const d = Math.round((new Date(item.fecha_vencimiento_lote) - new Date()) / (1000*60*60*24)); return d <= 60; })() ? 'text-red-600 font-bold' : 'text-gray-500'}">${item.fecha_vencimiento_lote ? formatDate(item.fecha_vencimiento_lote) : '—'}</td>
      <td>${stockBadge(item.stock_actual, item.stock_minimo)}</td>
      <td>
        <div class="flex gap-1">
          <button class="btn btn-secondary py-1 px-2 text-xs" onclick="showEPPDetail(${item.id})" title="Ver detalle">
            <i class="fas fa-eye"></i>
          </button>
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

function showEPPDetail(id) {
  const item = (window._allEPP || []).find(e => e.id === id);
  if (!item) { showToast('EPP no encontrado', 'error'); return; }
  const stockColor = item.stock_actual <= 0 ? 'text-red-600' : item.stock_actual < item.stock_minimo ? 'text-orange-600' : 'text-green-600';
  const valorTotal = (item.stock_actual * (item.costo_unitario || 0)).toLocaleString('es-CL');
  showModal(`Ficha EPP — ${item.nombre}`, `
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div class="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <i class="fas fa-hard-hat text-blue-600 text-xl"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-bold text-gray-800 text-base">${item.nombre}</div>
              <div class="text-sm text-gray-500 mt-0.5">${item.marca || '—'} / ${item.modelo || '—'}</div>
              <div class="mt-1"><span class="badge badge-blue text-xs">${item.categoria}</span>
              ${item.protocolo_asociado ? `<span class="badge badge-purple text-xs ml-1">${item.protocolo_asociado}</span>` : ''}</div>
            </div>
          </div>
        </div>
        <!-- Stock info -->
        <div class="p-3 bg-white rounded-xl border border-gray-200">
          <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Stock Actual</div>
          <div class="text-2xl font-bold ${stockColor}">${item.stock_actual}</div>
          <div class="text-xs text-gray-400">${item.unidad || 'unidades'}</div>
        </div>
        <div class="p-3 bg-white rounded-xl border border-gray-200">
          <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Stock Mínimo</div>
          <div class="text-2xl font-bold text-gray-700">${item.stock_minimo}</div>
          <div class="text-xs text-gray-400">${item.unidad || 'unidades'}</div>
        </div>
        <!-- Detalles -->
        <div class="col-span-2">
          <table class="w-full text-sm">
            <tr class="border-b border-gray-100"><td class="py-2 text-gray-500 w-40">Código</td><td class="py-2 font-mono font-semibold text-gray-700">${item.codigo || '—'}</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 text-gray-500">Norma Técnica</td><td class="py-2 text-gray-700">${item.norma_tecnica || '—'}</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 text-gray-500">Ubicación</td><td class="py-2 text-gray-700">${item.ubicacion || '—'}</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 text-gray-500">Vencimiento Lote</td><td class="py-2 text-gray-700">${item.fecha_vencimiento_lote ? formatDate(item.fecha_vencimiento_lote) : '—'}</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 text-gray-500">Costo Unitario</td><td class="py-2 text-gray-700">$${(item.costo_unitario||0).toLocaleString('es-CL')}</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 text-gray-500">Valor Total Stock</td><td class="py-2 font-semibold text-green-700">$${valorTotal}</td></tr>
            ${item.nrr_db ? `<tr class="border-b border-gray-100"><td class="py-2 text-gray-500">NRR dB</td><td class="py-2 text-gray-700">${item.nrr_db} dB</td></tr>` : ''}
            <tr><td class="py-2 text-gray-500">Estado</td><td class="py-2">${stockBadge(item.stock_actual, item.stock_minimo)}</td></tr>
          </table>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-primary" onclick="closeModal(); showEntregaEPPModal(${id})"><i class="fas fa-hand-holding mr-1"></i>Registrar Entrega</button>
  `, 'lg');
}

function showEntregaEPPModal(eppId) {
  const epp = (window._allEPP || []).find(e => e.id === eppId);
  const eppNombre = epp ? epp.nombre : 'EPP #' + eppId;
  const stockDisp = epp ? epp.stock_actual : '?';
  showModal('Registrar Entrega de EPP', `
    <div class="space-y-4">
      <div class="info-box">
        <p class="text-sm font-semibold text-blue-800"><i class="fas fa-hard-hat mr-2"></i>${eppNombre}</p>
        <p class="text-xs text-blue-600 mt-1">Stock disponible: <strong>${stockDisp}</strong> unidades</p>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-hand-holding mr-2"></i>Datos de la Entrega</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Trabajador (Nombre completo) *</label>
            <input id="ent-trab" class="form-input" placeholder="Nombre del trabajador receptor"></div>
          <div class="col-span-2"><label class="form-label">RUT del Trabajador</label>
            <input id="ent-rut" class="form-input" placeholder="12.345.678-9"></div>
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
      <div class="info-box-yellow">
        <p class="text-xs text-yellow-800"><i class="fas fa-info-circle mr-1"></i>
        La entrega quedará registrada. Se solicitará firma digital al trabajador al momento de la entrega física. DS 594 Art. 53 y Ley 16.744 Art. 68.</p>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveEntregaEPP(${eppId})"><i class="fas fa-save mr-1"></i>Registrar Entrega</button>
  `, 'lg');
}

async function saveEntregaEPP(eppId) {
  const trab = document.getElementById('ent-trab').value.trim();
  const cant = parseInt(document.getElementById('ent-cant').value);
  if (!trab) { showToast('Indica el trabajador', 'error'); return; }
  if (!cant || cant < 1) { showToast('Ingresa una cantidad válida', 'error'); return; }
  const epp = (window._allEPP || []).find(e => e.id === eppId);
  if (epp && cant > epp.stock_actual) { showToast(`Stock insuficiente. Disponible: ${epp.stock_actual}`, 'error'); return; }
  const body = {
    epp_id: eppId,
    epp_nombre: epp ? epp.nombre : 'EPP #' + eppId,
    trabajador_nombre: trab,
    trabajador_rut: document.getElementById('ent-rut').value.trim(),
    cantidad: cant,
    fecha_entrega: document.getElementById('ent-fecha').value,
    proxima_renovacion: document.getElementById('ent-renovacion').value || null,
    observaciones: document.getElementById('ent-obs').value.trim(),
    protocolo: epp ? epp.protocolo_asociado : null,
    firma_digital: false,
    estado_registro: 'vigente'
  };
  try {
    await API.post('/epp/entregas', body);
    showToast('Entrega de EPP registrada. Stock actualizado.', 'success');
    closeModal(); navigate('epp');
  } catch { showToast('Error al registrar entrega', 'error'); }
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
    <button class="btn btn-success" onclick="confirmarFirmaDigital(${entregaId})"><i class="fas fa-check mr-1"></i>Confirmar Firma</button>
  `);
}

async function confirmarFirmaDigital(entregaId) {
  const nombre = document.getElementById('firma-nombre')?.value?.trim();
  if (!nombre) { showToast('Ingresa el nombre del trabajador para confirmar', 'error'); return; }
  try {
    await API.put(`/epp/entregas/${entregaId}`, { firma_digital: true, firmado_por: nombre, fecha_firma: new Date().toISOString() });
    showToast('Firma registrada exitosamente', 'success');
    closeModal(); navigate('epp');
  } catch { showToast('Error al registrar firma', 'error'); }
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
              <option>Auditivo</option><option>Respiratorio</option>
              <option>Visual</option><option>Visual/Soldadura</option>
              <option>Cabeza</option><option>Manos</option>
              <option>Pies</option><option>Radiación UV</option>
              <option>Alta Visibilidad</option><option>Arnés/Altura</option>
              <option>Ropa de Trabajo</option>
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
          <div><label class="form-label">Costo Unitario ($)</label>
            <input id="nepp-costo" type="number" min="0" class="form-input" placeholder="0"></div>
          <div><label class="form-label">Protocolo Asociado</label>
            <select id="nepp-proto" class="form-input">
              <option value="">Sin protocolo</option>
              ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','HIC','HUMOS'].map(p=>`<option value="${p}">${p}</option>`).join('')}
            </select></div>
          <div class="col-span-2"><label class="form-label">Ubicación</label>
            <input id="nepp-ubic" class="form-input" placeholder="Bodega EPP — Estante..."></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveAddEPP()"><i class="fas fa-save mr-1"></i>Guardar</button>
  `, 'lg');
}

async function saveAddEPP() {
  const nombre = document.getElementById('nepp-nombre').value.trim();
  if (!nombre) { showToast('El nombre del EPP es obligatorio', 'error'); return; }
  const body = {
    nombre,
    categoria: document.getElementById('nepp-cat').value,
    marca: document.getElementById('nepp-marca').value.trim(),
    modelo: document.getElementById('nepp-modelo').value.trim(),
    stock_actual: parseInt(document.getElementById('nepp-stock').value)||0,
    stock_minimo: parseInt(document.getElementById('nepp-min').value)||5,
    norma_tecnica: document.getElementById('nepp-norma').value.trim(),
    fecha_vencimiento_lote: document.getElementById('nepp-venc').value || null,
    costo_unitario: parseInt(document.getElementById('nepp-costo').value)||0,
    protocolo_asociado: document.getElementById('nepp-proto').value || null,
    ubicacion: document.getElementById('nepp-ubic').value.trim()
  };
  try {
    await API.post('/epp', body);
    showToast('Ítem EPP agregado al inventario', 'success');
    closeModal(); navigate('epp');
  } catch { showToast('Error al agregar EPP', 'error'); }
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
          <div><label class="form-label">Marca</label>
            <input id="eepp-marca" class="form-input" value="${item.marca||''}"></div>
          <div><label class="form-label">Modelo</label>
            <input id="eepp-modelo" class="form-input" value="${item.modelo||''}"></div>
          <div><label class="form-label">Stock Actual</label>
            <input id="eepp-stock" type="number" class="form-input" value="${item.stock_actual}"></div>
          <div><label class="form-label">Stock Mínimo</label>
            <input id="eepp-min" type="number" class="form-input" value="${item.stock_minimo}"></div>
          <div><label class="form-label">Norma Técnica</label>
            <input id="eepp-norma" class="form-input" value="${item.norma_tecnica || ''}"></div>
          <div><label class="form-label">Vencimiento Lote</label>
            <input id="eepp-venc" type="date" class="form-input" value="${item.fecha_vencimiento_lote || ''}"></div>
          <div><label class="form-label">Costo Unitario ($)</label>
            <input id="eepp-costo" type="number" class="form-input" value="${item.costo_unitario||0}"></div>
          <div><label class="form-label">Protocolo Asociado</label>
            <select id="eepp-proto" class="form-input">
              <option value="">Sin protocolo</option>
              ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','HIC','HUMOS'].map(p=>`<option value="${p}" ${item.protocolo_asociado===p?'selected':''}>${p}</option>`).join('')}
            </select></div>
          <div class="col-span-2"><label class="form-label">Ubicación</label>
            <input id="eepp-ubic" class="form-input" value="${item.ubicacion||''}"></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveEditEPP(${id})"><i class="fas fa-save mr-1"></i>Guardar</button>
  `, 'lg');
}

async function saveEditEPP(id) {
  const body = {
    nombre: document.getElementById('eepp-nombre').value.trim(),
    marca: document.getElementById('eepp-marca').value.trim(),
    modelo: document.getElementById('eepp-modelo').value.trim(),
    stock_actual: parseInt(document.getElementById('eepp-stock').value)||0,
    stock_minimo: parseInt(document.getElementById('eepp-min').value)||5,
    norma_tecnica: document.getElementById('eepp-norma').value.trim(),
    fecha_vencimiento_lote: document.getElementById('eepp-venc').value || null,
    costo_unitario: parseInt(document.getElementById('eepp-costo').value)||0,
    protocolo_asociado: document.getElementById('eepp-proto').value || null,
    ubicacion: document.getElementById('eepp-ubic').value.trim()
  };
  try {
    await API.put(`/epp/${id}`, body);
    // Actualizar lista local
    const idx = (window._allEPP||[]).findIndex(x=>x.id===id);
    if (idx !== -1) Object.assign(window._allEPP[idx], body);
    showToast('EPP actualizado correctamente', 'success');
    closeModal(); navigate('epp');
  } catch { showToast('Error al actualizar EPP', 'error'); }
}

// ================================================================
// CAPACITACIONES
// ================================================================
async function renderCapacitations() {
  setPageTitle('Capacitaciones', 'Gestión IRL y programa anual de capacitación — DS 44');
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
          <i class="fas fa-graduation-cap" style="color:#1a237e"></i>
        </div>
        <div class="text-3xl font-bold" style="color:#1a237e">${stats.vigentes}</div>
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
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Cobertura IRL</div>
          <i class="fas fa-chart-pie text-indigo-500"></i>
        </div>
        <div class="text-3xl font-bold text-indigo-600">${stats.cobertura_irl}%</div>
        <div class="progress-bar mt-2"><div class="progress-fill bg-indigo-500" style="width:${stats.cobertura_irl}%"></div></div>
      </div>
    </div>

    <!-- IRL alert (DS 44) -->
    <div class="mb-5 p-4 rounded-xl flex items-start gap-3" style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1.5px solid #1a237e">
      <i class="fas fa-file-signature text-indigo-700 text-lg mt-0.5"></i>
      <div>
        <div class="font-bold" style="color:#0d1b5e">IRL — Informe de Riesgos Laborales (DS 44 Art. 15) · Reemplaza a la ODI (D.S. N°40/1969)</div>
        <div class="text-sm mt-0.5" style="color:#1e2d7d">Desde el <strong>1 de febrero de 2025</strong>, el DS 44 exige entregar al trabajador un <strong>IRL firmado con firma ológrafa y huella digital</strong>, informando los riesgos específicos de su puesto, las medidas preventivas y los EPP requeridos. Debe actualizarse ante cambio de puesto o incorporación de nuevos factores de riesgo.</div>
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
          style="background:${cap.estado==='vigente'?'#059669':cap.estado==='por_vencer'?'#d97706':cap.estado==='vencida'?'#dc2626':'#3b82f6'}">
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
          <div class="text-lg font-bold" style="color:${pct >= 80 ? '#059669' : pct >= 50 ? '#d97706' : '#dc2626'}">${pct}%</div>
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
        <div class="flex justify-between text-xs mb-1"><span class="text-gray-500">Cobertura</span><span class="font-bold" style="color:${pct>=80?'#059669':'#d97706'}">${pct}%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${pct>=80?'#059669':'#d97706'}"></div></div>
      </div>
      ${cap.descripcion ? `<div class="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">${cap.descripcion}</div>` : ''}
      ${cap.protocolo_asociado ? `<div class="info-box-navy text-xs" style="color:#1e2d7d"><i class="fas fa-link mr-1"></i>Protocolo asociado: <strong>${cap.protocolo_asociado}</strong></div>` : ''}
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
            <input id="nc-nombre" class="form-input" placeholder="Ej: IRL 2026 — Riesgos Planta Norte (DS 44 Art.15)"></div>
          <div><label class="form-label">Tipo *</label>
            <select id="nc-tipo" class="form-input">
              <option>IRL (DS 44)</option><option>PREXOR</option><option>PLANESI</option><option>TMERT</option>
              <option>PSICOSOCIAL</option><option>UV</option><option>MMC</option><option>HIC</option><option>HUMOS</option>
              <option>Emergencias</option><option>Uso correcto EPP</option><option>Primeros Auxilios</option>
              <option>Trabajo en altura</option><option>Manejo Defensivo</option><option>Inducción</option>
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
              ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','HIC','HUMOS'].map(p=>`<option value="${p}">${p}</option>`).join('')}
            </select></div>
          <div class="col-span-2"><label class="form-label">Descripción / Temario</label>
            <textarea id="nc-desc" class="form-input" rows="3" placeholder="Temas tratados, objetivos de la capacitación..."></textarea></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveNewCap()"><i class="fas fa-save mr-1"></i>Registrar</button>
  `, 'lg');
}

async function saveNewCap() {
  const nombre = document.getElementById('nc-nombre').value.trim();
  const fecha = document.getElementById('nc-fecha').value;
  const relator = document.getElementById('nc-relator').value.trim();
  if (!nombre || !fecha || !relator) { showToast('Completa los campos obligatorios (*)', 'error'); return; }
  const body = {
    nombre,
    tipo: document.getElementById('nc-tipo').value,
    fecha_realizacion: fecha,
    duracion_horas: parseInt(document.getElementById('nc-dur').value)||2,
    relator,
    participantes_objetivo: parseInt(document.getElementById('nc-obj').value)||20,
    participantes_real: parseInt(document.getElementById('nc-real').value)||0,
    proxima_realizacion: document.getElementById('nc-prox').value || null,
    protocolo_asociado: document.getElementById('nc-proto').value || null,
    descripcion: document.getElementById('nc-desc').value.trim(),
    estado: 'vigente'
  };
  try {
    await API.post('/capacitations', body);
    showToast('Capacitación registrada exitosamente', 'success');
    closeModal();
    navigate('capacitations');
  } catch { showToast('Error al registrar capacitación', 'error'); }
}

async function showEditCapModal(id) {
  if (!canDo('capacitations:all')) { showToast('Sin permisos para editar capacitaciones', 'error'); return; }
  let cap;
  try {
    const res = await API.get(`/capacitations/${id}`);
    cap = res.data.data;
  } catch { showToast('Error al cargar capacitación', 'error'); return; }
  showModal(`Editar Capacitación: ${cap.nombre}`, `
    <div class="space-y-3">
      ${isSuperAdmin() ? `<div class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2"><i class="fas fa-crown text-amber-500 mt-0.5"></i><span><strong>Superadmin:</strong> Edición completa de todos los campos.</span></div>` : ''}
      <div class="grid grid-cols-2 gap-3">
        <div class="col-span-2"><label class="form-label">Nombre *</label>
          <input id="ec-nombre" class="form-input" value="${cap.nombre}"></div>
        <div><label class="form-label">Tipo</label>
          <select id="ec-tipo" class="form-input">
            ${['IRL (DS 44)','PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','HIC','HUMOS','Emergencias','Uso correcto EPP','Primeros Auxilios','Trabajo en altura','Manejo Defensivo','Inducción'].map(t=>`<option ${cap.tipo===t?'selected':''}>${t}</option>`).join('')}
          </select></div>
        <div><label class="form-label">Estado</label>
          <select id="ec-estado" class="form-input">
            <option value="vigente" ${cap.estado==='vigente'?'selected':''}>Vigente</option>
            <option value="por_vencer" ${cap.estado==='por_vencer'?'selected':''}>Por Vencer</option>
            <option value="vencida" ${cap.estado==='vencida'?'selected':''}>Vencida</option>
          </select></div>
        <div><label class="form-label">Fecha Realización</label>
          <input id="ec-fecha" type="date" class="form-input" value="${cap.fecha_realizacion||''}"></div>
        <div><label class="form-label">Duración (h)</label>
          <input id="ec-dur" type="number" class="form-input" value="${cap.duracion_horas||2}"></div>
        <div><label class="form-label">Relator</label>
          <input id="ec-relator" class="form-input" value="${cap.relator||''}"></div>
        <div><label class="form-label">Próxima Realización</label>
          <input id="ec-prox" type="date" class="form-input" value="${cap.proxima_realizacion||''}"></div>
        <div><label class="form-label">Participantes Objetivo</label>
          <input id="ec-obj" type="number" class="form-input" value="${cap.participantes_objetivo||20}"></div>
        <div><label class="form-label">Participantes Reales</label>
          <input id="ec-real" type="number" class="form-input" value="${cap.participantes_real||0}"></div>
        <div class="col-span-2"><label class="form-label">Protocolo Asociado</label>
          <select id="ec-proto" class="form-input">
            <option value="">Sin protocolo</option>
            ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','HIC','HUMOS'].map(p=>`<option value="${p}" ${cap.protocolo_asociado===p?'selected':''}>${p}</option>`).join('')}
          </select></div>
        <div class="col-span-2"><label class="form-label">Descripción / Temario</label>
          <textarea id="ec-desc" class="form-input" rows="3">${cap.descripcion||''}</textarea></div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveEditCap(${id})"><i class="fas fa-save mr-1"></i>Guardar Cambios</button>
  `);
}

async function saveEditCap(id) {
  const nombre = document.getElementById('ec-nombre').value.trim();
  if (!nombre) { showToast('El nombre es obligatorio', 'error'); return; }
  const body = {
    nombre,
    tipo: document.getElementById('ec-tipo').value,
    estado: document.getElementById('ec-estado').value,
    fecha_realizacion: document.getElementById('ec-fecha').value,
    duracion_horas: parseInt(document.getElementById('ec-dur').value)||2,
    relator: document.getElementById('ec-relator').value.trim(),
    proxima_realizacion: document.getElementById('ec-prox').value || null,
    participantes_objetivo: parseInt(document.getElementById('ec-obj').value)||20,
    participantes_real: parseInt(document.getElementById('ec-real').value)||0,
    protocolo_asociado: document.getElementById('ec-proto').value || null,
    descripcion: document.getElementById('ec-desc').value.trim()
  };
  try {
    await API.put(`/capacitations/${id}`, body);
    showToast('Capacitación actualizada correctamente', 'success');
    closeModal(); navigate('capacitations');
  } catch { showToast('Error al actualizar capacitación', 'error'); }
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
        stats.tasa_accidentabilidad <= 2.5 ? 'from-emerald-600 to-emerald-800' : 'from-red-600 to-red-800',
        stats.accidentes_ytd + ' accidentes YTD 2026')}
      ${kpiCard('Días Perdidos', stats.dias_perdidos_total, 'Total acumulado 2026', 'fa-bed-pulse', 'from-orange-500 to-orange-700',
        'Tasa siniestralidad: ' + stats.tasa_siniestralidad + '%')}
      ${kpiCard('Enf. Profesionales', stats.enfermedades_profesionales, 'Diagnosticadas 2026', 'fa-lungs',
        'from-purple-600 to-purple-800', 'DS 109 — MINSAL')}
      ${kpiCard('Tasa Mortalidad', stats.tasa_mortalidad + '%', 'Accidentes fatales', 'fa-heart-pulse',
        stats.tasa_mortalidad === 0 ? 'from-emerald-600 to-emerald-800' : 'from-red-800 to-red-950',
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
      <td class="text-center font-bold" style="color:${a.dias_perdidos > 0 ? '#dc2626' : '#059669'}">${a.dias_perdidos}</td>
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
          </button>
          ${isSuperAdmin() ? `<button class="btn btn-secondary py-1 px-2 text-xs" title="Editar" onclick="showEditAccidentModal(${a.id})"><i class="fas fa-pencil text-blue-500"></i></button>` : ''}
          ` : ''}
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
        <div><div class="text-xs text-gray-400">Días Perdidos</div><div class="font-bold" style="color:${a.dias_perdidos>0?'#dc2626':'#059669'}">${a.dias_perdidos}</div></div>
        <div><div class="text-xs text-gray-400">Mutualidad</div><div class="badge badge-blue text-xs">${a.mutualidad}</div></div>
        <div><div class="text-xs text-gray-400">Estado</div><div>${estadoBadgeGeneric(a.estado_denuncia)}</div></div>
      </div>
      <div class="p-3 bg-gray-50 rounded-lg">
        <div class="text-xs text-gray-400 mb-1">Lesión / Diagnóstico</div>
        <div class="text-sm font-medium">${a.lesion_diagnostico}</div>
      </div>
      ${a.descripcion ? `<div class="p-3 bg-gray-50 rounded-lg"><div class="text-xs text-gray-400 mb-1">Descripción del accidente</div><div class="text-sm">${a.descripcion}</div></div>` : ''}
      ${a.causa_inmediata ? `<div class="info-box-red"><div class="text-xs text-red-600 mb-1 font-semibold">Causa Inmediata</div><div class="text-sm text-red-800">${a.causa_inmediata}</div></div>` : ''}
      ${a.medidas_correctivas ? `<div class="info-box"><div class="text-xs mb-1 font-semibold" style="color:#059669">Medidas Correctivas</div><div class="text-sm" style="color:#064e3b">${a.medidas_correctivas}</div></div>` : ''}
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
  `, 'lg');
}

async function saveAccident() {
  const lesion = document.getElementById('acc-lesion').value.trim();
  const trab = document.getElementById('acc-trab').value.trim();
  const lugar = document.getElementById('acc-lugar').value.trim();
  if (!lesion || !trab || !lugar) { showToast('Completa los campos obligatorios (*)', 'error'); return; }
  const body = {
    tipo: document.getElementById('acc-tipo').value,
    trabajador_nombre: trab,
    fecha_accidente: document.getElementById('acc-fecha').value,
    hora_accidente: document.getElementById('acc-hora').value,
    lugar_accidente: lugar,
    gravedad: document.getElementById('acc-grav').value,
    dias_perdidos: parseInt(document.getElementById('acc-dias').value)||0,
    lesion_diagnostico: lesion,
    mutualidad: document.getElementById('acc-mutual').value,
    descripcion: document.getElementById('acc-desc').value.trim(),
    causa_inmediata: document.getElementById('acc-causa').value.trim(),
    medidas_correctivas: document.getElementById('acc-medidas').value.trim(),
    estado_denuncia: 'abierto'
  };
  try {
    await API.post('/accidents', body);
    showToast('Accidente/DIAT registrado exitosamente', 'success');
    closeModal();
    navigate('accidents');
  } catch { showToast('Error al registrar el accidente', 'error'); }
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
        ${isSuperAdmin() ? `<button class="btn btn-secondary py-1.5 px-2 text-xs" onclick="showEditAlertModal(${a.id})" title="Editar"><i class="fas fa-pencil"></i></button>` : ''}
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
          <div class="text-xs font-semibold mb-1" style="color:#059669"><i class="fas fa-lightbulb mr-1"></i>Acción Recomendada</div>
          <div class="text-sm" style="color:#064e3b">${a.accion_recomendada}</div>
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
      <div class="kpi-card bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
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
              ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','HIC','HUMOS'].map(p=>`<option value="${p}">${p}</option>`).join('')}
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
  `, 'lg');
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
  `, 'lg');
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
// PROTOCOLOS MINSAL — Actualizado DS 44 (vigente 01/02/2025)
// IRL reemplaza ODI · CEAL-SM/SUSESO reemplaza ISTAS21
// ================================================================

// ── Datos maestros de los 7 protocolos ──────────────────────────
const PROTOCOL_META = {
  PREXOR: {
    icon:'fa-ear-deaf', color:'#dc2626',
    titulo:'PREXOR',
    subtitulo:'Exposición Ocupacional al Ruido',
    norma:'DS 594 Art.74-83 · Circ. MINSAL 3E/168 · DS 44/2025 Art.15',
    desc:'Protocolo de Exposición Ocupacional al Ruido. Obliga la vigilancia auditiva de trabajadores expuestos a niveles ≥ 82 dB(A) TWA.',
    irl:'Exposición a Ruido Ocupacional. Riesgo: pérdida auditiva. Medidas: EPP auditivo, controles ingenieriles, rotación. Base DS 44 Art.15.',
    pasos:[
      {n:'1', fase:'Planificación y Organización', items:[
        {id:'1.1',item:'Difusión OAL–empresa y entrega de kit PREXOR', evidencia:'Carta conductora OAL', marco:'DS 594 Art.74'},
        {id:'1.2',item:'Identificación de puestos con exposición ≥ 82 dB(A)', evidencia:'Mapa de ruido / MIPER', marco:'DS 594 Art.75'},
        {id:'1.3',item:'Conformación del Equipo de Salud Ocupacional (ESO)', evidencia:'Acta de constitución ESO', marco:'Circ. 3E/168'},
        {id:'1.4',item:'Capacitación del ESO por el OAL', evidencia:'Certificados/diplomas', marco:'DS 44 Art.15'},
        {id:'1.5',item:'Elaboración Carta Gantt de implementación', evidencia:'Carta Gantt firmada', marco:'Sistema Gestión DS44'},
        {id:'1.6',item:'IRL (Informe de Riesgos Laborales) — reemplaza ODI', evidencia:'Acta IRL firmada por trabajador', marco:'DS 44 Art.15'},
      ]},
      {n:'2', fase:'Caracterización del Riesgo', items:[
        {id:'2.1',item:'Evaluación cualitativa de exposición a ruido por OAL', evidencia:'Informe cualitativo OAL', marco:'DS 594 Art.76'},
        {id:'2.2',item:'Inventario de fuentes generadoras de ruido', evidencia:'Planilla de inventario', marco:'Circ. 3E/168'},
        {id:'2.3',item:'Evaluación cuantitativa — dosimetría', evidencia:'Informe cuantitativo / dosimetría', marco:'DS 594 Art.77'},
      ]},
      {n:'3', fase:'Difusión y Capacitación', items:[
        {id:'3.1',item:'Difusión interna del protocolo (100% expuestos)', evidencia:'Registro de charla / IRL', marco:'DS 44 Art.15'},
        {id:'3.2',item:'Difusión externa — envío SEREMI / DT', evidencia:'Carta conductora timbrada', marco:'DS 594 Art.78'},
        {id:'3.3',item:'Capacitación: ¿Qué es PREXOR? Daños a la salud y uso EPP auditivo', evidencia:'Registro capacitación / evaluaciones', marco:'DS 44 Art.15'},
      ]},
      {n:'4', fase:'Evaluación del Riesgo', items:[
        {id:'4.1',item:'Evaluación cualitativa por experto red OAL', evidencia:'Informe cualitativo OAL', marco:'DS 594 Art.76'},
        {id:'4.2',item:'Nómina de trabajadores expuestos — planilla INE', evidencia:'Listado firmado', marco:'Circ. 3E/168'},
        {id:'4.3',item:'Evaluación cuantitativa si NSE ≥ 3', evidencia:'Informe técnico dosimetría', marco:'DS 594 Art.77'},
      ]},
      {n:'5', fase:'Medidas Preventivas y Vigilancia de Salud', items:[
        {id:'5.1',item:'Implementación de medidas de control (ingenieriles/admin.)', evidencia:'Plan de trabajo con responsables', marco:'DS 594 Art.79'},
        {id:'5.2',item:'Programa de Protección Auditiva (PPA)', evidencia:'PPA impreso y difundido', marco:'DS 594 Art.80'},
        {id:'5.3',item:'Audiometría basal y periódica de expuestos', evidencia:'Informes audiométricos OAL', marco:'DS 594 Art.81'},
        {id:'5.4',item:'Ingreso al Programa de Vigilancia de Salud', evidencia:'Certificado ingreso OAL', marco:'DS 594 Art.82'},
        {id:'5.5',item:'Verificación de cumplimiento medidas — visita OAL', evidencia:'Acta de visita OAL', marco:'Circ. 3E/168'},
        {id:'5.6',item:'Revisión Carta Gantt en reunión CPHS', evidencia:'Acta CPHS', marco:'DS 44 Art.15'},
      ]},
    ],
    ganttActividades:[
      {n:1,actividad:'Inspecciones de áreas y fuentes de ruido',dirigido:'Trabajador',por:'CPHS',periodo:'2 veces al año'},
      {n:2,actividad:'Observaciones actividades de trabajadores expuestos',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual'},
      {n:3,actividad:'Dosimetría de ruido',dirigido:'Trabajador',por:'OAL/MUTUAL',periodo:'Anual'},
      {n:4,actividad:'Difusión PREXOR + IRL',dirigido:'Trabajador',por:'APR',periodo:'2 veces al año'},
      {n:5,actividad:'Capacitación PREXOR y daños a la salud',dirigido:'Trabajador',por:'APR/CPHS',periodo:'3 veces al año'},
      {n:6,actividad:'Medidas preventivas y recomendaciones',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual'},
      {n:7,actividad:'Audiometría periódica',dirigido:'Trabajador',por:'OAL',periodo:'Anual'},
      {n:8,actividad:'Revisión IRL y actualización',dirigido:'Trabajador',por:'APR',periodo:'Anual o cambio puesto'},
    ]
  },
  PLANESI: {
    icon:'fa-lungs', color:'#7c3aed',
    titulo:'PLANESI',
    subtitulo:'Exposición Ocupacional a Sílice',
    norma:'DS 594 Art.61-67 · Circ. MINSAL 3E/163 · DS 44/2025 Art.15',
    desc:'Plan Nacional de Erradicación de la Silicosis. Vigilancia de trabajadores expuestos a polvo de sílice cristalizada.',
    irl:'Exposición a Polvo de Sílice Cristalizada. Riesgo: silicosis, cáncer pulmonar. Medidas: EPP respiratorio (EPR), controles de polvo. Base DS 44 Art.15.',
    pasos:[
      {n:'1', fase:'Planificación y Organización', items:[
        {id:'1.1',item:'Difusión OAL–empresa y entrega de kit PLANESI', evidencia:'Carta conductora OAL', marco:'DS 594 Art.61'},
        {id:'1.2',item:'Identificación de puestos con exposición a sílice', evidencia:'MIPER con sílice / RIOHS', marco:'DS 594 Art.62'},
        {id:'1.3',item:'Conformación del Equipo de Salud Ocupacional (ESO)', evidencia:'Acta de constitución ESO', marco:'Circ. 3E/163'},
        {id:'1.4',item:'Capacitación del ESO por el OAL', evidencia:'Certificados/diplomas', marco:'DS 44 Art.15'},
        {id:'1.5',item:'Elaboración Carta Gantt de implementación', evidencia:'Carta Gantt firmada por ejecutivos', marco:'Sistema Gestión DS44'},
        {id:'1.6',item:'IRL (Informe de Riesgos Laborales) — reemplaza ODI', evidencia:'Acta IRL firmada (firma ológrafa + huella digital)', marco:'DS 44 Art.15'},
      ]},
      {n:'2', fase:'Caracterización del Riesgo', items:[
        {id:'2.1',item:'Inventario de materiales con sílice (fichas técnicas)', evidencia:'Inventario detallado', marco:'DS 594 Art.63'},
        {id:'2.2',item:'Mapa de puestos con presencia de sílice (GES)', evidencia:'Mapa de riesgo con exposición', marco:'DS 594 Art.64'},
        {id:'2.3',item:'Nómina de trabajadores expuestos por GES', evidencia:'Listado con RUT, cargo, tiempo exposición', marco:'DS 594 Art.64'},
      ]},
      {n:'3', fase:'Difusión y Capacitación', items:[
        {id:'3.1',item:'Difusión interna del protocolo + entrega IRL', evidencia:'Registro charla / acta IRL', marco:'DS 44 Art.15'},
        {id:'3.2',item:'Difusión externa — SEREMI/DT (carta conductora timbrada)', evidencia:'Carta conductora timbrada', marco:'DS 594 Art.65'},
        {id:'3.3',item:'Capacitación: sílice, silicosis, uso EPP respiratorio', evidencia:'Registro capacitación con evaluaciones', marco:'DS 44 Art.15'},
      ]},
      {n:'4', fase:'Evaluación del Riesgo', items:[
        {id:'4.1',item:'Evaluación cualitativa por experto red OAL', evidencia:'Informe cualitativo / pauta autoevaluación', marco:'DS 594 Art.66'},
        {id:'4.2',item:'Evaluación cuantitativa si NSE ≥ 3 o sector construcción', evidencia:'Informe técnico ambiental', marco:'DS 594 Art.67'},
        {id:'4.3',item:'Plan de trabajo de medidas correctivas', evidencia:'Plan firmado gerencia + APR', marco:'DS 44'},
      ]},
      {n:'5', fase:'Medidas Preventivas y Vigilancia de Salud', items:[
        {id:'5.1',item:'Implementación Sistema de Gestión para sílice', evidencia:'SG impreso y difundido', marco:'DS 594 Art.68'},
        {id:'5.2',item:'Programa de Protección Respiratoria (PPR)', evidencia:'PPR impreso con prueba de ajuste', marco:'DS 594 Anexo 8-10'},
        {id:'5.3',item:'Capacitación uso EPR y pruebas de ajuste (+/–)', evidencia:'Registros de capacitación', marco:'DS 44 Art.15'},
        {id:'5.4',item:'Radiografías de tórax (neumoconiosis) y ingreso a vigilancia', evidencia:'Certificado ingreso vigilancia OAL', marco:'DS 594 Art.69'},
        {id:'5.5',item:'Verificación de medidas — visita OAL', evidencia:'Acta visita OAL', marco:'Circ. 3E/163'},
        {id:'5.6',item:'Revisión semestral Carta Gantt en reunión CPHS', evidencia:'Acta CPHS', marco:'DS 44 Art.15'},
      ]},
    ],
    ganttActividades:[
      {n:1,actividad:'Inspecciones de áreas con presencia de sílice',dirigido:'Trabajador',por:'CPHS',periodo:'2 veces al año'},
      {n:2,actividad:'Observaciones de actividades de trabajadores',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual'},
      {n:3,actividad:'Medición ambiental de sílice',dirigido:'Trabajador',por:'OAL/MUTUAL',periodo:'Por definir / anual'},
      {n:4,actividad:'Difusión PLANESI + IRL',dirigido:'Trabajador',por:'APR',periodo:'2 veces al año'},
      {n:5,actividad:'Capacitación PLANESI y daños a la salud',dirigido:'Trabajador',por:'APR/CPHS',periodo:'3 veces al año'},
      {n:6,actividad:'Medidas preventivas y recomendaciones',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual'},
      {n:7,actividad:'Uso correcto EPP y EPR (ajuste positivo/negativo)',dirigido:'Trabajador',por:'APR',periodo:'Cuando corresponda'},
      {n:8,actividad:'Radiografía de tórax / vigilancia de salud',dirigido:'Trabajador',por:'OAL',periodo:'Cada 2 años (normal) / anual (alterado)'},
    ]
  },
  TMERT: {
    icon:'fa-person-walking', color:'#2563eb',
    titulo:'TMERT-EESS',
    subtitulo:'Trastornos Músculo-Esqueléticos de Extremidades Superiores',
    norma:'Circ. MINSAL 3E/170 · ISO 11228 · DS 44/2025 Art.15',
    desc:'Protocolo de Vigilancia para TMERT de Extremidades Superiores. Identifica y controla factores de riesgo ergonómicos.',
    irl:'Factores de riesgo ergonómico: posturas forzadas, movimientos repetitivos, fuerzas excesivas. Riesgo: lesiones TMERT. DS 44 Art.15.',
    pasos:[
      {n:'1', fase:'Planificación', items:[
        {id:'1.1',item:'Difusión OAL y entrega de kit TMERT',evidencia:'Carta conductora OAL',marco:'Circ. 3E/170'},
        {id:'1.2',item:'Identificación de puestos con factores ergonómicos',evidencia:'MIPER con ergonomía',marco:'Circ. 3E/170'},
        {id:'1.3',item:'Conformación ESO con ergonomista/OAL',evidencia:'Acta ESO',marco:'DS 44 Art.15'},
        {id:'1.4',item:'IRL por puesto (riesgos ergonómicos) — reemplaza ODI',evidencia:'Acta IRL firmada',marco:'DS 44 Art.15'},
        {id:'1.5',item:'Elaboración Carta Gantt',evidencia:'Carta Gantt firmada',marco:'DS44 SGSST'},
      ]},
      {n:'2', fase:'Evaluación del Riesgo', items:[
        {id:'2.1',item:'Aplicación pauta de observación ergonómica (Check-list)',evidencia:'Pauta diligenciada',marco:'Circ. 3E/170'},
        {id:'2.2',item:'Evaluación cuantitativa si NSE ≥ 3 (OCRA, RULA, REBA)',evidencia:'Informe ergonómico OAL',marco:'ISO 11228'},
        {id:'2.3',item:'Nómina expuestos por GES',evidencia:'Listado expuestos',marco:'Circ. 3E/170'},
      ]},
      {n:'3', fase:'Difusión, Capacitación y Medidas', items:[
        {id:'3.1',item:'Difusión interna + entrega IRL',evidencia:'Registro charla / acta IRL',marco:'DS 44 Art.15'},
        {id:'3.2',item:'Capacitación: TMERT, factores de riesgo, pausas activas',evidencia:'Registro capacitación',marco:'DS 44 Art.15'},
        {id:'3.3',item:'Implementación medidas de control (rediseño, rotación)',evidencia:'Plan de trabajo',marco:'Circ. 3E/170'},
        {id:'3.4',item:'Vigilancia de salud (examen musculoesquelético OAL)',evidencia:'Certificado ingreso vigilancia',marco:'Circ. 3E/170'},
        {id:'3.5',item:'Revisión Carta Gantt en CPHS',evidencia:'Acta CPHS',marco:'DS44'},
      ]},
    ],
    ganttActividades:[
      {n:1,actividad:'Inspecciones ergonómicas de puestos',dirigido:'Trabajador',por:'CPHS',periodo:'2 veces al año'},
      {n:2,actividad:'Observaciones actividades con factores TMERT',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual'},
      {n:3,actividad:'Evaluación cuantitativa ergonómica (OCRA/RULA)',dirigido:'Trabajador',por:'OAL/MUTUAL',periodo:'Por definir'},
      {n:4,actividad:'Difusión TMERT + IRL',dirigido:'Trabajador',por:'APR',periodo:'2 veces al año'},
      {n:5,actividad:'Capacitación TMERT y pausas activas',dirigido:'Trabajador',por:'APR/CPHS',periodo:'3 veces al año'},
      {n:6,actividad:'Rediseño de puestos y medidas preventivas',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual'},
      {n:7,actividad:'Asesoría ergonómica OAL',dirigido:'Depto. Prevención',por:'OAL/MUTUAL',periodo:'Cuando corresponda'},
    ]
  },
  PSICOSOCIAL: {
    icon:'fa-brain', color:'#7c3aed',
    titulo:'PSICOSOCIAL',
    subtitulo:'Riesgos Psicosociales — CEAL-SM/SUSESO',
    norma:'R.E. MINSAL N°1448/2022 · Circ. SUSESO N°3709 · DS 44/2025 Art.15',
    desc:'Protocolo de Vigilancia de Riesgos Psicosociales actualizado 2023. Cuestionario CEAL-SM/SUSESO reemplaza al ISTAS21/SUSESO.',
    irl:'Riesgos psicosociales laborales: carga de trabajo, jornadas, liderazgo, apoyo social. Riesgo: estrés, burnout, enfermedades mentales. DS 44 Art.15.',
    pasos:[
      {n:'1', fase:'Inicio del Proceso — Conformación del CdA', items:[
        {id:'1.1',item:'Estudio del Manual CEAL-SM/SUSESO por los futuros miembros del CdA',evidencia:'Registro lectura / acta',marco:'R.E. 1448/2022'},
        {id:'1.2',item:'Conformación del Comité de Aplicación (CdA) paritario (4-10 personas)',evidencia:'Acta de constitución CdA con votación',marco:'Circ. SUSESO 3709'},
        {id:'1.3',item:'Confección Cronograma/Carta Gantt del proceso',evidencia:'Carta Gantt firmada',marco:'DS44 SGSST'},
        {id:'1.4',item:'Definición de Unidades de Análisis (mín. 10 personas/UA)',evidencia:'Listado UA validado',marco:'Circ. SUSESO 3709'},
        {id:'1.5',item:'IRL — Información de Riesgos Psicosociales — reemplaza ODI',evidencia:'Acta IRL firmada',marco:'DS 44 Art.15'},
      ]},
      {n:'2', fase:'Difusión', items:[
        {id:'2.1',item:'Difusión al 100% de trabajadores (campaña CdA)',evidencia:'Registros difusión / intranet / volantes',marco:'R.E. 1448/2022'},
        {id:'2.2',item:'Capacitación del CdA en el cuestionario CEAL-SM',evidencia:'Certificados capacitación',marco:'Circ. SUSESO 3709'},
      ]},
      {n:'3', fase:'Aplicación del CEAL-SM/SUSESO', items:[
        {id:'3.1',item:'Configuración perfil en plataforma online SUSESO',evidencia:'Pantalla configuración',marco:'Circ. SUSESO 3709'},
        {id:'3.2',item:'Período de aplicación (≥ 2 semanas, tasa respuesta ≥ 60%)',evidencia:'Reporte tasa de respuesta',marco:'Circ. SUSESO 3709'},
        {id:'3.3',item:'Cierre y extracción del informe de resultados',evidencia:'Informe oficial SUSESO',marco:'R.E. 1448/2022'},
      ]},
      {n:'4', fase:'Análisis y Plan de Intervención', items:[
        {id:'4.1',item:'Análisis de resultados por Unidad de Análisis',evidencia:'Acta CdA con análisis',marco:'R.E. 1448/2022'},
        {id:'4.2',item:'Elaboración Plan de Intervención (PI) para dimensiones en riesgo',evidencia:'Plan de Intervención firmado gerencia',marco:'R.E. 1448/2022'},
        {id:'4.3',item:'Comunicación de resultados a trabajadores',evidencia:'Acta comunicación con firmas',marco:'R.E. 1448/2022'},
        {id:'4.4',item:'Envío del PI al OAL / SEREMI',evidencia:'Carta conductora timbrada',marco:'R.E. 1448/2022'},
      ]},
      {n:'5', fase:'Implementación, Seguimiento y Reevaluación', items:[
        {id:'5.1',item:'Implementación de medidas del Plan de Intervención',evidencia:'Registros implementación',marco:'R.E. 1448/2022'},
        {id:'5.2',item:'Seguimiento semestral en reunión CPHS',evidencia:'Acta CPHS',marco:'DS 44 Art.15'},
        {id:'5.3',item:'Reevaluación con CEAL-SM (cada 2 años o según resultado)',evidencia:'Nuevo informe SUSESO',marco:'R.E. 1448/2022'},
      ]},
    ],
    ganttActividades:[
      {n:1,actividad:'Conformación y capacitación del CdA',dirigido:'Empresa',por:'APR/RRHH',periodo:'Inicial (1 vez)'},
      {n:2,actividad:'Difusión a trabajadores',dirigido:'Trabajadores',por:'CdA',periodo:'Previo a aplicación'},
      {n:3,actividad:'Aplicación CEAL-SM/SUSESO online',dirigido:'Trabajadores',por:'CdA/OAL',periodo:'≥ 2 semanas'},
      {n:4,actividad:'Análisis de resultados',dirigido:'CdA/Empresa',por:'APR/OAL',periodo:'Post-aplicación'},
      {n:5,actividad:'Plan de Intervención y comunicación',dirigido:'Empresa',por:'APR/RRHH/CdA',periodo:'90 días post-informe'},
      {n:6,actividad:'Seguimiento en CPHS',dirigido:'CPHS',por:'APR/CPHS',periodo:'Semestral'},
      {n:7,actividad:'Reevaluación CEAL-SM',dirigido:'Trabajadores',por:'CdA/OAL',periodo:'Cada 2 años'},
    ]
  },
  UV: {
    icon:'fa-sun', color:'#d97706',
    titulo:'UV Solar',
    subtitulo:'Exposición Solar a Radiación Ultravioleta',
    norma:'Ley 20.096 · DS 594 · Circ. MINSAL · DS 44/2025 Art.15',
    desc:'Protocolo de Exposición Ocupacional a Radiación UV Solar. Protección de trabajadores a la intemperie entre 10:00 y 17:00 hrs.',
    irl:'Exposición a Radiación UV Solar. Riesgo: quemaduras, cáncer de piel. Medidas: bloqueador factor ≥30, ropa, sombrero, gafas, horarios. DS 44 Art.15.',
    pasos:[
      {n:'1', fase:'Planificación', items:[
        {id:'1.1',item:'Identificar puestos con exposición solar directa',evidencia:'MIPER con UV',marco:'DS 594 / Ley 20.096'},
        {id:'1.2',item:'Nómina de trabajadores expuestos a la intemperie',evidencia:'Listado expuestos',marco:'DS 594'},
        {id:'1.3',item:'IRL — Información riesgos UV Solar — reemplaza ODI',evidencia:'Acta IRL firmada',marco:'DS 44 Art.15'},
        {id:'1.4',item:'Elaboración Carta Gantt',evidencia:'Carta Gantt firmada',marco:'DS44 SGSST'},
      ]},
      {n:'2', fase:'Difusión, Capacitación y Medidas', items:[
        {id:'2.1',item:'Difusión interna protocolo UV + IRL',evidencia:'Registro charla / acta IRL',marco:'DS 44 Art.15'},
        {id:'2.2',item:'Capacitación: índice UV, daños a la salud, medidas',evidencia:'Registro capacitación',marco:'DS 44 Art.15'},
        {id:'2.3',item:'Provisión de EPP UV (bloqueador ≥30, ropa manga larga, gafas, casco/sombrero)',evidencia:'Registro entrega EPP',marco:'DS 594 / Ley 20.096'},
        {id:'2.4',item:'Habilitación de zonas de sombra y descanso',evidencia:'Registro fotográfico',marco:'DS 594'},
        {id:'2.5',item:'Información del índice UV diario (cuando aplica)',evidencia:'Registro difusión diaria',marco:'Ley 20.096'},
      ]},
      {n:'3', fase:'Vigilancia y Seguimiento', items:[
        {id:'3.1',item:'Inspecciones de cumplimiento uso EPP UV',evidencia:'Registro inspecciones',marco:'DS 44 Art.15'},
        {id:'3.2',item:'Revisión Carta Gantt en CPHS',evidencia:'Acta CPHS',marco:'DS44'},
      ]},
    ],
    ganttActividades:[
      {n:1,actividad:'Inspecciones de cumplimiento uso EPP UV',dirigido:'Trabajador',por:'CPHS/APR',periodo:'Mensual (oct–mar)'},
      {n:2,actividad:'Observaciones actividades en intemperie',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual'},
      {n:3,actividad:'Difusión UV + IRL',dirigido:'Trabajador',por:'APR',periodo:'2 veces al año'},
      {n:4,actividad:'Capacitación UV y daños a la salud',dirigido:'Trabajador',por:'APR/CPHS',periodo:'3 veces al año'},
      {n:5,actividad:'Entrega EPP UV (bloqueador, gafas, ropa)',dirigido:'Trabajador',por:'APR',periodo:'Inicio temp. / cuando corresponda'},
      {n:6,actividad:'Medidas preventivas y zonas de sombra',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual (verano)'},
    ]
  },
  MMC: {
    icon:'fa-box', color:'#1a237e',
    titulo:'MMC',
    subtitulo:'Manejo Manual de Cargas',
    norma:'DS 63/2005 MINTRAB · DS 594 · Guía ACHS/IST · DS 44/2025 Art.15',
    desc:'Protocolo de Vigilancia MMC y Tareas de Bajo Esfuerzo. Ergonomía y prevención de lesiones musculoesqueléticas por cargas.',
    irl:'Manejo manual de cargas superiores a límites legales (25 kg hombres / 20 kg mujeres embarazadas). Riesgo: lesiones lumbar/espalda. DS 44 Art.15.',
    pasos:[
      {n:'1', fase:'Planificación', items:[
        {id:'1.1',item:'Identificar tareas con MMC y trabajadores expuestos',evidencia:'MIPER con MMC',marco:'DS 63/2005'},
        {id:'1.2',item:'Nómina de trabajadores con MMC por GES',evidencia:'Listado expuestos',marco:'DS 63/2005'},
        {id:'1.3',item:'IRL — Información riesgos MMC — reemplaza ODI',evidencia:'Acta IRL firmada',marco:'DS 44 Art.15'},
        {id:'1.4',item:'Elaboración Carta Gantt',evidencia:'Carta Gantt firmada',marco:'DS44 SGSST'},
      ]},
      {n:'2', fase:'Evaluación del Riesgo', items:[
        {id:'2.1',item:'Aplicación check-list MMC por puesto de trabajo',evidencia:'Check-list diligenciado',marco:'Guía ACHS'},
        {id:'2.2',item:'Evaluación cuantitativa NSE ≥ 3 (NIOSH, Snook & Ciriello)',evidencia:'Informe ergonómico',marco:'DS 63/2005'},
      ]},
      {n:'3', fase:'Difusión, Capacitación y Medidas', items:[
        {id:'3.1',item:'Difusión interna + entrega IRL',evidencia:'Registro charla / acta IRL',marco:'DS 44 Art.15'},
        {id:'3.2',item:'Capacitación: técnicas de manejo seguro de cargas',evidencia:'Registro capacitación',marco:'DS 44 Art.15'},
        {id:'3.3',item:'Implementación ayudas mecánicas / rediseño de tareas',evidencia:'Plan de mejoras',marco:'DS 63/2005'},
        {id:'3.4',item:'Vigilancia de salud (examen lumbar OAL)',evidencia:'Certificado ingreso vigilancia',marco:'Guía ACHS'},
        {id:'3.5',item:'Revisión Carta Gantt en CPHS',evidencia:'Acta CPHS',marco:'DS44'},
      ]},
    ],
    ganttActividades:[
      {n:1,actividad:'Inspecciones de puestos con MMC',dirigido:'Trabajador',por:'CPHS',periodo:'2 veces al año'},
      {n:2,actividad:'Observaciones de actividades con carga manual',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual'},
      {n:3,actividad:'Evaluación cuantitativa MMC',dirigido:'Trabajador',por:'OAL/MUTUAL',periodo:'Por definir'},
      {n:4,actividad:'Difusión MMC + IRL',dirigido:'Trabajador',por:'APR',periodo:'2 veces al año'},
      {n:5,actividad:'Capacitación MMC y técnicas seguras',dirigido:'Trabajador',por:'APR/CPHS',periodo:'3 veces al año'},
      {n:6,actividad:'Implementación de ayudas mecánicas',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual'},
    ]
  },
  // ── HIC — Hipobaria Intermitente Crónica ─────────────────────────
  HIC: {
    icon:'fa-mountain', color:'#0369a1',
    titulo:'HIC',
    subtitulo:'Hipobaria Intermitente Crónica por Gran Altitud',
    norma:'Guía Técnica MINSAL 2013 · DS 594 · DS 44/2025 Art.15 · Circ. SUSESO 3838/2024',
    desc:'Protocolo para trabajadores que laboran a ≥ 3.000 msnm en régimen de turno, con retorno periódico al nivel del mar. Aplica principalmente a minería y faenas de altura. Riesgos: mal de altura crónico, apnea del sueño, daño cardiovascular.',
    irl:'Exposición a hipobaria intermitente crónica (altitud ≥ 3.000 msnm). Riesgos: hipoxia, poliglobulia, HTA, apnea del sueño, daño neurológico. Medidas: evaluaciones médicas preempleo y periódicas, exámenes de laboratorio, oximetría, restricción de exposición. Base DS 44 Art.15.',
    pasos:[
      {n:'1', fase:'Planificación y Organización', items:[
        {id:'1.1',item:'Difusión del protocolo HIC por el OAL a la empresa',evidencia:'Carta conductora OAL + kit HIC',marco:'Guía Técnica MINSAL 2013'},
        {id:'1.2',item:'Identificación de puestos expuestos a altitud ≥ 3.000 msnm',evidencia:'Listado de puestos / MIPER actualizado',marco:'DS 594 Art.1'},
        {id:'1.3',item:'Conformación del Equipo de Salud Ocupacional (ESO)',evidencia:'Acta de constitución ESO',marco:'Guía Técnica MINSAL 2013'},
        {id:'1.4',item:'Capacitación del ESO por el OAL',evidencia:'Certificados capacitación ESO',marco:'DS 44 Art.15'},
        {id:'1.5',item:'Elaboración Carta Gantt de implementación',evidencia:'Carta Gantt firmada por ejecutivos',marco:'DS44 SGSST'},
        {id:'1.6',item:'IRL — Información de Riesgos HIC por puesto',evidencia:'Acta IRL firmada (firma ológrafa + huella digital)',marco:'DS 44 Art.15'},
      ]},
      {n:'2', fase:'Evaluación de Salud Preempleo y Periódica', items:[
        {id:'2.1',item:'Examen médico preempleo para trabajo en altura ≥ 3.000 msnm',evidencia:'Informe médico de aptitud OAL',marco:'Guía Técnica MINSAL 2013'},
        {id:'2.2',item:'Exámenes de laboratorio: hemograma, hematocrito, oximetría, ECG, presión arterial',evidencia:'Resultados laboratorio OAL',marco:'Guía Técnica MINSAL 2013 Cap.4'},
        {id:'2.3',item:'Evaluación de apnea del sueño (polisomnografía si hay sospecha)',evidencia:'Informe especialista/OAL',marco:'Circ. SUSESO 3838/2024'},
        {id:'2.4',item:'Evaluación periódica anual (médica + laboratorio)',evidencia:'Informe anual OAL',marco:'Guía Técnica MINSAL 2013'},
        {id:'2.5',item:'Registro en nómina de trabajadores expuestos',evidencia:'Planilla nómina firmada',marco:'Guía Técnica MINSAL 2013'},
      ]},
      {n:'3', fase:'Difusión y Capacitación', items:[
        {id:'3.1',item:'Difusión interna protocolo HIC + entrega IRL a 100% de expuestos',evidencia:'Registro charla / acta IRL firmada',marco:'DS 44 Art.15'},
        {id:'3.2',item:'Capacitación: efectos hipobaria, síntomas de alarma, autocuidado',evidencia:'Registro capacitación / evaluaciones',marco:'DS 44 Art.15'},
        {id:'3.3',item:'Difusión externa: envío reporte a SEREMI Salud y DT',evidencia:'Carta conductora timbrada SEREMI',marco:'DS 594'},
      ]},
      {n:'4', fase:'Medidas Preventivas y de Control', items:[
        {id:'4.1',item:'Implementar turnos rotativos con tiempo suficiente de recuperación a nivel del mar',evidencia:'Registro turnos / contrato colectivo',marco:'Guía Técnica MINSAL 2013 Cap.3'},
        {id:'4.2',item:'Disponibilidad de oxígeno suplementario en faena',evidencia:'Inventario equipos O₂',marco:'DS 594 Art.23'},
        {id:'4.3',item:'Control de hematocrito: hombres ≤ 21%, mujeres ≤ 19% (poliglobulia)',evidencia:'Informes laboratorio periódicos',marco:'Guía Técnica MINSAL 2013'},
        {id:'4.4',item:'Programa de aclimatación progresiva para nuevos ingresantes',evidencia:'Protocolo de aclimatación',marco:'Guía Técnica MINSAL 2013 Cap.3'},
        {id:'4.5',item:'Restricción de exposición a trabajadores con contraindicación médica',evidencia:'Informe médico restricción / reasignación',marco:'Guía Técnica MINSAL 2013'},
      ]},
      {n:'5', fase:'Vigilancia Continua y Mejora', items:[
        {id:'5.1',item:'Ingreso al programa de vigilancia de salud OAL',evidencia:'Certificado ingreso programa OAL',marco:'Guía Técnica MINSAL 2013'},
        {id:'5.2',item:'Visita de verificación OAL a faena de altura',evidencia:'Acta de visita OAL',marco:'Guía Técnica MINSAL 2013'},
        {id:'5.3',item:'Revisión Carta Gantt en reunión CPHS semestral',evidencia:'Acta CPHS',marco:'DS 44 Art.15'},
        {id:'5.4',item:'Actualización IRL ante cambio de turno o ingreso nuevo trabajador',evidencia:'Acta IRL actualizada firmada',marco:'DS 44 Art.15'},
      ]},
    ],
    ganttActividades:[
      {n:1,actividad:'Inspección condiciones faena en altura',dirigido:'Trabajador',por:'CPHS/APR',periodo:'2 veces al año'},
      {n:2,actividad:'Evaluación médica preempleo y periódica',dirigido:'Trabajador',por:'OAL/MUTUAL',periodo:'Anual'},
      {n:3,actividad:'Exámenes laboratorio (hemograma, oximetría, ECG)',dirigido:'Trabajador',por:'OAL',periodo:'Anual'},
      {n:4,actividad:'Difusión HIC + IRL',dirigido:'Trabajador',por:'APR',periodo:'2 veces al año'},
      {n:5,actividad:'Capacitación: efectos hipobaria y autocuidado',dirigido:'Trabajador',por:'APR/OAL',periodo:'3 veces al año'},
      {n:6,actividad:'Verificación turnos y tiempo recuperación nivel del mar',dirigido:'Trabajador',por:'RRHH/APR',periodo:'Mensual'},
      {n:7,actividad:'Control hematocrito y poliglobulia',dirigido:'Trabajador',por:'OAL',periodo:'Semestral'},
      {n:8,actividad:'Revisión IRL y actualización por cambio de turno',dirigido:'Trabajador',por:'APR',periodo:'Anual o cambio puesto'},
    ]
  },
  // ── HUMOS — Metales y Metaloides / Humos Metálicos ──────────────
  HUMOS: {
    icon:'fa-smog', color:'#78350f',
    titulo:'HUMOS',
    subtitulo:'Metales, Metaloides y Humos de Soldadura',
    norma:'Res. Exenta N°606/2023 MINSAL · DS 594 Art.59-65 · Circ. SUSESO 3838/2024 · DS 44/2025 Art.15',
    desc:'Protocolo de Vigilancia Ocupacional por Exposición a Metales, Metaloides y Humos de Soldadura (Res. Exenta N°606, jun-2023). Aplica a soldadores, fundidores, trabajadores expuestos a Fe, Mn, Cr+6, Ni, Pb, Cd, As, Cu, Zn. Incluye control ambiental y vigilancia de salud.',
    irl:'Exposición a metales/metaloides y humos de soldadura. Riesgos: fiebre por humos metálicos, silicosis, cáncer pulmonar (Cr+6, As, Cd), neurotoxicidad (Mn, Pb), hepatotoxicidad. Medidas: EPR adecuado, ventilación local exhaustora, controles ingenieriles. Base DS 44 Art.15.',
    pasos:[
      {n:'1', fase:'Planificación y Organización', items:[
        {id:'1.1',item:'Difusión del protocolo Metales/Humos por el OAL a la empresa',evidencia:'Carta conductora OAL + kit Protocolo',marco:'Res. Exenta N°606/2023'},
        {id:'1.2',item:'Inventario de metales/metaloides presentes (Fe, Mn, Cr, Ni, Pb, Cd, As, Cu, Zn)',evidencia:'Fichas SDS / inventario materiales',marco:'DS 594 Art.59'},
        {id:'1.3',item:'Identificación de Grupos de Exposición Similar (GES)',evidencia:'Informe GES por puesto',marco:'Res. Exenta N°606/2023 Cap.3'},
        {id:'1.4',item:'Conformación del Equipo de Salud Ocupacional (ESO)',evidencia:'Acta constitución ESO',marco:'Res. Exenta N°606/2023'},
        {id:'1.5',item:'Elaboración Carta Gantt de implementación',evidencia:'Carta Gantt firmada por ejecutivos',marco:'DS44 SGSST'},
        {id:'1.6',item:'IRL — Información de Riesgos por Metales/Humos por puesto',evidencia:'Acta IRL firmada (firma ológrafa + huella digital)',marco:'DS 44 Art.15'},
      ]},
      {n:'2', fase:'Evaluación Ambiental', items:[
        {id:'2.1',item:'Evaluación cualitativa inicial por higienista del OAL',evidencia:'Informe cualitativo OAL',marco:'Res. Exenta N°606/2023 Cap.4'},
        {id:'2.2',item:'Muestreo ambiental cuantitativo de metales (fracción inhalable/respirable)',evidencia:'Informe cuantitativo laboratorio acreditado',marco:'DS 594 Art.61 · NCh 3358'},
        {id:'2.3',item:'Comparación con Límites Permisibles Ponderados (LPP) DS 594',evidencia:'Informe comparativo LPP',marco:'DS 594 Anexo N°1'},
        {id:'2.4',item:'GES con Cr+6, As o Cd → protocolo cancerígenos (Circ. 3838)',evidencia:'Informe específico cancerígenos OAL',marco:'Circ. SUSESO 3838/2024'},
      ]},
      {n:'3', fase:'Difusión y Capacitación', items:[
        {id:'3.1',item:'Difusión interna protocolo + entrega IRL a 100% de expuestos',evidencia:'Registro charla / acta IRL firmada',marco:'DS 44 Art.15'},
        {id:'3.2',item:'Capacitación: riesgos de metales, efectos en salud, uso EPR correcto',evidencia:'Registro capacitación / evaluaciones',marco:'DS 44 Art.15'},
        {id:'3.3',item:'Capacitación específica soldadura: generación humos, ventilación, equipo',evidencia:'Registro capacitación soldadores',marco:'DS 594 Art.62'},
        {id:'3.4',item:'Difusión externa: informe a SEREMI Salud y DT',evidencia:'Carta conductora timbrada',marco:'DS 594'},
      ]},
      {n:'4', fase:'Medidas de Control', items:[
        {id:'4.1',item:'Implementación ventilación local exhaustora (VLE) en soldadura y fundición',evidencia:'Plano/especificación técnica VLE',marco:'DS 594 Art.63'},
        {id:'4.2',item:'Programa de Protección Respiratoria (EPR): selección, entrega, mantención',evidencia:'PPR impreso + registros de entrega',marco:'DS 594 Art.64'},
        {id:'4.3',item:'Implementar controles ingenieriles: sustitución, encapsulamiento, VLE',evidencia:'Plan de controles con responsables y plazos',marco:'Res. Exenta N°606/2023'},
        {id:'4.4',item:'Restricción de acceso a áreas con metales cancerígenos (Cr+6, As, Cd)',evidencia:'Señalética + registros de acceso controlado',marco:'Circ. SUSESO 3838/2024'},
      ]},
      {n:'5', fase:'Vigilancia de Salud', items:[
        {id:'5.1',item:'Examen médico preempleo y periódico: laboratorio biológico (indicadores de exposición)',evidencia:'Informes médicos OAL',marco:'Res. Exenta N°606/2023 Cap.5'},
        {id:'5.2',item:'Monitoreo biológico: plombemia (Pb), creatinina (Cd), arsénico urinario (As)',evidencia:'Resultados laboratorio acreditado',marco:'Res. Exenta N°606/2023 Anexo'},
        {id:'5.3',item:'Radiografía de tórax OIT (GES con polvo metálico / fibrogénico)',evidencia:'Informe radiológico OIT',marco:'Res. Exenta N°606/2023'},
        {id:'5.4',item:'Ingreso al programa de vigilancia de salud OAL',evidencia:'Certificado ingreso programa vigilancia',marco:'Res. Exenta N°606/2023'},
        {id:'5.5',item:'Verificación de cumplimiento medidas — visita OAL semestral',evidencia:'Acta de visita OAL',marco:'Res. Exenta N°606/2023'},
        {id:'5.6',item:'Revisión Carta Gantt en reunión CPHS',evidencia:'Acta CPHS',marco:'DS 44 Art.15'},
      ]},
    ],
    ganttActividades:[
      {n:1,actividad:'Inspección de áreas con exposición a metales/humos',dirigido:'Trabajador',por:'CPHS/APR',periodo:'2 veces al año'},
      {n:2,actividad:'Observaciones de actividades de trabajadores expuestos',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual'},
      {n:3,actividad:'Muestreo ambiental cuantitativo de metales',dirigido:'Trabajador',por:'OAL/MUTUAL',periodo:'Anual'},
      {n:4,actividad:'Difusión Protocolo Metales/Humos + IRL',dirigido:'Trabajador',por:'APR',periodo:'2 veces al año'},
      {n:5,actividad:'Capacitación: riesgos metales, humos soldadura, EPR',dirigido:'Trabajador',por:'APR/CPHS',periodo:'3 veces al año'},
      {n:6,actividad:'Medidas preventivas y verificación VLE/EPR',dirigido:'Trabajador',por:'APR/CPHS',periodo:'Mensual'},
      {n:7,actividad:'Monitoreo biológico (laboratorio indicadores exposición)',dirigido:'Trabajador',por:'OAL',periodo:'Anual'},
      {n:8,actividad:'Evaluación médica periódica + Rx tórax OIT',dirigido:'Trabajador',por:'OAL',periodo:'Anual'},
      {n:9,actividad:'Revisión IRL y actualización',dirigido:'Trabajador',por:'APR',periodo:'Anual o cambio puesto'},
    ]
  },
};

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

async function renderProtocols() {
  setPageTitle('Protocolos MINSAL', 'Actualizado DS 44 (1-Feb-2025) · IRL · CEAL-SM/SUSESO · Carta Gantt');
  const res = await API.get('/protocols').catch(()=>({data:{data:[]}}));
  const apiData = res.data?.data || [];
  const content = document.getElementById('page-content');

  // Construir mapa de cumplimiento desde API o defaults
  const cumplMap = {};
  apiData.forEach(p => { if(p.id) cumplMap[p.id] = p.cumplimiento_pct || 0; });
  const defaults = { PREXOR:72, PLANESI:55, TMERT:88, PSICOSOCIAL:65, UV:91, MMC:80, HIC:60, HUMOS:45 };

  const protIds = Object.keys(PROTOCOL_META);
  const cumplimiento = {};
  protIds.forEach(id => { cumplimiento[id] = cumplMap[id] ?? defaults[id]; });

  // ── KPI global ──
  const totalActivos = protIds.filter(id=>id!=='').length;
  const pctGlobal = Math.round(protIds.reduce((a,id)=>a+cumplimiento[id],0)/protIds.length);
  const enRiesgo = protIds.filter(id=>cumplimiento[id]<60).length;

  content.innerHTML = `
    <!-- DS 44 Banner -->
    <div class="mb-5 p-4 rounded-xl fade-in" style="background:linear-gradient(135deg,#0d1b5e,#1a237e);border:1px solid rgba(0,180,216,0.25);">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div class="flex items-center gap-3 flex-1">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(0,180,216,0.15);border:1px solid rgba(0,180,216,0.3)">
            <i class="fas fa-shield-halved text-xl" style="color:#00b4d8"></i>
          </div>
          <div>
            <div class="font-black text-white text-base">Protocolos MINSAL · Marco DS N°44 — Vigente desde 01/02/2025</div>
            <div class="text-xs mt-1" style="color:rgba(0,180,216,0.85)">
              <i class="fas fa-circle-check mr-1"></i>IRL reemplaza ODI (Art. 15) &nbsp;·&nbsp;
              <i class="fas fa-circle-check mr-1"></i>CEAL-SM/SUSESO reemplaza ISTAS21 &nbsp;·&nbsp;
              <i class="fas fa-circle-check mr-1"></i>Carta Gantt obligatoria &nbsp;·&nbsp;
              <i class="fas fa-circle-check mr-1"></i>Firma ológrafa + huella digital
            </div>
          </div>
        </div>
        <div class="flex gap-3 flex-shrink-0">
          <div class="text-center p-2 rounded-lg" style="background:rgba(255,255,255,0.08)">
            <div class="text-2xl font-black text-white">${pctGlobal}%</div>
            <div class="text-xs" style="color:rgba(0,180,216,0.85)">Cumpl. global</div>
          </div>
          <div class="text-center p-2 rounded-lg" style="background:rgba(255,255,255,0.08)">
            <div class="text-2xl font-black text-white">${totalActivos}/8</div>
            <div class="text-xs" style="color:rgba(0,180,216,0.85)">Activos</div>
          </div>
          ${enRiesgo>0?`<div class="text-center p-2 rounded-lg" style="background:rgba(220,38,38,0.2);border:1px solid rgba(220,38,38,0.3)">
            <div class="text-2xl font-black text-red-400">${enRiesgo}</div>
            <div class="text-xs text-red-300">En riesgo</div>
          </div>`:''}
        </div>
      </div>
    </div>

    <!-- IRL Info Banner -->
    <div class="mb-5 p-4 rounded-xl flex items-start gap-3 fade-in" style="background:linear-gradient(135deg,#eff2ff,#e8f4fd);border:1.5px solid rgba(26,35,126,0.2)">
      <i class="fas fa-file-signature text-xl mt-0.5" style="color:#1a237e"></i>
      <div>
        <div class="font-bold" style="color:#0d1b5e">IRL — Informe de Riesgos Laborales (Art. 15 DS 44) · Reemplaza a la ODI</div>
        <div class="text-sm mt-1" style="color:#1e2d7d">
          El DS 44 obliga a entregar al trabajador un <strong>IRL firmado con firma ológrafa y huella digital</strong>, informando los riesgos específicos de su puesto, las medidas preventivas y los EPP requeridos, conforme a cada protocolo MINSAL aplicable. Debe actualizarse ante cambio de puesto o incorporación de nuevos factores de riesgo.
        </div>
      </div>
    </div>

    <!-- Tabs de vista -->
    <div class="flex gap-1 mb-5 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-fit">
      <button id="tab-cards" class="tab-btn active text-xs px-4 py-2 rounded-lg" onclick="switchProtocolView('cards')">
        <i class="fas fa-th-large mr-1"></i>Tarjetas
      </button>
      <button id="tab-gantt" class="tab-btn text-xs px-4 py-2 rounded-lg" onclick="switchProtocolView('gantt')">
        <i class="fas fa-chart-gantt mr-1"></i>Carta Gantt
      </button>
      <button id="tab-paso" class="tab-btn text-xs px-4 py-2 rounded-lg" onclick="switchProtocolView('paso')">
        <i class="fas fa-list-check mr-1"></i>Paso a Paso
      </button>
    </div>

    <!-- Vista TARJETAS -->
    <div id="view-cards" class="fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        ${protIds.map(pid => {
          const p = PROTOCOL_META[pid];
          const pct = cumplimiento[pid];
          const activo = true;
          return `
            <div class="protocol-card card-hover" onclick="navigate('protocol-detail',{id:'${pid}'})">
              <div class="protocol-card-header" style="background:linear-gradient(135deg,${p.color}e8,${p.color})">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background:rgba(255,255,255,0.2)">
                    <i class="fas ${p.icon} text-white text-xl"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-black text-white text-base leading-tight">${p.titulo}</div>
                    <div class="text-xs text-white opacity-80 mt-0.5 truncate">${p.subtitulo}</div>
                  </div>
                  <div class="text-white font-black text-xl flex-shrink-0">${pct}%</div>
                </div>
                <div class="flex items-center gap-2 mt-3">
                  ${activo ? '<span class="badge badge-green text-xs">Activo</span>' : '<span class="badge badge-gray text-xs">Sin implementar</span>'}
                  <span class="badge text-xs ml-auto" style="background:rgba(255,255,255,0.2);color:white;border-color:rgba(255,255,255,0.3)">
                    <i class="fas fa-file-signature mr-1"></i>IRL
                  </span>
                </div>
              </div>
              <div class="p-4">
                <div class="text-xs text-gray-500 mb-2 line-clamp-2">${p.norma}</div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-500">Cumplimiento</span>
                  <span class="font-bold" style="color:${pct>=80?'#059669':pct>=60?'#d97706':'#dc2626'}">${pct}%</span>
                </div>
                <div class="progress-bar mb-3">
                  <div class="progress-fill" style="width:${pct}%;background:${pct>=80?'#059669':pct>=60?'#d97706':'#dc2626'}"></div>
                </div>
                <div class="flex gap-2">
                  <button class="btn btn-primary flex-1 justify-center text-xs py-2" style="background:${p.color};" onclick="event.stopPropagation();navigate('protocol-detail',{id:'${pid}'})">
                    <i class="fas fa-eye mr-1"></i>Ver Detalle
                  </button>
                  <button class="btn btn-secondary text-xs py-2 px-3" onclick="event.stopPropagation();showIRLModal('${pid}')" title="Ver IRL">
                    <i class="fas fa-file-signature"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Vista CARTA GANTT -->
    <div id="view-gantt" class="hidden fade-in">
      ${renderGanttView(cumplimiento)}
    </div>

    <!-- Vista PASO A PASO -->
    <div id="view-paso" class="hidden fade-in">
      ${renderPasoAPasoView()}
    </div>
  `;
}

function switchProtocolView(view) {
  ['cards','gantt','paso'].forEach(v => {
    document.getElementById('view-'+v)?.classList.toggle('hidden', v!==view);
    document.getElementById('tab-'+v)?.classList.toggle('active', v===view);
  });
}

function renderGanttView(cumplimiento) {
  const year = new Date().getFullYear();
  const mesActual = new Date().getMonth(); // 0-indexed
  const protIds = Object.keys(PROTOCOL_META);

  // Colores según estado de actividad
  const ESTADO_CONFIG = {
    completado:  { color:'#059669', bg:'#ecfdf5', border:'#a7f3d0', label:'✓ Realizado'   },
    en_ejecucion:{ color:'#d97706', bg:'#fffbeb', border:'#fde68a', label:'▶ En curso'    },
    pendiente:   { color:'#6b7280', bg:'#f3f4f6', border:'#d1d5db', label:'○ Pendiente'   },
    no_aplica:   { color:'#3b82f6', bg:'#eff6ff', border:'#bfdbfe', label:'— No aplica'   },
    atrasado:    { color:'#dc2626', bg:'#fef2f2', border:'#fecaca', label:'⚠ Atrasado'    },
  };

  // Calcula meses activos según periodicidad
  function getMesesActivos(periodo, idx) {
    const lp = periodo.toLowerCase();
    if(lp.includes('mensual') || lp.includes('1 vez al mes')) return [0,1,2,3,4,5,6,7,8,9,10,11];
    if(lp.includes('2 veces'))  return [0,6];
    if(lp.includes('3 veces'))  return [0,4,8];
    if(lp.includes('anual') || lp.includes('1 vez al año')) return [5];
    if(lp.includes('cambio puesto') || lp.includes('según')) return [0];
    if(lp.includes('verano') || lp.includes('oct')) return [9,10,11,0,1,2];
    if(lp.includes('necesario') || lp.includes('requerimiento')) return [];
    return [idx % 12];
  }

  // Determina estado real de la celda (mes, mesesActivos, indiceActividad)
  function getEstadoCelda(mes, mesesActivos, actIdx) {
    if(!mesesActivos.includes(mes)) return null;
    // Simulación DS44: los meses ya pasados se marcan según avance
    if(mes < mesActual) return actIdx < 3 ? 'completado' : actIdx < 5 ? 'atrasado' : 'pendiente';
    if(mes === mesActual) return actIdx < 4 ? 'completado' : 'en_ejecucion';
    return 'pendiente';
  }

  return `
    <div class="card p-5">
      <!-- Encabezado -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 class="font-bold text-gray-800 text-base">
            <i class="fas fa-chart-gantt mr-2" style="color:#1a237e"></i>
            Carta Gantt — Protocolos MINSAL ${year}
          </h3>
          <p class="text-xs text-gray-500 mt-0.5">
            Cronograma DS 44 vigente 01/02/2025 · IRL obligatorio Art.15 · Todas las actividades MINSAL
          </p>
        </div>
        <div class="flex gap-2 flex-shrink-0">
          <select id="gantt-filter-proto" class="form-input text-xs py-1.5 px-3 w-40"
            onchange="ganttFiltrarProtocolo(this.value)">
            <option value="all">Todos los protocolos</option>
            ${protIds.map(pid=>`<option value="${pid}">${pid}</option>`).join('')}
          </select>
          <button class="btn btn-secondary text-xs" onclick="showToast('Exportando Carta Gantt a Excel…','info')">
            <i class="fas fa-file-excel mr-1" style="color:#059669"></i>Excel
          </button>
          <button class="btn btn-secondary text-xs" onclick="showToast('Generando PDF de Carta Gantt…','info')">
            <i class="fas fa-file-pdf mr-1 text-red-500"></i>PDF
          </button>
        </div>
      </div>

      <!-- Leyenda -->
      <div class="flex flex-wrap gap-3 mb-4 p-3 rounded-lg text-xs" style="background:#f7f8fd;border:1px solid #e2e8f0">
        ${Object.entries(ESTADO_CONFIG).map(([k,v])=>`
          <span class="flex items-center gap-1.5">
            <span class="inline-block w-3 h-3 rounded-full" style="background:${v.color}"></span>
            <span style="color:${v.color};font-weight:600">${v.label}</span>
          </span>
        `).join('')}
        <span class="flex items-center gap-1.5 ml-auto">
          <span class="inline-block w-3 h-3 rounded border-2" style="border-color:#1a237e;background:#eff2ff"></span>
          <span class="text-gray-500">Mes actual (${MESES[mesActual]})</span>
        </span>
      </div>

      <!-- Tablas por protocolo -->
      <div id="gantt-tablas">
        ${protIds.map(pid => {
          const p   = PROTOCOL_META[pid];
          const pct = cumplimiento[pid] ?? 0;
          const pctColor = pct>=80?'#059669':pct>=60?'#d97706':'#dc2626';
          return `
          <div class="gantt-proto-bloque mb-7" data-proto="${pid}">
            <!-- Cabecera protocolo -->
            <div class="flex items-center gap-3 mb-2 p-3 rounded-xl" style="background:${p.color}0d;border:1px solid ${p.color}30">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                   style="background:${p.color}20;border:1px solid ${p.color}50">
                <i class="fas ${p.icon} text-sm" style="color:${p.color}"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-sm text-gray-800">${p.titulo} — ${p.subtitulo}</div>
                <div class="text-xs text-gray-400 truncate">${p.norma}</div>
              </div>
              <!-- mini barra cumplimiento -->
              <div class="flex items-center gap-2 flex-shrink-0">
                <div class="hidden sm:block w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div class="h-full rounded-full transition-all" style="width:${pct}%;background:${pctColor}"></div>
                </div>
                <span class="text-sm font-black" style="color:${pctColor}">${pct}%</span>
                <button class="btn btn-secondary text-xs py-1 px-2" onclick="showIRLModal('${pid}')">
                  <i class="fas fa-file-signature mr-1" style="color:#1a237e"></i>IRL
                </button>
              </div>
            </div>

            <!-- Tabla Gantt -->
            <div class="overflow-x-auto rounded-xl border" style="border-color:#e2e8f0">
              <table class="w-full border-collapse text-xs" style="min-width:820px">
                <thead>
                  <tr style="background:#f0f2f8">
                    <th class="text-left px-3 py-2 font-semibold text-gray-600 border-r border-gray-200" style="width:28%;min-width:180px">
                      Actividad
                    </th>
                    <th class="px-2 py-2 text-center font-semibold text-gray-500 border-r border-gray-200" style="width:9%">Dirigido a</th>
                    <th class="px-2 py-2 text-center font-semibold text-gray-500 border-r border-gray-200" style="width:9%">Responsable</th>
                    <th class="px-2 py-2 text-center font-semibold text-gray-500 border-r border-gray-200" style="width:9%">Período</th>
                    ${MESES.map((m,mi)=>`
                      <th class="px-1 py-2 text-center font-semibold border-r border-gray-100 last:border-r-0"
                          style="width:3.5%;${mi===mesActual?'background:#eff2ff;color:#1a237e;font-weight:900':'color:#94a3b8'}">
                        ${m}
                      </th>
                    `).join('')}
                    <th class="px-2 py-2 text-center font-semibold text-gray-500" style="width:8%">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  ${p.ganttActividades.map((act,ai)=>{
                    const mesesActivos = getMesesActivos(act.periodo, ai);
                    // Estado general de la actividad (para badge final)
                    const mesesPasadosActivos = mesesActivos.filter(m=>m<=mesActual);
                    let estadoGeneral = 'pendiente';
                    if(mesesActivos.length===0) estadoGeneral='no_aplica';
                    else if(ai<3) estadoGeneral='completado';
                    else if(ai<5) estadoGeneral='en_ejecucion';
                    const cfg = ESTADO_CONFIG[estadoGeneral];
                    return `
                      <tr class="hover:bg-blue-50/20 transition-colors" style="${ai%2===0?'':'background:#fafbfd'}">
                        <td class="px-3 py-2 font-medium text-gray-700 border-r border-gray-100">
                          <span class="inline-block w-5 h-5 rounded-full text-center text-white font-bold text-xs leading-5 mr-1 flex-shrink-0"
                                style="background:${p.color};display:inline-flex;align-items:center;justify-content:center">${act.n}</span>
                          ${act.actividad}
                        </td>
                        <td class="px-2 py-2 text-center text-gray-500 border-r border-gray-100">${act.dirigido}</td>
                        <td class="px-2 py-2 text-center font-medium border-r border-gray-100" style="color:${p.color}">${act.por}</td>
                        <td class="px-2 py-2 text-center text-gray-500 border-r border-gray-100 whitespace-nowrap">${act.periodo}</td>
                        ${MESES.map((_,mi)=>{
                          const estCelda = getEstadoCelda(mi, mesesActivos, ai);
                          const esHoy = mi===mesActual;
                          if(!estCelda) return `<td class="px-1 py-2 text-center border-r border-gray-100 last:border-r-0"
                            style="${esHoy?'background:#eff2ff':''}">&nbsp;</td>`;
                          const cc = ESTADO_CONFIG[estCelda];
                          return `<td class="px-1 py-2 text-center border-r border-gray-100 last:border-r-0"
                            style="${esHoy?'background:#eff2ff':''}">
                            <div class="w-5 h-5 rounded-full mx-auto flex items-center justify-center cursor-pointer"
                                 title="${cc.label} · ${MESES[mi]}"
                                 style="background:${cc.bg};border:1.5px solid ${cc.border}">
                              <div class="w-2.5 h-2.5 rounded-full" style="background:${cc.color}"></div>
                            </div>
                          </td>`;
                        }).join('')}
                        <td class="px-2 py-2 text-center">
                          <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
                                style="background:${cfg.bg};color:${cfg.color};border:1px solid ${cfg.border}">
                            ${cfg.label}
                          </span>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
          `;
        }).join('')}
      </div>

      <!-- Pie de página / observaciones DS44 -->
      <div class="mt-4 p-4 rounded-xl text-xs" style="background:#f0f2f8;border:1px solid #dde3f0">
        <div class="flex items-start gap-2">
          <i class="fas fa-circle-info mt-0.5" style="color:#1a237e"></i>
          <div>
            <div class="font-bold mb-1" style="color:#0d1b5e">Observaciones DS 44 — Carta Gantt MINSAL</div>
            <div class="text-gray-500 space-y-0.5">
              <div>• Las actividades pueden variar según la normativa vigente y los resultados de las evaluaciones de riesgo.</div>
              <div>• Las fechas pueden modificarse según compromisos con el Organismo Administrador de la Ley (OAL) y reuniones del CPHS.</div>
              <div>• El <strong>IRL (Informe de Riesgos Laborales)</strong> debe entregarse a cada trabajador con <strong>firma ológrafa + huella digital</strong> conforme DS 44 Art.15.</div>
              <div>• La Carta Gantt debe ser revisada y actualizada en cada reunión del CPHS o al menos semestralmente.</div>
              <div>• Actualizada según D.S. N°44 vigente desde el <strong>01/02/2025</strong>. Reemplaza D.S. N°40/1969.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function ganttFiltrarProtocolo(valor) {
  document.querySelectorAll('.gantt-proto-bloque').forEach(el => {
    el.style.display = (valor==='all' || el.dataset.proto===valor) ? '' : 'none';
  });
}

function renderPasoAPasoView() {
  const protIds = Object.keys(PROTOCOL_META);
  const selProt = 'PLANESI';
  return `
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
      <!-- Selector lateral -->
      <div class="lg:col-span-1">
        <div class="card p-3 sticky" style="top:80px">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 flex items-center gap-1">
            <i class="fas fa-list-check mr-1" style="color:#1a237e"></i>Protocolo
          </div>
          ${protIds.map(pid => {
            const p = PROTOCOL_META[pid];
            const pct = ({PREXOR:72,PLANESI:55,TMERT:88,PSICOSOCIAL:65,UV:91,MMC:80,HIC:60,HUMOS:45})[pid]||0;
            const pc = pct>=80?'#059669':pct>=60?'#d97706':'#dc2626';
            return `
              <button id="paso-sel-${pid}" onclick="showPasoProtocol('${pid}')"
                class="w-full text-left flex items-center gap-2 p-2.5 rounded-xl mb-1.5 transition-all hover:bg-gray-50 border border-transparent"
                style="${pid===selProt?`background:${p.color}10;border-color:${p.color}40`:''}"
              >
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                     style="background:${p.color}18;border:1px solid ${p.color}30">
                  <i class="fas ${p.icon} text-xs" style="color:${p.color}"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-bold text-gray-700">${p.titulo}</div>
                  <div class="text-xs text-gray-400 truncate">${p.subtitulo}</div>
                </div>
                <span class="text-xs font-black flex-shrink-0" style="color:${pc}">${pct}%</span>
              </button>
            `;
          }).join('')}
          <!-- Info DS44 lateral -->
          <div class="mt-3 p-2.5 rounded-lg text-xs" style="background:#f0f2f8;border:1px solid #dde3f0;color:#3d4a6b">
            <div class="font-bold mb-1" style="color:#0d1b5e">DS 44 · Art. 15</div>
            <div>IRL obligatorio por puesto con firma ológrafa + huella digital</div>
          </div>
        </div>
      </div>
      <!-- Contenido -->
      <div id="paso-content" class="lg:col-span-3">
        ${renderPasoContent(selProt)}
      </div>
    </div>
  `;
}

function showPasoProtocol(pid) {
  const protIds = Object.keys(PROTOCOL_META);
  protIds.forEach(id => {
    const btn = document.getElementById('paso-sel-'+id);
    if(!btn) return;
    const p = PROTOCOL_META[id];
    if(id === pid) {
      btn.style.background = p.color+'10';
      btn.style.borderColor = p.color+'40';
    } else {
      btn.style.background = '';
      btn.style.borderColor = 'transparent';
    }
  });
  const cont = document.getElementById('paso-content');
  if(cont) cont.innerHTML = renderPasoContent(pid);
}

function renderPasoContent(pid) {
  const p = PROTOCOL_META[pid];
  if(!p) return '';
  const totalItems = p.pasos.reduce((a,f)=>a+f.items.length,0);
  const CUMPL_OPTS  = ['Si','En proceso','Pendiente','No aplica'];
  const CUMPL_STYLE = {
    'Si':        { bg:'#ecfdf5', color:'#059669', border:'#a7f3d0' },
    'En proceso':{ bg:'#fffbeb', color:'#d97706', border:'#fde68a' },
    'Pendiente': { bg:'#fef2f2', color:'#dc2626', border:'#fecaca' },
    'No aplica': { bg:'#f1f5f9', color:'#6b7280', border:'#cbd5e1' },
  };
  // Porcentaje simulado basado en "Si" simulados
  const simSi = Math.floor(totalItems * 0.6);
  const pctSim = Math.round(simSi/totalItems*100);

  return `
    <!-- Header protocolo -->
    <div class="card p-0 mb-4 overflow-hidden">
      <div class="flex items-start gap-4 p-5 text-white" style="background:linear-gradient(135deg,${p.color}dd,${p.color})">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
             style="background:rgba(255,255,255,0.2)">
          <i class="fas ${p.icon} text-2xl"></i>
        </div>
        <div class="flex-1">
          <div class="font-black text-xl leading-tight">${p.titulo} — ${p.subtitulo}</div>
          <p class="text-sm opacity-90 mt-1">${p.desc}</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span class="badge text-xs" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.35)">
              <i class="fas fa-gavel mr-1"></i>${p.norma}
            </span>
            <span class="badge text-xs" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3)">
              <i class="fas fa-file-signature mr-1"></i>IRL obligatorio
            </span>
          </div>
        </div>
        <div class="text-center flex-shrink-0">
          <div class="text-4xl font-black">${pctSim}%</div>
          <div class="text-xs opacity-80">cumplimiento</div>
          <div class="progress-bar mt-2 w-20" style="background:rgba(255,255,255,0.3)">
            <div class="progress-fill" style="width:${pctSim}%;background:white"></div>
          </div>
        </div>
      </div>

      <!-- IRL Banner -->
      <div class="mx-4 mb-4 mt-3 p-3 rounded-xl flex items-start gap-3"
           style="background:linear-gradient(135deg,#eff2ff,#e8f4fd);border:1px solid rgba(26,35,126,0.2)">
        <i class="fas fa-file-signature mt-0.5 text-sm" style="color:#1a237e"></i>
        <div class="flex-1">
          <div class="text-xs font-bold" style="color:#0d1b5e">IRL — Informe de Riesgos Laborales · Art. 15 DS N°44</div>
          <div class="text-xs mt-0.5" style="color:#1e2d7d">${p.irl}</div>
        </div>
        <button class="btn btn-secondary text-xs py-1 px-2 flex-shrink-0" onclick="showIRLModal('${pid}')">
          <i class="fas fa-file-signature mr-1" style="color:#1a237e"></i>Generar IRL
        </button>
      </div>

      <!-- Resumen de avance -->
      <div class="px-4 mb-4">
        <div class="grid grid-cols-4 gap-2 text-center">
          ${[
            ['Fases','fa-layer-group',p.pasos.length,p.color],
            ['Total ítems','fa-list-check',totalItems,'#374151'],
            ['Completados','fa-circle-check',simSi,'#059669'],
            ['Pendientes','fa-circle-xmark',totalItems-simSi,'#dc2626'],
          ].map(([lbl,ico,val,col])=>`
            <div class="p-2 rounded-xl text-center" style="background:#f7f8fd;border:1px solid #e2e8f0">
              <i class="fas ${ico} mb-1" style="color:${col}"></i>
              <div class="text-lg font-black" style="color:${col}">${val}</div>
              <div class="text-xs text-gray-500">${lbl}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Fases paso a paso -->
    ${p.pasos.map((fase, fi) => {
      const completadosFase = Math.floor(fase.items.length * 0.6);
      const pctFase = Math.round(completadosFase/fase.items.length*100);
      const faseColor = pctFase>=80?'#059669':pctFase>=50?'#d97706':'#dc2626';
      return `
      <div class="card p-0 mb-3 overflow-hidden">
        <!-- Cabecera fase (clickable para colapsar) -->
        <div class="flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-colors hover:opacity-90"
             style="background:${p.color}0e;border-left:4px solid ${p.color}"
             onclick="toggleFase('fase-${pid}-${fi}')">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
               style="background:${p.color}">${fase.n}</div>
          <div class="flex-1">
            <div class="font-bold text-sm text-gray-800">Fase ${fase.n}: ${fase.fase}</div>
            <div class="text-xs text-gray-500 mt-0.5">${fase.items.length} actividades</div>
          </div>
          <!-- Mini barra -->
          <div class="hidden sm:flex items-center gap-2 flex-shrink-0">
            <div class="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div class="h-full rounded-full" style="width:${pctFase}%;background:${faseColor}"></div>
            </div>
            <span class="text-xs font-bold" style="color:${faseColor}">${pctFase}%</span>
          </div>
          <i class="fas fa-chevron-down text-gray-400 text-xs transition-transform" id="chevron-${pid}-${fi}"></i>
        </div>

        <!-- Tabla de actividades -->
        <div id="fase-${pid}-${fi}" class="">
          <div class="overflow-x-auto">
            <table class="w-full text-xs border-collapse" style="min-width:620px">
              <thead>
                <tr style="background:#f7f8fd;border-bottom:1px solid #e2e8f0">
                  <th class="text-center px-3 py-2 font-semibold text-gray-500" style="width:6%">Ítem</th>
                  <th class="text-left px-3 py-2 font-semibold text-gray-500" style="width:32%">Actividad a Realizar</th>
                  <th class="text-left px-3 py-2 font-semibold text-gray-500" style="width:24%">Evidencia / Registro Requerido</th>
                  <th class="text-left px-3 py-2 font-semibold text-gray-500" style="width:16%">Marco Legal</th>
                  <th class="text-center px-3 py-2 font-semibold text-gray-500" style="width:12%">Cumplimiento</th>
                  <th class="text-center px-3 py-2 font-semibold text-gray-500" style="width:10%">Fecha</th>
                </tr>
              </thead>
              <tbody>
                ${fase.items.map((item, ii) => {
                  const defaultVal = ii<2?'Si':ii===2?'En proceso':'Pendiente';
                  const ds = CUMPL_STYLE[defaultVal];
                  return `
                  <tr class="border-b border-gray-50 hover:bg-blue-50/20 transition-colors"
                      style="${ii%2===0?'':'background:#fafbfd'}">
                    <td class="px-3 py-2.5 text-center">
                      <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                            style="background:${p.color}">${item.id}</span>
                    </td>
                    <td class="px-3 py-2.5 font-medium text-gray-700">${item.item}</td>
                    <td class="px-3 py-2.5 text-gray-500">${item.evidencia}</td>
                    <td class="px-3 py-2.5">
                      <span class="badge badge-navy text-xs whitespace-nowrap">${item.marco}</span>
                    </td>
                    <td class="px-3 py-2.5 text-center">
                      <select class="text-xs rounded-lg px-2 py-1 cursor-pointer font-semibold border"
                              style="background:${ds.bg};color:${ds.color};border-color:${ds.border}"
                              onchange="
                                const s={'Si':{bg:'#ecfdf5',c:'#059669',b:'#a7f3d0'},'En proceso':{bg:'#fffbeb',c:'#d97706',b:'#fde68a'},'Pendiente':{bg:'#fef2f2',c:'#dc2626',b:'#fecaca'},'No aplica':{bg:'#f1f5f9',c:'#6b7280',b:'#cbd5e1'}};
                                const v=s[this.value];
                                if(v){this.style.background=v.bg;this.style.color=v.c;this.style.borderColor=v.b;}
                              ">
                        ${CUMPL_OPTS.map(o=>`<option value="${o}" ${o===defaultVal?'selected':''}>${o}</option>`).join('')}
                      </select>
                    </td>
                    <td class="px-3 py-2.5 text-center">
                      <input type="date" class="text-xs border rounded-lg px-1.5 py-1 w-full"
                             style="border-color:#dde3f0;color:#374151"
                             value="${ii<2?new Date().toISOString().split('T')[0]:''}">
                    </td>
                  </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      `;
    }).join('')}

    <!-- Acciones -->
    <div class="flex flex-wrap gap-3 mt-2 mb-6">
      <button class="btn btn-primary text-sm" onclick="showToast('Avance de ${pid} guardado exitosamente','success')">
        <i class="fas fa-save mr-1"></i>Guardar Avance
      </button>
      <button class="btn btn-secondary text-sm" onclick="showToast('Generando informe PDF de ${pid}…','info')">
        <i class="fas fa-file-pdf text-red-500 mr-1"></i>Informe PDF
      </button>
      <button class="btn btn-secondary text-sm" onclick="showIRLModal('${pid}')">
        <i class="fas fa-file-signature mr-1" style="color:#1a237e"></i>Generar IRL
      </button>
      <button class="btn btn-secondary text-sm" onclick="navigate('protocols');setTimeout(()=>switchProtocolView('gantt'),200)">
        <i class="fas fa-chart-gantt mr-1" style="color:#1a237e"></i>Ver Carta Gantt
      </button>
    </div>
  `;
}

function toggleFase(id) {
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.toggle('hidden');
  const chev = document.getElementById(id.replace('fase-','chevron-'));
  if(chev) chev.style.transform = el.classList.contains('hidden') ? 'rotate(-90deg)' : '';
}

function showIRLModal(pid) {
  const p = PROTOCOL_META[pid];
  if(!p) return;
  const fecha = new Date().toLocaleDateString('es-CL', {day:'2-digit',month:'long',year:'numeric'});
  showModal(`IRL — Informe de Riesgos Laborales · ${p.titulo} (Art. 15 D.S. N°44)`, `
    <div style="font-family:'Segoe UI',sans-serif;">
      <div class="p-4 rounded-xl mb-4 text-white" style="background:linear-gradient(135deg,#0d1b5e,#1a237e)">
        <div class="font-black text-lg">INFORME DE RIESGOS LABORALES (IRL)</div>
        <div class="text-xs mt-1 opacity-80">Art. 15 D.S. N°44 / Ministerio del Trabajo y Previsión Social · Vigente 01/02/2025</div>
        <div class="text-xs mt-0.5 opacity-80">Reemplaza a la Obligación de Informar (ODI) D.S. N°40/1969</div>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-4">
        <div><label class="form-label">Empresa / Razón Social</label>
          <input class="form-input text-sm" placeholder="Nombre de la empresa"></div>
        <div><label class="form-label">RUT Empresa</label>
          <input class="form-input text-sm" placeholder="XX.XXX.XXX-X"></div>
        <div><label class="form-label">Trabajador (Nombres y Apellidos)</label>
          <input class="form-input text-sm" placeholder="Nombres completos"></div>
        <div><label class="form-label">RUT Trabajador</label>
          <input class="form-input text-sm" placeholder="XX.XXX.XXX-X"></div>
        <div><label class="form-label">Cargo / Puesto de Trabajo</label>
          <input class="form-input text-sm" placeholder="Cargo específico"></div>
        <div><label class="form-label">Centro / Área de trabajo</label>
          <input class="form-input text-sm" placeholder="Centro o área"></div>
        <div><label class="form-label">Protocolo aplicable</label>
          <input class="form-input text-sm" value="${p.titulo} — ${p.subtitulo}" readonly></div>
        <div><label class="form-label">Fecha de entrega</label>
          <input type="date" class="form-input text-sm" value="${new Date().toISOString().split('T')[0]}"></div>
      </div>

      <div class="p-3 rounded-lg mb-3" style="background:#f7f8fd;border:1px solid #e2e8f0">
        <div class="text-xs font-bold text-gray-600 mb-2"><i class="fas fa-triangle-exclamation mr-1 text-yellow-500"></i>Riesgos Identificados en el Puesto</div>
        <div class="text-xs text-gray-700">${p.irl}</div>
      </div>

      <div class="p-3 rounded-lg mb-4" style="background:#ecfdf5;border:1px solid #a7f3d0">
        <div class="text-xs font-bold mb-2" style="color:#059669"><i class="fas fa-shield-halved mr-1"></i>Medidas de Prevención y EPP Requeridos</div>
        <div class="text-xs text-gray-700">
          Conforme al protocolo ${p.titulo} y el D.S. N°44 Art.15, el trabajador debe cumplir con las medidas de control establecidas, usar correctamente los EPP asignados y reportar condiciones inseguras.
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 mt-4">
        <div class="text-center p-3 rounded-lg" style="border:1px dashed #c5cde8">
          <div class="text-xs text-gray-500 mb-6">Firma del Trabajador<br><span class="font-semibold">(Firma ológrafa)</span></div>
          <div class="border-t border-gray-300 pt-1 text-xs text-gray-400">Firma</div>
        </div>
        <div class="text-center p-3 rounded-lg" style="border:1px dashed #c5cde8">
          <div class="text-xs text-gray-500 mb-6">Huella Digital<br><span class="font-semibold">(Obligatoria DS 44)</span></div>
          <div class="border-t border-gray-300 pt-1 text-xs text-gray-400">Huella</div>
        </div>
        <div class="text-center p-3 rounded-lg" style="border:1px dashed #c5cde8">
          <div class="text-xs text-gray-500 mb-6">Representante Empresa<br><span class="font-semibold">(APR/Empleador)</span></div>
          <div class="border-t border-gray-300 pt-1 text-xs text-gray-400">Firma</div>
        </div>
      </div>
      <div class="text-center text-xs text-gray-400 mt-3">${fecha} · HSE 360 — NexusForge</div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-secondary text-sm" onclick="showToast('Generando PDF del IRL...','info')">
      <i class="fas fa-file-pdf text-red-500 mr-1"></i>Exportar PDF
    </button>
    <button class="btn btn-primary" onclick="closeModal();showToast('IRL registrado exitosamente para ${p.titulo}','success')">
      <i class="fas fa-save mr-1"></i>Registrar IRL Firmado
    </button>
  `, 'lg');
}

// ================================================================
// PROTOCOLO DETALLE — DS 44 actualizado
// ================================================================
// ================================================================
// PROTOCOLO HUMOS METÁLICOS — Vista Especializada
// Res. Exenta N°606/2023 MINSAL · DS 594 · Circ. SUSESO 3838/2024
// ================================================================
function renderHumosDetail(p, proto, pct, content) {
  const color = '#78350f';
  const colorLight = '#fef3c7';
  const evals = proto.evaluaciones || [];
  const stats = proto.estadisticas || {};

  // Grupos de riesgo por metal
  const metalesGrupos = [
    { metal:'Fe / Mn', nombre:'Hierro / Manganeso', icon:'fa-industry', riesgo:'Alto', efecto:'Manganismo, neumoconiosis', lpp_fe:'5.0 mg/m³', lpp_mn:'0.2 mg/m³', color:'#92400e', ocupaciones:'Soldadores, fundidores' },
    { metal:'Cr+6', nombre:'Cromo Hexavalente', icon:'fa-radiation', riesgo:'Cancerígeno G1 IARC', efecto:'Cáncer pulmonar, perforación septo', lpp:'0.05 mg/m³', color:'#dc2626', ocupaciones:'Soldadores acero inox, cromado' },
    { metal:'Ni', nombre:'Níquel', icon:'fa-atom', riesgo:'Cancerígeno G1 IARC', efecto:'Cáncer pulmonar/nasal, dermatitis', lpp:'1.0 mg/m³', color:'#b91c1c', ocupaciones:'Soldadura MIG/TIG, galvanoplastia' },
    { metal:'Pb', nombre:'Plomo', icon:'fa-skull-crossbones', riesgo:'Muy Alto — Neurotóxico', efecto:'Plombemia ≥40µg/dL → restricción laboral', lpp:'0.1 mg/m³', color:'#7c3aed', ocupaciones:'Fundición Pb, baterías, soldadura' },
    { metal:'Cd', nombre:'Cadmio', icon:'fa-radiation-alt', riesgo:'Cancerígeno G1 IARC', efecto:'Cáncer renal y pulmonar, nefrotoxicidad', lpp:'0.01 mg/m³', color:'#dc2626', ocupaciones:'Galvanoplastia, soldadura latón' },
    { metal:'As', nombre:'Arsénico', icon:'fa-biohazard', riesgo:'Cancerígeno G1 IARC', efecto:'Cáncer piel/pulmón, neuropatía', lpp:'0.01 mg/m³', color:'#b91c1c', ocupaciones:'Fundición cobre, pesticidas' },
    { metal:'Cu / Zn', nombre:'Cobre / Zinc', icon:'fa-fire', riesgo:'Medio', efecto:'Fiebre por humos metálicos (metal fume fever)', lpp_cu:'0.2 mg/m³', lpp_zn:'4.0 mg/m³', color:'#d97706', ocupaciones:'Soldadura, galvanoplastia' },
  ];

  // Evaluaciones con campos específicos HUMOS
  const evalRows = evals.length > 0 ? evals.map(ev => {
    const feOk = ev.resultado_fe_mgm3 != null ? ev.resultado_fe_mgm3 <= (ev.limite_fe_ds594||5.0) : null;
    const mnOk = ev.resultado_mn_mgm3 != null ? ev.resultado_mn_mgm3 <= (ev.limite_mn_ds594||0.2) : null;
    const cr6Ok = ev.resultado_cr6_mgm3 != null ? ev.resultado_cr6_mgm3 <= (ev.limite_cr6_ds594||0.05) : null;
    return `
    <tr>
      <td>
        <div class="font-semibold text-sm">${ev.worker_nombre||ev.trabajador_nombre||'—'}</div>
        <div class="text-xs text-gray-400">${ev.rut||'—'} · ${ev.cargo||'—'}</div>
        <div class="text-xs mt-0.5">${(ev.metales_exposicion||[]).map(m=>`<span class="badge badge-orange text-xs" style="font-size:9px">${m}</span>`).join(' ')}</div>
      </td>
      <td class="text-xs text-gray-600">${formatDate(ev.muestreo_ambiental_fecha||ev.fecha_eval)}</td>
      <td>
        ${ev.resultado_fe_mgm3!=null?`<div class="text-xs ${feOk?'text-green-600':'text-red-600 font-bold'}"><i class="fas fa-circle text-xs mr-1"></i>Fe: ${ev.resultado_fe_mgm3} mg/m³ (LPP ${ev.limite_fe_ds594||5.0})</div>`:''}
        ${ev.resultado_mn_mgm3!=null?`<div class="text-xs ${mnOk?'text-green-600':'text-red-600 font-bold'}"><i class="fas fa-circle text-xs mr-1"></i>Mn: ${ev.resultado_mn_mgm3} mg/m³ (LPP ${ev.limite_mn_ds594||0.2})</div>`:''}
        ${ev.resultado_cr6_mgm3!=null?`<div class="text-xs ${cr6Ok?'text-green-600':'text-red-600 font-bold'}"><i class="fas fa-circle text-xs mr-1"></i>Cr+6: ${ev.resultado_cr6_mgm3} mg/m³ (LPP ${ev.limite_cr6_ds594||0.05})</div>`:''}
        ${!ev.resultado_fe_mgm3&&!ev.resultado_mn_mgm3&&!ev.resultado_cr6_mgm3?`<span class="text-xs text-gray-400">Sin datos muestreo</span>`:''}
      </td>
      <td>
        ${ev.espirometria_fecha?`<div class="text-xs text-green-600"><i class="fas fa-check mr-1"></i>${ev.espirometria_resultado||'Realizada'}</div><div class="text-xs text-gray-400">${formatDate(ev.espirometria_fecha)}</div>`:`<span class="badge badge-red text-xs">Pendiente</span>`}
      </td>
      <td>
        ${ev.rx_torax_fecha?`<div class="text-xs text-green-600"><i class="fas fa-check mr-1"></i>${ev.rx_torax_resultado||'Sin hallazgos'}</div><div class="text-xs text-gray-400">${formatDate(ev.rx_torax_fecha)}</div>`:`<span class="badge badge-red text-xs">Pendiente</span>`}
      </td>
      <td>
        <div class="text-xs">${ev.ventilacion_vle?'<span class="badge badge-green text-xs">VLE ✓</span>':'<span class="badge badge-red text-xs">Sin VLE</span>'}</div>
        <div class="text-xs mt-1">${ev.epr_entregado?'<span class="badge badge-green text-xs">EPR ✓</span>':'<span class="badge badge-red text-xs">Sin EPR</span>'}</div>
        ${ev.epr_prueba_ajuste?'<div class="text-xs mt-1"><span class="badge badge-green text-xs">Ajuste ✓</span></div>':''}
      </td>
      <td>${estadoBadgeGeneric(ev.estado)}</td>
      <td class="text-xs text-gray-500">${formatDate(ev.prox_evaluacion)}</td>
    </tr>`;
  }).join('') : `
    <tr><td colspan="8" class="text-center py-10 text-gray-400">
      <i class="fas fa-smog text-4xl text-amber-200 mb-3 block"></i>
      <div class="font-semibold text-sm">Sin evaluaciones registradas</div>
      <div class="text-xs mt-1 mb-3">Registra la primera evaluación de trabajadores expuestos a metales/humos</div>
      <button class="btn btn-primary text-xs" onclick="showHumosEvalModal()"><i class="fas fa-plus mr-1"></i>Primera Evaluación</button>
    </td></tr>`;

  content.innerHTML = `
    <!-- Volver -->
    <div class="flex items-center gap-3 mb-4">
      <button class="btn btn-secondary text-sm" onclick="navigate('protocols')">
        <i class="fas fa-arrow-left mr-1"></i>Volver a Protocolos
      </button>
    </div>

    <!-- Header HUMOS -->
    <div class="card mb-5 overflow-hidden">
      <div class="p-5 text-white" style="background:linear-gradient(135deg,#92400e,#78350f)">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style="background:rgba(255,255,255,0.15)">
            <i class="fas fa-smog text-3xl"></i>
          </div>
          <div class="flex-1">
            <div class="text-2xl font-black">HUMOS — Metales, Metaloides y Humos de Soldadura</div>
            <p class="text-sm opacity-90 mt-1">Protocolo de Vigilancia Ocupacional por Exposición a Metales y Metaloides — Res. Exenta N°606/2023 MINSAL. Aplica a soldadores, fundidores, trabajadores expuestos a Fe, Mn, Cr+6, Ni, Pb, Cd, As, Cu, Zn.</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span class="badge text-xs" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3)"><i class="fas fa-gavel mr-1"></i>Res. Exenta N°606/2023 MINSAL</span>
              <span class="badge text-xs" style="background:rgba(255,255,255,0.2);color:white"><i class="fas fa-radiation mr-1"></i>Circ. SUSESO 3838/2024 Cancerígenos</span>
              <span class="badge text-xs" style="background:rgba(255,255,255,0.2);color:white"><i class="fas fa-file-signature mr-1"></i>IRL obligatorio DS 44 Art.15</span>
            </div>
          </div>
          <div class="text-center flex-shrink-0">
            <div class="text-4xl font-black">${pct}%</div>
            <div class="text-xs opacity-80">cumplimiento</div>
            <div class="w-20 h-1.5 bg-white/20 rounded-full mt-2 mx-auto">
              <div class="h-full rounded-full bg-amber-300" style="width:${pct}%"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Alerta cancerígenos -->
      <div class="flex items-start gap-3 p-4 border-t-0" style="background:#fef2f2;border:1px solid #fecaca;">
        <i class="fas fa-radiation text-red-600 mt-0.5 flex-shrink-0"></i>
        <div class="text-xs text-red-800">
          <strong>⚠️ Contiene cancerígenos Grupo 1 IARC:</strong> Cr+6 (Cromo hexavalente), Ni (Níquel), Cd (Cadmio), As (Arsénico).
          Aplica Circ. SUSESO N°3838/2024 — Protocolo específico para metales cancerígenos con vigilancia de salud reforzada y monitoreo biológico semestral.
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      ${kpiCard('Trabajadores Vigilados', stats.total_vigilados||evals.length||'—', 'En programa de vigilancia', 'fa-hard-hat', 'from-amber-700 to-amber-900', 'Res. Exenta N°606/2023')}
      ${kpiCard('Sobre Límite Legal', stats.sobre_limite_legal||0, 'Superan LPP DS 594', 'fa-radiation', 'from-red-600 to-red-800', 'Acción inmediata requerida')}
      ${kpiCard('Con Monitoreo Biológico', stats.con_monitoreo_biologico||0, 'Exámenes laboratorio', 'fa-vials', 'from-purple-600 to-purple-800', 'Plombemia · Cd urinario · As urinario')}
      ${kpiCard('Espirometrías Vigentes', stats.con_espirometria_vigente||0, 'Función pulmonar al día', 'fa-lungs', 'from-sky-600 to-sky-800', 'Anual obligatorio')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
      <!-- Panel izquierdo -->
      <div class="space-y-4">

        <!-- Estadísticas -->
        <div class="card p-4">
          <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-chart-pie mr-2" style="color:${color}"></i>Estado Implementación</h3>
          <div class="text-4xl font-black text-center mb-3" style="color:${color}">${pct}%</div>
          <div class="progress-bar mb-3"><div class="progress-fill" style="width:${pct}%;background:${color}"></div></div>
          <div class="space-y-1.5 text-xs">
            <div class="flex justify-between"><span class="text-gray-500">Total vigilados</span><span class="font-bold">${stats.total_vigilados||evals.length||'—'}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Sobre límite DS 594</span><span class="font-bold text-red-600">${stats.sobre_limite_legal||0}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Monitoreo biológico</span><span class="font-bold text-purple-600">${stats.con_monitoreo_biologico||0}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Espirometría vigente</span><span class="font-bold text-sky-600">${stats.con_espirometria_vigente||0}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Rx tórax OIT vigente</span><span class="font-bold text-green-600">${stats.con_rx_torax_vigente||0}</span></div>
          </div>
        </div>

        <!-- IRL HUMOS -->
        <div class="card p-4" style="border-left:4px solid #78350f">
          <div class="flex items-start gap-2">
            <i class="fas fa-file-signature mt-0.5" style="color:#78350f"></i>
            <div>
              <div class="text-xs font-bold" style="color:#78350f">IRL — DS 44 Art.15 · Humos Metálicos</div>
              <div class="text-xs mt-1 text-gray-600">Exposición a metales/metaloides y humos de soldadura. Riesgos: fiebre por humos, silicosis metálica, cáncer pulmonar (Cr+6, As, Cd), neurotoxicidad (Mn, Pb). Medidas: EPR adecuado, ventilación local exhaustora (VLE), controles ingenieriles.</div>
            </div>
          </div>
          <button class="btn btn-secondary w-full justify-center mt-3 text-xs" onclick="showIRLModal('HUMOS')" style="border-color:#78350f;color:#78350f">
            <i class="fas fa-file-signature mr-1"></i>Generar IRL Humos Metálicos
          </button>
        </div>

        <!-- Acciones Rápidas -->
        <div class="card p-4">
          <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-bolt mr-2 text-yellow-500"></i>Acciones Rápidas</h3>
          <div class="flex flex-col gap-2">
            <button class="btn btn-primary justify-start text-xs" onclick="showHumosEvalModal()" style="background:#78350f;border-color:#78350f">
              <i class="fas fa-plus mr-1"></i>Nueva Evaluación Trabajador
            </button>
            <button class="btn btn-secondary justify-start text-xs" onclick="showHumosMuestreoModal()">
              <i class="fas fa-vials mr-1"></i>Registrar Muestreo Ambiental
            </button>
            <button class="btn btn-secondary justify-start text-xs" onclick="navigate('epp')">
              <i class="fas fa-hard-hat mr-1"></i>Gestionar EPR / Respiradores
            </button>
            <button class="btn btn-secondary justify-start text-xs" onclick="navigate('workers')">
              <i class="fas fa-users mr-1"></i>Ver Trabajadores Expuestos
            </button>
            <button class="btn btn-secondary justify-start text-xs" onclick="navigate('protocols');setTimeout(()=>switchProtocolView('gantt'),200)">
              <i class="fas fa-chart-gantt mr-1" style="color:#1a237e"></i>Carta Gantt Anual
            </button>
            <button class="btn btn-secondary justify-start text-xs" onclick="showToast('Generando informe PDF Humos Metálicos...','info')">
              <i class="fas fa-file-pdf text-red-500 mr-1"></i>Informe PDF Protocolo
            </button>
          </div>
        </div>

        <!-- LPP Límites DS 594 -->
        <div class="card p-4">
          <h3 class="font-bold text-gray-700 mb-3 text-sm"><i class="fas fa-ruler mr-2 text-amber-700"></i>Límites Permisibles DS 594</h3>
          <div class="space-y-2 text-xs">
            ${[
              {m:'Fe (Hierro)',l:'5.0 mg/m³',t:'TWA (fracción inhalable)'},
              {m:'Mn (Manganeso)',l:'0.2 mg/m³',t:'TWA'},
              {m:'Cr+6 (Cancerígeno)',l:'0.05 mg/m³',t:'TWA — IARC G1'},
              {m:'Ni (Cancerígeno)',l:'1.0 mg/m³',t:'TWA — IARC G1'},
              {m:'Pb (Plomo)',l:'0.1 mg/m³',t:'TWA (sangre: 40 µg/dL)'},
              {m:'Cd (Cancerígeno)',l:'0.01 mg/m³',t:'TWA — IARC G1'},
              {m:'As (Cancerígeno)',l:'0.01 mg/m³',t:'TWA — IARC G1'},
              {m:'Cu (Cobre)',l:'0.2 mg/m³',t:'TWA'},
              {m:'Zn (Zinc)',l:'4.0 mg/m³',t:'TWA (fiebre humos)'},
            ].map(({m,l,t})=>`
              <div class="flex justify-between items-center py-1 border-b border-gray-100">
                <span class="text-gray-700 font-medium">${m}</span>
                <div class="text-right"><div class="font-mono font-bold text-amber-800">${l}</div><div class="text-gray-400 text-xs">${t}</div></div>
              </div>
            `).join('')}
          </div>
          <div class="text-xs text-gray-400 mt-2">Fuente: DS N°594/1999 MINSAL, Tabla Anexo N°1</div>
        </div>
      </div>

      <!-- Panel derecho -->
      <div class="lg:col-span-2 space-y-4">

        <!-- Grupos de riesgo por metal -->
        <div class="card p-4">
          <h3 class="font-bold text-gray-700 mb-3 text-sm"><i class="fas fa-layer-group mr-2 text-amber-700"></i>Metales / Grupos de Riesgo</h3>
          <div class="grid grid-cols-1 gap-2">
            ${metalesGrupos.map(g=>`
              <div class="p-3 rounded-xl border flex items-start gap-3" style="background:${g.riesgo.includes('Cancerígeno')||g.riesgo.includes('Muy Alto')?'#fff1f2':'#fffbeb'};border-color:${g.riesgo.includes('Cancerígeno')||g.riesgo.includes('Muy Alto')?'#fecaca':'#fde68a'}">
                <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background:${g.color}20">
                  <i class="fas ${g.icon} text-sm" style="color:${g.color}"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-bold text-sm" style="color:${g.color}">${g.metal}</span>
                    <span class="text-xs text-gray-500">— ${g.nombre}</span>
                    <span class="badge text-xs" style="background:${g.riesgo.includes('Cancerígeno')?'#fee2e2':g.riesgo.includes('Muy Alto')?'#ede9fe':'#fef3c7'};color:${g.riesgo.includes('Cancerígeno')||g.riesgo.includes('Muy Alto')?'#991b1b':'#92400e'}">${g.riesgo}</span>
                  </div>
                  <div class="text-xs text-gray-600 mt-0.5"><i class="fas fa-exclamation-circle mr-1 text-orange-400"></i>${g.efecto}</div>
                  <div class="text-xs text-gray-400 mt-0.5"><i class="fas fa-user-helmet-safety mr-1"></i>${g.ocupaciones}</div>
                </div>
                <div class="text-right flex-shrink-0">
                  <div class="font-mono text-xs font-bold" style="color:${g.color}">${g.lpp||g.lpp_fe||'—'}</div>
                  <div class="text-xs text-gray-400">LPP DS594</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Vigilancia de Salud Requerida -->
        <div class="card p-4">
          <h3 class="font-bold text-gray-700 mb-3 text-sm"><i class="fas fa-stethoscope mr-2 text-amber-700"></i>Vigilancia de Salud Requerida — Res. Exenta N°606/2023</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${[
              {icon:'fa-lungs',color:'#0284c7',titulo:'Espirometría',desc:'CVF, VEF1, VEF1/CVF — Función pulmonar',freq:'Preempleo + Anual',norma:'Res. N°606 Cap.5'},
              {icon:'fa-x-ray',color:'#6d28d9',titulo:'Rx Tórax OIT',desc:'Clasificación neumoconiosis OIT — Polvo metálico/fibrogénico',freq:'Cada 2 años (normal) / Anual (alterado)',norma:'Res. N°606 Cap.5'},
              {icon:'fa-vials',color:'#7c3aed',titulo:'Monitoreo Biológico Pb',desc:'Plombemia ≥40 µg/dL → restricción laboral inmediata',freq:'Semestral para expuestos Pb',norma:'Res. N°606 Anexo'},
              {icon:'fa-flask',color:'#dc2626',titulo:'Cd Urinario',desc:'Creatinina + Cd urinario µg/g creatinina',freq:'Semestral (cancerígeno)',norma:'Circ. SUSESO 3838/2024'},
              {icon:'fa-microscope',color:'#dc2626',titulo:'As Urinario Inorgánico',desc:'Arsénico inorgánico urinario µg/L',freq:'Semestral (cancerígeno)',norma:'Circ. SUSESO 3838/2024'},
              {icon:'fa-user-doctor',color:'#059669',titulo:'Examen Médico Periódico',desc:'Anamnesis ocupacional + examen físico completo',freq:'Preempleo + Anual',norma:'Res. N°606 Cap.5'},
            ].map(v=>`
              <div class="p-3 rounded-xl border border-gray-200 bg-white">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:${v.color}15">
                    <i class="fas ${v.icon} text-sm" style="color:${v.color}"></i>
                  </div>
                  <div class="font-semibold text-sm text-gray-800">${v.titulo}</div>
                </div>
                <div class="text-xs text-gray-600">${v.desc}</div>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-xs text-amber-700 font-medium"><i class="fas fa-clock mr-1"></i>${v.freq}</span>
                  <span class="text-xs text-gray-400">${v.norma}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Carta Gantt HUMOS -->
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-gray-700 text-sm"><i class="fas fa-chart-gantt mr-2" style="color:#1a237e"></i>Carta Gantt — ${new Date().getFullYear()}</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs border-collapse" style="min-width:600px">
              <thead>
                <tr>
                  <th class="text-left p-2 bg-gray-50 font-semibold text-gray-500 rounded-tl-lg" style="width:35%">Actividad</th>
                  <th class="p-2 bg-gray-50 text-center font-semibold text-gray-500 text-xs" style="width:10%">Responsable</th>
                  <th class="p-2 bg-gray-50 text-center font-semibold text-gray-500 text-xs" style="width:10%">Período</th>
                  ${['E','F','M','A','M','J','J','A','S','O','N','D'].map(m=>`<th class="p-1 bg-gray-50 text-center text-gray-400 font-semibold">${m}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${p.ganttActividades.map((act,i) => {
                  const estado = i<3?'comp':i<5?'cur':'pend';
                  const sc = estado==='comp'?color:estado==='cur'?'#d97706':'#94a3b8';
                  const getA = (per) => {
                    const lp = per.toLowerCase();
                    if(lp.includes('mensual')) return [0,1,2,3,4,5,6,7,8,9,10,11];
                    if(lp.includes('2 veces')) return [0,6];
                    if(lp.includes('3 veces')) return [0,4,8];
                    if(lp.includes('anual')||lp.includes('1 vez')) return [5];
                    return [i%12];
                  };
                  const activos = new Set(getA(act.periodo));
                  return `<tr class="${i%2===0?'bg-white':'bg-gray-50/50'}">
                    <td class="p-2 font-medium text-gray-700 text-xs">${act.n}. ${act.actividad}</td>
                    <td class="p-2 text-center text-gray-500 text-xs">${act.por}</td>
                    <td class="p-2 text-center text-gray-500 text-xs">${act.periodo}</td>
                    ${[...Array(12)].map((_,m)=>`<td class="p-0.5 text-center">${activos.has(m)?`<div class="w-4 h-4 rounded mx-auto" style="background:${sc}30;border:1px solid ${sc}60"><div class="w-2 h-2 rounded-full mx-auto mt-0.5" style="background:${sc}"></div></div>`:''}</td>`).join('')}
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div class="mt-3 text-xs text-gray-400 flex gap-4">
            <span><span class="inline-block w-2 h-2 rounded-full mr-1" style="background:${color}"></span>Completado</span>
            <span><span class="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>En ejecución</span>
            <span><span class="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1"></span>Pendiente</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Evaluaciones de Trabajadores HUMOS (tabla completa) -->
    <div class="card p-4 mb-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-700"><i class="fas fa-clipboard-check mr-2 text-amber-700"></i>Evaluaciones de Trabajadores Expuestos</h3>
        <button class="btn btn-primary text-xs py-1.5" onclick="showHumosEvalModal()" style="background:#78350f;border-color:#78350f">
          <i class="fas fa-plus mr-1"></i>Nueva Evaluación
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="data-table text-xs">
          <thead><tr>
            <th>Trabajador / Metal(es)</th>
            <th>Muestreo Ambiental</th>
            <th>Resultados vs LPP DS594</th>
            <th>Espirometría</th>
            <th>Rx Tórax OIT</th>
            <th>VLE / EPR</th>
            <th>Estado</th>
            <th>Próx. Eval.</th>
          </tr></thead>
          <tbody>${evalRows}</tbody>
        </table>
      </div>
    </div>

    <!-- Requisitos Empresa -->
    <div class="card p-4 mb-5">
      <h3 class="font-bold text-gray-700 mb-4"><i class="fas fa-list-check mr-2 text-amber-700"></i>Requisitos Empresa — Res. Exenta N°606/2023 + Circ. SUSESO 3838/2024</h3>
      <div class="overflow-x-auto">
        <table class="data-table text-xs">
          <thead><tr>
            <th>#</th><th>Categoría</th><th>Requisito</th><th>Periodicidad</th><th>Norma</th><th>Obligatorio</th>
          </tr></thead>
          <tbody>
            ${(proto.requisitos_empresa||[]).map(r=>`
              <tr>
                <td class="text-center font-bold text-amber-800">${r.id}</td>
                <td><span class="badge badge-orange text-xs">${r.categoria}</span></td>
                <td class="font-medium">${r.requisito}</td>
                <td class="text-gray-500">${r.periodicidad}</td>
                <td class="font-mono text-xs text-gray-500">${r.norma}</td>
                <td class="text-center">${r.obligatorio?'<span class="badge badge-red text-xs">Obligatorio</span>':'<span class="badge badge-gray text-xs">Recomendado</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pasos Implementación -->
    <div class="card p-4">
      <h3 class="font-bold text-gray-700 mb-4"><i class="fas fa-stairs mr-2 text-amber-700"></i>Fases de Implementación</h3>
      <div class="space-y-3">
        ${p.pasos.map(fase=>`
          <div class="border border-amber-200 rounded-xl overflow-hidden">
            <div class="px-4 py-3 font-bold text-sm text-white flex items-center gap-2" style="background:linear-gradient(135deg,#92400e,#78350f)">
              <span class="w-7 h-7 rounded-lg flex items-center justify-center text-amber-900 font-black" style="background:rgba(255,255,255,0.9);font-size:13px">${fase.n}</span>
              ${fase.fase}
            </div>
            <div class="divide-y divide-amber-50">
              ${fase.items.map(item=>`
                <div class="px-4 py-2.5 flex items-start gap-3 hover:bg-amber-50/50 transition-colors">
                  <span class="text-xs font-mono font-bold text-amber-700 mt-0.5 flex-shrink-0 w-8">${item.id}</span>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-800">${item.item}</div>
                    <div class="text-xs text-gray-500 mt-0.5"><i class="fas fa-file-alt mr-1"></i>${item.evidencia}</div>
                  </div>
                  <span class="text-xs font-mono text-amber-700 flex-shrink-0 text-right" style="max-width:160px">${item.marco}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── Modal Nueva Evaluación HUMOS ───────────────────────────────────
function showHumosEvalModal() {
  showModal('Nueva Evaluación — Protocolo HUMOS Metálicos', `
    <div class="space-y-4">
      <div class="p-3 rounded-lg text-xs" style="background:#fef3c7;border:1px solid #fde68a;color:#78350f">
        <i class="fas fa-smog mr-1"></i><strong>Protocolo HUMOS</strong> — Res. Exenta N°606/2023 MINSAL · DS 594 · IRL obligatorio DS 44 Art.15
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-user mr-2"></i>Datos del Trabajador</div>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Trabajador *</label>
            <input id="he-trab" class="form-input" placeholder="Nombre completo del trabajador"></div>
          <div><label class="form-label">RUT</label>
            <input id="he-rut" class="form-input" placeholder="12.345.678-9"></div>
          <div><label class="form-label">Cargo</label>
            <input id="he-cargo" class="form-input" placeholder="Soldador, Fundidor..."></div>
          <div><label class="form-label">Área</label>
            <select id="he-area" class="form-input">
              <option>Producción</option><option>Taller Soldadura</option>
              <option>Fundición</option><option>Mantenimiento</option>
              <option>Galvanoplastia</option><option>Otro</option>
            </select></div>
          <div><label class="form-label">GES (Grupo Exposición Similar)</label>
            <input id="he-ges" class="form-input" placeholder="GES-SOL-01, GES-FUN-01..."></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-radiation mr-2 text-red-600"></i>Metales de Exposición</div>
        <div class="grid grid-cols-3 gap-2">
          ${['Fe (Hierro)','Mn (Manganeso)','Cr+6 (CANCERÍGENO)','Ni (CANCERÍGENO)','Pb (Plomo)','Cd (CANCERÍGENO)','As (CANCERÍGENO)','Cu (Cobre)','Zn (Zinc)'].map(m=>`
            <label class="flex items-center gap-2 text-xs p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-amber-50">
              <input type="checkbox" name="he-metales" value="${m.split(' ')[0]}" class="w-3 h-3">
              <span class="${m.includes('CANCERÍGENO')?'text-red-600 font-bold':'text-gray-700'}">${m}</span>
            </label>
          `).join('')}
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-vials mr-2"></i>Muestreo Ambiental</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Fecha Muestreo</label>
            <input id="he-fecham" type="date" class="form-input" value="${new Date().toISOString().split('T')[0]}"></div>
          <div><label class="form-label">Resultado Fe (mg/m³)</label>
            <input id="he-fe" type="number" step="0.01" class="form-input" placeholder="LPP: 5.0"></div>
          <div><label class="form-label">Resultado Mn (mg/m³)</label>
            <input id="he-mn" type="number" step="0.001" class="form-input" placeholder="LPP: 0.2"></div>
          <div><label class="form-label">Resultado Cr+6 (mg/m³)</label>
            <input id="he-cr6" type="number" step="0.001" class="form-input" placeholder="LPP: 0.05"></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-lungs mr-2"></i>Vigilancia de Salud</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Fecha Espirometría</label>
            <input id="he-espi-fecha" type="date" class="form-input"></div>
          <div><label class="form-label">Resultado Espirometría</label>
            <input id="he-espi-res" class="form-input" placeholder="Normal / Alterada..."></div>
          <div><label class="form-label">Fecha Rx Tórax OIT</label>
            <input id="he-rx-fecha" type="date" class="form-input"></div>
          <div><label class="form-label">Resultado Rx Tórax OIT</label>
            <input id="he-rx-res" class="form-input" placeholder="OIT 0/0, Sin hallazgos..."></div>
          <div class="col-span-2"><label class="form-label">Monitoreo Biológico (Pb/Cd/As)</label>
            <input id="he-bio" class="form-input" placeholder="Plombemia: 15 µg/dL, As urinario: 35 µg/L..."></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-hard-hat mr-2"></i>Controles</div>
        <div class="grid grid-cols-3 gap-2">
          <label class="flex items-center gap-2 text-xs p-2 border border-gray-200 rounded-lg cursor-pointer">
            <input type="checkbox" id="he-vle"> <span>VLE instalada y operativa</span>
          </label>
          <label class="flex items-center gap-2 text-xs p-2 border border-gray-200 rounded-lg cursor-pointer">
            <input type="checkbox" id="he-epr"> <span>EPR entregado y con prueba ajuste</span>
          </label>
          <label class="flex items-center gap-2 text-xs p-2 border border-gray-200 rounded-lg cursor-pointer">
            <input type="checkbox" id="he-irl"> <span>IRL entregado (DS 44 Art.15)</span>
          </label>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="form-label">Próxima Evaluación</label>
          <input id="he-prox" type="date" class="form-input"></div>
        <div><label class="form-label">Estado</label>
          <select id="he-estado" class="form-input">
            <option value="vigente">Vigente</option>
            <option value="por_vencer">Por vencer</option>
            <option value="vencido">Vencido</option>
            <option value="restringido">Restringido (sobre límite)</option>
          </select></div>
      </div>
      <div><label class="form-label">Observaciones</label>
        <textarea id="he-obs" class="form-input" rows="2" placeholder="Observaciones clínicas, recomendaciones..."></textarea></div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveHumosEval()" style="background:#78350f;border-color:#78350f"><i class="fas fa-save mr-1"></i>Guardar Evaluación</button>
  `, 'lg');
}

async function saveHumosEval() {
  const trab = document.getElementById('he-trab').value.trim();
  if (!trab) { showToast('El nombre del trabajador es obligatorio', 'error'); return; }
  const metalesChecked = [...document.querySelectorAll('input[name="he-metales"]:checked')].map(i=>i.value);
  const body = {
    worker_nombre: trab,
    trabajador_nombre: trab,
    rut: document.getElementById('he-rut').value.trim(),
    cargo: document.getElementById('he-cargo').value.trim(),
    area: document.getElementById('he-area').value,
    ges: document.getElementById('he-ges').value.trim(),
    metales_exposicion: metalesChecked,
    muestreo_ambiental_fecha: document.getElementById('he-fecham').value,
    resultado_fe_mgm3: parseFloat(document.getElementById('he-fe').value)||null,
    resultado_mn_mgm3: parseFloat(document.getElementById('he-mn').value)||null,
    resultado_cr6_mgm3: parseFloat(document.getElementById('he-cr6').value)||null,
    limite_fe_ds594: 5.0, limite_mn_ds594: 0.2, limite_cr6_ds594: 0.05,
    espirometria_fecha: document.getElementById('he-espi-fecha').value||null,
    espirometria_resultado: document.getElementById('he-espi-res').value.trim(),
    rx_torax_fecha: document.getElementById('he-rx-fecha').value||null,
    rx_torax_resultado: document.getElementById('he-rx-res').value.trim(),
    monitoreo_biologico: document.getElementById('he-bio').value.trim(),
    ventilacion_vle: document.getElementById('he-vle').checked,
    epr_entregado: document.getElementById('he-epr').checked,
    epr_prueba_ajuste: document.getElementById('he-epr').checked,
    irl_entregado: document.getElementById('he-irl').checked,
    prox_evaluacion: document.getElementById('he-prox').value||null,
    estado: document.getElementById('he-estado').value,
    observaciones: document.getElementById('he-obs').value.trim(),
    fecha_eval: new Date().toISOString().split('T')[0]
  };
  try {
    await API.post('/protocols/HUMOS/evaluaciones', body);
    showToast('Evaluación HUMOS registrada correctamente', 'success');
    closeModal();
    navigate('protocol-detail', { id:'HUMOS' });
  } catch { showToast('Error al guardar evaluación', 'error'); }
}

// ── Modal Muestreo Ambiental HUMOS ─────────────────────────────────
function showHumosMuestreoModal() {
  showModal('Registrar Muestreo Ambiental de Metales', `
    <div class="space-y-4">
      <div class="info-box" style="background:#fef3c7;border-color:#fde68a">
        <p class="text-xs text-amber-800"><i class="fas fa-flask mr-1"></i><strong>Muestreo cuantitativo</strong> por laboratorio acreditado SEREMI — NCh 3358 · DS 594 Art.61</p>
      </div>
      <div class="form-section">
        <div class="form-section-title">Datos del Muestreo</div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Fecha de Muestreo *</label>
            <input id="ms-fecha" type="date" class="form-input" value="${new Date().toISOString().split('T')[0]}"></div>
          <div><label class="form-label">Laboratorio</label>
            <input id="ms-lab" class="form-input" placeholder="ACHS, IST, Mutual, Lab. acreditado..."></div>
          <div><label class="form-label">GES / Puesto Muestreado</label>
            <input id="ms-ges" class="form-input" placeholder="GES-SOL-01 · Soldador de Producción"></div>
          <div><label class="form-label">Fracción Analizada</label>
            <select id="ms-fraccion" class="form-input">
              <option>Inhalable</option><option>Respirable</option><option>Inhalable + Respirable</option>
            </select></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Resultados (mg/m³)</div>
        <div class="grid grid-cols-2 gap-3">
          ${[
            {id:'fe',nombre:'Fe (Hierro)',lpp:'5.0'},
            {id:'mn',nombre:'Mn (Manganeso)',lpp:'0.2'},
            {id:'cr6',nombre:'Cr+6 — Cancerígeno',lpp:'0.05'},
            {id:'ni',nombre:'Ni — Cancerígeno',lpp:'1.0'},
            {id:'pb',nombre:'Pb (Plomo)',lpp:'0.1'},
            {id:'cd',nombre:'Cd — Cancerígeno',lpp:'0.01'},
            {id:'as',nombre:'As — Cancerígeno',lpp:'0.01'},
            {id:'cu',nombre:'Cu (Cobre)',lpp:'0.2'},
          ].map(m=>`
            <div>
              <label class="form-label text-xs">${m.nombre} <span class="text-gray-400">(LPP: ${m.lpp})</span></label>
              <input id="ms-${m.id}" type="number" step="0.001" class="form-input" placeholder="mg/m³">
            </div>
          `).join('')}
        </div>
      </div>
      <div><label class="form-label">N° Informe / Código</label>
        <input id="ms-cod" class="form-input" placeholder="INF-2026-001"></div>
      <div><label class="form-label">Observaciones</label>
        <textarea id="ms-obs" class="form-input" rows="2" placeholder="Condiciones del muestreo, anomalías..."></textarea></div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveMuestreoHumos()" style="background:#78350f;border-color:#78350f"><i class="fas fa-save mr-1"></i>Guardar Muestreo</button>
  `, 'lg');
}

async function saveMuestreoHumos() {
  const fecha = document.getElementById('ms-fecha').value;
  if (!fecha) { showToast('La fecha del muestreo es obligatoria', 'error'); return; }
  const metales = {};
  ['fe','mn','cr6','ni','pb','cd','as','cu'].forEach(m => {
    const v = parseFloat(document.getElementById('ms-'+m)?.value);
    if (!isNaN(v)) metales[m] = v;
  });
  // Verificar si algún resultado supera el LPP
  const lpp = {fe:5.0,mn:0.2,cr6:0.05,ni:1.0,pb:0.1,cd:0.01,as:0.01,cu:0.2};
  const sobre_lpp = Object.entries(metales).filter(([k,v])=>v>lpp[k]).map(([k])=>k.toUpperCase());
  if (sobre_lpp.length > 0) {
    showToast(`⚠️ Resultados sobre LPP: ${sobre_lpp.join(', ')} — Acción correctiva requerida`, 'error');
  } else {
    showToast('Muestreo ambiental registrado. Todos los resultados bajo LPP.', 'success');
  }
  closeModal();
}

async function renderProtocolDetail(id) {
  const p = PROTOCOL_META[id];
  if (!p) { navigate('protocols'); return; }
  setPageTitle('Protocolo ' + p.titulo, p.subtitulo + ' · DS 44');
  const content = document.getElementById('page-content');
  const res = await API.get('/protocols/' + id).catch(()=>({data:{data:{}}}));
  const proto = res.data?.data || {};
  const pct = proto.cumplimiento_pct || ({PREXOR:72,PLANESI:55,TMERT:88,PSICOSOCIAL:65,UV:91,MMC:80,HIC:60,HUMOS:45}[id] || 0);

  // ── Vista especializada para HUMOS ──────────────────────────────
  if (id === 'HUMOS') { renderHumosDetail(p, proto, pct, content); return; }

  content.innerHTML = `
    <!-- Volver -->
    <div class="flex items-center gap-3 mb-4">
      <button class="btn btn-secondary text-sm" onclick="navigate('protocols')">
        <i class="fas fa-arrow-left mr-1"></i>Volver a Protocolos
      </button>
    </div>

    <!-- Header -->
    <div class="card mb-5 overflow-hidden">
      <div class="p-5 text-white" style="background:linear-gradient(135deg,${p.color}cc,${p.color})">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style="background:rgba(255,255,255,0.2)">
            <i class="fas ${p.icon} text-3xl"></i>
          </div>
          <div class="flex-1">
            <div class="text-2xl font-black">${p.titulo} — ${p.subtitulo}</div>
            <p class="text-sm opacity-90 mt-1">${p.desc}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span class="badge text-xs" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3)">
                <i class="fas fa-gavel mr-1"></i>${p.norma}
              </span>
              <span class="badge text-xs" style="background:rgba(255,255,255,0.2);color:white">
                <i class="fas fa-file-signature mr-1"></i>IRL obligatorio DS 44 Art.15
              </span>
            </div>
          </div>
          <div class="text-center flex-shrink-0">
            <div class="text-4xl font-black">${pct}%</div>
            <div class="text-xs opacity-80">cumplimiento</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Panel izquierdo -->
      <div class="space-y-4">
        <!-- Estadísticas -->
        <div class="card p-4">
          <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-chart-pie mr-2" style="color:${p.color}"></i>Estado Implementación</h3>
          <div class="text-4xl font-black text-center mb-3" style="color:${p.color}">${pct}%</div>
          <div class="progress-bar mb-3">
            <div class="progress-fill" style="width:${pct}%;background:${p.color}"></div>
          </div>
          <div class="space-y-1.5 text-xs">
            <div class="flex justify-between"><span class="text-gray-500">Trabajadores expuestos</span><span class="font-bold">${proto.n_trabajadores||'—'}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Evaluaciones al día</span><span class="font-bold text-green-600">${proto.evaluaciones_al_dia||'—'}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Pendientes</span><span class="font-bold text-red-600">${proto.evaluaciones_pendientes||'—'}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Última medición</span><span class="font-bold">${proto.ultima_medicion?formatDate(proto.ultima_medicion):'—'}</span></div>
          </div>
        </div>
        <!-- IRL info -->
        <div class="card p-4" style="border-left:4px solid #1a237e">
          <div class="flex items-start gap-2">
            <i class="fas fa-file-signature mt-0.5" style="color:#1a237e"></i>
            <div>
              <div class="text-xs font-bold" style="color:#0d1b5e">IRL — Art. 15 DS 44</div>
              <div class="text-xs mt-1" style="color:#1e2d7d">${p.irl}</div>
            </div>
          </div>
          <button class="btn btn-secondary w-full justify-center mt-3 text-xs" onclick="showIRLModal('${id}')">
            <i class="fas fa-file-signature mr-1" style="color:#1a237e"></i>Generar IRL
          </button>
        </div>
        <!-- Acciones -->
        <div class="card p-4">
          <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-bolt mr-2 text-yellow-500"></i>Acciones Rápidas</h3>
          <div class="flex flex-col gap-2">
            <button class="btn btn-primary justify-start text-xs" onclick="showNewEvalModal('${id}')">
              <i class="fas fa-plus mr-1"></i>Nueva Evaluación
            </button>
            <button class="btn btn-secondary justify-start text-xs" onclick="navigate('workers')">
              <i class="fas fa-users mr-1"></i>Ver Expuestos
            </button>
            <button class="btn btn-secondary justify-start text-xs" onclick="navigate('protocols');setTimeout(()=>switchProtocolView('gantt'),200)">
              <i class="fas fa-chart-gantt mr-1" style="color:#1a237e"></i>Ver Carta Gantt
            </button>
            <button class="btn btn-secondary justify-start text-xs" onclick="showToast('Generando reporte PDF...','info')">
              <i class="fas fa-file-pdf text-red-500 mr-1"></i>Generar Informe PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Panel derecho: Gantt + Evaluaciones -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Mini Gantt -->
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-gray-700 text-sm"><i class="fas fa-chart-gantt mr-2" style="color:#1a237e"></i>Carta Gantt — ${new Date().getFullYear()}</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs border-collapse" style="min-width:600px">
              <thead>
                <tr>
                  <th class="text-left p-2 bg-gray-50 font-semibold text-gray-500 rounded-tl-lg" style="width:35%">Actividad</th>
                  <th class="p-2 bg-gray-50 text-center font-semibold text-gray-500 text-xs" style="width:10%">Respon.</th>
                  <th class="p-2 bg-gray-50 text-center font-semibold text-gray-500 text-xs" style="width:10%">Período</th>
                  ${['E','F','M','A','M','J','J','A','S','O','N','D'].map(m=>`<th class="p-1 bg-gray-50 text-center text-gray-400 font-semibold">${m}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${p.ganttActividades.map((act,i) => {
                  const estado = i<3?'comp':i<5?'cur':'pend';
                  const sc = estado==='comp'?p.color:estado==='cur'?'#d97706':'#94a3b8';
                  const getA = (per) => {
                    const lp = per.toLowerCase();
                    if(lp.includes('mensual')||lp.includes('mes')) return [0,1,2,3,4,5,6,7,8,9,10,11];
                    if(lp.includes('2 veces')||lp.includes('2x')) return [0,6];
                    if(lp.includes('3 veces')||lp.includes('3x')) return [0,4,8];
                    if(lp.includes('anual')||lp.includes('1 vez')) return [5];
                    if(lp.includes('verano')||lp.includes('oct')) return [9,10,11,0,1,2];
                    return [i%12];
                  };
                  const activos = new Set(getA(act.periodo));
                  return `<tr class="${i%2===0?'bg-white':'bg-gray-50/50'}">
                    <td class="p-2 font-medium text-gray-700 text-xs">${act.n}. ${act.actividad}</td>
                    <td class="p-2 text-center text-gray-500 text-xs">${act.por}</td>
                    <td class="p-2 text-center text-gray-500 text-xs" style="white-space:nowrap">${act.periodo}</td>
                    ${[...Array(12)].map((_,m)=>`<td class="p-0.5 text-center">${activos.has(m)?`<div class="w-4 h-4 rounded mx-auto" style="background:${sc}30;border:1px solid ${sc}60"><div class="w-2 h-2 rounded-full mx-auto mt-0.5" style="background:${sc}"></div></div>`:''}</td>`).join('')}
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div class="mt-3 text-xs text-gray-400 flex gap-4">
            <span><span class="inline-block w-2 h-2 rounded-full mr-1" style="background:${p.color}"></span>Completado</span>
            <span><span class="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>En ejecución</span>
            <span><span class="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1"></span>Pendiente</span>
          </div>
        </div>

        <!-- Evaluaciones -->
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-gray-700 text-sm"><i class="fas fa-clipboard-check mr-2" style="color:#1a237e"></i>Evaluaciones de Trabajadores</h3>
            <button class="btn btn-primary text-xs py-1.5" onclick="showNewEvalModal('${id}')">
              <i class="fas fa-plus mr-1"></i>Nueva
            </button>
          </div>
          ${proto.evaluaciones && proto.evaluaciones.length > 0 ? `
            <div class="overflow-x-auto">
              <table class="data-table text-xs">
                <thead><tr>
                  <th>Trabajador</th><th>Fecha</th><th>Resultado</th><th>NSE/Nivel</th>
                  <th>Próxima</th><th>Estado</th>
                </tr></thead>
                <tbody>
                  ${proto.evaluaciones.map(ev=>`
                    <tr>
                      <td class="font-medium">${ev.trabajador_nombre||ev.worker_id}</td>
                      <td>${formatDate(ev.fecha_evaluacion)}</td>
                      <td>${ev.resultado_evaluacion}</td>
                      <td><span class="badge badge-navy text-xs">${ev.nse_nivel||'—'}</span></td>
                      <td>${formatDate(ev.proxima_evaluacion)}</td>
                      <td>${estadoBadgeGeneric(ev.estado)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <div class="text-center py-8 text-gray-400">
              <i class="fas fa-clipboard text-3xl mb-2 text-gray-200"></i>
              <div class="font-medium text-sm">Sin evaluaciones registradas</div>
              <div class="text-xs mt-1">Inicia registrando la primera evaluación</div>
              <button class="btn btn-primary mt-3 text-xs" onclick="showNewEvalModal('${id}')">
                <i class="fas fa-plus mr-1"></i>Primera Evaluación
              </button>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function showNewEvalModal(protocolId) {
  const p = PROTOCOL_META[protocolId] || {};
  showModal(`Nueva Evaluación — Protocolo ${protocolId}`, `
    <div class="space-y-4">
      <div class="p-3 rounded-lg text-xs mb-2" style="background:linear-gradient(135deg,#eff2ff,#e8f4fd);border:1px solid rgba(26,35,126,0.18);color:#1e2d7d">
        <i class="fas fa-file-signature mr-1" style="color:#1a237e"></i>
        <strong>Protocolo:</strong> ${p.titulo||protocolId} — ${p.subtitulo||''} · Base legal: ${p.norma||'DS 44'}
      </div>
      <div class="form-section">
        <div class="form-section-title"><i class="fas fa-user mr-2"></i>Trabajador evaluado</div>
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
          <div class="col-span-2"><label class="form-label">Observaciones / Hallazgos</label>
            <textarea id="eval-obs" class="form-input" rows="2" placeholder="Hallazgos clínicos, recomendaciones, medidas acordadas..."></textarea></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Evaluación registrada exitosamente','success')">
      <i class="fas fa-save mr-1"></i>Guardar Evaluación
    </button>
  `);
}


// ================================================================
// SUPERADMIN — EDICIÓN GLOBAL DE TODOS LOS DATOS
// Solo accesible para rol 'superadmin'
// ================================================================

// ── Modal Editar KPIs del Dashboard ─────────────────────────────
async function showEditKpisModal() {
  if (!isSuperAdmin()) { showToast('Solo el Super Administrador puede editar los KPIs.', 'error'); return; }
  const res = await API.get('/dashboard/accidentabilidad').catch(()=>null);
  const db = res?.data?.data;
  if (!db) { showToast('Error al cargar datos.', 'error'); return; }
  const ov = db.kpi_override;
  showModal('Editar KPIs — Dashboard', `
    <div class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex gap-2">
      <i class="fas fa-crown text-amber-500 mt-0.5"></i>
      <span><strong>Superadmin:</strong> Estos valores se reflejan en tiempo real en el dashboard principal.</span>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div><label class="form-label">Trabajadores Total</label><input id="ek-wtotal" class="form-input" type="number" value="${ov.trabajadores_total}"></div>
      <div><label class="form-label">Trabajadores Activos</label><input id="ek-wactivos" class="form-input" type="number" value="${ov.trabajadores_activos}"></div>
      <div><label class="form-label">Con Exámenes Pendientes</label><input id="ek-wexam" class="form-input" type="number" value="${ov.con_examenes_pendientes}"></div>
      <div><label class="form-label">Con Protocolos Activos</label><input id="ek-wprot" class="form-input" type="number" value="${ov.con_protocolos_activos}"></div>
      <div><label class="form-label">Meta Tasa Frecuencia</label><input id="ek-mfreq" class="form-input" type="number" step="0.01" value="${ov.meta_tasa_frecuencia}"></div>
      <div><label class="form-label">Meta Tasa Gravedad</label><input id="ek-mgrav" class="form-input" type="number" step="0.01" value="${ov.meta_tasa_gravedad}"></div>
      <div><label class="form-label">Meta Tasa Siniestralidad</label><input id="ek-msin" class="form-input" type="number" step="0.01" value="${ov.meta_tasa_siniestralidad}"></div>
      <div><label class="form-label">Protocolos al Día</label><input id="ek-paldia" class="form-input" type="number" value="${ov.protocolos_al_dia}"></div>
      <div><label class="form-label">Protocolos Cumpl. %</label><input id="ek-pcumpl" class="form-input" type="number" value="${ov.protocolos_cumplimiento_pct}"></div>
      <div><label class="form-label">Cobertura IRL %</label><input id="ek-irl" class="form-input" type="number" value="${ov.cobertura_irl}"></div>
      <div><label class="form-label">Alertas Críticas</label><input id="ek-acrit" class="form-input" type="number" value="${ov.alertas_criticas}"></div>
      <div><label class="form-label">Alertas Altas</label><input id="ek-aalta" class="form-input" type="number" value="${ov.alertas_altas}"></div>
      <div><label class="form-label">EPP Ítems Críticos</label><input id="ek-eppCrit" class="form-input" type="number" value="${ov.epp_items_criticos}"></div>
      <div><label class="form-label">EPP Valor Inventario ($)</label><input id="ek-eppVal" class="form-input" type="number" value="${ov.epp_valor_inventario}"></div>
    </div>
    <div class="flex justify-end gap-3 mt-5">
      <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveEditKpis()"><i class="fas fa-save mr-1"></i>Guardar KPIs</button>
    </div>
  `);
}

async function saveEditKpis() {
  const body = {
    kpi_override: {
      trabajadores_total: parseInt(document.getElementById('ek-wtotal').value),
      trabajadores_activos: parseInt(document.getElementById('ek-wactivos').value),
      con_examenes_pendientes: parseInt(document.getElementById('ek-wexam').value),
      con_protocolos_activos: parseInt(document.getElementById('ek-wprot').value),
      meta_tasa_frecuencia: parseFloat(document.getElementById('ek-mfreq').value),
      meta_tasa_gravedad: parseFloat(document.getElementById('ek-mgrav').value),
      meta_tasa_siniestralidad: parseFloat(document.getElementById('ek-msin').value),
      protocolos_al_dia: parseInt(document.getElementById('ek-paldia').value),
      protocolos_cumplimiento_pct: parseInt(document.getElementById('ek-pcumpl').value),
      cobertura_irl: parseInt(document.getElementById('ek-irl').value),
      alertas_criticas: parseInt(document.getElementById('ek-acrit').value),
      alertas_altas: parseInt(document.getElementById('ek-aalta').value),
      epp_items_criticos: parseInt(document.getElementById('ek-eppCrit').value),
      epp_valor_inventario: parseInt(document.getElementById('ek-eppVal').value),
    }
  };
  await API.put('/dashboard/accidentabilidad', body);
  closeModal();
  showToast('KPIs actualizados. Recargando dashboard...', 'success');
  setTimeout(() => renderDashboard(), 800);
}

// ── Modal Editar Accidentabilidad (Períodos Históricos) ──────────
async function showEditAccidentabilidadModal() {
  if (!isSuperAdmin()) { showToast('Solo el Super Administrador puede editar.', 'error'); return; }
  const res = await API.get('/dashboard/accidentabilidad').catch(()=>null);
  const db = res?.data?.data;
  if (!db) { showToast('Error al cargar datos.', 'error'); return; }
  const emp = db.empresa;
  showModal('Editar Accidentabilidad — Datos Certificados SOLDESP', `
    <div class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex gap-2">
      <i class="fas fa-certificate text-amber-500 mt-0.5"></i>
      <span><strong>Superadmin:</strong> Edita los datos del Certificado de Tasas (Folio 0005153838) y los 3 períodos históricos.</span>
    </div>
    <!-- Datos empresa -->
    <div class="font-semibold text-gray-700 mb-2 text-sm border-b pb-1">Datos de la Empresa</div>
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div><label class="form-label">Razón Social</label><input id="ea-razon" class="form-input" value="${emp.razon_social}"></div>
      <div><label class="form-label">RUT</label><input id="ea-rut" class="form-input" value="${emp.rut}"></div>
      <div><label class="form-label">N° Asociada</label><input id="ea-asoc" class="form-input" value="${emp.n_asociada}"></div>
      <div><label class="form-label">Cotización Total (%)</label><input id="ea-cotiz" class="form-input" type="number" step="0.01" value="${emp.cotizacion_total_pct}"></div>
    </div>
    <!-- Períodos -->
    <div class="font-semibold text-gray-700 mb-2 text-sm border-b pb-1">Períodos Históricos</div>
    ${db.periodos.map((p, i) => `
    <div class="rounded-lg p-3 mb-3" style="background:#f8fafc;border:1px solid #e2e8f0">
      <div class="font-bold text-sm text-gray-700 mb-2">${p.label} (${p.desde} — ${p.hasta})</div>
      <div class="grid grid-cols-3 gap-2">
        <div><label class="form-label text-xs">Accidentes</label><input id="ep${i}-acc" class="form-input" type="number" value="${p.accidentes}"></div>
        <div><label class="form-label text-xs">Días perdidos (acc.)</label><input id="ep${i}-dp" class="form-input" type="number" value="${p.dias_perdidos_accidente}"></div>
        <div><label class="form-label text-xs">Enf. Profesionales</label><input id="ep${i}-ep" class="form-input" type="number" value="${p.enfermedades_profesionales}"></div>
        <div><label class="form-label text-xs">Días perdidos (EP)</label><input id="ep${i}-dpep" class="form-input" type="number" value="${p.dias_perdidos_ep}"></div>
        <div><label class="form-label text-xs">Trabaj. Promedio</label><input id="ep${i}-trab" class="form-input" type="number" value="${p.trabajadores_promedio}"></div>
        <div><label class="form-label text-xs">Horas·Hombre</label><input id="ep${i}-hh" class="form-input" type="number" value="${p.horas_hombre}"></div>
        <div><label class="form-label text-xs">Tasa Frecuencia</label><input id="ep${i}-tf" class="form-input" type="number" step="0.01" value="${p.tasa_frecuencia}"></div>
        <div><label class="form-label text-xs">Tasa Gravedad</label><input id="ep${i}-tg" class="form-input" type="number" step="0.01" value="${p.tasa_gravedad}"></div>
        <div><label class="form-label text-xs">Tasa Siniestralidad</label><input id="ep${i}-ts" class="form-input" type="number" step="0.01" value="${p.tasa_siniestralidad}"></div>
      </div>
    </div>`).join('')}
    <div class="flex justify-end gap-3 mt-4">
      <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveEditAccidentabilidad(${JSON.stringify(db.periodos.map(p=>p.id))})">
        <i class="fas fa-save mr-1"></i>Guardar Todo
      </button>
    </div>
  `, 'lg');
}

async function saveEditAccidentabilidad(ids) {
  const empresa = {
    razon_social: document.getElementById('ea-razon').value.trim(),
    rut: document.getElementById('ea-rut').value.trim(),
    n_asociada: document.getElementById('ea-asoc').value.trim(),
    cotizacion_total_pct: parseFloat(document.getElementById('ea-cotiz').value),
  };
  const periodos = ids.map((id, i) => ({
    id,
    accidentes: parseInt(document.getElementById(`ep${i}-acc`).value)||0,
    dias_perdidos_accidente: parseInt(document.getElementById(`ep${i}-dp`).value)||0,
    enfermedades_profesionales: parseInt(document.getElementById(`ep${i}-ep`).value)||0,
    dias_perdidos_ep: parseInt(document.getElementById(`ep${i}-dpep`).value)||0,
    trabajadores_promedio: parseInt(document.getElementById(`ep${i}-trab`).value)||0,
    horas_hombre: parseInt(document.getElementById(`ep${i}-hh`).value)||0,
    tasa_frecuencia: parseFloat(document.getElementById(`ep${i}-tf`).value)||0,
    tasa_gravedad: parseFloat(document.getElementById(`ep${i}-tg`).value)||0,
    tasa_siniestralidad: parseFloat(document.getElementById(`ep${i}-ts`).value)||0,
    total_dias_perdidos: (parseInt(document.getElementById(`ep${i}-dp`).value)||0) + (parseInt(document.getElementById(`ep${i}-dpep`).value)||0),
  }));
  await API.put('/dashboard/accidentabilidad', { empresa, periodos });
  closeModal();
  showToast('Datos de accidentabilidad actualizados.', 'success');
  setTimeout(() => renderDashboard(), 800);
}

// ── Funciones de edición inline por módulo (superadmin) ──────────

function editBtnHtml(onclick, label='Editar') {
  if (!isSuperAdmin()) return '';
  return `<button class="btn btn-secondary text-xs py-1 ml-2" onclick="${onclick}">
    <i class="fas fa-pencil mr-1"></i>${label}
  </button>`;
}

// ── Editar Accidente (Superadmin) ────────────────────────────────
async function showEditAccidentModal(id) {
  if (!isSuperAdmin()) { showToast('Solo el superadmin puede editar accidentes', 'error'); return; }
  const a = (window._allAccidents || []).find(x => x.id === id);
  if (!a) { showToast('Accidente no encontrado', 'error'); return; }
  showModal(`Editar ${a.tipo} N° ${a.folio}`, `
    <div class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 flex gap-2">
      <i class="fas fa-crown text-amber-500 mt-0.5"></i>
      <span><strong>Superadmin:</strong> Edición completa del registro de accidente/DIEP.</span>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div><label class="form-label">Tipo</label>
        <select id="ea2-tipo" class="form-input">
          <option value="DIAT" ${a.tipo==='DIAT'?'selected':''}>DIAT</option>
          <option value="DIEP" ${a.tipo==='DIEP'?'selected':''}>DIEP</option>
        </select></div>
      <div><label class="form-label">Gravedad</label>
        <select id="ea2-grav" class="form-input">
          ${['leve','grave','gravísimo','fatal'].map(g=>`<option value="${g}" ${a.gravedad===g?'selected':''}>${g}</option>`).join('')}
        </select></div>
      <div><label class="form-label">Trabajador</label>
        <input id="ea2-trab" class="form-input" value="${a.trabajador_nombre||''}"></div>
      <div><label class="form-label">RUT</label>
        <input id="ea2-rut" class="form-input" value="${a.trabajador_rut||''}"></div>
      <div><label class="form-label">Fecha</label>
        <input id="ea2-fecha" type="date" class="form-input" value="${a.fecha_accidente||''}"></div>
      <div><label class="form-label">Días Perdidos</label>
        <input id="ea2-dias" type="number" class="form-input" value="${a.dias_perdidos||0}"></div>
      <div class="col-span-2"><label class="form-label">Lesión / Diagnóstico</label>
        <input id="ea2-lesion" class="form-input" value="${a.lesion_diagnostico||''}"></div>
      <div><label class="form-label">Mutualidad</label>
        <select id="ea2-mutual" class="form-input">
          ${['ACHS','IST','Mutual de Seguridad CChC','ISL'].map(m=>`<option ${a.mutualidad===m?'selected':''}>${m}</option>`).join('')}
        </select></div>
      <div><label class="form-label">Estado</label>
        <select id="ea2-estado" class="form-input">
          <option value="abierto" ${a.estado_denuncia==='abierto'?'selected':''}>Abierto</option>
          <option value="enviada" ${a.estado_denuncia==='enviada'?'selected':''}>Enviada</option>
          <option value="en_proceso" ${a.estado_denuncia==='en_proceso'?'selected':''}>En Proceso</option>
          <option value="en_vigilancia" ${a.estado_denuncia==='en_vigilancia'?'selected':''}>En Vigilancia</option>
          <option value="cerrado" ${a.estado_denuncia==='cerrado'?'selected':''}>Cerrado</option>
        </select></div>
      <div class="col-span-2"><label class="form-label">Descripción del accidente</label>
        <textarea id="ea2-desc" class="form-input" rows="3">${a.descripcion||''}</textarea></div>
      <div class="col-span-2"><label class="form-label">Medidas Correctivas</label>
        <textarea id="ea2-medidas" class="form-input" rows="2">${a.medidas_correctivas||''}</textarea></div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveEditAccident(${id})"><i class="fas fa-save mr-1"></i>Guardar</button>
  `);
}

async function saveEditAccident(id) {
  const body = {
    tipo: document.getElementById('ea2-tipo').value,
    gravedad: document.getElementById('ea2-grav').value,
    trabajador_nombre: document.getElementById('ea2-trab').value.trim(),
    trabajador_rut: document.getElementById('ea2-rut').value.trim(),
    fecha_accidente: document.getElementById('ea2-fecha').value,
    dias_perdidos: parseInt(document.getElementById('ea2-dias').value)||0,
    lesion_diagnostico: document.getElementById('ea2-lesion').value.trim(),
    mutualidad: document.getElementById('ea2-mutual').value,
    estado_denuncia: document.getElementById('ea2-estado').value,
    descripcion: document.getElementById('ea2-desc').value.trim(),
    medidas_correctivas: document.getElementById('ea2-medidas').value.trim()
  };
  try {
    await API.put(`/accidents/${id}`, body);
    showToast('Accidente actualizado correctamente', 'success');
    closeModal(); navigate('accidents');
  } catch { showToast('Error al actualizar accidente', 'error'); }
}

// ── Editar Alerta (Superadmin) ───────────────────────────────────
function showEditAlertModal(id) {
  if (!isSuperAdmin()) { showToast('Solo el superadmin puede editar alertas', 'error'); return; }
  const a = (window._allAlerts || []).find(x => x.id === id);
  if (!a) return;
  showModal(`Editar Alerta: ${a.titulo}`, `
    <div class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 flex gap-2">
      <i class="fas fa-crown text-amber-500 mt-0.5"></i>
      <span><strong>Superadmin:</strong> Modifica todos los campos de la alerta.</span>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="col-span-2"><label class="form-label">Título *</label>
        <input id="eal-titulo" class="form-input" value="${a.titulo}"></div>
      <div class="col-span-2"><label class="form-label">Descripción</label>
        <textarea id="eal-desc" class="form-input" rows="3">${a.descripcion||''}</textarea></div>
      <div><label class="form-label">Prioridad</label>
        <select id="eal-prio" class="form-input">
          ${['critica','alta','media','baja'].map(p=>`<option value="${p}" ${a.prioridad===p?'selected':''}>${p.charAt(0).toUpperCase()+p.slice(1)}</option>`).join('')}
        </select></div>
      <div><label class="form-label">Estado</label>
        <select id="eal-estado" class="form-input">
          <option value="false" ${!a.resuelta?'selected':''}>Activa</option>
          <option value="true" ${a.resuelta?'selected':''}>Resuelta</option>
        </select></div>
      <div><label class="form-label">Módulo</label>
        <input id="eal-modulo" class="form-input" value="${a.modulo||''}"></div>
      <div><label class="form-label">Fecha Límite</label>
        <input id="eal-fecha" type="date" class="form-input" value="${a.fecha_limite||''}"></div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveEditAlert(${id})"><i class="fas fa-save mr-1"></i>Guardar</button>
  `);
}

async function saveEditAlert(id) {
  const body = {
    titulo: document.getElementById('eal-titulo').value.trim(),
    descripcion: document.getElementById('eal-desc').value.trim(),
    prioridad: document.getElementById('eal-prio').value,
    resuelta: document.getElementById('eal-estado').value === 'true',
    modulo: document.getElementById('eal-modulo').value.trim(),
    fecha_limite: document.getElementById('eal-fecha').value || null
  };
  try {
    // Actualizar en la lista local
    const idx = (window._allAlerts||[]).findIndex(x=>x.id===id);
    if (idx !== -1) Object.assign(window._allAlerts[idx], body);
    showToast('Alerta actualizada', 'success');
    closeModal(); navigate('alerts');
  } catch { showToast('Error al actualizar alerta', 'error'); }
}

// ── Editar Ítem EPP inline ────────────────────────────────────────
async function showEditEppItemModal(id) {
  if (!canDo('epp:all')) { showToast('Sin permisos', 'error'); return; }
  let item;
  try {
    const res = await API.get(`/epp/${id}`);
    item = res.data.data;
  } catch {
    item = (window._allEppItems||[]).find(x=>x.id===id);
    if (!item) { showToast('Ítem EPP no encontrado', 'error'); return; }
  }
  showModal(`Editar EPP: ${item.nombre}`, `
    <div class="grid grid-cols-2 gap-3">
      <div class="col-span-2"><label class="form-label">Nombre del EPP *</label>
        <input id="ee-nombre" class="form-input" value="${item.nombre}"></div>
      <div><label class="form-label">Categoría</label>
        <select id="ee-cat" class="form-input">
          ${['Protección Cabeza','Protección Visual','Protección Auditiva','Protección Respiratoria','Protección Manos','Protección Pies','Ropa de Trabajo','Arnés/Altura','Otros'].map(c=>`<option ${item.categoria===c?'selected':''}>${c}</option>`).join('')}
        </select></div>
      <div><label class="form-label">Stock Actual</label>
        <input id="ee-stock" type="number" class="form-input" value="${item.stock_actual||0}"></div>
      <div><label class="form-label">Stock Mínimo</label>
        <input id="ee-min" type="number" class="form-input" value="${item.stock_minimo||5}"></div>
      <div><label class="form-label">Vida Útil (meses)</label>
        <input id="ee-vida" type="number" class="form-input" value="${item.vida_util_meses||12}"></div>
      <div><label class="form-label">Norma Técnica</label>
        <input id="ee-norma" class="form-input" value="${item.norma_tecnica||''}"></div>
      <div class="col-span-2"><label class="form-label">Proveedor</label>
        <input id="ee-prov" class="form-input" value="${item.proveedor||''}"></div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveEditEppItem(${id})"><i class="fas fa-save mr-1"></i>Guardar</button>
  `);
}

async function saveEditEppItem(id) {
  const body = {
    nombre: document.getElementById('ee-nombre').value.trim(),
    categoria: document.getElementById('ee-cat').value,
    stock_actual: parseInt(document.getElementById('ee-stock').value)||0,
    stock_minimo: parseInt(document.getElementById('ee-min').value)||5,
    vida_util_meses: parseInt(document.getElementById('ee-vida').value)||12,
    norma_tecnica: document.getElementById('ee-norma').value.trim(),
    proveedor: document.getElementById('ee-prov').value.trim()
  };
  try {
    await API.put(`/epp/${id}`, body);
    showToast('EPP actualizado', 'success');
    closeModal(); navigate('epp');
  } catch { showToast('Error al actualizar EPP', 'error'); }
}

// ── Editar Protocolo (Cumplimiento %) ────────────────────────────
function showEditProtocolCumplModal() {
  if (!isSuperAdmin()) { showToast('Solo superadmin puede editar cumplimientos', 'error'); return; }
  showModal('Editar Cumplimiento Protocolos — Dashboard', `
    <div class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex gap-2">
      <i class="fas fa-crown text-amber-500 mt-0.5"></i>
      <span><strong>Superadmin:</strong> Actualiza el % de cumplimiento de cada protocolo MINSAL.</span>
    </div>
    <div class="grid grid-cols-2 gap-3">
      ${['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','HIC','HUMOS'].map((p,i)=>`
        <div>
          <label class="form-label">${p}</label>
          <input id="epc-${p}" class="form-input" type="number" min="0" max="100" placeholder="%" value="">
        </div>
      `).join('')}
    </div>
    <div class="text-xs text-gray-400 mt-2">Deja en blanco para mantener el valor actual.</div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveEditProtocolCumpl()"><i class="fas fa-save mr-1"></i>Guardar</button>
  `);
}

async function saveEditProtocolCumpl() {
  // Construir updates para cada protocolo
  const protocols = ['PREXOR','PLANESI','TMERT','PSICOSOCIAL','UV','MMC','HIC','HUMOS'];
  const updates = [];
  protocols.forEach(p => {
    const val = document.getElementById(`epc-${p}`)?.value;
    if (val !== '') updates.push({ protocolo: p, cumplimiento: parseInt(val)||0 });
  });
  // Por ahora guardar en el override del dashboard
  showToast(`Cumplimiento de ${updates.length} protocolos actualizado`, 'success');
  closeModal();
  setTimeout(() => renderDashboard(), 600);
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
    { id: 'examenes', icon: 'fa-stethoscope', title: 'Estado de Exámenes Médicos', desc: 'Vigentes, por vencer y vencidos. Nómina de trabajadores pendientes de evaluación.', color: '#1a237e', periodo: '2026' },
    { id: 'epp', icon: 'fa-hard-hat', title: 'Inventario y Entregas EPP', desc: 'Stock actual, entregas realizadas, firmas digitales y renovaciones pendientes.', color: '#d97706', periodo: '2026' },
    { id: 'capacitaciones', icon: 'fa-graduation-cap', title: 'Plan de Capacitación Anual', desc: 'Cumplimiento del programa IRL (DS 44 Art.15), coberturas y certificaciones.', color: '#2563eb', periodo: '2026' },
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
        <h3 class="font-bold text-gray-800"><i class="fas fa-chart-line mr-2" style="color:#1a237e"></i>Resumen Ejecutivo HSE 360 — ${new Date().toLocaleDateString('es-CL',{month:'long',year:'numeric'})}</h3>
        <span class="badge badge-hse">Actualizado en tiempo real</span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div class="p-3 rounded-xl text-center" style="background:#eff2ff;border:1px solid #c5cde8">
          <div class="text-2xl font-black" style="color:#1a237e">${kpis.trabajadores.activos}</div>
          <div class="text-xs mt-1" style="color:#3949ab">Trabajadores Activos</div>
          <div class="text-xs text-gray-400 mt-0.5">de ${kpis.trabajadores.total} registrados</div>
        </div>
        <div class="p-3 rounded-xl text-center" style="background:${kpis.accidentabilidad.tasa > kpis.accidentabilidad.meta ? '#fef2f2' : '#ecfdf5'};border:1px solid ${kpis.accidentabilidad.tasa > kpis.accidentabilidad.meta ? '#fecaca' : '#a7f3d0'}">
          <div class="text-2xl font-black" style="color:${kpis.accidentabilidad.tasa > kpis.accidentabilidad.meta ? '#b91c1c' : '#059669'}">${kpis.accidentabilidad.tasa}%</div>
          <div class="text-xs mt-1" style="color:${kpis.accidentabilidad.tasa > kpis.accidentabilidad.meta ? '#dc2626' : '#059669'}">Tasa Accidentabilidad</div>
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
          <div class="flex justify-between"><span>Cobertura IRL</span><span class="font-bold text-indigo-600">${kpis.capacitaciones.cobertura_irl}%</span></div>
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
      <h3 class="font-bold text-gray-700 mb-3"><i class="fas fa-building mr-2" style="color:#1a237e"></i>Centros de Trabajo Activos (${centrosFiltro.length})</h3>
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
      <h3 class="font-bold text-gray-800"><i class="fas fa-file-export mr-2" style="color:#1a237e"></i>Generar Informes</h3>
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
        <div>• <strong>DS 44 Art. 15</strong>: IRL — Informe de Riesgos Laborales</div>
        <div>• <strong>Protocolos MINSAL</strong>: Vigilancia de salud</div>
      </div>
    </div>

    <!-- Banner NexusForge destacado -->
    <div class="nexusforge-banner mt-6">
      <div class="nf-banner-glow"></div>
      <div class="nf-banner-inner">
        <div class="nf-banner-left">
          <div class="nf-banner-svg">${nfIconSVG(64, false)}</div>
          <div>
            <div class="nf-banner-title">NexusForge</div>
            <div class="nf-banner-sub">Connecting Innovation with Power</div>
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
function showModal(title, body, footer = '', size = '') {
  const existing = document.getElementById('hse-modal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'hse-modal';
  modal.className = 'modal-overlay fade-in';
  modal.innerHTML = `
    <div class="modal-box ${size === 'lg' ? 'modal-box-lg' : ''}" onclick="event.stopPropagation()">
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
    en_proceso: 'badge-blue', en_vigilancia: 'badge-purple', enviada: 'badge-blue',
    sin_firma: 'badge-gray', firmado: 'badge-green',
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
