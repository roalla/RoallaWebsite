import type { OutcomeGroupId } from '@/lib/solution-outcome-pages'
import type { SolutionPathId } from '@/lib/solutions-by-need'
import type { ConsultationIntent, ConsultingFocus } from '@/lib/consultation-request'

export type EvidencePath =
  | '/tools/digital-presence-snapshot'
  | '/digital-product-discovery'
  | '/website-package'
  | '/tools/communications-value-brief'
  | '/automation-opportunity-review'
  | '/ai-agent-readiness-review'
  | '/technology-decision-review'
  | '/assessment'

export type OutcomeGroupSituation = {
  id: string
  label: string
  hint: string
  evidencePath: EvidencePath
  evidenceLabel: string
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
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Check my website',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
    {
      id: 'conversion',
      label: 'Traffic doesn’t convert',
      hint: 'People arrive, but the path to action is unclear.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Check my website',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
    {
      id: 'ai-clarity',
      label: 'Search or AI misunderstands us',
      hint: 'The business is hard to describe from the public page.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Check my website',
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
    { id: 'both', label: 'Both' },
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
  highlightLabel: 'You chose findability—start with evidence',
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
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Vérifier mon site',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
    {
      id: 'conversion',
      label: 'Le trafic ne convertit pas',
      hint: 'Les gens arrivent, mais le chemin vers l’action est flou.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Vérifier mon site',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    },
    {
      id: 'ai-clarity',
      label: 'La recherche ou l’IA nous mal comprend',
      hint: 'L’entreprise est difficile à décrire à partir de la page publique.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Vérifier mon site',
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
    { id: 'both', label: 'Les deux' },
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
  highlightLabel: 'Vous avez choisi la visibilité—commencez par des preuves',
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
      hint: 'The public or customer experience no longer matches the business.',
      evidencePath: '/digital-product-discovery',
      evidenceLabel: 'Start digital product discovery',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
    },
    {
      id: 'customer-journey',
      label: 'Customers hit friction online',
      hint: 'Journeys stall between discovery, choice, and contact.',
      evidencePath: '/website-package',
      evidenceLabel: 'Review website package options',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
    },
    {
      id: 'communications',
      label: 'Calling or collaboration is holding us back',
      hint: 'Phone, contact centre, or team collaboration needs a clearer path.',
      evidencePath: '/tools/communications-value-brief',
      evidenceLabel: 'Open Communications Value Brief',
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
      hint: 'L’expérience publique ou client ne correspond plus à l’entreprise.',
      evidencePath: '/digital-product-discovery',
      evidenceLabel: 'Commencer la découverte produit numérique',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
    },
    {
      id: 'customer-journey',
      label: 'Les clients rencontrent de la friction en ligne',
      hint: 'Les parcours bloquent entre découverte, choix et contact.',
      evidencePath: '/website-package',
      evidenceLabel: 'Voir les options de forfait site Web',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
    },
    {
      id: 'communications',
      label: 'Les appels ou la collaboration nous freinent',
      hint: 'Téléphonie, centre de contact ou collaboration d’équipe nécessitent un parcours plus clair.',
      evidencePath: '/tools/communications-value-brief',
      evidenceLabel: 'Ouvrir le brief valeur communications',
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
  resultTitle: 'Repeatable work runs with controls—and humans stay accountable.',
  resultBody:
    'Connected workflows and governed AI where the value is measurable. Start by naming the friction and the control needs, then choose automation, agents, or connected operations.',
  situationPrompt: 'Which automation pressure is closest?',
  situations: [
    {
      id: 'repetitive-work',
      label: 'Teams re-enter the same information',
      hint: 'Handoffs and duplicate entry slow operations.',
      evidencePath: '/automation-opportunity-review',
      evidenceLabel: 'Start automation opportunity review',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    },
    {
      id: 'ai-agent',
      label: 'We want practical AI with human control',
      hint: 'An agent idea exists, but value and guardrails are unclear.',
      evidencePath: '/ai-agent-readiness-review',
      evidenceLabel: 'Start AI agent readiness review',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    },
    {
      id: 'iot-ops',
      label: 'Connected assets need a clearer operating path',
      hint: 'Monitoring, alerts, or IoT data are hard to turn into action.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Start technology decision review',
      pathwaySlug: 'iot',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'Free readiness or opportunity review—no finished architecture required.',
  ladderEyebrow: 'How commitment grows',
  ladderTitle: 'Evidence first. Controls second. Enablement third.',
  ladderSteps: [
    {
      title: 'See',
      body: 'Identify the workflow value, volume, and failure modes before connecting systems or agents.',
    },
    {
      title: 'Interpret',
      body: 'Define approvals, exceptions, data access, and what must stay human-owned.',
    },
    {
      title: 'Improve',
      body: 'ROALLA Agentic or Technology Advisory implements the controlled path with clear owners and measures.',
    },
  ],
  vignetteEyebrow: 'Illustrative path',
  vignetteLabel: 'Anonymized example',
  vignetteHeadline: 'The demo looked impressive. Readiness showed the control gap.',
  vignetteBody:
    'An operations team wanted an AI agent for intake. Readiness review separated a high-volume candidate workflow from one that lacked exception ownership—so the pilot started where accountability already existed.',
  vignetteSteps: [
    'Opportunity framing ranked workflows by measurable friction.',
    'Controls and escalation were defined before tool connections.',
    'The pilot measured containment and handoff quality—not only demo polish.',
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
    { slug: 'iot', label: 'Connect operations with IoT' },
  ],
  highlightLabel: 'You chose automation—start with evidence',
}

const automationFr: OutcomeGroupPanelCopy = {
  resultEyebrow: 'À quoi ressemble une meilleure situation',
  resultTitle: 'Le travail répétitif s’exécute avec des contrôles—et les humains restent responsables.',
  resultBody:
    'Des flux connectés et une IA gouvernée lorsque la valeur est mesurable. Nommez d’abord la friction et les besoins de contrôle, puis choisissez automatisation, agents ou opérations connectées.',
  situationPrompt: 'Quelle pression d’automatisation est la plus proche?',
  situations: [
    {
      id: 'repetitive-work',
      label: 'Les équipes ressaisissent les mêmes données',
      hint: 'Les transferts et la double saisie ralentissent les opérations.',
      evidencePath: '/automation-opportunity-review',
      evidenceLabel: 'Commencer la revue d’occasions d’automatisation',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    },
    {
      id: 'ai-agent',
      label: 'Nous voulons une IA pratique avec contrôle humain',
      hint: 'Une idée d’agent existe, mais valeur et garde-fous sont flous.',
      evidencePath: '/ai-agent-readiness-review',
      evidenceLabel: 'Commencer la revue de préparation aux agents IA',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    },
    {
      id: 'iot-ops',
      label: 'Les actifs connectés ont besoin d’un parcours plus clair',
      hint: 'Surveillance, alertes ou données IdO sont difficiles à transformer en action.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Commencer la revue de décision technologique',
      pathwaySlug: 'iot',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'Revue de préparation ou d’occasions gratuite—aucune architecture finalisée requise.',
  ladderEyebrow: 'Comment l’engagement progresse',
  ladderTitle: 'Les preuves d’abord. Les contrôles ensuite. La mise en service en troisième.',
  ladderSteps: [
    {
      title: 'Voir',
      body: 'Identifier la valeur, le volume et les modes de défaillance du flux avant de connecter systèmes ou agents.',
    },
    {
      title: 'Interpréter',
      body: 'Définir approbations, exceptions, accès aux données et ce qui doit rester sous responsabilité humaine.',
    },
    {
      title: 'Améliorer',
      body: 'ROALLA Agentic ou le conseil technologique met en œuvre le parcours contrôlé avec responsables et mesures clairs.',
    },
  ],
  vignetteEyebrow: 'Parcours illustratif',
  vignetteLabel: 'Exemple anonymisé',
  vignetteHeadline: 'La démo était impressionnante. La préparation a montré l’écart de contrôle.',
  vignetteBody:
    'Une équipe opérations voulait un agent IA pour l’accueil. La revue de préparation a séparé un flux à fort volume d’un autre sans propriétaire d’exceptions—donc le pilote a commencé là où la responsabilisation existait déjà.',
  vignetteSteps: [
    'Le cadrage a classé les flux selon la friction mesurable.',
    'Contrôles et escalade ont été définis avant les connexions d’outils.',
    'Le pilote a mesuré confinement et qualité des transferts—pas seulement le poli de la démo.',
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
    { slug: 'iot', label: 'Connecter les opérations grâce à l’IdO' },
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
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Start technology decision review',
      pathwaySlug: 'security',
      contactIntent: 'security',
    },
    {
      id: 'cloud-infra',
      label: 'Cloud or infrastructure decisions are stuck',
      hint: 'Migration, cost, or operating ownership is unclear.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Start technology decision review',
      pathwaySlug: 'cloud-infrastructure',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
    {
      id: 'network',
      label: 'Connectivity reliability is the constraint',
      hint: 'Sites, users, or systems need a more resilient foundation.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Start technology decision review',
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
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Commencer la revue de décision technologique',
      pathwaySlug: 'security',
      contactIntent: 'security',
    },
    {
      id: 'cloud-infra',
      label: 'Les décisions infonuagiques ou d’infrastructure bloquent',
      hint: 'Migration, coûts ou responsabilité d’exploitation sont flous.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Commencer la revue de décision technologique',
      pathwaySlug: 'cloud-infrastructure',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    },
    {
      id: 'network',
      label: 'La fiabilité de la connectivité est la contrainte',
      hint: 'Sites, utilisateurs ou systèmes ont besoin d’une fondation plus résiliente.',
      evidencePath: '/technology-decision-review',
      evidenceLabel: 'Commencer la revue de décision technologique',
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
      evidencePath: '/assessment',
      evidenceLabel: 'Take the 5-minute assessment',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
    {
      id: 'plans-stall',
      label: 'Plans stall between meetings',
      hint: 'Strategy exists, but follow-through breaks down.',
      evidencePath: '/assessment',
      evidenceLabel: 'Take the 5-minute assessment',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
    {
      id: 'unclear-ownership',
      label: 'Ownership or measures are unclear',
      hint: 'Decision rights and accountability are fuzzy.',
      evidencePath: '/assessment',
      evidenceLabel: 'Take the 5-minute assessment',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'Five-minute assessment—practical starting point before a finished brief.',
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
      evidencePath: '/assessment',
      evidenceLabel: 'Faire l’évaluation de 5 minutes',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
    {
      id: 'plans-stall',
      label: 'Les plans bloquent entre les réunions',
      hint: 'La stratégie existe, mais le suivi s’effondre.',
      evidencePath: '/assessment',
      evidenceLabel: 'Faire l’évaluation de 5 minutes',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
    {
      id: 'unclear-ownership',
      label: 'Les responsabilités ou mesures sont floues',
      hint: 'Les droits de décision et la responsabilisation sont ambigus.',
      evidencePath: '/assessment',
      evidenceLabel: 'Faire l’évaluation de 5 minutes',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
    },
  ],
  evidenceMode: 'link',
  evidenceNote: 'Évaluation de cinq minutes—point de départ pratique avant un cahier des charges finalisé.',
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
