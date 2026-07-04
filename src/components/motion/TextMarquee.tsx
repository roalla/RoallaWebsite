'use client'

import React from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type TextMarqueeProps = {
  label: string
  items: string[]
  /** Visual band style */
  variant?: 'light' | 'muted'
  className?: string
}

function MarqueeItem({ item, showSeparator }: { item: string; showSeparator: boolean }) {
  return (
    <span className="inline-flex items-center shrink-0">
      <span className="whitespace-nowrap font-semibold text-primary-dark">{item}</span>
      {showSeparator ? (
        <span className="mx-4 sm:mx-6 text-primary/35 font-light select-none" aria-hidden>
          ·
        </span>
      ) : null}
    </span>
  )
}

function MarqueeTrack({ items }: { items: string[] }) {
  const sequence = [...items, ...items]

  return (
    <div className="marquee-track flex w-max items-center">
      {sequence.map((item, index) => (
        <MarqueeItem
          key={`${item}-${index}`}
          item={item}
          showSeparator={index < sequence.length - 1}
        />
      ))}
    </div>
  )
}

export default function TextMarquee({
  label,
  items,
  variant = 'light',
  className = '',
}: TextMarqueeProps) {
  const reduceMotion = usePrefersReducedMotion()

  const bandClass =
    variant === 'muted'
      ? 'bg-slate-50 border-y border-slate-200/80'
      : 'bg-white border-y border-slate-200/60'

  return (
    <section
      className={[bandClass, 'py-8 lg:py-10 overflow-hidden', className].filter(Boolean).join(' ')}
      aria-label={label}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:gap-6">
          <p className="shrink-0 text-xl sm:text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">
            {label}
          </p>

          {reduceMotion ? (
            <div className="flex flex-wrap items-center gap-x-1 gap-y-2 min-w-0">
              {items.map((item, index) => (
                <MarqueeItem
                  key={item}
                  item={item}
                  showSeparator={index < items.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="relative min-w-0 flex-1 overflow-hidden marquee-mask">
              <MarqueeTrack items={items} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
