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
import { EMAIL_ANNUAL_PRICES, type EmailChoice } from '@/lib/website-estimate'

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
    emailTitle: 'Do you need professional email?',
    emailNeedIntro: 'Professional email is optional. Choose No to keep it out of this estimate, or Yes to compare secure business platforms.',
    emailNo: 'No professional email right now',
    emailNoValue: 'Continue without email setup. You can add a domain-matched mailbox later.',
    emailYes: 'Yes, I need professional email',
    emailYesValue: 'Show provider choices and per-user pricing.',
    nextStep: 'Next step',
    emailProviderTitle: 'Choose the platform that fits how you work',
    emailPopular: 'Most clients add this',
    emailSetupValue: '$150 one-time ROALLA setup for one domain',
    emailSetupIncludes:
      'Setup includes domain connection, one initial mailbox, multi-factor authentication, administrator recovery, and core SPF, DKIM and DMARC anti-spoofing records.',
    domainCalloutTitle: 'Use your own business domain',
    domainCalloutBody:
      'Send from a custom domain such as name@yourbusiness.ca, not a consumer Gmail, Outlook or Hotmail address. A business domain builds trust and lets us set up the authentication records that help your emails reach the inbox.',
    domainCalloutLink: 'Not sure where you stand? Start with the email reach brief',
    emailUsersLabel: 'How many people need their own mailbox?',
    emailRecommended: 'Recommended',
    emailProviderFeesSeparate: 'Provider fees separate',
    emailPerUserYear: '/user/year',
    emailPriceNote:
      'Published provider prices checked October 2026. Prices are per user, before tax, on annual commitments, and are paid directly to the provider. Providers may change pricing or features.',
    microsoftBasic: 'Microsoft 365 Business Basic',
    microsoftBasicValue: 'Business Outlook email with Microsoft’s web and mobile productivity tools.',
    microsoftBasicBestFor: 'Best overall fit for many professional service businesses',
    microsoftStandard: 'Microsoft 365 Business Standard',
    microsoftStandardValue: 'Everything in Business Basic, plus installed desktop Office applications.',
    microsoftStandardBestFor: 'Best when you need full desktop Word, Excel and PowerPoint',
    googleStarter: 'Google Workspace Business Starter',
    googleStarterValue: 'Business Gmail with Google’s browser-first collaboration suite.',
    googleStarterBestFor: 'Best when you prefer Gmail, Drive and real-time collaboration',
    otherEmail: 'Another provider or email-only plan',
    otherEmailValue: 'Use an existing provider or a lower-cost compatible service such as Zoho Mail.',
    otherEmailBestFor: 'Best when price or an existing platform matters most',
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
    emailAnnual: 'Email licenses — first year',
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
    emailTitle: 'Avez-vous besoin d’un courriel professionnel?',
    emailNeedIntro: 'Le courriel professionnel est facultatif. Choisissez Non pour l’exclure de l’estimation, ou Oui pour comparer les plateformes d’affaires sécurisées.',
    emailNo: 'Aucun courriel professionnel pour l’instant',
    emailNoValue: 'Continuez sans configuration de courriel. Vous pourrez ajouter une boîte liée au domaine plus tard.',
    emailYes: 'Oui, j’ai besoin d’un courriel professionnel',
    emailYesValue: 'Afficher les fournisseurs et les prix par utilisateur.',
    nextStep: 'Prochaine étape',
    emailProviderTitle: 'Choisissez la plateforme adaptée à votre façon de travailler',
    emailPopular: 'La plupart des clients ajoutent ceci',
    emailSetupValue: 'Configuration ROALLA unique de 150 $ pour un domaine',
    emailSetupIncludes:
      'La configuration comprend la connexion du domaine, une première boîte, l’authentification multifacteur, la récupération administrateur et les enregistrements anti-usurpation SPF, DKIM et DMARC.',
    domainCalloutTitle: 'Utilisez votre propre domaine d’entreprise',
    domainCalloutBody:
      'Envoyez depuis un domaine personnalisé, par exemple nom@votreentreprise.ca, plutôt qu’une adresse Gmail, Outlook ou Hotmail grand public. Un domaine d’entreprise inspire confiance et nous permet de configurer les enregistrements d’authentification qui aident vos courriels à atteindre la boîte de réception.',
    domainCalloutLink: 'Vous ne savez pas où vous en êtes? Commencez par le bref sur la portée des courriels',
    emailUsersLabel: 'Combien de personnes ont besoin de leur propre boîte?',
    emailRecommended: 'Recommandé',
    emailProviderFeesSeparate: 'Frais du fournisseur séparés',
    emailPerUserYear: '/utilisateur/an',
    emailPriceNote:
      'Prix publiés vérifiés en octobre 2026. Les prix sont par utilisateur, avant taxes, avec engagement annuel et payés directement au fournisseur. Les fournisseurs peuvent modifier leurs prix ou fonctions.',
    microsoftBasic: 'Microsoft 365 Business Basic',
    microsoftBasicValue: 'Courriel Outlook professionnel avec les outils Microsoft Web et mobiles.',
    microsoftBasicBestFor: 'Meilleur choix global pour plusieurs entreprises de services professionnels',
    microsoftStandard: 'Microsoft 365 Business Standard',
    microsoftStandardValue: 'Tout le forfait Business Basic, avec les applications Office installées.',
    microsoftStandardBestFor: 'Idéal si vous avez besoin de Word, Excel et PowerPoint sur ordinateur',
    googleStarter: 'Google Workspace Business Starter',
    googleStarterValue: 'Gmail professionnel avec la suite collaborative de Google dans le navigateur.',
    googleStarterBestFor: 'Idéal si vous préférez Gmail, Drive et la collaboration en temps réel',
    otherEmail: 'Autre fournisseur ou forfait courriel seulement',
    otherEmailValue: 'Utilisez un fournisseur existant ou un service compatible moins coûteux comme Zoho Mail.',
    otherEmailBestFor: 'Idéal lorsque le prix ou une plateforme existante est prioritaire',
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
    emailAnnual: 'Licences de courriel — première année',
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

