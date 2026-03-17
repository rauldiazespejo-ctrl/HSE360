import { Hono } from 'hono'

const app = new Hono()

// Datos de protocolos MINSAL
const protocols = [
  {
    id: 'PREXOR',
    nombre: 'PREXOR - Exposición Ocupacional a Ruido',
    descripcion: 'Protocolo de Exposición Ocupacional a Ruido (PREXOR)',
    autoridad: 'MINSAL / SUSESO',
    base_legal: 'DS 594, Circular 3E/009',
    color: 'blue',
    icon: 'fa-ear-deaf',
    evaluaciones: [
      { id: 1, worker_id: 1, worker_nombre: 'Carlos González', fecha_eval: '2024-01-15', nivel_exposicion: '92 dB(A)', resultado: 'Alto Riesgo', nse: 'NSE III', prox_audiometria: '2025-01-15', uso_epa: true, tipo_epa: 'Protectores de copa + tapones', mapa_ruido: true, estado: 'activo' },
      { id: 2, worker_id: 3, worker_nombre: 'Jorge Martínez', fecha_eval: '2024-02-20', nivel_exposicion: '87 dB(A)', resultado: 'Riesgo Moderado', nse: 'NSE II', prox_audiometria: '2025-02-20', uso_epa: true, tipo_epa: 'Tapones auditivos', mapa_ruido: true, estado: 'activo' },
      { id: 3, worker_id: 5, worker_nombre: 'Pedro Sánchez', fecha_eval: '2023-11-10', nivel_exposicion: '95 dB(A)', resultado: 'Alto Riesgo', nse: 'NSE III', prox_audiometria: '2024-05-10', uso_epa: true, tipo_epa: 'Protectores de copa', mapa_ruido: true, estado: 'requiere_atencion' },
    ],
    estadisticas: { total_expuestos: 12, alto_riesgo: 4, riesgo_moderado: 6, bajo_riesgo: 2, con_audiometria_vigente: 8, audiometrias_vencidas: 4 }
  },
  {
    id: 'PLANESI',
    nombre: 'PLANESI - Exposición Ocupacional a Sílice',
    descripcion: 'Plan Nacional de Erradicación de la Silicosis',
    autoridad: 'MINSAL',
    base_legal: 'DS 594 Art. 62, Decreto Ley 3500',
    color: 'yellow',
    icon: 'fa-lungs',
    evaluaciones: [
      { id: 1, worker_id: 3, worker_nombre: 'Jorge Martínez', fecha_eval: '2024-01-08', tipo_eval: 'Cuantitativa', concentracion_silice: '0.08 mg/m³', limite_permisible: '0.1 mg/m³', resultado: 'Bajo Límite', prox_radiografia: '2025-01-08', uso_epr: true, tipo_epr: 'Respirador P100', estado: 'vigente' },
      { id: 2, worker_id: 5, worker_nombre: 'Pedro Sánchez', fecha_eval: '2023-10-15', tipo_eval: 'Cuantitativa', concentracion_silice: '0.12 mg/m³', limite_permisible: '0.1 mg/m³', resultado: 'Sobre Límite', prox_radiografia: '2024-04-15', uso_epr: true, tipo_epr: 'Respirador NIOSH P100', estado: 'critico' },
    ],
    estadisticas: { total_expuestos: 8, sobre_limite: 2, bajo_limite: 6, con_rx_vigente: 5, rx_vencidas: 3 }
  },
  {
    id: 'TMERT',
    nombre: 'TMERT - Trastornos Musculoesqueléticos',
    descripcion: 'Protocolo de Vigilancia de Trastornos Musculoesqueléticos de Extremidades Superiores',
    autoridad: 'MINSAL / SUSESO',
    base_legal: 'Resolución Exenta 336/2011',
    color: 'green',
    icon: 'fa-person-walking',
    evaluaciones: [
      { id: 1, worker_id: 1, worker_nombre: 'Carlos González', fecha_eval: '2024-03-01', puesto: 'Operador Línea 1', ciclo_trabajo: '< 30 seg', repetitividad: 'Alta', fuerza: 'Moderada', postura: 'Inadecuada', resultado: 'Riesgo Alto', plan_intervencion: true, proxima_eval: '2024-09-01', pausas_activas: true },
      { id: 2, worker_id: 2, worker_nombre: 'María Rodríguez', fecha_eval: '2024-02-15', puesto: 'Supervisora', ciclo_trabajo: '> 120 seg', repetitividad: 'Baja', fuerza: 'Leve', postura: 'Adecuada', resultado: 'Riesgo Bajo', plan_intervencion: false, proxima_eval: '2025-02-15', pausas_activas: true },
      { id: 3, worker_id: 8, worker_nombre: 'Valeria Herrera', fecha_eval: '2024-01-20', puesto: 'Operadora Bodega', ciclo_trabajo: '30-60 seg', repetitividad: 'Alta', fuerza: 'Moderada', postura: 'Moderada', resultado: 'Riesgo Moderado', plan_intervencion: true, proxima_eval: '2024-07-20', pausas_activas: true },
    ],
    estadisticas: { total_evaluados: 18, riesgo_alto: 5, riesgo_moderado: 8, riesgo_bajo: 5, con_plan_intervencion: 13 }
  },
  {
    id: 'PSICOSOCIAL',
    nombre: 'Riesgos Psicosociales CEAL-SM / SUSESO ISTAS21',
    descripcion: 'Protocolo de Vigilancia de Riesgos Psicosociales en el Trabajo',
    autoridad: 'MINSAL / SUSESO',
    base_legal: 'Resolución Exenta 1433/2017',
    color: 'purple',
    icon: 'fa-brain',
    evaluaciones: [
      { id: 1, empresa: 'Global', fecha_aplicacion: '2023-08-15', instrumento: 'CEAL-SM', participacion: '87%', trabajadores_encuestados: 95, dimension_exigencias: 'Alto', dimension_trabajo_activo: 'Medio', dimension_apoyo_social: 'Alto', dimension_compensaciones: 'Alto', dimension_doble_presencia: 'Medio', nivel_riesgo: 'Alto', plan_intervencion: 'En ejecución', prox_medicion: '2025-08-15', estado: 'activo' },
    ],
    estadisticas: { ultima_medicion: '2023-08-15', proxima_medicion: '2025-08-15', participacion: '87%', nivel_riesgo: 'Alto', dimensiones_criticas: 3 }
  },
  {
    id: 'UV',
    nombre: 'Radiación UV de Origen Solar',
    descripcion: 'Protocolo de Exposición a Radiación UV',
    autoridad: 'MINSAL',
    base_legal: 'Ley 20.096, Circular B51/22',
    color: 'orange',
    icon: 'fa-sun',
    evaluaciones: [
      { id: 1, fecha: '2024-03-15', indice_uv: 11, nivel: 'Extremo', medidas_proteccion: ['Protector solar FPS50', 'Ropa manga larga', 'Legionario', 'Restricción horaria 11-16h'], trabajadores_expuestos: 15, capacitacion_vigente: true, prox_capacitacion: '2025-03-15' },
      { id: 2, fecha: '2024-02-10', indice_uv: 9, nivel: 'Muy Alto', medidas_proteccion: ['Protector solar FPS30', 'Legionario', 'Restricción horaria 12-15h'], trabajadores_expuestos: 15, capacitacion_vigente: true, prox_capacitacion: '2025-03-15' },
    ],
    estadisticas: { trabajadores_expuestos: 15, con_epp_vigente: 12, capacitacion_vigente: true, indice_uv_hoy: 8 }
  },
  {
    id: 'MMC',
    nombre: 'Manejo Manual de Cargas (Ley 20.949)',
    descripcion: 'Evaluación ergonómica de manejo manual de cargas',
    autoridad: 'MINTRAB / MINSAL',
    base_legal: 'Ley 20.949, DS 63/2005',
    color: 'red',
    icon: 'fa-box',
    evaluaciones: [
      { id: 1, worker_id: 8, worker_nombre: 'Valeria Herrera', fecha_eval: '2024-01-20', puesto: 'Operadora Bodega', peso_habitual: '15 kg', frecuencia: '20 veces/hora', resultado: 'Sobre Límite Legal', limite_legal_genero: '20 kg (mujer)', medidas_correctivas: 'Uso de carro portador, rotación de tareas', estado: 'con_intervencion' },
    ],
    estadisticas: { total_evaluados: 10, sobre_limite: 3, bajo_limite: 7, con_intervencion: 3 }
  },
  {
    id: 'VOZ',
    nombre: 'Trastornos de la Voz Profesional',
    descripcion: 'Vigilancia de trabajadores con uso intensivo de la voz',
    autoridad: 'MINSAL',
    base_legal: 'Circular B51/45',
    color: 'indigo',
    icon: 'fa-microphone',
    evaluaciones: [
      { id: 1, worker_id: 4, worker_nombre: 'Ana López', fecha_eval: '2024-02-01', cargo_voz: 'Administrativa (call center)', horas_voz_dia: 6, evaluacion_vocal: 'Sin alteraciones', laringoscopia: 'Normal', hidratacion_adecuada: true, prox_eval: '2025-02-01', estado: 'vigente' },
    ],
    estadisticas: { total_vigilados: 5, con_patologia: 0, sin_alteraciones: 5 }
  }
]

// GET /api/protocols - Lista todos los protocolos
app.get('/', (c) => {
  const summary = protocols.map(p => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    color: p.color,
    icon: p.icon,
    estadisticas: p.estadisticas
  }))
  return c.json({ success: true, data: summary })
})

// GET /api/protocols/:id
app.get('/:id', (c) => {
  const id = c.req.param('id').toUpperCase()
  const protocol = protocols.find(p => p.id === id)
  if (!protocol) return c.json({ success: false, error: 'Protocolo no encontrado' }, 404)
  return c.json({ success: true, data: protocol })
})

// GET /api/protocols/:id/evaluaciones
app.get('/:id/evaluaciones', (c) => {
  const id = c.req.param('id').toUpperCase()
  const protocol = protocols.find(p => p.id === id)
  if (!protocol) return c.json({ success: false, error: 'Protocolo no encontrado' }, 404)
  return c.json({ success: true, data: protocol.evaluaciones })
})

export default app
