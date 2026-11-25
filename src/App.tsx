import { useEffect } from 'react'
import {
  Navigate,
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { Hero } from './components/Hero'
import { ProductCarousel } from './components/ProductCarousel'
import { FeaturedLooks } from './components/FeaturedLooks'
import { ProductPage } from './components/ProductPage'
import { ContentPage } from './components/ContentPage'
import { FansPage } from './components/FansPage'
import { AdminDashboard } from './components/AdminDashboard'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { getProductById } from './data/products'
import { getPageById } from './data/pages'
import { homePath, shopPath } from './lib/navigation'

export function StoreLayout() {
  return (
    <CartProvider>
      <div className="app-shell" id="top">
        <Outlet />
        <Footer />
      </div>
      <CartDrawer />
    </CartProvider>
  )
}

export function HomePage() {
  return (
    <div>
      <Hero />
      <main>
        <ProductCarousel />
      </main>
      <FeaturedLooks />
    </div>
  )
}

export function ProductRoute() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const product = getProductById(decodeURIComponent(id))

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  if (!product) {
    return <Navigate to={shopPath('makeup')} replace />
  }

  return (
    <main>
      <ProductPage
        product={product}
        onBack={() => navigate(shopPath(product.category))}
      />
    </main>
  )
}

export function PageRoute() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const page = getPageById(decodeURIComponent(id))

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  if (!page) {
    return <Navigate to={homePath} replace />
  }

  return (
    <main>
      <ContentPage page={page} onBack={() => navigate(shopPath('makeup'))} />
    </main>
  )
}

export function FansRoute() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <main>
      <FansPage onBack={() => navigate(shopPath('makeup'))} />
    </main>
  )
}

export function AdminRoute() {
  const navigate = useNavigate()
  return <AdminDashboard onBack={() => navigate(homePath)} />
}
