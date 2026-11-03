'use client'

import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Reveal from '@/components/motion/Reveal'
import { trackAnalyticsEvent } from '@/lib/analytics'
import type { ServiceActionServiceId } from '@/lib/service-action-tiles'
import { getServiceTrends2027 } from '@/lib/service-trends-2027'

type Props = {
  serviceId: ServiceActionServiceId
  locale: 'en' | 'fr'
  className?: string
}

export default function ServiceTrends2027({ serviceId, locale, className = '' }: Props) {
  const band = getServiceTrends2027(serviceId)

  return (
    <section
      aria-labelledby={`service-trends-2027-${serviceId}`}
      data-testid="service-trends-2027"
      className={`py-12 lg:py-14 ${className}`}
    >
      <Reveal className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{band.eyebrow[locale]}</p>
        <h2
          id={`service-trends-2027-${serviceId}`}
          className="mt-2 font-serif text-2xl font-bold text-slate-950 sm:text-3xl"
        >
          {band.title[locale]}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{band.description[locale]}</p>
      </Reveal>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {band.trends.map((trend, index) => (
          <Reveal
            key={trend.id}
            delayMs={index * 50}
            className="home-tile flex h-full flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition duration-300 motion-safe:hover:-translate-y-0.5 lg:p-6"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary-dark">
              {locale === 'fr' ? 'Signal 2027' : '2027 signal'}
            </p>
            <h3 className="mt-3 font-serif text-xl font-bold text-slate-950">{trend.title[locale]}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{trend.body[locale]}</p>
            {trend.href && trend.hrefLabel ? (
              <Link
                href={trend.href}
                onClick={() =>
                  trackAnalyticsEvent('service_trends_2027_click', {
                    service: serviceId,
                    trendId: trend.id,
                    href: trend.href,
                  })
                }
                className="mt-5 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
              >
                {trend.hrefLabel[locale]}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </Reveal>
        ))}
      </div>
    </section>
  )
}
