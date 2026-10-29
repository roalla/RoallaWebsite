import type { SolutionPathId } from '@/lib/solutions-by-need'

export type PathwayEvidencePath =
  | '/tools/digital-presence-snapshot'
  | '/digital-product-discovery'
  | '/website-package'
  | '/tools/communications-value-brief'
  | '/automation-opportunity-review'
  | '/ai-agent-readiness-review'
  | '/technology-decision-review'
  | '/assessment'

export type PathwayEvidenceCta = {
  pathname: PathwayEvidencePath
  label: Record<'en' | 'fr', string>
  offer?: string
  selectedProblem?: string
}

/** Free brief/review entry points already used on the solutions hub. */
export const pathwayEvidenceCtas: Partial<Record<SolutionPathId, PathwayEvidenceCta>> = {
  visibility: {
    pathname: '/tools/digital-presence-snapshot',
    label: { en: 'Check my website', fr: 'Vérifier mon site' },
    offer: 'free-automated-visibility-snapshot',
    selectedProblem: 'website-and-ai-visibility',
  },
  'digital-experience': {
    pathname: '/digital-product-discovery',
    label: {
      en: 'Start digital product discovery',
      fr: 'Commencer la découverte produit numérique',
    },
  },
  communications: {
    pathname: '/tools/communications-value-brief',
    label: {
      en: 'Open Communications Value Brief',
      fr: 'Ouvrir le brief valeur communications',
    },
  },
  'automation-ai': {
    pathname: '/automation-opportunity-review',
    label: {
      en: 'Start automation opportunity review',
      fr: 'Commencer la revue d’occasions d’automatisation',
    },
  },
  strategy: {
    pathname: '/assessment',
    label: {
      en: 'Take the 5-minute assessment',
      fr: 'Faire l’évaluation de 5 minutes',
    },
  },
  security: {
    pathname: '/technology-decision-review',
    label: {
      en: 'Start technology decision review',
      fr: 'Commencer la revue de décision technologique',
    },
  },
  'cloud-infrastructure': {
    pathname: '/technology-decision-review',
    label: {
      en: 'Start technology decision review',
      fr: 'Commencer la revue de décision technologique',
    },
  },
  network: {
    pathname: '/technology-decision-review',
    label: {
      en: 'Start technology decision review',
      fr: 'Commencer la revue de décision technologique',
    },
  },
  iot: {
    pathname: '/technology-decision-review',
    label: {
      en: 'Start technology decision review',
      fr: 'Commencer la revue de décision technologique',
    },
  },
}
