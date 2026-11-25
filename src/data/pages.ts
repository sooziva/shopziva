export type SitePageId =
  | 'about'
  | 'contact'
  | 'shipping'
  | 'refunds'
  | 'privacy'
  | 'terms'

export type SitePage = {
  id: SitePageId
  title: string
  eyebrow: string
  summary: string
  sections: { heading: string; body: string[] }[]
}

export const sitePages: SitePage[] = [
  {
    id: 'about',
    title: 'About shopziva',
    eyebrow: 'About',
    summary:
      'shopziva is a beauty store for soft glam that holds — makeup, lace wigs, and glow accessories curated for looks that last from day into night.',
    sections: [
      {
        heading: 'What we sell',
        body: [
          'We focus on pieces you will actually reach for: finishing sprays, lip gloss, lace-front wigs, and statement accessories.',
          'Every drop is chosen for finish, wear, and that clean shopziva feel — polished without trying too hard.',
        ],
      },
      {
        heading: 'Where we ship',
        body: [
          'We currently fulfil orders across Ghana. Delivery timelines depend on your city and are listed on our Shipping page.',
        ],
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact us',
    eyebrow: 'Contact',
    summary:
      'Questions about an order, a product, or a return? Send a note and we will get back to you as soon as we can.',
    sections: [
      {
        heading: 'Email',
        body: [
          'hello@shopziva.com',
          'We usually reply within 1–2 business days.',
        ],
      },
      {
        heading: 'Order help',
        body: [
          'Include your Paystack payment reference or order email so we can find your purchase faster.',
        ],
      },
      {
        heading: 'Social',
        body: [
          'Follow shopziva on Instagram and Pinterest for new drops and styling ideas.',
        ],
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping',
    eyebrow: 'Shipping',
    summary:
      'Orders are packed with care and dispatched once payment is confirmed through Paystack.',
    sections: [
      {
        heading: 'Processing',
        body: [
          'Most orders are prepared within 1–2 business days after successful payment.',
          'You will receive updates by email when your order is confirmed and when it ships.',
        ],
      },
      {
        heading: 'Delivery',
        body: [
          'Delivery times vary by location in Ghana. Local metro areas are typically faster than out-of-town destinations.',
          'Shipping fees, if any, are shown before you complete checkout when available.',
        ],
      },
      {
        heading: 'Issues in transit',
        body: [
          'If a package is delayed or arrives damaged, contact us with your order reference and photos so we can help.',
        ],
      },
    ],
  },
  {
    id: 'refunds',
    title: 'Refunds & returns',
    eyebrow: 'Refunds',
    summary:
      'We want you to love what you ordered. If something is not right, reach out and we will work through it with you.',
    sections: [
      {
        heading: 'Eligible returns',
        body: [
          'Unopened makeup and unused accessories may be eligible for return within 7 days of delivery.',
          'Wigs that have been worn, styled, cut, or washed are not eligible for return unless they arrived defective.',
        ],
      },
      {
        heading: 'How to start a return',
        body: [
          'Email hello@shopziva.com with your order reference, what you received, and why you would like a return.',
          'Approved returns must be sent back in original packaging. Refunds are issued to the original payment method after we receive and inspect the item.',
        ],
      },
      {
        heading: 'Damaged or wrong items',
        body: [
          'If your order arrives damaged or incorrect, contact us within 48 hours with photos. We will arrange a replacement or refund.',
        ],
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy policy',
    eyebrow: 'Privacy',
    summary:
      'This policy explains what information shopziva collects when you shop with us, and how we use it.',
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'When you check out, we collect your email address and order details so we can process payment and fulfil your purchase.',
          'Payment card and mobile money details are handled by Paystack. We do not store your full payment credentials on our servers.',
        ],
      },
      {
        heading: 'How we use your information',
        body: [
          'We use your information to confirm orders, verify payments, arrange delivery, and respond to support requests.',
          'We may also use anonymised shopping data to improve our catalogue and checkout experience.',
        ],
      },
      {
        heading: 'Sharing',
        body: [
          'We share only what is needed with service providers that help us run the store — for example Paystack for payments and delivery partners for shipping.',
          'We do not sell your personal information.',
        ],
      },
      {
        heading: 'Your choices',
        body: [
          'You can email hello@shopziva.com to ask what data we hold about your orders or to request a correction.',
        ],
      },
      {
        heading: 'Updates',
        body: [
          'We may update this policy as the store grows. The latest version will always be available on this page.',
        ],
      },
    ],
  },
  {
    id: 'terms',
    title: 'Terms of service',
    eyebrow: 'Terms',
    summary:
      'These terms cover your use of the shopziva website and the purchase of products from our store.',
    sections: [
      {
        heading: 'Orders & pricing',
        body: [
          'Placing an order is an offer to buy. We accept that offer when payment is successfully confirmed.',
          'Prices are shown in Ghana Cedis (GHS) and may change without notice before you complete checkout.',
        ],
      },
      {
        heading: 'Payments',
        body: [
          'Payments are processed securely by Paystack. By paying, you confirm that you are authorised to use the selected payment method.',
        ],
      },
      {
        heading: 'Product availability',
        body: [
          'If an item becomes unavailable after you order, we will contact you and offer a refund or a suitable alternative when possible.',
        ],
      },
      {
        heading: 'Acceptable use',
        body: [
          'You agree not to misuse the site, attempt unauthorised access, or interfere with checkout or payment flows.',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'To the fullest extent permitted by law, shopziva is not liable for indirect or consequential losses arising from use of the site or delays outside our control, including carrier delays.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'Questions about these terms can be sent to hello@shopziva.com.',
        ],
      },
    ],
  },
]

export const getPageById = (id: string) =>
  sitePages.find((page) => page.id === id)

export const pagePath = (id: SitePageId) => `/page/${id}`
