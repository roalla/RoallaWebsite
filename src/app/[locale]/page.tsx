import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HomeHero from '@/components/home/HomeHero'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeTrustedBy from '@/components/home/HomeTrustedBy'
import HomeOurWork from '@/components/home/HomeOurWork'
import HomeTestimonials from '@/components/home/HomeTestimonials'
import HomeFeaturedInsight from '@/components/home/HomeFeaturedInsight'
import HomeCTA from '@/components/home/HomeCTA'
import HomeClosing from '@/components/home/HomeClosing'
import { HERO_SLIDESHOW_IMAGES } from '@/lib/heroSlideshow'
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
      {HERO_SLIDESHOW_IMAGES.map((src, index) => (
        <link
          key={src}
          rel="preload"
          as="image"
          href={src}
          fetchPriority={index === 0 ? 'high' : 'low'}
        />
      ))}
      <HomeHero />
      <HomeWhatWeDo />
      <HomeTrustedBy />
      <HomeOurWork />
      <HomeTestimonials />
      <HomeFeaturedInsight />
      <HomeCTA />
      <HomeClosing />
    </div>
  )
}
