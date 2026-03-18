# HSE 360 — Plataforma Integral de Seguridad, Salud y Medio Ambiente

## Sistema Integral de Salud Ocupacional y Prevención de Riesgos

Plataforma web SaaS para la gestión completa de salud ocupacional, cumplimiento de Protocolos MINSAL y prevención de riesgos laborales bajo la **Ley 16.744** y el **D.S. N°44** (vigente 01/02/2025).

---

## 🚀 URL de Acceso (Desarrollo)

**URL:** `https://3000-i2egfquicvepdt9e6ipkl-2e77fc33.sandbox.novita.ai`

---

## ⚖️ Marco Normativo Actualizado — DS 44 (01/02/2025)

| Cambio normativo | Antes (derogado) | Ahora (DS 44 vigente) |
|---|---|---|
| Información de riesgos al trabajador | ODI — Obligación de Informar (D.S. N°40 Art.21) | **IRL — Informe de Riesgos Laborales (DS 44 Art.15)** |
| Instrumento psicosocial | ISTAS21 | **CEAL-SM/SUSESO** |
| Firma del documento | Firma simple | **Firma ológrafa + huella digital** |
| Marco de gestión | D.S. N°40 / D.S. N°54 (1969) | **D.S. N°44 (2024)** |

> **IRL (Informe de Riesgos Laborales):** reemplaza a la ODI (D.S. N°40/1969) desde el 1 de febrero de 2025. Debe entregarse a cada trabajador con firma ológrafa y huella digital, informando los riesgos específicos de su puesto, las medidas preventivas y los EPP requeridos.

---

## ✅ Funcionalidades Implementadas (MVP)

### 🏠 Dashboard Ejecutivo
- KPIs en tiempo real: Tasa de accidentabilidad, siniestralidad, protocolos, exámenes, EPP
- Cobertura IRL (DS 44) en KPI de capacitaciones
- Gráficos interactivos: Accidentabilidad mensual comparativa y cumplimiento de protocolos
- Alertas prioritarias en pantalla principal

### 👥 Gestión de Trabajadores
- Ficha integral con datos personales, cargo, área, mutualidad
- Búsqueda y filtrado por nombre, RUT, área, mutualidad
- Vista detallada con historial de exámenes
- Indicadores de protocolos activos y exámenes pendientes

### 📋 Protocolos MINSAL — 7 protocolos — DS 44

| Protocolo | Riesgo | Norma principal | IRL requerido |
|-----------|--------|-----------------|---------------|
| PREXOR | Ruido ocupacional ≥ 82 dB(A) | DS 594 Art.74-83 | Sí, Art.15 DS 44 |
| PLANESI | Polvo de sílice | DS 594 Art.61-67 | Sí, Art.15 DS 44 |
| TMERT | Trastornos músculo-esqueléticos | Circ. MINSAL 3E/170 | Sí, Art.15 DS 44 |
| PSICOSOCIAL | Riesgos psicosociales (CEAL-SM/SUSESO) | Circ. MINSAL 3E/187 | Sí, Art.15 DS 44 |
| UV | Radiación ultravioleta solar | Ley 20.096 · DS 594 | Sí, Art.15 DS 44 |
| MMC | Manejo manual de cargas | DS 63/2005 MINTRAB | Sí, Art.15 DS 44 |
| VOZ | Trastornos de voz ocupacionales | Circ. MINSAL 3E/186 | Sí, Art.15 DS 44 |

#### Funcionalidades por protocolo:
- **Tarjetas** con % cumplimiento, estado y acceso rápido
- **Carta Gantt interactiva DS 44**: cronograma anual con mes actual destacado, estados por actividad (Realizado / En curso / Atrasado / Pendiente), filtro por protocolo, exportar Excel/PDF
- **Paso a Paso DS 44**: guía por fases con evidencias, marco legal, selector de cumplimiento por ítem y fecha
- **IRL modal**: formulario completo con firma ológrafa + huella digital conforme DS 44 Art.15
- Vista de detalle con mini Carta Gantt integrada

### 📚 Capacitaciones — IRL (DS 44)
- **IRL (Informe de Riesgos Laborales)** — reemplaza ODI (D.S. N°40/1969) desde 01/02/2025
- Registro de sesiones IRL con cobertura por trabajadores
- Tipo "IRL (DS 44)" en el formulario de nueva capacitación
- KPI de cobertura IRL en dashboard y reportes
- Registro por tipo de protocolo con vigencia y estado

