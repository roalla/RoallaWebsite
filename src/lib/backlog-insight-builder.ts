import type { InsightEntry, InsightServiceHref } from '@/lib/enriched-insights'

type CompactCopy = readonly [string, string, string, string, string, string, readonly string[], readonly [string, string, string], string, string, string, string]

function expand(copy: CompactCopy, french: boolean, serviceHref: InsightServiceHref) {
  const [category, imageAlt, answer, context, guidance, example, signs, actions, takeaway, ctaTitle, ctaText, serviceLabel] = copy
  const stepTitles = french
    ? ['Clarifier le résultat', 'Examiner les preuves', 'Assigner la suite']
    : ['Clarify the result', 'Examine the evidence', 'Assign the next step']
  return {
    category,
    imageAlt,
    plainAnswer: answer,
    intro: [context, guidance],
    exampleTitle: french ? 'Exemple concret' : 'What this looks like in practice',
    example,
    signsTitle: french ? 'Questions utiles à poser' : 'Questions worth answering',
    signs,
    stepsTitle: french ? 'Passer de la préoccupation à l’action' : 'Move from concern to action',
    steps: stepTitles.map((title, index) => ({ title, body: actions[index] })),
    takeaway,
    ctaTitle,
    ctaText,
    serviceHref,
    serviceLabel,
  }
}

export function createBacklogInsight(
  image: string,
  serviceHref: InsightServiceHref,
  en: CompactCopy,
  fr: CompactCopy,
): InsightEntry {
  return { image, en: expand(en, false, serviceHref), fr: expand(fr, true, serviceHref) }
}
