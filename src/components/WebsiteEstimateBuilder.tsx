'use client'

import React, { useMemo, useState } from 'react'
import { CheckCircle, Globe2, Info, Mail, PenLine, SearchCheck, Server, Share2, Sparkles, Tag } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  calculateWebsiteEstimate,
  DOMAIN_PRICES,
  WEBSITE_ESTIMATE_CORE_PRICE,
  WEBSITE_ESTIMATE_PRICES,
  type DomainTerm,
  type HostingChoice,
  type SocialSetup,
} from '@/lib/website-estimate'

const copy = {
  en: {
    eyebrow: 'Website package estimator',
    title: 'Build a clear first-year website estimate.',
    intro:
      'Start with the required launch foundation and domain term. Optional add-ons stay separate—open them only if you want email, social, or hosting support.',
    outcomeClarity: 'Explain your value clearly',
    outcomeDiscovery: 'Help customers find you',
    outcomeAction: 'Make the next step easy',
    requiredSection: 'Required',
    optionalSection: 'Optional add-ons',
    optionalSectionIntro: 'These are not required to request a scope confirmation.',
    coreTitle: 'Core Website Launch',
    required: 'Required',
    whatItIs: 'What it is',
    whyItMatters: 'Why it matters',
    website: 'Website creation',
    websiteWhat: 'Design and development of a professional, mobile-friendly website.',
    websiteWhy: 'Creates a credible home for the business and a clear path to contact or book.',
    copyBooking: 'Copywriting and booking integration',
    copyBookingWhat: 'Client-friendly service messaging connected to the selected booking path.',
    copyBookingWhy: 'Helps visitors understand the offer and move from interest to an inquiry with less friction.',
    visibility: 'SEO, AEO and agentic/AI visibility foundations',
    visibilityWhat: 'Technical and content signals that describe the business to search engines, answer engines and AI assistants.',
    visibilityWhy: 'Helps the right customers discover and understand the business when configured properly. Rankings are not guaranteed.',
    domainTitle: 'Choose your domain term',
    domainIntro: 'The domain is required and will be owned by you.',
    oneYear: '1 year',
    twoYears: '2 years',
    threeYears: '3 years',
    bestValue: 'Best value',
    emailTitle: 'Professional email',
    emailLabel: 'Add professional email setup and Microsoft 365 Business Basic',
    emailValue: 'Your email matches the website domain—for example, name@yourbusiness.ca.',
    emailCost: '$150 setup + $114/year',
    extrasTitle: 'Additional options',
    extrasLabel: 'I want social setup or hosting options',
    extrasValue: 'Open this only if you want social profile setup or ROALLA hosting and care. Otherwise leave it unchecked.',
    socialTitle: 'Social tools setup',
    socialValue: 'Professional profile configuration with consistent names, bios, images, links, contact details and security settings.',
    noSocial: 'No social setup',
    instagram: 'Instagram',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    bundle: 'Instagram + YouTube + LinkedIn',
    bundleSavings: 'Bundle savings',
    hostingTitle: 'Choose your hosting path',
    hostingIntro: 'Choose how much of the technical upkeep you want to manage yourself. Your website and domain remain yours with every option.',
    hostingDetailHint: 'Hover or focus on an option for more detail.',
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
    domain: 'Domain registration',
    emailSetup: 'Professional email setup',
    emailAnnual: 'Microsoft 365 Business Basic — first year',
    socialSetup: 'Social tools setup',
    hostingFirstYear: 'Hosting and care — projected first year',
    ownHostingNote: 'Client-selected hosting provider fees are not included.',
    subtotal: 'First-year estimate before HST',
    hst: 'HST (13%)',
    total: 'Projected first-year total',
    disclaimer:
      'This is a preliminary, non-binding estimate based on your selections. ROALLA confirms scope, compatibility, timing and final pricing in writing before work begins.',
    cta: 'Request scope confirmation',
  },
  fr: {
    eyebrow: 'Estimateur de forfait Web',
    title: 'Préparez une estimation claire pour la première année.',
    intro:
      'Commencez par la base de lancement et la durée du domaine. Les options restent séparées—ouvrez-les seulement si vous voulez le courriel, les médias sociaux ou l’hébergement.',
    outcomeClarity: 'Expliquer clairement votre valeur',
    outcomeDiscovery: 'Aider les clients à vous trouver',
    outcomeAction: 'Faciliter la prochaine étape',
    requiredSection: 'Requis',
    optionalSection: 'Options facultatives',
    optionalSectionIntro: 'Ces éléments ne sont pas requis pour demander une confirmation de portée.',
    coreTitle: 'Lancement Web de base',
    required: 'Requis',
    whatItIs: 'De quoi il s’agit',
    whyItMatters: 'Pourquoi c’est important',
    website: 'Création du site Web',
    websiteWhat: 'Conception et développement d’un site professionnel adapté aux appareils mobiles.',
    websiteWhy: 'Crée une présence crédible et un parcours clair pour communiquer ou réserver.',
    copyBooking: 'Rédaction et intégration de la réservation',
    copyBookingWhat: 'Des messages clairs sur les services, reliés au parcours de réservation choisi.',
    copyBookingWhy: 'Aide les visiteurs à comprendre l’offre et à passer plus facilement de l’intérêt à une demande.',
    visibility: 'Fondations SEO, AEO et visibilité agentique/IA',
    visibilityWhat: 'Des signaux techniques et de contenu qui décrivent l’entreprise aux moteurs de recherche, de réponse et assistants IA.',
    visibilityWhy: 'Aide les bons clients à découvrir et comprendre l’entreprise lorsque la configuration est adéquate. Aucun classement n’est garanti.',
    domainTitle: 'Choisissez la durée du domaine',
    domainIntro: 'Le domaine est requis et vous en serez propriétaire.',
    oneYear: '1 an',
    twoYears: '2 ans',
    threeYears: '3 ans',
    bestValue: 'Meilleure valeur',
    emailTitle: 'Courriel professionnel',
    emailLabel: 'Ajouter la configuration du courriel professionnel et Microsoft 365 Business Basic',
    emailValue: 'Votre courriel correspond au domaine du site, par exemple nom@votreentreprise.ca.',
    emailCost: '150 $ de configuration + 114 $/an',
    extrasTitle: 'Options supplémentaires',
    extrasLabel: 'Je veux la configuration sociale ou des options d’hébergement',
    extrasValue: 'Ouvrez ceci seulement si vous voulez la configuration des profils sociaux ou l’hébergement et l’entretien ROALLA. Sinon, laissez décoché.',
    socialTitle: 'Configuration des médias sociaux',
    socialValue: 'Configuration professionnelle et cohérente des noms, biographies, images, liens, coordonnées et paramètres de sécurité.',
    noSocial: 'Aucune configuration sociale',
    instagram: 'Instagram',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    bundle: 'Instagram + YouTube + LinkedIn',
    bundleSavings: 'Économie groupée',
    hostingTitle: 'Choisissez votre hébergement',
    hostingIntro: 'Choisissez la part de l’entretien technique que vous souhaitez gérer. Votre site et votre domaine restent à vous avec chaque option.',
    hostingDetailHint: 'Survolez une option ou placez-y le focus pour voir plus de détails.',
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
    domain: 'Enregistrement du domaine',
    emailSetup: 'Configuration du courriel professionnel',
    emailAnnual: 'Microsoft 365 Business Basic — première année',
    socialSetup: 'Configuration des médias sociaux',
    hostingFirstYear: 'Hébergement et entretien — première année projetée',
    ownHostingNote: 'Les frais de votre propre fournisseur d’hébergement ne sont pas inclus.',
    subtotal: 'Estimation de la première année avant TVH',
    hst: 'TVH (13 %)',
    total: 'Total projeté de la première année',
    disclaimer:
      'Cette estimation préliminaire est non contraignante. ROALLA confirmera la portée, la compatibilité, l’échéancier et le prix final par écrit avant le début des travaux.',
    cta: 'Demander la confirmation de la portée',
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

export default function WebsiteEstimateBuilder() {
  const locale = useLocale()
  const french = locale === 'fr'
  const t = copy[french ? 'fr' : 'en']
  const currency = useMemo(
    () => new Intl.NumberFormat(french ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD' }),
    [french],
  )
  const [domainTerm, setDomainTerm] = useState<DomainTerm>('three')
  const [email, setEmail] = useState(false)
  const [showExtras, setShowExtras] = useState(false)
  const [social, setSocial] = useState<SocialSetup>('none')
  const [hosting, setHosting] = useState<HostingChoice>('own')
  const [code, setCode] = useState('')
  const [referralApplied, setReferralApplied] = useState(false)
  const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'invalid' | 'error'>('idle')

  const activeSocial = showExtras ? social : 'none'
  const activeHosting = showExtras ? hosting : 'own'
  const estimate = calculateWebsiteEstimate({
    domainTerm,
    email,
    social: activeSocial,
    hosting: activeHosting,
    referralDiscount: referralApplied,
  })

  const toggleExtras = (checked: boolean) => {
    setShowExtras(checked)
    if (!checked) {
      setSocial('none')
      setHosting('own')
    }
  }

  const applyReferralCode = async (event: React.FormEvent) => {
    event.preventDefault()
    setCodeStatus('loading')
    try {
      const response = await fetch('/api/website-estimate/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const result = (await response.json()) as { valid?: boolean }
      if (response.ok && result.valid) {
        setReferralApplied(true)
        setCodeStatus('idle')
      } else {
        setReferralApplied(false)
        setCodeStatus('invalid')
      }
    } catch {
      setReferralApplied(false)
      setCodeStatus('error')
    }
  }

  const removeReferral = () => {
    setReferralApplied(false)
    setCode('')
    setCodeStatus('idle')
  }

  const estimateGoal = `${french ? 'Estimation Web' : 'Website estimate'}: ${currency.format(estimate.firstYearTotal)} ${french ? 'TVH incluse' : 'including HST'}; domain=${domainTerm}; email=${email ? 'yes' : 'no'}; social=${activeSocial}; hosting=${activeHosting}; referral=${referralApplied ? 'applied' : 'none'}`

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
      <header className="bg-slate-950 px-6 py-8 text-white sm:px-8 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-light">{t.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-serif font-bold text-white sm:text-4xl">{t.title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-white/95">{t.intro}</p>
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
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <h3 className="pt-1.5 font-serif text-lg font-bold text-slate-950">{label}</h3>
                      </div>
                      <p className="shrink-0 pt-2 font-bold tabular-nums text-primary-dark">{currency.format(price)}</p>
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
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {([
                  ['one', t.oneYear],
                  ['two', t.twoYears],
                  ['three', t.threeYears],
                ] as Array<[DomainTerm, string]>).map(([value, label]) => (
                  <label key={value} className={`relative cursor-pointer rounded-xl border p-4 transition ${domainTerm === value ? 'border-primary bg-primary/5 ring-2 ring-primary/15' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input className="sr-only" type="radio" name="domain-term" value={value} checked={domainTerm === value} onChange={() => setDomainTerm(value)} />
                    <span className="block font-semibold text-slate-900">{label}</span>
                    <span className="mt-1 block text-lg font-bold text-primary-dark">{currency.format(DOMAIN_PRICES[value])}</span>
                    {value === 'three' ? <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{t.bestValue}</span> : null}
                  </label>
                ))}
              </div>
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
              <legend className="flex items-center gap-2 text-xl font-serif font-bold text-slate-950"><Mail className="h-5 w-5 text-primary" aria-hidden />{t.emailTitle}</legend>
              <label className={`mt-4 flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 transition ${email ? 'border-primary bg-primary/5 ring-2 ring-primary/15' : 'border-slate-200'}`}>
                <input className="mt-1 h-4 w-4 accent-primary" type="checkbox" checked={email} onChange={(event) => setEmail(event.target.checked)} />
                <span>
                  <span className="block font-semibold text-slate-900">{t.emailLabel}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-700">{t.emailValue}</span>
                  <span className="mt-2 block text-sm font-bold text-primary-dark">{t.emailCost}</span>
                </span>
              </label>
            </fieldset>

            <fieldset>
              <legend className="flex items-center gap-2 text-xl font-serif font-bold text-slate-950"><Share2 className="h-5 w-5 text-primary" aria-hidden />{t.extrasTitle}</legend>
              <label className={`mt-4 flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 transition ${showExtras ? 'border-primary bg-primary/5 ring-2 ring-primary/15' : 'border-slate-200'}`}>
                <input
                  className="mt-1 h-4 w-4 accent-primary"
                  type="checkbox"
                  checked={showExtras}
                  onChange={(event) => toggleExtras(event.target.checked)}
                />
                <span>
                  <span className="block font-semibold text-slate-900">{t.extrasLabel}</span>
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
                          <label key={value} className={`cursor-pointer rounded-xl border bg-white p-4 transition ${social === value ? 'border-primary bg-primary/5 ring-2 ring-primary/15' : 'border-slate-200'}`}>
                            <input className="sr-only" type="radio" name="social" value={value} checked={social === value} onChange={() => setSocial(value)} />
                            <span className="flex items-start justify-between gap-3">
                              <span className="font-semibold text-slate-900">{t[label]}</span>
                              <span className="font-bold text-primary-dark">{currency.format(price)}</span>
                            </span>
                            {value === 'bundle' ? <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{t.bundleSavings}</span> : null}
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
                      {hostingOptions.map(({ value, label, description, bestFor, detail, price, recommended }) => (
                        <label key={value} className={`group relative cursor-pointer rounded-xl border bg-white p-4 transition hover:z-30 hover:border-primary/60 hover:shadow-md focus-within:z-30 focus-within:border-primary focus-within:shadow-md ${hosting === value ? 'border-primary bg-primary/5 ring-2 ring-primary/15' : 'border-slate-200'}`}>
                          <input
                            className="sr-only"
                            type="radio"
                            name="hosting"
                            value={value}
                            checked={hosting === value}
                            aria-describedby={`hosting-${value}-description hosting-${value}-detail`}
                            onChange={() => setHosting(value)}
                          />
                          <span className="flex items-start justify-between gap-3">
                            <span className="font-semibold text-slate-900">{t[label]}</span>
                            <span className="shrink-0 font-bold text-primary-dark">{price.replace('/year', t.perYear).replace('/month', t.perMonth)}</span>
                          </span>
                          {recommended ? <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{t.recommended}</span> : null}
                          <span id={`hosting-${value}-description`} className="mt-2 block text-sm leading-6 text-slate-700">{t[description]}</span>
                          <span className="mt-3 flex items-center justify-between gap-2 border-t border-slate-200 pt-3 text-xs font-semibold text-primary-dark">
                            <span>{t[bestFor]}</span>
                            <Info className="h-4 w-4 shrink-0" aria-hidden />
                          </span>
                          <span
                            id={`hosting-${value}-detail`}
                            role="tooltip"
                            className="pointer-events-none absolute left-2 right-2 top-full z-40 mt-2 block translate-y-1 rounded-xl bg-slate-950 p-4 text-sm font-normal leading-6 text-white opacity-0 shadow-xl transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
                          >
                            {t[detail]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </fieldset>
          </div>

          <form onSubmit={applyReferralCode} className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
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
              <div className="flex justify-between gap-4"><dt className="text-slate-700">{t.coreServices}</dt><dd className="font-semibold tabular-nums text-slate-900">{currency.format(WEBSITE_ESTIMATE_CORE_PRICE)}</dd></div>
              {estimate.referralDiscount > 0 ? <div className="flex justify-between gap-4 text-emerald-700"><dt>{t.referralDiscount}</dt><dd className="font-semibold tabular-nums">–{currency.format(estimate.referralDiscount)}</dd></div> : null}
              <div className="flex justify-between gap-4"><dt className="text-slate-700">{t.domain}</dt><dd className="font-semibold tabular-nums text-slate-900">{currency.format(estimate.domain)}</dd></div>
              {email ? <><div className="flex justify-between gap-4"><dt className="text-slate-700">{t.emailSetup}</dt><dd className="font-semibold tabular-nums text-slate-900">{currency.format(estimate.emailSetup)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-700">{t.emailAnnual}</dt><dd className="font-semibold tabular-nums text-slate-900">{currency.format(estimate.emailAnnual)}</dd></div></> : null}
              {estimate.socialSetup > 0 ? <div className="flex justify-between gap-4"><dt className="text-slate-700">{t.socialSetup}</dt><dd className="font-semibold tabular-nums text-slate-900">{currency.format(estimate.socialSetup)}</dd></div> : null}
              {activeHosting !== 'own' ? <div className="flex justify-between gap-4"><dt className="text-slate-700">{t.hostingFirstYear}</dt><dd className="font-semibold tabular-nums text-slate-900">{currency.format(estimate.hostingFirstYear)}</dd></div> : <div className="flex gap-2 rounded-lg bg-white p-3 text-xs leading-5 text-slate-700"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{t.ownHostingNote}</div>}
            </dl>
            <div className="mt-6 space-y-3 border-t border-slate-300 pt-5">
              <div className="flex justify-between gap-4 text-sm"><span className="text-slate-700">{t.subtotal}</span><span className="font-semibold tabular-nums text-slate-900">{currency.format(estimate.firstYearBeforeTax)}</span></div>
              <div className="flex justify-between gap-4 text-sm"><span className="text-slate-700">{t.hst}</span><span className="font-semibold tabular-nums text-slate-900">{currency.format(estimate.hst)}</span></div>
              <div className="flex items-end justify-between gap-4 border-t border-slate-300 pt-4"><span className="font-bold text-slate-950">{t.total}</span><span className="text-2xl font-serif font-bold tabular-nums text-primary-dark">{currency.format(estimate.firstYearTotal)}</span></div>
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-600">{t.disclaimer}</p>
            <Link href={{ pathname: '/contact', query: { intent: 'website', offer: 'estimate', from_page: '/website-estimate', goal: estimateGoal } }} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-center font-bold text-white transition hover:bg-primary-dark">{t.cta}</Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
