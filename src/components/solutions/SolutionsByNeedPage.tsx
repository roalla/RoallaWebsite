'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Compass,
  ExternalLink,
  Layers3,
  Route,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { isCaseStudySlug } from '@/lib/portfolio-case-studies'
import { outcomeGroups, type OutcomeGroupId } from '@/lib/solution-outcome-pages'
import type { SolutionsByNeedContent } from '@/lib/solutions-by-need'
import OutcomeGroupPanel from '@/components/solutions/OutcomeGroupPanel'
import StickyMobileCTA from '@/components/StickyMobileCTA'

const experienceCopy = {
  en: {
    heroTitle: 'What does your business need to do next?',
    heroBody: 'Choose the outcome that matters now. ROALLA turns the pressure, opportunity, or technology decision into a practical route forward.',
    heroExplore: 'Find my starting point',
    heroTalk: 'Talk through my priorities',
    heroProofBadge: 'Real ROALLA products',
    heroProofTitle: 'See the work behind the advice.',
    heroProofLink: 'View published work',
    mobileCtaHint: 'Choose the closest of five business outcomes',
    heroVisualEyebrow: 'From pressure to progress',
    heroVisualTitle: 'One connected route—not another disconnected project.',
    priorityLabel: 'Business priority',
    priorityValue: 'A result that needs to move',
    routeLabel: 'ROALLA route',
    routeSteps: ['Clarify', 'Compare', 'Activate'],
    routeResult: 'An owned next step',
    proofLabel: 'Why leaders can start here',
    proof: [
      { value: 'Published work', label: 'websites, applications, and tools you can inspect' },
      { value: 'Transparent scope', label: 'clear distinctions between products, examples, and client work' },
      { value: 'Practical route', label: 'from the business need to an owned next step' },
    ],
    processEyebrow: 'How ROALLA helps',
    processTitle: 'Move from a business need to a decision your team can use.',
    processBody: 'The exact scope changes with the situation. The working rhythm stays grounded in the outcome, the evidence, and the people responsible for implementation.',
    processSteps: [
      { title: 'Frame the outcome', body: 'Confirm what must improve, the constraints, and how progress will be recognized.' },
      { title: 'Build the evidence', body: 'Assess the current state and compare viable approaches against the same criteria.' },
      { title: 'Choose the route', body: 'Turn the decision into clear requirements, qualified options, and practical trade-offs.' },
      { title: 'Activate and improve', body: 'Move forward with owners, milestones, implementation support, and a useful review rhythm.' },
    ],
    finderEyebrow: 'Choose the change that matters now',
    finderHint: 'Open the closest match. You can refine the need with evidence before starting a conversation.',
    selectedLabel: 'Explore this outcome',
    portfolioEyebrow: 'Evidence you can inspect',
    portfolioTitle: 'See what ROALLA has built.',
    portfolioBody: 'ROALLA is a new business. These published products are the evidence available today: working experiences that demonstrate product thinking, design, implementation, and clear paths to action.',
    portfolioDisclosure: 'ROALLA-built product examples—not client performance claims.',
    portfolioBadge: 'ROALLA-built product',
    portfolioCaseStudy: 'View the case study',
    portfolioLive: 'Open the live product',
    portfolioAll: 'Explore all websites and applications',
    portfolioItems: [
      { slug: 'my360vision', title: 'My360Vision', type: 'Multi-industry IoT & telematics platform', image: '/360visionsnapshot.jpg', liveUrl: 'https://www.my360vision.com/', description: 'One connected-asset platform for devices, sensors, and mobile assets—industry profiles unlock monitoring, alerts, and operational workflows.' },
      { slug: 'pitch-hotshots', title: 'Pitch Hotshots', type: 'AI-assisted practice application', image: '/pitchhotshotsnapshot.webp', liveUrl: 'https://www.pitchhotshot.com/', description: 'Combines guided practice, scoring, delivery metrics, and structured feedback in one experience.' },
      { slug: 'boothlio', title: 'Boothlio', type: 'Event experience platform', image: '/boothlio-pic.webp', liveUrl: 'https://boothlio.com', description: 'Connects on-site engagement, information capture, and follow-up around a defined event journey.' },
      { slug: 'grcstatus', title: 'GRC Status', type: 'Compliance readiness application', image: '/grcstatussnapshot.jpg', liveUrl: 'https://www.grcstatus.com/', description: 'Organizes control questions, evidence, ownership, and readiness into a practical starting point.' },
      { slug: 'unjargonit', title: 'UnJargon It', type: 'Plain-language learning application', image: '/unjargonitsnapshot.jpg', liveUrl: 'https://www.unjargonit.com/', description: 'Uses guided learning tracks, progress views, and hands-on experiences to make technology easier to understand.' },
    ],
    deliverablesEyebrow: 'Tangible progress',
    deliverablesTitle: 'Leave with more than recommendations.',
    deliverablesBody: 'ROALLA connects advice to implementation so the next decision is understandable, comparable, and owned.',
    deliverables: [
      { title: 'Direction you can defend', body: 'A clearly framed outcome, success measures, constraints, and a prioritized decision path.' },
      { title: 'Options you can compare', body: 'Consistent requirements and qualified approaches evaluated across value, risk, cost, and adoption.' },
      { title: 'Execution you can own', body: 'An actionable roadmap with responsibilities, milestones, implementation support, and review points.' },
    ],
    deliverableLabel: 'Illustrative deliverable',
    founderEyebrow: 'Building the track record openly',
    founderTitle: 'A new firm with visible work and a transparent approach.',
    founderBody: 'ROALLA will add customer results only when they exist and can be supported. Until then, credibility comes from published products, working tools, clear methods, and an honest explanation of what each example demonstrates.',
    closingSecondary: 'Discuss your priorities',
  },
  fr: {
    heroTitle: 'Que doit accomplir votre entreprise maintenant?',
    heroBody: 'Choisissez le résultat qui compte aujourd’hui. ROALLA transforme la pression, l’occasion ou la décision technologique en parcours pratique.',
    heroExplore: 'Trouver mon point de départ',
    heroTalk: 'Discuter de mes priorités',
    heroProofBadge: 'De vrais produits ROALLA',
    heroProofTitle: 'Voyez les réalisations derrière les conseils.',
    heroProofLink: 'Voir les travaux publiés',
    mobileCtaHint: 'Choisissez le plus proche de cinq résultats d’affaires',
    heroVisualEyebrow: 'De la pression au progrès',
    heroVisualTitle: 'Un parcours connecté—pas un autre projet isolé.',
    priorityLabel: 'Priorité d’affaires',
    priorityValue: 'Un résultat qui doit progresser',
    routeLabel: 'Parcours ROALLA',
    routeSteps: ['Clarifier', 'Comparer', 'Activer'],
    routeResult: 'Une prochaine étape assumée',
    proofLabel: 'Pourquoi les dirigeants peuvent commencer ici',
    proof: [
      { value: 'Travaux publiés', label: 'sites, applications et outils que vous pouvez examiner' },
      { value: 'Portée transparente', label: 'distinction claire entre produits, exemples et travail client' },
      { value: 'Parcours pratique', label: 'du besoin d’affaires à une prochaine étape assumée' },
    ],
    processEyebrow: 'Comment ROALLA aide',
    processTitle: 'Passer d’un besoin d’affaires à une décision que l’équipe peut appliquer.',
    processBody: 'La portée exacte varie selon la situation. Le rythme de travail demeure ancré dans le résultat, les faits et les personnes responsables de la mise en œuvre.',
    processSteps: [
      { title: 'Cadrer le résultat', body: 'Confirmer ce qui doit s’améliorer, les contraintes et la façon de reconnaître le progrès.' },
      { title: 'Établir les preuves', body: 'Évaluer la situation actuelle et comparer les approches viables selon les mêmes critères.' },
      { title: 'Choisir le parcours', body: 'Transformer la décision en exigences claires, options qualifiées et compromis pratiques.' },
      { title: 'Activer et améliorer', body: 'Avancer avec des responsables, des jalons, un soutien de mise en œuvre et un rythme de revue utile.' },
    ],
    finderEyebrow: 'Choisissez le changement qui compte maintenant',
    finderHint: 'Ouvrez le besoin le plus proche. Vous pourrez le préciser avec des preuves avant d’entamer une conversation.',
    selectedLabel: 'Explorer ce résultat',
    portfolioEyebrow: 'Des preuves à examiner',
    portfolioTitle: 'Voyez ce que ROALLA a réalisé.',
    portfolioBody: 'ROALLA est une nouvelle entreprise. Ces produits publiés constituent les preuves disponibles aujourd’hui : des expériences fonctionnelles qui démontrent la réflexion produit, la conception, la mise en œuvre et des parcours d’action clairs.',
    portfolioDisclosure: 'Exemples de produits réalisés par ROALLA—et non des résultats de clients.',
    portfolioBadge: 'Produit réalisé par ROALLA',
    portfolioCaseStudy: 'Voir l’étude de cas',
    portfolioLive: 'Ouvrir le produit',
    portfolioAll: 'Explorer tous les sites et applications',
    portfolioItems: [
      { slug: 'my360vision', title: 'My360Vision', type: 'Plateforme IoT et télématique multi-industries', image: '/360visionsnapshot.jpg', liveUrl: 'https://www.my360vision.com/', description: 'Une plateforme d’actifs connectés pour appareils, capteurs et actifs mobiles—des profils industriels débloquent surveillance, alertes et flux opérationnels.' },
      { slug: 'pitch-hotshots', title: 'Pitch Hotshots', type: 'Application de pratique assistée par l’IA', image: '/pitchhotshotsnapshot.webp', liveUrl: 'https://www.pitchhotshot.com/', description: 'Réunit pratique guidée, notation, mesures de prestation et rétroaction structurée dans une même expérience.' },
      { slug: 'boothlio', title: 'Boothlio', type: 'Plateforme d’expérience événementielle', image: '/boothlio-pic.webp', liveUrl: 'https://boothlio.com', description: 'Relie l’engagement sur place, la collecte d’information et le suivi autour d’un parcours événementiel défini.' },
      { slug: 'grcstatus', title: 'GRC Status', type: 'Application de préparation à la conformité', image: '/grcstatussnapshot.jpg', liveUrl: 'https://www.grcstatus.com/', description: 'Organise les questions de contrôle, les preuves, les responsabilités et la préparation en point de départ pratique.' },
      { slug: 'unjargonit', title: 'UnJargon It', type: 'Application d’apprentissage en langage clair', image: '/unjargonitsnapshot.jpg', liveUrl: 'https://www.unjargonit.com/', description: 'Utilise des parcours guidés, des vues de progression et des expériences pratiques pour rendre la technologie plus accessible.' },
    ],
    deliverablesEyebrow: 'Un progrès tangible',
    deliverablesTitle: 'Repartez avec plus que des recommandations.',
    deliverablesBody: 'ROALLA relie le conseil à la mise en œuvre afin que la prochaine décision soit compréhensible, comparable et assumée.',
    deliverables: [
      { title: 'Une direction que vous pouvez défendre', body: 'Un résultat clairement cadré, des mesures de succès, des contraintes et un parcours décisionnel priorisé.' },
      { title: 'Des options que vous pouvez comparer', body: 'Des exigences cohérentes et des approches qualifiées évaluées selon la valeur, le risque, le coût et l’adoption.' },
      { title: 'Une exécution que vous pouvez assumer', body: 'Une feuille de route réalisable avec responsabilités, jalons, soutien de mise en œuvre et points de revue.' },
    ],
    deliverableLabel: 'Livrable illustratif',
    founderEyebrow: 'Bâtir la feuille de route ouvertement',
    founderTitle: 'Une nouvelle entreprise avec des travaux visibles et une approche transparente.',
    founderBody: 'ROALLA ajoutera des résultats clients seulement lorsqu’ils existeront et pourront être étayés. D’ici là, la crédibilité repose sur des produits publiés, des outils fonctionnels, des méthodes claires et une explication honnête de ce que chaque exemple démontre.',
    closingSecondary: 'Discuter de vos priorités',
  },
} as const

