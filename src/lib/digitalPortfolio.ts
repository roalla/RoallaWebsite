export type PortfolioCategory = 'website' | 'platform'

export type PortfolioProjectType = 'client' | 'roalla-product'

export type PortfolioItemId =
  | 'business-cocoon'
  | '4theblueprint'
  | 'soaring-puck'
  | 'cold-dejabru-event'
  | 'valentir-green-tech'
  | 'boothlio'
  | 'pitch-hotshots'
  | 'my360vision'
  | 'goalie-stop'
  | 'grcstatus'
  | 'unjargonit'
  | 'kaylan-kaptures'
  | 'hockey-gaze'

export type PortfolioVerticalId = 'fleet'

export type PortfolioIndustryCategoryId =
  | 'fleet-logistics'
  | 'sports-recreation'
  | 'events-trade-shows'
  | 'education-training'
  | 'professional-services'
  | 'business-platforms'

export type PortfolioItemConfig = {
  id: PortfolioItemId
  category: PortfolioCategory
  projectType: PortfolioProjectType
  imageUrl: string | null
  brandPreview?: boolean
  tryUrl: string
  domain?: string
  contactService: 'websites-brand' | 'custom-platforms'
  i18nPrefix: 't5' | 't4' | 't1' | 't6' | 't7' | 't8' | 't9' | 't10' | 't11' | 't12' | 't13' | 't14' | 't15' | 't16'
  tagKeys?: readonly [string, string, string]
  /** Shown in the featured case-study block for this category */
  featuredCategory?: PortfolioCategory
  /** Primary SMB industry bucket for jump navigation */
  industryCategory: PortfolioIndustryCategoryId
}

export type PortfolioVerticalConfig = {
  id: PortfolioVerticalId
  itemIds: readonly [PortfolioItemId, PortfolioItemId]
  contactService: 'websites-brand' | 'custom-platforms'
  i18nPrefix: 'verticalFleet'
}

export type PortfolioIndustryCategoryConfig = {
  id: PortfolioIndustryCategoryId
  itemIds: readonly PortfolioItemId[]
  contactService: 'websites-brand' | 'custom-platforms'
  i18nPrefix:
    | 'industryFleet'
    | 'industrySports'
    | 'industryEvents'
    | 'industryEducation'
    | 'industryProfessional'
    | 'industryPlatforms'
  /** When set, the primary scroll target for this industry band */
  sectionAnchor?: string
}

/** Hero / proof grids: platforms first, then websites */
export const portfolioHeroItemOrder: readonly PortfolioItemId[] = [
  'business-cocoon',
  'grcstatus',
  '4theblueprint',
  'unjargonit',
  'boothlio',
  'valentir-green-tech',
  'my360vision',
  'soaring-puck',
  'hockey-gaze',
  'pitch-hotshots',
  'kaylan-kaptures',
  'goalie-stop',
  'cold-dejabru-event',
]

/** Domains shown as quick-open chips in the portfolio hero. Featured pitch leads. */
export const portfolioHeroLiveChipIds: readonly PortfolioItemId[] = [
  'pitch-hotshots',
  ...portfolioHeroItemOrder.filter((id) => id !== 'pitch-hotshots').slice(0, 7),
]

/** Homepage Outcomes strip — live sites customers can open in one click */
export const homeProofItemIds = [
  'pitch-hotshots',
  'kaylan-kaptures',
  'goalie-stop',
] as const satisfies readonly PortfolioItemId[]

/** Homepage “What we build” capability → live example */
export const homeCapabilityExamples = {
  websites: 'kaylan-kaptures',
  platforms: 'pitch-hotshots',
  automation: 'boothlio',
} as const satisfies Record<string, PortfolioItemId>

/** Curated entry paths for visitors browsing the portfolio grid. */
export const portfolioCuratedPaths = [
  {
    id: 'marketing-site',
    itemIds: ['kaylan-kaptures', 'goalie-stop', 'hockey-gaze'] as const satisfies readonly PortfolioItemId[],
  },
  {
    id: 'custom-platform',
    itemIds: ['grcstatus', 'business-cocoon', 'boothlio'] as const satisfies readonly PortfolioItemId[],
  },
  {
    id: 'education',
    itemIds: ['4theblueprint', 'unjargonit'] as const satisfies readonly PortfolioItemId[],
  },
] as const

