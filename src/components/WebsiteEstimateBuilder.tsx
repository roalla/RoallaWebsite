'use client'

import React, { useMemo, useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp, Globe2, Info, Mail, PenLine, SearchCheck, Server, Share2, Sparkles, Tag } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import EmailSafeText from '@/components/EmailSafeText'
import {
  calculateWebsiteEstimate,
  DOMAIN_PRICES,
  WEBSITE_ESTIMATE_CORE_PRICE,
  WEBSITE_ESTIMATE_PRICES,
  type DomainSource,
  type DomainTerm,
  type HostingChoice,
  type SocialSetup,
} from '@/lib/website-estimate'

/** Keep server/client currency text identical (ICU may emit NBSP / narrow NBSP). */
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
    eyebrow: 'Website package estimator',
    title: 'Build a clear first-year website estimate.',
    intro:
      'Start with the required launch foundation and website address. Optional add-ons stay separate—open them only if you want email, social media profiles, or hosting support.',
    outcomeClarity: 'Explain your value clearly',
    outcomeDiscovery: 'Help customers find you',
    outcomeAction: 'Make the next step easy',
    referralNote: 'Have a referral code? Enter it at the bottom of this form to apply the community discount.',
    referralNoteLink: 'Go to referral code',
    requiredSection: 'Required',
    optionalSection: 'Optional add-ons',
    optionalSectionIntro: 'These are not required to request a scope confirmation.',
    coreTitle: 'Core Website Launch',
    required: 'Required',
    included: 'Included',
    whatItIs: 'What it is',
    whyItMatters: 'Why it matters',
    website: 'Website creation',
    websiteWhat: 'Design and development of a professional, mobile-friendly website.',
    websiteWhy: 'Creates a credible home for the business and a clear path to contact or book.',
    copyBooking: 'Copywriting and booking integration',
    copyBookingWhat: 'Client-friendly service messaging connected to the selected booking path.',
    copyBookingWhy: 'Helps visitors understand the offer and move from interest to an inquiry with less friction.',
    visibility: 'Help search and AI find and describe your business',
    visibilityWhat: 'Clear public signals so search tools and AI assistants can understand what you offer.',
    visibilityWhy:
      'Helps the right customers discover and understand the business when configured properly (SEO, AEO, agentic AI). Rankings are not guaranteed.',
    domainTitle: 'Website address',
    domainIntro:
      'Do you already have a website address (domain), or do you need ROALLA to register one for you?',
    domainExisting: 'I already have a website address',
    domainExistingValue:
      'No registration cost in this estimate. You will provide access during development so the site can go live on your address.',
    domainNew: 'I need a new website address',
    domainNewValue: 'Choose a registration term. The address will be owned by you.',
    domainTermTitle: 'Choose how long to register it',
    oneYear: '1 year',
    twoYears: '2 years',
    threeYears: '3 years',
    bestValue: 'Best value',
    selected: 'Selected',
    emailTitle: 'Professional email',
    emailPopular: 'Most clients add this',
    emailLabel: 'Add professional email setup and Microsoft 365 Business Basic',
    emailValue: 'Your email matches the website address—for example, name@yourbusiness.ca.',
    emailCost: '$150 setup + $114/year',
    extrasTitle: 'Additional options',
    extrasLabel: 'I want social media profiles or hosting options',
    extrasValue:
      'Open this only if you want social media profile setup or ROALLA hosting and care. Otherwise leave it unchecked.',
    socialTitle: 'Social media profile setup',
    socialValue:
      'Professional profile configuration with consistent names, bios, images, links, contact details and security settings.',
    noSocial: 'No social media setup',
    instagram: 'Instagram',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    bundle: 'Instagram + YouTube + LinkedIn',
    bundleSavings: 'Bundle savings',
    hostingTitle: 'Choose your hosting path',
    hostingIntro:
      'Choose how much of the technical upkeep you want to manage yourself. Your website and website address remain yours with every option.',
    hostingDetailHint: 'Tap More detail on any option if you want the full explanation.',
    hostingMoreDetail: 'More detail',
    hostingHideDetail: 'Hide detail',
    ownHosting: 'My own hosting provider',
    ownHostingValue: 'Use a compatible provider you already trust; ROALLA will configure the website there.',
    ownHostingBestFor: 'Best when you already manage hosting',
    ownHostingDetail: 'You choose and pay the provider directly, and you remain responsible for its account, billing, renewals and support. ROALLA confirms compatibility and configures the completed website on that platform. Provider fees are separate.',
    launchHosting: 'ROALLA Launch Hosting',
    launchHostingValue: 'A simple, professionally managed home for your new website without another platform to configure.',
    launchHostingBestFor: 'Simple, low-maintenance launch',
    launchHostingDetail: 'Includes the hosting environment, launch configuration and secure website connection needed to put the site online. It is designed for clients who want reliable hosting but do not need ongoing content changes or a monthly care plan.',
    careLite: 'Care Lite',
    careLiteValue: 'Hosting plus ongoing technical care for a site that needs occasional help after launch.',
    careLiteBestFor: 'Best balance for most small businesses',
    careLiteDetail: 'Adds an ongoing support path for routine website maintenance and minor requests, so you are not left to solve technical issues alone. Final response times, request limits and included work are confirmed in your written scope.',
    care: 'ROALLA Care',
    careValue: 'More hands-on website care for a business that expects regular updates and continued improvement.',
    careBestFor: 'For active, evolving websites',
    careDetail: 'Adds a higher level of ongoing support for website updates, health checks and improvement needs. It is the strongest fit when the site will change regularly. Final service levels, request limits and included work are confirmed in your written scope.',
    recommended: 'Popular choice',
    perYear: '/year',
    perMonth: '/month',
    codeTitle: 'Have a referral code?',
    codePlaceholder: 'Enter referral code',
    apply: 'Apply code',
    applying: 'Checking…',
    codeApplied: 'Community referral discount applied: 30% off core professional services.',
    invalidCode: 'That referral code is not valid. Check the spelling or continue at standard pricing.',
    codeError: 'We could not check the code. Please try again.',
    remove: 'Remove discount',
    summaryTitle: 'Your preliminary estimate',
    coreServices: 'Core professional services',
    referralDiscount: 'Community referral discount',
    domain: 'Website address registration',
    emailSetup: 'Professional email setup',
    emailAnnual: 'Microsoft 365 Business Basic — first year',
    socialSetup: 'Social media profile setup',
    domainTermOne: '1-year website address',
    domainTermTwo: '2-year website address',
    domainTermThree: '3-year website address',
    domainExistingSummary: 'Existing website address (no registration cost)',
    hostingFirstYear: 'Hosting and care — projected first year',
    ownHostingNote: 'Client-selected hosting provider fees are not included.',
    subtotal: 'First-year estimate before HST',
    hst: 'HST (13%)',
    total: 'Projected first-year total',
    mobileSummaryLabel: 'Estimated first-year total',
    disclaimer:
      'This is a preliminary, non-binding estimate based on your selections. ROALLA confirms scope, compatibility, timing and final pricing in writing before work begins.',
    cta: 'Request scope confirmation',
    crossLinkVisibility: 'Already have a site? Estimate search and AI visibility improvements',
    crossLinkEmail: 'Emails not reaching clients? Estimate email reach and setup',
  },
  fr: {
    eyebrow: 'Estimateur de forfait Web',
    title: 'Préparez une estimation claire pour la première année.',
    intro:
      'Commencez par la base de lancement et l’adresse du site. Les options restent séparées—ouvrez-les seulement si vous voulez le courriel, les profils de médias sociaux ou l’hébergement.',
    outcomeClarity: 'Expliquer clairement votre valeur',
    outcomeDiscovery: 'Aider les clients à vous trouver',
    outcomeAction: 'Faciliter la prochaine étape',
    referralNote: 'Vous avez un code de recommandation? Entrez-le au bas de ce formulaire pour appliquer le rabais communautaire.',
    referralNoteLink: 'Aller au code de recommandation',
    requiredSection: 'Requis',
    optionalSection: 'Options facultatives',
    optionalSectionIntro: 'Ces éléments ne sont pas requis pour demander une confirmation de portée.',
    coreTitle: 'Lancement Web de base',
    required: 'Requis',
    included: 'Inclus',
    whatItIs: 'De quoi il s’agit',
    whyItMatters: 'Pourquoi c’est important',
    website: 'Création du site Web',
    websiteWhat: 'Conception et développement d’un site professionnel adapté aux appareils mobiles.',
    websiteWhy: 'Crée une présence crédible et un parcours clair pour communiquer ou réserver.',
    copyBooking: 'Rédaction et intégration de la réservation',
    copyBookingWhat: 'Des messages clairs sur les services, reliés au parcours de réservation choisi.',
    copyBookingWhy: 'Aide les visiteurs à comprendre l’offre et à passer plus facilement de l’intérêt à une demande.',
    visibility: 'Aider la recherche et l’IA à trouver et décrire votre entreprise',
    visibilityWhat: 'Des signaux publics clairs pour que les outils de recherche et les assistants IA comprennent votre offre.',
    visibilityWhy:
      'Aide les bons clients à découvrir et comprendre l’entreprise lorsque la configuration est adéquate (SEO, AEO, IA agentique). Aucun classement n’est garanti.',
    domainTitle: 'Adresse du site',
    domainIntro:
      'Avez-vous déjà une adresse de site (domaine), ou ROALLA doit-elle en enregistrer une pour vous?',
    domainExisting: 'J’ai déjà une adresse de site',
    domainExistingValue:
      'Aucun coût d’enregistrement dans cette estimation. Vous fournirez l’accès pendant le développement pour mettre le site en ligne sur votre adresse.',
    domainNew: 'J’ai besoin d’une nouvelle adresse de site',
    domainNewValue: 'Choisissez une durée d’enregistrement. L’adresse vous appartiendra.',
    domainTermTitle: 'Choisissez la durée d’enregistrement',
    oneYear: '1 an',
    twoYears: '2 ans',
    threeYears: '3 ans',
    bestValue: 'Meilleure valeur',
    selected: 'Sélectionné',
    emailTitle: 'Courriel professionnel',
    emailPopular: 'La plupart des clients ajoutent ceci',
    emailLabel: 'Ajouter la configuration du courriel professionnel et Microsoft 365 Business Basic',
    emailValue: 'Votre courriel correspond à l’adresse du site, par exemple nom@votreentreprise.ca.',
    emailCost: '150 $ de configuration + 114 $/an',
    extrasTitle: 'Options supplémentaires',
    extrasLabel: 'Je veux des profils de médias sociaux ou des options d’hébergement',
    extrasValue:
      'Ouvrez ceci seulement si vous voulez la configuration des profils de médias sociaux ou l’hébergement et l’entretien ROALLA. Sinon, laissez décoché.',
    socialTitle: 'Configuration des profils de médias sociaux',
    socialValue:
      'Configuration professionnelle et cohérente des noms, biographies, images, liens, coordonnées et paramètres de sécurité.',
    noSocial: 'Aucune configuration de médias sociaux',
    instagram: 'Instagram',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    bundle: 'Instagram + YouTube + LinkedIn',
    bundleSavings: 'Économie groupée',
    hostingTitle: 'Choisissez votre hébergement',
    hostingIntro:
      'Choisissez la part de l’entretien technique que vous souhaitez gérer. Votre site et son adresse restent à vous avec chaque option.',
    hostingDetailHint: 'Touchez Plus de détails sur une option pour voir l’explication complète.',
    hostingMoreDetail: 'Plus de détails',
    hostingHideDetail: 'Masquer les détails',
    ownHosting: 'Mon propre fournisseur',
    ownHostingValue: 'Utilisez un fournisseur compatible que vous connaissez déjà; ROALLA y configurera le site.',
    ownHostingBestFor: 'Idéal si vous gérez déjà l’hébergement',
    ownHostingDetail: 'Vous choisissez et payez directement le fournisseur, et vous gérez son compte, la facturation, les renouvellements et le soutien. ROALLA confirme la compatibilité et configure le site terminé sur cette plateforme. Les frais du fournisseur sont séparés.',
    launchHosting: 'Hébergement Lancement ROALLA',
    launchHostingValue: 'Un domicile simple et géré professionnellement pour votre nouveau site, sans autre plateforme à configurer.',
    launchHostingBestFor: 'Lancement simple et peu exigeant',
    launchHostingDetail: 'Comprend l’environnement d’hébergement, la configuration de lancement et la connexion sécurisée nécessaires pour mettre le site en ligne. Cette option convient aux clients qui veulent un hébergement fiable sans modifications continues ni forfait mensuel d’entretien.',
    careLite: 'Soins légers',
    careLiteValue: 'L’hébergement avec un entretien technique continu pour un site qui a parfois besoin d’aide après le lancement.',
    careLiteBestFor: 'Le meilleur équilibre pour la plupart des PME',
    careLiteDetail: 'Ajoute un parcours de soutien continu pour l’entretien courant et les petites demandes, afin que vous ne soyez pas seul devant les problèmes techniques. Les délais, limites de demandes et travaux inclus seront confirmés dans la portée écrite.',
    care: 'Soins ROALLA',
    careValue: 'Un entretien plus actif pour une entreprise qui prévoit des mises à jour régulières et une amélioration continue.',
    careBestFor: 'Pour les sites actifs et évolutifs',
    careDetail: 'Ajoute un niveau supérieur de soutien continu pour les mises à jour, les vérifications de santé et les besoins d’amélioration du site. C’est le meilleur choix lorsque le site changera régulièrement. Les niveaux de service, limites de demandes et travaux inclus seront confirmés dans la portée écrite.',
    recommended: 'Choix populaire',
    perYear: '/an',
    perMonth: '/mois',
    codeTitle: 'Avez-vous un code de recommandation?',
    codePlaceholder: 'Entrez le code',
    apply: 'Appliquer',
    applying: 'Vérification…',
    codeApplied: 'Rabais communautaire appliqué : 30 % sur les services professionnels de base.',
    invalidCode: 'Ce code n’est pas valide. Vérifiez-le ou continuez au tarif standard.',
    codeError: 'Impossible de vérifier le code. Veuillez réessayer.',
    remove: 'Retirer le rabais',
    summaryTitle: 'Votre estimation préliminaire',
    coreServices: 'Services professionnels de base',
    referralDiscount: 'Rabais de recommandation communautaire',
    domain: 'Enregistrement de l’adresse du site',
    emailSetup: 'Configuration du courriel professionnel',
    emailAnnual: 'Microsoft 365 Business Basic — première année',
    socialSetup: 'Configuration des profils de médias sociaux',
    domainTermOne: 'Adresse de site — 1 an',
    domainTermTwo: 'Adresse de site — 2 ans',
    domainTermThree: 'Adresse de site — 3 ans',
    domainExistingSummary: 'Adresse de site existante (aucun coût d’enregistrement)',
    hostingFirstYear: 'Hébergement et entretien — première année projetée',
    ownHostingNote: 'Les frais de votre propre fournisseur d’hébergement ne sont pas inclus.',
    subtotal: 'Estimation de la première année avant TVH',
    hst: 'TVH (13 %)',
    total: 'Total projeté de la première année',
    mobileSummaryLabel: 'Total estimé de la première année',
    disclaimer:
      'Cette estimation préliminaire est non contraignante. ROALLA confirmera la portée, la compatibilité, l’échéancier et le prix final par écrit avant le début des travaux.',
    cta: 'Demander la confirmation de la portée',
    crossLinkVisibility: 'Vous avez déjà un site? Estimez les améliorations de visibilité recherche et IA',
    crossLinkEmail: 'Les courriels n’atteignent pas les clients? Estimez la portée et la configuration',
  },
} as const

