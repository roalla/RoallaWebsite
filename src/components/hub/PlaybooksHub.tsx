'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import HubPageHeader from '@/components/hub/HubPageHeader'
import { hubFetchJson } from '@/lib/hub/toast'
import { playbookTemplates } from '@/lib/hub/playbook-templates'
import type { ChecklistItem } from '@/lib/db/schema'

type Run = {
  id: string
  template_id: string
  title: string
  checklist: ChecklistItem[]
  updated_at: string
}

type Props = {
  initialRuns: Run[]
  canWrite: boolean
}

function checklistProgress(checklist: ChecklistItem[]) {
  const total = checklist.length
  if (total === 0) return { done: 0, total: 0, pct: 0 }
  const done = checklist.filter((i) => i.done).length
  return { done, total, pct: Math.round((done / total) * 100) }
}

export default function PlaybooksHub({ initialRuns, canWrite }: Props) {
  const t = useTranslations('hub')
  const [runs, setRuns] = useState(initialRuns)
  const [creating, setCreating] = useState<string | null>(null)

  async function startRun(templateId: string) {
    setCreating(templateId)
    try {
      const result = await hubFetchJson<{ run: Run }>(
        '/api/hub/playbook-runs',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template_id: templateId }),
        },
        { success: t('startChecklist') },
      )
      if (result.ok) setRuns((prev) => [result.data.run, ...prev])
    } finally {
      setCreating(null)
    }
  }

  async function toggleItem(runId: string, checklist: ChecklistItem[], itemId: string) {
    if (!canWrite) return
    const updated = checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i))
    const result = await hubFetchJson<{ run: Run }>(
      '/api/hub/playbook-runs',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: runId, checklist: updated }),
      },
    )
    if (result.ok) {
      setRuns((prev) => prev.map((r) => (r.id === runId ? result.data.run : r)))
    }
  }

  return (
    <div>
      <HubPageHeader title={t('navPlaybooks')} subtitle={t('playbooksSubtitle')} />

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {playbookTemplates.map((tmpl) => (
          <div key={tmpl.id} className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold text-slate-900">{tmpl.title}</h3>
            <p className="text-sm text-slate-600 mt-1 mb-3">{tmpl.description}</p>
            <div className="flex flex-wrap gap-2">
              {canWrite && (
                <button
                  type="button"
                  disabled={creating === tmpl.id}
                  onClick={() => startRun(tmpl.id)}
                  className="text-sm rounded-lg bg-primary-dark text-white px-3 py-1.5 disabled:opacity-50 min-h-[36px]"
                >
                  {creating === tmpl.id ? t('saving') : t('startChecklist')}
                </button>
              )}
              {tmpl.id === 'digital-events' && (
                <Link
                  href="/hub/playbooks/digital-events"
                  className="text-sm rounded-lg border px-3 py-1.5 hover:bg-slate-50 min-h-[36px] inline-flex items-center"
                >
                  {t('viewPlaybook')}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-semibold text-lg mb-4">{t('activeChecklists')}</h2>
      {runs.length === 0 ? (
        <p className="text-slate-500 text-sm">{t('noChecklists')}</p>
      ) : (
        <div className="space-y-4">
          {runs.map((run) => {
            const { done, total, pct } = checklistProgress(run.checklist || [])
            return (
              <div key={run.id} className="rounded-xl border bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="font-medium">{run.title}</h3>
                  <span className="text-xs text-slate-500">{t('checklistProgress', { done, total })}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 mb-4 overflow-hidden">
                  <div
                    className="h-full bg-primary-dark transition-all duration-300"
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <ul className="space-y-2">
                  {(run.checklist || []).map((item) => (
                    <li key={item.id} className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.done}
                        disabled={!canWrite}
                        onChange={() => toggleItem(run.id, run.checklist, item.id)}
                        className="mt-0.5 min-h-[20px] min-w-[20px]"
                      />
                      <span className={item.done ? 'line-through text-slate-400' : ''}>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
