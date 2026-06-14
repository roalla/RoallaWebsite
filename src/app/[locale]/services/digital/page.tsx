import React from 'react'
import Script from 'next/script'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import DigitalBuilds from '@/components/DigitalBuilds'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'brandJourney' })

  return {
    title: t('metadataDigitalTitle'),
    description: t('metadataDigitalDescription'),
    alternates: {
      canonical: '/services/digital',
    },
  }
}

export default async function DigitalBuildsPage() {
  const tBuilds = await getTranslations('digitalBuilds')
  const locale = await getLocale()
  const pageUrl = `https://www.roalla.com/${locale}/services/digital`

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Website and Digital Product Development',
    provider: {
      '@type': 'Organization',
      name: 'ROALLA Business Enablement Group',
      url: 'https://www.roalla.com',
    },
    areaServed: 'Global',
    url: pageUrl,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: tBuilds('title'),
      itemListElement: [tBuilds('s0Title'), tBuilds('s1Title'), tBuilds('s2Title')].map((name) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name,
        },
      })),
    },
  }

  return (
    <div className="page-shell">
      <Script
        id="digital-builds-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <DigitalBuilds />
      </div>
    </div>
  )
}
