type SupportedIndustry = 'legal' | 'manufacturing' | 'recruiting-staffing' | 'retail' | 'warehouses'

type VisualCopy = {
  eyebrow: string
  title: string
  lead: string
  imageAlt: string
  categories: readonly (readonly [string, string])[]
}

const COPY: Record<SupportedIndustry, Record<'en' | 'fr', VisualCopy>> = {
  legal: {
    en: {
      eyebrow: 'Connected legal technology',
      title: 'One legal practice, five connected technology outcomes',
      lead: 'ROALLA connects how a firm is found, how new matters enter, how legal work moves, how people communicate, and how privileged information stays protected.',
      imageAlt: 'ROALLA at the centre of five connected legal technology categories.',
      categories: [
        ['Attract & Qualify', 'Visibility, practice-area journeys, referrals, and fit.'],
        ['Intake & Respond', 'Calls, inquiries, consultations, conflicts, and handoff.'],
        ['Manage Matters & Documents', 'Matter workflows, documents, knowledge, and approved automation.'],
        ['Connect Teams & Clients', 'Calling, collaboration, client updates, and secure exchange.'],
        ['Protect & Govern', 'Identity, privilege, resilience, retention, and oversight.'],
      ],
    },
    fr: {
      eyebrow: 'Technologie juridique connectée',
      title: 'Un cabinet juridique, cinq résultats technologiques connectés',
      lead: 'ROALLA relie la façon dont le cabinet est trouvé, accueille les dossiers, fait avancer le travail, communique et protège les renseignements privilégiés.',
      imageAlt: 'ROALLA au centre de cinq catégories technologiques juridiques connectées.',
      categories: [
        ['Attirer et qualifier', 'Visibilité, parcours par domaine, références et adéquation.'],
        ['Accueillir et répondre', 'Appels, demandes, consultations, conflits et transfert.'],
        ['Gérer dossiers et documents', 'Flux de dossiers, documents, savoir et automatisation approuvée.'],
        ['Relier équipes et clients', 'Appels, collaboration, suivis clients et échange sécurisé.'],
        ['Protéger et gouverner', 'Identité, privilège, résilience, conservation et supervision.'],
      ],
    },
  },
  manufacturing: {
    en: {
      eyebrow: 'Connected manufacturing technology',
      title: 'One manufacturing operation, five connected technology outcomes',
      lead: 'ROALLA connects demand, quoting, production, fulfilment, plant communications, and protection around the way work actually moves through the business.',
      imageAlt: 'ROALLA at the centre of five connected manufacturing technology categories.',
      categories: [
        ['Win & Plan', 'Demand, customer visibility, forecasting, and capacity signals.'],
        ['Quote & Order', 'Requirements, estimates, approvals, orders, and promise dates.'],
        ['Produce & Fulfill', 'Production workflows, inventory, quality, shipping, and service.'],
        ['Connect Plant & Teams', 'Plant connectivity, calling, alerts, collaboration, and handoffs.'],
        ['Protect & Improve', 'IT and OT security, continuity, analytics, and improvement.'],
      ],
    },
    fr: {
      eyebrow: 'Technologie manufacturière connectée',
      title: 'Une opération manufacturière, cinq résultats technologiques connectés',
      lead: 'ROALLA relie demande, soumissions, production, exécution, communications d’usine et protection à la façon dont le travail circule réellement.',
      imageAlt: 'ROALLA au centre de cinq catégories technologiques manufacturières connectées.',
      categories: [
        ['Gagner et planifier', 'Demande, visibilité client, prévisions et signaux de capacité.'],
        ['Soumissionner et commander', 'Exigences, estimations, approbations, commandes et dates promises.'],
        ['Produire et exécuter', 'Production, inventaire, qualité, expédition et service.'],
        ['Relier usine et équipes', 'Connectivité, appels, alertes, collaboration et transferts.'],
        ['Protéger et améliorer', 'Sécurité TI et TO, continuité, analytique et amélioration.'],
      ],
    },
  },
  'recruiting-staffing': {
    en: {
      eyebrow: 'Connected recruiting technology',
      title: 'One recruiting operation, five connected technology outcomes',
      lead: 'ROALLA connects how talent and clients find you, how requirements and candidates enter, how placements move, how people communicate, and how sensitive information stays protected.',
      imageAlt: 'ROALLA at the centre of five connected recruiting and staffing technology categories.',
      categories: [
        ['Attract & Source', 'Search visibility, campaigns, talent pools, referrals, and outreach.'],
        ['Capture & Qualify', 'Candidate and client intake, role requirements, availability, and fit.'],
        ['Match & Place', 'ATS workflows, submissions, interviews, offers, and onboarding.'],
        ['Connect Recruiters & Clients', 'Calling, messaging, collaboration, updates, and handoffs.'],
        ['Protect & Improve', 'Privacy, identity, continuity, analytics, governance, and improvement.'],
      ],
    },
    fr: {
      eyebrow: 'Technologie de recrutement connectée',
      title: 'Une opération de recrutement, cinq résultats technologiques connectés',
      lead: 'ROALLA relie la découverte par les talents et les clients, l’accueil des besoins et candidats, les placements, les communications et la protection des renseignements sensibles.',
      imageAlt: 'ROALLA au centre de cinq catégories technologiques connectées pour le recrutement et le placement.',
      categories: [
        ['Attirer et trouver', 'Visibilité, campagnes, bassins de talents, références et approche.'],
        ['Saisir et qualifier', 'Accueil candidats et clients, exigences, disponibilité et adéquation.'],
        ['Jumeler et placer', 'Flux ATS, présentations, entrevues, offres et intégration.'],
        ['Relier recruteurs et clients', 'Appels, messagerie, collaboration, suivis et transferts.'],
        ['Protéger et améliorer', 'Confidentialité, identité, continuité, analytique et gouvernance.'],
      ],
    },
  },
  retail: {
    en: {
      eyebrow: 'Connected retail technology',
      title: 'One retail experience, five connected technology outcomes',
      lead: 'ROALLA connects the customer journey, store operations, fulfilment, communications, and protection around the way your retail business actually runs.',
      imageAlt: 'ROALLA at the centre of five connected retail technology categories.',
      categories: [
        ['Attract & Convert', 'Visibility, campaigns, commerce experiences, and conversion paths.'],
        ['Capture & Respond', 'Calls, messages, inquiries, bookings, and customer follow-up.'],
        ['Sell & Fulfill', 'Point of sale, inventory, orders, payments, and delivery workflows.'],
        ['Connect Teams & Locations', 'Calling, collaboration, store connectivity, and shared operating information.'],
        ['Protect & Improve', 'Security, continuity, analytics, governance, and continuous improvement.'],
      ],
    },
    fr: {
      eyebrow: 'Technologie de détail connectée',
      title: 'Une expérience de détail, cinq résultats technologiques connectés',
      lead: 'ROALLA relie le parcours client, les opérations en magasin, l’exécution, les communications et la protection à la façon dont votre commerce fonctionne réellement.',
      imageAlt: 'ROALLA au centre de cinq catégories technologiques pour le détail.',
      categories: [
        ['Attirer et convertir', 'Visibilité, campagnes, expériences commerciales et parcours de conversion.'],
        ['Saisir et répondre', 'Appels, messages, demandes, réservations et suivi client.'],
        ['Vendre et exécuter', 'Point de vente, inventaire, commandes, paiements et livraison.'],
        ['Relier équipes et établissements', 'Appels, collaboration, connectivité et information partagée.'],
        ['Protéger et améliorer', 'Sécurité, continuité, analytique, gouvernance et amélioration continue.'],
      ],
    },
  },
  warehouses: {
    en: {
      eyebrow: 'Connected warehouse technology',
      title: 'One warehouse operation, five connected technology outcomes',
      lead: 'ROALLA connects inbound scheduling, inventory, fulfilment, floor communications, customer updates, and protection around the way goods actually move.',
      imageAlt: 'ROALLA at the centre of five connected warehouse technology categories.',
      categories: [
        ['Receive & Schedule', 'Orders, advance notices, dock appointments, and inbound coordination.'],
        ['Store & Locate', 'Inventory accuracy, bin visibility, scanning, and putaway.'],
        ['Pick, Pack & Ship', 'Work queues, verification, labels, dispatch, and order status.'],
        ['Connect Floor & Partners', 'Floor communications, alerts, customer updates, and handoffs.'],
        ['Protect & Improve', 'Security, continuity, analytics, safety, and improvement.'],
      ],
    },
    fr: {
      eyebrow: 'Technologie d’entrepôt connectée',
      title: 'Une opération d’entrepôt, cinq résultats technologiques connectés',
      lead: 'ROALLA relie la planification des arrivages, l’inventaire, l’exécution, les communications au plancher, les suivis clients et la protection au mouvement réel des marchandises.',
      imageAlt: 'ROALLA au centre de cinq catégories technologiques connectées pour les entrepôts.',
      categories: [
        ['Recevoir et planifier', 'Commandes, avis préalables, rendez-vous aux quais et coordination.'],
        ['Ranger et localiser', 'Exactitude d’inventaire, emplacements, lecture et mise en stock.'],
        ['Prélever, emballer et expédier', 'Files de travail, vérification, étiquettes, envoi et statut.'],
        ['Relier plancher et partenaires', 'Communications, alertes, suivis clients et transferts.'],
        ['Protéger et améliorer', 'Sécurité, continuité, analytique, sûreté et amélioration.'],
      ],
    },
  },
}

