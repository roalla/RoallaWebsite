'use client'

import { useTranslations } from 'next-intl'
import { BookOpen, ExternalLink } from 'lucide-react'

type Props = {
  viewUrl: string
  titleKey: 'navPartners' | 'navLessons'
  subtitleKey: 'navPartnersSubtitle' | 'navLessonsSubtitle'
  comingSoonKey: 'partnersComingSoon' | 'lessonsComingSoon'
  hintKey: 'partnersComingSoonHint' | 'lessonsComingSoonHint'
  openKey: 'notionOpenLessons' | 'notionOpenPartners'
  adminEmail?: string
}

export default function NotionEmbed({
  viewUrl,
  titleKey,
  subtitleKey,
  comingSoonKey,
  hintKey,
  openKey,
  adminEmail = '',
}: Props) {
  const t = useTranslations('hub')

  if (!viewUrl) {
    const hint = adminEmail ? t(hintKey, { email: adminEmail }) : t(`${hintKey}NoEmail`)

    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t(titleKey)}</h1>
        <p className="text-slate-600 text-sm mb-6">{t(subtitleKey)}</p>
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center max-w-lg">
          <p className="font-medium text-slate-900">{t(comingSoonKey)}</p>
          <p className="mt-2 text-sm text-slate-600">{hint}</p>
          {adminEmail && (
            <a
              href={`mailto:${adminEmail}`}
              className="inline-block mt-4 text-sm font-medium text-amber-700 hover:underline"
            >
              {t('contactHubAdmin')}
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">{t(titleKey)}</h1>
      <p className="text-slate-600 text-sm mb-8">{t(subtitleKey)}</p>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 max-w-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 mb-5">
          <BookOpen className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{t('notionHostedTitle')}</h2>
        <p className="text-sm text-slate-600 mb-6">{t('notionHostedBody')}</p>
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          {t(openKey)}
          <ExternalLink className="h-4 w-4" />
        </a>
        <p className="mt-4 text-xs text-slate-500">{t('notionHostedNote')}</p>
      </div>
    </div>
  )
}
