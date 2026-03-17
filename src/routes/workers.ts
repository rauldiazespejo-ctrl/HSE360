import { Hono } from 'hono'

const app = new Hono()

// Mock data - Base de trabajadores
const workers = [
  { id: 1, rut: '12.345.678-9', nombres: 'Carlos Alberto', apellidos: 'González Muñoz', cargo: 'Operador de Maquinaria', area: 'Producción', fecha_ingreso: '2019-03-15', estado: 'activo', sexo: 'M', fecha_nacimiento: '1985-07-22', email: 'cgonzalez@empresa.cl', telefono: '+56912345678', mutualidad: 'ACHS', turno: 'Diurno', contrato: 'Indefinido', examenes_pendientes: 2, protocolos_activos: ['PREXOR','TMERT','UV'] },
  { id: 2, rut: '15.678.901-2', nombres: 'María Fernanda', apellidos: 'Rodríguez Soto', cargo: 'Supervisora de Calidad', area: 'Calidad', fecha_ingreso: '2021-06-01', estado: 'activo', sexo: 'F', fecha_nacimiento: '1990-11-10', email: 'mrodriguez@empresa.cl', telefono: '+56987654321', mutualidad: 'IST', turno: 'Diurno', contrato: 'Indefinido', examenes_pendientes: 0, protocolos_activos: ['TMERT','PSICOSOCIAL'] },
  { id: 3, rut: '9.876.543-1', nombres: 'Jorge Andrés', apellidos: 'Martínez Pérez', cargo: 'Mecánico Industrial', area: 'Mantenimiento', fecha_ingreso: '2017-09-20', estado: 'activo', sexo: 'M', fecha_nacimiento: '1978-04-05', email: 'jmartinez@empresa.cl', telefono: '+56934567890', mutualidad: 'ACHS', turno: 'Mixto', contrato: 'Indefinido', examenes_pendientes: 1, protocolos_activos: ['PREXOR','PLANESI','TMERT'] },
  { id: 4, rut: '16.234.567-8', nombres: 'Ana Patricia', apellidos: 'López Vega', cargo: 'Administrativa', area: 'Administración', fecha_ingreso: '2022-01-10', estado: 'activo', sexo: 'F', fecha_nacimiento: '1995-02-28', email: 'alopez@empresa.cl', telefono: '+56923456789', mutualidad: 'Mutual', turno: 'Diurno', contrato: 'Plazo Fijo', examenes_pendientes: 0, protocolos_activos: ['PSICOSOCIAL','VOZ'] },
  { id: 5, rut: '11.111.111-1', nombres: 'Pedro Pablo', apellidos: 'Sánchez Rojas', cargo: 'Soldador', area: 'Producción', fecha_ingreso: '2018-05-14', estado: 'activo', sexo: 'M', fecha_nacimiento: '1982-09-15', email: 'psanchez@empresa.cl', telefono: '+56945678901', mutualidad: 'ISL', turno: 'Nocturno', contrato: 'Indefinido', examenes_pendientes: 3, protocolos_activos: ['PREXOR','PLANESI','TMERT','UV'] },
  { id: 6, rut: '13.456.789-0', nombres: 'Claudia Beatriz', apellidos: 'Torres Molina', cargo: 'Enfermera Ocupacional', area: 'Salud Ocupacional', fecha_ingreso: '2020-08-01', estado: 'activo', sexo: 'F', fecha_nacimiento: '1988-12-03', email: 'ctorres@empresa.cl', telefono: '+56956789012', mutualidad: 'ACHS', turno: 'Diurno', contrato: 'Indefinido', examenes_pendientes: 0, protocolos_activos: ['PSICOSOCIAL'] },
  { id: 7, rut: '14.567.890-K', nombres: 'Roberto Eduardo', apellidos: 'Fuentes Castillo', cargo: 'Prevencionista de Riesgos', area: 'Prevención', fecha_ingreso: '2016-11-28', estado: 'activo', sexo: 'M', fecha_nacimiento: '1975-06-18', email: 'rfuentes@empresa.cl', telefono: '+56967890123', mutualidad: 'IST', turno: 'Diurno', contrato: 'Indefinido', examenes_pendientes: 0, protocolos_activos: ['PSICOSOCIAL'] },
  { id: 8, rut: '17.890.123-4', nombres: 'Valeria Ignacia', apellidos: 'Herrera Díaz', cargo: 'Operadora de Bodega', area: 'Logística', fecha_ingreso: '2023-02-20', estado: 'activo', sexo: 'F', fecha_nacimiento: '1997-08-30', email: 'vherrera@empresa.cl', telefono: '+56978901234', mutualidad: 'ACHS', turno: 'Diurno', contrato: 'Plazo Fijo', examenes_pendientes: 1, protocolos_activos: ['TMERT','MMC','UV'] },
]

