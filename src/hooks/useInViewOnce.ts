'use client'

import { useEffect, useRef, useState } from 'react'

/** Fires once when element enters viewport — replacement for framer-motion useInView */
export function useInViewOnce<T extends HTMLElement = HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2, ...options },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView, options])

  return { ref, inView }
}
