'use client'

import { useEffect, useRef, useState } from 'react'
import {
  HERO_LAST_SLIDE_AT_MS,
  HERO_NEXT_SLIDE_AT_MS,
  HERO_SLIDE_INTERVAL_MS,
  HERO_SLIDES,
  HERO_MOBILE_MAX_WIDTH_PX,
} from '@/lib/heroSlideshow'

export default function HomeHeroSlideshow() {
  const [visibleCount, setVisibleCount] = useState(1)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [lastElapsedMs, setLastElapsedMs] = useState(0)
  const mountedAt = useRef(0)
  const slideCount = HERO_SLIDES.length
  const cycleDurationMs = slideCount * HERO_SLIDE_INTERVAL_MS
  const mobileMedia = `(max-width: ${HERO_MOBILE_MAX_WIDTH_PX}px)`
  const desktopMedia = `(min-width: ${HERO_MOBILE_MAX_WIDTH_PX + 1}px)`
  const slides = HERO_SLIDES.slice(0, visibleCount)

  useEffect(() => {
    mountedAt.current = performance.now()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const elapsed = () => Math.round(performance.now() - mountedAt.current)
    const nextId = window.setTimeout(() => {
      setElapsedMs(elapsed())
      setVisibleCount(2)
    }, HERO_NEXT_SLIDE_AT_MS)
    const lastId = window.setTimeout(() => {
      setLastElapsedMs(elapsed())
      setVisibleCount(slideCount)
    }, HERO_LAST_SLIDE_AT_MS)

    return () => {
      window.clearTimeout(nextId)
      window.clearTimeout(lastId)
    }
  }, [slideCount])

  return (
    <div className="hero-slideshow absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {slides.map((slide, index) => {
        const animating = visibleCount > 1
        const baseDelay = -((slideCount - index) % slideCount) * HERO_SLIDE_INTERVAL_MS
        const elapsed = index === slideCount - 1 && lastElapsedMs > 0 ? lastElapsedMs : elapsedMs
        return (
          <picture
            key={slide.desktop}
            className={animating ? 'hero-slide' : 'hero-slide hero-slide-hold'}
            style={
              animating
                ? {
                    animationDuration: `${cycleDurationMs}ms`,
                    animationDelay: `${baseDelay - elapsed}ms`,
                  }
                : undefined
            }
          >
            <source
              media={mobileMedia}
              srcSet={slide.mobileAvifSrcSet}
              sizes="100vw"
              type="image/avif"
            />
            <source
              media={mobileMedia}
              srcSet={slide.mobileSrcSet}
              sizes="100vw"
              type="image/webp"
            />
            <source media={desktopMedia} srcSet={slide.desktopAvif} type="image/avif" />
            <img
              src={slide.desktop}
              alt=""
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'low'}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="hero-slide-img"
            />
          </picture>
        )
      })}
    </div>
  )
}