const socialOptions: Array<{ value: SocialSetup; label: keyof typeof copy.en }> = [
  { value: 'none', label: 'noSocial' },
  { value: 'instagram', label: 'instagram' },
  { value: 'youtube', label: 'youtube' },
  { value: 'linkedin', label: 'linkedin' },
  { value: 'bundle', label: 'bundle' },
]

const hostingOptions: Array<{
  value: HostingChoice
  label: keyof typeof copy.en
  description: keyof typeof copy.en
  bestFor: keyof typeof copy.en
  detail: keyof typeof copy.en
  price: string
  recommended?: boolean
}> = [
  { value: 'own', label: 'ownHosting', description: 'ownHostingValue', bestFor: 'ownHostingBestFor', detail: 'ownHostingDetail', price: '$0' },
  { value: 'launch', label: 'launchHosting', description: 'launchHostingValue', bestFor: 'launchHostingBestFor', detail: 'launchHostingDetail', price: `$${WEBSITE_ESTIMATE_PRICES.launchHostingAnnual}/year` },
  { value: 'care-lite', label: 'careLite', description: 'careLiteValue', bestFor: 'careLiteBestFor', detail: 'careLiteDetail', price: `$${WEBSITE_ESTIMATE_PRICES.careLiteMonthly}/month`, recommended: true },
  { value: 'care', label: 'care', description: 'careValue', bestFor: 'careBestFor', detail: 'careDetail', price: `$${WEBSITE_ESTIMATE_PRICES.careMonthly}/month` },
]

