import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'
import PartnersBrandLockup from '@/components/partners/PartnersBrandLockup'

export default async function PartnersProofVignette() {
  const t = await getTranslations('partnersPlatforms')
  const tCommon = await getTranslations('common')

  return (
    <Reveal className="mt-12 border border-slate-200 bg-slate-50 px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <PartnersBrandLockup
          companyName={tCommon('companyName')}
          label={t('proofEyebrow')}
          size="sm"
          tone="light"
        />
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 sm:pt-2">{t('proofLabel')}</p>
      </div>
      <p className="mt-5 max-w-3xl font-serif text-xl font-bold leading-snug text-slate-950 sm:text-2xl">
        {t('proofHeadline')}
      </p>
      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {(['proofStep1', 'proofStep2', 'proofStep3'] as const).map((key, index) => (
          <li key={key} className="border-t border-slate-200 pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
              {String(index + 1).padStart(2, '0')}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{t(key)}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}
