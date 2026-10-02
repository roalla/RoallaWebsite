import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HomeHero from '@/components/home/HomeHero'
import { HomeServicesMarquee } from '@/components/home/HomeMarquees'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeBusinessOutcomes from '@/components/home/HomeBusinessOutcomes'
import HomeVisibilityOptimization from '@/components/home/HomeVisibilityOptimization'
import HomeOurWork from '@/components/home/HomeOurWork'
import HomeTestimonials from '@/components/home/HomeTestimonials'
import HomeFeaturedInsight from '@/components/home/HomeFeaturedInsight'
import HomeCTA from '@/components/home/HomeCTA'
import HomeClosing from '@/components/home/HomeClosing'
import TechnologyDecisionFramework from '@/components/TechnologyDecisionFramework'
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
      <HomeServicesMarquee />
      <HomeBusinessOutcomes />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <TechnologyDecisionFramework />
      </div>
      <HomeWhatWeDo />
      <HomeVisibilityOptimization />
      <HomeOurWork />
      <HomeTestimonials />
      <HomeFeaturedInsight />
      <HomeCTA />
      <HomeClosing />
    </div>
  )
}
