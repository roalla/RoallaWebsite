'use client'

import { useTranslations } from 'next-intl'

type Props = {
  embedUrl: string
  titleKey: 'navPartners' | 'navLessons'
  subtitleKey: 'navPartnersSubtitle' | 'navLessonsSubtitle'
  comingSoonKey: 'partnersComingSoon' | 'lessonsComingSoon'
  hintKey: 'partnersComingSoonHint' | 'lessonsComingSoonHint'
  adminEmail?: string
}

export default function NotionEmbed({
  embedUrl,
  titleKey,
  subtitleKey,
  comingSoonKey,
  hintKey,
  adminEmail = '',
}: Props) {
  const t = useTranslations('hub')

  if (!embedUrl) {
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
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">{t(titleKey)}</h1>
      <p className="text-slate-600 text-sm mb-4">{t(subtitleKey)}</p>
      <iframe
        src={embedUrl}
        title={t(titleKey)}
        className="flex-1 w-full min-h-[70vh] rounded-xl border bg-white"
        allowFullScreen
      />
    </div>
  )
}
