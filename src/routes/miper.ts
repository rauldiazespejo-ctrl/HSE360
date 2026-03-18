import { Hono } from 'hono'

const app = new Hono()

export let miperDB: any[] = [
  { id: 1, area: 'Producción', puesto: 'Operador de Maquinaria', peligro: 'Exposición a ruido ≥ 85 dB(A)', tipo_riesgo: 'Físico', consecuencia: 'Hipoacusia Sensorioneural Laboral (NIHL)', probabilidad: 3, severidad: 4, nr: 12, nivel: 'Importante', medidas_existentes: 'EPA (orejeras), Mapa de ruido', medidas_propuestas: 'Cabina insonorizada, rotación de personal', protocolo: 'PREXOR', responsable: 'Prevencionista + Producción', plazo: '2026-06-30', estado_accion: 'En proceso', ultima_revision: '2026-02-15' },
  { id: 2, area: 'Producción', puesto: 'Operador de Maquinaria', peligro: 'Atrapamiento en maquinaria (banda transportadora)', tipo_riesgo: 'Mecánico', consecuencia: 'Amputación, fractura, muerte', probabilidad: 2, severidad: 5, nr: 10, nivel: 'Importante', medidas_existentes: 'Guardas parciales', medidas_propuestas: 'Guardas fijas completas, procedimiento LOTO, señalética', protocolo: null, responsable: 'Producción + CPHS', plazo: '2026-04-30', estado_accion: 'Pendiente', ultima_revision: '2026-02-15' },
  { id: 3, area: 'Mantenimiento', puesto: 'Mecánico Industrial', peligro: 'Exposición a sílice cristalina respirable', tipo_riesgo: 'Químico', consecuencia: 'Silicosis, EPOC, cáncer pulmonar', probabilidad: 3, severidad: 5, nr: 15, nivel: 'Intolerable', medidas_existentes: 'EPR P100, riego periódico', medidas_propuestas: 'Ventilación local extractora en zona de trabajo, métodos húmedos sistematizados', protocolo: 'PLANESI', responsable: 'Prevencionista (URGENTE)', plazo: '2026-04-01', estado_accion: 'CRÍTICO — Atención inmediata', ultima_revision: '2026-03-01' },
  { id: 4, area: 'Producción / Logística', puesto: 'Operador Bodega / Producción', peligro: 'Trastornos musculoesqueléticos EESS (movimiento repetitivo)', tipo_riesgo: 'Ergonómico', consecuencia: 'Tendinitis, síndrome túnel carpiano, bursitis', probabilidad: 4, severidad: 3, nr: 12, nivel: 'Importante', medidas_existentes: 'Evaluación LC TMERT, pausas activas', medidas_propuestas: 'Rediseño de puestos rojo, herramientas ergonómicas, rotación sistemática', protocolo: 'TMERT', responsable: 'Terapeuta Ocupacional + Prevención', plazo: '2026-05-31', estado_accion: 'En proceso', ultima_revision: '2026-02-20' },
  { id: 5, area: 'Exterior / Logística', puesto: 'Personal trabajo al aire libre', peligro: 'Radiación UV solar (IUV ≥ 6)', tipo_riesgo: 'Físico', consecuencia: 'Quemaduras, melanoma, queratosis actínica', probabilidad: 4, severidad: 3, nr: 12, nivel: 'Importante', medidas_existentes: 'FPS50+, legionario, restricción horaria', medidas_propuestas: 'Toldo/malla sombra en zonas fijas, control IUV diario', protocolo: 'UV', responsable: 'Prevencionista + Logística', plazo: '2026-04-30', estado_accion: 'En proceso', ultima_revision: '2026-03-01' },
  { id: 6, area: 'Logística', puesto: 'Operadora Bodega', peligro: 'Manejo manual de cargas (levantamiento y traslado)', tipo_riesgo: 'Ergonómico', consecuencia: 'Lumbalgia, hernia discal, lesiones columna', probabilidad: 3, severidad: 3, nr: 9, nivel: 'Moderado', medidas_existentes: 'Capacitación MMC, límite 20 kg (mujer)', medidas_propuestas: 'Plataforma elevadora de pallets, carros portacargas', protocolo: 'MMC', responsable: 'Logística + Prevención', plazo: '2026-03-31', estado_accion: 'En proceso', ultima_revision: '2026-01-20' },
  { id: 7, area: 'Todas las áreas', puesto: 'Todos', peligro: 'Factores de riesgo psicosocial (carga laboral, liderazgo)', tipo_riesgo: 'Psicosocial', consecuencia: 'Estrés crónico, burnout, ausentismo, baja salud mental', probabilidad: 3, severidad: 3, nr: 9, nivel: 'Moderado', medidas_existentes: 'Encuesta CEAL-SM, plan intervención en proceso', medidas_propuestas: 'Taller de jefaturas, ajuste cargas de trabajo, canales de comunicación', protocolo: 'PSICOSOCIAL', responsable: 'RRHH + Psicóloga', plazo: '2026-08-31', estado_accion: 'En proceso', ultima_revision: '2026-01-15' },
  { id: 8, area: 'Taller Soldadura', puesto: 'Soldador', peligro: 'Proyección de partículas calientes / arco eléctrico', tipo_riesgo: 'Mecánico / Físico', consecuencia: 'Quemaduras, lesión ocular, electrocución', probabilidad: 3, severidad: 4, nr: 12, nivel: 'Importante', medidas_existentes: 'Careta autodimable, guantes, delantal cuero', medidas_propuestas: 'Revisión semestral estado EPP, biombo protector para otros trabajadores', protocolo: 'HUMOS', responsable: 'Prevencionista + Mantenimiento', plazo: '2026-04-15', estado_accion: 'Pendiente', ultima_revision: '2026-02-14' },
  { id: 9, area: 'Taller Soldadura', puesto: 'Soldador', peligro: 'Gases y humos de soldadura (humos metálicos: Mn, Fe, Cr+6, Ni, Cu)', tipo_riesgo: 'Químico', consecuencia: 'Fiebre por humos metálicos, neumoconiosis, cáncer pulmonar (Cr+6)', probabilidad: 3, severidad: 4, nr: 12, nivel: 'Importante', medidas_existentes: 'EPR P100, ventilación general', medidas_propuestas: 'Ventilación local exhaustora (VLE) en cada punto soldadura, muestreo ambiental cuantitativo de metales', protocolo: 'HUMOS', responsable: 'Prevencionista', plazo: '2026-06-30', estado_accion: 'Pendiente', ultima_revision: '2026-02-14' },
  { id: 10, area: 'Producción / Minería Altura', puesto: 'Minero faena altura', peligro: 'Hipobaria intermitente crónica (altitud ≥ 3.800 msnm) — Régimen 7x7', tipo_riesgo: 'Físico / Fisiológico', consecuencia: 'Poliglobulia, HTA, apnea del sueño, daño cardiovascular, hipoxia crónica', probabilidad: 3, severidad: 4, nr: 12, nivel: 'Importante', medidas_existentes: 'Examen preempleo aptitud altura, control hematocrito anual', medidas_propuestas: 'Control hematocrito semestral, evaluación apnea sueño, oxígeno suplementario en faena, aclimatación progresiva', protocolo: 'HIC', responsable: 'OAL + Médico Ocupacional', plazo: '2026-06-30', estado_accion: 'En proceso', ultima_revision: '2026-01-15' },
]

