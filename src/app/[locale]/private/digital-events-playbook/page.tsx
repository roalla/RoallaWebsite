import React from 'react'
import type { Metadata } from 'next'
import DigitalEventsPlaybook from '@/components/private/DigitalEventsPlaybook'

export const metadata: Metadata = {
  title: 'Digital Events Playbook (Internal) | ROALLA',
  description: 'Internal product promotion and scoping guide for Roalla Digital Events.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/private/digital-events-playbook',
  },
}

export default function DigitalEventsPlaybookPage() {
  return (
    <div className="page-shell bg-gradient-to-b from-slate-100 via-slate-50 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28">
        <DigitalEventsPlaybook />
      </div>
    </div>
  )
}
