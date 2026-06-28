'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  HERO_SLIDE_FADE_MS,
  HERO_SLIDE_INTERVAL_MS,
  HERO_SLIDESHOW_IMAGES,
} from '@/lib/heroSlideshow'

function nextIndex(current: number, count: number) {
  return (current + 1) % count
}

export default function HomeHeroSlideshow() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const slideCount = HERO_SLIDESHOW_IMAGES.length

  /** Bottom layer — stays fully visible until the incoming slide covers it. */
  const [baseIndex, setBaseIndex] = useState(0)
  /** Top layer — fades in over the base during a transition. */
  const [overlayIndex, setOverlayIndex] = useState<number | null>(null)
  const [overlayOpaque, setOverlayOpaque] = useState(false)
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(() => new Set([0]))
  const transitioningRef = useRef(false)

  const markLoaded = useCallback((index: number) => {
    setLoadedSlides((prev) => {
      if (prev.has(index)) return prev
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }, [])

  const beginTransition = useCallback(
    (targetIndex: number) => {
      if (transitioningRef.current || targetIndex === baseIndex) return
      if (!loadedSlides.has(targetIndex)) return

      transitioningRef.current = true
      setOverlayIndex(targetIndex)
      setOverlayOpaque(false)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setOverlayOpaque(true))
      })
    },
    [baseIndex, loadedSlides]
  )

  useEffect(() => {
    if (overlayIndex === null || !overlayOpaque) return

    const complete = window.setTimeout(() => {
      setBaseIndex(overlayIndex)
      setOverlayIndex(null)
      setOverlayOpaque(false)
      transitioningRef.current = false
    }, HERO_SLIDE_FADE_MS)

    return () => window.clearTimeout(complete)
  }, [overlayIndex, overlayOpaque])

  useEffect(() => {
    if (prefersReducedMotion || slideCount <= 1) return

    const id = window.setInterval(() => {
      if (transitioningRef.current) return
      const target = nextIndex(baseIndex, slideCount)
      if (loadedSlides.has(target)) {
        beginTransition(target)
      }
    }, HERO_SLIDE_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [prefersReducedMotion, slideCount, baseIndex, loadedSlides, beginTransition])

  return (
    <>
      {HERO_SLIDESHOW_IMAGES.map((src, index) => {
        const isBase = index === baseIndex
        const isOverlay = index === overlayIndex

        let opacityClass = 'opacity-0'
        let zClass = 'z-0'

        if (overlayIndex === null && isBase) {
          opacityClass = 'opacity-100'
          zClass = 'z-10'
        } else if (overlayIndex !== null && isBase) {
          opacityClass = 'opacity-100'
          zClass = 'z-10'
        } else if (isOverlay) {
          opacityClass = overlayOpaque ? 'opacity-100' : 'opacity-0'
          zClass = 'z-20'
        }

        return (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={index <= 1}
            loading="eager"
            sizes="100vw"
            onLoad={() => markLoaded(index)}
            className={`absolute inset-0 h-full w-full object-cover scale-105 motion-safe:transition-opacity motion-safe:ease-in-out ${opacityClass} ${zClass}`}
            style={isOverlay ? { transitionDuration: `${HERO_SLIDE_FADE_MS}ms` } : undefined}
            aria-hidden
          />
        )
      })}
    </>
  )
}
