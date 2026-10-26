'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Reveal from '@/components/motion/Reveal'
import { Link } from '@/i18n/navigation'

type Props = {
  intro: string
  progressLabel: string
  criteria: { key: string; label: string }[]
  primaryCtaLabel: string
  secondaryCtaLabel: string
  compensationLinkLabel: string
}

export default function PartnersEvaluationChecklist({
  intro,
  progressLabel,
  criteria,
  primaryCtaLabel,
  secondaryCtaLabel,
  compensationLinkLabel,
}: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const done = criteria.filter((item) => checked[item.key]).length
  const total = criteria.length
  const progress = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <section aria-labelledby="evaluation-standard-heading">
      <Reveal>
        <p className="max-w-3xl text-base leading-relaxed text-slate-600">{intro}</p>
      </Reveal>

      <div className="mt-8 max-w-3xl">
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="font-semibold text-slate-900">
            {progressLabel.replace('{done}', String(done)).replace('{total}', String(total))}
          </p>
          <span className="tabular-nums text-slate-500">{progress}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200" aria-hidden>
          <div
            className="h-full rounded-full bg-primary-dark transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {criteria.map((item, index) => {
          const isOn = Boolean(checked[item.key])
          return (
            <Reveal as="li" key={item.key} delayMs={Math.min(index * 40, 200)}>
              <button
                type="button"
                onClick={() => setChecked((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                aria-pressed={isOn}
                className={
                  isOn
                    ? 'flex w-full items-start gap-2.5 rounded-xl border border-primary/40 bg-primary/[0.06] px-4 py-3 text-left text-sm text-slate-800 transition sm:text-base'
                    : 'flex w-full items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:border-slate-300 sm:text-base'
                }
              >
                <CheckCircle2
                  className={
                    isOn
                      ? 'mt-0.5 h-5 w-5 shrink-0 text-primary-dark'
                      : 'mt-0.5 h-5 w-5 shrink-0 text-slate-300'
                  }
                  aria-hidden
                />
                <span>{item.label}</span>
              </button>
            </Reveal>
          )
        })}
      </ul>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/tools/technology-decision-brief"
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-primary-light"
        >
          {primaryCtaLabel}
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </Link>
        <Link
          href={{ pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } }}
          className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-semibold text-primary-dark underline-offset-4 hover:underline"
        >
          {secondaryCtaLabel}
        </Link>
      </div>
      <p className="mt-5">
        <Link href="/partners/compensation" className="text-sm font-semibold text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline">
          {compensationLinkLabel}
        </Link>
      </p>
    </section>
  )
}
