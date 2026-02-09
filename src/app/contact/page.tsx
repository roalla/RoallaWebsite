import React from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import Contact from '@/components/Contact'

export const metadata = {
  title: 'Contact Us | Roalla Business Enablement Group',
  description: 'Schedule a free consultation or reach out — email, phone, Burlington ON. Serving clients globally.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
        <Contact />
      </div>
    </div>
  )
}
