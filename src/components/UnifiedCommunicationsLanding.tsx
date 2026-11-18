'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Bot,
  Check,
  Headphones,
  MessagesSquare,
  Network,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import ConsultationRequestForm from '@/components/ConsultationRequestForm'
import CommunicationsValueBrief from '@/components/tools/CommunicationsValueBrief'
import Reveal from '@/components/motion/Reveal'
import UnifiedCommunicationsLogoStrip from '@/components/UnifiedCommunicationsLogoStrip'
import { trackAnalyticsEvent } from '@/lib/analytics'

type ChallengeId = 'missed' | 'fragmented' | 'legacy' | 'capacity' | 'ai'

const challengeIcons = {
  missed: PhoneCall,
  fragmented: MessagesSquare,
  legacy: Network,
  capacity: UsersRound,
  ai: Bot,
} as const

const copy = {
  en: {
    metadataPath: '/services/unified-communications-contact-centres-ai-employees',
    eyebrow: 'Unified communications · Contact centres · AI Employees',
    title: 'Turn every conversation into connected, accountable work.',
    lead: 'ROALLA helps organizations design and source cloud calling, collaboration, contact-centre and AI Employee capabilities around the customer and employee experience—not a vendor catalogue.',
    primary: 'Choose your business challenge',
    secondary: 'Discuss the opportunity',
    heroImageAlt: 'Contact-centre professional supporting customers in a modern communications environment',
    heroVisualTitle: 'Never miss an opportunity to connect.',
    capabilityChips: ['Voice & collaboration', 'Customer experience', 'AI-powered service'],
    proof: ['Vendor-neutral requirements', 'UCaaS + CCaaS + AI in one plan', 'Human handoff and governance built in'],
    selectorEyebrow: 'Start with the operating problem',
    selectorTitle: 'What is making communication harder than it should be?',
    selectorLead: 'Select the closest challenge. The recommended starting point changes with your answer.',
    selected: 'Selected',
    challengeLabel: 'Business challenge selector',
    challenges: {
      missed: {
        label: 'Calls are missed or routed poorly',
        title: 'Protect the moments when customers are trying to reach you.',
        body: 'Map call flows, queues, hours, overflow and escalation before comparing platforms. The first win is a reliable path to the right person—with reporting that shows where demand is being lost.',
        result: 'Call-flow blueprint, service-level measures and a qualified UCaaS/CCaaS shortlist.',
      },
      fragmented: {
        label: 'Channels and teams are fragmented',
        title: 'Create one operating view across voice, messaging and customer context.',
        body: 'Connect channels, CRM records, ownership and follow-up so customers do not have to repeat themselves and teams can see what happened before the handoff.',
        result: 'Channel architecture, integration requirements and accountable handoff design.',
      },
      legacy: {
        label: 'Legacy phone costs or contracts are rising',
        title: 'Build the business case before the renewal deadline builds it for you.',
        body: 'Inventory numbers, lines, devices, specialty services and carrier terms, then compare total transition cost—not only monthly licences.',
        result: 'Current-cost baseline, target requirements and a staged migration plan.',
      },
      capacity: {
        label: 'Service demand exceeds team capacity',
        title: 'Use automation to give people capacity—not to hide broken service.',
        body: 'Identify repeatable requests, knowledge gaps and safe automation boundaries. Keep exceptions, empathy and consequential decisions with accountable people.',
        result: 'Demand segmentation, automation candidates and workforce impact plan.',
      },
      ai: {
        label: 'We need an AI Employee on the frontline',
        title: 'Give the AI Employee a defined job, approved knowledge and a human exit.',
        body: 'Define what it may answer, what it may do, which systems it can access and exactly when a person takes over—with context intact.',
        result: 'AI Employee role charter, knowledge readiness and governed pilot scope.',
      },
    },
    recommendation: 'Recommended starting point',
    recommendationCta: 'Bring this challenge to ROALLA',
    briefCta: 'Build the free communications value brief',
    architectureEyebrow: 'One communication operating model',
    architectureTitle: 'Design the experience across people, platforms and AI.',
    architectureLead: 'The technology works only when routing, context, accountability and resilience work together.',
    architecture: [
      ['Connect', 'Business calling, meetings and team collaboration across locations and devices.'],
      ['Serve', 'Omnichannel queues, workforce practices, quality, analytics and CRM context.'],
      ['Assist', 'AI Employees that answer, qualify, book and follow up within approved boundaries.'],
      ['Govern', 'Identity, consent, recording, retention, resilience, human handoff and measurable ownership.'],
    ],
    pathwayEyebrow: 'A decision path—not a platform pitch',
    pathwayTitle: 'Move from operating evidence to a confident transition.',
    pathway: [
      ['Discover', 'Inventory demand, call flows, channels, contracts, integrations, risks and service expectations.'],
      ['Design', 'Define the target experience, AI boundaries, evaluation criteria and commercial baseline.'],
      ['Select', 'Compare qualified options on the same scorecard with relationships and compensation disclosed.'],
      ['Adopt', 'Pilot, port, integrate, train, measure and retire legacy services in controlled stages.'],
    ],
    assessmentEyebrow: 'Lead-generation path 1 · self-guided',
    assessmentTitle: 'Quantify the communications opportunity.',
    assessmentLead: 'Complete the guided value brief to estimate avoidable cost, service friction and modernization priorities. Download the result or carry it into a conversation.',
    inquiryEyebrow: 'Lead-generation path 2 · advisor-guided',
    inquiryTitle: 'Send the challenge while it is still specific.',
    inquiryLead: 'The selected challenge is attached to this request. ROALLA will respond with a practical next step, not an unsolicited vendor quote.',
    relatedTitle: 'Already exploring one part of the model?',
    techLink: 'Explore Technology Advisory',
    aiLink: 'Explore AI Employee by industry',
    logoStripEyebrow: 'Platforms and partners we can source through',
    logoStripLabel: 'Communications platform partners',
    allianceLine:
      'When CX or contact-centre delivery needs specialized partners, ROALLA can extend the engagement through the Alliance Network—while you keep ROALLA as your guide.',
    allianceCta: 'See Alliance Network delivery',
  },
  fr: {
    metadataPath: '/services/unified-communications-contact-centres-ai-employees',
    eyebrow: 'Communications unifiées · Centres de contact · Employés IA',
    title: 'Transformez chaque conversation en travail connecté et responsable.',
    lead: 'ROALLA aide les organisations à concevoir et sourcer la téléphonie infonuagique, la collaboration, le centre de contact et les employés IA autour de l’expérience client et employé—pas d’un catalogue fournisseur.',
    primary: 'Choisir votre enjeu d’affaires', secondary: 'Discuter de l’occasion',
    heroImageAlt: 'Professionnelle de centre de contact au service des clients dans un environnement de communications moderne',
    heroVisualTitle: 'Ne manquez jamais une occasion de créer un lien.',
    capabilityChips: ['Voix et collaboration', 'Expérience client', 'Service propulsé par l’IA'],
    proof: ['Exigences neutres', 'UCaaS + CCaaS + IA dans un même plan', 'Relais humain et gouvernance intégrés'],
    selectorEyebrow: 'Commencez par le problème opérationnel', selectorTitle: 'Qu’est-ce qui rend les communications plus difficiles qu’elles ne devraient l’être?', selectorLead: 'Choisissez l’enjeu le plus proche. Le point de départ recommandé s’adapte à votre réponse.', selected: 'Sélectionné', challengeLabel: 'Sélecteur d’enjeu d’affaires',
    challenges: {
      missed: { label: 'Les appels sont manqués ou mal acheminés', title: 'Protégez les moments où les clients tentent de vous joindre.', body: 'Cartographiez les parcours, files, heures, débordements et escalades avant de comparer les plateformes. Le premier gain est un chemin fiable vers la bonne personne, avec des données sur la demande perdue.', result: 'Plan des parcours d’appels, mesures de service et courte liste UCaaS/CCaaS.' },
      fragmented: { label: 'Les canaux et équipes sont fragmentés', title: 'Créez une vue opérationnelle commune pour la voix, les messages et le contexte client.', body: 'Reliez canaux, dossiers CRM, responsabilités et suivis afin que les clients ne se répètent pas et que les équipes voient l’historique avant le relais.', result: 'Architecture des canaux, exigences d’intégration et conception des relais.' },
      legacy: { label: 'Les coûts ou contrats de téléphonie augmentent', title: 'Bâtissez le dossier d’affaires avant que le renouvellement le fasse pour vous.', body: 'Inventoriez numéros, lignes, appareils, services spécialisés et modalités, puis comparez le coût total de transition—pas seulement les licences.', result: 'Base de coûts, exigences cibles et plan de migration graduelle.' },
      capacity: { label: 'La demande dépasse la capacité de l’équipe', title: 'Utilisez l’automatisation pour redonner de la capacité—pas pour cacher un service brisé.', body: 'Repérez les demandes répétitives, les lacunes de connaissances et les limites sécuritaires. Gardez les exceptions, l’empathie et les décisions importantes avec des personnes responsables.', result: 'Segmentation de la demande, candidats à l’automatisation et plan d’impact.' },
      ai: { label: 'Nous avons besoin d’un employé IA en première ligne', title: 'Donnez à l’employé IA un rôle défini, des connaissances approuvées et une sortie humaine.', body: 'Définissez ce qu’il peut répondre et faire, les systèmes accessibles et le moment exact où une personne reprend avec le contexte intact.', result: 'Charte du rôle, préparation des connaissances et portée d’un pilote gouverné.' },
    },
    recommendation: 'Point de départ recommandé', recommendationCta: 'Présenter cet enjeu à ROALLA', briefCta: 'Créer la fiche de valeur communications gratuite',
    architectureEyebrow: 'Un seul modèle opérationnel', architectureTitle: 'Concevez l’expérience entre personnes, plateformes et IA.', architectureLead: 'La technologie fonctionne seulement lorsque l’acheminement, le contexte, la responsabilité et la résilience fonctionnent ensemble.',
    architecture: [['Connecter', 'Téléphonie d’affaires, réunions et collaboration sur tous les sites et appareils.'], ['Servir', 'Files omnicanales, pratiques de main-d’œuvre, qualité, analytique et contexte CRM.'], ['Assister', 'Employés IA qui répondent, qualifient, réservent et relancent dans des limites approuvées.'], ['Gouverner', 'Identité, consentement, enregistrement, conservation, résilience, relais humain et responsabilités mesurables.']],
    pathwayEyebrow: 'Un chemin de décision—pas un pitch de plateforme', pathwayTitle: 'Passez des preuves opérationnelles à une transition maîtrisée.',
    pathway: [['Découvrir', 'Inventorier demande, parcours, canaux, contrats, intégrations, risques et attentes de service.'], ['Concevoir', 'Définir l’expérience cible, les limites IA, les critères et la base commerciale.'], ['Sélectionner', 'Comparer des options qualifiées sur la même grille avec les relations et la rémunération divulguées.'], ['Adopter', 'Piloter, transférer, intégrer, former, mesurer et retirer les services par étapes contrôlées.']],
    assessmentEyebrow: 'Parcours de génération 1 · autonome', assessmentTitle: 'Chiffrez l’occasion communications.', assessmentLead: 'Remplissez la fiche guidée pour estimer les coûts évitables, les frictions de service et les priorités. Téléchargez le résultat ou apportez-le à une conversation.',
    inquiryEyebrow: 'Parcours de génération 2 · avec conseiller', inquiryTitle: 'Envoyez l’enjeu pendant qu’il est encore précis.', inquiryLead: 'L’enjeu sélectionné est joint à la demande. ROALLA répondra avec une prochaine étape pratique, pas une soumission fournisseur non sollicitée.',
    relatedTitle: 'Vous explorez déjà une partie du modèle?', techLink: 'Explorer le conseil technologique', aiLink: 'Explorer l’employé IA par industrie',
    logoStripEyebrow: 'Plateformes et partenaires que nous pouvons sourcer',
    logoStripLabel: 'Partenaires de plateformes de communications',
    allianceLine:
      'Lorsque la livraison CX ou centre de contact exige des partenaires spécialisés, ROALLA peut étendre le mandat via le réseau d’alliances—pendant que vous gardez ROALLA comme guide.',
    allianceCta: 'Voir la livraison du réseau d’alliances',
  },
} as const

