'use client'

import React, { useMemo, useState } from 'react'
import {
  CheckCircle,
  Clock3,
  Info,
  Languages,
  MapPin,
  Monitor,
  NotebookPen,
  Sparkles,
  Tag,
  Users,
  Video,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  workshopTopicValues,
  type WorkshopTopic,
} from '@/lib/consultation-request'
import {
  WORKSHOP_DURATION_HOURS,
  WORKSHOP_DURATION_PRICES,
  WORKSHOP_ESTIMATE_PRICES,
  calculateWorkshopEstimate,
  type WorkshopDelivery,
  type WorkshopDuration,
  type WorkshopParticipantBand,
} from '@/lib/workshop-estimate'
import EstimateMarketContextFields from '@/components/estimates/EstimateMarketContextFields'
import EstimateConsiderations from '@/components/estimates/EstimateConsiderations'
import EstimateCommercialNotes from '@/components/estimates/EstimateCommercialNotes'
import EstimateShell from '@/components/estimates/EstimateShell'
import EstimateWizard, { EstimateModeToggle } from '@/components/estimates/EstimateWizard'
import { useEstimateMarketRegion } from '@/hooks/useEstimateMarketRegion'
import { useEstimateWizardMode } from '@/hooks/useEstimateWizardMode'
import { ESTIMATE_PRICING_VERSION } from '@/lib/estimate-commercial'

function formatCad(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: 'CAD',
  })
    .format(amount)
    .replace(/[\u00a0\u202f\u2009]/g, ' ')
}

const tileMotion =
  'transition-all duration-200 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.015] motion-safe:hover:shadow-lg motion-safe:hover:shadow-primary/25'
const tileSelected = `${tileMotion} border-primary bg-primary/25 ring-2 ring-primary/40 shadow-md shadow-primary/15`
const tileIdle = `${tileMotion} border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50`

const topicLabels = {
  en: {
    'focus-circle': 'Focus Circle',
    'workload-conversation': 'The Workload Conversation',
    'digital-calm': 'Digital Calm',
    'decision-hour': 'Decision Hour',
    'offer-page': 'The Offer on One Page',
    branding: 'Branding workshop',
    sales: 'Sales workshop',
    productivity: 'Productivity workshop',
    ideation: 'Ideation',
    'first-offer': 'First Offer',
    other: 'Other / custom topic',
  },
  fr: {
    'focus-circle': 'Cercle de focus',
    'workload-conversation': 'La conversation sur la charge',
    'digital-calm': 'Calme numérique',
    'decision-hour': 'Heure de décision',
    'offer-page': 'L’offre sur une page',
    branding: 'Atelier de marque',
    sales: 'Atelier de vente',
    productivity: 'Atelier de productivité',
    ideation: 'Idéation',
    'first-offer': 'Première offre',
    other: 'Autre / sujet sur mesure',
  },
} as const

