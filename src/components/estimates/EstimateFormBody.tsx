'use client'

import type { ReactNode } from 'react'
import EstimateWizard, { type EstimateWizardStep } from '@/components/estimates/EstimateWizard'
import type { EstimateWizardMode } from '@/lib/estimate-wizard-mode'

type EstimateFormBodyProps = {
  locale: string
  mode: EstimateWizardMode
  sections: EstimateWizardStep[]
  /** Extra content always shown after sections in form mode (rarely needed). */
  after?: ReactNode
  resetKey?: string
}

/** Renders estimator sections as a guided wizard or a single stacked form. */
export default function EstimateFormBody({ locale, mode, sections, after, resetKey }: EstimateFormBodyProps) {
  if (mode === 'wizard') {
    return (
      <>
        <EstimateWizard locale={locale} steps={sections} resetKey={resetKey} />
        {after}
      </>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id}>{section.content}</div>
        ))}
      </div>
      {after}
    </>
  )
}
