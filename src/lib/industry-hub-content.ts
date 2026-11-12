import { aiEmployeeContent } from './ai-employee-content'
import {
  INDUSTRY_HUB_PRIORITY,
  FEATURED_INDUSTRY_HUB_IDS,
  relatedServicesForIndustry,
  type IndustryStartHereTarget,
  type IndustryHubProof,
} from './industry-hub-priority'

export { FEATURED_INDUSTRY_HUB_IDS } from './industry-hub-priority'

export const INDUSTRY_HUB_IDS = [
  'it-msp',
  'recruiting-staffing',
  'trades-field',
  'transportation-logistics',
  'warehouses',
  'care-practices',
  'manufacturing',
  'legal',
  'accounting-tax',
  'real-estate-property',
  'veterinary',
  'insurance-brokerage',
  'immigration-settlement',
  'home-care-seniors',
  'municipal-public',
] as const
export type IndustryHubId = (typeof INDUSTRY_HUB_IDS)[number]
export type IndustryHubServiceKey =
  | 'aiEmployee'
  | 'security'
  | 'ucaas'
  | 'ccaas'
  | 'cloudMigration'
  | 'automation'
  | 'visibility'
  | 'websites'
export type IndustryHubServiceBlock = {
  eyebrow: string
  title: string
  lead: string
  points: string[]
  ctaLabel: string
  href: string
}
export type IndustryHubStartHere = {
  title: string
  lead: string
  ctaLabel: string
  target: IndustryStartHereTarget
}

export type IndustryHubProofLink = {
  label: string
  proof: IndustryHubProof
}

export type IndustryHub = {
  id: IndustryHubId
  label: string
  shortLabel: string
  image: { src: string; alt: string }
  metadataTitle: string
  metadataDescription: string
  hero: {
    eyebrow: string
    title: string
    lead: string
    primaryCta: string
    secondaryCta: string
  }
  pressuresTitle: string
  pressures: string[]
  leadServices: readonly IndustryHubServiceKey[]
  relatedServices: readonly IndustryHubServiceKey[]
  startHere: IndustryHubStartHere
  proof: IndustryHubProofLink
  services: Record<IndustryHubServiceKey, IndustryHubServiceBlock>
  closer: {
    title: string
    lead: string
    primaryCta: string
    secondaryCta: string
  }
  ui: {
    startHereEyebrow: string
    proofEyebrow: string
    leadTilesTitle: string
    relatedTitle: string
    relatedLead: string
  }
}

/** Prefer crisp library tiles (automation-ai style) over muddy card washes. */
export function toIndustryOptImageSrc(src: string) {
  return src.replace(/\.card\.webp$/i, '.opt.webp').replace(/\.hero\.webp$/i, '.opt.webp')
}

export const INDUSTRY_SERVICE_TILE_IMAGES: Record<IndustryHubServiceKey, string> = {
  aiEmployee: '/images/insights/library/practical-ai-use-cases.opt.webp',
  security: '/images/insights/library/it-provider-who-owns-risk.opt.webp',
  ucaas: '/images/insights/library/analog-to-ip-business-telephony.opt.webp',
  ccaas: '/images/insights/library/analog-to-ip-business-telephony.opt.webp',
  cloudMigration: '/images/insights/library/twelve-month-technology-roadmap.opt.webp',
  automation: '/images/insights/library/what-to-automate-first.opt.webp',
  visibility: '/images/insights/library/search-and-ai-visibility.opt.webp',
  websites: '/images/insights/library/website-after-launch.opt.webp',
}
export type IndustryHubIndexCopy = {
  title: string
  lead: string
  items: { id: IndustryHubId; label: string; blurb: string }[]
}
type HubLocale = 'en' | 'fr'
type ServiceCopy = { title: string; lead: string; points: [string, string, string] }
type HubData = {
  blurb: string
  metaTitle: string
  metaDescription: string
  heroTitle: string
  heroLead: string
  pressuresTitle: string
  pressures: string[]
  closerTitle: string
  closerLead: string
  s: Record<IndustryHubServiceKey, ServiceCopy>
}
type HubDataMap = Partial<Record<IndustryHubId, HubData>>
const sv = (title: string, lead: string, a: string, b: string, c: string): ServiceCopy => ({
  title,
  lead,
  points: [a, b, c],
})
export const SERVICE_KEYS: readonly IndustryHubServiceKey[] = [
  'aiEmployee',
  'security',
  'ucaas',
  'ccaas',
  'cloudMigration',
  'automation',
  'visibility',
  'websites',
]
const SERVICE_HREFS: Record<IndustryHubServiceKey, string> = {
  aiEmployee: '/ai-employee',
  security: '/services/security-risk-compliance',
  ucaas: '/solutions/communications',
  ccaas: '/solutions/communications',
  cloudMigration: '/solutions/cloud-infrastructure',
  automation: '/services/automation',
  visibility: '/services/search-ai-visibility',
  websites: '/website-design',
}
const SERVICE_FRAME: Record<HubLocale, Record<IndustryHubServiceKey, { eyebrow: string; ctaLabel: string }>> = {
  en: {
    aiEmployee: { eyebrow: 'AI Employee', ctaLabel: 'Explore AI Employee' },
    security: { eyebrow: 'Security, risk & compliance', ctaLabel: 'See security & compliance' },
    ucaas: { eyebrow: 'Business phone & UCaaS', ctaLabel: 'Explore business communications' },
    ccaas: { eyebrow: 'Contact center (CCaaS)', ctaLabel: 'Explore contact center' },
    cloudMigration: { eyebrow: 'Cloud & infrastructure', ctaLabel: 'Plan your cloud move' },
    automation: { eyebrow: 'Workflow automation', ctaLabel: 'See automation' },
    visibility: { eyebrow: 'Search & AI visibility', ctaLabel: 'Improve your visibility' },
    websites: { eyebrow: 'Website design', ctaLabel: 'See website design' },
  },
  fr: {
    aiEmployee: { eyebrow: 'Employé IA', ctaLabel: 'Découvrir l’Employé IA' },
    security: { eyebrow: 'Sécurité, risque et conformité', ctaLabel: 'Voir sécurité et conformité' },
    ucaas: { eyebrow: 'Téléphonie d’affaires et UCaaS', ctaLabel: 'Découvrir les communications d’affaires' },
    ccaas: { eyebrow: 'Centre de contact (CCaaS)', ctaLabel: 'Découvrir le centre de contact' },
    cloudMigration: { eyebrow: 'Infonuagique et infrastructure', ctaLabel: 'Planifier votre migration' },
    automation: { eyebrow: 'Automatisation des processus', ctaLabel: 'Voir l’automatisation' },
    visibility: { eyebrow: 'Visibilité en recherche et en IA', ctaLabel: 'Améliorer votre visibilité' },
    websites: { eyebrow: 'Conception de sites web', ctaLabel: 'Voir la conception de sites' },
  },
}
const SHARED_COPY: Record<
  HubLocale,
  {
    heroEyebrow: (label: string) => string
    primaryCta: string
    secondaryCta: (label: string) => string
    closerPrimaryCta: string
    closerSecondaryCta: string
    startHereEyebrow: string
    startHereTitle: string
    startHereCta: Record<IndustryStartHereTarget, string>
    proofEyebrow: string
    leadTilesTitle: string
    relatedTitle: string
    relatedLead: string
    indexTitle: string
    indexLead: string
  }
> = {
  en: {
    heroEyebrow: (label) => `Industry hub · ${label}`,
    primaryCta: 'Book a free consultation',
    secondaryCta: (label) => `Explore AI Employee for ${label}`,
    closerPrimaryCta: 'Talk to Roalla',
    closerSecondaryCta: 'Browse all industries',
    startHereEyebrow: 'Start here',
    startHereTitle: 'The practical first move for this industry',
    startHereCta: {
      'ai-employee': 'Explore AI Employee for this industry',
      'fit-brief': 'Check AI Employee fit',
      security: 'Review security & compliance',
      communications: 'Explore business communications',
      assessment: 'Find your starting point',
    },
    proofEyebrow: 'Related reading',
    leadTilesTitle: 'Priority paths for this industry',
    relatedTitle: 'Also relevant here',
    relatedLead: 'Other ROALLA paths that often help this industry move forward.',
    indexTitle: 'Technology built around your industry',
    indexLead:
      'Every sector runs on different rules, rhythms, and risks. Pick your industry to see how AI Employees, secure infrastructure, communications, automation, visibility, and websites fit together for teams like yours.',
  },
  fr: {
    heroEyebrow: (label) => `Pôle sectoriel · ${label}`,
    primaryCta: 'Réserver une consultation gratuite',
    secondaryCta: (label) => `Découvrir l’Employé IA pour ${label}`,
    closerPrimaryCta: 'Parler à Roalla',
    closerSecondaryCta: 'Voir tous les secteurs',
    startHereEyebrow: 'Commencez ici',
    startHereTitle: 'Le premier pas pratique pour ce secteur',
    startHereCta: {
      'ai-employee': 'Découvrir l’Employé IA pour ce secteur',
      'fit-brief': 'Vérifier l’adéquation de l’Employé IA',
      security: 'Revoir sécurité et conformité',
      communications: 'Explorer les communications d’affaires',
      assessment: 'Trouver votre point de départ',
    },
    proofEyebrow: 'Lecture connexe',
    leadTilesTitle: 'Parcours prioritaires pour ce secteur',
    relatedTitle: 'Aussi pertinent ici',
    relatedLead: 'D’autres parcours ROALLA qui aident souvent ce secteur à progresser.',
    indexTitle: 'Une technologie pensée pour votre industrie',
    indexLead:
      'Chaque secteur a ses règles, son rythme et ses risques. Choisissez votre industrie pour voir comment l’Employé IA, l’infrastructure sécurisée, les communications, l’automatisation, la visibilité et les sites web s’assemblent pour des équipes comme la vôtre.',
  },
}

const START_HERE_LEAD: Record<HubLocale, Record<IndustryHubId, string>> = {
  en: {
    'it-msp': 'Most MSP and internal IT teams gain the most by covering Tier-1 intake first, then hardening the provider’s own security footprint.',
    'recruiting-staffing': 'Start by covering candidate and client intake after hours—then tighten the calling path recruiters live on.',
    'trades-field': 'Answer and qualify the next missed call before you rebuild the whole stack.',
    'transportation-logistics': 'Stabilize shipper and exception communications, then layer AI coverage on the highest-volume questions.',
    warehouses: 'Clear the inventory and appointment questions that interrupt the floor, then migrate fragile warehouse systems deliberately.',
    'care-practices': 'Protect patient access and privacy boundaries first—then expand automation only where clinic rules allow.',
    manufacturing: 'Protect plant-adjacent IT and keep the order desk reachable before broader modernization.',
    legal: 'Cover intake without giving advice, then harden confidentiality controls clients and insurers expect.',
    'accounting-tax': 'Absorb seasonal intake and document chase first, with sober controls around client financial data.',
    'real-estate-property': 'Stop dropping leads and tenant requests, then make the public footprint match the areas you actually serve.',
    veterinary: 'Separate emergency triage from routine booking so the clinical team stays focused.',
    'insurance-brokerage': 'Qualify new business and protect sensitive applications before adding more service automation.',
    'immigration-settlement': 'Capture multilingual enquiries cleanly without automating advice, then protect identity-heavy files.',
    'home-care-seniors': 'Give families a dignified after-hours path, then stabilize scheduling communications.',
    'municipal-public': 'Clarify which resident requests can be answered routinely versus routed with ownership.',
  },
  fr: {
    'it-msp': 'La plupart des MSP et TI internes gagnent le plus en couvrant d’abord l’accueil de niveau 1, puis en renforçant la sécurité du fournisseur lui-même.',
    'recruiting-staffing': 'Commencez par couvrir l’accueil candidats et clients hors des heures—puis resserrez le parcours d’appels des recruteurs.',
    'trades-field': 'Répondez et qualifiez le prochain appel manqué avant de reconstruire toute la pile.',
    'transportation-logistics': 'Stabilisez les communications expéditeurs et exceptions, puis ajoutez la couverture IA sur les questions les plus fréquentes.',
    warehouses: 'Clarifiez les questions d’inventaire et de rendez-vous qui interrompent le plancher, puis migrez les systèmes fragiles avec méthode.',
    'care-practices': 'Protégez d’abord l’accès patients et les limites de confidentialité—puis étendez l’automatisation seulement où les règles cliniques le permettent.',
    manufacturing: 'Protégez les TI proches de l’usine et gardez le bureau des commandes joignable avant une modernisation plus large.',
    legal: 'Couvrez l’accueil sans donner de conseils, puis renforcez les contrôles de confidentialité attendus par clients et assureurs.',
    'accounting-tax': 'Absorbez d’abord l’accueil saisonnier et les relances de documents, avec des contrôles sobres sur les données financières.',
    'real-estate-property': 'Cessez de perdre prospects et demandes de locataires, puis alignez la présence publique sur les secteurs réellement desservis.',
    veterinary: 'Séparez le triage d’urgence des réservations courantes pour que l’équipe clinique reste concentrée.',
    'insurance-brokerage': 'Qualifiez les nouvelles affaires et protégez les demandes sensibles avant d’ajouter plus d’automatisation de service.',
    'immigration-settlement': 'Saisissez clairement les demandes multilingues sans automatiser les conseils, puis protégez les dossiers riches en identité.',
    'home-care-seniors': 'Offrez aux familles un parcours hors des heures digne, puis stabilisez les communications de planification.',
    'municipal-public': 'Clarifiez quelles demandes résidentes peuvent être répondues de façon routinière versus acheminées avec responsabilité claire.',
  },
}

