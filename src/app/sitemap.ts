import { MetadataRoute } from 'next'
import { INSIGHT_SLUGS } from '@/lib/insights'
import { CASE_STUDY_SLUGS } from '@/lib/portfolio-case-studies'

const baseUrl = 'https://www.roalla.com'
const locales = ['en', 'fr'] as const

const paths = [
  '',
  '/services/digital',
  '/services/digital-events',
  '/services/portfolio',
  '/programs/business-enablement',
  '/programs/workshops',
  '/website-design',
  '/founding-client',
  '/about',
  '/assessment',
  '/faq',
  '/use-cases',
  '/contact',
  '/schedule',
  '/insights',
  ...INSIGHT_SLUGS.map((slug) => `/insights/${slug}`),
  ...CASE_STUDY_SLUGS.map((slug) => `/services/portfolio/${slug}`),
] as const

const priorities: Record<string, number> = {
  '': 1,
  '/services/digital': 0.95,
  '/services/portfolio': 0.9,
  '/website-design': 0.88,
  '/founding-client': 0.86,
  '/services/digital-events': 0.85,
  '/programs/business-enablement': 0.6,
  '/programs/workshops': 0.55,
  '/about': 0.8,
  '/assessment': 0.7,
  '/faq': 0.7,
  '/use-cases': 0.85,
  '/contact': 0.8,
  '/schedule': 0.85,
  '/insights': 0.75,
}

const changeFrequency = (path: string): MetadataRoute.Sitemap[number]['changeFrequency'] => {
  if (path === '') return 'weekly'
  if (path.startsWith('/insights')) return 'monthly'
  return 'monthly'
}

const priority = (path: string): number => {
  if (path.startsWith('/insights/')) return 0.72
  if (path.startsWith('/services/portfolio/')) return 0.82
  return priorities[path] ?? 0.7
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString()

  return paths.flatMap((path) =>
    locales.map((locale) => {
      const localizedPath = path ? `/${locale}${path}` : `/${locale}`
      const languages = {
        en: `${baseUrl}/en${path}`,
        fr: `${baseUrl}/fr${path}`,
        'x-default': `${baseUrl}/en${path}`,
      } as Record<string, string>

      return {
        url: `${baseUrl}${localizedPath}`,
        lastModified,
        changeFrequency: changeFrequency(path),
        priority: priority(path),
        alternates: { languages },
      }
    }),
  )
}
