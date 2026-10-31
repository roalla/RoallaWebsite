'use client'

import React, { useMemo, useState } from 'react'
import { CheckCircle, MapPin, PenLine, SearchCheck, Sparkles, Tag, Info } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  calculateVisibilityImprovementEstimate,
  VISIBILITY_IMPROVEMENT_CORE_PRICE,
  VISIBILITY_IMPROVEMENT_PRICES,
} from '@/lib/visibility-improvement-estimate'

function formatCad(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: 'CAD',
  })
    .format(amount)
    .replace(/[\u00a0\u202f\u2009]/g, ' ')
}

const copy = {
  en: {
    eyebrow: 'Visibility improvement estimator',
    title: 'Estimate search and AI visibility work for an existing site.',
    intro:
      'Start with the required visibility foundation. Open additional options only if you want maps cleanup, a focused offer rewrite, or a recheck cadence.',
    requiredSection: 'Required',
    optionalSection: 'Optional add-ons',
    optionalSectionIntro: 'These are not required to request a scope confirmation.',
    included: 'Included',
    selected: 'Selected',
    whatItIs: 'What it is',
    whyItMatters: 'Why it matters',
    foundation: 'Visibility foundation',
    foundationWhat:
      'A focused package to improve how search tools and AI assistants find and describe your existing public site.',
    foundationWhy:
      'Helps the right customers discover and understand the business when configured properly (SEO, AEO, agentic AI). Rankings are not guaranteed.',
    extrasTitle: 'Additional options',
    extrasLabel: 'I want maps cleanup, offer rewrite, or monitoring',
    extrasValue: 'Open this only if you want optional visibility add-ons. Otherwise leave it unchecked.',
    localMaps: 'Local and maps cleanup',
    localMapsWhat: 'Align business name, address, hours, and map listings so public identity stays consistent.',
    offerRewrite: 'Content rewrite for one offer',
    offerRewriteWhat: 'Rewrite one primary offer page so people and search/AI systems can describe it clearly.',
    monitoring: 'Recheck and monitoring cadence',
    monitoringWhat: 'Scheduled rechecks through the first year so visibility work stays current after launch.',
    codeTitle: 'Have a referral code?',
    codePlaceholder: 'Enter referral code',
    apply: 'Apply code',
    applying: 'Checking…',
    codeApplied: 'Community referral discount applied: 30% off the visibility foundation.',
    invalidCode: 'That referral code is not valid. Check the spelling or continue at standard pricing.',
    codeError: 'We could not check the code. Please try again.',
    remove: 'Remove discount',
    summaryTitle: 'Your preliminary estimate',
    coreServices: 'Visibility foundation',
    referralDiscount: 'Community referral discount',
    subtotal: 'First-year estimate before HST',
    hst: 'HST (13%)',
    total: 'Projected first-year total',
    mobileSummaryLabel: 'Estimated first-year total',
    disclaimer:
      'This is a preliminary, non-binding estimate based on your selections. ROALLA confirms scope, compatibility, timing and final pricing in writing before work begins.',
    cta: 'Request scope confirmation',
    crossLinkLaunch: 'Need a new site? Estimate a website launch package',
    crossLinkEmail: 'Emails not reaching clients? Estimate email reach and setup',
  },
  fr: {
    eyebrow: 'Estimateur d’amélioration de visibilité',
    title: 'Estimez le travail de visibilité recherche et IA pour un site existant.',
    intro:
      'Commencez par la fondation de visibilité requise. Ouvrez les options seulement si vous voulez un nettoyage des cartes, une réécriture d’offre ou un rythme de revérification.',
    requiredSection: 'Requis',
    optionalSection: 'Options facultatives',
    optionalSectionIntro: 'Ces éléments ne sont pas requis pour demander une confirmation de portée.',
    included: 'Inclus',
    selected: 'Sélectionné',
    whatItIs: 'De quoi il s’agit',
    whyItMatters: 'Pourquoi c’est important',
    foundation: 'Fondation de visibilité',
    foundationWhat:
      'Un forfait ciblé pour améliorer la façon dont les outils de recherche et les assistants IA trouvent et décrivent votre site public existant.',
    foundationWhy:
      'Aide les bons clients à découvrir et comprendre l’entreprise lorsque la configuration est adéquate (SEO, AEO, IA agentique). Aucun classement n’est garanti.',
    extrasTitle: 'Options supplémentaires',
    extrasLabel: 'Je veux le nettoyage des cartes, une réécriture d’offre ou le suivi',
    extrasValue: 'Ouvrez ceci seulement pour des options de visibilité. Sinon, laissez décoché.',
    localMaps: 'Nettoyage local et cartes',
    localMapsWhat:
      'Alignez le nom, l’adresse, les heures et les fiches cartographiques pour une identité publique cohérente.',
    offerRewrite: 'Réécriture du contenu pour une offre',
    offerRewriteWhat:
      'Réécrivez une page d’offre principale pour que les personnes et les systèmes de recherche/IA la décrivent clairement.',
    monitoring: 'Revérification et suivi',
    monitoringWhat:
      'Des revérifications planifiées pendant la première année pour garder le travail de visibilité à jour.',
    codeTitle: 'Avez-vous un code de recommandation?',
    codePlaceholder: 'Entrez le code',
    apply: 'Appliquer',
    applying: 'Vérification…',
    codeApplied: 'Rabais communautaire appliqué : 30 % sur la fondation de visibilité.',
    invalidCode: 'Ce code n’est pas valide. Vérifiez-le ou continuez au tarif standard.',
    codeError: 'Impossible de vérifier le code. Veuillez réessayer.',
    remove: 'Retirer le rabais',
    summaryTitle: 'Votre estimation préliminaire',
    coreServices: 'Fondation de visibilité',
    referralDiscount: 'Rabais de recommandation communautaire',
    subtotal: 'Estimation de la première année avant TVH',
    hst: 'TVH (13 %)',
    total: 'Total projeté de la première année',
    mobileSummaryLabel: 'Total estimé de la première année',
    disclaimer:
      'Cette estimation préliminaire est non contraignante. ROALLA confirmera la portée, la compatibilité, l’échéancier et le prix final par écrit avant le début des travaux.',
    cta: 'Demander la confirmation de la portée',
    crossLinkLaunch: 'Besoin d’un nouveau site? Estimez un forfait de lancement Web',
    crossLinkEmail: 'Les courriels n’atteignent pas les clients? Estimez la portée et la configuration',
  },
} as const

