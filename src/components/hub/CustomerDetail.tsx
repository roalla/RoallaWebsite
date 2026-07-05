'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
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
  const [customer, setCustomer] = useState(initial)
  const [activities, setActivities] = useState(initialActivities)
  const [note, setNote] = useState('')
  const [pending, setPending] = useState(false)

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
        </section>
      </div>
    </div>
  )
}
