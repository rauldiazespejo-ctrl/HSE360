import { Hono } from 'hono'

const app = new Hono()

// ================================================================
// SOLDESP S.A. — RUT: 76.841.820-9 — N° asociada: 2000143137
// Datos reales certificados por mutualidad
// Fuente: Certificado de Tasas (Folio 0005153838)
// ================================================================

// Datos reales por período (certificado mutualidad)
export const accidentabilidadDB: any = {
  empresa: {
    razon_social: 'SOLDESP S.A.',
    rut: '76.841.820-9',
    n_asociada: '2000143137',
    cotizacion_basica_pct: 0.93,
    cotizacion_adicional_pct: 0.00,
    cotizacion_total_pct: 0.93,
  },
  periodos: [
    {
      id: 'p2023',
      label: 'Período 2023',
      desde: '01/02/2023',
      hasta: '29/02/2024',
      accidentes: 1,
      dias_perdidos_accidente: 14,
      enfermedades_profesionales: 0,
      dias_perdidos_ep: 272,
      total_dias_perdidos: 286,
      dias_perdidos_fatales: 0,
      trabajadores_promedio: 589,
      horas_hombre: 1791153,
      tasa_frecuencia: 0.56,
      tasa_gravedad: 7.82,
      tasa_siniestralidad: 48,
    },
    {
      id: 'p2024',
      label: 'Período 2024',
      desde: '01/02/2024',
      hasta: '28/02/2025',
      accidentes: 1,
      dias_perdidos_accidente: 15,
      enfermedades_profesionales: 0,
      dias_perdidos_ep: 0,
      total_dias_perdidos: 15,
      dias_perdidos_fatales: 0,
      trabajadores_promedio: 712,
      horas_hombre: 1997352,
      tasa_frecuencia: 0.50,
      tasa_gravedad: 7.51,
      tasa_siniestralidad: 2,
    },
    {
      id: 'p2025',
      label: 'Período 2025',
      desde: '01/02/2025',
      hasta: '28/02/2026',
      accidentes: 0,
      dias_perdidos_accidente: 0,
      enfermedades_profesionales: 0,
      dias_perdidos_ep: 0,
      total_dias_perdidos: 0,
      dias_perdidos_fatales: 0,
      trabajadores_promedio: 551,
      horas_hombre: 1338309,
      tasa_frecuencia: 0.00,
      tasa_gravedad: 0.00,
      tasa_siniestralidad: 0,
    },
  ],
  // Datos adicionales editables para KPIs del dashboard actual
  kpi_override: {
    trabajadores_total: 551,
    trabajadores_activos: 538,
    con_examenes_pendientes: 18,
    con_protocolos_activos: 220,
    protocolos_al_dia: 5,
    protocolos_por_vencer: 2,
    protocolos_criticos: 1,
    protocolos_cumplimiento_pct: 72,
    examenes_vigentes: 112,
    examenes_por_vencer: 18,
    examenes_vencidos: 24,
    epp_items_criticos: 2,
    epp_items_bajo_stock: 4,
    epp_entregas_pendientes: 3,
    epp_valor_inventario: 4250000,
    cap_vigentes: 10,
    cap_por_vencer: 1,
    cap_vencidas: 0,
    cobertura_irl: 92,
    alertas_criticas: 3,
    alertas_altas: 5,
    alertas_medias: 4,
    meta_tasa_frecuencia: 1.0,
    meta_tasa_gravedad: 10.0,
    meta_tasa_siniestralidad: 5,
  }
}

// GET /api/dashboard/kpis
app.get('/kpis', (c) => {
  const p = accidentabilidadDB.periodos[2] // período vigente 2025
  const ov = accidentabilidadDB.kpi_override
  return c.json({
    success: true,
    data: {
      empresa: accidentabilidadDB.empresa,
      trabajadores: {
        total: ov.trabajadores_total,
        activos: ov.trabajadores_activos,
        con_examenes_pendientes: ov.con_examenes_pendientes,
        con_protocolos_activos: ov.con_protocolos_activos
      },
      accidentabilidad: {
        tasa: p.tasa_frecuencia,
        tasa_frecuencia: p.tasa_frecuencia,
        tasa_gravedad: p.tasa_gravedad,
        tasa_siniestralidad: p.tasa_siniestralidad,
        variacion: +(p.tasa_frecuencia - accidentabilidadDB.periodos[1].tasa_frecuencia).toFixed(2),
        accidentes_ytd: p.accidentes,
        dias_perdidos: p.total_dias_perdidos,
        enfermedades_profesionales: p.enfermedades_profesionales,
        horas_hombre: p.horas_hombre,
        trabajadores_promedio: p.trabajadores_promedio,
        meta: ov.meta_tasa_frecuencia,
        meta_gravedad: ov.meta_tasa_gravedad,
        meta_siniestralidad: ov.meta_tasa_siniestralidad,
        periodo_actual: `${p.desde} — ${p.hasta}`,
      },
      siniestralidad: {
        tasa: p.tasa_siniestralidad,
        variacion: p.tasa_siniestralidad - accidentabilidadDB.periodos[1].tasa_siniestralidad,
        meta: ov.meta_tasa_siniestralidad
      },
      protocolos: {
        total: 8,
        al_dia: ov.protocolos_al_dia,
        por_vencer: ov.protocolos_por_vencer,
        criticos: ov.protocolos_criticos,
        cumplimiento_pct: ov.protocolos_cumplimiento_pct
      },
      examenes: {
        total_vigentes: ov.examenes_vigentes,
        por_vencer: ov.examenes_por_vencer,
        vencidos: ov.examenes_vencidos,
        proximos_30dias: 8
      },
      epp: {
        items_criticos: ov.epp_items_criticos,
        items_bajo_stock: ov.epp_items_bajo_stock,
        entregas_pendientes: ov.epp_entregas_pendientes,
        valor_inventario: ov.epp_valor_inventario
      },
      capacitaciones: {
        vigentes: ov.cap_vigentes,
        por_vencer: ov.cap_por_vencer,
        vencidas: ov.cap_vencidas,
        cobertura_irl: ov.cobertura_irl,
        cobertura_odi: ov.cobertura_irl
      },
      alertas_activas: ov.alertas_criticas + ov.alertas_altas + ov.alertas_medias
    }
  })
})