const tileSelected =
  'border-primary bg-primary/25 ring-2 ring-primary/40 shadow-md shadow-primary/15'
const tileIdle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'

export default function WebsiteEstimateBuilder() {
  const locale = useLocale()
  const french = locale === 'fr'
  const t = copy[french ? 'fr' : 'en']
  const money = useMemo(() => (amount: number) => formatCad(amount, french ? 'fr' : 'en'), [french])
  const [domainSource, setDomainSource] = useState<DomainSource>('new')
  const [domainTerm, setDomainTerm] = useState<DomainTerm>('three')
  const [email, setEmail] = useState(false)
  const [showExtras, setShowExtras] = useState(false)
  const [social, setSocial] = useState<SocialSetup>('none')
  const [hosting, setHosting] = useState<HostingChoice>('own')
  const [expandedHosting, setExpandedHosting] = useState<HostingChoice | null>(null)
  const [code, setCode] = useState('')
  const [appliedReferralCode, setAppliedReferralCode] = useState('')
  const [referralApplied, setReferralApplied] = useState(false)
  const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'invalid' | 'error'>('idle')

  const activeSocial = showExtras ? social : 'none'
  const activeHosting = showExtras ? hosting : 'own'
  const estimate = calculateWebsiteEstimate({
    domainSource,
    domainTerm,
    email,
    social: activeSocial,
    hosting: activeHosting,
    referralDiscount: referralApplied,
  })

  const toggleExtras = (checked: boolean) => {
    setShowExtras(checked)
    if (checked) {
      setHosting('care-lite')
      setExpandedHosting(null)
    } else {
      setSocial('none')
      setHosting('own')
      setExpandedHosting(null)
    }
  }

  const socialSummaryLabel =
    activeSocial === 'none'
      ? null
      : activeSocial === 'bundle'
        ? t.bundle
        : t[activeSocial]
  const hostingSummaryLabel =
    activeHosting === 'own'
      ? null
      : activeHosting === 'launch'
        ? t.launchHosting
        : activeHosting === 'care-lite'
          ? t.careLite
          : t.care
  const domainSummaryLabel =
    domainSource === 'existing'
      ? t.domainExistingSummary
      : domainTerm === 'one'
        ? t.domainTermOne
        : domainTerm === 'two'
          ? t.domainTermTwo
          : t.domainTermThree

  const referralSummaryLabel =
    referralApplied && appliedReferralCode
      ? `${t.referralDiscount} (${appliedReferralCode})`
      : referralApplied
        ? t.referralDiscount
        : null

  const selectionLines = [
    t.coreServices,
    domainSummaryLabel,
    email ? t.emailSetup : null,
    socialSummaryLabel,
    hostingSummaryLabel ?? t.ownHosting,
    referralSummaryLabel,
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

  const estimateGoal = `${french ? 'Estimation Web' : 'Website estimate'}: ${estimateTotalLabel} ${french ? 'TVH incluse' : 'including HST'}. ${estimateSummary}`

  const contactQuery = {
    intent: 'website',
    offer: 'estimate',
    from_page: '/website-estimate',
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
        <p className="mt-4 inline-flex max-w-3xl items-start gap-2 rounded-xl border border-amber-300/40 bg-amber-400/15 px-3.5 py-2.5 text-sm leading-6 text-white">
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
          <span>
            {t.referralNote}{' '}
            <a href="#referral-code-section" className="font-semibold text-amber-200 underline underline-offset-4 hover:text-amber-100">
              {t.referralNoteLink}
            </a>
          </span>
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {[t.outcomeClarity, t.outcomeDiscovery, t.outcomeAction].map((outcome) => (
            <span key={outcome} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
              <CheckCircle className="h-3.5 w-3.5 text-primary-light" aria-hidden />
              {outcome}
            </span>
          ))}
        </div>
      </header>

      <div className="grid lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-8 p-6 sm:p-8 lg:p-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[.16em] text-slate-950">{t.requiredSection}</h2>
              <div className="h-px flex-1 bg-slate-200" aria-hidden />
            </div>

            <fieldset>
              <legend className="flex w-full items-center justify-between gap-3 text-xl font-serif font-bold text-slate-950">
                {t.coreTitle}
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-dark">{t.required}</span>
              </legend>
              <div className="mt-4 space-y-3">
                {[
                  { label: t.website, what: t.websiteWhat, why: t.websiteWhy, price: WEBSITE_ESTIMATE_PRICES.website, icon: Globe2 },
                  { label: t.copyBooking, what: t.copyBookingWhat, why: t.copyBookingWhy, price: WEBSITE_ESTIMATE_PRICES.copyAndBooking, icon: PenLine },
                  { label: t.visibility, what: t.visibilityWhat, why: t.visibilityWhy, price: WEBSITE_ESTIMATE_PRICES.visibility, icon: SearchCheck },
                ].map(({ label, what, why, price, icon: Icon }) => (
                  <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif text-lg font-bold text-slate-950">{label}</h3>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800">{t.included}</span>
                          </div>
                        </div>
                      </div>
                      <p className="shrink-0 pt-2 font-bold tabular-nums text-primary-dark">{money(price)}</p>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{t.whatItIs}</p>
                        <p className="mt-1.5 text-sm leading-6 text-slate-800">{what}</p>
                      </div>
                      <div className="rounded-xl bg-primary/5 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-primary-dark">{t.whyItMatters}</p>
                        <p className="mt-1.5 text-sm leading-6 text-slate-800">{why}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="flex w-full items-center justify-between gap-3 text-xl font-serif font-bold text-slate-950">
                {t.domainTitle}
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-dark">{t.required}</span>
              </legend>
              <p className="mt-1 text-sm text-slate-700">{t.domainIntro}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {([
                  ['existing', t.domainExisting, t.domainExistingValue],
                  ['new', t.domainNew, t.domainNewValue],
                ] as Array<[DomainSource, string, string]>).map(([value, label, detail]) => (
                  <label key={value} className={`relative cursor-pointer rounded-xl border p-4 transition ${domainSource === value ? tileSelected : tileIdle}`}>
                    <input
                      className="sr-only"
                      type="radio"
                      name="domain-source"
                      value={value}
                      checked={domainSource === value}
                      onChange={() => setDomainSource(value)}
                    />
                    <span className="flex items-start justify-between gap-2">
                      <span className="block font-semibold text-slate-900">{label}</span>
                      {domainSource === value ? <CheckCircle className="h-5 w-5 shrink-0 text-primary-dark" aria-hidden /> : null}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-slate-700">{detail}</span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {domainSource === value ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                      {value === 'existing' ? (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                          {money(0)}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>

              {domainSource === 'new' ? (
                <div className="mt-5">
                  <h3 className="font-serif text-lg font-bold text-slate-950">{t.domainTermTitle}</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {([
                      ['one', t.oneYear],
                      ['two', t.twoYears],
                      ['three', t.threeYears],
                    ] as Array<[DomainTerm, string]>).map(([value, label]) => (
                      <label key={value} className={`relative cursor-pointer rounded-xl border p-4 transition ${domainTerm === value ? tileSelected : tileIdle}`}>
                        <input className="sr-only" type="radio" name="domain-term" value={value} checked={domainTerm === value} onChange={() => setDomainTerm(value)} />
                        <span className="flex items-start justify-between gap-2">
                          <span className="block font-semibold text-slate-900">{label}</span>
                          {domainTerm === value ? <CheckCircle className="h-5 w-5 shrink-0 text-primary-dark" aria-hidden /> : null}
                        </span>
                        <span className="mt-1 block text-lg font-bold text-primary-dark">{money(DOMAIN_PRICES[value])}</span>
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {domainTerm === value ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                          {value === 'three' ? <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{t.bestValue}</span> : null}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
            </fieldset>
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
                {t.emailTitle}
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">{t.emailPopular}</span>
              </legend>
              <label className={`mt-4 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${email ? tileSelected : tileIdle}`}>
                <input className="mt-1 h-4 w-4 accent-primary" type="checkbox" checked={email} onChange={(event) => setEmail(event.target.checked)} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="block font-semibold text-slate-900">{t.emailLabel}</span>
                    {email ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-slate-700"><EmailSafeText text={t.emailValue} /></span>
                  <span className="mt-2 block text-sm font-bold text-primary-dark">{t.emailCost}</span>
                </span>
              </label>
            </fieldset>

            <fieldset>
              <legend className="flex items-center gap-2 text-xl font-serif font-bold text-slate-950"><Share2 className="h-5 w-5 text-primary" aria-hidden />{t.extrasTitle}</legend>
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
                    {showExtras ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-slate-700">{t.extrasValue}</span>
                </span>
              </label>

              {showExtras ? (
                <div className="mt-4 space-y-6 border-t border-slate-200 pt-5">
                  <div>
                    <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-slate-950">
                      <Share2 className="h-4 w-4 text-primary" aria-hidden />
                      {t.socialTitle}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{t.socialValue}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {socialOptions.map(({ value, label }) => {
                        const price = value === 'none' ? 0 : value === 'bundle' ? WEBSITE_ESTIMATE_PRICES.socialBundle : WEBSITE_ESTIMATE_PRICES.socialSingle
                        return (
                          <label key={value} className={`cursor-pointer rounded-xl border p-4 transition ${social === value ? tileSelected : tileIdle}`}>
                            <input className="sr-only" type="radio" name="social" value={value} checked={social === value} onChange={() => setSocial(value)} />
                            <span className="flex items-start justify-between gap-3">
                              <span className="font-semibold text-slate-900">{t[label]}</span>
                              <span className="flex items-center gap-2">
                                <span className="font-bold text-primary-dark">{money(price)}</span>
                                {social === value ? <CheckCircle className="h-5 w-5 shrink-0 text-primary-dark" aria-hidden /> : null}
                              </span>
                            </span>
                            <span className="mt-2 flex flex-wrap gap-1.5">
                              {social === value ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                              {value === 'bundle' ? <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{t.bundleSavings}</span> : null}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-slate-950">
                      <Server className="h-4 w-4 text-primary" aria-hidden />
                      {t.hostingTitle}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">{t.hostingIntro}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-primary-dark">
                      <Info className="h-3.5 w-3.5" aria-hidden />
                      {t.hostingDetailHint}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {hostingOptions.map(({ value, label, description, bestFor, detail, price, recommended }) => {
                        const isExpanded = expandedHosting === value
                        return (
                          <div key={value} className={`rounded-xl border p-4 transition ${hosting === value ? tileSelected : tileIdle}`}>
                            <label className="cursor-pointer">
                              <input
                                className="sr-only"
                                type="radio"
                                name="hosting"
                                value={value}
                                checked={hosting === value}
                                aria-describedby={`hosting-${value}-description`}
                                onChange={() => setHosting(value)}
                              />
                              <span className="flex items-start justify-between gap-3">
                                <span className="font-semibold text-slate-900">{t[label]}</span>
                                <span className="flex items-center gap-2">
                                  <span className="shrink-0 font-bold text-primary-dark">{price.replace('/year', t.perYear).replace('/month', t.perMonth)}</span>
                                  {hosting === value ? <CheckCircle className="h-5 w-5 shrink-0 text-primary-dark" aria-hidden /> : null}
                                </span>
                              </span>
                              <span className="mt-2 flex flex-wrap gap-1.5">
                                {hosting === value ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                                {recommended ? <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{t.recommended}</span> : null}
                              </span>
                              <span id={`hosting-${value}-description`} className="mt-2 block text-sm leading-6 text-slate-700">{t[description]}</span>
                              <span className="mt-3 block border-t border-slate-200 pt-3 text-xs font-semibold text-primary-dark">{t[bestFor]}</span>
                            </label>
                            <button
                              type="button"
                              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary-dark underline-offset-2 hover:underline"
                              aria-expanded={isExpanded}
                              onClick={() => setExpandedHosting(isExpanded ? null : value)}
                            >
                              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" aria-hidden /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
                              {isExpanded ? t.hostingHideDetail : t.hostingMoreDetail}
                            </button>
                            {isExpanded ? (
                              <p id={`hosting-${value}-detail`} className="mt-3 rounded-xl bg-slate-950 p-4 text-sm leading-6 text-white">
                                {t[detail]}
                              </p>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </fieldset>
          </div>

          <form id="referral-code-section" onSubmit={applyReferralCode} className="scroll-mt-28 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2"><Tag className="h-5 w-5 text-amber-700" aria-hidden /><h2 className="font-serif text-lg font-bold text-slate-950">{t.codeTitle}</h2></div>
            {referralApplied ? (
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2 text-sm font-medium leading-6 text-emerald-800"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{t.codeApplied}</p>
                <button type="button" onClick={removeReferral} className="text-left text-sm font-semibold text-amber-900 underline underline-offset-4">{t.remove}</button>
              </div>
            ) : (
              <>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <label className="sr-only" htmlFor="referral-code">{t.codePlaceholder}</label>
                  <input id="referral-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder={t.codePlaceholder} autoComplete="off" className="min-h-12 flex-1 rounded-lg border border-amber-300 bg-white px-4 text-sm uppercase tracking-wide text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  <button type="submit" disabled={!code.trim() || codeStatus === 'loading'} className="min-h-12 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">{codeStatus === 'loading' ? t.applying : t.apply}</button>
                </div>
                {codeStatus === 'invalid' ? <p className="mt-2 text-sm font-medium text-red-700" role="alert">{t.invalidCode}</p> : null}
                {codeStatus === 'error' ? <p className="mt-2 text-sm font-medium text-red-700" role="alert">{t.codeError}</p> : null}
              </>
            )}
          </form>
        </div>

        <aside className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <div className="lg:sticky lg:top-28">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" aria-hidden /><h2 className="text-xl font-serif font-bold text-slate-950">{t.summaryTitle}</h2></div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-700">{t.coreServices}</dt><dd className="font-semibold tabular-nums text-slate-900">{money(WEBSITE_ESTIMATE_CORE_PRICE)}</dd></div>
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
              <div className="flex justify-between gap-4"><dt className="text-slate-700">{domainSummaryLabel}</dt><dd className="font-semibold tabular-nums text-slate-900">{domainSource === 'existing' ? money(0) : money(estimate.domain)}</dd></div>
              {email ? <><div className="flex justify-between gap-4"><dt className="text-slate-700">{t.emailSetup}</dt><dd className="font-semibold tabular-nums text-slate-900">{money(estimate.emailSetup)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-700">{t.emailAnnual}</dt><dd className="font-semibold tabular-nums text-slate-900">{money(estimate.emailAnnual)}</dd></div></> : null}
              {socialSummaryLabel && estimate.socialSetup > 0 ? <div className="flex justify-between gap-4"><dt className="text-slate-700">{socialSummaryLabel}</dt><dd className="font-semibold tabular-nums text-slate-900">{money(estimate.socialSetup)}</dd></div> : null}
              {hostingSummaryLabel ? <div className="flex justify-between gap-4"><dt className="text-slate-700">{hostingSummaryLabel}</dt><dd className="font-semibold tabular-nums text-slate-900">{money(estimate.hostingFirstYear)}</dd></div> : <div className="flex gap-2 rounded-lg bg-white p-3 text-xs leading-5 text-slate-700"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{t.ownHostingNote}</div>}
            </dl>
            <div className="mt-6 space-y-3 border-t border-slate-300 pt-5">
              <div className="flex justify-between gap-4 text-sm"><span className="text-slate-700">{t.subtotal}</span><span className="font-semibold tabular-nums text-slate-900">{money(estimate.firstYearBeforeTax)}</span></div>
              <div className="flex justify-between gap-4 text-sm"><span className="text-slate-700">{t.hst}</span><span className="font-semibold tabular-nums text-slate-900">{money(estimate.hst)}</span></div>
              <div className="flex items-end justify-between gap-4 border-t border-slate-300 pt-4"><span className="font-bold text-slate-950">{t.total}</span><span className="text-2xl font-serif font-bold tabular-nums text-primary-dark">{estimateTotalLabel}</span></div>
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-600">{t.disclaimer}</p>
            <Link href={{ pathname: '/contact', query: contactQuery }} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-center font-bold text-white transition hover:bg-primary-dark">{t.cta}</Link>
            <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-700">
              <p className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <Link href="/visibility-improvement-estimate" className="font-semibold text-primary-dark underline-offset-4 hover:underline">
                  {t.crossLinkVisibility}
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
          <Link href={{ pathname: '/contact', query: contactQuery }} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark">{t.cta}</Link>
        </div>
      </div>
    </section>
  )
}
