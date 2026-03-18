import { Hono } from 'hono'

const app = new Hono()

// ================================================================
// HSE 360 — Sistema de Gestión HSE
// SUPERADMIN ÚNICO: Raúl Díaz Espejo
// Ley 19.628 — Datos médicos confidenciales
// ================================================================

export const users: any[] = [
  {
    id: 1,
    rut: '10.234.567-8',
    nombres: 'Raúl',
    apellidos: 'Díaz Espejo',
    email: 'raul.diaz@hse360.cl',
    password: 'HSE360admin!',
    rol: 'superadmin',
    cargo: 'Super Administrador — HSE 360',
    activo: true,
    permisos: ['all'],
    ultimo_acceso: '2026-03-17T08:00:00',
    creado_en: '2026-01-01T00:00:00',
    avatar_iniciales: 'RD',
    centro_trabajo_id: null   // acceso a todos los centros
  },
  {
    id: 2,
    rut: '12.987.654-3',
    nombres: 'Claudia Beatriz',
    apellidos: 'Torres Sepúlveda',
    email: 'claudia.torres@hse360.cl',
    password: 'Prev2026!',
    rol: 'prevencionista',
    cargo: 'Prevencionista de Riesgos — Planta Norte',
    activo: true,
    permisos: ['workers:read','workers:write','protocols:all','accidents:all','epp:all','capacitations:all','miper:all','alerts:read','dashboard:read'],
    ultimo_acceso: '2026-03-17T09:00:00',
    creado_en: '2026-01-10T00:00:00',
    avatar_iniciales: 'CT',
    centro_trabajo_id: 1
  },
  {
    id: 3,
    rut: '14.567.890-K',
    nombres: 'Andrés Patricio',
    apellidos: 'Morales Vásquez',
    email: 'dr.morales@hse360.cl',
    password: 'Med2026!',
    rol: 'medico',
    cargo: 'Médico Ocupacional',
    activo: true,
    permisos: ['workers:read','protocols:read','protocols:examenes:write','accidents:read','dashboard:read'],
    ultimo_acceso: '2026-03-16T14:20:00',
    creado_en: '2026-01-15T00:00:00',
    avatar_iniciales: 'AM',
    centro_trabajo_id: 1
  },
  {
    id: 4,
    rut: '17.234.567-1',
    nombres: 'Patricia Elena',
    apellidos: 'Navarro Díaz',
    email: 'patricia.navarro@hse360.cl',
    password: 'RRHH2026!',
    rol: 'rrhh',
    cargo: 'Jefa de Recursos Humanos',
    activo: true,
    permisos: ['workers:all','capacitations:read','epp:read','alerts:read','dashboard:read'],
    ultimo_acceso: '2026-03-17T10:15:00',
    creado_en: '2026-01-20T00:00:00',
    avatar_iniciales: 'PN',
    centro_trabajo_id: 2
  },
  {
    id: 5,
    rut: '12.345.678-9',
    nombres: 'Carlos Alberto',
    apellidos: 'González Muñoz',
    email: 'cgonzalez@hse360.cl',
    password: 'Trab2026!',
    rol: 'trabajador',
    cargo: 'Operador de Maquinaria',
    activo: true,
    permisos: ['workers:self','capacitations:read','epp:self'],
    ultimo_acceso: '2026-03-10T07:45:00',
    creado_en: '2026-02-01T00:00:00',
    avatar_iniciales: 'CG',
    centro_trabajo_id: 1
  },
  {
    id: 6,
    rut: '16.456.789-2',
    nombres: 'María José',
    apellidos: 'Reyes Contreras',
    email: 'mjreyes@hse360.cl',
    password: 'Prev2026b!',
    rol: 'prevencionista',
    cargo: 'Prevencionista de Riesgos — Planta Sur',
    activo: true,
    permisos: ['workers:read','workers:write','protocols:all','accidents:all','epp:all','capacitations:all','miper:all','alerts:read','dashboard:read'],
    ultimo_acceso: '2026-03-15T11:30:00',
    creado_en: '2026-02-10T00:00:00',
    avatar_iniciales: 'MR',
    centro_trabajo_id: 2
  }
]

export const rolesInfo: Record<string, any> = {
  superadmin: {
    label: 'Super Administrador',
    color: 'red',
    icon: 'fa-crown',
    desc: 'Acceso total al sistema. Único rol que puede crear, editar y eliminar usuarios y centros de trabajo.',
    unico: true
  },
  prevencionista: {
    label: 'Prevencionista de Riesgos',
    color: 'blue',
    icon: 'fa-shield-halved',
    desc: 'Gestión completa de protocolos MINSAL, MIPER, EPP, capacitaciones y accidentes.'
  },
  medico: {
    label: 'Médico / Enfermera Ocupacional',
    color: 'green',
    icon: 'fa-stethoscope',
    desc: 'Registro de exámenes médicos, evaluaciones de protocolos y fichas de salud.'
  },
  rrhh: {
    label: 'RRHH',
    color: 'purple',
    icon: 'fa-users',
    desc: 'Gestión de trabajadores, capacitaciones y consulta de reportes.'
  },
  trabajador: {
    label: 'Trabajador',
    color: 'gray',
    icon: 'fa-person-walking',
    desc: 'Acceso a su propia ficha, EPP asignado y capacitaciones pendientes.'
  }
}

// POST /api/auth/login
app.post('/login', async (c) => {
  const body = await c.req.json()
  const { email, password } = body
  const user = users.find(u => u.email === email && u.password === password && u.activo)
  if (!user) {
    return c.json({ success: false, error: 'Credenciales incorrectas o usuario inactivo' }, 401)
  }
  user.ultimo_acceso = new Date().toISOString()
  const { password: _, ...userSafe } = user
  return c.json({
    success: true,
    data: {
      user: { ...userSafe, rol_info: rolesInfo[user.rol] },
      token: `hse360-token-${user.id}-${Date.now()}`,
      expires_in: 28800
    }
  })
})

// GET /api/auth/me
app.get('/me', (c) => {
  const authHeader = c.req.header('Authorization') || ''
  const tokenParts = authHeader.replace('Bearer ', '').split('-')
  const userId = tokenParts[2] ? parseInt(tokenParts[2]) : 1
  const user = users.find(u => u.id === userId) || users[0]
  const { password: _, ...userSafe } = user
  return c.json({ success: true, data: { ...userSafe, rol_info: rolesInfo[user.rol] } })
})

// POST /api/auth/logout
app.post('/logout', (c) => {
  return c.json({ success: true, message: 'Sesión cerrada correctamente' })
})

export default app
