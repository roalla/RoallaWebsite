'use client'

import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import HubPageHeader from '@/components/hub/HubPageHeader'
import { hubFetchJson } from '@/lib/hub/toast'

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
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'name' | 'updated'>('name')
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

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: partners.length }
    for (const s of STATUSES) counts[s] = partners.filter((p) => p.status === s).length
    return counts
  }, [partners])

  const filtered = useMemo(() => {
    let list = filter === 'all' ? partners : partners.filter((p) => p.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.organization.toLowerCase().includes(q) ||
          p.contact_name.toLowerCase().includes(q),
      )
    }
    return [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
  }, [partners, filter, search, sort])

  async function createPartner(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      const result = await hubFetchJson<{ partner: PartnerRow }>(
        '/api/hub/partners',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
        { success: t('savePartner') },
      )
      if (result.ok) {
        setPartners((prev) => [result.data.partner, ...prev])
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
      }
    } finally {
      setPending(false)
    }
  }

  const addButton = canCreate ? (
    <button
      type="button"
      onClick={() => setShowForm(!showForm)}
      className="rounded-lg bg-primary-dark text-white px-4 py-2 text-sm font-medium min-h-[44px]"
    >
      {t('addPartner')}
    </button>
  ) : undefined

  return (
    <div>
      <HubPageHeader title={t('navPartners')} subtitle={t('navPartnersSubtitle')} action={addButton} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPartners')}
          className="flex-1 rounded-lg border px-3 py-2 text-sm min-h-[44px]"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'name' | 'updated')}
          className="rounded-lg border px-3 py-2 text-sm min-h-[44px]"
          aria-label={t('sortBy')}
        >
          <option value="name">{t('sortName')}</option>
          <option value="updated">{t('sortUpdated')}</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-full px-3 py-1.5 text-xs font-medium min-h-[36px] ${
            filter === 'all' ? 'bg-primary-dark text-white' : 'bg-white border'
          }`}
        >
          {t('filterAll')} ({statusCounts.all})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium min-h-[36px] ${
              filter === s ? 'bg-primary-dark text-white' : 'bg-white border'
            }`}
          >
            {t(`partnerStatus_${s}`)} ({statusCounts[s] ?? 0})
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
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary-dark text-white px-4 py-2 text-sm font-medium disabled:opacity-50 min-h-[44px]"
          >
            {pending ? t('saving') : t('savePartner')}
          </button>
        </form>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">{t('noPartners')}</p>
      ) : (
        <>
          <ul className="md:hidden space-y-3">
            {filtered.map((p) => (
              <li key={p.id} className="rounded-xl border bg-white p-4">
                <Link href={{ pathname: '/hub/partners/[id]', params: { id: p.id } }} className="font-medium text-primary-dark">
                  {p.name}
                </Link>
                <p className="text-xs text-slate-500 mt-1">{p.organization || '—'}</p>
                <span className="inline-block mt-2 text-xs rounded-full bg-slate-100 px-2 py-0.5">
                  {t(`partnerStatus_${p.status}` as 'partnerStatus_active')}
                </span>
              </li>
            ))}
          </ul>
          <div className="hidden md:block rounded-xl border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">{t('partnerName')}</th>
                  <th className="text-left p-3 font-medium">{t('partnerOrganization')}</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">{t('primaryContact')}</th>
                  <th className="text-left p-3 font-medium">{t('stage')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="p-3">
                      <Link href={{ pathname: '/hub/partners/[id]', params: { id: p.id } }} className="font-medium text-primary-dark hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-3 text-slate-600">{p.organization || '—'}</td>
                    <td className="p-3 hidden lg:table-cell text-slate-600">{p.contact_name || '—'}</td>
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
        </>
      )}
    </div>
  )
}
