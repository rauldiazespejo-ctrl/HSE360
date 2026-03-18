import { Hono } from 'hono'

const app = new Hono()

export let capsDB: any[] = [
  { id: 1, nombre: 'IRL — Informe de Riesgos Laborales (Producción)', tipo: 'IRL', fecha: '2026-01-15', duracion_horas: 4, relator: 'Roberto Fuentes — Prevencionista', institucion: 'Empresa', trabajadores_convocados: 52, trabajadores_capacitados: 48, aprobados: 47, reprobados: 1, vigencia_meses: 12, proxima_fecha: '2027-01-15', estado: 'vigente', contenidos: ['Identificación de riesgos específicos por puesto (DS 44 Art.15)', 'Medidas preventivas y de protección aplicables', 'EPP asignado, uso correcto y mantención', 'Derechos y obligaciones Ley 16.744 y DS 44', 'Procedimientos de emergencia y evacuación'], documentos: ['acta_irl_prod_ene2026.pdf', 'programa_contenidos_irl.pdf'], areas_cubiertas: ['Producción'], observaciones: 'IRL reemplaza ODI (D.S. N°40/1969) conforme DS 44 Art.15 vigente desde 01/02/2025. Requiere firma ológrafa + huella digital del trabajador.' },
  { id: 2, nombre: 'PREXOR — Riesgo por Ruido y Conservación Auditiva', tipo: 'PREXOR', fecha: '2026-01-20', duracion_horas: 3, relator: 'Fonoaudióloga P. Aranda — ACHS', institucion: 'ACHS', trabajadores_convocados: 18, trabajadores_capacitados: 18, aprobados: 18, reprobados: 0, vigencia_meses: 12, proxima_fecha: '2027-01-20', estado: 'vigente', contenidos: ['Efectos del ruido en la salud', 'Clasificación NSE I-IV', 'Uso correcto de EPA (tapones y orejeras)', 'Audiometría: qué es y cómo prepararse', 'Derechos en vigilancia de salud'], documentos: ['lista_asistencia_prexor_ene2026.pdf'], areas_cubiertas: ['Producción','Mantenimiento'], observaciones: '' },
  { id: 3, nombre: 'PLANESI — Riesgo por Sílice y Silicosis', tipo: 'PLANESI', fecha: '2025-07-15', duracion_horas: 4, relator: 'Higienista Industrial C. Moreno — ACHS', institucion: 'ACHS', trabajadores_convocados: 10, trabajadores_capacitados: 9, aprobados: 9, reprobados: 0, vigencia_meses: 12, proxima_fecha: '2026-07-15', estado: 'por_vencer', contenidos: ['¿Qué es la sílice y dónde está?', 'Silicosis: mecanismo, síntomas y etapas', 'Límite permisible y evaluación ambiental', 'Uso correcto de EPR (respiradores P100)', 'Fit Test: importancia del sellado', 'Radiografía OIT: qué evalúa'], documentos: ['lista_asistencia_planesi_jul2025.pdf'], areas_cubiertas: ['Mantenimiento','Producción'], observaciones: '⚠️ Próxima en julio 2026. Programar con ACHS.' },
  { id: 4, nombre: 'TMERT — Ergonomía y Pausas Activas', tipo: 'TMERT', fecha: '2026-02-10', duracion_horas: 2, relator: 'Terapeuta Ocupacional M. Vidal', institucion: 'IST', trabajadores_convocados: 25, trabajadores_capacitados: 24, aprobados: 24, reprobados: 0, vigencia_meses: 12, proxima_fecha: '2027-02-10', estado: 'vigente', contenidos: ['¿Qué son los TME?', 'Factores de riesgo: repetición, fuerza, postura', 'Lista de Chequeo TMERT — cómo interpretarla', 'Pausas activas: ejercicios prácticos', 'Uso de herramientas ergonómicas'], documentos: ['lista_asistencia_tmert_feb2026.pdf', 'ejercicios_pausas_activas.pdf'], areas_cubiertas: ['Producción','Logística','Administración'], observaciones: '' },
  { id: 5, nombre: 'Radiación UV — Prevención y Protección Solar', tipo: 'UV', fecha: '2025-09-05', duracion_horas: 1.5, relator: 'Dr. P. Estrada — Dermatólogo IST', institucion: 'IST', trabajadores_convocados: 20, trabajadores_capacitados: 19, aprobados: 19, reprobados: 0, vigencia_meses: 12, proxima_fecha: '2026-09-05', estado: 'vigente', contenidos: ['Efectos UV en la piel: eritema, melanoma', 'Índice UV: cómo leer la escala', 'EPP fotoproteción: FPS50+, legionario, lentes UV', 'Aplicación correcta del protector solar', 'Restricción horaria 11-16h'], documentos: ['lista_asistencia_uv_sep2025.pdf'], areas_cubiertas: ['Logística','Producción','Exterior'], observaciones: '' },
  { id: 6, nombre: 'MMC — Manejo Manual de Cargas Ley 20.949', tipo: 'MMC', fecha: '2026-02-20', duracion_horas: 2, relator: 'Claudia Torres — Prevencionista', institucion: 'Empresa', trabajadores_convocados: 18, trabajadores_capacitados: 18, aprobados: 18, reprobados: 0, vigencia_meses: 24, proxima_fecha: '2028-02-20', estado: 'vigente', contenidos: ['Ley 20.949: límites y obligaciones', 'Técnica correcta de levantamiento', 'Índice de Levantamiento NIOSH', 'Límites por género y edad', 'Ayudas mecánicas disponibles en la empresa'], documentos: ['lista_asistencia_mmc_feb2026.pdf'], areas_cubiertas: ['Logística','Producción'], observaciones: '' },
  { id: 7, nombre: 'CEAL-SM — Riesgos Psicosociales y Autocuidado', tipo: 'PSICOSOCIAL', fecha: '2026-01-08', duracion_horas: 2, relator: 'Psicóloga Laboral K. Fuentes — IST', institucion: 'IST', trabajadores_convocados: 145, trabajadores_capacitados: 132, aprobados: 132, reprobados: 0, vigencia_meses: 24, proxima_fecha: '2028-01-08', estado: 'vigente', contenidos: ['¿Qué son los riesgos psicosociales?', '12 dimensiones CEAL-SM', 'Ley 21.645: acoso laboral y sexual', 'Canal de denuncia: cómo usarlo', 'Técnicas de autocuidado y manejo del estrés'], documentos: ['lista_asistencia_psicosoc_ene2026.pdf'], areas_cubiertas: ['Todas las áreas'], observaciones: '' },
  { id: 8, nombre: 'Primeros Auxilios y RCP Básico', tipo: 'PRIMEROS_AUXILIOS', fecha: '2026-02-28', duracion_horas: 8, relator: 'Instructores Cruz Roja Chile', institucion: 'Cruz Roja Chile', trabajadores_convocados: 15, trabajadores_capacitados: 15, aprobados: 15, reprobados: 0, vigencia_meses: 24, proxima_fecha: '2028-02-28', estado: 'vigente', contenidos: ['RCP adulto y DEA', 'Manejo de heridas y hemorragias', 'Fracturas y luxaciones', 'Quemaduras', 'Atragantamiento (maniobra Heimlich)', 'Práctica con maniquí certificada'], documentos: ['lista_asistencia_pa_feb2026.pdf', 'certificados_individuales.pdf'], areas_cubiertas: ['Brigada Emergencia'], observaciones: '' },
]

