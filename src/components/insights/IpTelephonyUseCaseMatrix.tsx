type MatrixRow = {
  scale: string
  useCases: string
  value: string
  cost: string
}

type MatrixCopy = {
  title: string
  intro: string
  scaleHeading: string
  useCasesHeading: string
  valueHeading: string
  costHeading: string
  rows: readonly MatrixRow[]
  note: string
}

const COPY: Record<'en' | 'fr', MatrixCopy> = {
  en: {
    title: 'Use-case matrix: match the platform to the business',
    intro: 'Company size is only a starting point. Call volume, locations, customer expectations, compliance and the cost of downtime should determine the design.',
    scaleHeading: 'Business scale',
    useCasesHeading: 'Practical use cases',
    valueHeading: 'Enhanced business value',
    costHeading: 'Cost and delivery profile',
    rows: [
      {
        scale: 'Small business',
        useCases: 'One business number across desk phones, computers and mobile devices; auto-attendant; ring groups; voicemail-to-email; simple CRM click-to-call and appointment workflows.',
        value: 'A professional customer experience without a local PBX, faster responses from hybrid staff and fewer calls tied to one person or desk.',
        cost: 'Usually a predictable per-user subscription plus number porting, handsets or headsets and onboarding. Control cost by licensing only features the team will use.',
      },
      {
        scale: 'Medium business',
        useCases: 'Multi-location routing; department queues; CRM or help-desk screen pops; call analytics; governed recording; on-call routing; user provisioning connected to the identity platform.',
        value: 'Fewer missed calls and transfers, consistent service across locations, measurable response performance and simpler onboarding or offboarding.',
        cost: 'Add integration, network assessment, quality-of-service configuration, training, administration and internet or cellular failover to recurring licences.',
      },
      {
        scale: 'Large enterprise',
        useCases: 'Enterprise-wide dial plans; contact-centre integration; APIs and workflow automation; centralized recording and retention; single sign-on; global carrier and site management.',
        value: 'Standardized governance, centralized analytics, scalable customer operations and communications embedded into enterprise workflows.',
        cost: 'Treat this as a transformation program: architecture, session border controllers, carrier contracts, security, compliance, redundancy, staged migration and change management can outweigh licence price.',
      },
    ],
    note: 'These profiles are directional, not pricing tiers. A ten-person emergency service can need more resilience than a much larger low-call-volume office.',
  },
  fr: {
    title: 'Matrice des cas d’usage : adapter la plateforme à l’entreprise',
    intro: 'La taille n’est qu’un point de départ. Le volume d’appels, les emplacements, les attentes clients, la conformité et le coût des interruptions doivent guider la conception.',
    scaleHeading: 'Taille de l’entreprise',
    useCasesHeading: 'Cas d’usage pratiques',
    valueHeading: 'Valeur d’affaires accrue',
    costHeading: 'Profil de coût et de livraison',
    rows: [
      {
        scale: 'Petite entreprise',
        useCases: 'Un numéro d’affaires sur téléphones, ordinateurs et mobiles; menu d’accueil; groupes de sonnerie; messagerie vocale par courriel; intégration simple au CRM et aux rendez-vous.',
        value: 'Une expérience professionnelle sans autocommutateur local, des réponses plus rapides en mode hybride et moins d’appels liés à une seule personne ou un seul poste.',
        cost: 'Généralement un abonnement prévisible par utilisateur, plus le transfert des numéros, les appareils ou casques et l’intégration. Limitez les licences aux fonctions réellement utilisées.',
      },
      {
        scale: 'Moyenne entreprise',
        useCases: 'Acheminement multisite; files par service; fiches CRM ou soutien à l’écran; analytique; enregistrement encadré; garde; attribution des utilisateurs liée à la plateforme d’identité.',
        value: 'Moins d’appels manqués et de transferts, un service uniforme entre les sites, une performance mesurable et une intégration ou un départ du personnel simplifié.',
        cost: 'Ajoutez aux licences l’intégration, l’évaluation du réseau, la qualité de service, la formation, l’administration et une relève Internet ou cellulaire.',
      },
      {
        scale: 'Grande entreprise',
        useCases: 'Plans de numérotation à l’échelle; centre de contact; API et automatisation; enregistrement et conservation centralisés; authentification unique; gestion mondiale des sites et fournisseurs.',
        value: 'Gouvernance normalisée, analytique centralisée, opérations clients évolutives et communications intégrées aux flux de l’entreprise.',
        cost: 'Traitez le changement comme un programme : architecture, contrôleurs de session, contrats, sécurité, conformité, redondance, migration graduelle et gestion du changement peuvent dépasser le prix des licences.',
      },
    ],
    note: 'Ces profils sont indicatifs, non des forfaits tarifaires. Un service d’urgence de dix personnes peut exiger plus de résilience qu’un grand bureau ayant peu d’appels.',
  },
}

export default function IpTelephonyUseCaseMatrix({ locale }: { locale: string }) {
  const copy = COPY[locale === 'fr' ? 'fr' : 'en']

  return (
    <section className="mx-auto mt-14 max-w-6xl" aria-labelledby="ip-telephony-matrix-title">
      <div className="mx-auto max-w-4xl">
        <h2 id="ip-telephony-matrix-title" className="text-3xl font-serif font-bold text-slate-950">{copy.title}</h2>
        <p className="mt-4 text-lg leading-8 text-slate-700">{copy.intro}</p>
      </div>

      <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full min-w-[940px] border-collapse bg-white text-left">
          <caption className="sr-only">{copy.title}</caption>
          <thead className="bg-slate-950 text-white">
            <tr>
              {[copy.scaleHeading, copy.useCasesHeading, copy.valueHeading, copy.costHeading].map((heading) => (
                <th key={heading} scope="col" className="border-r border-slate-700 px-5 py-4 text-sm font-bold leading-6 text-white last:border-r-0">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row, index) => (
              <tr key={row.scale} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <th scope="row" className="w-[15%] border-r border-t border-slate-200 px-5 py-5 align-top text-base font-bold text-slate-950">
                  {row.scale}
                </th>
                <td className="w-[29%] border-r border-t border-slate-200 px-5 py-5 align-top leading-7 text-slate-700">{row.useCases}</td>
                <td className="w-[27%] border-r border-t border-slate-200 px-5 py-5 align-top leading-7 text-slate-700">{row.value}</td>
                <td className="w-[29%] border-t border-slate-200 px-5 py-5 align-top leading-7 text-slate-700">{row.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mx-auto mt-4 max-w-4xl text-sm leading-6 text-slate-600">{copy.note}</p>
    </section>
  )
}
