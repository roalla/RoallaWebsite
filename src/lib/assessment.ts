import type { BrandPillar } from '@/lib/brand-journey'
import type { ConsultationIntent, ConsultingFocus } from '@/lib/consultation-request'

export type AssessmentLane = 'consulting' | 'website' | 'platform' | 'workshop' | 'event' | 'unsure'

export type AssessmentServiceKey =
  | 'strategy'
  | 'operations'
  | 'digital'
  | 'team'
  | 'data'
  | 'innovation'

export type AssessmentQuestionId = 'lane' | 'strategy' | 'operations' | 'team' | 'scale'

export type AssessmentAnswers = Partial<Record<AssessmentQuestionId, string>>

export const ASSESSMENT_QUESTION_IDS: AssessmentQuestionId[] = [
  'lane',
  'strategy',
  'operations',
  'team',
  'scale',
]

export const LANE_VALUES: AssessmentLane[] = [
  'consulting',
  'website',
  'platform',
  'workshop',
  'event',
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
    anchor: 'strategic',
    pillarSectionId: 'pillar-prepare',
  },
  operations: {
    pillar: 'transform',
    focus: 'operations',
    anchor: 'operations',
    pillarSectionId: 'pillar-transform',
  },
  digital: {
    pillar: 'transform',
    focus: 'other',
    anchor: 'digital',
    pillarSectionId: 'pillar-transform',
  },
  team: {
    pillar: 'emerge',
    focus: 'team',
    anchor: 'people',
    pillarSectionId: 'pillar-emerge',
  },
  data: {
    pillar: 'emerge',
    focus: 'data',
    anchor: 'analytics',
    pillarSectionId: 'pillar-emerge',
  },
  innovation: {
    pillar: 'soar',
    focus: 'innovation',
    anchor: 'innovation',
    pillarSectionId: 'pillar-soar',
  },
}

const PILLAR_ORDER: BrandPillar[] = ['prepare', 'transform', 'emerge', 'soar']

const SCALE_DIMENSIONS: AssessmentServiceKey[] = ['data', 'digital', 'innovation']

export type AssessmentResult = {
  lane: AssessmentLane
  overallScore: number
  pillar: BrandPillar
  primaryService: AssessmentServiceKey | null
  secondaryService: AssessmentServiceKey | null
  scheduleIntent: ConsultationIntent
  scheduleFocus: ConsultingFocus | null
  scheduleGoal: string
  serviceHref: string | null
  laneHref: string
  exploreServicesHref: string
}

function parseLane(value: string | undefined): AssessmentLane {
  if (value && LANE_VALUES.includes(value as AssessmentLane)) {
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
  const scale = parseScore(answers.scale)

  if (strategy === null || operations === null || team === null || scale === null) {
    return null
  }

  return {
    strategy,
    operations,
    digital: scale,
    team,
    data: scale,
    innovation: scale,
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
    case 'platform':
      return '/services/digital'
    case 'workshop':
      return '/services/workshops'
    case 'event':
      return '/services/digital-events'
    default:
      return '/services'
  }
}

function scheduleIntentForLane(lane: AssessmentLane): ConsultationIntent {
  if (lane === 'website' || lane === 'platform') return 'website'
  if (lane === 'consulting') return 'consulting'
  return 'unsure'
}

export function buildScheduleGoalSummary(result: AssessmentResult): string {
  const parts = [
    `Assessment: ${result.overallScore}% overall.`,
    `Lane: ${result.lane}.`,
  ]
  if (result.primaryService) {
    parts.push(`Recommended phase: ${result.pillar}.`)
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
  if (result.lane === 'platform') {
    query.need = 'custom-platform'
  }
  if (result.scheduleFocus) {
    query.focus = result.scheduleFocus
  }

  return query
}

export function computeAssessmentResult(answers: AssessmentAnswers): AssessmentResult | null {
  const lane = parseLane(answers.lane)
  const dimensionScores = dimensionScoresFromAnswers(answers)
  if (!dimensionScores) return null

  const overallScore = overallScorePercent(dimensionScores)
  const isDigitalLane = lane === 'website' || lane === 'platform'
  const isAlternateLane = lane === 'workshop' || lane === 'event'

  if (isDigitalLane || isAlternateLane) {
    const pillar: BrandPillar = isDigitalLane ? 'emerge' : 'prepare'
    const partial: AssessmentResult = {
      lane,
      overallScore,
      pillar,
      primaryService: null,
      secondaryService: null,
      scheduleIntent: scheduleIntentForLane(lane),
      scheduleFocus: null,
      scheduleGoal: '',
      serviceHref: null,
      laneHref: laneHref(lane),
      exploreServicesHref: '/services',
    }
    partial.scheduleGoal = buildScheduleGoalSummary(partial)
    return partial
  }

  const { primary, secondary } = pickPrimaryService(dimensionScores)
  const meta = SERVICE_META[primary]

  const result: AssessmentResult = {
    lane,
    overallScore,
    pillar: meta.pillar,
    primaryService: primary,
    secondaryService: secondary,
    scheduleIntent: scheduleIntentForLane(lane),
    scheduleFocus: meta.focus,
    scheduleGoal: '',
    serviceHref: `/services#${meta.anchor}`,
    laneHref: '/services',
    exploreServicesHref: `/services#${meta.pillarSectionId}`,
  }

  result.scheduleGoal = buildScheduleGoalSummary(result)
  return result
}
