import React from 'react'
import Script from 'next/script'
import { getLocale, getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import DigitalBuilds from '@/components/DigitalBuilds'

export const metadata = {
  title: 'Websites & Digital | ROALLA',
  description: 'Website design, brand presence, and custom digital platforms built by Roalla — from marketing sites to purpose-built tools.',
  alternates: {
    canonical: '/services/digital',
  },
}

export default async function DigitalBuildsPage() {
  const t = await getTranslations('breadcrumb')
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
    <div className="min-h-screen bg-black">
      <Script
        id="digital-builds-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb
          items={[
            { label: t('home'), href: '/' },
            { label: t('services'), href: '/services' },
            { label: t('websitesAndDigital') },
          ]}
        />
        <DigitalBuilds />
      </div>
    </div>
  )
}
