# HSE 360 Pro — Sistema Integral de Gestión HSE
## SOLDESP S.A. · RUT 76.841.820-9 · N° Asociada 2000143137

---

## Descripción del Proyecto
Plataforma integral de Seguridad, Salud y Medio Ambiente (HSE) para SOLDESP S.A., implementada con Hono + Cloudflare Workers/Pages. Cubre gestión de protocolos MINSAL, accidentabilidad, EPP, capacitaciones, MIPER y vigilancia de salud ocupacional.

---

## URLs
- **Desarrollo (Sandbox)**: https://3000-i2egfquicvepdt9e6ipkl-2e77fc33.sandbox.novita.ai
- **Producción (Cloudflare)**: ⏳ Pendiente configuración API key Cloudflare (ver sección Deploy)
- **Referencia Netlify**: https://hsec360-pro-soldesp.netlify.app/

---

## Funcionalidades Implementadas

### ✅ Dashboard
- Datos reales certificados por Mutualidad (Folio 0005153838)
- **3 períodos históricos SOLDESP S.A.:**
  - 2023 (Feb/23–Feb/24): TF=0.56, TG=7.82, TS=48 — 1 accidente, 286 días perdidos
  - 2024 (Feb/24–Feb/25): TF=0.50, TG=7.51, TS=2 — 1 accidente, 15 días perdidos
  - 2025 (Feb/25–Feb/26): TF=0.00, TG=0.00, TS=0 — **0 accidentes, 0 días perdidos**
- Banner con cotización total: 0,93%
- Gráfico de tasas históricas certificadas (frecuencia, gravedad, siniestralidad)
- Superadmin puede editar KPIs, períodos históricos y cumplimiento de protocolos

### ✅ Protocolos MINSAL (8 protocolos — sin VOZ)
1. **PREXOR** — Exposición Ocupacional al Ruido (DS 594, DS 44/2025)
2. **PLANESI** — Plan Nacional de Erradicación de Silicosis
3. **TMERT** — Trastornos Músculo-Esqueléticos (MINSAL)
4. **PSICOSOCIAL** — Riesgos Psicosociales CEAL-SM
5. **UV** — Radiación UV de Origen Solar
6. **MMC** — Manejo Manual de Cargas (Ley 20.949)
7. **HIC** — Hipobaria Intermitente Crónica (Guía MINSAL 2013, DS 594, Circ. SUSESO 3838/2024, DS 44/2025)
8. **HUMOS** — Metales, Metaloides y Humos de Soldadura (Res. Exenta N°606/2023, DS 594 Art.59-65, NCh 3358)

### ✅ Gestión de Trabajadores
- CRUD completo (crear, editar, eliminar, reactivar)
- Filtros por área, estado, protocolo, mutualidad
- Ficha integral con exámenes y protocolos activos
- Superadmin: edición completa de todos los campos

### ✅ EPP — Equipos de Protección Personal
- Inventario con estado de stock (ok/bajo/crítico)
- Registro de entregas con firma digital
- POST /epp para crear nuevos ítems (antes faltaba)
- GET /epp/:id para obtener ítem específico
- Superadmin: edición real de stock, norma técnica, vencimiento de lote

### ✅ Capacitaciones IRL (DS 44 Art. 15)
- 10 capacitaciones registradas incluyendo HIC y HUMOS
- showEditCapModal: edición completa con llamada API real
- saveNewCap: registro con llamada API real (antes solo toast)
- Tipos disponibles: IRL, PREXOR, PLANESI, TMERT, PSICOSOCIAL, UV, MMC, HIC, HUMOS, Emergencias, EPP, Primeros Auxilios, Altura, Manejo Defensivo, Inducción

### ✅ Accidentes / DIAT / DIEP
- Registro DIAT y DIEP (Ley 16.744)
- saveAccident: registro con llamada API real (antes solo toast)
- showEditAccidentModal: edición completa para superadmin
- Campos: tipo, trabajador, gravedad, días perdidos, mutualidad, descripción, medidas correctivas

### ✅ MIPER — Matriz de Identificación de Peligros
- CRUD completo (crear, editar, eliminar)
- Niveles: Trivial, Tolerable, Moderado, Importante, Intolerable
- Vinculado a protocolos HIC y HUMOS (eliminado VOZ)

### ✅ Alertas del Sistema
- Filtros por prioridad (crítica, alta, media, baja)
- showEditAlertModal: edición completa para superadmin
- Botón editar inline visible solo para superadmin

### ✅ Centros de Trabajo
- CRUD completo
- Protocolos activos actualizados (HIC en lugar de VOZ)

### ✅ Usuarios
- 6 roles: superadmin, prevencionista, médico, RRHH, trabajador
- Crear, editar, restablecer contraseña, desactivar
- Creación de nuevo superadmin bloqueada (solo 1 permitido)

### ✅ Reportes
- 8 tipos de informes (PDF/Excel/Vista previa)
- Resumen ejecutivo con KPIs en tiempo real

---

