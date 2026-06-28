'use client'

import React, { useEffect, useMemo, useState } from 'react'
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

function prevIndex(current: number, count: number) {
  return (current - 1 + count) % count
}

/** Indices to keep mounted: active, next (preload), and previous (crossfade). */
function indicesToMount(active: number, count: number, reduceMotion: boolean): Set<number> {
  if (count <= 0) return new Set()
  if (reduceMotion || count === 1) return new Set([0])
  return new Set([active, nextIndex(active, count), prevIndex(active, count)])
}

export default function HomeHeroSlideshow() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const slideCount = HERO_SLIDESHOW_IMAGES.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [mountedIndices, setMountedIndices] = useState<Set<number>>(() =>
    indicesToMount(0, slideCount, false)
  )

  useEffect(() => {
    setMountedIndices(indicesToMount(activeIndex, slideCount, prefersReducedMotion))
  }, [activeIndex, slideCount, prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion || slideCount <= 1) return
    const id = window.setInterval(() => {
      setActiveIndex((current) => nextIndex(current, slideCount))
    }, HERO_SLIDE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [prefersReducedMotion, slideCount])

  const mountedList = useMemo(
    () => Array.from(mountedIndices).sort((a, b) => a - b),
    [mountedIndices]
  )

  return (
    <>
      {mountedList.map((index) => {
        const src = HERO_SLIDESHOW_IMAGES[index]
        const isActive = index === activeIndex
        return (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={index === 0}
            loading={index === 0 ? undefined : 'lazy'}
            sizes="100vw"
            className={`absolute inset-0 h-full w-full object-cover scale-105 motion-safe:transition-opacity motion-safe:duration-[1200ms] ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDuration: `${HERO_SLIDE_FADE_MS}ms` }}
          />
        )
      })}
    </>
  )
}
