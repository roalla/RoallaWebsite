'use client'

import { useEffect, useState, type ReactNode, type Ref } from 'react'
import Image from 'next/image'
import { ArrowRight, Check, CheckCircle2, ShieldCheck } from 'lucide-react'
import Reveal from '@/components/motion/Reveal'
import type { AiEmployeeIndustry } from '@/lib/ai-employee-content'

type Props = {
  industry: AiEmployeeIndustry
  audienceSelectHint: string
  selectedLabel: string
  primaryCta: string
  secondaryCta: string
  fitHref: string
  contactHref: string
  onFitClick?: () => void
  onContactClick?: () => void
  onAudienceChange?: (audienceId: string) => void
  detailRef?: Ref<HTMLDivElement>
  footer?: ReactNode
  className?: string
}

export default function AiEmployeeIndustryDetail({
  industry,
  audienceSelectHint,
  selectedLabel,
  primaryCta,
  secondaryCta,
  fitHref,
  contactHref,
  onFitClick,
  onContactClick,
  onAudienceChange,
  detailRef,
  footer,
  className,
}: Props) {
  const [audienceId, setAudienceId] = useState(industry.audiences[0]?.id ?? '')
  const audience =
    industry.audiences.find((item) => item.id === audienceId) ?? industry.audiences[0]

  useEffect(() => {
    setAudienceId(industry.audiences[0]?.id ?? '')
  }, [industry.id, industry.audiences])

  const selectAudience = (id: string) => {
    setAudienceId(id)
    onAudienceChange?.(id)
  }

  return (
    <div ref={detailRef} className={['scroll-mt-28', className].filter(Boolean).join(' ')}>
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">
          {industry.positioning}
        </p>
        <h3 className="mt-3 max-w-3xl font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
          {industry.promise}
        </h3>
        <p className="mt-4 text-xs font-medium text-slate-500">{audienceSelectHint}</p>
      </Reveal>

      <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-xl bg-slate-100 sm:aspect-[24/9]">
        <Image
          src={industry.image.src}
          alt={industry.image.alt}
          fill
          loading="lazy"
          unoptimized
          decoding="async"
          sizes="(max-width: 1024px) 100vw, 1152px"
          className="object-cover"
        />
      </div>

      <div role="listbox" aria-label={industry.label} className="mt-4 grid gap-3 sm:grid-cols-2">
        {industry.audiences.map((item) => {
          const selected = item.id === audience?.id
          return (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => selectAudience(item.id)}
              className={[
                'h-full rounded-xl border px-4 py-4 text-left transition',
                selected
                  ? 'border-slate-900 bg-slate-900 text-white ring-2 ring-slate-900'
                  : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-sm',
              ].join(' ')}
            >
              <span className="flex items-start justify-between gap-3">
                <span
                  className={`block text-base font-semibold leading-6 ${selected ? 'text-white' : 'text-slate-950'}`}
                >
                  {item.label}
                </span>
                {selected ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                    <Check className="h-3 w-3" aria-hidden />
                    {selectedLabel}
                  </span>
                ) : null}
              </span>
              <span
                className={`mt-1 block text-sm leading-6 ${selected ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {item.lead}
              </span>
            </button>
          )
        })}
      </div>

      {audience ? (
        <div className="mt-10">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {audience.uses.map((use) => (
              <li key={use.title} className="border-t-2 border-primary/30 bg-white px-4 py-4">
                <h4 className="font-serif text-lg font-bold text-slate-950">{use.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">{use.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-12 grid gap-10 border-t border-slate-200 pt-10 lg:grid-cols-2">
        <div>
          <h3 className="font-serif text-2xl font-bold text-slate-950">{industry.startTitle}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{industry.startLead}</p>
          <ol className="mt-6 space-y-3">
            {industry.startWith.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-slate-950">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
        <aside>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-primary-dark" aria-hidden />
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-950">{industry.boundaryTitle}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{industry.boundaryLead}</p>
            </div>
          </div>
          <ul className="mt-6 space-y-4">
            {industry.boundaries.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <a
            href={fitHref}
            onClick={onFitClick}
            className="inline-flex min-h-12 items-center rounded-lg bg-primary px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-primary-light"
          >
            {primaryCta}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </a>
          <a
            href={contactHref}
            onClick={onContactClick}
            className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition-colors hover:border-slate-400"
          >
            {secondaryCta}
          </a>
        </div>
        {footer}
      </div>
    </div>
  )
}
