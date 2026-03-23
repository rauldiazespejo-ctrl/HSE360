import { Hono } from 'hono'

const app = new Hono()

// ================================================================
// HSE 360 — Centros de Trabajo
// Solo el Superadmin puede crear/editar/eliminar centros
// ================================================================

// Centros de trabajo — se crean desde el panel del Superadmin en producción
export const centros: any[] = []

// GET /api/centros
app.get('/', (c) => {
  return c.json({ success: true, data: centros, total: centros.length })
})

// GET /api/centros/:id
app.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const centro = centros.find(ct => ct.id === id)
  if (!centro) return c.json({ success: false, error: 'Centro no encontrado' }, 404)
  return c.json({ success: true, data: centro })
})

// POST /api/centros — Solo superadmin
app.post('/', async (c) => {
  const body = await c.req.json()
  const nuevo = {
    id: centros.length + 1,
    ...body,
    activo: true,
    fecha_registro: new Date().toISOString().split('T')[0],
    estado_cumplimiento: 0,
    ultimo_reporte: null,
    protocolos_activos: body.protocolos_activos || []
  }
  centros.push(nuevo)
  return c.json({ success: true, data: nuevo, message: 'Centro de trabajo creado exitosamente' }, 201)
})

// PUT /api/centros/:id — Solo superadmin
app.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = centros.findIndex(ct => ct.id === id)
  if (idx === -1) return c.json({ success: false, error: 'Centro no encontrado' }, 404)
  const body = await c.req.json()
  centros[idx] = { ...centros[idx], ...body }
  return c.json({ success: true, data: centros[idx], message: 'Centro actualizado correctamente' })
})

// DELETE /api/centros/:id — Solo superadmin
app.delete('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = centros.findIndex(ct => ct.id === id)
  if (idx === -1) return c.json({ success: false, error: 'Centro no encontrado' }, 404)
  centros[idx].activo = false
  return c.json({ success: true, message: 'Centro desactivado correctamente' })
})

// GET /api/centros/:id/resumen — KPIs por centro
app.get('/:id/resumen', (c) => {
  const id = parseInt(c.req.param('id'))
  const centro = centros.find(ct => ct.id === id)
  if (!centro) return c.json({ success: false, error: 'Centro no encontrado' }, 404)
  return c.json({
    success: true,
    data: {
      centro_id: id,
      n_trabajadores: centro.n_trabajadores,
      estado_cumplimiento: centro.estado_cumplimiento,
      protocolos_activos: centro.protocolos_activos.length,
      ultimo_reporte: centro.ultimo_reporte
    }
  })
})

export default app
