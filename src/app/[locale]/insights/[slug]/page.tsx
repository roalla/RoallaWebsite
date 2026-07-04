import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import { Link } from '@/i18n/navigation'
import { INSIGHT_SLUGS, isInsightSlug } from '@/lib/insights'
import { buildPageMetadata } from '@/lib/page-metadata'
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return INSIGHT_SLUGS.flatMap((slug) => [
    { locale: 'en', slug },
    { locale: 'fr', slug },
  ])
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isInsightSlug(slug)) return {}

  const t = await getTranslations({ locale, namespace: 'insights' })

  return buildPageMetadata({
    locale,
    path: `/insights/${slug}`,
    title: t(`${slug}.metadataTitle`),
    description: t(`${slug}.metadataDescription`),
  })
}

export default async function InsightArticlePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isInsightSlug(slug)) notFound()

  const t = await getTranslations({ locale, namespace: 'insights' })
  const tBc = await getTranslations('breadcrumb')
  const title = t(`${slug}.title`)
  const description = t(`${slug}.metadataDescription`)
  const bodyKeys = ['p1', 'p2', 'p3', 'p4'] as const

  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: tBc('home'), path: '' },
            { name: t('indexTitle'), path: '/insights' },
            { name: title },
          ]),
          articleJsonLd({
            locale,
            slug,
            title,
            description,
            datePublished: t(`${slug}.datePublished`),
          }),
        ]}
      />
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16 max-w-3xl">
        <Breadcrumb
          items={[
            { label: tBc('home'), href: '/' },
            { label: t('indexTitle'), href: '/insights' },
            { label: title },
          ]}
        />
        <header className="mb-10">
          <p className="text-sm font-medium text-primary-dark">{t(`${slug}.readTime`)}</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-extrabold text-slate-900">{title}</h1>
          <p className="mt-4 text-lg text-slate-600">{t(`${slug}.summary`)}</p>
        </header>
        <div className="prose prose-slate max-w-none space-y-5 text-slate-700 leading-relaxed">
          {bodyKeys.map((key) => (
            <p key={key}>{t(`${slug}.${key}`)}</p>
          ))}
        </div>
        <footer className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-slate-600">{t('ctaText')}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/schedule" className="btn-primary inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold">
              {t('ctaSchedule')}
            </Link>
            <Link href="/assessment" className="link-action text-sm font-semibold">
              {t('ctaAssessment')}
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}
