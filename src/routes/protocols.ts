import { Hono } from 'hono'

const app = new Hono()

// ============================================================
// DATOS TÉCNICOS REALES — PROTOCOLOS MINSAL CHILE
// Fuente: MINSAL, SUSESO, DS 594, Leyes vigentes
// ============================================================

export const protocolsDB: Record<string, any> = {

  PREXOR: {
    id: 'PREXOR',
    nombre: 'PREXOR — Exposición Ocupacional a Ruido',
    norma_tecnica: 'NT N°125 — Decreto Exento N°1.029 (26/11/2011)',
    base_legal: ['DS 594/1999 Art. 74-82', 'Ley 16.744', 'Circular 3E/009 MINSAL'],
    objetivo: 'Establecer directrices para la vigilancia de la salud de trabajadores expuestos a ruido, con el fin de prevenir la hipoacusia sensorioneural de origen laboral (NIHL).',
    color: 'blue',
    icon: 'fa-ear-deaf',
    // CRITERIOS TÉCNICOS OFICIALES
    criterios_tecnicos: {
      criterio_accion: { nivel: 82, unidad: 'dB(A)', descripcion: 'Nivel a partir del cual se activan medidas preventivas obligatorias' },
      limite_permisible: { nivel: 85, unidad: 'dB(A)', jornada: '8 horas', descripcion: 'Nivel máximo permitido para jornada de 8 horas (DS 594 Art. 75)' },
      nivel_maximo_instanta: { nivel: 140, unidad: 'dB(C)', descripcion: 'Nivel máximo de presión sonora de pico instantáneo (impacto)' },
      nse_clasificacion: [
        { nse: 'NSE I', rango: '< 82 dB(A)', riesgo: 'Sin riesgo', accion: 'No requiere intervención', color: 'green', audiometria: 'No obligatoria' },
        { nse: 'NSE II', rango: '82 - < 85 dB(A)', riesgo: 'Moderado', accion: 'Uso de EPA recomendado + capacitación', color: 'yellow', audiometria: 'Al inicio y cada 2 años' },
        { nse: 'NSE III', rango: '85 - < 90 dB(A)', riesgo: 'Alto', accion: 'Uso obligatorio EPA + audiometría anual', color: 'orange', audiometria: 'Ingreso + anual' },
        { nse: 'NSE IV', rango: '≥ 90 dB(A)', riesgo: 'Muy Alto', accion: 'Medidas de control inmediatas + rediseño del puesto', color: 'red', audiometria: 'Ingreso + semestral' },
      ]
    },
    requisitos_empresa: [
      { id: 1, categoria: 'Evaluación Ambiental', requisito: 'Medición de ruido (dosimetría o sonometría) por laboratorio acreditado ISP', periodicidad: 'Cuando se supera el criterio de acción o hay cambios en el proceso', obligatorio: true, norma: 'DS 594 Art. 76' },
      { id: 2, categoria: 'Evaluación Ambiental', requisito: 'Elaboración del Mapa de Ruido de la empresa', periodicidad: 'Cada vez que se realizan mediciones o cambios de infraestructura', obligatorio: true, norma: 'NT 125 sección 4.2' },
      { id: 3, categoria: 'Vigilancia de Salud', requisito: 'Audiometría de Ingreso (tonal liminar)', periodicidad: 'Dentro de los 60 días de iniciada la exposición a ≥82 dB(A)', obligatorio: true, norma: 'NT 125 sección 5.2.1' },
      { id: 4, categoria: 'Vigilancia de Salud', requisito: 'Audiometría de Seguimiento', periodicidad: 'Anual (NSE III-IV) / Cada 2 años (NSE II)', obligatorio: true, norma: 'NT 125 sección 5.2.2' },
      { id: 5, categoria: 'Control de Exposición', requisito: 'Dotación y control de EPA (Equipos de Protección Auditiva)', periodicidad: 'Permanente. Registro de entrega obligatorio', obligatorio: true, norma: 'DS 594 Art. 53' },
      { id: 6, categoria: 'Control de Exposición', requisito: 'Programa de controles de ingeniería (aislamiento, amortiguación, rediseño)', periodicidad: 'Cuando medidas administrativas son insuficientes', obligatorio: true, norma: 'NT 125 sección 6' },
      { id: 7, categoria: 'Capacitación', requisito: 'Capacitación sobre riesgos por ruido, uso de EPA y audiometrías', periodicidad: 'Anual para trabajadores expuestos a ≥82 dB(A)', obligatorio: true, norma: 'DS 594 Art. 21' },
      { id: 8, categoria: 'Documentación', requisito: 'Elaborar y mantener actualizado el Programa de Vigilancia PREXOR', periodicidad: 'Revisión anual', obligatorio: true, norma: 'NT 125 sección 3' },
    ],
    tipos_audiometria: [
      { tipo: 'Ingreso', descripcion: 'Primera audiometría, establece línea de base auditiva', plazo: 'Primeros 60 días de exposición ≥82 dB(A)' },
      { tipo: 'Seguimiento', descripcion: 'Monitoreo periódico del estado auditivo', plazo: 'NSE II: cada 2 años / NSE III: anual / NSE IV: semestral' },
      { tipo: 'Confirmación', descripcion: 'Ante sospecha de pérdida auditiva o cambio significativo (≥15 dB en cualquier frecuencia)', plazo: 'Dentro de 30 días de detectado el cambio' },
      { tipo: 'Fin de Exposición', descripcion: 'Al retiro del trabajador del puesto de riesgo', plazo: 'Al momento del retiro' },
    ],
    tipos_epa: [
      { tipo: 'Tapones auriculares desechables', nrr_min: 25, recomendado_para: 'NSE II', norma: 'ANSI S3.19' },
      { tipo: 'Tapones auriculares reutilizables', nrr_min: 25, recomendado_para: 'NSE II-III', norma: 'ANSI S3.19' },
      { tipo: 'Orejeras (protectores de copa)', nrr_min: 27, recomendado_para: 'NSE III', norma: 'ANSI S3.19' },
      { tipo: 'Sistema doble (tapón + orejera)', nrr_min: 34, recomendado_para: 'NSE IV (>100 dB)', norma: 'ANSI S3.19' },
    ],
    evaluaciones: [
      {
        id: 1, worker_id: 1, worker_nombre: 'Carlos González Muñoz', rut: '12.345.678-9',
        cargo: 'Operador de Maquinaria', area: 'Producción', fecha_eval: '2026-01-15',
        nivel_ruido_db: 92, nse: 'NSE III', metodo_medicion: 'Dosimetría',
        laboratorio: 'ACHS — Centro de Higiene Ocupacional', n_informe: 'INF-HIG-2026-001',
        uso_epa: true, tipo_epa: 'Orejera 3M Peltor H9A (NRR 27)', epa_adecuado: true,
        audiometria_ingreso: '2025-03-15', audiometria_seguimiento: '2026-01-15',
        resultado_audiometria: 'NIHL bilateral leve (Notch 4 kHz)', prox_audiometria: '2027-01-15',
        mapa_ruido_actualizado: true, controles_ingenieria: 'Cabina insonorizada parcial en línea 1',
        plan_accion: 'Completar cabina insonorizada, rotar trabajadores', estado: 'activo',
        observaciones: 'Trabajador con NIHL bilateral leve. Seguimiento anual según NT125.'
      },
      {
        id: 2, worker_id: 3, worker_nombre: 'Jorge Martínez Pérez', rut: '9.876.543-1',
        cargo: 'Mecánico Industrial', area: 'Mantenimiento', fecha_eval: '2026-02-10',
        nivel_ruido_db: 87, nse: 'NSE III', metodo_medicion: 'Sonometría',
        laboratorio: 'IST — Dpto. Higiene Industrial', n_informe: 'INF-HIG-2026-003',
        uso_epa: true, tipo_epa: 'Tapones 3M 1100 (NRR 29)', epa_adecuado: true,
        audiometria_ingreso: '2022-09-20', audiometria_seguimiento: '2026-02-10',
        resultado_audiometria: 'Audición normal bilateral', prox_audiometria: '2027-02-10',
        mapa_ruido_actualizado: true, controles_ingenieria: 'No aplica (exposición intermitente)',
        plan_accion: 'Mantener EPA, continuar vigilancia anual', estado: 'activo',
        observaciones: ''
      },
      {
        id: 3, worker_id: 5, worker_nombre: 'Pedro Sánchez Rojas', rut: '11.111.111-1',
        cargo: 'Soldador', area: 'Producción', fecha_eval: '2025-06-01',
        nivel_ruido_db: 95, nse: 'NSE IV', metodo_medicion: 'Dosimetría',
        laboratorio: 'ACHS — Centro de Higiene Ocupacional', n_informe: 'INF-HIG-2025-022',
        uso_epa: true, tipo_epa: 'Sistema doble: tapón + orejera', epa_adecuado: true,
        audiometria_ingreso: '2023-05-14', audiometria_seguimiento: '2025-06-01',
        resultado_audiometria: 'NIHL moderado bilateral (Notch 4-6 kHz)', prox_audiometria: '2026-06-01',
        mapa_ruido_actualizado: false, controles_ingenieria: 'Pendiente evaluación rediseño puesto',
        plan_accion: 'URGENTE: Rediseño puesto, evaluación cambio de función', estado: 'critico',
        observaciones: 'Audiometría de seguimiento VENCIDA. NSE IV requiere audiometría semestral.'
      },
    ],
    estadisticas: {
      total_expuestos: 18, nse_i: 3, nse_ii: 6, nse_iii: 7, nse_iv: 2,
      con_audiometria_vigente: 11, audiometrias_vencidas: 5, audiometrias_proximas_60d: 3,
      con_epa_conforme: 15, con_nihl_detectado: 4, mapa_ruido_actualizado: true,
      cumplimiento_pct: 68
    }
  },

  PLANESI: {
    id: 'PLANESI',
    nombre: 'PLANESI — Plan Nacional de Erradicación de la Silicosis',
    norma_tecnica: 'Protocolo de Vigilancia MINSAL (versión vigente 2015+)',
    base_legal: ['DS 594/1999 Art. 62-72 (Polvo)','Ley 16.744','Decreto 109/68','Circular B51/38 MINSAL'],
    objetivo: 'Eliminar la silicosis como enfermedad profesional en Chile mediante vigilancia ambiental y médica de trabajadores expuestos a sílice cristalina.',
    color: 'amber',
    icon: 'fa-lungs',
    criterios_tecnicos: {
      limite_permisible: { valor: 0.1, unidad: 'mg/m³', jornada: '8h', descripcion: 'LPP de sílice cristalina respirable (fracción cuarzo) — DS 594 Art. 66' },
      niveles_riesgo: [
        { nivel: 1, rango: '< 0.025 mg/m³ (< 25% LPP)', riesgo: 'Muy bajo', evaluacion_ambiental: 'Cada 5 años', rx_torax: 'Ingreso + cada 4 años', color: 'green' },
        { nivel: 2, rango: '0.025 – 0.05 mg/m³ (25–50% LPP)', riesgo: 'Bajo', evaluacion_ambiental: 'Cada 3 años', rx_torax: 'Ingreso + cada 3 años', color: 'lime' },
        { nivel: 3, rango: '0.05 – 0.1 mg/m³ (50–100% LPP)', riesgo: 'Moderado', evaluacion_ambiental: 'Cada 2 años', rx_torax: 'Ingreso + cada 2 años', color: 'yellow' },
        { nivel: 4, rango: '> 0.1 mg/m³ (> 100% LPP)', riesgo: 'Alto / Sobre límite', evaluacion_ambiental: 'Anual hasta controlar', rx_torax: 'Ingreso + anual', color: 'red' },
      ],
      clasificacion_oit: [
        { categoria: '0/0', descripcion: 'Sin opacidades neumoconiósicas', accion: 'Continuar vigilancia' },
        { categoria: '0/1', descripcion: 'Límite inferior de categoría 1', accion: 'Mayor seguimiento' },
        { categoria: '1/0 a 1/2', descripcion: 'Opacidades pequeñas escasas a numerosas', accion: 'Control médico cada 6 meses' },
        { categoria: '2/1 a 2/3', descripcion: 'Opacidades pequeñas numerosas a muy numerosas', accion: 'Cambio de puesto + notificación MINSAL' },
        { categoria: '3/2 a 3/+', descripcion: 'Opacidades muy numerosas con coalescencia', accion: 'Retiro inmediato + DIEP' },
        { categoria: 'A/B/C (PMF)', descripcion: 'Fibrosis Masiva Progresiva', accion: 'Retiro inmediato + DIEP + atención especializada' },
      ]
    },
    requisitos_empresa: [
      { id: 1, categoria: 'Identificación', requisito: 'Identificar todos los puestos de trabajo con exposición a sílice cristalina', periodicidad: 'Al inicio + cada cambio de proceso', obligatorio: true, norma: 'DS 594 Art. 63' },
      { id: 2, categoria: 'Evaluación Ambiental Cualitativa', requisito: 'Evaluación cualitativa inicial de exposición (lista de tareas con riesgo)', periodicidad: 'Al inicio del programa o ante cambios', obligatorio: true, norma: 'Protocolo PLANESI sección 3' },
      { id: 3, categoria: 'Evaluación Ambiental Cuantitativa', requisito: 'Muestreo ambiental de sílice por laboratorio acreditado ISP (método gravimétrico)', periodicidad: 'Según nivel de riesgo (1 a 5 años)', obligatorio: true, norma: 'DS 594 Art. 66' },
      { id: 4, categoria: 'Vigilancia de Salud', requisito: 'Examen médico ocupacional de ingreso + cuestionario de síntomas respiratorios', periodicidad: 'Antes de iniciar exposición', obligatorio: true, norma: 'Protocolo PLANESI sección 4.1' },
      { id: 5, categoria: 'Vigilancia de Salud', requisito: 'Radiografía de tórax con técnica OIT (posteroanterior)', periodicidad: 'Según nivel de riesgo (1 a 4 años). Lectura por médico certificado OIT', obligatorio: true, norma: 'Protocolo PLANESI sección 4.2' },
      { id: 6, categoria: 'Vigilancia de Salud', requisito: 'Espirometría (FVC, FEV1, relación FEV1/FVC)', periodicidad: 'Ingreso y según evolución clínica', obligatorio: true, norma: 'Protocolo PLANESI sección 4.3' },
      { id: 7, categoria: 'Control de Exposición', requisito: 'Equipos de Protección Respiratoria (EPR) certificados NIOSH cuando no hay control en la fuente', periodicidad: 'Permanente. Verificar sellado (fit test anual)', obligatorio: true, norma: 'DS 594 Art. 53' },
      { id: 8, categoria: 'Control de Exposición', requisito: 'Controles de ingeniería: ventilación local, supresión de polvo con agua, métodos húmedos', periodicidad: 'Implementar antes que EPR', obligatorio: true, norma: 'Jerarquía controles DS 594' },
      { id: 9, categoria: 'Capacitación', requisito: 'Capacitación sobre riesgos sílice, uso de EPR y reconocimiento de síntomas', periodicidad: 'Anual', obligatorio: true, norma: 'DS 594 Art. 21' },
      { id: 10, categoria: 'Notificación', requisito: 'Notificación de caso sospechoso o confirmado de silicosis a SEREMI de Salud', periodicidad: 'Inmediata ante diagnóstico', obligatorio: true, norma: 'DS 109/68' },
    ],
    evaluaciones: [
      {
        id: 1, worker_id: 3, worker_nombre: 'Jorge Martínez Pérez', rut: '9.876.543-1',
        cargo: 'Mecánico Industrial', area: 'Mantenimiento', fecha_eval: '2026-01-20',
        tipo_eval: 'Cuantitativa', concentracion_silice: 0.073, unidad: 'mg/m³',
        limite_permisible: 0.1, porcentaje_lpp: 73, nivel_riesgo: 'Nivel 3 — Moderado',
        laboratorio: 'ACHS — Lab. Higiene Industrial Acred. ISP',
        n_informe_ambiental: 'AMB-SIL-2026-001',
        rx_torax_fecha: '2026-01-20', rx_torax_resultado: 'Categoría OIT 0/0 — Sin opacidades',
        rx_torax_lector: 'Dr. Marco Valenzuela (Certificado OIT)',
        espirometria_fecha: '2026-01-20', espirometria_fvc: '98%', espirometria_fev1: '96%', espirometria_relacion: '82%', espirometria_resultado: 'Normal',
        uso_epr: true, tipo_epr: 'Respirador 3M 7502 + filtro 2097 (NIOSH P100)', fit_test: '2025-12-10', prox_fit_test: '2026-12-10',
        controles_ingenieria: 'Riego periódico en zonas de trabajo, aspiración local',
        prox_eval_ambiental: '2028-01-20', prox_rx_torax: '2028-01-20',
        estado: 'vigente', observaciones: 'Bajo control. Continuar vigilancia cada 2 años.'
      },
      {
        id: 2, worker_id: 5, worker_nombre: 'Pedro Sánchez Rojas', rut: '11.111.111-1',
        cargo: 'Soldador', area: 'Producción', fecha_eval: '2025-09-15',
        tipo_eval: 'Cuantitativa', concentracion_silice: 0.128, unidad: 'mg/m³',
        limite_permisible: 0.1, porcentaje_lpp: 128, nivel_riesgo: 'Nivel 4 — SOBRE LÍMITE PERMISIBLE',
        laboratorio: 'ISL — Lab. Higiene Industrial Acred. ISP',
        n_informe_ambiental: 'AMB-SIL-2025-015',
        rx_torax_fecha: '2025-09-15', rx_torax_resultado: 'Categoría OIT 1/0 — Opacidades pequeñas escasas',
        rx_torax_lector: 'Dra. Ana Cortés (Certificada OIT)',
        espirometria_fecha: '2025-09-15', espirometria_fvc: '85%', espirometria_fev1: '82%', espirometria_relacion: '74%', espirometria_resultado: 'Leve restricción',
        uso_epr: true, tipo_epr: 'Respirador 3M 7502 + filtro 2097 (NIOSH P100)', fit_test: '2025-08-20', prox_fit_test: '2026-08-20',
        controles_ingenieria: 'INSUFICIENTES. Ventilación general sin extracción local',
        prox_eval_ambiental: '2026-09-15', prox_rx_torax: '2026-09-15',
        estado: 'critico',
        observaciones: '⚠️ CRÍTICO: Concentración SOBRE LPP. Categoría OIT 1/0. Requiere medidas inmediatas: instalar extracción local, evaluar cambio de función. Próxima Rx en 1 año.'
      },
    ],
    estadisticas: { total_expuestos: 10, sobre_limite: 1, nivel3: 4, nivel2: 3, nivel1: 2, sin_clasificar: 0, rx_vigentes: 7, rx_vencidas: 3, casos_silicosis: 0, casos_sospechosos: 1, cumplimiento_pct: 55 }
  },

  TMERT: {
    id: 'TMERT',
    nombre: 'TMERT — Trastornos Musculoesqueléticos Relacionados con el Trabajo',
    norma_tecnica: 'Protocolo de Vigilancia Ocupacional TMERT (Actualización 2024)',
    base_legal: ['Resolución Exenta 336/2011 MINSAL','DS 594 Art. 110-120','Circular SUSESO 3849/2024'],
    objetivo: 'Identificar, evaluar e intervenir los factores de riesgo biomecánicos (repetición, postura, fuerza, recuperación) que generan TMERT de extremidades superiores.',
    color: 'emerald',
    icon: 'fa-person-walking',
    criterios_tecnicos: {
      factores_riesgo: [
        { factor: 'Repetitividad', descripcion: 'Ciclos de trabajo < 30 segundos o >50% ciclo con mismo movimiento', nivel_riesgo: 'Alta cuando ciclo < 30 seg', norma: 'LC TMERT Paso I' },
        { factor: 'Postura / Movimiento', descripcion: 'Posiciones de hombro, codo, muñeca y mano fuera del rango neutro', nivel_riesgo: 'Elevación hombro >45° o extensión muñeca >45°', norma: 'LC TMERT Paso II' },
        { factor: 'Fuerza', descripcion: 'Esfuerzo percibido en escala de Borg (0-10). Moderado >3, Alto >5', nivel_riesgo: 'Alto cuando Borg ≥5', norma: 'LC TMERT Paso III' },
        { factor: 'Tiempos de Recuperación', descripcion: 'Pausas y descansos en relación al tiempo de trabajo con carga', nivel_riesgo: 'Insuficiente cuando <10% del tiempo total', norma: 'LC TMERT Paso IV' },
      ],
      clasificacion_riesgo: [
        { nivel: 'Verde', descripcion: 'Sin riesgo o riesgo tolerable. No requiere intervención inmediata.', accion: 'Mantener condiciones. Evaluación en 2 años.', color: 'green' },
        { nivel: 'Amarillo', descripcion: 'Riesgo moderado. Hay factores que requieren atención.', accion: 'Plan de mejora a mediano plazo. Re-evaluación en 1 año.', color: 'yellow' },
        { nivel: 'Rojo', descripcion: 'Riesgo alto. Factores de riesgo presentes en forma importante.', accion: 'Intervención ergonómica prioritaria. Re-evaluación en 6 meses.', color: 'red' },
      ],
      metodologias_avanzadas: ['OCRA', 'RULA', 'REBA', 'Strain Index', 'Ecuación NIOSH'],
    },
    requisitos_empresa: [
      { id: 1, categoria: 'Identificación Inicial', requisito: 'Aplicar Lista de Chequeo TMERT a todos los puestos de trabajo con uso intenso de EESS', periodicidad: 'Al inicio del programa y cuando hay cambios de proceso/maquinaria', obligatorio: true, norma: 'Protocolo TMERT sección 3' },
      { id: 2, categoria: 'Evaluación', requisito: 'Aplicar LC TMERT (Pasos I-IV: repetitividad, postura, fuerza, recuperación) para clasificar en verde/amarillo/rojo', periodicidad: 'Puestos identificados con riesgo. Anual para puestos en rojo', obligatorio: true, norma: 'Resolución 336/2011' },
      { id: 3, categoria: 'Intervención', requisito: 'Elaborar e implementar Plan de Intervención Ergonómica para puestos en riesgo amarillo/rojo', periodicidad: 'Puestos amarillo: 90 días. Puestos rojo: 30 días', obligatorio: true, norma: 'Protocolo TMERT sección 6' },
      { id: 4, categoria: 'Vigilancia de Salud', requisito: 'Examen musculoesquelético de extremidades superiores (EESS) a trabajadores en riesgo', periodicidad: 'Puestos rojo: cada 6 meses. Puestos amarillo: anual', obligatorio: true, norma: 'Circular SUSESO 3849/2024' },
      { id: 5, categoria: 'Pausas Activas', requisito: 'Implementar programa de pausas activas (mínimo 10 min en jornada de 8h)', periodicidad: 'Diaria, registro semanal de adherencia', obligatorio: true, norma: 'Protocolo TMERT sección 5.3' },
      { id: 6, categoria: 'Capacitación', requisito: 'Capacitación a trabajadores sobre TME, posturas correctas y pausas activas', periodicidad: 'Anual + inducción a nuevos expuestos', obligatorio: true, norma: 'DS 594 Art. 21' },
      { id: 7, categoria: 'Documentación', requisito: 'Registrar todas las evaluaciones LC TMERT y evidencia fotográfica de puestos', periodicidad: 'Mantener histórico de 5 años', obligatorio: true, norma: 'Protocolo TMERT sección 7' },
    ],
    evaluaciones: [
      {
        id: 1, worker_id: 1, worker_nombre: 'Carlos González Muñoz', rut: '12.345.678-9',
        puesto: 'Operador Línea 1', area: 'Producción', fecha_eval: '2026-02-20',
        evaluador: 'Claudia Torres S. — Prevencionista', metodologia: 'LC TMERT + OCRA',
        paso1_ciclo: '< 30 seg', paso1_result: 'ROJO',
        paso2_postura_hombro: '> 45°', paso2_postura_muneca: 'Desviación cubital > 20°', paso2_result: 'ROJO',
        paso3_fuerza_borg: '5', paso3_result: 'ROJO',
        paso4_recuperacion: '8% del tiempo', paso4_result: 'ROJO',
        clasificacion_final: 'ROJO — Alto Riesgo',
        indice_ocra: 3.8, interpretacion_ocra: 'Riesgo Alto (OCRA > 3.5)',
        examen_msk_fecha: '2026-02-20', examen_msk_resultado: 'Tendinitis supraespinoso hombro derecho (sospecha)',
        plan_intervencion: true, fecha_plan: '2026-02-25',
        acciones_plan: ['Rediseño de altura de línea (ajustable 90-120cm)', 'Rotación de tareas cada 2h', 'Pausas activas 10 min x 2 al día', 'Derivación médico ocupacional'],
        prox_evaluacion: '2026-08-20',
        pausas_activas_adherencia: 85,
        estado: 'activo',
        observaciones: 'Trabajador con tendinitis sospechosa. Derivado a médico ocupacional el 25/02/2026.'
      },
      {
        id: 2, worker_id: 8, worker_nombre: 'Valeria Herrera Díaz', rut: '17.890.123-4',
        puesto: 'Operadora Bodega', area: 'Logística', fecha_eval: '2026-01-25',
        evaluador: 'Claudia Torres S. — Prevencionista', metodologia: 'LC TMERT',
        paso1_ciclo: '30-60 seg', paso1_result: 'AMARILLO',
        paso2_postura_hombro: 'Neutro', paso2_postura_muneca: 'Extensión 30°', paso2_result: 'AMARILLO',
        paso3_fuerza_borg: '4', paso3_result: 'AMARILLO',
        paso4_recuperacion: '15% del tiempo', paso4_result: 'VERDE',
        clasificacion_final: 'AMARILLO — Riesgo Moderado',
        indice_ocra: null, interpretacion_ocra: null,
        examen_msk_fecha: '2026-01-25', examen_msk_resultado: 'Sin hallazgos patológicos',
        plan_intervencion: true, fecha_plan: '2026-02-10',
        acciones_plan: ['Herramientas con mejor agarre ergonómico', 'Reorganización de altura de estantes', 'Pausas activas 10 min x 1 al día'],
        prox_evaluacion: '2027-01-25',
        pausas_activas_adherencia: 72,
        estado: 'activo',
        observaciones: 'Riesgo moderado bajo control. Re-evaluación en 1 año.'
      },
    ],
    estadisticas: { total_evaluados: 22, riesgo_rojo: 5, riesgo_amarillo: 11, riesgo_verde: 6, con_plan_intervencion: 16, examen_msk_vigente: 15, cumplimiento_pct: 74 }
  },

  PSICOSOCIAL: {
    id: 'PSICOSOCIAL',
    nombre: 'Riesgos Psicosociales — CEAL-SM / SUSESO',
    norma_tecnica: 'Protocolo de Vigilancia de Riesgos Psicosociales (vigente desde 01/01/2023)',
    base_legal: ['Resolución Exenta 1433/2017 MINSAL','Ley 21.012 (Garantías Laborales)','Circular SUSESO 3432/2023','Ley 21.645 (Acoso Laboral)'],
    objetivo: 'Evaluar los factores psicosociales del trabajo mediante el Cuestionario CEAL-SM/SUSESO (vigente desde enero 2023, reemplaza al ISTAS21), para implementar planes de intervención.',
    color: 'violet',
    icon: 'fa-brain',
    criterios_tecnicos: {
      instrumento_vigente: 'CEAL-SM/SUSESO (desde 01/01/2023)',
      instrumento_anterior: 'SUSESO/ISTAS21 (reemplazado)',
      periodicidad: 'Cada 2 años por centro de trabajo',
      participacion_minima: '60% del universo de trabajadores para ser representativo',
      dimensiones_12: [
        { num: 1, dimension: 'Carga de trabajo', descripcion: 'Cantidad y complejidad de las tareas asignadas', riesgo_alto_cuando: 'Exceso de tareas, plazos imposibles, sobretiempo frecuente' },
        { num: 2, dimension: 'Exigencias emocionales', descripcion: 'Demandas afectivas del trabajo (atención a público, situaciones difíciles)', riesgo_alto_cuando: 'Trabajo con clientes difíciles, sufrimiento, violencia laboral' },
        { num: 3, dimension: 'Desarrollo profesional', descripcion: 'Posibilidades de aprender, desarrollarse y aplicar habilidades', riesgo_alto_cuando: 'Trabajo monótono, sin desafíos, sin capacitación' },
        { num: 4, dimension: 'Reconocimiento y claridad del rol', descripcion: 'Claridad sobre funciones, responsabilidades y valoración del trabajo', riesgo_alto_cuando: 'Funciones ambiguas, falta de retroalimentación' },
        { num: 5, dimension: 'Conflicto de rol', descripcion: 'Contradicción entre demandas del trabajo', riesgo_alto_cuando: 'Órdenes contradictorias, conflicto ético con el trabajo' },
        { num: 6, dimension: 'Calidad del liderazgo', descripcion: 'Forma en que los supervisores gestionan a sus equipos', riesgo_alto_cuando: 'Jefatura autoritaria, falta de apoyo, maltrato' },
        { num: 7, dimension: 'Compañerismo', descripcion: 'Relaciones entre pares, trabajo en equipo, solidaridad', riesgo_alto_cuando: 'Conflictos frecuentes, competencia desleal, aislamiento' },
        { num: 8, dimension: 'Inseguridad sobre condiciones de trabajo', descripcion: 'Estabilidad del empleo, cambios en condiciones laborales', riesgo_alto_cuando: 'Contratos precarios, amenaza de despido, reorganizaciones' },
        { num: 9, dimension: 'Doble presencia', descripcion: 'Conflicto entre responsabilidades laborales y domésticas/familiares', riesgo_alto_cuando: 'Jornadas extensas que impiden atender familia' },
        { num: 10, dimension: 'Vulnerabilidad', descripcion: 'Condiciones de vulnerabilidad social, discriminación, inequidad', riesgo_alto_cuando: 'Discriminación por género, edad, migración' },
        { num: 11, dimension: 'Salud mental', descripcion: 'Estado de bienestar psicológico general', riesgo_alto_cuando: 'Síntomas de estrés, ansiedad, burnout' },
        { num: 12, dimension: 'Violencia y acoso', descripcion: 'Situaciones de violencia, acoso laboral o sexual (Ley 21.645)', riesgo_alto_cuando: 'Reportes de acoso, violencia laboral o sexual' },
      ],
      niveles_riesgo: [
        { nivel: 'Bajo', descripcion: 'Sin riesgo significativo', accion: 'Mantener condiciones. Monitoreo en próxima medición.' },
        { nivel: 'Medio', descripcion: 'Riesgo moderado', accion: 'Plan de intervención a mediano plazo (6-12 meses). Comité Paritario.' },
        { nivel: 'Alto', descripcion: 'Riesgo significativo para la salud mental', accion: 'Plan de intervención inmediato (30-60 días). Notificación organismo administrador.' },
      ]
    },
    requisitos_empresa: [
      { id: 1, categoria: 'Aplicación Instrumento', requisito: 'Aplicar Cuestionario CEAL-SM/SUSESO a todos los trabajadores del centro de trabajo', periodicidad: 'Cada 2 años', obligatorio: true, norma: 'Circular SUSESO 3432/2023' },
      { id: 2, categoria: 'Difusión y Participación', requisito: 'Informar a trabajadores sobre el proceso, propósito y confidencialidad. Garantizar participación ≥60%', periodicidad: 'Previo a cada medición', obligatorio: true, norma: 'Protocolo CEAL-SM sección 3' },
      { id: 3, categoria: 'Análisis de Resultados', requisito: 'Análisis de resultados por dimensión y área de trabajo. Identificar grupos de riesgo alto', periodicidad: 'Posterior a cada medición', obligatorio: true, norma: 'Protocolo CEAL-SM sección 5' },
      { id: 4, categoria: 'Plan de Intervención', requisito: 'Elaborar Plan de Intervención para dimensiones en riesgo alto o medio', periodicidad: '30 días tras resultados. Actualización anual de cumplimiento', obligatorio: true, norma: 'Protocolo CEAL-SM sección 6' },
      { id: 5, categoria: 'Comité Paritario', requisito: 'Presentar resultados al Comité Paritario (CPHS) y Dirección. Acta de reunión obligatoria', periodicidad: 'Posterior a cada medición', obligatorio: true, norma: 'DS 54/1969 Art. 24' },
      { id: 6, categoria: 'Seguimiento', requisito: 'Seguimiento semestral del avance del Plan de Intervención', periodicidad: 'Semestral', obligatorio: true, norma: 'Protocolo CEAL-SM sección 7' },
      { id: 7, categoria: 'Canal de Denuncia', requisito: 'Mantener canal de denuncia de acoso laboral/sexual accesible y confidencial (Ley 21.645)', periodicidad: 'Permanente', obligatorio: true, norma: 'Ley 21.645 Art. 2' },
      { id: 8, categoria: 'Capacitación', requisito: 'Capacitar a jefaturas en gestión de riesgos psicosociales y prevención de acoso', periodicidad: 'Anual', obligatorio: true, norma: 'Protocolo CEAL-SM sección 8' },
    ],
    evaluaciones: [
      {
        id: 1, centro_trabajo: 'Empresa Ejemplo S.A. — Sede Principal',
        fecha_aplicacion: '2024-08-20', fecha_resultados: '2024-09-15',
        instrumento: 'CEAL-SM/SUSESO', version: '1.0 (2023)',
        universo_trabajadores: 145, participantes: 127, tasa_participacion: 87.6,
        responsable: 'Claudia Torres S. + IST',
        resultados_dimensiones: [
          { dimension: 'Carga de trabajo', resultado: 'Alto', puntaje: 72, afectados_pct: 45 },
          { dimension: 'Exigencias emocionales', resultado: 'Medio', puntaje: 54, afectados_pct: 32 },
          { dimension: 'Desarrollo profesional', resultado: 'Medio', puntaje: 51, afectados_pct: 28 },
          { dimension: 'Reconocimiento y claridad del rol', resultado: 'Alto', puntaje: 68, afectados_pct: 41 },
          { dimension: 'Conflicto de rol', resultado: 'Bajo', puntaje: 35, afectados_pct: 18 },
          { dimension: 'Calidad del liderazgo', resultado: 'Alto', puntaje: 74, afectados_pct: 48 },
          { dimension: 'Compañerismo', resultado: 'Bajo', puntaje: 28, afectados_pct: 12 },
          { dimension: 'Inseguridad condiciones trabajo', resultado: 'Medio', puntaje: 55, afectados_pct: 35 },
          { dimension: 'Doble presencia', resultado: 'Medio', puntaje: 50, afectados_pct: 30 },
          { dimension: 'Vulnerabilidad', resultado: 'Bajo', puntaje: 22, afectados_pct: 10 },
          { dimension: 'Salud mental', resultado: 'Alto', puntaje: 70, afectados_pct: 42 },
          { dimension: 'Violencia y acoso', resultado: 'Bajo', puntaje: 18, afectados_pct: 8 },
        ],
        dimensiones_alto_riesgo: ['Carga de trabajo','Reconocimiento y claridad del rol','Calidad del liderazgo','Salud mental'],
        plan_intervencion_estado: 'En ejecución (60% avance)',
        acta_cphs_fecha: '2024-10-01',
        prox_medicion: '2026-08-20',
        estado: 'activo'
      }
    ],
    estadisticas: { ultima_medicion: '2024-08-20', proxima_medicion: '2026-08-20', participacion: 87.6, dimensiones_alto: 4, dimensiones_medio: 4, dimensiones_bajo: 4, plan_intervencion: 'En ejecución', cumplimiento_pct: 82 }
  },

  UV: {
    id: 'UV',
    nombre: 'Radiación UV de Origen Solar',
    norma_tecnica: 'Protocolo de Exposición Ocupacional a Radiación UV (MINSAL)',
    base_legal: ['Ley 20.096 Art. 19','DS 594 Art. 103-114 (Radiaciones)','Circular B51/22 MINSAL','Resolución 336/2011'],
    objetivo: 'Proteger a los trabajadores que realizan actividades al aire libre de los efectos nocivos de la radiación UV solar (quemaduras, melanoma, fotoqueratitis).',
    color: 'orange',
    icon: 'fa-sun',
    criterios_tecnicos: {
      indices_uv: [
        { iuv: '1-2', clasificacion: 'Bajo', riesgo: 'Bajo', medidas: ['No se requieren medidas especiales'], color: 'green' },
        { iuv: '3-5', clasificacion: 'Moderado', riesgo: 'Moderado', medidas: ['FPS 30+ en zonas expuestas', 'Sombrero de ala ancha', 'Gafas UV'], color: 'yellow' },
        { iuv: '6-7', clasificacion: 'Alto', riesgo: 'Alto', medidas: ['FPS 50+ obligatorio', 'Ropa manga larga', 'Legionario', 'Gafas UV', 'Evitar exposición 11-16h'], color: 'orange' },
        { iuv: '8-10', clasificacion: 'Muy Alto', riesgo: 'Muy alto', medidas: ['FPS 50+ obligatorio', 'Ropa manga larga', 'Legionario', 'Gafas UV', 'Restricción horaria 11-16h salvo necesidad justificada'], color: 'red' },
        { iuv: '≥11', clasificacion: 'Extremo', riesgo: 'Extremo', medidas: ['FPS 50+ obligatorio', 'Ropa manga larga', 'Legionario', 'Gafas UV', 'Restricción estricta 11-16h', 'Sombrilla/toldo obligatorio'], color: 'purple' },
      ],
      epp_obligatorio: [
        { epp: 'Protector solar FPS 50+ (resistente al agua)', aplicacion: 'Antes de salir + cada 2 horas', cuando: 'IUV ≥6', norma: 'Ley 20.096' },
        { epp: 'Gorro/sombrero legionario (protege cuello y orejas)', cuando: 'IUV ≥3', norma: 'Circular B51/22' },
        { epp: 'Ropa manga larga (tela con UPF ≥40)', cuando: 'IUV ≥6', norma: 'Circular B51/22' },
        { epp: 'Lentes de sol (protección UV 400)', cuando: 'IUV ≥3', norma: 'Circular B51/22' },
      ],
      medidas_colectivas: [
        'Instalación de mallas de sombra o toldos en zonas de trabajo fijo al aire libre',
        'Reorganización de tareas para evitar exposición en horario crítico (11:00-16:00)',
        'Rotación de trabajadores para reducir tiempo de exposición acumulada',
        'Habilitar zonas de sombra para pausas y colaciones',
      ],
      fuente_indice_uv: 'Meteo-Chile / DMC (Dirección Meteorológica de Chile) — Regional',
    },
    requisitos_empresa: [
      { id: 1, categoria: 'Identificación', requisito: 'Identificar trabajadores con exposición solar directa ≥1 hora diaria (especialmente meses oct-mar en zona central)', periodicidad: 'Anual + cambios de puesto', obligatorio: true, norma: 'Ley 20.096 Art. 19' },
      { id: 2, categoria: 'Información', requisito: 'Comunicar diariamente el Índice UV a trabajadores expuestos (pizarra, app, correo)', periodicidad: 'Diaria (días laborales oct-mar)', obligatorio: true, norma: 'Ley 20.096 Art. 19' },
      { id: 3, categoria: 'EPP', requisito: 'Proveer y controlar entrega de protector solar FPS50+, legionario y ropa manga larga', periodicidad: 'Temporada UV (oct-abr). Reposición según consumo', obligatorio: true, norma: 'Ley 20.096 + DS 594 Art. 53' },
      { id: 4, categoria: 'Control Técnico', requisito: 'Instalar estructuras de sombra en puestos fijos de trabajo al aire libre', periodicidad: 'Permanente durante temporada UV', obligatorio: true, norma: 'DS 594 Art. 109' },
      { id: 5, categoria: 'Vigilancia de Salud', requisito: 'Examen dermatológico para trabajadores con exposición intensa (>10 años)', periodicidad: 'Cada 2 años para trabajadores con larga exposición', obligatorio: true, norma: 'Protocolo UV MINSAL' },
      { id: 6, categoria: 'Capacitación', requisito: 'Capacitación sobre riesgos UV, uso de EPP fotoproteción y reconocimiento de lesiones cutáneas', periodicidad: 'Anual (antes de cada temporada UV — septiembre)', obligatorio: true, norma: 'DS 594 Art. 21' },
      { id: 7, categoria: 'Restricción Horaria', requisito: 'Política de restricción de trabajo en horario 11:00-16:00 cuando IUV ≥8', periodicidad: 'Temporada UV (oct-abr)', obligatorio: true, norma: 'Ley 20.096' },
    ],
    registros_iuv: [
      { fecha: '2026-03-17', region: 'Metropolitana', iuv: 8, clasificacion: 'Muy Alto', medidas_aplicadas: ['FPS50+ entregado', 'Legionario', 'Restricción 12-15h'], trabajadores_expuestos: 18 },
      { fecha: '2026-03-10', region: 'Metropolitana', iuv: 10, clasificacion: 'Muy Alto', medidas_aplicadas: ['FPS50+ entregado', 'Legionario', 'Restricción 11-16h', 'Toldo instalado'], trabajadores_expuestos: 18 },
      { fecha: '2026-02-20', region: 'Metropolitana', iuv: 11, clasificacion: 'Extremo', medidas_aplicadas: ['Todas las medidas aplicadas', 'Restricción estricta 11-16h'], trabajadores_expuestos: 18 },
    ],
    estadisticas: { trabajadores_expuestos: 18, con_epp_vigente: 15, con_epp_pendiente: 3, capacitacion_vigente: true, iuv_hoy: 8, clasificacion_hoy: 'Muy Alto', cumplimiento_pct: 88 }
  },

  MMC: {
    id: 'MMC',
    nombre: 'Manejo Manual de Cargas — Ley 20.949',
    norma_tecnica: 'Guía Técnica MINTRAB — Evaluación y Control de Riesgos MMC',
    base_legal: ['Ley 20.949 (17/09/2017)','Código del Trabajo Art. 211-F al 211-J','DS 63/2005 (Ley 20.001)','Guía Técnica MINTRAB 2015'],
    objetivo: 'Prevenir lesiones musculoesqueléticas de columna y extremidades asociadas al levantamiento, descenso, transporte y empuje/jale de cargas.',
    color: 'rose',
    icon: 'fa-box',
    criterios_tecnicos: {
      limites_legales: [
        { grupo: 'Hombres adultos (≥18 años)', limite_kg: 25, norma: 'Ley 20.949' },
        { grupo: 'Mujeres adultas (≥18 años)', limite_kg: 20, norma: 'Ley 20.949 + Ley 20.001' },
        { grupo: 'Trabajadores jóvenes (< 18 años)', limite_kg: 20, norma: 'Ley 20.949 + CT Art. 14' },
        { grupo: 'Trabajadores embarazadas', limite_kg: 0, norma: 'CT Art. 202 — Prohibición absoluta', nota: 'Trabajo en posición erguida + prohibición levantamiento' },
      ],
      metodologia_niosh: {
        nombre: 'Ecuación Revisada de NIOSH (1994)',
        peso_limite_recomendado: 23,
        variables: ['LC (Constante de carga)', 'HM (Factor horizontal)', 'VM (Factor vertical)', 'DM (Factor distancia)', 'AM (Factor asimetría)', 'FM (Factor frecuencia)', 'CM (Factor agarre)'],
        indicadores: [
          { indicador: 'LPR', descripcion: 'Límite de Peso Recomendado = 23 × HM × VM × DM × AM × FM × CM', interpretation: 'Peso máximo seguro para ese levantamiento específico' },
          { indicador: 'IL', descripcion: 'Índice de Levantamiento = Peso real / LPR', interpretation: 'IL <1: Bajo riesgo | IL 1-3: Riesgo moderado | IL >3: Alto riesgo' },
        ]
      },
      metodologia_MAC: {
        nombre: 'Método MAC (Manual Handling Assessment Charts — HSE)',
        uso: 'Evaluación rápida de tareas de levantamiento, empuje y jale',
      }
    },
    requisitos_empresa: [
      { id: 1, categoria: 'Identificación', requisito: 'Identificar todas las tareas con manejo manual de cargas > 3 kg frecuente o > límite legal esporádico', periodicidad: 'Al inicio + cambios de proceso', obligatorio: true, norma: 'Ley 20.949 Art. 211-F' },
      { id: 2, categoria: 'Evaluación', requisito: 'Evaluar riesgo mediante Ecuación NIOSH o método validado (Índice de Levantamiento)', periodicidad: 'Puestos identificados. Re-eval ante cambios', obligatorio: true, norma: 'Guía Técnica MINTRAB' },
      { id: 3, categoria: 'Control', requisito: 'Implementar medidas de control: ayudas mecánicas, reorganización, rediseño de tareas', periodicidad: 'Cuando IL > 1 o peso supera límites legales', obligatorio: true, norma: 'Ley 20.949 Art. 211-H' },
      { id: 4, categoria: 'Protección Especial', requisito: 'No asignar tareas de MMC > 20 kg a mujeres y jóvenes. Prohibición absoluta para embarazadas', periodicidad: 'Permanente — verificar en asignación de tareas', obligatorio: true, norma: 'Ley 20.949 Art. 211-J' },
      { id: 5, categoria: 'Capacitación', requisito: 'Capacitar en técnicas correctas de levantamiento y uso de ayudas mecánicas', periodicidad: 'Anual + inducción', obligatorio: true, norma: 'DS 594 Art. 21' },
      { id: 6, categoria: 'Vigilancia de Salud', requisito: 'Examen musculoesquelético de columna y extremidades inferiores para trabajadores expuestos', periodicidad: 'Anual para tareas con IL > 2', obligatorio: true, norma: 'Guía Técnica MINTRAB' },
    ],
    evaluaciones: [
      {
        id: 1, worker_id: 8, worker_nombre: 'Valeria Herrera Díaz', rut: '17.890.123-4',
        puesto: 'Operadora Bodega', area: 'Logística', fecha_eval: '2026-01-20',
        tarea: 'Levantamiento y traslado de cajas desde pallets', metodologia: 'Ecuación NIOSH',
        peso_real_kg: 18, altura_origen_cm: 20, altura_destino_cm: 90,
        distancia_horizontal_cm: 35, frecuencia_por_hora: 25, agarre: 'Regular',
        lpr_calculado: 14.2, indice_levantamiento: 1.27, clasificacion_il: 'Riesgo Moderado',
        limite_legal_aplicable: 20, cumple_limite_legal: true,
        medidas_correctivas: ['Plataforma elevadora de pallets', 'Máximo 2 cajas por jale', 'Rotación con otra tarea cada 45 min'],
        implementadas: false, plazo_implementacion: '2026-03-31',
        estado: 'activo', observaciones: 'IL > 1.0. Implementar medidas antes del 31/03/2026.'
      },
    ],
    estadisticas: { total_evaluados: 15, il_alto: 2, il_moderado: 5, il_bajo: 8, sobre_limite_legal: 0, con_ayuda_mecanica: 8, cumplimiento_pct: 70 }
  },


  // ── HIC — Hipobaria Intermitente Crónica ──────────────────────────────
  HIC: {
    id: 'HIC',
    nombre: 'Hipobaria Intermitente Crónica — Gran Altitud',
    norma_tecnica: 'Guía Técnica MINSAL 2013 · DS 594 · Circ. SUSESO 3838/2024',
    base_legal: ['Guía Técnica Protocolo HIC MINSAL 2013','DS 594 (Condiciones Sanitarias y Ambientales)','Circ. SUSESO N°3838/2024','DS 44/2025 Art. 15 (IRL)','Ley 16.744'],
    objetivo: 'Vigilar la salud de trabajadores expuestos a hipobaria intermitente crónica (altitud ≥ 3.000 msnm) en régimen de turno, previniendo daños cardiovasculares, neurológicos y hematológicos por hipoxia crónica.',
    color: 'sky',
    icon: 'fa-mountain',
    criterios_tecnicos: {
      grupos_riesgo: [
        { grupo: 'Exposición directa', ocupaciones: ['Mineros faena de altura', 'Operadores de maquinaria en altura', 'Personal de mantenimiento en altura', 'Supervisores en faena'], altitud_msnm: '≥ 3.000 msnm', regimen: 'Turno rotativo con retorno nivel del mar' },
        { grupo: 'Exposición prolongada', ocupaciones: ['Trabajadores en faena continua ≥ 14 días'], altitud_msnm: '≥ 3.500 msnm', regimen: 'Turnos extendidos' },
      ],
      factores_agravantes: ['Altitud ≥ 4.000 msnm (mayor riesgo)','Tabaquismo activo','Enfermedad cardiovascular preexistente','Apnea del sueño no tratada','Anemia o poliglobulia basal','Hipertensión arterial no controlada'],
      evaluaciones_requeridas: [
        { evaluacion: 'Examen médico preempleo', descripcion: 'Evaluación de aptitud para trabajo en altura: anamnesis, examen físico, PA, ECG, oximetría', periodicidad: 'Preempleo obligatorio' },
        { evaluacion: 'Hemograma + hematocrito', descripcion: 'Control poliglobulia: hombres ≤ 21%, mujeres ≤ 19%. Hemoglobina, glóbulos rojos', periodicidad: 'Anual o semestral si alterado' },
        { evaluacion: 'Oximetría de pulso en altura', descripcion: 'SpO₂ basal y durante la jornada en faena de altura', periodicidad: 'Preempleo + periódica en altura' },
        { evaluacion: 'ECG de reposo', descripcion: 'Electrocardiograma para detección arritmias y HTP', periodicidad: 'Anual' },
        { evaluacion: 'Evaluación apnea del sueño', descripcion: 'Polisomnografía o poligrafía respiratoria si hay sospecha clínica', periodicidad: 'Ante sospecha o síntomas referidos' },
      ]
    },
    requisitos_empresa: [
      { id: 1, categoria: 'Identificación', requisito: 'Identificar puestos expuestos a altitud ≥ 3.000 msnm y elaborar nómina de expuestos', periodicidad: 'Al inicio + cambios de puesto', obligatorio: true, norma: 'Guía Técnica MINSAL 2013' },
      { id: 2, categoria: 'Evaluación Médica', requisito: 'Examen médico preempleo de aptitud para trabajo en altura (OAL)', periodicidad: 'Preempleo obligatorio', obligatorio: true, norma: 'Guía Técnica MINSAL 2013 Cap.4' },
      { id: 3, categoria: 'Control Hematológico', requisito: 'Control de hematocrito: hombres ≤ 21%, mujeres ≤ 19% (poliglobulia). Hemograma anual', periodicidad: 'Anual (semestral si alterado)', obligatorio: true, norma: 'Guía Técnica MINSAL 2013 Cap.4' },
      { id: 4, categoria: 'Turnos y Recuperación', requisito: 'Implementar régimen de turnos con tiempo suficiente de recuperación a nivel del mar', periodicidad: 'Verificación mensual', obligatorio: true, norma: 'Guía Técnica MINSAL 2013 Cap.3' },
      { id: 5, categoria: 'Oxígeno Suplementario', requisito: 'Disponibilidad de oxígeno de emergencia en faena de altura ≥ 4.000 msnm', periodicidad: 'Verificación periódica', obligatorio: true, norma: 'DS 594 Art.23' },
      { id: 6, categoria: 'IRL', requisito: 'Entrega de IRL (Informe de Riesgos Laborales) a cada trabajador expuesto — reemplaza ODI', periodicidad: 'Ingreso + cambio de puesto', obligatorio: true, norma: 'DS 44 Art. 15' },
    ],
    evaluaciones: [
      {
        id: 1, worker_id: 1, worker_nombre: 'Carlos Rodríguez Soto', rut: '14.567.890-1',
        cargo: 'Minero de Interior', area: 'Producción', fecha_eval: '2026-01-20',
        altitud_faena_msnm: 3800, regimen_turno: '7x7',
        hematocrito_pct: 18.5, hemoglobina_gdl: 16.2, oximetria_spo2: 92,
        ecg_resultado: 'Normal. Sin signos de HTP.',
        apnea_sueno_evaluada: false, apnea_sueno_resultado: 'No evaluada',
        presion_arterial: '122/78', frecuencia_cardiaca: 72,
        prox_evaluacion: '2027-01-20',
        estado: 'vigente', observaciones: 'Hematocrito dentro de rango. Sin contraindicación para trabajo en altura. Continuar vigilancia anual.'
      },
    ],
    estadisticas: { total_vigilados: 12, con_poliglobulia: 1, apnea_detectada: 0, con_restriccion: 0, evaluacion_vigente: 11, cumplimiento_pct: 60 }
  },

  // ── HUMOS — Metales, Metaloides y Humos de Soldadura ─────────────────
  HUMOS: {
    id: 'HUMOS',
    nombre: 'Metales, Metaloides y Humos de Soldadura',
    norma_tecnica: 'Res. Exenta N°606/2023 MINSAL · Nota Técnica 87 ISPCH · Circ. SUSESO 3838/2024',
    base_legal: ['Res. Exenta N°606 jun-2023 MINSAL (Protocolo Vigilancia Metales)','Circ. SUSESO N°3838/2024 (Metales Cancerígenos)','DS 594 Art. 59-65 (Agentes Químicos)','NCh 3358 (Estrategia muestreo ambiental)','DS 44/2025 Art. 15 (IRL)','Ley 16.744'],
    objetivo: 'Vigilar la salud de trabajadores expuestos a metales, metaloides y humos de soldadura (Fe, Mn, Cr+6, Ni, Pb, Cd, As, Cu, Zn), previniendo enfermedades profesionales como fiebre por humos, silicosis metálica, cáncer pulmonar y neurotoxicidad.',
    color: 'amber',
    icon: 'fa-smog',
    criterios_tecnicos: {
      grupos_riesgo: [
        { grupo: 'Soldadores y fundidores', ocupaciones: ['Soldadores por arco', 'Soldadores MIG/TIG/MAG', 'Fundidores', 'Cortadores plasma/oxicorte'], metales_principales: ['Fe','Mn','Cr+6','Ni','Cu'], riesgo: 'Alto' },
        { grupo: 'Expuestos a cancerígenos', ocupaciones: ['Trabajadores con Cr+6 (cromado)', 'Trabajadores con Cd', 'Trabajadores con As/arsénico'], metales_principales: ['Cr+6','Cd','As'], riesgo: 'Muy Alto — Cancerígenos Grupo 1 IARC' },
        { grupo: 'Expuestos a neurotóxicos', ocupaciones: ['Baterías/fundición Pb', 'Plantas de Mn', 'Metalurgia'], metales_principales: ['Pb','Mn'], riesgo: 'Alto — Neurotoxicidad' },
      ],
      factores_agravantes: ['Ventilación deficiente en área de soldadura','Ausencia o mal uso de EPR (respirador)','Exposición simultánea a múltiples metales','Tabaquismo (potencia riesgo cancerígeno)','Jornadas prolongadas o horas extras','Temperatura ambiente elevada (mayor evaporación metales)'],
      evaluaciones_requeridas: [
        { evaluacion: 'Examen médico preempleo y periódico', descripcion: 'Anamnesis ocupacional, examen físico, función pulmonar (espirometría)', periodicidad: 'Preempleo + anual' },
        { evaluacion: 'Monitoreo biológico', descripcion: 'Plombemia (Pb), creatinina+Cd urinario (Cd), arsénico inorgánico urinario (As)', periodicidad: 'Anual (o semestral para cancerígenos)' },
        { evaluacion: 'Espirometría', descripcion: 'Evaluación función pulmonar: CVF, VEF1, VEF1/CVF', periodicidad: 'Preempleo + anual' },
        { evaluacion: 'Radiografía de tórax OIT', descripcion: 'Clasificación neumoconiosis según OIT para GES con polvo metálico o fibrogénico', periodicidad: 'Cada 2 años (normal) / anual (alterado)' },
        { evaluacion: 'Muestreo ambiental cuantitativo', descripcion: 'Fracción inhalable y/o respirable de metales en jornada laboral. Lab. acreditado SEREMI', periodicidad: 'Anual o ante cambio proceso' },
      ]
    },
    requisitos_empresa: [
      { id: 1, categoria: 'Inventario', requisito: 'Inventario de metales y metaloides presentes (Fe, Mn, Cr, Ni, Pb, Cd, As, Cu, Zn) con fichas SDS', periodicidad: 'Al inicio + actualización anual', obligatorio: true, norma: 'DS 594 Art. 59' },
      { id: 2, categoria: 'GES', requisito: 'Identificación de Grupos de Exposición Similar (GES) por puesto de trabajo', periodicidad: 'Al inicio + cambios proceso', obligatorio: true, norma: 'Res. Exenta N°606/2023 Cap.3' },
      { id: 3, categoria: 'Evaluación Ambiental', requisito: 'Muestreo ambiental cuantitativo de metales (fracción inhalable/respirable) por laboratorio acreditado', periodicidad: 'Anual o ante cambio de proceso', obligatorio: true, norma: 'DS 594 Art. 61 · NCh 3358' },
      { id: 4, categoria: 'Cancerígenos', requisito: 'GES con Cr+6, As o Cd: aplicar protocolo especial cancerígenos (Circ. SUSESO 3838/2024)', periodicidad: 'Según protocolo específico', obligatorio: true, norma: 'Circ. SUSESO 3838/2024' },
      { id: 5, categoria: 'Ventilación', requisito: 'Ventilación local exhaustora (VLE) en zonas de soldadura y fundición', periodicidad: 'Verificación semestral', obligatorio: true, norma: 'DS 594 Art. 63' },
      { id: 6, categoria: 'EPR', requisito: 'Programa de Protección Respiratoria: selección, entrega, prueba ajuste, mantención de EPR', periodicidad: 'Continuo + verificación semestral', obligatorio: true, norma: 'DS 594 Art. 64' },
      { id: 7, categoria: 'IRL', requisito: 'Entrega de IRL (Informe de Riesgos Laborales) por puesto — reemplaza ODI', periodicidad: 'Ingreso + cambio de puesto', obligatorio: true, norma: 'DS 44 Art. 15' },
    ],
    evaluaciones: [
      {
        id: 1, worker_id: 2, worker_nombre: 'Miguel Ángel Torres Díaz', rut: '15.678.901-2',
        cargo: 'Soldador de Producción', area: 'Producción', fecha_eval: '2026-02-10',
        metales_exposicion: ['Fe','Mn','Cr+6'],
        muestreo_ambiental_fecha: '2026-01-15',
        resultado_fe_mgm3: 2.1, resultado_mn_mgm3: 0.08, resultado_cr6_mgm3: 0.003,
        limite_fe_ds594: 5.0, limite_mn_ds594: 0.2, limite_cr6_ds594: 0.05,
        espirometria_fecha: '2026-02-10', espirometria_resultado: 'Normal. CVF 98% teórico. VEF1/CVF 82%.',
        rx_torax_fecha: '2025-08-20', rx_torax_resultado: 'Sin hallazgos patológicos. Clasificación OIT 0/0.',
        plombemia_ugl: null, creatinina_mgdl: null, arsenico_urinario_ugL: null,
        ventilacion_vle: true, epr_entregado: true, epr_prueba_ajuste: true,
        prox_evaluacion: '2027-02-10',
        estado: 'vigente', observaciones: 'Cr+6 por debajo del límite legal. Continuar uso EPR obligatorio. Verificar VLE semestral.'
      },
      {
        id: 2, worker_id: 5, worker_nombre: 'Pedro Pablo Sánchez Rojas', rut: '11.111.111-1',
        cargo: 'Soldador de Producción', area: 'Producción', fecha_eval: '2026-02-15',
        metales_exposicion: ['Fe','Mn','Cr+6','Ni'],
        muestreo_ambiental_fecha: '2026-01-15',
        resultado_fe_mgm3: 3.8, resultado_mn_mgm3: 0.16, resultado_cr6_mgm3: 0.041,
        limite_fe_ds594: 5.0, limite_mn_ds594: 0.2, limite_cr6_ds594: 0.05,
        espirometria_fecha: '2026-02-15', espirometria_resultado: 'Normal. CVF 95% teórico. VEF1/CVF 79%. Leve caída VEF1.',
        rx_torax_fecha: '2026-01-10', rx_torax_resultado: 'Sin neumoconiosis. OIT 0/0. Seguimiento.',
        plombemia_ugl: null, creatinina_mgdl: null, arsenico_urinario_ugL: null,
        ventilacion_vle: true, epr_entregado: true, epr_prueba_ajuste: true,
        prox_evaluacion: '2027-02-15',
        estado: 'vigente', observaciones: 'Cr+6 cercano al LPP (82%). Reforzar uso EPR y verificar eficiencia VLE. Siguiente muestreo semestral.'
      },
      {
        id: 3, worker_id: 4, worker_nombre: 'Ana Patricia López Vega', rut: '8.765.432-1',
        cargo: 'Soldadora Auxiliar', area: 'Producción', fecha_eval: '2026-01-20',
        metales_exposicion: ['Fe','Cu','Zn'],
        muestreo_ambiental_fecha: '2026-01-10',
        resultado_fe_mgm3: 1.2, resultado_mn_mgm3: null, resultado_cr6_mgm3: null,
        limite_fe_ds594: 5.0, limite_mn_ds594: 0.2, limite_cr6_ds594: 0.05,
        espirometria_fecha: '2026-01-20', espirometria_resultado: 'Normal. CVF 102% teórico. VEF1/CVF 84%.',
        rx_torax_fecha: null, rx_torax_resultado: null,
        plombemia_ugl: null, creatinina_mgdl: null, arsenico_urinario_ugL: null,
        ventilacion_vle: true, epr_entregado: true, epr_prueba_ajuste: false,
        prox_evaluacion: '2027-01-20',
        estado: 'vigente', observaciones: 'Exposición principalmente a humos Fe/Cu/Zn. Riesgo fiebre por humos. Pendiente prueba de ajuste EPR y Rx tórax OIT preempleo.'
      },
      {
        id: 4, worker_id: 9, worker_nombre: 'Ricardo Andrés Muñoz Silva', rut: '14.321.098-7',
        cargo: 'Mecánico Industrial', area: 'Mantenimiento', fecha_eval: '2026-03-01',
        metales_exposicion: ['Pb','Cd'],
        muestreo_ambiental_fecha: '2026-02-20',
        resultado_fe_mgm3: null, resultado_mn_mgm3: null, resultado_cr6_mgm3: null,
        limite_fe_ds594: 5.0, limite_mn_ds594: 0.2, limite_cr6_ds594: 0.05,
        espirometria_fecha: '2026-03-01', espirometria_resultado: 'Normal. CVF 97% teórico. VEF1/CVF 80%.',
        rx_torax_fecha: '2025-06-15', rx_torax_resultado: 'Sin hallazgos. OIT 0/0.',
        plombemia_ugl: 18, creatinina_mgdl: 95, arsenico_urinario_ugL: null,
        ventilacion_vle: false, epr_entregado: true, epr_prueba_ajuste: true,
        prox_evaluacion: '2026-09-01',
        estado: 'por_vencer', observaciones: '⚠️ Sin VLE instalada en área baterías. Plombemia 18 µg/dL (bajo LBE 40). Gestionar instalación VLE urgente. Monitoreo biológico Pb semestral (cancerígeno Cd).'
      },
    ],
    estadisticas: { total_vigilados: 8, sobre_limite_legal: 0, con_monitoreo_biologico: 5, con_espirometria_vigente: 7, con_rx_torax_vigente: 6, cumplimiento_pct: 45 }
  }
}