const PROOF_LABEL: Record<HubLocale, Record<IndustryHubId, string>> = {
  en: {
    'it-msp': 'Who owns risk when you use an IT provider?',
    'recruiting-staffing': 'Hire another recruiter—or fix the work first?',
    'trades-field': 'Capture leads before they cool off',
    'transportation-logistics': 'Modernize communications for operations teams',
    warehouses: 'Automate the workflows that stall the floor',
    'care-practices': 'Stop collecting personal information you do not need',
    manufacturing: 'A twelve-month technology roadmap that respects production',
    legal: 'Set client boundaries without damaging relationships',
    'accounting-tax': 'Measure whether your software stack creates value',
    'real-estate-property': 'Is your pipeline a real pipeline—or a contact list?',
    veterinary: 'Communications modernization for service desks',
    'insurance-brokerage': 'Should you say yes to this opportunity?',
    'immigration-settlement': 'Structured data that helps people find the right service',
    'home-care-seniors': 'Could the business operate two weeks without you?',
    'municipal-public': 'Source cybersecurity with clear ownership',
  },
  fr: {
    'it-msp': 'Qui porte le risque lorsque vous utilisez un fournisseur TI?',
    'recruiting-staffing': 'Embaucher un autre recruteur—ou corriger le travail d’abord?',
    'trades-field': 'Capturer les prospects avant qu’ils ne refroidissent',
    'transportation-logistics': 'Moderniser les communications pour les équipes d’exploitation',
    warehouses: 'Automatiser les flux qui bloquent le plancher',
    'care-practices': 'Cesser de collecter des renseignements personnels inutiles',
    manufacturing: 'Une feuille de route technologique de douze mois qui respecte la production',
    legal: 'Fixer des limites clients sans nuire aux relations',
    'accounting-tax': 'Mesurer si votre pile logicielle crée de la valeur',
    'real-estate-property': 'Votre pipeline est-il réel—ou une liste de contacts?',
    veterinary: 'Modernisation des communications pour les bureaux de service',
    'insurance-brokerage': 'Devriez-vous dire oui à cette occasion?',
    'immigration-settlement': 'Des données structurées qui aident à trouver le bon service',
    'home-care-seniors': 'L’entreprise pourrait-elle fonctionner deux semaines sans vous?',
    'municipal-public': 'Sourcer la cybersécurité avec une responsabilité claire',
  },
}
const EN_1: HubDataMap = {
  'it-msp': {
    blurb: 'Service desks, client SLAs, and the security you are accountable for.',
    metaTitle: 'Technology for IT & Managed Service Providers | Roalla',
    metaDescription:
      'AI service desk coverage, hardened internal security, unified communications, contact center routing, cloud, automation, visibility, and websites for IT teams and MSPs.',
    heroTitle: 'Run a tighter service desk without burning out your technicians',
    heroLead:
      'IT teams and MSPs sell reliability, yet their own phones, tickets, and tooling often run on goodwill. Roalla helps you triage faster, protect your own stack, and win the clients who value a calm provider.',
    pressuresTitle: 'What keeps IT leaders and MSP owners up at night',
    pressures: [
      'Ticket queues that grow after hours while senior techs are stuck on password resets',
      'Clients who expect a human response in minutes but will not pay for a 24/7 desk',
      'Being the juiciest target in your clients’ supply chain, with your own security audited by nobody',
      'Tool sprawl across PSA, RMM, phone, and documentation that no one has time to integrate',
    ],
    closerTitle: 'Give your technicians their evenings back and your clients a faster answer',
    closerLead:
      'Tell us how your desk runs today. We will map where an AI front line, tighter security, and cleaner workflows cut the most noise first.',
    s: {
      aiEmployee: sv(
        'An AI front line for every ticket and call',
        'The AI Employee answers support requests around the clock, resolves routine issues from your runbooks, and escalates real incidents with logs, device, and impact already captured.',
        'Password resets, access requests, and how-to questions closed without a technician touching them.',
        'Priority incidents routed to the on-call engineer with a structured summary, not a voicemail.',
        'Consistent after-hours coverage that never improvises outside the runbooks you approve.',
      ),
      security: sv(
        'Hold your own house to the standard you sell',
        'Providers hold privileged access to many networks. We help you prove your own posture with controls, evidence, and incident plans that stand up to a client’s security questionnaire.',
        'Privileged access, MFA, and tool-vault hygiene reviewed across RMM, PSA, and documentation platforms.',
        'Evidence packs mapped to the frameworks your clients ask about, ready before the questionnaire arrives.',
        'A rehearsed incident plan covering a compromised RMM or stolen technician credential.',
      ),
      ucaas: sv(
        'Phones that follow your on-call engineers',
        'Reliable business voice and messaging let a distributed support team act as one desk, whether technicians are in the office, at a client site, or on call at 2 a.m.',
        'Softphone and mobile apps so on-call engineers answer on the company number without sharing personal lines.',
        'Call recording and transcripts that settle “what did we agree to” disputes with clients.',
        'Presence and team messaging so escalations reach the right engineer on the first attempt.',
      ),
      ccaas: sv(
        'Queues, SLAs, and escalation that match your contracts',
        'A contact center layer gives your service desk skills-based routing, priority lanes for premium clients, and live reporting on whether you are meeting the response times you promised.',
        'Route by client tier, so a P1 from a managed account never waits behind general enquiries.',
        'Real-time and historical dashboards on answer time, abandonment, and SLA breach risk.',
        'Callback and overflow options that protect response times during outages and busy mornings.',
      ),
      cloudMigration: sv(
        'Cloud practices you can repeat across clients',
        'We help you standardize landing zones, identity, and backup patterns so every migration you deliver is faster, safer, and easier to support, and so your own platform is not a snowflake.',
        'Reusable tenant and landing-zone baselines that cut onboarding time for new clients.',
        'Cost visibility and tagging so you can bill, and defend, cloud spend with confidence.',
        'Backup and recovery tests documented per client, not assumed.',
      ),
      automation: sv(
        'Remove the swivel-chair work from your desk',
        'Most MSP margin leaks in manual steps between PSA, RMM, billing, and onboarding. We automate the hand-offs that technicians repeat dozens of times a week.',
        'New-client and new-hire onboarding that provisions accounts, licences, and documentation from one trigger.',
        'Ticket enrichment that attaches asset, contract, and history before a technician opens the ticket.',
        'Monthly reporting and billing reconciliation assembled automatically for review rather than built by hand.',
      ),
      visibility: sv(
        'Be the provider prospects find and trust',
        'Buyers research IT providers long before they call. We make your expertise visible in search and in AI answers, with local presence and proof that reads as credible, not salesy.',
        'Service and location pages structured so search engines and AI assistants understand what you manage and where.',
        'Case studies and security content that answer the questions a nervous buyer actually asks.',
        'Review and listing hygiene that supports local “IT support near me” searches.',
      ),
      websites: sv(
        'A website that sells reliability',
        'Your site should feel as dependable as your service. We design clear, fast websites that explain your tiers, show your process, and make “get support” and “book an assessment” obvious.',
        'Plain-language service tiers and onboarding steps that remove the fear of switching providers.',
        'A client support entry point that routes existing clients to the desk and new prospects to sales.',
        'Security-minded build and hosting, because a provider’s own website is judged on its hygiene.',
      ),
    },
  },
  'recruiting-staffing': {
    blurb: 'Speed to candidate, speed to client, and clean data in between.',
    metaTitle: 'Technology for Recruiting & Staffing Firms | Roalla',
    metaDescription:
      'AI intake for candidates and clients, secure applicant data, unified communications, contact center routing, cloud, automation, visibility, and websites for staffing firms.',
    heroTitle: 'Fill roles faster while recruiters spend their time on relationships',
    heroLead:
      'Recruiting is won in the first hour: the first reply to a candidate, the first call-back to a client. Roalla builds the front line and back office that keep your desk responsive without adding admin headcount.',
    pressuresTitle: 'Where recruiting desks lose placements',
    pressures: [
      'Candidates who go cold or accept elsewhere while waiting for a first reply',
      'Client job orders that arrive after hours and sit until the next morning',
      'Resume, assessment, and consent data scattered across ATS, inbox, and spreadsheets',
      'Recruiters retyping the same notes into the ATS, the CRM, and the client update',
    ],
    closerTitle: 'Be the first reply, every time',
    closerLead:
      'Share how candidates and clients reach you today. We will show where faster response and cleaner data win you more placements.',
    s: {
      aiEmployee: sv(
        'Every candidate and client answered in minutes',
        'The AI Employee greets candidates and clients on phone, chat, and email, qualifies roles and availability, books screens, and hands recruiters a complete summary before they dial.',
        'Candidate pre-screens covering availability, pay range, location, and work authorization questions you configure.',
        'Client job-order capture with role, urgency, and budget structured for the ATS.',
        'Interview booking and reminders that cut no-shows without recruiter effort.',
      ),
      security: sv(
        'Protect the personal data candidates trust you with',
        'Resumes, IDs, references, and background checks make staffing firms a rich target. We tighten access, retention, and vendor controls so you can answer privacy questions with confidence.',
        'Role-based access to ATS and candidate files, with offboarding that removes recruiter access the day they leave.',
        'Retention and consent practices aligned with Canadian privacy expectations, including Law 25 in Quebec.',
        'Phishing and payment-fraud defences for the fake-client and fake-candidate scams common in staffing.',
      ),
      ucaas: sv(
        'One number, every recruiter, every device',
        'Unified communications let recruiters call, text, and meet from the firm’s identity, keep every conversation logged, and cover for each other when a colleague is on a client visit.',
        'Business texting and calling from desktop and mobile with candidate history attached.',
        'Shared team lines and ring groups so no client call lands in a personal voicemail.',
        'Video interviewing and meeting links built into the same platform recruiters already use.',
      ),
      ccaas: sv(
        'Handle hiring surges without hiring a call team',
        'When a client launches a mass hire or a job board posting goes live, enquiries spike. A contact center layer routes, queues, and reports so surges do not bury your recruiters.',
        'Separate queues for candidates, clients, and consultants already on assignment.',
        'Voicemail-to-ticket and callback so no lead disappears in the surge.',
        'Reporting on response time by role and channel, to see which postings leak candidates.',
      ),
      cloudMigration: sv(
        'Put your ATS, CRM, and files on solid ground',
        'Staffing firms accumulate years of data across tools and shared drives. We consolidate and migrate to secure cloud platforms with sensible structure, permissions, and recovery.',
        'File-share clean-up that separates client, candidate, and internal records with the right permissions.',
        'Secure connections between ATS, CRM, payroll, and timesheet tools.',
        'Backup and recovery planned around payroll deadlines, when downtime hurts most.',
      ),
      automation: sv(
        'Stop retyping the same placement three times',
        'We connect your ATS, CRM, email, and onboarding so one candidate update flows everywhere it should, and the routine steps between submission and start date happen on their own.',
        'Resume parsing and record creation that populate the ATS without manual entry.',
        'Submission, interview, and offer notifications sent to clients and candidates automatically.',
        'Onboarding checklists for documents, contracts, and start-day logistics triggered by an accepted offer.',
      ),
      visibility: sv(
        'Be found by the talent and clients you want',
        'Job seekers and hiring managers both search before they call. We build discoverability for your niches, locations, and roles, in classic search and in AI-generated answers.',
        'Job and specialty pages structured for search and for Google for Jobs-style discovery.',
        'Employer-side content that tells hiring managers how you vet and place talent.',
        'Local and niche landing pages for the regions and industries you serve best.',
      ),
      websites: sv(
        'Two audiences, one clear website',
        'Candidates want open roles and a fast apply. Clients want proof and a simple way to brief you. We design sites that serve both without making either hunt for their path.',
        'Mobile-first job listings and a short apply flow that does not lose candidates halfway.',
        'A client brief form that captures the details recruiters need on the first contact.',
        'Specialty and testimonial pages that show how you are different from a job board.',
      ),
    },
  },
  'trades-field': {
    blurb: 'Missed calls, scattered jobs, and the paperwork after the truck leaves.',
    metaTitle: 'Technology for Trades & Field Service Businesses | Roalla',
    metaDescription:
      'AI call answering, secure job data, mobile business phones, contact center routing, cloud tools, automation, local visibility, and websites for trades and field service.',
    heroTitle: 'Stop losing jobs to the call you could not answer',
    heroLead:
      'When the crew is on a roof or under a sink, the phone still rings, and the next contractor is one Google search away. Roalla keeps your intake, dispatch, and follow-up running while your team works.',
    pressuresTitle: 'Why good trades businesses leak revenue',
    pressures: [
      'Calls missed while techs are on site, and customers who simply call the next company',
      'Emergency work buried among quote requests with no clear way to prioritize',
      'Job details taken on scraps of paper and retyped into the invoice days later',
      'A website and online presence that do not reflect the quality of the work',
    ],
    closerTitle: 'Keep the crew working and the phone answered',
    closerLead:
      'Tell us how calls, quotes, and jobs flow today. We will point to the quickest fixes that win back missed work.',
    s: {
      aiEmployee: sv(
        'Every call answered, every job captured',
        'The AI Employee picks up when your crew cannot, qualifies the job, books routine visits, and sends true emergencies straight to the right tech with the address and problem already noted.',
        'Calls and texts answered after hours and during jobs, with the job type, address, and photos requested.',
        'Emergency versus routine triage using the rules you set, with live escalation to on-call techs.',
        'Quote and booking follow-ups so the estimate does not go cold after the first visit.',
      ),
      security: sv(
        'Protect customer homes, keys, and payments',
        'Trades businesses hold addresses, access codes, and card details on phones and tablets that travel everywhere. We secure the devices and accounts that carry them.',
        'Mobile device management and lock-and-wipe for lost or stolen technician phones.',
        'Protection against invoice and payment-redirect fraud aimed at small contractors.',
        'Access codes and customer notes kept in controlled systems instead of shared group chats.',
      ),
      ucaas: sv(
        'One business number that follows the crew',
        'A modern business phone system lets the office, owners, and technicians work from one company number, with calls forwarded smartly rather than landing on someone’s personal cell.',
        'Mobile app so technicians call and text customers from the company number, not a personal one.',
        'Business hours, holiday, and on-call schedules that route calls without manual call-forwarding.',
        'Voicemail transcribed to text so quote requests are read in seconds, not listened to in the truck.',
      ),
      ccaas: sv(
        'Dispatch-ready call handling for busy seasons',
        'When a storm hits or the heating season starts, calls pile up. A contact center layer queues, prioritizes, and calls back so nobody is left on hold or sent to voicemail.',
        'Priority routing for emergencies with overflow to a second dispatcher or answering service.',
        'Queue callbacks that hold a customer’s place instead of forcing a redial.',
        'Call volume reports that show when to add seasonal help.',
      ),
      cloudMigration: sv(
        'Move job data off paper and one laptop',
        'We move quoting, scheduling, photos, and invoices to secure cloud tools so the office and the crew see the same job, and a broken laptop is an inconvenience, not a disaster.',
        'Field service and accounting tools connected so job completion triggers the invoice.',
        'Shared photo and document storage organized by job and customer.',
        'Backups that protect years of customer history and warranty records.',
      ),
      automation: sv(
        'From completed job to paid invoice, with fewer touches',
        'We automate the admin that follows every job, such as confirmations, reminders, invoices, and review requests, so the owner is not doing paperwork at night.',
        'Appointment confirmations and “on our way” messages sent automatically.',
        'Invoice generation and payment reminders triggered when a job is marked complete.',
        'Review requests after good jobs and seasonal maintenance reminders to past customers.',
      ),
      visibility: sv(
        'Be the first name on the local map',
        'Most trades jobs start with “near me” searches. We optimize your Google profile, service areas, and reviews so you show up, and look trustworthy, at the moment of need.',
        'Google Business Profile tuned with services, areas, photos, and fresh before-and-after work.',
        'Service-and-city pages that capture searches like “emergency plumber” in your actual territory.',
        'A review process that steadily builds the ratings customers compare you on.',
      ),
      websites: sv(
        'A website that gets the phone to ring',
        'We build fast, mobile-first sites where a worried homeowner can call, text, or request a quote in one tap, and see real work, real reviews, and the areas you serve.',
        'Tap-to-call and short quote forms placed where customers actually decide.',
        'Project galleries and reviews that show the quality of the work.',
        'Clear service-area and licensing information that builds trust before the first call.',
      ),
    },
  },
}
const FR_1: HubDataMap = {
  'it-msp': {
    blurb: 'Bureaux de service, ententes de niveau de service et la sécurité dont vous répondez.',
    metaTitle: 'Technologie pour les fournisseurs TI et services gérés | Roalla',
    metaDescription:
      'Couverture IA du centre de service, sécurité interne renforcée, communications unifiées, acheminement de centre de contact, infonuagique, automatisation, visibilité et sites web pour équipes TI et MSP.',
    heroTitle: 'Un bureau de service plus solide, sans épuiser vos techniciens',
    heroLead:
      'Les équipes TI et les MSP vendent la fiabilité, mais leurs propres téléphones, billets et outils reposent souvent sur la bonne volonté. Roalla vous aide à trier plus vite, à protéger votre propre environnement et à gagner les clients qui valorisent un fournisseur serein.',
    pressuresTitle: 'Ce qui empêche les chefs TI et propriétaires de MSP de dormir',
    pressures: [
      'Des files de billets qui gonflent hors des heures pendant que les techniciens seniors réinitialisent des mots de passe',
      'Des clients qui exigent une réponse humaine en quelques minutes sans vouloir payer un service 24/7',
      'Être la cible la plus intéressante de la chaîne d’approvisionnement de vos clients, avec une sécurité que personne n’audite',
      'Une multiplication d’outils (PSA, RMM, téléphonie, documentation) que personne n’a le temps d’intégrer',
    ],
    closerTitle: 'Rendez vos soirées à vos techniciens et une réponse plus rapide à vos clients',
    closerLead:
      'Dites-nous comment fonctionne votre bureau aujourd’hui. Nous cernerons où une première ligne IA, une sécurité resserrée et des flux plus propres réduisent le plus de bruit en premier.',
    s: {
      aiEmployee: sv(
        'Une première ligne IA pour chaque billet et chaque appel',
        'L’Employé IA répond aux demandes de soutien jour et nuit, règle les problèmes courants à partir de vos procédures et escalade les vrais incidents avec journaux, appareil et impact déjà consignés.',
        'Réinitialisations de mots de passe, demandes d’accès et questions pratiques réglées sans intervention d’un technicien.',
        'Incidents prioritaires acheminés à l’ingénieur de garde avec un résumé structuré, pas une boîte vocale.',
        'Une couverture hors heures constante qui n’improvise jamais en dehors des procédures que vous approuvez.',
      ),
      security: sv(
        'Appliquez chez vous la norme que vous vendez',
        'Les fournisseurs détiennent des accès privilégiés à de nombreux réseaux. Nous vous aidons à démontrer votre propre posture avec des contrôles, des preuves et des plans d’incident qui résistent au questionnaire de sécurité d’un client.',
        'Accès privilégiés, AMF et hygiène des coffres d’outils révisés sur les plateformes RMM, PSA et de documentation.',
        'Dossiers de preuves alignés sur les cadres que vos clients demandent, prêts avant l’arrivée du questionnaire.',
        'Un plan d’incident répété couvrant un RMM compromis ou des identifiants de technicien volés.',
      ),
      ucaas: sv(
        'Des téléphones qui suivent vos ingénieurs de garde',
        'Une voix et une messagerie d’affaires fiables permettent à une équipe de soutien répartie d’agir comme un seul bureau, que les techniciens soient au bureau, chez un client ou de garde à 2 h du matin.',
        'Logiciel de téléphonie et applis mobiles pour répondre sous le numéro de l’entreprise sans partager de lignes personnelles.',
        'Enregistrements et transcriptions d’appels qui règlent les litiges du type « qu’avions-nous convenu ».',
        'Présence et messagerie d’équipe pour que les escalades atteignent le bon ingénieur dès la première tentative.',
      ),
      ccaas: sv(
        'Files, ententes de service et escalade alignées sur vos contrats',
        'Une couche de centre de contact donne à votre bureau de service un acheminement par compétences, des voies prioritaires pour les clients premium et des rapports en direct sur le respect des délais promis.',
        'Acheminement par niveau de client : un P1 d’un compte géré n’attend jamais derrière les demandes générales.',
        'Tableaux de bord en temps réel et historiques sur le temps de réponse, l’abandon et le risque de manquement.',
        'Rappel et débordement qui protègent les délais pendant les pannes et les matins chargés.',
      ),
      cloudMigration: sv(
        'Des pratiques infonuagiques reproductibles d’un client à l’autre',
        'Nous vous aidons à normaliser zones d’accueil, identité et modèles de sauvegarde pour que chaque migration soit plus rapide, plus sûre et plus facile à soutenir, et que votre propre plateforme ne soit pas un cas unique.',
        'Bases de locataire et de zone d’accueil réutilisables qui réduisent le temps d’intégration d’un nouveau client.',
        'Visibilité des coûts et étiquetage pour facturer, et défendre, les dépenses infonuagiques avec assurance.',
        'Tests de sauvegarde et de reprise documentés par client, et non présumés.',
      ),
      automation: sv(
        'Éliminez le travail de chaise tournante de votre bureau',
        'La marge d’un MSP fuit dans les étapes manuelles entre PSA, RMM, facturation et intégration. Nous automatisons les transferts que les techniciens répètent des dizaines de fois par semaine.',
        'Intégration d’un nouveau client ou employé qui crée comptes, licences et documentation depuis un seul déclencheur.',
        'Enrichissement des billets : actif, contrat et historique joints avant que le technicien ouvre le billet.',
        'Rapports mensuels et rapprochement de facturation assemblés automatiquement pour révision plutôt que montés à la main.',
      ),
      visibility: sv(
        'Soyez le fournisseur que les prospects trouvent et en qui ils ont confiance',
        'Les acheteurs recherchent un fournisseur TI bien avant d’appeler. Nous rendons votre expertise visible dans la recherche et les réponses IA, avec une présence locale et des preuves crédibles plutôt que promotionnelles.',
        'Pages de services et de zones structurées pour que moteurs et assistants IA comprennent ce que vous gérez et où.',
        'Études de cas et contenu sécurité qui répondent aux vraies questions d’un acheteur inquiet.',
        'Hygiène des avis et des fiches pour soutenir les recherches locales de type « soutien TI près de moi ».',
      ),
      websites: sv(
        'Un site web qui vend la fiabilité',
        'Votre site doit paraître aussi fiable que votre service. Nous concevons des sites clairs et rapides qui expliquent vos forfaits, montrent votre processus et rendent « obtenir du soutien » et « réserver une évaluation » évidents.',
        'Forfaits de service et étapes d’intégration en langage clair qui dissipent la crainte de changer de fournisseur.',
        'Un point d’entrée de soutien qui dirige les clients existants vers le bureau et les prospects vers les ventes.',
        'Conception et hébergement soucieux de sécurité, car le site d’un fournisseur est jugé sur son hygiène.',
      ),
    },
  },
  'recruiting-staffing': {
    blurb: 'Rapidité envers les candidats, rapidité envers les clients, et des données propres entre les deux.',
    metaTitle: 'Technologie pour les firmes de recrutement et de placement | Roalla',
    metaDescription:
      'Accueil IA des candidats et clients, données de candidats sécurisées, communications unifiées, centre de contact, infonuagique, automatisation, visibilité et sites web pour firmes de placement.',
    heroTitle: 'Pourvoyez les postes plus vite pendant que les recruteurs cultivent les relations',
    heroLead:
      'Le recrutement se gagne dans la première heure : la première réponse à un candidat, le premier rappel à un client. Roalla construit la première ligne et l’arrière-guichet qui gardent votre bureau réactif sans ajouter de personnel administratif.',
    pressuresTitle: 'Où les bureaux de recrutement perdent des placements',
    pressures: [
      'Des candidats qui refroidissent ou acceptent ailleurs en attendant une première réponse',
      'Des demandes de clients reçues hors des heures qui attendent le lendemain matin',
      'Des CV, évaluations et consentements éparpillés entre le SGC, la boîte courriel et des chiffriers',
      'Des recruteurs qui ressaisissent les mêmes notes dans le SGC, le CRM et la mise à jour du client',
    ],
    closerTitle: 'Soyez la première réponse, chaque fois',
    closerLead:
      'Dites-nous comment candidats et clients vous joignent aujourd’hui. Nous montrerons où une réponse plus rapide et des données plus propres vous valent plus de placements.',
    s: {
      aiEmployee: sv(
        'Chaque candidat et chaque client servis en quelques minutes',
        'L’Employé IA accueille candidats et clients par téléphone, clavardage et courriel, qualifie les postes et les disponibilités, réserve les présélections et remet aux recruteurs un résumé complet avant qu’ils composent.',
        'Présélections de candidats sur disponibilité, fourchette salariale, lieu et autorisation de travail selon vos critères.',
        'Saisie des mandats clients avec poste, urgence et budget structurés pour le SGC.',
        'Réservation d’entrevues et rappels qui réduisent les absences sans effort du recruteur.',
      ),
      security: sv(
        'Protégez les renseignements personnels que les candidats vous confient',
        'CV, pièces d’identité, références et vérifications d’antécédents font des firmes de placement une cible riche. Nous resserrons accès, conservation et contrôles des fournisseurs pour répondre aux questions de vie privée avec assurance.',
        'Accès par rôle au SGC et aux dossiers de candidats, avec un départ qui retire l’accès du recruteur le jour même.',
        'Pratiques de conservation et de consentement alignées sur les attentes canadiennes, dont la Loi 25 au Québec.',
        'Défenses contre l’hameçonnage et la fraude de paiement liées aux faux clients et faux candidats, courantes en placement.',
      ),
      ucaas: sv(
        'Un seul numéro, chaque recruteur, chaque appareil',
        'Les communications unifiées permettent aux recruteurs d’appeler, de texter et de se réunir sous l’identité de la firme, de consigner chaque conversation et de se remplacer quand un collègue visite un client.',
        'Appels et textos d’affaires depuis l’ordinateur et le mobile, avec l’historique du candidat joint.',
        'Lignes d’équipe partagées et groupes de sonnerie pour qu’aucun appel client ne tombe dans une boîte vocale personnelle.',
        'Entrevues vidéo et liens de réunion intégrés à la plateforme que les recruteurs utilisent déjà.',
      ),
      ccaas: sv(
        'Absorbez les pics d’embauche sans engager une équipe d’appels',
        'Quand un client lance une embauche massive ou qu’une offre d’emploi explose, les demandes grimpent. Une couche de centre de contact achemine, met en file et rapporte pour que le pic n’ensevelisse pas vos recruteurs.',
        'Files distinctes pour candidats, clients et consultants déjà en mandat.',
        'Messagerie vocale convertie en billet et rappel pour qu’aucune piste ne disparaisse dans le pic.',
        'Rapports de temps de réponse par poste et par canal pour repérer les offres qui laissent filer des candidats.',
      ),
      cloudMigration: sv(
        'Mettez votre SGC, votre CRM et vos fichiers sur des bases solides',
        'Les firmes de placement accumulent des années de données dans des outils et des dossiers partagés. Nous consolidons et migrons vers des plateformes infonuagiques sécurisées avec structure, permissions et reprise sensées.',
        'Nettoyage des dossiers partagés qui sépare les données clients, candidats et internes avec les bonnes permissions.',
        'Connexions sécurisées entre SGC, CRM, paie et feuilles de temps.',
        'Sauvegarde et reprise planifiées autour des échéances de paie, quand une panne coûte le plus cher.',
      ),
      automation: sv(
        'Cessez de ressaisir trois fois le même placement',
        'Nous relions votre SGC, votre CRM, votre courriel et l’intégration pour qu’une mise à jour de candidat circule partout où elle doit aller, et que les étapes courantes entre la soumission et l’entrée en poste se fassent seules.',
        'Analyse de CV et création de dossiers qui alimentent le SGC sans saisie manuelle.',
        'Avis de soumission, d’entrevue et d’offre envoyés automatiquement aux clients et aux candidats.',
        'Listes d’intégration pour documents, contrats et logistique du premier jour déclenchées par une offre acceptée.',
      ),
      visibility: sv(
        'Soyez trouvé par les talents et les clients que vous visez',
        'Chercheurs d’emploi et gestionnaires d’embauche cherchent avant d’appeler. Nous bâtissons votre repérabilité par créneau, lieu et poste, dans la recherche classique et dans les réponses générées par IA.',
        'Pages de postes et de spécialités structurées pour la recherche et la découverte d’emplois.',
        'Contenu destiné aux employeurs qui explique comment vous sélectionnez et placez les talents.',
        'Pages locales et sectorielles pour les régions et industries où vous excellez.',
      ),
      websites: sv(
        'Deux publics, un seul site clair',
        'Les candidats veulent les postes ouverts et une candidature rapide. Les clients veulent des preuves et une façon simple de vous transmettre leur besoin. Nous concevons des sites qui servent les deux sans que personne cherche son chemin.',
        'Offres d’emploi adaptées au mobile et candidature courte qui ne perd pas les candidats en route.',
        'Formulaire de mandat client qui saisit dès le premier contact les détails dont les recruteurs ont besoin.',
        'Pages de spécialités et de témoignages qui montrent en quoi vous différez d’un babillard d’emplois.',
      ),
    },
  },
  'trades-field': {
    blurb: 'Appels manqués, chantiers éparpillés et la paperasse après le départ du camion.',
    metaTitle: 'Technologie pour les métiers et services sur le terrain | Roalla',
    metaDescription:
      'Réponse IA aux appels, données de chantier sécurisées, téléphonie d’affaires mobile, centre de contact, outils infonuagiques, automatisation, visibilité locale et sites web pour les métiers et services sur le terrain.',
    heroTitle: 'Cessez de perdre des contrats à cause de l’appel auquel vous n’avez pas pu répondre',
    heroLead:
      'Quand l’équipe est sur un toit ou sous un évier, le téléphone sonne quand même, et le prochain entrepreneur n’est qu’à une recherche de distance. Roalla garde votre accueil, votre répartition et vos suivis en marche pendant que votre équipe travaille.',
    pressuresTitle: 'Pourquoi de bonnes entreprises de métiers perdent des revenus',
    pressures: [
      'Des appels manqués pendant que les techniciens sont sur place, et des clients qui appellent simplement l’entreprise suivante',
      'Des urgences noyées parmi les demandes de soumission, sans moyen clair de prioriser',
      'Des détails de chantier notés sur des bouts de papier et ressaisis dans la facture des jours plus tard',
      'Un site web et une présence en ligne qui ne reflètent pas la qualité du travail',
    ],
    closerTitle: 'Gardez l’équipe au travail et le téléphone répondu',
    closerLead:
      'Dites-nous comment circulent appels, soumissions et chantiers aujourd’hui. Nous indiquerons les correctifs les plus rapides pour récupérer le travail manqué.',
    s: {
      aiEmployee: sv(
        'Chaque appel répondu, chaque chantier saisi',
        'L’Employé IA décroche quand votre équipe ne le peut pas, qualifie le travail, réserve les visites courantes et dirige les vraies urgences vers le bon technicien avec l’adresse et le problème déjà notés.',
        'Appels et textos répondus hors des heures et pendant les chantiers, avec type de travail, adresse et photos demandés.',
        'Tri urgence ou routine selon vos règles, avec escalade en direct vers les techniciens de garde.',
        'Relances de soumissions et de rendez-vous pour que l’estimation ne refroidisse pas après la première visite.',
      ),
      security: sv(
        'Protégez les maisons, les clés et les paiements de vos clients',
        'Les entreprises de métiers détiennent adresses, codes d’accès et données de cartes sur des téléphones et tablettes qui se promènent partout. Nous sécurisons les appareils et comptes qui les portent.',
        'Gestion des appareils mobiles avec verrouillage et effacement à distance pour les téléphones perdus ou volés.',
        'Protection contre la fraude de facture et de redirection de paiement visant les petits entrepreneurs.',
        'Codes d’accès et notes clients conservés dans des systèmes contrôlés plutôt que dans des clavardages de groupe.',
      ),
      ucaas: sv(
        'Un numéro d’affaires qui suit l’équipe',
        'Un système téléphonique moderne permet au bureau, aux propriétaires et aux techniciens de travailler sous un seul numéro d’entreprise, avec des appels transférés intelligemment plutôt que sur le cellulaire personnel de quelqu’un.',
        'Appli mobile pour appeler et texter les clients sous le numéro de l’entreprise, pas un numéro personnel.',
        'Horaires d’ouverture, de congés et de garde qui acheminent les appels sans transfert manuel.',
        'Messagerie vocale transcrite en texte pour lire les demandes de soumission en secondes plutôt que les écouter dans le camion.',
      ),
      ccaas: sv(
        'Une gestion d’appels prête pour la répartition en haute saison',
        'Quand une tempête frappe ou que la saison de chauffage débute, les appels s’accumulent. Une couche de centre de contact met en file, priorise et rappelle pour que personne ne reste en attente ou à la boîte vocale.',
        'Acheminement prioritaire des urgences avec débordement vers un second répartiteur ou un service de réponse.',
        'Rappels en file qui gardent la place du client au lieu de l’obliger à recomposer.',
        'Rapports de volume d’appels qui montrent quand ajouter de l’aide saisonnière.',
      ),
      cloudMigration: sv(
        'Sortez les données de chantier du papier et d’un seul portable',
        'Nous déplaçons soumissions, horaires, photos et factures vers des outils infonuagiques sécurisés pour que le bureau et l’équipe voient le même chantier, et qu’un portable en panne soit un irritant, pas un désastre.',
        'Outils de service terrain et de comptabilité reliés pour que la fin d’un chantier déclenche la facture.',
        'Stockage partagé de photos et de documents organisé par chantier et par client.',
        'Sauvegardes qui protègent des années d’historique client et de dossiers de garantie.',
      ),
      automation: sv(
        'Du chantier terminé à la facture payée, avec moins d’interventions',
        'Nous automatisons l’administratif qui suit chaque chantier (confirmations, rappels, factures, demandes d’avis) pour que le propriétaire ne fasse pas de paperasse le soir.',
        'Confirmations de rendez-vous et messages « en route » envoyés automatiquement.',
        'Génération de factures et rappels de paiement déclenchés quand un chantier est marqué terminé.',
        'Demandes d’avis après les bons chantiers et rappels d’entretien saisonnier aux anciens clients.',
      ),
      visibility: sv(
        'Soyez le premier nom sur la carte locale',
        'La plupart des chantiers commencent par une recherche « près de moi ». Nous optimisons votre fiche Google, vos zones de service et vos avis pour que vous apparaissiez, et inspiriez confiance, au moment du besoin.',
        'Fiche d’entreprise Google ajustée avec services, zones, photos et réalisations avant-après récentes.',
        'Pages service-et-ville qui captent des recherches comme « plombier urgence » dans votre vrai territoire.',
        'Un processus d’avis qui bâtit peu à peu les cotes sur lesquelles les clients vous comparent.',
      ),
      websites: sv(
        'Un site web qui fait sonner le téléphone',
        'Nous bâtissons des sites rapides, pensés pour le mobile, où un propriétaire inquiet peut appeler, texter ou demander une soumission d’un seul geste, et voir du vrai travail, de vrais avis et vos zones de service.',
        'Appel en un clic et courts formulaires de soumission placés là où les clients décident.',
        'Galeries de projets et avis qui montrent la qualité du travail.',
        'Zones de service et licences clairement indiquées pour bâtir la confiance avant le premier appel.',
      ),
    },
  },
}
const EN_2: HubDataMap = {
  'transportation-logistics': {
    blurb: 'Where is my load? Dispatch, carriers, shippers, and exceptions in real time.',
    metaTitle: 'Technology for Transportation & Logistics Companies | Roalla',
    metaDescription:
      'AI shipper and carrier service, secured freight systems, dispatch-ready communications, contact center routing, cloud, automation, visibility, and websites for logistics.',
    heroTitle: 'Answer “where is my load?” before it becomes a complaint',
    heroLead:
      'Freight runs on updates: pickups, delays, proof of delivery, and the 4 p.m. call that changes the plan. Roalla gives dispatch, customer service, and operations one clean line of communication and the systems behind it.',
    pressuresTitle: 'Where freight operations lose time and trust',
    pressures: [
      'Status calls that crowd dispatchers out of the work of actually moving freight',
      'Exceptions discovered late, with customers hearing about delays from the driver first',
      'Fraud risk from double-brokering, spoofed carriers, and altered bank details',
      'Drivers, brokers, and shippers reaching you on different channels with no shared record',
    ],
    closerTitle: 'Keep every load, and every customer, informed',
    closerLead:
      'Walk us through how a shipment moves from booking to proof of delivery. We will show where communication and systems can tighten first.',
    s: {
      aiEmployee: sv(
        'A tireless desk for shipper and carrier questions',
        'The AI Employee handles status requests, captures new moves, and gathers the details dispatchers need, so your team spends time solving exceptions instead of answering the same question.',
        'Load status, ETA, and document requests answered from your TMS or dispatcher notes, any hour.',
        'New quote and pickup requests captured with origin, destination, equipment, and timing.',
        'Exception alerts handed to dispatch with load number, driver, and customer impact already summarized.',
      ),
      security: sv(
        'Stop freight fraud before it moves a load',
        'Cargo theft, fictitious pickups, and payment-redirect scams are now routine threats. We harden identity, verification steps, and systems so a convincing email does not become a lost load.',
        'Carrier and bank-detail verification procedures that cannot be bypassed by a rushed email.',
        'Strong access controls and MFA across TMS, load boards, and accounting systems.',
        'Monitoring and response planning for ransomware, which targets operations that cannot afford downtime.',
      ),
      ucaas: sv(
        'Dispatch communications that work from cab to cloud',
        'Drivers, dispatchers, and brokers need to reach each other reliably. Unified communications give your team one phone system with mobile, messaging, and call history across locations.',
        'Mobile calling and messaging on the company number for dispatchers and field supervisors.',
        'Multi-site calling so terminals, brokers, and head office work as one team.',
        'Call recordings and logs that support claims, disputes, and driver performance reviews.',
      ),
      ccaas: sv(
        'Route the right call to the right desk',
        'A contact center layer separates carrier check calls, shipper status requests, and billing questions, so each reaches a specialist and none block the dispatch line.',
        'Dedicated queues for drivers, shippers, and accounts payable with skills-based routing.',
        'Self-service status look-up so routine “where is it” calls never reach an agent.',
        'Reports on call volume by customer and reason, to spot recurring service gaps.',
      ),
      cloudMigration: sv(
        'Resilient systems for an always-on operation',
        'A frozen TMS or file server stops trucks. We design cloud and hybrid platforms with the uptime, recovery, and integration freight operations rely on.',
        'TMS, EDI, and telematics integrations moved to resilient, monitored infrastructure.',
        'Recovery plans with realistic recovery times tested around your busiest shipping days.',
        'Secure remote access for dispatchers working across shifts and time zones.',
      ),
      automation: sv(
        'Automate the paperwork that follows every load',
        'Bills of lading, PODs, invoices, and status updates move through email and spreadsheets. We automate capture and routing so documents reach the right system and customer without rekeying.',
        'Document capture that reads BOLs and PODs and attaches them to the right load.',
        'Proactive status notifications to customers triggered by milestones in your TMS.',
        'Invoice and accessorial workflows that reduce the days between delivery and billing.',
      ),
      visibility: sv(
        'Be found when shippers search for capacity',
        'Shippers and procurement teams research lanes, equipment, and capabilities online. We make your services, coverage, and credentials easy for search engines and AI assistants to understand and cite.',
        'Lane, equipment, and industry pages that show what you actually haul and where.',
        'Credentials, safety record, and certifications presented in a way buyers can verify.',
        'Local and regional presence for terminals, so nearby shippers find you first.',
      ),
      websites: sv(
        'A website that shippers and carriers both understand',
        'We design sites with a clear quote path for shippers, a simple onboarding route for carriers, and tracking or contact tools that cut inbound calls.',
        'Fast “request a quote” flows that capture lane, equipment, and timing in one step.',
        'Carrier onboarding page with the documents and requirements spelled out.',
        'Service and fleet pages that prove capability without jargon.',
      ),
    },
  },
  warehouses: {
    blurb: 'Dock appointments, inventory questions, and the 3PL customers waiting on answers.',
    metaTitle: 'Technology for Warehouses & 3PL Operations | Roalla',
    metaDescription:
      'AI customer and dock desk, secured warehouse systems, floor-ready communications, contact center routing, cloud, automation, visibility, and websites for warehouses and 3PLs.',
    heroTitle: 'Keep the dock moving while customers stay informed',
    heroLead:
      'A warehouse is judged on accuracy and timing. Roalla helps your team answer inventory and order questions, coordinate appointments, and connect floor systems, without pulling leads away from the work.',
    pressuresTitle: 'What slows warehouses and 3PLs down',
    pressures: [
      'Customer service staff answering inventory and order-status questions all day',
      'Dock appointments managed by phone and spreadsheet, leading to idle carriers and detention fees',
      'Wi-Fi dead zones, aging scanners, and a WMS that few trust during peak season',
      'Receiving and picking exceptions reported verbally and lost before they reach the right person',
    ],
    closerTitle: 'Move more through the same four walls',
    closerLead:
      'Tell us where your customers and your floor wait on information. We will show where communication and systems can recover the most time.',
    s: {
      aiEmployee: sv(
        'Customer and dock questions answered without leaving the floor',
        'The AI Employee answers inventory, order, and appointment questions for customers and carriers, and turns receiving or picking issues into a clear next step for the right lead.',
        'Inventory-on-hand and order-status questions answered from approved WMS data.',
        'Dock appointment requests captured and confirmed with carrier, load, and timing details.',
        'Short-pick, damage, and mislabel reports logged with order context and routed to quality or a floor lead.',
      ),
      security: sv(
        'Protect inventory data and the systems that move it',
        'Warehouse systems connect scanners, conveyors, customer portals, and carriers. We secure those links so an attack on one device does not stop the building.',
        'Network segmentation that separates scanners and automation from office and guest traffic.',
        'Customer-data controls for 3PLs who hold inventory and shipping details for multiple clients.',
        'Physical-and-digital access reviews, covering badges, cameras, and system permissions together.',
      ),
      ucaas: sv(
        'Communications that reach the dock, not just the desk',
        'Supervisors and leads spend little time at a desk. Unified communications put voice and messaging on rugged handhelds and mobile devices so the right person is reachable anywhere in the building.',
        'Mobile and overhead-page integration so supervisors are reachable on the floor.',
        'Shared team lines for receiving, shipping, and customer service across shifts.',
        'Consistent calling across multiple buildings and campuses under one dial plan.',
      ),
      ccaas: sv(
        'A customer service line that scales with peak season',
        'Seasonal peaks flood 3PL service teams with “where is my order” calls. A contact center layer queues, prioritizes key accounts, and offers self-service before an agent is needed.',
        'Account-based routing so key clients reach a named team member.',
        'Self-service order and inventory look-up that deflects routine calls.',
        'Peak-season reporting to staff service teams ahead of the surge, not after it.',
      ),
      cloudMigration: sv(
        'Make the WMS, network, and backups peak-season ready',
        'Slow Wi-Fi and fragile servers show up as late shipments. We assess and modernize the network, WMS hosting, and recovery plans that your throughput depends on.',
        'Warehouse-wide wireless survey and redesign that removes dead zones near racking and docks.',
        'WMS and ERP hosting moved to resilient infrastructure with tested failover.',
        'Offline-capable scanning workflows so a connection drop does not stop receiving.',
      ),
      automation: sv(
        'Digitize the handoffs between receiving, picking, and shipping',
        'Where information changes hands, errors enter. We automate notifications, exception handling, and reporting between your WMS, customers, and carriers.',
        'ASN and receiving confirmations sent to customers automatically as pallets are scanned in.',
        'Exception workflows that alert the right lead and open a tracked task.',
        'Daily KPI and inventory-accuracy reports delivered without a manual spreadsheet.',
      ),
      visibility: sv(
        'Be discovered by the brands that need fulfilment',
        'Brands choosing a 3PL compare capabilities, locations, and certifications online. We make your services and credentials clear to search engines and AI assistants.',
        'Service pages for storage, fulfilment, cross-dock, and value-added services.',
        'Location and capacity content that helps shippers see if you are close to their customers.',
        'Industry-specific pages, such as food-grade, e-commerce, or temperature-controlled storage.',
      ),
      websites: sv(
        'A website that makes a prospect picture their freight inside',
        'We design websites with facility facts, capabilities, and an easy quote or tour request, so prospects can judge fit quickly.',
        'Clear capability grids covering square footage, certifications, and systems integrations.',
        'Request-a-quote and book-a-tour paths that collect volume and SKU basics.',
        'Facility photography and video that build confidence before a site visit.',
      ),
    },
  },
  'care-practices': {
    blurb: 'Patient access, recalls, and privacy for clinics and care practices.',
    metaTitle: 'Technology for Care Practices & Clinics | Roalla',
    metaDescription:
      'AI patient front desk, privacy-focused security, clinic communications, contact center routing, cloud records, automation, local visibility, and websites for care practices.',
    heroTitle: 'Give patients a front desk that is always reachable',
    heroLead:
      'Clinics lose patients to unanswered phones and lose staff to administrative load. Roalla helps care practices answer, schedule, and follow up with patients while keeping clinical judgment, and privacy, firmly with your providers.',
    pressuresTitle: 'The pressures behind every care practice front desk',
    pressures: [
      'Phones that ring at the same moment the front desk is checking in a patient',
      'No-shows and cancellations that leave appointment slots empty and recalls forgotten',
      'Health information that must stay private across devices, vendors, and shared workstations',
      'Online presence that does not make it clear who is accepting new patients',
    ],
    closerTitle: 'Free your team for patient care',
    closerLead:
      'Tell us how patients reach your practice today. We will show where access, scheduling, and privacy can improve without changing how you practise.',
    s: {
      aiEmployee: sv(
        'Patients answered, booked, and reminded around the clock',
        'The AI Employee takes patient calls and messages, books the right visit type, manages waitlists, and sends recalls, while anything clinical goes straight to a person on your team.',
        'Appointment booking matched to provider, visit type, and length, including after hours.',
        'Reminders, confirmations, and waitlist offers that fill slots released by cancellations.',
        'Clear boundaries: no clinical advice, and urgent symptoms are escalated to staff immediately.',
      ),
      security: sv(
        'Safeguard patient information at every point it travels',
        'Health records are among the most sensitive data a business holds. We help practices meet provincial health-privacy expectations with controls staff can realistically follow.',
        'Role-based access and audit trails for electronic records and shared workstations.',
        'Encrypted devices, secure messaging, and vendor reviews covering every tool that touches patient data.',
        'Staff training and breach-response planning aligned with PHIPA and similar provincial rules.',
      ),
      ucaas: sv(
        'A phone system built for a busy front desk',
        'Reliable calling, secure messaging, and virtual visits support patient access across locations, with call flows that treat urgent calls differently from routine ones.',
        'Call flows that route booking, results, and billing calls to the right staff member.',
        'Secure staff messaging that replaces personal texting about patients.',
        'Multi-location support so a busy front desk can be backed up by a sister clinic.',
      ),
      ccaas: sv(
        'A patient access line that does not drop calls',
        'Monday mornings and flu season break basic phone lines. A contact center layer queues calls, offers callbacks, and shows leaders exactly when patients are not getting through.',
        'Queue callbacks so patients keep their place without waiting on hold.',
        'Peak-time staffing reports that show when call-handling capacity falls short.',
        'Separate paths for existing patients, new patients, and referrals from other providers.',
      ),
      cloudMigration: sv(
        'Records and systems that stay up, and stay private',
        'Clinic servers in a back closet are a risk to continuity and privacy. We help practices move to secure, reliable platforms with proper backup, access, and data-residency choices.',
        'Migration of scheduling, records, and imaging tools with minimal clinic downtime.',
        'Canadian data residency options where regulation or patient expectation requires it.',
        'Tested backups and recovery, so a failed server does not cancel a day of appointments.',
      ),
      automation: sv(
        'Less administration between visits',
        'Intake forms, referrals, recalls, and result notifications eat staff hours. We automate the steps that do not require clinical judgment, so people focus on patients.',
        'Digital intake and consent forms that arrive in the chart before the patient does.',
        'Recall campaigns for annual visits and screenings run from your scheduling data.',
        'Referral tracking that alerts staff when a loop has not been closed.',
      ),
      visibility: sv(
        'Be the practice patients find, and trust',
        'New patients choose through search, maps, and increasingly AI assistants. We make sure your services, locations, providers, and availability are accurate wherever patients look.',
        'Google Business Profiles with accurate hours, providers, and whether you are accepting new patients.',
        'Service pages that explain visits in plain language and answer common patient questions.',
        'Review responses handled with privacy-safe language that protects patients and the practice.',
      ),
      websites: sv(
        'A website that welcomes patients before they arrive',
        'We design accessible, calm websites that explain services, introduce providers, and make booking or contacting the practice effortless on any device.',
        'Accessible design that meets the needs of older patients and those using assistive technology.',
        'Provider profiles and new-patient guides that reduce first-visit anxiety.',
        'Online booking and secure contact forms placed where patients decide to reach out.',
      ),
    },
  },
}
const FR_2: HubDataMap = {
  'transportation-logistics': {
    blurb: 'Où est mon chargement ? Répartition, transporteurs, expéditeurs et exceptions en temps réel.',
    metaTitle: 'Technologie pour les entreprises de transport et de logistique | Roalla',
    metaDescription:
      'Service IA aux expéditeurs et transporteurs, systèmes de fret sécurisés, communications de répartition, centre de contact, infonuagique, automatisation, visibilité et sites web pour la logistique.',
    heroTitle: 'Répondez à « où est mon chargement ? » avant que cela devienne une plainte',
    heroLead:
      'Le fret roule sur les mises à jour : ramassages, retards, preuves de livraison et l’appel de 16 h qui change le plan. Roalla offre à la répartition, au service à la clientèle et aux opérations une ligne de communication claire et les systèmes qui la soutiennent.',
    pressuresTitle: 'Où les opérations de fret perdent du temps et de la confiance',
    pressures: [
      'Des appels de statut qui détournent les répartiteurs du travail de déplacer réellement la marchandise',
      'Des exceptions découvertes trop tard, le client apprenant le retard par le chauffeur avant vous',
      'Un risque de fraude lié au double courtage, aux faux transporteurs et aux coordonnées bancaires modifiées',
      'Chauffeurs, courtiers et expéditeurs qui vous joignent par des canaux différents sans dossier commun',
    ],
    closerTitle: 'Gardez chaque chargement, et chaque client, informés',
    closerLead:
      'Décrivez-nous comment un envoi va de la réservation à la preuve de livraison. Nous montrerons où communication et systèmes peuvent se resserrer en premier.',
    s: {
      aiEmployee: sv(
        'Un bureau infatigable pour les questions des expéditeurs et transporteurs',
        'L’Employé IA traite les demandes de statut, saisit les nouveaux mouvements et recueille les détails dont les répartiteurs ont besoin, pour que votre équipe résolve des exceptions au lieu de répéter la même réponse.',
        'Statut, heure d’arrivée prévue et demandes de documents répondus à partir de votre TMS ou des notes de répartition, à toute heure.',
        'Nouvelles demandes de prix et de ramassage saisies avec origine, destination, équipement et échéancier.',
        'Alertes d’exception transmises à la répartition avec numéro de chargement, chauffeur et impact client déjà résumés.',
      ),
      security: sv(
        'Bloquez la fraude de fret avant qu’elle déplace un chargement',
        'Vol de cargaison, ramassages fictifs et fraudes de redirection de paiement sont devenus des menaces courantes. Nous renforçons identité, étapes de vérification et systèmes pour qu’un courriel convaincant ne devienne pas un chargement perdu.',
        'Procédures de vérification des transporteurs et des coordonnées bancaires qu’un courriel pressant ne peut contourner.',
        'Contrôles d’accès solides et AMF sur le TMS, les babillards de fret et les systèmes comptables.',
        'Surveillance et planification de réponse aux rançongiciels, qui ciblent les opérations qui ne peuvent se permettre d’arrêt.',
      ),
      ucaas: sv(
        'Des communications de répartition de la cabine jusqu’au nuage',
        'Chauffeurs, répartiteurs et courtiers doivent se joindre de façon fiable. Les communications unifiées offrent à votre équipe un seul système téléphonique avec mobile, messagerie et historique d’appels entre les sites.',
        'Appels et messagerie mobiles sous le numéro de l’entreprise pour répartiteurs et superviseurs terrain.',
        'Appels multisites pour que terminaux, courtiers et siège social travaillent en une seule équipe.',
        'Enregistrements et journaux d’appels qui appuient réclamations, litiges et évaluations de chauffeurs.',
      ),
      ccaas: sv(
        'Acheminez le bon appel au bon bureau',
        'Une couche de centre de contact sépare les appels de suivi des transporteurs, les demandes de statut des expéditeurs et les questions de facturation, pour que chacun atteigne un spécialiste sans bloquer la ligne de répartition.',
        'Files dédiées aux chauffeurs, expéditeurs et comptes fournisseurs avec acheminement par compétences.',
        'Consultation libre-service du statut pour que les appels « où est-ce » routiniers n’atteignent jamais un agent.',
        'Rapports de volume d’appels par client et par motif pour repérer les lacunes de service récurrentes.',
      ),
      cloudMigration: sv(
        'Des systèmes résilients pour une exploitation sans interruption',
        'Un TMS gelé ou un serveur de fichiers en panne immobilise les camions. Nous concevons des plateformes infonuagiques et hybrides avec la disponibilité, la reprise et l’intégration dont le fret dépend.',
        'Intégrations TMS, EDI et télématique migrées vers une infrastructure résiliente et surveillée.',
        'Plans de reprise aux délais réalistes, testés autour de vos journées d’expédition les plus chargées.',
        'Accès à distance sécurisé pour les répartiteurs qui travaillent sur plusieurs quarts et fuseaux horaires.',
      ),
      automation: sv(
        'Automatisez la paperasse qui suit chaque chargement',
        'Connaissements, preuves de livraison, factures et mises à jour de statut circulent par courriel et chiffriers. Nous automatisons la saisie et l’acheminement pour que les documents atteignent le bon système et le bon client sans ressaisie.',
        'Saisie de documents qui lit connaissements et preuves de livraison et les joint au bon chargement.',
        'Avis de statut proactifs aux clients déclenchés par les jalons de votre TMS.',
        'Flux de factures et de frais accessoires qui réduisent les jours entre livraison et facturation.',
      ),
      visibility: sv(
        'Soyez trouvé quand les expéditeurs cherchent de la capacité',
        'Expéditeurs et équipes d’approvisionnement étudient couloirs, équipements et capacités en ligne. Nous rendons vos services, votre couverture et vos accréditations faciles à comprendre et à citer pour les moteurs et assistants IA.',
        'Pages par couloir, équipement et industrie qui montrent ce que vous transportez réellement et où.',
        'Accréditations, dossier de sécurité et certifications présentés de façon vérifiable par les acheteurs.',
        'Présence locale et régionale pour vos terminaux, afin que les expéditeurs voisins vous trouvent d’abord.',
      ),
      websites: sv(
        'Un site que les expéditeurs et les transporteurs comprennent tous deux',
        'Nous concevons des sites avec un parcours de soumission clair pour les expéditeurs, une intégration simple pour les transporteurs et des outils de suivi ou de contact qui réduisent les appels entrants.',
        'Demandes de prix rapides qui saisissent couloir, équipement et échéancier en une seule étape.',
        'Page d’intégration des transporteurs avec documents et exigences clairement énoncés.',
        'Pages de services et de flotte qui prouvent la capacité sans jargon.',
      ),
    },
  },
  warehouses: {
    blurb: 'Rendez-vous de quai, questions d’inventaire et clients 3PL en attente de réponses.',
    metaTitle: 'Technologie pour les entrepôts et opérations 3PL | Roalla',
    metaDescription:
      'Bureau IA clients et quai, systèmes d’entrepôt sécurisés, communications pour le plancher, centre de contact, infonuagique, automatisation, visibilité et sites web pour entrepôts et 3PL.',
    heroTitle: 'Gardez le quai en mouvement pendant que les clients restent informés',
    heroLead:
      'Un entrepôt se juge sur l’exactitude et le respect des délais. Roalla aide votre équipe à répondre aux questions d’inventaire et de commandes, à coordonner les rendez-vous et à relier les systèmes du plancher, sans détourner les chefs d’équipe du travail.',
    pressuresTitle: 'Ce qui ralentit entrepôts et 3PL',
    pressures: [
      'Un service à la clientèle qui répond toute la journée aux questions d’inventaire et de statut de commande',
      'Des rendez-vous de quai gérés par téléphone et chiffrier, causant transporteurs inactifs et frais de surestarie',
      'Des zones sans Wi-Fi, des lecteurs vieillissants et un WMS en lequel peu de gens ont confiance en haute saison',
      'Des exceptions de réception et de prélèvement signalées de vive voix et perdues avant d’atteindre la bonne personne',
    ],
    closerTitle: 'Faites passer plus de marchandise entre les mêmes quatre murs',
    closerLead:
      'Dites-nous où vos clients et votre plancher attendent de l’information. Nous montrerons où communication et systèmes peuvent récupérer le plus de temps.',
    s: {
      aiEmployee: sv(
        'Questions des clients et du quai traitées sans quitter le plancher',
        'L’Employé IA répond aux questions d’inventaire, de commandes et de rendez-vous des clients et transporteurs, et transforme les problèmes de réception ou de prélèvement en prochaine étape claire pour le bon chef d’équipe.',
        'Questions de stock disponible et de statut de commande répondues à partir de données WMS approuvées.',
        'Demandes de rendez-vous de quai saisies et confirmées avec transporteur, chargement et échéancier.',
        'Prélèvements incomplets, dommages et erreurs d’étiquette consignés avec le contexte de commande et acheminés à la qualité ou à un chef de plancher.',
      ),
      security: sv(
        'Protégez les données d’inventaire et les systèmes qui les déplacent',
        'Les systèmes d’entrepôt relient lecteurs, convoyeurs, portails clients et transporteurs. Nous sécurisons ces liens pour qu’une attaque sur un appareil n’arrête pas tout le bâtiment.',
        'Segmentation du réseau qui isole lecteurs et automatisation du trafic de bureau et d’invités.',
        'Contrôles des données clients pour les 3PL qui détiennent inventaire et détails d’expédition de plusieurs clients.',
        'Révisions d’accès physiques et numériques couvrant ensemble cartes, caméras et permissions des systèmes.',
      ),
      ucaas: sv(
        'Des communications qui atteignent le quai, pas seulement le bureau',
        'Superviseurs et chefs d’équipe passent peu de temps à un bureau. Les communications unifiées mettent la voix et la messagerie sur des terminaux robustes et mobiles pour joindre la bonne personne n’importe où dans le bâtiment.',
        'Intégration mobile et système de page pour joindre les superviseurs sur le plancher.',
        'Lignes d’équipe partagées pour réception, expédition et service à la clientèle d’un quart à l’autre.',
        'Appels uniformes entre plusieurs bâtiments et campus sous un seul plan de numérotation.',
      ),
      ccaas: sv(
        'Une ligne de service à la clientèle qui suit la haute saison',
        'Les pointes saisonnières inondent les équipes 3PL d’appels « où est ma commande ». Une couche de centre de contact met en file, priorise les comptes clés et offre le libre-service avant d’avoir besoin d’un agent.',
        'Acheminement par compte pour que les clients clés joignent un membre d’équipe nommé.',
        'Consultation libre-service des commandes et de l’inventaire qui détourne les appels courants.',
        'Rapports de haute saison pour doter le service avant la pointe, pas après.',
      ),
      cloudMigration: sv(
        'Préparez le WMS, le réseau et les sauvegardes à la haute saison',
        'Un Wi-Fi lent et des serveurs fragiles se traduisent en expéditions en retard. Nous évaluons et modernisons le réseau, l’hébergement du WMS et les plans de reprise dont votre débit dépend.',
        'Relevé et refonte du sans-fil de l’entrepôt qui éliminent les zones mortes près des rayonnages et des quais.',
        'Hébergement du WMS et de l’ERP migré vers une infrastructure résiliente avec basculement testé.',
        'Flux de lecture hors ligne pour qu’une perte de connexion n’arrête pas la réception.',
      ),
      automation: sv(
        'Numérisez les transferts entre réception, prélèvement et expédition',
        'Là où l’information change de mains, les erreurs s’installent. Nous automatisons avis, traitement des exceptions et rapports entre votre WMS, vos clients et vos transporteurs.',
        'Avis d’expédition et confirmations de réception envoyés automatiquement aux clients au fil de la lecture des palettes.',
        'Flux d’exception qui alertent le bon chef et ouvrent une tâche suivie.',
        'Rapports quotidiens d’indicateurs et d’exactitude d’inventaire livrés sans chiffrier manuel.',
      ),
      visibility: sv(
        'Soyez découvert par les marques qui ont besoin d’exécution de commandes',
        'Les marques qui choisissent un 3PL comparent capacités, emplacements et certifications en ligne. Nous rendons vos services et accréditations clairs pour les moteurs de recherche et les assistants IA.',
        'Pages de services pour entreposage, exécution, transbordement et services à valeur ajoutée.',
        'Contenu sur les emplacements et la capacité pour que les expéditeurs voient si vous êtes proche de leurs clients.',
        'Pages sectorielles : qualité alimentaire, commerce électronique ou entreposage à température contrôlée.',
      ),
      websites: sv(
        'Un site qui fait imaginer sa marchandise à l’intérieur',
        'Nous concevons des sites avec faits sur l’installation, capacités et demande de prix ou de visite facile, pour que les prospects jugent vite l’adéquation.',
        'Grilles de capacités claires : superficie, certifications et intégrations de systèmes.',
        'Parcours de demande de prix et de réservation de visite qui recueillent volumes et bases d’UGS.',
        'Photos et vidéos de l’installation qui inspirent confiance avant une visite.',
      ),
    },
  },
  'care-practices': {
    blurb: 'Accès des patients, rappels et confidentialité pour cliniques et pratiques de soins.',
    metaTitle: 'Technologie pour les cliniques et pratiques de soins | Roalla',
    metaDescription:
      'Réception IA des patients, sécurité axée sur la confidentialité, communications de clinique, centre de contact, dossiers infonuagiques, automatisation, visibilité locale et sites web pour pratiques de soins.',
    heroTitle: 'Offrez aux patients une réception toujours joignable',
    heroLead:
      'Les cliniques perdent des patients à cause des téléphones sans réponse et du personnel à cause de la charge administrative. Roalla aide les pratiques de soins à répondre, à planifier et à relancer leurs patients, en laissant le jugement clinique, et la confidentialité, fermement entre les mains de vos professionnels.',
    pressuresTitle: 'Les pressions derrière chaque réception de clinique',
    pressures: [
      'Des téléphones qui sonnent au moment même où la réception accueille un patient',
      'Des absences et annulations qui laissent des plages vides et des rappels oubliés',
      'Des renseignements de santé qui doivent rester confidentiels sur les appareils, chez les fournisseurs et aux postes partagés',
      'Une présence en ligne qui ne précise pas qui accepte de nouveaux patients',
    ],
    closerTitle: 'Libérez votre équipe pour les soins aux patients',
    closerLead:
      'Dites-nous comment les patients joignent votre pratique aujourd’hui. Nous montrerons où l’accès, la planification et la confidentialité peuvent s’améliorer sans changer votre façon de pratiquer.',
    s: {
      aiEmployee: sv(
        'Des patients servis, réservés et rappelés jour et nuit',
        'L’Employé IA prend les appels et messages des patients, réserve le bon type de visite, gère les listes d’attente et envoie les rappels, tandis que tout ce qui est clinique va directement à une personne de votre équipe.',
        'Réservation selon le professionnel, le type et la durée de visite, y compris hors des heures.',
        'Rappels, confirmations et offres de liste d’attente qui comblent les plages libérées par les annulations.',
        'Limites claires : aucun conseil clinique, et les symptômes urgents sont escaladés immédiatement au personnel.',
      ),
      security: sv(
        'Protégez les renseignements des patients à chaque étape de leur parcours',
        'Les dossiers de santé figurent parmi les données les plus sensibles d’une entreprise. Nous aidons les pratiques à satisfaire les attentes provinciales en matière de confidentialité de la santé avec des contrôles que le personnel peut réalistement suivre.',
        'Accès par rôle et pistes d’audit pour les dossiers électroniques et les postes partagés.',
        'Appareils chiffrés, messagerie sécurisée et révision des fournisseurs pour chaque outil qui touche aux données des patients.',
        'Formation du personnel et plan de réponse aux incidents alignés sur les lois provinciales sur les renseignements de santé.',
      ),
      ucaas: sv(
        'Un système téléphonique conçu pour une réception occupée',
        'Appels fiables, messagerie sécurisée et visites virtuelles soutiennent l’accès des patients entre les sites, avec des parcours d’appel qui traitent les urgences autrement que les demandes courantes.',
        'Parcours d’appel qui dirigent réservations, résultats et facturation vers le bon membre du personnel.',
        'Messagerie sécurisée pour le personnel qui remplace les textos personnels au sujet des patients.',
        'Soutien multisite pour qu’une réception débordée soit secondée par une clinique sœur.',
      ),
      ccaas: sv(
        'Une ligne d’accès aux patients qui ne perd pas d’appels',
        'Les lundis matin et la saison de la grippe font craquer les lignes téléphoniques de base. Une couche de centre de contact met les appels en file, offre le rappel et montre aux dirigeants exactement quand les patients n’arrivent pas à joindre la clinique.',
        'Rappels en file pour que les patients gardent leur place sans attendre en ligne.',
        'Rapports de dotation aux heures de pointe qui montrent quand la capacité de réponse est insuffisante.',
        'Parcours distincts pour patients existants, nouveaux patients et références d’autres professionnels.',
      ),
      cloudMigration: sv(
        'Des dossiers et systèmes qui restent disponibles, et confidentiels',
        'Des serveurs de clinique dans un fond de placard menacent la continuité et la confidentialité. Nous aidons les pratiques à migrer vers des plateformes sécurisées et fiables avec sauvegarde, accès et résidence des données appropriés.',
        'Migration des outils de rendez-vous, de dossiers et d’imagerie avec un minimum d’arrêt de clinique.',
        'Options de résidence des données au Canada lorsque la réglementation ou les patients l’exigent.',
        'Sauvegardes et reprise testées, pour qu’un serveur en panne n’annule pas une journée de rendez-vous.',
      ),
      automation: sv(
        'Moins d’administration entre les visites',
        'Formulaires d’accueil, références, rappels et avis de résultats dévorent les heures du personnel. Nous automatisons les étapes qui ne demandent pas de jugement clinique pour que les gens se concentrent sur les patients.',
        'Formulaires d’accueil et de consentement numériques qui arrivent au dossier avant le patient.',
        'Campagnes de rappel pour visites annuelles et dépistages menées à partir de vos données de rendez-vous.',
        'Suivi des références qui alerte le personnel quand une boucle n’est pas fermée.',
      ),
      visibility: sv(
        'Soyez la pratique que les patients trouvent, et en qui ils ont confiance',
        'Les nouveaux patients choisissent par la recherche, les cartes et de plus en plus les assistants IA. Nous veillons à ce que vos services, emplacements, professionnels et disponibilités soient exacts partout où les patients regardent.',
        'Fiches Google avec heures, professionnels et statut d’acceptation de nouveaux patients exacts.',
        'Pages de services qui expliquent les visites en langage clair et répondent aux questions courantes des patients.',
        'Réponses aux avis rédigées dans un langage respectueux de la confidentialité qui protège patients et pratique.',
      ),
      websites: sv(
        'Un site qui accueille les patients avant leur arrivée',
        'Nous concevons des sites accessibles et apaisants qui expliquent les services, présentent les professionnels et rendent la réservation ou le contact sans effort sur tout appareil.',
        'Conception accessible qui répond aux besoins des patients âgés et de ceux qui utilisent des technologies d’assistance.',
        'Profils de professionnels et guides pour nouveaux patients qui réduisent l’anxiété de la première visite.',
        'Réservation en ligne et formulaires de contact sécurisés placés là où les patients décident de communiquer.',
      ),
    },
  },
}
const EN_3: HubDataMap = {
  manufacturing: {
    blurb: 'Order desks, plant-floor uptime, and the IT and OT networks they depend on.',
    metaTitle: 'Technology for Manufacturers | Roalla',
    metaDescription:
      'AI order and plant request desk, IT and OT security, plant communications, contact center routing, cloud and ERP, automation, visibility, and websites for manufacturers.',
    heroTitle: 'Keep production moving from the order desk to the plant floor',
    heroLead:
      'Manufacturers lose hours to order questions, maintenance requests, and systems that do not talk to each other. Roalla connects the people, networks, and workflows that keep lines running and customers informed.',
    pressuresTitle: 'What interrupts production schedules',
    pressures: [
      'Order and quality questions interrupting planners and supervisors all day',
      'Maintenance and line issues reported verbally and lost between shifts',
      'Ransomware risk that spreads from office IT into plant-floor equipment',
      'Legacy ERP and shop-floor systems that cannot easily share data with customers or suppliers',
    ],
    closerTitle: 'Run the plant, not the inbox',
    closerLead:
      'Tell us where production and customer communication collide. We will show where connected workflows and tighter security give you back the most time.',
    s: {
      aiEmployee: sv(
        'An order desk that never leaves production waiting',
        'The AI Employee answers order, delivery, and quality questions, triages maintenance and line issues, and gives supervisors a complete summary so production keeps moving.',
        'Order status, ship dates, and documentation requests answered from your ERP, day or night.',
        'Maintenance requests logged with machine, symptom, and urgency, then routed to the right technician.',
        'Quality and non-conformance reports captured with lot, part, and customer details for review.',
      ),
      security: sv(
        'Protect both IT and the machines on the plant floor',
        'Production networks were not designed with attackers in mind. We segment, monitor, and harden IT and OT environments so an office breach cannot halt a line.',
        'Network segmentation between office IT and PLC, SCADA, and machine networks.',
        'Asset inventory and patch strategy for equipment that cannot be updated on a normal schedule.',
        'Incident plans that include safe shutdown and restart, not just data recovery.',
      ),
      ucaas: sv(
        'Reach the people who run the line, wherever they stand',
        'Plant supervisors, maintenance, and shipping rarely sit at desks. Unified communications bring reliable voice and messaging to the floor, the office, and remote sites alike.',
        'Rugged handsets and mobile apps for supervisors and maintenance leads.',
        'Cross-plant calling and directories so sister sites and head office work as one team.',
        'Integration with overhead paging and emergency notification procedures.',
      ),
      ccaas: sv(
        'A customer service desk for the orders you are shipping',
        'Customers calling about order status, returns, or certifications should reach the right specialist fast. A contact center layer routes by account and topic and reports on what customers ask most.',
        'Routing by customer, product line, or order stage to a named specialist.',
        'Self-service order tracking and certificate look-up that deflects routine questions.',
        'Reports that reveal recurring delivery or quality themes before they become complaints.',
      ),
      cloudMigration: sv(
        'Modernize ERP and infrastructure without stopping production',
        'Ageing on-premise servers and aged ERP versions are common single points of failure. We plan migrations around production calendars, with fallback plans that protect shipments.',
        'Phased ERP, MES, and file-server moves scheduled around shutdowns and shipping peaks.',
        'Hybrid designs that keep latency-sensitive plant systems local while moving the rest.',
        'Disaster recovery targets agreed with operations, not just IT.',
      ),
      automation: sv(
        'Turn shop-floor events into action',
        'Machine data, orders, and quality records contain signals no one has time to read. We automate the alerts, reports, and handoffs that connect them to the right people.',
        'Downtime and scrap alerts sent to the supervisor with the machine and shift context.',
        'Purchase order, packing-slip, and certificate-of-conformance workflows that cut manual re-entry.',
        'Shift handover summaries assembled automatically from the day’s events.',
      ),
      visibility: sv(
        'Be found by buyers sourcing a manufacturing partner',
        'Engineers and procurement teams search for capabilities, materials, and certifications before sending an RFQ. We make your processes and credentials discoverable by search and AI assistants.',
        'Capability pages by process, material, tolerance, and industry served.',
        'Certification and quality content, such as ISO, that buyers can verify at a glance.',
        'Technical resources that earn citations when engineers research solutions.',
      ),
      websites: sv(
        'A website that earns the RFQ',
        'We design manufacturer websites that show capability with real equipment and clear specifications, and make requesting a quote simple for engineers and buyers.',
        'RFQ forms that accept drawings and capture material, quantity, and timeline.',
        'Equipment lists, capacity, and certifications presented in scannable detail.',
        'Plant and process photography that conveys quality before a site visit.',
      ),
    },
  },
  legal: {
    blurb: 'Intake, confidentiality, and client communication without a missed consultation.',
    metaTitle: 'Technology for Law Firms | Roalla',
    metaDescription:
      'AI legal intake, confidentiality-focused security, firm communications, contact center routing, cloud document systems, automation, visibility, and websites for law firms.',
    heroTitle: 'Capture every new matter without compromising confidentiality',
    heroLead:
      'Prospective clients call the first firm that answers, and then judge it on how carefully it handles their story. Roalla helps law firms respond quickly, communicate clearly, and protect privileged information end to end.',
    pressuresTitle: 'What costs law firms matters and sleep',
    pressures: [
      'New-matter calls that go to voicemail while lawyers are in court or with clients',
      'Client emails, texts, and documents spread across channels with inconsistent protection',
      'Phishing and wire-fraud attempts that target trust accounts and closing funds',
      'Billable time lost to scheduling, status updates, and document chasing',
    ],
    closerTitle: 'Practice law, not phone tag',
    closerLead:
      'Share how clients first reach your firm and how their documents move. We will point to the changes that protect privilege and win more consultations.',
    s: {
      aiEmployee: sv(
        'Every inquiry answered, every matter triaged',
        'The AI Employee answers prospective-client calls and messages, captures the facts of the matter, books consultations, and routes urgent items to the right lawyer, without ever giving legal advice.',
        'Conflict-check basics, practice area, and urgency captured in a structured intake summary.',
        'Consultation booking with the right lawyer, including after-hours enquiries.',
        'Clear script boundaries: the system never offers legal opinions, and urgent deadlines are escalated.',
      ),
      security: sv(
        'Protect privilege, trust accounts, and client trust',
        'Law firms hold sensitive evidence, settlement strategy, and client funds. We secure the channels and accounts attackers target, so your duty of confidentiality is backed by controls.',
        'Encrypted client portals and secure file exchange in place of email attachments.',
        'Wire-fraud safeguards, including call-back verification and dual approval for trust transfers.',
        'Access controls and audit logs by matter, including ethical walls where conflicts require them.',
      ),
      ucaas: sv(
        'Professional communication that stays on the record',
        'Calls, video consultations, and messaging should reflect a professional firm and respect confidentiality. Unified communications keep conversations on firm systems rather than personal apps.',
        'Business calling and texting from the firm’s number, with lawyers’ personal numbers protected.',
        'Video meetings suitable for remote consultations and out-of-town clients.',
        'Call logging that supports accurate time capture and file notes.',
      ),
      ccaas: sv(
        'Intake lines that match how clients actually call',
        'Mass torts, family emergencies, and criminal matters generate urgent calls at odd hours. A contact center layer ensures each call reaches the right intake path quickly.',
        'Practice-area queues and after-hours routing for urgent matters.',
        'Callback options so prospective clients are not lost to the next firm on the list.',
        'Source tracking that shows which referral channels and campaigns generate real consultations.',
      ),
      cloudMigration: sv(
        'Matter files that are safe, searchable, and always available',
        'Paper files and aging servers risk both continuity and confidentiality. We help firms migrate to secure document management with sensible structure, retention, and recovery.',
        'Document management moved to the cloud with matter-based permissions.',
        'Retention rules that align with law-society and regulatory expectations.',
        'Verified backups and recovery plans so a ransomware attack does not freeze active files.',
      ),
      automation: sv(
        'Reduce the administrative drag on billable hours',
        'Scheduling, client updates, engagement letters, and document requests consume lawyer and staff time. We automate repeatable steps while keeping lawyers in control of every judgment.',
        'Engagement letters and intake forms that generate and route for e-signature.',
        'Client status updates triggered by matter milestones without manual emails.',
        'Document-request reminders that chase missing items on a schedule.',
      ),
      visibility: sv(
        'Be the firm people find when they need help',
        'Clients search for lawyers by practice area, city, and urgency, increasingly through AI assistants. We make your expertise discoverable while respecting your regulator’s advertising rules.',
        'Practice-area and location pages that match how clients describe their problems.',
        'Lawyer profiles and published guidance that build credibility and authority.',
        'Review and directory hygiene that complies with professional advertising rules.',
      ),
      websites: sv(
        'A website with the gravity clients expect',
        'We design law firm websites that are calm, credible, and easy to act on, with clear practice pages, lawyer bios, and a secure way to get in touch.',
        'Confidential contact and intake forms with clear privacy language.',
        'Practice pages that explain process and what to expect in plain language.',
        'Accessible, bilingual-ready design where your clients need it.',
      ),
    },
  },
  'accounting-tax': {
    blurb: 'Client intake, document chasing, and busy-season capacity for accounting firms.',
    metaTitle: 'Technology for Accounting & Tax Firms | Roalla',
    metaDescription:
      'AI client intake and document chasing, secure financial data, firm communications, contact center routing, cloud practice tools, automation, visibility, and websites for accountants.',
    heroTitle: 'Get through busy season without drowning in client calls',
    heroLead:
      'Accounting firms spend weeks every year answering “did you get my documents?” instead of preparing returns. Roalla automates the chasing, tightens the security around financial data, and keeps clients informed.',
    pressuresTitle: 'What makes tax season painful',
    pressures: [
      'Phones jammed with status and document questions in the weeks that matter most',
      'Client documents arriving by email, text, and paper with no consistent tracking',
      'Sensitive financial and identity data attracting phishing and impersonation attempts',
      'Seasonal peaks that strain staff, then leave capacity idle for months',
    ],
    closerTitle: 'Spend busy season on the work you are paid for',
    closerLead:
      'Tell us how clients send documents and ask questions today. We will show where intake, chasing, and security can lighten the load before the next deadline.',
    s: {
      aiEmployee: sv(
        'Client calls answered and documents chased automatically',
        'The AI Employee answers client calls and messages, books appointments, requests missing documents, and routes urgent filing questions to the right accountant.',
        'Appointment booking by service type, such as personal returns, corporate files, and bookkeeping reviews.',
        'Missing-document reminders that name exactly what is outstanding, on a schedule.',
        'Urgent notices, such as CRA letters and filing deadlines, flagged immediately for the responsible accountant.',
      ),
      security: sv(
        'Safeguard financial identities and filing data',
        'SINs, banking details, and tax returns are among the most valuable data criminals can steal. We protect the systems and workflows where that data lives.',
        'Secure client portals for document exchange, replacing email attachments.',
        'MFA and access controls on tax software, practice management, and cloud accounting tools.',
        'Impersonation and CRA-scam awareness for staff and clients, plus a tested incident plan.',
      ),
      ucaas: sv(
        'Phones and messaging that scale with the season',
        'Seasonal staff, remote preparers, and multiple offices need one coherent system. Unified communications add capacity quickly and keep client conversations on firm channels.',
        'Quickly add and remove seasonal users without new hardware.',
        'Mobile and remote calling so preparers can work from home with the firm’s number.',
        'Voicemail transcription so urgent client messages are read, not buried.',
      ),
      ccaas: sv(
        'Absorb the deadline-week call surge',
        'Late-February and April call volumes overwhelm ordinary phone setups. A contact center layer queues calls, offers callbacks, and shows when you need more hands.',
        'Priority queues for existing clients and for urgent deadline matters.',
        'Callbacks and after-hours messaging that keep clients from calling twelve times.',
        'Volume and reason reports that guide next season’s staffing and communication plan.',
      ),
      cloudMigration: sv(
        'Practice tools in the cloud, structured and protected',
        'Local servers and ad hoc shared drives risk both client data and deadlines. We move firms to well-organized cloud systems with proper access, backup, and remote-work readiness.',
        'File structures and permissions that separate clients, engagements, and years.',
        'Secure remote desktops or cloud practice tools for staff who work from anywhere.',
        'Retention and backup aligned with professional record-keeping requirements.',
      ),
      automation: sv(
        'Replace document chasing with a system that never forgets',
        'Checklists, reminders, and file assembly are repeatable steps. We automate them so preparers start with a complete file instead of a stack of follow-ups.',
        'Client checklists issued automatically by engagement type and tax year.',
        'Document capture that files uploads to the right client folder and flags gaps.',
        'Status updates sent to clients as returns move from received to filed.',
      ),
      visibility: sv(
        'Be the accountant people find when they are ready to switch',
        'Business owners search for tax and accounting help by niche, city, and need. We make your specialties easy to find in search and in AI answers.',
        'Service pages by client type, such as incorporated professionals, trades, or self-employed.',
        'Educational content on deadlines and rules that answers real client questions.',
        'Local presence and reviews that reinforce credibility.',
      ),
      websites: sv(
        'A website that signals competence and care',
        'We design accounting firm websites that explain services and pricing approach, introduce your team, and make secure document upload and appointment booking simple.',
        'Clear service descriptions and who each is for.',
        'A secure upload entry point and appointment booking built into the site.',
        'Team and credential pages that build trust with new clients.',
      ),
    },
  },
}
const FR_3: HubDataMap = {
  manufacturing: {
    blurb: 'Bureaux de commandes, disponibilité du plancher et les réseaux TI et TO dont ils dépendent.',
    metaTitle: 'Technologie pour les manufacturiers | Roalla',
    metaDescription:
      'Bureau IA des commandes et demandes d’usine, sécurité TI et TO, communications d’usine, centre de contact, infonuagique et ERP, automatisation, visibilité et sites web pour manufacturiers.',
    heroTitle: 'Gardez la production en marche, du bureau des commandes au plancher',
    heroLead:
      'Les manufacturiers perdent des heures en questions de commandes, demandes de maintenance et systèmes qui ne se parlent pas. Roalla relie les personnes, les réseaux et les flux qui gardent les lignes en marche et les clients informés.',
    pressuresTitle: 'Ce qui perturbe les calendriers de production',
    pressures: [
      'Des questions de commandes et de qualité qui interrompent planificateurs et superviseurs toute la journée',
      'Des problèmes de maintenance et de ligne signalés de vive voix et perdus entre les quarts',
      'Un risque de rançongiciel qui se propage des TI de bureau jusqu’à l’équipement du plancher',
      'Un ERP et des systèmes d’atelier désuets qui partagent difficilement leurs données avec clients ou fournisseurs',
    ],
    closerTitle: 'Dirigez l’usine, pas la boîte de réception',
    closerLead:
      'Dites-nous où production et communication client se heurtent. Nous montrerons où des flux connectés et une sécurité resserrée vous redonnent le plus de temps.',
    s: {
      aiEmployee: sv(
        'Un bureau de commandes qui ne laisse jamais la production en attente',
        'L’Employé IA répond aux questions de commandes, de livraison et de qualité, trie les problèmes de maintenance et de ligne et remet aux superviseurs un résumé complet pour que la production continue.',
        'Statut de commande, dates d’expédition et demandes de documents répondus à partir de votre ERP, jour et nuit.',
        'Demandes de maintenance consignées avec machine, symptôme et urgence, puis acheminées au bon technicien.',
        'Rapports de qualité et de non-conformité saisis avec lot, pièce et détails du client pour révision.',
      ),
      security: sv(
        'Protégez à la fois les TI et les machines du plancher',
        'Les réseaux de production n’ont pas été conçus en pensant aux attaquants. Nous segmentons, surveillons et renforçons les environnements TI et TO pour qu’une intrusion au bureau n’arrête pas une ligne.',
        'Segmentation du réseau entre les TI de bureau et les réseaux d’automates, SCADA et machines.',
        'Inventaire des actifs et stratégie de correctifs pour l’équipement qu’on ne peut pas mettre à jour selon un calendrier normal.',
        'Plans d’incident qui incluent l’arrêt et le redémarrage sécuritaires, pas seulement la reprise des données.',
      ),
      ucaas: sv(
        'Joignez les gens qui font tourner la ligne, où qu’ils soient',
        'Superviseurs, maintenance et expédition sont rarement assis à un bureau. Les communications unifiées apportent voix et messagerie fiables au plancher, au bureau et aux sites distants.',
        'Combinés robustes et applis mobiles pour superviseurs et chefs de maintenance.',
        'Appels et annuaires entre usines pour que sites frères et siège social travaillent en une seule équipe.',
        'Intégration avec le système de page et les procédures d’avis d’urgence.',
      ),
      ccaas: sv(
        'Un service à la clientèle pour les commandes que vous expédiez',
        'Les clients qui appellent au sujet d’une commande, d’un retour ou d’une certification doivent joindre rapidement le bon spécialiste. Une couche de centre de contact achemine par compte et sujet et rapporte ce que les clients demandent le plus.',
        'Acheminement par client, gamme de produits ou étape de commande vers un spécialiste nommé.',
        'Suivi de commandes et consultation de certificats en libre-service qui détournent les questions courantes.',
        'Rapports qui révèlent les thèmes récurrents de livraison ou de qualité avant qu’ils deviennent des plaintes.',
      ),
      cloudMigration: sv(
        'Modernisez l’ERP et l’infrastructure sans arrêter la production',
        'Les serveurs sur place vieillissants et les versions d’ERP dépassées sont des points de défaillance uniques courants. Nous planifions les migrations autour des calendriers de production, avec des plans de repli qui protègent les expéditions.',
        'Migrations par phases de l’ERP, du MES et des serveurs de fichiers autour des arrêts et des pointes d’expédition.',
        'Architectures hybrides qui gardent localement les systèmes sensibles à la latence tout en migrant le reste.',
        'Objectifs de reprise après sinistre convenus avec les opérations, pas seulement avec les TI.',
      ),
      automation: sv(
        'Transformez les événements d’atelier en actions',
        'Données de machines, commandes et dossiers de qualité contiennent des signaux que personne n’a le temps de lire. Nous automatisons alertes, rapports et transferts qui les relient aux bonnes personnes.',
        'Alertes d’arrêt et de rebut envoyées au superviseur avec le contexte de machine et de quart.',
        'Flux de bons de commande, bordereaux d’expédition et certificats de conformité qui réduisent la ressaisie manuelle.',
        'Résumés de relève de quart assemblés automatiquement à partir des événements de la journée.',
      ),
      visibility: sv(
        'Soyez trouvé par les acheteurs qui cherchent un partenaire de fabrication',
        'Ingénieurs et équipes d’approvisionnement cherchent capacités, matériaux et certifications avant d’envoyer une demande de prix. Nous rendons vos procédés et accréditations repérables par la recherche et les assistants IA.',
        'Pages de capacités par procédé, matériau, tolérance et industrie desservie.',
        'Contenu sur les certifications et la qualité, comme ISO, que les acheteurs vérifient d’un coup d’œil.',
        'Ressources techniques qui méritent d’être citées quand les ingénieurs cherchent des solutions.',
      ),
      websites: sv(
        'Un site qui mérite la demande de prix',
        'Nous concevons des sites de manufacturiers qui montrent la capacité avec de vrais équipements et des spécifications claires, et simplifient la demande de prix pour ingénieurs et acheteurs.',
        'Formulaires de demande de prix qui acceptent les dessins et saisissent matériau, quantité et échéancier.',
        'Listes d’équipements, capacité et certifications présentées de façon lisible.',
        'Photos de l’usine et des procédés qui transmettent la qualité avant une visite.',
      ),
    },
  },
  legal: {
    blurb: 'Accueil, confidentialité et communication avec les clients, sans consultation manquée.',
    metaTitle: 'Technologie pour les cabinets d’avocats | Roalla',
    metaDescription:
      'Accueil juridique IA, sécurité axée sur la confidentialité, communications de cabinet, centre de contact, systèmes documentaires infonuagiques, automatisation, visibilité et sites web pour cabinets d’avocats.',
    heroTitle: 'Saisissez chaque nouveau dossier sans compromettre la confidentialité',
    heroLead:
      'Les clients potentiels appellent le premier cabinet qui répond, puis le jugent sur le soin avec lequel il traite leur histoire. Roalla aide les cabinets d’avocats à répondre vite, à communiquer clairement et à protéger les renseignements privilégiés de bout en bout.',
    pressuresTitle: 'Ce qui coûte des dossiers et du sommeil aux cabinets',
    pressures: [
      'Des appels de nouveaux dossiers qui vont à la boîte vocale pendant que les avocats sont au tribunal ou avec des clients',
      'Courriels, textos et documents de clients éparpillés sur plusieurs canaux avec une protection inégale',
      'Des tentatives d’hameçonnage et de fraude par virement visant les comptes en fiducie et les fonds de clôture',
      'Du temps facturable perdu en planification, mises à jour de statut et relances de documents',
    ],
    closerTitle: 'Pratiquez le droit, pas le jeu du téléphone',
    closerLead:
      'Dites-nous comment les clients joignent d’abord votre cabinet et comment circulent leurs documents. Nous indiquerons les changements qui protègent le privilège et vous valent plus de consultations.',
    s: {
      aiEmployee: sv(
        'Chaque demande répondue, chaque dossier trié',
        'L’Employé IA répond aux appels et messages des clients potentiels, saisit les faits du dossier, réserve les consultations et achemine les urgences au bon avocat, sans jamais donner de conseil juridique.',
        'Éléments de base pour la vérification des conflits, domaine de pratique et urgence saisis dans un résumé d’accueil structuré.',
        'Réservation de consultations avec le bon avocat, y compris pour les demandes hors des heures.',
        'Limites de script claires : le système n’émet jamais d’opinion juridique, et les échéances urgentes sont escaladées.',
      ),
      security: sv(
        'Protégez le privilège, les comptes en fiducie et la confiance des clients',
        'Les cabinets détiennent des éléments de preuve sensibles, des stratégies de règlement et des fonds de clients. Nous sécurisons les canaux et comptes que visent les attaquants, pour que votre devoir de confidentialité repose sur des contrôles.',
        'Portails clients chiffrés et échange de fichiers sécurisé à la place des pièces jointes par courriel.',
        'Protections contre la fraude par virement, dont vérification par rappel et double approbation des transferts en fiducie.',
        'Contrôles d’accès et journaux d’audit par dossier, y compris des murs éthiques là où les conflits l’exigent.',
      ),
      ucaas: sv(
        'Une communication professionnelle qui reste au dossier',
        'Appels, consultations vidéo et messagerie doivent refléter un cabinet professionnel et respecter la confidentialité. Les communications unifiées gardent les conversations sur les systèmes du cabinet plutôt que sur des applis personnelles.',
        'Appels et textos d’affaires sous le numéro du cabinet, avec protection des numéros personnels des avocats.',
        'Réunions vidéo adaptées aux consultations à distance et aux clients de l’extérieur.',
        'Journalisation des appels qui soutient la saisie exacte du temps et les notes au dossier.',
      ),
      ccaas: sv(
        'Des lignes d’accueil qui correspondent à la façon dont les clients appellent vraiment',
        'Recours collectifs, urgences familiales et dossiers criminels génèrent des appels urgents à des heures inhabituelles. Une couche de centre de contact assure que chaque appel emprunte rapidement le bon parcours d’accueil.',
        'Files par domaine de pratique et acheminement hors des heures pour les affaires urgentes.',
        'Options de rappel pour ne pas perdre les clients potentiels au profit du cabinet suivant sur la liste.',
        'Suivi des sources qui montre quels canaux de référence et campagnes génèrent de vraies consultations.',
      ),
      cloudMigration: sv(
        'Des dossiers sécuritaires, repérables et toujours accessibles',
        'Les dossiers papier et les serveurs vieillissants menacent la continuité et la confidentialité. Nous aidons les cabinets à migrer vers une gestion documentaire sécurisée avec structure, conservation et reprise appropriées.',
        'Gestion documentaire migrée vers le nuage avec permissions par dossier.',
        'Règles de conservation alignées sur les attentes des barreaux et de la réglementation.',
        'Sauvegardes vérifiées et plans de reprise pour qu’un rançongiciel ne paralyse pas les dossiers actifs.',
      ),
      automation: sv(
        'Réduisez le poids administratif sur les heures facturables',
        'Planification, mises à jour aux clients, lettres de mandat et demandes de documents consomment le temps des avocats et du personnel. Nous automatisons les étapes répétables tout en laissant aux avocats le contrôle de chaque jugement.',
        'Lettres de mandat et formulaires d’accueil générés et acheminés pour signature électronique.',
        'Mises à jour de statut aux clients déclenchées par les jalons du dossier sans courriels manuels.',
        'Rappels de documents qui relancent les pièces manquantes selon un calendrier.',
      ),
      visibility: sv(
        'Soyez le cabinet que l’on trouve quand on a besoin d’aide',
        'Les clients cherchent des avocats par domaine de pratique, ville et urgence, de plus en plus via les assistants IA. Nous rendons votre expertise repérable tout en respectant les règles de publicité de votre ordre professionnel.',
        'Pages par domaine de pratique et par lieu qui correspondent à la façon dont les clients décrivent leurs problèmes.',
        'Profils d’avocats et contenus publiés qui bâtissent crédibilité et autorité.',
        'Hygiène des avis et des annuaires conforme aux règles de publicité professionnelle.',
      ),
      websites: sv(
        'Un site avec la gravité que les clients attendent',
        'Nous concevons des sites de cabinets calmes, crédibles et faciles à utiliser, avec des pages de pratique claires, des biographies d’avocats et un moyen sécurisé de communiquer.',
        'Formulaires de contact et d’accueil confidentiels avec un langage de confidentialité clair.',
        'Pages de pratique qui expliquent le processus et à quoi s’attendre en langage simple.',
        'Conception accessible et prête pour le bilinguisme là où vos clients en ont besoin.',
      ),
    },
  },
  'accounting-tax': {
    blurb: 'Accueil des clients, relance de documents et capacité en période de pointe pour les cabinets comptables.',
    metaTitle: 'Technologie pour les cabinets de comptabilité et de fiscalité | Roalla',
    metaDescription:
      'Accueil IA des clients et relance de documents, données financières sécurisées, communications de cabinet, centre de contact, outils de cabinet infonuagiques, automatisation, visibilité et sites web pour comptables.',
    heroTitle: 'Traversez la saison de pointe sans vous noyer dans les appels',
    heroLead:
      'Les cabinets comptables passent des semaines chaque année à répondre à « avez-vous reçu mes documents ? » au lieu de préparer des déclarations. Roalla automatise les relances, resserre la sécurité des données financières et garde les clients informés.',
    pressuresTitle: 'Ce qui rend la saison fiscale pénible',
    pressures: [
      'Des téléphones saturés de questions de statut et de documents pendant les semaines les plus critiques',
      'Des documents de clients qui arrivent par courriel, texto et papier sans suivi uniforme',
      'Des données financières et d’identité sensibles qui attirent hameçonnage et usurpation',
      'Des pointes saisonnières qui étirent le personnel, puis laissent la capacité inutilisée pendant des mois',
    ],
    closerTitle: 'Consacrez la saison de pointe au travail pour lequel on vous paie',
    closerLead:
      'Dites-nous comment les clients envoient leurs documents et posent leurs questions aujourd’hui. Nous montrerons où l’accueil, la relance et la sécurité peuvent alléger la charge avant la prochaine échéance.',
    s: {
      aiEmployee: sv(
        'Appels des clients répondus et documents relancés automatiquement',
        'L’Employé IA répond aux appels et messages des clients, réserve les rendez-vous, demande les documents manquants et achemine les questions de production urgentes au bon comptable.',
        'Réservation par type de service : déclarations de particuliers, dossiers de sociétés, révisions de tenue de livres.',
        'Rappels de documents manquants qui nomment précisément ce qui reste à fournir, selon un calendrier.',
        'Avis urgents, comme les lettres de l’ARC et les échéances de production, signalés immédiatement au comptable responsable.',
      ),
      security: sv(
        'Protégez les identités financières et les données de production',
        'NAS, coordonnées bancaires et déclarations de revenus figurent parmi les données les plus précieuses que les criminels peuvent voler. Nous protégeons les systèmes et flux où elles résident.',
        'Portails clients sécurisés pour l’échange de documents, à la place des pièces jointes par courriel.',
        'AMF et contrôles d’accès sur les logiciels fiscaux, la gestion de cabinet et les outils comptables infonuagiques.',
        'Sensibilisation du personnel et des clients à l’usurpation et aux fraudes se réclamant de l’ARC, avec un plan d’incident testé.',
      ),
      ucaas: sv(
        'Téléphones et messagerie qui suivent la saison',
        'Personnel saisonnier, préparateurs à distance et bureaux multiples ont besoin d’un système cohérent. Les communications unifiées ajoutent rapidement de la capacité et gardent les conversations des clients sur les canaux du cabinet.',
        'Ajout et retrait rapides d’utilisateurs saisonniers sans nouveau matériel.',
        'Appels mobiles et à distance pour que les préparateurs travaillent de la maison avec le numéro du cabinet.',
        'Transcription de la messagerie vocale pour que les messages urgents soient lus, pas enfouis.',
      ),
      ccaas: sv(
        'Absorbez la vague d’appels de la semaine d’échéance',
        'Les volumes de fin février et d’avril submergent les systèmes téléphoniques ordinaires. Une couche de centre de contact met les appels en file, offre le rappel et montre quand il faut plus de bras.',
        'Files prioritaires pour les clients existants et les dossiers à échéance urgente.',
        'Rappels et messages hors des heures qui évitent que les clients appellent douze fois.',
        'Rapports de volume et de motifs qui guident la dotation et le plan de communication de la prochaine saison.',
      ),
      cloudMigration: sv(
        'Des outils de cabinet dans le nuage, structurés et protégés',
        'Les serveurs locaux et les lecteurs partagés improvisés menacent les données des clients et les échéances. Nous faisons migrer les cabinets vers des systèmes infonuagiques bien organisés, avec accès, sauvegarde et préparation au télétravail.',
        'Structures de fichiers et permissions qui séparent clients, mandats et années.',
        'Bureaux à distance sécurisés ou outils de cabinet infonuagiques pour le personnel qui travaille de partout.',
        'Conservation et sauvegarde alignées sur les exigences professionnelles de tenue de dossiers.',
      ),
      automation: sv(
        'Remplacez la relance de documents par un système qui n’oublie jamais',
        'Listes de vérification, rappels et assemblage de dossiers sont des étapes répétables. Nous les automatisons pour que les préparateurs commencent avec un dossier complet plutôt qu’une pile de relances.',
        'Listes de vérification envoyées automatiquement selon le type de mandat et l’année d’imposition.',
        'Saisie de documents qui classe les téléversements dans le bon dossier client et signale les lacunes.',
        'Mises à jour de statut aux clients à mesure que les déclarations passent de reçues à produites.',
      ),
      visibility: sv(
        'Soyez le comptable que l’on trouve quand on est prêt à changer',
        'Les propriétaires d’entreprise cherchent de l’aide fiscale et comptable par créneau, ville et besoin. Nous rendons vos spécialités faciles à trouver dans la recherche et les réponses IA.',
        'Pages de services par type de client : professionnels incorporés, métiers ou travailleurs autonomes.',
        'Contenu éducatif sur les échéances et les règles qui répond aux vraies questions des clients.',
        'Présence locale et avis qui renforcent la crédibilité.',
      ),
      websites: sv(
        'Un site qui exprime compétence et attention',
        'Nous concevons des sites de cabinets comptables qui expliquent les services et l’approche tarifaire, présentent votre équipe et simplifient le dépôt sécurisé de documents et la prise de rendez-vous.',
        'Descriptions de services claires précisant à qui chacun s’adresse.',
        'Un point d’entrée de dépôt sécurisé et la prise de rendez-vous intégrés au site.',
        'Pages d’équipe et de titres professionnels qui bâtissent la confiance des nouveaux clients.',
      ),
    },
  },
}
const EN_4: HubDataMap = {
  'real-estate-property': {
    blurb: 'Lead response, showings, tenants, and the buildings behind them.',
    metaTitle: 'Technology for Real Estate & Property Management | Roalla',
    metaDescription:
      'AI lead and tenant desk, secured transaction data, brokerage communications, contact center routing, cloud tools, automation, local visibility, and websites for real estate and property teams.',
    heroTitle: 'Respond to every lead and every tenant before the competition does',
    heroLead:
      'In real estate, the first agent to reply often wins the listing, and in property management, the first fast fix earns the renewal. Roalla keeps leads, showings, and service requests moving while your team is out in the field.',
    pressuresTitle: 'Where real estate and property teams lose ground',
    pressures: [
      'Portal and ad leads that go cold within minutes if nobody answers',
      'Agents juggling showings, so calls and texts go unanswered for hours',
      'Maintenance requests arriving by phone, text, and email with no clear owner or urgency',
      'Wire-fraud and email-spoofing attempts timed to closings and rent payments',
    ],
    closerTitle: 'Win the lead, keep the tenant',
    closerLead:
      'Tell us how leads and requests reach your team today. We will show where faster response and cleaner workflows pay back fastest.',
    s: {
      aiEmployee: sv(
        'Every lead and tenant request handled the moment it arrives',
        'The AI Employee answers buyer, seller, and tenant contacts at any hour, qualifies them, books showings or service visits, and escalates emergencies, so deals and buildings keep moving.',
        'Lead qualification on budget, timing, and area before an agent’s phone ever rings.',
        'Showing and viewing bookings synchronized with agent calendars and confirmations.',
        'Maintenance triage that separates a burst pipe from a squeaky door and escalates accordingly.',
      ),
      security: sv(
        'Protect closing funds, tenant data, and brand reputation',
        'Brokerages and property managers handle deposits, identity documents, and lease details that criminals actively target. We secure the accounts and workflows behind every transaction.',
        'Wire-fraud prevention with verified payment instructions and call-back checks at closing.',
        'MFA and access controls for transaction platforms, e-signature, and tenant portals.',
        'Tenant and client data retention practices aligned with provincial privacy and regulatory guidance.',
      ),
      ucaas: sv(
        'One number for the agent, the office, and the building',
        'Agents work from cars, showings, and home. Unified communications keep calls, texts, and video on firm-controlled numbers so leads are never stranded on a personal phone.',
        'Mobile apps that let agents call and text clients from the brokerage number.',
        'Team and office lines with ring groups so a lead is answered by someone, always.',
        'Building and after-hours lines that route urgent tenant calls to the right on-call contact.',
      ),
      ccaas: sv(
        'Turn a flood of inquiries into a managed pipeline',
        'A new listing or a cold snap triggers a rush of calls. A contact center layer queues, qualifies, and distributes inbound enquiries so none are lost and no agent is swamped.',
        'Lead routing by area, price range, or language to the best-placed agent.',
        'Emergency and routine lines for property management, with SLA reporting for owners.',
        'Call source tracking that shows which ads and signs actually ring the phone.',
      ),
      cloudMigration: sv(
        'Transaction files and building records in one safe place',
        'Deals, leases, inspection reports, and building plans accumulate across laptops and inboxes. We consolidate them into secure cloud systems with sensible structure and recovery.',
        'Transaction and lease document storage organized by property and client.',
        'Secure integration of CRM, listing, accounting, and property management systems.',
        'Backup and recovery protecting years of building and client history.',
      ),
      automation: sv(
        'Follow up on every lead, forever, without lifting a finger',
        'Nurture sequences, showing feedback, lease renewals, and maintenance updates are all repeatable. We automate them so your pipeline and your tenants hear from you at the right moment.',
        'Lead nurture sequences that keep long-horizon buyers warm until they are ready.',
        'Lease-renewal and rent-reminder workflows that cut late payments and vacancy gaps.',
        'Work-order updates sent to tenants and owners as maintenance moves forward.',
      ),
      visibility: sv(
        'Be the first agent or manager local searchers find',
        'Buyers, sellers, and tenants start with search and maps. We build neighborhood-level presence, reviews, and listing content that surface your name in both search and AI answers.',
        'Neighborhood and market-update pages that show local expertise.',
        'Google Business Profile and review programs that build recent social proof.',
        'Structured listing and property data that search engines and assistants can read.',
      ),
      websites: sv(
        'A website that converts browsers into booked showings',
        'We design real estate and property websites with fast search, clear listings, and an obvious path to book a showing, request a valuation, or submit a service request.',
        'Listing pages and filters that load quickly on mobile, where most searches happen.',
        'Valuation and showing-request forms that qualify without friction.',
        'Tenant portals and service-request pages that reduce inbound calls to the office.',
      ),
    },
  },
  veterinary: {
    blurb: 'Pet-owner calls, reminders, and emergencies for animal hospitals and clinics.',
    metaTitle: 'Technology for Veterinary Clinics & Animal Hospitals | Roalla',
    metaDescription:
      'AI veterinary front desk, secure client records, clinic communications, contact center routing, cloud practice systems, automation, local visibility, and websites for vets.',
    heroTitle: 'A front desk that never misses a worried pet owner',
    heroLead:
      'Veterinary teams care for animals while phones ring with booking requests, prescription refills, and frightened owners. Roalla helps clinics answer quickly, triage correctly, and keep reminders flowing, so clinical staff can stay with patients.',
    pressuresTitle: 'What stretches a veterinary team too thin',
    pressures: [
      'Phones that ring during procedures, leaving owners without an answer',
      'Emergencies that need to be separated from routine calls in seconds',
      'Missed reminders for vaccines and dental checks that cost both care and revenue',
      'Staff burnout from the emotional intensity and sheer volume of daily calls',
    ],
    closerTitle: 'Keep the team with the animals, not the phone',
    closerLead:
      'Tell us how calls and reminders work in your clinic today. We will show where better triage and automation lighten the load.',
    s: {
      aiEmployee: sv(
        'Owner calls answered, patients booked, emergencies escalated',
        'The AI Employee answers every pet-owner call, books the right visit type, handles routine requests, and escalates true emergencies, while clinical judgment stays with your veterinary team.',
        'Appointment booking by species, visit type, and veterinarian, including after hours.',
        'Emergency triage prompts that route urgent cases to the on-call team or the nearest emergency hospital.',
        'Refill, record, and estimate requests captured and queued for staff without interrupting treatment.',
      ),
      security: sv(
        'Protect client records, payments, and clinic systems',
        'Practice-management systems hold owner contacts, payment details, and controlled-drug records. We secure the systems and processes so a cyber incident does not close the clinic.',
        'Access controls and audit trails for practice software and controlled-substance logs.',
        'Payment-card safeguards and phishing training for reception and clinical staff.',
        'Backup and recovery plans that keep patient histories available during an outage.',
      ),
      ucaas: sv(
        'Reliable phones across clinics and after-hours teams',
        'Multi-clinic groups and on-call vets need calls routed consistently. Unified communications provide dependable calling, secure messaging, and shared directories across locations.',
        'Call flows that separate appointments, pharmacy, and emergencies at the first prompt.',
        'Shared lines across group locations so a busy clinic is backed up by another.',
        'Secure staff messaging replacing personal texts about patients and owners.',
      ),
      ccaas: sv(
        'Handle the Monday-morning and emergency call rush',
        'Reception teams face peak waves after weekends and during seasonal vaccine drives. A contact center layer queues calls, offers callbacks, and gives leaders data on missed demand.',
        'Callbacks that preserve a caller’s place without keeping them on hold.',
        'Priority lanes for emergency calls and referring-clinic contacts.',
        'Reports on call peaks to plan front-desk staffing realistically.',
      ),
      cloudMigration: sv(
        'Practice systems that stay available and recoverable',
        'On-site servers and imaging workstations are single points of failure. We help clinics move to resilient platforms with tested recovery and secure remote access.',
        'Practice-management and imaging data migrated with minimal clinic disruption.',
        'Network and Wi-Fi design for treatment rooms, imaging, and wellness-plan kiosks.',
        'Recovery plans that restore records and scheduling quickly after hardware or ransomware incidents.',
      ),
      automation: sv(
        'Reminders and follow-ups that run themselves',
        'Vaccine due dates, post-surgery check-ins, and wellness-plan renewals all drive better care and steady revenue. We automate them with a personal, caring tone.',
        'Reminder cycles for vaccines, dental care, and annual exams based on patient records.',
        'Post-visit check-ins that catch problems early and encourage follow-up booking.',
        'Wellness-plan and recheck workflows that reduce lapses and manual tracking.',
      ),
      visibility: sv(
        'Be the clinic local pet owners search for and trust',
        'Owners search for a nearby vet, an emergency clinic, or a specialist, often on a stressful night. We make your clinic easy to find with accurate hours and honest, helpful content.',
        'Google Business Profiles with current hours, services, and emergency instructions.',
        'Service pages for species, dentistry, surgery, and senior pet care.',
        'Review programs that celebrate your team and reinforce trust.',
      ),
      websites: sv(
        'A website as warm as your waiting room',
        'We design clinic websites that introduce your team, explain services, and make booking, refills, and emergency information easy for pet owners to find.',
        'Online booking and refill request forms that cut inbound calls.',
        'Clear emergency guidance and after-hours contact information on every page.',
        'Team pages and pet-care resources that make a new client feel at home.',
      ),
    },
  },
  'insurance-brokerage': {
    blurb: 'Quote requests, renewals, and claims routing without unlicensed advice.',
    metaTitle: 'Technology for Insurance Brokerages | Roalla',
    metaDescription:
      'AI intake for quoting and claims, secure client data, brokerage communications, contact center routing, cloud systems, automation, visibility, and websites for insurance brokers.',
    heroTitle: 'Turn every enquiry into a quote and every renewal into a conversation',
    heroLead:
      'Brokerages compete on responsiveness and trust, yet advisors spend hours on intake, certificates, and renewal paperwork. Roalla frees your licensed team for advice while the front line handles the routine.',
    pressuresTitle: 'What holds brokerages back',
    pressures: [
      'Quote requests that sit overnight or over the weekend, then disappear to a faster broker',
      'Certificate, policy-change, and claims calls that interrupt advisors in the middle of a client meeting',
      'Sensitive personal and financial data that creates regulatory and reputational risk',
      'Renewal cycles run from spreadsheets and memory instead of a reliable process',
    ],
    closerTitle: 'Let licensed advisors advise',
    closerLead:
      'Tell us how enquiries, renewals, and claims reach your brokerage today. We will show where the front line and back office can improve safely.',
    s: {
      aiEmployee: sv(
        'Quotes started and claims routed at any hour',
        'The AI Employee qualifies new risks, books advisor time, answers routine policy questions from approved scripts, and routes claims to the right person, without giving unlicensed advice.',
        'Personal and commercial quote intake that captures the details an advisor needs to start.',
        'Certificate and policy-document requests handled from approved information.',
        'Claims first-notice capture routed to the carrier or advisor, with urgent losses escalated immediately.',
      ),
      security: sv(
        'Protect the personal and financial data clients entrust to you',
        'Brokerages hold identity, property, health, and payment information across carrier portals and internal systems. We help you meet regulator and carrier expectations with real controls.',
        'Access governance across broker-management systems and multiple carrier portals.',
        'Cyber-insurance-grade controls such as MFA, endpoint protection, and backup that underwriters ask about.',
        'Privacy and breach-response procedures aligned with provincial regulator and privacy-law expectations.',
      ),
      ucaas: sv(
        'Consistent communication across advisors and offices',
        'Advisors work with clients, carriers, and underwriters all day. Unified communications keep calls, messages, and meetings organized on brokerage-controlled channels.',
        'Business calling and texting from the brokerage number with call history attached to clients.',
        'Video meetings suited to renewal reviews and remote clients.',
        'Call recording options that support compliance and documentation of advice discussions.',
      ),
      ccaas: sv(
        'Separate sales, service, and claims at the front door',
        'Prospects, existing clients, and claimants all call the same number with very different needs. A contact center layer routes each to the right team, fast.',
        'Dedicated queues for new business, policy service, and claims.',
        'Priority handling for claims and for high-value commercial accounts.',
        'Reporting that tracks response time and conversion from call to quote.',
      ),
      cloudMigration: sv(
        'Client files and carrier workflows on solid ground',
        'Policy files, carrier credentials, and client documents sit across drives and inboxes. We consolidate to secure platforms with controlled access and reliable recovery.',
        'Client and policy document storage organized by account, line, and renewal date.',
        'Secure connections between your broker-management system and carrier tools.',
        'Backups and recovery plans suited to an E&O-conscious business.',
      ),
      automation: sv(
        'Make renewals and endorsements run on a schedule',
        'Renewal outreach, certificate issuance, and document collection follow predictable steps. We automate them so advisors spend their time on coverage, not chasing.',
        'Renewal workflows that start a set number of days ahead and track each client’s response.',
        'Certificate and proof-of-insurance requests processed from approved templates.',
        'Cross-sell and review reminders triggered by life events and policy anniversaries.',
      ),
      visibility: sv(
        'Be the broker people find when they search for coverage',
        'Households and businesses search by line, risk, and city before choosing a broker. We make your specialties and local presence visible in search and AI assistants.',
        'Line-of-business pages for auto, home, commercial, and specialty risks.',
        'Educational guides that answer coverage questions without crossing into advice.',
        'Local presence and review programs that build brokerage credibility.',
      ),
      websites: sv(
        'A website that earns trust and starts the quote',
        'We design brokerage websites that make coverage understandable, introduce your advisors, and offer a simple, secure way to request a quote or report a claim.',
        'Short quote-request forms tailored to personal and commercial lines.',
        'Claims guidance pages that tell customers exactly what to do first.',
        'Advisor profiles, licences, and carrier partners presented transparently.',
      ),
    },
  },
}
const FR_4: HubDataMap = {
  'real-estate-property': {
    blurb: 'Réponse aux prospects, visites, locataires et immeubles qui les accueillent.',
    metaTitle: 'Technologie pour l’immobilier et la gestion immobilière | Roalla',
    metaDescription:
      'Bureau IA des prospects et locataires, données de transaction sécurisées, communications de courtage, centre de contact, outils infonuagiques, automatisation, visibilité locale et sites web pour équipes immobilières.',
    heroTitle: 'Répondez à chaque prospect et à chaque locataire avant la concurrence',
    heroLead:
      'En immobilier, le premier courtier qui répond remporte souvent l’inscription, et en gestion immobilière, la première réparation rapide mérite le renouvellement. Roalla garde prospects, visites et demandes de service en mouvement pendant que votre équipe est sur le terrain.',
    pressuresTitle: 'Où les équipes immobilières perdent du terrain',
    pressures: [
      'Des prospects de portails et de publicités qui refroidissent en quelques minutes si personne ne répond',
      'Des courtiers en visite dont les appels et textos restent sans réponse pendant des heures',
      'Des demandes d’entretien reçues par téléphone, texto et courriel sans responsable ni urgence claire',
      'Des tentatives de fraude par virement et d’usurpation de courriel calées sur les clôtures et les loyers',
    ],
    closerTitle: 'Gagnez le prospect, gardez le locataire',
    closerLead:
      'Dites-nous comment prospects et demandes joignent votre équipe aujourd’hui. Nous montrerons où une réponse plus rapide et des flux plus propres rapportent le plus vite.',
    s: {
      aiEmployee: sv(
        'Chaque prospect et chaque demande de locataire traités dès leur arrivée',
        'L’Employé IA répond aux acheteurs, vendeurs et locataires à toute heure, les qualifie, réserve visites ou interventions et escalade les urgences, pour que transactions et immeubles continuent d’avancer.',
        'Qualification des prospects selon budget, échéancier et secteur avant même que le téléphone du courtier sonne.',
        'Réservations de visites synchronisées avec les agendas des courtiers et confirmations.',
        'Tri d’entretien qui distingue un tuyau éclaté d’une porte qui grince et escalade en conséquence.',
      ),
      security: sv(
        'Protégez les fonds de clôture, les données des locataires et la réputation',
        'Courtages et gestionnaires d’immeubles manipulent dépôts, pièces d’identité et détails de baux que les criminels ciblent activement. Nous sécurisons les comptes et flux derrière chaque transaction.',
        'Prévention de la fraude par virement avec instructions de paiement vérifiées et rappels de validation à la clôture.',
        'AMF et contrôles d’accès pour les plateformes de transaction, la signature électronique et les portails locataires.',
        'Pratiques de conservation des données des locataires et clients alignées sur les orientations provinciales de vie privée et de réglementation.',
      ),
      ucaas: sv(
        'Un numéro pour le courtier, le bureau et l’immeuble',
        'Les courtiers travaillent depuis leur voiture, en visite ou à la maison. Les communications unifiées gardent appels, textos et vidéo sur des numéros contrôlés par l’agence pour qu’aucun prospect ne reste coincé sur un téléphone personnel.',
        'Applis mobiles qui permettent aux courtiers d’appeler et de texter depuis le numéro de l’agence.',
        'Lignes d’équipe et de bureau avec groupes de sonnerie pour que quelqu’un réponde toujours au prospect.',
        'Lignes d’immeuble et hors des heures qui acheminent les appels urgents de locataires au bon contact de garde.',
      ),
      ccaas: sv(
        'Transformez un déluge de demandes en entonnoir géré',
        'Une nouvelle inscription ou une vague de froid déclenche une ruée d’appels. Une couche de centre de contact met en file, qualifie et distribue les demandes entrantes pour qu’aucune ne soit perdue et qu’aucun courtier ne soit submergé.',
        'Acheminement des prospects par secteur, fourchette de prix ou langue vers le courtier le mieux placé.',
        'Lignes d’urgence et courantes pour la gestion immobilière, avec rapports de niveau de service pour les propriétaires.',
        'Suivi de la source des appels qui montre quelles publicités et pancartes font réellement sonner le téléphone.',
      ),
      cloudMigration: sv(
        'Dossiers de transaction et registres d’immeubles au même endroit sûr',
        'Transactions, baux, rapports d’inspection et plans d’immeubles s’accumulent sur des portables et dans des boîtes courriel. Nous les consolidons dans des systèmes infonuagiques sécurisés avec structure et reprise appropriées.',
        'Stockage des documents de transactions et de baux organisé par propriété et par client.',
        'Intégration sécurisée du CRM, des inscriptions, de la comptabilité et de la gestion immobilière.',
        'Sauvegarde et reprise qui protègent des années d’historique d’immeubles et de clients.',
      ),
      automation: sv(
        'Relancez chaque prospect, pour toujours, sans lever le petit doigt',
        'Séquences de maturation, commentaires de visite, renouvellements de baux et mises à jour d’entretien sont répétables. Nous les automatisons pour que votre entonnoir et vos locataires entendent parler de vous au bon moment.',
        'Séquences de maturation qui gardent au chaud les acheteurs à long terme jusqu’à ce qu’ils soient prêts.',
        'Flux de renouvellement de bail et de rappel de loyer qui réduisent retards de paiement et périodes de vacance.',
        'Mises à jour de bons de travail envoyées aux locataires et propriétaires à mesure que l’entretien avance.',
      ),
      visibility: sv(
        'Soyez le courtier ou le gestionnaire que les chercheurs locaux trouvent d’abord',
        'Acheteurs, vendeurs et locataires commencent par la recherche et les cartes. Nous bâtissons une présence par quartier, des avis et du contenu d’inscription qui font ressortir votre nom dans la recherche et les réponses IA.',
        'Pages de quartiers et de mises à jour du marché qui démontrent l’expertise locale.',
        'Fiche Google et programmes d’avis qui bâtissent une preuve sociale récente.',
        'Données d’inscriptions et de propriétés structurées que moteurs et assistants peuvent lire.',
      ),
      websites: sv(
        'Un site qui transforme les visiteurs en visites réservées',
        'Nous concevons des sites immobiliers avec recherche rapide, inscriptions claires et un parcours évident pour réserver une visite, demander une évaluation ou soumettre une demande de service.',
        'Pages d’inscriptions et filtres qui se chargent vite sur mobile, là où se font la plupart des recherches.',
        'Formulaires d’évaluation et de demande de visite qui qualifient sans friction.',
        'Portails locataires et pages de demandes de service qui réduisent les appels entrants au bureau.',
      ),
    },
  },
  veterinary: {
    blurb: 'Appels de propriétaires, rappels et urgences pour hôpitaux et cliniques vétérinaires.',
    metaTitle: 'Technologie pour les cliniques et hôpitaux vétérinaires | Roalla',
    metaDescription:
      'Réception IA vétérinaire, dossiers clients sécurisés, communications de clinique, centre de contact, systèmes de pratique infonuagiques, automatisation, visibilité locale et sites web pour vétérinaires.',
    heroTitle: 'Une réception qui ne manque jamais un propriétaire inquiet',
    heroLead:
      'Les équipes vétérinaires soignent les animaux pendant que le téléphone sonne : réservations, renouvellements d’ordonnances, propriétaires paniqués. Roalla aide les cliniques à répondre vite, à trier correctement et à garder les rappels en marche, pour que le personnel clinique reste auprès des patients.',
    pressuresTitle: 'Ce qui étire trop mince une équipe vétérinaire',
    pressures: [
      'Des téléphones qui sonnent pendant les interventions et laissent les propriétaires sans réponse',
      'Des urgences à distinguer des appels courants en quelques secondes',
      'Des rappels de vaccins et de soins dentaires manqués qui coûtent en soins comme en revenus',
      'L’épuisement du personnel devant l’intensité émotive et le volume des appels quotidiens',
    ],
    closerTitle: 'Gardez l’équipe auprès des animaux, pas au téléphone',
    closerLead:
      'Dites-nous comment fonctionnent appels et rappels dans votre clinique aujourd’hui. Nous montrerons où un meilleur triage et l’automatisation allègent la charge.',
    s: {
      aiEmployee: sv(
        'Appels de propriétaires répondus, patients réservés, urgences escaladées',
        'L’Employé IA répond à chaque appel de propriétaire, réserve le bon type de visite, traite les demandes courantes et escalade les vraies urgences, pendant que le jugement clinique reste à votre équipe vétérinaire.',
        'Réservation selon l’espèce, le type de visite et le vétérinaire, y compris hors des heures.',
        'Questions de triage d’urgence qui dirigent les cas urgents vers l’équipe de garde ou l’hôpital d’urgence le plus proche.',
        'Demandes de renouvellement, de dossier et d’estimation saisies et mises en file pour le personnel sans interrompre les traitements.',
      ),
      security: sv(
        'Protégez les dossiers clients, les paiements et les systèmes de la clinique',
        'Les systèmes de gestion de pratique contiennent coordonnées des propriétaires, données de paiement et registres de substances contrôlées. Nous sécurisons systèmes et processus pour qu’un incident informatique ne ferme pas la clinique.',
        'Contrôles d’accès et pistes d’audit pour le logiciel de pratique et les registres de substances contrôlées.',
        'Protections des cartes de paiement et formation à l’hameçonnage pour la réception et le personnel clinique.',
        'Plans de sauvegarde et de reprise qui gardent l’historique des patients accessible pendant une panne.',
      ),
      ucaas: sv(
        'Des téléphones fiables entre cliniques et équipes de garde',
        'Les groupes multicliniques et les vétérinaires de garde ont besoin d’un acheminement constant des appels. Les communications unifiées offrent appels fiables, messagerie sécurisée et annuaires partagés entre les sites.',
        'Parcours d’appel qui séparent rendez-vous, pharmacie et urgences dès le premier choix.',
        'Lignes partagées entre les sites du groupe pour qu’une clinique débordée soit secondée par une autre.',
        'Messagerie sécurisée pour le personnel qui remplace les textos personnels sur les patients et propriétaires.',
      ),
      ccaas: sv(
        'Absorbez la ruée du lundi matin et des urgences',
        'Les équipes de réception subissent des vagues après les fins de semaine et pendant les campagnes de vaccination saisonnières. Une couche de centre de contact met les appels en file, offre le rappel et donne aux dirigeants des données sur la demande manquée.',
        'Rappels qui préservent la place de l’appelant sans l’obliger à attendre en ligne.',
        'Voies prioritaires pour les appels d’urgence et les contacts de cliniques référentes.',
        'Rapports sur les pointes d’appels pour planifier réalistement la dotation de la réception.',
      ),
      cloudMigration: sv(
        'Des systèmes de pratique disponibles et récupérables',
        'Les serveurs sur place et les postes d’imagerie sont des points de défaillance uniques. Nous aidons les cliniques à migrer vers des plateformes résilientes avec reprise testée et accès à distance sécurisé.',
        'Données de gestion de pratique et d’imagerie migrées avec un minimum de perturbation pour la clinique.',
        'Conception du réseau et du Wi-Fi pour les salles de traitement, l’imagerie et les bornes de plans de santé.',
        'Plans de reprise qui rétablissent rapidement dossiers et horaires après une panne matérielle ou un rançongiciel.',
      ),
      automation: sv(
        'Des rappels et suivis qui s’exécutent seuls',
        'Dates de vaccins, suivis postopératoires et renouvellements de plans de santé favorisent de meilleurs soins et des revenus stables. Nous les automatisons sur un ton personnel et attentionné.',
        'Cycles de rappel pour vaccins, soins dentaires et examens annuels selon les dossiers des patients.',
        'Suivis après visite qui détectent tôt les problèmes et encouragent la réservation d’un contrôle.',
        'Flux de plans de santé et de recontrôle qui réduisent les lacunes et le suivi manuel.',
      ),
      visibility: sv(
        'Soyez la clinique que les propriétaires d’animaux du coin cherchent et en qui ils ont confiance',
        'Les propriétaires cherchent un vétérinaire à proximité, une clinique d’urgence ou un spécialiste, souvent par une nuit stressante. Nous rendons votre clinique facile à trouver, avec des heures exactes et un contenu honnête et utile.',
        'Fiches Google avec heures, services et consignes d’urgence à jour.',
        'Pages de services par espèce, dentisterie, chirurgie et soins aux animaux âgés.',
        'Programmes d’avis qui valorisent votre équipe et renforcent la confiance.',
      ),
      websites: sv(
        'Un site aussi chaleureux que votre salle d’attente',
        'Nous concevons des sites de cliniques qui présentent votre équipe, expliquent les services et rendent la réservation, les renouvellements et l’information d’urgence faciles à trouver pour les propriétaires.',
        'Réservation en ligne et formulaires de renouvellement qui réduisent les appels entrants.',
        'Consignes d’urgence claires et coordonnées hors des heures sur chaque page.',
        'Pages d’équipe et ressources sur les soins aux animaux qui font sentir un nouveau client chez lui.',
      ),
    },
  },
  'insurance-brokerage': {
    blurb: 'Demandes de soumission, renouvellements et réclamations, sans conseil non autorisé.',
    metaTitle: 'Technologie pour les cabinets de courtage d’assurance | Roalla',
    metaDescription:
      'Accueil IA pour soumissions et réclamations, données clients sécurisées, communications de cabinet, centre de contact, systèmes infonuagiques, automatisation, visibilité et sites web pour courtiers d’assurance.',
    heroTitle: 'Transformez chaque demande en soumission et chaque renouvellement en conversation',
    heroLead:
      'Les cabinets de courtage se démarquent par leur réactivité et leur fiabilité, pourtant les conseillers passent des heures en accueil, certificats et paperasse de renouvellement. Roalla libère votre équipe autorisée pour le conseil pendant que la première ligne s’occupe du courant.',
    pressuresTitle: 'Ce qui freine les cabinets de courtage',
    pressures: [
      'Des demandes de soumission qui dorment la nuit ou la fin de semaine, puis filent chez un courtier plus rapide',
      'Des appels de certificats, de modifications de police et de réclamations qui interrompent les conseillers en pleine rencontre',
      'Des données personnelles et financières sensibles qui créent un risque réglementaire et de réputation',
      'Des cycles de renouvellement menés par chiffriers et par mémoire plutôt que par un processus fiable',
    ],
    closerTitle: 'Laissez les conseillers autorisés conseiller',
    closerLead:
      'Dites-nous comment demandes, renouvellements et réclamations parviennent à votre cabinet aujourd’hui. Nous montrerons où la première ligne et l’arrière-guichet peuvent s’améliorer en toute sécurité.',
    s: {
      aiEmployee: sv(
        'Soumissions amorcées et réclamations acheminées à toute heure',
        'L’Employé IA qualifie les nouveaux risques, réserve le temps des conseillers, répond aux questions de police courantes selon des scripts approuvés et achemine les réclamations à la bonne personne, sans donner de conseils non autorisés.',
        'Accueil de soumissions de particuliers et d’entreprises qui saisit les détails dont un conseiller a besoin pour commencer.',
        'Demandes de certificats et de documents de police traitées à partir d’information approuvée.',
        'Premier avis de sinistre saisi et acheminé à l’assureur ou au conseiller, les pertes urgentes étant escaladées immédiatement.',
      ),
      security: sv(
        'Protégez les données personnelles et financières que vos clients vous confient',
        'Les cabinets détiennent identité, biens, santé et paiements dans les portails des assureurs et les systèmes internes. Nous vous aidons à satisfaire les attentes des organismes de réglementation et des assureurs avec de vrais contrôles.',
        'Gouvernance des accès sur les systèmes de gestion de courtage et les multiples portails d’assureurs.',
        'Contrôles de niveau cyberassurance (AMF, protection des terminaux, sauvegarde) que demandent les souscripteurs.',
        'Procédures de vie privée et de réponse aux incidents alignées sur les attentes de l’autorité provinciale et des lois sur la vie privée.',
      ),
      ucaas: sv(
        'Une communication cohérente entre conseillers et bureaux',
        'Les conseillers traitent toute la journée avec clients, assureurs et souscripteurs. Les communications unifiées gardent appels, messages et réunions organisés sur des canaux contrôlés par le cabinet.',
        'Appels et textos d’affaires sous le numéro du cabinet, avec historique d’appels rattaché aux clients.',
        'Réunions vidéo adaptées aux révisions de renouvellement et aux clients à distance.',
        'Options d’enregistrement d’appels qui soutiennent la conformité et la documentation des discussions de conseil.',
      ),
      ccaas: sv(
        'Séparez ventes, service et réclamations dès l’entrée',
        'Prospects, clients existants et réclamants appellent le même numéro avec des besoins très différents. Une couche de centre de contact dirige rapidement chacun vers la bonne équipe.',
        'Files dédiées aux nouvelles affaires, au service des polices et aux réclamations.',
        'Traitement prioritaire des réclamations et des comptes commerciaux de grande valeur.',
        'Rapports qui suivent le temps de réponse et la conversion de l’appel à la soumission.',
      ),
      cloudMigration: sv(
        'Dossiers clients et flux avec les assureurs sur des bases solides',
        'Dossiers de polices, identifiants d’assureurs et documents clients se retrouvent sur des disques et dans des boîtes courriel. Nous consolidons vers des plateformes sécurisées avec accès contrôlé et reprise fiable.',
        'Stockage des documents clients et de polices organisé par compte, branche et date de renouvellement.',
        'Connexions sécurisées entre votre système de gestion de courtage et les outils des assureurs.',
        'Sauvegardes et plans de reprise adaptés à une entreprise soucieuse de la responsabilité professionnelle.',
      ),
      automation: sv(
        'Faites tourner renouvellements et avenants selon un calendrier',
        'Relances de renouvellement, émission de certificats et collecte de documents suivent des étapes prévisibles. Nous les automatisons pour que les conseillers consacrent leur temps à la protection, pas aux relances.',
        'Flux de renouvellement qui démarrent un nombre fixe de jours à l’avance et suivent la réponse de chaque client.',
        'Demandes de certificats et de preuves d’assurance traitées à partir de modèles approuvés.',
        'Rappels de vente croisée et de révision déclenchés par les événements de vie et les anniversaires de police.',
      ),
      visibility: sv(
        'Soyez le courtier que l’on trouve en cherchant une couverture',
        'Ménages et entreprises cherchent par branche, risque et ville avant de choisir un courtier. Nous rendons vos spécialités et votre présence locale visibles dans la recherche et les assistants IA.',
        'Pages par branche : auto, habitation, entreprises et risques spécialisés.',
        'Guides éducatifs qui répondent aux questions de couverture sans basculer dans le conseil.',
        'Présence locale et programmes d’avis qui bâtissent la crédibilité du cabinet.',
      ),
      websites: sv(
        'Un site qui inspire confiance et amorce la soumission',
        'Nous concevons des sites de cabinets qui rendent la couverture compréhensible, présentent vos conseillers et offrent un moyen simple et sécurisé de demander une soumission ou de déclarer un sinistre.',
        'Courts formulaires de soumission adaptés aux assurances de particuliers et d’entreprises.',
        'Pages d’aide aux réclamations qui disent exactement quoi faire en premier.',
        'Profils de conseillers, permis et assureurs partenaires présentés en toute transparence.',
      ),
    },
  },
}
const EN_5: HubDataMap = {
  'immigration-settlement': {
    blurb: 'Multilingual enquiries, file readiness, and sensitive documents handled with care.',
    metaTitle: 'Technology for Immigration & Settlement Services | Roalla',
    metaDescription:
      'AI multilingual enquiry intake, secure identity documents, consultant communications, contact center routing, cloud case files, automation, visibility, and websites for immigration and settlement.',
    heroTitle: 'Welcome every enquiry in the language people are most comfortable in',
    heroLead:
      'Immigration and settlement teams field high volumes of anxious, multilingual enquiries while guarding passports, permits, and personal histories. Roalla helps you respond with clarity, prepare files faster, and protect the people you serve.',
    pressuresTitle: 'What stretches immigration and settlement teams',
    pressures: [
      'Enquiry volumes that spike around policy announcements and deadlines',
      'Clients who need support in several languages, often outside office hours',
      'Passports, permits, and identity documents shared over messaging apps and email',
      'Missing documents that delay applications and drain consultant time',
    ],
    closerTitle: 'Serve more people, with the care each file deserves',
    closerLead:
      'Tell us how enquiries and documents reach your team today. We will show where multilingual access, file readiness, and security can improve together.',
    s: {
      aiEmployee: sv(
        'Enquiries answered in the languages you support',
        'The AI Employee responds to every enquiry, captures case basics, books consultations, and chases missing documents, without ever giving immigration advice, which stays with your regulated consultants.',
        'Multilingual intake that captures program interest, family composition, and timing for consultant review.',
        'Consultation booking and reminders that cut no-shows and long email chains.',
        'Document checklists with automatic reminders, so files arrive complete.',
      ),
      security: sv(
        'Protect passports, permits, and personal histories',
        'Immigration files contain some of the most sensitive identity information a business can hold. We help organizations apply the controls vulnerable clients deserve.',
        'Encrypted portals for identity and supporting documents, replacing messaging-app attachments.',
        'Access limited by case and role, with logs showing who opened which file.',
        'Fraud and scam awareness, including fake-consultant impersonation that targets newcomers.',
      ),
      ucaas: sv(
        'Communication that reaches clients where they are',
        'Clients reach out by phone, messaging apps, and video from different time zones. Unified communications give consultants a professional, consistent way to meet those needs.',
        'Calling and video from firm numbers, suited to clients overseas and across time zones.',
        'Team directories and shared lines so no enquiry depends on one consultant being available.',
        'Call recording options that support documentation of what was and was not advised.',
      ),
      ccaas: sv(
        'Manage enquiry surges and language routing',
        'Policy changes and intake windows drive waves of calls. A contact center layer routes by language and enquiry type and keeps response times visible.',
        'Language-based queues so callers reach someone who speaks theirs.',
        'Separate paths for new enquiries, existing files, and document submissions.',
        'Surge reports that justify seasonal staffing and highlight common questions.',
      ),
      cloudMigration: sv(
        'Case files that are organized, secure, and portable',
        'Shared drives, email threads, and scanned PDFs make case files hard to trust. We migrate to structured cloud case management with strong permissions and backup.',
        'Case folders structured by client, application, and status.',
        'Document storage and retention aligned with regulatory and privacy obligations.',
        'Continuity planning so a lost laptop or failed drive never costs a client’s file.',
      ),
      automation: sv(
        'Get files ready faster with less back-and-forth',
        'Document collection, form pre-fill, and status updates repeat across every case. We automate them so consultants review complete files instead of chasing pieces.',
        'Intake data flowing automatically into case records and forms.',
        'Status-update messages to clients in their preferred language.',
        'Deadline and expiry reminders that protect permits from lapsing.',
      ),
      visibility: sv(
        'Be found by newcomers searching in their own words',
        'People research immigration and settlement help in many languages and often through AI assistants. We build clear, credible content that helps the right clients find a regulated provider.',
        'Multilingual pages for programs, eligibility basics, and settlement services.',
        'Clear display of regulator credentials so clients can verify who they are speaking to.',
        'Local and community presence that builds trust in newcomer networks.',
      ),
      websites: sv(
        'A website that feels welcoming and credible from the first click',
        'We design clear, accessible, multilingual websites that explain services honestly, show credentials, and make booking or document upload feel safe.',
        'Language switching and plain wording suited to a wide range of readers.',
        'Secure upload and booking built into the site.',
        'Transparent service and fee information that protects against scams.',
      ),
    },
  },
  'home-care-seniors': {
    blurb: 'Family enquiries, care scheduling, and urgent client needs handled with dignity.',
    metaTitle: 'Technology for Home Care & Senior Services | Roalla',
    metaDescription:
      'AI family and scheduling desk, secure client records, caregiver communications, contact center routing, cloud systems, automation, visibility, and websites for home care providers.',
    heroTitle: 'Support families and caregivers with calm, reliable answers',
    heroLead:
      'Home care coordinators balance worried families, shifting schedules, and caregivers on the road. Roalla helps agencies answer quickly, coordinate visits, and escalate urgent needs, while keeping a human in charge of care.',
    pressuresTitle: 'What overloads home care coordinators',
    pressures: [
      'Families calling anxiously for assessments, updates, or last-minute changes',
      'Caregiver call-outs and schedule changes that need immediate coverage',
      'Care notes and client details spread across paper, phones, and group chats',
      'Recruiting and retaining caregivers in a tight labour market',
    ],
    closerTitle: 'Keep care human by lightening the paperwork around it',
    closerLead:
      'Tell us how families, clients, and caregivers contact your agency today. We will show where coordination and communication can ease without losing the personal touch.',
    s: {
      aiEmployee: sv(
        'Families answered with warmth, coordinators freed for care',
        'The AI Employee answers family enquiries, books assessments, coordinates visit changes, and escalates urgent client needs, with dignity and a clear handoff to a human coordinator.',
        'Assessment booking that gathers care needs, location, and preferred timing.',
        'Visit change and cancellation handling that triggers coverage workflows for coordinators.',
        'Urgent concerns, such as a missed visit or a client who is unwell, escalated to on-call staff at once.',
      ),
      security: sv(
        'Protect vulnerable clients, their homes, and their health data',
        'Care agencies hold health information, home addresses, and entry details for people who rely on them. We secure the devices and systems that carry that trust.',
        'Mobile device management for caregiver phones and tablets, including remote wipe.',
        'Controlled access to care plans, keys, and entry codes by role.',
        'Privacy training and incident planning aligned with provincial health-information rules.',
      ),
      ucaas: sv(
        'Phones and messaging that reach caregivers on the move',
        'Coordinators need to reach caregivers fast, and families need a number that always works. Unified communications deliver both, on business numbers, with mobile apps for field staff.',
        'Caregiver messaging on company-managed apps rather than personal chats.',
        'After-hours lines that route urgent calls to an on-call coordinator.',
        'Click-to-call and shared lines so families always reach a real person.',
      ),
      ccaas: sv(
        'A coordination line built for busy mornings and sick calls',
        'Early-morning call-outs and weekend changes overwhelm a small office. A contact center layer separates family, client, and caregiver calls and gives coordinators clear priorities.',
        'Dedicated queues for caregiver call-outs, family enquiries, and new referrals.',
        'Priority routing for urgent client-safety calls.',
        'Reports on peak times so coordination staffing matches real demand.',
      ),
      cloudMigration: sv(
        'Care records and schedules that are safe and always reachable',
        'Paper care notes and spreadsheet schedules are fragile. We help agencies move to secure scheduling and care-documentation systems with reliable access in the field.',
        'Scheduling and care-note tools that work on caregivers’ phones, even with poor coverage.',
        'Secure storage for assessments, care plans, and consent documents.',
        'Backup and recovery that protect continuity of care when systems fail.',
      ),
      automation: sv(
        'Fewer manual updates between visits',
        'Visit confirmations, schedule changes, and family updates follow repeatable patterns. We automate them with plain, caring wording while coordinators focus on the exceptions.',
        'Visit confirmations and arrival notifications for clients and families.',
        'Automatic caregiver shift-offer messages when a visit needs coverage.',
        'Care-plan review and reassessment reminders on a defined schedule.',
      ),
      visibility: sv(
        'Be the agency families find when they need help most',
        'Adult children often search late at night for care options for a parent. We make your services, areas, and approach easy to find and easy to trust.',
        'Service pages that explain levels of care, from companionship to personal support.',
        'Local presence by community, with accurate service-area information.',
        'Helpful family guides that earn trust and citations in AI answers.',
      ),
      websites: sv(
        'A website that reassures families and attracts caregivers',
        'We design warm, accessible websites that explain care options plainly, make requesting an assessment easy, and give potential caregivers a clear path to apply.',
        'Large, readable text and simple navigation suited to older visitors.',
        'A short assessment-request form that respects the family’s urgency.',
        'A caregiver-careers section that helps recruitment alongside client enquiries.',
      ),
    },
  },
  'municipal-public': {
    blurb: 'Resident requests, counter support, and accountable public service delivery.',
    metaTitle: 'Technology for Municipal & Public Service Organizations | Roalla',
    metaDescription:
      'AI resident service desk, public-sector security, unified communications, contact center routing, cloud modernization, automation, visibility, and accessible websites for municipalities.',
    heroTitle: 'Answer residents quickly while keeping every decision accountable',
    heroLead:
      'Municipalities and public bodies serve residents across phone, counter, email, and web, with limited staff and high expectations for transparency. Roalla helps you route requests, secure public systems, and make services easier to find.',
    pressuresTitle: 'What stretches public service teams',
    pressures: [
      'Routine questions about permits, waste, and facilities flooding the same few staff',
      'Service requests passed between departments without a clear owner or status',
      'Public-sector targets for ransomware, with essential services at stake',
      'Websites and notices that residents cannot easily search or access',
    ],
    closerTitle: 'Make public service easier to reach and easier to trust',
    closerLead:
      'Tell us how residents contact your organization today. We will show where routing, security, and clearer information can lighten the load for staff and residents alike.',
    s: {
      aiEmployee: sv(
        'Resident questions answered and requests routed with a full summary',
        'The AI Employee answers routine resident questions, takes service requests, books appointments, and routes complex matters to the right department with a complete summary.',
        'Answers to common questions on collection schedules, permits, and facility hours from approved content.',
        'Service requests, such as potholes and bylaw concerns, captured with location and details.',
        'Complex or sensitive matters passed to the correct department with a clear record.',
      ),
      security: sv(
        'Defend essential services from ransomware and data loss',
        'Municipal systems support water, permits, payments, and emergency coordination. We help public bodies reduce risk and recover quickly when incidents happen.',
        'Segmentation and monitoring that protect critical operational systems from office-network threats.',
        'Resident-data governance aligned with municipal privacy and access-to-information obligations.',
        'Tested incident plans and tabletop exercises for council and senior staff.',
      ),
      ucaas: sv(
        'One connected network of offices, depots, and facilities',
        'Town halls, libraries, depots, and arenas need to operate as one organization. Unified communications deliver consistent calling, directories, and messaging across all sites.',
        'Single directory and calling across civic buildings and remote facilities.',
        'Mobile and softphone options for field and public-works staff.',
        'Resilient voice for emergency coordination and after-hours service.',
      ),
      ccaas: sv(
        'A resident contact center that shows what residents need',
        'A shared contact layer ensures every call and request finds the right department and leaves a trail. Leaders see what residents ask about most.',
        'Department and topic-based routing with callbacks during seasonal peaks.',
        'Multilingual and accessibility-conscious call handling for diverse communities.',
        'Reporting that turns resident demand into planning and budget evidence.',
      ),
      cloudMigration: sv(
        'Modernize legacy systems without disrupting service',
        'Aged servers and bespoke applications are costly to maintain and risky to leave. We plan phased moves that protect continuity, records retention, and public trust.',
        'Phased migration of file, permit, and finance systems with rollback plans.',
        'Records management aligned with retention schedules and public-access requests.',
        'Cost and sustainability analysis that supports a council business case.',
      ),
      automation: sv(
        'Fewer hand-offs between residents and the right department',
        'Permits, licences, and service requests pass through many hands. We automate intake, routing, and status updates so residents see progress and staff see priorities.',
        'Online request workflows that route to the right department automatically.',
        'Status notifications to residents as a request moves through each step.',
        'Renewal and deadline reminders for licences and recurring permits.',
      ),
      visibility: sv(
        'Make public information easy to find',
        'Residents search for services before they call. We structure municipal content so search engines and AI assistants return accurate, current answers, not outdated notices.',
        'Service-led content structure that mirrors how residents describe their needs.',
        'Accurate facility, hours, and contact data across maps and directories.',
        'Notice and alert content structured so it is surfaced quickly in search.',
      ),
      websites: sv(
        'An accessible website that reduces counter and call volume',
        'We design municipal websites that meet accessibility standards, support multiple languages, and make the most common transactions simple to complete online.',
        'Accessible, plain-language design that meets recognized web accessibility standards.',
        'Task-based navigation for payments, permits, requests, and reports.',
        'Clear emergency, closure, and service-disruption notices that stay current.',
      ),
    },
  },
}
const FR_5: HubDataMap = {
  'immigration-settlement': {
    blurb: 'Demandes multilingues, préparation de dossiers et documents sensibles traités avec soin.',
    metaTitle: 'Technologie pour les services d’immigration et d’établissement | Roalla',
    metaDescription:
      'Accueil IA multilingue, pièces d’identité sécurisées, communications de consultants, centre de contact, dossiers infonuagiques, automatisation, visibilité et sites web pour l’immigration et l’établissement.',
    heroTitle: 'Accueillez chaque demande dans la langue où la personne est le plus à l’aise',
    heroLead:
      'Les équipes d’immigration et d’établissement reçoivent de gros volumes de demandes anxieuses et multilingues tout en protégeant passeports, permis et parcours personnels. Roalla vous aide à répondre avec clarté, à préparer les dossiers plus vite et à protéger les personnes que vous servez.',
    pressuresTitle: 'Ce qui étire les équipes d’immigration et d’établissement',
    pressures: [
      'Des volumes de demandes qui bondissent autour des annonces de politique et des échéances',
      'Des clients qui ont besoin de soutien en plusieurs langues, souvent en dehors des heures de bureau',
      'Passeports, permis et pièces d’identité échangés par applis de messagerie et courriel',
      'Des documents manquants qui retardent les demandes et épuisent le temps des consultants',
    ],
    closerTitle: 'Servez plus de personnes, avec le soin que mérite chaque dossier',
    closerLead:
      'Dites-nous comment demandes et documents parviennent à votre équipe aujourd’hui. Nous montrerons où l’accès multilingue, la préparation des dossiers et la sécurité peuvent progresser ensemble.',
    s: {
      aiEmployee: sv(
        'Demandes traitées dans les langues que vous soutenez',
        'L’Employé IA répond à chaque demande, saisit les bases du dossier, réserve les consultations et relance les documents manquants, sans jamais donner de conseils d’immigration, qui restent la responsabilité de vos consultants réglementés.',
        'Accueil multilingue qui saisit programme visé, composition familiale et échéancier pour révision par le consultant.',
        'Réservation de consultations et rappels qui réduisent les absences et les longues chaînes de courriels.',
        'Listes de documents avec rappels automatiques, pour que les dossiers arrivent complets.',
      ),
      security: sv(
        'Protégez passeports, permis et parcours personnels',
        'Les dossiers d’immigration contiennent certaines des informations d’identité les plus sensibles qu’une organisation puisse détenir. Nous aidons les organisations à appliquer les contrôles que méritent des clients vulnérables.',
        'Portails chiffrés pour pièces d’identité et pièces justificatives, à la place des pièces jointes d’applis de messagerie.',
        'Accès limité par dossier et par rôle, avec journaux indiquant qui a ouvert quel dossier.',
        'Sensibilisation aux fraudes, dont l’usurpation de faux consultants qui ciblent les nouveaux arrivants.',
      ),
      ucaas: sv(
        'Une communication qui rejoint les clients là où ils sont',
        'Les clients contactent par téléphone, applis de messagerie et vidéo depuis divers fuseaux horaires. Les communications unifiées donnent aux consultants une façon professionnelle et cohérente de répondre à ces besoins.',
        'Appels et vidéo depuis les numéros du cabinet, adaptés aux clients à l’étranger et à travers les fuseaux horaires.',
        'Annuaires d’équipe et lignes partagées pour qu’aucune demande ne dépende de la disponibilité d’un seul consultant.',
        'Options d’enregistrement d’appels qui soutiennent la documentation de ce qui a été conseillé ou non.',
      ),
      ccaas: sv(
        'Gérez les pointes de demandes et l’acheminement par langue',
        'Les changements de politique et les périodes d’admission provoquent des vagues d’appels. Une couche de centre de contact achemine par langue et type de demande et garde les temps de réponse visibles.',
        'Files par langue pour que les appelants joignent quelqu’un qui parle la leur.',
        'Parcours distincts pour nouvelles demandes, dossiers existants et dépôts de documents.',
        'Rapports de pointes qui justifient la dotation saisonnière et mettent en lumière les questions courantes.',
      ),
      cloudMigration: sv(
        'Des dossiers organisés, sécurisés et portables',
        'Lecteurs partagés, fils de courriels et PDF numérisés rendent les dossiers difficiles à fiabiliser. Nous migrons vers une gestion de dossiers infonuagique structurée avec permissions solides et sauvegarde.',
        'Dossiers structurés par client, demande et état d’avancement.',
        'Stockage et conservation des documents alignés sur les obligations réglementaires et de vie privée.',
        'Planification de la continuité pour qu’un portable perdu ou un disque défaillant ne coûte jamais le dossier d’un client.',
      ),
      automation: sv(
        'Préparez les dossiers plus vite avec moins d’allers-retours',
        'Collecte de documents, préremplissage de formulaires et mises à jour de statut se répètent dans chaque dossier. Nous les automatisons pour que les consultants révisent des dossiers complets au lieu de courir après les pièces.',
        'Données d’accueil qui alimentent automatiquement dossiers et formulaires.',
        'Messages de mise à jour aux clients dans leur langue préférée.',
        'Rappels d’échéances et d’expiration qui protègent les permis contre l’échéance.',
      ),
      visibility: sv(
        'Soyez trouvé par les nouveaux arrivants qui cherchent avec leurs propres mots',
        'Les gens cherchent de l’aide en immigration et en établissement dans plusieurs langues, souvent par des assistants IA. Nous bâtissons un contenu clair et crédible qui aide les bons clients à trouver un fournisseur réglementé.',
        'Pages multilingues sur les programmes, les notions d’admissibilité et les services d’établissement.',
        'Affichage clair des titres délivrés par l’organisme de réglementation pour que les clients vérifient à qui ils parlent.',
        'Présence locale et communautaire qui bâtit la confiance dans les réseaux de nouveaux arrivants.',
      ),
      websites: sv(
        'Un site accueillant et crédible dès le premier clic',
        'Nous concevons des sites clairs, accessibles et multilingues qui expliquent honnêtement les services, montrent les titres professionnels et rendent la réservation ou le dépôt de documents rassurants.',
        'Changement de langue et formulations simples adaptés à un large éventail de lecteurs.',
        'Dépôt sécurisé et réservation intégrés au site.',
        'Information transparente sur les services et les honoraires qui protège contre les fraudes.',
      ),
    },
  },
  'home-care-seniors': {
    blurb: 'Demandes des familles, planification des soins et besoins urgents traités avec dignité.',
    metaTitle: 'Technologie pour les soins à domicile et les services aux aînés | Roalla',
    metaDescription:
      'Bureau IA des familles et de la planification, dossiers clients sécurisés, communications avec les intervenants, centre de contact, systèmes infonuagiques, automatisation, visibilité et sites web pour fournisseurs de soins à domicile.',
    heroTitle: 'Soutenez familles et intervenants avec des réponses calmes et fiables',
    heroLead:
      'Les coordonnateurs de soins à domicile jonglent entre familles inquiètes, horaires changeants et intervenants sur la route. Roalla aide les agences à répondre vite, à coordonner les visites et à escalader les besoins urgents, en gardant un humain aux commandes des soins.',
    pressuresTitle: 'Ce qui surcharge les coordonnateurs de soins à domicile',
    pressures: [
      'Des familles qui appellent avec anxiété pour des évaluations, des nouvelles ou des changements de dernière minute',
      'Des absences d’intervenants et des changements d’horaire qui exigent un remplacement immédiat',
      'Notes de soins et renseignements sur les clients éparpillés entre papier, téléphones et clavardages de groupe',
      'Le recrutement et la rétention des intervenants dans un marché du travail tendu',
    ],
    closerTitle: 'Gardez les soins humains en allégeant la paperasse qui les entoure',
    closerLead:
      'Dites-nous comment familles, clients et intervenants joignent votre agence aujourd’hui. Nous montrerons où la coordination et la communication peuvent s’alléger sans perdre la touche personnelle.',
    s: {
      aiEmployee: sv(
        'Des familles accueillies avec chaleur, des coordonnateurs libérés pour les soins',
        'L’Employé IA répond aux demandes des familles, réserve les évaluations, coordonne les changements de visite et escalade les besoins urgents des clients, avec dignité et un transfert clair à un coordonnateur humain.',
        'Réservation d’évaluations qui recueille besoins de soins, lieu et moment souhaité.',
        'Gestion des changements et annulations de visite qui déclenche les flux de remplacement pour les coordonnateurs.',
        'Préoccupations urgentes, comme une visite manquée ou un client indisposé, escaladées sur-le-champ au personnel de garde.',
      ),
      security: sv(
        'Protégez les clients vulnérables, leur domicile et leurs données de santé',
        'Les agences de soins détiennent renseignements de santé, adresses et détails d’accès de personnes qui dépendent d’elles. Nous sécurisons les appareils et systèmes qui portent cette confiance.',
        'Gestion des appareils mobiles pour les téléphones et tablettes des intervenants, avec effacement à distance.',
        'Accès contrôlé par rôle aux plans de soins, clés et codes d’entrée.',
        'Formation à la vie privée et plan d’incident alignés sur les règles provinciales sur les renseignements de santé.',
      ),
      ucaas: sv(
        'Téléphones et messagerie qui joignent les intervenants en déplacement',
        'Les coordonnateurs doivent joindre vite les intervenants, et les familles ont besoin d’un numéro qui fonctionne toujours. Les communications unifiées offrent les deux, sous des numéros d’affaires, avec applis mobiles pour le personnel sur le terrain.',
        'Messagerie des intervenants sur des applis gérées par l’entreprise plutôt que des clavardages personnels.',
        'Lignes hors des heures qui acheminent les appels urgents à un coordonnateur de garde.',
        'Appel en un clic et lignes partagées pour que les familles joignent toujours une vraie personne.',
      ),
      ccaas: sv(
        'Une ligne de coordination conçue pour les matins chargés et les absences',
        'Les absences tôt le matin et les changements de fin de semaine submergent un petit bureau. Une couche de centre de contact sépare appels de familles, de clients et d’intervenants et donne aux coordonnateurs des priorités claires.',
        'Files dédiées aux absences d’intervenants, aux demandes de familles et aux nouvelles références.',
        'Acheminement prioritaire des appels touchant la sécurité d’un client.',
        'Rapports sur les heures de pointe pour que la dotation de coordination corresponde à la demande réelle.',
      ),
      cloudMigration: sv(
        'Des dossiers de soins et horaires sûrs et toujours accessibles',
        'Les notes de soins papier et les horaires en chiffrier sont fragiles. Nous aidons les agences à migrer vers des systèmes sécurisés de planification et de documentation des soins, accessibles sur le terrain.',
        'Outils de planification et de notes de soins qui fonctionnent sur le téléphone des intervenants, même avec une mauvaise couverture.',
        'Stockage sécurisé des évaluations, plans de soins et documents de consentement.',
        'Sauvegarde et reprise qui protègent la continuité des soins quand les systèmes tombent.',
      ),
      automation: sv(
        'Moins de mises à jour manuelles entre les visites',
        'Confirmations de visite, changements d’horaire et nouvelles aux familles suivent des schémas répétables. Nous les automatisons avec des mots simples et attentionnés pendant que les coordonnateurs se concentrent sur les exceptions.',
        'Confirmations de visite et avis d’arrivée pour les clients et les familles.',
        'Messages automatiques d’offre de quart aux intervenants quand une visite nécessite un remplacement.',
        'Rappels de révision des plans de soins et de réévaluation selon un calendrier défini.',
      ),
      visibility: sv(
        'Soyez l’agence que les familles trouvent quand elles en ont le plus besoin',
        'Les enfants adultes cherchent souvent tard le soir des options de soins pour un parent. Nous rendons vos services, vos territoires et votre approche faciles à trouver et faciles à croire.',
        'Pages de services qui expliquent les niveaux de soins, de la compagnie au soutien personnel.',
        'Présence locale par communauté, avec information exacte sur les zones desservies.',
        'Guides utiles pour les familles qui méritent confiance et citations dans les réponses IA.',
      ),
      websites: sv(
        'Un site qui rassure les familles et attire les intervenants',
        'Nous concevons des sites chaleureux et accessibles qui expliquent simplement les options de soins, facilitent la demande d’évaluation et offrent aux futurs intervenants un parcours clair pour postuler.',
        'Texte grand et lisible et navigation simple adaptés aux visiteurs plus âgés.',
        'Un court formulaire de demande d’évaluation qui respecte l’urgence de la famille.',
        'Une section carrières pour intervenants qui soutient le recrutement en plus des demandes de clients.',
      ),
    },
  },
  'municipal-public': {
    blurb: 'Demandes des résidents, soutien au comptoir et prestation de services publics responsable.',
    metaTitle: 'Technologie pour les municipalités et organismes publics | Roalla',
    metaDescription:
      'Bureau IA des services aux résidents, sécurité du secteur public, communications unifiées, centre de contact, modernisation infonuagique, automatisation, visibilité et sites web accessibles pour municipalités.',
    heroTitle: 'Répondez rapidement aux résidents tout en gardant chaque décision redevable',
    heroLead:
      'Les municipalités et organismes publics servent les résidents par téléphone, au comptoir, par courriel et en ligne, avec un personnel limité et de fortes attentes de transparence. Roalla vous aide à acheminer les demandes, à sécuriser les systèmes publics et à faciliter l’accès aux services.',
    pressuresTitle: 'Ce qui étire les équipes de services publics',
    pressures: [
      'Des questions courantes sur les permis, les déchets et les installations qui inondent les mêmes quelques employés',
      'Des demandes de service qui circulent entre services sans responsable ni statut clairs',
      'Des cibles de choix pour les rançongiciels dans le secteur public, avec des services essentiels en jeu',
      'Des sites web et avis que les résidents ne peuvent ni chercher ni consulter facilement',
    ],
    closerTitle: 'Rendez le service public plus facile à joindre et plus digne de confiance',
    closerLead:
      'Dites-nous comment les résidents joignent votre organisation aujourd’hui. Nous montrerons où l’acheminement, la sécurité et une information plus claire peuvent alléger la charge du personnel comme des résidents.',
    s: {
      aiEmployee: sv(
        'Questions des résidents répondues et demandes acheminées avec un résumé complet',
        'L’Employé IA répond aux questions courantes des résidents, prend les demandes de service, réserve des rendez-vous et achemine les dossiers complexes au bon service avec un résumé complet.',
        'Réponses aux questions courantes sur les horaires de collecte, les permis et les heures des installations à partir de contenu approuvé.',
        'Demandes de service, comme les nids-de-poule et les préoccupations réglementaires, saisies avec lieu et détails.',
        'Dossiers complexes ou sensibles transmis au bon service avec un historique clair.',
      ),
      security: sv(
        'Défendez les services essentiels contre les rançongiciels et la perte de données',
        'Les systèmes municipaux soutiennent l’eau, les permis, les paiements et la coordination d’urgence. Nous aidons les organismes publics à réduire le risque et à se rétablir rapidement en cas d’incident.',
        'Segmentation et surveillance qui protègent les systèmes opérationnels critiques des menaces du réseau de bureau.',
        'Gouvernance des données des résidents alignée sur les obligations municipales de protection des renseignements et d’accès à l’information.',
        'Plans d’incident testés et exercices sur table pour le conseil et la haute direction.',
      ),
      ucaas: sv(
        'Un réseau connecté de bureaux, de garages et d’installations',
        'Hôtels de ville, bibliothèques, garages municipaux et arénas doivent fonctionner comme une seule organisation. Les communications unifiées offrent appels, annuaires et messagerie cohérents sur tous les sites.',
        'Annuaire et appels uniques entre les bâtiments municipaux et les installations éloignées.',
        'Options mobiles et logicielles pour le personnel de terrain et des travaux publics.',
        'Voix résiliente pour la coordination d’urgence et le service hors des heures.',
      ),
      ccaas: sv(
        'Un centre de contact des résidents qui révèle leurs besoins',
        'Une couche de contact commune assure que chaque appel et chaque demande trouvent le bon service et laissent une trace. Les dirigeants voient ce que les résidents demandent le plus.',
        'Acheminement par service et par sujet avec rappels pendant les pointes saisonnières.',
        'Traitement des appels multilingue et attentif à l’accessibilité pour des collectivités diversifiées.',
        'Rapports qui transforment la demande des résidents en données de planification et de budget.',
      ),
      cloudMigration: sv(
        'Modernisez les systèmes patrimoniaux sans perturber le service',
        'Les serveurs vieillissants et les applications sur mesure coûtent cher à maintenir et sont risqués à laisser en place. Nous planifions des migrations par phases qui protègent la continuité, la conservation des documents et la confiance du public.',
        'Migration par phases des systèmes de fichiers, de permis et de finances avec plans de retour arrière.',
        'Gestion des documents alignée sur les calendriers de conservation et les demandes d’accès du public.',
        'Analyse des coûts et de la durabilité qui appuie un dossier d’affaires pour le conseil.',
      ),
      automation: sv(
        'Moins de transferts entre les résidents et le bon service',
        'Permis, licences et demandes de service passent entre de nombreuses mains. Nous automatisons la réception, l’acheminement et les mises à jour de statut pour que les résidents voient l’avancement et le personnel les priorités.',
        'Flux de demandes en ligne qui acheminent automatiquement au bon service.',
        'Avis de statut aux résidents à mesure que la demande franchit chaque étape.',
        'Rappels de renouvellement et d’échéance pour les licences et les permis récurrents.',
      ),
      visibility: sv(
        'Rendez l’information publique facile à trouver',
        'Les résidents cherchent des services avant d’appeler. Nous structurons le contenu municipal pour que les moteurs de recherche et assistants IA retournent des réponses exactes et à jour, pas des avis périmés.',
        'Structure de contenu centrée sur les services qui reflète la façon dont les résidents décrivent leurs besoins.',
        'Données exactes sur les installations, heures et coordonnées sur les cartes et annuaires.',
        'Contenu d’avis et d’alertes structuré pour ressortir rapidement dans la recherche.',
      ),
      websites: sv(
        'Un site accessible qui réduit les visites au comptoir et les appels',
        'Nous concevons des sites municipaux conformes aux normes d’accessibilité, multilingues, qui simplifient les transactions les plus courantes en ligne.',
        'Conception accessible et en langage clair qui respecte les normes reconnues d’accessibilité du web.',
        'Navigation par tâches pour paiements, permis, demandes et signalements.',
        'Avis d’urgence, de fermeture et de perturbation de service clairs et tenus à jour.',
      ),
    },
  },
}
const EN_DATA: Record<IndustryHubId, HubData> = { ...EN_1, ...EN_2, ...EN_3, ...EN_4, ...EN_5 } as Record<
  IndustryHubId,
  HubData
