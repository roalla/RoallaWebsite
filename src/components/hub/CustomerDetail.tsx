'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import HubBreadcrumbs from '@/components/hub/HubBreadcrumbs'

type Activity = {
  id: string
  summary: string
  activity_type: string
  created_at: string
  user_name?: string
}

type Customer = {
  id: string
  name: string
  stage: string
  service_line: string
  primary_contact: string
  primary_email: string
  notes: string
}

type Props = {
  customer: Customer
  activities: Activity[]
  canEdit: boolean
}

const STAGES = ['lead', 'scoping', 'active', 'complete'] as const

export default function CustomerDetail({ customer: initial, activities: initialActivities, canEdit }: Props) {
  const t = useTranslations('hub')
  const locale = useLocale()
  const fr = locale === 'fr'
  const [customer, setCustomer] = useState(initial)
  const [activities, setActivities] = useState(initialActivities)
  const [note, setNote] = useState('')
  const [pending, setPending] = useState(false)
  const [releaseConfirm, setReleaseConfirm] = useState(false)
  const [releasePending, setReleasePending] = useState(false)
  const [releaseMessage, setReleaseMessage] = useState('')
  const [releaseError, setReleaseError] = useState('')

  async function updateStage(stage: string) {
    const res = await fetch(`/api/hub/customers/${customer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
    if (res.ok) {
      const data = (await res.json()) as { customer: Customer }
      setCustomer(data.customer)
      const detail = await fetch(`/api/hub/customers/${customer.id}`)
      const full = (await detail.json()) as { activities: Activity[] }
      setActivities(full.activities)
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    setPending(true)
    try {
      const res = await fetch(`/api/hub/customers/${customer.id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: note.trim() }),
      })
      if (res.ok) {
        const data = (await res.json()) as { activity: Activity }
        setActivities((prev) => [data.activity, ...prev])
        setNote('')
      }
    } finally {
      setPending(false)
    }
  }

  async function releaseToolkit() {
    setReleasePending(true)
    setReleaseError('')
    setReleaseMessage('')
    try {
      const res = await fetch(`/api/hub/customers/${customer.id}/release-toolkit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolkit: 'ei48', locale }),
      })
      const data = (await res.json()) as { error?: string; email?: string; activity?: Activity }
      if (!res.ok) throw new Error(data.error || (fr ? "L’envoi a échoué." : 'Delivery failed.'))
      if (data.activity) setActivities((previous) => [data.activity!, ...previous])
      setReleaseConfirm(false)
      setReleaseMessage(fr ? `Trousse envoyée à ${data.email}.` : `Toolkit sent to ${data.email}.`)
    } catch (error) {
      setReleaseError(error instanceof Error ? error.message : (fr ? "L’envoi a échoué." : 'Delivery failed.'))
    } finally {
      setReleasePending(false)
    }
  }

  return (
    <div>
      <HubBreadcrumbs
        items={[
          { label: t('navCustomers'), href: '/hub/customers' },
          { label: customer.name },
        ]}
      />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{customer.name}</h1>
      <p className="text-slate-600 text-sm mb-6">
        {customer.primary_contact}
        {customer.primary_email ? ` · ${customer.primary_email}` : ''}
      </p>

      {canEdit && (
        <div className="flex flex-wrap gap-2 mb-6">
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => updateStage(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                customer.stage === s ? 'bg-slate-900 text-white' : 'bg-white border'
              }`}
            >
              {t(`stage_${s}`)}
            </button>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold mb-4">{t('activityLog')}</h2>
          <form onSubmit={addNote} className="mb-4 flex gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('addNotePlaceholder')}
              className="flex-1 rounded-lg border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm disabled:opacity-50"
            >
              {t('addNote')}
            </button>
          </form>
          <ul className="space-y-3">
            {activities.map((a) => (
              <li key={a.id} className="text-sm border-b pb-3 last:border-0">
                <p>{a.summary}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(a.created_at).toLocaleString()}
                  {a.user_name ? ` · ${a.user_name}` : ''}
                </p>
              </li>
            ))}
            {activities.length === 0 && <p className="text-slate-500 text-sm">{t('noActivity')}</p>}
          </ul>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold mb-4">{t('details')}</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">{t('stage')}</dt>
              <dd>{t(`stage_${customer.stage}`)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t('serviceLine')}</dt>
              <dd>{customer.service_line}</dd>
            </div>
            {customer.notes && (
              <div>
                <dt className="text-slate-500">{t('notes')}</dt>
                <dd className="whitespace-pre-wrap">{customer.notes}</dd>
              </div>
            )}
          </dl>

          {canEdit && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-cyan-700">EI—48</p>
              <h3 className="mt-2 font-semibold text-slate-950">
                {fr ? 'Trousse de mise en œuvre' : 'Implementation toolkit'}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {fr
                  ? 'Après la consultation, envoyez en un clic les trois ressources avec des liens sécurisés valides pendant 14 jours.'
                  : 'After the consultation, send all three resources in one click using secure links valid for 14 days.'}
              </p>

              {!releaseConfirm ? (
                <button
                  type="button"
                  onClick={() => { setReleaseConfirm(true); setReleaseError(''); setReleaseMessage('') }}
                  disabled={!customer.primary_email}
                  className="mt-4 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {fr ? 'Préparer l’envoi' : 'Prepare toolkit release'}
                </button>
              ) : (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {fr ? `Envoyer la trousse à ${customer.primary_email}?` : `Send the toolkit to ${customer.primary_email}?`}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {fr ? 'Cette action envoie immédiatement un courriel au client et l’ajoute au journal.' : 'This immediately emails the client and records the delivery in the activity log.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={releaseToolkit} disabled={releasePending} className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                      {releasePending ? (fr ? 'Envoi…' : 'Sending…') : (fr ? 'Confirmer et envoyer' : 'Confirm and send')}
                    </button>
                    <button type="button" onClick={() => setReleaseConfirm(false)} disabled={releasePending} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
                      {fr ? 'Annuler' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}

              {!customer.primary_email ? <p className="mt-3 text-xs font-medium text-amber-700">{fr ? 'Ajoutez d’abord un courriel principal.' : 'Add a primary client email first.'}</p> : null}
              {releaseMessage ? <p role="status" className="mt-3 text-sm font-semibold text-emerald-700">{releaseMessage}</p> : null}
              {releaseError ? <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{releaseError}</p> : null}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
