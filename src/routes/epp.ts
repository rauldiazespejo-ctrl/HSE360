import { Hono } from 'hono'

const app = new Hono()

export let eppStockDB: any[] = [
  { id: 1, codigo: 'EPA-001', nombre: 'Tapones Auditivos 3M 1100', categoria: 'Auditivo', marca: '3M', modelo: '1100', nrr_db: 29, norma_tecnica: 'ANSI S3.19 / NRR 29 dB', stock_actual: 150, stock_minimo: 200, unidad: 'pares', ubicacion: 'Bodega EPP — Estante A1', fecha_vencimiento_lote: null, costo_unitario: 350, estado_stock: 'bajo', protocolo_asociado: 'PREXOR' },
  { id: 2, codigo: 'EPA-002', nombre: 'Orejera 3M Peltor H9A', categoria: 'Auditivo', marca: '3M', modelo: 'Peltor H9A', nrr_db: 27, norma_tecnica: 'ANSI S3.19 / NRR 27 dB', stock_actual: 28, stock_minimo: 20, unidad: 'unidades', ubicacion: 'Bodega EPP — Estante A1', fecha_vencimiento_lote: null, costo_unitario: 9800, estado_stock: 'ok', protocolo_asociado: 'PREXOR' },
  { id: 3, codigo: 'EPR-001', nombre: 'Respirador Semimáscara 3M 7502', categoria: 'Respiratorio', marca: '3M', modelo: '7502 (talla M)', nrr_db: null, norma_tecnica: 'NIOSH / ANSI Z88.2', stock_actual: 6, stock_minimo: 15, unidad: 'unidades', ubicacion: 'Bodega EPP — Estante B1', fecha_vencimiento_lote: null, costo_unitario: 18500, estado_stock: 'critico', protocolo_asociado: 'PLANESI' },
  { id: 4, codigo: 'EPR-002', nombre: 'Filtros P100 3M 2097 (par)', categoria: 'Respiratorio', marca: '3M', modelo: '2097', nrr_db: null, norma_tecnica: 'NIOSH P100', stock_actual: 10, stock_minimo: 30, unidad: 'pares', ubicacion: 'Bodega EPP — Estante B1', fecha_vencimiento_lote: '2026-12-31', costo_unitario: 4200, estado_stock: 'critico', protocolo_asociado: 'PLANESI' },
  { id: 5, codigo: 'UV-001', nombre: 'Protector Solar FPS 50+', categoria: 'Radiación UV', marca: 'Umbrella', modelo: 'FPS 50+ Sport', nrr_db: null, norma_tecnica: 'ISO 24444', stock_actual: 22, stock_minimo: 35, unidad: 'frascos 120ml', ubicacion: 'Bodega EPP — Estante C1', fecha_vencimiento_lote: '2026-12-31', costo_unitario: 3500, estado_stock: 'bajo', protocolo_asociado: 'UV' },
  { id: 6, codigo: 'UV-002', nombre: 'Gorro Legionario UPF 50+', categoria: 'Radiación UV', marca: 'Pava', modelo: 'Legionario Estándar', nrr_db: null, norma_tecnica: 'AS/NZS 4399 UPF 50+', stock_actual: 15, stock_minimo: 20, unidad: 'unidades', ubicacion: 'Bodega EPP — Estante C2', fecha_vencimiento_lote: null, costo_unitario: 2800, estado_stock: 'bajo', protocolo_asociado: 'UV' },
  { id: 7, codigo: 'CAB-001', nombre: 'Casco de Seguridad MSA V-Gard', categoria: 'Cabeza', marca: 'MSA', modelo: 'V-Gard Class E', nrr_db: null, norma_tecnica: 'ANSI Z89.1 Clase E', stock_actual: 48, stock_minimo: 25, unidad: 'unidades', ubicacion: 'Bodega EPP — Estante D1', fecha_vencimiento_lote: '2028-06-30', costo_unitario: 12500, estado_stock: 'ok', protocolo_asociado: null },
  { id: 8, codigo: 'VIS-001', nombre: 'Lentes de Seguridad 3M SF400', categoria: 'Visual', marca: '3M', modelo: 'SecureFit SF400', nrr_db: null, norma_tecnica: 'ANSI Z87.1', stock_actual: 65, stock_minimo: 30, unidad: 'unidades', ubicacion: 'Bodega EPP — Estante D2', fecha_vencimiento_lote: null, costo_unitario: 4500, estado_stock: 'ok', protocolo_asociado: null },
  { id: 9, codigo: 'MAN-001', nombre: 'Guantes Cuero Descarne', categoria: 'Manos', marca: 'Steelpro', modelo: 'Clásico', nrr_db: null, norma_tecnica: 'EN 388 Nivel 3221', stock_actual: 95, stock_minimo: 60, unidad: 'pares', ubicacion: 'Bodega EPP — Estante E1', fecha_vencimiento_lote: null, costo_unitario: 2200, estado_stock: 'ok', protocolo_asociado: null },
  { id: 10, codigo: 'PIE-001', nombre: 'Zapatos de Seguridad Punta Acero', categoria: 'Pies', marca: 'Caterpillar', modelo: 'Second Shift', nrr_db: null, norma_tecnica: 'ASTM F2413-18', stock_actual: 18, stock_minimo: 20, unidad: 'pares', ubicacion: 'Bodega EPP — Estante F1', fecha_vencimiento_lote: null, costo_unitario: 45000, estado_stock: 'bajo', protocolo_asociado: null },
  { id: 11, codigo: 'SOL-001', nombre: 'Careta de Soldar Autodimable Lincoln', categoria: 'Visual/Soldadura', marca: 'Lincoln Electric', modelo: 'VIKING 1840', nrr_db: null, norma_tecnica: 'ANSI Z87.1', stock_actual: 5, stock_minimo: 5, unidad: 'unidades', ubicacion: 'Taller Soldadura', fecha_vencimiento_lote: null, costo_unitario: 125000, estado_stock: 'ok', protocolo_asociado: 'HUMOS' },
  { id: 12, codigo: 'ALT-001', nombre: 'Chaleco Reflectante Clase 2', categoria: 'Alta Visibilidad', marca: 'Steelpro', modelo: 'Clase 2 ANSI 107', nrr_db: null, norma_tecnica: 'ANSI/ISEA 107-2015 Clase 2', stock_actual: 42, stock_minimo: 30, unidad: 'unidades', ubicacion: 'Bodega EPP — Estante G1', fecha_vencimiento_lote: null, costo_unitario: 6500, estado_stock: 'ok', protocolo_asociado: null },
]

