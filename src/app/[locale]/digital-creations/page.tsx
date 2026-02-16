import React from 'react'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import DigitalCreations from '@/components/DigitalCreations'

export const metadata = {
  title: 'Digital Creations | Roalla Business Enablement Group',
  description: 'Advisory Board Match, Soaring Puck, True North Audit — practical tools from 30+ years of business enablement experience.',
}

export default async function DigitalCreationsPage() {
  const t = await getTranslations('breadcrumb')
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('digitalCreations') }]} />
        <DigitalCreations />
      </div>
    </div>
  )
}
