'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export type PartnerRow = {
  id: string
  name: string
  organization: string
  contact_name: string
  contact_email: string
  contact_phone: string
  status: string
  updated_at: string
}

const STATUSES = ['active', 'prospect', 'inactive'] as const

type Props = {
  initialPartners: PartnerRow[]
  canCreate: boolean
}

export default function PartnersList({ initialPartners, canCreate }: Props) {
  const t = useTranslations('hub')
  const [partners, setPartners] = useState(initialPartners)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [form, setForm] = useState({
    name: '',
    organization: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    status: 'active',
    notes: '',
  })
  const [pending, setPending] = useState(false)

  const filtered =
    filter === 'all' ? partners : partners.filter((p) => p.status === filter)

  async function createPartner(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      const res = await fetch('/api/hub/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) return
      const data = (await res.json()) as { partner: PartnerRow }
      setPartners((prev) => [data.partner, ...prev])
      setShowForm(false)
      setForm({
        name: '',
        organization: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        status: 'active',
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
          <h1 className="text-2xl font-bold text-slate-900">{t('navPartners')}</h1>
          <p className="text-slate-600 text-sm">{t('navPartnersSubtitle')}</p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium"
          >
            {t('addPartner')}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border'
          }`}
        >
          {t('filterAll')}
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === s ? 'bg-slate-900 text-white' : 'bg-white border'
            }`}
          >
            {t(`partnerStatus_${s}`)}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={createPartner} className="rounded-xl border bg-white p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('partnerName')}</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('partnerOrganization')}</label>
              <input
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('primaryContact')}</label>
              <input
                value={form.contact_name}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('primaryEmail')}</label>
              <input
                type="email"
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('partnerPhone')}</label>
            <input
              value={form.contact_phone}
              onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('notes')}</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {pending ? t('saving') : t('savePartner')}
          </button>
        </form>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">{t('noPartners')}</p>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-3 font-medium">{t('partnerName')}</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">{t('partnerOrganization')}</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">{t('primaryContact')}</th>
                <th className="text-left p-3 font-medium">{t('stage')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3">
                    <Link
                      href={{ pathname: '/hub/partners/[id]', params: { id: p.id } }}
                      className="font-medium text-amber-800 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-slate-600">{p.organization || '—'}</td>
                  <td className="p-3 hidden md:table-cell text-slate-600">{p.contact_name || '—'}</td>
                  <td className="p-3">
                    <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5">
                      {t(`partnerStatus_${p.status}` as 'partnerStatus_active')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