// GET /api/protocols
app.get('/', (c) => {
  const summary = Object.values(protocolsDB).map((p: any) => ({
    id: p.id, nombre: p.nombre, color: p.color, icon: p.icon,
    norma_tecnica: p.norma_tecnica, base_legal: p.base_legal,
    cumplimiento_pct: p.estadisticas?.cumplimiento_pct ?? 0,
    estadisticas: p.estadisticas
  }))
  return c.json({ success: true, data: summary })
})

// PUT /api/protocols/batch/cumplimiento — Actualiza múltiples protocolos a la vez
// IMPORTANTE: este endpoint DEBE ir ANTES de /:id para que Hono no lo capture como parámetro
app.put('/batch/cumplimiento', async (c) => {
  const body = await c.req.json()
  // body.updates = [{ id: 'PREXOR', cumplimiento_pct: 80 }, ...]
  const updates = body.updates || []
  const results: any[] = []
  updates.forEach((u: any) => {
    const id = (u.id || '').toUpperCase()
    const p = (protocolsDB as any)[id]
    if (p) {
      p.estadisticas = p.estadisticas || {}
      p.estadisticas.cumplimiento_pct = parseInt(u.cumplimiento_pct) || 0
      results.push({ id, cumplimiento_pct: p.estadisticas.cumplimiento_pct })
    }
  })
  return c.json({ success: true, data: results, message: `${results.length} protocolos actualizados` })
})

