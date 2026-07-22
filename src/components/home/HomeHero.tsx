import React from 'react'
import HomeHeroContent from './HomeHeroContent'
import HomeHeroSlideshow from './HomeHeroSlideshow'
import { HERO_SLIDESHOW_IMAGES } from '@/lib/heroSlideshow'

export default function HomeHero() {
  const firstSlide = HERO_SLIDESHOW_IMAGES[0]

  return (
    <section
      className="relative isolate min-h-[min(100svh,56rem)] flex items-start overflow-hidden pt-28 sm:pt-32 lg:pt-36 bg-slate-950 bg-cover bg-center"
      style={{ backgroundImage: `url('${firstSlide}')` }}
    >
      <HomeHeroSlideshow />

      {/* Left-weighted scrim for headline legibility; keep right imagery open */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/45 via-transparent to-slate-950/70 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 left-0 z-[1] w-[min(100%,42rem)] bg-gradient-to-r from-slate-950/50 to-transparent pointer-events-none"
        aria-hidden
      />

      <HomeHeroContent />
    </section>
  )
}
