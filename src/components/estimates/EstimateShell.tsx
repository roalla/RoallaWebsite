import type { ReactNode } from 'react'

type EstimateShellProps = {
  eyebrow: string
  title: string
  intro: string
  jumpToEstimate: string
  /** Optional chips or notes under the intro (desktop outcomes, referral note, etc.) */
  headerExtra?: ReactNode
  form: ReactNode
  summary: ReactNode
  mobileSummaryLabel: string
  mobileTotalLabel: string
  mobileCta: ReactNode
}

/**
 * Shared chrome for package estimators: jump links, mobile-first summary order,
 * sticky aside, and fixed mobile total bar.
 */
export default function EstimateShell({
  eyebrow,
  title,
  intro,
  jumpToEstimate,
  headerExtra,
  form,
  summary,
  mobileSummaryLabel,
  mobileTotalLabel,
  mobileCta,
}: EstimateShellProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 pb-24 lg:pb-0">
      <header className="rounded-t-3xl bg-slate-950 px-6 py-8 text-white sm:px-8 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-light">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-serif font-bold text-white sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-white/95">{intro}</p>
        {headerExtra}
        <a
          href="#estimate-summary"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15 lg:hidden"
        >
          {jumpToEstimate}
          <span aria-hidden>→</span>
        </a>
        <p className="mt-4 hidden text-sm font-semibold text-primary-light lg:block">
          <a href="#estimate-summary" className="underline-offset-4 hover:underline">
            {jumpToEstimate} →
          </a>
        </p>
      </header>

      <div className="grid lg:grid-cols-[1.2fr_.8fr]">
        <div className="order-2 space-y-8 p-6 sm:p-8 lg:order-1 lg:p-10">{form}</div>
        <aside
          id="estimate-summary"
          className="order-1 scroll-mt-28 border-b border-slate-200 bg-slate-50 p-6 sm:p-8 lg:order-2 lg:border-b-0 lg:border-l lg:p-10"
        >
          <div className="lg:sticky lg:top-28">{summary}</div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <a
            href="#estimate-summary"
            className="min-w-0 flex-1 rounded-lg px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">{mobileSummaryLabel}</p>
            <p className="truncate text-lg font-serif font-bold tabular-nums text-primary-dark">{mobileTotalLabel}</p>
          </a>
          {mobileCta}
        </div>
      </div>
    </section>
  )
}
