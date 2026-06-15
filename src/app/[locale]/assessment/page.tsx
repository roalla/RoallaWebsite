import React from 'react'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import InteractiveAssessment from '@/components/InteractiveAssessment'
import AssessmentFAQ from '@/components/assessment/AssessmentFAQ'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assessmentPage' })

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: '/assessment',
    },
  }
}

export default async function AssessmentPage() {
  const t = await getTranslations('assessmentPage')
  const tBc = await getTranslations('breadcrumb')

  return (
    <div className="page-shell">
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <Breadcrumb items={[{ label: tBc('home'), href: '/' }, { label: tBc('assessment') }]} />

        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900">{t('title')}</h1>
          <p className="mt-2 text-sm text-primary font-medium">{t('preview')}</p>
          <p className="mt-4 text-lg text-slate-600">{t('description')}</p>
          <p className="mt-3 text-sm text-slate-500">{t('whatHappensNext')}</p>
        </div>

        <InteractiveAssessment />
        <AssessmentFAQ />
      </div>
    </div>
  )
}
