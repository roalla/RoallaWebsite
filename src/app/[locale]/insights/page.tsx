import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import InsightsBrowser, { type InsightBrowserCard } from '@/components/insights/InsightsBrowser'
import JsonLd from '@/components/JsonLd'
import { getEnrichedInsight } from '@/lib/enriched-insights'
import { INSIGHT_GROUPS, insightBrowserArea, type InsightBrowserArea, type InsightSlug } from '@/lib/insights'
import { formatInsightReadTime } from '@/lib/insight-read-time'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'
import { Link } from '@/i18n/navigation'
import {
  CONTRAST_TEXT_SIZE_INSIGHT_SLUG,
  FREE_WEBSITE_BUILDER_TRADEOFFS_SLUG,
  GEO_SEO_AEO_BOTS_SLUG,
  NETWORKING_ROI_INSIGHT_SLUG,
  WEBSITE_BUILDER_INSIGHT_SLUG,
} from '@/lib/website-builder-insight'

function insightCategory(
  slug: InsightSlug,
  locale: string,
  t: Awaited<ReturnType<typeof getTranslations>>,
) {
  if (
    slug === WEBSITE_BUILDER_INSIGHT_SLUG
    || slug === FREE_WEBSITE_BUILDER_TRADEOFFS_SLUG
    || slug === CONTRAST_TEXT_SIZE_INSIGHT_SLUG
    || slug === NETWORKING_ROI_INSIGHT_SLUG
    || slug === GEO_SEO_AEO_BOTS_SLUG
  ) {
    return t(`${slug}.category`)
  }
  return getEnrichedInsight(slug, locale).copy.category
}

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'insights' })

  return buildPageMetadata({
    locale,
    path: '/insights',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function InsightsIndexPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'insights' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tBc = await getTranslations('breadcrumb')

  const articleGroups: { id: InsightBrowserArea; title: string; intro: string }[] = [
    { id: 'digital', title: t('groupDigital'), intro: t('groupDigitalIntro') },
    { id: 'business', title: t('groupBusiness'), intro: t('groupBusinessIntro') },
    { id: 'technology', title: t('groupTechnology'), intro: t('groupTechnologyIntro') },
  ]

  const orderedSlugs: { slug: InsightSlug; group: InsightBrowserArea }[] = [
    ...INSIGHT_GROUPS.digital.map((slug) => ({ slug, group: 'digital' as const })),
    ...INSIGHT_GROUPS.advisory.map((slug) => ({ slug, group: insightBrowserArea(slug) })),
  ]

  const articles: InsightBrowserCard[] = orderedSlugs.map(({ slug, group }) => ({
    slug,
    group,
    title: t(`${slug}.title`),
    summary: t(`${slug}.summary`),
    readTime: formatInsightReadTime(t, slug),
    category: insightCategory(slug, locale, t),
  }))

  const otherLinks: {
    href: '/use-cases' | '/faq' | '/assessment'
    title: string
    summary: string
  }[] = [
    {
      href: '/use-cases',
      title: tNav('resourcesUseCases'),
      summary: tNav('resourcesUseCasesDesc'),
    },
    {
      href: '/faq',
      title: tNav('resourcesFaq'),
      summary: tNav('resourcesFaqDesc'),
    },
    {
      href: '/assessment',
      title: tNav('resourcesAssessment'),
      summary: tNav('resourcesAssessmentDesc'),
    },
  ]

  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: tBc('home'), path: '' },
            { name: t('indexTitle') },
          ]),
          webPageJsonLd(locale, '/insights', t('indexTitle'), t('metadataDescription')),
        ]}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <Breadcrumb items={[{ label: tBc('home'), href: '/' }, { label: t('indexTitle') }]} />
        <header className="max-w-3xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900">{t('indexTitle')}</h1>
          <p className="mt-4 text-lg text-slate-600">{t('indexSubtitle')}</p>
          <p className="mt-4">
            <a
              href={locale === 'fr' ? '/feed.xml?locale=fr' : '/feed.xml'}
              className="text-sm font-semibold text-primary-dark hover:underline"
            >
              {t('rssSubscribe')}
            </a>
          </p>
        </header>
        <section className="mb-12 grid gap-6 overflow-hidden bg-slate-950 p-7 text-white shadow-card sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end" aria-labelledby="executive-guides-title">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
              {locale === 'fr' ? 'Perspectives pour dirigeants' : 'ROALLA Executive Insights'}
            </p>
            <h2 id="executive-guides-title" className="mt-4 max-w-3xl font-serif text-3xl font-normal leading-tight">
              {locale === 'fr' ? 'Des guides décisionnels pour les enjeux qui façonnent la suite.' : 'Decision guides for the issues that shape what comes next.'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {locale === 'fr' ? 'Explorez des cadres pratiques sur l’IA, la croissance, la technologie, le risque, les opérations et la valeur d’entreprise.' : 'Explore practical frameworks for AI, growth, technology, risk, operations, and enterprise value.'}
            </p>
          </div>
          <Link href="/executive-insights" className="inline-flex min-h-12 items-center justify-center bg-primary px-5 text-sm font-bold text-slate-950">
            {locale === 'fr' ? 'Explorer les guides' : 'Explore executive guides'}
          </Link>
        </section>
        <Suspense fallback={<div className="h-44 max-w-6xl animate-pulse rounded-2xl bg-slate-100" />}>
          <InsightsBrowser
            articles={articles}
            groups={articleGroups}
            otherTitle={t('groupOther')}
            otherIntro={t('groupOtherIntro')}
            otherLinks={otherLinks}
          />
        </Suspense>
      </div>
    </div>
  )
}
