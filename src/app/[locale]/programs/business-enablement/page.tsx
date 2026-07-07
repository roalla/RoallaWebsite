import React from 'react'
import Script from 'next/script'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import Services from '@/components/Services'
import { buildPageMetadata } from '@/lib/page-metadata'
import { serviceMiniFaqJsonLd } from '@/lib/service-faq-jsonld'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'brandJourney' })

  return buildPageMetadata({
    locale,
    path: '/programs/business-enablement',
    title: t('metadataServicesTitle'),
    description: t('metadataServicesDescription'),
  })
}

export default async function ProgramsBusinessEnablementPage() {
  const tServices = await getTranslations('services')
  const locale = await getLocale()
  const pageUrl = `https://www.roalla.com/${locale}/programs/business-enablement`

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Business Consulting Services',
    provider: {
      '@type': 'Organization',
      name: 'ROALLA Business Enablement Group',
      url: 'https://www.roalla.com',
    },
    areaServed: 'Global',
    url: pageUrl,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: tServices('title'),
      itemListElement: [
        tServices('s0Title'),
        tServices('s1Title'),
        tServices('s2Title'),
        tServices('s3Title'),
        tServices('s4Title'),
        tServices('s5Title'),
      ].map((name) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name,
        },
      })),
    },
  }

  const faqJsonLd = serviceMiniFaqJsonLd((key) => tServices(key))

  return (
    <div className="page-shell">
      <Script
        id="programs-business-enablement-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <Script
        id="programs-business-enablement-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <Services />
      </div>
    </div>
  )
}
