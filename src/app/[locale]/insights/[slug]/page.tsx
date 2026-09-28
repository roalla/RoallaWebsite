import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import ContrastTextSizeConversionArticle from '@/components/insights/ContrastTextSizeConversionArticle'
import EnrichedInsightArticle from '@/components/insights/EnrichedInsightArticle'
import FreeWebsiteBuilderTradeoffsArticle from '@/components/insights/FreeWebsiteBuilderTradeoffsArticle'
import GeoSeoAeoBotsArticle from '@/components/insights/GeoSeoAeoBotsArticle'
import NetworkingRoiArticle from '@/components/insights/NetworkingRoiArticle'
import WebsiteBuilderLimitationsArticle from '@/components/insights/WebsiteBuilderLimitationsArticle'
import JsonLd from '@/components/JsonLd'
import type { EnrichedInsightSlug } from '@/lib/enriched-insights'
import { INSIGHT_OG_IMAGES, INSIGHT_SLUGS, isInsightSlug } from '@/lib/insights'
import { formatInsightReadTime } from '@/lib/insight-read-time'
import { buildArticlePageMetadata } from '@/lib/page-metadata'
import { OG_IMAGE, OG_IMAGE_ALT } from '@/lib/site'
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/structured-data'
import {
  CONTRAST_TEXT_SIZE_INSIGHT_SLUG,
  FREE_WEBSITE_BUILDER_TRADEOFFS_SLUG,
  GEO_SEO_AEO_BOTS_SLUG,
  NETWORKING_ROI_INSIGHT_SLUG,
  WEBSITE_BUILDER_INSIGHT_SLUG,
} from '@/lib/website-builder-insight'

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
  const ogImage = INSIGHT_OG_IMAGES[slug] ?? OG_IMAGE
  const isWebsiteBuilderArticle = slug === WEBSITE_BUILDER_INSIGHT_SLUG
  const isFreeWebsiteBuilderTradeoffsArticle = slug === FREE_WEBSITE_BUILDER_TRADEOFFS_SLUG
  const isContrastTextSizeArticle = slug === CONTRAST_TEXT_SIZE_INSIGHT_SLUG
  const isNetworkingRoiArticle = slug === NETWORKING_ROI_INSIGHT_SLUG
  const isGeoSeoAeoBotsArticle = slug === GEO_SEO_AEO_BOTS_SLUG
  const hasSocialCopy = isWebsiteBuilderArticle || isFreeWebsiteBuilderTradeoffsArticle || isContrastTextSizeArticle || isNetworkingRoiArticle || isGeoSeoAeoBotsArticle

  return buildArticlePageMetadata({
    locale,
    path: `/insights/${slug}`,
    title: t(`${slug}.metadataTitle`),
    description: t(`${slug}.metadataDescription`),
    datePublished: t(`${slug}.datePublished`),
    dateModified: isWebsiteBuilderArticle ? t(`${slug}.dateModified`) : undefined,
    ogImage,
    ogImageAlt: OG_IMAGE_ALT,
    ogTitle: hasSocialCopy ? t(`${slug}.socialTitle`) : undefined,
    ogDescription: hasSocialCopy ? t(`${slug}.socialDescription`) : undefined,
  })
}

export default async function InsightArticlePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isInsightSlug(slug)) notFound()

  const t = await getTranslations({ locale, namespace: 'insights' })
  const tBc = await getTranslations('breadcrumb')
  const title = t(`${slug}.title`)
  const description = t(`${slug}.metadataDescription`)
  const readTime = formatInsightReadTime(t, slug)
  const ogImage = INSIGHT_OG_IMAGES[slug] ?? OG_IMAGE
  const isWebsiteBuilderArticle = slug === WEBSITE_BUILDER_INSIGHT_SLUG
  const isFreeWebsiteBuilderTradeoffsArticle = slug === FREE_WEBSITE_BUILDER_TRADEOFFS_SLUG
  const isContrastTextSizeArticle = slug === CONTRAST_TEXT_SIZE_INSIGHT_SLUG
  const isNetworkingRoiArticle = slug === NETWORKING_ROI_INSIGHT_SLUG
  const isGeoSeoAeoBotsArticle = slug === GEO_SEO_AEO_BOTS_SLUG
  const isLongFormArticle = isWebsiteBuilderArticle || isFreeWebsiteBuilderTradeoffsArticle || isContrastTextSizeArticle || isNetworkingRoiArticle || isGeoSeoAeoBotsArticle

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
            dateModified: isWebsiteBuilderArticle ? t(`${slug}.dateModified`) : undefined,
            image: ogImage,
          }),
        ]}
      />
      {isLongFormArticle ? (
        <>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 max-w-6xl">
            <Breadcrumb
              items={[
                { label: tBc('home'), href: '/' },
                { label: t('indexTitle'), href: '/insights' },
                { label: title },
              ]}
            />
          </div>
          {isWebsiteBuilderArticle ? (
            <WebsiteBuilderLimitationsArticle
              locale={locale}
              title={title}
              summary={t(`${slug}.summary`)}
              readTime={readTime}
              category={t(`${slug}.category`)}
            />
          ) : isFreeWebsiteBuilderTradeoffsArticle ? (
            <FreeWebsiteBuilderTradeoffsArticle
              locale={locale}
              title={title}
              summary={t(`${slug}.summary`)}
              readTime={readTime}
              category={t(`${slug}.category`)}
            />
          ) : isContrastTextSizeArticle ? (
            <ContrastTextSizeConversionArticle
              locale={locale}
              title={title}
              summary={t(`${slug}.summary`)}
              readTime={readTime}
              category={t(`${slug}.category`)}
            />
          ) : isGeoSeoAeoBotsArticle ? (
            <GeoSeoAeoBotsArticle
              locale={locale}
              title={title}
              summary={t(`${slug}.summary`)}
              readTime={readTime}
              category={t(`${slug}.category`)}
            />
          ) : (
            <NetworkingRoiArticle
              locale={locale}
              title={title}
              summary={t(`${slug}.summary`)}
              readTime={readTime}
              category={t(`${slug}.category`)}
            />
          )}
        </>
      ) : (
        <>
          <div className="container mx-auto max-w-6xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-28">
            <Breadcrumb
              items={[
                { label: tBc('home'), href: '/' },
                { label: t('indexTitle'), href: '/insights' },
                { label: title },
              ]}
            />
          </div>
          <EnrichedInsightArticle
            slug={slug as EnrichedInsightSlug}
            locale={locale}
            title={title}
            summary={t(`${slug}.summary`)}
            readTime={readTime}
          />
        </>
      )}
    </div>
  )
}