>
const FR_DATA: Record<IndustryHubId, HubData> = { ...FR_1, ...FR_2, ...FR_3, ...FR_4, ...FR_5 } as Record<
  IndustryHubId,
  HubData
>
const DATA: Record<HubLocale, Record<IndustryHubId, HubData>> = { en: EN_DATA, fr: FR_DATA }
function toLocale(locale: string): HubLocale {
  return locale === 'fr' ? 'fr' : 'en'
}
function lookupAiIndustry(locale: HubLocale, id: IndustryHubId) {
  const industry = aiEmployeeContent[locale].industries.find((entry) => entry.id === id)
  if (!industry) {
    throw new Error(`Industry hub "${id}" has no matching AI Employee industry (${locale}).`)
  }
  return industry
}
function buildHub(locale: HubLocale, id: IndustryHubId): IndustryHub {
  const data = DATA[locale][id]
  const ai = lookupAiIndustry(locale, id)
  const shared = SHARED_COPY[locale]
  const frame = SERVICE_FRAME[locale]
  const priority = INDUSTRY_HUB_PRIORITY[id]
  const services = {} as Record<IndustryHubServiceKey, IndustryHubServiceBlock>
  for (const key of SERVICE_KEYS) {
    const copy = data.s[key]
    services[key] = {
      eyebrow: frame[key].eyebrow,
      title: copy.title,
      lead: copy.lead,
      points: [...copy.points],
      ctaLabel: frame[key].ctaLabel,
      href: SERVICE_HREFS[key],
    }
  }
  return {
    id,
    label: ai.label,
    shortLabel: ai.shortLabel,
    image: { src: ai.image.src, alt: ai.image.alt },
    metadataTitle: data.metaTitle,
    metadataDescription: data.metaDescription,
    hero: {
      eyebrow: shared.heroEyebrow(ai.label),
      title: data.heroTitle,
      lead: data.heroLead,
      primaryCta: shared.primaryCta,
      secondaryCta: shared.secondaryCta(ai.label),
    },
    pressuresTitle: data.pressuresTitle,
    pressures: [...data.pressures],
    leadServices: priority.leadServices,
    relatedServices: relatedServicesForIndustry(id),
    startHere: {
      title: shared.startHereTitle,
      lead: START_HERE_LEAD[locale][id],
      ctaLabel: shared.startHereCta[priority.startHereTarget],
      target: priority.startHereTarget,
    },
    proof: {
      label: PROOF_LABEL[locale][id],
      proof: priority.proof,
    },
    services,
    closer: {
      title: data.closerTitle,
      lead: data.closerLead,
      primaryCta: shared.closerPrimaryCta,
      secondaryCta: shared.closerSecondaryCta,
    },
    ui: {
      startHereEyebrow: shared.startHereEyebrow,
      proofEyebrow: shared.proofEyebrow,
      leadTilesTitle: shared.leadTilesTitle,
      relatedTitle: shared.relatedTitle,
      relatedLead: shared.relatedLead,
    },
  }
}
const HUB_CACHE: Partial<Record<HubLocale, Partial<Record<IndustryHubId, IndustryHub>>>> = {}
export function listIndustryHubIds(): IndustryHubId[] {
  return [...INDUSTRY_HUB_IDS]
}
export function isIndustryHubId(id: string): boolean {
  return (INDUSTRY_HUB_IDS as readonly string[]).includes(id)
}
export function getIndustryHub(locale: string, id: string): IndustryHub | null {
  if (!isIndustryHubId(id)) return null
  const loc = toLocale(locale)
  const hubId = id as IndustryHubId
  const cache = (HUB_CACHE[loc] ??= {})
  return (cache[hubId] ??= buildHub(loc, hubId))
}
export function getIndustryHubIndex(locale: string): IndustryHubIndexCopy {
  const loc = toLocale(locale)
  const shared = SHARED_COPY[loc]
  return {
    title: shared.indexTitle,
    lead: shared.indexLead,
    items: INDUSTRY_HUB_IDS.map((id) => ({
      id,
      label: lookupAiIndustry(loc, id).label,
      blurb: DATA[loc][id].blurb,
    })),
  }
}

export function getFeaturedIndustryHubNav(locale: string): { id: IndustryHubId; label: string }[] {
  const loc = toLocale(locale)
  return FEATURED_INDUSTRY_HUB_IDS.map((id) => ({
    id,
    label: lookupAiIndustry(loc, id).label,
  }))
}
