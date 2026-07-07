import React from 'react'
import Script from 'next/script'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import FoundingClientLanding from '@/components/FoundingClientLanding'
import { buildPageMetadata } from '@/lib/page-metadata'
import { serviceMiniFaqJsonLd } from '@/lib/service-faq-jsonld'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'foundingClient' })

  return buildPageMetadata({
    locale,
    path: '/founding-client',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function FoundingClientPage() {
  const t = await getTranslations('foundingClient')
  const locale = await getLocale()
  const pageUrl = `https://www.roalla.com/${locale}/founding-client`

  const faqJsonLd = serviceMiniFaqJsonLd((key) => t(key))

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: t('offerTitle'),
    description: t('metadataDescription'),
    price: '999',
    priceCurrency: 'CAD',
    url: pageUrl,
    seller: {
      '@type': 'Organization',
      name: 'ROALLA Business Enablement Group',
      url: 'https://www.roalla.com',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Canada',
    },
  }

  return (
    <div className="page-shell">
      <Script
        id="founding-client-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <Script
        id="founding-client-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <FoundingClientLanding />
      </div>
    </div>
  )
}
