'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ESTIMATE_WIZARD_LABELS } from '@/lib/estimate-wizard-mode'

export type EstimateWizardStep = {
  id: string
  title: string
  content: ReactNode
  /** When false, Continue stays disabled. Default true. */
  canContinue?: boolean
}

type EstimateWizardProps = {
  locale: string
  steps: EstimateWizardStep[]
  /** Reset to first step when this key changes (e.g. delivery mode). */
  resetKey?: string
}

export default function EstimateWizard({ locale, steps, resetKey }: EstimateWizardProps) {
  const labels = ESTIMATE_WIZARD_LABELS[locale === 'fr' ? 'fr' : 'en']
  const [index, setIndex] = useState(0)
  const safeSteps = steps.length > 0 ? steps : [{ id: 'empty', title: '', content: null, canContinue: true }]
  const current = Math.min(index, safeSteps.length - 1)
  const step = safeSteps[current]
  const total = safeSteps.length
  const progress = ((current + 1) / total) * 100
  const canContinue = step.canContinue !== false
  const isLast = current >= total - 1

  useEffect(() => {
    setIndex(0)
  }, [resetKey])

  useEffect(() => {
    if (index > safeSteps.length - 1) setIndex(Math.max(0, safeSteps.length - 1))
  }, [index, safeSteps.length])

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-600">
            {labels.stepOf(current + 1, total)}
          </p>
          <p className="truncate text-sm font-semibold text-slate-900">{step.title}</p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200" aria-hidden>
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-4">{step.content}</div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          disabled={current === 0}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {labels.back}
        </button>
        {!isLast ? (
          <button
            type="button"
            onClick={() => setIndex((value) => Math.min(total - 1, value + 1))}
            disabled={!canContinue}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {labels.continue}
          </button>
        ) : (
          <p className="text-sm font-semibold text-slate-700">{labels.done}</p>
        )}
      </div>
    </div>
  )
}

type EstimateModeToggleProps = {
  locale: string
  mode: 'form' | 'wizard'
  onToggle: () => void
}

export function EstimateModeToggle({ locale, mode, onToggle }: EstimateModeToggleProps) {
  const labels = ESTIMATE_WIZARD_LABELS[locale === 'fr' ? 'fr' : 'en']
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
    >
      {mode === 'wizard' ? labels.showAllOptions : labels.guidedSteps}
    </button>
  )
}
