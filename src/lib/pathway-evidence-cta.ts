import type { EstimatePath } from '@/lib/outcome-group-panels'
import type { SolutionPathId } from '@/lib/solutions-by-need'

export type PathwayEvidencePath =
  | '/tools/digital-presence-snapshot'
  | '/digital-product-discovery'
  | '/website-package'
  | '/tools/communications-value-brief'
  | '/tools/email-reach-brief'
  | '/tools/ninety-day-plan-brief'
  | '/tools/capacity-pressure-brief'
  | '/automation-opportunity-review'
  | '/ai-agent-readiness-review'
  | '/technology-decision-review'
  | '/connected-operations-review'
  | '/ai-employee-fit-review'
  | '/security-risk-coverage-review'
  | '/compliance-readiness-review'
  | '/assessment'

export type PathwayEvidenceCta = {
  pathname: PathwayEvidencePath
  label: Record<'en' | 'fr', string>
  offer?: string
  selectedProblem?: string
}

export type PathwayEstimateCta = {
  pathname: EstimatePath
  label: Record<'en' | 'fr', string>
}

/** Light estimate links for pathway pages—secondary to free evidence CTAs. */
export const pathwayEstimateCtas: Partial<Record<SolutionPathId, readonly PathwayEstimateCta[]>> = {
  visibility: [
    {
      pathname: '/visibility-improvement-estimate',
      label: {
        en: 'Estimate search and AI visibility work',
        fr: 'Estimer le travail de visibilité recherche et IA',
      },
    },
    {
      pathname: '/email-reach-estimate',
      label: {
        en: 'Estimate email setup and reach work',
        fr: 'Estimer la configuration et la portée courriel',
      },
    },
  ],
  'digital-experience': [
    {
      pathname: '/website-estimate',
      label: {
        en: 'Estimate a website launch package',
        fr: 'Estimer un forfait de lancement Web',
      },
    },
  ],
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
    pathname: '/tools/ninety-day-plan-brief',
    label: {
      en: 'Sketch a 90-day plan',
      fr: 'Esquisser un plan de 90 jours',
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