export const portfolioVerticals: PortfolioVerticalConfig[] = [
  {
    id: 'fleet',
    itemIds: ['valentir-green-tech', 'my360vision'],
    contactService: 'custom-platforms',
    i18nPrefix: 'verticalFleet',
  },
]

/** SMB-friendly industry buckets for portfolio jump navigation */
export const portfolioIndustryCategories: PortfolioIndustryCategoryConfig[] = [
  {
    id: 'fleet-logistics',
    itemIds: ['valentir-green-tech', 'my360vision'],
    contactService: 'custom-platforms',
    i18nPrefix: 'industryFleet',
    sectionAnchor: 'fleet-vertical',
  },
  {
    id: 'sports-recreation',
    itemIds: ['soaring-puck', 'hockey-gaze', 'goalie-stop'],
    contactService: 'websites-brand',
    i18nPrefix: 'industrySports',
  },
  {
    id: 'events-trade-shows',
    itemIds: ['boothlio', 'cold-dejabru-event'],
    contactService: 'websites-brand',
    i18nPrefix: 'industryEvents',
  },
  {
    id: 'education-training',
    itemIds: ['4theblueprint', 'unjargonit'],
    contactService: 'custom-platforms',
    i18nPrefix: 'industryEducation',
  },
  {
    id: 'professional-services',
    itemIds: ['grcstatus', 'kaylan-kaptures'],
    contactService: 'websites-brand',
    i18nPrefix: 'industryProfessional',
  },
  {
    id: 'business-platforms',
    itemIds: ['business-cocoon', 'pitch-hotshots'],
    contactService: 'custom-platforms',
    i18nPrefix: 'industryPlatforms',
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
    industryCategory: 'business-platforms',
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
    industryCategory: 'education-training',
  },
  {
    id: 'grcstatus',
    category: 'platform',
    projectType: 'roalla-product',
    imageUrl: '/grcstatussnapshot.jpg',
    tryUrl: 'https://www.grcstatus.com/',
    domain: 'grcstatus.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't13',
    tagKeys: ['t13Tag1', 't13Tag2', 't13Tag3'],
    industryCategory: 'professional-services',
  },
  {
    id: 'unjargonit',
    category: 'platform',
    projectType: 'roalla-product',
    imageUrl: '/unjargonitsnapshot.jpg',
    tryUrl: 'https://www.unjargonit.com/',
    domain: 'unjargonit.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't14',
    tagKeys: ['t14Tag1', 't14Tag2', 't14Tag3'],
    industryCategory: 'education-training',
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
    industryCategory: 'sports-recreation',
  },
  {
    id: 'hockey-gaze',
    category: 'platform',
    projectType: 'roalla-product',
    imageUrl: '/Hockeygaze_snapshot.jpg',
    tryUrl: 'https://www.hockeygaze.com/',
    domain: 'hockeygaze.com',
    contactService: 'custom-platforms',
    i18nPrefix: 't16',
    tagKeys: ['t16Tag1', 't16Tag2', 't16Tag3'],
    industryCategory: 'sports-recreation',
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
    industryCategory: 'events-trade-shows',
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
    featuredCategory: 'platform',
    industryCategory: 'business-platforms',
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
    industryCategory: 'fleet-logistics',
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
    industryCategory: 'events-trade-shows',
  },
  {
    id: 'valentir-green-tech',
    category: 'website',
    projectType: 'client',
    imageUrl: '/pulsavantsolution.jpg',
    tryUrl: 'https://valentir.ca/',
    domain: 'valentir.ca',
    contactService: 'websites-brand',
    i18nPrefix: 't8',
    tagKeys: ['t8Tag1', 't8Tag2', 't8Tag3'],
    featuredCategory: 'website',
    industryCategory: 'fleet-logistics',
  },
  {
    id: 'goalie-stop',
    category: 'website',
    projectType: 'client',
    imageUrl: '/goaliestop_sample.jpg',
    tryUrl: 'https://www.ryanmuncegoaltending.com/',
    domain: 'ryanmuncegoaltending.com',
    contactService: 'websites-brand',
    i18nPrefix: 't12',
    tagKeys: ['t12Tag1', 't12Tag2', 't12Tag3'],
    industryCategory: 'sports-recreation',
  },
  {
    id: 'kaylan-kaptures',
    category: 'website',
    projectType: 'client',
    imageUrl: '/kaylankaptures_snapshot.jpg',
    tryUrl: 'https://www.kaylankaptures.com/',
    domain: 'kaylankaptures.com',
    contactService: 'websites-brand',
    i18nPrefix: 't15',
    tagKeys: ['t15Tag1', 't15Tag2', 't15Tag3'],
    industryCategory: 'professional-services',
  },
]

