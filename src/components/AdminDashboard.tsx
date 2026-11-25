import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  CircleAlert,
  CreditCard,
  LoaderCircle,
  LogOut,
  Package,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react'
import { signIn, signOut, useSession } from '../lib/auth-client'
import './AdminDashboard.css'

type AdminStats = {
  totalOrders: number
  paidOrders: number
  pendingOrders: number
  failedOrders: number
  revenueGhs: number
}

type OrderItem = {
  productId: string
  name: string
  unitPrice: number
  quantity: number
  image: string | null
}

type AdminOrder = {
  id: string
  reference: string
  email: string
  amountGhs: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  paystackStatus: string | null
  paidAt: string | null
  createdAt: string
  items: OrderItem[]
}

type StatusFilter = 'all' | AdminOrder['status']

function formatMoney(amount: number, currency = 'GHS') {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function fetchAdmin<T>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: 'include' })
  if (response.status === 401) {
    throw new Error('unauthorized')
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string
    } | null
    throw new Error(body?.error ?? 'Request failed')
  }
  return response.json() as Promise<T>
}

function LoginPanel({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('admin@shopziva.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      })
      if (result.error) {
        setError(result.error.message ?? 'Could not sign in.')
      }
    } catch {
      setError('Could not reach the auth server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <button type="button" className="admin-back" onClick={onBack}>
        <ArrowLeft size={16} strokeWidth={2} />
        Storefront
      </button>

      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="admin-kicker">shopziva</p>
        <h1>Admin</h1>
        <p className="admin-login-copy">
          Sign in to review orders, revenue, and fulfillment.
        </p>

        <form className="admin-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>

          {error ? <p className="admin-error">{error}</p> : null}

          <button type="submit" className="admin-primary" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle size={16} className="admin-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

function DashboardShell({
  onBack,
  userName,
  userEmail,
}: {
  onBack: () => void
  userName: string
  userEmail: string
}) {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [selected, setSelected] = useState<AdminOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [forbidden, setForbidden] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await fetchAdmin<{ user: { email: string } }>('/api/admin/me')
      const [nextStats, nextOrders] = await Promise.all([
        fetchAdmin<AdminStats>('/api/admin/stats'),
        fetchAdmin<{ orders: AdminOrder[] }>(
          filter === 'all'
            ? '/api/admin/orders'
            : `/api/admin/orders?status=${filter}`,
        ),
      ])
      setStats(nextStats)
      setOrders(nextOrders.orders)
      setSelected((prev) =>
        prev
          ? (nextOrders.orders.find((order) => order.id === prev.id) ?? null)
          : null,
      )
      setForbidden(false)
    } catch (err) {
      if (err instanceof Error && err.message === 'unauthorized') {
        setForbidden(true)
        setStats(null)
        setOrders([])
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load admin data')
      }
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    void load()
  }, [load])

  const onSignOut = async () => {
    await signOut()
  }

  if (forbidden) {
    return (
      <div className="admin-login">
        <motion.div
          className="admin-login-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="admin-kicker">shopziva</p>
          <h1>Access denied</h1>
          <p className="admin-login-copy">
            You’re signed in as {userEmail}, but this account isn’t on the admin
            allowlist.
          </p>
          <button type="button" className="admin-primary" onClick={onSignOut}>
            Sign out
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="admin-brand-block">
          <button type="button" className="admin-back quiet" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={2} />
            Store
          </button>
          <div>
            <p className="admin-kicker">shopziva</p>
            <h1>Orders desk</h1>
          </div>
        </div>

        <div className="admin-top-actions">
          <div className="admin-user">
            <span>{userName}</span>
            <small>{userEmail}</small>
          </div>
          <button type="button" className="admin-ghost" onClick={() => void load()}>
            <RefreshCw size={15} strokeWidth={2} />
            Refresh
          </button>
          <button type="button" className="admin-ghost" onClick={() => void onSignOut()}>
            <LogOut size={15} strokeWidth={2} />
            Sign out
          </button>
        </div>
      </header>

      <section className="admin-stats">
        {[
          {
            label: 'Revenue',
            value: stats ? formatMoney(stats.revenueGhs) : '—',
            icon: CreditCard,
          },
          {
            label: 'Paid orders',
            value: stats ? String(stats.paidOrders) : '—',
            icon: Package,
          },
          {
            label: 'Pending',
            value: stats ? String(stats.pendingOrders) : '—',
            icon: ShoppingBag,
          },
          {
            label: 'Failed',
            value: stats ? String(stats.failedOrders) : '—',
            icon: CircleAlert,
          },
        ].map((card, index) => (
          <motion.article
            key={card.label}
            className="admin-stat"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
          >
            <div className="admin-stat-icon">
              <card.icon size={18} strokeWidth={1.8} />
            </div>
            <div>
              <p>{card.label}</p>
              <strong>{card.value}</strong>
            </div>
          </motion.article>
        ))}
      </section>

      <div className="admin-toolbar">
        <div className="admin-filters">
          {(['all', 'paid', 'pending', 'failed', 'cancelled'] as StatusFilter[]).map(
            (value) => (
              <button
                key={value}
                type="button"
                className={filter === value ? 'is-active' : undefined}
                onClick={() => setFilter(value)}
              >
                {value}
              </button>
            ),
          )}
        </div>
        {loading ? (
          <span className="admin-loading">
            <LoaderCircle size={14} className="admin-spin" />
            Syncing…
          </span>
        ) : null}
      </div>

      {error ? <p className="admin-error banner">{error}</p> : null}

      <div className="admin-grid">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="admin-empty">
                    No orders in this view yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className={selected?.id === order.id ? 'is-selected' : undefined}
                    onClick={() => setSelected(order)}
                  >
                    <td>
                      <code>{order.reference}</code>
                    </td>
                    <td>{order.email}</td>
                    <td>{formatMoney(order.amountGhs, order.currency)}</td>
                    <td>
                      <span className={`admin-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AnimatePresence mode="wait">
          {selected ? (
            <motion.aside
              key={selected.id}
              className="admin-detail"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.28 }}
            >
              <p className="admin-kicker">Order</p>
              <h2>{selected.reference}</h2>
              <dl className="admin-meta">
                <div>
                  <dt>Customer</dt>
                  <dd>{selected.email}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className={`admin-badge status-${selected.status}`}>
                      {selected.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>{formatMoney(selected.amountGhs, selected.currency)}</dd>
                </div>
                <div>
                  <dt>Placed</dt>
                  <dd>{formatDate(selected.createdAt)}</dd>
                </div>
                {selected.paidAt ? (
                  <div>
                    <dt>Paid</dt>
                    <dd>{formatDate(selected.paidAt)}</dd>
                  </div>
                ) : null}
              </dl>

              <h3>Items</h3>
              <ul className="admin-items">
                {selected.items.map((item) => (
                  <li key={`${selected.id}-${item.productId}-${item.name}`}>
                    {item.image ? (
                      <img src={item.image} alt="" />
                    ) : (
                      <div className="admin-item-ph" />
                    )}
                    <div>
                      <strong>{item.name}</strong>
                      <span>
                        {item.quantity} × {formatMoney(Number(item.unitPrice))}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.aside>
          ) : (
            <motion.aside
              key="empty-detail"
              className="admin-detail empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>Select an order to inspect line items and payment timing.</p>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="admin-login">
        <div className="admin-loading-block">
          <LoaderCircle size={22} className="admin-spin" />
          <span>Checking session…</span>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return <LoginPanel onBack={onBack} />
  }

  return (
    <DashboardShell
      onBack={onBack}
      userName={session.user.name || 'Admin'}
      userEmail={session.user.email}
    />
  )
}
