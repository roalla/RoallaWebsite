'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export type CustomerRow = {
  id: string
  name: string
  stage: string
  service_line: string
  primary_contact: string
  primary_email: string
  updated_at: string
}

const STAGES = ['lead', 'scoping', 'active', 'complete'] as const

type Props = {
  initialCustomers: CustomerRow[]
  canCreate: boolean
}

export default function CustomersList({ initialCustomers, canCreate }: Props) {
  const t = useTranslations('hub')
  const [customers, setCustomers] = useState(initialCustomers)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [form, setForm] = useState({
    name: '',
    stage: 'lead',
    service_line: 'digital',
    primary_contact: '',
    primary_email: '',
    notes: '',
  })
  const [pending, setPending] = useState(false)

  const filtered =
    filter === 'all' ? customers : customers.filter((c) => c.stage === filter)

  async function createCustomer(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      const res = await fetch('/api/hub/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) return
      const data = (await res.json()) as { customer: CustomerRow }
      setCustomers((prev) => [data.customer, ...prev])
      setShowForm(false)
      setForm({
        name: '',
        stage: 'lead',
        service_line: 'digital',
        primary_contact: '',
        primary_email: '',
        notes: '',
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('navCustomers')}</h1>
          <p className="text-slate-600 text-sm">{t('customersSubtitle')}</p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium"
          >
            {t('addCustomer')}
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', ...STAGES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === s ? 'bg-slate-900 text-white' : 'bg-white border text-slate-700'
            }`}
          >
            {s === 'all' ? t('filterAll') : t(`stage_${s}`)}
          </button>
        ))}
      </div>

      {showForm && canCreate && (
        <form onSubmit={createCustomer} className="mb-6 rounded-xl border bg-white p-6 space-y-4">
          <input
            required
            placeholder={t('customerName')}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <select
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {t(`stage_${s}`)}
                </option>
              ))}
            </select>
            <input
              placeholder={t('primaryContact')}
              value={form.primary_contact}
              onChange={(e) => setForm({ ...form, primary_contact: e.target.value })}
              className="rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <input
            type="email"
            placeholder={t('primaryEmail')}
            value={form.primary_email}
            onChange={(e) => setForm({ ...form, primary_email: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-amber-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {pending ? t('saving') : t('saveCustomer')}
          </button>
        </form>
      )}

      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium">{t('customerName')}</th>
              <th className="text-left p-3 font-medium hidden sm:table-cell">{t('stage')}</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">{t('serviceLine')}</th>
              <th className="text-left p-3 font-medium hidden lg:table-cell">{t('primaryContact')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  {t('noCustomers')}
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3">
                    <Link
                      href={{ pathname: '/hub/customers/[id]', params: { id: c.id } }}
                      className="font-medium text-amber-800 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{t(`stage_${c.stage}`)}</span>
                  </td>
                  <td className="p-3 hidden md:table-cell text-slate-600">{c.service_line}</td>
                  <td className="p-3 hidden lg:table-cell text-slate-600">{c.primary_contact || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
