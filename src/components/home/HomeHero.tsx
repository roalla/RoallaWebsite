import React from 'react'
import HomeHeroContent from './HomeHeroContent'
import HomeHeroSlideshow from './HomeHeroSlideshow'
import { HERO_SLIDESHOW_IMAGES } from '@/lib/heroSlideshow'

export default function HomeHero() {
  const firstSlide = HERO_SLIDESHOW_IMAGES[0]

  return (
    <section
      className="relative isolate min-h-[85vh] flex items-center overflow-hidden pt-24 lg:pt-28 bg-slate-950 bg-cover bg-center"
      style={{ backgroundImage: `url('${firstSlide}')` }}
    >
      <HomeHeroSlideshow />

      <div
        className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/70 from-0% via-slate-950/45 via-50% to-slate-950/30 to-100% pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/55 pointer-events-none"
        aria-hidden
      />

      <HomeHeroContent />
    </section>
  )
}
