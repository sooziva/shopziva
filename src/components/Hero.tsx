import { ArrowRight, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { fansPath, homePath, shopPath, type Category } from '../data/products'
import './Hero.css'

const navLinks: { label: string; to: string; category?: Category }[] = [
  { label: 'Makeup', to: shopPath('makeup'), category: 'makeup' },
  { label: 'Wigs', to: shopPath('wigs'), category: 'wigs' },
  { label: 'Fans', to: fansPath },
  { label: 'Accessories', to: shopPath('accessories'), category: 'accessories' },
]

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const { count, openCart } = useCart()

  return (
    <section className="hero" aria-label="Featured">
      <motion.div
        className="hero-media"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.25, ease }}
      >
        <video
          className="hero-image"
          src="/fan.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </motion.div>

      <div className="hero-wash" aria-hidden="true" />

      <header className="hero-nav">
        <div className="hero-nav-bar">
          <Link className="hero-brand" to={homePath}>
            shopziva
          </Link>

          <nav className="hero-links" aria-label="Primary">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hero-tools">
            <button
              type="button"
              className="hero-cart"
              aria-label={`Open bag, ${count} items`}
              onClick={openCart}
            >
              <ShoppingBag size={17} strokeWidth={1.7} />
              {count > 0 ? <span>{count}</span> : null}
            </button>
            <Link className="hero-nav-cta" to={fansPath}>
              Shop fans
              <span className="hero-cta-icon" aria-hidden="true">
                <ArrowRight size={13} strokeWidth={2.4} />
              </span>
            </Link>
          </div>
        </div>

        <nav className="hero-links-mobile" aria-label="Shop categories">
          {navLinks.map((link) => (
            <Link key={`m-${link.label}`} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="hero-content">
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
        >
          Beauty store
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.06, ease }}
        >
          shopziva
        </motion.h1>

        <motion.p
          className="hero-lead"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14, ease }}
        >
          Soft glam that stays.
        </motion.p>

        <motion.p
          className="hero-copy"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease }}
        >
          Makeup, lace wigs, and cooling fans — curated for looks that hold from
          day to late night.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
        >
          <Link className="hero-btn hero-btn-primary" to={fansPath}>
            Shop fans
            <span className="hero-cta-icon" aria-hidden="true">
              <ArrowRight size={13} strokeWidth={2.4} />
            </span>
          </Link>
          <Link className="hero-btn hero-btn-secondary" to={shopPath('makeup')}>
            Browse makeup
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
