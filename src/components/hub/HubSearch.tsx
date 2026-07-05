'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Search, X } from 'lucide-react'

type SearchResult = {
  type: 'customer' | 'partner' | 'lesson'
  id: string
  title: string
  subtitle?: string
}

type Props = {
  open: boolean
  onClose: () => void
}

export default function HubSearchDialog({ open, onClose }: Props) {
  const t = useTranslations('hub')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [pending, setPending] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setPending(true)
    try {
      const res = await fetch(`/api/hub/search?q=${encodeURIComponent(q.trim())}`)
      if (res.ok) {
        const data = (await res.json()) as { results: SearchResult[] }
        setResults(data.results)
      }
    } finally {
      setPending(false)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      return
    }
    const timer = setTimeout(() => search(query), 250)
    return () => clearTimeout(timer)
  }, [query, open, search])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function resultHref(r: SearchResult) {
    if (r.type === 'customer') return { pathname: '/hub/customers/[id]' as const, params: { id: r.id } }
    if (r.type === 'partner') return { pathname: '/hub/partners/[id]' as const, params: { id: r.id } }
    return { pathname: '/hub/lessons/[id]' as const, params: { id: r.id } }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[10vh]" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl bg-white shadow-xl border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('searchTitle')}
      >
        <div className="flex items-center gap-2 border-b px-3">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="flex-1 py-3 text-sm outline-none"
          />
          <button type="button" onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800" aria-label={t('cancel')}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {pending && <p className="text-sm text-slate-500 p-3">{t('searching')}</p>}
          {!pending && query && results.length === 0 && (
            <p className="text-sm text-slate-500 p-3">{t('searchNoResults')}</p>
          )}
          <ul className="space-y-0.5">
            {results.map((r) => (
              <li key={`${r.type}-${r.id}`}>
                <Link
                  href={resultHref(r)}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <p className="text-sm font-medium text-slate-900">{r.title}</p>
                  <p className="text-xs text-slate-500">
                    {t(`searchType_${r.type}`)}
                    {r.subtitle ? ` · ${r.subtitle}` : ''}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function HubSearchButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations('hub')
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 hover:bg-white hover:border-primary/30 transition-colors min-h-[44px]"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="truncate">{t('searchPlaceholder')}</span>
      <kbd className="ml-auto hidden sm:inline text-xs bg-white border rounded px-1.5 py-0.5 text-slate-400">/</kbd>
    </button>
  )
}
