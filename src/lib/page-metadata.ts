import type { Metadata } from 'next'
import { OG_IMAGE, OG_IMAGE_ALT, SITE_URL } from '@/lib/site'

const locales = ['en', 'fr'] as const

/** Canonical path plus en/fr/x-default hreflang alternates for locale-prefixed routes. */
export function localeAlternates(path: string, locale: string): NonNullable<Metadata['alternates']> {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const localized = `/${locale}${normalized}`

  return {
    canonical: localized,
    languages: {
      en: `/en${normalized}`,
      fr: `/fr${normalized}`,
      'x-default': `/en${normalized}`,
    },
  }
}

export function pageUrl(locale: string, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}/${locale}${normalized}`
}

/** Shared title, description, hreflang, Open Graph, and Twitter metadata for public pages. */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string
  path: string
  title: string
  description: string
}): Metadata {
  const ogLocale = locale === 'fr' ? 'fr_CA' : 'en_CA'

  return {
    title,
    description,
    alternates: localeAlternates(path, locale),
    openGraph: {
      title,
      description,
      url: pageUrl(locale, path),
      type: 'website',
      locale: ogLocale,
      siteName: 'Roalla Business Enablement Group',
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
      creator: '@roalla',
    },
  }
}

export const SUPPORTED_LOCALES = locales
