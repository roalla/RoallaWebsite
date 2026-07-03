import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import Contact from '@/components/Contact'
import { localeAlternates } from '@/lib/page-metadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: localeAlternates('/contact'),
  }
}

export default async function ContactPage() {
  const t = await getTranslations('breadcrumb')
  return (
    <div className="page-shell">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('contact') }]} />
        <Contact />
      </div>
    </div>
  )
}