## SuperAdministrador — Acceso Completo (Sin Demo)

**Credenciales:**
- Email: `raul.diaz@hse360.cl`
- Password: `HSE360admin!`

**Permisos de edición activos:**
| Módulo | Acciones disponibles |
|--------|---------------------|
| Dashboard | Editar KPIs, períodos históricos, cumplimiento protocolos |
| Trabajadores | Crear, editar, eliminar, reactivar |
| EPP | Crear ítems, editar stock/normas, registrar entregas |
| Capacitaciones | Crear, editar completo (todos los campos) |
| Accidentes | Registrar DIAT/DIEP, editar completo |
| MIPER | Crear peligros, editar, eliminar |
| Alertas | Editar título, descripción, prioridad, estado |
| Protocolos | Editar evaluaciones, registrar actividades Gantt |
| Centros | Crear, editar, desactivar centros de trabajo |
| Usuarios | CRUD completo de usuarios y roles |

---

## Datos de Accidentabilidad — Certificado Mutualidad

**Empresa:** SOLDESP S.A.  
**RUT:** 76.841.820-9  
**N° Asociada:** 2000143137  
**Folio Certificado:** 0005153838  
**Cotización Total:** 0,93% (básica 0,93% + adicional 0,00%)

| Período | Acc. | Días Perdidos | Trab. Prom. | HH | TF | TG | TS |
|---------|------|---------------|-------------|-----|-----|-----|-----|
| Feb/23–Feb/24 | 1 | 286 (14 acc + 272 EP) | 589 | 1.791.153 | 0,56 | 7,82 | 48 |
| Feb/24–Feb/25 | 1 | 15 | 712 | 1.997.352 | 0,50 | 7,51 | 2 |
| Feb/25–Feb/26 | 0 | 0 | 551 | 1.338.309 | 0,00 | 0,00 | 0 |

---

## Arquitectura

```
webapp/
├── src/
│   ├── index.tsx              # Hono app principal + routing
│   └── routes/
│       ├── auth.ts            # Login / logout / sesión
│       ├── dashboard.ts       # KPIs, accidentabilidad SOLDESP (datos reales)
│       ├── workers.ts         # Trabajadores + exámenes
│       ├── protocols.ts       # 8 protocolos MINSAL
│       ├── capacitations.ts   # Capacitaciones IRL
│       ├── accidents.ts       # DIAT / DIEP
│       ├── epp.ts             # Inventario + entregas EPP
│       ├── miper.ts           # Matriz de peligros
│       ├── alerts.ts          # Sistema de alertas
│       ├── centros.ts         # Centros de trabajo
│       └── users.ts           # Gestión de usuarios
├── public/static/
│   ├── app.js                 # SPA frontend completo
│   └── styles.css             # Estilos HSE 360
├── dist/                      # Build Cloudflare Pages
└── wrangler.jsonc             # Configuración Cloudflare
```

---

## Stack Tecnológico
- **Backend:** Hono Framework + TypeScript → Cloudflare Workers
- **Frontend:** Vanilla JS SPA + Tailwind CSS (CDN) + Chart.js + Axios
- **Deploy:** Cloudflare Pages (edge global)
- **Íconos:** Font Awesome 6
- **Base Legal:** Ley 16.744, DS 594, DS 44/2025, DS 109, Res. 606/2023 MINSAL

---

## Deploy a Producción

### Pre-requisitos
1. Configurar API key Cloudflare en el tab **Deploy** del panel lateral
2. Ejecutar: `setup_cloudflare_api_key`
3. Verificar: `npx wrangler whoami`

### Comandos
```bash
# Build
npm run build

# Crear proyecto (primera vez)
npx wrangler pages project create hse360-pro-soldesp --production-branch main

# Deploy
npx wrangler pages deploy dist --project-name hse360-pro-soldesp
```

---

## Versión y Cambios Recientes

### v2.1.0 (2026-03-18)
- ✅ Eliminado protocolo VOZ de todos los módulos
- ✅ Incorporado HIC (Hipobaria Intermitente Crónica) con documentación completa
- ✅ Incorporado HUMOS (Metales y Humos de Soldadura) con documentación completa
- ✅ Dashboard actualizado con datos reales certificados SOLDESP (Folio 0005153838)
- ✅ SuperAdmin: showEditCapModal funcional con API real
- ✅ SuperAdmin: saveNewCap/saveAccident/saveAddEPP con llamadas API reales
- ✅ SuperAdmin: showEditAccidentModal (edición completa accidentes)
- ✅ SuperAdmin: showEditAlertModal (edición completa alertas)
- ✅ SuperAdmin: saveEditEPP con API real + POST /epp para crear ítems
- ✅ SuperAdmin: botón "Editar %" en gráfico de cumplimiento de protocolos
- ✅ Contadores actualizados a /8 protocolos

---

*Desarrollado por NexusForge · Connecting Innovation with Power*  
*HSE 360 v2.1 · Sistema de Gestión Integral · Chile 2026*
