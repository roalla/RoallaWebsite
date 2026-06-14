'use client'

import React, { useEffect, useRef } from 'react'
import { ArrowRight, Briefcase, Award, Layers } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from '../ScheduleButton'
import Reveal from '../motion/Reveal'

const statIcons = [Briefcase, Award, Layers]
const HERO_VIDEO_SRC = '/hero-loop.mp4'

/** Frosted panels — slight transparency with blur for readable contrast on dark hero video */
const heroGlassPanel =
  'bg-white/85 backdrop-blur-lg border border-white/70 shadow-[0_8px_40px_rgba(15,23,42,0.1)]'
const heroGlassTile = 'bg-white/85 backdrop-blur-md border border-white/70 shadow-card'

export default function HomeHero() {
  const t = useTranslations('home.hero')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => {
      void video.play().catch(() => {})
    }

    play()
    video.addEventListener('canplay', play)
    video.addEventListener('loadeddata', play)

    return () => {
      video.removeEventListener('canplay', play)
      video.removeEventListener('loadeddata', play)
    }
  }, [])

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), icon: statIcons[0] },
    { value: t('stat2Value'), label: t('stat2Label'), icon: statIcons[1] },
    { value: t('stat3Value'), label: t('stat3Label'), icon: statIcons[2] },
  ]

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-24 lg:pt-28 bg-slate-950">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <video
          ref={videoRef}
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover scale-105"
        />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-950/60 from-0% via-slate-950/35 via-50% to-slate-950/20 to-100%"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-transparent to-slate-950/50"
        aria-hidden
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
        <div className="max-w-2xl">
          <div className={`rounded-2xl ${heroGlassPanel} p-6 sm:p-8 lg:p-10`}>
            <Reveal when="mount" as="h1" className="text-4xl sm:text-5xl lg:text-[3.25rem] font-serif font-extrabold text-slate-900 leading-tight tracking-tight">
              {t('title')}{' '}
              <span className="text-primary-dark">{t('titleHighlight')}</span>
            </Reveal>
            <Reveal when="mount" as="p" delayMs={100} className="mt-6 text-lg sm:text-xl text-slate-700 max-w-xl leading-relaxed">
              {t('subtitle')}
            </Reveal>
            <Reveal when="mount" as="p" delayMs={120} className="mt-3 text-sm font-medium text-primary-dark max-w-xl leading-relaxed">
              {t('journeyLine')}
            </Reveal>
            <Reveal when="mount" delayMs={200} className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-start gap-3">
              <ScheduleButton
                variant="primary"
                size="lg"
                icon
                block
                className="w-full sm:w-auto sm:min-w-[16rem]"
                sublabel={t('responseTime')}
                sublabelClassName="text-slate-600"
              >
                {t('cta')}
              </ScheduleButton>
            </Reveal>
            <Reveal when="mount" delayMs={240} className="mt-2 text-sm text-slate-600 max-w-xl">
              {t('whatHappensNext')}
            </Reveal>
            <Reveal when="mount" delayMs={280} className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link
                href="/services"
                className="inline-flex items-center font-semibold text-primary-dark hover:underline"
              >
                {t('exploreConsultingLink')}
                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Link>
              <Link
                href="/services/digital"
                className="inline-flex items-center font-semibold text-slate-700 hover:text-primary-dark hover:underline transition-colors"
              >
                {t('exploreDigitalServiceLink')}
                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Link>
              <Link
                href="/digital-creations"
                className="inline-flex items-center font-semibold text-slate-600 hover:text-primary-dark hover:underline transition-colors"
              >
                {t('exploreDigitalLink')}
                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Link>
            </Reveal>
          </div>

          <Reveal when="mount" delayMs={350} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`flex flex-col items-start gap-1 px-4 py-3 rounded-xl ${heroGlassTile}`}
              >
                <stat.icon className="w-4 h-4 text-primary-dark flex-shrink-0" aria-hidden />
                <span className="text-lg font-serif font-semibold text-slate-900">{stat.value}</span>
                <span className="text-xs text-slate-500 leading-snug">{stat.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
