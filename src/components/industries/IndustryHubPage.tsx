'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Check, BookOpen } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Reveal from '@/components/motion/Reveal'
import AiEmployeeIndustryDetail from '@/components/AiEmployeeIndustryDetail'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { aiEmployeeContent } from '@/lib/ai-employee-content'
import {
  INDUSTRY_SERVICE_TILE_IMAGES,
  SERVICE_KEYS,
  toIndustryOptImageSrc,
  type IndustryHub,
  type IndustryHubServiceKey,
} from '@/lib/industry-hub-content'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import IndustryHeroMotion from '@/components/industries/IndustryHeroMotion'
import IndustryTechnologyCategoryVisual, {
  supportsIndustryTechnologyCategoryVisual,
} from '@/components/industries/IndustryTechnologyCategoryVisual'

const PATH_HASH_PREFIX = 'path='

function fitBriefQuery(hub: IndustryHub, conversionSource: string) {
  return {
    industry: hub.label,
    icp: hub.label,
    campaign: 'industry-hub',
    conversion_source: conversionSource,
    entry_page: `/industries/${hub.id}`,
    signal: 'ai-employee',
  }
}

function fitBriefHref(hub: IndustryHub, conversionSource: string) {
  return {
    pathname: '/tools/ai-employee-fit-brief' as const,
    query: fitBriefQuery(hub, conversionSource),
  }
}

function fitBriefAbsoluteHref(language: 'en' | 'fr', hub: IndustryHub, conversionSource: string) {
  return `/${language}/tools/ai-employee-fit-brief?${new URLSearchParams(fitBriefQuery(hub, conversionSource)).toString()}`
}

function contactAbsoluteHref(
  language: 'en' | 'fr',
  hub: IndustryHub,
  contactQuery: Record<string, string>,
) {
  return `/${language}/contact?${new URLSearchParams(contactQuery).toString()}`
}

function ucPathwayHref(
  hub: IndustryHub,
  focus: 'ucaas' | 'ccaas' | 'ai-employee',
  conversionSource: string,
) {
  return {
    pathname: '/services/unified-communications-contact-centres-ai-employees' as const,
    query: {
      industry: hub.id,
      focus,
      campaign: 'industry-hub',
      conversion_source: conversionSource,
      entry_page: `/industries/${hub.id}`,
      signal: focus === 'ai-employee' ? 'ai-employee' : 'unified-communications',
    },
  }
}

function serviceHref(hub: IndustryHub, key: IndustryHubServiceKey) {
  switch (key) {
    case 'aiEmployee':
      return fitBriefHref(hub, 'industry_hub_ai_employee')
    case 'security':
      return '/services/security-risk-compliance' as const
    case 'ucaas':
      return ucPathwayHref(hub, 'ucaas', 'industry_hub_ucaas')
    case 'ccaas':
      return ucPathwayHref(hub, 'ccaas', 'industry_hub_ccaas')
    case 'cloudMigration':
      return { pathname: '/solutions/[slug]' as const, params: { slug: 'cloud-infrastructure' } }
    case 'automation':
      return '/services/automation' as const
    case 'visibility':
      return '/services/search-ai-visibility' as const
    case 'websites':
      return '/website-design' as const
  }
}

function popularLeadKey(hub: IndustryHub): IndustryHubServiceKey {
  switch (hub.startHere.target) {
    case 'ai-employee':
    case 'fit-brief':
      return 'aiEmployee'
    case 'security':
      return 'security'
    case 'communications':
      return hub.leadServices.includes('ucaas') ? 'ucaas' : hub.leadServices[0]
    case 'assessment':
      return hub.leadServices.includes('security') ? 'security' : hub.leadServices[0]
  }
}

function proofHref(hub: IndustryHub) {
  if (hub.proof.proof.kind === 'insight') {
    return {
      pathname: '/insights/[slug]' as const,
      params: { slug: hub.proof.proof.slug },
    }
  }
  return {
    pathname: '/use-cases' as const,
    hash: hub.proof.proof.slug,
  }
}

