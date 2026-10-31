import { getOutcomeGroupPanelCopy } from '@/lib/outcome-group-panels'
import type { OutcomeGroupId } from '@/lib/solution-outcome-pages'

type Props = {
  groupId: OutcomeGroupId
  locale: 'en' | 'fr'
}

/** Crawlable summary of every situation so agents/crawlers see full need-page copy. */
export default function NeedSituationSummary({ groupId, locale }: Props) {
  const copy = getOutcomeGroupPanelCopy(groupId, locale)
  const title = locale === 'fr' ? 'Situations couvertes' : 'Situations covered'

  return (
    <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="need-situations-summary">
      <div className="mx-auto max-w-5xl">
        <h2 id="need-situations-summary" className="font-serif text-2xl font-bold text-slate-950">
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{copy.resultBody}</p>
        <ul className="mt-8 space-y-6">
          {copy.situations.map((situation) => (
            <li key={situation.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
              <h3 className="text-lg font-semibold text-slate-950">{situation.label}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{situation.hint}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                {situation.detail.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
