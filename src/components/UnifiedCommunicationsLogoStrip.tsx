'use client'

import Image from 'next/image'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type UcLogo = {
  id: string
  name: string
  src?: string
  width?: number
  height?: number
  className?: string
}

const UC_LOGOS: readonly UcLogo[] = [
  {
    id: 'zoom',
    name: 'Zoom',
    src: '/images/partners/zoom-logo.png',
    width: 160,
    height: 80,
    className: 'h-8 w-auto object-contain md:h-9',
  },
  {
    id: 'speechlogix',
    name: 'SpeechLogix',
    src: '/images/partners/speechlogix-logo.png',
    width: 640,
    height: 116,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  {
    id: 'nextiva',
    name: 'Nextiva',
    src: '/images/partners/nextiva-logo.png',
    width: 250,
    height: 90,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  {
    id: 'net2phone',
    name: 'net2phone',
    src: '/images/partners/net2phone-logo.png',
    width: 250,
    height: 90,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  {
    id: 'goto',
    name: 'GoTo',
  },
  {
    id: 'polyai',
    name: 'PolyAI',
    src: '/images/partners/polyai-logo.png',
    width: 480,
    height: 120,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    src: '/images/partners/microsoft-logo.png',
    width: 240,
    height: 80,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  {
    id: 'google',
    name: 'Google',
  },
] as const

type Props = {
  eyebrow: string
  listLabel: string
}

export default function UnifiedCommunicationsLogoStrip({ eyebrow, listLabel }: Props) {
  const reduceMotion = usePrefersReducedMotion()
  const useMarquee = !reduceMotion && UC_LOGOS.length > 3
  const sequence = useMarquee ? [...UC_LOGOS, ...UC_LOGOS] : UC_LOGOS

  return (
    <section
      aria-labelledby="uc-logo-strip-heading"
      className="border-b border-slate-200 bg-slate-50 py-10 lg:py-12"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p
          id="uc-logo-strip-heading"
          className="text-center text-xs font-bold uppercase tracking-[0.18em] text-primary-dark"
        >
          {eyebrow}
        </p>

        <div className="technology-ecosystem group/marquee relative mt-6 min-w-0">
          <div className="marquee-mask min-w-0 overflow-hidden py-2">
            <div
              className={
                useMarquee
                  ? 'technology-ecosystem-track flex w-max max-w-none items-stretch gap-3'
                  : 'flex flex-wrap justify-center gap-3'
              }
              aria-label={listLabel}
            >
              {sequence.map((logo, index) => {
                const isDuplicate = useMarquee && index >= UC_LOGOS.length
                return (
                  <div
                    key={`${logo.id}-${index}`}
                    aria-hidden={isDuplicate || undefined}
                    className="flex min-h-20 w-40 shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm sm:w-44 md:w-48"
                  >
                    {logo.src ? (
                      <span className="flex h-10 w-full items-center justify-center overflow-hidden rounded-lg bg-white px-2">
                        <Image
                          src={logo.src}
                          alt=""
                          width={logo.width}
                          height={logo.height}
                          className={logo.className}
                          unoptimized
                        />
                      </span>
                    ) : (
                      <span className="flex h-10 w-full items-center justify-center">
                        <span className="text-sm font-extrabold tracking-tight text-slate-900">
                          {logo.name}
                        </span>
                      </span>
                    )}
                    <span className="mt-1.5 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-slate-500">
                      {logo.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
