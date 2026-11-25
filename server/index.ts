import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import 'dotenv/config'
import { pool, query } from './db'
import { verifyPaystackTransaction } from './paystack'
import { auth, isAdminEmail } from './auth'

type CartItemInput = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

const app = new Hono()
const webOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']

app.use(
  '*',
  cors({
    origin: webOrigins,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw))

async function requireAdmin(c: { req: { raw: Request } }) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return null
  }
  return session
}

app.get('/api/health', async (c) => {
  await query('SELECT 1')
  return c.json({ ok: true, database: 'postgres' })
})

app.get('/api/admin/me', async (c) => {
  const session = await requireAdmin(c)
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  return c.json({
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  })
})

app.get('/api/admin/stats', async (c) => {
  const session = await requireAdmin(c)
  if (!session) return c.json({ error: 'Unauthorized' }, 401)

  const result = await query<{
    total_orders: string
    paid_orders: string
    pending_orders: string
    failed_orders: string
    revenue_pesewas: string
  }>(
    `SELECT
       COUNT(*)::text AS total_orders,
       COUNT(*) FILTER (WHERE status = 'paid')::text AS paid_orders,
       COUNT(*) FILTER (WHERE status = 'pending')::text AS pending_orders,
       COUNT(*) FILTER (WHERE status = 'failed')::text AS failed_orders,
       COALESCE(SUM(amount_pesewas) FILTER (WHERE status = 'paid'), 0)::text
         AS revenue_pesewas
     FROM orders`,
  )

  const row = result.rows[0]
  return c.json({
    totalOrders: Number(row.total_orders),
    paidOrders: Number(row.paid_orders),
    pendingOrders: Number(row.pending_orders),
    failedOrders: Number(row.failed_orders),
    revenueGhs: Number(row.revenue_pesewas) / 100,
  })
})

app.get('/api/admin/orders', async (c) => {
  const session = await requireAdmin(c)
  if (!session) return c.json({ error: 'Unauthorized' }, 401)

  const status = c.req.query('status')?.trim()
  const limit = Math.min(Number(c.req.query('limit') ?? 50) || 50, 100)

  const params: unknown[] = []
  let where = ''
  if (status && ['pending', 'paid', 'failed', 'cancelled'].includes(status)) {
    params.push(status)
    where = `WHERE o.status = $${params.length}`
  }
  params.push(limit)

  const result = await query(
    `SELECT o.id, o.reference, o.email, o.amount_pesewas, o.currency, o.status,
            o.paystack_status, o.paid_at, o.created_at,
            COALESCE(
              json_agg(
                json_build_object(
                  'productId', i.product_id,
                  'name', i.name,
                  'unitPrice', i.unit_price,
                  'quantity', i.quantity,
                  'image', i.image
                )
                ORDER BY i.name
              ) FILTER (WHERE i.id IS NOT NULL),
              '[]'
            ) AS items
     FROM orders o
     LEFT JOIN order_items i ON i.order_id = o.id
     ${where}
     GROUP BY o.id
     ORDER BY o.created_at DESC
     LIMIT $${params.length}`,
    params,
  )

  return c.json({
    orders: result.rows.map((row) => ({
      id: row.id,
      reference: row.reference,
      email: row.email,
      amountGhs: Number(row.amount_pesewas) / 100,
      currency: row.currency,
      status: row.status,
      paystackStatus: row.paystack_status,
      paidAt: row.paid_at,
      createdAt: row.created_at,
      items: row.items,
    })),
  })
})

