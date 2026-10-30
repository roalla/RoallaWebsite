'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  Compass,
  ExternalLink,
  Layers3,
  Network,
  Scale,
  ShieldCheck,
} from 'lucide-react'
import Reveal from './motion/Reveal'
import ServiceMiniFAQ from './services/ServiceMiniFAQ'
import StickyMobileCTA from './StickyMobileCTA'
import { TECHNOLOGY_PAGE_FAQ_KEYS } from '@/lib/service-faq-jsonld'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { getTechnologyAdvisoryCopy, type AdvisorNeedId } from '@/lib/technology-advisory-content'

const deliverableKeys = [
  'technologyDeliverable1',
  'technologyDeliverable2',
  'technologyDeliverable3',
  'technologyDeliverable4',
  'technologyDeliverable5',
] as const
const capabilityKeys = [
  'technologyF1',
  'technologyF2',
  'technologyF3',
  'technologyF4',
  'technologyF5',
  'technologyF6',
  'technologyF7',
  'technologyF8',
] as const
const evaluationKeys = [
  'technologyEvaluation1',
  'technologyEvaluation2',
  'technologyEvaluation3',
  'technologyEvaluation4',
  'technologyEvaluation5',
  'technologyEvaluation6',
  'technologyEvaluation7',
  'technologyEvaluation8',
] as const
const implementationKeys = [
  'technologyImplementation1',
  'technologyImplementation2',
  'technologyImplementation3',
  'technologyImplementation4',
  'technologyImplementation5',
  'technologyImplementation6',
] as const

const ENTRY_PAGE = '/services/technology-advisory'

function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 pt-5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
          <Check className="mt-1 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function campaignQuery(extra?: Record<string, string>) {
  return {
    campaign: 'technology-advisory',
    conversion_source: 'technology_advisory_page',
    entry_page: ENTRY_PAGE,
    ...extra,
  }
}

