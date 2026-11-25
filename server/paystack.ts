const PAYSTACK_BASE = 'https://api.paystack.co'

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim()
  if (!key) {
    throw new Error(
      'Missing PAYSTACK_SECRET_KEY. Add your Paystack secret key to .env',
    )
  }
  return key
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${getSecretKey()}`,
      },
    },
  )

  const payload = (await response.json()) as {
    status: boolean
    message: string
    data?: {
      status: string
      amount: number
      currency: string
      reference: string
      paid_at?: string
      customer?: { email?: string }
    }
  }

  if (!response.ok || !payload.status || !payload.data) {
    throw new Error(payload.message || 'Could not verify Paystack payment.')
  }

  return payload.data
}
