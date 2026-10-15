'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronRight, Download, Gauge, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type Props = {
  locale: string
  title: string
  summary: string
  readTime: string
  category: string
}

type Copy = {
  eyebrow: string
  dek: string
  thesis: string
  thesisBody: string
  navLabel: string
  signals: string
  implication: string
  move: string
  trends: { id: string; title: string; statement: string; signal: string; implication: string; move: string }[]
  assessmentTitle: string
  assessmentIntro: string
  assessmentFactors: { name: string; prompt: string }[]
  scoreLabel: string
  scorePrompt: string
  scoreBands: { min: number; title: string; body: string }[]
  roadmapTitle: string
  roadmapIntro: string
  roadmap: { days: string; title: string; items: string[] }[]
  principlesTitle: string
  principles: string[]
  sourcesTitle: string
  sourcesIntro: string
  download: string
  conversation: string
  ctaTitle: string
  ctaBody: string
  cta: string
}

const EN: Copy = {
  eyebrow: 'ROALLA Executive Insight · 2027 Outlook',
  dek: 'Seven shifts will separate websites that merely publish information from digital experiences that create trust, answer intent and improve operations.',
  thesis: 'The executive thesis',
  thesisBody: 'By 2027, the strongest web platforms will be designed for two audiences at once: people making decisions and machines helping them make those decisions. The advantage will not come from chasing every new interface. It will come from building a clear, fast, accessible and governable digital foundation that can adapt as discovery, interaction and automation evolve.',
  navLabel: 'Explore the seven trends',
  signals: 'What is changing',
  implication: 'Executive implication',
  move: 'What to do now',
  trends: [
    { id: 'answer-ready', title: 'Answer-ready content becomes infrastructure', statement: 'Content architecture will be evaluated by how clearly it serves people, search systems and AI-assisted discovery.', signal: 'Structured data, explicit authorship, stable URLs and concise factual modules give machines stronger context while improving scanning for human readers.', implication: 'Content operations, SEO and product design become one governance problem. Unstructured pages and conflicting claims create discovery risk.', move: 'Create a governed content model for services, evidence, expertise, dates and ownership. Add Article and Organization markup where it represents visible page content.' },
    { id: 'adaptive', title: 'Adaptive journeys replace generic personalization', statement: 'Useful adaptation will respond to intent and context without turning the experience into surveillance.', signal: 'Teams can tailor pathways by declared goals, session behaviour and first-party signals while collecting less durable personal data.', implication: 'The strategic question shifts from “How much can we know?” to “What is the minimum context required to help?”', move: 'Define permitted signals, their purpose and expiry. Design a valuable default journey before adding adaptive layers.' },
    { id: 'native', title: 'The browser becomes a richer application surface', statement: 'Maturing platform capabilities will make polished transitions, local computation and immersive visualization more practical.', signal: 'View transitions are broadly available in current browsers, while WebGPU opens higher-performance rendering and computation with progressive enhancement still required.', implication: 'Experiences can feel more capable without automatically adopting a heavier application stack.', move: 'Use capability detection and measure business value. Keep the core task available when a newer browser feature is absent or motion is reduced.' },
    { id: 'performance', title: 'Performance becomes a product operating metric', statement: 'Speed will be managed in real user conditions, not celebrated from a single lab score.', signal: 'Core Web Vitals tie loading, responsiveness and stability to field thresholds: LCP, INP and CLS at the 75th percentile.', implication: 'Marketing, design and engineering share the performance budget. Every new tag, font and interaction has an operating cost.', move: 'Set experience budgets, monitor field data by template and give one owner authority to stop regressions before release.' },
    { id: 'inclusive', title: 'Accessibility moves upstream', statement: 'Inclusive design will be treated as a product-quality system rather than a compliance pass at the end.', signal: 'WCAG 2.2 adds criteria for focus, dragging, target size, consistent help and accessible authentication.', implication: 'Accessible patterns reduce redesign, expand usable reach and make interfaces more robust for people and automated agents.', move: 'Put accessibility acceptance criteria into design and delivery. Test keyboard, zoom, screen reader semantics, contrast and reduced motion.' },
    { id: 'trust', title: 'Trust engineering shapes conversion', statement: 'Security, privacy and provenance will be visible experience qualities, not buried technical controls.', signal: 'OWASP continues to foreground systemic web application risks, while W3C privacy principles call for purpose limitation, meaningful consent and transparent data use.', implication: 'A persuasive journey that feels extractive or fragile creates commercial friction. Trust signals must match actual operating practices.', move: 'Map data flows, minimize collection, harden dependencies and explain high-impact automation or personalization in plain language.' },
    { id: 'sustainable', title: 'Sustainable systems win on economics', statement: 'Lower-complexity digital estates will create environmental, financial and delivery advantages.', signal: 'W3C sustainability guidance connects UX, development, hosting, infrastructure and product management rather than reducing the issue to hosting claims.', implication: 'Duplicate platforms, oversized media and abandoned features are both carbon and operating-cost liabilities.', move: 'Retire unused journeys, compress media, prefer durable components and track cost, performance and value together.' },
  ],
  assessmentTitle: 'Seven-factor readiness assessment',
  assessmentIntro: 'Rate the current state of your digital experience. The result is directional, not a certification; use it to identify the first executive conversation.',
  assessmentFactors: [
    { name: 'Content intelligence', prompt: 'Our content is structured, current, attributable and machine-readable.' },
    { name: 'Journey relevance', prompt: 'We can guide different visitor intents without invasive data collection.' },
    { name: 'Platform capability', prompt: 'Our architecture supports progressive enhancement and controlled experimentation.' },
    { name: 'Performance discipline', prompt: 'We measure real-user performance and enforce budgets across releases.' },
    { name: 'Inclusive quality', prompt: 'Accessibility criteria are built into design, development and testing.' },
    { name: 'Trust controls', prompt: 'Privacy, security and automation governance are visible and owned.' },
    { name: 'Sustainable operations', prompt: 'We retire low-value complexity and manage lifecycle cost deliberately.' },
  ],
  scoreLabel: 'Readiness score',
  scorePrompt: 'Complete all seven ratings to reveal your readiness position.',
  scoreBands: [
    { min: 80, title: 'Adaptive leader', body: 'Your foundation can support targeted innovation. Focus on evidence, governance and controlled scale.' },
    { min: 60, title: 'Foundation in motion', body: 'You have useful capabilities, but inconsistent ownership or measurement may limit the result.' },
    { min: 40, title: 'Fragmented readiness', body: 'Priority gaps are likely creating cost, risk or missed demand. Sequence the foundation before adding more features.' },
    { min: 0, title: 'Reset required', body: 'Clarify outcomes, owners and core standards before investing in advanced experience layers.' },
  ],
  roadmapTitle: 'A practical 90-day roadmap',
  roadmapIntro: 'The goal is not a 2027 redesign project. It is a short cycle that establishes evidence, fixes the most important constraint and creates an operating rhythm.',
  roadmap: [
    { days: 'Days 1–30', title: 'Diagnose and decide', items: ['Baseline seven readiness factors and three priority journeys.', 'Inventory analytics, structured data, accessibility, performance and data collection.', 'Name one executive sponsor and one accountable experience owner.', 'Choose a measurable business outcome and define guardrails.'] },
    { days: 'Days 31–60', title: 'Build the foundation', items: ['Repair the highest-value content and navigation path.', 'Implement semantic structure, Article metadata and performance budgets.', 'Resolve critical keyboard, contrast, focus and form barriers.', 'Remove at least one low-value dependency, tag or duplicated journey.'] },
    { days: 'Days 61–90', title: 'Prove and operationalize', items: ['Release one adaptive or interactive improvement behind clear controls.', 'Measure field performance, completion, qualified action and support impact.', 'Document a reusable pattern and a decision log.', 'Approve the next-quarter portfolio based on evidence, not novelty.'] },
  ],
  principlesTitle: 'Five principles for the investment portfolio',
  principles: ['Design the default journey before the adaptive one.', 'Publish evidence, ownership and dates - not unsupported authority.', 'Progressively enhance every emerging capability.', 'Treat accessibility, privacy and performance as product requirements.', 'Retire complexity as deliberately as you add capability.'],
  sourcesTitle: 'Evidence and source notes',
  sourcesIntro: 'This outlook is a forward-looking interpretation of current web standards and platform signals. It is not a claim that every capability will mature on the same schedule.',
  download: 'Get the executive PDF',
  conversation: 'Use the assessment in a leadership workshop',
  ctaTitle: 'Make the next 90 days more valuable than the next trend list.',
  ctaBody: 'ROALLA helps teams connect digital experience, technology choices and operating discipline to measurable business outcomes.',
  cta: 'Start a strategic conversation',
}

