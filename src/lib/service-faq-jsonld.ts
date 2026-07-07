export const SERVICE_MINI_FAQ_KEYS = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5'] as const

export type ServiceMiniFaqNamespace =
  | 'services'
  | 'digitalBuilds'
  | 'workshops'
  | 'digitalEvents'
  | 'websiteDesign'
  | 'foundingClient'

type FaqTranslator = (key: string) => string

/** FAQPage JSON-LD matching ServiceMiniFAQ accordion content on service landing pages. */
export function serviceMiniFaqJsonLd(t: FaqTranslator) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SERVICE_MINI_FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: t(`${key}Q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`${key}A`),
      },
    })),
  }
}
