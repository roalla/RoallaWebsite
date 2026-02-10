import React from 'react'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import About from '@/components/About'

export const metadata = {
  title: 'About Us | Roalla Business Enablement Group',
  description: 'Your trusted partner in business transformation and operational excellence. Our story, team values, and mission.',
}

export default async function AboutPage() {
  const t = await getTranslations('breadcrumb')
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('about') }]} />
        <About />
      </div>
    </div>
  )
}
