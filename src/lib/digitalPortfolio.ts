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
  domain?: string
  contactService: 'websites-brand' | 'custom-platforms'
  i18nPrefix: 't3' | 't5' | 't4' | 't1'
  tagKeys?: readonly [string, string, string]
  featured?: boolean
}

export const portfolioItems: PortfolioItemConfig[] = [
  {
    id: 'ken-effect',
    category: 'website',
    imageUrl: '/Keneffectsite.jpg',
    tryUrl: 'https://www.keneffect.com/',
    domain: 'keneffect.com',
    contactService: 'websites-brand',
    i18nPrefix: 't3',
    tagKeys: ['t3Tag1', 't3Tag2', 't3Tag3'],
  },
  {
    id: 'roalla-site',
    category: 'website',
    imageUrl: null,
    brandPreview: true,
    tryUrl: 'https://www.roalla.com',
    domain: 'roalla.com',
    contactService: 'websites-brand',
    i18nPrefix: 't5',
    tagKeys: ['t5Tag1', 't5Tag2', 't5Tag3'],
  },
  {
    id: 'business-cocoon',
    category: 'platform',
    imageUrl: '/businesscocoon_image.jpg',
    tryUrl: 'https://www.businesscocoon.com/products',
    domain: 'businesscocoon.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't4',
    tagKeys: ['t4Tag1', 't4Tag2', 't4Tag3'],
    featured: true,
  },
  {
    id: 'soaring-puck',
    category: 'platform',
    imageUrl: '/soaring-puck.jpg',
    tryUrl: 'https://www.soaringpuck.com',
    domain: 'soaringpuck.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't1',
    tagKeys: ['t1Tag1', 't1Tag2', 't1Tag3'],
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
