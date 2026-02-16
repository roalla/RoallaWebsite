import React from 'react'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import FAQ from '@/components/FAQ'

export const metadata = {
  title: 'FAQ | Roalla Business Enablement Group',
  description: 'Frequently asked questions about fractional COO services, consulting engagements, and how we work.',
}

export default async function FAQPage() {
  const t = await getTranslations('breadcrumb')
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('faq') }]} />
        <FAQ />
      </div>
    </div>
  )
}
