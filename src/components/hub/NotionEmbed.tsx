'use client'

import { useTranslations } from 'next-intl'

type Props = {
  embedUrl: string
  titleKey: 'navPartners' | 'navLessons'
}

export default function NotionEmbed({ embedUrl, titleKey }: Props) {
  const t = useTranslations('hub')

  if (!embedUrl) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t(titleKey)}</h1>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <p>{t('notionNotConfigured')}</p>
          <p className="mt-2 text-amber-800">{t('notionEnvHint')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">{t(titleKey)}</h1>
      <iframe
        src={embedUrl}
        title={t(titleKey)}
        className="flex-1 w-full min-h-[70vh] rounded-xl border bg-white"
        allowFullScreen
      />
    </div>
  )
}