type EmailProviderChoice = Exclude<EmailChoice, 'none'>

const emailOptions: Array<{
  value: EmailProviderChoice
  label: keyof typeof copy.en
  description: keyof typeof copy.en
  bestFor: keyof typeof copy.en
  annual: number | null
  recommended?: boolean
}> = [
  {
    value: 'microsoft-basic',
    label: 'microsoftBasic',
    description: 'microsoftBasicValue',
    bestFor: 'microsoftBasicBestFor',
    annual: EMAIL_ANNUAL_PRICES['microsoft-basic'],
    recommended: true,
  },
  {
    value: 'microsoft-standard',
    label: 'microsoftStandard',
    description: 'microsoftStandardValue',
    bestFor: 'microsoftStandardBestFor',
    annual: EMAIL_ANNUAL_PRICES['microsoft-standard'],
  },
  {
    value: 'google-starter',
    label: 'googleStarter',
    description: 'googleStarterValue',
    bestFor: 'googleStarterBestFor',
    annual: EMAIL_ANNUAL_PRICES['google-starter'],
  },
  {
    value: 'other',
    label: 'otherEmail',
    description: 'otherEmailValue',
    bestFor: 'otherEmailBestFor',
    annual: null,
  },
]

const tileMotion =
  'transition-all duration-200 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.015] motion-safe:hover:shadow-lg motion-safe:hover:shadow-primary/25'
const tileSelected =
  `${tileMotion} border-primary bg-primary/25 ring-2 ring-primary/40 shadow-md shadow-primary/15`
const tileIdle = `${tileMotion} border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50`