/** Verifiable counts derived from the published portfolio records in this repository. */
export const portfolioMetrics = {
  total: portfolioItems.length,
  websites: portfolioItems.filter((item) => item.category === 'website').length,
  digitalProducts: portfolioItems.filter((item) => item.category === 'platform').length,
} as const

export const portfolioImageAlts: Record<PortfolioItemId, string> = {
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
    'My360Vision homepage — multi-industry IoT management platform with industry profile cards for property, venues, healthcare, and fleet',
  'goalie-stop':
    'Ryan Munce Goaltending homepage — elite goaltending camps, private training, instructor profiles, and Book with Ryan booking paths',
  grcstatus:
    'GRC Status homepage — compliance readiness snapshot for SOC 2, HIPAA, and NIST CSF with live preview and free assessment CTAs',
  unjargonit:
    'UnJargon It homepage — plain-language tech learning tracks for students, parents, and teachers with progress dashboards and hands-on playgrounds',
  'kaylan-kaptures':
    'Kaylan Kaptures homepage — photography brand site with scenic hero, Book a Session CTA, and portfolio path',
  'hockey-gaze':
    'Hockey Gaze app homepage — position-specific hockey vision and decision training with a 45-second free drill',
}

export type PortfolioScheduleQuery = {
  service: PortfolioItemConfig['contactService']
  reference: PortfolioItemId | PortfolioVerticalId | PortfolioIndustryCategoryId
  intent?: 'website' | 'platform' | 'automation' | 'ai-support' | 'digital-events'
  need?: string
}

export const digitalBuildScheduleNeed = {
  websites: undefined,
  platforms: undefined,
  automation: 'automation',
  'ai-support': 'ai-support',
} as const satisfies Record<string, string | undefined>

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
  item: PortfolioItemConfig | PortfolioVerticalConfig | PortfolioIndustryCategoryConfig,
  reference?: PortfolioItemId | PortfolioVerticalId | PortfolioIndustryCategoryId,
  need?: string,
  intent?: PortfolioScheduleQuery['intent'],
): PortfolioScheduleQuery {
  if ('itemIds' in item && 'i18nPrefix' in item && 'id' in item) {
    const industry = item as PortfolioIndustryCategoryConfig | PortfolioVerticalConfig
    return {
      service: industry.contactService,
      reference: reference ?? industry.id,
      ...(intent ? { intent } : {}),
      ...(need ? { need } : {}),
    }
  }
  const portfolioItem = item as PortfolioItemConfig
  return {
    service: portfolioItem.contactService,
    reference: reference ?? portfolioItem.id,
    ...(intent ? { intent } : {}),
    ...(need ? { need } : {}),
  }
}

export function getPortfolioIndustryCategory(
  id: PortfolioIndustryCategoryId,
): PortfolioIndustryCategoryConfig | undefined {
  return portfolioIndustryCategories.find((category) => category.id === id)
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

export function isValidPortfolioReference(
  value: string | null,
): value is PortfolioItemId | PortfolioVerticalId | PortfolioIndustryCategoryId {
  if (!value) return false
  if (portfolioVerticals.some((v) => v.id === value)) return true
  if (portfolioIndustryCategories.some((c) => c.id === value)) return true
  return portfolioItems.some((item) => item.id === value)
}
