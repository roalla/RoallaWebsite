import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import About from '@/components/About'
import JsonLd from '@/components/JsonLd'
import { buildPageMetadata } from '@/lib/page-metadata'
import { aboutPageJsonLd, breadcrumbJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return buildPageMetadata({
    locale,
    path: '/about',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('breadcrumb')
  const tAbout = await getTranslations('about')

  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: t('home'), path: '' },
            { name: t('about') },
          ]),
          aboutPageJsonLd(locale, tAbout('metadataDescription')),
        ]}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('about') }]} />
        <About />
      </div>
    </div>
  )
}
