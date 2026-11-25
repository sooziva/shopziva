import './PaymentMethods.css'

export const paymentMethods = [
  { src: '/pay-logo/visa.PNG', label: 'Visa' },
  { src: '/pay-logo/Mastercard.jpeg', label: 'Mastercard' },
  { src: '/pay-logo/mtnmomo.PNG', label: 'MTN MoMo' },
  { src: '/pay-logo/telecel-cash.png', label: 'Telecel Cash' },
  { src: '/pay-logo/airteltigo-money.png', label: 'AirtelTigo Money' },
] as const

type PaymentMethodsProps = {
  tone?: 'light' | 'dark'
  className?: string
}

export function PaymentMethods({
  tone = 'light',
  className,
}: PaymentMethodsProps) {
  return (
    <div
      className={['payment-methods', `is-${tone}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-label="Accepted payment methods"
    >
      <p className="payment-methods-label">We accept</p>
      <ul className="payment-methods-list">
        {paymentMethods.map((method) => (
          <li key={method.src}>
            <img src={method.src} alt={method.label} loading="lazy" />
          </li>
        ))}
      </ul>
    </div>
  )
}