const groupPresentation: Record<OutcomeGroupId, { icon: typeof SearchCheck; accent: string; number: string }> = {
  'growth-visibility': { icon: SearchCheck, accent: 'from-cyan-500/20 to-primary/10', number: '01' },
  'experience-products': { icon: Layers3, accent: 'from-violet-500/20 to-primary/10', number: '02' },
  'automation-ai': { icon: Workflow, accent: 'from-amber-400/20 to-primary/10', number: '03' },
  'security-compliance': { icon: ShieldCheck, accent: 'from-emerald-500/20 to-primary/10', number: '04' },
  execution: { icon: Target, accent: 'from-blue-500/20 to-primary/10', number: '05' },
}

const proofPresentation = [
  { icon: Sparkles, card: 'border-cyan-200 bg-cyan-50', iconWrap: 'bg-cyan-500 text-white' },
  { icon: ShieldCheck, card: 'border-amber-200 bg-amber-50', iconWrap: 'bg-brand-gold text-slate-950' },
  { icon: Route, card: 'border-violet-200 bg-violet-50', iconWrap: 'bg-violet-600 text-white' },
] as const

const processPresentation = [
  { icon: Compass, card: 'border-slate-800 bg-slate-950', badge: 'bg-brand-gold text-slate-950', title: 'text-white', body: 'text-slate-300' },
  { icon: SearchCheck, card: 'border-cyan-200 bg-cyan-50', badge: 'bg-cyan-500 text-white', title: 'text-slate-950', body: 'text-slate-700' },
  { icon: Route, card: 'border-amber-200 bg-amber-50', badge: 'bg-brand-gold text-slate-950', title: 'text-slate-950', body: 'text-slate-700' },
  { icon: Target, card: 'border-primary-dark bg-primary-dark', badge: 'bg-white text-primary-dark', title: 'text-white', body: 'text-cyan-50' },
] as const

