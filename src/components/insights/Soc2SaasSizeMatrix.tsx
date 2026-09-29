type MatrixRow = {
  consideration: string
  small: string
  medium: string
  large: string
}

type SharedPoint = {
  title: string
  body: string
}

type MatrixCopy = {
  sharedTitle: string
  sharedIntro: string
  sharedPoints: readonly SharedPoint[]
  matrixTitle: string
  matrixIntro: string
  considerationHeading: string
  smallHeading: string
  mediumHeading: string
  largeHeading: string
  rows: readonly MatrixRow[]
  note: string
}

const COPY: Record<'en' | 'fr', MatrixCopy> = {
  en: {
    sharedTitle: 'What stays the same at every SaaS company',
    sharedIntro: 'Headcount changes the operating model, but it does not transfer accountability or lower the need for suitable evidence.',
    sharedPoints: [
      { title: 'Management owns the subject matter', body: 'The SaaS provider is responsible for its system description, management assertion, control design and truthful representation of how the service operates.' },
      { title: 'The CPA firm remains independent', body: 'The service auditor plans and performs the examination, selects procedures and samples, evaluates evidence and forms the opinion.' },
      { title: 'Scope follows the service and commitments', body: 'Systems, people, processes, data and subservice organizations belong in scope when they support relevant customer commitments and system requirements.' },
      { title: 'Evidence must support actual operation', body: 'Policies alone are not enough. Approvals, reviews, tickets, logs, investigations and corrective actions must show that controls operated as described.' },
    ],
    matrixTitle: 'Small, medium and large SaaS providers: what changes',
    matrixIntro: 'These profiles are directional. Product architecture, customer commitments, regulated data, locations and acquisition history can make a smaller provider more complex than a larger one.',
    considerationHeading: 'Consideration',
    smallHeading: 'Small SaaS provider',
    mediumHeading: 'Medium SaaS provider',
    largeHeading: 'Large enterprise SaaS',
    rows: [
      { consideration: 'Operating model', small: 'A lean team, shared roles, fewer systems and manual controls that can work when ownership and evidence are consistent.', medium: 'Several teams, formal managers, multiple cloud accounts and a growing mix of centralized and team-specific processes.', large: 'Many products, entities, regions and acquired environments with centralized standards and distributed control owners.' },
      { consideration: 'Scope challenge', small: 'Avoid including future features or every internal tool. Define the actual service boundary, data flows and critical vendors.', medium: 'Align product, engineering, support, HR and vendor processes that may have evolved differently.', large: 'Rationalize product boundaries, shared platforms, subservice organizations, locations and carve-in or carve-out decisions.' },
      { consideration: 'Evidence and testing', small: 'Lower volume, but missing one quarterly review or one employee departure can represent a significant exception.', medium: 'More samples, tickets, access changes, vendors and reviewers increase coordination and consistency risk.', large: 'High populations, many evidence sources and local variations require repeatable extraction, quality checks and accountable coordination.' },
      { consideration: 'Typical pitfalls', small: 'Policies copied from templates, founder approvals with no record, weak separation, informal onboarding and controls introduced too late.', medium: 'Different teams follow different workflows, exceptions remain open, evidence is assembled manually and ownership is ambiguous.', large: 'Scope expands without governance, legacy platforms remain inconsistent, acquisitions are poorly integrated and global evidence cannot be reconciled.' },
      { consideration: 'Best cost levers', small: 'Narrow the scope responsibly, simplify tools and processes, assign owners early and collect evidence during normal work before buying automation.', medium: 'Standardize identity, change, incident and vendor workflows; establish recurring evidence reviews; automate only stable, high-volume collection.', large: 'Use a common control library, product-level scope governance, internal quality review, reusable evidence pipelines and a coordinated owner network.' },
    ],
    note: 'Size does not determine the auditor’s opinion. The relevant question is whether the description is fairly presented and the in-scope controls meet the applicable criteria for the selected examination period or date.',
  },
  fr: {
    sharedTitle: 'Ce qui demeure identique pour chaque fournisseur SaaS',
    sharedIntro: 'L’effectif change le modèle d’exploitation, mais ne transfère pas la responsabilité et ne réduit pas le besoin de preuves appropriées.',
    sharedPoints: [
      { title: 'La direction possède l’objet examiné', body: 'Le fournisseur SaaS est responsable de la description du système, de l’affirmation de la direction, de la conception des contrôles et de la représentation fidèle du service.' },
      { title: 'Le cabinet de CPA demeure indépendant', body: 'L’auditeur du service planifie et réalise l’examen, choisit les procédures et échantillons, évalue les preuves et formule l’opinion.' },
      { title: 'La portée suit le service et les engagements', body: 'Systèmes, personnes, processus, données et sous-traitants entrent dans la portée lorsqu’ils soutiennent les engagements clients et exigences pertinentes.' },
      { title: 'La preuve doit montrer le fonctionnement réel', body: 'Les politiques seules ne suffisent pas. Approbations, revues, billets, journaux, enquêtes et corrections doivent montrer que les contrôles ont fonctionné comme décrit.' },
    ],
    matrixTitle: 'Petits, moyens et grands fournisseurs SaaS : ce qui change',
    matrixIntro: 'Ces profils sont indicatifs. L’architecture, les engagements clients, les données réglementées, les emplacements et les acquisitions peuvent rendre un petit fournisseur plus complexe qu’un grand.',
    considerationHeading: 'Considération',
    smallHeading: 'Petit fournisseur SaaS',
    mediumHeading: 'Fournisseur SaaS moyen',
    largeHeading: 'Grande entreprise SaaS',
    rows: [
      { consideration: 'Modèle d’exploitation', small: 'Équipe réduite, rôles partagés, moins de systèmes et contrôles manuels qui peuvent fonctionner avec une responsabilité et des preuves constantes.', medium: 'Plusieurs équipes, gestionnaires formels, comptes infonuagiques multiples et processus centralisés ou propres aux équipes.', large: 'Plusieurs produits, entités, régions et environnements acquis avec normes centrales et responsables distribués.' },
      { consideration: 'Défi de portée', small: 'Éviter d’inclure les fonctions futures ou chaque outil interne. Définir la vraie frontière du service, les flux de données et fournisseurs critiques.', medium: 'Aligner produit, ingénierie, soutien, RH et fournisseurs dont les processus ont évolué différemment.', large: 'Rationaliser frontières des produits, plateformes partagées, sous-traitants, emplacements et décisions d’inclusion ou d’exclusion.' },
      { consideration: 'Preuves et tests', small: 'Volume moindre, mais une seule revue trimestrielle manquante ou un départ mal géré peut constituer une exception importante.', medium: 'Plus d’échantillons, billets, changements d’accès, fournisseurs et réviseurs augmentent le risque de coordination.', large: 'Des populations élevées et variations locales exigent une extraction répétable, des contrôles de qualité et une coordination responsable.' },
      { consideration: 'Pièges typiques', small: 'Politiques copiées, approbations sans trace, séparation faible, intégration informelle et contrôles introduits trop tard.', medium: 'Flux différents selon les équipes, exceptions ouvertes, collecte manuelle et responsabilités ambiguës.', large: 'Portée qui grandit sans gouvernance, plateformes héritées incohérentes, acquisitions mal intégrées et preuves mondiales impossibles à rapprocher.' },
      { consideration: 'Meilleurs leviers de coût', small: 'Limiter la portée avec discernement, simplifier outils et processus, attribuer les contrôles tôt et recueillir les preuves dans le travail normal avant d’automatiser.', medium: 'Standardiser identités, changements, incidents et fournisseurs; instaurer des revues récurrentes; automatiser seulement la collecte stable et volumineuse.', large: 'Utiliser une bibliothèque commune de contrôles, une gouvernance par produit, une revue interne, des pipelines de preuves réutilisables et un réseau coordonné de responsables.' },
    ],
    note: 'La taille ne détermine pas l’opinion de l’auditeur. Il faut plutôt déterminer si la description est présentée fidèlement et si les contrôles visés répondent aux critères applicables pour la période ou la date examinée.',
  },
}

