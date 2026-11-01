'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Check, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Reveal from '@/components/motion/Reveal'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { AiEmployeeCopy } from '@/lib/ai-employee-content'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  appendAttributionToHref,
  readAttributionFromSearch,
} from '@/lib/conversion-attribution'

export default function AiEmployeeLanding({
  locale,
  content,
}: {
  locale: string
  content: AiEmployeeCopy
}) {
  const language = locale === 'fr' ? 'fr' : 'en'
  const reduceMotion = usePrefersReducedMotion()
  const firstIndustry = content.industries[0]
  const [industryId, setIndustryId] = useState(firstIndustry?.id ?? 'it-msp')
  const industry = content.industries.find((item) => item.id === industryId) ?? firstIndustry
  const [audienceId, setAudienceId] = useState(industry?.audiences[0]?.id ?? 'internal-it')
  const audience =
    industry?.audiences.find((item) => item.id === audienceId) ?? industry?.audiences[0]
  const detailRef = useRef<HTMLDivElement>(null)
  const [heroReady, setHeroReady] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      setHeroReady(true)
      return
    }
    const id = window.requestAnimationFrame(() => setHeroReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [reduceMotion])

  const industryLabel = industry?.label ?? 'IT & Managed Services'
  const fitHrefBase = useMemo(
    () =>
      `/${language}/ai-employee-fit-review?offer=${encodeURIComponent('AI Employee Fit Review')}&icp=${encodeURIComponent(industryLabel)}`,
    [industryLabel, language],
  )
  const contactHrefBase = useMemo(() => {
    const params = new URLSearchParams({
      intent: 'consulting',
      focus: 'technology',
      from_page: '/ai-employee',
      goal: content.eyebrow,
      reference: industryId,
    })
    return `/${language}/contact?${params.toString()}`
  }, [content.eyebrow, industryId, language])

  const [fitHref, setFitHref] = useState(fitHrefBase)
  const [contactHref, setContactHref] = useState(contactHrefBase)

  useEffect(() => {
    const inbound = readAttributionFromSearch(window.location.search)
    const defaults = {
      campaign: 'ai-employee',
      conversion_source: 'ai_employee_page',
      entry_page: '/ai-employee',
      signal: 'ai-employee',
      offer: content.eyebrow,
      icp: industryLabel,
    }
    setFitHref(
      appendAttributionToHref(fitHrefBase, inbound, {
        ...defaults,
        campaign: 'ai-employee-fit-review',
      }),
    )
    setContactHref(appendAttributionToHref(contactHrefBase, inbound, defaults))
  }, [contactHrefBase, content.eyebrow, fitHrefBase, industryLabel])

  const trackCta = (slot: string) => {
    trackAnalyticsEvent('ai_employee_cta', { slot, industry: industryId, audience: audienceId })
  }

  const selectIndustry = (id: string) => {
    setIndustryId(id)
    const next = content.industries.find((item) => item.id === id)
    if (next?.audiences[0]) setAudienceId(next.audiences[0].id)
    trackAnalyticsEvent('ai_employee_industry', { industry: id })
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    })
  }

  return (
    <div className="page-shell bg-white">
      <main>
        <section
          data-header-tone="dark"
          className="relative flex min-h-[88vh] items-end overflow-hidden pb-16 pt-28 text-white sm:pb-20 lg:min-h-[92vh] lg:pb-28 lg:pt-36"
        >
          <div className="absolute inset-0" aria-hidden>
            <Image
              src={content.heroImage.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className={[
                'object-cover transition-transform duration-[1800ms] ease-out',
                reduceMotion || !heroReady ? 'scale-100' : 'scale-105',
              ].join(' ')}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/78 to-slate-950/45" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal when="mount" className="max-w-3xl">
              <p className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {content.brandName}
              </p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-primary-light">
                {content.eyebrow}
              </p>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {content.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{content.lead}</p>
              <div
                className={[
                  'mt-8 flex flex-wrap gap-3 transition-opacity duration-700',
                  heroReady || reduceMotion ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
              >
                <a
                  href={fitHref}
                  onClick={() => trackCta('hero_fit')}
                  className="inline-flex min-h-12 items-center rounded-lg bg-primary px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-primary-light"
                >
                  {content.primaryCta}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </a>
                <a
                  href={contactHref}
                  onClick={() => trackCta('hero_contact')}
                  className="inline-flex min-h-12 items-center rounded-lg border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {content.secondaryCta}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{content.howEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{content.howTitle}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{content.howLead}</p>
            </Reveal>
            <ol className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.howSteps.map((step, index) => (
                <Reveal key={step.title} as="li" delayMs={index * 80}>
                  <article className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left">
                    <span className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
                      <Image
                        src={step.image.src}
                        alt={step.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </span>
                    <div className="px-4 py-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h3 className="mt-2 font-serif text-xl font-bold text-slate-950">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-slate-50 py-20" id="industries">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{content.industriesEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{content.industriesTitle}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{content.industriesLead}</p>
              <p className="mt-2 text-xs font-medium text-slate-500">{content.industrySelectHint}</p>
            </Reveal>

            <div
              role="listbox"
              aria-label={content.industriesTitle}
              className="mx-auto mt-10 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {content.industries.map((item) => {
                const selected = item.id === industryId
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => selectIndustry(item.id)}
                    className={[
                      'group/tile cursor-pointer overflow-hidden rounded-xl border text-left transition',
                      selected
                        ? 'border-slate-900 ring-2 ring-slate-900'
                        : 'border-slate-200 hover:border-primary/50 hover:shadow-sm',
                    ].join(' ')}
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover transition duration-300 group-hover/tile:scale-[1.03]"
                      />
                      {selected ? (
                        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-slate-950/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                          <Check className="h-3 w-3" aria-hidden />
                          {content.selectedLabel}
                        </span>
                      ) : null}
                    </span>
                    <span className={`block px-3 py-3 ${selected ? 'bg-slate-900' : 'bg-white'}`}>
                      <span
                        className={`block text-sm font-semibold leading-5 ${selected ? 'text-white' : 'text-slate-950'}`}
                      >
                        {item.label}
                      </span>
                      <span
                        className={`mt-1 block text-xs leading-5 ${selected ? 'text-slate-300' : 'text-slate-600'}`}
                      >
                        {item.shortLabel}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            {industry ? (
              <div ref={detailRef} className="mx-auto mt-14 max-w-6xl scroll-mt-28">
                <Reveal>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{industry.positioning}</p>
                  <h3 className="mt-3 max-w-3xl font-serif text-2xl font-bold text-slate-950 sm:text-3xl">{industry.promise}</h3>
                  <p className="mt-4 text-xs font-medium text-slate-500">{content.audienceSelectHint}</p>
                </Reveal>

                <div
                  role="listbox"
                  aria-label={industry.label}
                  className="mt-6 grid gap-3 sm:grid-cols-2"
                >
                  {industry.audiences.map((item) => {
                    const selected = item.id === audienceId
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          setAudienceId(item.id)
                          trackAnalyticsEvent('ai_employee_audience', {
                            industry: industryId,
                            audience: item.id,
                          })
                        }}
                        className={[
                          'group/tile cursor-pointer overflow-hidden rounded-xl border text-left transition',
                          selected
                            ? 'border-slate-900 ring-2 ring-slate-900'
                            : 'border-slate-200 hover:border-primary/50 hover:shadow-sm',
                        ].join(' ')}
                      >
                        <span className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
                          <Image
                            src={industry.image.src}
                            alt={industry.image.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className={[
                              'object-cover transition duration-300 group-hover/tile:scale-[1.03]',
                              item.id === industry.audiences[1]?.id ? 'object-[center_70%]' : '',
                            ].join(' ')}
                          />
                          {selected ? (
                            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-slate-950/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                              <Check className="h-3 w-3" aria-hidden />
                              {content.selectedLabel}
                            </span>
                          ) : null}
                        </span>
                        <span className={`block px-4 py-4 ${selected ? 'bg-slate-900' : 'bg-white'}`}>
                          <span
                            className={`block text-base font-semibold leading-6 ${selected ? 'text-white' : 'text-slate-950'}`}
                          >
                            {item.label}
                          </span>
                          <span
                            className={`mt-1 block text-sm leading-6 ${selected ? 'text-slate-300' : 'text-slate-600'}`}
                          >
                            {item.lead}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>

                {audience ? (
                  <div className="mt-10">
                    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {audience.uses.map((use) => (
                        <li
                          key={use.title}
                          className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                        >
                          <span className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
                            <Image
                              src={industry.image.src}
                              alt={industry.image.alt}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </span>
                          <div className="px-4 py-4">
                            <h4 className="font-serif text-lg font-bold text-slate-950">{use.title}</h4>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{use.description}</p>
                          </div>
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

                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href={fitHref}
                    onClick={() => trackCta('industry_fit')}
                    className="inline-flex min-h-12 items-center rounded-lg bg-primary px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-primary-light"
                  >
                    {content.primaryCta}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </a>
                  <a
                    href={contactHref}
                    onClick={() => trackCta('industry_contact')}
                    className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition-colors hover:border-slate-400"
                  >
                    {content.secondaryCta}
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="container mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center font-serif text-3xl font-bold text-slate-950">{content.faqTitle}</h2>
            <div className="mt-10 space-y-3">
              {content.faqs.map((faq) => (
                <details key={faq.question} className="border-b border-slate-200 pb-4 pt-1">
                  <summary className="cursor-pointer font-semibold text-slate-950">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-950">{content.distinctTitle}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{content.distinctBody}</p>
              </div>
              <Link
                href="/services/ai-agents"
                onClick={() => trackCta('agentic_link')}
                className="inline-flex min-h-11 items-center font-semibold text-primary-dark underline-offset-4 hover:underline"
              >
                {content.distinctLinkLabel}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-10">
              <h3 className="font-serif text-xl font-bold text-slate-950">{content.relatedTitle}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{content.relatedLead}</p>
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {content.relatedLinks.map((item) => (
                  <li key={item.groupId}>
                    <Link
                      href={{ pathname: '/solutions/need/[groupId]', params: { groupId: item.groupId } }}
                      onClick={() =>
                        trackCta(
                          item.groupId === 'automation-ai' ? 'related_automation' : 'related_experience',
                        )
                      }
                      className="group/tile block h-full overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-primary/40"
                    >
                      <span className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition duration-300 group-hover/tile:scale-[1.03]"
                        />
                      </span>
                      <span className="block p-5">
                        <span className="inline-flex items-center font-semibold text-primary-dark">
                          {item.label}
                          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                        </span>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 text-white">
          <div className="container mx-auto flex max-w-6xl flex-col gap-7 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-white">{content.finalTitle}</h2>
              <p className="mt-3 max-w-3xl text-primary-lighter">{content.finalLead}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={fitHref}
                onClick={() => trackCta('final_fit')}
                className="inline-flex min-h-12 items-center rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-900"
              >
                {content.finalPrimaryCta}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </a>
              <a
                href={contactHref}
                onClick={() => trackCta('final_contact')}
                className="inline-flex min-h-12 items-center rounded-lg border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/15"
              >
                {content.finalSecondaryCta}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
