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

export type OutcomeGroupSituationDetail = {
  issues: readonly string[]
  approach: string
  solutions: readonly string[]
}

export type OutcomeGroupSituation = {
  id: string
  label: string
  hint: string
  evidencePath: EvidencePath
  evidenceLabel: string
  pathwaySlug: SolutionPathId
  contactIntent: ConsultationIntent
  contactFocus?: ConsultingFocus
  detail: OutcomeGroupSituationDetail
}

export type OutcomeGroupPanelCopy = {
  resultEyebrow: string
  resultTitle: string
  resultBody: string
  situationPrompt: string
  situations: readonly OutcomeGroupSituation[]
  detailIssuesLabel: string
  detailApproachLabel: string
  detailSolutionsLabel: string
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
      detail: {
        issues: [
          'Local and organic listings are incomplete, inconsistent, or outdated.',
          'Key pages are hard for search engines to crawl or understand.',
          'Competitors appear first for the queries your buyers actually use.',
        ],
        approach:
          'Start with evidence on your live public page, then prioritize findability fixes that improve how search and AI systems describe the business—before spending on broader campaigns.',
        solutions: [
          'Digital Presence Snapshot to baseline technical and content gaps',
          'Search and local listing cleanup for accurate business identity',
          'Structured content and technical SEO so discovery paths point to the right offer',
        ],
      },
    },
    {
      id: 'conversion',
      label: 'Traffic doesn’t convert',
      hint: 'People arrive, but the path to action is unclear.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Check my website',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
      detail: {
        issues: [
          'The offer hierarchy is unclear above the fold.',
          'Calls to action compete or bury the next step.',
          'Mobile friction and trust gaps stop inquiries before they start.',
        ],
        approach:
          'Separate traffic problems from conversion problems. Use the live page as evidence, then sequence clarity, trust, and action-path changes against one measurable outcome—more qualified conversations.',
        solutions: [
          'Snapshot review of usability, trust signals, and CTA placement',
          'Landing-page hierarchy and message tightening for the primary offer',
          'Conversion-path fixes tied to inquiry quality—not vanity traffic',
        ],
      },
    },
    {
      id: 'ai-clarity',
      label: 'Search or AI misunderstands us',
      hint: 'The business is hard to describe from the public page.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Check my website',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
      detail: {
        issues: [
          'Public copy mixes services, audiences, and geographies without clear structure.',
          'Missing or weak structured data makes accurate summaries harder.',
          'AI and search answers describe a competitor, an outdated offer, or the wrong category.',
        ],
        approach:
          'Make the public page readable to people and machines: clear entities, offers, and proof. Then improve how search and AI systems can summarize you accurately.',
        solutions: [
          'Readability and entity clarity review on the public landing page',
          'Structured data and content patterns that state what you do and for whom',
          'Visibility roadmap so AI/search descriptions match the business you run today',
        ],
      },
    },
    {
      id: 'email-deliverability',
      label: 'Campaign emails aren’t reaching customers',
      hint: 'Messages land in junk or fail delivery, weakening trust and customer response.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Check email delivery',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
      detail: {
        issues: [
          'Authentication records (SPF, DKIM, DMARC) are missing, weak, or misaligned with the sending domain.',
          'Sender reputation and list hygiene problems push campaigns into junk.',
          'Customers stop trusting messages that look like phishing or never arrive.',
        ],
        approach:
          'Treat deliverability as part of public trust and visibility. Confirm domain authentication and sending practices first, then improve campaign hygiene so messages reach the inbox and earn response.',
        solutions: [
          'Domain and email authentication check through the Digital Presence Snapshot',
          'Sender identity and list-hygiene guidance tied to customer trust',
          'Visibility plan that keeps email as a reliable channel—not a spam risk',
        ],
      },
    },
  ],
  detailIssuesLabel: 'Common issues',
  detailApproachLabel: 'Our approach',
  detailSolutionsLabel: 'Example solutions',
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
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Vérifier mon site',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
      detail: {
        issues: [
          'Les fiches locales et organiques sont incomplètes, incohérentes ou périmées.',
          'Des pages clés sont difficiles à explorer ou à comprendre pour les moteurs de recherche.',
          'Les concurrents apparaissent en premier pour les requêtes que vos acheteurs utilisent vraiment.',
        ],
        approach:
          'Commencez par des preuves sur votre page publique, puis priorisez les correctifs de visibilité qui améliorent la façon dont la recherche et l’IA décrivent l’entreprise—avant d’investir dans des campagnes plus larges.',
        solutions: [
          'Aperçu de présence numérique pour établir les écarts techniques et de contenu',
          'Nettoyage des fiches recherche et locales pour une identité d’entreprise exacte',
          'Contenu structuré et SEO technique pour que les parcours de découverte mènent à la bonne offre',
        ],
      },
    },
    {
      id: 'conversion',
      label: 'Le trafic ne convertit pas',
      hint: 'Les gens arrivent, mais le chemin vers l’action est flou.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Vérifier mon site',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
      detail: {
        issues: [
          'La hiérarchie de l’offre est floue au-dessus de la ligne de flottaison.',
          'Les appels à l’action se concurrencent ou enterrent la prochaine étape.',
          'La friction mobile et les écarts de confiance stoppent les demandes avant qu’elles commencent.',
        ],
        approach:
          'Séparez les problèmes de trafic des problèmes de conversion. Utilisez la page en ligne comme preuve, puis séquencez clarté, confiance et parcours d’action selon un résultat mesurable—plus de conversations qualifiées.',
        solutions: [
          'Revue d’aperçu sur l’utilisabilité, les signaux de confiance et le placement des CTA',
          'Renforcement de la hiérarchie et du message de la page d’arrivée pour l’offre principale',
          'Correctifs de conversion liés à la qualité des demandes—pas au trafic de vanité',
        ],
      },
    },
    {
      id: 'ai-clarity',
      label: 'La recherche ou l’IA nous mal comprend',
      hint: 'L’entreprise est difficile à décrire à partir de la page publique.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Vérifier mon site',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
      detail: {
        issues: [
          'Le texte public mélange services, publics et géographies sans structure claire.',
          'Des données structurées absentes ou faibles rendent les résumés exacts plus difficiles.',
          'Les réponses IA et recherche décrivent un concurrent, une offre périmée ou la mauvaise catégorie.',
        ],
        approach:
          'Rendez la page publique lisible pour les personnes et les machines : entités, offres et preuves claires. Puis améliorez la façon dont la recherche et l’IA peuvent vous résumer avec justesse.',
        solutions: [
          'Revue de lisibilité et de clarté des entités sur la page d’arrivée publique',
          'Données structurées et modèles de contenu qui précisent ce que vous faites et pour qui',
          'Feuille de route de visibilité pour que les descriptions recherche/IA correspondent à l’entreprise d’aujourd’hui',
        ],
      },
    },
    {
      id: 'email-deliverability',
      label: 'Nos courriels n’atteignent pas les clients',
      hint: 'Les campagnes arrivent dans les indésirables ou échouent, ce qui réduit la confiance et les réponses.',
      evidencePath: '/tools/digital-presence-snapshot',
      evidenceLabel: 'Vérifier la livraison des courriels',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
      detail: {
        issues: [
          'Les enregistrements d’authentification (SPF, DKIM, DMARC) manquent, sont faibles ou mal alignés avec le domaine d’envoi.',
          'La réputation de l’expéditeur et l’hygiène des listes poussent les campagnes dans les indésirables.',
          'Les clients cessent de faire confiance aux messages qui ressemblent à du hameçonnage ou qui n’arrivent jamais.',
        ],
        approach:
          'Traitez la délivrabilité comme une partie de la confiance et de la visibilité publiques. Confirmez d’abord l’authentification du domaine et les pratiques d’envoi, puis améliorez l’hygiène des campagnes pour que les messages atteignent la boîte de réception.',
        solutions: [
          'Vérification du domaine et de l’authentification courriel via l’aperçu de présence numérique',
          'Conseils sur l’identité d’expéditeur et l’hygiène des listes liés à la confiance client',
          'Plan de visibilité qui garde le courriel comme canal fiable—pas comme risque de pourriel',
        ],
      },
    },
  ],
  detailIssuesLabel: 'Problèmes courants',
  detailApproachLabel: 'Notre approche',
  detailSolutionsLabel: 'Exemples de solutions',
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
      hint: 'The public or customer experience no longer matches the business.',
      evidencePath: '/digital-product-discovery',
      evidenceLabel: 'Start digital product discovery',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
      detail: {
        issues: [
          'The site or product still reflects an older offer, brand, or operating model.',
          'Stakeholders disagree on rebuild vs. focused refresh.',
          'Users cannot tell what to do next or why the business is relevant.',
        ],
        approach:
          'Frame the outcome and audience before tools dominate. Discovery separates presentation problems from workflow problems so the build matches what must change—not a default full rewrite.',
        solutions: [
          'Digital product discovery to capture outcome, audience, and constraints',
          'Scoped website or product experience aligned to the current offer',
          'Launch plan with measurement owners through adoption—not design handoff alone',
        ],
      },
    },
    {
      id: 'customer-journey',
      label: 'Customers hit friction online',
      hint: 'Journeys stall between discovery, choice, and contact.',
      evidencePath: '/website-package',
      evidenceLabel: 'Review website package options',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
      detail: {
        issues: [
          'Prospects bounce between pages without a clear path to contact or purchase.',
          'Forms, booking, or handoffs create drop-off at the moment of intent.',
          'Mobile journeys break the flow that works on desktop.',
        ],
        approach:
          'Map the customer journey from discovery to action, then remove the highest-friction steps first. Prefer scoped experience changes over open-ended rebuilds when the bottleneck is task completion.',
        solutions: [
          'Website package review against conversion and journey goals',
          'Path fixes for offer clarity, forms, and contact handoffs',
          'Measured experience updates that improve completion—not just aesthetics',
        ],
      },
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
      detail: {
        issues: [
          'Call routing, voicemail, or contact-centre tools create missed opportunities.',
          'Teams collaborate across too many disconnected apps.',
          'Customers experience inconsistent follow-up between phone, chat, and email.',
        ],
        approach:
          'Clarify the communications outcome and operating constraints before selecting platforms. Compare options on the same criteria—reliability, adoption, cost, and customer experience.',
        solutions: [
          'Communications Value Brief to frame requirements and success measures',
          'Technology Advisory shortlist for phone, contact centre, or collaboration',
          'Transition plan with owners so tools support the journey—not add noise',
        ],
      },
    },
  ],
  detailIssuesLabel: 'Common issues',
  detailApproachLabel: 'Our approach',
  detailSolutionsLabel: 'Example solutions',
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
      detail: {
        issues: [
          'Le site ou le produit reflète encore une offre, une marque ou un modèle d’exploitation plus ancien.',
          'Les parties prenantes ne s’entendent pas sur une refonte vs un rafraîchissement ciblé.',
          'Les utilisateurs ne voient pas la prochaine étape ni pourquoi l’entreprise est pertinente.',
        ],
        approach:
          'Cadrez le résultat et le public avant que les outils dominent. La découverte sépare les problèmes de présentation des problèmes de flux pour que la réalisation corresponde à ce qui doit changer—pas une réécriture par défaut.',
        solutions: [
          'Découverte produit numérique pour capturer résultat, public et contraintes',
          'Expérience de site ou de produit cadré selon l’offre actuelle',
          'Plan de lancement avec responsables de mesure jusqu’à l’adoption—pas seulement une remise de design',
        ],
      },
    },
    {
      id: 'customer-journey',
      label: 'Les clients rencontrent de la friction en ligne',
      hint: 'Les parcours bloquent entre découverte, choix et contact.',
      evidencePath: '/website-package',
      evidenceLabel: 'Voir les options de forfait site Web',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
      detail: {
        issues: [
          'Les prospects rebondissent entre les pages sans chemin clair vers le contact ou l’achat.',
          'Formulaires, réservations ou transferts créent des abandons au moment de l’intention.',
          'Les parcours mobiles cassent le flux qui fonctionne sur ordinateur.',
        ],
        approach:
          'Cartographiez le parcours client de la découverte à l’action, puis retirez d’abord les étapes les plus frictionnelles. Préférez des changements d’expérience ciblés à une refonte ouverte lorsque le goulot est l’accomplissement de tâches.',
        solutions: [
          'Revue de forfait site Web selon les objectifs de conversion et de parcours',
          'Correctifs de chemin pour la clarté de l’offre, les formulaires et les transferts de contact',
          'Mises à jour d’expérience mesurées qui améliorent l’achèvement—pas seulement l’esthétique',
        ],
      },
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
      detail: {
        issues: [
          'Le routage d’appels, la messagerie vocale ou les outils de centre de contact font rater des occasions.',
          'Les équipes collaborent via trop d’applications déconnectées.',
          'Les clients vivent un suivi incohérent entre téléphone, clavardage et courriel.',
        ],
        approach:
          'Clarifiez le résultat de communications et les contraintes d’exploitation avant de choisir des plateformes. Comparez les options selon les mêmes critères—fiabilité, adoption, coût et expérience client.',
        solutions: [
          'Brief valeur communications pour cadrer exigences et mesures de succès',
          'Shortlist de conseil technologique pour téléphonie, centre de contact ou collaboration',
          'Plan de transition avec responsables pour que les outils soutiennent le parcours—sans ajouter de bruit',
        ],
      },
    },
  ],
  detailIssuesLabel: 'Problèmes courants',
  detailApproachLabel: 'Notre approche',
  detailSolutionsLabel: 'Exemples de solutions',
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
      detail: {
        issues: [
          'The same data is typed into multiple systems after every handoff.',
          'Errors and rework grow when people copy between tools under time pressure.',
          'Leaders cannot see where cycle time is lost across the workflow.',
        ],
        approach:
          'Rank workflows by volume, friction, and failure modes before connecting tools. Automate the highest-value repeatable steps with clear exception ownership—so humans stay accountable where judgment matters.',
        solutions: [
          'Automation opportunity review to prioritize candidate workflows',
          'System integration that removes duplicate entry at handoffs',
          'Controlled task automation with measures for time saved and error rate',
        ],
      },
    },
    {
      id: 'staffing-capacity',
      label: 'We can’t hire or keep enough people',
      hint: 'Work stays with a thin team; quality and speed slip.',
      evidencePath: '/ai-agent-readiness-review',
      evidenceLabel: 'Start AI agent readiness review',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
      detail: {
        issues: [
          'Open roles stay unfilled while workload keeps rising.',
          'Turnover concentrates knowledge in a few people who become bottlenecks.',
          'Quality slips when remaining staff absorb overflow without better tooling.',
        ],
        approach:
          'Find repeatable work that a governed agent or automation can carry with human review proportional to risk. Start where volume and accountability already exist—not with a demo that lacks exception owners.',
        solutions: [
          'AI agent readiness review for high-volume candidate workflows',
          'Governed agents with escalation paths for exceptions',
          'Pilot measures for containment, handoff quality, and capacity released',
        ],
      },
    },
    {
      id: 'peak-continuity',
      label: 'Peak demand breaks our coverage',
      hint: 'Volume jumps and service consistency is at risk.',
      evidencePath: '/automation-opportunity-review',
      evidenceLabel: 'Start automation opportunity review',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
      detail: {
        issues: [
          'Seasonal or campaign spikes overload the same thin team.',
          'Service quality and response times degrade exactly when customers need you most.',
          'Temporary staffing is hard to find or too expensive for short peaks.',
        ],
        approach:
          'Design for peak load: identify work that can be automated or agent-assisted during surges while keeping humans on exceptions and relationship moments that protect trust and loyalty.',
        solutions: [
          'Automation opportunity review focused on peak-volume workflows',
          'Overflow handling with approved automations and clear escalation',
          'Continuity measures for response time and customer trust during spikes',
        ],
      },
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
      detail: {
        issues: [
          'Sensors and systems generate alerts without clear owners or next steps.',
          'Data is collected but not connected to the decisions operations must make.',
          'Tool sprawl makes monitoring noisy instead of actionable.',
        ],
        approach:
          'Clarify the operating outcome and decision criteria before adding more devices or platforms. Connect signals to owned actions so monitoring becomes a path to response—not another dashboard.',
        solutions: [
          'Technology decision review for requirements and success criteria',
          'Operating model that assigns alert ownership and escalation',
          'Connected operations path that turns IoT data into measurable action',
        ],
      },
    },
  ],
  detailIssuesLabel: 'Common issues',
  detailApproachLabel: 'Our approach',
  detailSolutionsLabel: 'Example solutions',
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
      detail: {
        issues: [
          'Les mêmes données sont saisies dans plusieurs systèmes après chaque transfert.',
          'Erreurs et reprise augmentent lorsque les gens copient entre outils sous pression.',
          'La direction ne voit pas où le temps de cycle se perd dans le flux.',
        ],
        approach:
          'Classez les flux selon le volume, la friction et les modes de défaillance avant de connecter des outils. Automatisez les étapes répétables à plus forte valeur avec une propriété claire des exceptions—pour que les humains restent responsables là où le jugement compte.',
        solutions: [
          'Revue d’occasions d’automatisation pour prioriser les flux candidats',
          'Intégration des systèmes qui élimine la double saisie aux transferts',
          'Automatisation contrôlée des tâches avec mesures de temps gagné et de taux d’erreur',
        ],
      },
    },
    {
      id: 'staffing-capacity',
      label: 'Nous n’arrivons pas à embaucher ou à retenir assez de gens',
      hint: 'Le travail reste sur une équipe mince; qualité et vitesse glissent.',
      evidencePath: '/ai-agent-readiness-review',
      evidenceLabel: 'Commencer la revue de préparation aux agents IA',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
      detail: {
        issues: [
          'Les postes ouverts restent vacants pendant que la charge continue d’augmenter.',
          'Le roulement concentre le savoir chez quelques personnes qui deviennent des goulots.',
          'La qualité glisse lorsque le personnel restant absorbe le surplus sans meilleurs outils.',
        ],
        approach:
          'Repérez le travail répétable qu’un agent gouverné ou une automatisation peut porter avec une révision humaine proportionnelle au risque. Commencez là où volume et responsabilisation existent déjà—pas avec une démo sans propriétaire d’exceptions.',
        solutions: [
          'Revue de préparation aux agents IA pour les flux à fort volume',
          'Agents gouvernés avec parcours d’escalade pour les exceptions',
          'Mesures de pilote pour confinement, qualité des transferts et capacité libérée',
        ],
      },
    },
    {
      id: 'peak-continuity',
      label: 'Les pics de demande cassent notre couverture',
      hint: 'Le volume monte et la constance du service est à risque.',
      evidencePath: '/automation-opportunity-review',
      evidenceLabel: 'Commencer la revue d’occasions d’automatisation',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
      detail: {
        issues: [
          'Les pics saisonniers ou de campagne surchargent la même équipe mince.',
          'Qualité de service et délais de réponse se dégradent exactement quand les clients en ont le plus besoin.',
          'Le personnel temporaire est difficile à trouver ou trop coûteux pour de courts pics.',
        ],
        approach:
          'Concevez pour la charge de pointe : identifiez le travail automatisable ou assisté par agent pendant les surcharges tout en gardant les humains sur les exceptions et les moments relationnels qui protègent confiance et loyauté.',
        solutions: [
          'Revue d’occasions d’automatisation centrée sur les flux à volume de pointe',
          'Gestion du débordement avec automatisations approuvées et escalade claire',
          'Mesures de continuité pour délai de réponse et confiance client pendant les pics',
        ],
      },
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
      detail: {
        issues: [
          'Capteurs et systèmes génèrent des alertes sans responsables ni prochaines étapes clairs.',
          'Les données sont collectées mais non reliées aux décisions que les opérations doivent prendre.',
          'La prolifération d’outils rend la surveillance bruyante plutôt qu’actionnable.',
        ],
        approach:
          'Clarifiez le résultat opérationnel et les critères de décision avant d’ajouter appareils ou plateformes. Reliez les signaux à des actions assumées pour que la surveillance devienne un parcours de réponse—pas un autre tableau de bord.',
        solutions: [
          'Revue de décision technologique pour exigences et critères de succès',
          'Modèle d’exploitation qui assigne propriété des alertes et escalade',
          'Parcours d’opérations connectées qui transforme les données IdO en action mesurable',
        ],
      },
    },
  ],
  detailIssuesLabel: 'Problèmes courants',
  detailApproachLabel: 'Notre approche',
  detailSolutionsLabel: 'Exemples de solutions',
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
      detail: {
        issues: [
          'Questionnaires and customer diligence expose controls you cannot evidence clearly.',
          'Gaps are known anecdotally but not prioritized against residual risk.',
          'Vendors pitch products before obligations and ownership are written down.',
        ],
        approach:
          'Lock requirements, residual-risk tolerance, and control ownership before demos. Score options on the same criteria so the shortlist is comparable and disclosure-ready.',
        solutions: [
          'Technology decision review focused on security obligations and criteria',
          'Prioritized gap list with owners and remediation sequence',
          'Security, Risk & Compliance support through accountable transition',
        ],
      },
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
      detail: {
        issues: [
          'Migration options compete without shared cost, risk, and operating criteria.',
          'Nobody owns day-2 operations after a cloud or hosting change.',
          'Spend grows while reliability and clarity of ownership stay flat.',
        ],
        approach:
          'Decide infrastructure against explicit requirements—workload, cost, support, and operating model—before selecting a platform. Make ownership part of the decision, not an afterthought.',
        solutions: [
          'Decision review that compares cloud and infrastructure options on the same scorecard',
          'Operating ownership model for run, support, and cost accountability',
          'Transition plan sequenced to reduce risk during migration',
        ],
      },
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
      detail: {
        issues: [
          'Outages or slow links interrupt sites, users, or critical systems.',
          'Single points of failure are known but not funded or sequenced.',
          'Network changes are treated as product buys without resilience criteria.',
        ],
        approach:
          'Define resilience requirements and acceptable downtime first. Compare connectivity options against those constraints, then sequence changes that improve reliability where the business feels it.',
        solutions: [
          'Decision review for network resilience requirements and criteria',
          'Shortlist of connectivity approaches scored for uptime and recovery',
          'Implementation path that reduces single points of failure with clear owners',
        ],
      },
    },
  ],
  detailIssuesLabel: 'Common issues',
  detailApproachLabel: 'Our approach',
  detailSolutionsLabel: 'Example solutions',
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
      detail: {
        issues: [
          'Questionnaires et diligences clients exposent des contrôles que vous ne pouvez pas prouver clairement.',
          'Les écarts sont connus de façon anecdotique mais non priorisés selon le risque résiduel.',
          'Les fournisseurs présentent des produits avant que obligations et responsabilités soient écrites.',
        ],
        approach:
          'Fixez exigences, tolérance au risque résiduel et responsabilité des contrôles avant les démos. Notez les options selon les mêmes critères pour une shortlist comparable et prête à la divulgation.',
        solutions: [
          'Revue de décision technologique centrée sur obligations et critères de sécurité',
          'Liste priorisée d’écarts avec responsables et séquence de remédiation',
          'Soutien Sécurité, risque et conformité jusqu’à une transition responsabilisée',
        ],
      },
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
      detail: {
        issues: [
          'Les options de migration se concurrencent sans critères partagés de coût, risque et exploitation.',
          'Personne n’assume l’exploitation au jour 2 après un changement d’infonuagique ou d’hébergement.',
          'Les dépenses augmentent pendant que fiabilité et clarté des responsabilités stagnent.',
        ],
        approach:
          'Décidez de l’infrastructure selon des exigences explicites—charge, coût, soutien et modèle d’exploitation—avant de choisir une plateforme. Intégrez la responsabilité dans la décision, pas après coup.',
        solutions: [
          'Revue de décision qui compare options cloud et infrastructure sur le même tableau de bord',
          'Modèle de responsabilité d’exploitation pour run, soutien et coûts',
          'Plan de transition séquencé pour réduire le risque pendant la migration',
        ],
      },
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
      detail: {
        issues: [
          'Pannes ou liens lents interrompent sites, utilisateurs ou systèmes critiques.',
          'Les points de défaillance uniques sont connus mais non financés ni séquencés.',
          'Les changements réseau sont traités comme des achats de produits sans critères de résilience.',
        ],
        approach:
          'Définissez d’abord les exigences de résilience et le temps d’arrêt acceptable. Comparez les options de connectivité selon ces contraintes, puis séquencez les changements qui améliorent la fiabilité là où l’entreprise la ressent.',
        solutions: [
          'Revue de décision pour exigences et critères de résilience réseau',
          'Shortlist d’approches de connectivité notées pour disponibilité et reprise',
          'Parcours de mise en œuvre qui réduit les points de défaillance uniques avec responsables clairs',
        ],
      },
    },
  ],
  detailIssuesLabel: 'Problèmes courants',
  detailApproachLabel: 'Notre approche',
  detailSolutionsLabel: 'Exemples de solutions',
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
      detail: {
        issues: [
          'Everything is labeled urgent, so nothing stays sequenced.',
          'Teams start many initiatives and finish few of them.',
          'Leaders cannot name the one outcome measure that ranks trade-offs.',
        ],
        approach:
          'Rank competing priorities against one outcome measure and a realistic horizon. Build a 90-day sequence the team can actually carry—fewer P1s, clearer choices, visible progress.',
        solutions: [
          '5-minute assessment to name the pressure and constraints',
          '90-day priority sequence with explicit trade-offs',
          'Business Advisory through implementation support—not a longer roadmap deck',
        ],
      },
    },
    {
      id: 'plans-stall',
      label: 'Plans stall between meetings',
      hint: 'Strategy exists, but follow-through breaks down.',
      evidencePath: '/assessment',
      evidenceLabel: 'Take the 5-minute assessment',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
      detail: {
        issues: [
          'Strategy documents exist, but work does not move between meetings.',
          'Status updates replace decisions and owned next steps.',
          'Cadence collapses when the next planning cycle starts without review habits.',
        ],
        approach:
          'Replace meeting-heavy status with an operating rhythm: owners, milestones, and a short review cadence. Keep advisory present through follow-through—not a one-off strategy session.',
        solutions: [
          'Assessment to locate where follow-through breaks',
          'Weekly review rhythm with decision rights and next actions',
          'Advisory support that carries the plan through the first execution cycles',
        ],
      },
    },
    {
      id: 'unclear-ownership',
      label: 'Ownership or measures are unclear',
      hint: 'Decision rights and accountability are fuzzy.',
      evidencePath: '/assessment',
      evidenceLabel: 'Take the 5-minute assessment',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
      detail: {
        issues: [
          'Decisions bounce between people because rights are undefined.',
          'Measures are missing, conflicting, or unused in reviews.',
          'Accountability is shared so widely that nobody owns the result.',
        ],
        approach:
          'Assign decision rights and outcome measures before the next planning cycle. Make ownership visible in the operating rhythm so progress is reviewable without adding headcount.',
        solutions: [
          'Assessment focused on ownership and measurement gaps',
          'Decision-rights map tied to a small set of outcome measures',
          'Execution cadence where owners report progress against those measures',
        ],
      },
    },
  ],
  detailIssuesLabel: 'Common issues',
  detailApproachLabel: 'Our approach',
  detailSolutionsLabel: 'Example solutions',
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
      detail: {
        issues: [
          'Tout est étiqueté urgent, donc rien ne reste séquencé.',
          'Les équipes démarrent beaucoup d’initiatives et en terminent peu.',
          'La direction ne peut pas nommer la seule mesure de résultat qui classe les arbitrages.',
        ],
        approach:
          'Classez les priorités concurrentes selon une seule mesure de résultat et un horizon réaliste. Construisez une séquence de 90 jours que l’équipe peut vraiment porter—moins de P1, des choix plus clairs, un progrès visible.',
        solutions: [
          'Évaluation de 5 minutes pour nommer la pression et les contraintes',
          'Séquence de priorités sur 90 jours avec arbitrages explicites',
          'Conseil d’affaires jusqu’au soutien à la mise en œuvre—pas un deck de feuille de route plus long',
        ],
      },
    },
    {
      id: 'plans-stall',
      label: 'Les plans bloquent entre les réunions',
      hint: 'La stratégie existe, mais le suivi s’effondre.',
      evidencePath: '/assessment',
      evidenceLabel: 'Faire l’évaluation de 5 minutes',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
      detail: {
        issues: [
          'Les documents de stratégie existent, mais le travail n’avance pas entre les réunions.',
          'Les mises à jour de statut remplacent décisions et prochaines étapes assumées.',
          'La cadence s’effondre lorsque le prochain cycle de planification démarre sans habitudes de revue.',
        ],
        approach:
          'Remplacez le statut centré sur les réunions par un rythme opérationnel : responsables, jalons et courte cadence de revue. Gardez le conseil présent dans le suivi—pas une séance stratégique ponctuelle.',
        solutions: [
          'Évaluation pour localiser où le suivi se brise',
          'Rythme de revue hebdomadaire avec droits de décision et prochaines actions',
          'Soutien-conseil qui porte le plan à travers les premiers cycles d’exécution',
        ],
      },
    },
    {
      id: 'unclear-ownership',
      label: 'Les responsabilités ou mesures sont floues',
      hint: 'Les droits de décision et la responsabilisation sont ambigus.',
      evidencePath: '/assessment',
      evidenceLabel: 'Faire l’évaluation de 5 minutes',
      pathwaySlug: 'strategy',
      contactIntent: 'consulting',
      detail: {
        issues: [
          'Les décisions rebondissent entre personnes parce que les droits sont indéfinis.',
          'Les mesures manquent, se contredisent ou ne sont pas utilisées en revue.',
          'La responsabilisation est si partagée que personne n’assume le résultat.',
        ],
        approach:
          'Assignez droits de décision et mesures de résultat avant le prochain cycle de planification. Rendez la responsabilité visible dans le rythme opérationnel pour que le progrès soit revuable sans ajouter d’effectifs.',
        solutions: [
          'Évaluation centrée sur les écarts de responsabilité et de mesure',
          'Carte des droits de décision liée à un petit ensemble de mesures de résultat',
          'Cadence d’exécution où les responsables rapportent le progrès selon ces mesures',
        ],
      },
    },
  ],
  detailIssuesLabel: 'Problèmes courants',
  detailApproachLabel: 'Notre approche',
  detailSolutionsLabel: 'Exemples de solutions',
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