export function supportsIndustryTechnologyCategoryVisual(
  industry: string,
): industry is SupportedIndustry {
  return (
    industry === 'legal' ||
    industry === 'manufacturing' ||
    industry === 'recruiting-staffing' ||
    industry === 'retail' ||
    industry === 'warehouses'
  )
}

export default function IndustryTechnologyCategoryVisual({
  locale,
  industry,
}: {
  locale: string
  industry: string
}) {
  if (!supportsIndustryTechnologyCategoryVisual(industry)) return null

  const language = locale === 'fr' ? 'fr' : 'en'
  const copy = COPY[industry][language]
  const visualBase = `/images/industries/${industry}-technology-categories${language === 'fr' ? '.fr' : ''}`
  const titleId = `${industry}-technology-categories-title`

  return (
    <section
      aria-labelledby={titleId}
      data-industry-category-visual={industry}
      className="border-b border-slate-200 bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">{copy.eyebrow}</p>
          <h2 id={titleId} className="mt-3 font-serif text-3xl font-bold !text-white sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">{copy.lead}</p>
        </div>

        <picture className="retail-category-visual mx-auto mt-10 max-w-6xl">
          <source media="(prefers-reduced-motion: reduce)" srcSet={`${visualBase}.webp`} type="image/webp" />
          <source srcSet={`${visualBase}.svg`} type="image/svg+xml" />
          <img
            src={`${visualBase}.webp`}
            alt={copy.imageAlt}
            width="1440"
            height="900"
            loading="lazy"
            decoding="async"
            className="h-auto w-full"
          />
        </picture>

        <ul className="retail-category-cards mt-10 grid gap-4">
          {copy.categories.map(([title, description]) => (
            <li key={title} className="rounded-2xl border border-cyan-300/20 bg-white/[0.06] p-5">
              <h3 className="font-serif text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-base leading-7 text-slate-300">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
