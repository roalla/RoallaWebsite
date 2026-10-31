export type CapacityPressure = 'cant-hire' | 'peak-volume' | 'thin-team' | 'quality-slipping'

export type CapacityWorkArea =
  | 'customer-requests'
  | 'internal-admin'
  | 'reporting'
  | 'operations'

export type CapacityHumanKeep =
  | 'customer-judgment'
  | 'approvals'
  | 'exceptions'
  | 'relationships'

export type CapacityBriefInput = {
  pressure: CapacityPressure
  workArea: CapacityWorkArea
  mustStayHuman: CapacityHumanKeep
  urgency: 'exploring' | 'this-quarter' | 'urgent'
}

export type CapacityPath = 'automate-repeatable' | 'cover-peaks' | 'protect-quality'

export function recommendCapacityPath(input: CapacityBriefInput): CapacityPath {
  if (input.pressure === 'peak-volume') return 'cover-peaks'
  if (input.pressure === 'quality-slipping') return 'protect-quality'
  return 'automate-repeatable'
}

export function buildCapacityPressureBrief(input: CapacityBriefInput) {
  const path = recommendCapacityPath(input)
  const headlines: Record<CapacityPath, string> = {
    'automate-repeatable': 'Free capacity by removing repeatable work first',
    'cover-peaks': 'Design coverage for busy periods without burning out the team',
    'protect-quality': 'Stabilize quality before you add more volume',
  }
  const summaries: Record<CapacityPath, string> = {
    'automate-repeatable':
      'Your answers suggest the team is too thin for the workload. Start with repeatable work that can run with a person checking the exceptions—not a full replacement of judgment.',
    'cover-peaks':
      'Your answers point to busy periods that break coverage. Plan overflow help for peak work while people stay on the moments that protect customer trust.',
    'protect-quality':
      'Your answers show quality slipping under load. Stabilize the highest-risk steps first, then add capacity only where it protects the customer experience.',
  }
  const priorities: Record<CapacityPath, string[]> = {
    'automate-repeatable': [
      'List work that repeats every day or week with few surprises.',
      'Name who owns exceptions when something unusual happens.',
      'Pilot one workflow where volume is high and ownership already exists.',
    ],
    'cover-peaks': [
      'Map when volume jumps and what fails first for customers.',
      'Separate peak overflow work from relationship and judgment work.',
      'Set a simple measure for response time and quality during peaks.',
    ],
    'protect-quality': [
      'Identify where mistakes or delays create customer risk today.',
      'Keep people on approvals, exceptions, and relationship moments.',
      'Add help only on steps that are repeatable and easy to check.',
    ],
  }
  const plans: Record<CapacityPath, [string, string, string]> = {
    'automate-repeatable': [
      'Pick one high-volume workflow with a clear owner.',
      'Define what a person must still review.',
      'Measure time saved and error rate on a short pilot.',
    ],
    'cover-peaks': [
      'Confirm peak calendar and failure points.',
      'Design overflow steps with escalation paths.',
      'Test before the next known busy period.',
    ],
    'protect-quality': [
      'Rank quality risks by customer impact.',
      'Stabilize the top risk with clearer ownership.',
      'Only then expand capacity on safer, repeatable steps.',
    ],
  }

  return {
    path,
    headline: headlines[path],
    summary: summaries[path],
    priorities: priorities[path],
    plan: plans[path],
  }
}