app.post('/api/checkout', async (c) => {
  const body = await c.req.json<{
    email?: string
    items?: CartItemInput[]
  }>()

  const email = body.email?.trim().toLowerCase()
  const items = body.items ?? []

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: 'A valid email is required.' }, 400)
  }

  if (!items.length) {
    return c.json({ error: 'Your bag is empty.' }, 400)
  }

  for (const item of items) {
    if (
      !item.id ||
      !item.name ||
      !Number.isFinite(item.price) ||
      item.price < 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      return c.json({ error: 'Invalid cart item.' }, 400)
    }
  }

  const amountMajor = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const amountPesewas = Math.round(amountMajor * 100)

  if (amountPesewas < 100) {
    return c.json({ error: 'Order total is too low to charge.' }, 400)
  }

  const reference = `SZ-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const orderResult = await client.query<{ id: string }>(
      `INSERT INTO orders (reference, email, amount_pesewas, currency, status)
       VALUES ($1, $2, $3, 'GHS', 'pending')
       RETURNING id`,
      [reference, email, amountPesewas],
    )

    const orderId = orderResult.rows[0].id

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items
          (order_id, product_id, name, unit_price, quantity, image)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.id,
          item.name,
          item.price,
          item.quantity,
          item.image ?? null,
        ],
      )
    }

    await client.query('COMMIT')

    return c.json({
      reference,
      email,
      amount: amountPesewas,
      currency: 'GHS',
      publicKey: process.env.VITE_PAYSTACK_PUBLIC_KEY ?? null,
    })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error(error)
    return c.json({ error: 'Could not create order.' }, 500)
  } finally {
    client.release()
  }
})

app.post('/api/checkout/verify', async (c) => {
  const body = await c.req.json<{ reference?: string }>()
  const reference = body.reference?.trim()

  if (!reference) {
    return c.json({ error: 'Payment reference is required.' }, 400)
  }

  const existing = await query<{
    id: string
    status: string
    amount_pesewas: number
    currency: string
    email: string
  }>(
    `SELECT id, status, amount_pesewas, currency, email
     FROM orders
     WHERE reference = $1`,
    [reference],
  )

  const order = existing.rows[0]
  if (!order) {
    return c.json({ error: 'Order not found.' }, 404)
  }

  if (order.status === 'paid') {
    return c.json({
      ok: true,
      reference,
      status: 'paid',
      alreadyPaid: true,
    })
  }

  try {
    const payment = await verifyPaystackTransaction(reference)

    if (payment.status !== 'success') {
      await query(
        `UPDATE orders
         SET status = 'failed',
             paystack_status = $2,
             updated_at = NOW()
         WHERE id = $1`,
        [order.id, payment.status],
      )
      return c.json({ error: 'Payment was not successful.' }, 402)
    }

    if (
      payment.amount !== order.amount_pesewas ||
      payment.currency !== order.currency
    ) {
      await query(
        `UPDATE orders
         SET status = 'failed',
             paystack_status = 'amount_mismatch',
             updated_at = NOW()
         WHERE id = $1`,
        [order.id],
      )
      return c.json({ error: 'Payment amount did not match the order.' }, 402)
    }

    await query(
      `UPDATE orders
       SET status = 'paid',
           paystack_status = $2,
           paid_at = COALESCE($3::timestamptz, NOW()),
           updated_at = NOW()
       WHERE id = $1`,
      [order.id, payment.status, payment.paid_at ?? null],
    )

    return c.json({
      ok: true,
      reference,
      status: 'paid',
      email: order.email,
    })
  } catch (error) {
    console.error(error)
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Could not verify payment with Paystack.',
      },
      500,
    )
  }
})

app.get('/api/orders/:reference', async (c) => {
  const reference = c.req.param('reference')
  const result = await query(
    `SELECT o.reference, o.email, o.amount_pesewas, o.currency, o.status,
            o.paid_at, o.created_at,
            COALESCE(
              json_agg(
                json_build_object(
                  'productId', i.product_id,
                  'name', i.name,
                  'unitPrice', i.unit_price,
                  'quantity', i.quantity,
                  'image', i.image
                )
                ORDER BY i.name
              ) FILTER (WHERE i.id IS NOT NULL),
              '[]'
            ) AS items
     FROM orders o
     LEFT JOIN order_items i ON i.order_id = o.id
     WHERE o.reference = $1
     GROUP BY o.id`,
    [reference],
  )

  if (!result.rows[0]) {
    return c.json({ error: 'Order not found.' }, 404)
  }

  return c.json(result.rows[0])
})

const port = Number(process.env.PORT ?? 8787)

serve({ fetch: app.fetch, port }, () => {
  console.log(`shopziva api on http://localhost:${port}`)
})
