import React from 'react'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import Services from '@/components/Services'
import TrustIndicators from '@/components/TrustIndicators'

export const metadata = {
  title: 'Our Services | Roalla Business Enablement Group',
  description: 'Strategic planning, process optimization, team development, data analytics, innovation consulting, and digital transformation for your business.',
}

export default async function ServicesPage() {
  const t = await getTranslations('breadcrumb')
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('services') }]} />
        <Services />
        <TrustIndicators />
      </div>
    </div>
  )
}
