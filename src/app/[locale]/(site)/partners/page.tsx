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
import PartnersGovernanceBands from '@/components/partners/PartnersGovernanceBands'
import PartnersHubContinue from '@/components/partners/PartnersHubContinue'
import PartnersOutcomesStrip from '@/components/partners/PartnersOutcomesStrip'
import PartnersPageActions from '@/components/partners/PartnersPageActions'
import PartnersProcurementMatrix from '@/components/partners/PartnersProcurementMatrix'
import PartnersSoftPrompt from '@/components/partners/PartnersSoftPrompt'
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
    <div className="page-shell">
      <PartnersHashRedirect />
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: tBreadcrumb('home'), path: '' },
            { name: t('breadcrumbTitle') },
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
                href={{ pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } }}
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
          <Breadcrumb items={[{ label: tBreadcrumb('home'), href: '/' }, { label: t('breadcrumbTitle') }]} />
          <PartnersPageActions pagePath="/partners" pageTitle={t('breadcrumbTitle')} />
        </div>
        <div className="mt-6">
          <PartnersHubContinue />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <PartnersOutcomesStrip />

        <Reveal className="border-b border-slate-200 py-12 lg:py-14" aria-labelledby="who-for-heading">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{t('whoForEyebrow')}</p>
          <h2 id="who-for-heading" className="mt-3 max-w-3xl font-serif text-3xl font-bold text-slate-950 lg:text-4xl">
            {t('whoForTitle')}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{t('whoForBody')}</p>
          <div className="mt-8 max-w-3xl border-l-4 border-slate-300 pl-5">
            <p className="font-serif text-xl font-bold text-slate-950">{t('whoNotTitle')}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t('whoNotBody')}</p>
          </div>
        </Reveal>

        <section className="border-b border-slate-200 py-12 lg:py-14" aria-labelledby="browse-sections-heading">
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
                  <span className="min-w-0">
                    <span className="block font-serif text-xl font-bold text-slate-950 group-hover:text-primary-dark">
                      {t(item.labelKey)}
                    </span>
                    {'descriptionKey' in item && item.descriptionKey ? (
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        {t(item.descriptionKey)}
                      </span>
                    ) : null}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary-dark transition group-hover:translate-x-0.5" aria-hidden />
                </PartnersTrackLink>
              </li>
            ))}
          </ul>
        </section>

        <div className="py-12 lg:py-14">
          <PartnersProcurementMatrix />
        </div>

        <div className="pb-12 lg:pb-16">
          <PartnersGovernanceBands />
        </div>
      </div>

      <PartnersSoftPrompt
        title={t('softPromptTitle')}
        body={t('softPromptBody')}
        ctaLabel={t('softPromptCta')}
        dismissLabel={t('softPromptDismiss')}
      />

      <PartnersClosingCta pagePath="/partners" />

      <StickyMobileCTA
        label={t('heroPrimaryCta')}
        sublabel={tCommon('ctaSubtext')}
        intent="consulting"
        focus="technology"
        brandMark
        analyticsEvent="partners_sticky_cta"
        analyticsParams={{ path: '/partners' }}
      />
    </div>
  )
}
