import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HomeHero from '@/components/home/HomeHero'
import { HomeServicesMarquee } from '@/components/home/HomeMarquees'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeOurWork from '@/components/home/HomeOurWork'
import HomeTestimonials from '@/components/home/HomeTestimonials'
import HomeFeaturedInsight from '@/components/home/HomeFeaturedInsight'
import HomeCTA from '@/components/home/HomeCTA'
import HomeClosing from '@/components/home/HomeClosing'
import { HERO_MOBILE_MAX_WIDTH_PX, HERO_SLIDES } from '@/lib/heroSlideshow'
import { buildPageMetadata } from '@/lib/page-metadata'
import JsonLd from '@/components/JsonLd'
import { webPageJsonLd } from '@/lib/structured-data'

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
        data={webPageJsonLd(locale, '', t('metadataTitle'), t('metadataDescription'))}
      />
      {/* Preload first slide only — art-directed by viewport */}
      <link
        rel="preload"
        as="image"
        href={HERO_SLIDES[0].mobile}
        media={`(max-width: ${HERO_MOBILE_MAX_WIDTH_PX}px)`}
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={HERO_SLIDES[0].desktop}
        media={`(min-width: ${HERO_MOBILE_MAX_WIDTH_PX + 1}px)`}
        fetchPriority="high"
      />
      <HomeHero />
      <HomeServicesMarquee />
      <HomeWhatWeDo />
      <HomeOurWork />
      <HomeTestimonials />
      <HomeFeaturedInsight />
      <HomeCTA />
      <HomeClosing />
    </div>
  )
}
