import React from 'react'
import Script from 'next/script'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import DigitalCreations from '@/components/DigitalCreations'
import { getOrderedPortfolioItems, portfolioImageAlts } from '@/lib/digitalPortfolio'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'digitalCreations' })

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: '/services/portfolio',
      languages: {
        en: '/en/services/portfolio',
        fr: '/fr/services/portfolio',
      },
    },
    openGraph: {
      title: t('metadataTitle'),
      description: t('metadataDescription'),
      url: `https://www.roalla.com/${locale}/services/portfolio`,
      type: 'website',
    },
  }
}

export default async function DigitalPortfolioPage() {
  const t = await getTranslations('breadcrumb')
  const locale = await getLocale()
  const pageUrl = `https://www.roalla.com/${locale}/services/portfolio`

  const portfolioJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ROALLA Digital Portfolio',
    description: 'Live websites and custom platforms built by Roalla.',
    url: pageUrl,
    itemListElement: getOrderedPortfolioItems().map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: item.domain ?? item.id,
        url: item.tryUrl,
        image: item.imageUrl ? `https://www.roalla.com${item.imageUrl}` : undefined,
        description: portfolioImageAlts[item.id],
      },
    })),
  }

  return (
    <div className="page-shell">
      <Script
        id="portfolio-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioJsonLd) }}
      />
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <Breadcrumb
          items={[
            { label: t('home'), href: '/' },
            { label: t('services'), href: '/services' },
            { label: t('digitalCreations'), href: '/services/digital' },
            { label: t('ourWork') },
          ]}
        />
        <DigitalCreations />
      </div>
    </div>
  )
}
