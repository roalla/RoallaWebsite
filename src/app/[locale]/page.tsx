import React from 'react'
import HomeHero from '@/components/home/HomeHero'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeTestimonials from '@/components/home/HomeTestimonials'
import HomeCTA from '@/components/home/HomeCTA'
import HomeClosing from '@/components/home/HomeClosing'
import { HERO_SLIDESHOW_IMAGES } from '@/lib/heroSlideshow'

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
      <HomeTestimonials />
      <HomeCTA />
      <HomeClosing />
    </div>
  )
}
