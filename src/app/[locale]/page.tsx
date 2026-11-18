import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HomeHero from '@/components/home/HomeHero'
import HomeProofStrip from '@/components/home/HomeProofStrip'
import HomeBusinessOutcomes from '@/components/home/HomeBusinessOutcomes'
import HomeResults from '@/components/home/HomeResults'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeEcosystemLink from '@/components/home/HomeEcosystemLink'
import HomeCTA from '@/components/home/HomeCTA'
import HomeFeaturedInsight from '@/components/home/HomeFeaturedInsight'
import HomeClosing from '@/components/home/HomeClosing'
import { buildPageMetadata } from '@/lib/page-metadata'
import JsonLd from '@/components/JsonLd'
import { homeServiceCatalogJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return buildPageMetadata({
    locale,
    path: '',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <div className="page-shell pb-24 lg:pb-0">
      <JsonLd
        data={[
          webPageJsonLd(locale, '', t('metadataTitle'), t('metadataDescription')),
          homeServiceCatalogJsonLd(locale),
        ]}
      />
      <HomeHero />
      <HomeProofStrip />
      <HomeBusinessOutcomes />
      <HomeResults />
      <HomeWhatWeDo />
      <HomeEcosystemLink />
      <HomeCTA />
      <HomeFeaturedInsight />
      <HomeClosing />
    </div>
  )
}
