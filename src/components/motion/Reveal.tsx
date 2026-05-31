'use client'

import React, { useEffect, useRef, useState } from 'react'

type RevealProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  as?: 'div' | 'section' | 'article' | 'header' | 'aside' | 'h1' | 'p' | 'ul' | 'li'
  /** Delay before animation starts (ms) */
  delayMs?: number
  /** `mount` = animate on first paint (hero); `inView` = when scrolled into view */
  when?: 'mount' | 'inView'
}

export default function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  delayMs = 0,
  when = 'inView',
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true)
      return
    }
    if (when === 'mount') {
      const id = window.requestAnimationFrame(() => setVisible(true))
      return () => window.cancelAnimationFrame(id)
    }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [when, reduceMotion])

  const Component = Tag as React.ElementType
  const motionClass = reduceMotion ? '' : visible ? 'reveal-visible' : 'reveal-hidden'

  const delayStyle = delayMs > 0 && !reduceMotion ? { animationDelay: `${delayMs}ms` } : undefined

  return (
    <Component
      ref={ref}
      className={[motionClass, className].filter(Boolean).join(' ')}
      style={{ ...style, ...delayStyle }}
      {...rest}
    >
      {children}
    </Component>
  )
}
