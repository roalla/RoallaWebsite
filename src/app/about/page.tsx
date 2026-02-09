import React from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import About from '@/components/About'

export const metadata = {
  title: 'About Us | Roalla Business Enablement Group',
  description: 'Your trusted partner in business transformation and operational excellence. Our story, team values, and mission.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
        <About />
      </div>
    </div>
  )
}
