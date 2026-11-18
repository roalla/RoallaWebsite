import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'

const stepKeys = [
  'evalFlowStep1',
  'evalFlowStep2',
  'evalFlowStep3',
  'evalFlowStep4',
  'evalFlowStep5',
] as const

export default async function PartnersEvaluationFlow() {
  const t = await getTranslations('partnersPlatforms')

  return (
    <Reveal className="mb-10 border-t border-slate-200 pt-8" aria-labelledby="eval-flow-heading">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('evalFlowEyebrow')}</p>
      <h2 id="eval-flow-heading" className="mt-2 font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
        {t('evalFlowTitle')}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{t('evalFlowDescription')}</p>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stepKeys.map((key, index) => (
          <li key={key} className="border-t border-slate-200 pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
              {String(index + 1).padStart(2, '0')}
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{t(key)}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}
