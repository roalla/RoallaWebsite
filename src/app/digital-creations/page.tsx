import React from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import DigitalCreations from '@/components/DigitalCreations'

export const metadata = {
  title: 'Digital Creations | Roalla Business Enablement Group',
  description: 'Advisory Board Match, Soaring Puck, True North Audit — practical tools from 30+ years of business enablement experience.',
}

export default function DigitalCreationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Digital Creations' }]} />
        <DigitalCreations />
      </div>
    </div>
  )
}
