'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Reveal from '@/components/motion/Reveal'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  getIndustryHub,
  toIndustryOptImageSrc,
  type IndustryHubIndexCopy,
} from '@/lib/industry-hub-content'

export default function IndustryIndexPage({
  locale,
  copy,
}: {
  locale: string
  copy: IndustryHubIndexCopy
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  return (
    <div className="page-shell bg-white">
      <section
        data-header-tone="dark"
        className="relative isolate overflow-hidden bg-slate-950 px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-32"
      >
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-light">
            {locale === 'fr' ? 'Secteurs' : 'Industries'}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold text-white sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200">{copy.lead}</p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {copy.items.map((item) => {
            const hub = getIndustryHub(locale, item.id)
            if (!hub) return null
            return (
              <Reveal key={item.id}>
                <Link
                  href={{ pathname: '/industries/[slug]', params: { slug: item.id } }}
                  onClick={() =>
                    trackAnalyticsEvent('industry_nav_click', {
                      location: 'industries_index',
                      industry: item.id,
                    })
                  }
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={toIndustryOptImageSrc(hub.image.src)}
                      alt={hub.image.alt}
                      fill
                      unoptimized
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <span className="font-serif text-xl font-bold text-slate-950">{item.label}</span>
                    <span className="mt-2 flex-1 text-sm leading-6 text-slate-600">{item.blurb}</span>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-dark">
                      {locale === 'fr' ? 'Voir le secteur' : 'View industry'}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>
    </div>
  )
}
