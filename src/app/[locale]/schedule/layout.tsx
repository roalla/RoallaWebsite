import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/page-metadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'schedule' })

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: localeAlternates('/schedule'),
  }
}

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
