import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import UseCases from '@/components/UseCases'
import JsonLd from '@/components/JsonLd'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'useCases' })

  return buildPageMetadata({
    locale,
    path: '/use-cases',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function UseCasesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('breadcrumb')

  return (
    <div className="page-shell">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t('home'), path: '' },
          { name: t('useCases') },
        ])}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('useCases') }]} />
        <UseCases />
      </div>
    </div>
  )
}
