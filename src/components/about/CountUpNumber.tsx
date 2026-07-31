'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const NUMERIC_PATTERN = /\d+(?:[.,]\d+)?/

/** Starts counting just before the number scrolls in, so it is never seen resting at zero. */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0,
  rootMargin: '0px 0px 12% 0px',
}

type ParsedValue = {
  prefix: string
  suffix: string
  target: number
  decimals: number
  separator: string
}

/**
 * Splits a localised stat such as "25+ years" or "≈ 3,5 G$" into the parts
 * around its first number so the number can animate while the wording stays intact.
 */
function parseValue(value: string): ParsedValue | null {
  const match = NUMERIC_PATTERN.exec(value)
  if (!match) return null

  const raw = match[0]
  const fraction = raw.split(/[.,]/)[1]

  return {
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + raw.length),
    target: Number.parseFloat(raw.replace(',', '.')),
    decimals: fraction ? fraction.length : 0,
    separator: raw.includes(',') ? ',' : '.',
  }
}

function easeOutExpo(progress: number): number {
  return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
}

type CountUpNumberProps = {
  value: string
  durationMs?: number
  className?: string
}

export default function CountUpNumber({ value, durationMs = 1700, className = '' }: CountUpNumberProps) {
  const parsed = useMemo(() => parseValue(value), [value])
  const reduceMotion = usePrefersReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState<string | null>(null)

  useEffect(() => {
    if (!parsed || reduceMotion) return
    const el = ref.current
    if (!el) return

    const format = (n: number) => n.toFixed(parsed.decimals).replace('.', parsed.separator)
    let frame = 0

    setDisplay(format(0))

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()

      const startedAt = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / durationMs, 1)
        setDisplay(format(parsed.target * easeOutExpo(progress)))
        if (progress < 1) frame = window.requestAnimationFrame(tick)
      }
      frame = window.requestAnimationFrame(tick)
    }, OBSERVER_OPTIONS)

    observer.observe(el)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [parsed, reduceMotion, durationMs])

  if (!parsed || reduceMotion || display === null) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    )
  }

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {parsed.prefix}
        {display}
        {parsed.suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
