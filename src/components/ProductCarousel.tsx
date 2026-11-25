import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  categoryMeta,
  countByCategory,
  formatPrice,
  productPath,
  products,
  shopPath,
  type Category,
  type Product,
} from '../data/products'
import { useCart } from '../context/CartContext'
import './ProductCarousel.css'

const isCategory = (value: string): value is Category =>
  categoryMeta.some((item) => item.id === value)

function categoryFromParam(value: string | undefined): Category {
  if (value && isCategory(value.toLowerCase())) {
    return value.toLowerCase() as Category
  }
  return 'makeup'
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const variants = product.variants ?? []
  const [variantId, setVariantId] = useState(variants[0]?.id ?? null)

  const selectedVariant =
    variants.find((variant) => variant.id === variantId) ?? null
  const activeImage = selectedVariant?.image ?? product.image
  const activeLabel = selectedVariant?.label

  const cartProduct = selectedVariant
    ? {
        ...product,
        id: `${product.id}-${selectedVariant.id}`,
        name: `${product.name} — ${selectedVariant.label}`,
        image: selectedVariant.image,
      }
    : product

  const lifestyle = product.category === 'fans'

  return (
    <li className={lifestyle ? 'product-card is-lifestyle' : 'product-card'}>
      <div className="product-card-media-wrap">
        <Link
          className={
            lifestyle ? 'product-card-media is-lifestyle' : 'product-card-media'
          }
          to={productPath(product.id)}
          aria-label={
            activeLabel
              ? `View ${product.name} — ${activeLabel}`
              : `View ${product.name}`
          }
        >
          <img
            key={activeImage}
            src={activeImage}
            alt={
              activeLabel ? `${product.name} — ${activeLabel}` : product.name
            }
            loading="lazy"
          />
        </Link>

        {variants.length > 0 ? (
          <div
            className="product-card-swatches"
            role="radiogroup"
            aria-label={`${product.name} colours`}
          >
            {variants.map((variant) => {
              const selected = variant.id === selectedVariant?.id
              return (
                <button
                  key={variant.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={variant.label}
                  className={
                    selected
                      ? 'product-card-swatch is-selected'
                      : 'product-card-swatch'
                  }
                  style={{ background: variant.swatch }}
                  onClick={() => setVariantId(variant.id)}
                />
              )
            })}
          </div>
        ) : null}
      </div>

      <div className="product-card-body">
        <Link className="product-card-info" to={productPath(product.id)}>
          <p className="product-card-name">
            {product.brand} {product.name}
            {activeLabel ? (
              <span className="product-card-variant"> · {activeLabel}</span>
            ) : null}
          </p>
          <p className="product-card-price">{formatPrice(product.price)}</p>
        </Link>
        <button
          type="button"
          className="product-card-add"
          aria-label={`Add ${cartProduct.name} to bag`}
          onClick={() => addItem(cartProduct)}
        >
          <Plus size={16} strokeWidth={2} />
        </button>
      </div>
    </li>
  )
}

export function ProductCarousel() {
  const { category: categoryParam } = useParams()
  const navigate = useNavigate()
  const category = categoryFromParam(categoryParam)
  const scrollerRef = useRef<HTMLUListElement>(null)
  const onShopRoute = Boolean(categoryParam)

  useEffect(() => {
    if (!onShopRoute) return
    scrollerRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
  }, [category, onShopRoute])

  const visible = useMemo(
    () => products.filter((product) => product.category === category),
    [category],
  )

  return (
    <section className="products" id="shop">
      <div className="products-tabs" role="tablist" aria-label="Categories">
        {categoryMeta.map((item) => {
          const count = countByCategory(item.id)
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={category === item.id}
              className={category === item.id ? 'is-active' : undefined}
              onClick={() => {
                scrollerRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
                navigate(shopPath(item.id), { replace: true })
              }}
            >
              {item.label}
              <sup>{String(count).padStart(2, '0')}</sup>
            </button>
          )
        })}
      </div>

      <div className="products-track-wrap">
        <AnimatePresence mode="wait">
          <motion.ul
            key={category}
            ref={scrollerRef}
            className="products-track"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  )
}
