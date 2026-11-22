'use client'

import { useTranslations } from 'next-intl'
import Reveal from '@/components/motion/Reveal'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export default function PartnersRelationshipModel() {
  const t = useTranslations('partnersPlatforms')
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const reduceMotion = usePrefersReducedMotion()
  const active = inView && !reduceMotion

  return (
    <Reveal className="mb-10 border border-slate-200 bg-slate-50 px-5 py-6 sm:px-8 sm:py-8" aria-labelledby="relationship-model-heading">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('relationshipModelEyebrow')}</p>
      <h2 id="relationship-model-heading" className="mt-2 font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
        {t('relationshipModelTitle')}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{t('relationshipModelBody')}</p>

      <div
        ref={ref}
        className="mt-8 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4"
        data-active={active ? 'true' : 'false'}
      >
        <ModelCard
          delay={0}
          active={active}
          label={t('relationshipYouLabel')}
          title={t('relationshipYouTitle')}
          body={t('relationshipYouBody')}
        />
        <Connector active={active} delay={120} />
        <ModelCard
          delay={160}
          active={active}
          highlight
          label={t('relationshipRoallaLabel')}
          title={t('relationshipRoallaTitle')}
          body={t('relationshipRoallaBody')}
        />
        <Connector active={active} delay={280} />
        <ModelCard
          delay={320}
          active={active}
          label={t('relationshipNetworkLabel')}
          title={t('relationshipNetworkTitle')}
          body={t('relationshipNetworkBody')}
        />
      </div>

      <p className="mt-6 text-sm leading-6 text-slate-600">{t('relationshipModelNote')}</p>
    </Reveal>
  )
}

function ModelCard({
  label,
  title,
  body,
  highlight = false,
  active,
  delay,
}: {
  label: string
  title: string
  body: string
  highlight?: boolean
  active: boolean
  delay: number
}) {
  return (
    <div
      className={`flex-1 border bg-white px-4 py-5 text-center motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out ${
        highlight ? 'border-primary/30 ring-1 ring-primary/20' : 'border-slate-200'
      } ${active ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-70 motion-reduce:translate-y-0 motion-reduce:opacity-100'}`}
      style={{ transitionDelay: active ? `${delay}ms` : '0ms' }}
    >
      <p className={`text-xs font-bold uppercase tracking-[0.14em] ${highlight ? 'text-primary-dark' : 'text-slate-500'}`}>
        {label}
      </p>
      <p className="mt-2 font-serif text-lg font-bold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  )
}

function Connector({ active, delay }: { active: boolean; delay: number }) {
  return (
    <>
      <div
        className={`hidden shrink-0 items-center justify-center text-slate-400 motion-safe:transition-opacity motion-safe:duration-500 lg:flex ${
          active ? 'opacity-100' : 'opacity-40 motion-reduce:opacity-100'
        }`}
        style={{ transitionDelay: active ? `${delay}ms` : '0ms' }}
        aria-hidden
      >
        <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
          <path d="M0 8h40M34 2l12 6-12 6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-slate-400 lg:hidden" aria-hidden>
        ↓
      </p>
    </>
  )
}
