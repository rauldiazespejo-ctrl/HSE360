import { Hono } from 'hono'

const app = new Hono()

const eppStock = [
  { id: 1, nombre: 'Casco de Seguridad', categoria: 'Cabeza', marca: 'MSA', modelo: 'V-Gard', stock_actual: 45, stock_minimo: 20, unidad: 'unidades', ubicacion: 'Bodega EPP', vencimiento_lote: '2026-12-31', estado_stock: 'ok', norma: 'ANSI Z89.1' },
  { id: 2, nombre: 'Tapones Auditivos 3M 1100', categoria: 'Auditivo', marca: '3M', modelo: '1100', stock_actual: 150, stock_minimo: 200, unidad: 'pares', ubicacion: 'Bodega EPP', vencimiento_lote: null, estado_stock: 'bajo', norma: 'ANSI S3.19' },
  { id: 3, nombre: 'Protector Auditivo Copa 3M Peltor', categoria: 'Auditivo', marca: '3M', modelo: 'Peltor H9A', stock_actual: 30, stock_minimo: 15, unidad: 'unidades', ubicacion: 'Bodega EPP', vencimiento_lote: null, estado_stock: 'ok', norma: 'ANSI S3.19' },
  { id: 4, nombre: 'Guantes de Cuero Descarne', categoria: 'Manos', marca: 'Steelpro', modelo: 'Clásico', stock_actual: 80, stock_minimo: 50, unidad: 'pares', ubicacion: 'Bodega EPP', vencimiento_lote: null, estado_stock: 'ok', norma: 'EN 388' },
  { id: 5, nombre: 'Lentes de Seguridad', categoria: 'Ojos y Cara', marca: '3M', modelo: 'SF400', stock_actual: 65, stock_minimo: 30, unidad: 'unidades', ubicacion: 'Bodega EPP', vencimiento_lote: null, estado_stock: 'ok', norma: 'ANSI Z87.1' },
  { id: 6, nombre: 'Respirador Semi-Facial P100', categoria: 'Respiratorio', marca: '3M', modelo: '7502', stock_actual: 8, stock_minimo: 15, unidad: 'unidades', ubicacion: 'Bodega EPP', vencimiento_lote: null, estado_stock: 'critico', norma: 'NIOSH P100' },
  { id: 7, nombre: 'Filtros P100 para Respirador', categoria: 'Respiratorio', marca: '3M', modelo: '2091', stock_actual: 12, stock_minimo: 30, unidad: 'pares', ubicacion: 'Bodega EPP', vencimiento_lote: '2025-06-30', estado_stock: 'critico', norma: 'NIOSH P100' },
  { id: 8, nombre: 'Protector Solar FPS 50+', categoria: 'Radiación UV', marca: 'Umbrella', modelo: 'FPS50+', stock_actual: 24, stock_minimo: 30, unidad: 'frascos 120ml', ubicacion: 'Bodega EPP', vencimiento_lote: '2025-12-31', estado_stock: 'bajo', norma: 'ISO 24444' },
  { id: 9, nombre: 'Gorro Legionario', categoria: 'Radiación UV', marca: 'Pava', modelo: 'Estándar', stock_actual: 18, stock_minimo: 20, unidad: 'unidades', ubicacion: 'Bodega EPP', vencimiento_lote: null, estado_stock: 'bajo', norma: null },
  { id: 10, nombre: 'Zapatos de Seguridad Punta Acero', categoria: 'Pies', marca: 'Caterpillar', modelo: 'Second Shift', stock_actual: 22, stock_minimo: 25, unidad: 'pares', ubicacion: 'Bodega EPP', vencimiento_lote: null, estado_stock: 'bajo', norma: 'ASTM F2413' },
  { id: 11, nombre: 'Careta de Soldar Autodimable', categoria: 'Ojos y Cara', marca: 'Lincoln Electric', modelo: 'VIKING 1840', stock_actual: 5, stock_minimo: 5, unidad: 'unidades', ubicacion: 'Taller Soldadura', vencimiento_lote: null, estado_stock: 'ok', norma: 'ANSI Z87.1' },
  { id: 12, nombre: 'Chaleco Reflectante', categoria: 'Alta Visibilidad', marca: 'Steelpro', modelo: 'Clase 2', stock_actual: 40, stock_minimo: 30, unidad: 'unidades', ubicacion: 'Bodega EPP', vencimiento_lote: null, estado_stock: 'ok', norma: 'ANSI 107' },
]

const entregas = [
  { id: 1, worker_id: 1, worker_nombre: 'Carlos González', epp_id: 2, epp_nombre: 'Tapones Auditivos 3M 1100', cantidad: 2, fecha_entrega: '2024-01-15', proxima_entrega: '2024-07-15', firma_digital: true, estado: 'vigente', observaciones: null },
  { id: 2, worker_id: 1, worker_nombre: 'Carlos González', epp_id: 3, epp_nombre: 'Protector Auditivo Copa 3M Peltor', cantidad: 1, fecha_entrega: '2024-01-15', proxima_entrega: '2025-01-15', firma_digital: true, estado: 'vigente', observaciones: null },
  { id: 3, worker_id: 1, worker_nombre: 'Carlos González', epp_id: 8, epp_nombre: 'Protector Solar FPS 50+', cantidad: 1, fecha_entrega: '2024-03-01', proxima_entrega: '2024-09-01', firma_digital: true, estado: 'vigente', observaciones: null },
  { id: 4, worker_id: 3, worker_nombre: 'Jorge Martínez', epp_id: 6, epp_nombre: 'Respirador Semi-Facial P100', cantidad: 1, fecha_entrega: '2024-01-10', proxima_entrega: '2025-01-10', firma_digital: true, estado: 'vigente', observaciones: 'Control trimestral de sello' },
  { id: 5, worker_id: 5, worker_nombre: 'Pedro Sánchez', epp_id: 11, epp_nombre: 'Careta de Soldar Autodimable', cantidad: 1, fecha_entrega: '2023-11-15', proxima_entrega: '2025-11-15', firma_digital: false, estado: 'vigente', observaciones: 'Pendiente firma' },
  { id: 6, worker_id: 5, worker_nombre: 'Pedro Sánchez', epp_id: 6, epp_nombre: 'Respirador Semi-Facial P100', cantidad: 1, fecha_entrega: '2023-06-01', proxima_entrega: '2024-06-01', firma_digital: true, estado: 'por_renovar', observaciones: null },
]

// GET /api/epp
app.get('/', (c) => {
  const { estado_stock, categoria } = c.req.query()
  let filtered = [...eppStock]
  if (estado_stock && estado_stock !== 'all') filtered = filtered.filter(e => e.estado_stock === estado_stock)
  if (categoria && categoria !== 'all') filtered = filtered.filter(e => e.categoria === categoria)
  return c.json({ success: true, data: filtered, total: filtered.length })
})

// GET /api/epp/stats
app.get('/stats', (c) => {
  const criticos = eppStock.filter(e => e.estado_stock === 'critico').length
  const bajos = eppStock.filter(e => e.estado_stock === 'bajo').length
  const ok = eppStock.filter(e => e.estado_stock === 'ok').length
  return c.json({ success: true, data: { total_items: eppStock.length, criticos, bajos, ok, entregas_pendientes_firma: entregas.filter(e => !e.firma_digital).length } })
})

// GET /api/epp/entregas
app.get('/entregas', (c) => {
  const { worker_id } = c.req.query()
  let filtered = [...entregas]
  if (worker_id) filtered = filtered.filter(e => e.worker_id === parseInt(worker_id))
  return c.json({ success: true, data: filtered })
})

export default app
