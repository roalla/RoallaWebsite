import type { Metadata } from 'next'

const locales = ['en', 'fr'] as const

/** Canonical path plus en/fr hreflang alternates for locale-prefixed routes. */
export function localeAlternates(path: string): NonNullable<Metadata['alternates']> {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return {
    canonical: normalized,
    languages: Object.fromEntries(locales.map((locale) => [locale, `/${locale}${normalized}`])),
  }
}