export let entregasDB: any[] = [
  { id: 1, worker_id: 1, trabajador_nombre: 'Carlos González Muñoz', trabajador_rut: '12.345.678-9', epp_id: 1, epp_nombre: 'Tapones Auditivos 3M 1100', cantidad: 2, fecha_entrega: '2026-01-15', proxima_renovacion: '2026-07-15', firma_digital: true, estado_registro: 'vigente', observaciones: 'NSE III. Renovación semestral.', protocolo: 'PREXOR' },
  { id: 2, worker_id: 1, trabajador_nombre: 'Carlos González Muñoz', trabajador_rut: '12.345.678-9', epp_id: 2, epp_nombre: 'Orejera 3M Peltor H9A', cantidad: 1, fecha_entrega: '2026-01-15', proxima_renovacion: '2027-01-15', firma_digital: true, estado_registro: 'vigente', observaciones: 'Uso alternado con tapones', protocolo: 'PREXOR' },
  { id: 3, worker_id: 1, trabajador_nombre: 'Carlos González Muñoz', trabajador_rut: '12.345.678-9', epp_id: 5, epp_nombre: 'Protector Solar FPS 50+', cantidad: 1, fecha_entrega: '2026-03-01', proxima_renovacion: '2026-06-01', firma_digital: true, estado_registro: 'vigente', observaciones: 'Temporada UV', protocolo: 'UV' },
  { id: 4, worker_id: 3, trabajador_nombre: 'Jorge Martínez Pérez', trabajador_rut: '9.876.543-1', epp_id: 3, epp_nombre: 'Respirador 3M 7502', cantidad: 1, fecha_entrega: '2026-01-20', proxima_renovacion: '2027-01-20', firma_digital: true, estado_registro: 'vigente', observaciones: 'Fit Test realizado 15/01/2026', protocolo: 'PLANESI' },
  { id: 5, worker_id: 3, trabajador_nombre: 'Jorge Martínez Pérez', trabajador_rut: '9.876.543-1', epp_id: 4, epp_nombre: 'Filtros P100 3M 2097', cantidad: 2, fecha_entrega: '2026-01-20', proxima_renovacion: '2026-07-20', firma_digital: true, estado_registro: 'vigente', observaciones: 'Renovación filtros cada 6 meses o según indicador de saturación', protocolo: 'PLANESI' },
  { id: 6, worker_id: 5, trabajador_nombre: 'Pedro Sánchez Rojas', trabajador_rut: '11.111.111-1', epp_id: 11, epp_nombre: 'Careta de Soldar Lincoln VIKING', cantidad: 1, fecha_entrega: '2025-11-15', proxima_renovacion: '2027-11-15', firma_digital: false, estado_registro: 'vigente', observaciones: '⚠️ PENDIENTE FIRMA DIGITAL', protocolo: 'HUMOS' },
  { id: 7, worker_id: 5, trabajador_nombre: 'Pedro Sánchez Rojas', trabajador_rut: '11.111.111-1', epp_id: 3, epp_nombre: 'Respirador 3M 7502', cantidad: 1, fecha_entrega: '2025-09-01', proxima_renovacion: '2026-09-01', firma_digital: true, estado_registro: 'vigente', observaciones: 'NSE IV. Uso obligatorio. Sistema doble con tapones.', protocolo: 'PLANESI' },
  { id: 8, worker_id: 8, trabajador_nombre: 'Valeria Herrera Díaz', trabajador_rut: '17.890.123-4', epp_id: 5, epp_nombre: 'Protector Solar FPS 50+', cantidad: 1, fecha_entrega: '2026-03-01', proxima_renovacion: '2026-06-01', firma_digital: true, estado_registro: 'vigente', observaciones: 'Trabajo exterior bodega', protocolo: 'UV' },
]

