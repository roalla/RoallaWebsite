import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import LegalDocument from '@/components/LegalDocument'
import JsonLd from '@/components/JsonLd'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal.aiPolicy' })

  return buildPageMetadata({
    locale,
    path: '/ai-policy',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function AiPolicyPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('breadcrumb')
  const tAi = await getTranslations('legal.aiPolicy')

  return (
    <div className="page-shell">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t('home'), path: '' },
          { name: tAi('title') },
        ])}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: tAi('title') }]} />
        <LegalDocument doc="aiPolicy" sectionCount={7} />
      </div>
    </div>
  )
}
