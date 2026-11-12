'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { ArrowRight, Check, Compass, BookOpen } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Reveal from '@/components/motion/Reveal'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  INDUSTRY_SERVICE_TILE_IMAGES,
  type IndustryHub,
  type IndustryHubServiceKey,
  type IndustryHubStartHere,
} from '@/lib/industry-hub-content'

function serviceHref(hub: IndustryHub, key: IndustryHubServiceKey) {
  switch (key) {
    case 'aiEmployee':
      return { pathname: '/ai-employee' as const, query: { industry: hub.id } }
    case 'security':
      return '/services/security-risk-compliance' as const
    case 'ucaas':
      return {
        pathname: '/solutions/[slug]' as const,
        params: { slug: 'communications' },
        hash: 'unified-communications',
      }
    case 'ccaas':
      return {
        pathname: '/solutions/[slug]' as const,
        params: { slug: 'communications' },
        hash: 'contact-center',
      }
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

function startHereHref(hub: IndustryHub, startHere: IndustryHubStartHere) {
  switch (startHere.target) {
    case 'ai-employee':
      return serviceHref(hub, 'aiEmployee')
    case 'fit-brief':
      return {
        pathname: '/tools/ai-employee-fit-brief' as const,
        query: {
          industry: hub.label,
          icp: hub.label,
          campaign: 'industry-hub',
          conversion_source: 'industry_hub_start_here',
          entry_page: `/industries/${hub.id}`,
          signal: 'ai-employee',
        },
      }
    case 'security':
      return '/services/security-risk-compliance' as const
    case 'communications':
      return {
        pathname: '/solutions/[slug]' as const,
        params: { slug: 'communications' },
      }
    case 'assessment':
      return '/assessment' as const
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

export default function IndustryHubPage({
  locale,
  hub,
}: {
  locale: string
  hub: IndustryHub
}) {
  const french = locale === 'fr'
  const contactQuery = {
    intent: 'consulting' as const,
    from_page: `/industries/${hub.id}`,
    goal: french
      ? `Secteur: ${hub.label}. ${hub.hero.title}`
      : `Industry: ${hub.label}. ${hub.hero.title}`,
    reference: hub.id,
  }

  const trackService = (key: IndustryHubServiceKey) => {
    trackAnalyticsEvent('industry_hub_service_click', {
      industry: hub.id,
      service: key,
    })
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [hub.id])

  return (
    <div className="page-shell bg-white">
      <section
        data-header-tone="dark"
        className="relative isolate overflow-hidden bg-slate-950 px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-32"
      >
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
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
            <Link
              href={serviceHref(hub, 'aiEmployee')}
              onClick={() => {
                trackService('aiEmployee')
                trackAnalyticsEvent('industry_hub_cta', { industry: hub.id, slot: 'hero_secondary' })
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              {hub.hero.secondaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

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

      <section className="border-b border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-6 sm:p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">
              <Compass className="h-4 w-4" aria-hidden />
              {hub.ui.startHereEyebrow}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-slate-950 sm:text-3xl">{hub.startHere.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base">{hub.startHere.lead}</p>
            <Link
              href={startHereHref(hub, hub.startHere)}
              onClick={() =>
                trackAnalyticsEvent('industry_hub_cta', {
                  industry: hub.id,
                  slot: 'start_here',
                  target: hub.startHere.target,
                })
              }
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
            >
              {hub.startHere.ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
          <Reveal className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              <BookOpen className="h-4 w-4" aria-hidden />
              {hub.ui.proofEyebrow}
            </p>
            <h3 className="mt-3 font-serif text-xl font-bold text-slate-950">{hub.proof.label}</h3>
            <Link
              href={proofHref(hub)}
              onClick={() =>
                trackAnalyticsEvent('industry_hub_cta', {
                  industry: hub.id,
                  slot: 'proof',
                  kind: hub.proof.proof.kind,
                })
              }
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-dark underline-offset-4 hover:underline"
            >
              {french ? 'Lire la suite' : 'Read more'}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{hub.ui.leadTilesTitle}</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {hub.leadServices.map((key) => {
              const block = hub.services[key]
              return (
                <Reveal key={key}>
                  <Link
                    href={serviceHref(hub, key)}
                    onClick={() => trackService(key)}
                    className="group/tile flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition hover:border-primary/50 hover:shadow-sm"
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
                    </span>
                    <span className="flex flex-1 flex-col px-4 py-4">
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                        {block.eyebrow}
                      </span>
                      <span className="mt-2 font-serif text-xl font-bold text-slate-950">{block.title}</span>
                      <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary-dark">
                        {block.ctaLabel}
                        <ArrowRight className="h-4 w-4 transition group-hover/tile:translate-x-0.5" aria-hidden />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {hub.leadServices.map((key, index) => {
        const block = hub.services[key]
        return (
          <section
            key={key}
            className={`px-4 py-16 sm:px-6 lg:px-8 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{block.eyebrow}</p>
                <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{block.title}</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{block.lead}</p>
                <ul className="mt-6 space-y-3">
                  {block.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-6 text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={serviceHref(hub, key)}
                  onClick={() => trackService(key)}
                  className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
                >
                  {block.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Reveal>
            </div>
          </section>
        )
      })}

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
          </Reveal>
        </div>
      </section>
    </div>
  )
}
