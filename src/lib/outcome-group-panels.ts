import type { OutcomeGroupId } from '@/lib/solution-outcome-pages'
import type { SolutionPathId } from '@/lib/solutions-by-need'
import type { ConsultationIntent, ConsultingFocus } from '@/lib/consultation-request'

export type EvidencePath =
  | '/tools/digital-presence-snapshot'
  | '/digital-product-discovery'
  | '/website-package'
  | '/tools/communications-value-brief'
  | '/tools/email-reach-brief'
  | '/tools/ninety-day-plan-brief'
  | '/tools/capacity-pressure-brief'
  | '/website-ai-visibility-review'
  | '/digital-asset-health-review'
  | '/automation-opportunity-review'
  | '/ai-agent-readiness-review'
  | '/technology-decision-review'
  | '/assessment'

export type OutcomeGroupSituation = {
  id: string
  label: string
  hint: string
  typicalCauses?: readonly string[]
  roallaHelp?: string
  evidencePath: EvidencePath
  evidenceLabel: string
  evidenceNote?: string
  pathwaySlug: SolutionPathId
  contactIntent: ConsultationIntent
  contactFocus?: ConsultingFocus
}

export type OutcomeGroupPanelCopy = {
  resultEyebrow: string
  resultTitle: string
  resultBody: string
  situationPrompt: string
  situations: readonly OutcomeGroupSituation[]
  evidenceMode: 'domain' | 'link'
  domainLabel?: string
  domainPlaceholder?: string
  domainCta?: string
  domainNote?: string
  evidenceNote: string
  ladderEyebrow: string
  ladderTitle: string
  ladderSteps: readonly { title: string; body: string }[]
  vignetteEyebrow: string
  vignetteLabel: string
  vignetteHeadline: string
  vignetteBody: string
  vignetteSteps: readonly string[]
  contactCta: string
  qualifierEyebrow: string
  qualifierTitle: string
  qualifierBody: string
  channelLabel: string
  channels: readonly { id: string; label: string }[]
  priorityLabel: string
  priorities: readonly { id: string; label: string }[]
  qualifierCta: string
  qualifierNote: string
  pathwaysLabel: string
  pathwayLinks: readonly { slug: SolutionPathId; label: string }[]
  highlightLabel: string
}

