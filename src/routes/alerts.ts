import { Hono } from 'hono'

const app = new Hono()

const alerts = [
  { id: 1, tipo: 'examen_vencido', prioridad: 'critica', titulo: 'Audiometría Vencida - Carlos González', descripcion: 'La audiometría del trabajador Carlos González (PREXOR) venció el 15/06/2024. Requiere reprogramación urgente.', trabajador: 'Carlos González', rut: '12.345.678-9', fecha_vencimiento: '2024-06-15', dias_vencido: 45, modulo: 'PREXOR', accion: 'Agendar nueva audiometría', leida: false, fecha_alerta: '2024-07-30' },
  { id: 2, tipo: 'examen_vencido', prioridad: 'critica', titulo: 'Audiometría Vencida - Pedro Sánchez', descripcion: 'La audiometría del trabajador Pedro Sánchez (PREXOR) venció el 22/03/2024. NSE III - Alto Riesgo.', trabajador: 'Pedro Sánchez', rut: '11.111.111-1', fecha_vencimiento: '2024-03-22', dias_vencido: 130, modulo: 'PREXOR', accion: 'Agendar nueva audiometría URGENTE', leida: false, fecha_alerta: '2024-07-30' },
  { id: 3, tipo: 'protocolo_critico', prioridad: 'critica', titulo: 'PLANESI - Concentración Sobre Límite Permisible', descripcion: 'Pedro Sánchez registra concentración de sílice de 0.12 mg/m³, sobre el límite de 0.1 mg/m³. Requiere medidas inmediatas.', trabajador: 'Pedro Sánchez', rut: '11.111.111-1', fecha_vencimiento: null, dias_vencido: null, modulo: 'PLANESI', accion: 'Implementar medidas de control urgentes', leida: false, fecha_alerta: '2024-07-30' },
  { id: 4, tipo: 'stock_critico', prioridad: 'alta', titulo: 'Stock Crítico - Respiradores P100', descripcion: 'Stock actual de Respiradores Semi-Faciales P100: 8 unidades (mínimo: 15). Se requiere compra urgente.', trabajador: null, rut: null, fecha_vencimiento: null, dias_vencido: null, modulo: 'EPP', accion: 'Gestionar orden de compra', leida: false, fecha_alerta: '2024-07-30' },
  { id: 5, tipo: 'stock_critico', prioridad: 'alta', titulo: 'Stock Crítico - Filtros P100', descripcion: 'Stock actual de Filtros P100: 12 pares (mínimo: 30). Vencimiento de lote: 30/06/2025.', trabajador: null, rut: null, fecha_vencimiento: '2025-06-30', dias_vencido: null, modulo: 'EPP', accion: 'Gestionar orden de compra urgente', leida: false, fecha_alerta: '2024-07-30' },
  { id: 6, tipo: 'capacitacion_vencida', prioridad: 'alta', titulo: 'Capacitación PREXOR Vencida', descripcion: 'La capacitación "PREXOR - Riesgo por Ruido" venció el 10/08/2024. Afecta a 15 trabajadores expuestos.', trabajador: null, rut: null, fecha_vencimiento: '2024-08-10', dias_vencido: 20, modulo: 'Capacitaciones', accion: 'Programar nueva capacitación', leida: true, fecha_alerta: '2024-08-25' },
  { id: 7, tipo: 'capacitacion_vencida', prioridad: 'alta', titulo: 'Capacitación PLANESI Vencida', descripcion: 'La capacitación "PLANESI - Riesgo por Sílice" venció el 20/07/2024. Afecta a 8 trabajadores expuestos.', trabajador: null, rut: null, fecha_vencimiento: '2024-07-20', dias_vencido: 41, modulo: 'Capacitaciones', accion: 'Programar nueva capacitación', leida: true, fecha_alerta: '2024-07-25' },
  { id: 8, tipo: 'examen_por_vencer', prioridad: 'media', titulo: 'Radiografía Tórax Por Vencer - Jorge Martínez', descripcion: 'La radiografía de tórax OIT del trabajador Jorge Martínez (PLANESI) vence en 45 días (20/11/2024).', trabajador: 'Jorge Martínez', rut: '9.876.543-1', fecha_vencimiento: '2024-11-20', dias_vencido: -45, modulo: 'PLANESI', accion: 'Programar control radiológico', leida: false, fecha_alerta: '2024-07-30' },
  { id: 9, tipo: 'examen_por_vencer', prioridad: 'media', titulo: 'Radiografía Tórax Por Vencer - Pedro Sánchez', descripcion: 'La radiografía de tórax de Pedro Sánchez (PLANESI) vence en 55 días (15/09/2024). Caso con concentración sobre límite.', trabajador: 'Pedro Sánchez', rut: '11.111.111-1', fecha_vencimiento: '2024-09-15', dias_vencido: -55, modulo: 'PLANESI', accion: 'Programar radiografía urgente por caso crítico', leida: false, fecha_alerta: '2024-07-30' },
  { id: 10, tipo: 'stock_bajo', prioridad: 'media', titulo: 'Stock Bajo - Protector Solar FPS 50+', descripcion: 'Stock actual: 24 frascos (mínimo: 30). Época de alta radiación UV próxima (octubre-marzo).', trabajador: null, rut: null, fecha_vencimiento: '2025-12-31', dias_vencido: null, modulo: 'EPP', accion: 'Planificar compra preventiva', leida: false, fecha_alerta: '2024-07-30' },
  { id: 11, tipo: 'capacitacion_por_vencer', prioridad: 'media', titulo: 'Capacitación UV Por Vencer', descripcion: 'La capacitación "Radiación UV - Prevención y Protección" vence el 05/12/2024.', trabajador: null, rut: null, fecha_vencimiento: '2024-12-05', dias_vencido: -128, modulo: 'Capacitaciones', accion: 'Programar renovación', leida: false, fecha_alerta: '2024-07-30' },
  { id: 12, tipo: 'firma_pendiente', prioridad: 'media', titulo: 'EPP Sin Firma - Pedro Sánchez', descripcion: 'La entrega de Careta de Soldar a Pedro Sánchez del 15/11/2023 no tiene firma de recepción.', trabajador: 'Pedro Sánchez', rut: '11.111.111-1', fecha_vencimiento: null, dias_vencido: null, modulo: 'EPP', accion: 'Obtener firma de acuse de recibo', leida: false, fecha_alerta: '2024-07-30' },
]

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
