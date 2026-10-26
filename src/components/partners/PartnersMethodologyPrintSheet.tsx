'use client'

import { useEffect, useState } from 'react'
import { CONTACT } from '@/lib/site'

type Props = {
  locale: string
  eyebrow: string
  title: string
  intro: string
  criteria: string[]
  independence: string
  disclaimer: string
}

export default function PartnersMethodologyPrintSheet({
  locale,
  eyebrow,
  title,
  intro,
  criteria,
  independence,
  disclaimer,
}: Props) {
  const lang = locale === 'fr' ? 'fr' : 'en'
  const [prepared, setPrepared] = useState('')

  useEffect(() => {
    const now = new Date()
    setPrepared(
      lang === 'fr'
        ? `Préparé le ${now.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}`
        : `Prepared ${now.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    )
  }, [lang])

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .partners-methodology-print {
          position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);
        }
        @media print {
          @page { margin: 0.6in; size: letter; }
          body * { visibility: hidden !important; }
          .fixed { display: none !important; }
          .partners-methodology-print, .partners-methodology-print * { visibility: visible !important; }
          .partners-methodology-print {
            position: fixed; inset: 0; width: auto; height: auto; overflow: visible; clip: auto;
            background: #fff; color: #0f172a; font-family: Figtree, "Segoe UI", sans-serif;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
          }
        }
      `,
        }}
      />
      <div className="partners-methodology-print" aria-hidden>
        <header className="border-b-4 border-[#c4a35a] pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{prepared}</p>
        </header>
        <p className="mt-6 text-sm leading-6 text-slate-700">{intro}</p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-800">
          {criteria.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <p className="mt-6 text-sm leading-6 text-slate-700">{independence}</p>
        <p className="mt-6 text-xs leading-5 text-slate-500">{disclaimer}</p>
        <footer className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
          ROALLA · {CONTACT.email} · {CONTACT.phone}
        </footer>
      </div>
    </>
  )
}
