import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import { INSIGHT_SLUGS } from '@/lib/insights'
import { formatInsightReadTime } from '@/lib/insight-read-time'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

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
  const tBc = await getTranslations('breadcrumb')

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {INSIGHT_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={{ pathname: '/insights/[slug]', params: { slug } }}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:border-primary/30 hover:shadow-card-hover transition-all"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">{formatInsightReadTime(t, slug)}</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900 group-hover:text-primary-dark transition-colors">
                {t(`${slug}.title`)}
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{t(`${slug}.summary`)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
