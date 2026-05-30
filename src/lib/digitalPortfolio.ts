export type PortfolioCategory = 'website' | 'platform'

export type PortfolioItemId =
  | 'ken-effect'
  | 'roalla-site'
  | 'business-cocoon'
  | 'soaring-puck'

export type PortfolioItemConfig = {
  id: PortfolioItemId
  category: PortfolioCategory
  imageUrl: string | null
  brandPreview?: boolean
  tryUrl: string
  contactService: 'websites-brand' | 'custom-platforms'
  i18nPrefix: 't3' | 't5' | 't4' | 't1'
  featured?: boolean
}

export const portfolioItems: PortfolioItemConfig[] = [
  {
    id: 'ken-effect',
    category: 'website',
    imageUrl: '/Keneffectsite.jpg',
    tryUrl: 'https://www.keneffect.com/',
    contactService: 'websites-brand',
    i18nPrefix: 't3',
    featured: true,
  },
  {
    id: 'roalla-site',
    category: 'website',
    imageUrl: null,
    brandPreview: true,
    tryUrl: 'https://www.roalla.com',
    contactService: 'websites-brand',
    i18nPrefix: 't5',
  },
  {
    id: 'business-cocoon',
    category: 'platform',
    imageUrl: '/businesscocoontile.jpg',
    tryUrl: 'https://www.businesscocoon.com/products',
    contactService: 'custom-platforms',
    i18nPrefix: 't4',
  },
  {
    id: 'soaring-puck',
    category: 'platform',
    imageUrl: '/preflight.jpg',
    tryUrl: 'https://www.soaringpuck.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't1',
  },
]

export const portfolioImageAlts: Record<PortfolioItemId, string> = {
  'ken-effect': 'Ken Effect home page hero — speaking, events, and leadership resources',
  'roalla-site': 'ROALLA business enablement website homepage',
  'business-cocoon': 'The Business Cocoon products catalog with guided workflows',
  'soaring-puck': 'Soaring Puck youth hockey platform dashboard',
}

export function getPortfolioProofImages(category: PortfolioCategory): PortfolioItemConfig[] {
  return portfolioItems.filter((item) => item.category === category && item.imageUrl).slice(0, 2)
}
