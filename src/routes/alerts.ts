import { Hono } from 'hono'

const app = new Hono()

const alerts: any[] = []

// GET /api/alerts
app.get('/', (c) => {
  const { prioridad, modulo, leida } = c.req.query()
  let filtered = [...alerts]
  if (prioridad && prioridad !== 'all') filtered = filtered.filter(a => a.prioridad === prioridad)
  if (modulo && modulo !== 'all') filtered = filtered.filter(a => a.modulo === modulo)
  if (leida !== undefined) filtered = filtered.filter(a => a.leida === (leida === 'true'))
  return c.json({ success: true, data: filtered, total: filtered.length })
})

// GET /api/alerts/stats
app.get('/stats', (c) => {
  return c.json({
    success: true,
    data: {
      total: alerts.length,
      criticas: alerts.filter(a => a.prioridad === 'critica').length,
      altas: alerts.filter(a => a.prioridad === 'alta').length,
      medias: alerts.filter(a => a.prioridad === 'media').length,
      no_leidas: alerts.filter(a => !a.leida).length
    }
  })
})

export default app
