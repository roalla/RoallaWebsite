import {
  formatEstimateValidityCopy,
  formatEstimateWhatHappensNext,
} from '@/lib/estimate-commercial'

type Props = {
  locale: string
  disclaimer: string
  taxDisclaimer: string
}

/** Validity, next-step, and legal notes under the running estimate total. */
export default function EstimateCommercialNotes({ locale, disclaimer, taxDisclaimer }: Props) {
  return (
    <div className="mt-5 space-y-2">
      <p className="text-xs font-semibold leading-5 text-slate-700">{formatEstimateValidityCopy(locale)}</p>
      <p className="text-xs leading-5 text-slate-600">{formatEstimateWhatHappensNext(locale)}</p>
      <p className="text-xs leading-5 text-slate-600">{disclaimer}</p>
      <p className="text-xs leading-5 text-slate-600">{taxDisclaimer}</p>
    </div>
  )
}