export default function EmailReachEstimateBuilder() {
  const locale = useLocale()
  const french = locale === 'fr'
  const t = copy[french ? 'fr' : 'en']
  const money = useMemo(() => (amount: number) => formatCad(amount, french ? 'fr' : 'en'), [french])
  const [needsEmail, setNeedsEmail] = useState(false)
  const [email, setEmail] = useState<EmailChoice>('none')
  const [emailUsers, setEmailUsers] = useState(1)
  const [showExtras, setShowExtras] = useState(false)
  const [listCleanup, setListCleanup] = useState(false)
  const [authSetup, setAuthSetup] = useState(false)
  const [code, setCode] = useState('')
  const [appliedReferralCode, setAppliedReferralCode] = useState('')
  const [referralApplied, setReferralApplied] = useState(false)
  const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'invalid' | 'error'>('idle')

  const estimate = calculateEmailReachEstimate({
    email,
    emailUsers,
    listCleanup: showExtras && listCleanup,
    authSetup: showExtras && authSetup,
    referralDiscount: referralApplied,
  })

  const chooseEmailNeed = (needed: boolean) => {
    setNeedsEmail(needed)
    if (needed) {
      setEmail((current) => (current === 'none' ? 'microsoft-basic' : current))
    } else {
      setEmail('none')
      setEmailUsers(1)
    }
  }

  const selectedEmailOption = emailOptions.find((option) => option.value === email)

  const toggleExtras = (checked: boolean) => {
    setShowExtras(checked)
    if (!checked) {
      setListCleanup(false)
      setAuthSetup(false)
    }
  }

  const selectionLines = [
    t.coreServices,
    selectedEmailOption ? `${t.emailSetup}: ${t[selectedEmailOption.label]} × ${estimate.emailUsers}` : null,
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

            <article className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${tileMotion}`}>
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
                {t.emailTitle}
              </legend>
              <p className="mt-2 text-sm leading-6 text-slate-700">{t.emailNeedIntro}</p>

              <div className="mt-4 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm leading-6 text-slate-800">
                <p className="font-bold text-primary-dark">{t.domainCalloutTitle}</p>
                <p className="mt-1">
                  <EmailSafeText text={t.domainCalloutBody} />
                </p>
                <Link
                  href="/tools/email-reach-brief"
                  className="mt-2 inline-flex font-bold text-primary-dark underline underline-offset-4"
                >
                  {t.domainCalloutLink}
                </Link>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className={`cursor-pointer rounded-xl border p-4 transition ${!needsEmail ? tileSelected : tileIdle}`}>
                  <input className="sr-only" type="radio" name="reach-needs-email" checked={!needsEmail} onChange={() => chooseEmailNeed(false)} />
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-slate-950">{t.emailNo}</span>
                    {!needsEmail ? <CheckCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden /> : null}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-700">{t.emailNoValue}</span>
                  {!needsEmail ? <span className="mt-3 inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                </label>
                <label className={`cursor-pointer rounded-xl border p-4 transition ${needsEmail ? tileSelected : tileIdle}`}>
                  <input className="sr-only" type="radio" name="reach-needs-email" checked={needsEmail} onChange={() => chooseEmailNeed(true)} />
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-slate-950">{t.emailYes}</span>
                    {needsEmail ? <CheckCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden /> : null}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-700">{t.emailYesValue}</span>
                  {needsEmail ? <span className="mt-3 inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                </label>
              </div>

              {needsEmail ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-dark">{t.nextStep}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-slate-950">{t.emailProviderTitle}</h3>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">
                      {t.emailPopular}
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl border border-primary/25 bg-primary/5 p-4">
                    <p className="font-bold text-primary-dark">{t.emailSetupValue}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{t.emailSetupIncludes}</p>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {emailOptions.map((option) => {
                      const selected = email === option.value
                      const priceLabel =
                        option.annual === null
                          ? t.emailProviderFeesSeparate
                          : `${money(option.annual)}${t.emailPerUserYear}`

                      return (
                        <label key={option.value} className={`cursor-pointer rounded-xl border p-4 transition ${selected ? tileSelected : tileIdle}`}>
                          <input
                            className="sr-only"
                            type="radio"
                            name="reach-email-provider"
                            value={option.value}
                            checked={selected}
                            onChange={() => setEmail(option.value)}
                          />
                          <span className="flex items-start justify-between gap-3">
                            <span className="font-semibold text-slate-950">{t[option.label]}</span>
                            <span className="shrink-0 text-right text-sm font-bold text-primary-dark">{priceLabel}</span>
                          </span>
                          <span className="mt-2 flex flex-wrap gap-1.5">
                            {selected ? <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{t.selected}</span> : null}
                            {option.recommended ? <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{t.emailRecommended}</span> : null}
                          </span>
                          <span className="mt-2 block text-sm leading-6 text-slate-700">{t[option.description]}</span>
                          <span className="mt-3 block border-t border-slate-200 pt-3 text-xs font-semibold leading-5 text-primary-dark">{t[option.bestFor]}</span>
                        </label>
                      )
                    })}
                  </div>

                  <label className="mt-4 block rounded-xl border border-slate-200 bg-white p-4">
                    <span className="text-sm font-semibold text-slate-900">{t.emailUsersLabel}</span>
                    <input
                      className="mt-2 h-11 w-28 rounded-lg border border-slate-300 px-3 font-semibold text-slate-950 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      type="number"
                      min={1}
                      max={25}
                      value={emailUsers}
                      onChange={(event) => setEmailUsers(Math.min(25, Math.max(1, Number(event.target.value) || 1)))}
                    />
                  </label>
                  <p className="mt-3 text-xs leading-5 text-slate-600">{t.emailPriceNote}</p>
                </div>
              ) : null}
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
              {email !== 'none' ? (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-700">{t.emailSetup}</dt>
                    <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.emailSetup)}</dd>
                  </div>
                  {estimate.emailAnnual > 0 ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-700">
                        {t.emailAnnual}
                        {selectedEmailOption ? ` (${t[selectedEmailOption.label]} × ${estimate.emailUsers})` : ''}
                      </dt>
                      <dd className="font-semibold tabular-nums text-slate-900">{money(estimate.emailAnnual)}</dd>
                    </div>
                  ) : null}
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
