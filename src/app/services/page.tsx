import React from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import Services from '@/components/Services'
import TrustIndicators from '@/components/TrustIndicators'

export const metadata = {
  title: 'Our Services | Roalla Business Enablement Group',
  description: 'Strategic planning, process optimization, team development, data analytics, innovation consulting, and digital transformation for your business.',
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
        <Services />
        <TrustIndicators />
      </div>
    </div>
  )
}