export default function Soc2SaasSizeMatrix({ locale }: { locale: string }) {
  const copy = COPY[locale === 'fr' ? 'fr' : 'en']

  return (
    <>
      <section className="mx-auto mt-14 max-w-5xl" aria-labelledby="soc2-same-title">
        <div className="mx-auto max-w-4xl">
          <h2 id="soc2-same-title" className="text-3xl font-serif font-bold text-slate-950">{copy.sharedTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">{copy.sharedIntro}</p>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {copy.sharedPoints.map((point) => (
            <div key={point.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-serif font-bold text-slate-950">{point.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{point.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl" aria-labelledby="soc2-size-matrix-title">
        <div className="mx-auto max-w-4xl">
          <h2 id="soc2-size-matrix-title" className="text-3xl font-serif font-bold text-slate-950">{copy.matrixTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">{copy.matrixIntro}</p>
        </div>
        <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[1040px] border-collapse bg-white text-left">
            <caption className="sr-only">{copy.matrixTitle}</caption>
            <thead className="bg-slate-950 text-white">
              <tr>
                {[copy.considerationHeading, copy.smallHeading, copy.mediumHeading, copy.largeHeading].map((heading) => (
                  <th key={heading} scope="col" className="border-r border-slate-700 px-5 py-4 text-sm font-bold leading-6 text-white last:border-r-0">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {copy.rows.map((row, index) => (
                <tr key={row.consideration} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <th scope="row" className="w-[16%] border-r border-t border-slate-200 px-5 py-5 align-top font-bold leading-7 text-slate-950">{row.consideration}</th>
                  <td className="w-[28%] border-r border-t border-slate-200 px-5 py-5 align-top leading-7 text-slate-700">{row.small}</td>
                  <td className="w-[28%] border-r border-t border-slate-200 px-5 py-5 align-top leading-7 text-slate-700">{row.medium}</td>
                  <td className="w-[28%] border-t border-slate-200 px-5 py-5 align-top leading-7 text-slate-700">{row.large}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-4 max-w-4xl text-sm leading-6 text-slate-600">{copy.note}</p>
      </section>
    </>
  )
}
