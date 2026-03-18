import { Hono } from 'hono'

const app = new Hono()

// GET /api/dashboard/kpis
app.get('/kpis', (c) => {
  return c.json({
    success: true,
    data: {
      trabajadores: { total: 145, activos: 138, con_examenes_pendientes: 18, con_protocolos_activos: 89 },
      accidentabilidad: { tasa: 2.76, variacion: -0.8, accidentes_ytd: 5, dias_perdidos: 27, meta: 2.5 },
      siniestralidad: { tasa: 18.62, variacion: -2.1, meta: 20 },
      protocolos: { total: 7, al_dia: 4, por_vencer: 2, criticos: 1, cumplimiento_pct: 72 },
      examenes: { total_vigentes: 112, por_vencer: 18, vencidos: 24, proximos_30dias: 8 },
      epp: { items_criticos: 2, items_bajo_stock: 4, entregas_pendientes: 3, valor_inventario: 4250000 },
      capacitaciones: { vigentes: 6, por_vencer: 1, vencidas: 2, cobertura_irl: 92, cobertura_odi: 92 }, // cobertura_odi mantenido por compatibilidad; usar cobertura_irl (DS 44 Art.15)
      alertas_activas: 12
    }
  })
})

// GET /api/dashboard/chart-accidentes
app.get('/chart-accidentes', (c) => {
  return c.json({
    success: true,
    data: {
      labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      accidentes: [0,1,2,1,1,0,0,0,0,0,0,0],
      dias_perdidos: [0,21,5,3,1,0,0,0,0,0,0,0],
      año_anterior: [1,2,1,3,0,1,2,0,1,2,1,0]
    }
  })
})

// GET /api/dashboard/chart-protocolos
app.get('/chart-protocolos', (c) => {
  return c.json({
    success: true,
    data: {
      labels: ['PREXOR','PLANESI','TMERT','Psicosocial','UV','MMC','Voz'],
      cumplimiento: [68, 55, 78, 82, 90, 75, 95],
      colores: ['#3b82f6','#f59e0b','#22c55e','#a855f7','#f97316','#ef4444','#6366f1']
    }
  })
})

// GET /api/dashboard/alertas-resumen
app.get('/alertas-resumen', (c) => {
  return c.json({
    success: true,
    data: {
      criticas: 3,
      altas: 5,
      medias: 4,
      total: 12
    }
  })
})

export default app
