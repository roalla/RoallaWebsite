export type LearningAudience = 'customers' | 'internal' | 'partners' | 'both'
export type LearningFormat = 'docs' | 'short-video' | 'scorm' | 'youtube-style'
export type LearningOutcome = 'adoption' | 'compliance' | 'service-quality' | 'onboarding'
export type LearningOwnership = 'named-owner' | 'shared' | 'unclear'
export type LearningUrgency = 'exploring' | 'this-quarter' | 'urgent'

export type LearningAdoptionBriefInput = {
  audience: LearningAudience
  format: LearningFormat
  outcome: LearningOutcome
  ownership: LearningOwnership
  urgency: LearningUrgency
}

export type LearningAdoptionPath =
  | 'docs-first'
  | 'video-first'
  | 'tracked-learning'
  | 'ownership-first'

export function recommendLearningAdoptionPath(input: LearningAdoptionBriefInput): LearningAdoptionPath {
  if (input.ownership === 'unclear') return 'ownership-first'
  if (input.format === 'scorm' || input.outcome === 'compliance') return 'tracked-learning'
  if (input.format === 'short-video' || input.format === 'youtube-style') return 'video-first'
  return 'docs-first'
}

export function buildLearningAdoptionBrief(input: LearningAdoptionBriefInput) {
  const path = recommendLearningAdoptionPath(input)

  const headlines: Record<LearningAdoptionPath, string> = {
    'docs-first': 'Start with clear task docs—then add video where it helps',
    'video-first': 'Ship short how-to videos tied to one outcome',
    'tracked-learning': 'Use tracked modules where completion and proof matter',
    'ownership-first': 'Name who owns content before you produce more of it',
  }

  const summaries: Record<LearningAdoptionPath, string> = {
    'docs-first':
      'Your answers suggest people need a reliable written path for the job to be done. Start with one clear guide per critical task, then add short video only where a demo beats a page.',
    'video-first':
      'Your answers point to visual how-to as the fastest path to adoption. Keep each video to one task, one audience, and a clear next step—YouTube-style hosting is enough when tracking is light.',
    'tracked-learning':
      'Your answers need completion, refresh, or compliance proof. SCORM or an LMS module fits when you must prove who finished what—still keep the first release to one audience and one outcome.',
    'ownership-first':
      'Your answers show content may already exist but nobody owns freshness. Assign an owner and refresh cadence before producing more videos or modules that will go stale.',
  }

  const priorities: Record<LearningAdoptionPath, string[]> = {
    'docs-first': [
      'List the top three tasks customers or staff still ask about.',
      'Write one plain-language guide per task with screenshots where needed.',
      'Link the guide from the product, portal, or onboarding email.',
    ],
    'video-first': [
      'Script one task per video—no multi-topic walkthroughs.',
      'Publish where the audience already looks (portal, YouTube, LMS).',
      'Measure completion or support ticket drop for that task.',
    ],
    'tracked-learning': [
      'Define who must complete the module and by when.',
      'Choose SCORM/LMS only if completion records are required.',
      'Keep marketing narrative separate from the required training path.',
    ],
    'ownership-first': [
      'Name a content owner and a review date for every asset.',
      'Archive outdated videos and docs that create support confusion.',
      'Then rebuild only the highest-friction task materials.',
    ],
  }

  const plan: Record<LearningAdoptionPath, [string, string, string]> = {
    'docs-first': [
      'Pick the highest-friction task for one audience.',
      'Publish a short guide and link it from the live journey.',
      'Add a short video only if the guide still leaves gaps.',
    ],
    'video-first': [
      'Record one short how-to for the top stuck moment.',
      'Place it next to the action (portal, email, booth follow-up).',
      'Review support questions after two weeks and iterate.',
    ],
    'tracked-learning': [
      'Confirm audience, required outcome, and proof needs.',
      'Build one SCORM or LMS module for that outcome only.',
      'Assign owners for content refresh and completion reporting.',
    ],
    'ownership-first': [
      'Inventory current docs, videos, and modules.',
      'Assign owners and retire conflicting materials.',
      'Release one refreshed path for the priority audience.',
    ],
  }

  return {
    path,
    headline: headlines[path],
    summary: summaries[path],
    priorities: priorities[path],
    plan: plan[path],
  }
}
