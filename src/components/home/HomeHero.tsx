import React from 'react'
import HomeHeroContent from './HomeHeroContent'
import { ConnectedIntelligenceVisual } from '@/components/hero/RoallaHeroVisuals'

export default function HomeHero() {
  return (
    <section
      data-header-tone="dark"
      className="relative isolate min-h-[44rem] sm:min-h-[46rem] lg:min-h-[46rem] flex items-start overflow-hidden pt-24 sm:pt-28 lg:pt-32 bg-slate-950"
    >
      <ConnectedIntelligenceVisual priority className="absolute inset-0 z-0" />

      {/* Left-weighted scrim for headline legibility; keep the intelligence map open */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/10 pointer-events-none"
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
