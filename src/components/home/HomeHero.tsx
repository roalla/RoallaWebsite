import React from 'react'
import HomeHeroContent from './HomeHeroContent'
import { ConnectedIntelligenceVisual } from '@/components/hero/RoallaHeroVisuals'

export default function HomeHero() {
  return (
    <section
      data-header-tone="dark"
      className="relative isolate min-h-[44rem] sm:min-h-[46rem] lg:min-h-[46rem] flex items-start overflow-hidden pt-24 sm:pt-28 lg:pt-32 bg-slate-950"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_76%_42%,rgba(0,180,197,0.24),transparent_32%),radial-gradient(circle_at_88%_66%,rgba(245,197,24,0.12),transparent_22%),linear-gradient(135deg,#07111f_0%,#0b1d31_56%,#07111f_100%)]" aria-hidden />
      <div className="absolute inset-0 z-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_left,#000,transparent_82%)]" aria-hidden />
      <ConnectedIntelligenceVisual className="absolute bottom-4 right-[-4rem] z-[2] h-[22rem] w-[28rem] opacity-55 sm:bottom-6 sm:right-[-2rem] sm:h-[25rem] sm:w-[33rem] lg:bottom-auto lg:right-[max(2rem,calc((100vw-80rem)/2))] lg:top-36 lg:h-[31rem] lg:w-[38rem] lg:opacity-100" />

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
