'use client'

import { useState } from 'react'
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Headphones,
  Route,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Reveal from '@/components/motion/Reveal'
import type { AiEmployeeCopy } from '@/lib/ai-employee-content'
import { trackAnalyticsEvent } from '@/lib/analytics'

const howIcons = [Headphones, BookOpenCheck, Sparkles, Route] as const

export default function AiEmployeeLanding({
  locale,
  content,
}: {
  locale: string
  content: AiEmployeeCopy
}) {
  const language = locale === 'fr' ? 'fr' : 'en'
  const firstIndustry = content.industries[0]
  const [industryId, setIndustryId] = useState(firstIndustry?.id ?? 'it-msp')
  const industry = content.industries.find((item) => item.id === industryId) ?? firstIndustry
  const [audienceId, setAudienceId] = useState(industry?.audiences[0]?.id ?? 'internal-it')
  const audience =
    industry?.audiences.find((item) => item.id === audienceId) ?? industry?.audiences[0]

  const fitParams = new URLSearchParams({
    campaign: 'ai-employee-fit-review',
    offer: 'AI Employee Fit Review',
    icp: industry?.label ?? 'IT & Managed Services',
    conversion_source: 'ai_employee_page',
  })
  const contactParams = new URLSearchParams({
    intent: 'consulting',
    focus: 'technology',
    from_page: '/ai-employee',
    goal: content.eyebrow,
    campaign: 'ai-employee',
    offer: content.eyebrow,
    icp: industry?.label ?? 'IT & Managed Services',
    conversion_source: 'ai_employee_page',
    reference: industryId,
  })
  const fitHref = `/${language}/ai-employee-fit-review?${fitParams.toString()}`
  const contactHref = `/${language}/contact?${contactParams.toString()}`

  const trackCta = (slot: string) => {
    trackAnalyticsEvent('ai_employee_cta', { slot, industry: industryId, audience: audienceId })
  }

  const selectIndustry = (id: string) => {
    setIndustryId(id)
    const next = content.industries.find((item) => item.id === id)
    if (next?.audiences[0]) setAudienceId(next.audiences[0].id)
    trackAnalyticsEvent('ai_employee_industry', { industry: id })
  }

  return (
    <div className="page-shell bg-white">
      <main>
        <section
          data-header-tone="dark"
          className="relative overflow-hidden bg-slate-950 pb-20 pt-28 text-white lg:pb-28 lg:pt-36"
        >
          <div className="absolute inset-0" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(45,212,191,0.22),transparent_42%),radial-gradient(ellipse_at_85%_70%,rgba(242,193,78,0.14),transparent_40%),linear-gradient(160deg,#020617_0%,#0f172a_55%,#042f2e_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal when="mount" className="max-w-4xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-light">{content.eyebrow}</p>
              <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {content.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{content.lead}</p>
              <div className="mt-8 flex flex-wrap gap-3">
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
            <ol className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {content.howSteps.map((step, index) => {
                const Icon = howIcons[index] ?? Sparkles
                return (
                  <Reveal key={step.title} as="li" delayMs={index * 80} className="relative">
                    <article className="h-full border-l-2 border-primary/40 pl-5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h3 className="mt-2 font-serif text-xl font-bold text-slate-950">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                    </article>
                  </Reveal>
                )
              })}
            </ol>
          </div>
        </section>

        <section className="bg-slate-50 py-20" id="industries">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{content.industriesEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{content.industriesTitle}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{content.industriesLead}</p>
            </Reveal>

            <div
              role="tablist"
              aria-label={content.industriesTitle}
              className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-center gap-2"
            >
              {content.industries.map((item) => {
                const selected = item.id === industryId
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={item.label}
                    title={item.label}
                    onClick={() => selectIndustry(item.id)}
                    className={`min-h-11 rounded-lg px-3 text-sm font-semibold transition-colors sm:px-4 ${
                      selected
                        ? 'bg-slate-950 text-white'
                        : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {item.shortLabel}
                  </button>
                )
              })}
            </div>

            {industry ? (
              <div className="mx-auto mt-12 max-w-6xl">
                <Reveal className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-10">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{industry.positioning}</p>
                  <h3 className="mt-3 max-w-3xl font-serif text-2xl font-bold text-slate-950 sm:text-3xl">{industry.promise}</h3>

                  <div
                    role="tablist"
                    aria-label={industry.label}
                    className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4"
                  >
                    {industry.audiences.map((item) => {
                      const selected = item.id === audienceId
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          onClick={() => {
                            setAudienceId(item.id)
                            trackAnalyticsEvent('ai_employee_audience', { industry: industryId, audience: item.id })
                          }}
                          className={`min-h-10 rounded-lg px-4 text-sm font-semibold transition-colors ${
                            selected
                              ? 'bg-primary/15 text-primary-darker'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {item.label}
                        </button>
                      )
                    })}
                  </div>

                  {audience ? (
                    <div className="mt-8">
                      <p className="max-w-3xl text-base leading-7 text-slate-700">{audience.lead}</p>
                      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                        {audience.uses.map((use) => (
                          <li key={use.title} className="border-t border-slate-200 pt-5">
                            <h4 className="font-serif text-lg font-bold text-slate-950">{use.title}</h4>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{use.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </Reveal>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  <Reveal as="article" className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
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
                  </Reveal>
                  <Reveal as="aside" delayMs={100} className="rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
                    <ShieldCheck className="h-8 w-8 text-primary-light" aria-hidden />
                    <h3 className="mt-4 font-serif text-2xl font-bold text-white">{industry.boundaryTitle}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{industry.boundaryLead}</p>
                    <ul className="mt-6 space-y-4">
                      {industry.boundaries.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-200">
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary-light" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
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
                <details key={faq.question} className="rounded-xl border border-slate-200 bg-white p-5">
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
                      onClick={() => trackCta(item.groupId === 'automation-ai' ? 'related_automation' : 'related_experience')}
                      className="block h-full border border-slate-200 bg-white p-5 transition-colors hover:border-primary/40"
                    >
                      <span className="inline-flex items-center font-semibold text-primary-dark">
                        {item.label}
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                      </span>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
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
