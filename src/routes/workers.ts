import { Hono } from 'hono'

const app = new Hono()

// Datos en memoria — editables vía PUT/POST
export let workersDB: any[] = []

export let examenesDB: any[] = []

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
