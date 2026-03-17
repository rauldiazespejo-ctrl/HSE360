// ============================================================
// SaludTrabajo Chile - SPA Application
// Sistema Integral de Salud Ocupacional y Prevención de Riesgos
// ============================================================

const API = axios.create({ baseURL: '/api' });

// ============================================================
// APP STATE
// ============================================================
const App = {
  currentView: 'dashboard',
  currentUser: { nombre: 'Roberto Fuentes', cargo: 'Prevencionista de Riesgos', rol: 'prevencionista' },
  data: {},
  charts: {}
};

// ============================================================
// ROUTER
// ============================================================
function navigate(view, params = {}) {
  App.currentView = view;
  App.params = params;
  updateActiveNav(view);
  renderView(view, params);
}

function updateActiveNav(view) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view);
  });
}

async function renderView(view, params) {
  const content = document.getElementById('page-content');
  if (!content) return;
  content.innerHTML = '<div class="flex items-center justify-center py-24"><div class="spinner"></div></div>';
  try {
    switch (view) {
      case 'dashboard': await renderDashboard(); break;
      case 'workers': await renderWorkers(); break;
      case 'worker-detail': await renderWorkerDetail(params.id); break;
      case 'protocols': await renderProtocols(); break;
      case 'protocol-detail': await renderProtocolDetail(params.id); break;
      case 'accidents': await renderAccidents(); break;
      case 'epp': await renderEPP(); break;
      case 'capacitations': await renderCapacitations(); break;
      case 'alerts': await renderAlerts(); break;
      case 'miper': await renderMIPER(); break;
      case 'reports': await renderReports(); break;
      default: content.innerHTML = '<div class="p-8 text-center text-gray-400">Vista no encontrada</div>';
    }
  } catch (e) {
    console.error(e);
    content.innerHTML = `<div class="p-8 text-center text-red-400"><i class="fas fa-exclamation-triangle mr-2"></i>Error al cargar: ${e.message}</div>`;
  }
}

// ============================================================
// LAYOUT
// ============================================================
function renderLayout() {
  document.getElementById('app').innerHTML = `
    <!-- Sidebar -->
    <aside id="sidebar">
      <div class="sidebar-logo">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold" style="background:rgba(255,255,255,0.15)">ST</div>
          <div>
            <div class="text-white font-bold text-sm leading-tight">SaludTrabajo</div>
            <div class="text-xs" style="color:rgba(255,255,255,0.5)">Chile</div>
          </div>
        </div>
        <div class="mt-3 p-2 rounded-lg text-xs" style="background:rgba(255,255,255,0.08)">
          <div class="text-white font-medium">${App.currentUser.nombre}</div>
          <div style="color:rgba(255,255,255,0.55)">${App.currentUser.cargo}</div>
        </div>
      </div>
      <nav class="py-3">
        <div class="nav-section-label">Principal</div>
        <a class="nav-item" data-view="dashboard" onclick="navigate('dashboard')">
          <span class="nav-icon"><i class="fas fa-chart-pie"></i></span> Dashboard
        </a>
        <a class="nav-item" data-view="alerts" onclick="navigate('alerts')">
          <span class="nav-icon"><i class="fas fa-bell"></i></span>
          Alertas y Notificaciones
          <span class="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">12</span>
        </a>

        <div class="nav-section-label mt-2">Gestión</div>
        <a class="nav-item" data-view="workers" onclick="navigate('workers')">
          <span class="nav-icon"><i class="fas fa-users"></i></span> Trabajadores
        </a>
        <a class="nav-item" data-view="epp" onclick="navigate('epp')">
          <span class="nav-icon"><i class="fas fa-hard-hat"></i></span> Control de EPP
        </a>
        <a class="nav-item" data-view="capacitations" onclick="navigate('capacitations')">
          <span class="nav-icon"><i class="fas fa-graduation-cap"></i></span> Capacitaciones
        </a>
        <a class="nav-item" data-view="accidents" onclick="navigate('accidents')">
          <span class="nav-icon"><i class="fas fa-file-medical-alt"></i></span> DIAT / DIEP
        </a>

        <div class="nav-section-label mt-2">Protocolos MINSAL</div>
        <a class="nav-item" data-view="protocols" onclick="navigate('protocols')">
          <span class="nav-icon"><i class="fas fa-clipboard-list"></i></span> Todos los Protocolos
        </a>
        <a class="nav-item" data-view="protocol-detail" onclick="navigate('protocol-detail',{id:'PREXOR'})">
          <span class="nav-icon"><i class="fas fa-ear-deaf"></i></span> PREXOR
        </a>
        <a class="nav-item" data-view="protocol-detail" onclick="navigate('protocol-detail',{id:'PLANESI'})">
          <span class="nav-icon"><i class="fas fa-lungs"></i></span> PLANESI
        </a>
        <a class="nav-item" data-view="protocol-detail" onclick="navigate('protocol-detail',{id:'TMERT'})">
          <span class="nav-icon"><i class="fas fa-person-walking"></i></span> TMERT
        </a>
        <a class="nav-item" data-view="protocol-detail" onclick="navigate('protocol-detail',{id:'PSICOSOCIAL'})">
          <span class="nav-icon"><i class="fas fa-brain"></i></span> Psicosocial
        </a>
        <a class="nav-item" data-view="protocol-detail" onclick="navigate('protocol-detail',{id:'UV'})">
          <span class="nav-icon"><i class="fas fa-sun"></i></span> Radiación UV
        </a>
        <a class="nav-item" data-view="protocol-detail" onclick="navigate('protocol-detail',{id:'MMC'})">
          <span class="nav-icon"><i class="fas fa-box"></i></span> Man. Manual Cargas
        </a>
        <a class="nav-item" data-view="protocol-detail" onclick="navigate('protocol-detail',{id:'VOZ'})">
          <span class="nav-icon"><i class="fas fa-microphone"></i></span> Trastornos de Voz
        </a>

        <div class="nav-section-label mt-2">Análisis</div>
        <a class="nav-item" data-view="miper" onclick="navigate('miper')">
          <span class="nav-icon"><i class="fas fa-triangle-exclamation"></i></span> Matriz MIPER
        </a>
        <a class="nav-item" data-view="reports" onclick="navigate('reports')">
          <span class="nav-icon"><i class="fas fa-chart-bar"></i></span> Reportería
        </a>
      </nav>
      <div class="p-4 mt-auto" style="border-top:1px solid rgba(255,255,255,0.1)">
        <div class="text-xs" style="color:rgba(255,255,255,0.35)">v1.0.0 MVP · Ley 16.744</div>
        <div class="text-xs mt-1" style="color:rgba(255,255,255,0.25)">© 2024 SaludTrabajo Chile</div>
      </div>
    </aside>

    <!-- Main Content -->
    <div id="main-content">
      <!-- Topbar -->
      <header class="topbar">
        <div class="flex items-center gap-4">
          <button id="sidebar-toggle" class="btn btn-secondary p-2" onclick="toggleSidebar()">
            <i class="fas fa-bars"></i>
          </button>
          <div>
            <div id="page-title" class="font-bold text-gray-800 text-lg">Dashboard</div>
            <div id="page-subtitle" class="text-xs text-gray-400">Sistema Integral de Salud Ocupacional</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <div class="text-xs text-gray-500">Empresa Ejemplo S.A.</div>
            <div class="text-xs font-medium text-gray-700">RUT: 76.123.456-7</div>
          </div>
          <div class="relative cursor-pointer" onclick="navigate('alerts')">
            <div class="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <i class="fas fa-bell text-sm"></i>
            </div>
            <div class="notif-dot"></div>
          </div>
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background:#003DA5">
            RF
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main id="page-content" class="p-6 fade-in">
        <div class="flex items-center justify-center py-24">
          <div class="spinner"></div>
        </div>
      </main>
    </div>
  `;
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
  if (s) s.textContent = subtitle || '';
}

