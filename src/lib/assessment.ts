import type { BrandPillar } from '@/lib/brand-journey'
import type { ConsultationIntent, ConsultingFocus } from '@/lib/consultation-request'
import type { OutcomeGroupId } from '@/lib/solution-outcome-pages'
import { useCaseHrefForAssessment, type UseCasePageHref } from '@/lib/use-cases'

/** Free evidence/review entry points shown as tertiary result CTAs when the lane makes one obvious. */
export type AssessmentEvidencePath =
  | '/tools/digital-presence-snapshot'
  | '/ai-agent-readiness-review'
  | '/security-risk-coverage-review'
  | '/digital-product-discovery'

export type AssessmentLane =
  | 'consulting'
  | 'technology'
  | 'digital'
  | 'website'
  | 'platform'
  | 'automation'
  | 'ai'
  | 'agentic'
  | 'security'
  | 'visibility'
  | 'workshop'
  | 'event'
  | 'unsure'

export type AssessmentActionStage =
  | 'advise'
  | 'source'
  | 'agentic'
  | 'build'
  | 'connect'
  | 'improve'

export type AssessmentDirection =
  | 'advise'
  | 'source'
  | 'build'
  | 'agentic'
  | 'improve'

export type AssessmentServiceKey =
  | 'strategy'
  | 'operations'
  | 'team'
  | 'data'
  | 'innovation'

export type AssessmentQuestionId =
  | 'lane'
  | 'direction'
  | 'strategy'
  | 'operations'
  | 'team'
  | 'data'
  | 'innovation'

export type AssessmentAnswers = Partial<Record<AssessmentQuestionId, string>>

export const ASSESSMENT_QUESTION_IDS: AssessmentQuestionId[] = [
  'lane',
  'strategy',
  'operations',
  'team',
  'data',
  'innovation',
]

export const DIRECTION_VALUES: AssessmentDirection[] = [
  'advise',
  'source',
  'build',
  'agentic',
  'improve',
]

const ALL_LANE_VALUES: AssessmentLane[] = [
  'consulting',
  'technology',
  'digital',
  'website',
  'platform',
  'automation',
  'ai',
  'agentic',
  'security',
  'visibility',
  'event',
  'workshop',
  'unsure',
]

export const LANE_VALUES: AssessmentLane[] = [
  'visibility',
  'digital',
  'agentic',
  'security',
  'consulting',
  'unsure',
]

export const SCORE_OPTION_VALUES = ['1', '2', '3', '4', '5'] as const

export const SERVICE_META: Record<
  AssessmentServiceKey,
  {
    pillar: BrandPillar
    focus: ConsultingFocus
    anchor: string
    pillarSectionId: string
  }
> = {
  strategy: {
    pillar: 'prepare',
    focus: 'strategy',
    anchor: 'strategy-roadmaps',
    pillarSectionId: 'pillar-prepare',
  },
  operations: {
    pillar: 'transform',
    focus: 'operations',
    anchor: 'operations',
    pillarSectionId: 'pillar-transform',
  },
  team: {
    pillar: 'emerge',
    focus: 'team',
    anchor: 'leadership',
    pillarSectionId: 'pillar-emerge',
  },
  data: {
    pillar: 'emerge',
    focus: 'data',
    anchor: 'readiness',
    pillarSectionId: 'pillar-emerge',
  },
  innovation: {
    pillar: 'soar',
    focus: 'innovation',
    anchor: 'readiness',
    pillarSectionId: 'pillar-soar',
  },
}

const PILLAR_ORDER: BrandPillar[] = ['prepare', 'transform', 'emerge', 'soar']

export type AssessmentResult = {
  lane: AssessmentLane
  overallScore: number
  pillar: BrandPillar
  actionStage: AssessmentActionStage
  primaryService: AssessmentServiceKey | null
  secondaryService: AssessmentServiceKey | null
  scheduleIntent: ConsultationIntent
  scheduleFocus: ConsultingFocus | null
  scheduleGoal: string
  serviceHref: string | null
  laneHref: string
  useCaseHref: UseCasePageHref | null
  /** Need-group outcome pathway this lane maps to (`/solutions/need/{outcomeGroup}`). */
  outcomeGroup: OutcomeGroupId
  /** Tertiary free-evidence CTA when obvious for the lane. */
  evidenceHref: AssessmentEvidencePath | null
  /** Supporting service for the outcome pathway, shown as a text link. */
  supportingServiceHref: string
}

export const LANE_OUTCOME_GROUPS: Record<AssessmentLane, OutcomeGroupId> = {
  visibility: 'growth-visibility',
  digital: 'experience-products',
  website: 'experience-products',
  platform: 'experience-products',
  event: 'experience-products',
  agentic: 'automation-ai',
  automation: 'automation-ai',
  ai: 'automation-ai',
  security: 'security-compliance',
  consulting: 'execution',
  technology: 'execution',
  workshop: 'execution',
  unsure: 'execution',
}