const growthEn: OutcomeGroupPanelCopy = {
  resultEyebrow: 'What better looks like',
  resultTitle: 'Qualified buyers find you—and understand why to act.',
  resultBody:
    'A clearer public presence: search and AI can describe the business accurately, the landing page earns trust, and the next step is obvious. Start with evidence on your live site, then decide the improvement path.',
  situationPrompt: 'Which outcome pressure is closest?',
  situations: [
    {
      id: 'findability',
      label: 'Buyers can’t find us',
      hint: 'Discovery and search visibility are the bottleneck.',
      typicalCauses: [
        'Pages do not match the words buyers actually use when they search.',
        'Your public presence is incomplete or inconsistent across search and maps.',
      ],
      roallaHelp:
        'ROALLA checks how easy it is to find you, whether your public page is clear, and what to fix first—then turns that into a practical action list.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Check my website',
      evidenceNote: 'Free website check. No email required. Public landing page only.',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
    {
      id: 'conversion',
      label: 'Traffic doesn’t convert',
      hint: 'People arrive, but the path to action is unclear.',
      typicalCauses: [
        'The offer or next step is hard to understand quickly.',
        'Proof of trust appears too late, or contacting you feels hard.',
      ],
      roallaHelp:
        'ROALLA walks the customer path with you, clarifies the offer and next step, then prioritizes the highest-value changes before a rebuild.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Review the path to action',
      evidenceNote: 'A focused check can separate unclear messaging from friction in the next step—before you rebuild.',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
    {
      id: 'ai-clarity',
      label: 'Search or AI misunderstands us',
      hint: 'People—and search tools—struggle to describe what you do from your public page.',
      typicalCauses: [
        'Your public page mixes audiences, services, and places without a clear story.',
        'Important facts about the business are hard to find or inconsistent.',
      ],
      roallaHelp:
        'ROALLA helps make your public story clear so customers, search, and AI assistants describe you accurately—then points to the highest-value fixes first.',
      evidencePath: '/website-ai-visibility-review',
      evidenceLabel: 'Check how search and AI describe you',
      evidenceNote: 'Start with what the public can already see—no technical project required to begin.',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
    {
      id: 'email-deliverability',
      label: 'Campaign emails aren’t reaching customers',
      hint: 'Messages land in junk or never arrive, so customers stop responding.',
      typicalCauses: [
        'Sending setup or the “from” name does not match how customers know you.',
        'Lists are outdated, or messages look like junk to the people who receive them.',
      ],
      roallaHelp:
        'ROALLA helps you check whether emails reach the inbox, then sequences practical fixes—starting with how you send and who you email—before a bigger campaign overhaul.',
      evidencePath: '/tools/email-reach-brief',
      evidenceLabel: 'Check if your emails are getting through',
      evidenceNote: 'A short plain-language brief—optional to talk with us afterward.',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
  ],
  evidenceMode: 'domain',
  domainLabel: 'Your website address',
  domainPlaceholder: 'yourbusiness.ca',
  domainCta: 'Check my website',
  domainNote: 'Free Digital Presence Snapshot. No email required. Public landing page only.',
  evidenceNote: 'Free Digital Presence Snapshot. No email required. Public landing page only.',
  ladderEyebrow: 'How commitment grows',
  ladderTitle: 'Evidence first. Interpretation second. Improvement third.',
  ladderSteps: [
    {
      title: 'See',
      body: 'Run the free snapshot on your public landing page—performance, readability, social setup, and priority actions.',
    },
    {
      title: 'Interpret',
      body: 'Optional personal review of what matters most for your buyers and where to act first.',
    },
    {
      title: 'Improve',
      body: 'Digital Visibility Optimization: prioritized changes tied to discovery, trust, and conversion outcomes.',
    },
  ],
  vignetteEyebrow: 'Illustrative path',
  vignetteLabel: 'Anonymized example',
  vignetteHeadline: 'The page looked fine. The snapshot showed why buyers still hesitated.',
  vignetteBody:
    'A mid-market service firm had traffic but weak inquiries. The snapshot separated lab performance, search readability, and conversion friction—then ROALLA sequenced fixes against the outcome: more qualified conversations.',
  vignetteSteps: [
    'Snapshot surfaced weak mobile usability and unclear offer hierarchy.',
    'Search/AI readability gaps made the business hard to summarize accurately.',
    'A short review turned findings into a sequenced improvement plan—not a rebuild.',
  ],
  contactCta: 'Talk through this outcome',
  qualifierEyebrow: 'Prefer a human reply first?',
  qualifierTitle: 'Two quick answers. Fit reply in one business day.',
  qualifierBody:
    'If you are not ready to run the tool, tell us the channel and the priority. We’ll reply with a practical next step.',
  channelLabel: 'Main channel',
  channels: [
    { id: 'website', label: 'Website' },
    { id: 'local', label: 'Local / maps' },
    { id: 'both', label: 'Website + local' },
    { id: 'email', label: 'Email campaigns' },
  ],
  priorityLabel: 'Priority',
  priorities: [
    { id: 'findability', label: 'Findability' },
    { id: 'trust', label: 'Trust' },
    { id: 'conversion', label: 'Conversion' },
  ],
  qualifierCta: 'Get a fit reply',
  qualifierNote: '~3 min · No obligation · Reply in 1 business day',
  pathwaysLabel: 'Pathway details',
  pathwayLinks: [{ slug: 'visibility', label: 'Improve visibility and conversion' }],
  highlightLabel: 'You chose growth and visibility—start with evidence',
}

const growthFr: OutcomeGroupPanelCopy = {
  resultEyebrow: 'À quoi ressemble une meilleure situation',
  resultTitle: 'Les bons acheteurs vous trouvent—et comprennent pourquoi agir.',
  resultBody:
    'Une présence publique plus claire : la recherche et l’IA décrivent l’entreprise avec justesse, la page d’arrivée inspire confiance, et la prochaine étape est évidente. Commencez par des preuves sur votre site en ligne, puis choisissez le parcours d’amélioration.',
  situationPrompt: 'Quelle pression de résultat est la plus proche?',
  situations: [
    {
      id: 'findability',
      label: 'Les acheteurs ne nous trouvent pas',
      hint: 'La découverte et la visibilité dans la recherche sont le frein.',
      typicalCauses: [
        'Les pages ne correspondent pas aux mots que les acheteurs utilisent vraiment.',
        'La présence publique est incomplète ou incohérente entre la recherche et les cartes.',
      ],
      roallaHelp:
        'ROALLA vérifie à quel point vous êtes faciles à trouver, si la page publique est claire, et quoi corriger en premier—puis transforme cela en liste d’actions concrètes.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Vérifier mon site',
      evidenceNote: 'Vérification gratuite du site. Aucun courriel requis. Page d’arrivée publique seulement.',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
    {
      id: 'conversion',
      label: 'Le trafic ne convertit pas',
      hint: 'Les gens arrivent, mais le chemin vers l’action est flou.',
      typicalCauses: [
        'L’offre ou la prochaine étape est difficile à comprendre rapidement.',
        'Les preuves de confiance arrivent trop tard, ou vous contacter semble difficile.',
      ],
      roallaHelp:
        'ROALLA parcourt le chemin client avec vous, clarifie l’offre et la prochaine étape, puis priorise les changements les plus utiles avant une refonte.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Examiner le chemin vers l’action',
      evidenceNote: 'Une vérification ciblée sépare un message flou de la friction à l’étape suivante—avant une refonte.',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
    {
      id: 'ai-clarity',
      label: 'La recherche ou l’IA nous mal comprend',
      hint: 'Les gens—et les outils de recherche—peinent à décrire ce que vous faites à partir de votre page publique.',
      typicalCauses: [
        'La page publique mélange publics, services et lieux sans récit clair.',
        'Des faits importants sur l’entreprise sont difficiles à trouver ou incohérents.',
      ],
      roallaHelp:
        'ROALLA clarifie votre récit public pour que clients, recherche et assistants IA vous décrivent avec justesse—puis indique les correctifs les plus utiles en premier.',
      evidencePath: '/website-ai-visibility-review',
      evidenceLabel: 'Voir comment la recherche et l’IA vous décrivent',
      evidenceNote: 'Commencez par ce que le public peut déjà voir—aucun projet technique requis pour débuter.',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
    {
      id: 'email-deliverability',
      label: 'Nos courriels n’atteignent pas les clients',
      hint: 'Les messages vont dans les indésirables ou n’arrivent jamais, donc les clients cessent de répondre.',
      typicalCauses: [
        'La configuration d’envoi ou le nom « de » ne correspond pas à la façon dont les clients vous connaissent.',
        'Les listes sont périmées, ou les messages semblent indésirables aux destinataires.',
      ],
      roallaHelp:
        'ROALLA vous aide à vérifier si les courriels atteignent la boîte de réception, puis séquence des correctifs pratiques—en commençant par comment vous envoyez et à qui—avant une plus grande refonte de campagne.',
      evidencePath: '/tools/email-reach-brief',
      evidenceLabel: 'Vérifier si vos courriels passent',
      evidenceNote: 'Un court aperçu en langage simple—parler avec nous ensuite est optionnel.',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
  ],
  evidenceMode: 'domain',
  domainLabel: 'Adresse de votre site Web',
  domainPlaceholder: 'votreentreprise.ca',
  domainCta: 'Vérifier mon site',
  domainNote: 'Aperçu gratuit de présence numérique. Aucun courriel requis. Page d’arrivée publique seulement.',
  evidenceNote: 'Aperçu gratuit de présence numérique. Aucun courriel requis. Page d’arrivée publique seulement.',
  ladderEyebrow: 'Comment l’engagement progresse',
  ladderTitle: 'Les preuves d’abord. L’interprétation ensuite. L’amélioration en troisième.',
  ladderSteps: [
    {
      title: 'Voir',
      body: 'Lancez l’aperçu gratuit sur votre page d’arrivée—performance, lisibilité, partage social et actions prioritaires.',
    },
    {
      title: 'Interpréter',
      body: 'Revue personnelle optionnelle de ce qui compte pour vos acheteurs et par où commencer.',
    },
    {
      title: 'Améliorer',
      body: 'Optimisation de la visibilité numérique : changements priorisés liés à la découverte, à la confiance et à la conversion.',
    },
  ],
  vignetteEyebrow: 'Parcours illustratif',
  vignetteLabel: 'Exemple anonymisé',
  vignetteHeadline: 'La page semblait correcte. L’aperçu a montré pourquoi les acheteurs hésitaient encore.',
  vignetteBody:
    'Une entreprise de services du marché intermédiaire avait du trafic mais peu de demandes. L’aperçu a séparé performance de laboratoire, lisibilité pour la recherche et friction de conversion—puis ROALLA a séquencé les correctifs selon le résultat : plus de conversations qualifiées.',
  vignetteSteps: [
    'L’aperçu a révélé une faible convivialité mobile et une hiérarchie d’offre peu claire.',
    'Des lacunes de lisibilité recherche/IA rendaient l’entreprise difficile à résumer correctement.',
    'Une courte revue a transformé les constats en plan d’amélioration séquencé—pas une refonte.',
  ],
  contactCta: 'Discuter de ce résultat',
  qualifierEyebrow: 'Vous préférez d’abord une réponse humaine?',
  qualifierTitle: 'Deux réponses rapides. Réponse d’adéquation en un jour ouvrable.',
  qualifierBody:
    'Si vous n’êtes pas prêt à lancer l’outil, indiquez le canal et la priorité. Nous répondrons avec une prochaine étape pratique.',
  channelLabel: 'Canal principal',
  channels: [
    { id: 'website', label: 'Site Web' },
    { id: 'local', label: 'Local / cartes' },
    { id: 'both', label: 'Site Web + local' },
    { id: 'email', label: 'Campagnes courriel' },
  ],
  priorityLabel: 'Priorité',
  priorities: [
    { id: 'findability', label: 'Visibilité' },
    { id: 'trust', label: 'Confiance' },
    { id: 'conversion', label: 'Conversion' },
  ],
  qualifierCta: 'Obtenir une réponse d’adéquation',
  qualifierNote: '~3 min · Sans obligation · Réponse en 1 jour ouvrable',
  pathwaysLabel: 'Détails des parcours',
  pathwayLinks: [{ slug: 'visibility', label: 'Améliorer visibilité et conversion' }],
  highlightLabel: 'Vous avez choisi la croissance et la visibilité—commencez par des preuves',
}

const experienceEn: OutcomeGroupPanelCopy = {
  resultEyebrow: 'What better looks like',
  resultTitle: 'People understand the offer—and know the next step.',
  resultBody:
    'A clearer digital experience: website, product, or communications paths that reduce friction for customers and teams. Frame the outcome, gather a light brief, then decide what to build or modernize.',
  situationPrompt: 'Which experience pressure is closest?',
  situations: [
    {
      id: 'website-or-product',
      label: 'We need a clearer website or product',
      hint: 'What customers see online no longer matches how the business really works.',
      typicalCauses: [
        'The site or product tries to serve too many audiences at once.',
        'The first useful journey is unclear, so scope keeps growing.',
      ],
      roallaHelp:
        'ROALLA helps define the smallest useful experience for one audience and one outcome—before a long feature list becomes the plan.',
      evidencePath: '/digital-product-discovery',
      evidenceLabel: 'Frame the smallest useful build',
      evidenceNote: 'A short discovery—no finished project plan required to start.',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
    },
    {
      id: 'customer-journey',
      label: 'Customers hit friction online',
      hint: 'People stall between finding you, choosing, and getting in touch.',
      typicalCauses: [
        'Pages are slow, confusing, or hard to use on a phone.',
        'Nobody owns the live site backlog, so fixes stay reactive.',
      ],
      roallaHelp:
        'ROALLA checks what is blocking customers on your live site or app, then separates urgent risk from useful improvement and routine care.',
      evidencePath: '/digital-asset-health-review',
      evidenceLabel: 'Check what’s blocking customers online',
      evidenceNote: 'Start with a practical baseline of the live experience—before a rebuild.',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
    },
    {
      id: 'communications',
      label: 'Calling or collaboration is holding us back',
      hint: 'Phone, customer contact, or team collaboration needs a clearer path.',
      typicalCauses: [
        'Missed calls, disconnected tools, or weak reporting hurt service.',
        'Renewal or replacement talks start before needs are clear.',
      ],
      roallaHelp:
        'ROALLA helps capture what you need from calling and customer follow-up first—so provider talks stay grounded in your requirements.',
      evidencePath: '/tools/communications-value-brief',
      evidenceLabel: 'Build a Communications Value Brief',
      evidenceNote: 'Free guided brief—talking with us afterward is optional.',
      pathwaySlug: 'communications',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'Free guided starting point—no finished brief required.',
  ladderEyebrow: 'How commitment grows',
  ladderTitle: 'Evidence first. Interpretation second. Delivery third.',
  ladderSteps: [
    {
      title: 'See',
      body: 'Capture the outcome, audience, and constraints in a short discovery or value brief before tools dominate the conversation.',
    },
    {
      title: 'Interpret',
      body: 'Clarify whether the next step is a site, portal, app, event experience, or communications modernization.',
    },
    {
      title: 'Improve',
      body: 'Digital Enablement or Technology Advisory turns the decision into owned milestones through launch and adoption.',
    },
  ],
  vignetteEyebrow: 'Illustrative path',
  vignetteLabel: 'Anonymized example',
  vignetteHeadline: 'The team wanted a rebuild. Discovery showed a journey problem.',
  vignetteBody:
    'A growth-stage firm assumed they needed a new platform. Framing the customer journey first revealed unclear offers and weak handoffs—so the build focused on conversion paths instead of a full rewrite.',
  vignetteSteps: [
    'Discovery separated brand presentation from task completion friction.',
    'A scoped experience change beat an open-ended rebuild.',
    'Launch included measurement owners—not only a design handoff.',
  ],
  contactCta: 'Talk through this outcome',
  qualifierEyebrow: 'Prefer a human reply first?',
  qualifierTitle: 'Two quick answers. Fit reply in one business day.',
  qualifierBody: 'Tell us the audience and the pressure. We’ll reply with a practical next step.',
  channelLabel: 'Primary audience',
  channels: [
    { id: 'customers', label: 'Customers' },
    { id: 'employees', label: 'Employees' },
    { id: 'both', label: 'Both' },
  ],
  priorityLabel: 'Priority',
  priorities: [
    { id: 'clarity', label: 'Clarity' },
    { id: 'conversion', label: 'Conversion' },
    { id: 'speed', label: 'Speed to launch' },
  ],
  qualifierCta: 'Get a fit reply',
  qualifierNote: '~3 min · No obligation · Reply in 1 business day',
  pathwaysLabel: 'Pathway details',
  pathwayLinks: [
    { slug: 'digital-experience', label: 'Build a digital experience' },
    { slug: 'communications', label: 'Improve customer and team communications' },
  ],
  highlightLabel: 'You chose experience—start with evidence',
}

const experienceFr: OutcomeGroupPanelCopy = {
  resultEyebrow: 'À quoi ressemble une meilleure situation',
  resultTitle: 'Les gens comprennent l’offre—et savent la prochaine étape.',
  resultBody:
    'Une expérience numérique plus claire : site, produit ou parcours de communications qui réduisent la friction pour clients et équipes. Cadrez le résultat, recueillez un brief léger, puis décidez quoi bâtir ou moderniser.',
  situationPrompt: 'Quelle pression d’expérience est la plus proche?',
  situations: [
    {
      id: 'website-or-product',
      label: 'Nous avons besoin d’un site ou produit plus clair',
      hint: 'Ce que les clients voient en ligne ne correspond plus au fonctionnement réel de l’entreprise.',
      typicalCauses: [
        'Le site ou le produit tente de servir trop de publics à la fois.',
        'Le premier parcours utile est flou, donc la portée grossit sans cesse.',
      ],
      roallaHelp:
        'ROALLA aide à définir la plus petite expérience utile pour un public et un résultat—avant qu’une longue liste de fonctions ne devienne le plan.',
      evidencePath: '/digital-product-discovery',
      evidenceLabel: 'Cadre la plus petite réalisation utile',
      evidenceNote: 'Une courte découverte—aucun plan de projet finalisé requis pour commencer.',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
    },
    {
      id: 'customer-journey',
      label: 'Les clients rencontrent de la friction en ligne',
      hint: 'Les gens bloquent entre vous trouver, choisir et vous joindre.',
      typicalCauses: [
        'Les pages sont lentes, confuses ou difficiles à utiliser sur téléphone.',
        'Personne ne possède le carnet du site en ligne, donc les correctifs restent réactifs.',
      ],
      roallaHelp:
        'ROALLA vérifie ce qui bloque les clients sur votre site ou appli en ligne, puis sépare risque urgent, amélioration utile et entretien courant.',
      evidencePath: '/digital-asset-health-review',
      evidenceLabel: 'Voir ce qui bloque les clients en ligne',
      evidenceNote: 'Commencez par une référence pratique de l’expérience en ligne—avant une refonte.',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
    },
    {
      id: 'communications',
      label: 'Les appels ou la collaboration nous freinent',
      hint: 'Téléphonie, contact client ou collaboration d’équipe nécessitent un parcours plus clair.',
      typicalCauses: [
        'Appels manqués, outils déconnectés ou rapports faibles nuisent au service.',
        'Les discussions de renouvellement ou remplacement commencent avant que les besoins soient clairs.',
      ],
      roallaHelp:
        'ROALLA aide à capturer ce dont vous avez besoin pour les appels et le suivi client d’abord—pour que les échanges fournisseurs restent ancrés dans vos exigences.',
      evidencePath: '/tools/communications-value-brief',
      evidenceLabel: 'Créer un brief valeur communications',
      evidenceNote: 'Brief guidé gratuit—en parler ensuite est optionnel.',
      pathwaySlug: 'communications',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'Point de départ guidé gratuit—aucun cahier des charges finalisé requis.',
  ladderEyebrow: 'Comment l’engagement progresse',
  ladderTitle: 'Les preuves d’abord. L’interprétation ensuite. La livraison en troisième.',
  ladderSteps: [
    {
      title: 'Voir',
      body: 'Capturer le résultat, le public et les contraintes dans une courte découverte ou un brief de valeur avant que les outils dominent.',
    },
    {
      title: 'Interpréter',
      body: 'Clarifier si la prochaine étape est un site, un portail, une appli, une expérience événementielle ou une modernisation des communications.',
    },
    {
      title: 'Améliorer',
      body: 'L’accompagnement numérique ou le conseil technologique transforme la décision en jalons assumés jusqu’au lancement et à l’adoption.',
    },
  ],
  vignetteEyebrow: 'Parcours illustratif',
  vignetteLabel: 'Exemple anonymisé',
  vignetteHeadline: 'L’équipe voulait une refonte. La découverte a montré un problème de parcours.',
  vignetteBody:
    'Une entreprise en croissance croyait devoir changer de plateforme. Cadré le parcours client d’abord a révélé des offres floues et de faibles transferts—donc la réalisation a ciblé les chemins de conversion plutôt qu’une réécriture complète.',
  vignetteSteps: [
    'La découverte a séparé la présentation de marque de la friction à accomplir une tâche.',
    'Un changement d’expérience ciblé a battu une refonte ouverte.',
    'Le lancement incluait des responsables de mesure—pas seulement une remise de design.',
  ],
  contactCta: 'Discuter de ce résultat',
  qualifierEyebrow: 'Vous préférez d’abord une réponse humaine?',
  qualifierTitle: 'Deux réponses rapides. Réponse d’adéquation en un jour ouvrable.',
  qualifierBody: 'Indiquez le public et la pression. Nous répondrons avec une prochaine étape pratique.',
  channelLabel: 'Public principal',
  channels: [
    { id: 'customers', label: 'Clients' },
    { id: 'employees', label: 'Employés' },
    { id: 'both', label: 'Les deux' },
  ],
  priorityLabel: 'Priorité',
  priorities: [
    { id: 'clarity', label: 'Clarté' },
    { id: 'conversion', label: 'Conversion' },
    { id: 'speed', label: 'Rapidité de lancement' },
  ],
  qualifierCta: 'Obtenir une réponse d’adéquation',
  qualifierNote: '~3 min · Sans obligation · Réponse en 1 jour ouvrable',
  pathwaysLabel: 'Détails des parcours',
  pathwayLinks: [
    { slug: 'digital-experience', label: 'Créer une expérience numérique' },
    { slug: 'communications', label: 'Améliorer les communications clients et équipes' },
  ],
  highlightLabel: 'Vous avez choisi l’expérience—commencez par des preuves',
}

const automationEn: OutcomeGroupPanelCopy = {
  resultEyebrow: 'What better looks like',
  resultTitle: 'Repeatable work runs smoothly—and people stay accountable.',
  resultBody:
    'Less re-entry and clearer coverage when volume jumps. Start by naming where work piles up and what must stay human-checked, then choose the smallest useful next step.',
  situationPrompt: 'Which automation pressure is closest?',
  situations: [
    {
      id: 'repetitive-work',
      label: 'Teams re-enter the same information',
      hint: 'Handoffs and duplicate entry slow everyday work.',
      typicalCauses: [
        'The same details are typed into more than one place after every handoff.',
        'Mistakes grow when people copy under time pressure.',
      ],
      roallaHelp:
        'ROALLA helps find the highest-value repeatable steps to remove first—with clear owners for exceptions—before connecting more tools.',
      evidencePath: '/automation-opportunity-review',
      evidenceLabel: 'Find the work worth automating',
      evidenceNote: 'Free opportunity review—no finished architecture required.',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    },
    {
      id: 'staffing-capacity',
      label: 'We can’t hire or keep enough people',
      hint: 'Work stays with a thin team; quality and speed slip.',
      typicalCauses: [
        'Open roles stay unfilled while workload keeps rising.',
        'Knowledge sits with a few people who become bottlenecks.',
      ],
      roallaHelp:
        'ROALLA helps spot repeatable work that can run with a person still checking exceptions—so the team gains capacity without losing accountability.',
      evidencePath: '/tools/capacity-pressure-brief',
      evidenceLabel: 'Tell us where the work piles up',
      evidenceNote: 'A short plain-language brief—optional to talk with us afterward.',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    },
    {
      id: 'peak-continuity',
      label: 'Peak demand breaks our coverage',
      hint: 'Volume jumps and service consistency is at risk.',
      typicalCauses: [
        'Busy seasons or campaigns overload the same thin team.',
        'Response times slip exactly when customers need you most.',
      ],
      roallaHelp:
        'ROALLA helps plan overflow help for peak work while people stay on the moments that protect customer trust.',
      evidencePath: '/tools/capacity-pressure-brief',
      evidenceLabel: 'Tell us where peaks break coverage',
      evidenceNote: 'A short plain-language brief—optional to talk with us afterward.',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    },
    {
      id: 'iot-ops',
      label: 'Connected equipment needs a clearer operating path',
      hint: 'Alerts and monitoring data are hard to turn into action.',
      typicalCauses: [
        'Sensors and systems raise alerts without clear owners or next steps.',
        'Data is collected but not tied to the decisions operations must make.',
      ],
      roallaHelp:
        'ROALLA clarifies the operating outcome and decision criteria before adding more devices—so monitoring becomes a path to response, not another dashboard.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Clarify the operating decision',
      evidenceNote: 'Free decision review—requirements before a product shortlist.',
      pathwaySlug: 'iot',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'Free guided starting point—no finished architecture required.',
  ladderEyebrow: 'How commitment grows',
  ladderTitle: 'Evidence first. Controls second. Enablement third.',
  ladderSteps: [
    {
      title: 'See',
      body: 'Identify the work volume, delays, and failure points before connecting systems or adding extra help.',
    },
    {
      title: 'Interpret',
      body: 'Define approvals, exceptions, and what must stay human-owned.',
    },
    {
      title: 'Improve',
      body: 'ROALLA implements the controlled path with clear owners and measures—not a demo without accountability.',
    },
  ],
  vignetteEyebrow: 'Illustrative path',
  vignetteLabel: 'Anonymized example',
  vignetteHeadline: 'The demo looked impressive. Readiness showed the ownership gap.',
  vignetteBody:
    'An operations team wanted automated intake help. A short review separated high-volume work with clear owners from work that lacked exception ownership—so the pilot started where accountability already existed.',
  vignetteSteps: [
    'Opportunity framing ranked workflows by measurable friction.',
    'Exception ownership was defined before tool connections.',
    'The pilot measured handoff quality—not only demo polish.',
  ],
  contactCta: 'Talk through this outcome',
  qualifierEyebrow: 'Prefer a human reply first?',
  qualifierTitle: 'Two quick answers. Fit reply in one business day.',
  qualifierBody: 'Tell us the work type and the risk tolerance. We’ll reply with a practical next step.',
  channelLabel: 'Work type',
  channels: [
    { id: 'internal', label: 'Internal ops' },
    { id: 'customer', label: 'Customer-facing' },
    { id: 'both', label: 'Both' },
  ],
  priorityLabel: 'Priority',
  priorities: [
    { id: 'speed', label: 'Speed' },
    { id: 'control', label: 'Control' },
    { id: 'cost', label: 'Cost to serve' },
  ],
  qualifierCta: 'Get a fit reply',
  qualifierNote: '~3 min · No obligation · Reply in 1 business day',
  pathwaysLabel: 'Pathway details',
  pathwayLinks: [
    { slug: 'automation-ai', label: 'Automate work with control' },
    { slug: 'iot', label: 'Connect operations with equipment data' },
  ],
  highlightLabel: 'You chose automation—start with evidence',
}

const automationFr: OutcomeGroupPanelCopy = {
  resultEyebrow: 'À quoi ressemble une meilleure situation',
  resultTitle: 'Le travail répétitif s’exécute sans friction—et les personnes restent responsables.',
  resultBody:
    'Moins de ressaisie et une couverture plus claire quand le volume monte. Nommez d’abord où le travail s’accumule et ce qui doit rester vérifié par une personne, puis choisissez la plus petite prochaine étape utile.',
  situationPrompt: 'Quelle pression d’automatisation est la plus proche?',
  situations: [
    {
      id: 'repetitive-work',
      label: 'Les équipes ressaisissent les mêmes données',
      hint: 'Les transferts et la double saisie ralentissent le travail quotidien.',
      typicalCauses: [
        'Les mêmes détails sont saisis à plus d’un endroit après chaque transfert.',
        'Les erreurs augmentent quand les gens copient sous pression.',
      ],
      roallaHelp:
        'ROALLA aide à trouver les étapes répétables les plus utiles à retirer d’abord—avec des responsables clairs pour les exceptions—avant de connecter plus d’outils.',
      evidencePath: '/automation-opportunity-review',
      evidenceLabel: 'Trouver le travail qui mérite d’être automatisé',
      evidenceNote: 'Revue d’occasions gratuite—aucune architecture finalisée requise.',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    },
    {
      id: 'staffing-capacity',
      label: 'Nous n’arrivons pas à embaucher ou à retenir assez de gens',
      hint: 'Le travail reste sur une équipe mince; qualité et vitesse glissent.',
      typicalCauses: [
        'Les postes ouverts restent vacants tandis que la charge monte.',
        'Le savoir reste chez quelques personnes qui deviennent des goulots.',
      ],
      roallaHelp:
        'ROALLA aide à repérer le travail répétable qui peut tourner avec une personne qui vérifie encore les exceptions—pour gagner de la capacité sans perdre la responsabilité.',
      evidencePath: '/tools/capacity-pressure-brief',
      evidenceLabel: 'Indiquer où le travail s’accumule',
      evidenceNote: 'Un court aperçu en langage simple—en parler ensuite est optionnel.',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    },
    {
      id: 'peak-continuity',
      label: 'Les pointes de demande cassent notre couverture',
      hint: 'Le volume monte et la constance du service est à risque.',
      typicalCauses: [
        'Les saisons ou campagnes chargées surchargent la même équipe mince.',
        'Les délais de réponse glissent exactement quand les clients ont le plus besoin de vous.',
      ],
      roallaHelp:
        'ROALLA aide à planifier de l’aide en pointe tout en gardant les personnes sur les moments qui protègent la confiance client.',
      evidencePath: '/tools/capacity-pressure-brief',
      evidenceLabel: 'Indiquer où les pointes cassent la couverture',
      evidenceNote: 'Un court aperçu en langage simple—en parler ensuite est optionnel.',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    },
    {
      id: 'iot-ops',
      label: 'L’équipement connecté a besoin d’un parcours plus clair',
      hint: 'Alertes et données de surveillance sont difficiles à transformer en action.',
      typicalCauses: [
        'Capteurs et systèmes lèvent des alertes sans responsables ni prochaines étapes clairs.',
        'Les données sont collectées mais pas liées aux décisions que les opérations doivent prendre.',
      ],
      roallaHelp:
        'ROALLA clarifie le résultat d’exploitation et les critères de décision avant d’ajouter plus d’appareils—pour que la surveillance mène à une réponse, pas à un autre tableau de bord.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Clarifier la décision d’exploitation',
      evidenceNote: 'Revue de décision gratuite—exigences avant une shortlist de produits.',
      pathwaySlug: 'iot',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'Point de départ guidé gratuit—aucune architecture finalisée requise.',
  ladderEyebrow: 'Comment l’engagement progresse',
  ladderTitle: 'Les preuves d’abord. Les contrôles ensuite. La mise en service en troisième.',
  ladderSteps: [
    {
      title: 'Voir',
      body: 'Identifier le volume, les délais et les points de défaillance avant de connecter des systèmes ou d’ajouter de l’aide.',
    },
    {
      title: 'Interpréter',
      body: 'Définir approbations, exceptions et ce qui doit rester sous responsabilité humaine.',
    },
    {
      title: 'Améliorer',
      body: 'ROALLA met en œuvre le parcours contrôlé avec responsables et mesures clairs—pas une démo sans responsabilisation.',
    },
  ],
  vignetteEyebrow: 'Parcours illustratif',
  vignetteLabel: 'Exemple anonymisé',
  vignetteHeadline: 'La démo était impressionnante. La préparation a montré l’écart de responsabilité.',
  vignetteBody:
    'Une équipe opérations voulait de l’aide automatisée à l’accueil. Une courte revue a séparé le travail à fort volume avec responsables clairs d’un autre sans propriétaire d’exceptions—donc le pilote a commencé là où la responsabilisation existait déjà.',
  vignetteSteps: [
    'Le cadrage a classé les flux selon la friction mesurable.',
    'La responsabilité des exceptions a été définie avant les connexions d’outils.',
    'Le pilote a mesuré la qualité des transferts—pas seulement le poli de la démo.',
  ],
  contactCta: 'Discuter de ce résultat',
  qualifierEyebrow: 'Vous préférez d’abord une réponse humaine?',
  qualifierTitle: 'Deux réponses rapides. Réponse d’adéquation en un jour ouvrable.',
  qualifierBody: 'Indiquez le type de travail et la tolérance au risque. Nous répondrons avec une prochaine étape pratique.',
  channelLabel: 'Type de travail',
  channels: [
    { id: 'internal', label: 'Ops internes' },
    { id: 'customer', label: 'Côté client' },
    { id: 'both', label: 'Les deux' },
  ],
  priorityLabel: 'Priorité',
  priorities: [
    { id: 'speed', label: 'Vitesse' },
    { id: 'control', label: 'Contrôle' },
    { id: 'cost', label: 'Coût de service' },
  ],
  qualifierCta: 'Obtenir une réponse d’adéquation',
  qualifierNote: '~3 min · Sans obligation · Réponse en 1 jour ouvrable',
  pathwaysLabel: 'Détails des parcours',
  pathwayLinks: [
    { slug: 'automation-ai', label: 'Automatiser avec contrôle' },
    { slug: 'iot', label: 'Connecter les opérations aux données d’équipement' },
  ],
  highlightLabel: 'Vous avez choisi l’automatisation—commencez par des preuves',
}

const securityEn: OutcomeGroupPanelCopy = {
  resultEyebrow: 'What better looks like',
  resultTitle: 'Material risks are visible—and remediation has owners.',
  resultBody:
    'A prioritized risk and infrastructure path: security gaps, cloud foundations, and network resilience sequenced against obligations and operating reality. Start with decision criteria before products dominate.',
  situationPrompt: 'Which risk pressure is closest?',
  situations: [
    {
      id: 'security-gaps',
      label: 'We lack a clear view of security gaps',
      hint: 'Customers or partners are asking for stronger assurance.',
      typicalCauses: [
        'Obligations and control ownership are unclear across teams.',
        'Vendor demos arrive before shared requirements are written.',
      ],
      roallaHelp:
        'ROALLA helps lock requirements and residual-risk tolerance before scoring options—so the shortlist is comparable and disclosure-ready.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Start with decision criteria',
      evidenceNote: 'Free decision review—requirements before a product shortlist.',
      pathwaySlug: 'security',
      contactIntent: 'security',
    },
    {
      id: 'cloud-infra',
      label: 'Cloud or infrastructure decisions are stuck',
      hint: 'Migration, cost, or who will run it day to day is unclear.',
      typicalCauses: [
        'Options are compared on features, not on cost, risk, and operating ownership.',
        'Migration plans lack a clear owner after go-live.',
      ],
      roallaHelp:
        'ROALLA compares approaches on the same criteria—cost, risk, support, and who operates what—before you commit.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Start with decision criteria',
      evidenceNote: 'Free decision review—requirements before a product shortlist.',
      pathwaySlug: 'cloud-infrastructure',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
    {
      id: 'network',
      label: 'Connectivity reliability is the constraint',
      hint: 'Sites, users, or systems need a more reliable foundation.',
      typicalCauses: [
        'Outages or slow links hit customer or staff experience without a clear fix path.',
        'Connectivity decisions are tied to vendors before needs are clear.',
      ],
      roallaHelp:
        'ROALLA clarifies reliability needs and success measures first, then compares options that fit how you actually operate.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Start with decision criteria',
      evidenceNote: 'Free decision review—requirements before a product shortlist.',
      pathwaySlug: 'network',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'Free decision review—requirements and criteria before a shortlist.',
  ladderEyebrow: 'How commitment grows',
  ladderTitle: 'Evidence first. Comparison second. Transition third.',
  ladderSteps: [
    {
      title: 'See',
      body: 'Clarify current state, obligations, constraints, and how success will be measured.',
    },
    {
      title: 'Interpret',
      body: 'Compare viable approaches on the same risk, cost, support, and adoption criteria.',
    },
    {
      title: 'Improve',
      body: 'Security, Risk & Compliance or Technology Advisory supports the decision and accountable transition.',
    },
  ],
  vignetteEyebrow: 'Illustrative path',
  vignetteLabel: 'Anonymized example',
  vignetteHeadline: 'Procurement wanted a product. Criteria came first.',
  vignetteBody:
    'A leadership team faced competing security proposals. A decision review locked requirements and residual-risk tolerance before scoring options—so the shortlist was comparable and disclosure-ready.',
  vignetteSteps: [
    'Obligations and control ownership were written before vendor demos.',
    'Options were scored on the same criteria—not feature volume.',
    'Material commercial interests were disclosed before commitment.',
  ],
  contactCta: 'Talk through this outcome',
  qualifierEyebrow: 'Prefer a human reply first?',
  qualifierTitle: 'Two quick answers. Fit reply in one business day.',
  qualifierBody: 'Tell us the pressure and the timeline. We’ll reply with a practical next step.',
  channelLabel: 'Pressure',
  channels: [
    { id: 'assurance', label: 'Customer assurance' },
    { id: 'operations', label: 'Operations risk' },
    { id: 'both', label: 'Both' },
  ],
  priorityLabel: 'Timeline',
  priorities: [
    { id: 'urgent', label: 'Urgent' },
    { id: 'planned', label: 'This quarter' },
    { id: 'explore', label: 'Exploring' },
  ],
  qualifierCta: 'Get a fit reply',
  qualifierNote: '~3 min · No obligation · Reply in 1 business day',
  pathwaysLabel: 'Pathway details',
  pathwayLinks: [
    { slug: 'security', label: 'Reduce security and compliance risk' },
    { slug: 'cloud-infrastructure', label: 'Modernize infrastructure and cloud' },
    { slug: 'network', label: 'Strengthen network performance and resilience' },
  ],
  highlightLabel: 'You chose risk and readiness—start with evidence',
}

const securityFr: OutcomeGroupPanelCopy = {
  resultEyebrow: 'À quoi ressemble une meilleure situation',
  resultTitle: 'Les risques importants sont visibles—et la remédiation a des responsables.',
  resultBody:
    'Un parcours priorisé de risque et d’infrastructure : écarts de sécurité, fondations infonuagiques et résilience réseau séquencés selon les obligations et la réalité opérationnelle. Commencez par les critères de décision avant que les produits dominent.',
  situationPrompt: 'Quelle pression de risque est la plus proche?',
  situations: [
    {
      id: 'security-gaps',
      label: 'Nous n’avons pas une vue claire des écarts de sécurité',
      hint: 'Des clients ou partenaires demandent une assurance accrue.',
      typicalCauses: [
        'Les obligations et la responsabilité des contrôles sont floues entre les équipes.',
        'Les démos fournisseurs arrivent avant que les exigences partagées soient écrites.',
      ],
      roallaHelp:
        'ROALLA aide à figer les exigences et la tolérance au risque résiduel avant de noter les options—pour une shortlist comparable et prête à la divulgation.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Commencer par les critères de décision',
      evidenceNote: 'Revue de décision gratuite—exigences avant une shortlist de produits.',
      pathwaySlug: 'security',
      contactIntent: 'security',
    },
    {
      id: 'cloud-infra',
      label: 'Les décisions infonuagiques ou d’infrastructure bloquent',
      hint: 'Migration, coûts ou qui exploitera au quotidien sont flous.',
      typicalCauses: [
        'Les options sont comparées sur les fonctions, pas sur coût, risque et responsabilité d’exploitation.',
        'Les plans de migration manquent d’un responsable clair après la mise en service.',
      ],
      roallaHelp:
        'ROALLA compare les approches selon les mêmes critères—coût, risque, soutien et qui exploite quoi—avant de vous engager.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Commencer par les critères de décision',
      evidenceNote: 'Revue de décision gratuite—exigences avant une shortlist de produits.',
      pathwaySlug: 'cloud-infrastructure',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
    {
      id: 'network',
      label: 'La fiabilité de la connectivité est la contrainte',
      hint: 'Sites, utilisateurs ou systèmes ont besoin d’une fondation plus fiable.',
      typicalCauses: [
        'Pannes ou liens lents nuisent à l’expérience client ou du personnel sans parcours de correctif clair.',
        'Les décisions de connectivité sont liées à des fournisseurs avant que les besoins soient clairs.',
      ],
      roallaHelp:
        'ROALLA clarifie d’abord les besoins de fiabilité et les mesures de réussite, puis compare les options adaptées à votre façon d’opérer.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Commencer par les critères de décision',
      evidenceNote: 'Revue de décision gratuite—exigences avant une shortlist de produits.',
      pathwaySlug: 'network',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'Revue de décision gratuite—exigences et critères avant une shortlist.',
  ladderEyebrow: 'Comment l’engagement progresse',
  ladderTitle: 'Les preuves d’abord. La comparaison ensuite. La transition en troisième.',
  ladderSteps: [
    {
      title: 'Voir',
      body: 'Clarifier l’état actuel, les obligations, les contraintes et la façon de mesurer le succès.',
    },
    {
      title: 'Interpréter',
      body: 'Comparer les approches viables selon les mêmes critères de risque, de coût, de soutien et d’adoption.',
    },
    {
      title: 'Améliorer',
      body: 'Sécurité, risque et conformité ou conseil technologique soutient la décision et la transition responsabilisée.',
    },
  ],
  vignetteEyebrow: 'Parcours illustratif',
  vignetteLabel: 'Exemple anonymisé',
  vignetteHeadline: 'Les achats voulaient un produit. Les critères sont venus d’abord.',
  vignetteBody:
    'Une direction faisait face à des propositions de sécurité concurrentes. Une revue de décision a figé exigences et tolérance au risque résiduel avant de noter les options—donc la shortlist était comparable et prête à la divulgation.',
  vignetteSteps: [
    'Obligations et responsabilité des contrôles ont été écrites avant les démos fournisseurs.',
    'Les options ont été notées selon les mêmes critères—pas le volume de fonctions.',
    'Les intérêts commerciaux importants ont été divulgués avant l’engagement.',
  ],
  contactCta: 'Discuter de ce résultat',
  qualifierEyebrow: 'Vous préférez d’abord une réponse humaine?',
  qualifierTitle: 'Deux réponses rapides. Réponse d’adéquation en un jour ouvrable.',
  qualifierBody: 'Indiquez la pression et l’échéance. Nous répondrons avec une prochaine étape pratique.',
  channelLabel: 'Pression',
  channels: [
    { id: 'assurance', label: 'Assurance client' },
    { id: 'operations', label: 'Risque opérationnel' },
    { id: 'both', label: 'Les deux' },
  ],
  priorityLabel: 'Échéance',
  priorities: [
    { id: 'urgent', label: 'Urgent' },
    { id: 'planned', label: 'Ce trimestre' },
    { id: 'explore', label: 'Exploration' },
  ],
  qualifierCta: 'Obtenir une réponse d’adéquation',
  qualifierNote: '~3 min · Sans obligation · Réponse en 1 jour ouvrable',
  pathwaysLabel: 'Détails des parcours',
  pathwayLinks: [
    { slug: 'security', label: 'Réduire les risques de sécurité et de conformité' },
    { slug: 'cloud-infrastructure', label: 'Moderniser l’infrastructure et l’infonuagique' },
    { slug: 'network', label: 'Renforcer la performance et la résilience du réseau' },
  ],
  highlightLabel: 'Vous avez choisi risque et préparation—commencez par des preuves',
}

const executionEn: OutcomeGroupPanelCopy = {
  resultEyebrow: 'What better looks like',
  resultTitle: 'Priorities are sequenced—and owners carry the plan.',
  resultBody:
    'A focused execution rhythm: fewer competing initiatives, clear decision rights, and milestones the team can actually follow. Start with a short assessment of what must change next.',
  situationPrompt: 'Which execution pressure is closest?',
  situations: [
    {
      id: 'too-many-priorities',
      label: 'Too many priorities are competing',
      hint: 'Everything feels urgent; nothing stays sequenced.',
      typicalCauses: [
        'Too many “must do now” items compete without a shared ranking.',
        'New work arrives faster than the team can finish what is already open.',
      ],
      roallaHelp:
        'ROALLA helps narrow to a 90-day sequence with owners and a clear outcome measure—so progress is visible without adding headcount.',
      evidencePath: '/tools/ninety-day-plan-brief',
      evidenceLabel: 'Sketch a 90-day plan',
      evidenceNote: 'A short plain-language brief—optional to talk with us afterward.',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
    {
      id: 'plans-stall',
      label: 'Plans stall between meetings',
      hint: 'Strategy exists, but follow-through breaks down.',
      typicalCauses: [
        'Status meetings replace decisions and owned next actions.',
        'Priorities reset every week without a review rhythm that sticks.',
      ],
      roallaHelp:
        'ROALLA helps replace open status updates with a short review rhythm—owners, next actions, and one outcome the team reviews every week.',
      evidencePath: '/tools/ninety-day-plan-brief',
      evidenceLabel: 'Sketch a 90-day plan',
      evidenceNote: 'A short plain-language brief—optional to talk with us afterward.',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
    {
      id: 'unclear-ownership',
      label: 'Ownership or measures are unclear',
      hint: 'Who decides and who measures progress is fuzzy.',
      typicalCauses: [
        'Decision rights are unspoken, so trade-offs stall.',
        'Measures exist on slides but nobody reviews them consistently.',
      ],
      roallaHelp:
        'ROALLA helps write who owns the outcome, who decides trade-offs, and which few measures the team will actually review.',
      evidencePath: '/tools/ninety-day-plan-brief',
      evidenceLabel: 'Sketch a 90-day plan',
      evidenceNote: 'A short plain-language brief—optional to talk with us afterward.',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'A short plan sketch—practical starting point before a finished brief.',
  ladderEyebrow: 'How commitment grows',
  ladderTitle: 'Evidence first. Alignment second. Execution third.',
  ladderSteps: [
    {
      title: 'See',
      body: 'Name the outcome pressure and the constraints that keep plans from moving.',
    },
    {
      title: 'Interpret',
      body: 'Sequence priorities, decision rights, and measures the team can sustain.',
    },
    {
      title: 'Improve',
      body: 'Business Advisory stays through implementation support—not a one-off strategy deck.',
    },
  ],
  vignetteEyebrow: 'Illustrative path',
  vignetteLabel: 'Anonymized example',
  vignetteHeadline: 'The roadmap was long. The operating rhythm was missing.',
  vignetteBody:
    'A leadership team had twelve “P1” initiatives. Assessment and advisory reframed them into a 90-day sequence with owners and review cadence—so progress became visible without adding headcount.',
  vignetteSteps: [
    'Competing priorities were ranked against one outcome measure.',
    'Decision rights were assigned before the next planning cycle.',
    'A weekly review rhythm replaced status meetings without owners.',
  ],
  contactCta: 'Talk through this outcome',
  qualifierEyebrow: 'Prefer a human reply first?',
  qualifierTitle: 'Two quick answers. Fit reply in one business day.',
  qualifierBody: 'Tell us the team size pressure and the horizon. We’ll reply with a practical next step.',
  channelLabel: 'Horizon',
  channels: [
    { id: '30-days', label: '30 days' },
    { id: '90-days', label: '90 days' },
    { id: 'year', label: 'This year' },
  ],
  priorityLabel: 'Pressure',
  priorities: [
    { id: 'focus', label: 'Focus' },
    { id: 'ownership', label: 'Ownership' },
    { id: 'pace', label: 'Pace' },
  ],
  qualifierCta: 'Get a fit reply',
  qualifierNote: '~3 min · No obligation · Reply in 1 business day',
  pathwaysLabel: 'Pathway details',
  pathwayLinks: [{ slug: 'strategy', label: 'Set direction and priorities' }],
  highlightLabel: 'You chose execution—start with evidence',
}

const executionFr: OutcomeGroupPanelCopy = {
  resultEyebrow: 'À quoi ressemble une meilleure situation',
  resultTitle: 'Les priorités sont séquencées—et les responsables portent le plan.',
  resultBody:
    'Un rythme d’exécution ciblé : moins d’initiatives concurrentes, des droits de décision clairs et des jalons que l’équipe peut réellement suivre. Commencez par une courte évaluation de ce qui doit changer ensuite.',
  situationPrompt: 'Quelle pression d’exécution est la plus proche?',
  situations: [
    {
      id: 'too-many-priorities',
      label: 'Trop de priorités se font concurrence',
      hint: 'Tout semble urgent; rien ne reste séquencé.',
      typicalCauses: [
        'Trop d’éléments « à faire maintenant » se concurrencent sans classement partagé.',
        'Le nouveau travail arrive plus vite que l’équipe ne termine ce qui est déjà ouvert.',
      ],
      roallaHelp:
        'ROALLA aide à réduire à une séquence de 90 jours avec responsables et une mesure de résultat claire—pour que le progrès soit visible sans ajouter d’effectifs.',
      evidencePath: '/tools/ninety-day-plan-brief',
      evidenceLabel: 'Esquisser un plan de 90 jours',
      evidenceNote: 'Un court aperçu en langage simple—en parler ensuite est optionnel.',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
    {
      id: 'plans-stall',
      label: 'Les plans bloquent entre les réunions',
      hint: 'La stratégie existe, mais le suivi s’effondre.',
      typicalCauses: [
        'Les réunions de statut remplacent les décisions et les prochaines actions assumées.',
        'Les priorités se réinitialisent chaque semaine sans rythme de revue qui tient.',
      ],
      roallaHelp:
        'ROALLA aide à remplacer les mises à jour ouvertes par un court rythme de revue—responsables, prochaines actions et un résultat que l’équipe revoit chaque semaine.',
      evidencePath: '/tools/ninety-day-plan-brief',
      evidenceLabel: 'Esquisser un plan de 90 jours',
      evidenceNote: 'Un court aperçu en langage simple—en parler ensuite est optionnel.',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
    {
      id: 'unclear-ownership',
      label: 'Les responsabilités ou mesures sont floues',
      hint: 'Qui décide et qui mesure le progrès est ambigu.',
      typicalCauses: [
        'Les droits de décision sont tacites, donc les arbitrages bloquent.',
        'Les mesures existent sur des diapositives, mais personne ne les revoit de façon constante.',
      ],
      roallaHelp:
        'ROALLA aide à écrire qui possède le résultat, qui décide des arbitrages, et quelles quelques mesures l’équipe revoit vraiment.',
      evidencePath: '/tools/ninety-day-plan-brief',
      evidenceLabel: 'Esquisser un plan de 90 jours',
      evidenceNote: 'Un court aperçu en langage simple—en parler ensuite est optionnel.',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'Une courte esquisse de plan—point de départ pratique avant un cahier des charges finalisé.',
  ladderEyebrow: 'Comment l’engagement progresse',
  ladderTitle: 'Les preuves d’abord. L’alignement ensuite. L’exécution en troisième.',
  ladderSteps: [
    {
      title: 'Voir',
      body: 'Nommer la pression de résultat et les contraintes qui empêchent les plans d’avancer.',
    },
    {
      title: 'Interpréter',
      body: 'Séquencer priorités, droits de décision et mesures que l’équipe peut soutenir.',
    },
    {
      title: 'Améliorer',
      body: 'Le conseil d’affaires demeure présent pour le soutien à la mise en œuvre—pas un deck stratégique ponctuel.',
    },
  ],
  vignetteEyebrow: 'Parcours illustratif',
  vignetteLabel: 'Exemple anonymisé',
  vignetteHeadline: 'La feuille de route était longue. Le rythme opérationnel manquait.',
  vignetteBody:
    'Une direction avait douze initiatives « P1 ». L’évaluation et le conseil les ont reframées en séquence de 90 jours avec responsables et cadence de revue—donc le progrès est devenu visible sans ajouter d’effectifs.',
  vignetteSteps: [
    'Les priorités concurrentes ont été classées selon une seule mesure de résultat.',
    'Les droits de décision ont été assignés avant le prochain cycle de planification.',
    'Un rythme de revue hebdomadaire a remplacé les réunions de statut sans responsables.',
  ],
  contactCta: 'Discuter de ce résultat',
  qualifierEyebrow: 'Vous préférez d’abord une réponse humaine?',
  qualifierTitle: 'Deux réponses rapides. Réponse d’adéquation en un jour ouvrable.',
  qualifierBody: 'Indiquez l’horizon et la pression. Nous répondrons avec une prochaine étape pratique.',
  channelLabel: 'Horizon',
  channels: [
    { id: '30-days', label: '30 jours' },
    { id: '90-days', label: '90 jours' },
    { id: 'year', label: 'Cette année' },
  ],
  priorityLabel: 'Pression',
  priorities: [
    { id: 'focus', label: 'Focus' },
    { id: 'ownership', label: 'Responsabilités' },
    { id: 'pace', label: 'Rythme' },
  ],
  qualifierCta: 'Obtenir une réponse d’adéquation',
  qualifierNote: '~3 min · Sans obligation · Réponse en 1 jour ouvrable',
  pathwaysLabel: 'Détails des parcours',
  pathwayLinks: [{ slug: 'strategy', label: 'Fixer la direction et les priorités' }],
  highlightLabel: 'Vous avez choisi l’exécution—commencez par des preuves',
}

export const outcomeGroupPanels: Record<
  OutcomeGroupId,
  Record<'en' | 'fr', OutcomeGroupPanelCopy>
> = {
  'growth-visibility': { en: growthEn, fr: growthFr },
  'experience-products': { en: experienceEn, fr: experienceFr },
  'automation-ai': { en: automationEn, fr: automationFr },
  'security-compliance': { en: securityEn, fr: securityFr },
  execution: { en: executionEn, fr: executionFr },
}

export function getOutcomeGroupPanelCopy(groupId: OutcomeGroupId, locale: 'en' | 'fr') {
  return outcomeGroupPanels[groupId][locale]
}
