/** Dedicated landing page for ads and fan campaigns. */
export const fansPath = '/fans'

export const shopPath = (category: string) => `/shop/${category}`

export const homePath = '/'

/** Map legacy hash URLs to path routes. Returns null when there is nothing to migrate. */
export function legacyHashToPath(hash: string): string | null {
  const raw = hash.trim()
  if (!raw || raw === '#' || raw === '#top') return null

  if (raw.startsWith('#/')) {
    return raw.slice(1) || homePath
  }

  if (raw.startsWith('#shop')) {
    return `/${raw.slice(1)}`
  }

  return null
}
