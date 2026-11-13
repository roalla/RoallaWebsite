import { ArrowRight, Building2, Check, ChevronRight, Clock3, FileCheck2, Scale, ShieldCheck, Siren, Users } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import InsightShare from '@/components/insights/InsightShare'

type Props = { locale: string; title: string; summary: string; readTime: string; category: string }

const EN = {
  status: 'Executive readiness brief · Current as of November 2026',
  plain: 'Bill C-8 is now law. The immediate executive task is to determine your exposure, assign ownership and build evidence before the phased requirements are fully in force.',
  note: 'This is an executive readiness guide, not legal advice. Designation, applicability, prescribed timelines and implementation dates must be confirmed against regulations and with qualified legal counsel or the responsible regulator.',
  exposureTitle: 'Three ways your organization may be exposed',
  exposureIntro: 'Do not stop at “Are we regulated?” The more useful question is how the organization connects to a federally regulated critical system.',
  exposure: [
    ['Directly designated', 'Your organization operates a designated critical cyber system in a federally regulated vital service or system.'],
    ['Commercially connected', 'You supply software, cloud, telecom, managed services, equipment or operational support to an organization that may be designated.'],
    ['Strategically affected', 'Customers, insurers, lenders or boards expect stronger cyber governance even where the Act does not directly apply.'],
  ],
  sectorsTitle: 'Who should pay close attention',
  sectorsBody: 'The federal framework is aimed at designated operators in federally regulated finance, telecommunications, energy and transportation. The legislation identifies vital services and systems; regulations will determine designated classes and detailed requirements.',
  sectors: ['Banking and clearing systems', 'Telecommunications services and facilities', 'Interprovincial or international energy systems', 'Nuclear energy systems', 'Federally regulated transportation systems', 'Suppliers with privileged access or material dependencies'],
  obligationsTitle: 'What leadership should prepare to govern',
  obligationsIntro: 'The law establishes a control framework. The practical work is to turn each obligation into an accountable operating capability with evidence.',
  obligations: [
    ['Cybersecurity program', 'A documented, implemented and maintained program with accountable leadership, controls and review.'],
    ['Systems and dependencies', 'A defensible inventory of critical systems, assets, data flows, owners and service dependencies.'],
    ['Supply-chain risk', 'Controls for vendors, managed services, software, equipment and other third parties that can affect critical systems.'],
    ['Incident reporting', 'Detection, escalation and reporting processes able to meet the prescribed period, which cannot exceed 72 hours.'],
    ['Material changes', 'A process to assess and notify relevant ownership, control and supply-chain changes when required.'],
    ['Directions and records', 'The ability to receive directions, act quickly, preserve records and demonstrate compliance to the regulator.'],
  ],
  questionsTitle: 'Questions the executive team should ask now',
  questions: [
    'Which services, systems and customer commitments could place us inside the framework or its supply chain?',
    'Who has authority to declare a reportable cyber incident—and who is the backup?',
    'Can we identify affected systems, data, customers and vendors quickly enough to support a 72-hour ceiling?',
    'Which third parties have privileged access or could interrupt a critical service?',
    'What evidence proves that our controls operate, rather than merely exist in policy?',
    'Can legal, security, operations, communications and leadership work from one incident decision process?',
  ],
  roadmapTitle: 'A practical 90-day readiness path',
  roadmap: [
    ['Days 1–30', 'Determine exposure', ['Map services and federal-sector customers.', 'Identify candidate critical systems and dependencies.', 'Name an executive sponsor and legal/compliance lead.', 'Record assumptions requiring regulatory confirmation.']],
    ['Days 31–60', 'Build the evidence base', ['Compare current controls with statutory duties.', 'Map incident decisions and reporting inputs.', 'Review critical vendor access and contract rights.', 'Create a prioritized remediation register.']],
    ['Days 61–90', 'Exercise and govern', ['Run a realistic cyber incident tabletop.', 'Test executive escalation and evidence collection.', 'Assign funded owners and target dates.', 'Establish quarterly readiness reporting.']],
  ],
  evidenceTitle: 'The readiness evidence room',
  evidenceIntro: 'A credible program produces evidence that can be reviewed under pressure. Start with a controlled, current collection—not a last-minute document hunt.',
  evidence: ['Critical-system and dependency register', 'Cybersecurity program and governance records', 'Risk assessments and treatment decisions', 'Incident plan, thresholds and contact tree', 'Vendor inventory, access and contract controls', 'Backup, recovery and continuity test results', 'Training and exercise records', 'Control testing, exceptions and remediation status'],
  avoidTitle: 'Four costly mistakes to avoid',
  avoid: [
    ['Waiting for perfect certainty', 'Phased regulations matter, but inventory, ownership and incident readiness are valuable now.'],
    ['Treating this as an IT project', 'Legal, operations, procurement, communications and the executive team all hold part of the response.'],
    ['Assuming a certification is enough', 'SOC 2 or ISO 27001 may support evidence, but neither automatically proves Bill C-8 compliance.'],
    ['Buying tools before defining the gap', 'Technology should address a verified control, response or evidence requirement—not substitute for governance.'],
  ],
  enforcementTitle: 'Why readiness deserves executive attention',
  enforcementBody: 'The Act provides for inspections, compliance orders and administrative monetary penalties. Maximum penalties can reach $500,000 for an individual and $15 million for another person or organization. The larger business risk may still be operational interruption, customer loss and an inability to demonstrate control during an incident.',
  sourcesTitle: 'Primary sources',
  sourcesIntro: 'Use the legislation and responsible federal authorities as the source of truth. Requirements will become more specific as regulations and guidance are issued.',
  ctaTitle: 'Turn regulatory uncertainty into an owned readiness plan.',
  ctaBody: 'ROALLA helps leadership connect applicability, technology architecture, operating dependencies, vendor governance, incident readiness and evidence into a practical program. Legal interpretation remains with qualified counsel; ROALLA coordinates the business and technology work needed to act.',
  cta: 'Discuss Bill C-8 readiness',
  service: 'Explore Technology Advisory',
  guide: 'Get the EI-49 executive guide',
}