const copy = {
  en: {
    eyebrow: 'Workshop estimator',
    title: 'Estimate a facilitated workshop session.',
    intro:
      'Choose a topic, session length, and optional add-ons. Prices are CAD. Travel is included inside Mississauga, Hamilton, and Milton; beyond that, travel is confirmed on scoping.',
    jumpToEstimate: 'See your running estimate',
    mobileSummaryLabel: 'Your estimate',
    requiredSection: 'Required',
    optionalSection: 'Optional add-ons',
    optionalSectionIntro: 'These are not required to request a scope confirmation.',
    whatItIs: 'What it is',
    whyItMatters: 'Why it matters',
    selected: 'Selected',
    topicTitle: 'Which workshop?',
    topicIntro: 'Topic does not change the session price. It tells ROALLA what to prepare and prefills your inquiry.',
    durationTitle: 'How long is the session?',
    oneHour: '1 hour',
    oneHourWhat: 'A focused facilitation block for one decision, rehearsal, or practice loop.',
    oneHourWhy: 'Best when the room already has a clear question and limited calendar time.',
    halfDay: 'Half day (3 hours)',
    halfDayWhat: 'A typical hosted workshop: teach, practice, and leave with named next steps.',
    halfDayWhy: 'Enough time for shared language and commitments without a full workday.',
    fullDay: 'Full day (6 hours)',
    fullDayWhat: 'Extended facilitation with deeper practice, multiple loops, or heavier decision work.',
    fullDayWhy: 'Use when the team needs more rehearsal, evidence, or trade-off work in one sitting.',
    deliveryTitle: 'How will you host it?',
    inPerson: 'In person',
    inPersonWhat: 'ROALLA facilitates on site at your venue.',
    inPersonWhy: 'Best for whiteboards, paired practice, and rooms that work better face-to-face.',
    virtual: 'Virtual',
    virtualWhat: 'Live facilitated session online at the same session price as in person.',
    virtualWhy: 'No travel. Useful for distributed teams or when the room is already remote-first.',
    participantsTitle: 'How many people?',
    band16: 'Up to 16 participants',
    band16What: 'Included group size for standard facilitation.',
    band16Why: 'Keeps discussion and practice workable in one room or call.',
    band30: '17–30 participants',
    band30What: `Adds a ${formatCad(WORKSHOP_ESTIMATE_PRICES.participantSurcharge, 'en')} group surcharge for a larger room.`,
    band30Why: 'Larger groups need tighter facilitation structure and more materials coordination.',
    bandOver: 'More than 30',
    bandOverWhat: 'Larger groups are quoted on scoping—no automatic price in this estimate.',
    bandOverWhy: 'Format, staffing, and materials change above typical workshop size.',
    travelTitle: 'Is the venue outside the included travel zone?',
    travelLabel: 'Yes — beyond Mississauga (east), Hamilton (west), or Milton (north)',
    travelWhat:
      'Included travel covers venues roughly east to Mississauga, west to Hamilton, and north to Milton. Outside that area, travel fees apply.',
    travelWhy: 'Keeps local hosting predictable. Out-of-zone travel is confirmed in writing—not guessed in this total.',
    travelSummary: 'Travel fee — confirmed on scoping',
    materials: 'Participant materials pack',
    materialsWhat: 'Print-ready and digital handouts or cards for the room.',
    materialsWhy: 'People leave with the same tools, not only memory of the slides.',
    bilingual: 'Bilingual facilitation (EN + FR)',
    bilingualWhat: 'Session delivery that can move between English and French as the room needs.',
    bilingualWhy: 'Useful for mixed-language teams in the GTA without running two separate workshops.',
    followUp: 'Follow-up check-in (1 hour)',
    followUpWhat: 'A one-hour follow-up within about 30 days to review commitments and unblock next steps.',
    followUpWhy: 'Protects workshop value when energy fades after the room empties.',
    customAgenda: 'Custom agenda design',
    customAgendaWhat: 'Prep work to shape the session beyond a catalog workshop outline.',
    customAgendaWhy: 'Best when your decision, audience, or constraints do not match a standard agenda.',
    recording: 'Session recording / shareable recap',
    recordingWhat: 'Recording plus a short written recap of decisions and next steps.',
    recordingWhy: 'Helps absentees and leaders who need a durable record without another meeting.',
    codeTitle: 'Have a referral code?',
    codePlaceholder: 'Enter referral code',
    apply: 'Apply',
    applying: 'Checking…',
    remove: 'Remove code',
    codeApplied: 'Community referral discount applied: 30% off the session facilitation fee.',
    invalidCode: 'That referral code is not valid. Check the spelling or continue at standard pricing.',
    codeError: 'Could not verify that code right now. Try again or continue without it.',
    summaryTitle: 'Your preliminary estimate',
    sessionFee: 'Session facilitation',
    referralDiscount: 'Community referral discount',
    materialsLine: 'Participant materials',
    bilingualLine: 'Bilingual facilitation',
    followUpLine: 'Follow-up check-in',
    customAgendaLine: 'Custom agenda design',
    recordingLine: 'Recording / recap',
    participantLine: 'Larger group (17–30)',
    largeGroupNote: 'Groups over 30 are quoted on scoping.',
    seriesNote: 'Multi-day or multi-week series are quoted separately.',
    subtotal: 'Estimate before tax',
    taxSelectPrompt: 'Select your province or state to estimate tax.',
    regionRequiredCta: 'Select your province or state to continue',
    taxDisclaimer:
      'ROALLA is federally incorporated. Package prices are CAD. Tax lines are a preliminary estimate from the location you select; final tax is confirmed on scoping.',
    total: 'Projected total',
    disclaimer:
      'This is a preliminary, non-binding host estimate—not online ticketing. ROALLA confirms topic, agenda, group size, venue or virtual setup, travel, and final pricing in writing before booking.',
    cta: 'Request scope confirmation',
    crossLinkPrograms: 'Browse team workshops',
  },
  fr: {
    eyebrow: 'Estimateur d’atelier',
    title: 'Estimez une séance d’atelier facilitée.',
    intro:
      'Choisissez un sujet, une durée et des options. Les prix sont en $ CA. Le déplacement est inclus jusqu’à Mississauga, Hamilton et Milton; au-delà, il est confirmé au cadrage.',
    jumpToEstimate: 'Voir votre estimation en cours',
    mobileSummaryLabel: 'Votre estimation',
    requiredSection: 'Requis',
    optionalSection: 'Options facultatives',
    optionalSectionIntro: 'Ces éléments ne sont pas requis pour demander une confirmation de portée.',
    whatItIs: 'De quoi il s’agit',
    whyItMatters: 'Pourquoi c’est important',
    selected: 'Sélectionné',
    topicTitle: 'Quel atelier?',
    topicIntro: 'Le sujet ne change pas le prix de la séance. Il indique à ROALLA quoi préparer et préremplit votre demande.',
    durationTitle: 'Quelle durée?',
    oneHour: '1 heure',
    oneHourWhat: 'Un bloc de facilitation ciblé pour une décision, une répétition ou une boucle de pratique.',
    oneHourWhy: 'Idéal quand la question est claire et le temps au calendrier limité.',
    halfDay: 'Demi-journée (3 heures)',
    halfDayWhat: 'Un atelier hôte typique: enseigner, pratiquer et partir avec des prochaines étapes nommées.',
    halfDayWhy: 'Assez de temps pour un langage commun et des engagements sans une journée complète.',
    fullDay: 'Journée complète (6 heures)',
    fullDayWhat: 'Facilitation prolongée avec plus de pratique, plusieurs boucles ou un travail de décision plus lourd.',
    fullDayWhy: 'À utiliser quand l’équipe a besoin de plus de répétition, de preuves ou d’arbitrage en une séance.',
    deliveryTitle: 'Comment hébergez-vous la séance?',
    inPerson: 'En personne',
    inPersonWhat: 'ROALLA facilite sur place à votre lieu.',
    inPersonWhy: 'Idéal pour tableaux, pratique en binômes et salles qui fonctionnent mieux en présentiel.',
    virtual: 'Virtuel',
    virtualWhat: 'Séance facilitée en ligne au même prix de séance qu’en personne.',
    virtualWhy: 'Sans déplacement. Utile pour les équipes distribuées ou déjà à distance.',
    participantsTitle: 'Combien de personnes?',
    band16: 'Jusqu’à 16 participants',
    band16What: 'Taille de groupe incluse pour une facilitation standard.',
    band16Why: 'Garde la discussion et la pratique gérables dans une salle ou un appel.',
    band30: '17–30 participants',
    band30What: `Ajoute un supplément de groupe de ${formatCad(WORKSHOP_ESTIMATE_PRICES.participantSurcharge, 'fr')}.`,
    band30Why: 'Les plus grands groupes demandent une structure plus serrée et plus de coordination du matériel.',
    bandOver: 'Plus de 30',
    bandOverWhat: 'Les plus grands groupes sont cotés au cadrage—aucun prix automatique ici.',
    bandOverWhy: 'Le format, l’effectif et le matériel changent au-delà de la taille typique.',
    travelTitle: 'Le lieu est-il hors de la zone de déplacement incluse?',
    travelLabel: 'Oui — au-delà de Mississauga (est), Hamilton (ouest) ou Milton (nord)',
    travelWhat:
      'Le déplacement inclus couvre approximativement Mississauga à l’est, Hamilton à l’ouest et Milton au nord. Au-delà, des frais s’appliquent.',
    travelWhy: 'Garde l’hébergement local prévisible. Hors zone, le déplacement est confirmé par écrit—pas inventé dans ce total.',
    travelSummary: 'Frais de déplacement — confirmés au cadrage',
    materials: 'Trousse de matériel pour participants',
    materialsWhat: 'Documents imprimables et numériques ou cartes pour la salle.',
    materialsWhy: 'Les gens repartent avec les mêmes outils, pas seulement le souvenir des diapositives.',
    bilingual: 'Facilitation bilingue (EN + FR)',
    bilingualWhat: 'Animation qui peut passer de l’anglais au français selon la salle.',
    bilingualWhy: 'Utile pour les équipes mixtes du Grand Toronto sans deux ateliers séparés.',
    followUp: 'Suivi d’une heure',
    followUpWhat: 'Un suivi d’une heure dans les ~30 jours pour revoir les engagements et débloquer la suite.',
    followUpWhy: 'Protège la valeur de l’atelier quand l’énergie baisse après la séance.',
    customAgenda: 'Conception d’ordre du jour sur mesure',
    customAgendaWhat: 'Préparation pour façonner la séance au-delà d’un plan catalogue.',
    customAgendaWhy: 'Idéal quand votre décision, public ou contraintes ne correspondent pas à un agenda standard.',
    recording: 'Enregistrement / récapitulatif partageable',
    recordingWhat: 'Enregistrement plus un court récap écrit des décisions et prochaines étapes.',
    recordingWhy: 'Aide les absents et les dirigeants qui ont besoin d’un dossier durable sans autre réunion.',
    codeTitle: 'Avez-vous un code de recommandation?',
    codePlaceholder: 'Entrer le code',
    apply: 'Appliquer',
    applying: 'Vérification…',
    remove: 'Retirer le code',
    codeApplied: 'Rabais communautaire appliqué: 30 % sur les frais de facilitation de la séance.',
    invalidCode: 'Ce code n’est pas valide. Vérifiez l’orthographe ou continuez au tarif standard.',
    codeError: 'Impossible de vérifier ce code pour le moment. Réessayez ou continuez sans.',
    summaryTitle: 'Votre estimation préliminaire',
    sessionFee: 'Facilitation de la séance',
    referralDiscount: 'Rabais de recommandation communautaire',
    materialsLine: 'Matériel participants',
    bilingualLine: 'Facilitation bilingue',
    followUpLine: 'Suivi',
    customAgendaLine: 'Ordre du jour sur mesure',
    recordingLine: 'Enregistrement / récap',
    participantLine: 'Groupe plus large (17–30)',
    largeGroupNote: 'Les groupes de plus de 30 sont cotés au cadrage.',
    seriesNote: 'Les séries multi-jours ou multi-semaines sont cotées séparément.',
    subtotal: 'Estimation avant taxe',
    taxSelectPrompt: 'Sélectionnez votre province ou État pour estimer la taxe.',
    regionRequiredCta: 'Sélectionnez votre province ou État pour continuer',
    taxDisclaimer:
      'ROALLA est constituée sous régime fédéral. Les forfaits sont en $ CA. Les lignes de taxe sont une estimation préliminaire selon le lieu choisi; la taxe finale est confirmée au cadrage.',
    total: 'Total projeté',
    disclaimer:
      'Estimation d’hôte préliminaire et non contraignante—pas de billetterie en ligne. ROALLA confirme sujet, agenda, taille du groupe, lieu ou virtuel, déplacement et prix final par écrit avant réservation.',
    cta: 'Demander une confirmation de portée',
    crossLinkPrograms: 'Voir les ateliers d’équipe',
  },
} as const

