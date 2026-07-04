import { CONTACT, SITE_URL, SOCIAL_LINKS } from '@/lib/site'
import { pageUrl } from '@/lib/page-metadata'

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path?: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path != null
        ? { item: pageUrl(locale, item.path) }
        : {}),
    })),
  }
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: 'Roalla Business Enablement Group',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  image: `${SITE_URL}/og-image.jpg`,
  description:
    'Digital Enablement—websites, custom apps, integrations, workflow automation, and AI support with accountable delivery.',
  areaServed: 'Global',
  foundingDate: '1994',
  knowsAbout: [
    'website development',
    'custom app development',
    'workflow automation',
    'system integration',
    'AI workflow support',
    'digital transformation',
    'business enablement',
  ],
  sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.youtube],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: CONTACT.phone,
    contactType: 'sales',
    email: CONTACT.email,
    areaServed: 'Global',
    availableLanguage: ['English', 'French'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Burlington',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Roalla Business Enablement Group',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: ['en-CA', 'fr-CA'],
}

export function webPageJsonLd(locale: string, path: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: pageUrl(locale, path),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
  }
}

export function contactPageJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Roalla Business Enablement Group',
    url: pageUrl(locale, '/contact'),
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
    },
  }
}

export function aboutPageJsonLd(locale: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Roalla Business Enablement Group',
    description,
    url: pageUrl(locale, '/about'),
    mainEntity: { '@id': `${SITE_URL}/#organization` },
  }
}

export function articleJsonLd({
  locale,
  slug,
  title,
  description,
  datePublished,
}: {
  locale: string
  slug: string
  title: string
  description: string
  datePublished: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    url: pageUrl(locale, `/insights/${slug}`),
    inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
  }
}

export function creativeWorkJsonLd({
  locale,
  slug,
  name,
  description,
  imageUrl,
  projectUrl,
}: {
  locale: string
  slug: string
  name: string
  description: string
  imageUrl?: string
  projectUrl: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url: projectUrl,
    image: imageUrl ? `${SITE_URL}${imageUrl}` : undefined,
    creator: { '@id': `${SITE_URL}/#organization` },
    isPartOf: {
      '@type': 'WebPage',
      url: pageUrl(locale, `/services/portfolio/${slug}`),
    },
  }
}
