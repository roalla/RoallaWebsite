'use client'

import React, { useMemo, useState } from 'react'
import { CheckCircle, Inbox, ListChecks, Mail, ShieldCheck, Sparkles, Tag, Info } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import EmailSafeText from '@/components/EmailSafeText'
import {
  calculateEmailReachEstimate,
  EMAIL_REACH_CORE_PRICE,
  EMAIL_REACH_PRICES,
} from '@/lib/email-reach-estimate'

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
    eyebrow: 'Email reach estimator',
    title: 'Estimate email setup and inbox reach work.',
    intro:
      'Start with the required package to get emails into the inbox. Open additional options only if you want professional email setup, list cleanup, or authentication work.',
    requiredSection: 'Required',
    optionalSection: 'Optional add-ons',
    optionalSectionIntro: 'These are not required to request a scope confirmation.',
    included: 'Included',
    selected: 'Selected',
    whatItIs: 'What it is',
    whyItMatters: 'Why it matters',
    foundation: 'Get emails into the inbox',
    foundationWhat:
      'A practical review and improvement package focused on whether campaign and business emails reach customers reliably.',
    foundationWhy:
      'When messages land in junk or never arrive, customers stop responding—even if the offer is strong.',
    microsoftTitle: 'Professional email',
    microsoftPopular: 'Most clients add this',
    microsoftLabel: 'Add professional email setup and Microsoft 365 Business Basic',
    microsoftValue: 'Your email matches the website address—for example, name@yourbusiness.ca.',
    microsoftCost: '$150 setup + $114/year',
    extrasTitle: 'Additional options',
    extrasLabel: 'I want list cleanup or authentication setup',
    extrasValue: 'Open this only if you want optional reach add-ons. Otherwise leave it unchecked.',
    listCleanup: 'List cleanup',
    listCleanupWhat: 'Reduce bounce and junk risk by cleaning outdated or risky addresses before the next send.',
    authSetup: 'Authentication setup',
    authSetupWhat: 'Align sending identity and authentication records so inbox providers trust your messages.',
    codeTitle: 'Have a referral code?',
    codePlaceholder: 'Enter referral code',
    apply: 'Apply code',
    applying: 'Checking…',
    codeApplied: 'Community referral discount applied: 30% off the inbox-reach package.',
    invalidCode: 'That referral code is not valid. Check the spelling or continue at standard pricing.',
    codeError: 'We could not check the code. Please try again.',
    remove: 'Remove discount',
    summaryTitle: 'Your preliminary estimate',
    coreServices: 'Inbox reach package',
    referralDiscount: 'Community referral discount',
    emailSetup: 'Professional email setup',
    emailAnnual: 'Microsoft 365 Business Basic — first year',
    subtotal: 'First-year estimate before HST',
    hst: 'HST (13%)',
    total: 'Projected first-year total',
    mobileSummaryLabel: 'Estimated first-year total',
    disclaimer:
      'This is a preliminary, non-binding estimate based on your selections. ROALLA confirms scope, compatibility, timing and final pricing in writing before work begins.',
    cta: 'Request scope confirmation',
    crossLinkLaunch: 'Need a new site? Estimate a website launch package',
    crossLinkVisibility: 'Already have a site? Estimate search and AI visibility improvements',
  },
  fr: {
    eyebrow: 'Estimateur de portée courriel',
    title: 'Estimez la configuration et la portée vers la boîte de réception.',
    intro:
      'Commencez par le forfait requis pour que les courriels atteignent la boîte de réception. Ouvrez les options seulement pour le courriel professionnel, le nettoyage de listes ou l’authentification.',
    requiredSection: 'Requis',
    optionalSection: 'Options facultatives',
    optionalSectionIntro: 'Ces éléments ne sont pas requis pour demander une confirmation de portée.',
    included: 'Inclus',
    selected: 'Sélectionné',
    whatItIs: 'De quoi il s’agit',
    whyItMatters: 'Pourquoi c’est important',
    foundation: 'Faire entrer les courriels dans la boîte de réception',
    foundationWhat:
      'Un forfait pratique de revue et d’amélioration axé sur la fiabilité d’arrivée des courriels d’affaires et de campagne.',
    foundationWhy:
      'Quand les messages vont dans les indésirables ou n’arrivent jamais, les clients cessent de répondre—même si l’offre est solide.',
    microsoftTitle: 'Courriel professionnel',
    microsoftPopular: 'La plupart des clients ajoutent ceci',
    microsoftLabel: 'Ajouter la configuration du courriel professionnel et Microsoft 365 Business Basic',
    microsoftValue: 'Votre courriel correspond à l’adresse du site, par exemple nom@votreentreprise.ca.',
    microsoftCost: '150 $ de configuration + 114 $/an',
    extrasTitle: 'Options supplémentaires',
    extrasLabel: 'Je veux le nettoyage de listes ou l’authentification',
    extrasValue: 'Ouvrez ceci seulement pour des options de portée. Sinon, laissez décoché.',
    listCleanup: 'Nettoyage de listes',
    listCleanupWhat:
      'Réduisez les rebonds et le risque d’indésirables en nettoyant les adresses périmées ou risquées avant le prochain envoi.',
    authSetup: 'Configuration de l’authentification',
    authSetupWhat:
      'Alignez l’identité d’envoi et les enregistrements d’authentification pour que les boîtes de réception fassent confiance à vos messages.',
    codeTitle: 'Avez-vous un code de recommandation?',
    codePlaceholder: 'Entrez le code',
    apply: 'Appliquer',
    applying: 'Vérification…',
    codeApplied: 'Rabais communautaire appliqué : 30 % sur le forfait de portée boîte de réception.',
    invalidCode: 'Ce code n’est pas valide. Vérifiez-le ou continuez au tarif standard.',
    codeError: 'Impossible de vérifier le code. Veuillez réessayer.',
    remove: 'Retirer le rabais',
    summaryTitle: 'Votre estimation préliminaire',
    coreServices: 'Forfait de portée boîte de réception',
    referralDiscount: 'Rabais de recommandation communautaire',
    emailSetup: 'Configuration du courriel professionnel',
    emailAnnual: 'Microsoft 365 Business Basic — première année',
    subtotal: 'Estimation de la première année avant TVH',
    hst: 'TVH (13 %)',
    total: 'Total projeté de la première année',
    mobileSummaryLabel: 'Total estimé de la première année',
    disclaimer:
      'Cette estimation préliminaire est non contraignante. ROALLA confirmera la portée, la compatibilité, l’échéancier et le prix final par écrit avant le début des travaux.',
    cta: 'Demander la confirmation de la portée',
    crossLinkLaunch: 'Besoin d’un nouveau site? Estimez un forfait de lancement Web',
    crossLinkVisibility: 'Vous avez déjà un site? Estimez les améliorations de visibilité recherche et IA',
  },
} as const