const TechnologyAdvisory = () => {
  const locale = useLocale()
  const t = useTranslations('services')
  const tCommon = useTranslations('common')
  const copy = getTechnologyAdvisoryCopy(locale)
  const [advisorNeed, setAdvisorNeed] = useState<AdvisorNeedId>(copy.journeys.advisorNeeds[0].id)
  const [categoryId, setCategoryId] = useState<string>(copy.journeys.categories[0].id)

  const selectedNeed = useMemo(
    () => copy.journeys.advisorNeeds.find((item) => item.id === advisorNeed) ?? copy.journeys.advisorNeeds[0],
    [advisorNeed, copy.journeys.advisorNeeds],
  )
  const selectedCategory = useMemo(
    () => copy.journeys.categories.find((item) => item.id === categoryId) ?? copy.journeys.categories[0],
    [categoryId, copy.journeys.categories],
  )

  const chooseNeed = (id: AdvisorNeedId) => {
    setAdvisorNeed(id)
    trackAnalyticsEvent('technology_advisor_flow_step', { step: 1, need: id })
    trackAnalyticsEvent('technology_advisor_flow_completed', { need: id, priority: 'executive_concern' })
  }

  const chooseCategory = (id: string) => {
    setCategoryId(id)
    trackAnalyticsEvent('technology_category_selected', { category: id })
  }

  const resetNeed = () => {
    setAdvisorNeed(copy.journeys.advisorNeeds[0].id)
    trackAnalyticsEvent('technology_advisor_flow_step', { step: 0, need: 'restart' })
  }

  const resetCategory = () => {
    setCategoryId(copy.journeys.categories[0].id)
    trackAnalyticsEvent('technology_category_selected', { category: 'restart' })
  }

  const trackJourneyCta = (journey: 'advisor' | 'category' | 'brief' | 'hero' | 'mid' | 'final', detail?: string) => {
    trackAnalyticsEvent('technology_journey_cta_click', { journey, detail })
  }

  const disclosureItems = [
    t('technologyPartnerProof1Body'),
    t('technologyPartnerProof2Body'),
    t('technologyPartnerProof3Body'),
  ]

  const contactHref = (need: string) => ({
    pathname: '/contact' as const,
    query: {
      intent: 'consulting',
      focus: 'technology',
      need,
      ...campaignQuery({ signal: need }),
    },
  })

  const briefHref = (detail: string) => ({
    pathname: '/tools/technology-decision-brief' as const,
    query: campaignQuery({ selected_problem: detail }),
  })

  return (
    <section id="technology-advisory" className="relative bg-white pb-10">
      <header
        data-header-tone="dark"
        className="relative isolate overflow-hidden bg-slate-950 px-4 pb-14 pt-28 text-white sm:px-6 lg:px-8 lg:pb-16 lg:pt-32"
      >
        <Image
          src="/images/services/technology-advisory-hero.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          unoptimized
          sizes="100vw"
          className="tech-advisory-hero-media -z-30 object-cover object-center opacity-45"
        />
        <div
          className="absolute inset-0 -z-20 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/55"
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-transparent to-slate-950/85" aria-hidden />

        <div className="relative mx-auto max-w-6xl">
          <Reveal when="mount">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-300" aria-hidden />
              {copy.hero.eyebrow}
            </p>
          </Reveal>
          <Reveal when="mount" delayMs={60}>
            <h1 className="mt-5 max-w-4xl font-serif text-4xl font-bold leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              {copy.hero.title}
            </h1>
          </Reveal>
          <Reveal when="mount" delayMs={110}>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">{copy.hero.body}</p>
          </Reveal>
          <Reveal when="mount" delayMs={150}>
            <p className="mt-4 text-xs font-semibold tracking-wide text-cyan-100">{copy.hero.proof}</p>
          </Reveal>
          <Reveal when="mount" delayMs={180}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#choose-your-path"
                onClick={() => trackJourneyCta('hero', 'choose-path')}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-gold px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {copy.hero.primary}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </a>
              <Link
                href={briefHref('hero')}
                onClick={() => trackJourneyCta('brief', 'hero')}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {copy.hero.secondary}
              </Link>
            </div>
          </Reveal>
          <Reveal when="mount" delayMs={220}>
            <div className="mt-8 max-w-2xl border-l-2 border-cyan-300/80 bg-black/25 px-4 py-3 backdrop-blur-[2px] sm:px-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">{copy.hero.lensTitle}</p>
              <ol className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                {copy.hero.questions.map((question, index) => (
                  <li key={question} className="flex gap-2 text-sm font-semibold text-white">
                    <span className="text-cyan-300">0{index + 1}</span>
                    <span>{question}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </header>

      <aside className="border-b border-slate-200 bg-slate-50 px-4 py-6 sm:px-6 lg:px-8" aria-label={copy.credibility.eyebrow}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {copy.credibility.principles.map((principle) => (
              <div key={principle.title} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" aria-hidden />
                <div>
                  <p className="text-sm font-bold text-slate-950">{principle.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{principle.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-700">
            {copy.trust.disclosureLine}{' '}
            <Link
              href="/partners/compensation"
              className="font-semibold text-primary-dark underline-offset-4 hover:underline"
            >
              {copy.trust.partnersCta}
            </Link>
          </p>
        </div>
      </aside>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal id="choose-your-path" className="scroll-mt-28 py-12 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.journeys.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
              {copy.journeys.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{copy.journeys.body}</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
            <article className="overflow-hidden rounded-2xl border border-primary/25 bg-white">
              <div className="border-b border-slate-200 bg-primary/[0.06] p-6 sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-dark text-white">
                  <Compass className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-serif text-2xl font-bold text-slate-950">{copy.journeys.advisorTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{copy.journeys.advisorBody}</p>
              </div>
              <div className="p-6 sm:p-7" aria-live="polite">
                <p className="text-sm font-bold text-slate-950">{copy.journeys.advisorPrompt}</p>
                <p className="mt-1 text-xs text-slate-500">{copy.journeys.selectHint}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {copy.journeys.advisorNeeds.map((need) => {
                    const selected = need.id === advisorNeed
                    return (
                      <button
                        key={need.id}
                        type="button"
                        onClick={() => chooseNeed(need.id)}
                        aria-pressed={selected}
                        className={`flex min-h-16 items-start gap-3 rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                          selected
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'cursor-pointer border-slate-300 bg-white text-slate-800 hover:border-primary/50 hover:bg-primary/[0.04]'
                        }`}
                      >
                        <span className="mt-0.5 shrink-0">
                          {selected ? (
                            <Check className="h-4 w-4 text-brand-gold" aria-hidden />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-400" aria-hidden />
                          )}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold leading-5">{need.label}</span>
                          {selected ? (
                            <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-brand-gold">
                              {copy.journeys.selectedLabel}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div key={selectedNeed.id} className="outcome-ladder-step mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-serif text-xl font-bold leading-tight text-slate-950">{selectedNeed.title}</h4>
                    <button
                      type="button"
                      onClick={resetNeed}
                      className="text-xs font-semibold text-primary-dark underline-offset-4 hover:underline"
                    >
                      {copy.journeys.restart}
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{selectedNeed.body}</p>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                    {copy.journeys.leadershipQuestions}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {selectedNeed.questions.map((question) => (
                      <li key={question} className="flex items-start gap-2 text-sm leading-5 text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                        {question}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                    {copy.journeys.decisionOutput}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{selectedNeed.output}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      href={contactHref(selectedNeed.id)}
                      onClick={() => trackJourneyCta('advisor', selectedNeed.id)}
                      className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-darker"
                    >
                      {copy.journeys.reviewCta}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                      href={briefHref(selectedNeed.id)}
                      onClick={() => trackJourneyCta('brief', selectedNeed.id)}
                      className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-primary hover:text-primary-dark"
                    >
                      {copy.journeys.briefCta}
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
              <div className="border-b border-slate-200 bg-slate-950 p-6 text-white sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                  <Layers3 className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-serif text-2xl font-bold text-white">{copy.journeys.readyTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{copy.journeys.readyBody}</p>
              </div>
              <div className="p-6 sm:p-7">
                <p className="text-sm font-bold text-slate-950">{copy.journeys.categoryPrompt}</p>
                <p className="mt-1 text-xs text-slate-500">{copy.journeys.selectHint}</p>
                <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label={copy.journeys.categoryPrompt}>
                  {copy.journeys.categories.map((category) => {
                    const selected = category.id === categoryId
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => chooseCategory(category.id)}
                        aria-pressed={selected}
                        className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                          selected
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'cursor-pointer border-slate-300 bg-white text-slate-800 hover:border-primary/50 hover:text-primary-dark'
                        }`}
                      >
                        {selected ? (
                          <Check className="h-3.5 w-3.5 text-brand-gold" aria-hidden />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                        )}
                        {category.label}
                      </button>
                    )
                  })}
                </div>
                <div key={selectedCategory.id} className="outcome-ladder-step mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5" aria-live="polite">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-serif text-xl font-bold text-slate-950">{selectedCategory.label}</h4>
                    <button
                      type="button"
                      onClick={resetCategory}
                      className="text-xs font-semibold text-primary-dark underline-offset-4 hover:underline"
                    >
                      {copy.journeys.restart}
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{selectedCategory.outcome}</p>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                    {copy.journeys.leadershipQuestions}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {selectedCategory.questions.map((question) => (
                      <li key={question} className="flex items-start gap-2 text-sm leading-5 text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                        {question}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                    {copy.journeys.compareLabel}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {selectedCategory.compare.map((criterion) => (
                      <li
                        key={criterion}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        {criterion}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                    {copy.journeys.decisionOutput}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{selectedCategory.output}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      href={contactHref(selectedCategory.id)}
                      onClick={() => trackJourneyCta('category', selectedCategory.id)}
                      className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-darker"
                    >
                      {copy.journeys.inquiryCta} {selectedCategory.label}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                      href={briefHref(selectedCategory.id)}
                      onClick={() => trackJourneyCta('brief', selectedCategory.id)}
                      className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:border-primary hover:text-primary-dark"
                    >
                      {copy.journeys.compareCta}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </Reveal>

        <Reveal className="border-t border-slate-200 py-12 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.leadership.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
              {copy.leadership.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{copy.leadership.body}</p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {copy.leadership.items.map((item, index) => (
              <article key={item.title} className="border-t-2 border-primary/40 pt-5">
                <span className="text-xs font-bold tracking-[0.16em] text-primary-dark">0{index + 1}</span>
                <h3 className="mt-3 font-serif text-xl font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item.body}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="mb-4 rounded-2xl border border-primary/20 bg-primary/[0.05] px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{copy.midCta.eyebrow}</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-950 sm:text-3xl">{copy.midCta.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{copy.midCta.body}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={contactHref(advisorNeed)}
                onClick={() => trackJourneyCta('mid', advisorNeed)}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-darker"
              >
                {copy.midCta.primary}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={briefHref('mid')}
                onClick={() => trackJourneyCta('brief', 'mid')}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-primary"
              >
                {copy.midCta.secondary}
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="relative mt-10 overflow-hidden bg-slate-950 px-6 py-10 text-white sm:px-8 lg:px-10 lg:py-12">
          <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{copy.credibility.eyebrow}</p>
              <h2 className="mt-3 max-w-2xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                {copy.credibility.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{copy.credibility.body}</p>
              <Link
                href="/partners"
                className="mt-5 inline-flex items-center text-sm font-bold text-cyan-300 hover:text-white hover:underline"
              >
                {t('technologyPartnersLink')}
                <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="grid gap-4">
              {copy.credibility.principles.map((principle, index) => (
                <div key={principle.title} className="border-l-2 border-cyan-300/60 pl-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">0{index + 1}</p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-white">{principle.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{principle.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="py-12 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.process.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
              {copy.process.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{copy.process.body}</p>
          </div>
          <ol className="mt-8 grid gap-6 lg:grid-cols-3">
            {copy.process.steps.map((step, index) => {
              const Icon = [Compass, Scale, Network][index]
              return (
                <li key={step.title} className="border-t border-slate-200 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="font-serif text-3xl font-bold text-slate-200">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{step.body}</p>
                </li>
              )
            })}
          </ol>
        </Reveal>

        <Reveal className="border-t border-slate-200 py-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.details.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
              {copy.details.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{copy.details.body}</p>
          </div>
          <p className="mt-5 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
            {t('technologyCompensation')}{' '}
            <Link href="/partners/compensation" className="font-semibold underline-offset-4 hover:underline">
              {copy.trust.partnersCta}
            </Link>
          </p>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {[
              {
                title: copy.details.scope,
                icon: Layers3,
                content: (
                  <>
                    <DetailList items={deliverableKeys.map((key) => t(key))} />
                    <DetailList items={capabilityKeys.map((key) => t(key))} />
                  </>
                ),
              },
              {
                title: copy.details.delivery,
                icon: Scale,
                content: (
                  <>
                    <DetailList items={evaluationKeys.map((key) => t(key))} />
                    <DetailList items={implementationKeys.map((key) => t(key))} />
                  </>
                ),
              },
              {
                title: copy.details.disclosure,
                icon: ShieldCheck,
                content: (
                  <div className="pt-5">
                    <DetailList items={disclosureItems} />
                    <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
                      {t('technologyCompensation')}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{t('technologyPricingNote')}</p>
                  </div>
                ),
              },
            ].map(({ title, icon: Icon, content }) => (
              <details key={title} className="group py-1">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-3 font-serif text-lg font-bold text-slate-950">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {title}
                  </span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="pb-6 pl-0 sm:pl-12">{content}</div>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-8 bg-primary-dark px-6 py-10 text-white sm:px-8 lg:px-10 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">{copy.finalCta.eyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                {copy.finalCta.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-cyan-50/90">{copy.finalCta.body}</p>
              <p className="mt-4 text-sm font-medium text-cyan-100">{t('technologyCallNext')}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                href={contactHref(advisorNeed)}
                onClick={() => trackJourneyCta('final', advisorNeed)}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-brand-gold-light"
              >
                {copy.finalCta.primary}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={briefHref('final')}
                onClick={() => trackJourneyCta('brief', 'final')}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {copy.finalCta.secondary}
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-14 border-t border-slate-200 pt-12 pb-8">
          <h2 className="font-serif text-3xl font-bold text-slate-950">{t('faqTitle')}</h2>
          <div className="mt-6">
            <ServiceMiniFAQ namespace="services" keys={TECHNOLOGY_PAGE_FAQ_KEYS} />
          </div>
        </Reveal>
      </div>
      <StickyMobileCTA
        label={copy.finalCta.primary}
        sublabel={tCommon('ctaSubtext')}
        intent="consulting"
        focus="technology"
      />
    </section>
  )
}

export default TechnologyAdvisory