// GET /api/protocols/:id
app.get('/:id', (c) => {
  const id = c.req.param('id').toUpperCase()
  const p = protocolsDB[id]
  if (!p) return c.json({ success: false, error: 'Protocolo no encontrado' }, 404)
  return c.json({ success: true, data: p })
})

// PUT /api/protocols/:id/cumplimiento  — Actualiza % de cumplimiento y fases
app.put('/:id/cumplimiento', async (c) => {
  const id = c.req.param('id').toUpperCase()
  const p = (protocolsDB as any)[id]
  if (!p) return c.json({ success: false, error: 'Protocolo no encontrado' }, 404)
  const body = await c.req.json()
  // Actualizar cumplimiento_pct en estadísticas
  if (body.cumplimiento_pct !== undefined) {
    p.estadisticas = p.estadisticas || {}
    p.estadisticas.cumplimiento_pct = parseInt(body.cumplimiento_pct) || 0
  }
  // Actualizar fases si se envían
  if (body.fases && Array.isArray(body.fases)) {
    body.fases.forEach((faseUpdate: any) => {
      const fase = p.fases?.find((f: any) => f.nombre === faseUpdate.nombre || f.fase === faseUpdate.fase)
      if (fase && faseUpdate.items) {
        faseUpdate.items.forEach((itemUpdate: any) => {
          const item = fase.items?.find((i: any) => i.id === itemUpdate.id)
          if (item) {
            if (itemUpdate.cumplimiento) item.cumplimiento = itemUpdate.cumplimiento
            if (itemUpdate.fecha) item.fecha = itemUpdate.fecha
          }
        })
      }
    })
  }
  return c.json({ 
    success: true, 
    data: { id, cumplimiento_pct: p.estadisticas.cumplimiento_pct },
    message: `Cumplimiento de ${id} actualizado a ${p.estadisticas.cumplimiento_pct}%`
  })
})

