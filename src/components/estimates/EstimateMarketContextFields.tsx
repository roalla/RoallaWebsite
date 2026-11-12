'use client'

import {
  ESTIMATE_REGION_OPTIONS,
  type EstimateRegionId,
} from '@/lib/estimate-regions'
import { listEstimateMarketOptions } from '@/lib/estimate-market-context'

const copy = {
  en: {
    title: 'About your business',
    lead: 'Optional market context, plus your province or state so we can estimate tax and surface relevant considerations.',
    market: 'Market / industry',
    marketPlaceholder: 'Select a market (optional)',
    region: 'Province or state',
    regionPlaceholder: 'Select province or state',
    regionHint: 'Tax is estimated for your selected location (Ontario by default—change if you are elsewhere).',
    groupCa: 'Canada',
    groupUs: 'United States',
    groupOther: 'Other',
  },
  fr: {
    title: 'À propos de votre entreprise',
    lead: 'Contexte de marché optionnel, plus votre province ou État pour estimer la taxe et afficher des points pertinents.',
    market: 'Marché / industrie',
    marketPlaceholder: 'Choisir un marché (optionnel)',
    region: 'Province ou État',
    regionPlaceholder: 'Choisir la province ou l’État',
    regionHint:
      'La taxe est estimée selon le lieu choisi (Ontario par défaut—modifiez si vous êtes ailleurs).',
    groupCa: 'Canada',
    groupUs: 'États-Unis',
    groupOther: 'Autre',
  },
} as const

export default function EstimateMarketContextFields({
  locale,
  marketId,
  regionId,
  onMarketChange,
  onRegionChange,
}: {
  locale: string
  marketId: string
  regionId: string
  onMarketChange: (value: string) => void
  onRegionChange: (value: string) => void
}) {
  const t = locale === 'fr' ? copy.fr : copy.en
  const markets = listEstimateMarketOptions(locale)
  const ca = ESTIMATE_REGION_OPTIONS.filter((item) => item.group === 'ca')
  const us = ESTIMATE_REGION_OPTIONS.filter((item) => item.group === 'us')
  const other = ESTIMATE_REGION_OPTIONS.filter((item) => item.group === 'other')

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <h2 className="font-serif text-xl font-bold text-slate-950">{t.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{t.lead}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-900">
          {t.market}
          <select
            value={marketId}
            onChange={(event) => onMarketChange(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">{t.marketPlaceholder}</option>
            {markets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-900">
          {t.region}
          <select
            value={regionId}
            onChange={(event) => onRegionChange(event.target.value)}
            required
            className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">{t.regionPlaceholder}</option>
            <optgroup label={t.groupCa}>
              {ca.map((item) => (
                <option key={item.id} value={item.id}>
                  {locale === 'fr' ? item.label.fr : item.label.en}
                </option>
              ))}
            </optgroup>
            <optgroup label={t.groupUs}>
              {us.map((item) => (
                <option key={item.id} value={item.id as EstimateRegionId}>
                  {item.label.en}
                </option>
              ))}
            </optgroup>
            <optgroup label={t.groupOther}>
              {other.map((item) => (
                <option key={item.id} value={item.id}>
                  {locale === 'fr' ? item.label.fr : item.label.en}
                </option>
              ))}
            </optgroup>
          </select>
          <span className="mt-2 block text-xs font-medium text-slate-500">{t.regionHint}</span>
        </label>
      </div>
    </div>
  )
}
