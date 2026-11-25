import { Link } from 'react-router-dom'
import { fansPath, homePath, shopPath } from '../data/products'
import { pagePath } from '../data/pages'
import { PaymentMethods } from './PaymentMethods'
import './Footer.css'

const columns: {
  title: string
  links: { label: string; to: string }[]
}[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Makeup', to: shopPath('makeup') },
      { label: 'Wigs', to: shopPath('wigs') },
      { label: 'Fans', to: fansPath },
      { label: 'Accessories', to: shopPath('accessories') },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'About', to: pagePath('about') },
      { label: 'Contact', to: pagePath('contact') },
      { label: 'Shipping', to: pagePath('shipping') },
      { label: 'Refunds', to: pagePath('refunds') },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: pagePath('privacy') },
      { label: 'Terms', to: pagePath('terms') },
    ],
  },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-panel">
        <div className="footer-intro">
          <Link className="footer-brand" to={homePath}>
            shopziva
          </Link>
          <p className="footer-tagline">
            Soft glam that stays — from first swipe to last light.
          </p>
        </div>

        <nav className="footer-columns" aria-label="Footer">
          {columns.map((column) => (
            <div key={column.title} className="footer-column">
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="footer-payments">
          <PaymentMethods tone="dark" />
        </div>

        <div className="footer-bottom">
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer">
              Pinterest
            </a>
          </div>
          <p>© {new Date().getFullYear()} shopziva</p>
        </div>
      </div>
    </footer>
  )
}
