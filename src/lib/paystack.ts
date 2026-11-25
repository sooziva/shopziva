import type { CartItem } from '../context/CartContext'

export const PAYSTACK_CURRENCY = 'GHS'

const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

type PaystackSuccess = {
  reference: string
  status: 'success'
}

type StartPaystackCheckoutOptions = {
  email: string
  items: CartItem[]
  onSuccess: (result: PaystackSuccess) => void
  onCancel?: () => void
  onError?: (message: string) => void
}

type CheckoutSession = {
  reference: string
  email: string
  amount: number
  currency: string
  publicKey: string | null
}

async function readJsonResponse<T extends { error?: string }>(
  response: Response,
  fallbackError: string,
): Promise<T> {
  const text = await response.text()
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(
      response.ok
        ? fallbackError
        : `Checkout API unavailable (${response.status}). Deploy the /api server and set DATABASE_URL on Vercel.`,
    )
  }
}

async function createCheckoutSession(
  email: string,
  items: CartItem[],
): Promise<CheckoutSession> {
  const response = await fetch(`${apiBase}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    }),
  })

  const payload = await readJsonResponse<CheckoutSession & { error?: string }>(
    response,
    'Could not create checkout session.',
  )

  if (!response.ok) {
    throw new Error(payload.error || 'Could not create checkout session.')
  }

  return payload
}

async function verifyCheckout(reference: string) {
  const response = await fetch(`${apiBase}/api/checkout/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference }),
  })

  const payload = await readJsonResponse<{
    ok?: boolean
    error?: string
    status?: string
  }>(response, 'Could not verify payment.')

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Could not verify payment.')
  }

  return payload
}

function getBrowserPublicKey(sessionKey: string | null) {
  const key =
    sessionKey?.trim() || import.meta.env.VITE_PAYSTACK_PUBLIC_KEY?.trim()
  if (!key) {
    throw new Error(
      'Missing VITE_PAYSTACK_PUBLIC_KEY. Add your Paystack public key to .env.',
    )
  }
  return key
}

export async function startPaystackCheckout({
  email,
  items,
  onSuccess,
  onCancel,
  onError,
}: StartPaystackCheckoutOptions) {
  const session = await createCheckoutSession(email, items)
  const key = getBrowserPublicKey(session.publicKey)

  const { default: PaystackPop } = await import('@paystack/inline-js')
  const popup = new PaystackPop()

  popup.newTransaction({
    key,
    email: session.email,
    amount: session.amount,
    currency: session.currency || PAYSTACK_CURRENCY,
    reference: session.reference,
    channels: ['card', 'mobile_money', 'bank_transfer', 'ussd'],
    metadata: {
      custom_fields: [
        {
          display_name: 'Store',
          variable_name: 'store',
          value: 'shopziva',
        },
        {
          display_name: 'Items',
          variable_name: 'cart_items',
          value: items
            .map((item) => `${item.name} × ${item.quantity}`)
            .join(', '),
        },
      ],
    },
    onSuccess: async (transaction) => {
      try {
        await verifyCheckout(transaction.reference)
        onSuccess({
          reference: transaction.reference,
          status: 'success',
        })
      } catch (error) {
        onError?.(
          error instanceof Error
            ? error.message
            : 'Payment went through, but verification failed.',
        )
      }
    },
    onCancel: () => {
      onCancel?.()
    },
    onError: (error) => {
      onError?.(error.message || 'Payment could not be started.')
    },
  })

  return session.reference
}
