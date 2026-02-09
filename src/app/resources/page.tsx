import React from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import Resources from '@/components/Resources'

export const metadata = {
  title: 'Resources & Insights | Roalla Business Enablement Group',
  description: 'Access exclusive business guides, templates, tools, and insights. Request access to the resources portal.',
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Resources' }]} />
        <Resources />
      </div>
    </div>
  )
}
