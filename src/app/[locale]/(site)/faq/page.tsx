import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import FAQ from '@/components/FAQ'
import JsonLd from '@/components/JsonLd'
import { FAQ_INDICES } from '@/lib/faq'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'faq' })

  return buildPageMetadata({
    locale,
    path: '/faq',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('breadcrumb')
  const tFaq = await getTranslations('faq')

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_INDICES.map((i) => ({
      '@type': 'Question',
      name: tFaq(`q${i}`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: tFaq(`a${i}`),
      },
    })),
  }

  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: t('home'), path: '' },
            { name: t('faq') },
          ]),
          faqStructuredData,
        ]}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('faq') }]} />
        <FAQ />
      </div>
    </div>
  )
}
