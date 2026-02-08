export const PORTAL_CATEGORIES = [
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
  'Other',
] as const

export type PortalCategory = (typeof PORTAL_CATEGORIES)[number]

export function isPortalCategory(value: string): value is PortalCategory {
  return (PORTAL_CATEGORIES as readonly string[]).includes(value)
}
