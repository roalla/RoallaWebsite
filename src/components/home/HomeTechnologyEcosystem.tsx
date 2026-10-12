'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ArrowRight, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  ecosystemCtas,
  ecosystemKeys,
  ecosystemLogos,
  type EcosystemKey,
} from '@/lib/technologyEcosystem'

type PopoverPosition = {
  left: number
  top: number
  placement: 'top' | 'bottom' | 'viewport'
}

function getPopoverPosition(element: HTMLElement): PopoverPosition {
  const rect = element.getBoundingClientRect()
  const width = Math.min(352, window.innerWidth - 24)
  const half = width / 2
  const left = Math.min(window.innerWidth - half - 12, Math.max(half + 12, rect.left + rect.width / 2))
  const expectedHeight = 440
  const fitsAbove = rect.top >= expectedHeight + 12
  const fitsBelow = window.innerHeight - rect.bottom >= expectedHeight + 12

  return {
    left,
    top: fitsAbove ? rect.top - 12 : fitsBelow ? rect.bottom + 12 : 12,
    placement: fitsAbove ? 'top' : fitsBelow ? 'bottom' : 'viewport',
  }
}

function useHoverPopover() {
  const [hoverCapable, setHoverCapable] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setHoverCapable(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return hoverCapable
}

export default function HomeTechnologyEcosystem() {
  const t = useTranslations('home.technologyEcosystem')
  const reduceMotion = usePrefersReducedMotion()
  const hoverCapable = useHoverPopover()
  const popoverId = useId()
  const [activeKey, setActiveKey] = useState<EcosystemKey | null>(null)
  const [position, setPosition] = useState<PopoverPosition | null>(null)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suppressNextFocusRef = useRef(false)
  const hoverCapableRef = useRef(hoverCapable)

  const useMarquee = !reduceMotion && ecosystemKeys.length > 3
  const sequence = useMarquee ? [...ecosystemKeys, ...ecosystemKeys] : ecosystemKeys

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    hoverCapableRef.current = hoverCapable
  }, [hoverCapable])

  useEffect(() => {
    if (!activeKey || !triggerRef.current) return

    const updatePosition = () => {
      if (triggerRef.current) setPosition(getPopoverPosition(triggerRef.current))
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [activeKey])

  useEffect(() => {
    if (!activeKey) return

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (!triggerRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
        setActiveKey(null)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [activeKey])

  const cancelScheduledClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const openPopover = (key: EcosystemKey, trigger: HTMLButtonElement) => {
    cancelScheduledClose()
    triggerRef.current = trigger
    setPosition(getPopoverPosition(trigger))
    setActiveKey(key)
  }

  const scheduleClose = () => {
    if (!hoverCapableRef.current) return
    cancelScheduledClose()
    closeTimerRef.current = setTimeout(() => setActiveKey(null), 220)
  }

  const closePopover = (restoreFocus = false) => {
    cancelScheduledClose()
    setActiveKey(null)
    if (restoreFocus) {
      suppressNextFocusRef.current = true
      triggerRef.current?.focus()
    }
  }

  const popover = activeKey && position ? (
    <div
      ref={popoverRef}
      id={popoverId}
      role="dialog"
      aria-label={t(`${activeKey}.name`)}
      className="fixed z-[80] max-h-[calc(100dvh-1.5rem)] w-[min(22rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-2xl"
      style={{
        left: position.left,
        top: position.top,
        transform: position.placement === 'top' ? 'translate(-50%, -100%)' : 'translateX(-50%)',
      }}
      onPointerEnter={cancelScheduledClose}
      onPointerLeave={scheduleClose}
      onFocusCapture={cancelScheduledClose}
      onBlurCapture={(event) => {
        if (!hoverCapableRef.current) return
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') closePopover(true)
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{t(`${activeKey}.relationship`)}</p>
          <h3 className="mt-1 text-xl font-serif font-bold text-slate-950">{t(`${activeKey}.name`)}</h3>
        </div>
        <button
          type="button"
          className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          aria-label={t('closeLabel')}
          onClick={() => closePopover(true)}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{t(`${activeKey}.description`)}</p>
      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('valueLabel')}</p>
        <p className="mt-1 text-sm leading-6 text-slate-800">{t(`${activeKey}.value`)}</p>
      </div>
      {ecosystemCtas[activeKey] ? (
        ecosystemCtas[activeKey]!.type === 'external' ? (
          <a
            href={ecosystemCtas[activeKey]!.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary-dark hover:text-primary-darker hover:underline"
          >
            {t(`${activeKey}.cta`)}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </a>
        ) : (
          <Link
            href={ecosystemCtas[activeKey]!.href}
            className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary-dark hover:text-primary-darker hover:underline"
          >
            {t(`${activeKey}.cta`)}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        )
      ) : null}
    </div>
  ) : null

  return (
    <section aria-labelledby="technology-ecosystem-title" className="relative bg-slate-50 py-16 lg:py-20">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{t('eyebrow')}</p>
          <h2 id="technology-ecosystem-title" className="mt-3 text-3xl font-serif font-bold text-slate-950 md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">{t('description')}</p>
        </div>

        <div
          className="technology-ecosystem group/marquee relative mt-10"
          onPointerLeave={scheduleClose}
          onFocusCapture={cancelScheduledClose}
        >
          <div className="marquee-mask overflow-hidden py-3">
            <div
              className={useMarquee ? 'technology-ecosystem-track flex w-max items-stretch gap-3' : 'flex flex-wrap justify-center gap-3'}
              data-paused={activeKey ? 'true' : undefined}
              aria-label={t('listLabel')}
            >
              {sequence.map((key, index) => {
                const isDuplicate = useMarquee && index >= ecosystemKeys.length
                const isActive = activeKey === key && triggerRef.current?.dataset.ecosystemIndex === String(index)

                return (
                  <button
                    key={`${key}-${index}`}
                    type="button"
                    data-ecosystem-index={index}
                    className="group/item flex min-h-24 w-48 shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md focus-visible:border-primary md:w-56"
                    aria-expanded={isActive}
                    aria-controls={isActive ? popoverId : undefined}
                    aria-haspopup="dialog"
                    aria-label={t('openLabel', { name: t(`${key}.name`), relationship: t(`${key}.relationship`) })}
                    onPointerEnter={(event) => {
                      if (hoverCapableRef.current) openPopover(key, event.currentTarget)
                    }}
                    onPointerLeave={scheduleClose}
                    onFocus={(event) => {
                      if (suppressNextFocusRef.current) {
                        suppressNextFocusRef.current = false
                        return
                      }
                      if (hoverCapableRef.current) openPopover(key, event.currentTarget)
                    }}
                    onClick={(event) => {
                      if (isActive) closePopover()
                      else openPopover(key, event.currentTarget)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') closePopover()
                      if ((event.key === 'Enter' || event.key === ' ') && isActive && ecosystemCtas[key]) {
                        event.preventDefault()
                        popoverRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
                      }
                    }}
                    tabIndex={isDuplicate ? -1 : 0}
                    aria-hidden={isDuplicate || undefined}
                  >
                    {ecosystemLogos[key] ? (
                      <span className="flex h-12 w-full items-center justify-center overflow-hidden rounded-lg bg-white px-2 ring-1 ring-slate-200">
                        <Image
                          src={ecosystemLogos[key]!.src}
                          alt=""
                          width={ecosystemLogos[key]!.width}
                          height={ecosystemLogos[key]!.height}
                          className={ecosystemLogos[key]!.className}
                        />
                      </span>
                    ) : (
                      <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover/item:text-primary-dark md:text-xl">
                        {t(`${key}.wordmark`)}
                      </span>
                    )}
                    <span className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-slate-500">
                      {t(`${key}.relationship`)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/providers"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {t('viewAllCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
      {mounted && popover ? createPortal(popover, document.body) : null}
    </section>
  )
}