// GET /api/dashboard/accidentabilidad — Datos reales por período (certificado)
app.get('/accidentabilidad', (c) => {
  return c.json({ success: true, data: accidentabilidadDB })
})

// PUT /api/dashboard/accidentabilidad — Editar datos (solo superadmin)
app.put('/accidentabilidad', async (c) => {
  const body = await c.req.json()
  if (body.empresa) Object.assign(accidentabilidadDB.empresa, body.empresa)
  if (body.kpi_override) Object.assign(accidentabilidadDB.kpi_override, body.kpi_override)
  if (body.periodos) {
    body.periodos.forEach((p: any) => {
      const idx = accidentabilidadDB.periodos.findIndex((x: any) => x.id === p.id)
      if (idx !== -1) Object.assign(accidentabilidadDB.periodos[idx], p)
    })
  }
  return c.json({ success: true, data: accidentabilidadDB, message: 'Datos actualizados correctamente' })
})

// PUT /api/dashboard/accidentabilidad/periodo/:id — Editar un período específico
app.put('/accidentabilidad/periodo/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const idx = accidentabilidadDB.periodos.findIndex((x: any) => x.id === id)
  if (idx === -1) return c.json({ success: false, error: 'Período no encontrado' }, 404)
  Object.assign(accidentabilidadDB.periodos[idx], body)
  // Recalcular tasas si se proporcionan datos base
  const p = accidentabilidadDB.periodos[idx]
  if (body.horas_hombre && body.accidentes !== undefined) {
    p.tasa_frecuencia = body.horas_hombre > 0 ? +((body.accidentes * 1000000) / body.horas_hombre).toFixed(2) : 0
  }
  if (body.horas_hombre && body.total_dias_perdidos !== undefined) {
    p.tasa_gravedad = body.horas_hombre > 0 ? +((body.total_dias_perdidos * 1000000) / body.horas_hombre).toFixed(2) : 0
  }
  return c.json({ success: true, data: p, message: 'Período actualizado' })
})

// GET /api/dashboard/chart-accidentes
app.get('/chart-accidentes', (c) => {
  const periodos = accidentabilidadDB.periodos
  return c.json({
    success: true,
    data: {
      labels: ['Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic','Ene'],
      // Período actual (2025): 0 accidentes, 0 días perdidos
      accidentes: [0,0,0,0,0,0,0,0,0,0,0,0],
      dias_perdidos: [0,0,0,0,0,0,0,0,0,0,0,0],
      // Período anterior (2024): 1 accidente, 15 días perdidos total
      año_anterior: [0,0,1,0,0,0,0,0,0,0,0,0],
      // Datos históricos reales para comparación de tasas
      tasas_historicas: {
        labels: ['2023','2024','2025'],
        frecuencia: [periodos[0].tasa_frecuencia, periodos[1].tasa_frecuencia, periodos[2].tasa_frecuencia],
        gravedad: [periodos[0].tasa_gravedad, periodos[1].tasa_gravedad, periodos[2].tasa_gravedad],
        siniestralidad: [periodos[0].tasa_siniestralidad, periodos[1].tasa_siniestralidad, periodos[2].tasa_siniestralidad],
        trabajadores: [periodos[0].trabajadores_promedio, periodos[1].trabajadores_promedio, periodos[2].trabajadores_promedio],
      }
    }
  })
})

// GET /api/dashboard/chart-protocolos
app.get('/chart-protocolos', (c) => {
  return c.json({
    success: true,
    data: {
      labels: ['PREXOR','PLANESI','TMERT','Psicosocial','UV','MMC','HIC','HUMOS'],
      cumplimiento: [68, 55, 78, 82, 90, 75, 60, 45],
      colores: ['#3b82f6','#f59e0b','#22c55e','#a855f7','#f97316','#ef4444','#0369a1','#78350f']
    }
  })
})

// GET /api/dashboard/alertas-resumen
app.get('/alertas-resumen', (c) => {
  const ov = accidentabilidadDB.kpi_override
  return c.json({
    success: true,
    data: {
      criticas: ov.alertas_criticas,
      altas: ov.alertas_altas,
      medias: ov.alertas_medias,
      total: ov.alertas_criticas + ov.alertas_altas + ov.alertas_medias
    }
  })
})

export default app
