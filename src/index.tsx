import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

// Import routes
import workersRouter from './routes/workers'
import protocolsRouter from './routes/protocols'
import accidentsRouter from './routes/accidents'
import capacitationsRouter from './routes/capacitations'
import eppRouter from './routes/epp'
import dashboardRouter from './routes/dashboard'
import alertsRouter from './routes/alerts'

const app = new Hono()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

// API Routes
app.route('/api/workers', workersRouter)
app.route('/api/protocols', protocolsRouter)
app.route('/api/accidents', accidentsRouter)
app.route('/api/capacitations', capacitationsRouter)
app.route('/api/epp', eppRouter)
app.route('/api/dashboard', dashboardRouter)
app.route('/api/alerts', alertsRouter)

// Main SPA - serve full app
app.get('*', (c) => {
  return c.html(getMainHTML())
})

function getMainHTML(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaludTrabajo Chile - Sistema Integral de Salud Ocupacional</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <link rel="stylesheet" href="/static/styles.css">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#1d4ed8',700:'#1e40af',800:'#1e3a8a',900:'#1e3a6e' },
            chile: { red:'#D52B1E', blue:'#003DA5', white:'#FFFFFF' }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50 font-sans">
  <div id="app"></div>
  <script src="/static/app.js"></script>
</body>
</html>`
}

export default app
