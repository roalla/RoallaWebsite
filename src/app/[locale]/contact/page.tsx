import React from 'react'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import Contact from '@/components/Contact'

export const metadata = {
  title: 'Contact Us | Roalla Business Enablement Group',
  description: 'Schedule a free consultation or reach out — email, phone, Burlington ON. Serving clients globally.',
}

export default async function ContactPage() {
  const t = await getTranslations('breadcrumb')
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('contact') }]} />
        <Contact />
      </div>
    </div>
  )
}
