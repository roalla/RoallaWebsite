export type BrandPillar = 'transform' | 'emerge' | 'soar'

export const PILLAR_SECTION_IDS: Record<BrandPillar, string> = {
  transform: 'pillar-transform',
  emerge: 'pillar-emerge',
  soar: 'pillar-soar',
}

export const PILLAR_BADGE_KEYS: Record<BrandPillar, 'pillarBadgeTransform' | 'pillarBadgeEmerge' | 'pillarBadgeSoar'> = {
  transform: 'pillarBadgeTransform',
  emerge: 'pillarBadgeEmerge',
  soar: 'pillarBadgeSoar',
}

export const PILLAR_TITLE_KEYS: Record<BrandPillar, 'pillarTransform' | 'pillarEmerge' | 'pillarSoar'> = {
  transform: 'pillarTransform',
  emerge: 'pillarEmerge',
  soar: 'pillarSoar',
}

export const CONSULTING_PILLAR_INTRO_KEYS: Record<
  BrandPillar,
  'pillarTransformIntroConsulting' | 'pillarEmergeIntroConsulting' | 'pillarSoarIntroConsulting'
> = {
  transform: 'pillarTransformIntroConsulting',
  emerge: 'pillarEmergeIntroConsulting',
  soar: 'pillarSoarIntroConsulting',
}

export const DIGITAL_PILLAR_INTRO_KEYS: Record<
  BrandPillar,
  'pillarTransformIntroDigital' | 'pillarEmergeIntroDigital' | 'pillarSoarIntroDigital'
> = {
  transform: 'pillarTransformIntroDigital',
  emerge: 'pillarEmergeIntroDigital',
  soar: 'pillarSoarIntroDigital',
}

export const START_HERE_KEYS: Record<BrandPillar, 'startHereTransform' | 'startHereEmerge' | 'startHereSoar'> = {
  transform: 'startHereTransform',
  emerge: 'startHereEmerge',
  soar: 'startHereSoar',
}

export const PILLAR_CTA_KEYS: Record<BrandPillar, 'pillarCtaTransform' | 'pillarCtaEmerge' | 'pillarCtaSoar'> = {
  transform: 'pillarCtaTransform',
  emerge: 'pillarCtaEmerge',
  soar: 'pillarCtaSoar',
}

export const BRAND_PILLARS: BrandPillar[] = ['transform', 'emerge', 'soar']
