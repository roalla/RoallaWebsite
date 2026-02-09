/** Link-type categories for portal links (external, LinkedIn, internal tool). */
export const PORTAL_LINK_TYPES = [
  'LinkedIn',
  'External',
  'Internal tool',
  'Other',
] as const

export type PortalLinkType = (typeof PORTAL_LINK_TYPES)[number]

export function isPortalLinkType(value: string): value is PortalLinkType {
  return (PORTAL_LINK_TYPES as readonly string[]).includes(value)
}

export const PORTAL_CATEGORIES = [
  ...PORTAL_LINK_TYPES,
  'Strategic Planning',
  'Execution',
  'Operational Management',
  'Risk Management',
  'Compliance',
  'Artificial Intelligence',
  'Marketing',
  'Accessibility',
  'Information Technology',
  'Security',
  'Proposal Management',
] as const

export type PortalCategory = (typeof PORTAL_CATEGORIES)[number]

export function isPortalCategory(value: string): value is PortalCategory {
  return (PORTAL_CATEGORIES as readonly string[]).includes(value)
}
