import React from 'react'
import Script from 'next/script'
import { getLocale, getTranslations } from 'next-intl/server'
import DigitalBuilds from '@/components/DigitalBuilds'

export const metadata = {
  title: 'Digital Creations | ROALLA',
  description:
    'Digital Creations by Roalla — websites, brand presence, and custom platforms scoped, built, and implemented from marketing sites to purpose-built tools.',
  alternates: {
    canonical: '/services/digital',
  },
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
      itemListElement: [tBuilds('s0Title'), tBuilds('s1Title')].map((name) => ({
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
