import React from 'react'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import Resources from '@/components/Resources'

export const metadata = {
  title: 'Resource Centre | ROALLA',
  description: 'Access exclusive business guides, templates, tools, and insights from ROALLA. Request access to unlock valuable resources for your growth.',
}

export default async function ResourcesPage() {
  const t = await getTranslations('breadcrumb')
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('resources') }]} />
        <Resources />
      </div>
    </div>
  )
}
