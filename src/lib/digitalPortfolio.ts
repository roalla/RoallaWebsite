export type PortfolioCategory = 'website' | 'platform'

export type PortfolioProjectType = 'client' | 'roalla-product' | 'roalla-site'

export type PortfolioItemId =
  | 'ken-effect'
  | 'roalla-site'
  | 'business-cocoon'
  | '4theblueprint'
  | 'soaring-puck'
  | 'cold-dejabru-event'
  | 'valentir-green-tech'
  | 'boothlio'
  | 'pitch-hotshots'
  | 'my360vision'

export type PortfolioVerticalId = 'fleet'

export type PortfolioItemConfig = {
  id: PortfolioItemId
  category: PortfolioCategory
  projectType: PortfolioProjectType
  imageUrl: string | null
  brandPreview?: boolean
  tryUrl: string
  domain?: string
  contactService: 'websites-brand' | 'custom-platforms'
  i18nPrefix: 't3' | 't5' | 't4' | 't1' | 't6' | 't7' | 't8' | 't9' | 't10' | 't11'
  tagKeys?: readonly [string, string, string]
  /** Shown in the featured case-study block for this category */
  featuredCategory?: PortfolioCategory
}

export type PortfolioVerticalConfig = {
  id: PortfolioVerticalId
  itemIds: readonly [PortfolioItemId, PortfolioItemId]
  contactService: 'websites-brand' | 'custom-platforms'
  i18nPrefix: 'verticalFleet'
}

/** Hero / proof grids: platforms first, then websites */
export const portfolioHeroItemOrder: readonly PortfolioItemId[] = [
  'business-cocoon',
  '4theblueprint',
  'boothlio',
  'valentir-green-tech',
  'my360vision',
  'soaring-puck',
  'pitch-hotshots',
  'ken-effect',
  'cold-dejabru-event',
  'roalla-site',
]

export const portfolioVerticals: PortfolioVerticalConfig[] = [
  {
    id: 'fleet',
    itemIds: ['valentir-green-tech', 'my360vision'],
    contactService: 'custom-platforms',
    i18nPrefix: 'verticalFleet',
  },
]

export const portfolioItems: PortfolioItemConfig[] = [
  {
    id: 'business-cocoon',
    category: 'platform',
    projectType: 'roalla-product',
    imageUrl: '/businesscocoon_image.jpg',
    tryUrl: 'https://www.businesscocoon.com/products',
    domain: 'businesscocoon.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't4',
    tagKeys: ['t4Tag1', 't4Tag2', 't4Tag3'],
    featuredCategory: 'platform',
  },
  {
    id: '4theblueprint',
    category: 'platform',
    projectType: 'roalla-product',
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
    projectType: 'roalla-product',
    imageUrl: '/soaring-puck.jpg',
    tryUrl: 'https://www.soaringpuck.com',
    domain: 'soaringpuck.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't1',
    tagKeys: ['t1Tag1', 't1Tag2', 't1Tag3'],
  },
  {
    id: 'boothlio',
    category: 'platform',
    projectType: 'roalla-product',
    imageUrl: '/boothlio-pic.jpg',
    tryUrl: 'https://boothlio.com',
    domain: 'boothlio.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't9',
    tagKeys: ['t9Tag1', 't9Tag2', 't9Tag3'],
  },
  {
    id: 'pitch-hotshots',
    category: 'platform',
    projectType: 'roalla-product',
    imageUrl: '/pitchhotshotsnapshot.jpg',
    tryUrl: 'https://www.pitchhotshot.com/',
    domain: 'pitchhotshot.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't10',
    tagKeys: ['t10Tag1', 't10Tag2', 't10Tag3'],
  },
  {
    id: 'my360vision',
    category: 'platform',
    projectType: 'roalla-product',
    imageUrl: '/360visionsnapshot.jpg',
    tryUrl: 'https://www.my360vision.com/',
    domain: 'my360vision.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't11',
    tagKeys: ['t11Tag1', 't11Tag2', 't11Tag3'],
  },
  {
    id: 'ken-effect',
    category: 'website',
    projectType: 'client',
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
    projectType: 'client',
    imageUrl: '/ColdBru-Event.jpg',
    tryUrl: 'https://coldbru.dejabru.ca',
    domain: 'coldbru.dejabru.ca',
    contactService: 'websites-brand',
    i18nPrefix: 't6',
    tagKeys: ['t6Tag1', 't6Tag2', 't6Tag3'],
  },
  {
    id: 'valentir-green-tech',
    category: 'website',
    projectType: 'client',
    imageUrl: '/pulsavantsolution.jpg',
    tryUrl: 'https://valentir.up.railway.app/',
    domain: 'valentir.up.railway.app',
    contactService: 'websites-brand',
    i18nPrefix: 't8',
    tagKeys: ['t8Tag1', 't8Tag2', 't8Tag3'],
    featuredCategory: 'website',
  },
  {
    id: 'roalla-site',
    category: 'website',
    projectType: 'roalla-site',
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
  'valentir-green-tech':
    'Valentir Green Tech homepage — fleet video, GPS tracking, tire monitoring, cargo seals, and ValenInsights for Canadian SMB fleets',
  boothlio: 'Boothlio event experience platform — innovate attendee engagement at trade shows and business events',
  'pitch-hotshots':
    'Pitch Hotshots — rehearse investor pitches and sales talks with AI scoring, delivery metrics, and stage-ready feedback',
  my360vision:
    'My360Vision fleet telematics — live fleet map, plain-language alerts, GPS and driver-phone tracking, and audit-ready exports for Canadian SMB fleets',
}

export type PortfolioScheduleQuery = {
  service: PortfolioItemConfig['contactService']
  reference: PortfolioItemId | PortfolioVerticalId
}

export function getPortfolioItem(id: PortfolioItemId): PortfolioItemConfig | undefined {
  return portfolioItems.find((item) => item.id === id)
}

export function isFeaturedItem(item: PortfolioItemConfig): boolean {
  return item.featuredCategory != null
}

export function getFeaturedItems(category?: PortfolioCategory): PortfolioItemConfig[] {
  const featured = portfolioItems.filter((item) => item.featuredCategory != null)
  if (category) return featured.filter((item) => item.featuredCategory === category)
  return sortPortfolioByDisplayOrder(featured)
}

export function buildPortfolioScheduleQuery(
  item: PortfolioItemConfig | PortfolioVerticalConfig,
  reference?: PortfolioItemId | PortfolioVerticalId,
): PortfolioScheduleQuery {
  if ('itemIds' in item) {
    return { service: item.contactService, reference: reference ?? item.id }
  }
  return { service: item.contactService, reference: reference ?? item.id }
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
  if (options?.excludeFeatured) items = items.filter((item) => !isFeaturedItem(item))
  if (options?.category) items = items.filter((item) => item.category === options.category)
  return items
}

export function getPortfolioProofImages(category: PortfolioCategory): PortfolioItemConfig[] {
  return getOrderedPortfolioItems({ category }).filter((item) => item.imageUrl).slice(0, 2)
}

export function isValidPortfolioReference(value: string | null): value is PortfolioItemId | PortfolioVerticalId {
  if (!value) return false
  if (portfolioVerticals.some((v) => v.id === value)) return true
  return portfolioItems.some((item) => item.id === value)
}
