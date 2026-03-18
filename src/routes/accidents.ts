import { Hono } from 'hono'

const app = new Hono()

export let accidentsDB: any[] = [
  { id: 1, tipo: 'DIAT', folio: 'DIAT-2026-001', worker_id: 1, trabajador_nombre: 'Carlos González Muñoz', trabajador_rut: '12.345.678-9', fecha_accidente: '2026-01-22', hora_accidente: '10:30', lugar_accidente: 'Línea de Producción N°2', descripcion: 'Atrapamiento de mano derecha en banda transportadora durante operación de limpieza sin bloqueo LOTO.', lesion_diagnostico: 'Fractura de metacarpo índice derecho', parte_cuerpo: 'Mano derecha', gravedad: 'grave', dias_perdidos: 18, mutualidad: 'ACHS', folio_mutualidad: 'ACHS-2026-00341', estado_denuncia: 'enviada', fecha_denuncia: '2026-01-22', calificacion: 'Accidente del Trabajo', fecha_calificacion: '2026-02-05', reincorporacion: '2026-02-09', causa_inmediata: 'Acto Subestándar — Operación de limpieza sin bloqueo LOTO (Lock Out Tag Out)', causa_basica: 'Factor Personal: Falta de conocimiento del procedimiento LOTO. Factor Trabajo: Procedimiento LOTO inexistente para esta línea.', medidas_correctivas: 'Elaborar e implementar procedimiento LOTO para línea 2. Capacitación en LOTO a todo el personal de producción. Instalar candados y tarjetas de bloqueo en tableros. Auditoría mensual de cumplimiento LOTO.', estado: 'cerrado', investigacion_completada: true, testigos: 'Jorge Martínez', observaciones: '' },
  { id: 2, tipo: 'DIAT', folio: 'DIAT-2026-002', worker_id: 5, trabajador_nombre: 'Pedro Sánchez Rojas', trabajador_rut: '11.111.111-1', fecha_accidente: '2026-02-14', hora_accidente: '14:15', lugar_accidente: 'Taller de Soldadura', descripcion: 'Proyección de partícula metálica incandescente al ojo izquierdo durante soldadura SMAW sin careta en posición correcta.', lesion_diagnostico: 'Quemadura corneal leve ojo izquierdo', parte_cuerpo: 'Ojo izquierdo', gravedad: 'leve', dias_perdidos: 2, mutualidad: 'ISL', folio_mutualidad: 'ISL-2026-00128', estado_denuncia: 'enviada', fecha_denuncia: '2026-02-14', calificacion: 'Accidente del Trabajo', fecha_calificacion: '2026-02-15', reincorporacion: '2026-02-16', causa_inmediata: 'Acto Subestándar — Careta de soldar mal posicionada (levantada)', causa_basica: 'Factor Trabajo: EPP deteriorado (careta con mecanismo de ajuste defectuoso). Condición Subestándar: EPP defectuoso no detectado en inspección.', medidas_correctivas: 'Reemplazar careta de soldar. Inspección mensual de estado EPP en taller. Reforzar uso correcto de EPP en capacitación.', estado: 'cerrado', investigacion_completada: true, testigos: '', observaciones: '' },
  { id: 3, tipo: 'DIAT', folio: 'DIAT-2026-003', worker_id: 8, trabajador_nombre: 'Valeria Herrera Díaz', trabajador_rut: '17.890.123-4', fecha_accidente: '2026-03-05', hora_accidente: '09:10', lugar_accidente: 'Bodega Central — Pasillo B', descripcion: 'Caída a mismo nivel en pasillo de bodega tras piso mojado sin señalización. El pasillo fue limpiado 30 min antes sin señalizar.', lesion_diagnostico: 'Contusión rodilla izquierda y muñeca derecha', parte_cuerpo: 'Rodilla izquierda / Muñeca derecha', gravedad: 'leve', dias_perdidos: 3, mutualidad: 'ACHS', folio_mutualidad: 'ACHS-2026-00512', estado_denuncia: 'enviada', fecha_denuncia: '2026-03-05', calificacion: 'Accidente del Trabajo', fecha_calificacion: '2026-03-06', reincorporacion: '2026-03-08', causa_inmediata: 'Condición Subestándar — Piso húmedo sin señalización de peligro', causa_basica: 'Factor Trabajo: Procedimiento de limpieza sin protocolo de señalización. Sin gestión de riesgo de resbalones/caídas en la empresa.', medidas_correctivas: 'Elaborar procedimiento de limpieza con señalización obligatoria. Instalar alfombras antideslizantes en zonas húmedas. Señalética permanente en zona de mayor riesgo.', estado: 'en_proceso', investigacion_completada: true, testigos: 'Carlos González', observaciones: 'Acciones correctivas en proceso de implementación. Plazo: 31/03/2026.' },
  { id: 4, tipo: 'DIEP', folio: 'DIEP-2026-001', worker_id: 5, trabajador_nombre: 'Pedro Sánchez Rojas', trabajador_rut: '11.111.111-1', fecha_accidente: '2026-03-10', hora_accidente: null, lugar_accidente: 'Empresa — diagnóstico por vigilancia', descripcion: 'Diagnóstico de Hipoacusia Sensorioneural de Origen Laboral (NIHL) moderada bilateral en control audiológico de seguimiento. Trabajador NSE IV con exposición a 95 dB(A) sin controles de ingeniería adecuados.', lesion_diagnostico: 'Hipoacusia Sensorioneural Laboral (NIHL) moderada bilateral', parte_cuerpo: 'Sistema auditivo bilateral', gravedad: 'grave', dias_perdidos: 0, mutualidad: 'ISL', folio_mutualidad: 'ISL-DIEP-2026-0008', estado_denuncia: 'enviada', fecha_denuncia: '2026-03-10', calificacion: 'Enfermedad Profesional', fecha_calificacion: null, reincorporacion: null, causa_inmediata: 'Exposición prolongada a ruido > 90 dB(A) sin controles de ingeniería adecuados', causa_basica: 'Controles de exposición insuficientes. NSE IV sin rediseño de puesto. EPA sin supervisión de uso efectivo.', medidas_correctivas: 'Rediseño inmediato de puesto (evaluación reubicación). Instalar cabina insonorizada en taller de soldadura. Examen NIHL adicional por ORL especialista. Notificar SEREMI de Salud.', estado: 'en_vigilancia', investigacion_completada: false, testigos: '', observaciones: '⚠️ ENFERMEDAD PROFESIONAL. Notificación SEREMI pendiente.' },
]

