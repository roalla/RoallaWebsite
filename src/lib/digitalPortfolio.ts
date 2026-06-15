export type PortfolioCategory = 'website' | 'platform'

export type PortfolioItemId =
  | 'ken-effect'
  | 'roalla-site'
  | 'business-cocoon'
  | '4theblueprint'
  | 'soaring-puck'
  | 'cold-dejabru-event'

export type PortfolioItemConfig = {
  id: PortfolioItemId
  category: PortfolioCategory
  imageUrl: string | null
  brandPreview?: boolean
  tryUrl: string
  domain?: string
  contactService: 'websites-brand' | 'custom-platforms'
  i18nPrefix: 't3' | 't5' | 't4' | 't1' | 't6' | 't7'
  tagKeys?: readonly [string, string, string]
  featured?: boolean
}

/** Hero / proof grids: platforms first, then websites */
export const portfolioHeroItemOrder: readonly PortfolioItemId[] = [
  'business-cocoon',
  '4theblueprint',
  'soaring-puck',
  'ken-effect',
  'cold-dejabru-event',
  'roalla-site',
]

export const portfolioItems: PortfolioItemConfig[] = [
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
    id: '4theblueprint',
    category: 'platform',
    imageUrl: '/blueprintsnapshot.jpg',
    tryUrl: 'https://www.4theblueprint.com/',
    domain: '4theblueprint.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't7',
    tagKeys: ['t7Tag1', 't7Tag2', 't7Tag3'],
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
    id: 'cold-dejabru-event',
    category: 'website',
    imageUrl: '/ColdBru-Event.jpg',
    tryUrl: 'https://coldbru.dejabru.ca',
    domain: 'coldbru.dejabru.ca',
    contactService: 'websites-brand',
    i18nPrefix: 't6',
    tagKeys: ['t6Tag1', 't6Tag2', 't6Tag3'],
  },
  {
    id: 'roalla-site',
    category: 'website',
    imageUrl: '/roalla-snapshot.jpg',
    tryUrl: 'https://www.roalla.com',
    domain: 'roalla.com',
    contactService: 'websites-brand',
    i18nPrefix: 't5',
    tagKeys: ['t5Tag1', 't5Tag2', 't5Tag3'],
  },
]

export const portfolioImageAlts: Record<PortfolioItemId, string> = {
  'ken-effect': 'Ken Effect home page hero — speaking, events, and leadership resources',
  'roalla-site': 'ROALLA business enablement website homepage',
  'business-cocoon': 'The Business Cocoon products catalog with guided workflows',
  '4theblueprint': '4 The Blueprint course planner — certification framework, guided wizard, and lean launch path',
  'soaring-puck': 'Soaring Puck youth hockey platform dashboard',
  'cold-dejabru-event': 'Cold Deja Bru event landing page — six-step MR. COLDBRU demo, QR paths from the booth floor, and persona-specific CTAs',
}

export function sortPortfolioByDisplayOrder(
  items: PortfolioItemConfig[],
): PortfolioItemConfig[] {
  const orderIndex = new Map(portfolioHeroItemOrder.map((id, index) => [id, index]))
  return [...items].sort(
    (a, b) =>
      (orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER),
  )
}

export function getOrderedPortfolioItems(options?: {
  excludeFeatured?: boolean
  category?: PortfolioCategory
}): PortfolioItemConfig[] {
  let items = portfolioHeroItemOrder
    .map((id) => portfolioItems.find((item) => item.id === id))
    .filter((item): item is PortfolioItemConfig => item != null)
  if (options?.excludeFeatured) items = items.filter((item) => !item.featured)
  if (options?.category) items = items.filter((item) => item.category === options.category)
  return items
}

export function getPortfolioProofImages(category: PortfolioCategory): PortfolioItemConfig[] {
  return getOrderedPortfolioItems({ category }).filter((item) => item.imageUrl).slice(0, 2)
}
