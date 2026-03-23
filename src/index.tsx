import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

import workersRouter from './routes/workers'
import protocolsRouter from './routes/protocols'
import accidentsRouter from './routes/accidents'
import capacitationsRouter from './routes/capacitations'
import eppRouter from './routes/epp'
import dashboardRouter from './routes/dashboard'
import alertsRouter from './routes/alerts'
import authRouter from './routes/auth'
import usersRouter from './routes/users'
import miperRouter from './routes/miper'
import centrosRouter from './routes/centros'

const app = new Hono()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

app.route('/api/auth', authRouter)
app.route('/api/users', usersRouter)
app.route('/api/centros', centrosRouter)
app.route('/api/workers', workersRouter)
app.route('/api/protocols', protocolsRouter)
app.route('/api/accidents', accidentsRouter)
app.route('/api/capacitations', capacitationsRouter)
app.route('/api/epp', eppRouter)
app.route('/api/dashboard', dashboardRouter)
app.route('/api/alerts', alertsRouter)
app.route('/api/miper', miperRouter)

app.get('*', (c) => c.html(getMainHTML()))

function getMainHTML(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HSE 360 · Módulo de Salud Ocupacional</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <link rel="stylesheet" href="/static/styles.css">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            hse: {
              green: '#16a34a',
              dark: '#14532d',
              light: '#dcfce7',
              accent: '#22c55e'
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-50 font-sans antialiased">
  <div id="app"></div>
  <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2"></div>
  <script src="/static/app.js"></script>
</body>
</html>`
}

export default app
