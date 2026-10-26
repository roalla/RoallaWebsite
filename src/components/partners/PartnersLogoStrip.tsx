'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  ecosystemKeys,
  ecosystemLogos,
  type EcosystemKey,
} from '@/lib/technologyEcosystem'

function anchorFor(key: EcosystemKey) {
  return key === 'telarus' ? '#strategic-relationships' : `#${key}`
}

export default function PartnersLogoStrip() {
  const t = useTranslations('home.technologyEcosystem')
  const tPage = useTranslations('partnersPlatforms')
  const reduceMotion = usePrefersReducedMotion()
  const useMarquee = !reduceMotion && ecosystemKeys.length > 3
  const sequence = useMarquee ? [...ecosystemKeys, ...ecosystemKeys] : ecosystemKeys

  return (
    <section
      aria-labelledby="partners-logo-strip-heading"
      className="border-b border-slate-200 bg-slate-50 py-10 lg:py-12"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p
          id="partners-logo-strip-heading"
          className="text-center text-xs font-bold uppercase tracking-[0.18em] text-primary-dark"
        >
          {tPage('logoStripEyebrow')}
        </p>

        <div className="technology-ecosystem group/marquee relative mt-6 min-w-0">
          <div className="marquee-mask max-w-full overflow-hidden py-2">
            <div
              className={
                useMarquee
                  ? 'technology-ecosystem-track flex w-max max-w-none items-stretch gap-3'
                  : 'flex flex-wrap justify-center gap-3'
              }
              aria-label={t('listLabel')}
            >
              {sequence.map((key, index) => {
                const isDuplicate = useMarquee && index >= ecosystemKeys.length
                const logo = ecosystemLogos[key]
                return (
                  <a
                    key={`${key}-${index}`}
                    href={anchorFor(key)}
                    tabIndex={isDuplicate ? -1 : 0}
                    aria-hidden={isDuplicate || undefined}
                    className="group/item flex min-h-20 w-40 shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-44 md:w-48"
                  >
                    {logo ? (
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
                      <span className="text-sm font-extrabold tracking-tight text-slate-900">
                        {t(`${key}.wordmark`)}
                      </span>
                    )}
                    <span className="mt-1.5 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-slate-500">
                      {t(`${key}.name`)}
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
