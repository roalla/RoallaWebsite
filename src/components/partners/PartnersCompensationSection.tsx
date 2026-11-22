import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'
import PartnersBrandLockup from '@/components/partners/PartnersBrandLockup'
import { Link } from '@/i18n/navigation'

const transparencyKeys = [
  'compFlowSupplier',
  'compFlowAdvisory',
  'compFlowDisclose',
] as const

export default async function PartnersCompensationSection() {
  const t = await getTranslations('partnersPlatforms')
  const tCommon = await getTranslations('common')

  return (
    <section aria-labelledby="compensation-heading">
      <h2 id="compensation-heading" className="sr-only">
        {t('compensationTitle')}
      </h2>
      <div className="mb-10">
        <PartnersBrandLockup
          companyName={tCommon('companyName')}
          label={t('brandTransparencyLabel')}
          size="md"
          tone="light"
        />
      </div>

      <Reveal className="mb-10 border-t border-slate-200 pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('compFlowEyebrow')}</p>
        <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950">{t('compFlowTitle')}</h3>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {transparencyKeys.map((key, index) => (
            <li key={key} className="border-t border-slate-200 pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-2 font-serif text-lg font-bold text-slate-950">{t(`${key}Title`)}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t(`${key}Body`)}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal className="border-t border-slate-200 pt-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">
            {t('compensationEarnLabel')}
          </p>
          <p className="mt-4 leading-relaxed text-slate-700">{t('compensationBody')}</p>
        </Reveal>
        <Reveal delayMs={80} className="border-t border-slate-200 pt-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">
            {t('compensationDutyLabel')}
          </p>
          <p className="mt-4 leading-relaxed text-slate-700">{t('compensationCommitment')}</p>
          <Link
            href="/terms"
            className="mt-6 inline-flex items-center text-xs font-medium text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
          >
            {t('compensationTermsLink')}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
