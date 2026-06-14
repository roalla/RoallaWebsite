export type BrandPillar = 'prepare' | 'transform' | 'emerge' | 'soar'

export const PILLAR_SECTION_IDS: Record<BrandPillar, string> = {
  prepare: 'pillar-prepare',
  transform: 'pillar-transform',
  emerge: 'pillar-emerge',
  soar: 'pillar-soar',
}

export const PILLAR_BADGE_KEYS: Record<
  BrandPillar,
  'pillarBadgePrepare' | 'pillarBadgeTransform' | 'pillarBadgeEmerge' | 'pillarBadgeSoar'
> = {
  prepare: 'pillarBadgePrepare',
  transform: 'pillarBadgeTransform',
  emerge: 'pillarBadgeEmerge',
  soar: 'pillarBadgeSoar',
}

export const PILLAR_TITLE_KEYS: Record<
  BrandPillar,
  'pillarPrepare' | 'pillarTransform' | 'pillarEmerge' | 'pillarSoar'
> = {
  prepare: 'pillarPrepare',
  transform: 'pillarTransform',
  emerge: 'pillarEmerge',
  soar: 'pillarSoar',
}

export const CONSULTING_PILLAR_INTRO_KEYS: Record<
  BrandPillar,
  | 'pillarPrepareIntroConsulting'
  | 'pillarTransformIntroConsulting'
  | 'pillarEmergeIntroConsulting'
  | 'pillarSoarIntroConsulting'
> = {
  prepare: 'pillarPrepareIntroConsulting',
  transform: 'pillarTransformIntroConsulting',
  emerge: 'pillarEmergeIntroConsulting',
  soar: 'pillarSoarIntroConsulting',
}

export const DIGITAL_PILLAR_INTRO_KEYS: Record<
  BrandPillar,
  | 'pillarPrepareIntroDigital'
  | 'pillarTransformIntroDigital'
  | 'pillarEmergeIntroDigital'
  | 'pillarSoarIntroDigital'
> = {
  prepare: 'pillarPrepareIntroDigital',
  transform: 'pillarTransformIntroDigital',
  emerge: 'pillarEmergeIntroDigital',
  soar: 'pillarSoarIntroDigital',
}

export const START_HERE_KEYS: Record<
  BrandPillar,
  'startHerePrepare' | 'startHereTransform' | 'startHereEmerge' | 'startHereSoar'
> = {
  prepare: 'startHerePrepare',
  transform: 'startHereTransform',
  emerge: 'startHereEmerge',
  soar: 'startHereSoar',
}

export const PILLAR_CTA_KEYS: Record<
  BrandPillar,
  'pillarCtaPrepare' | 'pillarCtaTransform' | 'pillarCtaEmerge' | 'pillarCtaSoar'
> = {
  prepare: 'pillarCtaPrepare',
  transform: 'pillarCtaTransform',
  emerge: 'pillarCtaEmerge',
  soar: 'pillarCtaSoar',
}

export const BRAND_PILLARS: BrandPillar[] = ['prepare', 'transform', 'emerge', 'soar']

/** Consulting engagement steps 1–4 on homepage and /services */
export const CONSULTING_ENGAGEMENT_STEP_PILLARS: BrandPillar[] = ['prepare', 'transform', 'emerge', 'soar']

/** Digital build strip on homepage (4 steps) */
export const HOME_BUILD_STEP_PILLARS: BrandPillar[] = ['prepare', 'transform', 'emerge', 'soar']

export const ENGAGEMENT_PHASE_LABEL_KEYS: Record<
  BrandPillar,
  | 'engagementPhasePrepare'
  | 'engagementPhaseTransform'
  | 'engagementPhaseEmerge'
  | 'engagementPhaseSoar'
> = {
  prepare: 'engagementPhasePrepare',
  transform: 'engagementPhaseTransform',
  emerge: 'engagementPhaseEmerge',
  soar: 'engagementPhaseSoar',
}

export const ENGAGEMENT_PHASE_RANGE_KEYS: Record<
  BrandPillar,
  | 'engagementStepsPrepare'
  | 'engagementStepsTransform'
  | 'engagementStepsEmerge'
  | 'engagementStepsSoar'
> = {
  prepare: 'engagementStepsPrepare',
  transform: 'engagementStepsTransform',
  emerge: 'engagementStepsEmerge',
  soar: 'engagementStepsSoar',
}

export const BUILD_PHASE_LABEL_KEYS: Record<
  BrandPillar,
  'buildPhasePrepare' | 'buildPhaseTransform' | 'buildPhaseEmerge' | 'buildPhaseSoar'
> = {
  prepare: 'buildPhasePrepare',
  transform: 'buildPhaseTransform',
  emerge: 'buildPhaseEmerge',
  soar: 'buildPhaseSoar',
}

export const BUILD_PHASE_RANGE_KEYS: Record<
  BrandPillar,
  'buildStepsPrepare' | 'buildStepsTransform' | 'buildStepsEmerge' | 'buildStepsSoar'
> = {
  prepare: 'buildStepsPrepare',
  transform: 'buildStepsTransform',
  emerge: 'buildStepsEmerge',
  soar: 'buildStepsSoar',
}