const FR = {
  status: 'Note de préparation pour dirigeants · À jour en novembre 2026',
  plain: 'Le projet de loi C-8 a maintenant force de loi. La priorité consiste à déterminer votre exposition, attribuer la responsabilité et constituer les preuves avant l’entrée en vigueur complète des exigences graduelles.',
  note: 'Ce guide porte sur la préparation des dirigeants et ne constitue pas un avis juridique. La désignation, l’applicabilité, les délais prescrits et les dates de mise en œuvre doivent être confirmés selon les règlements et avec un conseiller juridique qualifié ou l’organisme de réglementation compétent.',
  exposureTitle: 'Trois façons dont votre organisation peut être touchée',
  exposureIntro: 'Ne vous limitez pas à demander si vous êtes réglementé. Cherchez plutôt à comprendre comment l’organisation se rattache à un cyber système fédéral essentiel.',
  exposure: [
    ['Exploitant directement désigné', 'Votre organisation exploite un cyber système essentiel désigné dans un service ou système vital de compétence fédérale.'],
    ['Lien commercial', 'Vous fournissez logiciel, nuage, télécom, services gérés, équipement ou soutien opérationnel à une organisation qui pourrait être désignée.'],
    ['Effet stratégique', 'Clients, assureurs, prêteurs ou conseils exigent une gouvernance cyber renforcée même si la loi ne s’applique pas directement.'],
  ],
  sectorsTitle: 'Qui devrait porter une attention particulière',
  sectorsBody: 'Le cadre fédéral vise les exploitants désignés des secteurs fédéraux des finances, télécommunications, énergie et transports. La loi identifie les services et systèmes vitaux; les règlements préciseront les catégories désignées et les exigences détaillées.',
  sectors: ['Systèmes bancaires et de compensation', 'Services et installations de télécommunication', 'Systèmes énergétiques interprovinciaux ou internationaux', 'Systèmes d’énergie nucléaire', 'Systèmes de transport sous réglementation fédérale', 'Fournisseurs disposant d’un accès privilégié ou créant une dépendance importante'],
  obligationsTitle: 'Ce que la direction doit être prête à gouverner',
  obligationsIntro: 'La loi établit un cadre de contrôle. Le travail concret consiste à transformer chaque obligation en capacité opérationnelle attribuée et appuyée par des preuves.',
  obligations: [
    ['Programme de cybersécurité', 'Un programme documenté, appliqué et maintenu avec responsabilités, contrôles et révision.'],
    ['Systèmes et dépendances', 'Un inventaire défendable des systèmes, actifs, flux de données, responsables et dépendances de service.'],
    ['Risque de la chaîne d’approvisionnement', 'Des contrôles pour fournisseurs, services gérés, logiciels, équipements et tiers pouvant toucher les systèmes essentiels.'],
    ['Signalement des incidents', 'Des processus de détection, escalade et signalement respectant le délai prescrit, qui ne peut dépasser 72 heures.'],
    ['Changements importants', 'Un processus pour évaluer et signaler, au besoin, les changements de propriété, contrôle et chaîne d’approvisionnement.'],
    ['Instructions et dossiers', 'La capacité de recevoir des instructions, agir rapidement, conserver les dossiers et démontrer la conformité.'],
  ],
  questionsTitle: 'Questions que l’équipe de direction devrait poser maintenant',
  questions: [
    'Quels services, systèmes et engagements clients pourraient nous placer dans le cadre ou sa chaîne d’approvisionnement?',
    'Qui peut déclarer un cyberincident à signaler, et qui assure la relève?',
    'Pouvons-nous identifier les systèmes, données, clients et fournisseurs touchés assez vite pour soutenir un plafond de 72 heures?',
    'Quels tiers ont un accès privilégié ou pourraient interrompre un service essentiel?',
    'Quelles preuves montrent que nos contrôles fonctionnent réellement?',
    'Les équipes juridique, sécurité, opérations, communications et direction suivent-elles un même processus de décision?',
  ],
  roadmapTitle: 'Un parcours pratique de préparation sur 90 jours',
  roadmap: [
    ['Jours 1–30', 'Déterminer l’exposition', ['Cartographier services et clients des secteurs fédéraux.', 'Identifier les systèmes essentiels possibles et leurs dépendances.', 'Nommer un commanditaire et un responsable juridique ou conformité.', 'Consigner les hypothèses à confirmer.']],
    ['Jours 31–60', 'Constituer les preuves', ['Comparer les contrôles actuels aux obligations.', 'Cartographier décisions d’incident et données de signalement.', 'Réviser accès et contrats des fournisseurs critiques.', 'Créer un registre priorisé des mesures correctives.']],
    ['Jours 61–90', 'Exercer et gouverner', ['Tenir un exercice réaliste sur cyberincident.', 'Tester escalade et collecte de preuves.', 'Attribuer responsables, budget et échéances.', 'Établir un rapport trimestriel de préparation.']],
  ],
  evidenceTitle: 'La salle de preuves de préparation',
  evidenceIntro: 'Un programme crédible produit des preuves examinables sous pression. Commencez par une collection contrôlée et actuelle, pas une recherche de dernière minute.',
  evidence: ['Registre des systèmes essentiels et dépendances', 'Programme de cybersécurité et dossiers de gouvernance', 'Évaluations des risques et décisions de traitement', 'Plan d’incident, seuils et arbre de contacts', 'Inventaire fournisseurs, accès et contrôles contractuels', 'Résultats des tests de sauvegarde, reprise et continuité', 'Dossiers de formation et d’exercices', 'Tests des contrôles, exceptions et correctifs'],
  avoidTitle: 'Quatre erreurs coûteuses à éviter',
  avoid: [
    ['Attendre une certitude parfaite', 'Les règlements graduels comptent, mais inventaire, responsabilités et préparation aux incidents créent déjà de la valeur.'],
    ['Traiter le dossier comme un projet TI', 'Juridique, opérations, approvisionnement, communications et direction participent tous à la réponse.'],
    ['Croire qu’une certification suffit', 'SOC 2 ou ISO 27001 peuvent soutenir les preuves sans automatiquement démontrer la conformité à C-8.'],
    ['Acheter avant de définir l’écart', 'La technologie doit répondre à un besoin vérifié de contrôle, réponse ou preuve, sans remplacer la gouvernance.'],
  ],
  enforcementTitle: 'Pourquoi la préparation exige l’attention de la direction',
  enforcementBody: 'La loi prévoit inspections, ordonnances de conformité et sanctions administratives pécuniaires. Les maximums peuvent atteindre 500 000 $ pour une personne physique et 15 millions $ pour une autre personne ou organisation. Le risque commercial le plus important peut toutefois demeurer l’interruption, la perte de clients et l’incapacité de démontrer le contrôle pendant un incident.',
  sourcesTitle: 'Sources primaires',
  sourcesIntro: 'Utilisez la loi et les autorités fédérales responsables comme sources de vérité. Les exigences se préciseront avec les règlements et les directives.',
  ctaTitle: 'Transformez l’incertitude réglementaire en plan de préparation attribué.',
  ctaBody: 'ROALLA aide la direction à relier applicabilité, architecture technologique, dépendances, gouvernance fournisseurs, préparation aux incidents et preuves dans un programme pratique. L’interprétation juridique demeure la responsabilité de conseillers qualifiés; ROALLA coordonne le travail d’affaires et technologique nécessaire pour agir.',
  cta: 'Discuter de la préparation à C-8',
  service: 'Explorer le conseil technologique',
  guide: 'Obtenir le guide EI-49',
}