const FR: Copy = {
  ...EN,
  eyebrow: 'Perspective ROALLA pour dirigeants · Prévisions 2027',
  dek: 'Sept changements distingueront les sites qui publient simplement de l’information des expériences numériques qui créent de la confiance, répondent aux intentions et améliorent les opérations.',
  thesis: 'La thèse pour les dirigeants',
  thesisBody: 'D’ici 2027, les plateformes Web les plus solides seront conçues pour deux publics à la fois : les personnes qui prennent des décisions et les machines qui les aident. L’avantage ne viendra pas de chaque nouvelle interface, mais d’une fondation numérique claire, rapide, accessible et gouvernable.',
  navLabel: 'Explorer les sept tendances', signals: 'Ce qui change', implication: 'Incidence pour la direction', move: 'À faire maintenant',
  trends: [
    { id: 'answer-ready', title: 'Le contenu prêt pour les réponses devient une infrastructure', statement: 'L’architecture de contenu sera jugée sur sa capacité à servir les personnes, la recherche et la découverte assistée par l’IA.', signal: 'Les données structurées, les auteurs explicites, les URL stables et les faits concis offrent un meilleur contexte aux machines et aux lecteurs.', implication: 'Les opérations de contenu, le référencement et la conception produit deviennent un même enjeu de gouvernance.', move: 'Créez un modèle gouverné pour les services, les preuves, l’expertise, les dates et la responsabilité.' },
    { id: 'adaptive', title: 'Les parcours adaptatifs remplacent la personnalisation générique', statement: 'Une adaptation utile répondra à l’intention et au contexte sans transformer l’expérience en surveillance.', signal: 'Les équipes peuvent adapter les parcours selon les objectifs déclarés et les signaux de première partie, tout en conservant moins de données.', implication: 'La question passe de « Que pouvons-nous savoir? » à « Quel est le contexte minimal pour aider? »', move: 'Définissez les signaux permis, leur objectif et leur expiration. Concevez d’abord un excellent parcours par défaut.' },
    { id: 'native', title: 'Le navigateur devient une surface applicative plus riche', statement: 'Des capacités plus mûres rendent les transitions, le calcul local et la visualisation immersive plus pratiques.', signal: 'Les transitions de vue sont largement disponibles et WebGPU ouvre le rendu performant, toujours avec amélioration progressive.', implication: 'Une expérience peut gagner en capacité sans adopter automatiquement une architecture plus lourde.', move: 'Détectez les capacités et mesurez la valeur. Gardez la tâche principale disponible sans fonction récente ou avec mouvement réduit.' },
    { id: 'performance', title: 'La performance devient une mesure d’exploitation du produit', statement: 'La vitesse sera gérée dans les conditions réelles plutôt que célébrée par un seul test de laboratoire.', signal: 'Les Core Web Vitals relient chargement, réactivité et stabilité à LCP, INP et CLS au 75e percentile.', implication: 'Marketing, conception et ingénierie partagent le budget de performance.', move: 'Fixez des budgets d’expérience, surveillez les données terrain et donnez à une personne le pouvoir d’arrêter les régressions.' },
    { id: 'inclusive', title: 'L’accessibilité intervient en amont', statement: 'La conception inclusive sera un système de qualité produit, et non une vérification finale.', signal: 'WCAG 2.2 ajoute des critères pour le focus, le glisser, la taille des cibles, l’aide cohérente et l’authentification accessible.', implication: 'Les modèles accessibles réduisent les reprises et rendent l’interface plus robuste pour les personnes et les agents.', move: 'Intégrez les critères d’accessibilité à la conception, au développement et aux essais.' },
    { id: 'trust', title: 'L’ingénierie de confiance influence la conversion', statement: 'La sécurité, la confidentialité et la provenance deviennent des qualités visibles de l’expérience.', signal: 'OWASP souligne les risques systémiques, tandis que les principes W3C favorisent la limitation des finalités, le consentement réel et la transparence.', implication: 'Un parcours persuasif qui semble extractif ou fragile crée de la friction commerciale.', move: 'Cartographiez les données, minimisez la collecte, renforcez les dépendances et expliquez clairement l’automatisation.' },
    { id: 'sustainable', title: 'Les systèmes durables gagnent sur le plan économique', statement: 'Des environnements numériques moins complexes procurent des avantages environnementaux, financiers et opérationnels.', signal: 'Les recommandations W3C relient expérience, développement, hébergement, infrastructure et gestion produit.', implication: 'Les plateformes en double, les médias surdimensionnés et les fonctions abandonnées sont des coûts d’exploitation.', move: 'Retirez les parcours inutilisés, compressez les médias, privilégiez les composants durables et suivez coût, performance et valeur.' },
  ],
  assessmentTitle: 'Évaluation de préparation en sept facteurs', assessmentIntro: 'Évaluez l’état actuel de votre expérience numérique. Le résultat est directionnel et sert à cibler la première conversation de direction.', scoreLabel: 'Indice de préparation', scorePrompt: 'Complétez les sept évaluations pour voir votre position.',
  assessmentFactors: [
    { name: 'Intelligence du contenu', prompt: 'Notre contenu est structuré, actuel, attribuable et lisible par les machines.' },
    { name: 'Pertinence des parcours', prompt: 'Nous guidons différentes intentions sans collecte invasive.' },
    { name: 'Capacité de la plateforme', prompt: 'Notre architecture permet l’amélioration progressive et des essais contrôlés.' },
    { name: 'Discipline de performance', prompt: 'Nous mesurons la performance réelle et appliquons des budgets.' },
    { name: 'Qualité inclusive', prompt: 'Les critères d’accessibilité sont intégrés à la livraison.' },
    { name: 'Contrôles de confiance', prompt: 'La confidentialité, la sécurité et la gouvernance sont visibles et attribuées.' },
    { name: 'Exploitation durable', prompt: 'Nous retirons la complexité sans valeur et gérons le coût du cycle de vie.' },
  ],
  scoreBands: [
    { min: 80, title: 'Leader adaptatif', body: 'Votre fondation soutient l’innovation ciblée. Privilégiez les preuves, la gouvernance et une croissance contrôlée.' },
    { min: 60, title: 'Fondation en mouvement', body: 'Des capacités utiles existent, mais une responsabilité ou une mesure inégale limite les résultats.' },
    { min: 40, title: 'Préparation fragmentée', body: 'Des écarts prioritaires créent probablement des coûts, des risques ou de la demande manquée.' },
    { min: 0, title: 'Réinitialisation requise', body: 'Clarifiez les résultats, les responsables et les normes avant les couches avancées.' },
  ],
  roadmapTitle: 'Une feuille de route pratique de 90 jours', roadmapIntro: 'Le but n’est pas de lancer une refonte 2027, mais d’établir les faits, corriger la contrainte principale et créer un rythme de gestion.', principlesTitle: 'Cinq principes pour le portefeuille d’investissement',
  roadmap: [
    { days: 'Jours 1–30', title: 'Diagnostiquer et décider', items: ['Établir la référence des sept facteurs et de trois parcours prioritaires.', 'Inventorier analytique, données structurées, accessibilité, performance et collecte.', 'Nommer un commanditaire et un responsable de l’expérience.', 'Choisir un résultat mesurable et définir les garde-fous.'] },
    { days: 'Jours 31–60', title: 'Construire la fondation', items: ['Corriger le parcours de contenu et de navigation à plus forte valeur.', 'Mettre en place la structure sémantique, les métadonnées Article et les budgets.', 'Résoudre les obstacles critiques de clavier, contraste, focus et formulaires.', 'Retirer au moins une dépendance ou un parcours sans valeur.'] },
    { days: 'Jours 61–90', title: 'Prouver et opérationnaliser', items: ['Livrer une amélioration adaptative ou interactive avec contrôles.', 'Mesurer performance terrain, complétion, action qualifiée et soutien.', 'Documenter un modèle réutilisable et un journal de décisions.', 'Approuver le prochain portefeuille selon les preuves.'] },
  ],
  principles: ['Concevez le parcours par défaut avant le parcours adaptatif.', 'Publiez preuves, responsabilités et dates.', 'Améliorez progressivement chaque capacité émergente.', 'Traitez accessibilité, confidentialité et performance comme exigences produit.', 'Retirez la complexité aussi délibérément que vous ajoutez des capacités.'],
  sourcesTitle: 'Sources et notes probantes', sourcesIntro: 'Ces prévisions sont une interprétation prospective de normes et signaux actuels. Elles ne supposent pas que chaque capacité mûrira au même rythme.', download: 'Obtenir le PDF pour dirigeants', conversation: 'Utiliser l’évaluation dans un atelier de direction', ctaTitle: 'Rendez les 90 prochains jours plus utiles que la prochaine liste de tendances.', ctaBody: 'ROALLA aide les équipes à relier l’expérience numérique, les choix technologiques et la discipline opérationnelle à des résultats mesurables.', cta: 'Commencer une conversation stratégique',
}

