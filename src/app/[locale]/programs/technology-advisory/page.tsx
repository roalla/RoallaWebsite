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
    path: '/programs/technology-advisory',
    title: t('metadataTechnologyTitle'),
    description: t('metadataTechnologyDescription'),
  })
}

export default async function ProgramsTechnologyAdvisoryPage() {
  const tServices = await getTranslations('services')
  const locale = await getLocale()
  const pageUrl = `https://www.roalla.com/${locale}/programs/technology-advisory`

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
    <div className="page-shell">
      <Script
        id="programs-technology-advisory-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <Script
        id="programs-technology-advisory-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <TechnologyAdvisory />
      </div>
    </div>
  )
}