export default function SolutionsByNeedPage({ content, locale }: { content: SolutionsByNeedContent; locale: 'en' | 'fr' }) {
  const groups = outcomeGroups[locale]
  const copy = experienceCopy[locale]
  const stepTwo = locale === 'fr' ? 'Cadrez le résultat, puis commencez par des preuves' : 'Frame the outcome, then start with evidence'
  const openLabel = (count: number) => locale === 'fr' ? `${count} parcours` : `${count} ${count === 1 ? 'path' : 'paths'}`
  const [openId, setOpenId] = useState<string>('')
  const [hashHighlight, setHashHighlight] = useState<OutcomeGroupId | null>(null)

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (!hash) return
      const matched = groups.find((group) => group.id === hash)
      if (matched) {
        setOpenId(matched.id)
        setHashHighlight(matched.id)
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [groups])

  return (
    <div className="page-shell bg-white">
      <section data-header-tone="dark" className="relative isolate overflow-hidden bg-slate-950 px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-36">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_28%,rgba(8,184,199,0.18),transparent_32%),radial-gradient(circle_at_12%_90%,rgba(14,116,144,0.16),transparent_28%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:64px_64px]" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(390px,.95fr)] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-light">{content.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl font-serif text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl xl:text-7xl">{copy.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">{copy.heroBody}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#outcome-finder" onClick={() => trackAnalyticsEvent('outcome_cta_click', { location: 'solutions_hero_finder' })} className="inline-flex min-h-[50px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-brand-gold/10 transition hover:-translate-y-0.5 hover:bg-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {copy.heroExplore}<ArrowDown className="ml-2 h-4 w-4" aria-hidden />
              </a>
              <Link href="/contact" onClick={() => trackAnalyticsEvent('outcome_cta_click', { location: 'solutions_hero_contact' })} className="inline-flex min-h-[50px] items-center justify-center rounded-lg border border-white/25 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {copy.heroTalk}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl pb-24 sm:pb-28 lg:mx-0" aria-label={copy.heroProofTitle}>
            <div className="absolute -inset-8 -z-10 rounded-full bg-primary/20 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white p-3 shadow-2xl shadow-black/40 sm:p-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] bg-slate-200">
                <Image
                  src={copy.portfolioItems[0].image}
                  alt={`${copy.portfolioItems[0].title} — ${copy.portfolioItems[0].type}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 44vw, 92vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent px-5 pb-5 pt-20 text-white sm:block">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-primary-light">{copy.heroProofBadge}</p>
                  <p className="mt-1 font-serif text-xl font-bold sm:text-2xl">{copy.heroProofTitle}</p>
                  <a
                    href="#published-work"
                    className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-brand-gold px-4 text-xs font-bold text-slate-950 transition hover:bg-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {copy.heroProofLink}
                    <ArrowDown className="ml-2 h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-2 w-[45%] rotate-[-3deg] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl shadow-black/35 transition duration-300 hover:rotate-0 sm:left-5">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                <Image src={copy.portfolioItems[1].image} alt={`${copy.portfolioItems[1].title} — ${copy.portfolioItems[1].type}`} fill sizes="260px" className="object-cover object-top" />
              </div>
              <p className="truncate px-3 py-2 text-xs font-bold text-slate-950">{copy.portfolioItems[1].title}</p>
            </div>
            <div className="absolute bottom-2 right-2 w-[43%] rotate-[3deg] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl shadow-black/35 transition duration-300 hover:rotate-0 sm:right-5">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                <Image src={copy.portfolioItems[2].image} alt={`${copy.portfolioItems[2].title} — ${copy.portfolioItems[2].type}`} fill sizes="250px" className="object-cover object-top" />
              </div>
              <p className="truncate px-3 py-2 text-xs font-bold text-slate-950">{copy.portfolioItems[2].title}</p>
            </div>

            <span className="absolute -right-2 -top-4 inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-slate-950 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-gold shadow-lg sm:right-3">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {copy.heroProofBadge}
            </span>
          </div>
        </div>
      </section>

      <section aria-label={copy.proofLabel} className="relative z-10 bg-white px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto -mt-7 max-w-7xl rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-950/10 sm:p-6">
          <p className="px-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-slate-500">{copy.proofLabel}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {copy.proof.map((item, index) => {
              const presentation = proofPresentation[index]
              const Icon = presentation.icon
              return (
                <div key={item.value} className={`flex gap-4 rounded-2xl border p-5 ${presentation.card}`}>
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${presentation.iconWrap}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-serif text-lg font-extrabold text-slate-950">{item.value}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">{item.label}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-cyan-50 via-white to-amber-50 px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-dark">{copy.processEyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">{copy.processTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{copy.processBody}</p>
          </div>
          <div className="relative mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-primary/20 via-primary to-primary/20 xl:block" aria-hidden />
            {copy.processSteps.map((step, index) => {
              const presentation = processPresentation[index]
              const Icon = presentation.icon
              return (
                <article key={step.title} className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${presentation.card}`}>
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" aria-hidden />
                  <span className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ${presentation.badge}`}>
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <p className={`mt-5 text-[0.65rem] font-bold uppercase tracking-[0.18em] ${presentation.title}`}>0{index + 1}</p>
                  <h3 className={`mt-2 font-serif text-xl font-bold ${presentation.title}`}>{step.title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${presentation.body}`}>{step.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="published-work" className="scroll-mt-24 border-y border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-dark">{copy.portfolioEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">{copy.portfolioTitle}</h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-slate-600">{copy.portfolioBody}</p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-lighter/40 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-primary-dark">
                <Check className="h-3.5 w-3.5" aria-hidden />
                {copy.portfolioDisclosure}
              </p>
            </div>
          </div>

          <div className="mt-10 grid auto-cols-[88%] grid-flow-col gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:auto-cols-auto md:grid-flow-row md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0">
            {copy.portfolioItems.map((item) => (
              <article key={item.slug} className="group snap-start overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                <div className="relative aspect-[16/8.5] overflow-hidden border-b border-slate-200 bg-slate-200">
                  <Image
                    src={item.image}
                    alt={`${item.title} — ${item.type}`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/55 to-transparent" aria-hidden />
                  <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-slate-950/75 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                    {copy.portfolioBadge}
                  </span>
                </div>
                <div className="p-6 sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{item.type}</p>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Link
                      href={
                        isCaseStudySlug(item.slug)
                          ? { pathname: '/services/portfolio/[slug]', params: { slug: item.slug } }
                          : { pathname: '/services/portfolio', hash: item.slug }
                      }
                      onClick={() => trackAnalyticsEvent('solutions_pathway_click', { location: 'solutions_published_work', pathway: item.slug })}
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {copy.portfolioCaseStudy}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackAnalyticsEvent('solutions_tool_click', { location: 'solutions_published_work', tool: item.slug })}
                      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-primary/40 hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {copy.portfolioLive}
                      <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/services/portfolio"
              onClick={() => trackAnalyticsEvent('solutions_pathway_click', { location: 'solutions_published_work_all', pathway: 'portfolio' })}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 font-semibold text-slate-950 transition hover:border-primary/40 hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {copy.portfolioAll}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section id="outcome-finder" aria-labelledby="finder-title" className="relative isolate scroll-mt-24 overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(8,184,199,0.2),transparent_28%),radial-gradient(circle_at_88%_78%,rgba(245,158,11,0.12),transparent_25%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-light">{copy.finderEyebrow}</p>
              <h2 id="finder-title" className="mt-3 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">{content.pathwaysTitle}</h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-3xl text-lg leading-8 text-slate-300">{content.pathwaysDescription}</p>
              <p className="mt-3 flex max-w-3xl gap-2 text-sm leading-6 text-slate-400"><Route className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden />{copy.finderHint}</p>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {groups.map((group) => {
              const pathways = group.pathwayIds.map((id) => content.pathways.find((pathway) => pathway.id === id)).filter((pathway): pathway is NonNullable<typeof pathway> => Boolean(pathway))
              const isOpen = openId === group.id
              const presentation = groupPresentation[group.id]
              const Icon = presentation.icon
              return (
                <details id={group.id} key={group.id} open={isOpen} onToggle={(event) => {
                  const nextOpen = event.currentTarget.open
                  if (nextOpen) {
                    setOpenId(group.id)
                    trackAnalyticsEvent('outcome_selection', { location: 'solutions_group_open', group: group.id, outcome: group.id })
                  } else if (openId === group.id) setOpenId('')
                }} className="group scroll-mt-28 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 open:border-primary/30 open:shadow-xl open:shadow-slate-950/5">
                  <summary className={`relative flex cursor-pointer list-none items-center gap-4 overflow-hidden bg-gradient-to-r ${presentation.accent} p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:gap-6 sm:p-7`}>
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-white/80 text-primary-dark shadow-sm backdrop-blur sm:h-16 sm:w-16"><Icon className="h-7 w-7" strokeWidth={1.7} aria-hidden /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500">{presentation.number}</span>
                        <span className="rounded-full border border-primary/20 bg-white/70 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-primary-dark">{openLabel(pathways.length)}</span>
                      </span>
                      <span className="mt-2 block font-serif text-xl font-bold leading-tight text-slate-950 sm:text-2xl">{group.title}</span>
                      <span className="mt-2 hidden max-w-4xl leading-7 text-slate-600 sm:block">{group.description}</span>
                    </span>
                    <span className="ml-auto hidden items-center gap-2 text-sm font-semibold text-primary-dark lg:flex">{copy.selectedLabel}<ChevronDown className="h-5 w-5 transition group-open:rotate-180" aria-hidden /></span>
                    <ChevronDown className="ml-auto h-5 w-5 shrink-0 text-primary-dark transition group-open:rotate-180 lg:hidden" aria-hidden />
                  </summary>
                  <div className="border-t border-slate-200 bg-white px-5 pb-7 pt-6 sm:px-7 lg:px-9 lg:pb-9">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{stepTwo}</p>
                    <OutcomeGroupPanel groupId={group.id} locale={locale} highlighted={hashHighlight === group.id} />
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-dark">{copy.deliverablesEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">{copy.deliverablesTitle}</h2>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">{copy.deliverablesBody}</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {copy.deliverables.map((item, index) => {
              const icons = [Compass, BarChart3, Route]
              const Icon = icons[index]
              return (
                <article key={item.title} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 transition duration-500 group-hover:scale-125" aria-hidden />
                  <Icon className="relative h-8 w-8 text-primary-dark" strokeWidth={1.6} aria-hidden />
                  <p className="relative mt-7 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-primary-dark">{copy.deliverableLabel}</p>
                  <h3 className="relative mt-2 font-serif text-2xl font-bold text-slate-950">{item.title}</h3>
                  <p className="relative mt-4 leading-7 text-slate-600">{item.body}</p>
                  <div className="relative mt-7 h-1 w-12 rounded-full bg-brand-gold transition-all duration-300 group-hover:w-24" aria-hidden />
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary-lighter/55 via-white to-cyan-50 p-7 sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden />
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-dark">{copy.founderEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">{copy.founderTitle}</h2>
            </div>
            <p className="text-lg leading-8 text-slate-700">{copy.founderBody}</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(8,184,199,0.18),transparent_34%)]" aria-hidden />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-light">{content.closingEyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-white sm:text-4xl">{content.closingTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-200">{content.closingDescription}</p>
            <p className="mt-4 flex gap-2 text-sm leading-6 text-slate-300"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" aria-hidden />{content.assessmentPrompt}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href="/assessment" onClick={() => trackAnalyticsEvent('solutions_assessment_click', { location: 'solutions_closing' })} className="inline-flex min-h-[50px] items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
              {content.heroPrimary}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            <Link href="/contact" onClick={() => trackAnalyticsEvent('outcome_cta_click', { location: 'solutions_closing_contact' })} className="inline-flex min-h-[50px] items-center justify-center rounded-lg border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {copy.closingSecondary}
            </Link>
          </div>
        </div>
      </section>

      <StickyMobileCTA
        label={copy.heroExplore}
        sublabel={copy.mobileCtaHint}
        anchorHref="#outcome-finder"
        brandMark
        analyticsEvent="outcome_cta_click"
        analyticsParams={{ location: 'solutions_mobile_sticky' }}
      />
    </div>
  )
}
