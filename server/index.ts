import { serve } from '@hono/node-server'
import 'dotenv/config'
import app from './app.js'

const port = Number(process.env.PORT ?? 8787)

serve({ fetch: app.fetch, port }, () => {
  console.log(`shopziva api on http://localhost:${port}`)
})
