import React from 'react'
import {
  Blocks,
  BriefcaseBusiness,
  Building2,
  CheckCircle,
  Clock3,
  MousePointerClick,
  SearchX,
  Users,
} from 'lucide-react'

type Props = { locale: string }

const content = {
  en: {
    eyebrow: 'Understand the difference',
    title: 'A website builder gives you tools. A business website still needs decisions.',
    intro:
      'Self-service platforms can be a practical way to publish quickly. They usually provide templates, hosting, security and editing tools. The business owner still has to decide what to say, how to organize the offer, what action visitors should take and how the site will be found.',
    whatYouGet: 'What you get',
    whatYouOwn: 'What you still own',
    bestWhen: 'Best when',
    diyTitle: 'Self-service website builder',
    diyPrice: 'Lower platform cost',
    diyGets: ['Templates or AI-generated starting pages', 'Hosting, SSL and visual editing tools', 'Basic SEO and marketing settings'],
    diyOwns: ['Positioning, service structure and final copy', 'Visitor journey, calls to action and booking flow', 'Testing, accessibility, search setup and ongoing updates'],
    diyBest: 'You already know exactly what to say, have time to build and test it, and are comfortable managing the platform yourself.',
    roallaTitle: 'ROALLA guided launch',
    roallaPrice: 'Focused professional investment',
    roallaGets: ['Business-aligned structure and professional build', 'Client-friendly copy and booking integration', 'SEO, AEO and agentic/AI visibility foundations', 'Human review, launch support and hosting choice'],
    roallaOwns: ['Provide business facts, approvals and timely feedback', 'Own the domain, accounts and final website assets'],
    roallaBest: 'You want a credible, client-ready site without having to learn website strategy, copy, search configuration and deployment yourself.',
    agencyTitle: 'Full custom agency engagement',
    agencyPrice: 'Higher scope and investment',
    agencyGets: ['Deeper brand research and custom experience design', 'Larger content, campaign and integration teams', 'Complex functionality, testing and ongoing retainers'],
    agencyOwns: ['More discovery time, stakeholder input and approvals', 'A larger budget and longer delivery timeline'],
    agencyBest: 'The organization has multiple audiences, complex integrations, a larger campaign or substantial custom requirements.',
    valueEyebrow: 'Low price is not the same as low cost',
    valueTitle: 'The real test is whether the website helps create the next customer conversation.',
    valueIntro:
      'A site can look polished and still underperform. If visitors cannot understand the offer, find the business or take the next step, the lower build price may simply shift the cost into owner time and missed opportunities.',
    friction1Title: 'Unclear message',
    friction1Body: 'Visitors do not quickly recognize who the service is for or why it fits their need.',
    friction2Title: 'Hard to discover',
    friction2Body: 'Search engines and AI assistants receive weak or inconsistent signals about the business.',
    friction3Title: 'No clear next step',
    friction3Body: 'Traffic reaches the site, but the contact, booking or inquiry path creates friction.',
    formulaLead: 'Website value is not measured by pages alone.',
    formula: 'Clear offer + qualified discovery + easy action = a stronger chance of engagement',
    closing:
      'ROALLA cannot guarantee traffic, rankings or new customers. The purpose of the guided launch is to give the website a better business foundation than design alone.',
  },
  fr: {
    eyebrow: 'Comprendre la différence',
    title: 'Un créateur de site fournit des outils. Un site d’affaires exige encore des décisions.',
    intro:
      'Les plateformes libre-service peuvent être pratiques pour publier rapidement. Elles offrent habituellement des modèles, l’hébergement, la sécurité et des outils d’édition. Le propriétaire doit toujours décider quoi dire, comment structurer l’offre, quelle action demander et comment le site sera découvert.',
    whatYouGet: 'Ce que vous obtenez',
    whatYouOwn: 'Ce qui reste à votre charge',
    bestWhen: 'Meilleur choix lorsque',
    diyTitle: 'Créateur de site libre-service',
    diyPrice: 'Coût de plateforme inférieur',
    diyGets: ['Modèles ou premières pages générées par IA', 'Hébergement, SSL et outils visuels', 'Réglages SEO et marketing de base'],
    diyOwns: ['Positionnement, structure des services et texte final', 'Parcours, appels à l’action et réservation', 'Tests, accessibilité, recherche et mises à jour continues'],
    diyBest: 'Vous savez déjà exactement quoi dire, avez le temps de bâtir et tester, et êtes à l’aise de gérer la plateforme vous-même.',
    roallaTitle: 'Lancement guidé ROALLA',
    roallaPrice: 'Investissement professionnel ciblé',
    roallaGets: ['Structure alignée sur l’entreprise et réalisation professionnelle', 'Rédaction claire et intégration de la réservation', 'Fondations SEO, AEO et visibilité agentique/IA', 'Révision humaine, soutien au lancement et choix d’hébergement'],
    roallaOwns: ['Fournir les faits, approbations et commentaires en temps utile', 'Posséder le domaine, les comptes et les actifs finaux'],
    roallaBest: 'Vous voulez un site crédible et prêt pour la clientèle sans devoir apprendre vous-même la stratégie Web, la rédaction, la recherche et le déploiement.',
    agencyTitle: 'Mandat d’agence entièrement personnalisé',
    agencyPrice: 'Portée et investissement supérieurs',
    agencyGets: ['Recherche de marque approfondie et expérience sur mesure', 'Équipes élargies de contenu, campagne et intégration', 'Fonctions complexes, tests et services continus'],
    agencyOwns: ['Davantage de découverte, d’intervenants et d’approbations', 'Un budget supérieur et un échéancier plus long'],
    agencyBest: 'L’organisation a plusieurs publics, des intégrations complexes, une grande campagne ou des exigences personnalisées importantes.',
    valueEyebrow: 'Un prix bas n’est pas toujours un faible coût',
    valueTitle: 'Le vrai test : le site aide-t-il à créer la prochaine conversation client?',
    valueIntro:
      'Un site peut sembler professionnel sans produire de résultats. Si les visiteurs ne comprennent pas l’offre, ne trouvent pas l’entreprise ou ne savent pas quoi faire ensuite, l’économie initiale peut simplement devenir du temps de gestion et des occasions manquées.',
    friction1Title: 'Message imprécis',
    friction1Body: 'Les visiteurs ne reconnaissent pas rapidement à qui s’adresse le service ni pourquoi il répond à leur besoin.',
    friction2Title: 'Difficile à découvrir',
    friction2Body: 'Les moteurs de recherche et assistants IA reçoivent des signaux faibles ou incohérents.',
    friction3Title: 'Prochaine étape incertaine',
    friction3Body: 'Le trafic arrive, mais le parcours de contact, de réservation ou de demande crée de la friction.',
    formulaLead: 'La valeur d’un site ne se mesure pas seulement en pages.',
    formula: 'Offre claire + découverte qualifiée + action facile = meilleure possibilité d’engagement',
    closing:
      'ROALLA ne peut garantir le trafic, le classement ni de nouveaux clients. Le lancement guidé vise à donner au site une meilleure fondation d’affaires que la conception seule.',
  },
} as const

