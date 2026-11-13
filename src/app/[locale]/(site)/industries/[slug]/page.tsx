import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import IndustryHubAnalytics from '@/components/industries/IndustryHubAnalytics'
import IndustryHubPage from '@/components/industries/IndustryHubPage'
import {
  INDUSTRY_HUB_IDS,
  getIndustryHub,
  isIndustryHubId,
} from '@/lib/industry-hub-content'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, servicePageJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return INDUSTRY_HUB_IDS.flatMap((slug) => [
    { locale: 'en', slug },
    { locale: 'fr', slug },
  ])
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const hub = getIndustryHub(locale, slug)
  if (!hub) return {}
  return buildPageMetadata({
    locale,
    path: `/industries/${slug}`,
    title: hub.metadataTitle,
    description: hub.metadataDescription,
    ogImage: hub.heroImage.src,
    ogImageAlt: hub.heroImage.alt,
  })
}

export default async function IndustryHubRoutePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isIndustryHubId(slug)) notFound()
  const language = locale === 'fr' ? 'fr' : 'en'
  const hub = getIndustryHub(language, slug)
  if (!hub) notFound()

  const path = `/industries/${slug}`

  return (
    <>
      <link rel="preload" as="image" href={hub.heroImage.src} type="image/webp" fetchPriority="high" />
      <JsonLd
        data={[
          webPageJsonLd(language, path, hub.metadataTitle, hub.metadataDescription),
          ...servicePageJsonLd({
            locale: language,
            path,
            name: hub.label,
            description: hub.metadataDescription,
            serviceType:
              language === 'fr'
                ? `Solutions technologiques pour ${hub.label}`
                : `Technology solutions for ${hub.label}`,
            offers: Object.values(hub.services).map((service) => ({
              name: service.title,
              description: service.lead,
            })),
            faqs: [],
          }),
          breadcrumbJsonLd(language, [
            { name: language === 'fr' ? 'Accueil' : 'Home', path: '' },
            { name: language === 'fr' ? 'Secteurs' : 'Industries', path: '/industries' },
            { name: hub.label },
          ]),
        ]}
      />
      <IndustryHubAnalytics industry={hub.id} />
      <IndustryHubPage locale={language} hub={hub} />
    </>
  )
}
