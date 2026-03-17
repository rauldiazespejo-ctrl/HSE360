import { Hono } from 'hono'

const app = new Hono()

const accidents = [
  { id: 1, tipo: 'DIAT', folio: 'ACC-2024-001', worker_id: 1, worker_nombre: 'Carlos González', fecha_accidente: '2024-02-14', hora: '10:30', lugar: 'Línea de Producción N°2', descripcion: 'Atrapamiento de mano derecha en banda transportadora durante operación de limpieza.', lesion: 'Fractura de metacarpo índice derecho', gravedad: 'Grave', dias_perdidos: 21, mutualidad: 'ACHS', estado_denuncia: 'Enviada', calificacion: 'Accidente del Trabajo', reincorporacion: '2024-03-14', causa_inmediata: 'Acto Subestándar - No uso de bloqueo LOTO', causa_basica: 'Falta de procedimiento LOTO', acciones_correctivas: ['Implementar procedimiento LOTO', 'Capacitar en LOTO', 'Instalar señalética'], estado: 'cerrado' },
  { id: 2, tipo: 'DIAT', folio: 'ACC-2024-002', worker_id: 5, worker_nombre: 'Pedro Sánchez', fecha_accidente: '2024-03-05', hora: '14:15', lugar: 'Taller de Soldadura', descripcion: 'Proyección de partículas metálicas al ojo izquierdo durante actividad de soldadura.', lesion: 'Cuerpo extraño ocular', gravedad: 'Leve', dias_perdidos: 2, mutualidad: 'ISL', estado_denuncia: 'Enviada', calificacion: 'Accidente del Trabajo', reincorporacion: '2024-03-07', causa_inmediata: 'Acto Subestándar - No uso de careta de soldar', causa_basica: 'EPP deteriorado', acciones_correctivas: ['Reemplazar EPP', 'Reforzar uso de EPP'], estado: 'cerrado' },
  { id: 3, tipo: 'DIAT', folio: 'ACC-2024-003', worker_id: 8, worker_nombre: 'Valeria Herrera', fecha_accidente: '2024-04-18', hora: '09:00', lugar: 'Bodega Central', descripcion: 'Caída a mismo nivel por piso húmedo sin señalización.', lesion: 'Contusión rodilla izquierda', gravedad: 'Leve', dias_perdidos: 3, mutualidad: 'ACHS', estado_denuncia: 'Enviada', calificacion: 'Accidente del Trabajo', reincorporacion: '2024-04-21', causa_inmediata: 'Condición Subestándar - Piso húmedo sin señalizar', causa_basica: 'Falta de programa de mantenimiento', acciones_correctivas: ['Instalar alfombras antideslizantes', 'Señalética de piso húmedo'], estado: 'en_proceso' },
  { id: 4, tipo: 'DIEP', folio: 'ENF-2024-001', worker_id: 3, worker_nombre: 'Jorge Martínez', fecha_accidente: '2024-01-22', hora: null, lugar: 'Empresa', descripcion: 'Diagnóstico de neumoconiosis por exposición crónica a sílice en puesto de mecánico industrial.', lesion: 'Silicosis etapa I', gravedad: 'Grave', dias_perdidos: 0, mutualidad: 'ACHS', estado_denuncia: 'Enviada', calificacion: 'Enfermedad Profesional', reincorporacion: null, causa_inmediata: 'Exposición prolongada a polvo de sílice', causa_basica: 'Controles inadecuados', acciones_correctivas: ['Cambio de puesto de trabajo', 'Control médico periódico'], estado: 'en_vigilancia' },
  { id: 5, tipo: 'DIAT', folio: 'ACC-2024-004', worker_id: 1, worker_nombre: 'Carlos González', fecha_accidente: '2024-05-10', hora: '16:45', lugar: 'Línea de Producción N°1', descripcion: 'Golpe en pierna derecha con material en proceso de transporte.', lesion: 'Contusión tibial derecha', gravedad: 'Leve', dias_perdidos: 1, mutualidad: 'ACHS', estado_denuncia: 'Enviada', calificacion: 'Accidente del Trabajo', reincorporacion: '2024-05-11', causa_inmediata: 'Condición Subestándar - Área congestionada', causa_basica: 'Deficiente orden y aseo', acciones_correctivas: ['Implementar 5S en área'], estado: 'cerrado' },
]

const estadisticasAnuales = {
  año: 2024,
  total_trabajadores: 145,
  accidentes_trabajo: 4,
  enfermedades_profesionales: 1,
  dias_perdidos_total: 27,
  tasa_accidentabilidad: 2.76, // (accidentes/trabajadores)*100
  tasa_siniestralidad: 18.62, // (dias_perdidos/trabajadores)*100
  tasa_mortalidad: 0,
  accidentes_por_mes: [0,1,2,0,1,0,0,0,0,0,0,0],
  causas_principales: { actos_subestandar: 60, condiciones_subestandar: 30, factores_personales: 10 }
}

// GET /api/accidents
app.get('/', (c) => {
  const { tipo, estado, year } = c.req.query()
  let filtered = [...accidents]
  if (tipo) filtered = filtered.filter(a => a.tipo === tipo)
  if (estado) filtered = filtered.filter(a => a.estado === estado)
  if (year) filtered = filtered.filter(a => a.fecha_accidente.startsWith(year))
  return c.json({ success: true, data: filtered, total: filtered.length })
})

// GET /api/accidents/stats
app.get('/stats', (c) => {
  return c.json({ success: true, data: estadisticasAnuales })
})

// GET /api/accidents/:id
app.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const accident = accidents.find(a => a.id === id)
  if (!accident) return c.json({ success: false, error: 'Registro no encontrado' }, 404)
  return c.json({ success: true, data: accident })
})

export default app
