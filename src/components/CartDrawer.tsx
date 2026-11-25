import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'
import { startPaystackCheckout } from '../lib/paystack'
import { PaymentMethods } from './PaymentMethods'
import './CartDrawer.css'

type CheckoutStatus =
  | { kind: 'idle' }
  | { kind: 'paying' }
  | { kind: 'success'; reference: string }
  | { kind: 'error'; message: string }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart()

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<CheckoutStatus>({ kind: 'idle' })

  const resetCheckout = () => setStatus({ kind: 'idle' })

  const handleCheckout = async () => {
    const trimmed = email.trim()
    if (!emailPattern.test(trimmed)) {
      setStatus({ kind: 'error', message: 'Enter a valid email to continue.' })
      return
    }

    setStatus({ kind: 'paying' })

    try {
      await startPaystackCheckout({
        email: trimmed,
        items,
        onSuccess: ({ reference }) => {
          clearCart()
          setStatus({ kind: 'success', reference })
        },
        onCancel: () => {
          setStatus({
            kind: 'error',
            message: 'Payment was cancelled. Your bag is still here.',
          })
        },
        onError: (message) => {
          setStatus({ kind: 'error', message })
        },
      })
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Could not start Paystack checkout.',
      })
    }
  }

  const handleClose = () => {
    closeCart()
    if (status.kind === 'success') {
      setStatus({ kind: 'idle' })
      setEmail('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            className="cart-backdrop"
            aria-label="Close bag"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cart-header">
              <h2>Your bag</h2>
              <button type="button" onClick={handleClose} aria-label="Close">
                <X size={20} strokeWidth={1.6} />
              </button>
            </div>

            {status.kind === 'success' ? (
              <div className="cart-empty cart-success">
                <p>Payment received — thank you.</p>
                <p className="cart-reference">
                  Reference <span>{status.reference}</span>
                </p>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={handleClose}
                >
                  Keep shopping
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="cart-empty">
                <p>Your bag is waiting for something beautiful.</p>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={handleClose}
                >
                  Keep shopping
                </button>
              </div>
            ) : (
              <>
                <ul className="cart-list">
                  {items.map((item) => (
                    <li key={item.id} className="cart-item">
                      <img src={item.image} alt="" />
                      <div className="cart-item-body">
                        <div className="cart-item-top">
                          <h3>{item.name}</h3>
                          <p>{formatPrice(item.price)}</p>
                        </div>
                        <div className="cart-item-actions">
                          <div className="qty">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Subtotal</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>

                  <label className="cart-email">
                    <span>Email for receipt</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        if (status.kind === 'error') resetCheckout()
                      }}
                      disabled={status.kind === 'paying'}
                    />
                  </label>

                  {status.kind === 'error' ? (
                    <p className="cart-checkout-message" role="alert">
                      {status.message}
                    </p>
                  ) : (
                    <p className="cart-checkout-hint">
                      Pay securely with card or mobile money via Paystack.
                    </p>
                  )}

                  <PaymentMethods tone="light" className="cart-payments" />

                  <button
                    type="button"
                    className="btn btn-dark cart-checkout"
                    onClick={handleCheckout}
                    disabled={status.kind === 'paying' || items.length === 0}
                  >
                    {status.kind === 'paying'
                      ? 'Opening Paystack…'
                      : `Pay ${formatPrice(total)}`}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