// PUT /api/protocols/:id/evaluaciones/:evalId
app.put('/:id/evaluaciones/:evalId', async (c) => {
  const id = c.req.param('id').toUpperCase()
  const evalId = parseInt(c.req.param('evalId'))
  const p = protocolsDB[id]
  if (!p) return c.json({ success: false, error: 'Protocolo no encontrado' }, 404)
  const idx = p.evaluaciones.findIndex((e: any) => e.id === evalId)
  if (idx === -1) return c.json({ success: false, error: 'Evaluación no encontrada' }, 404)
  const body = await c.req.json()
  p.evaluaciones[idx] = { ...p.evaluaciones[idx], ...body }
  return c.json({ success: true, data: p.evaluaciones[idx], message: 'Evaluación actualizada' })
})

// POST /api/protocols/:id/evaluaciones
app.post('/:id/evaluaciones', async (c) => {
  const id = c.req.param('id').toUpperCase()
  const p = protocolsDB[id]
  if (!p) return c.json({ success: false, error: 'Protocolo no encontrado' }, 404)
  const body = await c.req.json()
  const newEval = { id: p.evaluaciones.length + 1, ...body, fecha_registro: new Date().toISOString() }
  p.evaluaciones.push(newEval)
  return c.json({ success: true, data: newEval }, 201)
})

export default app