// Helper: calcula estado_stock
function calcEstado(actual: number, minimo: number): string {
  if (actual <= 0) return 'critico'
  if (actual < minimo * 0.5) return 'critico'
  if (actual < minimo) return 'bajo'
  return 'ok'
}

// IMPORTANTE: rutas específicas ANTES de las paramétricas

app.get('/inventario', (c) => {
  const { estado_stock, categoria, protocolo } = c.req.query()
  let filtered = [...eppStockDB]
  if (estado_stock && estado_stock !== 'all') filtered = filtered.filter(e => e.estado_stock === estado_stock)
  if (categoria && categoria !== 'all') filtered = filtered.filter(e => e.categoria === categoria)
  if (protocolo && protocolo !== 'all') filtered = filtered.filter(e => e.protocolo_asociado === protocolo)
  return c.json({ success: true, data: filtered })
})

app.get('/stats', (c) => {
  const items_criticos = eppStockDB.filter(e => e.estado_stock === 'critico').length
  const items_bajo_stock = eppStockDB.filter(e => e.estado_stock === 'bajo').length
  const items_ok = eppStockDB.filter(e => e.estado_stock === 'ok').length
  const entregas_pendientes_firma = entregasDB.filter(e => !e.firma_digital).length
  const valor_inventario = eppStockDB.reduce((s, e) => s + (e.stock_actual * e.costo_unitario), 0)
  return c.json({
    success: true,
    data: {
      total_items: eppStockDB.length,
      items_criticos,
      items_bajo_stock,
      items_ok,
      entregas_pendientes_firma,
      valor_inventario
    }
  })
})

