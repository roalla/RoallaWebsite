export type ServiceActionServiceId =
  | 'search-ai-visibility'
  | 'ai-agents'
  | 'security'
  | 'managed-optimization'
  | 'digital-products'

export type ServiceActionTileIcon =
  | 'search'
  | 'estimate'
  | 'snapshot'
  | 'bot'
  | 'workflow'
  | 'shield'
  | 'need'
  | 'proof'
  | 'health'
  | 'monitor'
  | 'blueprint'
  | 'discover'
  | 'portfolio'

export type ServiceActionTile = {
  id: string
  icon: ServiceActionTileIcon
  href: string
  label: { en: string; fr: string }
  outcome: { en: string; fr: string }
  cta: { en: string; fr: string }
}

export type ServiceActionBand = {
  eyebrow: { en: string; fr: string }
  title: { en: string; fr: string }
  description: { en: string; fr: string }
  tiles: readonly ServiceActionTile[]
}

const chrome = {
  eyebrow: { en: 'Start with evidence', fr: 'Commencez par des preuves' },
  title: {
    en: 'Choose the practical next step',
    fr: 'Choisissez la prochaine étape pratique',
  },
  description: {
    en: 'Pick the pressure that matches your situation. Each path opens a short review or estimate—no retainer required to begin.',
    fr: 'Choisissez la pression qui correspond à votre situation. Chaque parcours ouvre une courte revue ou estimation—sans mandat pour commencer.',
  },
} as const