function WhatWhy({
  whatLabel,
  whyLabel,
  what,
  why,
}: {
  whatLabel: string
  whyLabel: string
  what: string
  why: string
}) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{whatLabel}</p>
        <p className="mt-1.5 text-sm leading-6 text-slate-800">{what}</p>
      </div>
      <div className="rounded-xl bg-primary/5 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary-dark">{whyLabel}</p>
        <p className="mt-1.5 text-sm leading-6 text-slate-800">{why}</p>
      </div>
    </div>
  )
}

export default function WorkshopEstimateBuilder() {
  const locale = useLocale()
  const french = locale === 'fr'
  const t = copy[french ? 'fr' : 'en']
  const topics = topicLabels[french ? 'fr' : 'en']
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
  } = useEstimateMarketRegion(french ? 'fr' : 'en', 'workshop')
  const { mode, toggleMode } = useEstimateWizardMode('workshop')

  const [topic, setTopic] = useState<WorkshopTopic>('focus-circle')
  const [duration, setDuration] = useState<WorkshopDuration>('half-day')
  const [delivery, setDelivery] = useState<WorkshopDelivery>('in-person')
  const [outsideTravelZone, setOutsideTravelZone] = useState(false)
  const [participantBand, setParticipantBand] = useState<WorkshopParticipantBand>('up-to-16')
  const [materials, setMaterials] = useState(false)
  const [bilingual, setBilingual] = useState(false)
  const [followUp, setFollowUp] = useState(false)
  const [customAgenda, setCustomAgenda] = useState(false)
  const [recording, setRecording] = useState(false)
  const [code, setCode] = useState('')
  const [appliedReferralCode, setAppliedReferralCode] = useState('')
  const [referralApplied, setReferralApplied] = useState(false)
  const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'invalid' | 'error'>('idle')

  React.useEffect(() => {
    const need = new URLSearchParams(window.location.search).get('need')
    if (workshopTopicValues.includes(need as WorkshopTopic)) {
      setTopic(need as WorkshopTopic)
    }
  }, [])

  const estimate = calculateWorkshopEstimate({
    duration,
    delivery,
    outsideTravelZone: delivery === 'in-person' && outsideTravelZone,
    materials,
    bilingual,
    followUp,
    customAgenda,
    recording,
    participantBand,
    referralDiscount: referralApplied,
    regionId: regionId || null,
  })

  const durationOptions: {
    value: WorkshopDuration
    label: string
    what: string
    why: string
  }[] = [
    { value: 'one-hour', label: t.oneHour, what: t.oneHourWhat, why: t.oneHourWhy },
    { value: 'half-day', label: t.halfDay, what: t.halfDayWhat, why: t.halfDayWhy },
    { value: 'full-day', label: t.fullDay, what: t.fullDayWhat, why: t.fullDayWhy },
  ]

  const addOns: {
    key: 'materials' | 'bilingual' | 'followUp' | 'customAgenda' | 'recording'
    checked: boolean
    setChecked: (v: boolean) => void
    label: string
    what: string
    why: string
    price: number
    icon: typeof NotebookPen
  }[] = [
    {
      key: 'materials',
      checked: materials,
      setChecked: setMaterials,
      label: t.materials,
      what: t.materialsWhat,
      why: t.materialsWhy,
      price: WORKSHOP_ESTIMATE_PRICES.materials,
      icon: NotebookPen,
    },
    {
      key: 'bilingual',
      checked: bilingual,
      setChecked: setBilingual,
      label: t.bilingual,
      what: t.bilingualWhat,
      why: t.bilingualWhy,
      price: WORKSHOP_ESTIMATE_PRICES.bilingual,
      icon: Languages,
    },
    {
      key: 'followUp',
      checked: followUp,
      setChecked: setFollowUp,
      label: t.followUp,
      what: t.followUpWhat,
      why: t.followUpWhy,
      price: WORKSHOP_ESTIMATE_PRICES.followUp,
      icon: Clock3,
    },
    {
      key: 'customAgenda',
      checked: customAgenda,
      setChecked: setCustomAgenda,
      label: t.customAgenda,
      what: t.customAgendaWhat,
      why: t.customAgendaWhy,
      price: WORKSHOP_ESTIMATE_PRICES.customAgenda,
      icon: NotebookPen,
    },
    {
      key: 'recording',
      checked: recording,
      setChecked: setRecording,
      label: t.recording,
      what: t.recordingWhat,
      why: t.recordingWhy,
      price: WORKSHOP_ESTIMATE_PRICES.recording,
      icon: Video,
    },
  ]

  const selectionLines = [
    topics[topic],
    `${durationOptions.find((d) => d.value === duration)?.label ?? duration} · ${WORKSHOP_DURATION_HOURS[duration]}h`,
    delivery === 'virtual' ? t.virtual : t.inPerson,
    participantBand === 'up-to-16' ? t.band16 : participantBand === '17-30' ? t.band30 : t.bandOver,
    materials ? t.materials : null,
    bilingual ? t.bilingual : null,
    followUp ? t.followUp : null,
    customAgenda ? t.customAgenda : null,
    recording ? t.recording : null,
    estimate.outsideTravelZone ? t.travelSummary : null,
    referralApplied
      ? appliedReferralCode
        ? `${t.referralDiscount} (${appliedReferralCode})`
        : t.referralDiscount
      : null,
  ].filter(Boolean) as string[]

  const estimateSummary = [...selectionLines, contextSummary || null].filter(Boolean).join(' · ')
  const estimateTotalLabel = money(estimate.total)
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

  const estimateGoal = `${french ? 'Estimation d’atelier' : 'Workshop estimate'}: ${estimateTotalLabel} ${taxInclusiveLabel}. ${estimateSummary}`

  const contactQuery = {
    intent: 'workshop',
    offer: 'estimate',
    need: topic,
    from_page: '/workshop-estimate',
    goal: estimateGoal,
    estimate_total: estimateTotalLabel,
    estimate_summary: estimateSummary,
    estimate_tool: 'workshop',
    estimate_pricing_version: ESTIMATE_PRICING_VERSION,
    ...(regionId ? { estimate_region: regionId } : {}),
    ...(marketId ? { estimate_market: marketId } : {}),
    ...attributionQuery,
    ...(appliedReferralCode ? { estimate_referral_code: appliedReferralCode } : {}),
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

  const marketStep = (
    <EstimateMarketContextFields
      locale={french ? 'fr' : 'en'}
      marketId={marketId}
      regionId={regionId}
      onMarketChange={setMarketId}
      onRegionChange={setRegionId}
    />
  )

  const topicStep = (
    <fieldset>
      <legend className="text-xl font-serif font-bold text-slate-950">{t.topicTitle}</legend>
      <p className="mt-2 text-sm leading-6 text-slate-700">{t.topicIntro}</p>
      <div className="mt-4">
        <label className="sr-only" htmlFor="workshop-topic">
          {t.topicTitle}
        </label>
        <select
          id="workshop-topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value as WorkshopTopic)}
          className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {workshopTopicValues.map((value) => (
            <option key={value} value={value}>
              {topics[value]}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  )

  const durationStep = (
    <fieldset>
      <legend className="text-xl font-serif font-bold text-slate-950">{t.durationTitle}</legend>
      <div className="mt-4 space-y-3">
        {durationOptions.map((option) => {
          const selected = duration === option.value
          return (
            <label
              key={option.value}
              className={`block cursor-pointer rounded-2xl border p-5 ${selected ? tileSelected : tileIdle}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <input
                    type="radio"
                    name="workshop-duration"
                    className="mt-1.5"
                    checked={selected}
                    onChange={() => setDuration(option.value)}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-lg font-bold text-slate-950">{option.label}</span>
                      {selected ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800">
                          {t.selected}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <p className="shrink-0 pt-1 font-bold tabular-nums text-primary-dark">
                  {money(WORKSHOP_DURATION_PRICES[option.value])}
                </p>
              </div>
              <WhatWhy whatLabel={t.whatItIs} whyLabel={t.whyItMatters} what={option.what} why={option.why} />
            </label>
          )
        })}
      </div>
    </fieldset>
  )

  const deliveryStep = (
    <fieldset>
      <legend className="text-xl font-serif font-bold text-slate-950">{t.deliveryTitle}</legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(
          [
            { value: 'in-person' as const, label: t.inPerson, what: t.inPersonWhat, why: t.inPersonWhy, icon: MapPin },
            { value: 'virtual' as const, label: t.virtual, what: t.virtualWhat, why: t.virtualWhy, icon: Monitor },
          ] as const
        ).map((option) => {
          const selected = delivery === option.value
          const Icon = option.icon
          return (
            <label
              key={option.value}
              className={`block cursor-pointer rounded-2xl border p-5 ${selected ? tileSelected : tileIdle}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="workshop-delivery"
                  className="mt-1.5"
                  checked={selected}
                  onChange={() => {
                    setDelivery(option.value)
                    if (option.value === 'virtual') setOutsideTravelZone(false)
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary-dark" aria-hidden />
                    <span className="font-serif text-lg font-bold text-slate-950">{option.label}</span>
                  </div>
                  <WhatWhy whatLabel={t.whatItIs} whyLabel={t.whyItMatters} what={option.what} why={option.why} />
                </div>
              </div>
            </label>
          )
        })}
      </div>
    </fieldset>
  )

  const participantsStep = (
    <fieldset>
      <legend className="text-xl font-serif font-bold text-slate-950">{t.participantsTitle}</legend>
      <div className="mt-4 space-y-3">
        {(
          [
            { value: 'up-to-16' as const, label: t.band16, what: t.band16What, why: t.band16Why, price: 0 },
            {
              value: '17-30' as const,
              label: t.band30,
              what: t.band30What,
              why: t.band30Why,
              price: WORKSHOP_ESTIMATE_PRICES.participantSurcharge,
            },
            { value: 'over-30' as const, label: t.bandOver, what: t.bandOverWhat, why: t.bandOverWhy, price: null },
          ] as const
        ).map((option) => {
          const selected = participantBand === option.value
          return (
            <label
              key={option.value}
              className={`block cursor-pointer rounded-2xl border p-5 ${selected ? tileSelected : tileIdle}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <input
                    type="radio"
                    name="workshop-participants"
                    className="mt-1.5"
                    checked={selected}
                    onChange={() => setParticipantBand(option.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary-dark" aria-hidden />
                    <span className="font-serif text-lg font-bold text-slate-950">{option.label}</span>
                  </div>
                </div>
                <p className="shrink-0 pt-1 text-sm font-bold tabular-nums text-primary-dark">
                  {option.price === null ? '—' : option.price === 0 ? money(0) : `+${money(option.price)}`}
                </p>
              </div>
              <WhatWhy whatLabel={t.whatItIs} whyLabel={t.whyItMatters} what={option.what} why={option.why} />
            </label>
          )
        })}
      </div>
    </fieldset>
  )

  const travelStep = (
    <fieldset>
      <legend className="text-xl font-serif font-bold text-slate-950">{t.travelTitle}</legend>
      <label className={`mt-4 block cursor-pointer rounded-2xl border p-5 ${outsideTravelZone ? tileSelected : tileIdle}`}>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1.5"
            checked={outsideTravelZone}
            onChange={(event) => setOutsideTravelZone(event.target.checked)}
          />
          <div>
            <span className="font-serif text-lg font-bold text-slate-950">{t.travelLabel}</span>
            <WhatWhy whatLabel={t.whatItIs} whyLabel={t.whyItMatters} what={t.travelWhat} why={t.travelWhy} />
            <p className="mt-3 flex gap-2 rounded-lg bg-white p-3 text-xs leading-5 text-slate-700">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {t.travelSummary}
            </p>
          </div>
        </div>
      </label>
    </fieldset>
  )

  const addOnsStep = (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold uppercase tracking-[.16em] text-slate-950">{t.optionalSection}</h2>
        <div className="h-px flex-1 bg-slate-200" aria-hidden />
      </div>
      <p className="text-sm leading-6 text-slate-700">{t.optionalSectionIntro}</p>
      <div className="space-y-3">
        {addOns.map((addon) => {
          const Icon = addon.icon
          return (
            <label
              key={addon.key}
              className={`block cursor-pointer rounded-2xl border p-5 ${addon.checked ? tileSelected : tileIdle}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1.5"
                    checked={addon.checked}
                    onChange={(event) => addon.setChecked(event.target.checked)}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Icon className="h-4 w-4 text-primary-dark" aria-hidden />
                      <span className="font-serif text-lg font-bold text-slate-950">{addon.label}</span>
                    </div>
                  </div>
                </div>
                <p className="shrink-0 pt-1 font-bold tabular-nums text-primary-dark">+{money(addon.price)}</p>
              </div>
              <WhatWhy whatLabel={t.whatItIs} whyLabel={t.whyItMatters} what={addon.what} why={addon.why} />
            </label>
          )
        })}
      </div>
    </div>
  )

  const referralStep = (
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
            <label className="sr-only" htmlFor="workshop-referral-code">
              {t.codePlaceholder}
            </label>
            <input
              id="workshop-referral-code"
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
  )

  const wizardSteps = [
    { id: 'market', title: french ? 'Marché et région' : 'Market and region', content: marketStep },
    { id: 'topic', title: t.topicTitle, content: topicStep },
    { id: 'duration', title: t.durationTitle, content: durationStep },
    { id: 'delivery', title: t.deliveryTitle, content: deliveryStep },
    { id: 'participants', title: t.participantsTitle, content: participantsStep },
    ...(delivery === 'in-person' ? [{ id: 'travel', title: t.travelTitle, content: travelStep }] : []),
    { id: 'addons', title: t.optionalSection, content: addOnsStep },
    { id: 'referral', title: t.codeTitle, content: referralStep },
  ]

  return (
    <EstimateShell
      eyebrow={t.eyebrow}
      title={t.title}
      intro={t.intro}
      jumpToEstimate={t.jumpToEstimate}
      mobileSummaryLabel={t.mobileSummaryLabel}
      mobileTotalLabel={estimateTotalLabel}
      mobileCta={mobileContactCta}
      modeToggle={<EstimateModeToggle locale={french ? 'fr' : 'en'} mode={mode} onToggle={toggleMode} />}
      form={
        mode === 'wizard' ? (
          <EstimateWizard locale={french ? 'fr' : 'en'} steps={wizardSteps} resetKey={delivery} />
        ) : (
          <>
            {marketStep}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold uppercase tracking-[.16em] text-slate-950">{t.requiredSection}</h2>
                <div className="h-px flex-1 bg-slate-200" aria-hidden />
              </div>
              {topicStep}
              {durationStep}
              {deliveryStep}
              {participantsStep}
              {delivery === 'in-person' ? travelStep : null}
              {addOnsStep}
            </div>
            {referralStep}
          </>
        )
      }
      summary={
        <>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="text-xl font-serif font-bold text-slate-950">{t.summaryTitle}</h2>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-700">
                {t.sessionFee} · {WORKSHOP_DURATION_HOURS[duration]}h
              </dt>
              <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.session)}</dd>
            </div>
            {estimate.referralDiscount > 0 ? (
              <div className="flex justify-between gap-4 text-emerald-700">
                <dt>{t.referralDiscount}</dt>
                <dd className="font-semibold tabular-nums">–{money(estimate.referralDiscount)}</dd>
              </div>
            ) : null}
            {estimate.materials > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-700">{t.materialsLine}</dt>
                <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.materials)}</dd>
              </div>
            ) : null}
            {estimate.bilingual > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-700">{t.bilingualLine}</dt>
                <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.bilingual)}</dd>
              </div>
            ) : null}
            {estimate.followUp > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-700">{t.followUpLine}</dt>
                <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.followUp)}</dd>
              </div>
            ) : null}
            {estimate.customAgenda > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-700">{t.customAgendaLine}</dt>
                <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.customAgenda)}</dd>
              </div>
            ) : null}
            {estimate.recording > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-700">{t.recordingLine}</dt>
                <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.recording)}</dd>
              </div>
            ) : null}
            {estimate.participantSurcharge > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-700">{t.participantLine}</dt>
                <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.participantSurcharge)}</dd>
              </div>
            ) : null}
            {estimate.outsideTravelZone ? (
              <div className="flex gap-2 rounded-lg bg-white p-3 text-xs leading-5 text-slate-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                {t.travelSummary}
              </div>
            ) : null}
            {estimate.largeGroupNeedsQuote ? (
              <div className="flex gap-2 rounded-lg bg-white p-3 text-xs leading-5 text-slate-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                {t.largeGroupNote}
              </div>
            ) : null}
          </dl>
          <div className="mt-6 space-y-3 border-t border-slate-300 pt-5">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-700">{t.subtotal}</span>
              <span className="font-semibold tabular-nums text-slate-900">{money(estimate.beforeTax)}</span>
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
          <p className="mt-4 flex gap-2 text-xs leading-5 text-slate-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            {t.seriesNote}
          </p>
          <EstimateCommercialNotes
            locale={french ? 'fr' : 'en'}
            disclaimer={t.disclaimer}
            taxDisclaimer={t.taxDisclaimer}
          />
          {contactCta}
          <div className="mt-5 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-700">
            <p className="flex gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <Link href="/programs/workshops" className="font-semibold text-primary-dark underline-offset-4 hover:underline">
                {t.crossLinkPrograms}
              </Link>
            </p>
          </div>
        </>
      }
    />
  )
}
