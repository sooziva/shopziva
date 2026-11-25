import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  featuredLooks,
  formatPrice,
  getProductById,
  productPath,
} from '../data/products'
import { useCart } from '../context/CartContext'
import './FeaturedLooks.css'

const ease = [0.22, 1, 0.36, 1] as const

export function FeaturedLooks() {
  const { addItem } = useCart()

  const cards = featuredLooks
    .map((look) => {
      const product = getProductById(look.productId)
      if (!product) return null
      return { ...look, product }
    })
    .filter((card): card is NonNullable<typeof card> => Boolean(card))

  if (!cards.length) return null

  return (
    <section className="featured-looks" aria-labelledby="featured-looks-title">
      <div className="featured-looks-header">
        <p className="featured-looks-eyebrow">In the look</p>
        <h2 id="featured-looks-title">Soft glam, up close</h2>
        <p className="featured-looks-lead">
          Lifestyle shots of the lip gloss and finishing spray — tap through to
          shop the piece.
        </p>
      </div>

      <ul className="featured-looks-grid">
        {cards.map((card, index) => (
          <motion.li
            key={card.productId}
            className="featured-look-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.08, ease }}
          >
            <Link
              className="featured-look-media"
              to={productPath(card.product.id)}
              aria-label={`View ${card.product.name}`}
            >
              <img src={card.image} alt={card.label} loading="lazy" />
            </Link>

            <div className="featured-look-body">
              <Link
                className="featured-look-info"
                to={productPath(card.product.id)}
              >
                <p className="featured-look-name">
                  {card.product.brand} {card.product.name}
                </p>
                <p className="featured-look-price">
                  {formatPrice(card.product.price)}
                </p>
              </Link>

              <button
                type="button"
                className="featured-look-add"
                aria-label={`Add ${card.product.name} to bag`}
                onClick={() => addItem(card.product)}
              >
                <Plus size={16} strokeWidth={2.2} />
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
