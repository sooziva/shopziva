import { ArrowLeft, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  formatPrice,
  productPath,
  products,
  type Product,
} from '../data/products'
import { useCart } from '../context/CartContext'
import './FansPage.css'

type FansPageProps = {
  onBack: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

function FanCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()

  return (
    <motion.li
      className="fans-page-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease }}
    >
      <Link
        className="fans-page-media"
        to={productPath(product.id)}
        aria-label={`View ${product.name}`}
      >
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>

      <div className="fans-page-card-body">
        <Link className="fans-page-info" to={productPath(product.id)}>
          <p className="fans-page-name">
            {product.brand} {product.name}
          </p>
          <p className="fans-page-price">{formatPrice(product.price)}</p>
        </Link>

        <button
          type="button"
          className="fans-page-add"
          aria-label={`Add ${product.name} to bag`}
          onClick={() => addItem(product)}
        >
          <Plus size={16} strokeWidth={2.2} />
        </button>
      </div>
    </motion.li>
  )
}

export function FansPage({ onBack }: FansPageProps) {
  const fans = products.filter((product) => product.category === 'fans')

  return (
    <motion.section
      className="fans-page"
      aria-labelledby="fans-page-title"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      <button type="button" className="fans-page-back" onClick={onBack}>
        <ArrowLeft size={16} strokeWidth={2} />
        Back to shop
      </button>

      <div className="fans-page-hero">
        <video
          className="fans-page-video"
          src="/fan.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="fans-page-hero-wash" aria-hidden="true" />
        <div className="fans-page-hero-copy">
          <p className="fans-page-eyebrow">Fans</p>
          <h1 id="fans-page-title">Cool down in style</h1>
          <p className="fans-page-lead">
            Handheld glam fans and mist minis — made for heat, events, and soft
            glam on the go.
          </p>
        </div>
      </div>

      <div className="fans-page-catalog">
        <div className="fans-page-catalog-header">
          <p className="fans-page-catalog-eyebrow">Shop</p>
          <h2>Fans for every moment</h2>
          <p className="fans-page-catalog-lead">
            Lifestyle looks with our handheld fans — tap through to shop the
            piece.
          </p>
        </div>

        <ul className="fans-page-grid">
          {fans.map((product, index) => (
            <FanCard key={product.id} product={product} index={index} />
          ))}
        </ul>
      </div>
    </motion.section>
  )
}
