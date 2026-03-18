import { Hono } from 'hono'
import { users, rolesInfo } from './auth'

const app = new Hono()

// ================================================================
// HSE 360 — Gestión de Usuarios
// SOLO el Superadmin (Raúl Díaz Espejo) puede CRUD
// ================================================================

// GET /api/users
app.get('/', (c) => {
  const safeUsers = users.map(({ password: _, ...u }) => ({
    ...u,
    rol_info: rolesInfo[u.rol]
  }))
  return c.json({ success: true, data: safeUsers, total: safeUsers.length })
})

// GET /api/users/roles
app.get('/roles', (c) => {
  return c.json({ success: true, data: rolesInfo })
})

// GET /api/users/:id
app.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.find(u => u.id === id)
  if (!user) return c.json({ success: false, error: 'Usuario no encontrado' }, 404)
  const { password: _, ...userSafe } = user
  return c.json({ success: true, data: { ...userSafe, rol_info: rolesInfo[user.rol] } })
})

// POST /api/users — Solo superadmin
app.post('/', async (c) => {
  const body = await c.req.json()
  // No permitir crear otro superadmin
  if (body.rol === 'superadmin') {
    return c.json({ success: false, error: 'No se puede crear otro Super Administrador. HSE 360 tiene un único Superadmin.' }, 403)
  }
  // Verificar email único
  if (users.find(u => u.email === body.email)) {
    return c.json({ success: false, error: 'El email ya está en uso por otro usuario.' }, 409)
  }
  const initiales = (body.nombres?.[0] || '') + (body.apellidos?.[0] || '')
  const newUser = {
    id: users.length + 1,
    ...body,
    activo: true,
    permisos: getPermisosByRol(body.rol),
    creado_en: new Date().toISOString(),
    ultimo_acceso: null,
    avatar_iniciales: initiales.toUpperCase()
  }
  users.push(newUser)
  const { password: _, ...userSafe } = newUser
  return c.json({ success: true, data: { ...userSafe, rol_info: rolesInfo[newUser.rol] }, message: 'Usuario creado exitosamente' }, 201)
})

// PUT /api/users/:id — Solo superadmin
app.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return c.json({ success: false, error: 'Usuario no encontrado' }, 404)
  // Proteger al superadmin
  if (users[idx].rol === 'superadmin') {
    return c.json({ success: false, error: 'No se puede modificar al Super Administrador.' }, 403)
  }
  const body = await c.req.json()
  // No permitir cambiar rol a superadmin
  if (body.rol === 'superadmin') {
    return c.json({ success: false, error: 'No se puede asignar el rol Superadmin.' }, 403)
  }
  users[idx] = { ...users[idx], ...body }
  if (body.rol) users[idx].permisos = getPermisosByRol(body.rol)
  const { password: _, ...userSafe } = users[idx]
  return c.json({ success: true, data: { ...userSafe, rol_info: rolesInfo[users[idx].rol] }, message: 'Usuario actualizado correctamente' })
})

// DELETE /api/users/:id — Solo superadmin
app.delete('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return c.json({ success: false, error: 'Usuario no encontrado' }, 404)
  if (users[idx].rol === 'superadmin') {
    return c.json({ success: false, error: 'No se puede desactivar al Super Administrador.' }, 403)
  }
  users[idx].activo = false
  return c.json({ success: true, message: 'Usuario desactivado correctamente' })
})

// PATCH /api/users/:id/reactivar — Solo superadmin
app.patch('/:id/reactivar', (c) => {
  const id = parseInt(c.req.param('id'))
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return c.json({ success: false, error: 'Usuario no encontrado' }, 404)
  users[idx].activo = true
  return c.json({ success: true, message: 'Usuario reactivado correctamente' })
})

function getPermisosByRol(rol: string): string[] {
  const map: Record<string, string[]> = {
    prevencionista: ['workers:read','workers:write','protocols:all','accidents:all','epp:all','capacitations:all','miper:all','alerts:read','dashboard:read'],
    medico: ['workers:read','protocols:read','protocols:examenes:write','accidents:read','dashboard:read'],
    rrhh: ['workers:all','capacitations:read','epp:read','alerts:read','dashboard:read'],
    trabajador: ['workers:self','capacitations:read','epp:self'],
  }
  return map[rol] || []
}

export default app
