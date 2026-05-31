'use client'

import { useEffect, useState } from 'react'

type Listener = (value: boolean) => void

let cached: boolean | null = null
let mq: MediaQueryList | null = null
const listeners = new Set<Listener>()

function syncFromMq() {
  if (!mq) return
  cached = mq.matches
  listeners.forEach((listener) => listener(cached!))
}

function ensureMq() {
  if (typeof window === 'undefined' || mq) return
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  syncFromMq()
  mq.addEventListener('change', syncFromMq)
}

/** One shared prefers-reduced-motion listener for the whole app. */
export function usePrefersReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(cached ?? true)

  useEffect(() => {
    ensureMq()
    if (cached !== null) setReduceMotion(cached)
    listeners.add(setReduceMotion)
    return () => {
      listeners.delete(setReduceMotion)
    }
  }, [])

  return reduceMotion
}