// Tabla de valoración de riesgo (método simplificado)
const valoracion = {
  // NR = Probabilidad x Severidad
  niveles: [
    { rango_min: 1, rango_max: 4, nivel: 'Trivial', color: 'green', accion: 'No se requiere acción específica', codigo: 'T' },
    { rango_min: 5, rango_max: 8, nivel: 'Tolerable', color: 'lime', accion: 'No se requiere acción inmediata. Mejorar si es posible.', codigo: 'TO' },
    { rango_min: 9, rango_max: 12, nivel: 'Moderado', color: 'yellow', accion: 'Establecer controles. Plazo definido.', codigo: 'M' },
    { rango_min: 13, rango_max: 17, nivel: 'Importante', color: 'orange', accion: 'No comenzar trabajo hasta reducir riesgo. Plazo corto.', codigo: 'I' },
    { rango_min: 18, rango_max: 25, nivel: 'Intolerable', color: 'red', accion: 'No comenzar ni continuar trabajo. Detener actividad.', codigo: 'IN' },
  ]
}

app.get('/', (c) => {
  return c.json({ success: true, data: miperDB, valoracion })
})

app.get('/valoracion', (c) => {
  return c.json({ success: true, data: valoracion })
})

app.post('/', async (c) => {
  const body = await c.req.json()
  const nr = (body.probabilidad || 1) * (body.severidad || 1)
  const nivel_info = valoracion.niveles.find(n => nr >= n.rango_min && nr <= n.rango_max)
  const newItem = { id: miperDB.length + 1, nr, nivel: nivel_info?.nivel || 'Moderado', ultima_revision: new Date().toISOString().split('T')[0], estado_accion: 'Pendiente', ...body }
  miperDB.push(newItem)
  return c.json({ success: true, data: newItem }, 201)
})

app.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = miperDB.findIndex(m => m.id === id)
  if (idx === -1) return c.json({ success: false, error: 'Registro no encontrado' }, 404)
  const body = await c.req.json()
  const nr = (body.probabilidad || miperDB[idx].probabilidad) * (body.severidad || miperDB[idx].severidad)
  const nivel_info = valoracion.niveles.find(n => nr >= n.rango_min && nr <= n.rango_max)
  miperDB[idx] = { ...miperDB[idx], ...body, nr, nivel: nivel_info?.nivel || miperDB[idx].nivel, ultima_revision: new Date().toISOString().split('T')[0] }
  return c.json({ success: true, data: miperDB[idx] })
})

app.delete('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = miperDB.findIndex(m => m.id === id)
  if (idx === -1) return c.json({ success: false, error: 'No encontrado' }, 404)
  miperDB.splice(idx, 1)
  return c.json({ success: true, message: 'Peligro eliminado de la MIPER' })
})

export default app
