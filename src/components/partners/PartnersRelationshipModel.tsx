import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'

export default async function PartnersRelationshipModel() {
  const t = await getTranslations('partnersPlatforms')

  return (
    <Reveal className="mb-10 border border-slate-200 bg-slate-50 px-5 py-6 sm:px-8 sm:py-8" aria-labelledby="relationship-model-heading">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('relationshipModelEyebrow')}</p>
      <h2 id="relationship-model-heading" className="mt-2 font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
        {t('relationshipModelTitle')}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{t('relationshipModelBody')}</p>

      <div className="mt-8 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="flex-1 border border-slate-200 bg-white px-4 py-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{t('relationshipYouLabel')}</p>
          <p className="mt-2 font-serif text-lg font-bold text-slate-950">{t('relationshipYouTitle')}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t('relationshipYouBody')}</p>
        </div>

        <div className="hidden shrink-0 items-center justify-center text-slate-400 lg:flex" aria-hidden>
          <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
            <path d="M0 8h40M34 2l12 6-12 6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-slate-400 lg:hidden" aria-hidden>
          ↓
        </p>

        <div className="flex-1 border border-primary/30 bg-white px-4 py-5 text-center ring-1 ring-primary/20">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{t('relationshipRoallaLabel')}</p>
          <p className="mt-2 font-serif text-lg font-bold text-slate-950">{t('relationshipRoallaTitle')}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t('relationshipRoallaBody')}</p>
        </div>

        <div className="hidden shrink-0 items-center justify-center text-slate-400 lg:flex" aria-hidden>
          <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
            <path d="M0 8h40M34 2l12 6-12 6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-slate-400 lg:hidden" aria-hidden>
          ↓
        </p>

        <div className="flex-1 border border-slate-200 bg-white px-4 py-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{t('relationshipNetworkLabel')}</p>
          <p className="mt-2 font-serif text-lg font-bold text-slate-950">{t('relationshipNetworkTitle')}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t('relationshipNetworkBody')}</p>
        </div>
      </div>

      <p className="mt-6 text-sm leading-6 text-slate-600">{t('relationshipModelNote')}</p>
    </Reveal>
  )
}
