import { Hono } from 'hono'

const app = new Hono()

const capacitations = [
  { id: 1, nombre: 'ODI - Obligación de Informar', tipo: 'ODI', fecha: '2024-01-15', duracion_horas: 4, relator: 'Roberto Fuentes', trabajadores_capacitados: 45, total_empresa: 145, aprobados: 43, reprobados: 2, vigencia_meses: 12, proxima_fecha: '2025-01-15', estado: 'vigente', documentos: ['lista_asistencia.pdf', 'contenidos.pdf'] },
  { id: 2, nombre: 'Uso y Mantención de EPP', tipo: 'EPP', fecha: '2024-02-20', duracion_horas: 2, relator: 'ACHS - Prevencionista', trabajadores_capacitados: 38, total_empresa: 50, aprobados: 38, reprobados: 0, vigencia_meses: 12, proxima_fecha: '2025-02-20', estado: 'vigente', documentos: ['lista_asistencia.pdf'] },
  { id: 3, nombre: 'Radiación UV - Prevención y Protección', tipo: 'UV', fecha: '2023-12-05', duracion_horas: 1, relator: 'IST - Mutualidad', trabajadores_capacitados: 22, total_empresa: 25, aprobados: 22, reprobados: 0, vigencia_meses: 12, proxima_fecha: '2024-12-05', estado: 'por_vencer', documentos: ['lista_asistencia.pdf', 'material_capacitacion.pdf'] },
  { id: 4, nombre: 'PREXOR - Riesgo por Ruido', tipo: 'PREXOR', fecha: '2023-08-10', duracion_horas: 3, relator: 'ACHS - Fonaudióloga', trabajadores_capacitados: 15, total_empresa: 18, aprobados: 15, reprobados: 0, vigencia_meses: 12, proxima_fecha: '2024-08-10', estado: 'vencido', documentos: ['lista_asistencia.pdf'] },
  { id: 5, nombre: 'Manejo Manual de Cargas', tipo: 'MMC', fecha: '2024-03-08', duracion_horas: 2, relator: 'Terapeuta Ocupacional', trabajadores_capacitados: 20, total_empresa: 20, aprobados: 19, reprobados: 1, vigencia_meses: 24, proxima_fecha: '2026-03-08', estado: 'vigente', documentos: ['lista_asistencia.pdf', 'ejercicios_pausas.pdf'] },
  { id: 6, nombre: 'PLANESI - Riesgo por Sílice', tipo: 'PLANESI', fecha: '2023-07-20', duracion_horas: 4, relator: 'ACHS - Higienista', trabajadores_capacitados: 8, total_empresa: 10, aprobados: 8, reprobados: 0, vigencia_meses: 12, proxima_fecha: '2024-07-20', estado: 'vencido', documentos: ['lista_asistencia.pdf'] },
  { id: 7, nombre: 'Primeros Auxilios', tipo: 'PA', fecha: '2024-04-15', duracion_horas: 8, relator: 'Cruz Roja Chile', trabajadores_capacitados: 12, total_empresa: 145, aprobados: 12, reprobados: 0, vigencia_meses: 24, proxima_fecha: '2026-04-15', estado: 'vigente', documentos: ['lista_asistencia.pdf', 'certificados.pdf'] },
  { id: 8, nombre: 'Comité Paritario - CPHS Inducción', tipo: 'CPHS', fecha: '2024-01-08', duracion_horas: 2, relator: 'CPHS Empresa', trabajadores_capacitados: 6, total_empresa: 6, aprobados: 6, reprobados: 0, vigencia_meses: 12, proxima_fecha: '2025-01-08', estado: 'vigente', documentos: ['acta_constitucion.pdf'] },
]

const asistencia = [
  { id: 1, capacitacion_id: 1, worker_id: 1, worker_nombre: 'Carlos González', asistio: true, aprobado: true, nota: null },
  { id: 2, capacitacion_id: 1, worker_id: 2, worker_nombre: 'María Rodríguez', asistio: true, aprobado: true, nota: null },
  { id: 3, capacitacion_id: 1, worker_id: 3, worker_nombre: 'Jorge Martínez', asistio: true, aprobado: true, nota: null },
  { id: 4, capacitacion_id: 1, worker_id: 4, worker_nombre: 'Ana López', asistio: false, aprobado: false, nota: 'Con reposo médico' },
  { id: 5, capacitacion_id: 1, worker_id: 5, worker_nombre: 'Pedro Sánchez', asistio: true, aprobado: true, nota: null },
]

// GET /api/capacitations
app.get('/', (c) => {
  const { tipo, estado } = c.req.query()
  let filtered = [...capacitations]
  if (tipo && tipo !== 'all') filtered = filtered.filter(cap => cap.tipo === tipo)
  if (estado && estado !== 'all') filtered = filtered.filter(cap => cap.estado === estado)
  return c.json({ success: true, data: filtered, total: filtered.length })
})

// GET /api/capacitations/stats
app.get('/stats', (c) => {
  const vencidas = capacitations.filter(c => c.estado === 'vencido').length
  const por_vencer = capacitations.filter(c => c.estado === 'por_vencer').length
  const vigentes = capacitations.filter(c => c.estado === 'vigente').length
  const cobertura_odi = capacitations.find(c => c.tipo === 'ODI')
  return c.json({
    success: true,
    data: { total: capacitations.length, vigentes, por_vencer, vencidas, cobertura_odi_pct: cobertura_odi ? Math.round((cobertura_odi.trabajadores_capacitados/cobertura_odi.total_empresa)*100) : 0 }
  })
})

// GET /api/capacitations/:id
app.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const cap = capacitations.find(c => c.id === id)
  if (!cap) return c.json({ success: false, error: 'Capacitación no encontrada' }, 404)
  const capAsistencia = asistencia.filter(a => a.capacitacion_id === id)
  return c.json({ success: true, data: { ...cap, asistencia: capAsistencia } })
})

export default app
