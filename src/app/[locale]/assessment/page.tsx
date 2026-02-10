import React from 'react'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import InteractiveAssessment from '@/components/InteractiveAssessment'

export const metadata = {
  title: 'Business Health Assessment | Roalla Business Enablement Group',
  description: 'Take our 5-minute assessment to discover your business strengths and opportunities for growth.',
}

export default async function AssessmentPage() {
  const t = await getTranslations('breadcrumb')
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
        <Breadcrumb items={[{ label: t('home'), href: '/' }, { label: t('assessment') }]} />
        <InteractiveAssessment />
      </div>
    </div>
  )
}
