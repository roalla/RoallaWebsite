import React from 'react'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import DigitalCreations from '@/components/DigitalCreations'

export const metadata = {
  title: 'Our Work | ROALLA',
  description: 'Sites, platforms, and tools built by Roalla — Ken Effect, Business Cocoon, Soaring Puck, and our own site. Proof of our digital build capability.',
  alternates: {
    canonical: '/digital-creations',
  },
}

export default async function DigitalCreationsPage() {
  const t = await getTranslations('breadcrumb')
  return (
    <div className="page-shell">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('ourWork') }]} />
        <DigitalCreations />
      </div>
    </div>
  )
}
