import { Hono } from 'hono'

const app = new Hono()

// Datos en memoria — editables vía PUT/POST
export let workersDB = [
  { id: 1, rut: '12.345.678-9', nombres: 'Carlos Alberto', apellidos: 'González Muñoz', cargo: 'Operador de Maquinaria', area: 'Producción', fecha_ingreso: '2019-03-15', estado: 'activo', sexo: 'M', fecha_nacimiento: '1985-07-22', email: 'cgonzalez@empresa.cl', telefono: '+56912345678', mutualidad: 'ACHS', turno: 'Diurno', contrato: 'Indefinido', protocolos_activos: ['PREXOR','TMERT','UV'], observaciones: '' },
  { id: 2, rut: '15.678.901-2', nombres: 'María Fernanda', apellidos: 'Rodríguez Soto', cargo: 'Supervisora de Calidad', area: 'Calidad', fecha_ingreso: '2021-06-01', estado: 'activo', sexo: 'F', fecha_nacimiento: '1990-11-10', email: 'mrodriguez@empresa.cl', telefono: '+56987654321', mutualidad: 'IST', turno: 'Diurno', contrato: 'Indefinido', protocolos_activos: ['TMERT','PSICOSOCIAL'], observaciones: '' },
  { id: 3, rut: '9.876.543-1', nombres: 'Jorge Andrés', apellidos: 'Martínez Pérez', cargo: 'Mecánico Industrial', area: 'Mantenimiento', fecha_ingreso: '2017-09-20', estado: 'activo', sexo: 'M', fecha_nacimiento: '1978-04-05', email: 'jmartinez@empresa.cl', telefono: '+56934567890', mutualidad: 'ACHS', turno: 'Mixto', contrato: 'Indefinido', protocolos_activos: ['PREXOR','PLANESI','TMERT'], observaciones: 'Vigilancia especial PLANESI' },
  { id: 4, rut: '16.234.567-8', nombres: 'Ana Patricia', apellidos: 'López Vega', cargo: 'Operadora Call Center', area: 'Administración', fecha_ingreso: '2022-01-10', estado: 'activo', sexo: 'F', fecha_nacimiento: '1995-02-28', email: 'alopez@empresa.cl', telefono: '+56923456789', mutualidad: 'Mutual', turno: 'Diurno', contrato: 'Plazo Fijo', protocolos_activos: ['PSICOSOCIAL','VOZ'], observaciones: '' },
  { id: 5, rut: '11.111.111-1', nombres: 'Pedro Pablo', apellidos: 'Sánchez Rojas', cargo: 'Soldador', area: 'Producción', fecha_ingreso: '2018-05-14', estado: 'activo', sexo: 'M', fecha_nacimiento: '1982-09-15', email: 'psanchez@empresa.cl', telefono: '+56945678901', mutualidad: 'ISL', turno: 'Nocturno', contrato: 'Indefinido', protocolos_activos: ['PREXOR','PLANESI','TMERT','UV'], observaciones: '⚠️ CRÍTICO: PLANESI sobre límite + NIHL moderado PREXOR' },
  { id: 6, rut: '13.456.789-0', nombres: 'Claudia Beatriz', apellidos: 'Torres Sepúlveda', cargo: 'Enfermera Ocupacional', area: 'Salud Ocupacional', fecha_ingreso: '2020-08-01', estado: 'activo', sexo: 'F', fecha_nacimiento: '1988-12-03', email: 'ctorres@empresa.cl', telefono: '+56956789012', mutualidad: 'ACHS', turno: 'Diurno', contrato: 'Indefinido', protocolos_activos: ['PSICOSOCIAL'], observaciones: '' },
  { id: 7, rut: '14.567.890-K', nombres: 'Roberto Eduardo', apellidos: 'Fuentes Castillo', cargo: 'Prevencionista de Riesgos', area: 'Prevención', fecha_ingreso: '2016-11-28', estado: 'activo', sexo: 'M', fecha_nacimiento: '1975-06-18', email: 'rfuentes@empresa.cl', telefono: '+56967890123', mutualidad: 'IST', turno: 'Diurno', contrato: 'Indefinido', protocolos_activos: ['PSICOSOCIAL'], observaciones: '' },
  { id: 8, rut: '17.890.123-4', nombres: 'Valeria Ignacia', apellidos: 'Herrera Díaz', cargo: 'Operadora de Bodega', area: 'Logística', fecha_ingreso: '2023-02-20', estado: 'activo', sexo: 'F', fecha_nacimiento: '1997-08-30', email: 'vherrera@empresa.cl', telefono: '+56978901234', mutualidad: 'ACHS', turno: 'Diurno', contrato: 'Plazo Fijo', protocolos_activos: ['TMERT','MMC','UV'], observaciones: '' },
  { id: 9, rut: '10.555.666-7', nombres: 'Sofía Alejandra', apellidos: 'Castillo Mora', cargo: 'Profesora Básica', area: 'Educación', fecha_ingreso: '2020-03-01', estado: 'activo', sexo: 'F', fecha_nacimiento: '1988-05-12', email: 'scastillo@empresa.cl', telefono: '+56911223344', mutualidad: 'IST', turno: 'Diurno', contrato: 'Indefinido', protocolos_activos: ['VOZ','PSICOSOCIAL','TMERT'], observaciones: '' },
  { id: 10, rut: '18.123.456-3', nombres: 'Marco Antonio', apellidos: 'Villalobos Pinto', cargo: 'Electricista Industrial', area: 'Mantenimiento', fecha_ingreso: '2024-01-15', estado: 'activo', sexo: 'M', fecha_nacimiento: '1990-11-20', email: 'mvillalobos@empresa.cl', telefono: '+56933445566', mutualidad: 'ACHS', turno: 'Mixto', contrato: 'Indefinido', protocolos_activos: ['PREXOR','UV'], observaciones: '' },
]

