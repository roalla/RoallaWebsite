import React from 'react'
import Script from 'next/script'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import TechnologyAdvisory from '@/components/TechnologyAdvisory'
import { buildPageMetadata } from '@/lib/page-metadata'
import { serviceMiniFaqJsonLd, TECHNOLOGY_PAGE_FAQ_KEYS } from '@/lib/service-faq-jsonld'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'brandJourney' })

  return buildPageMetadata({
    locale,
    path: '/services/technology-advisory',
    title: t('metadataTechnologyTitle'),
    description: t('metadataTechnologyDescription'),
    ogImage: '/images/services/technology-advisory-hero.webp',
  })
}

export default async function TechnologyAdvisoryPage() {
  const tServices = await getTranslations('services')
  const locale = await getLocale()
  const pageUrl = `https://www.roalla.com/${locale}/services/technology-advisory`

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Technology Advisory and Solution Sourcing',
    provider: {
      '@type': 'Organization',
      name: 'ROALLA Business Enablement Group',
      url: 'https://www.roalla.com',
    },
    areaServed: 'Global',
    url: pageUrl,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: tServices('technologyTitle'),
      itemListElement: [
        tServices('technologyF1'),
        tServices('technologyF2'),
        tServices('technologyF3'),
        tServices('technologyF4'),
        tServices('technologyF5'),
        tServices('technologyF6'),
        tServices('technologyF7'),
        tServices('technologyF8'),
      ].map((name) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name,
        },
      })),
    },
  }

  const faqJsonLd = serviceMiniFaqJsonLd((key) => tServices(key), TECHNOLOGY_PAGE_FAQ_KEYS)

  return (
    <div className="page-shell bg-white">
      <Script
        id="services-technology-advisory-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <Script
        id="services-technology-advisory-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <TechnologyAdvisory />
    </div>
  )
}