export default function WebsiteApproachComparison({ locale }: Props) {
  const t = content[locale === 'fr' ? 'fr' : 'en']
  const approaches = [
    {
      icon: Blocks,
      title: t.diyTitle,
      price: t.diyPrice,
      gets: t.diyGets,
      owns: t.diyOwns,
      best: t.diyBest,
      featured: false,
    },
    {
      icon: BriefcaseBusiness,
      title: t.roallaTitle,
      price: t.roallaPrice,
      gets: t.roallaGets,
      owns: t.roallaOwns,
      best: t.roallaBest,
      featured: true,
    },
    {
      icon: Building2,
      title: t.agencyTitle,
      price: t.agencyPrice,
      gets: t.agencyGets,
      owns: t.agencyOwns,
      best: t.agencyBest,
      featured: false,
    },
  ]

  const frictions = [
    { icon: Users, title: t.friction1Title, body: t.friction1Body },
    { icon: SearchX, title: t.friction2Title, body: t.friction2Body },
    { icon: MousePointerClick, title: t.friction3Title, body: t.friction3Body },
  ]

  return (
    <div className="mt-20 space-y-20">
      <section aria-labelledby="approach-comparison-title">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-dark">{t.eyebrow}</p>
          <h2 id="approach-comparison-title" className="mt-3 text-3xl font-serif font-bold text-slate-950 sm:text-4xl">{t.title}</h2>
          <p className="mt-5 text-base leading-7 text-slate-700">{t.intro}</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {approaches.map(({ icon: Icon, title, price, gets, owns, best, featured }) => (
            <article key={title} className={`relative flex flex-col rounded-3xl border p-6 shadow-sm ${featured ? 'border-primary/40 bg-slate-950 text-white ring-2 ring-primary/15' : 'border-slate-200 bg-white text-slate-950'}`}>
              {featured ? <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-950">ROALLA</span> : null}
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${featured ? 'bg-white/10 text-primary-light' : 'bg-primary/10 text-primary-dark'}`}><Icon className="h-5 w-5" aria-hidden /></span>
              <h3 className={`mt-5 pr-16 text-xl font-serif font-bold ${featured ? 'text-white' : 'text-slate-950'}`}>{title}</h3>
              <p className={`mt-1 text-sm font-semibold ${featured ? 'text-primary-light' : 'text-primary-dark'}`}>{price}</p>

              <div className="mt-6">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${featured ? 'text-slate-300' : 'text-slate-500'}`}>{t.whatYouGet}</p>
                <ul className="mt-3 space-y-2">
                  {gets.map((item) => <li key={item} className={`flex items-start gap-2 text-sm leading-6 ${featured ? 'text-slate-200' : 'text-slate-700'}`}><CheckCircle className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}
                </ul>
              </div>

              <div className={`mt-6 border-t pt-5 ${featured ? 'border-white/15' : 'border-slate-200'}`}>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${featured ? 'text-slate-300' : 'text-slate-500'}`}>{t.whatYouOwn}</p>
                <ul className="mt-3 space-y-2">
                  {owns.map((item) => <li key={item} className={`flex items-start gap-2 text-sm leading-6 ${featured ? 'text-slate-300' : 'text-slate-600'}`}><Clock3 className="mt-1 h-4 w-4 shrink-0 text-amber-500" aria-hidden />{item}</li>)}
                </ul>
              </div>

              <div className={`mt-6 rounded-2xl p-4 ${featured ? 'bg-white/[0.07]' : 'bg-slate-50'}`}>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${featured ? 'text-primary-light' : 'text-primary-dark'}`}>{t.bestWhen}</p>
                <p className={`mt-2 text-sm leading-6 ${featured ? 'text-slate-200' : 'text-slate-700'}`}>{best}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="website-value-title" className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-primary-dark text-white shadow-xl">
        <div className="grid lg:grid-cols-[.9fr_1.1fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-light">{t.valueEyebrow}</p>
            <h2 id="website-value-title" className="mt-3 text-3xl font-serif font-bold text-white sm:text-4xl">{t.valueTitle}</h2>
            <p className="mt-5 leading-7 text-white/95">{t.valueIntro}</p>
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/[0.06] p-5">
              <p className="text-sm font-semibold text-white">{t.formulaLead}</p>
              <p className="mt-2 text-lg font-serif font-bold leading-7 text-primary-light">{t.formula}</p>
            </div>
          </div>
          <div className="grid gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-1">
            {frictions.map(({ icon: Icon, title, body }) => (
              <article key={title} className="bg-slate-950/60 p-6 sm:p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300"><Icon className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-4 font-serif text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/90">{body}</p>
              </article>
            ))}
          </div>
        </div>
        <p className="border-t border-white/10 px-7 py-5 text-xs leading-5 text-white/75 sm:px-10 lg:px-12">{t.closing}</p>
      </section>
    </div>
  )
}