export let examenesDB = [
  { id: 1, worker_id: 1, tipo: 'Audiometría de Seguimiento', fecha: '2026-01-15', resultado: 'NIHL bilateral leve', vigencia: '2027-01-15', estado: 'vigente', centro_medico: 'ACHS — Dpto. ORL', protocolo: 'PREXOR', profesional: 'Dr. J. Morales (Otorrinolaringólogo)' },
  { id: 2, worker_id: 1, tipo: 'Examen Preocupacional', fecha: '2019-03-10', resultado: 'Apto sin restricciones', vigencia: null, estado: 'vigente', centro_medico: 'Clínica IST', protocolo: null, profesional: 'Dr. P. Saavedra' },
  { id: 3, worker_id: 3, tipo: 'Radiografía de Tórax OIT', fecha: '2026-01-20', resultado: 'Categoría OIT 0/0 — Sin opacidades neumoconiósicas', vigencia: '2028-01-20', estado: 'vigente', centro_medico: 'ACHS — Dpto. Radiología', protocolo: 'PLANESI', profesional: 'Dr. M. Valenzuela (Lector OIT Certificado)' },
  { id: 4, worker_id: 3, tipo: 'Espirometría', fecha: '2026-01-20', resultado: 'FVC 98% / FEV1 96% / FEV1/FVC 82% — Normal', vigencia: '2028-01-20', estado: 'vigente', centro_medico: 'ACHS — Lab. Función Pulmonar', protocolo: 'PLANESI', profesional: 'TM Claudia Rivas' },
  { id: 5, worker_id: 3, tipo: 'Audiometría de Seguimiento', fecha: '2026-02-10', resultado: 'Audición normal bilateral', vigencia: '2027-02-10', estado: 'vigente', centro_medico: 'IST — Dpto. ORL', protocolo: 'PREXOR', profesional: 'Dr. R. Farías' },
  { id: 6, worker_id: 5, tipo: 'Audiometría de Seguimiento', fecha: '2025-06-01', resultado: 'NIHL moderado bilateral (Notch 4-6 kHz). Derivado ORL.', vigencia: '2026-06-01', estado: 'por_vencer', centro_medico: 'ACHS', protocolo: 'PREXOR', profesional: 'Dr. J. Morales' },
  { id: 7, worker_id: 5, tipo: 'Radiografía de Tórax OIT', fecha: '2025-09-15', resultado: 'Categoría OIT 1/0 — Opacidades pequeñas escasas', vigencia: '2026-09-15', estado: 'por_vencer', centro_medico: 'ISL — Radiología', protocolo: 'PLANESI', profesional: 'Dra. A. Cortés (Lectora OIT)' },
  { id: 8, worker_id: 5, tipo: 'Espirometría', fecha: '2025-09-15', resultado: 'FVC 85% / FEV1 82% / FEV1/FVC 74% — Leve restricción', vigencia: '2026-09-15', estado: 'por_vencer', centro_medico: 'ISL — Lab. Función Pulmonar', protocolo: 'PLANESI', profesional: 'TM F. Torres' },
  { id: 9, worker_id: 4, tipo: 'Evaluación Fonoaudiológica', fecha: '2026-01-15', resultado: 'Sin disfonía. GRBAS: G0R0B1A0S0 — Sin alteración significativa', vigencia: '2028-01-15', estado: 'vigente', centro_medico: 'IST — Fonoaudiología', protocolo: 'VOZ', profesional: 'Fonoaudióloga M. Castro' },
  { id: 10, worker_id: 1, tipo: 'Examen Musculoesquelético EESS', fecha: '2026-02-20', resultado: 'Tendinitis supraespinoso derecho (sospecha). Derivado médico.', vigencia: '2026-08-20', estado: 'vigente', centro_medico: 'ACHS — Medicina Ocupacional', protocolo: 'TMERT', profesional: 'Dr. A. Morales (Médico Ocup.)' },
  { id: 11, worker_id: 8, tipo: 'Examen Musculoesquelético', fecha: '2026-01-25', resultado: 'Sin hallazgos patológicos. Columna lumbar y EESS normales.', vigencia: '2027-01-25', estado: 'vigente', centro_medico: 'Mutual — Medicina Ocupacional', protocolo: 'TMERT', profesional: 'Dr. C. Ibáñez' },
]

