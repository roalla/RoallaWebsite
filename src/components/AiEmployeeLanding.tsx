'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
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
  const [heroReady, setHeroReady] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      setHeroReady(true)
      return
    }
    const id = window.requestAnimationFrame(() => setHeroReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [reduceMotion])

  const fitHrefBase = useMemo(() => {
    const params = new URLSearchParams({
      offer: 'AI Employee Fit Brief',
      campaign: 'ai-employee',
      conversion_source: 'ai_employee_page',
      entry_page: '/ai-employee',
      signal: 'ai-employee',
    })
    return `/${language}/tools/ai-employee-fit-brief?${params.toString()}`
  }, [language])

  const contactHrefBase = useMemo(() => {
    const params = new URLSearchParams({
      intent: 'consulting',
      focus: 'technology',
      from_page: '/ai-employee',
      goal: content.eyebrow,
    })
    return `/${language}/contact?${params.toString()}`
  }, [content.eyebrow, language])

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
    }
    setFitHref(appendAttributionToHref(fitHrefBase, inbound, defaults))
    setContactHref(appendAttributionToHref(contactHrefBase, inbound, defaults))
  }, [contactHrefBase, content.eyebrow, fitHrefBase])

  const trackCta = (slot: string) => {
    trackAnalyticsEvent('ai_employee_cta', { slot })
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
              unoptimized
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1440px"
              className={[
                'object-cover transition-transform duration-[1800ms] ease-out',
                reduceMotion || !heroReady ? 'scale-100' : 'scale-105',
              ].join(' ')}
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.68)_0%,rgba(15,23,42,0.5)_52%,rgba(15,23,42,0.4)_100%)] md:bg-[linear-gradient(to_right,rgba(15,23,42,0.55)_0%,rgba(15,23,42,0.24)_38%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.22)_0%,rgba(15,23,42,0.1)_34%,rgba(15,23,42,0.5)_66%,rgba(15,23,42,0.8)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/55 to-transparent" />
          </div>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal when="mount" className="max-w-3xl">
              <p className="font-serif text-3xl font-bold tracking-tight text-white [text-shadow:0_1px_2px_rgba(15,23,42,0.55)] sm:text-4xl">
                {content.brandName}
              </p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold [text-shadow:0_1px_2px_rgba(15,23,42,0.65)]">
                {content.eyebrow}
              </p>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-white [text-shadow:0_2px_16px_rgba(15,23,42,0.45)] sm:text-5xl lg:text-6xl">
                {content.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white [text-shadow:0_1px_2px_rgba(15,23,42,0.6)]">{content.lead}</p>
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
                  className="inline-flex min-h-12 items-center rounded-lg border border-white/55 bg-slate-950/45 px-6 py-3 font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-slate-950/60"
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
                        loading="lazy"
                        unoptimized
                        decoding="async"
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

        <section className="border-b border-slate-200 bg-slate-50 py-16" id="industries">
          <div className="container mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{content.industriesEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{content.industriesTitle}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{content.industriesLead}</p>
              <Link
                href="/industries"
                onClick={() => trackCta('browse_industries')}
                className="mt-8 inline-flex min-h-12 items-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:border-primary"
              >
                {content.industriesBrowseLabel}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
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
            <div className="mb-10 grid gap-5 rounded-2xl bg-slate-950 p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                  {language === 'fr' ? 'Relier l’employé IA à la conversation' : 'Connect the AI Employee to the conversation'}
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-white">
                  {language === 'fr'
                    ? 'Voyez comment l’IA s’intègre à la téléphonie et au centre de contact.'
                    : 'See how AI fits with business calling and the contact centre.'}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                  {language === 'fr'
                    ? 'Concevez ensemble les canaux, les connaissances, les intégrations et le relais humain.'
                    : 'Design channels, knowledge, integrations and human handoff together.'}
                </p>
              </div>
              <Link
                href="/services/unified-communications-contact-centres-ai-employees"
                onClick={() => trackCta('unified_comms_link')}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 hover:bg-brand-gold-light"
              >
                {language === 'fr' ? 'Explorer le parcours unifié' : 'Explore the unified pathway'}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>
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
                          loading="lazy"
                          unoptimized
                          decoding="async"
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
