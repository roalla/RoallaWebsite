'use client'

import React, { useState } from 'react'
import Image from 'next/image'

/** Drop the founder photo here (square crop, ideally 800x800 or larger). */
export const FOUNDER_PORTRAIT_SRC = '/images/team/steven-robin.webp'

const RING_GRADIENT =
  'conic-gradient(from 0deg, transparent 0deg, #00b4c5 80deg, #7fe6f0 150deg, #ffd700 215deg, transparent 320deg)'

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

type FounderPortraitProps = {
  name: string
  alt: string
}

export default function FounderPortrait({ name, alt }: FounderPortraitProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className="group relative mx-auto w-full max-w-[20rem] lg:max-w-sm">
      <div
        aria-hidden="true"
        className="about-pulse-glow pointer-events-none absolute -inset-8 rounded-full bg-primary/30 blur-3xl"
      />

      <div aria-hidden="true" className="pointer-events-none absolute -inset-[3px] rounded-full">
        <div
          className="about-ring-spin h-full w-full rounded-full opacity-80"
          style={{ background: RING_GRADIENT }}
        />
      </div>

      <div className="about-float relative">
        <div className="relative aspect-square overflow-hidden rounded-full border border-white/20 bg-slate-900 shadow-2xl ring-1 ring-inset ring-white/10">
          {imageFailed ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-dark via-primary-darker to-slate-900">
              <span className="font-serif text-6xl font-extrabold tracking-wide text-white/90">
                {initialsFrom(name)}
              </span>
            </div>
          ) : (
            <Image
              src={FOUNDER_PORTRAIT_SRC}
              alt={alt}
              fill
              priority
              sizes="(max-width: 1024px) 20rem, 24rem"
              className="object-cover object-top transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
              onError={() => setImageFailed(true)}
            />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"
          />
        </div>
      </div>
    </div>
  )
}
