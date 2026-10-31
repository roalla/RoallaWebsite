export type NinetyDayPressure = 'too-many-priorities' | 'plans-stall' | 'unclear-ownership'

export type NinetyDayHorizon = '30-days' | '90-days' | 'this-year'

export type NinetyDayTeamPressure = 'founder-led' | 'small-team' | 'growing-team'

export type NinetyDayBriefInput = {
  pressure: NinetyDayPressure
  horizon: NinetyDayHorizon
  teamPressure: NinetyDayTeamPressure
  outcome: string
}

export type NinetyDayPath = 'focus-sequence' | 'follow-through-rhythm' | 'ownership-map'

export function recommendNinetyDayPath(input: NinetyDayBriefInput): NinetyDayPath {
  if (input.pressure === 'plans-stall') return 'follow-through-rhythm'
  if (input.pressure === 'unclear-ownership') return 'ownership-map'
  return 'focus-sequence'
}

export function buildNinetyDayPlanBrief(input: NinetyDayBriefInput) {
  const path = recommendNinetyDayPath(input)
  const outcome =
    input.outcome.trim() || 'one clear business result the team can name in a single sentence'

  const headlines: Record<NinetyDayPath, string> = {
    'focus-sequence': 'Narrow to a 90-day sequence your team can finish',
    'follow-through-rhythm': 'Replace status meetings with a rhythm that moves work',
    'ownership-map': 'Make ownership and measures visible before the next planning cycle',
  }
  const summaries: Record<NinetyDayPath, string> = {
    'focus-sequence': `Your answers point to too many competing priorities. Rank work against “${outcome}” and keep only what fits the next 90 days.`,
    'follow-through-rhythm': `Your answers suggest plans exist but stall between meetings. Build a short review rhythm around “${outcome}” with owners and next actions.`,
    'ownership-map': `Your answers show fuzzy ownership. Assign who decides and who measures progress on “${outcome}” before adding more initiatives.`,
  }
  const priorities: Record<NinetyDayPath, string[]> = {
    'focus-sequence': [
      `Name the one outcome that ranks trade-offs: ${outcome}.`,
      'List current “urgent” work and cut what does not serve that outcome in 90 days.',
      'Assign one owner per remaining priority with a visible milestone.',
    ],
    'follow-through-rhythm': [
      `Keep “${outcome}” as the standing review question.`,
      'Replace open status updates with owned next actions and due dates.',
      'Meet weekly for decisions—not for reading slide decks aloud.',
    ],
    'ownership-map': [
      `Write who owns “${outcome}” and who can decide trade-offs.`,
      'Pick two or three measures the team will actually review.',
      'Publish decision rights before the next planning meeting.',
    ],
  }
  const plans: Record<NinetyDayPath, [string, string, string]> = {
    'focus-sequence': [
      'Confirm the outcome and constraints with leadership.',
      'Sequence a 90-day plan with explicit trade-offs.',
      'Review progress every week against the named outcome.',
    ],
    'follow-through-rhythm': [
      'Map where follow-through breaks today.',
      'Install a weekly owned-action review.',
      'Protect the cadence through the first two planning cycles.',
    ],
    'ownership-map': [
      'Draft decision rights and measures.',
      'Validate them with the people who must carry the work.',
      'Run the next planning cycle with owners already named.',
    ],
  }

  return {
    path,
    headline: headlines[path],
    summary: summaries[path],
    priorities: priorities[path],
    plan: plans[path],
    outcome,
  }
}
