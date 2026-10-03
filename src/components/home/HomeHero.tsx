import React from 'react'
import HomeHeroContent from './HomeHeroContent'
import HomeHeroSlideshow from './HomeHeroSlideshow'

export default function HomeHero() {
  return (
    <section
      data-header-tone="dark"
      className="relative isolate min-h-[42rem] sm:min-h-[44rem] lg:min-h-[46rem] flex items-start overflow-hidden pt-24 sm:pt-28 lg:pt-32 bg-slate-950"
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