app.get('/entregas', (c) => {
  const { worker_id } = c.req.query()
  let filtered = [...entregasDB]
  if (worker_id) filtered = filtered.filter(e => e.worker_id === parseInt(worker_id))
  // Calcular días para renovación
  const hoy = new Date()
  filtered = filtered.map(e => {
    const prox = e.proxima_renovacion ? new Date(e.proxima_renovacion) : null
    const dias = prox ? Math.round((prox.getTime() - hoy.getTime()) / (1000*60*60*24)) : null
    return { ...e, dias_para_renovacion: dias }
  })
  return c.json({ success: true, data: filtered })
})

app.post('/entregas', async (c) => {
  const body = await c.req.json()
  const newEntrega = {
    id: entregasDB.length + 1,
    firma_digital: false,
    estado_registro: 'vigente',
    ...body
  }
  entregasDB.push(newEntrega)
  const eppIdx = eppStockDB.findIndex(e => e.id === body.epp_id)
  if (eppIdx !== -1) {
    eppStockDB[eppIdx].stock_actual -= (body.cantidad || 1)
    eppStockDB[eppIdx].estado_stock = calcEstado(eppStockDB[eppIdx].stock_actual, eppStockDB[eppIdx].stock_minimo)
  }
  return c.json({ success: true, data: newEntrega, message: 'Entrega registrada. Stock actualizado.' }, 201)
})

app.put('/entregas/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = entregasDB.findIndex(e => e.id === id)
  if (idx === -1) return c.json({ success: false, error: 'Entrega no encontrada' }, 404)
  const body = await c.req.json()
  entregasDB[idx] = { ...entregasDB[idx], ...body }
  return c.json({ success: true, data: entregasDB[idx] })
})

app.get('/', (c) => {
  const { estado_stock, categoria, protocolo } = c.req.query()
  let filtered = [...eppStockDB]
  if (estado_stock && estado_stock !== 'all') filtered = filtered.filter(e => e.estado_stock === estado_stock)
  if (categoria && categoria !== 'all') filtered = filtered.filter(e => e.categoria === categoria)
  if (protocolo && protocolo !== 'all') filtered = filtered.filter(e => e.protocolo_asociado === protocolo)
  return c.json({ success: true, data: filtered })
})

app.post('/', async (c) => {
  const body = await c.req.json()
  const newItem: any = {
    id: eppStockDB.length + 1,
    codigo: `EPP-${String(eppStockDB.length + 1).padStart(3,'0')}`,
    estado_stock: 'ok',
    ...body
  }
  newItem.estado_stock = calcEstado(newItem.stock_actual || 0, newItem.stock_minimo || 5)
  eppStockDB.push(newItem)
  return c.json({ success: true, data: newItem, message: 'Ítem EPP agregado al inventario' }, 201)
})

app.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const item = eppStockDB.find(e => e.id === id)
  if (!item) return c.json({ success: false, error: 'EPP no encontrado' }, 404)
  return c.json({ success: true, data: item })
})

app.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = eppStockDB.findIndex(e => e.id === id)
  if (idx === -1) return c.json({ success: false, error: 'EPP no encontrado' }, 404)
  const body = await c.req.json()
  eppStockDB[idx] = { ...eppStockDB[idx], ...body }
  eppStockDB[idx].estado_stock = calcEstado(eppStockDB[idx].stock_actual, eppStockDB[idx].stock_minimo)
  return c.json({ success: true, data: eppStockDB[idx] })
})

export default app