function readPathFromHash(hash: string): IndustryHubServiceKey | null {
  const raw = hash.replace(/^#/, '')
  if (!raw.startsWith(PATH_HASH_PREFIX)) return null
  const key = raw.slice(PATH_HASH_PREFIX.length)
  return (SERVICE_KEYS as readonly string[]).includes(key) ? (key as IndustryHubServiceKey) : null
}

function writePathHash(key: IndustryHubServiceKey | null) {
  const url = new URL(window.location.href)
  url.hash = key ? `${PATH_HASH_PREFIX}${key}` : ''
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
}

export default function IndustryHubPage({
  locale,
  hub,
}: {
  locale: string
  hub: IndustryHub
}) {
  const french = locale === 'fr'
  const language = french ? 'fr' : 'en'
  const reduceMotion = usePrefersReducedMotion()
  const aiCopy = aiEmployeeContent[language]
  const aiIndustry = aiCopy.industries.find((entry) => entry.id === hub.id)
  const [selectedPath, setSelectedPath] = useState<IndustryHubServiceKey | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const contactQuery = useMemo(
    () => ({
      intent: 'consulting',
      from_page: `/industries/${hub.id}`,
      goal: french
        ? `Secteur: ${hub.label}. ${hub.hero.title}`
        : `Industry: ${hub.label}. ${hub.hero.title}`,
      reference: hub.id,
    }),
    [french, hub.hero.title, hub.id, hub.label],
  )
  const aiFitHref = useMemo(
    () => fitBriefAbsoluteHref(language, hub, 'industry_hub_path_detail'),
    [hub, language],
  )
  const aiContactHref = useMemo(
    () => contactAbsoluteHref(language, hub, contactQuery),
    [contactQuery, hub, language],
  )

  const trackService = (key: IndustryHubServiceKey) => {
    trackAnalyticsEvent('industry_hub_service_click', {
      industry: hub.id,
      service: key,
    })
  }

  const selectPath = (key: IndustryHubServiceKey, opts?: { scroll?: boolean; track?: boolean }) => {
    setSelectedPath(key)
    writePathHash(key)
    if (opts?.track !== false) trackService(key)
    if (opts?.scroll !== false) {
      window.requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        })
      })
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const fromHash = readPathFromHash(window.location.hash)
    const allowed = fromHash && hub.leadServices.includes(fromHash) ? fromHash : null
    setSelectedPath(allowed)
    if (allowed) {
      window.requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' })
      })
    }
  }, [hub.id, hub.leadServices])

  useEffect(() => {
    const onHashChange = () => {
      const fromHash = readPathFromHash(window.location.hash)
      if (fromHash && hub.leadServices.includes(fromHash)) {
        setSelectedPath(fromHash)
        window.requestAnimationFrame(() => {
          detailRef.current?.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'start',
          })
        })
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [hub.leadServices, reduceMotion])

  const selectedBlock = selectedPath ? hub.services[selectedPath] : null
  const showAiDetail = selectedPath === 'aiEmployee' && Boolean(aiIndustry)
  const popularKey = popularLeadKey(hub)

  return (
    <div className="page-shell bg-white">
      <section
        data-header-tone="dark"
        className="relative isolate overflow-hidden bg-slate-950 px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-32"
      >
        <div className="absolute inset-0 -z-10" aria-hidden>
          <Image
            src={toIndustryOptImageSrc(hub.heroImage.src)}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/75" />
          <IndustryHeroMotion industry={hub.id} />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-light">{hub.hero.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {hub.label}
          </h1>
          <p className="mt-5 max-w-2xl text-xl font-medium leading-8 text-white/95 sm:text-2xl">{hub.hero.title}</p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">{hub.hero.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={{ pathname: '/contact', query: contactQuery }}
              onClick={() =>
                trackAnalyticsEvent('industry_hub_cta', { industry: hub.id, slot: 'hero_primary' })
              }
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
            >
              {hub.hero.primaryCta}
            </Link>
            <button
              type="button"
              onClick={() => {
                trackAnalyticsEvent('industry_hub_cta', { industry: hub.id, slot: 'hero_secondary' })
                selectPath('aiEmployee')
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              {hub.hero.secondaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </section>

      {supportsIndustryTechnologyCategoryVisual(hub.id) ? (
        <IndustryTechnologyCategoryVisual locale={language} industry={hub.id} />
      ) : null}

      <section className="border-b border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="max-w-3xl font-serif text-3xl font-bold text-slate-950 sm:text-4xl">
              {hub.pressuresTitle}
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {hub.pressures.map((item) => (
              <Reveal key={item} as="li" className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span className="text-sm leading-6 text-slate-700">{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{hub.ui.leadTilesTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {french
                ? 'Choisissez un parcours pour voir les détails adaptés à ce secteur.'
                : 'Choose a path to see details tailored to this industry.'}
            </p>
          </Reveal>
          <div
            role="listbox"
            aria-label={hub.ui.leadTilesTitle}
            className="mt-8 grid gap-6 sm:grid-cols-2"
          >
            {hub.leadServices.map((key) => {
              const block = hub.services[key]
              const selected = key === selectedPath
              const isPopular = key === popularKey
              return (
                <Reveal key={key}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => selectPath(key)}
                    className={[
                      'group/tile flex h-full w-full flex-col overflow-hidden rounded-xl border text-left transition',
                      selected
                        ? 'border-slate-900 ring-2 ring-slate-900'
                        : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-sm',
                    ].join(' ')}
                  >
                    <span className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100">
                      <Image
                        src={INDUSTRY_SERVICE_TILE_IMAGES[key]}
                        alt=""
                        fill
                        loading="lazy"
                        unoptimized
                        decoding="async"
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition duration-300 group-hover/tile:scale-[1.03]"
                      />
                      {isPopular ? (
                        <span className="absolute right-2 top-2 rounded-full bg-slate-950/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                          {hub.ui.popularLabel}
                        </span>
                      ) : null}
                    </span>
                    <span className={`flex flex-1 flex-col px-4 py-4 ${selected ? 'bg-slate-900' : 'bg-white'}`}>
                      <span
                        className={`text-xs font-bold uppercase tracking-[0.14em] ${selected ? 'text-brand-gold' : 'text-primary-dark'}`}
                      >
                        {block.eyebrow}
                      </span>
                      <span
                        className={`mt-2 font-serif text-xl font-bold ${selected ? 'text-white' : 'text-slate-950'}`}
                      >
                        {block.title}
                      </span>
                      {isPopular ? (
                        <span
                          className={`mt-2 text-sm leading-6 ${selected ? 'text-slate-300' : 'text-slate-600'}`}
                        >
                          {hub.startHere.lead}
                        </span>
                      ) : null}
                      <span
                        className={`mt-3 inline-flex items-center gap-2 text-sm font-bold ${selected ? 'text-brand-gold' : 'text-primary-dark'}`}
                      >
                        {french ? 'Voir les détails' : 'View details'}
                        <ArrowRight className="h-4 w-4 transition group-hover/tile:translate-x-0.5" aria-hidden />
                      </span>
                    </span>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <BookOpen className="h-4 w-4" aria-hidden />
                {hub.ui.proofEyebrow}
              </p>
              <h3 className="mt-2 font-serif text-xl font-bold text-slate-950">{hub.proof.label}</h3>
            </div>
            <Link
              href={proofHref(hub)}
              onClick={() =>
                trackAnalyticsEvent('industry_hub_cta', {
                  industry: hub.id,
                  slot: 'proof',
                  kind: hub.proof.proof.kind,
                })
              }
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary-dark underline-offset-4 hover:underline"
            >
              {french ? 'Lire la suite' : 'Read more'}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {selectedPath && selectedBlock ? (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          {showAiDetail && aiIndustry ? (
            <AiEmployeeIndustryDetail
              industry={aiIndustry}
              audienceSelectHint={aiCopy.audienceSelectHint}
              selectedLabel={aiCopy.selectedLabel}
              primaryCta={aiCopy.primaryCta}
              secondaryCta={aiCopy.secondaryCta}
              fitHref={aiFitHref}
              contactHref={aiContactHref}
              detailRef={detailRef}
              className="mx-auto max-w-6xl"
              onAudienceChange={(audienceId) =>
                trackAnalyticsEvent('ai_employee_audience', {
                  industry: hub.id,
                  audience: audienceId,
                })
              }
              onFitClick={() => trackService('aiEmployee')}
              onContactClick={() =>
                trackAnalyticsEvent('industry_hub_cta', {
                  industry: hub.id,
                  slot: 'path_detail_contact',
                })
              }
              footer={
                <Link
                  href={ucPathwayHref(hub, 'ai-employee', 'industry_hub_ai_uc_bridge')}
                  onClick={() =>
                    trackAnalyticsEvent('industry_hub_cta', {
                      industry: hub.id,
                      slot: 'path_detail_uc_bridge',
                    })
                  }
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary-dark underline-offset-4 hover:underline"
                >
                  {french
                    ? 'Voir comment cela s’intègre à la téléphonie et au centre de contact'
                    : 'See how this fits with calling and the contact centre'}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              }
            />
          ) : (
            <div ref={detailRef} className="mx-auto max-w-3xl scroll-mt-28">
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">
                  {selectedBlock.eyebrow}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">
                  {selectedBlock.title}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{selectedBlock.lead}</p>
                <ul className="mt-6 space-y-3">
                  {selectedBlock.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-6 text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href={serviceHref(hub, selectedPath)}
                    onClick={() => trackService(selectedPath)}
                    className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
                  >
                    {selectedBlock.ctaLabel}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </Reveal>
            </div>
          )}
        </section>
      ) : null}

      <section className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{hub.ui.relatedTitle}</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{hub.ui.relatedLead}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hub.relatedServices.map((key) => {
              const block = hub.services[key]
              return (
                <Reveal key={key} className="flex h-full flex-col border-t border-slate-200 pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{block.eyebrow}</p>
                  <h3 className="mt-2 font-serif text-xl font-bold text-slate-950">{block.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{block.lead}</p>
                  <Link
                    href={serviceHref(hub, key)}
                    onClick={() => trackService(key)}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-dark underline-offset-4 hover:underline"
                  >
                    {block.ctaLabel}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute -right-16 top-8 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">{hub.closer.title}</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">{hub.closer.lead}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={{ pathname: '/contact', query: contactQuery }}
                onClick={() =>
                  trackAnalyticsEvent('industry_hub_cta', { industry: hub.id, slot: 'closer_primary' })
                }
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
              >
                {hub.closer.primaryCta}
              </Link>
              <Link
                href="/industries"
                onClick={() =>
                  trackAnalyticsEvent('industry_hub_cta', { industry: hub.id, slot: 'closer_secondary' })
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {hub.closer.secondaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <Link
              href={{ pathname: '/use-cases', query: { industry: hub.id } }}
              onClick={() =>
                trackAnalyticsEvent('industry_hub_cta', { industry: hub.id, slot: 'closer_use_cases' })
              }
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 underline-offset-4 hover:text-white hover:underline"
            >
              {french ? 'Voir les scénarios pour ce secteur' : 'See scenarios for this industry'}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
