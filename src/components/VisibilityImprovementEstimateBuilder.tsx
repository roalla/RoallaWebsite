'use client'

import React, { useMemo, useState } from 'react'
import { CheckCircle, MapPin, PenLine, SearchCheck, Sparkles, Tag, Info } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  calculateVisibilityImprovementEstimate,
  LOCAL_MAPS_PRICES,
  type LocalMapsChoice,
  VISIBILITY_IMPROVEMENT_CORE_PRICE,
  VISIBILITY_IMPROVEMENT_PRICES,
} from '@/lib/visibility-improvement-estimate'
import EstimateInvestmentPayback, {
  type EstimatePaybackPlanning,
} from '@/components/estimates/EstimateInvestmentPayback'
import EstimateMarketContextFields from '@/components/estimates/EstimateMarketContextFields'
import EstimateConsiderations from '@/components/estimates/EstimateConsiderations'
import { useEstimateMarketRegion } from '@/hooks/useEstimateMarketRegion'

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
      'Start with the required visibility foundation. Add Google Maps help, an offer rewrite, or a first-year recheck plan only if you need them.',
    requiredSection: 'Required',
    optionalSection: 'Optional add-ons',
    optionalSectionIntro: 'These are not required to request a scope confirmation.',
    included: 'Included',
    selected: 'Selected',
    recommended: 'Recommended',
    whatItIs: 'What you get',
    whyItMatters: 'Why it helps you',
    foundation: 'Visibility foundation',
    foundationWhat:
      'A focused package to improve how search tools and AI assistants find and describe your existing public site.',
    foundationWhy:
      'Helps the right customers discover and understand the business when configured properly (SEO, AEO, agentic AI). Rankings are not guaranteed.',
    extrasTitle: 'Additional options',
    extrasLabel: 'I want Google Maps help, an offer rewrite, or monitoring',
    extrasValue: 'Open this only if you want optional visibility add-ons. Otherwise leave it unchecked.',
    mapsTitle: 'Do you want help showing up on Google Maps?',
    mapsNeedIntro:
      'Nearby customers often pick whoever looks correct and trustworthy on the map. Choose a level only if your listing needs work.',
    mapsNone: 'No Google Maps help right now',
    mapsNoneValue: 'Continue without Maps work. You can add it later.',
    mapsChooseTitle: 'Choose how much Maps help you want',
    mapsEssentials: 'Fix the basics',
    mapsEssentialsWhat:
      'We correct your Google Business Profile so name, address, hours, and phone match what customers should see.',
    mapsEssentialsWhy: 'Stops wrong info that causes missed calls and “are they still open?” doubt.',
    mapsEssentialsBestFor: 'Best when details are wrong or outdated',
    mapsNearby: 'Ready for nearby customers',
    mapsNearbyWhat:
      'Basics plus categories, services, and listing consistency—and a photo review: we recommend which of your existing photos to use as cover and gallery (and how to present them). We do not shoot or create new photos.',
    mapsNearbyWhy: 'Makes it easier for local searchers to choose you instead of a messy competitor listing.',
    mapsNearbyBestFor: 'Best for most local businesses',
    mapsCompete: 'Compete on the map',
    mapsCompeteWhat:
      'Ready-for-nearby work plus a deeper cleanup across common directories, Q&A readiness, and a short plan to keep the profile strong.',
    mapsCompeteWhy: 'Helps you look more complete and credible when customers compare a few local options.',
    mapsCompeteBestFor: 'Best when competitors already look polished on Maps',
    offerRewrite: 'Rewrite one offer page',
    offerRewriteWhat:
      'ROALLA rewrites one primary service or offer page—headline, plain explanation, who it is for, and the next step—so visitors and search/AI tools can describe it accurately.',
    offerRewriteWhy:
      'Clearer pages reduce confusion and bounce. Customers understand what you sell and how to inquire; search and AI tools get facts they can trust. Rankings are not guaranteed.',
    offerRewriteBestFor: 'Best when your main offer page is vague, outdated, or hard to explain in one sentence',
    monitoring: 'First-year check-ins',
    monitoringWhat:
      'Scheduled reviews through the first year of the listing and site signals from your foundation work, with a short note on what drifted and what to fix next.',
    monitoringWhy:
      'Hours, pages, and listings change. Without check-ins, early wins fade and wrong details can return.',
    monitoringBestFor: 'Best when you want light follow-up without a full monthly SEO retainer',
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
    subtotal: 'First-year estimate before tax',
    hst: 'HST (13%)',
    taxSelectPrompt: 'Select your province or state to estimate tax.',
    regionRequiredCta: 'Select your province or state to continue',
    taxDisclaimer:
      'ROALLA is federally incorporated. Package prices are CAD nationwide. Tax lines are a preliminary estimate from the location you select; final tax is confirmed on scoping.',
    total: 'Projected first-year total',
    mobileSummaryLabel: 'Estimated first-year total',
    chatgptTitle: 'Why not just use ChatGPT?',
    chatgptLead: 'ChatGPT can help you think. This package is for what chat tools cannot reliably do on your live public presence.',
    chatgptPoints: [
      'See how your real site, maps listing, and public facts show up—not a generic checklist.',
      'Fix and publish what customers and AI systems actually read (pages, listings, consistency).',
      'Light first-year check-ins so hours, pages, and details do not quietly drift back.',
    ],
    chatgptClose: 'ROALLA does not guarantee rankings or AI citations—neither do chat tools. You pay for scoped work on your footprint, not a transcript.',
    paybackTitle: 'Think of this as an investment',
    paybackLead:
      'If clearer search, maps, and AI answers help even one extra customer choose you, the work can pay for itself.',
    paybackInputLabel: 'What is one new client worth to you? (CAD)',
    paybackResult: (total: string, n: number, value: string) =>
      `At your estimate of ${total}, this pays back after about ${n} new client${n === 1 ? '' : 's'} at ${value} each.`,
    paybackSoftClose: 'This is a planning aid—not a forecast. Results are not guaranteed.',
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
      'Commencez par la fondation de visibilité requise. Ajoutez l’aide Google Maps, une réécriture d’offre ou un plan de revérification seulement si vous en avez besoin.',
    requiredSection: 'Requis',
    optionalSection: 'Options facultatives',
    optionalSectionIntro: 'Ces éléments ne sont pas requis pour demander une confirmation de portée.',
    included: 'Inclus',
    selected: 'Sélectionné',
    recommended: 'Recommandé',
    whatItIs: 'Ce que vous obtenez',
    whyItMatters: 'Pourquoi ça vous aide',
    foundation: 'Fondation de visibilité',
    foundationWhat:
      'Un forfait ciblé pour améliorer la façon dont les outils de recherche et les assistants IA trouvent et décrivent votre site public existant.',
    foundationWhy:
      'Aide les bons clients à découvrir et comprendre l’entreprise lorsque la configuration est adéquate (SEO, AEO, IA agentique). Aucun classement n’est garanti.',
    extrasTitle: 'Options supplémentaires',
    extrasLabel: 'Je veux de l’aide Google Maps, une réécriture d’offre ou le suivi',
    extrasValue: 'Ouvrez ceci seulement pour des options de visibilité. Sinon, laissez décoché.',
    mapsTitle: 'Voulez-vous de l’aide pour apparaître sur Google Maps?',
    mapsNeedIntro:
      'Les clients du coin choisissent souvent qui paraît exact et digne de confiance sur la carte. Choisissez un niveau seulement si votre fiche a besoin de travail.',
    mapsNone: 'Pas d’aide Google Maps pour le moment',
    mapsNoneValue: 'Continuer sans travail Maps. Vous pourrez l’ajouter plus tard.',
    mapsChooseTitle: 'Choisissez le niveau d’aide Maps',
    mapsEssentials: 'Corriger l’essentiel',
    mapsEssentialsWhat:
      'Nous corrigeons votre fiche d’établissement Google pour que le nom, l’adresse, les heures et le téléphone correspondent à ce que les clients doivent voir.',
    mapsEssentialsWhy: 'Réduit les infos fausses qui causent des appels manqués et des doutes « sont-ils encore ouverts? ».',
    mapsEssentialsBestFor: 'Idéal quand les détails sont faux ou dépassés',
    mapsNearby: 'Prêt pour les clients du coin',
    mapsNearbyWhat:
      'L’essentiel plus les catégories, services et la cohérence des listings—et une revue photo : nous recommandons lesquelles de vos photos existantes utiliser en couverture et en galerie (et comment les présenter). Nous ne photographions pas et ne créons pas de nouvelles images.',
    mapsNearbyWhy: 'Facilite le choix pour les chercheurs locaux plutôt qu’un concurrent mal listé.',
    mapsNearbyBestFor: 'Idéal pour la plupart des entreprises locales',
    mapsCompete: 'Concourir sur la carte',
    mapsCompeteWhat:
      'Le forfait « prêt pour le coin » plus un nettoyage plus profond des annuaires courants, la préparation Q&R et un court plan pour garder la fiche solide.',
    mapsCompeteWhy: 'Vous aide à paraître plus complet et crédible quand les clients comparent quelques options locales.',
    mapsCompeteBestFor: 'Idéal quand les concurrents ont déjà une fiche soignée',
    offerRewrite: 'Réécrire une page d’offre',
    offerRewriteWhat:
      'ROALLA réécrit une page de service ou d’offre principale—titre, explication simple, pour qui c’est, et la prochaine étape—pour que les visiteurs et les outils de recherche/IA la décrivent avec exactitude.',
    offerRewriteWhy:
      'Des pages plus claires réduisent la confusion et les départs rapides. Les clients comprennent ce que vous vendez et comment vous joindre; la recherche et l’IA obtiennent des faits fiables. Aucun classement n’est garanti.',
    offerRewriteBestFor: 'Idéal quand votre page d’offre principale est vague, dépassée ou difficile à expliquer en une phrase',
    monitoring: 'Suivis de la première année',
    monitoringWhat:
      'Des revues planifiées pendant la première année des signaux de fiche et de site issus de la fondation, avec une courte note sur ce qui a dérivé et quoi corriger ensuite.',
    monitoringWhy:
      'Les heures, pages et listings changent. Sans suivis, les gains s’effacent et de mauvaises infos peuvent revenir.',
    monitoringBestFor: 'Idéal si vous voulez un suivi léger sans forfait SEO mensuel complet',
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
    subtotal: 'Estimation de la première année avant taxes',
    hst: 'TVH (13 %)',
    taxSelectPrompt: 'Sélectionnez votre province ou État pour estimer la taxe.',
    regionRequiredCta: 'Sélectionnez votre province ou État pour continuer',
    taxDisclaimer:
      'ROALLA est constituée sous régime fédéral. Les forfaits sont en $ CA partout au pays. Les lignes de taxe sont une estimation préliminaire selon le lieu choisi; la taxe finale est confirmée au cadrage.',
    total: 'Total projeté de la première année',
    mobileSummaryLabel: 'Total estimé de la première année',
    chatgptTitle: 'Pourquoi ne pas simplement utiliser ChatGPT?',
    chatgptLead: 'ChatGPT peut aider à réfléchir. Ce forfait porte sur ce que les outils de clavardage ne peuvent pas faire de façon fiable sur votre présence publique réelle.',
    chatgptPoints: [
      'Voir comment votre vrai site, votre fiche cartes et vos faits publics apparaissent—pas une liste générique.',
      'Corriger et publier ce que clients et systèmes d’IA lisent vraiment (pages, fiches, cohérence).',
      'Des suivis légers la première année pour que heures, pages et détails ne dérivent pas en silence.',
    ],
    chatgptClose: 'ROALLA ne garantit ni classement ni citation IA—les outils de clavardage non plus. Vous payez un travail ciblé sur votre empreinte, pas une transcription.',
    paybackTitle: 'Voyez ceci comme un investissement',
    paybackLead:
      'Si une recherche, des cartes et des réponses IA plus claires aident ne serait-ce qu’un client de plus à vous choisir, le travail peut se rentabiliser.',
    paybackInputLabel: 'Quelle est la valeur d’un nouveau client pour vous? (CAD)',
    paybackResult: (total: string, n: number, value: string) =>
      `Avec votre estimation de ${total}, cela se rentabilise après environ ${n} nouveau${n === 1 ? '' : 'x'} client${n === 1 ? '' : 's'} à ${value} chacun.`,
    paybackSoftClose: 'Ceci est un outil de planification—pas une prévision. Les résultats ne sont pas garantis.',
    disclaimer:
      'Cette estimation préliminaire est non contraignante. ROALLA confirmera la portée, la compatibilité, l’échéancier et le prix final par écrit avant le début des travaux.',
    cta: 'Demander la confirmation de la portée',
    crossLinkLaunch: 'Besoin d’un nouveau site? Estimez un forfait de lancement Web',
    crossLinkEmail: 'Les courriels n’atteignent pas les clients? Estimez la portée et la configuration',
  },
}

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
  const {
    marketId,
    setMarketId,
    regionId,
    setRegionId,
    regionReady,
    considerations,
    contextSummary,
    attributionQuery,
    crossLinkQuery,
  } = useEstimateMarketRegion(french ? 'fr' : 'en', 'visibility')
  const [showExtras, setShowExtras] = useState(false)
  const [localMaps, setLocalMaps] = useState<LocalMapsChoice>('none')
  const [offerRewrite, setOfferRewrite] = useState(false)
  const [monitoring, setMonitoring] = useState(false)
  const [code, setCode] = useState('')
  const [appliedReferralCode, setAppliedReferralCode] = useState('')
  const [paybackPlanning, setPaybackPlanning] = useState<EstimatePaybackPlanning>({
    value: 2500,
    paybackCount: null,
  })
  const [referralApplied, setReferralApplied] = useState(false)
  const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'invalid' | 'error'>('idle')

  const activeLocalMaps: LocalMapsChoice = showExtras ? localMaps : 'none'
  const estimate = calculateVisibilityImprovementEstimate({
    localMaps: activeLocalMaps,
    offerRewrite: showExtras && offerRewrite,
    monitoring: showExtras && monitoring,
    referralDiscount: referralApplied,
    regionId: regionId || null,
  })

  const toggleExtras = (checked: boolean) => {
    setShowExtras(checked)
    if (!checked) {
      setLocalMaps('none')
      setOfferRewrite(false)
      setMonitoring(false)
    }
  }

  const mapsSummaryLabel =
    activeLocalMaps === 'none'
      ? null
      : activeLocalMaps === 'essentials'
        ? t.mapsEssentials
        : activeLocalMaps === 'nearby'
          ? t.mapsNearby
          : t.mapsCompete

  const selectionLines = [
    t.coreServices,
    mapsSummaryLabel,
    showExtras && offerRewrite ? t.offerRewrite : null,
    showExtras && monitoring ? t.monitoring : null,
    referralApplied
      ? appliedReferralCode
        ? `${t.referralDiscount} (${appliedReferralCode})`
        : t.referralDiscount
      : null,
  ].filter(Boolean) as string[]

  const paybackSummary =
    paybackPlanning.value > 0 && paybackPlanning.paybackCount !== null
      ? french
        ? `Valeur client ${money(paybackPlanning.value)} · ~${paybackPlanning.paybackCount} client(s) pour rentabiliser`
        : `Client value ${money(paybackPlanning.value)} · ~${paybackPlanning.paybackCount} client(s) to pay back`
      : null
  const estimateSummary = [...selectionLines, contextSummary || null, paybackSummary]
    .filter(Boolean)
    .join(' · ')
  const estimateTotalLabel = money(estimate.firstYearTotal)
  const taxInclusiveLabel = estimate.taxReady
    ? french
      ? 'taxes incluses'
      : 'including tax'
    : french
      ? 'avant taxes (région requise)'
      : 'before tax (region required)'

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

  const estimateGoal = `${french ? 'Estimation de visibilité' : 'Visibility estimate'}: ${estimateTotalLabel} ${taxInclusiveLabel}. ${estimateSummary}`

  const contactQuery = {
    intent: 'visibility',
    offer: 'estimate',
    from_page: '/visibility-improvement-estimate',
    goal: estimateGoal,
    estimate_total: estimateTotalLabel,
    estimate_summary: estimateSummary,
    ...attributionQuery,
    ...(appliedReferralCode ? { estimate_referral_code: appliedReferralCode } : {}),
    ...(paybackPlanning.value > 0
      ? {
          client_value: money(paybackPlanning.value),
          ...(paybackPlanning.paybackCount !== null
            ? { clients_to_payback: String(paybackPlanning.paybackCount) }
            : {}),
        }
      : {}),
  }

  const contactCta = regionReady ? (
    <Link
      href={{ pathname: '/contact', query: contactQuery }}
      className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-center font-bold text-white transition hover:bg-primary-dark"
    >
      {t.cta}
    </Link>
  ) : (
    <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-950">
      {t.regionRequiredCta}
    </p>
  )

  const mobileContactCta = regionReady ? (
    <Link
      href={{ pathname: '/contact', query: contactQuery }}
      className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark"
    >
      {t.cta}
    </Link>
  ) : (
    <span className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-slate-300 px-4 text-sm font-bold text-slate-600">
      {t.cta}
    </span>
  )

  const mapsOptions: Array<{
    value: Exclude<LocalMapsChoice, 'none'>
    label: string
    what: string
    why: string
    bestFor: string
    price: number
    recommended?: boolean
  }> = [
    {
      value: 'essentials',
      label: t.mapsEssentials,
      what: t.mapsEssentialsWhat,
      why: t.mapsEssentialsWhy,
      bestFor: t.mapsEssentialsBestFor,
      price: LOCAL_MAPS_PRICES.essentials,
    },
    {
      value: 'nearby',
      label: t.mapsNearby,
      what: t.mapsNearbyWhat,
      why: t.mapsNearbyWhy,
      bestFor: t.mapsNearbyBestFor,
      price: LOCAL_MAPS_PRICES.nearby,
      recommended: true,
    },
    {
      value: 'compete',
      label: t.mapsCompete,
      what: t.mapsCompeteWhat,
      why: t.mapsCompeteWhy,
      bestFor: t.mapsCompeteBestFor,
      price: LOCAL_MAPS_PRICES.compete,
    },
  ]

  const optionalItems = [
    {
      key: 'offerRewrite' as const,
      label: t.offerRewrite,
      what: t.offerRewriteWhat,
      why: t.offerRewriteWhy,
      bestFor: t.offerRewriteBestFor,
      price: VISIBILITY_IMPROVEMENT_PRICES.offerRewrite,
      checked: offerRewrite,
      setChecked: setOfferRewrite,
      icon: PenLine,
    },
    {
      key: 'monitoring' as const,
      label: t.monitoring,
      what: t.monitoringWhat,
      why: t.monitoringWhy,
      bestFor: t.monitoringBestFor,
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
          <EstimateMarketContextFields
            locale={french ? 'fr' : 'en'}
            marketId={marketId}
            regionId={regionId}
            onMarketChange={setMarketId}
            onRegionChange={setRegionId}
          />
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
                <div className="mt-4 space-y-6 border-t border-slate-200 pt-5">
                  <div>
                    <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-slate-950">
                      <MapPin className="h-5 w-5 text-primary" aria-hidden />
                      {t.mapsTitle}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{t.mapsNeedIntro}</p>

                    <label className={`mt-4 flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${localMaps === 'none' ? tileSelected : tileIdle}`}>
                      <input
                        className="mt-1 h-4 w-4 accent-primary"
                        type="radio"
                        name="local-maps"
                        checked={localMaps === 'none'}
                        onChange={() => setLocalMaps('none')}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-950">{t.mapsNone}</span>
                          {localMaps === 'none' ? (
                            <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span>
                          ) : null}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-700">{t.mapsNoneValue}</span>
                      </span>
                    </label>

                    {localMaps !== 'none' ? (
                      <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-primary-dark">{t.mapsChooseTitle}</p>
                    ) : (
                      <p className="mt-5 text-sm font-semibold text-slate-800">{t.mapsChooseTitle}</p>
                    )}

                    <div className="mt-3 grid gap-3">
                      {mapsOptions.map((option) => {
                        const selected = localMaps === option.value
                        return (
                          <label
                            key={option.value}
                            className={`cursor-pointer rounded-xl border p-4 ${selected ? tileSelected : tileIdle}`}
                          >
                            <input
                              className="sr-only"
                              type="radio"
                              name="local-maps"
                              value={option.value}
                              checked={selected}
                              onChange={() => setLocalMaps(option.value)}
                            />
                            <span className="flex flex-wrap items-start justify-between gap-3">
                              <span className="flex min-w-0 flex-wrap items-center gap-2">
                                <span className="font-semibold text-slate-950">{option.label}</span>
                                {selected ? (
                                  <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span>
                                ) : null}
                                {option.recommended ? (
                                  <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                                    {t.recommended}
                                  </span>
                                ) : null}
                              </span>
                              <span className="flex items-center gap-2">
                                <span className="font-bold tabular-nums text-primary-dark">{money(option.price)}</span>
                                {selected ? <CheckCircle className="h-5 w-5 shrink-0 text-primary-dark" aria-hidden /> : null}
                              </span>
                            </span>
                            <span className="mt-3 grid gap-2 sm:grid-cols-2">
                              <span className="rounded-xl bg-slate-50 p-3">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">{t.whatItIs}</span>
                                <span className="mt-1.5 block text-sm leading-6 text-slate-800">{option.what}</span>
                              </span>
                              <span className="rounded-xl bg-primary/5 p-3">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-primary-dark">{t.whyItMatters}</span>
                                <span className="mt-1.5 block text-sm leading-6 text-slate-800">{option.why}</span>
                              </span>
                            </span>
                            <span className="mt-3 block border-t border-slate-200 pt-3 text-xs font-semibold text-primary-dark">
                              {option.bestFor}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {optionalItems.map(({ key, label, what, why, bestFor, price, checked, setChecked, icon: Icon }) => (
                      <label
                        key={key}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${checked ? tileSelected : tileIdle}`}
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
                          <span className="mt-3 grid gap-2 sm:grid-cols-2">
                            <span className="rounded-xl bg-slate-50 p-3">
                              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">{t.whatItIs}</span>
                              <span className="mt-1.5 block text-sm leading-6 text-slate-800">{what}</span>
                            </span>
                            <span className="rounded-xl bg-primary/5 p-3">
                              <span className="block text-[11px] font-bold uppercase tracking-wider text-primary-dark">{t.whyItMatters}</span>
                              <span className="mt-1.5 block text-sm leading-6 text-slate-800">{why}</span>
                            </span>
                          </span>
                          <span className="mt-3 block border-t border-slate-200 pt-3 text-xs font-semibold text-primary-dark">
                            {bestFor}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
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
              {estimate.localMaps > 0 && mapsSummaryLabel ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-700">{mapsSummaryLabel}</dt>
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
              {estimate.taxReady ? (
                estimate.taxLines.length > 0 ? (
                  estimate.taxLines.map((line) => (
                    <div key={line.id} className="flex justify-between gap-4 text-sm">
                      <span className="text-slate-700">{french ? line.label.fr : line.label.en}</span>
                      <span className="font-semibold tabular-nums text-slate-900">{money(line.amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs leading-5 text-slate-600">
                    {estimate.taxNote ? (french ? estimate.taxNote.fr : estimate.taxNote.en) : null}
                  </p>
                )
              ) : (
                <p className="text-sm font-medium text-amber-900">{t.taxSelectPrompt}</p>
              )}
              {estimate.taxNote && estimate.taxReady && estimate.taxLines.length > 0 ? (
                <p className="text-xs leading-5 text-slate-600">
                  {french ? estimate.taxNote.fr : estimate.taxNote.en}
                </p>
              ) : null}
              <div className="flex items-end justify-between gap-4 border-t border-slate-300 pt-4">
                <span className="font-bold text-slate-950">{t.total}</span>
                <span className="text-2xl font-serif font-bold tabular-nums text-primary-dark">{estimateTotalLabel}</span>
              </div>
            </div>
            <EstimateConsiderations locale={french ? 'fr' : 'en'} items={considerations} />
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <p className="flex items-start gap-2 text-sm font-bold text-slate-950">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{t.chatgptTitle}</span>
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-600">{t.chatgptLead}</p>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-700">
                {t.chatgptPoints.map((point) => (
                  <li key={point} className="flex gap-2">
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-5 text-slate-600">{t.chatgptClose}</p>
            </div>
            <EstimateInvestmentPayback
              locale={french ? 'fr' : 'en'}
              total={estimate.firstYearTotal}
              title={t.paybackTitle}
              lead={t.paybackLead}
              inputLabel={t.paybackInputLabel}
              softClose={t.paybackSoftClose}
              formatResult={({ totalLabel, valueLabel, paybackCount }) =>
                t.paybackResult(totalLabel, paybackCount, valueLabel)
              }
              onPlanningChange={setPaybackPlanning}
            />
            <p className="mt-5 text-xs leading-5 text-slate-600">{t.disclaimer}</p>
            <p className="mt-2 text-xs leading-5 text-slate-600">{t.taxDisclaimer}</p>
            {contactCta}
            <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-700">
              <p className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <Link
                  href={{ pathname: '/website-estimate', query: crossLinkQuery }}
                  className="font-semibold text-primary-dark underline-offset-4 hover:underline"
                >
                  {t.crossLinkLaunch}
                </Link>
              </p>
              <p className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <Link
                  href={{ pathname: '/email-reach-estimate', query: crossLinkQuery }}
                  className="font-semibold text-primary-dark underline-offset-4 hover:underline"
                >
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
          {mobileContactCta}
        </div>
      </div>
    </section>
  )
}
