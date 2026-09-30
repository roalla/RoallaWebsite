import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import JsonLd from '@/components/JsonLd'
import { buildPageMetadata } from '@/lib/page-metadata'
import { contactPageJsonLd, serviceInquiryPageJsonLd } from '@/lib/structured-data'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'schedule' })

  return buildPageMetadata({
    locale,
    path: '/contact',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function ContactLayout({ children, params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'schedule' })

  return (
    <>
      <JsonLd data={contactPageJsonLd(locale)} />
      <JsonLd data={serviceInquiryPageJsonLd(locale, t('metadataTitle'), t('metadataDescription'))} />
      {children}
    </>
  )
}
