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
    ultimo_acceso: new Date().toISOString(),
    creado_en: '2026-01-01T00:00:00',
    avatar_iniciales: 'RD',
    centro_trabajo_id: null
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
