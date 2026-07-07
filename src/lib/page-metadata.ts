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

type PageMetadataOptions = {
  locale: string
  path: string
  title: string
  description: string
  ogImage?: string
  ogImageAlt?: string
  ogType?: 'website' | 'article'
  publishedTime?: string
}

function buildOgImages(image: string, alt: string) {
  return [{ url: image, width: 1200, height: 630, alt }]
}

/** Shared title, description, hreflang, Open Graph, and Twitter metadata for public pages. */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  ogImage = OG_IMAGE,
  ogImageAlt = OG_IMAGE_ALT,
  ogType = 'website',
  publishedTime,
}: PageMetadataOptions): Metadata {
  const ogLocale = locale === 'fr' ? 'fr_CA' : 'en_CA'
  const alternateLocale = locale === 'fr' ? 'en_CA' : 'fr_CA'

  return {
    title,
    description,
    alternates: localeAlternates(path, locale),
    openGraph: {
      title,
      description,
      url: pageUrl(locale, path),
      type: ogType,
      locale: ogLocale,
      alternateLocale: [alternateLocale],
      ...(publishedTime ? { publishedTime } : {}),
      siteName: 'Roalla Business Enablement Group',
      images: buildOgImages(ogImage, ogImageAlt),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@roalla',
    },
  }
}

/** Article pages: Open Graph type article, published time, and optional hero image. */
export function buildArticlePageMetadata({
  locale,
  path,
  title,
  description,
  datePublished,
  ogImage = OG_IMAGE,
  ogImageAlt = OG_IMAGE_ALT,
}: PageMetadataOptions & { datePublished: string }): Metadata {
  return buildPageMetadata({
    locale,
    path,
    title,
    description,
    ogImage,
    ogImageAlt,
    ogType: 'article',
    publishedTime: datePublished,
  })
}

export const SUPPORTED_LOCALES = locales
