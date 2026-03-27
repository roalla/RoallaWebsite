import React from 'react'
import Script from 'next/script'
import { getLocale, getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import Services from '@/components/Services'

export const metadata = {
  title: 'Our Services | ROALLA',
  description: 'Business consulting services for strategic planning, process optimization, team development, data analytics, innovation consulting, and digital transformation.',
  alternates: {
    canonical: '/services',
  },
}

export default async function ServicesPage() {
  const t = await getTranslations('breadcrumb')
  const tServices = await getTranslations('services')
  const tFaq = await getTranslations('faq')
  const locale = await getLocale()
  const pageUrl = `https://www.roalla.com/${locale}/services`

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

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [0, 1, 3, 7].map((idx) => ({
      '@type': 'Question',
      name: tFaq(`q${idx}`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: tFaq(`a${idx}`),
      },
    })),
  }

  return (
    <div className="min-h-screen bg-black">
      <Script
        id="services-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <Script
        id="services-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('services') }]} />
        <Services />
      </div>
    </div>
  )
}
