import { useMemo, useState } from 'react'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatPrice, type Product } from '../data/products'
import { useCart } from '../context/CartContext'
import './ProductPage.css'

const VISIBLE_VARIANT_COUNT = 3

type ProductPageProps = {
  product: Product
  onBack: () => void
}

function AccordionSection({
  title,
  content,
  open,
  onToggle,
}: {
  title: string
  content: string
  open: boolean
  onToggle: () => void
}) {
  const lines = content.split('\n').filter(Boolean)

  return (
    <div
      className={
        open ? 'product-accordion-item is-open' : 'product-accordion-item'
      }
    >
      <button
        type="button"
        className="product-accordion-trigger"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <span className="product-accordion-icon" aria-hidden="true">
          {open ? (
            <Minus size={18} strokeWidth={1.6} />
          ) : (
            <Plus size={18} strokeWidth={1.6} />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="product-accordion-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="product-accordion-content">
              {lines.length > 1 ? (
                <ul>
                  {lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p>{content}</p>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function ProductPage({ product, onBack }: ProductPageProps) {
  const { addItem, openCart } = useCart()
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id ?? null)
  const [showAllVariants, setShowAllVariants] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(
    product.details?.[0]?.title ?? null,
  )
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)

  const selectedVariant = useMemo(
    () => product.variants?.find((variant) => variant.id === variantId) ?? null,
    [product.variants, variantId],
  )

  const variants = product.variants ?? []
  const overflowCount = Math.max(0, variants.length - VISIBLE_VARIANT_COUNT)
  const visibleVariants =
    showAllVariants || overflowCount === 0
      ? variants
      : variants.slice(0, VISIBLE_VARIANT_COUNT)

  const activeImage = selectedVariant?.image ?? product.image
  const activeLabel = selectedVariant?.label
  const lifestyle = product.category === 'fans'

  const galleryImages = useMemo(() => {
    if (product.gallery?.length) return product.gallery
    return [activeImage]
  }, [product.gallery, activeImage])

  const hasGallery = galleryImages.length > 1
  const displayImage = hasGallery
    ? galleryImages[activeGalleryIndex] ?? galleryImages[0]
    : activeImage

  return (
    <motion.section
      className={lifestyle ? 'product-page is-lifestyle' : 'product-page'}
      aria-labelledby="product-page-title"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <button type="button" className="product-page-back" onClick={onBack}>
        <ArrowLeft size={16} strokeWidth={2} />
        Back to shop
      </button>

      <div className="product-page-grid">
        <div className="product-page-visual">
          <div
            className={
              lifestyle
                ? 'product-page-media is-lifestyle'
                : hasGallery
                  ? 'product-page-media has-gallery'
                  : 'product-page-media'
            }
          >
            <img
              key={displayImage}
              src={displayImage}
              alt={
                activeLabel ? `${product.name} — ${activeLabel}` : product.name
              }
            />

            {variants.length > 0 ? (
              <div
                className="product-page-thumbs"
                role="radiogroup"
                aria-label="Colour"
              >
                {visibleVariants.map((variant) => {
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
                          ? 'product-page-thumb is-selected'
                          : 'product-page-thumb'
                      }
                      onClick={() => setVariantId(variant.id)}
                    >
                      <img src={variant.image} alt="" />
                    </button>
                  )
                })}

                {!showAllVariants && overflowCount > 0 ? (
                  <button
                    type="button"
                    className="product-page-thumb product-page-thumb-more"
                    aria-label={`Show ${overflowCount} more colours`}
                    onClick={() => setShowAllVariants(true)}
                  >
                    +{overflowCount}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {hasGallery ? (
            <div
              className="product-page-gallery-rail"
              role="tablist"
              aria-label={`${product.name} views`}
            >
              {galleryImages.map((src, index) => {
                const selected = index === activeGalleryIndex
                return (
                  <button
                    key={src}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={
                      selected
                        ? 'product-page-gallery-thumb is-selected'
                        : 'product-page-gallery-thumb'
                    }
                    onClick={() => setActiveGalleryIndex(index)}
                  >
                    <img
                      src={src}
                      alt=""
                      className={index > 0 ? 'is-packshot' : undefined}
                    />
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className="product-page-info">
          <p className="product-page-brand">{product.brand}</p>
          <h1 id="product-page-title">{product.name}</h1>
          <p className="product-page-price">{formatPrice(product.price)}</p>

          {product.description ? (
            <p className="product-page-description">{product.description}</p>
          ) : null}

          {activeLabel ? (
            <p className="product-page-colour">
              Colour <span>— {activeLabel}</span>
            </p>
          ) : null}

          <div className="product-page-actions">
            <button
              type="button"
              className="product-page-add"
              onClick={() => {
                const item: Product = selectedVariant
                  ? {
                      ...product,
                      id: `${product.id}-${selectedVariant.id}`,
                      name: `${product.name} — ${selectedVariant.label}`,
                      image: selectedVariant.image,
                    }
                  : product
                addItem(item)
                openCart()
              }}
            >
              Add to bag
              <span className="product-page-add-icon" aria-hidden="true">
                <Plus size={14} strokeWidth={2.4} />
              </span>
            </button>
          </div>

          {product.details?.length ? (
            <div
              className="product-accordion"
              role="region"
              aria-label="Product information"
            >
              {product.details.map((section) => (
                <AccordionSection
                  key={section.title}
                  title={section.title}
                  content={section.content}
                  open={openSection === section.title}
                  onToggle={() =>
                    setOpenSection((current) =>
                      current === section.title ? null : section.title,
                    )
                  }
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.section>
  )
}
