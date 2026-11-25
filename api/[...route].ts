import app from '../server/app'

// Catch-all so /api/checkout, /api/health, etc. hit the Hono app with the real path.
export default app
