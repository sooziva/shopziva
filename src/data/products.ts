export type Category = 'makeup' | 'wigs' | 'fans' | 'accessories'

export type ProductSection = {
  title: string
  content: string
}

export type ProductVariant = {
  id: string
  label: string
  image: string
  swatch: string
}

export type Product = {
  id: string
  name: string
  brand: string
  category: Category
  price: number
  image: string
  gallery?: string[]
  description?: string
  details?: ProductSection[]
  variants?: ProductVariant[]
}

const asset = (path: string) => `${path}?v=22`

export const products: Product[] = [
  {
    id: 'stay-on-waterproof-finishing-spray',
    name: 'Stay On Waterproof Finishing Spray',
    brand: 'shopziva',
    category: 'makeup',
    price: 26,
    image: asset('/stay-on-waterproof-finishing-spray.png'),
    gallery: [
      asset('/stayon.png'),
      asset('/stay-on-waterproof-finishing-spray.png'),
    ],
    description:
      'Lock your look in place with a fine, weightless mist that resists sweat, humidity, and touch-ups fading out.',
    details: [
      {
        title: 'Fabric & Materials',
        content:
          'Lightweight setting mist with a waterproof hold. Fine aerosol spray for even coverage without a heavy or sticky finish.',
      },
      {
        title: 'Care Instructions',
        content:
          'Hold 20–30 cm from the face and mist in an X and T motion after makeup. Allow to dry fully before touching. Shake well before each use. Store upright, away from heat and open flame.',
      },
      {
        title: 'Features',
        content:
          'Waterproof and humidity-resistant hold\nSoft, natural finish — not stiff or chalky\nWorks over foundation, concealer, and powder\nTravel-friendly bottle for on-the-go touch-ups',
      },
      {
        title: 'Details',
        content:
          'Category: Makeup › Face › Setting Spray\nFinish: Natural\nSkin feel: Lightweight, non-sticky',
      },
    ],
  },
  {
    id: 'absolute-long-lasting-lip-gloss',
    name: 'Absolute Long Lasting Lip Gloss',
    brand: 'shopziva',
    category: 'makeup',
    price: 22,
    image: asset('/absolute-long-lasting-lip-gloss.png'),
    gallery: [
      asset('/lipgloss.png'),
      asset('/absolute-long-lasting-lip-gloss.png'),
    ],
    description:
      'Add a glossy finish to bare lips or layer over your favourite lip colour for extra shine. The frosted squeeze tube has a ribbed black cap for easy touch-ups.',
    details: [
      {
        title: 'Fabric & Materials',
        content:
          'High-shine gloss formula in a squeeze tube with a precision applicator tip. Soft, non-sticky texture that layers cleanly over lipstick or alone.',
      },
      {
        title: 'Care Instructions',
        content:
          'Squeeze a small amount onto the tip and glide across lips. Cap tightly after use. Wipe the tip clean and store upright at room temperature.',
      },
      {
        title: 'Features',
        content:
          'Long-lasting glossy finish\nComfortable, non-sticky wear\nEasy squeeze-tube control for touch-ups\nFrosted tube with ribbed black cap',
      },
      {
        title: 'Details',
        content:
          'Store category: Makeup › Lips › Lip Gloss\nFinish: High shine\nFormat: Squeeze tube',
      },
    ],
  },
  {
    id: 'teardrop-powder-puff',
    name: 'Teardrop Powder Puff',
    brand: 'shopziva',
    category: 'makeup',
    price: 14,
    image: asset('/teardrop-powder-puff-lemon-yellow.png'),
    description:
      'A plush teardrop puff with a satin finger strap for precise setting powder and under-eye touch-ups.',
    details: [
      {
        title: 'Fabric & Materials',
        content:
          'Soft, plush foam body with a matching satin finger strap. Smooth surface designed to pick up and press powder evenly without dragging.',
      },
      {
        title: 'Care Instructions',
        content:
          'Gently hand wash with mild soap and lukewarm water. Squeeze out excess water — do not wring. Air dry completely before next use.',
      },
      {
        title: 'Features',
        content:
          'Teardrop shape with a tapered tip and wide, rounded base\nPlush surface for seamless powder application\nMatching satin finger strap for control\nIdeal for setting powder, under-eye areas, and touch-ups',
      },
      {
        title: 'Details',
        content:
          'Category: Makeup Tools & Accessories\nColour options: Lemon Yellow, Black, Hot Pink\nShape: Teardrop',
      },
    ],
    variants: [
      {
        id: 'lemon-yellow',
        label: 'Lemon Yellow',
        image: asset('/teardrop-powder-puff-lemon-yellow.png'),
        swatch: '#f2d95a',
      },
      {
        id: 'black',
        label: 'Black',
        image: asset('/teardrop-powder-puff-black.png'),
        swatch: '#1a1a1a',
      },
      {
        id: 'hot-pink',
        label: 'Hot Pink',
        image: asset('/teardrop-powder-puff-hot-pink.png'),
        swatch: '#f03a8c',
      },
    ],
  },
  {
    id: '613-blonde-straight-hd-lace',
    name: '613 Blonde Straight 13×6 HD Lace Front Wig',
    brand: 'shopziva',
    category: 'wigs',
    price: 178,
    image: asset('/613-blonde-straight-hd-lace-front.png'),
    gallery: [
      asset('/ivory-draped-portrait-pale-blonde-wig.png'),
      asset('/613-blonde-straight-hd-lace-front.png'),
    ],
    description:
      'A sleek 613 blonde straight lace front with a deep HD lace parting area for a natural hairline and versatile styles.',
    details: [
      {
        title: 'Fabric & Materials',
        content:
          'Premium fibre hair with a soft, natural-looking sheen. HD lace front construction for a seamless melt along the hairline.',
      },
      {
        title: 'Care Instructions',
        content:
          'Wash gently with cool water and sulphate-free shampoo. Detangle from ends upward with a wide-tooth comb. Air dry on a wig stand. Avoid high heat unless the fibre is heat-safe.',
      },
      {
        title: 'Features',
        content:
          'Straight texture with a glossy blonde finish\n13 × 6-inch HD lace front for deep parting\nNatural-looking hairline\nReady to wear — style with light brushing',
      },
      {
        title: 'Details',
        content:
          'Colour: 613 blonde\nTexture: Straight\nMaterial: Fibre wig\nConstruction: HD lace front\nLace dimensions: 13 inches across × 6 inches deep',
      },
    ],
  },
  {
    id: 'c-long-ars-straight-hd-lace-shade-4',
    name: 'C-LONG ARS Straight HD Lace Front Wig — Dark Brown (Shade 4)',
    brand: 'shopziva',
    category: 'wigs',
    price: 178,
    image: asset('/c-long-ars-straight-hd-lace-shade-4.png'),
    gallery: [
      asset('/ivory-draped-portrait-espresso-brown-wig.png'),
      asset('/c-long-ars-straight-hd-lace-shade-4.png'),
    ],
    description:
      'Long, straight dark brown HD lace front from the C-LONG ARS range — heat-friendly fibre for everyday polish.',
    details: [
      {
        title: 'Fabric & Materials',
        content:
          '100% high-temperature fibre with a soft, silk-like hand feel. HD lace front for a clean, natural melt at the hairline.',
      },
      {
        title: 'Care Instructions',
        content:
          'Wash with cool water and mild shampoo. Comb gently from ends to roots. Air dry preferred. Heat style only up to 180°C — always use a heat protectant.',
      },
      {
        title: 'Features',
        content:
          'Straight ARS texture with long length\n13 × 6-inch HD lace front\nHeat styling safe up to 180°C\nShade 4 dark brown for a natural everyday look',
      },
      {
        title: 'Details',
        content:
          'Brand and style: C-LONG · ARS Straight Wig\nColour: Shade 4\nMaterial: 100% high-temperature fibre\nLace: 13 × 6-inch HD lace front\nHeat styling: Up to 180°C',
      },
    ],
  },
  {
    id: 'sparkling-rhinestone-hand-fan',
    name: 'Sparkling Rhinestone Hand Fan',
    brand: 'shopziva',
    category: 'fans',
    price: 42,
    image: asset('/sparklefan.png'),
    description:
      'A glam hand fan finished with sparkling rhinestones — cool off in style at events, parties, or everyday moments.',
    details: [
      {
        title: 'Fabric & Materials',
        content:
          'Lightweight fan frame with a sparkling rhinestone-embellished face. Compact handheld design made for easy one-hand use.',
      },
      {
        title: 'Care Instructions',
        content:
          'Wipe gently with a soft, dry cloth. Avoid soaking in water or using harsh cleaners that may loosen stones. Store flat or upright to protect the embellishments.',
      },
      {
        title: 'Features',
        content:
          'Eye-catching rhinestone finish\nLightweight and easy to carry\nIdeal for events, photos, and hot days\nStatement accessory with everyday function',
      },
      {
        title: 'Details',
        content:
          'Category: Accessories › Fans\nStyle: Handheld folding fan\nFinish: Rhinestone embellished',
      },
    ],
  },
  {
    id: 'heart-rhinestone-hand-mirror',
    name: 'Heart-Shaped Rhinestone Hand Mirror',
    brand: 'shopziva',
    category: 'accessories',
    price: 28,
    image: asset('/heart-rhinestone-hand-mirror.png'),
    description:
      'A heart-shaped hand mirror framed in sparkling rhinestones — a cute, practical piece for makeup bags and vanity tables.',
    details: [
      {
        title: 'Fabric & Materials',
        content:
          'Heart-shaped mirror with a rhinestone-encrusted frame and comfortable handheld grip. Smooth reflective glass surface for clear makeup checks.',
      },
      {
        title: 'Care Instructions',
        content:
          'Clean the glass with a soft microfibre cloth. Dust the frame gently — avoid water and abrasive cleaners around the rhinestones.',
      },
      {
        title: 'Features',
        content:
          'Heart silhouette with full rhinestone frame\nClear handheld mirror for on-the-go touch-ups\nCompact enough for a makeup bag\nGlam gift-ready finish',
      },
      {
        title: 'Details',
        content:
          'Category: Accessories › Mirrors\nShape: Heart\nFinish: Rhinestone frame',
      },
    ],
  },
  {
    id: 'fy31-high-speed-mini-mist-fan',
    name: 'FY31 High-Speed Mini Fan with Mist',
    brand: 'shopziva',
    category: 'fans',
    price: 48,
    image: asset('/coolfan.png'),
    description:
      'A compact high-speed mini fan with a mist function — cool, refresh, and go without the bulk of a full-size fan.',
    details: [
      {
        title: 'Fabric & Materials',
        content:
          'Portable mini fan body with mist reservoir and high-speed blade design. Built for handheld and desk use with a compact footprint.',
      },
      {
        title: 'Care Instructions',
        content:
          'Empty the mist tank after use and wipe dry. Clean the exterior with a soft cloth. Do not submerge the unit. Charge fully before first use.',
      },
      {
        title: 'Features',
        content:
          'High-speed airflow in a mini format\nMist function for an extra cooling boost\nPortable for travel, desk, or outdoor use\nEasy one-button operation',
      },
      {
        title: 'Details',
        content:
          'Category: Accessories › Personal Care\nModel: FY31\nFunctions: Fan + mist',
      },
    ],
  },
]

export const categoryMeta: {
  id: Category
  label: string
}[] = [
  { id: 'makeup', label: 'Makeup' },
  { id: 'wigs', label: 'Wigs' },
  { id: 'fans', label: 'Fans' },
  { id: 'accessories', label: 'Accessories' },
]

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
  }).format(price)

export const countByCategory = (category: Category) =>
  products.filter((product) => product.category === category).length

export const getProductById = (id: string) =>
  products.find((product) => product.id === id)

export const productPath = (id: string) => `/product/${id}`

export { fansPath, shopPath, homePath } from '../lib/navigation'

/** Editorial lifestyle cards shown below the main shop grid. */
export const featuredLooks: {
  productId: string
  image: string
  label: string
}[] = [
  {
    productId: 'absolute-long-lasting-lip-gloss',
    image: asset('/lipgloss.png'),
    label: 'Absolute Lip Gloss',
  },
  {
    productId: 'stay-on-waterproof-finishing-spray',
    image: asset('/stayon.png'),
    label: 'Stay On Spray',
  },
]
