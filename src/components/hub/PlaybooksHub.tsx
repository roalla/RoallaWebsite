'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
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

export default function PlaybooksHub({ initialRuns, canWrite }: Props) {
  const t = useTranslations('hub')
  const [runs, setRuns] = useState(initialRuns)
  const [creating, setCreating] = useState<string | null>(null)

  async function startRun(templateId: string) {
    setCreating(templateId)
    try {
      const res = await fetch('/api/hub/playbook-runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: templateId }),
      })
      if (res.ok) {
        const data = (await res.json()) as { run: Run }
        setRuns((prev) => [data.run, ...prev])
      }
    } finally {
      setCreating(null)
    }
  }

  async function toggleItem(runId: string, checklist: ChecklistItem[], itemId: string) {
    if (!canWrite) return
    const updated = checklist.map((i) =>
      i.id === itemId ? { ...i, done: !i.done } : i,
    )
    const res = await fetch('/api/hub/playbook-runs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: runId, checklist: updated }),
    })
    if (res.ok) {
      const data = (await res.json()) as { run: Run }
      setRuns((prev) => prev.map((r) => (r.id === runId ? data.run : r)))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('navPlaybooks')}</h1>
      <p className="text-slate-600 text-sm mb-6">{t('playbooksSubtitle')}</p>

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
                  className="text-sm rounded-lg bg-slate-900 text-white px-3 py-1.5 disabled:opacity-50"
                >
                  {creating === tmpl.id ? t('saving') : t('startChecklist')}
                </button>
              )}
              {tmpl.id === 'digital-events' && (
                <Link
                  href="/hub/playbooks/digital-events"
                  className="text-sm rounded-lg border px-3 py-1.5 hover:bg-slate-50"
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
          {runs.map((run) => (
            <div key={run.id} className="rounded-xl border bg-white p-5">
              <h3 className="font-medium mb-3">{run.title}</h3>
              <ul className="space-y-2">
                {(run.checklist || []).map((item) => (
                  <li key={item.id} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.done}
                      disabled={!canWrite}
                      onChange={() => toggleItem(run.id, run.checklist, item.id)}
                      className="mt-0.5"
                    />
                    <span className={item.done ? 'line-through text-slate-400' : ''}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
