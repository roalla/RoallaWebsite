import React from 'react'
import Script from 'next/script'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import Workshops from '@/components/Workshops'
import { buildPageMetadata } from '@/lib/page-metadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'brandJourney' })

  return buildPageMetadata({
    locale,
    path: '/programs/workshops',
    title: t('metadataWorkshopsTitle'),
    description: t('metadataWorkshopsDescription'),
  })
}

export default async function ProgramsWorkshopsPage() {
  const tWorkshops = await getTranslations('workshops')
  const locale = await getLocale()
  const pageUrl = `https://www.roalla.com/${locale}/programs/workshops`

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Business Workshops and Training',
    provider: {
      '@type': 'Organization',
      name: 'ROALLA Business Enablement Group',
      url: 'https://www.roalla.com',
    },
    areaServed: 'Global',
    url: pageUrl,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: tWorkshops('title'),
      itemListElement: [0, 1, 2, 3].map((i) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: tWorkshops(`topic${i}Title` as 'topic0Title'),
        },
      })),
    },
  }

  return (
    <div className="page-shell">
      <Script
        id="programs-workshops-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <Workshops />
      </div>
    </div>
  )
}
