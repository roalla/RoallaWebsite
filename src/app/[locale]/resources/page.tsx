import React from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import Resources from '@/components/Resources'

export const metadata = {
  title: 'Resource Centre | Roalla Business Enablement Group',
  description: 'Access exclusive business guides, templates, tools, and insights. Request access to the Resource Centre.',
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Resource Centre' }]} />
        <Resources />
      </div>
    </div>
  )
}