const estadisticas2026 = {
  anio: 2026,
  total_trabajadores: 145,
  accidentes_trabajo_ytd: 3,
  enfermedades_profesionales_ytd: 1,
  dias_perdidos_ytd: 23,
  accidentes_fatales_ytd: 0,
  tasa_accidentabilidad: 2.07,
  tasa_siniestralidad: 15.86,
  tasa_mortalidad: 0,
  accidentes_por_mes: [2,2,1,0,0,0,0,0,0,0,0,0],
  ep_por_mes: [0,0,1,0,0,0,0,0,0,0,0,0],
  causas_actos: 67, causas_condiciones: 33,
  partes_cuerpo: { 'Mano/Dedos': 1, 'Ojo': 1, 'Rodilla/Pierna': 1 },
  areas_mayor_incidencia: ['Producción', 'Taller de Soldadura', 'Logística']
}

app.get('/', (c) => {
  const { tipo, estado, year } = c.req.query()
  let filtered = [...accidentsDB]
  if (tipo && tipo !== 'all') filtered = filtered.filter(a => a.tipo === tipo)
  if (estado && estado !== 'all') filtered = filtered.filter(a => a.estado === estado)
  if (year) filtered = filtered.filter(a => a.fecha_accidente.startsWith(year))
  return c.json({ success: true, data: filtered, total: filtered.length })
})

app.get('/stats', (c) => c.json({ success: true, data: estadisticas2026 }))

app.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const a = accidentsDB.find(x => x.id === id)
  if (!a) return c.json({ success: false, error: 'Registro no encontrado' }, 404)
  return c.json({ success: true, data: a })
})

app.post('/', async (c) => {
  const body = await c.req.json()
  const anio = new Date().getFullYear()
  const tipo = body.tipo || 'DIAT'
  const count = accidentsDB.filter(a => a.tipo === tipo && a.folio.includes(String(anio))).length + 1
  const folio = `${tipo}-${anio}-${String(count).padStart(3,'0')}`
  const newRecord = { id: accidentsDB.length + 1, folio, estado: 'abierto', investigacion_completada: false, ...body, fecha_registro: new Date().toISOString() }
  accidentsDB.push(newRecord)
  return c.json({ success: true, data: newRecord, message: `${tipo} registrado con folio ${folio}` }, 201)
})

app.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = accidentsDB.findIndex(a => a.id === id)
  if (idx === -1) return c.json({ success: false, error: 'Registro no encontrado' }, 404)
  const body = await c.req.json()
  accidentsDB[idx] = { ...accidentsDB[idx], ...body }
  return c.json({ success: true, data: accidentsDB[idx], message: 'Registro actualizado' })
})

export default app
