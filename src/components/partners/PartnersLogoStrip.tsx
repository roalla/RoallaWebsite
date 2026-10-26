'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  ecosystemDirectoryGroups,
  ecosystemKeys,
  ecosystemLogos,
  type EcosystemKey,
} from '@/lib/technologyEcosystem'

function hrefFor(key: EcosystemKey) {
  if (key === 'telarus') {
    return '/partners/strategic-relationships' as const
  }
  const group = ecosystemDirectoryGroups.find((entry) =>
    (entry.keys as readonly string[]).includes(key),
  )
  if (group?.id === 'delivery-platforms') {
    return { pathname: '/partners/delivery-platforms' as const, hash: key }
  }
  return { pathname: '/partners/technology-providers' as const, hash: key }
}

export default function PartnersLogoStrip() {
  const t = useTranslations('home.technologyEcosystem')
  const tPage = useTranslations('partnersPlatforms')
  const tCommon = useTranslations('common')
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

        <div className="technology-ecosystem group/marquee relative mt-6 flex min-w-0 items-stretch gap-3">
          <Link
            href="/partners"
            className="group/item z-[1] flex min-h-20 w-36 shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-900 bg-slate-950 px-3 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-40 md:w-44"
          >
            <span className="flex h-10 w-full items-center justify-center">
              <Image src="/logo.svg" alt="" width={36} height={36} className="h-9 w-9" />
            </span>
            <span className="mt-1.5 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white">
              {tCommon('companyName')}
            </span>
            <span className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-primary-light">
              {tPage('brandAdvisorLabel')}
            </span>
          </Link>

          <div className="marquee-mask min-w-0 flex-1 overflow-hidden py-2">
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
                  <Link
                    key={`${key}-${index}`}
                    href={hrefFor(key)}
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
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
