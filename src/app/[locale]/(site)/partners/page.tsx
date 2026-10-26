import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import Reveal from '@/components/motion/Reveal'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import PartnersBrandLockup from '@/components/partners/PartnersBrandLockup'
import PartnersClosingCta from '@/components/partners/PartnersClosingCta'
import PartnersHashRedirect from '@/components/partners/PartnersHashRedirect'
import PartnersLogoStrip from '@/components/partners/PartnersLogoStrip'
import PartnersSectionNav from '@/components/partners/PartnersSectionNav'
import PartnersEnterpriseEngage from '@/components/partners/PartnersEnterpriseEngage'
import PartnersGovernanceBands from '@/components/partners/PartnersGovernanceBands'
import PartnersHubContinue from '@/components/partners/PartnersHubContinue'
import PartnersPageActions from '@/components/partners/PartnersPageActions'
import PartnersRelationshipMatrix from '@/components/partners/PartnersRelationshipMatrix'
import PartnersRoleEntry from '@/components/partners/PartnersRoleEntry'
import PartnersStartHere from '@/components/partners/PartnersStartHere'
import PartnersTrackLink from '@/components/partners/PartnersTrackLink'
import { partnersSectionNav } from '@/lib/partners-sections'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, ecosystemItemListJsonLd, webPageJsonLd } from '@/lib/structured-data'
import { ecosystemKeys } from '@/lib/technologyEcosystem'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path: '/partners',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    ogImage: '/images/partners/partner-outcome-access.webp',
    ogImageAlt: t('outcome1Alt'),
  })
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })
  const tEco = await getTranslations({ locale, namespace: 'home.technologyEcosystem' })
  const tBreadcrumb = await getTranslations('breadcrumb')
  const tCommon = await getTranslations('common')

  return (
    <main className="page-shell">
      <PartnersHashRedirect />
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
            <PartnersBrandLockup
              companyName={tCommon('companyName')}
              label={t('brandAdvisorLabel')}
              size="lg"
              tone="dark"
            />
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-primary-light">{t('eyebrow')}</p>
            <h1 className="mt-4 font-serif text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{t('subtitle')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PartnersTrackLink
                href="/services/technology-advisory"
                event="partners_hero_cta"
                eventParams={{ path: '/partners', slot: 'primary' }}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-primary-light"
              >
                {t('heroPrimaryCta')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </PartnersTrackLink>
              <PartnersTrackLink
                href="/partners/evaluation-standard"
                event="partners_hero_cta"
                eventParams={{ path: '/partners', slot: 'secondary' }}
                className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline"
              >
                {t('heroSecondaryCta')}
              </PartnersTrackLink>
            </div>
          </Reveal>
        </div>
      </header>

      <PartnersLogoStrip />
      <PartnersSectionNav current="/partners" />

      <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Breadcrumb items={[{ label: tBreadcrumb('home'), href: '/' }, { label: t('title') }]} />
          <PartnersPageActions pagePath="/partners" pageTitle={t('title')} />
        </div>
        <div className="mt-6">
          <PartnersHubContinue />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <PartnersRoleEntry />
        <PartnersStartHere />

        <section className="border-b border-slate-200 py-12 lg:py-14" aria-labelledby="partner-outcomes-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{t('outcomesEyebrow')}</p>
            <h2 id="partner-outcomes-heading" className="mt-3 font-serif text-3xl font-bold text-slate-950 lg:text-4xl">
              {t('outcomesTitle')}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">{t('outcomesDescription')}</p>
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-900">{t('outcomesInsightTitle')}</span>{' '}
            {t('outcomesInsightBody')}
          </p>
        </section>

        <section className="border-b border-slate-200 py-12 lg:py-14" aria-labelledby="matrix-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{t('matrixEyebrow')}</p>
            <h2 id="matrix-heading" className="mt-3 font-serif text-3xl font-bold text-slate-950 lg:text-4xl">
              {t('matrixTitle')}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">{t('matrixDescription')}</p>
          </div>
          <div className="mt-8">
            <PartnersRelationshipMatrix />
          </div>
        </section>

        <section className="py-12 lg:py-16" aria-labelledby="browse-sections-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{t('browseEyebrow')}</p>
            <h2 id="browse-sections-heading" className="mt-3 font-serif text-3xl font-bold text-slate-950 lg:text-4xl">
              {t('browseTitle')}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">{t('browseDescription')}</p>
          </div>
          <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {partnersSectionNav.map((item) => (
              <li key={item.path}>
                <PartnersTrackLink
                  href={item.path}
                  event="partners_section_nav"
                  eventParams={{ path: item.path, location: 'browse_list' }}
                  className="group flex items-center justify-between gap-4 py-5 transition hover:bg-slate-50/80"
                >
                  <span className="font-serif text-xl font-bold text-slate-950 group-hover:text-primary-dark">
                    {t(item.labelKey)}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary-dark transition group-hover:translate-x-0.5" aria-hidden />
                </PartnersTrackLink>
              </li>
            ))}
          </ul>
        </section>

        <div className="py-12 lg:py-16">
          <PartnersGovernanceBands />
        </div>

        <PartnersEnterpriseEngage />
      </div>

      <PartnersClosingCta pagePath="/partners" />

      <StickyMobileCTA
        label={t('heroPrimaryCta')}
        sublabel={tCommon('ctaSubtext')}
        href="/services/technology-advisory"
        brandMark
        analyticsEvent="partners_sticky_cta"
        analyticsParams={{ path: '/partners' }}
      />
    </main>
  )
}
