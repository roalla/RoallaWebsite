import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import FAQ from '@/components/FAQ'
import { localeAlternates } from '@/lib/page-metadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'faq' })

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: localeAlternates('/faq'),
  }
}

export default async function FAQPage() {
  const t = await getTranslations('breadcrumb')
  const tFaq = await getTranslations('faq')
  const faqKeys = [0, 1, 2, 3, 4, 5, 6, 7] as const
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqKeys.map((i) => ({
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('faq') }]} />
        <FAQ />
      </div>
    </div>
  )
}
