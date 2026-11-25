import { motion } from 'framer-motion'
import './Instagram.css'

const posts = [
  {
    id: 1,
    tall: true,
    image:
      'https://images.unsplash.com/photo-1522337094846-8df647034355?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    tall: false,
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    tall: true,
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    tall: false,
    image:
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    tall: false,
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  },
]

export function Instagram() {
  return (
    <section className="instagram" id="instagram" aria-labelledby="instagram-title">
      <div className="instagram-header">
        <h2 id="instagram-title">Follow us on Instagram</h2>
        <a
          className="instagram-handle"
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
        >
          @shopziva →
        </a>
      </div>

      <div className="instagram-grid">
        {posts.map((post, index) => (
          <motion.a
            key={post.id}
            className={`instagram-tile ${post.tall ? 'is-tall' : ''}`}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.55,
              delay: index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <img src={post.image} alt="" loading="lazy" />
          </motion.a>
        ))}
      </div>
    </section>
  )
}
