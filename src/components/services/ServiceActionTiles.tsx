'use client'

import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Bot,
  ClipboardList,
  Gauge,
  LayoutTemplate,
  MonitorSmartphone,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Reveal from '@/components/motion/Reveal'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  attributedServiceTileHref,
  getServiceActionBand,
  type ServiceActionServiceId,
  type ServiceActionTileIcon,
} from '@/lib/service-action-tiles'

const icons: Record<ServiceActionTileIcon, typeof SearchCheck> = {
  search: SearchCheck,
  estimate: ClipboardList,
  snapshot: Gauge,
  bot: Bot,
  workflow: Workflow,
  shield: ShieldCheck,
  need: Sparkles,
  proof: LayoutTemplate,
  health: BarChart3,
  monitor: MonitorSmartphone,
  blueprint: ClipboardList,
  discover: Sparkles,
  portfolio: LayoutTemplate,
}

type Props = {
  serviceId: ServiceActionServiceId
  locale: 'en' | 'fr'
  className?: string
}

export default function ServiceActionTiles({ serviceId, locale, className = '' }: Props) {
  const band = getServiceActionBand(serviceId)
  const [selectedId, setSelectedId] = useState(band.tiles[0]?.id ?? '')
  const selected = band.tiles.find((tile) => tile.id === selectedId) ?? band.tiles[0]

  return (
    <section
      aria-labelledby={`service-action-tiles-${serviceId}`}
      data-testid="service-action-tiles"
      className={`py-12 lg:py-14 ${className}`}
    >
      <Reveal className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{band.eyebrow[locale]}</p>
        <h2
          id={`service-action-tiles-${serviceId}`}
          className="mt-2 font-serif text-2xl font-bold text-slate-950 sm:text-3xl"
        >
          {band.title[locale]}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{band.description[locale]}</p>
      </Reveal>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {band.tiles.map((tile, index) => {
          const Icon = icons[tile.icon]
          const active = tile.id === selected?.id
          return (
            <Reveal key={tile.id} delayMs={index * 50} className="h-full">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(tile.id)}
                className={[
                  'home-tile group flex h-full w-full cursor-pointer flex-col items-stretch rounded-2xl border p-5 text-left transition duration-300 motion-safe:hover:-translate-y-0.5 lg:p-6',
                  active
                    ? 'border-slate-900 bg-slate-950 text-white ring-2 ring-slate-900'
                    : 'border-slate-200 bg-white text-slate-950 hover:border-primary/40',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-11 w-11 items-center justify-center rounded-xl border',
                    active
                      ? 'border-white/15 bg-white/10 text-cyan-300'
                      : 'border-primary/15 bg-primary/10 text-primary-dark',
                  ].join(' ')}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className={`mt-4 block font-serif text-lg font-bold ${active ? 'text-white' : 'text-slate-950'}`}>
                  {tile.label[locale]}
                </span>
                <span className={`mt-2 block flex-1 text-sm leading-6 ${active ? 'text-slate-300' : 'text-slate-600'}`}>
                  {tile.outcome[locale]}
                </span>
              </button>
            </Reveal>
          )
        })}
      </div>

      {selected ? (
        <Reveal className="mt-6 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="max-w-2xl text-sm font-medium text-slate-800">{selected.outcome[locale]}</p>
          <Link
            href={attributedServiceTileHref(selected.href, serviceId, selected.id)}
            onClick={() =>
              trackAnalyticsEvent('service_action_tile_click', {
                service: serviceId,
                tileId: selected.id,
                href: selected.href,
              })
            }
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-brand-gold px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-gold-light"
          >
            {selected.cta[locale]}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      ) : null}
    </section>
  )
}
