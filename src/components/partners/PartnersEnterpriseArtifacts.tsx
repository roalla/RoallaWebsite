'use client'

import { Download } from 'lucide-react'
import { useTranslations } from 'next-intl'
import PartnersMethodologyPrintSheet from '@/components/partners/PartnersMethodologyPrintSheet'
import PartnersScorecardPrintSheet from '@/components/partners/PartnersScorecardPrintSheet'
import { trackAnalyticsEvent } from '@/lib/analytics'

type Props = {
  locale: string
  criteria: string[]
}

export default function PartnersEnterpriseArtifacts({ locale, criteria }: Props) {
  const t = useTranslations('partnersPlatforms')

  const notes = [t('scorecardNote1'), t('scorecardNote2'), t('scorecardNote3')]
  const scorecardRows = criteria.slice(0, 6).map((criterion, index) => ({
    criterion,
    notes: notes[index % notes.length],
  }))

  return (
    <div className="mt-10 border border-slate-200 bg-slate-50 px-5 py-6 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('artifactsEyebrow')}</p>
      <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950">{t('artifactsTitle')}</h3>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t('artifactsBody')}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            trackAnalyticsEvent('partners_evaluation_brief', { slot: 'methodology_pdf' })
            document.documentElement.setAttribute('data-partners-print', 'methodology')
            window.print()
            document.documentElement.removeAttribute('data-partners-print')
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Download className="h-4 w-4" aria-hidden />
          {t('artifactsMethodologyCta')}
        </button>
        <button
          type="button"
          onClick={() => {
            trackAnalyticsEvent('partners_evaluation_brief', { slot: 'scorecard_pdf' })
            document.documentElement.setAttribute('data-partners-print', 'scorecard')
            window.print()
            document.documentElement.removeAttribute('data-partners-print')
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:border-slate-400"
        >
          <Download className="h-4 w-4" aria-hidden />
          {t('artifactsScorecardCta')}
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            html[data-partners-print="methodology"] .partners-scorecard-print { display: none !important; }
            html[data-partners-print="scorecard"] .partners-methodology-print { display: none !important; }
          }
        `,
        }}
      />

      <PartnersMethodologyPrintSheet
        locale={locale}
        eyebrow={t('artifactsMethodologyEyebrow')}
        title={t('artifactsMethodologyTitle')}
        intro={t('standardIntro')}
        criteria={criteria}
        independence={t('independenceBody')}
        disclaimer={t('artifactsDisclaimer')}
      />
      <PartnersScorecardPrintSheet
        locale={locale}
        eyebrow={t('artifactsScorecardEyebrow')}
        title={t('artifactsScorecardTitle')}
        body={t('artifactsScorecardBody')}
        columns={[t('scorecardColCriterion'), t('scorecardColOptionA'), t('scorecardColOptionB'), t('scorecardColNotes')]}
        rows={scorecardRows}
        disclaimer={t('artifactsDisclaimer')}
      />
    </div>
  )
}
