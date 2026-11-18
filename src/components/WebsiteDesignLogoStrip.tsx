'use client'

import Image from 'next/image'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type PlatformLogo = {
  id: string
  name: string
  src?: string
  width?: number
  height?: number
  className?: string
  /** White/light logos need a dark tile to remain visible. */
  tile?: 'light' | 'dark'
}

const PLATFORM_LOGOS: readonly PlatformLogo[] = [
  {
    id: 'godaddy',
    name: 'GoDaddy',
    src: '/images/platforms/godaddy-logo.webp',
    width: 320,
    height: 80,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  {
    id: 'shopline',
    name: 'SHOPLINE',
    src: '/images/platforms/shopline-logo.png',
    width: 320,
    height: 80,
    // Navy-on-black → invert so the mark reads on a dark tile.
    className: 'h-8 w-auto max-w-full object-contain invert md:h-9',
    tile: 'dark',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    src: '/images/platforms/shopify-logo.png',
    width: 320,
    height: 80,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
    tile: 'dark',
  },
  {
    id: 'wix',
    name: 'Wix',
    src: '/images/platforms/wix-logo.jpg',
    width: 240,
    height: 80,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    src: '/images/platforms/wordpress-logo.png',
    width: 240,
    height: 240,
    className: 'h-12 w-auto max-w-full object-contain md:h-14',
    tile: 'dark',
  },
  {
    id: 'squarespace',
    name: 'Squarespace',
    src: '/images/platforms/squarespace-logo.jpg',
    width: 320,
    height: 80,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
    tile: 'dark',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    src: '/images/platforms/stripe-logo.png',
    width: 240,
    height: 80,
    className: 'h-7 w-auto max-w-full object-contain md:h-8',
  },
  {
    id: 'square',
    name: 'Square',
    src: '/images/platforms/square-logo.png',
    width: 320,
    height: 180,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    src: '/images/platforms/salesforce-logo.jpg',
    width: 320,
    height: 180,
    className: 'h-10 w-auto max-w-full object-contain md:h-11',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    src: '/images/platforms/hubspot-logo.png',
    width: 320,
    height: 80,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  {
    id: 'brevo',
    name: 'Brevo',
    src: '/images/platforms/brevo-logo.png',
    width: 320,
    height: 80,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
    tile: 'dark',
  },
] as const

type Props = {
  eyebrow: string
  listLabel: string
}

export default function WebsiteDesignLogoStrip({ eyebrow, listLabel }: Props) {
  const reduceMotion = usePrefersReducedMotion()
  const useMarquee = !reduceMotion && PLATFORM_LOGOS.length > 3
  const sequence = useMarquee ? [...PLATFORM_LOGOS, ...PLATFORM_LOGOS] : PLATFORM_LOGOS

  return (
    <section
      aria-labelledby="website-design-logo-strip-heading"
      className="py-8 lg:py-10"
    >
      <div className="px-1 sm:px-2">
        <p
          id="website-design-logo-strip-heading"
          className="text-center text-xs font-bold uppercase tracking-[0.18em] text-primary-dark"
        >
          {eyebrow}
        </p>

        <div className="technology-ecosystem group/marquee relative mt-5 min-w-0">
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
                const isDuplicate = useMarquee && index >= PLATFORM_LOGOS.length
                const dark = logo.tile === 'dark'
                return (
                  <div
                    key={`${logo.id}-${index}`}
                    aria-hidden={isDuplicate || undefined}
                    className={[
                      'flex min-h-20 w-40 shrink-0 flex-col items-center justify-center rounded-2xl border px-3 py-3 text-center shadow-sm sm:w-44 md:w-48',
                      dark
                        ? 'border-slate-800 bg-slate-950'
                        : 'border-slate-200 bg-white',
                    ].join(' ')}
                  >
                    {logo.src ? (
                      <span
                        className={[
                          'flex h-10 w-full items-center justify-center overflow-hidden rounded-lg px-2',
                          dark ? 'bg-slate-950' : 'bg-white',
                        ].join(' ')}
                      >
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
                        <span
                          className={[
                            'text-sm font-extrabold tracking-tight',
                            dark ? 'text-white' : 'text-slate-900',
                          ].join(' ')}
                        >
                          {logo.name}
                        </span>
                      </span>
                    )}
                    <span
                      className={[
                        'mt-1.5 text-[0.65rem] font-bold uppercase tracking-[0.08em]',
                        dark ? 'text-slate-400' : 'text-slate-500',
                      ].join(' ')}
                    >
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
