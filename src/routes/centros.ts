import { Hono } from 'hono'

const app = new Hono()

// ================================================================
// HSE 360 — Centros de Trabajo
// Solo el Superadmin puede crear/editar/eliminar centros
// ================================================================

export const centros: any[] = [
  {
    id: 1,
    nombre: 'Planta Industrial Norte',
    razon_social: 'Industrias Pacífico S.A.',
    rut_empresa: '76.543.210-1',
    direccion: 'Av. Industrial 1450, Quilicura',
    ciudad: 'Santiago',
    region: 'Metropolitana',
    telefono: '+56 2 2345 6789',
    email_contacto: 'prevencion@industriaspacifico.cl',
    mutualidad: 'ACHS',
    n_trabajadores: 87,
    actividad_economica: 'Fabricación de productos metálicos — CIIU 2891',
    codigo_ciiu: '2891',
    responsable_prevencion: 'Claudia Torres Sepúlveda',
    responsable_medico: 'Dr. Andrés Morales Vásquez',
    activo: true,
    protocolos_activos: ['PREXOR','PLANESI','TMERT','UV','MMC'],
    fecha_registro: '2026-01-10',
    logo_url: null,
    estado_cumplimiento: 72,
    ultimo_reporte: '2026-03-01'
  },
  {
    id: 2,
    nombre: 'Bodega y Logística Sur',
    razon_social: 'Transportes y Logística Sur Ltda.',
    rut_empresa: '77.654.321-2',
    direccion: 'Ruta 68 km 12, Pudahuel',
    ciudad: 'Pudahuel',
    region: 'Metropolitana',
    telefono: '+56 2 2987 6543',
    email_contacto: 'seguridad@logisticasur.cl',
    mutualidad: 'IST',
    n_trabajadores: 45,
    actividad_economica: 'Almacenamiento y logística — CIIU 5210',
    codigo_ciiu: '5210',
    responsable_prevencion: 'María José Reyes Contreras',
    responsable_medico: '— (Derivado a IST)',
    activo: true,
    protocolos_activos: ['TMERT','MMC','UV','PSICOSOCIAL'],
    fecha_registro: '2026-02-01',
    logo_url: null,
    estado_cumplimiento: 85,
    ultimo_reporte: '2026-03-05'
  },
  {
    id: 3,
    nombre: 'Oficinas Administrativas',
    razon_social: 'Holding Grupo Pacífico S.A.',
    rut_empresa: '76.111.222-3',
    direccion: 'Av. Providencia 2340, Of. 801',
    ciudad: 'Providencia',
    region: 'Metropolitana',
    telefono: '+56 2 2100 2200',
    email_contacto: 'rrhh@grupopacífico.cl',
    mutualidad: 'Mutual de Seguridad CChC',
    n_trabajadores: 32,
    actividad_economica: 'Actividades de oficinas administrativas — CIIU 7010',
    codigo_ciiu: '7010',
    responsable_prevencion: '— (En proceso de contratación)',
    responsable_medico: '— (Derivado a Mutual)',
    activo: true,
    protocolos_activos: ['PSICOSOCIAL','VOZ'],
    fecha_registro: '2026-03-01',
    logo_url: null,
    estado_cumplimiento: 55,
    ultimo_reporte: null
  }
]

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
