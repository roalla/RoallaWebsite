'use client'

import { useEffect, useState } from 'react'
import { CONTACT } from '@/lib/site'

type Props = {
  locale: string
  eyebrow: string
  title: string
  body: string
  columns: string[]
  rows: { criterion: string; notes: string }[]
  disclaimer: string
}

export default function PartnersScorecardPrintSheet({
  locale,
  eyebrow,
  title,
  body,
  columns,
  rows,
  disclaimer,
}: Props) {
  const lang = locale === 'fr' ? 'fr' : 'en'
  const [prepared, setPrepared] = useState('')

  useEffect(() => {
    const now = new Date()
    setPrepared(
      lang === 'fr'
        ? `Exemple anonymisé · ${now.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long' })}`
        : `Anonymized sample · ${now.toLocaleDateString('en-CA', { year: 'numeric', month: 'long' })}`,
    )
  }, [lang])

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .partners-scorecard-print {
          position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);
        }
        @media print {
          @page { margin: 0.55in; size: letter; }
          body * { visibility: hidden !important; }
          .fixed { display: none !important; }
          .partners-scorecard-print, .partners-scorecard-print * { visibility: visible !important; }
          .partners-scorecard-print {
            position: fixed; inset: 0; width: auto; height: auto; overflow: visible; clip: auto;
            background: #fff; color: #0f172a; font-family: Figtree, "Segoe UI", sans-serif;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
          }
        }
      `,
        }}
      />
      <div className="partners-scorecard-print" aria-hidden>
        <header className="border-b-4 border-[#c4a35a] pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{prepared}</p>
        </header>
        <p className="mt-5 text-sm leading-6 text-slate-700">{body}</p>
        <table className="mt-6 w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-300">
              {columns.map((col) => (
                <th key={col} className="py-2 pr-3 font-bold uppercase tracking-wide text-slate-500">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.criterion} className="border-b border-slate-200 align-top">
                <td className="py-2.5 pr-3 font-semibold text-slate-900">{row.criterion}</td>
                <td className="py-2.5 pr-3 text-slate-600">—</td>
                <td className="py-2.5 pr-3 text-slate-600">—</td>
                <td className="py-2.5 text-slate-700">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-xs leading-5 text-slate-500">{disclaimer}</p>
        <footer className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
          ROALLA · {CONTACT.email} · {CONTACT.phone}
        </footer>
      </div>
    </>
  )
}
