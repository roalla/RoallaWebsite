import type { Metadata } from 'next'
import { OG_IMAGE, OG_IMAGE_ALT, SITE_URL } from '@/lib/site'

const locales = ['en', 'fr'] as const

/**
 * Locale-prefixed path with no trailing slash.
 * `/en/` 308-redirects to `/en`, so a trailing slash makes canonical and hreflang disagree.
 */
export function localePath(locale: string, path: string): string {
  const withSlash = path.startsWith('/') ? path : `/${path}`
  const suffix = withSlash === '/' ? '' : withSlash.replace(/\/+$/, '')
  return `/${locale}${suffix}`
}

/** Canonical path plus en/fr/x-default hreflang alternates for locale-prefixed routes. */
export function localeAlternates(path: string, locale: string): NonNullable<Metadata['alternates']> {
  const suffix = localePath('en', path).slice('/en'.length)

  return {
    canonical: localePath(locale, path),
    languages: {
      en: `/en${suffix}`,
      fr: `/fr${suffix}`,
      'x-default': `/en${suffix}`,
    },
  }
}

export function pageUrl(locale: string, path: string): string {
  return `${SITE_URL}${localePath(locale, path)}`
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
  modifiedTime?: string
  ogTitle?: string
  ogDescription?: string
}

function buildOgImages(image: string, alt: string) {
  return [{ url: image, width: 1440, height: 754, alt }]
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
  modifiedTime,
  ogTitle,
  ogDescription,
}: PageMetadataOptions): Metadata {
  const ogLocale = locale === 'fr' ? 'fr_CA' : 'en_CA'
  const alternateLocale = locale === 'fr' ? 'en_CA' : 'fr_CA'

  return {
    title,
    description,
    alternates: localeAlternates(path, locale),
    openGraph: {
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      url: pageUrl(locale, path),
      type: ogType,
      locale: ogLocale,
      alternateLocale: [alternateLocale],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      siteName: 'Roalla Business Enablement Group',
      images: buildOgImages(ogImage, ogImageAlt),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle ?? title,
      description: ogDescription ?? description,
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
  dateModified,
  ogImage = OG_IMAGE,
  ogImageAlt = OG_IMAGE_ALT,
  ogTitle,
  ogDescription,
}: PageMetadataOptions & { datePublished: string; dateModified?: string }): Metadata {
  return buildPageMetadata({
    locale,
    path,
    title,
    description,
    ogImage,
    ogImageAlt,
    ogType: 'article',
    publishedTime: datePublished,
    modifiedTime: dateModified,
    ogTitle,
    ogDescription,
  })
}

export const SUPPORTED_LOCALES = locales