export default function UnifiedCommunicationsLanding({ locale }: { locale: string }) {
  const language = locale === 'fr' ? 'fr' : 'en'
  const c = copy[language]
  const [challengeId, setChallengeId] = useState<ChallengeId>('missed')
  const challenge = c.challenges[challengeId]
  const challengeEntries = useMemo(
    () => (Object.entries(c.challenges) as [ChallengeId, (typeof c.challenges)[ChallengeId]][]),
    [c.challenges],
  )

  const chooseChallenge = (id: ChallengeId) => {
    setChallengeId(id)
    trackAnalyticsEvent('technology_category_selected', { category: `unified-comms-${id}` })
  }

  const contactHref = {
    pathname: '/contact' as const,
    query: {
      intent: 'consulting',
      focus: 'technology',
      need: 'communications-modernization',
      goal: challenge.label,
      signal: challengeId,
      campaign: 'unified-communications-contact-centres-ai-employees',
      conversion_source: 'unified_comms_landing',
      entry_page: c.metadataPath,
      from_page: c.metadataPath,
    },
  }

  return (
    <div className="page-shell bg-white">
      <main>
        <section data-header-tone="dark" className="relative isolate overflow-hidden bg-slate-950 px-4 pb-20 pt-32 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_20%,rgba(0,180,197,0.28),transparent_34%),radial-gradient(circle_at_18%_88%,rgba(242,193,78,0.18),transparent_30%)]" aria-hidden />
          <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]" aria-hidden />
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <Reveal when="mount">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{c.eyebrow}</p>
              <h1 className="mt-5 max-w-4xl font-serif text-4xl font-bold leading-[1.04] text-white sm:text-5xl lg:text-6xl">{c.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">{c.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#challenge-selector" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-bold text-slate-950 hover:bg-brand-gold-light">
                  {c.primary}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </a>
                <Link href={contactHref} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/15">{c.secondary}</Link>
              </div>
            </Reveal>
            <Reveal when="mount" delayMs={100} className="overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl shadow-black/30">
              <figure>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <Image
                    src="/images/services/unified-communications-contact-centre-hero.webp"
                    alt={c.heroImageAlt}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1023px) 100vw, 42vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/5 to-transparent" aria-hidden />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="max-w-lg font-serif text-xl font-bold leading-tight text-white sm:text-2xl">
                      {c.heroVisualTitle}
                    </p>
                  </figcaption>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-white/10 p-4">
                  {c.capabilityChips.map((chip) => (
                    <span key={chip} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-100">
                      {chip}
                    </span>
                  ))}
                </div>
              </figure>
            </Reveal>
          </div>
          <Reveal when="mount" delayMs={160} className="mx-auto mt-10 grid max-w-6xl gap-3 border-t border-white/15 pt-6 sm:grid-cols-3">
            {c.proof.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">
                  <Check className="h-4 w-4" aria-hidden />
                </span>
                {item}
              </div>
            ))}
          </Reveal>
        </section>

        <UnifiedCommunicationsLogoStrip eyebrow={c.logoStripEyebrow} listLabel={c.logoStripLabel} />

        <div className="border-b border-slate-200 bg-white py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p className="max-w-3xl text-sm leading-6 text-slate-600">{c.allianceLine}</p>
            <Link
              href="/partners/strategic-relationships#alliance-network"
              className="inline-flex shrink-0 items-center text-sm font-semibold text-primary-dark hover:underline"
            >
              {c.allianceCta}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <section id="challenge-selector" className="scroll-mt-24 border-b border-slate-200 bg-slate-50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{c.selectorEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{c.selectorTitle}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{c.selectorLead}</p>
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
              <div role="listbox" aria-label={c.challengeLabel} className="space-y-2">
                {challengeEntries.map(([id, item]) => {
                  const Icon = challengeIcons[id]
                  const selected = id === challengeId
                  return (
                    <button key={id} type="button" role="option" aria-selected={selected} onClick={() => chooseChallenge(id)} className={`flex min-h-16 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${selected ? 'border-slate-950 bg-slate-950 text-white ring-2 ring-slate-950' : 'border-slate-200 bg-white text-slate-800 hover:border-primary/50'}`}>
                      <Icon className={`h-5 w-5 shrink-0 ${selected ? 'text-brand-gold' : 'text-primary-dark'}`} aria-hidden />
                      <span className="flex-1 text-sm font-semibold leading-5">{item.label}</span>
                      {selected ? <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">{c.selected}</span> : null}
                    </button>
                  )
                })}
              </div>
              <div key={challengeId} aria-live="polite" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{c.recommendation}</p>
                <h3 className="mt-3 font-serif text-2xl font-bold text-slate-950 sm:text-3xl">{challenge.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-700">{challenge.body}</p>
                <div className="mt-6 flex gap-3 rounded-xl bg-primary/[0.07] p-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" aria-hidden />
                  <p className="text-sm font-semibold leading-6 text-slate-800">{challenge.result}</p>
                </div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link href={contactHref} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-5 py-3 text-sm font-bold text-white hover:bg-primary-darker">{c.recommendationCta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
                  <a href="#value-brief" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:border-primary">{c.briefCta}</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{c.architectureEyebrow}</p><h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{c.architectureTitle}</h2><p className="mt-4 text-base leading-7 text-slate-600">{c.architectureLead}</p></Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {c.architecture.map(([title, body], index) => {
                const Icon = [PhoneCall, Headphones, Sparkles, ShieldCheck][index]
                return <Reveal key={title} delayMs={index * 50} className="rounded-2xl border border-slate-200 p-5"><Icon className="h-6 w-6 text-primary-dark" aria-hidden /><h3 className="mt-5 font-serif text-xl font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></Reveal>
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{c.pathwayEyebrow}</p><h2 className="mt-3 font-serif text-3xl font-bold text-white sm:text-4xl">{c.pathwayTitle}</h2></Reveal>
            <ol className="mt-10 grid gap-8 lg:grid-cols-4">
              {c.pathway.map(([title, body], index) => <Reveal as="li" key={title} delayMs={index * 50} className="border-t border-white/20 pt-5"><span className="text-xs font-bold tracking-[0.18em] text-brand-gold">0{index + 1}</span><h3 className="mt-3 font-serif text-xl font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{body}</p></Reveal>)}
            </ol>
          </div>
        </section>

        <section id="value-brief" className="scroll-mt-24 bg-slate-50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{c.assessmentEyebrow}</p><h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{c.assessmentTitle}</h2><p className="mt-4 text-base leading-7 text-slate-600">{c.assessmentLead}</p></Reveal>
            <div className="mt-10"><CommunicationsValueBrief locale={language} /></div>
          </div>
        </section>

        <section id="advisor-form" className="scroll-mt-24 border-t border-slate-200 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{c.inquiryEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{c.inquiryTitle}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{c.inquiryLead}</p>
              <div className="mt-7 rounded-xl border border-primary/20 bg-primary/[0.06] p-4"><p className="text-xs font-bold uppercase tracking-wider text-primary-dark">{c.selected}</p><p className="mt-2 font-semibold text-slate-900">{challenge.label}</p></div>
            </Reveal>
            <div key={challengeId} className="rounded-2xl border border-slate-200 bg-white shadow-sm"><ConsultationRequestForm initialIntent="consulting" initialFocus="technology" initialGoal={challenge.label} initialSourcePage={`${c.metadataPath}?selected_problem=${challengeId}&campaign=unified-communications-contact-centres-ai-employees`} initialQuickMode /></div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><h2 className="font-serif text-2xl font-bold text-slate-950">{c.relatedTitle}</h2><div className="flex flex-col gap-3 sm:flex-row"><Link href="/services/technology-advisory" className="inline-flex min-h-11 items-center font-bold text-primary-dark hover:underline">{c.techLink}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link><Link href="/ai-employee" className="inline-flex min-h-11 items-center font-bold text-primary-dark hover:underline">{c.aiLink}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link></div></div>
        </section>
      </main>
    </div>
  )
}

