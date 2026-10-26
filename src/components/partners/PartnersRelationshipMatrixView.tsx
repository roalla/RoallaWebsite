'use client'

import { trackAnalyticsEvent } from '@/lib/analytics'
import { PARTNERS_HASH_EVENT } from '@/lib/partners-portfolio-ui'

export type MatrixRow = {
  key: string
  name: string
  portfolioLabels: string[]
  access: string
  exclusivity: string
  geography: string
  compensation: string
  reviewed: string
}

type Props = {
  caption: string
  orgLabel: string
  portfolioLabel: string
  accessLabel: string
  exclusivityLabel: string
  geographyLabel: string
  compensationLabel: string
  reviewedLabel: string
  note: string
  jumpHint: string
  rows: MatrixRow[]
}

function jumpToVendor(key: string) {
  const hash = `#${key}`
  if (window.location.hash !== hash) {
    window.history.pushState(null, '', hash)
  }
  window.dispatchEvent(new CustomEvent(PARTNERS_HASH_EVENT, { detail: { key } }))
  const el = document.getElementById(key)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  trackAnalyticsEvent('partners_matrix_jump', { partner: key })
}

export default function PartnersRelationshipMatrixView({
  caption,
  orgLabel,
  portfolioLabel,
  accessLabel,
  exclusivityLabel,
  geographyLabel,
  compensationLabel,
  reviewedLabel,
  note,
  jumpHint,
  rows,
}: Props) {
  return (
    <div>
      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <button
            key={row.key}
            type="button"
            onClick={() => jumpToVendor(row.key)}
            className="w-full border-l-4 border-slate-300 bg-slate-50 px-4 py-3.5 text-left transition hover:bg-slate-100"
            aria-label={`${row.name}. ${jumpHint}`}
          >
            <p className="font-semibold text-slate-950">{row.name}</p>
            <ul className="mt-2 flex list-none flex-wrap gap-1.5 p-0">
              {row.portfolioLabels.map((label) => (
                <li key={label}>
                  <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              {row.access} · {row.geography} · {row.exclusivity}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {row.compensation} · {reviewedLabel}: {row.reviewed}
            </p>
          </button>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-slate-300 text-xs uppercase tracking-[0.12em] text-slate-500">
              <th scope="col" className="py-3 pr-4 font-bold">
                {orgLabel}
              </th>
              <th scope="col" className="py-3 pr-4 font-bold">
                {portfolioLabel}
              </th>
              <th scope="col" className="py-3 pr-4 font-bold">
                {accessLabel}
              </th>
              <th scope="col" className="py-3 pr-4 font-bold">
                {exclusivityLabel}
              </th>
              <th scope="col" className="py-3 pr-4 font-bold">
                {geographyLabel}
              </th>
              <th scope="col" className="py-3 pr-4 font-bold">
                {compensationLabel}
              </th>
              <th scope="col" className="py-3 font-bold">
                {reviewedLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-slate-200 align-top">
                <th scope="row" className="py-3.5 pr-4 font-semibold text-slate-950">
                  <button
                    type="button"
                    onClick={() => jumpToVendor(row.key)}
                    className="text-left underline-offset-4 transition hover:text-primary-dark hover:underline"
                    title={jumpHint}
                  >
                    {row.name}
                  </button>
                </th>
                <td className="py-3.5 pr-4">
                  <ul className="flex list-none flex-wrap gap-1.5 p-0" aria-label={portfolioLabel}>
                    {row.portfolioLabels.map((label, index) => (
                      <li
                        key={label}
                        className="partners-pill-enter"
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3.5 pr-4 text-slate-700">{row.access}</td>
                <td className="py-3.5 pr-4 text-slate-700">{row.exclusivity}</td>
                <td className="py-3.5 pr-4 text-slate-700">{row.geography}</td>
                <td className="py-3.5 pr-4 text-slate-700">{row.compensation}</td>
                <td className="py-3.5 text-slate-700">{row.reviewed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">{note}</p>
    </div>
  )
}
