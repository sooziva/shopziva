import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../data/products'

export type CartItem = Product & { quantity: number }

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )

    return {
      items,
      count,
      total,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (product) => {
        setItems((prev) => {
          const existing = prev.find((item) => item.id === product.id)
          if (existing) {
            return prev.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          }
          return [...prev, { ...product, quantity: 1 }]
        })
        setIsOpen(true)
      },
      removeItem: (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          setItems((prev) => prev.filter((item) => item.id !== id))
          return
        }
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
        )
      },
      clearCart: () => setItems([]),
    }
  }, [items, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