### ⚠️ DIAT / DIEP
- Registro de accidentes del trabajo y enfermedades profesionales
- KPIs: Tasa accidentabilidad, siniestralidad, mortalidad
- Análisis de causas y acciones correctivas

### 🦺 Control de EPP
- Inventario con stock actual vs. mínimo, alertas críticas
- Registro de entregas con control de firma digital
- Normas técnicas asociadas

### 📊 Matriz MIPER
- Identificación de peligros por área y puesto
- Niveles: Trivial, Tolerable, Moderado, Importante, Intolerable
- Vinculación con protocolos MINSAL

### 📈 Reportería
- Informes: Accidentabilidad, Protocolos MINSAL, Exámenes, EPP, IRL (DS 44), Ficha Individual
- KPI cobertura IRL en resumen ejecutivo
- Base legal actualizada: DS 44 Art.15 en lugar de DS 40 Art.21

---

## 🗺️ Rutas API

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/workers` | Lista trabajadores con filtros |
| `GET /api/workers/:id` | Ficha completa trabajador |
| `GET /api/protocols` | Lista todos los protocolos |
| `GET /api/protocols/:id` | Detalle protocolo con evaluaciones |
| `GET /api/accidents` | DIAT/DIEP registrados |
| `GET /api/accidents/stats` | Estadísticas de accidentabilidad |
| `GET /api/epp` | Inventario EPP |
| `GET /api/epp/entregas` | Registro de entregas EPP |
| `GET /api/capacitations` | Lista capacitaciones (tipo IRL, DS 44) |
| `GET /api/capacitations/stats` | Stats con `cobertura_irl_pct` |
| `GET /api/dashboard/kpis` | KPIs ejecutivos (incluye `cobertura_irl`) |
| `GET /api/dashboard/chart-accidentes` | Datos gráfico accidentes |
| `GET /api/dashboard/chart-protocolos` | Datos gráfico protocolos |
| `GET /api/alerts` | Alertas activas |

---

## 🏗️ Arquitectura y Stack

- **Backend**: Hono 4.x + TypeScript (Cloudflare Workers)
- **Frontend**: SPA Vanilla JS + TailwindCSS CDN + Chart.js
- **Build**: Vite 6 + @hono/vite-cloudflare-pages
- **Deploy**: Cloudflare Pages
- **Auth**: JWT simulado (roles: SuperAdmin, Prevencionista, Médico, RRHH, Trabajador)

---

## 📅 Plan de Desarrollo

### Fase 1 — MVP ← ACTUAL ✅
- [x] Dashboard ejecutivo con KPIs (DS 44 cobertura IRL)
- [x] Gestión de trabajadores con ficha integral
- [x] 7 Protocolos MINSAL con Carta Gantt DS 44 y Paso a Paso
- [x] IRL (DS 44 Art.15) — reemplaza ODI — en todos los módulos
- [x] CEAL-SM/SUSESO (reemplaza ISTAS21) en módulo psicosocial
- [x] Registro DIAT/DIEP
- [x] Control EPP con firma
- [x] Capacitaciones IRL con cobertura
- [x] Alertas automáticas
- [x] Matriz MIPER

### Fase 2
- [ ] Firma digital real de IRL (biométrica + ológrafa)
- [ ] Módulo CEAL-SM encuestas online
- [ ] Importación masiva Excel (Carta Gantt y Paso a Paso)
- [ ] App móvil (React Native)
- [ ] Notificaciones email/SMS automatizadas

### Fase 3 — SaaS
- [ ] Multiempresa
- [ ] Integración directa OAL (ACHS, IST, Mutual, ISL)
- [ ] BI y analítica avanzada
- [ ] Cumplimiento Ley 19.628

---

## ⚖️ Cumplimiento Legal
- **D.S. N°44** (2024): Marco de prevención de riesgos — vigente 01/02/2025
- **Ley 16.744**: Seguro Social contra Accidentes del Trabajo y Enfermedades Profesionales
- **DS 594**: Condiciones sanitarias y ambientales básicas
- **Ley 20.949**: Manejo manual de cargas
- **Ley 20.096**: Radiación UV
- **Ley 21.645**: Acoso laboral y sexual (módulo psicosocial)

---

## Última Actualización
Marzo 2026 · Stack: Hono 4.x + TypeScript + TailwindCSS · Estado: ✅ MVP DS 44 Actualizado
