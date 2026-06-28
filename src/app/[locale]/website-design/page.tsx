import React from 'react'
import Script from 'next/script'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import WebsiteDesignLanding from '@/components/WebsiteDesignLanding'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'websiteDesign' })

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: '/website-design',
    },
  }
}

export default async function WebsiteDesignPage() {
  const t = await getTranslations('websiteDesign')
  const locale = await getLocale()
  const pageUrl = `https://www.roalla.com/${locale}/website-design`

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t('metadataTitle'),
    description: t('metadataDescription'),
    serviceType: 'Business Website Design',
    provider: {
      '@type': 'Organization',
      name: 'ROALLA Business Enablement Group',
      url: 'https://www.roalla.com',
    },
    areaServed: ['CA', 'US', 'Global'],
    url: pageUrl,
    offers: {
      '@type': 'Offer',
      name: t('offerName'),
      description: t('offerDesc'),
    },
  }

  return (
    <div className="page-shell">
      <Script
        id="website-design-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <WebsiteDesignLanding />
      </div>
    </div>
  )
}