const tileMotion =
  'transition-all duration-200 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.015] motion-safe:hover:shadow-lg motion-safe:hover:shadow-primary/25'
const tileSelected =
  `${tileMotion} border-primary bg-primary/25 ring-2 ring-primary/40 shadow-md shadow-primary/15`
const tileIdle = `${tileMotion} border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50`

export default function VisibilityImprovementEstimateBuilder() {
  const locale = useLocale()
  const french = locale === 'fr'
  const t = copy[french ? 'fr' : 'en']
  const money = useMemo(() => (amount: number) => formatCad(amount, french ? 'fr' : 'en'), [french])
  const [showExtras, setShowExtras] = useState(false)
  const [localMaps, setLocalMaps] = useState(false)
  const [offerRewrite, setOfferRewrite] = useState(false)
  const [monitoring, setMonitoring] = useState(false)
  const [code, setCode] = useState('')
  const [appliedReferralCode, setAppliedReferralCode] = useState('')
  const [referralApplied, setReferralApplied] = useState(false)
  const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'invalid' | 'error'>('idle')

  const estimate = calculateVisibilityImprovementEstimate({
    localMaps: showExtras && localMaps,
    offerRewrite: showExtras && offerRewrite,
    monitoring: showExtras && monitoring,
    referralDiscount: referralApplied,
  })

  const toggleExtras = (checked: boolean) => {
    setShowExtras(checked)
    if (!checked) {
      setLocalMaps(false)
      setOfferRewrite(false)
      setMonitoring(false)
    }
  }

  const selectionLines = [
    t.coreServices,
    showExtras && localMaps ? t.localMaps : null,
    showExtras && offerRewrite ? t.offerRewrite : null,
    showExtras && monitoring ? t.monitoring : null,
    referralApplied
      ? appliedReferralCode
        ? `${t.referralDiscount} (${appliedReferralCode})`
        : t.referralDiscount
      : null,
  ].filter(Boolean) as string[]

  const estimateSummary = selectionLines.join(' · ')
  const estimateTotalLabel = money(estimate.firstYearTotal)

  const applyReferralCode = async (event: React.FormEvent) => {
    event.preventDefault()
    setCodeStatus('loading')
    const normalizedCode = code.trim().toUpperCase()
    try {
      const response = await fetch('/api/website-estimate/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: normalizedCode }),
      })
      const result = (await response.json()) as { valid?: boolean }
      if (response.ok && result.valid) {
        setCode(normalizedCode)
        setAppliedReferralCode(normalizedCode)
        setReferralApplied(true)
        setCodeStatus('idle')
      } else {
        setReferralApplied(false)
        setAppliedReferralCode('')
        setCodeStatus('invalid')
      }
    } catch {
      setReferralApplied(false)
      setAppliedReferralCode('')
      setCodeStatus('error')
    }
  }

  const removeReferral = () => {
    setReferralApplied(false)
    setAppliedReferralCode('')
    setCode('')
    setCodeStatus('idle')
  }

  const estimateGoal = `${french ? 'Estimation de visibilité' : 'Visibility estimate'}: ${estimateTotalLabel} ${french ? 'TVH incluse' : 'including HST'}. ${estimateSummary}`

  const contactQuery = {
    intent: 'visibility',
    offer: 'estimate',
    from_page: '/visibility-improvement-estimate',
    goal: estimateGoal,
    estimate_total: estimateTotalLabel,
    estimate_summary: estimateSummary,
    ...(appliedReferralCode ? { estimate_referral_code: appliedReferralCode } : {}),
  }

  const optionalItems = [
    {
      key: 'localMaps' as const,
      label: t.localMaps,
      detail: t.localMapsWhat,
      price: VISIBILITY_IMPROVEMENT_PRICES.localMaps,
      checked: localMaps,
      setChecked: setLocalMaps,
      icon: MapPin,
    },
    {
      key: 'offerRewrite' as const,
      label: t.offerRewrite,
      detail: t.offerRewriteWhat,
      price: VISIBILITY_IMPROVEMENT_PRICES.offerRewrite,
      checked: offerRewrite,
      setChecked: setOfferRewrite,
      icon: PenLine,
    },
    {
      key: 'monitoring' as const,
      label: t.monitoring,
      detail: t.monitoringWhat,
      price: VISIBILITY_IMPROVEMENT_PRICES.monitoring,
      checked: monitoring,
      setChecked: setMonitoring,
      icon: SearchCheck,
    },
  ]

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden pb-24 lg:pb-0">
      <header className="bg-slate-950 px-6 py-8 text-white sm:px-8 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-light">{t.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-serif font-bold text-white sm:text-4xl">{t.title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-white/95">{t.intro}</p>
      </header>

      <div className="grid lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-8 p-6 sm:p-8 lg:p-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[.16em] text-slate-950">{t.requiredSection}</h2>
              <div className="h-px flex-1 bg-slate-200" aria-hidden />
            </div>

            <article className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${tileMotion}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                    <SearchCheck className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-slate-950">{t.foundation}</h3>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800">
                        {t.included}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="shrink-0 pt-2 font-bold tabular-nums text-primary-dark">{money(VISIBILITY_IMPROVEMENT_CORE_PRICE)}</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{t.whatItIs}</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-800">{t.foundationWhat}</p>
                </div>
                <div className="rounded-xl bg-primary/5 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary-dark">{t.whyItMatters}</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-800">{t.foundationWhy}</p>
                </div>
              </div>
            </article>
          </div>

          <div className="space-y-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-5 sm:p-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold uppercase tracking-[.16em] text-slate-950">{t.optionalSection}</h2>
                <div className="h-px flex-1 bg-slate-300" aria-hidden />
              </div>
              <p className="mt-2 text-sm text-slate-700">{t.optionalSectionIntro}</p>
            </div>

            <fieldset>
              <legend className="text-xl font-serif font-bold text-slate-950">{t.extrasTitle}</legend>
              <label className={`mt-4 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${showExtras ? tileSelected : tileIdle}`}>
                <input
                  className="mt-1 h-4 w-4 accent-primary"
                  type="checkbox"
                  checked={showExtras}
                  onChange={(event) => toggleExtras(event.target.checked)}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="block font-semibold text-slate-900">{t.extrasLabel}</span>
                    {showExtras ? (
                      <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-slate-700">{t.extrasValue}</span>
                </span>
              </label>

              {showExtras ? (
                <div className="mt-4 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-1">
                  {optionalItems.map(({ key, label, detail, price, checked, setChecked, icon: Icon }) => (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${checked ? tileSelected : tileIdle}`}
                    >
                      <input
                        className="mt-1 h-4 w-4 accent-primary"
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center justify-between gap-2">
                          <span className="flex items-center gap-2 font-semibold text-slate-900">
                            <Icon className="h-4 w-4 text-primary" aria-hidden />
                            {label}
                          </span>
                          <span className="font-bold tabular-nums text-primary-dark">{money(price)}</span>
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-700">{detail}</span>
                      </span>
                    </label>
                  ))}
                </div>
              ) : null}
            </fieldset>
          </div>

          <form id="referral-code-section" onSubmit={applyReferralCode} className="scroll-mt-28 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-amber-700" aria-hidden />
              <h2 className="font-serif text-lg font-bold text-slate-950">{t.codeTitle}</h2>
            </div>
            {referralApplied ? (
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2 text-sm font-medium leading-6 text-emerald-800">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {t.codeApplied}
                </p>
                <button type="button" onClick={removeReferral} className="text-left text-sm font-semibold text-amber-900 underline underline-offset-4">
                  {t.remove}
                </button>
              </div>
            ) : (
              <>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <label className="sr-only" htmlFor="visibility-referral-code">
                    {t.codePlaceholder}
                  </label>
                  <input
                    id="visibility-referral-code"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder={t.codePlaceholder}
                    autoComplete="off"
                    className="min-h-12 flex-1 rounded-lg border border-amber-300 bg-white px-4 text-sm uppercase tracking-wide text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="submit"
                    disabled={!code.trim() || codeStatus === 'loading'}
                    className="min-h-12 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {codeStatus === 'loading' ? t.applying : t.apply}
                  </button>
                </div>
                {codeStatus === 'invalid' ? (
                  <p className="mt-2 text-sm font-medium text-red-700" role="alert">
                    {t.invalidCode}
                  </p>
                ) : null}
                {codeStatus === 'error' ? (
                  <p className="mt-2 text-sm font-medium text-red-700" role="alert">
                    {t.codeError}
                  </p>
                ) : null}
              </>
            )}
          </form>
        </div>

        <aside className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <div className="lg:sticky lg:top-28">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="text-xl font-serif font-bold text-slate-950">{t.summaryTitle}</h2>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-700">{t.coreServices}</dt>
                <dd className="font-semibold tabular-nums text-slate-900">{money(VISIBILITY_IMPROVEMENT_CORE_PRICE)}</dd>
              </div>
              {estimate.referralDiscount > 0 ? (
                <div className="flex justify-between gap-4 text-emerald-700">
                  <dt className="flex min-w-0 flex-wrap items-center gap-2">
                    <span>{t.referralDiscount}</span>
                    {appliedReferralCode ? (
                      <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-900">
                        {appliedReferralCode}
                      </span>
                    ) : null}
                  </dt>
                  <dd className="font-semibold tabular-nums">–{money(estimate.referralDiscount)}</dd>
                </div>
              ) : null}
              {estimate.localMaps > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-700">{t.localMaps}</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.localMaps)}</dd>
                </div>
              ) : null}
              {estimate.offerRewrite > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-700">{t.offerRewrite}</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.offerRewrite)}</dd>
                </div>
              ) : null}
              {estimate.monitoring > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-700">{t.monitoring}</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.monitoring)}</dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-6 space-y-3 border-t border-slate-300 pt-5">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-700">{t.subtotal}</span>
                <span className="font-semibold tabular-nums text-slate-900">{money(estimate.firstYearBeforeTax)}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-700">{t.hst}</span>
                <span className="font-semibold tabular-nums text-slate-900">{money(estimate.hst)}</span>
              </div>
              <div className="flex items-end justify-between gap-4 border-t border-slate-300 pt-4">
                <span className="font-bold text-slate-950">{t.total}</span>
                <span className="text-2xl font-serif font-bold tabular-nums text-primary-dark">{estimateTotalLabel}</span>
              </div>
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-600">{t.disclaimer}</p>
            <Link
              href={{ pathname: '/contact', query: contactQuery }}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-center font-bold text-white transition hover:bg-primary-dark"
            >
              {t.cta}
            </Link>
            <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-700">
              <p className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <Link href="/website-estimate" className="font-semibold text-primary-dark underline-offset-4 hover:underline">
                  {t.crossLinkLaunch}
                </Link>
              </p>
              <p className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <Link href="/email-reach-estimate" className="font-semibold text-primary-dark underline-offset-4 hover:underline">
                  {t.crossLinkEmail}
                </Link>
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">{t.mobileSummaryLabel}</p>
            <p className="truncate text-lg font-serif font-bold tabular-nums text-primary-dark">{estimateTotalLabel}</p>
          </div>
          <Link
            href={{ pathname: '/contact', query: contactQuery }}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  )
}