export const serviceActionBands: Record<ServiceActionServiceId, ServiceActionBand> = {
  'search-ai-visibility': {
    ...chrome,
    tiles: [
      {
        id: 'ai-visibility-review',
        icon: 'search',
        href: '/website-ai-visibility-review',
        label: {
          en: 'Search or AI misunderstands us',
          fr: 'La recherche ou l’IA nous comprend mal',
        },
        outcome: {
          en: 'Get a free website and AI readability review on your live page.',
          fr: 'Obtenez une revue gratuite de lisibilité Web et IA sur votre page en ligne.',
        },
        cta: {
          en: 'Run the free website & AI review',
          fr: 'Lancer l’évaluation Web et IA gratuite',
        },
      },
      {
        id: 'visibility-estimate',
        icon: 'estimate',
        href: '/visibility-improvement-estimate',
        label: {
          en: 'We need a clear visibility scope',
          fr: 'Nous avons besoin d’une portée de visibilité claire',
        },
        outcome: {
          en: 'Estimate the search and AI visibility work before you commit budget.',
          fr: 'Estimez le travail de visibilité recherche et IA avant d’engager un budget.',
        },
        cta: {
          en: 'Estimate visibility work',
          fr: 'Estimer le travail de visibilité',
        },
      },
      {
        id: 'presence-snapshot',
        icon: 'snapshot',
        href: '/tools/digital-presence-snapshot',
        label: {
          en: 'We need a fast public-page baseline',
          fr: 'Nous avons besoin d’un point de départ rapide',
        },
        outcome: {
          en: 'Snapshot performance, search readiness, and social setup—no email required.',
          fr: 'Instantané performance, préparation recherche et réseaux—sans courriel.',
        },
        cta: {
          en: 'Run the digital presence snapshot',
          fr: 'Lancer l’instantané de présence numérique',
        },
      },
    ],
  },
  'ai-agents': {
    ...chrome,
    tiles: [
      {
        id: 'agent-readiness',
        icon: 'bot',
        href: '/ai-agent-readiness-review',
        label: {
          en: 'We want an AI agent—but need controls',
          fr: 'Nous voulons un agent IA—avec des contrôles',
        },
        outcome: {
          en: 'Separate a governable use case from an impressive demo before connecting systems.',
          fr: 'Distinguez un cas d’usage gouvernable d’une démo avant de connecter les systèmes.',
        },
        cta: {
          en: 'Start the AI Agent Readiness Review',
          fr: 'Lancer la revue de préparation aux agents IA',
        },
      },
      {
        id: 'ai-employee-fit',
        icon: 'workflow',
        href: '/tools/ai-employee-fit-brief',
        label: {
          en: 'We need an AI Employee on the frontline',
          fr: 'Nous avons besoin d’un employé IA en première ligne',
        },
        outcome: {
          en: 'Build a short fit brief for industry, audience, and approved actions.',
          fr: 'Créez un court brief d’adéquation pour l’industrie, le public et les actions approuvées.',
        },
        cta: {
          en: 'Build the AI Employee Fit Brief',
          fr: 'Créer le brief d’adéquation employé IA',
        },
      },
      {
        id: 'automation-first',
        icon: 'estimate',
        href: '/automation-opportunity-review',
        label: {
          en: 'Automate the work before adding agents',
          fr: 'Automatiser le travail avant d’ajouter des agents',
        },
        outcome: {
          en: 'Find which repeatable work is worth automating first.',
          fr: 'Trouvez quel travail répétitif vaut la peine d’être automatisé en premier.',
        },
        cta: {
          en: 'Start the Automation Opportunity Review',
          fr: 'Lancer la revue des occasions d’automatisation',
        },
      },
    ],
  },
  security: {
    ...chrome,
    tiles: [
      {
        id: 'coverage-review',
        icon: 'shield',
        href: '/security-risk-coverage-review',
        label: {
          en: 'Coverage feels thin or unclear',
          fr: 'La couverture semble faible ou floue',
        },
        outcome: {
          en: 'Turn scattered concerns into prioritized risk, ownership, and next steps.',
          fr: 'Transformez des préoccupations dispersées en risques priorisés, responsabilités et prochaines étapes.',
        },
        cta: {
          en: 'Start the Security Risk Coverage Review',
          fr: 'Lancer la revue de couverture des risques',
        },
      },
      {
        id: 'security-situations',
        icon: 'need',
        href: '/solutions/need/security-compliance',
        label: {
          en: 'We need to match a security situation',
          fr: 'Nous devons faire correspondre une situation de sécurité',
        },
        outcome: {
          en: 'Explore common security and compliance pressures and practical pathways.',
          fr: 'Explorez les pressions courantes de sécurité et conformité et les parcours pratiques.',
        },
        cta: {
          en: 'Explore security situations',
          fr: 'Explorer les situations de sécurité',
        },
      },
      {
        id: 'grc-proof',
        icon: 'proof',
        href: '/services/portfolio/grcstatus',
        label: {
          en: 'Show me how readiness is organized',
          fr: 'Montrez-moi comment la préparation est organisée',
        },
        outcome: {
          en: 'See a live compliance readiness application ROALLA built and operates.',
          fr: 'Voyez une application de préparation à la conformité construite et opérée par ROALLA.',
        },
        cta: {
          en: 'View GRC Status',
          fr: 'Voir GRC Status',
        },
      },
    ],
  },
  'managed-optimization': {
    ...chrome,
    tiles: [
      {
        id: 'asset-health',
        icon: 'health',
        href: '/digital-asset-health-review',
        label: {
          en: 'Our live digital assets feel neglected',
          fr: 'Nos actifs numériques en ligne semblent négligés',
        },
        outcome: {
          en: 'Baseline health, risk, and improvement priorities on what already ships.',
          fr: 'Établissez santé, risques et priorités d’amélioration sur ce qui est déjà en production.',
        },
        cta: {
          en: 'Start the Digital Asset Health Review',
          fr: 'Lancer la revue de santé des actifs numériques',
        },
      },
      {
        id: 'monitoring',
        icon: 'monitor',
        href: '/tools/digital-monitoring-dashboard',
        label: {
          en: 'We lack a visible operating rhythm',
          fr: 'Il nous manque un rythme d’exploitation visible',
        },
        outcome: {
          en: 'Preview how ROALLA tracks digital change over time with private baselines.',
          fr: 'Prévisualisez comment ROALLA suit le changement numérique avec des références privées.',
        },
        cta: {
          en: 'Open the monitoring preview',
          fr: 'Ouvrir la prévisualisation de suivi',
        },
      },
      {
        id: 'value-blueprint',
        icon: 'blueprint',
        href: '/tools/digital-value-blueprint',
        label: {
          en: 'We need a 90-day improvement plan',
          fr: 'Nous avons besoin d’un plan d’amélioration sur 90 jours',
        },
        outcome: {
          en: 'Turn one digital priority into a practical 30 / 60 / 90-day direction.',
          fr: 'Transformez une priorité numérique en direction pratique sur 30 / 60 / 90 jours.',
        },
        cta: {
          en: 'Build my value plan',
          fr: 'Créer mon plan de valeur',
        },
      },
    ],
  },
  'digital-products': {
    ...chrome,
    tiles: [
      {
        id: 'product-discovery',
        icon: 'discover',
        href: '/digital-product-discovery',
        label: {
          en: 'We need the smallest useful product',
          fr: 'Nous avons besoin du plus petit produit utile',
        },
        outcome: {
          en: 'Connect one audience, one journey, and one measurable outcome before a build.',
          fr: 'Reliez un public, un parcours et un résultat mesurable avant de construire.',
        },
        cta: {
          en: 'Start Digital Product Discovery',
          fr: 'Lancer la découverte de produit numérique',
        },
      },
      {
        id: 'website-estimate',
        icon: 'estimate',
        href: '/website-estimate',
        label: {
          en: 'A website may be the right first step',
          fr: 'Un site Web pourrait être la bonne première étape',
        },
        outcome: {
          en: 'Get scope and investment ranges for a practical launch package.',
          fr: 'Obtenez portée et fourchettes d’investissement pour un lancement pratique.',
        },
        cta: {
          en: 'Estimate a website launch',
          fr: 'Estimer un lancement de site Web',
        },
      },
      {
        id: 'portfolio',
        icon: 'portfolio',
        href: '/services/portfolio/digital-products',
        label: {
          en: 'Show me live product examples',
          fr: 'Montrez-moi des exemples de produits en ligne',
        },
        outcome: {
          en: 'Browse production platforms and apps ROALLA designed, built, and launched.',
          fr: 'Parcourez les plateformes et applis en production conçues et lancées par ROALLA.',
        },
        cta: {
          en: 'View digital products portfolio',
          fr: 'Voir le portfolio de produits numériques',
        },
      },
    ],
  },
}

export function getServiceActionBand(serviceId: ServiceActionServiceId): ServiceActionBand {
  return serviceActionBands[serviceId]
}

export function attributedServiceTileHref(href: string, serviceId: ServiceActionServiceId, tileId: string) {
  const url = new URL(href, 'https://www.roalla.com')
  url.searchParams.set('campaign', `service-${serviceId}`)
  url.searchParams.set('conversion_source', 'service_action_tile')
  url.searchParams.set('signal', tileId)
  return `${url.pathname}${url.search}`
}