const examenes = [
  { id: 1, worker_id: 1, tipo: 'Audiometría', fecha: '2023-06-15', resultado: 'Normal', vigencia: '2024-06-15', estado: 'vencido', centro_medico: 'ACHS Santiago', protocolo: 'PREXOR' },
  { id: 2, worker_id: 1, tipo: 'Examen Preocupacional', fecha: '2019-03-10', resultado: 'Apto', vigencia: null, estado: 'vigente', centro_medico: 'Clínica IST', protocolo: null },
  { id: 3, worker_id: 3, tipo: 'Radiografía de Tórax', fecha: '2023-11-20', resultado: 'Normal - Categoría ILO 0/0', vigencia: '2024-11-20', estado: 'por_vencer', centro_medico: 'ACHS Ñuble', protocolo: 'PLANESI' },
  { id: 4, worker_id: 3, tipo: 'Audiometría', fecha: '2024-01-10', resultado: 'NIHL leve bilateral', vigencia: '2025-01-10', estado: 'vigente', centro_medico: 'IST Concepción', protocolo: 'PREXOR' },
  { id: 5, worker_id: 5, tipo: 'Audiometría', fecha: '2023-03-22', resultado: 'NIHL moderado', vigencia: '2024-03-22', estado: 'vencido', centro_medico: 'ACHS Santiago', protocolo: 'PREXOR' },
  { id: 6, worker_id: 5, tipo: 'Radiografía de Tórax', fecha: '2023-09-15', resultado: 'Opacidades < 1cm', vigencia: '2024-09-15', estado: 'por_vencer', centro_medico: 'ISL Santiago', protocolo: 'PLANESI' },
  { id: 7, worker_id: 2, tipo: 'Examen Preocupacional', fecha: '2021-05-28', resultado: 'Apto', vigencia: null, estado: 'vigente', centro_medico: 'IST Santiago', protocolo: null },
  { id: 8, worker_id: 8, tipo: 'Examen Musculoesquelético', fecha: '2024-01-15', resultado: 'Riesgo Moderado', vigencia: '2025-01-15', estado: 'vigente', centro_medico: 'Mutual Santiago', protocolo: 'TMERT' },
]

// GET /api/workers - Lista todos los trabajadores
app.get('/', (c) => {
  const { search, area, estado, protocolo } = c.req.query()
  let filtered = [...workers]
  if (search) {
    const s = search.toLowerCase()
    filtered = filtered.filter(w =>
      w.nombres.toLowerCase().includes(s) ||
      w.apellidos.toLowerCase().includes(s) ||
      w.rut.includes(s) ||
      w.cargo.toLowerCase().includes(s)
    )
  }
  if (area && area !== 'all') filtered = filtered.filter(w => w.area === area)
  if (estado && estado !== 'all') filtered = filtered.filter(w => w.estado === estado)
  if (protocolo && protocolo !== 'all') filtered = filtered.filter(w => w.protocolos_activos.includes(protocolo))
  return c.json({ success: true, data: filtered, total: filtered.length })
})

// GET /api/workers/:id
app.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const worker = workers.find(w => w.id === id)
  if (!worker) return c.json({ success: false, error: 'Trabajador no encontrado' }, 404)
  const workerExams = examenes.filter(e => e.worker_id === id)
  return c.json({ success: true, data: { ...worker, examenes: workerExams } })
})

// GET /api/workers/stats/areas
app.get('/stats/areas', (c) => {
  const areas: Record<string, number> = {}
  workers.forEach(w => { areas[w.area] = (areas[w.area] || 0) + 1 })
  return c.json({ success: true, data: areas })
})

// GET /api/workers/stats/exams
app.get('/stats/exams', (c) => {
  return c.json({ success: true, data: examenes })
})

export default app
