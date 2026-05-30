import React from 'react'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import DigitalCreations from '@/components/DigitalCreations'

export const metadata = {
  title: 'Our Digital Work | ROALLA',
  description:
    'Live websites and custom platforms built by Roalla — Ken Effect, Business Cocoon, Soaring Puck, and our own site. Explore production-ready proof of our digital build capability.',
  alternates: {
    canonical: '/digital-creations',
  },
}

export default async function DigitalCreationsPage() {
  const t = await getTranslations('breadcrumb')
  return (
    <div className="page-shell">
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('ourWork') }]} />
        <DigitalCreations />
      </div>
    </div>
  )
}
