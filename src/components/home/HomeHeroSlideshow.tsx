'use client'

import { useEffect, useState } from 'react'
import {
  HERO_SLIDE_INTERVAL_MS,
  HERO_SLIDES,
  HERO_MOBILE_MAX_WIDTH_PX,
} from '@/lib/heroSlideshow'

export default function HomeHeroSlideshow() {
  const [showAll, setShowAll] = useState(false)
  const slideCount = HERO_SLIDES.length
  const cycleDurationMs = slideCount * HERO_SLIDE_INTERVAL_MS
  const mobileMedia = `(max-width: ${HERO_MOBILE_MAX_WIDTH_PX}px)`
  const slides = showAll ? HERO_SLIDES : HERO_SLIDES.slice(0, 1)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let timeoutId = 0
    const start = () => {
      timeoutId = window.setTimeout(() => setShowAll(true), 1000)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })

    return () => {
      window.removeEventListener('load', start)
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="hero-slideshow absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {slides.map((slide, index) => {
        const delayMs = -((slideCount - index) % slideCount) * HERO_SLIDE_INTERVAL_MS
        return (
          <picture
            key={slide.desktop}
            className={showAll ? 'hero-slide' : 'hero-slide hero-slide-hold'}
            style={
              showAll
                ? {
                    animationDuration: `${cycleDurationMs}ms`,
                    animationDelay: `${delayMs}ms`,
                  }
                : undefined
            }
          >
            <source media={mobileMedia} srcSet={slide.mobile} type="image/webp" />
            <img
              src={slide.desktop}
              alt=""
              decoding={index === 0 ? 'sync' : 'async'}
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