app.get('/', (c) => {
  const { tipo, estado } = c.req.query()
  let filtered = [...capsDB]
  if (tipo && tipo !== 'all') filtered = filtered.filter(c => c.tipo === tipo)
  if (estado && estado !== 'all') filtered = filtered.filter(c => c.estado === estado)
  return c.json({ success: true, data: filtered, total: filtered.length })
})

app.get('/stats', (c) => {
  const vencidas = capsDB.filter(c => c.estado === 'vencido').length
  const por_vencer = capsDB.filter(c => c.estado === 'por_vencer').length
  const vigentes = capsDB.filter(c => c.estado === 'vigente').length
  const irl = capsDB.find(c => c.tipo === 'IRL')
  return c.json({ success: true, data: { total: capsDB.length, vigentes, por_vencer, vencidas, cobertura_irl_pct: irl ? Math.round((irl.trabajadores_capacitados/irl.trabajadores_convocados)*100) : 0, cobertura_odi_pct: irl ? Math.round((irl.trabajadores_capacitados/irl.trabajadores_convocados)*100) : 0 } })
})

app.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const cap = capsDB.find(c => c.id === id)
  if (!cap) return c.json({ success: false, error: 'Capacitación no encontrada' }, 404)
  return c.json({ success: true, data: cap })
})

app.post('/', async (c) => {
  const body = await c.req.json()
  const newCap = { id: capsDB.length + 1, estado: 'vigente', documentos: [], ...body }
  capsDB.push(newCap)
  return c.json({ success: true, data: newCap, message: 'Capacitación registrada' }, 201)
})

app.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = capsDB.findIndex(c => c.id === id)
  if (idx === -1) return c.json({ success: false, error: 'No encontrada' }, 404)
  const body = await c.req.json()
  capsDB[idx] = { ...capsDB[idx], ...body }
  return c.json({ success: true, data: capsDB[idx] })
})

export default app