const tileSelected =
  'border-primary bg-primary/25 ring-2 ring-primary/40 shadow-md shadow-primary/15'
const tileIdle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'

export default function EmailReachEstimateBuilder() {
  const locale = useLocale()
  const french = locale === 'fr'
  const t = copy[french ? 'fr' : 'en']
  const money = useMemo(() => (amount: number) => formatCad(amount, french ? 'fr' : 'en'), [french])
  const [microsoft365, setMicrosoft365] = useState(false)
  const [showExtras, setShowExtras] = useState(false)
  const [listCleanup, setListCleanup] = useState(false)
  const [authSetup, setAuthSetup] = useState(false)
  const [code, setCode] = useState('')
  const [appliedReferralCode, setAppliedReferralCode] = useState('')
  const [referralApplied, setReferralApplied] = useState(false)
  const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'invalid' | 'error'>('idle')

  const estimate = calculateEmailReachEstimate({
    microsoft365,
    listCleanup: showExtras && listCleanup,
    authSetup: showExtras && authSetup,
    referralDiscount: referralApplied,
  })

  const toggleExtras = (checked: boolean) => {
    setShowExtras(checked)
    if (!checked) {
      setListCleanup(false)
      setAuthSetup(false)
    }
  }

  const selectionLines = [
    t.coreServices,
    microsoft365 ? t.emailSetup : null,
    showExtras && listCleanup ? t.listCleanup : null,
    showExtras && authSetup ? t.authSetup : null,
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

  const estimateGoal = `${french ? 'Estimation de portée courriel' : 'Email reach estimate'}: ${estimateTotalLabel} ${french ? 'TVH incluse' : 'including HST'}. ${estimateSummary}`

  const contactQuery = {
    intent: 'visibility',
    offer: 'estimate',
    from_page: '/email-reach-estimate',
    goal: estimateGoal,
    estimate_total: estimateTotalLabel,
    estimate_summary: estimateSummary,
    ...(appliedReferralCode ? { estimate_referral_code: appliedReferralCode } : {}),
  }

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

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                    <Inbox className="h-5 w-5" aria-hidden />
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
                <p className="shrink-0 pt-2 font-bold tabular-nums text-primary-dark">{money(EMAIL_REACH_CORE_PRICE)}</p>
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
              <legend className="flex flex-wrap items-center gap-2 text-xl font-serif font-bold text-slate-950">
                <Mail className="h-5 w-5 text-primary" aria-hidden />
                {t.microsoftTitle}
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">
                  {t.microsoftPopular}
                </span>
              </legend>
              <label className={`mt-4 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${microsoft365 ? tileSelected : tileIdle}`}>
                <input
                  className="mt-1 h-4 w-4 accent-primary"
                  type="checkbox"
                  checked={microsoft365}
                  onChange={(event) => setMicrosoft365(event.target.checked)}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="block font-semibold text-slate-900">{t.microsoftLabel}</span>
                    {microsoft365 ? (
                      <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-slate-700">
                    <EmailSafeText text={t.microsoftValue} />
                  </span>
                  <span className="mt-2 block text-sm font-bold text-primary-dark">{t.microsoftCost}</span>
                </span>
              </label>
            </fieldset>

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
                <div className="mt-4 grid gap-3 border-t border-slate-200 pt-5">
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${listCleanup ? tileSelected : tileIdle}`}
                  >
                    <input
                      className="mt-1 h-4 w-4 accent-primary"
                      type="checkbox"
                      checked={listCleanup}
                      onChange={(event) => setListCleanup(event.target.checked)}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2 font-semibold text-slate-900">
                          <ListChecks className="h-4 w-4 text-primary" aria-hidden />
                          {t.listCleanup}
                        </span>
                        <span className="font-bold tabular-nums text-primary-dark">{money(EMAIL_REACH_PRICES.listCleanup)}</span>
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-700">{t.listCleanupWhat}</span>
                    </span>
                  </label>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${authSetup ? tileSelected : tileIdle}`}
                  >
                    <input
                      className="mt-1 h-4 w-4 accent-primary"
                      type="checkbox"
                      checked={authSetup}
                      onChange={(event) => setAuthSetup(event.target.checked)}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2 font-semibold text-slate-900">
                          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
                          {t.authSetup}
                        </span>
                        <span className="font-bold tabular-nums text-primary-dark">{money(EMAIL_REACH_PRICES.authSetup)}</span>
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-700">{t.authSetupWhat}</span>
                    </span>
                  </label>
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
                  <label className="sr-only" htmlFor="email-reach-referral-code">
                    {t.codePlaceholder}
                  </label>
                  <input
                    id="email-reach-referral-code"
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
                <dd className="font-semibold tabular-nums text-slate-900">{money(EMAIL_REACH_CORE_PRICE)}</dd>
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
              {microsoft365 ? (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-700">{t.emailSetup}</dt>
                    <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.emailSetup)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-700">{t.emailAnnual}</dt>
                    <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.emailAnnual)}</dd>
                  </div>
                </>
              ) : null}
              {estimate.listCleanup > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-700">{t.listCleanup}</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.listCleanup)}</dd>
                </div>
              ) : null}
              {estimate.authSetup > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-700">{t.authSetup}</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.authSetup)}</dd>
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
                <Link href="/visibility-improvement-estimate" className="font-semibold text-primary-dark underline-offset-4 hover:underline">
                  {t.crossLinkVisibility}
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
