'use client'

import { FormEvent, useState } from 'react'
import { CheckCircle2, Mail } from 'lucide-react'
import { trackAnalyticsEvent } from '@/lib/analytics'

type Props = {
  locale: 'en' | 'fr'
  context: string
  contactHref: string
  contactLabel?: string
  onSaved?: (email: string) => void
}

const copy = {
  en: {
    title: 'Save this result',
    body: 'Optional. Add your email to keep a copy of this brief—then continue when you are ready to talk.',
    email: 'Work email',
    consent: 'ROALLA may email this brief and a short follow-up. No Hub account required.',
    save: 'Email me this brief',
    saved: 'Saved. Check your inbox shortly—or continue below.',
    contact: 'Talk to ROALLA',
    skip: 'Continue without saving',
  },
  fr: {
    title: 'Enregistrer ce résultat',
    body: 'Optionnel. Ajoutez votre courriel pour conserver une copie—puis continuez quand vous êtes prêt à en parler.',
    email: 'Courriel professionnel',
    consent: 'ROALLA peut envoyer ce brief et un court suivi. Aucun compte Hub requis.',
    save: 'M’envoyer ce brief',
    saved: 'Enregistré. Vérifiez votre boîte—ou continuez ci-dessous.',
    contact: 'Parler à ROALLA',
    skip: 'Continuer sans enregistrer',
  },
} as const

export default function SoftCapture({
  locale,
  context,
  contactHref,
  contactLabel,
  onSaved,
}: Props) {
  const t = copy[locale]
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!email.trim() || !consent || busy) return
    setBusy(true)
    trackAnalyticsEvent('soft_capture_submit', { context, locale })
    try {
      onSaved?.(email.trim())
      // Best-effort: persist locally so return visits show saved state.
      try {
        localStorage.setItem(
          `roalla-soft-capture:${context}`,
          JSON.stringify({ email: email.trim(), savedAt: new Date().toISOString() }),
        )
      } catch {
        /* ignore */
      }
      setSaved(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <aside className="mt-8 rounded-2xl border border-primary/25 bg-primary/[0.04] px-5 py-6 sm:px-6">
      <div className="flex items-start gap-3">
        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl font-bold text-slate-950">{t.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t.body}</p>

          {saved ? (
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary-dark">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
              {t.saved}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <label className="block text-sm font-semibold text-slate-900">
                {t.email}
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 outline-none ring-brand-gold focus:ring-2"
                />
              </label>
              <label className="flex items-start gap-2 text-sm leading-5 text-slate-600">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1"
                  required
                />
                <span>{t.consent}</span>
              </label>
              <button
                type="submit"
                disabled={busy || !consent}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {t.save}
              </button>
            </form>
          )}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <a
              href={contactHref}
              onClick={() => trackAnalyticsEvent('soft_capture_contact', { context, locale })}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-slate-950 hover:bg-primary-light"
            >
              {contactLabel || t.contact}
            </a>
            {!saved ? (
              <a
                href={contactHref}
                className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-semibold text-slate-600 underline-offset-4 hover:underline"
              >
                {t.skip}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  )
}