export function outcomeGroupForLane(lane: AssessmentLane): OutcomeGroupId {
  return LANE_OUTCOME_GROUPS[lane]
}

const OUTCOME_GROUP_SERVICE_HREFS: Record<OutcomeGroupId, string> = {
  'growth-visibility': '/services/search-ai-visibility',
  'experience-products': '/services/digital',
  'automation-ai': '/services/ai-agents',
  'security-compliance': '/services/security-risk-compliance',
  execution: '/services/business-advisory',
}

export function evidenceHrefForLane(lane: AssessmentLane): AssessmentEvidencePath | null {
  switch (lane) {
    case 'visibility':
      return '/tools/digital-presence-snapshot'
    case 'agentic':
      return '/ai-agent-readiness-review'
    case 'security':
      return '/security-risk-coverage-review'
    case 'digital':
      return '/digital-product-discovery'
    default:
      return null
  }
}

/**
 * Pathway service for the lane's outcome group. Lanes that are not part of a
 * need-group pathway (technology, workshop, event) keep their own service page.
 */
function supportingServiceHrefForLane(lane: AssessmentLane): string {
  if (lane === 'technology' || lane === 'workshop' || lane === 'event') {
    return laneHref(lane)
  }
  return OUTCOME_GROUP_SERVICE_HREFS[outcomeGroupForLane(lane)]
}

function parseDirection(value: string | undefined): AssessmentDirection | null {
  if (value && DIRECTION_VALUES.includes(value as AssessmentDirection)) {
    return value as AssessmentDirection
  }
  return null
}

function laneForDirection(direction: AssessmentDirection): AssessmentLane {
  switch (direction) {
    case 'advise':
      return 'consulting'
    case 'source':
      return 'technology'
    case 'build':
      return 'digital'
    case 'agentic':
      return 'agentic'
    case 'improve':
      return 'visibility'
  }
}

function parseLane(value: string | undefined): AssessmentLane {
  if (value && ALL_LANE_VALUES.includes(value as AssessmentLane)) {
    return value as AssessmentLane
  }
  return 'unsure'
}

function parseScore(value: string | undefined): number | null {
  if (!value) return null
  const score = Number.parseInt(value, 10)
  if (score >= 1 && score <= 5) return score
  return null
}

function dimensionScoresFromAnswers(answers: AssessmentAnswers): Record<AssessmentServiceKey, number> | null {
  const strategy = parseScore(answers.strategy)
  const operations = parseScore(answers.operations)
  const team = parseScore(answers.team)
  const data = parseScore(answers.data)
  const innovation = parseScore(answers.innovation)

  if (
    strategy === null ||
    operations === null ||
    team === null ||
    data === null ||
    innovation === null
  ) {
    return null
  }

  return {
    strategy,
    operations,
    team,
    data,
    innovation,
  }
}

function pickPrimaryService(
  scores: Record<AssessmentServiceKey, number>,
): { primary: AssessmentServiceKey; secondary: AssessmentServiceKey | null } {
  const entries = Object.entries(scores) as [AssessmentServiceKey, number][]
  const minScore = Math.min(...entries.map(([, score]) => score))
  const tied = entries
    .filter(([, score]) => score === minScore)
    .map(([key]) => key)
    .sort(
      (a, b) =>
        PILLAR_ORDER.indexOf(SERVICE_META[a].pillar) - PILLAR_ORDER.indexOf(SERVICE_META[b].pillar),
    )

  const primary = tied[0]
  const secondary =
    tied.length > 1
      ? tied[1]
      : entries
          .filter(([key, score]) => key !== primary && score === minScore + 1)
          .map(([key]) => key)
          .sort(
            (a, b) =>
              PILLAR_ORDER.indexOf(SERVICE_META[a].pillar) -
              PILLAR_ORDER.indexOf(SERVICE_META[b].pillar),
          )[0] ?? null

  return { primary, secondary: secondary ?? null }
}

function overallScorePercent(scores: Record<AssessmentServiceKey, number>): number {
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0)
  return Math.round((total / (Object.keys(scores).length * 5)) * 100)
}

function laneHref(lane: AssessmentLane): string {
  switch (lane) {
    case 'website':
    case 'ai':
    case 'digital':
      return '/services/digital'
    case 'platform':
      return '/services/digital-products'
    case 'automation':
      return '/services/automation'
    case 'agentic':
      return '/services/ai-agents'
    case 'visibility':
      return '/services/search-ai-visibility'
    case 'technology':
      return '/services/technology-advisory'
    case 'security':
      return '/services/security-risk-compliance'
    case 'workshop':
      return '/programs/workshops'
    case 'event':
      return '/services/digital-events'
    case 'consulting':
      return '/services/business-advisory'
    default:
      return '/services/digital'
  }
}

