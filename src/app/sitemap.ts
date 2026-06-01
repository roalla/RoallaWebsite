import { MetadataRoute } from 'next'

const baseUrl = 'https://www.roalla.com'
const locales = ['en', 'fr'] as const

const paths = [
  '',
  '/services',
  '/services/digital',
  '/digital-creations',
  '/about',
  '/assessment',
  '/faq',
  '/contact',
  '/schedule',
] as const

const priorities: Record<string, number> = {
  '': 1,
  '/services': 0.9,
  '/services/digital': 0.85,
  '/digital-creations': 0.85,
  '/about': 0.8,
  '/assessment': 0.7,
  '/faq': 0.7,
  '/contact': 0.8,
  '/schedule': 0.8,
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return paths.flatMap((path) =>
    locales.map((locale) => {
      const localizedPath = path ? `/${locale}${path}` : `/${locale}`
      const languages = Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}${path}`]),
      ) as Record<string, string>

      return {
        url: `${baseUrl}${localizedPath}`,
        lastModified,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: priorities[path] ?? 0.7,
        alternates: { languages },
      }
    }),
  )
}
