import { Hono } from 'hono'

const app = new Hono()

// MIPER — Matriz de Identificación de Peligros y Evaluación de Riesgos
// Se registra en producción al ingresar los peligros reales de la empresa
export let miperDB: any[] = []

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