function actionStageForLane(lane: AssessmentLane): AssessmentActionStage {
  switch (lane) {
    case 'consulting':
    case 'workshop':
      return 'advise'
    case 'technology':
    case 'security':
      return 'source'
    case 'agentic':
      return 'agentic'
    case 'automation':
      return 'connect'
    case 'visibility':
      return 'improve'
    default:
      return 'build'
  }
}

function scheduleIntentForLane(lane: AssessmentLane): ConsultationIntent {
  if (lane === 'website') return 'website'
  if (lane === 'platform') return 'platform'
  if (lane === 'automation') return 'automation'
  if (lane === 'ai') return 'ai-support'
  if (lane === 'agentic') return 'ai-support'
  if (lane === 'visibility') return 'visibility'
  if (lane === 'technology') return 'consulting'
  if (lane === 'security') return 'security'
  if (lane === 'consulting') return 'consulting'
  if (lane === 'event') return 'digital-events'
  if (lane === 'workshop') return 'workshop'
  return 'unsure'
}

export function buildScheduleGoalSummary(result: AssessmentResult): string {
  const parts = [
    `Assessment: ${result.overallScore}% overall.`,
    `Lane: ${result.lane}.`,
    `Recommended action: ${result.actionStage}.`,
  ]
  if (result.primaryService) {
    parts.push(`Readiness emphasis: ${result.pillar}.`)
    parts.push(`Primary service: ${result.primaryService}.`)
  }
  if (result.secondaryService) {
    parts.push(`Also consider: ${result.secondaryService}.`)
  }
  return parts.join(' ')
}

export function buildScheduleQuery(result: AssessmentResult): Record<string, string> {
  const query: Record<string, string> = {
    from: 'assessment',
    goal: buildScheduleGoalSummary(result),
  }

  query.intent = result.scheduleIntent
  if (result.scheduleFocus) {
    query.focus = result.scheduleFocus
  }
  if (result.lane === 'event') {
    query.need = 'booth'
  }

  return query
}

export function computeAssessmentResult(answers: AssessmentAnswers): AssessmentResult | null {
  const selectedLane = parseLane(answers.lane)
  const direction = parseDirection(answers.direction)
  const resolvedLane = selectedLane === 'unsure'
    ? direction
      ? laneForDirection(direction)
      : 'consulting'
    : selectedLane
  const dimensionScores = dimensionScoresFromAnswers(answers)
  if (!dimensionScores) return null

  const overallScore = overallScorePercent(dimensionScores)
  const isDirectLane =
    resolvedLane === 'digital' ||
    resolvedLane === 'website' ||
    resolvedLane === 'platform' ||
    resolvedLane === 'automation' ||
    resolvedLane === 'ai' ||
    resolvedLane === 'agentic' ||
    resolvedLane === 'visibility' ||
    resolvedLane === 'security' ||
    resolvedLane === 'technology' ||
    resolvedLane === 'workshop' ||
    resolvedLane === 'event'

  if (isDirectLane) {
    const { primary, secondary } = pickPrimaryService(dimensionScores)
    const readinessMeta = SERVICE_META[primary]
    const partial: AssessmentResult = {
      lane: resolvedLane,
      overallScore,
      pillar: readinessMeta.pillar,
      actionStage: actionStageForLane(resolvedLane),
      primaryService: primary,
      secondaryService: secondary,
      scheduleIntent: scheduleIntentForLane(resolvedLane),
      scheduleFocus: resolvedLane === 'technology' ? 'technology' : null,
      scheduleGoal: '',
      serviceHref: null,
      laneHref: laneHref(resolvedLane),
      useCaseHref: null,
      outcomeGroup: outcomeGroupForLane(resolvedLane),
      evidenceHref: evidenceHrefForLane(resolvedLane),
      supportingServiceHref: supportingServiceHrefForLane(resolvedLane),
    }
    partial.scheduleGoal = buildScheduleGoalSummary(partial)
    partial.useCaseHref = useCaseHrefForAssessment(partial)
    return partial
  }

  const { primary, secondary } = pickPrimaryService(dimensionScores)
  const meta = SERVICE_META[primary]

  const result: AssessmentResult = {
    lane: 'consulting',
    overallScore,
    pillar: meta.pillar,
    actionStage: 'advise',
    primaryService: primary,
    secondaryService: secondary,
    scheduleIntent: 'consulting',
    scheduleFocus: meta.focus,
    scheduleGoal: '',
    serviceHref: `/services/business-advisory#${meta.anchor}`,
    laneHref: '/services/business-advisory',
    useCaseHref: null,
    outcomeGroup: outcomeGroupForLane('consulting'),
    evidenceHref: evidenceHrefForLane('consulting'),
    supportingServiceHref: `/services/business-advisory#${meta.anchor}`,
  }

  result.scheduleGoal = buildScheduleGoalSummary(result)
  result.useCaseHref = useCaseHrefForAssessment(result)
  return result
}
