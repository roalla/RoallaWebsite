/**
 * Thin re-export shim. Prefer `@/lib/outcome-group-panels`.
 */
import {
  getOutcomeGroupPanelCopy,
  type OutcomeGroupPanelCopy,
} from '@/lib/outcome-group-panels'

export type GrowthVisibilitySituationId = 'findability' | 'conversion' | 'ai-clarity'

export type GrowthVisibilityCopy = OutcomeGroupPanelCopy

export const growthVisibilityCopy: Record<'en' | 'fr', GrowthVisibilityCopy> = {
  en: getOutcomeGroupPanelCopy('growth-visibility', 'en'),
  fr: getOutcomeGroupPanelCopy('growth-visibility', 'fr'),
}
