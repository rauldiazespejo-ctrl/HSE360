import { Hono } from 'hono'

const app = new Hono()

// Capacitaciones — se registran en producción al ingresar datos reales de la empresa
export let capsDB: any[] = []

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
  return c.json({ success: true, data: { total: capsDB.length, vigentes, por_vencer, vencidas, cobertura_irl_pct: irl ? Math.round((irl.participantes_real/irl.participantes_objetivo)*100) : 0, cobertura_odi_pct: irl ? Math.round((irl.participantes_real/irl.participantes_objetivo)*100) : 0 } })
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
