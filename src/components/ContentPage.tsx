import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import type { SitePage } from '../data/pages'
import './ContentPage.css'

type ContentPageProps = {
  page: SitePage
  onBack: () => void
}

export function ContentPage({ page, onBack }: ContentPageProps) {
  return (
    <motion.article
      className="content-page"
      aria-labelledby="content-page-title"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <button type="button" className="content-page-back" onClick={onBack}>
        <ArrowLeft size={16} strokeWidth={2} />
        Back to shop
      </button>

      <p className="content-page-eyebrow">{page.eyebrow}</p>
      <h1 id="content-page-title">{page.title}</h1>
      <p className="content-page-summary">{page.summary}</p>

      <div className="content-page-sections">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </motion.article>
  )
}
