# SaludTrabajo Chile 🏥

## Sistema Integral de Salud Ocupacional y Prevención de Riesgos

Plataforma web SaaS para la gestión completa de salud ocupacional, cumplimiento de Protocolos MINSAL y prevención de riesgos laborales bajo la **Ley 16.744** chilena.

---

## 🚀 URL de Acceso (Desarrollo)

**URL:** `https://3000-i2egfquicvepdt9e6ipkl-2e77fc33.sandbox.novita.ai`

---

## ✅ Funcionalidades Implementadas (MVP)

### 🏠 Dashboard Ejecutivo
- KPIs en tiempo real: Tasa de accidentabilidad, siniestralidad, protocolos, exámenes, EPP
- Gráficos interactivos: Accidentabilidad mensual comparativa y cumplimiento de protocolos
- Alertas prioritarias en pantalla principal
- Acciones rápidas de navegación

### 👥 Gestión de Trabajadores
- Ficha integral con datos personales, cargo, área, mutualidad
- Búsqueda y filtrado por nombre, RUT, área, mutualidad
- Vista detallada con historial de exámenes
- Indicadores de protocolos activos y exámenes pendientes

### 📋 Protocolos MINSAL (7 protocolos)
- **PREXOR**: Exposición a ruido, NSE, audiometrías, uso EPA
- **PLANESI**: Exposición a sílice, concentración, radiografías OIT, EPR
- **TMERT**: Evaluación ergonómica, riesgo EESS, pausas activas
- **Psicosocial**: CEAL-SM/SUSESO ISTAS21, dimensiones, planes de intervención
- **Radiación UV**: Índices UV, EPP fotoproteción, capacitaciones
- **MMC**: Manejo Manual de Cargas, Ley 20.949
- **Trastornos de Voz**: Vigilancia vocal profesional

### ⚠️ DIAT / DIEP
- Registro de accidentes del trabajo (DIAT) y enfermedades profesionales (DIEP)
- KPIs: Tasa accidentabilidad, siniestralidad, mortalidad
- Análisis de causas inmediatas y básicas (metodología árbol de causas)
- Acciones correctivas y seguimiento

### 🦺 Control de EPP
- Inventario con stock actual vs. mínimo, alertas críticas
- Registro de entregas con control de firma digital
- Categorías: Auditivo, Respiratorio, UV, Cabeza, Manos, Pies, Alta Visibilidad
- Normas técnicas asociadas (ANSI, NIOSH, EN)

### 📚 Capacitaciones
- ODI (Obligación de Informar) con % de cobertura
- Registro por tipo de protocolo con vigencia y estado
- Relator, duración, aprobados/reprobados
- Control de documentos adjuntos

### 🔔 Alertas y Notificaciones
- 12 alertas activas: Críticas, Altas, Medias
- Tipos: Examen vencido, protocolo crítico, stock crítico, capacitación vencida, firma pendiente
- Filtrado por prioridad
- Marcado como leída

### 📊 Matriz MIPER
- Identificación de peligros por área y puesto
- Clasificación por tipo de riesgo (Físico, Químico, Ergonómico, Psicosocial, Mecánico)
- Niveles: Trivial, Tolerable, Moderado, Importante, Intolerable
- Medidas de control y vinculación con protocolos
- Matriz visual Probabilidad × Severidad

### 📈 Reportería
- Informes disponibles: Accidentabilidad, Protocolos MINSAL, Exámenes, EPP, Capacitaciones, Ficha Individual
- Exportación PDF y Excel (integración en Fase 2)
- Panel de Arquitectura y Plan de Desarrollo integrado

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
| `GET /api/capacitations` | Lista capacitaciones |
| `GET /api/dashboard/kpis` | KPIs ejecutivos |
| `GET /api/dashboard/chart-accidentes` | Datos gráfico accidentes |
| `GET /api/dashboard/chart-protocolos` | Datos gráfico protocolos |
| `GET /api/alerts` | Alertas activas |

---

## 🏗️ Arquitectura y Stack

### MVP (Actual)
- **Backend**: Hono + TypeScript (Cloudflare Workers)
- **Frontend**: SPA Vanilla JS + TailwindCSS + Chart.js
- **Build**: Vite + @hono/vite-build
- **Deploy**: Cloudflare Pages

### Producción (Fase 2-3)
- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Node.js + Hono + PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + BCrypt (roles: SuperAdmin, Prevencionista, Médico, RRHH, Trabajador)
- **Infra**: Cloudflare Workers + D1 + R2
- **Cumplimiento**: Ley 19.628 (cifrado datos sensibles)

---

## 📅 Plan de Desarrollo

### Fase 1 - MVP (Meses 1-3) ← ACTUAL
- [x] Dashboard ejecutivo con KPIs
- [x] Gestión de trabajadores con ficha integral
- [x] 7 Protocolos MINSAL
- [x] Registro DIAT/DIEP
- [x] Control EPP con firma
- [x] Capacitaciones y ODI
- [x] Alertas automáticas
- [x] Matriz MIPER
- [ ] Autenticación por roles
- [ ] Generación real de PDF DIAT/DIEP

### Fase 2 (Meses 4-8)
- [ ] Firma digital trabajadores
- [ ] Módulo CEAL-SM encuestas online
- [ ] Importación masiva Excel
- [ ] App móvil (React Native)
- [ ] Notificaciones email/SMS automatizadas

### Fase 3 - SaaS (Meses 9-18)
- [ ] Multiempresa
- [ ] API pública REST
- [ ] Integración directa mutualidades (ACHS, IST, Mutual, ISL)
- [ ] BI y analítica avanzada
- [ ] Módulo Ley 21.561 (40 horas)
- [ ] Cumplimiento estricto Ley 19.628

---

## ⚖️ Cumplimiento Legal
- **Ley 16.744**: Seguro Social contra Accidentes del Trabajo y Enfermedades Profesionales
- **DS 594**: Condiciones sanitarias y ambientales básicas en los lugares de trabajo
- **Ley 20.949**: Manejo manual de cargas
- **Ley 20.096**: Radiación UV
- **Ley 19.628**: Protección de datos personales y sensibles

---

## Última Actualización
Marzo 2024 · Stack: Hono 4.x + TypeScript + TailwindCSS · Estado: ✅ MVP Funcional