const sources = [
  ['Public Safety Canada — Royal Assent of Bill C-8', 'https://www.canada.ca/en/public-safety-canada/news/2026/06/government-of-canada-strengthens-cyber-security-and-critical-infrastructure-with-royal-assent-of-bill-c8.html'],
  ['Parliament of Canada — Royal Assent text', 'https://www.parl.ca/DocumentViewer/en/45-1/bill/C-8/royal-assent'],
  ['LEGISinfo — Bill C-8 status and documents', 'https://www.parl.ca/legisinfo/en/bill/45-1/c-8'],
  ['Library of Parliament — Legislative summary', 'https://library-biblio.parl.ca/staticfiles/PublicWebsite/Home/ResearchPublications/LegislativeSummaries/PDF/45-1/PV_45-1-C8-E.pdf'],
] as const

export default function BillC8CyberReadinessArticle({ locale, title, summary, readTime, category }: Props) {
  const c = locale === 'fr' ? FR : EN
  const exposureIcons = [Building2, Users, ShieldCheck]

  return <article className="bg-[#f4f7fb] text-slate-900">
    <header className="relative isolate overflow-hidden bg-[#07111f] px-4 pb-20 pt-16 text-white sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_20%,rgba(0,180,197,.32),transparent_30%),radial-gradient(circle_at_83%_80%,rgba(220,38,38,.14),transparent_24%),linear-gradient(120deg,#07111f_0%,#0b2030_58%,#083d47_100%)]" />
      <div className="absolute right-[8%] top-[12%] -z-10 hidden h-96 w-96 rounded-full border border-cyan-300/20 lg:block"><div className="absolute inset-14 rounded-full border border-cyan-300/15" /><ShieldCheck className="absolute inset-0 m-auto h-28 w-28 text-cyan-300/25" /></div>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">{c.status}</p>
        <p className="mt-6 text-sm font-semibold text-slate-300">{category} · {readTime}</p>
        <h1 className="mt-5 max-w-5xl font-serif text-5xl font-normal leading-[1.03] tracking-[-.045em] text-white sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-200 sm:text-2xl">{summary}</p>
        <div className="mt-8"><InsightShare title={title} /></div>
      </div>
    </header>

    <section className="px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.35fr_.65fr]">
      <div className="border-l-4 border-[#00b4c5] bg-white p-7 shadow-sm"><p className="font-serif text-2xl font-semibold leading-9 text-[#07111f]">{c.plain}</p></div>
      <div className="bg-amber-50 p-6 text-sm leading-6 text-amber-950"><Scale className="mb-3 h-6 w-6 text-amber-700" />{c.note}</div>
    </div></section>

    <section className="px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
      <h2 className="font-serif text-4xl tracking-[-.035em] text-[#07111f]">{c.exposureTitle}</h2><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{c.exposureIntro}</p>
      <div className="mt-9 grid gap-5 lg:grid-cols-3">{c.exposure.map(([heading, body], index) => { const Icon = exposureIcons[index]; return <div key={heading} className="border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(4,16,31,.06)]"><Icon className="h-7 w-7 text-[#008b98]" /><h3 className="mt-5 text-xl font-bold text-[#07111f]">{heading}</h3><p className="mt-3 leading-7 text-slate-600">{body}</p></div> })}</div>
    </div></section>

    <section className="bg-[#0b2030] px-4 py-16 text-white sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
      <div><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">Applicability lens</p><h2 className="mt-4 font-serif text-4xl text-white">{c.sectorsTitle}</h2><p className="mt-5 leading-8 text-slate-300">{c.sectorsBody}</p></div>
      <ul className="grid gap-px bg-white/15 sm:grid-cols-2">{c.sectors.map((item, index) => <li key={item} className="flex gap-4 bg-[#102b3a] p-5 text-sm font-semibold leading-6"><span className="text-cyan-300">0{index + 1}</span>{item}</li>)}</ul>
    </div></section>

    <section className="px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
      <h2 className="font-serif text-4xl tracking-[-.035em] text-[#07111f]">{c.obligationsTitle}</h2><p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">{c.obligationsIntro}</p>
      <div className="mt-10 overflow-hidden border border-slate-200 bg-white"><div className="hidden grid-cols-[.55fr_1.45fr] bg-[#07111f] px-6 py-4 text-xs font-bold uppercase tracking-[.16em] text-white md:grid"><span>Executive control area</span><span>Readiness outcome</span></div>{c.obligations.map(([heading, body]) => <div key={heading} className="grid gap-2 border-t border-slate-200 px-6 py-5 first:border-0 md:grid-cols-[.55fr_1.45fr] md:gap-8"><h3 className="font-bold text-[#07111f]">{heading}</h3><p className="leading-7 text-slate-600">{body}</p></div>)}</div>
    </div></section>

    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.72fr_1.28fr]"><div><Siren className="h-8 w-8 text-red-600" /><h2 className="mt-5 font-serif text-4xl text-[#07111f]">{c.questionsTitle}</h2></div><ol className="space-y-3">{c.questions.map((question, index) => <li key={question} className="flex gap-4 border border-slate-200 bg-[#f8fafc] p-5 leading-7 text-slate-700"><span className="font-bold text-[#008b98]">0{index + 1}</span>{question}</li>)}</ol></div></section>

    <section className="px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><Clock3 className="h-8 w-8 text-[#008b98]" /><h2 className="mt-5 font-serif text-4xl text-[#07111f]">{c.roadmapTitle}</h2><div className="mt-10 grid gap-6 lg:grid-cols-3">{c.roadmap.map(([days, heading, items], index) => <div key={days as string} className="relative overflow-hidden border border-slate-200 bg-white p-7"><span className="absolute right-4 top-1 font-serif text-7xl text-slate-100">{index + 1}</span><p className="text-xs font-bold uppercase tracking-[.16em] text-[#008b98]">{days as string}</p><h3 className="mt-4 text-2xl font-bold text-[#07111f]">{heading as string}</h3><ul className="mt-6 space-y-3">{(items as string[]).map(item => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><Check className="mt-1 h-4 w-4 shrink-0 text-[#008b98]" />{item}</li>)}</ul></div>)}</div></div></section>

    <section className="bg-[#dff6f8] px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><FileCheck2 className="h-8 w-8 text-[#007a87]" /><h2 className="mt-5 font-serif text-4xl text-[#07111f]">{c.evidenceTitle}</h2><p className="mt-4 leading-7 text-slate-700">{c.evidenceIntro}</p></div><ul className="grid gap-px bg-[#007a87]/20 sm:grid-cols-2">{c.evidence.map(item => <li key={item} className="flex gap-3 bg-white/80 p-5 text-sm font-semibold leading-6 text-slate-700"><Check className="mt-1 h-4 w-4 shrink-0 text-[#007a87]" />{item}</li>)}</ul></div></section>

    <section className="px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><h2 className="font-serif text-4xl text-[#07111f]">{c.avoidTitle}</h2><div className="mt-9 grid gap-5 md:grid-cols-2">{c.avoid.map(([heading, body]) => <div key={heading} className="border-t-4 border-red-600 bg-white p-6 shadow-sm"><h3 className="text-xl font-bold text-[#07111f]">{heading}</h3><p className="mt-3 leading-7 text-slate-600">{body}</p></div>)}</div><div className="mt-12 border-l-4 border-[#f5c518] bg-[#07111f] p-8 text-white"><h2 className="font-serif text-3xl text-white">{c.enforcementTitle}</h2><p className="mt-4 max-w-5xl leading-8 text-slate-300">{c.enforcementBody}</p></div></div></section>

    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><h2 className="font-serif text-3xl text-[#07111f]">{c.sourcesTitle}</h2><p className="mt-3 max-w-3xl leading-7 text-slate-600">{c.sourcesIntro}</p><ol className="mt-7 grid gap-3 md:grid-cols-2">{sources.map(([label, href], index) => <li key={href}><a href={href} target="_blank" rel="noreferrer" className="flex min-h-16 items-center justify-between gap-4 border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-[#00b4c5] hover:text-[#007a87]"><span><span className="mr-3 text-slate-400">{index + 1}.</span>{label}</span><ChevronRight className="h-4 w-4 shrink-0" /></a></li>)}</ol></div></section>

    <section className="bg-[#07111f] px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end"><div><ShieldCheck className="h-9 w-9 text-[#f5c518]" /><h2 className="mt-6 font-serif text-4xl text-white sm:text-5xl">{c.ctaTitle}</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{c.ctaBody}</p></div><div className="flex flex-col gap-3"><Link href={{ pathname: '/executive-insights', query: { guide: 'bill-c8-critical-cyber-systems-readiness' } }} className="inline-flex min-h-12 items-center justify-between bg-[#f5c518] px-5 text-sm font-bold text-[#07111f]">{c.guide}<ArrowRight className="h-4 w-4" /></Link><Link href={{ pathname: '/contact', query: { from_page: 'insight-bill-c8-readiness' } }} className="inline-flex min-h-12 items-center justify-between bg-[#00b4c5] px-5 text-sm font-bold text-[#07111f]">{c.cta}<ArrowRight className="h-4 w-4" /></Link><Link href="/services/technology-advisory" className="inline-flex min-h-12 items-center justify-between border border-white/25 px-5 text-sm font-bold text-white">{c.service}<ArrowRight className="h-4 w-4" /></Link></div></div></section>
  </article>
}