// ============================================================
// DASHBOARD
// ============================================================
async function renderDashboard() {
  setPageTitle('Dashboard', 'Resumen Ejecutivo de Salud Ocupacional');
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
    <!-- Date strip -->
    <div class="flex items-center justify-between mb-5">
      <div class="text-sm text-gray-500"><i class="fas fa-calendar mr-2"></i>${new Date().toLocaleDateString('es-CL',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
      <span class="badge badge-blue"><i class="fas fa-circle-check mr-1"></i>Sistema Operativo</span>
    </div>

    <!-- KPI Row 1 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      ${kpiCard('Trabajadores Activos', k.trabajadores.activos, k.trabajadores.total + ' total', 'fa-users', 'from-blue-600 to-blue-800', k.trabajadores.con_examenes_pendientes + ' exámenes pendientes')}
      ${kpiCard('Tasa Accidentabilidad', k.accidentabilidad.tasa + '%', 'Meta: ' + k.accidentabilidad.meta + '%', 'fa-triangle-exclamation', k.accidentabilidad.tasa <= k.accidentabilidad.meta ? 'from-green-600 to-green-800' : 'from-red-600 to-red-800', k.accidentabilidad.variacion + '% vs año anterior')}
      ${kpiCard('Tasa Siniestralidad', k.siniestralidad.tasa + '%', 'Meta: ' + k.siniestralidad.meta + '%', 'fa-bed-pulse', k.siniestralidad.tasa <= k.siniestralidad.meta ? 'from-green-600 to-green-800' : 'from-orange-600 to-orange-800', k.accidentabilidad.dias_perdidos + ' días perdidos YTD')}
      ${kpiCard('Alertas Activas', k.alertas_activas, '3 críticas · 5 altas', 'fa-bell', 'from-red-500 to-red-700', 'Requieren atención inmediata')}
    </div>

    <!-- KPI Row 2 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="card p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Protocolos MINSAL</div>
          <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><i class="fas fa-clipboard-list text-purple-600 text-sm"></i></div>
        </div>
        <div class="text-2xl font-bold text-gray-800">${k.protocolos.cumplimiento_pct}%</div>
        <div class="text-xs text-gray-500 mb-2">Cumplimiento general</div>
        <div class="progress-bar"><div class="progress-fill bg-purple-500" style="width:${k.protocolos.cumplimiento_pct}%"></div></div>
        <div class="flex gap-3 mt-2 text-xs">
          <span class="text-green-600 font-medium">${k.protocolos.al_dia} al día</span>
          <span class="text-yellow-600 font-medium">${k.protocolos.por_vencer} por vencer</span>
          <span class="text-red-600 font-medium">${k.protocolos.criticos} crítico</span>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Exámenes Médicos</div>
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
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inventario EPP</div>
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
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Capacitaciones</div>
          <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><i class="fas fa-graduation-cap text-indigo-600 text-sm"></i></div>
        </div>
        <div class="text-2xl font-bold text-gray-800">${k.capacitaciones.cobertura_odi}%</div>
        <div class="text-xs text-gray-500 mb-2">Cobertura ODI</div>
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
            <h3 class="font-bold text-gray-800">Accidentabilidad 2024</h3>
            <p class="text-xs text-gray-400">Accidentes y días perdidos por mes</p>
          </div>
          <span class="badge badge-blue">YTD</span>
        </div>
        <canvas id="chart-accidentes" height="200"></canvas>
      </div>
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-bold text-gray-800">Cumplimiento Protocolos MINSAL</h3>
            <p class="text-xs text-gray-400">% de cumplimiento por protocolo</p>
          </div>
          <button class="btn btn-secondary text-xs py-1.5" onclick="navigate('protocols')">Ver detalle</button>
        </div>
        <canvas id="chart-protocolos" height="200"></canvas>
      </div>
    </div>

    <!-- Quick actions + alerts preview -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div class="lg:col-span-2 card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800">Alertas Prioritarias</h3>
          <button class="btn btn-secondary text-xs py-1.5" onclick="navigate('alerts')">Ver todas</button>
        </div>
        <div id="alerts-preview"></div>
      </div>
      <div class="card p-5">
        <h3 class="font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
        <div class="flex flex-col gap-2">
          <button class="btn btn-secondary justify-start" onclick="navigate('workers')"><i class="fas fa-user-plus text-blue-500"></i> Nuevo Trabajador</button>
          <button class="btn btn-secondary justify-start" onclick="navigate('accidents')"><i class="fas fa-file-medical-alt text-red-500"></i> Registrar Accidente (DIAT)</button>
          <button class="btn btn-secondary justify-start" onclick="navigate('epp')"><i class="fas fa-hard-hat text-orange-500"></i> Entrega de EPP</button>
          <button class="btn btn-secondary justify-start" onclick="navigate('capacitations')"><i class="fas fa-graduation-cap text-purple-500"></i> Nueva Capacitación</button>
          <button class="btn btn-secondary justify-start" onclick="navigate('protocols')"><i class="fas fa-clipboard-check text-green-500"></i> Evaluación Protocolo</button>
          <button class="btn btn-secondary justify-start" onclick="navigate('miper')"><i class="fas fa-triangle-exclamation text-yellow-500"></i> Actualizar MIPER</button>
          <button class="btn btn-secondary justify-start" onclick="navigate('reports')"><i class="fas fa-download text-indigo-500"></i> Generar Reporte</button>
        </div>
      </div>
    </div>
  `;

  // Render charts
  renderChartAccidentes(ca);
  renderChartProtocolos(cp);

  // Alerts preview
  const alertsRes = await API.get('/alerts?prioridad=critica');
  const alerts = alertsRes.data.data.slice(0, 4);
  document.getElementById('alerts-preview').innerHTML = alerts.map(a => `
    <div class="alert-${a.prioridad} rounded-lg p-3 mb-2 flex items-start gap-3">
      <div class="mt-0.5"><i class="fas fa-${a.prioridad === 'critica' ? 'circle-exclamation text-red-500' : 'triangle-exclamation text-orange-500'}"></i></div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm text-gray-800 truncate">${a.titulo}</div>
        <div class="text-xs text-gray-500 mt-0.5 line-clamp-1">${a.descripcion}</div>
      </div>
      <span class="badge ${a.prioridad === 'critica' ? 'badge-red' : 'badge-orange'} text-xs flex-shrink-0">${a.prioridad}</span>
    </div>
  `).join('');
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
    </div>
  `;
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
        { label: 'Accidentes 2024', data: data.accidentes, backgroundColor: 'rgba(239,68,68,0.8)', borderRadius: 4 },
        { label: 'Accidentes 2023', data: data.año_anterior, backgroundColor: 'rgba(203,213,225,0.6)', borderRadius: 4 },
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
      datasets: [{ label: '% Cumplimiento', data: data.cumplimiento, backgroundColor: data.colores, borderRadius: 6 }]
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

// ============================================================
// WORKERS
// ============================================================
async function renderWorkers() {
  setPageTitle('Trabajadores', 'Ficha integral y gestión de personal');
  const res = await API.get('/workers');
  const workers = res.data.data;
  const content = document.getElementById('page-content');

  const mutualidades = ['ACHS', 'IST', 'Mutual', 'ISL'];
  const areas = [...new Set(workers.map(w => w.area))];

  content.innerHTML = `
    <div class="flex flex-col sm:flex-row gap-3 mb-5">
      <input id="search-workers" type="text" placeholder="Buscar por nombre, RUT, cargo..." class="form-input flex-1" oninput="filterWorkers()">
      <select id="filter-area" class="form-input w-48" onchange="filterWorkers()">
        <option value="all">Todas las áreas</option>
        ${areas.map(a => `<option value="${a}">${a}</option>`).join('')}
      </select>
      <select id="filter-mutualidad" class="form-input w-40" onchange="filterWorkers()">
        <option value="all">Mutualidad</option>
        ${mutualidades.map(m => `<option value="${m}">${m}</option>`).join('')}
      </select>
      <button class="btn btn-primary" onclick="showAddWorkerModal()">
        <i class="fas fa-user-plus"></i> Agregar
      </button>
    </div>

    <!-- Stats strip -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      <div class="card p-3 text-center">
        <div class="text-2xl font-bold text-blue-600">${workers.length}</div>
        <div class="text-xs text-gray-500">Total trabajadores</div>
      </div>
      <div class="card p-3 text-center">
        <div class="text-2xl font-bold text-green-600">${workers.filter(w=>w.estado==='activo').length}</div>
        <div class="text-xs text-gray-500">Activos</div>
      </div>
      <div class="card p-3 text-center">
        <div class="text-2xl font-bold text-yellow-600">${workers.filter(w=>w.examenes_pendientes>0).length}</div>
        <div class="text-xs text-gray-500">Con exámenes pendientes</div>
      </div>
      <div class="card p-3 text-center">
        <div class="text-2xl font-bold text-purple-600">${workers.filter(w=>w.protocolos_activos.length>0).length}</div>
        <div class="text-xs text-gray-500">En protocolos activos</div>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table sticky-header" id="workers-table">
          <thead>
            <tr>
              <th>Trabajador</th>
              <th>RUT</th>
              <th>Cargo / Área</th>
              <th>Mutualidad</th>
              <th>Ing. Empresa</th>
              <th>Protocolos</th>
              <th>Exámenes</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="workers-tbody">
            ${renderWorkersRows(workers)}
          </tbody>
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
            ${w.nombres[0]}${w.apellidos[0]}
          </div>
          <div>
            <div class="font-semibold text-sm">${w.nombres} ${w.apellidos}</div>
            <div class="text-xs text-gray-400">${w.email}</div>
          </div>
        </div>
      </td>
      <td><span class="font-mono text-sm">${w.rut}</span></td>
      <td>
        <div class="text-sm font-medium">${w.cargo}</div>
        <div class="text-xs text-gray-400">${w.area}</div>
      </td>
      <td><span class="badge badge-blue">${w.mutualidad}</span></td>
      <td class="text-sm text-gray-600">${formatDate(w.fecha_ingreso)}</td>
      <td>
        <div class="flex flex-wrap gap-1">
          ${w.protocolos_activos.slice(0,3).map(p => `<span class="badge badge-gray text-xs py-0.5">${p}</span>`).join('')}
          ${w.protocolos_activos.length > 3 ? `<span class="badge badge-gray text-xs py-0.5">+${w.protocolos_activos.length-3}</span>` : ''}
        </div>
      </td>
      <td>
        ${w.examenes_pendientes > 0
          ? `<span class="badge badge-red"><i class="fas fa-clock mr-1"></i>${w.examenes_pendientes} pendiente${w.examenes_pendientes>1?'s':''}</span>`
          : `<span class="badge badge-green"><i class="fas fa-check mr-1"></i>Al día</span>`}
      </td>
      <td>
        <span class="badge ${w.estado === 'activo' ? 'badge-green' : 'badge-gray'}">
          ${w.estado === 'activo' ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-secondary py-1.5 px-3 text-xs" onclick="navigate('worker-detail',{id:${w.id}})">
            <i class="fas fa-eye"></i> Ver
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterWorkers() {
  const search = document.getElementById('search-workers')?.value.toLowerCase() || '';
  const area = document.getElementById('filter-area')?.value || 'all';
  const mut = document.getElementById('filter-mutualidad')?.value || 'all';
  let filtered = window._allWorkers || [];
  if (search) filtered = filtered.filter(w =>
    w.nombres.toLowerCase().includes(search) || w.apellidos.toLowerCase().includes(search) ||
    w.rut.includes(search) || w.cargo.toLowerCase().includes(search)
  );
  if (area !== 'all') filtered = filtered.filter(w => w.area === area);
  if (mut !== 'all') filtered = filtered.filter(w => w.mutualidad === mut);
  const tbody = document.getElementById('workers-tbody');
  if (tbody) tbody.innerHTML = renderWorkersRows(filtered);
}

// ============================================================
// WORKER DETAIL
// ============================================================
async function renderWorkerDetail(id) {
  const res = await API.get(`/workers/${id}`);
  const w = res.data.data;
  setPageTitle(`${w.nombres} ${w.apellidos}`, `Ficha de trabajador · ${w.cargo}`);
  const content = document.getElementById('page-content');
  content.innerHTML = `
    <button class="btn btn-secondary mb-5" onclick="navigate('workers')"><i class="fas fa-arrow-left mr-2"></i>Volver a Trabajadores</button>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Personal Card -->
      <div class="lg:col-span-1">
        <div class="card p-5 mb-4">
          <div class="text-center mb-4">
            <div class="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3"
              style="background:${stringToColor(w.nombres)}">
              ${w.nombres[0]}${w.apellidos[0]}
            </div>
            <div class="font-bold text-lg text-gray-800">${w.nombres} ${w.apellidos}</div>
            <div class="text-sm text-gray-500">${w.cargo}</div>
            <div class="mt-2"><span class="badge badge-green">Activo</span></div>
          </div>
          <div class="space-y-2 text-sm">
            ${detailRow('fa-id-card','RUT',w.rut)}
            ${detailRow('fa-envelope','Email',w.email)}
            ${detailRow('fa-phone','Teléfono',w.telefono)}
            ${detailRow('fa-building','Área',w.area)}
            ${detailRow('fa-venus-mars','Sexo',w.sexo === 'M' ? 'Masculino' : 'Femenino')}
            ${detailRow('fa-calendar-days','Nac.',formatDate(w.fecha_nacimiento))}
            ${detailRow('fa-door-open','Ingreso',formatDate(w.fecha_ingreso))}
            ${detailRow('fa-file-contract','Contrato',w.contrato)}
            ${detailRow('fa-clock','Turno',w.turno)}
            ${detailRow('fa-shield-halved','Mutualidad',w.mutualidad)}
          </div>
        </div>
        <div class="card p-4">
          <div class="font-bold text-gray-700 mb-3 text-sm">Protocolos Activos</div>
          <div class="flex flex-wrap gap-2">
            ${w.protocolos_activos.map(p => `
              <button class="badge badge-blue cursor-pointer" onclick="navigate('protocol-detail',{id:'${p}'})">${p}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Main info -->
      <div class="lg:col-span-2">
        <!-- Examenes -->
        <div class="card p-5 mb-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800"><i class="fas fa-stethoscope mr-2 text-green-500"></i>Historial de Exámenes</h3>
            <button class="btn btn-primary text-xs py-1.5"><i class="fas fa-plus mr-1"></i>Nuevo examen</button>
          </div>
          <div class="overflow-x-auto">
            <table class="data-table">
              <thead><tr><th>Tipo</th><th>Fecha</th><th>Resultado</th><th>Vigencia</th><th>Centro</th><th>Estado</th></tr></thead>
              <tbody>
                ${(w.examenes || []).map(e => `
                  <tr>
                    <td class="font-medium text-sm">${e.tipo}</td>
                    <td class="text-sm">${formatDate(e.fecha)}</td>
                    <td class="text-sm">${e.resultado}</td>
                    <td class="text-sm">${e.vigencia ? formatDate(e.vigencia) : '—'}</td>
                    <td class="text-xs text-gray-500">${e.centro_medico}</td>
                    <td>${estadoBadge(e.estado)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- EPP asignado -->
        <div class="card p-5 mb-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800"><i class="fas fa-hard-hat mr-2 text-orange-500"></i>EPP Asignado</h3>
            <button class="btn btn-primary text-xs py-1.5" onclick="navigate('epp')"><i class="fas fa-plus mr-1"></i>Registrar entrega</button>
          </div>
          <div class="text-sm text-gray-500 italic">Ver módulo de EPP para historial completo de entregas.</div>
        </div>

        <!-- Acciones -->
        <div class="card p-5">
          <h3 class="font-bold text-gray-800 mb-3">Acciones</h3>
          <div class="flex flex-wrap gap-2">
            <button class="btn btn-secondary text-sm"><i class="fas fa-file-pdf text-red-500"></i> Generar Ficha PDF</button>
            <button class="btn btn-secondary text-sm"><i class="fas fa-envelope text-blue-500"></i> Enviar recordatorio</button>
            <button class="btn btn-warning text-sm"><i class="fas fa-pen"></i> Editar datos</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function detailRow(icon, label, value) {
  return `<div class="flex items-center gap-2 py-1.5 border-b border-gray-50">
    <i class="fas ${icon} text-gray-400 w-4 text-center"></i>
    <span class="text-gray-500 w-20 flex-shrink-0">${label}</span>
    <span class="font-medium text-gray-800 text-right ml-auto">${value || '—'}</span>
  </div>`;
}

// ============================================================
// PROTOCOLS
// ============================================================
async function renderProtocols() {
  setPageTitle('Protocolos MINSAL', 'Control de cumplimiento por protocolo');
  const res = await API.get('/protocols');
  const protocols = res.data.data;
  const content = document.getElementById('page-content');

  const colorMap = { blue: 'blue', yellow: 'yellow', green: 'green', purple: 'purple', orange: 'orange', red: 'red', indigo: 'indigo' };

  content.innerHTML = `
    <div class="mb-4 p-4 rounded-xl border border-blue-200 bg-blue-50 flex items-start gap-3">
      <i class="fas fa-circle-info text-blue-500 mt-0.5"></i>
      <div class="text-sm text-blue-800">
        <strong>Protocolos MINSAL vigentes:</strong> El sistema gestiona todos los protocolos del Ministerio de Salud de Chile obligatorios para empleadores bajo la Ley 16.744. Haz clic en cualquier protocolo para ver el detalle completo de evaluaciones y trazabilidad.
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      ${protocols.map(p => {
        const e = p.estadisticas;
        const col = p.color;
        return `
        <div class="protocol-card bg-white card-hover" onclick="navigate('protocol-detail',{id:'${p.id}'})">
          <div class="protocol-header bg-${col}-50 border-b border-${col}-100">
            <div class="w-10 h-10 rounded-xl bg-${col}-100 flex items-center justify-center text-${col}-600 text-lg flex-shrink-0">
              <i class="fas ${p.icon}"></i>
            </div>
            <div>
              <div class="font-bold text-gray-800 text-sm leading-tight">${p.nombre}</div>
              <div class="text-xs text-gray-500 mt-0.5">${p.descripcion}</div>
            </div>
          </div>
          <div class="p-4">
            <div class="grid grid-cols-2 gap-2 text-xs mb-3">
              ${Object.entries(e).slice(0,4).map(([k,v]) => `
                <div class="bg-gray-50 rounded-lg p-2">
                  <div class="text-gray-500">${formatStatKey(k)}</div>
                  <div class="font-bold text-gray-800 text-base">${v}</div>
                </div>
              `).join('')}
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-400">Base: ${p.base_legal || 'Ley 16.744'}</span>
              <span class="badge badge-blue text-xs">Ver detalle →</span>
            </div>
          </div>
        </div>
      `}).join('')}
    </div>
  `;
}

function formatStatKey(key) {
  const map = {
    total_expuestos: 'Expuestos',
    alto_riesgo: 'Alto riesgo',
    riesgo_moderado: 'Riesgo mod.',
    bajo_riesgo: 'Bajo riesgo',
    con_audiometria_vigente: 'Audiom. vigente',
    audiometrias_vencidas: 'Vencidas',
    total_evaluados: 'Evaluados',
    riesgo_alto: 'Riesgo alto',
    trabajadores_expuestos: 'Expuestos',
    con_epp_vigente: 'EPP vigente',
    indice_uv_hoy: 'Índice UV hoy',
    sobre_limite: 'Sobre límite',
    bajo_limite: 'Bajo límite',
    con_rx_vigente: 'Rx vigente',
    rx_vencidas: 'Rx vencidas',
    participacion: 'Participación',
    nivel_riesgo: 'Nivel riesgo',
    ultima_medicion: 'Última med.',
    proxima_medicion: 'Próx. med.',
    dimensiones_criticas: 'Dim. críticas',
    con_intervencion: 'Con interv.',
    total_vigilados: 'Vigilados',
    con_patologia: 'Con patología',
    sin_alteraciones: 'Sin altera.',
  };
  return map[key] || key.replace(/_/g,' ');
}

// ============================================================
// PROTOCOL DETAIL
// ============================================================
async function renderProtocolDetail(id) {
  const res = await API.get(`/protocols/${id}`);
  const p = res.data.data;
  setPageTitle(p.nombre, `${p.descripcion} · ${p.base_legal}`);
  const content = document.getElementById('page-content');
  const col = p.color;

  content.innerHTML = `
    <button class="btn btn-secondary mb-4" onclick="navigate('protocols')"><i class="fas fa-arrow-left mr-2"></i>Volver a Protocolos</button>

    <!-- Header card -->
    <div class="card mb-5 overflow-hidden">
      <div class="bg-${col}-600 p-5 text-white">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-2xl flex-shrink-0">
            <i class="fas ${p.icon}"></i>
          </div>
          <div>
            <h1 class="text-xl font-bold">${p.nombre}</h1>
            <p class="opacity-80 text-sm mt-1">${p.descripcion}</p>
            <div class="flex gap-3 mt-3 flex-wrap">
              <span class="bg-white bg-opacity-20 text-xs px-3 py-1 rounded-full"><i class="fas fa-landmark mr-1"></i>${p.autoridad}</span>
              <span class="bg-white bg-opacity-20 text-xs px-3 py-1 rounded-full"><i class="fas fa-gavel mr-1"></i>${p.base_legal}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Stats -->
      <div class="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-${col}-50">
        ${Object.entries(p.estadisticas).map(([k,v]) => `
          <div class="text-center">
            <div class="text-xl font-bold text-${col}-700">${v}</div>
            <div class="text-xs text-gray-500">${formatStatKey(k)}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Evaluaciones -->
    <div class="card p-5 mb-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-800"><i class="fas fa-clipboard-check mr-2 text-${col}-500"></i>Evaluaciones Registradas</h3>
        <button class="btn btn-primary text-sm" onclick="showNewEvalModal('${p.id}')">
          <i class="fas fa-plus mr-1"></i> Nueva Evaluación
        </button>
      </div>
      ${renderProtocolEvaluaciones(p)}
    </div>

    <!-- Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card p-4 text-center card-hover cursor-pointer" onclick="alert('Generando informe PDF...')">
        <i class="fas fa-file-pdf text-red-500 text-2xl mb-2"></i>
        <div class="font-semibold text-sm text-gray-700">Generar Informe PDF</div>
        <div class="text-xs text-gray-400">Informe completo del protocolo</div>
      </div>
      <div class="card p-4 text-center card-hover cursor-pointer" onclick="navigate('workers')">
        <i class="fas fa-users text-blue-500 text-2xl mb-2"></i>
        <div class="font-semibold text-sm text-gray-700">Ver Trabajadores Expuestos</div>
        <div class="text-xs text-gray-400">Lista filtrada por protocolo</div>
      </div>
      <div class="card p-4 text-center card-hover cursor-pointer" onclick="navigate('capacitations')">
        <i class="fas fa-graduation-cap text-green-500 text-2xl mb-2"></i>
        <div class="font-semibold text-sm text-gray-700">Ver Capacitaciones</div>
        <div class="text-xs text-gray-400">Historial de formación</div>
      </div>
    </div>
  `;
}

function renderProtocolEvaluaciones(p) {
  if (!p.evaluaciones || p.evaluaciones.length === 0) {
    return '<div class="text-center py-8 text-gray-400"><i class="fas fa-inbox text-3xl mb-2"></i><div>Sin evaluaciones registradas</div></div>';
  }
  const evals = p.evaluaciones;
  const firstKeys = Object.keys(evals[0]).filter(k => !['id','worker_id'].includes(k));
  return `
    <div class="overflow-x-auto">
      <table class="data-table">
        <thead><tr>${firstKeys.map(k => `<th>${formatStatKey(k).substring(0,20)}</th>`).join('')}<th>Acción</th></tr></thead>
        <tbody>
          ${evals.map(e => `
            <tr>
              ${firstKeys.map(k => {
                const v = e[k];
                if (k === 'estado' || k === 'resultado') return `<td>${estadoBadgeGeneric(v)}</td>`;
                if (typeof v === 'boolean') return `<td>${v ? '<span class="badge badge-green">Sí</span>' : '<span class="badge badge-red">No</span>'}</td>`;
                return `<td class="text-sm">${v !== null && v !== undefined ? v : '—'}</td>`;
              }).join('')}
              <td><button class="btn btn-secondary py-1 px-2 text-xs"><i class="fas fa-eye"></i></button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ============================================================
// ACCIDENTS
// ============================================================
async function renderAccidents() {
  setPageTitle('Registro DIAT / DIEP', 'Accidentes del Trabajo y Enfermedades Profesionales');
  const [accRes, statsRes] = await Promise.all([API.get('/accidents'), API.get('/accidents/stats')]);
  const accidents = accRes.data.data;
  const stats = statsRes.data.data;
  const content = document.getElementById('page-content');

  content.innerHTML = `
    <!-- KPIs -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <div class="kpi-card bg-gradient-to-br from-red-500 to-red-700 text-white">
        <div class="text-xs opacity-75 uppercase font-semibold mb-1">Tasa Accidentabilidad</div>
        <div class="text-3xl font-bold">${stats.tasa_accidentabilidad}%</div>
        <div class="text-xs opacity-60 mt-2 border-t border-white border-opacity-20 pt-2">Meta: ${stats.accidentes_trabajo} accidentes YTD</div>
      </div>
      <div class="kpi-card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
        <div class="text-xs opacity-75 uppercase font-semibold mb-1">Tasa Siniestralidad</div>
        <div class="text-3xl font-bold">${stats.tasa_siniestralidad}%</div>
        <div class="text-xs opacity-60 mt-2 border-t border-white border-opacity-20 pt-2">${stats.dias_perdidos_total} días perdidos</div>
      </div>
      <div class="kpi-card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <div class="text-xs opacity-75 uppercase font-semibold mb-1">Enf. Profesionales</div>
        <div class="text-3xl font-bold">${stats.enfermedades_profesionales}</div>
        <div class="text-xs opacity-60 mt-2 border-t border-white border-opacity-20 pt-2">DIEP registradas YTD</div>
      </div>
      <div class="kpi-card bg-gradient-to-br from-green-500 to-green-700 text-white">
        <div class="text-xs opacity-75 uppercase font-semibold mb-1">Tasa Mortalidad</div>
        <div class="text-3xl font-bold">${stats.tasa_mortalidad}%</div>
        <div class="text-xs opacity-60 mt-2 border-t border-white border-opacity-20 pt-2">Sin fallecidos en el período</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <select class="form-input w-40" onchange="filterAccidents(this.value,'tipo')">
        <option value="all">Tipo (todos)</option>
        <option value="DIAT">DIAT</option>
        <option value="DIEP">DIEP</option>
      </select>
      <select class="form-input w-48" onchange="filterAccidents(this.value,'estado')">
        <option value="all">Estado (todos)</option>
        <option value="cerrado">Cerrado</option>
        <option value="en_proceso">En proceso</option>
        <option value="en_vigilancia">En vigilancia</option>
      </select>
      <div class="ml-auto">
        <button class="btn btn-primary" onclick="showNewAccidentModal()">
          <i class="fas fa-plus mr-1"></i> Registrar DIAT/DIEP
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table" id="accidents-table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Tipo</th>
              <th>Trabajador</th>
              <th>Fecha</th>
              <th>Lesión</th>
              <th>Gravedad</th>
              <th>Días Perdidos</th>
              <th>Mutualidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="accidents-tbody">
            ${renderAccidentsRows(accidents)}
          </tbody>
        </table>
      </div>
    </div>
  `;
  window._allAccidents = accidents;
}

function renderAccidentsRows(accidents) {
  return accidents.map(a => `
    <tr>
      <td><span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">${a.folio}</span></td>
      <td>
        <span class="badge ${a.tipo === 'DIAT' ? 'badge-orange' : 'badge-purple'}">${a.tipo}</span>
      </td>
      <td>
        <div class="font-medium text-sm">${a.worker_nombre}</div>
      </td>
      <td class="text-sm">${formatDate(a.fecha_accidente)}</td>
      <td class="text-sm max-w-xs truncate" title="${a.lesion}">${a.lesion}</td>
      <td>
        <span class="badge ${a.gravedad === 'Grave' ? 'badge-red' : a.gravedad === 'Moderado' ? 'badge-orange' : 'badge-yellow'}">
          ${a.gravedad}
        </span>
      </td>
      <td class="text-sm font-bold text-center">${a.dias_perdidos}</td>
      <td><span class="badge badge-blue">${a.mutualidad}</span></td>
      <td>${estadoBadgeGeneric(a.estado)}</td>
      <td>
        <div class="flex gap-1">
          <button class="btn btn-secondary py-1 px-2 text-xs" onclick="showAccidentDetail(${a.id})" title="Ver detalle">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-danger py-1 px-2 text-xs" title="Generar PDF">
            <i class="fas fa-file-pdf"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterAccidents(val, field) {
  let filtered = window._allAccidents || [];
  if (field === 'tipo' && val !== 'all') filtered = filtered.filter(a => a.tipo === val);
  if (field === 'estado' && val !== 'all') filtered = filtered.filter(a => a.estado === val);
  const tbody = document.getElementById('accidents-tbody');
  if (tbody) tbody.innerHTML = renderAccidentsRows(filtered);
}

function showAccidentDetail(id) {
  const a = (window._allAccidents||[]).find(x => x.id === id);
  if (!a) return;
  showModal(`Detalle ${a.folio}`, `
    <div class="space-y-3 text-sm">
      <div class="grid grid-cols-2 gap-3">
        ${modalRow('Folio',a.folio)} ${modalRow('Tipo',a.tipo)}
        ${modalRow('Trabajador',a.worker_nombre)} ${modalRow('Fecha',formatDate(a.fecha_accidente))}
        ${modalRow('Hora',a.hora||'—')} ${modalRow('Gravedad',a.gravedad)}
        ${modalRow('Días perdidos',a.dias_perdidos)} ${modalRow('Mutualidad',a.mutualidad)}
      </div>
      <div class="bg-gray-50 p-3 rounded-lg">
        <div class="font-semibold text-gray-700 mb-1">Descripción del accidente:</div>
        <p class="text-gray-600">${a.descripcion}</p>
      </div>
      <div class="bg-yellow-50 p-3 rounded-lg">
        <div class="font-semibold text-yellow-800 mb-1">Causa Inmediata:</div>
        <p class="text-yellow-700">${a.causa_inmediata}</p>
      </div>
      <div class="bg-orange-50 p-3 rounded-lg">
        <div class="font-semibold text-orange-800 mb-1">Causa Básica:</div>
        <p class="text-orange-700">${a.causa_basica}</p>
      </div>
      <div class="bg-green-50 p-3 rounded-lg">
        <div class="font-semibold text-green-800 mb-1">Acciones Correctivas:</div>
        <ul class="text-green-700 list-disc list-inside">
          ${a.acciones_correctivas.map(ac => `<li>${ac}</li>`).join('')}
        </ul>
      </div>
    </div>
  `);
}

// ============================================================
// EPP
// ============================================================
async function renderEPP() {
  setPageTitle('Control de EPP', 'Equipos de Protección Personal - Inventario y Entregas');
  const [eppRes, statsRes, entregasRes] = await Promise.all([
    API.get('/epp'), API.get('/epp/stats'), API.get('/epp/entregas')
  ]);
  const items = eppRes.data.data;
  const stats = statsRes.data.data;
  const entregas = entregasRes.data.data;
  const content = document.getElementById('page-content');

  content.innerHTML = `
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <div class="card p-4 text-center border-t-4 border-gray-400">
        <div class="text-2xl font-bold text-gray-700">${stats.total_items}</div>
        <div class="text-xs text-gray-500">Total ítems EPP</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-red-500">
        <div class="text-2xl font-bold text-red-600">${stats.criticos}</div>
        <div class="text-xs text-gray-500">Stock crítico</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-yellow-400">
        <div class="text-2xl font-bold text-yellow-600">${stats.bajos}</div>
        <div class="text-xs text-gray-500">Stock bajo</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-blue-400">
        <div class="text-2xl font-bold text-blue-600">${stats.entregas_pendientes_firma}</div>
        <div class="text-xs text-gray-500">Firmas pendientes</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-4 border-b border-gray-200">
      <button class="px-4 py-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600" onclick="switchTab('inventario')">Inventario</button>
      <button class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700" onclick="switchTab('entregas')">Registro de Entregas</button>
    </div>

    <!-- Inventario -->
    <div id="tab-inventario" class="card overflow-hidden">
      <div class="p-4 flex flex-col sm:flex-row gap-3 border-b border-gray-100">
        <input type="text" placeholder="Buscar EPP..." class="form-input flex-1" oninput="filterEPP(this.value)">
        <button class="btn btn-primary"><i class="fas fa-plus mr-1"></i>Agregar ítem</button>
      </div>
      <div class="overflow-x-auto">
        <table class="data-table" id="epp-table">
          <thead>
            <tr>
              <th>EPP</th>
              <th>Categoría</th>
              <th>Marca/Modelo</th>
              <th>Stock Actual</th>
              <th>Mínimo</th>
              <th>Norma</th>
              <th>Vencimiento Lote</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(e => `
              <tr>
                <td class="font-medium text-sm">${e.nombre}</td>
                <td><span class="badge badge-gray text-xs">${e.categoria}</span></td>
                <td class="text-xs text-gray-500">${e.marca} ${e.modelo}</td>
                <td class="text-center">
                  <span class="font-bold text-lg ${e.estado_stock === 'critico' ? 'text-red-600' : e.estado_stock === 'bajo' ? 'text-yellow-600' : 'text-green-600'}">${e.stock_actual}</span>
                  <div class="text-xs text-gray-400">${e.unidad}</div>
                </td>
                <td class="text-sm text-gray-500 text-center">${e.stock_minimo}</td>
                <td><span class="text-xs font-mono text-gray-500">${e.norma || '—'}</span></td>
                <td class="text-sm">${e.vencimiento_lote ? formatDate(e.vencimiento_lote) : '—'}</td>
                <td>${stockBadge(e.estado_stock)}</td>
                <td>
                  <button class="btn btn-primary py-1 px-2 text-xs">
                    <i class="fas fa-hand-holding"></i> Entregar
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Entregas (hidden by default) -->
    <div id="tab-entregas" class="card overflow-hidden hidden">
      <div class="p-4 flex justify-between items-center border-b border-gray-100">
        <div class="font-semibold text-gray-700">Historial de Entregas</div>
        <button class="btn btn-primary text-sm"><i class="fas fa-plus mr-1"></i>Nueva entrega</button>
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead><tr><th>Trabajador</th><th>EPP Entregado</th><th>Cant.</th><th>Fecha Entrega</th><th>Próx. Renovación</th><th>Firma</th><th>Estado</th></tr></thead>
          <tbody>
            ${entregas.map(e => `
              <tr>
                <td class="font-medium text-sm">${e.worker_nombre}</td>
                <td class="text-sm">${e.epp_nombre}</td>
                <td class="text-center">${e.cantidad}</td>
                <td class="text-sm">${formatDate(e.fecha_entrega)}</td>
                <td class="text-sm">${formatDate(e.proxima_entrega)}</td>
                <td>
                  ${e.firma_digital
                    ? '<span class="badge badge-green"><i class="fas fa-signature mr-1"></i>Firmado</span>'
                    : '<span class="badge badge-red"><i class="fas fa-clock mr-1"></i>Pendiente</span>'}
                </td>
                <td>${estadoBadgeGeneric(e.estado)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  window._allEPP = items;
}

function switchTab(tab) {
  document.getElementById('tab-inventario').classList.toggle('hidden', tab !== 'inventario');
  document.getElementById('tab-entregas').classList.toggle('hidden', tab !== 'entregas');
}

function filterEPP(search) {
  const s = search.toLowerCase();
  const items = (window._allEPP || []).filter(e =>
    e.nombre.toLowerCase().includes(s) || e.categoria.toLowerCase().includes(s)
  );
  const tbody = document.querySelector('#epp-table tbody');
  if (tbody) tbody.innerHTML = items.map(e => `<tr><td class="font-medium text-sm">${e.nombre}</td><td><span class="badge badge-gray text-xs">${e.categoria}</span></td><td class="text-xs text-gray-500">${e.marca} ${e.modelo}</td><td class="text-center font-bold text-lg ${e.estado_stock==='critico'?'text-red-600':e.estado_stock==='bajo'?'text-yellow-600':'text-green-600'}">${e.stock_actual}<div class="text-xs text-gray-400">${e.unidad}</div></td><td class="text-sm text-gray-500 text-center">${e.stock_minimo}</td><td class="text-xs font-mono text-gray-500">${e.norma||'—'}</td><td class="text-sm">${e.vencimiento_lote?formatDate(e.vencimiento_lote):'—'}</td><td>${stockBadge(e.estado_stock)}</td><td><button class="btn btn-primary py-1 px-2 text-xs"><i class="fas fa-hand-holding"></i> Entregar</button></td></tr>`).join('');
}

// ============================================================
// CAPACITATIONS
// ============================================================
async function renderCapacitations() {
  setPageTitle('Capacitaciones', 'Registro de formación y cumplimiento ODI');
  const res = await API.get('/capacitations');
  const caps = res.data.data;
  const statsRes = await API.get('/capacitations/stats');
  const stats = statsRes.data.data;
  const content = document.getElementById('page-content');

  content.innerHTML = `
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <div class="card p-4 text-center border-t-4 border-green-500">
        <div class="text-2xl font-bold text-green-600">${stats.vigentes}</div>
        <div class="text-xs text-gray-500">Vigentes</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-yellow-400">
        <div class="text-2xl font-bold text-yellow-600">${stats.por_vencer}</div>
        <div class="text-xs text-gray-500">Por vencer</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-red-500">
        <div class="text-2xl font-bold text-red-600">${stats.vencidas}</div>
        <div class="text-xs text-gray-500">Vencidas</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-blue-500">
        <div class="text-2xl font-bold text-blue-600">${stats.cobertura_odi_pct}%</div>
        <div class="text-xs text-gray-500">Cobertura ODI</div>
      </div>
    </div>

    <!-- ODI Alert -->
    <div class="mb-4 p-4 rounded-xl border border-blue-200 bg-blue-50 flex items-start gap-3">
      <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
      <div class="text-sm text-blue-800">
        <strong>Obligación de Informar (ODI):</strong> Conforme al Art. 21 del DS 40, el empleador debe informar a los trabajadores los riesgos laborales, medidas preventivas y métodos de trabajo seguros. Vigencia: 12 meses.
      </div>
    </div>

    <!-- List -->
    <div class="flex justify-between items-center mb-3">
      <h3 class="font-bold text-gray-700">Registro de Capacitaciones</h3>
      <button class="btn btn-primary text-sm" onclick="showNewCapModal()"><i class="fas fa-plus mr-1"></i>Nueva Capacitación</button>
    </div>
    <div class="space-y-3">
      ${caps.map(cap => `
        <div class="card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
            style="background:${capColor(cap.tipo)}">${cap.tipo.substring(0,3)}</div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-gray-800 text-sm">${cap.nombre}</div>
            <div class="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
              <span><i class="fas fa-calendar mr-1"></i>${formatDate(cap.fecha)}</span>
              <span><i class="fas fa-clock mr-1"></i>${cap.duracion_horas}h</span>
              <span><i class="fas fa-user-tie mr-1"></i>${cap.relator}</span>
              <span><i class="fas fa-users mr-1"></i>${cap.trabajadores_capacitados}/${cap.total_empresa} trabajadores</span>
            </div>
          </div>
          <div class="flex items-center gap-3 flex-shrink-0">
            <div class="text-center">
              <div class="text-lg font-bold ${coveragePct(cap) >= 80 ? 'text-green-600' : coveragePct(cap) >= 60 ? 'text-yellow-600' : 'text-red-600'}">${coveragePct(cap)}%</div>
              <div class="text-xs text-gray-400">Cobertura</div>
            </div>
            ${estadoBadge(cap.estado)}
            <button class="btn btn-secondary py-1.5 px-3 text-xs" onclick="showCapDetail(${cap.id})">
              <i class="fas fa-eye mr-1"></i>Detalle
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  window._allCaps = caps;
}

function coveragePct(cap) {
  return Math.round((cap.trabajadores_capacitados / cap.total_empresa) * 100);
}

function capColor(tipo) {
  const m = { ODI:'#1d4ed8',EPP:'#d97706',UV:'#f97316',PREXOR:'#3b82f6',MMC:'#ef4444',PLANESI:'#ca8a04',PA:'#16a34a',CPHS:'#7c3aed',VOZ:'#6366f1' };
  return m[tipo] || '#64748b';
}

function showCapDetail(id) {
  const cap = (window._allCaps || []).find(c => c.id === id);
  if (!cap) return;
  showModal(`Detalle: ${cap.nombre}`, `
    <div class="space-y-3 text-sm">
      <div class="grid grid-cols-2 gap-3">
        ${modalRow('Tipo',cap.tipo)} ${modalRow('Fecha',formatDate(cap.fecha))}
        ${modalRow('Duración',cap.duracion_horas+' horas')} ${modalRow('Relator',cap.relator)}
        ${modalRow('Asistentes',cap.trabajadores_capacitados+'/'+cap.total_empresa)}
        ${modalRow('Aprobados',cap.aprobados)} ${modalRow('Reprobados',cap.reprobados)}
        ${modalRow('Próx. renovación',formatDate(cap.proxima_fecha))}
      </div>
      <div class="bg-gray-50 p-3 rounded-lg">
        <div class="font-semibold mb-2">Documentos adjuntos:</div>
        ${cap.documentos.map(d => `<div class="flex items-center gap-2 text-blue-600"><i class="fas fa-file-pdf text-red-500"></i>${d}</div>`).join('')}
      </div>
      <div class="progress-bar"><div class="progress-fill bg-blue-500" style="width:${coveragePct(cap)}%"></div></div>
      <div class="text-xs text-center text-gray-500">Cobertura: ${coveragePct(cap)}%</div>
    </div>
  `);
}

// ============================================================
// ALERTS
// ============================================================
async function renderAlerts() {
  setPageTitle('Alertas y Notificaciones', 'Centro de control y seguimiento de alertas');
  const res = await API.get('/alerts');
  const alerts = res.data.data;
  const content = document.getElementById('page-content');

  const byPriority = (p) => alerts.filter(a => a.prioridad === p);

  content.innerHTML = `
    <!-- Header stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <div class="card p-4 text-center border-l-4 border-red-600"><div class="text-2xl font-bold text-red-600">${byPriority('critica').length}</div><div class="text-xs text-gray-500">Críticas</div></div>
      <div class="card p-4 text-center border-l-4 border-orange-500"><div class="text-2xl font-bold text-orange-500">${byPriority('alta').length}</div><div class="text-xs text-gray-500">Altas</div></div>
      <div class="card p-4 text-center border-l-4 border-yellow-400"><div class="text-2xl font-bold text-yellow-600">${byPriority('media').length}</div><div class="text-xs text-gray-500">Medias</div></div>
      <div class="card p-4 text-center border-l-4 border-blue-400"><div class="text-2xl font-bold text-blue-600">${alerts.filter(a=>!a.leida).length}</div><div class="text-xs text-gray-500">No leídas</div></div>
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-2 mb-4 flex-wrap">
      <button class="btn btn-primary text-sm" onclick="filterAlertsByPriority('all')">Todas (${alerts.length})</button>
      <button class="btn btn-danger text-sm" onclick="filterAlertsByPriority('critica')">Críticas (${byPriority('critica').length})</button>
      <button class="btn btn-warning text-sm" onclick="filterAlertsByPriority('alta')">Altas (${byPriority('alta').length})</button>
      <button class="btn btn-secondary text-sm" onclick="filterAlertsByPriority('media')">Medias (${byPriority('media').length})</button>
    </div>

    <div id="alerts-list" class="space-y-3">
      ${renderAlertCards(alerts)}
    </div>
  `;
  window._allAlerts = alerts;
}

function renderAlertCards(alerts) {
  const icons = { critica:'circle-exclamation text-red-500', alta:'triangle-exclamation text-orange-500', media:'exclamation text-yellow-500', baja:'info-circle text-blue-400' };
  return alerts.map(a => `
    <div class="card p-4 alert-${a.prioridad} flex items-start gap-4" id="alert-${a.id}">
      <div class="mt-0.5 text-xl flex-shrink-0">
        <i class="fas fa-${icons[a.prioridad] || 'bell text-gray-400'}"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="font-semibold text-gray-800 text-sm">${a.titulo}</div>
            <div class="text-xs text-gray-600 mt-1">${a.descripcion}</div>
          </div>
          <div class="flex-shrink-0 flex flex-col items-end gap-1">
            <span class="badge ${a.prioridad === 'critica' ? 'badge-red' : a.prioridad === 'alta' ? 'badge-orange' : 'badge-yellow'}">${a.prioridad.toUpperCase()}</span>
            ${!a.leida ? '<span class="badge badge-blue text-xs">Nueva</span>' : ''}
          </div>
        </div>
        <div class="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
          ${a.trabajador ? `<span><i class="fas fa-user mr-1"></i>${a.trabajador}</span>` : ''}
          <span><i class="fas fa-layer-group mr-1"></i>${a.modulo}</span>
          ${a.dias_vencido !== null ? `<span><i class="fas fa-calendar-xmark mr-1 text-red-400"></i>${a.dias_vencido > 0 ? a.dias_vencido+' días vencido' : Math.abs(a.dias_vencido)+' días para vencer'}</span>` : ''}
        </div>
        <div class="mt-2 flex gap-2">
          <button class="btn btn-primary py-1 px-3 text-xs"><i class="fas fa-bolt mr-1"></i>${a.accion}</button>
          <button class="btn btn-secondary py-1 px-3 text-xs" onclick="markAlertRead(${a.id})">
            <i class="fas fa-check mr-1"></i>Marcar leída
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterAlertsByPriority(priority) {
  const alerts = window._allAlerts || [];
  const filtered = priority === 'all' ? alerts : alerts.filter(a => a.prioridad === priority);
  const list = document.getElementById('alerts-list');
  if (list) list.innerHTML = renderAlertCards(filtered);
}

function markAlertRead(id) {
  const el = document.getElementById(`alert-${id}`);
  if (el) { el.style.opacity = '0.5'; el.querySelector('button:last-child').textContent = 'Leída'; }
}

// ============================================================
// MIPER
// ============================================================
async function renderMIPER() {
  setPageTitle('Matriz MIPER', 'Identificación de Peligros y Evaluación de Riesgos');
  const miperData = [
    { id:1, area:'Producción', puesto:'Operador Maquinaria', peligro:'Ruido > 85 dB(A)', tipo_riesgo:'Físico', consecuencia:'Pérdida auditiva (NIHL)', probabilidad:'Alta', severidad:'Alta', nivel_riesgo:'Intolerable', medida_control:'Uso obligatorio EPP auditivo, mapas de ruido, audiometrías anuales', protocolo:'PREXOR', responsable:'Prevencionista', estado:'activo' },
    { id:2, area:'Producción', puesto:'Operador Maquinaria', peligro:'Atrapamiento en maquinaria', tipo_riesgo:'Mecánico', consecuencia:'Amputación / fracturas', probabilidad:'Baja', severidad:'Crítica', nivel_riesgo:'Importante', medida_control:'Guardas de seguridad, procedimiento LOTO, capacitación', protocolo:null, responsable:'CPHS', estado:'activo' },
    { id:3, area:'Mantenimiento', puesto:'Mecánico Industrial', peligro:'Exposición a polvo de sílice', tipo_riesgo:'Químico', consecuencia:'Silicosis, cáncer pulmonar', probabilidad:'Media', severidad:'Crítica', nivel_riesgo:'Intolerable', medida_control:'Ventilación local, EPR P100, exámenes médicos, capacitación PLANESI', protocolo:'PLANESI', responsable:'Prevencionista', estado:'critico' },
    { id:4, area:'Logística', puesto:'Operador Bodega', peligro:'Manejo manual de cargas > 25 kg', tipo_riesgo:'Ergonómico', consecuencia:'Lumbalgia, hernia discal', probabilidad:'Alta', severidad:'Media', nivel_riesgo:'Importante', medida_control:'Equipos de apoyo mecánico, límite de peso, pausas activas', protocolo:'MMC', responsable:'Prevencionista', estado:'activo' },
    { id:5, area:'Exterior', puesto:'Personal en Terreno', peligro:'Radiación UV solar > 6 IUV', tipo_riesgo:'Físico', consecuencia:'Melanoma, quemaduras solares', probabilidad:'Alta', severidad:'Alta', nivel_riesgo:'Importante', medida_control:'FPS50+, legionario, manga larga, restricción horaria 11-16h', protocolo:'UV', responsable:'RRHH + Prevención', estado:'activo' },
    { id:6, area:'Producción', puesto:'Todos los puestos', peligro:'Trastornos musculoesqueléticos EESS', tipo_riesgo:'Ergonómico', consecuencia:'Tendinitis, síndrome del túnel carpiano', probabilidad:'Media', severidad:'Media', nivel_riesgo:'Moderado', medida_control:'Evaluación ergonómica, pausas activas, rotación de tareas', protocolo:'TMERT', responsable:'Terapeuta Ocup.', estado:'activo' },
    { id:7, area:'Administración', puesto:'Administrativo', peligro:'Estrés laboral y acoso', tipo_riesgo:'Psicosocial', consecuencia:'Patología mental, ausentismo', probabilidad:'Media', severidad:'Alta', nivel_riesgo:'Moderado', medida_control:'Encuesta CEAL-SM, plan de intervención, canales de denuncia', protocolo:'PSICOSOCIAL', responsable:'RRHH', estado:'activo' },
    { id:8, area:'Taller', puesto:'Soldador', peligro:'Gases y humos de soldadura', tipo_riesgo:'Químico', consecuencia:'Neumoconiosis, asma ocupacional', probabilidad:'Media', severidad:'Alta', nivel_riesgo:'Importante', medida_control:'Ventilación forzada, respiradores, exámenes médicos periódicos', protocolo:null, responsable:'Prevencionista', estado:'activo' },
  ];

  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="flex justify-between items-center mb-5">
      <div class="flex gap-4 flex-wrap text-sm">
        ${['Intolerable','Importante','Moderado','Tolerable','Trivial'].map(r => `
          <span class="flex items-center gap-1.5"><span class="w-4 h-4 rounded riesgo-${r.toLowerCase()} inline-block border"></span>${r}</span>
        `).join('')}
      </div>
      <button class="btn btn-primary text-sm"><i class="fas fa-plus mr-1"></i>Nuevo Peligro</button>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Área / Puesto</th>
              <th>Peligro Identificado</th>
              <th>Tipo</th>
              <th>Consecuencia</th>
              <th>P</th>
              <th>S</th>
              <th>Nivel de Riesgo</th>
              <th>Medidas de Control</th>
              <th>Protocolo</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            ${miperData.map(m => `
              <tr>
                <td>
                  <div class="font-medium text-sm">${m.area}</div>
                  <div class="text-xs text-gray-500">${m.puesto}</div>
                </td>
                <td class="text-sm font-medium">${m.peligro}</td>
                <td><span class="badge badge-gray text-xs">${m.tipo_riesgo}</span></td>
                <td class="text-xs text-gray-600 max-w-xs">${m.consecuencia}</td>
                <td class="text-center"><span class="font-bold text-sm">${m.probabilidad[0]}</span></td>
                <td class="text-center"><span class="font-bold text-sm">${m.severidad[0]}</span></td>
                <td>
                  <span class="badge riesgo-${m.nivel_riesgo.toLowerCase()} border text-xs font-bold">
                    ${m.nivel_riesgo}
                  </span>
                </td>
                <td class="text-xs text-gray-600 max-w-sm">${m.medida_control}</td>
                <td>
                  ${m.protocolo
                    ? `<button class="badge badge-blue text-xs cursor-pointer" onclick="navigate('protocol-detail',{id:'${m.protocolo}'})">${m.protocolo}</button>`
                    : '<span class="text-gray-300">—</span>'}
                </td>
                <td class="text-xs text-gray-500">${m.responsable}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Risk Matrix Visual -->
    <div class="card p-5 mt-5">
      <h3 class="font-bold text-gray-800 mb-4">Matriz de Riesgo (Probabilidad × Severidad)</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-center text-sm border-collapse">
          <thead>
            <tr>
              <th class="p-3 bg-gray-100 border border-gray-200">Probabilidad \ Severidad</th>
              <th class="p-3 bg-gray-100 border border-gray-200">Leve</th>
              <th class="p-3 bg-gray-100 border border-gray-200">Media</th>
              <th class="p-3 bg-gray-100 border border-gray-200">Alta</th>
              <th class="p-3 bg-gray-100 border border-gray-200">Crítica</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-3 bg-gray-100 border border-gray-200 font-medium">Alta</td>
              <td class="p-3 border border-gray-200 riesgo-moderado font-bold">Moderado</td>
              <td class="p-3 border border-gray-200 riesgo-importante font-bold">Importante</td>
              <td class="p-3 border border-gray-200 riesgo-intolerable font-bold">Intolerable</td>
              <td class="p-3 border border-gray-200 riesgo-intolerable font-bold">Intolerable</td>
            </tr>
            <tr>
              <td class="p-3 bg-gray-100 border border-gray-200 font-medium">Media</td>
              <td class="p-3 border border-gray-200 riesgo-tolerable font-bold">Tolerable</td>
              <td class="p-3 border border-gray-200 riesgo-moderado font-bold">Moderado</td>
              <td class="p-3 border border-gray-200 riesgo-importante font-bold">Importante</td>
              <td class="p-3 border border-gray-200 riesgo-intolerable font-bold">Intolerable</td>
            </tr>
            <tr>
              <td class="p-3 bg-gray-100 border border-gray-200 font-medium">Baja</td>
              <td class="p-3 border border-gray-200 riesgo-trivial font-bold">Trivial</td>
              <td class="p-3 border border-gray-200 riesgo-tolerable font-bold">Tolerable</td>
              <td class="p-3 border border-gray-200 riesgo-moderado font-bold">Moderado</td>
              <td class="p-3 border border-gray-200 riesgo-importante font-bold">Importante</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================================
// REPORTS
// ============================================================
async function renderReports() {
  setPageTitle('Reportería y Estadísticas', 'Generación de informes de cumplimiento');
  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
      ${[
        { title:'Informe Anual Accidentabilidad', desc:'Tasa accidentabilidad, siniestralidad y análisis causal. Formato requerido por ISL/Mutualidades.', icon:'fa-chart-line', color:'red', tipo:'DIAT' },
        { title:'Cumplimiento Protocolos MINSAL', desc:'Estado de todos los protocolos: PREXOR, PLANESI, TMERT, UV, Psicosocial, MMC, Voz.', icon:'fa-clipboard-check', color:'blue', tipo:'PROTOCOLOS' },
        { title:'Estado Exámenes Médicos', desc:'Vigencia de audiometrías, radiografías OIT, exámenes musculoesqueléticos y preocupacionales.', icon:'fa-stethoscope', color:'green', tipo:'EXAMENES' },
        { title:'Inventario y Entregas EPP', desc:'Reporte de stock actual, ítems críticos y registro de entregas con firma digital.', icon:'fa-hard-hat', color:'orange', tipo:'EPP' },
        { title:'Plan de Capacitaciones ODI', desc:'Cobertura de capacitaciones, lista de asistencia y vigencias por protocolo.', icon:'fa-graduation-cap', color:'purple', tipo:'CAPACITACIONES' },
        { title:'Ficha Individual Trabajador', desc:'Ficha completa con historial de exámenes, EPP, capacitaciones y accidentes.', icon:'fa-user-circle', color:'indigo', tipo:'FICHA' },
      ].map(r => `
        <div class="card p-5 card-hover" onclick="alert('Generando informe ${r.tipo}...')">
          <div class="flex items-start gap-3 mb-3">
            <div class="w-11 h-11 rounded-xl bg-${r.color}-50 flex items-center justify-center text-${r.color}-600 text-xl flex-shrink-0">
              <i class="fas ${r.icon}"></i>
            </div>
            <div>
              <div class="font-bold text-gray-800 text-sm">${r.title}</div>
              <div class="text-xs text-gray-500 mt-1">${r.desc}</div>
            </div>
          </div>
          <div class="flex gap-2 mt-3">
            <button class="btn btn-danger text-xs flex-1 justify-center"><i class="fas fa-file-pdf mr-1"></i>PDF</button>
            <button class="btn btn-success text-xs flex-1 justify-center"><i class="fas fa-file-excel mr-1"></i>Excel</button>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Architecture Info Panel -->
    <div class="card p-6 mb-5 chile-accent">
      <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i class="fas fa-sitemap text-blue-600"></i>
        Propuesta de Arquitectura y Stack Tecnológico
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-blue-50 rounded-xl p-4">
          <h3 class="font-bold text-blue-800 mb-3"><i class="fas fa-desktop mr-2"></i>Frontend (MVP)</h3>
          <ul class="text-sm text-blue-700 space-y-1.5">
            <li>✅ <strong>Hono + TypeScript</strong> - Backend edge</li>
            <li>✅ <strong>TailwindCSS</strong> - UI responsive</li>
            <li>✅ <strong>Chart.js</strong> - Visualizaciones</li>
            <li>🔄 <strong>React/Vue</strong> - Fase 2 SPA compleja</li>
            <li>🔄 <strong>Next.js</strong> - Producción SSR</li>
          </ul>
        </div>
        <div class="bg-green-50 rounded-xl p-4">
          <h3 class="font-bold text-green-800 mb-3"><i class="fas fa-server mr-2"></i>Backend (Producción)</h3>
          <ul class="text-sm text-green-700 space-y-1.5">
            <li>🔄 <strong>Node.js + Hono</strong> - API REST</li>
            <li>🔄 <strong>PostgreSQL</strong> - Base de datos principal</li>
            <li>🔄 <strong>Redis</strong> - Caché y sesiones</li>
            <li>🔄 <strong>JWT + BCrypt</strong> - Autenticación</li>
            <li>🔄 <strong>Prisma ORM</strong> - Gestión BD</li>
          </ul>
        </div>
        <div class="bg-purple-50 rounded-xl p-4">
          <h3 class="font-bold text-purple-800 mb-3"><i class="fas fa-cloud mr-2"></i>Infraestructura</h3>
          <ul class="text-sm text-purple-700 space-y-1.5">
            <li>🔄 <strong>Cloudflare Workers</strong> - Edge CDN</li>
            <li>🔄 <strong>Cloudflare D1</strong> - SQLite distribuido</li>
            <li>🔄 <strong>R2</strong> - Documentos/PDFs</li>
            <li>🔄 <strong>Ley 19.628</strong> - Cifrado datos</li>
            <li>🔄 <strong>Backup automático</strong> - Cumplimiento</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Development Plan -->
    <div class="card p-6">
      <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i class="fas fa-road text-green-600"></i>
        Plan de Desarrollo por Fases
      </h2>
      <div class="space-y-4">
        <div class="border rounded-xl overflow-hidden">
          <div class="bg-green-600 text-white px-5 py-3 flex items-center gap-2">
            <i class="fas fa-rocket"></i>
            <span class="font-bold">FASE 1 - MVP (Meses 1-3)</span>
            <span class="ml-auto badge bg-white text-green-700">EN DESARROLLO</span>
          </div>
          <div class="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            ${['✅ Dashboard ejecutivo','✅ Gestión de trabajadores','✅ Protocolos MINSAL básicos','✅ Registro DIAT/DIEP','✅ Control EPP','✅ Alertas vencimiento','🔄 Autenticación por roles','🔄 Generación PDF DIAT/DIEP'].map(i=>`<div class="bg-gray-50 rounded p-2">${i}</div>`).join('')}
          </div>
        </div>
        <div class="border rounded-xl overflow-hidden">
          <div class="bg-blue-600 text-white px-5 py-3 flex items-center gap-2">
            <i class="fas fa-layer-group"></i>
            <span class="font-bold">FASE 2 - Evolución (Meses 4-8)</span>
            <span class="ml-auto badge bg-white text-blue-700">PLANIFICADO</span>
          </div>
          <div class="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            ${['🔄 Firma digital trabajadores','🔄 Módulo CEAL-SM encuestas','🔄 Importación masiva Excel','🔄 App móvil (React Native)','🔄 Notificaciones email/SMS','🔄 Auditoría de cambios'].map(i=>`<div class="bg-gray-50 rounded p-2">${i}</div>`).join('')}
          </div>
        </div>
        <div class="border rounded-xl overflow-hidden">
          <div class="bg-purple-600 text-white px-5 py-3 flex items-center gap-2">
            <i class="fas fa-crown"></i>
            <span class="font-bold">FASE 3 - SaaS Completo (Meses 9-18)</span>
            <span class="ml-auto badge bg-white text-purple-700">ROADMAP</span>
          </div>
          <div class="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            ${['🔄 Multiempresa (SaaS)','🔄 API pública REST','🔄 Integración mutualidades','🔄 BI y analítica avanzada','🔄 Módulo Ley 21.561 (40h)','🔄 Cumplimiento Ley 19.628'].map(i=>`<div class="bg-gray-50 rounded p-2">${i}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// MODALS
// ============================================================
function showModal(title, bodyHTML, footerHTML = '') {
  const existing = document.getElementById('modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };

  overlay.innerHTML = `
    <div class="modal-box fade-in">
      <div class="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 class="font-bold text-gray-800 text-base">${title}</h3>
        <button onclick="closeModal()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="p-5">${bodyHTML}</div>
      ${footerHTML ? `<div class="p-5 border-t border-gray-100 flex gap-3 justify-end">${footerHTML}</div>` : ''}
    </div>
  `;
  document.body.appendChild(overlay);
}

function closeModal() {
  const el = document.getElementById('modal-overlay');
  if (el) el.remove();
}

function showAddWorkerModal() {
  showModal('Nuevo Trabajador', `
    <div class="grid grid-cols-2 gap-4">
      <div><label class="form-label">RUT</label><input class="form-input" placeholder="12.345.678-9"></div>
      <div><label class="form-label">Nombres</label><input class="form-input" placeholder="Nombres"></div>
      <div><label class="form-label">Apellidos</label><input class="form-input" placeholder="Apellidos"></div>
      <div><label class="form-label">Cargo</label><input class="form-input" placeholder="Cargo"></div>
      <div><label class="form-label">Área</label>
        <select class="form-input"><option>Producción</option><option>Administración</option><option>Logística</option><option>Mantenimiento</option></select>
      </div>
      <div><label class="form-label">Mutualidad</label>
        <select class="form-input"><option>ACHS</option><option>IST</option><option>Mutual</option><option>ISL</option></select>
      </div>
      <div><label class="form-label">Fecha de Ingreso</label><input type="date" class="form-input"></div>
      <div><label class="form-label">Email</label><input type="email" class="form-input" placeholder="correo@empresa.cl"></div>
    </div>
  `, `<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="saveWorker()"><i class="fas fa-save mr-1"></i>Guardar</button>`);
}

function showNewAccidentModal() {
  showModal('Registrar Accidente (DIAT/DIEP)', `
    <div class="grid grid-cols-2 gap-4">
      <div><label class="form-label">Tipo</label>
        <select class="form-input"><option value="DIAT">DIAT - Accidente del Trabajo</option><option value="DIEP">DIEP - Enfermedad Profesional</option></select>
      </div>
      <div><label class="form-label">Fecha del Accidente</label><input type="date" class="form-input"></div>
      <div><label class="form-label">Trabajador</label><input class="form-input" placeholder="Nombre del trabajador"></div>
      <div><label class="form-label">Hora</label><input type="time" class="form-input"></div>
      <div class="col-span-2"><label class="form-label">Lugar del Accidente</label><input class="form-input" placeholder="Descripción del lugar"></div>
      <div class="col-span-2"><label class="form-label">Descripción del Accidente</label><textarea class="form-input" rows="3" placeholder="Descripción detallada del evento..."></textarea></div>
      <div><label class="form-label">Lesión</label><input class="form-input" placeholder="Tipo y ubicación de lesión"></div>
      <div><label class="form-label">Gravedad</label>
        <select class="form-input"><option>Leve</option><option>Moderado</option><option>Grave</option><option>Fatal</option></select>
      </div>
    </div>
  `, `<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-danger" onclick="saveAccident()"><i class="fas fa-save mr-1"></i>Guardar DIAT/DIEP</button>`);
}

function showNewEvalModal(protocolId) {
  showModal(`Nueva Evaluación - ${protocolId}`, `
    <div class="grid grid-cols-2 gap-4">
      <div><label class="form-label">Trabajador</label><input class="form-input" placeholder="Nombre del trabajador"></div>
      <div><label class="form-label">Fecha de Evaluación</label><input type="date" class="form-input" value="${new Date().toISOString().split('T')[0]}"></div>
      <div><label class="form-label">Resultado</label><input class="form-input" placeholder="Resultado de la evaluación"></div>
      <div><label class="form-label">Próxima Evaluación</label><input type="date" class="form-input"></div>
      <div class="col-span-2"><label class="form-label">Observaciones</label><textarea class="form-input" rows="3"></textarea></div>
    </div>
  `, `<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="closeModal()"><i class="fas fa-save mr-1"></i>Guardar</button>`);
}

function showNewCapModal() {
  showModal('Nueva Capacitación', `
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-2"><label class="form-label">Nombre de la Capacitación</label><input class="form-input" placeholder="Ej: ODI - Obligación de Informar"></div>
      <div><label class="form-label">Tipo</label>
        <select class="form-input"><option>ODI</option><option>PREXOR</option><option>PLANESI</option><option>TMERT</option><option>UV</option><option>MMC</option><option>EPP</option><option>PA</option></select>
      </div>
      <div><label class="form-label">Fecha</label><input type="date" class="form-input"></div>
      <div><label class="form-label">Duración (horas)</label><input type="number" class="form-input" placeholder="4"></div>
      <div><label class="form-label">Relator</label><input class="form-input" placeholder="Nombre del relator"></div>
    </div>
  `, `<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="closeModal()"><i class="fas fa-save mr-1"></i>Guardar</button>`);
}

// Stubs for save functions
function saveWorker() { showToast('Trabajador guardado (demo)', 'success'); closeModal(); }
function saveAccident() { showToast('DIAT/DIEP registrada (demo)', 'success'); closeModal(); }

// ============================================================
// HELPERS & UTILS
// ============================================================
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-CL', { day:'2-digit', month:'2-digit', year:'numeric' });
}

function estadoBadge(estado) {
  const map = {
    vigente: 'badge-green',
    vencido: 'badge-red',
    por_vencer: 'badge-yellow',
    activo: 'badge-green',
    critico: 'badge-red',
    requiere_atencion: 'badge-orange',
  };
  const labels = {
    vigente: 'Vigente', vencido: 'Vencido', por_vencer: 'Por vencer',
    activo: 'Activo', critico: 'Crítico', requiere_atencion: 'Atención'
  };
  return `<span class="badge ${map[estado] || 'badge-gray'}">${labels[estado] || estado}</span>`;
}

function estadoBadgeGeneric(estado) {
  if (!estado) return '<span class="badge badge-gray">—</span>';
  const colorMap = {
    cerrado: 'badge-green', vigente: 'badge-green', activo: 'badge-green',
    en_proceso: 'badge-yellow', por_vencer: 'badge-yellow', por_renovar: 'badge-yellow',
    vencido: 'badge-red', critico: 'badge-red',
    en_vigilancia: 'badge-purple', con_intervencion: 'badge-blue',
  };
  const label = estado.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return `<span class="badge ${colorMap[estado] || 'badge-gray'} text-xs">${label}</span>`;
}

function stockBadge(estado) {
  const m = { ok: 'badge-green', bajo: 'badge-yellow', critico: 'badge-red' };
  const l = { ok: '✓ OK', bajo: '⚠ Bajo', critico: '✗ Crítico' };
  return `<span class="badge ${m[estado] || 'badge-gray'}">${l[estado] || estado}</span>`;
}

function stringToColor(str) {
  const colors = ['#1d4ed8','#7c3aed','#0f766e','#b45309','#c2410c','#0369a1','#4f46e5','#be185d','#15803d','#9333ea'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function modalRow(label, value) {
  return `<div class="bg-gray-50 rounded-lg p-3"><div class="text-xs text-gray-500 mb-0.5">${label}</div><div class="font-semibold text-gray-800">${value || '—'}</div></div>`;
}

function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  const colors = { success: 'bg-green-600', error: 'bg-red-600', warning: 'bg-yellow-500' };
  toast.className = `fixed bottom-5 right-5 z-50 ${colors[type]} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium fade-in flex items-center gap-2`;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  navigate('dashboard');
});
