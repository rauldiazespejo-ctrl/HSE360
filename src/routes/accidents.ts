import { Hono } from 'hono'

const app = new Hono()

export let accidentsDB: any[] = []

const estadisticas2026 = {
  anio: 2026,
  total_trabajadores: 0,
  accidentes_trabajo_ytd: 0,
  enfermedades_profesionales_ytd: 0,
  dias_perdidos_ytd: 0,
  accidentes_fatales_ytd: 0,
  tasa_accidentabilidad: 0,
  tasa_siniestralidad: 0,
  tasa_mortalidad: 0,
  accidentes_por_mes: [0,0,0,0,0,0,0,0,0,0,0,0],
  ep_por_mes: [0,0,0,0,0,0,0,0,0,0,0,0],
  causas_actos: 0, causas_condiciones: 0,
  partes_cuerpo: {},
  areas_mayor_incidencia: []
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
