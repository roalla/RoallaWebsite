'use client'

import { useEffect, useState } from 'react'
import { Check, Link2, Linkedin, Mail, Share2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { SITE_URL } from '@/lib/site'

type Props = {
  title: string
}

const actionClass =
  'inline-flex min-h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary/30 hover:text-primary-dark'

export default function InsightShare({ title }: Props) {
  const t = useTranslations('insights')
  const pathname = usePathname()
  const url = `${SITE_URL}${pathname}`
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === 'function')
  }, [])

  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`

  async function copyLink() {
    let ok = false
    try {
      await navigator.clipboard.writeText(url)
      ok = true
    } catch {
      try {
        const field = document.createElement('textarea')
        field.value = url
        field.setAttribute('readonly', '')
        field.style.position = 'fixed'
        field.style.left = '-9999px'
        document.body.appendChild(field)
        field.select()
        ok = document.execCommand('copy')
        field.remove()
      } catch {
        ok = false
      }
    }
    setCopyState(ok ? 'copied' : 'failed')
    window.setTimeout(() => setCopyState('idle'), 2000)
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url })
    } catch {
      // The share sheet was dismissed.
    }
  }

  return (
    <div className="mt-6">
      <p id="insight-share-label" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {t('shareLabel')}
      </p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="insight-share-label">
        <button type="button" onClick={copyLink} className={actionClass}>
          {copyState === 'copied' ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
          <span aria-live="polite">
            {copyState === 'copied' ? t('shareCopied') : copyState === 'failed' ? t('shareCopyFailed') : t('shareCopy')}
          </span>
        </button>
        <a href={linkedInHref} target="_blank" rel="noopener noreferrer" className={actionClass}>
          <Linkedin className="h-4 w-4" aria-hidden />
          {t('shareLinkedIn')}
        </a>
        <a href={emailHref} className={actionClass}>
          <Mail className="h-4 w-4" aria-hidden />
          {t('shareEmail')}
        </a>
        {canNativeShare ? (
          <button type="button" onClick={nativeShare} className={actionClass}>
            <Share2 className="h-4 w-4" aria-hidden />
            {t('shareMore')}
          </button>
        ) : null}
      </div>
    </div>
  )
}
