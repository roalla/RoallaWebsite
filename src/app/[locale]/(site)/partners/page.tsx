import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CloudCog,
  Handshake,
  Network,
  PhoneCall,
  Radio,
  ShieldCheck,
} from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import Reveal from '@/components/motion/Reveal'
import PartnersLogoStrip from '@/components/partners/PartnersLogoStrip'
import { Link } from '@/i18n/navigation'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, ecosystemItemListJsonLd, webPageJsonLd } from '@/lib/structured-data'
import { ecosystemCtas, ecosystemDirectoryGroups, ecosystemKeys, ecosystemLogos } from '@/lib/technologyEcosystem'

type Props = {
  params: Promise<{ locale: string }>
}

const categoryIcons = [CloudCog, ShieldCheck, Bot, PhoneCall, Network, Radio] as const
const categoryKeys = ['category1', 'category2', 'category3', 'category4', 'category5', 'category6'] as const
const standardKeys = ['standard1', 'standard2', 'standard3', 'standard4', 'standard5', 'standard6', 'standard7', 'standard8'] as const
const outcomeLinks = [
  { key: 'outcome1', href: '#strategic-relationships' },
  { key: 'outcome2', href: '#evaluation-standard' },
  { key: 'outcome3', href: '#compensation' },
] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path: '/partners',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })
  const tEco = await getTranslations({ locale, namespace: 'home.technologyEcosystem' })
  const tBreadcrumb = await getTranslations('breadcrumb')

  return (
    <main className="page-shell">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: tBreadcrumb('home'), path: '' },
            { name: t('title') },
          ]),
          webPageJsonLd(locale, '/partners', t('title'), t('metadataDescription')),
          ecosystemItemListJsonLd(
            locale,
            t('organizationsTitle'),
            ecosystemKeys.map((key) => ({
              id: key === 'telarus' ? 'strategic-relationships' : key,
              name: tEco(`${key}.name`),
              description: `${tEco(`${key}.relationship`)} — ${tEco(`${key}.need`)}`,
            })),
          ),
        ]}
      />

      <div className="sr-only">
        <Breadcrumb items={[{ label: tBreadcrumb('home'), href: '/' }, { label: t('title') }]} />
      </div>

      <header
        id="ecosystem-overview"
        data-header-tone="dark"
        className="relative isolate scroll-mt-28 overflow-hidden bg-[#090b0e] px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-36"
      >
        <Image
          src="/images/partners/partner-outcome-access.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#050608] via-[#050608]/92 to-[#050608]/55" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-transparent to-black/70" aria-hidden />

        <div className="mx-auto max-w-7xl">
          <Reveal when="mount" className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-light">{t('eyebrow')}</p>
            <h1 className="mt-5 font-serif text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{t('subtitle')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/services/technology-advisory"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-primary-light"
              >
                {t('heroPrimaryCta')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
              <a
                href="#evaluation-standard"
                className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline"
              >
                {t('heroSecondaryCta')}
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      <PartnersLogoStrip />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <section
          id="partner-outcomes"
          className="scroll-mt-28 border-b border-slate-200 py-12 lg:py-14"
          aria-labelledby="partner-outcomes-heading"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{t('outcomesEyebrow')}</p>
            <h2 id="partner-outcomes-heading" className="mt-3 font-serif text-3xl font-bold text-slate-950 lg:text-4xl">
              {t('outcomesTitle')}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">{t('outcomesDescription')}</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {outcomeLinks.map((outcome) => (
              <a
                key={outcome.key}
                href={outcome.href}
                className="group block border-t border-slate-200 pt-5 transition hover:border-primary"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t(`${outcome.key}Label`)}</p>
                <h3 className="mt-2 font-serif text-xl font-bold text-slate-950 group-hover:text-primary-dark">
                  {t(`${outcome.key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t(`${outcome.key}Body`)}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark">
                  {t(`${outcome.key}Link`)}
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </a>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-900">{t('outcomesInsightTitle')}</span>{' '}
            {t('outcomesInsightBody')}
          </p>
        </section>

        <section
          id="strategic-relationships"
          className="scroll-mt-28 py-12 lg:py-16"
          aria-labelledby="telarus-heading"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Handshake className="h-5 w-5 text-primary-dark" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {t('strategicRelationshipsTitle')}
                  </p>
                  <h2 id="telarus-heading" className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                    {t('telarusTitle')}
                  </h2>
                </div>
              </div>
              <p className="mt-5 leading-relaxed text-slate-700">{t('telarusBody')}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                <span className="font-semibold text-slate-900">{t('businessNeedLabel')}:</span> {tEco('telarus.need')}
              </p>
            </div>
            <aside className="max-w-sm border-l-2 border-primary/40 pl-5 lg:mt-2">
              <p className="text-sm font-semibold text-slate-900">{t('positioningTitle')}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t('positioningBody')}</p>
            </aside>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {categoryKeys.map((key, index) => {
              const Icon = categoryIcons[index]
              return (
                <li
                  key={key}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                  {t(key)}
                </li>
              )
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-stretch sm:gap-0 sm:p-0 sm:overflow-hidden">
            <Link
              href="/tools/communications-value-brief"
              className="flex flex-1 flex-col justify-center rounded-xl bg-white px-5 py-4 transition hover:bg-primary/[0.04] sm:rounded-none sm:border-r sm:border-slate-200"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
                {t('category4')} · {t('category5')}
              </p>
              <p className="mt-1 font-serif text-lg font-bold text-slate-950">{t('commsToolTitle')}</p>
              <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary-dark">
                {t('commsToolCta')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href="/tools/technology-decision-brief"
              className="flex flex-1 flex-col justify-center rounded-xl bg-white px-5 py-4 transition hover:bg-primary/[0.04] sm:rounded-none"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">{t('eyebrow')}</p>
              <p className="mt-1 font-serif text-lg font-bold text-slate-950">{t('techToolTitle')}</p>
              <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary-dark">
                {t('techToolCta')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </span>
            </Link>
          </div>
        </section>

        <section className="border-t border-slate-200 pt-12 lg:pt-16" aria-labelledby="ecosystem-organizations-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{t('organizationsEyebrow')}</p>
            <h2 id="ecosystem-organizations-heading" className="mt-3 font-serif text-3xl font-bold text-slate-950 lg:text-4xl">
              {t('organizationsTitle')}
            </h2>
            <p className="mt-4 leading-7 text-slate-600">{t('organizationsDescription')}</p>
          </div>

          <div className="mt-10 space-y-14">
            {ecosystemDirectoryGroups.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-28" aria-labelledby={`${group.id}-heading`}>
                <div className="max-w-3xl">
                  <h3 id={`${group.id}-heading`} className="font-serif text-2xl font-bold text-slate-950">
                    {t(group.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t(group.descriptionKey)}</p>
                </div>
                <ul className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
                  {group.keys.map((key) => {
                    const logo = ecosystemLogos[key]
                    const cta = ecosystemCtas[key]
                    return (
                      <li
                        id={key}
                        key={key}
                        className="scroll-mt-28 group grid gap-5 py-7 transition hover:bg-slate-50/80 sm:grid-cols-[11rem_1fr] sm:items-start sm:gap-8 lg:py-8"
                      >
                        <div className="flex h-16 w-full max-w-[11rem] items-center justify-center rounded-xl bg-white px-3 ring-1 ring-slate-200">
                          {logo ? (
                            <Image
                              src={logo.src}
                              alt=""
                              width={logo.width}
                              height={logo.height}
                              className={logo.className}
                              unoptimized
                            />
                          ) : (
                            <span className="text-base font-extrabold tracking-tight text-slate-900">
                              {tEco(`${key}.wordmark`)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                            {tEco(`${key}.relationship`)}
                          </p>
                          <h4 className="mt-1 font-serif text-xl font-bold text-slate-950">{tEco(`${key}.name`)}</h4>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{tEco(`${key}.description`)}</p>
                          <p className="mt-3 text-sm leading-6 text-slate-500">
                            <span className="font-semibold text-slate-700">{t('businessNeedLabel')}:</span>{' '}
                            {tEco(`${key}.need`)}
                          </p>
                          {cta?.type === 'external' ? (
                            <a
                              href={cta.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary-dark hover:underline"
                            >
                              {tEco(`${key}.cta`)}
                              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                            </a>
                          ) : null}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>

          <p className="mt-8 text-sm leading-6 text-slate-500">{t('organizationsNote')}</p>
        </section>

        <div
          id="trust-strip"
          className="mt-14 grid gap-10 border-t border-slate-200 pt-12 lg:mt-16 lg:grid-cols-2 lg:gap-14 lg:pt-14"
        >
          <section id="evaluation-standard" className="scroll-mt-28">
            <h2 className="font-serif text-2xl font-bold text-slate-900">{t('standardTitle')}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{t('standardIntro')}</p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {standardKeys.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                  {t(key)}
                </li>
              ))}
            </ul>
          </section>

          <section id="compensation" className="scroll-mt-28">
            <h2 className="font-serif text-2xl font-bold text-slate-900">{t('compensationTitle')}</h2>
            <p className="mt-4 leading-relaxed text-slate-700">{t('compensationBody')}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{t('compensationCommitment')}</p>
            <Link href="/terms" className="mt-5 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline">
              {t('termsLink')}
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
            </Link>
          </section>
        </div>
      </div>

      <section
        data-header-tone="dark"
        className="bg-slate-950 px-4 py-14 text-center text-white sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-bold text-white">{t('ctaTitle')}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">{t('ctaBody')}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={{ pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } }}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-primary-light"
            >
              {t('ctaButton')}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/services/digital"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('digitalLink')}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
