export const SERVICE_MINI_FAQ_KEYS = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5'] as const

/** Keep package FAQ short: price, discovery, visibility, compliance, hosting. */
export const FOUNDING_CLIENT_FAQ_KEYS = ['faq1', 'faq9', 'faq7', 'faq8', 'faq3'] as const

export const SERVICE_PAGE_FAQ_KEYS = ['faq1', 'faq2', 'faq3'] as const

export type ServiceMiniFaqNamespace =
  | 'services'
  | 'digitalBuilds'
  | 'workshops'
  | 'digitalEvents'
  | 'websiteDesign'
  | 'foundingClient'

type FaqTranslator = (key: string) => string

/** FAQPage JSON-LD matching ServiceMiniFAQ accordion content on service landing pages. */
export function serviceMiniFaqJsonLd(
  t: FaqTranslator,
  keys: readonly string[] = SERVICE_MINI_FAQ_KEYS,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: keys.map((key) => ({
      '@type': 'Question',
      name: t(`${key}Q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`${key}A`),
      },
    })),
  }
}
