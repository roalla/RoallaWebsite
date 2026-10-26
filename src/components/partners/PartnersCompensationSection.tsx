import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'
import { Link } from '@/i18n/navigation'

export default async function PartnersCompensationSection() {
  const t = await getTranslations('partnersPlatforms')

  return (
    <section aria-labelledby="compensation-heading">
      <h2 id="compensation-heading" className="sr-only">
        {t('compensationTitle')}
      </h2>
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
            className="mt-6 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
          >
            {t('termsLink')}
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