const sources = [
  ['Google Search Central — Article structured data', 'https://developers.google.com/search/docs/appearance/structured-data/article'],
  ['Google Search Central — structured data guidelines', 'https://developers.google.com/search/docs/appearance/structured-data/sd-policies'],
  ['web.dev — Core Web Vitals', 'https://web.dev/articles/vitals'],
  ['W3C — What’s New in WCAG 2.2', 'https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/'],
  ['MDN — View Transition API', 'https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition'],
  ['MDN — WebGPU API', 'https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API'],
  ['W3C — Privacy Principles', 'https://www.w3.org/TR/privacy-principles/'],
  ['OWASP — Top 10:2025', 'https://top10.owasp.org/2025/'],
  ['W3C — Web Sustainability Guidelines (draft)', 'https://www.w3.org/TR/web-sustainability-guidelines/'],
] as const

export default function WebDevelopmentOutlook2027({ locale, title, summary, readTime, category }: Props) {
  const c = locale === 'fr' ? FR : EN
  const [ratings, setRatings] = useState<(number | null)[]>(Array(7).fill(null))
  const completed = ratings.every((value) => value !== null)
  const score = useMemo(() => completed ? Math.round((ratings.reduce<number>((sum, value) => sum + (value ?? 0), 0) / 35) * 100) : 0, [completed, ratings])
  const band = c.scoreBands.find((item) => score >= item.min) ?? c.scoreBands[c.scoreBands.length - 1]

  return (
    <article className="bg-[#f4f7fb] text-slate-900">
      <header className="relative isolate min-h-[700px] overflow-hidden bg-[#07111f] text-white">
        <Image src="/images/insights/web-development-outlook-2027/hero.webp" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center opacity-70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07111f] via-[#07111f]/90 to-[#07111f]/20" />
        <div className="mx-auto grid min-h-[700px] max-w-7xl items-end px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[.24em] text-[#67e8f9]">{c.eyebrow}</p>
            <p className="mt-6 text-sm font-semibold text-slate-300">{category} · {readTime}</p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl font-normal leading-[1.02] tracking-[-.045em] text-white sm:text-6xl lg:text-7xl">{title}</h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-200 sm:text-2xl">{summary || c.dek}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#readiness" className="inline-flex min-h-12 items-center gap-3 bg-[#00b4c5] px-5 text-sm font-bold text-[#07111f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5c518]">{c.assessmentTitle}<ArrowRight className="h-4 w-4" /></a>
              <a href="#roadmap" className="inline-flex min-h-12 items-center border border-white/35 bg-white/5 px-5 text-sm font-bold text-white backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5c518]">{c.roadmapTitle}</a>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="outlook-thesis">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.45fr_1.55fr] lg:gap-16">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#007a87]">{c.thesis}</p>
          <div><h2 id="outlook-thesis" className="font-serif text-3xl font-normal leading-tight tracking-[-.03em] text-[#07111f] sm:text-4xl">{c.dek}</h2><p className="mt-7 max-w-4xl text-lg leading-8 text-slate-600">{c.thesisBody}</p></div>
        </div>
      </section>

      <nav aria-label={c.navLabel} className="sticky top-0 z-30 border-y border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {c.trends.map((trend, index) => <a key={trend.id} href={`#${trend.id}`} className="shrink-0 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-[#eefbfd] hover:text-[#007a87] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00b4c5]"><span className="mr-2 text-[#0099a8]">0{index + 1}</span>{trend.title}</a>)}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {c.trends.map((trend, index) => (
            <section key={trend.id} id={trend.id} className="scroll-mt-24 overflow-hidden border border-slate-200 bg-white shadow-[0_18px_60px_rgba(4,16,31,.06)] lg:grid lg:grid-cols-[.52fr_1.48fr]" aria-labelledby={`${trend.id}-title`}>
              <div className="relative overflow-hidden bg-[#07111f] p-7 text-white sm:p-9">
                <span className="font-serif text-7xl text-[#00b4c5]">0{index + 1}</span>
                <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full border border-[#00b4c5]/30" aria-hidden="true" />
                <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full border border-[#f5c518]/40" aria-hidden="true" />
              </div>
              <div className="p-7 sm:p-10 lg:p-12">
                <h2 id={`${trend.id}-title`} className="font-serif text-3xl font-normal tracking-[-.03em] text-[#07111f] sm:text-4xl">{trend.title}</h2>
                <p className="mt-5 text-xl leading-8 text-slate-700">{trend.statement}</p>
                <div className="mt-9 grid gap-6 md:grid-cols-3">
                  {[[c.signals, trend.signal], [c.implication, trend.implication], [c.move, trend.move]].map(([label, body], itemIndex) => <div key={label} className="border-t-2 pt-4" style={{ borderColor: itemIndex === 2 ? '#f5c518' : '#00b4c5' }}><h3 className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">{label}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{body}</p></div>)}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <section id="readiness" className="scroll-mt-20 bg-[#07111f] px-4 py-20 text-white sm:px-6 lg:px-8" aria-labelledby="readiness-title">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#67e8f9]">Interactive decision tool</p><h2 id="readiness-title" className="mt-4 font-serif text-4xl font-normal tracking-[-.035em] text-white sm:text-5xl">{c.assessmentTitle}</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{c.assessmentIntro}</p></div><Gauge className="hidden h-24 w-24 justify-self-end text-[#00b4c5] lg:block" aria-hidden="true" /></div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.45fr_.55fr]">
            <div className="space-y-4">
              {c.assessmentFactors.map((factor, index) => (
                <fieldset key={factor.name} className="border border-white/15 bg-white/[.045] p-5 sm:p-6">
                  <legend className="px-1 text-sm font-bold text-white"><span className="mr-3 text-[#67e8f9]">0{index + 1}</span>{factor.name}</legend>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{factor.prompt}</p>
                  <div className="mt-4 grid grid-cols-5 gap-2" aria-label={`${factor.name}: 1 to 5`}>
                    {[1, 2, 3, 4, 5].map((value) => <label key={value} className={`grid min-h-11 cursor-pointer place-items-center border text-sm font-bold transition-colors ${ratings[index] === value ? 'border-[#00b4c5] bg-[#00b4c5] text-[#07111f]' : 'border-white/20 bg-white/5 text-white hover:border-[#00b4c5]'}`}><input type="radio" className="sr-only" name={`factor-${index}`} value={value} checked={ratings[index] === value} onChange={() => setRatings((current) => current.map((rating, ratingIndex) => ratingIndex === index ? value : rating))} /><span>{value}</span></label>)}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-slate-500"><span>Ad hoc</span><span>Managed</span></div>
                </fieldset>
              ))}
            </div>
            <aside className="h-fit border-t-4 border-[#f5c518] bg-white p-7 text-[#07111f] lg:sticky lg:top-24" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#007a87]">{c.scoreLabel}</p>
              {completed ? <><p className="mt-4 font-serif text-7xl">{score}<span className="text-3xl text-slate-400">/100</span></p><h3 className="mt-4 text-xl font-bold">{band.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{band.body}</p><div className="mt-6 h-2 bg-slate-100"><div className="h-full bg-[#00b4c5] transition-all" style={{ width: `${score}%` }} /></div></> : <><p className="mt-5 text-lg font-semibold">{c.scorePrompt}</p><p className="mt-3 text-sm text-slate-500">{ratings.filter((value) => value !== null).length}/7 complete</p></>}
            </aside>
          </div>
        </div>
      </section>

      <section id="roadmap" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="roadmap-title">
        <div className="mx-auto max-w-7xl"><div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#007a87]">From outlook to action</p><h2 id="roadmap-title" className="mt-4 font-serif text-4xl font-normal tracking-[-.035em] text-[#07111f] sm:text-5xl">{c.roadmapTitle}</h2><p className="mt-5 text-lg leading-8 text-slate-600">{c.roadmapIntro}</p></div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">{c.roadmap.map((phase, index) => <section key={phase.days} className="relative overflow-hidden border border-slate-200 bg-white p-7 shadow-[0_14px_50px_rgba(4,16,31,.06)]"><span className="absolute right-4 top-1 font-serif text-7xl text-slate-100">{index + 1}</span><p className="text-xs font-bold uppercase tracking-[.18em] text-[#007a87]">{phase.days}</p><h3 className="mt-4 font-serif text-2xl text-[#07111f]">{phase.title}</h3><ul className="mt-6 space-y-4">{phase.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><Check className="mt-1 h-4 w-4 shrink-0 text-[#0099a8]" aria-hidden="true" />{item}</li>)}</ul></section>)}</div>
        </div>
      </section>

      <section className="bg-[#d9f6f9] px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.7fr_1.3fr]"><h2 className="font-serif text-3xl font-normal tracking-[-.03em] text-[#07111f]">{c.principlesTitle}</h2><ol className="grid gap-px bg-[#007a87]/20 sm:grid-cols-2">{c.principles.map((principle, index) => <li key={principle} className="flex gap-4 bg-[#eefbfd] p-5 text-sm font-semibold leading-6 text-slate-700"><span className="text-[#007a87]">0{index + 1}</span>{principle}</li>)}</ol></div></section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="sources-title"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><h2 id="sources-title" className="font-serif text-3xl font-normal tracking-[-.03em] text-[#07111f]">{c.sourcesTitle}</h2><p className="mt-4 leading-7 text-slate-600">{c.sourcesIntro}</p></div><ol className="mt-8 grid gap-3 md:grid-cols-2">{sources.map(([label, href], index) => <li key={href}><a href={href} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-between gap-5 border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-[#00b4c5] hover:text-[#007a87] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00b4c5]"><span><span className="mr-3 text-slate-400">{index + 1}.</span>{label}</span><ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a></li>)}</ol></div></section>

      <section className="bg-[#07111f] px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end"><div><Sparkles className="h-8 w-8 text-[#f5c518]" aria-hidden="true" /><h2 className="mt-6 max-w-4xl font-serif text-4xl font-normal leading-tight tracking-[-.035em] sm:text-5xl">{c.ctaTitle}</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{c.ctaBody}</p></div><div className="flex flex-col gap-3"><Link href="/executive-insights" className="inline-flex min-h-12 items-center justify-between bg-[#00b4c5] px-5 text-sm font-bold text-[#07111f]">{c.download}<Download className="h-4 w-4" /></Link><Link href="/contact" className="inline-flex min-h-12 items-center justify-between border border-white/25 px-5 text-sm font-bold text-white">{c.cta}<ArrowRight className="h-4 w-4" /></Link></div></div></section>
    </article>
  )
}
