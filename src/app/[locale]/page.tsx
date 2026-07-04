import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HomeHero from '@/components/home/HomeHero'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeOurWork from '@/components/home/HomeOurWork'
import HomeTestimonials from '@/components/home/HomeTestimonials'
import HomeCTA from '@/components/home/HomeCTA'
import HomeClosing from '@/components/home/HomeClosing'
import { HERO_SLIDESHOW_IMAGES } from '@/lib/heroSlideshow'
import { localeAlternates } from '@/lib/page-metadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: localeAlternates(''),
    openGraph: {
      title: t('metadataTitle'),
      description: t('metadataDescription'),
      url: `https://www.roalla.com/${locale}`,
      type: 'website',
    },
  }
}

export default function Home() {
  return (
    <div className="page-shell pb-24 lg:pb-0">
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
      <HomeOurWork />
      <HomeTestimonials />
      <HomeCTA />
      <HomeClosing />
    </div>
  )
}
