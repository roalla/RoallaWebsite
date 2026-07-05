'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import HubBreadcrumbs from '@/components/hub/HubBreadcrumbs'

type Partner = {
  id: string
  name: string
  organization: string
  contact_name: string
  contact_email: string
  contact_phone: string
  status: string
  notes: string
}

type Props = {
  partner: Partner
  canEdit: boolean
}

const STATUSES = ['active', 'prospect', 'inactive'] as const

export default function PartnerDetail({ partner: initial, canEdit }: Props) {
  const t = useTranslations('hub')
  const router = useRouter()
  const [partner, setPartner] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...initial })
  const [pending, setPending] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      const res = await fetch(`/api/hub/partners/${partner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = (await res.json()) as { partner: Partner }
        setPartner(data.partner)
        setEditing(false)
      }
    } finally {
      setPending(false)
    }
  }

  async function remove() {
    if (!confirm(t('confirmDeletePartner'))) return
    const res = await fetch(`/api/hub/partners/${partner.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/hub/partners')
  }

  return (
    <div>
      <HubBreadcrumbs
        items={[
          { label: t('navPartners'), href: '/hub/partners' },
          { label: partner.name },
        ]}
      />

      {!editing ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{partner.name}</h1>
              {partner.organization && (
                <p className="text-slate-600 text-sm mt-1">{partner.organization}</p>
              )}
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-sm rounded-lg border px-3 py-1.5 hover:bg-slate-50"
                >
                  {t('edit')}
                </button>
                <button
                  type="button"
                  onClick={() => remove()}
                  className="text-sm rounded-lg border border-red-200 text-red-700 px-3 py-1.5 hover:bg-red-50"
                >
                  {t('delete')}
                </button>
              </div>
            )}
          </div>

          <div className="rounded-xl border bg-white p-6 space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">{t('stage')}</p>
              <p className="text-sm mt-1">{t(`partnerStatus_${partner.status}` as 'partnerStatus_active')}</p>
            </div>
            {partner.contact_name && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{t('primaryContact')}</p>
                <p className="text-sm mt-1">{partner.contact_name}</p>
              </div>
            )}
            {partner.contact_email && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{t('primaryEmail')}</p>
                <a href={`mailto:${partner.contact_email}`} className="text-sm text-amber-700 hover:underline mt-1">
                  {partner.contact_email}
                </a>
              </div>
            )}
            {partner.contact_phone && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{t('partnerPhone')}</p>
                <p className="text-sm mt-1">{partner.contact_phone}</p>
              </div>
            )}
            {partner.notes && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{t('notes')}</p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{partner.notes}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <form onSubmit={save} className="rounded-xl border bg-white p-6 space-y-4">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-lg font-semibold"
          />
          <input
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            placeholder={t('partnerOrganization')}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={form.contact_name}
              onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
              placeholder={t('primaryContact')}
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              placeholder={t('primaryEmail')}
              className="rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <input
            value={form.contact_phone}
            onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
            placeholder={t('partnerPhone')}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`partnerStatus_${s}`)}
              </option>
            ))}
          </select>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('notes')}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm">
              {pending ? t('saving') : t('savePartner')}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg border px-4 py-2 text-sm">
              {t('cancel')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