// GET /api/workers
app.get('/', (c) => {
  const { search, area, estado, protocolo, mutualidad } = c.req.query()
  let filtered = [...workersDB]
  if (search) { const s = search.toLowerCase(); filtered = filtered.filter(w => w.nombres.toLowerCase().includes(s) || w.apellidos.toLowerCase().includes(s) || w.rut.includes(s) || w.cargo.toLowerCase().includes(s)) }
  if (area && area !== 'all') filtered = filtered.filter(w => w.area === area)
  if (estado && estado !== 'all') filtered = filtered.filter(w => w.estado === estado)
  if (protocolo && protocolo !== 'all') filtered = filtered.filter(w => w.protocolos_activos.includes(protocolo))
  if (mutualidad && mutualidad !== 'all') filtered = filtered.filter(w => w.mutualidad === mutualidad)
  return c.json({ success: true, data: filtered, total: filtered.length })
})

// GET /api/workers/:id
app.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const worker = workersDB.find(w => w.id === id)
  if (!worker) return c.json({ success: false, error: 'Trabajador no encontrado' }, 404)
  const examenes = examenesDB.filter(e => e.worker_id === id)
  return c.json({ success: true, data: { ...worker, examenes } })
})

// POST /api/workers
app.post('/', async (c) => {
  const body = await c.req.json()
  const newWorker = { id: workersDB.length + 1, estado: 'activo', protocolos_activos: [], ...body }
  workersDB.push(newWorker)
  return c.json({ success: true, data: newWorker, message: 'Trabajador registrado exitosamente' }, 201)
})

// PUT /api/workers/:id
app.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = workersDB.findIndex(w => w.id === id)
  if (idx === -1) return c.json({ success: false, error: 'Trabajador no encontrado' }, 404)
  const body = await c.req.json()
  workersDB[idx] = { ...workersDB[idx], ...body }
  return c.json({ success: true, data: workersDB[idx], message: 'Trabajador actualizado' })
})

// DELETE /api/workers/:id (desactivar)
app.delete('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = workersDB.findIndex(w => w.id === id)
  if (idx === -1) return c.json({ success: false, error: 'Trabajador no encontrado' }, 404)
  workersDB[idx].estado = 'inactivo'
  return c.json({ success: true, message: 'Trabajador desactivado' })
})

// GET /api/workers/:id/examenes
app.get('/:id/examenes', (c) => {
  const id = parseInt(c.req.param('id'))
  const examenes = examenesDB.filter(e => e.worker_id === id)
  return c.json({ success: true, data: examenes })
})

// POST /api/workers/:id/examenes
app.post('/:id/examenes', async (c) => {
  const id = parseInt(c.req.param('id'))
  const body = await c.req.json()
  const newExamen = { id: examenesDB.length + 1, worker_id: id, ...body }
  examenesDB.push(newExamen)
  return c.json({ success: true, data: newExamen }, 201)
})

// PUT /api/workers/:id/examenes/:examId
app.put('/:id/examenes/:examId', async (c) => {
  const examId = parseInt(c.req.param('examId'))
  const idx = examenesDB.findIndex(e => e.id === examId)
  if (idx === -1) return c.json({ success: false, error: 'Examen no encontrado' }, 404)
  const body = await c.req.json()
  examenesDB[idx] = { ...examenesDB[idx], ...body }
  return c.json({ success: true, data: examenesDB[idx] })
})

// GET /api/workers/stats/areas
app.get('/stats/areas', (c) => {
  const areas: Record<string, number> = {}
  workersDB.forEach(w => { areas[w.area] = (areas[w.area] || 0) + 1 })
  return c.json({ success: true, data: areas })
})

export default app
