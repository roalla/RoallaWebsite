import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { partnersSectionNav, type PartnersSectionPath } from '@/lib/partners-sections'

type Props = {
  current: PartnersSectionPath | '/partners'
}

export default async function PartnersSectionNav({ current }: Props) {
  const t = await getTranslations('partnersPlatforms')

  return (
    <nav
      aria-label={t('sectionNavLabel')}
      className="sticky top-16 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75 lg:top-[4.25rem]"
    >
      <div className="container mx-auto flex gap-1 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <Link
          href="/partners"
          className={
            current === '/partners'
              ? 'shrink-0 border-b-2 border-slate-900 px-3 py-2 text-sm font-semibold text-slate-900'
              : 'shrink-0 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900'
          }
          aria-current={current === '/partners' ? 'page' : undefined}
        >
          {t('sectionNavOverview')}
        </Link>
        {partnersSectionNav.map((item) => {
          const active = current === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={
                active
                  ? 'shrink-0 border-b-2 border-slate-900 px-3 py-2 text-sm font-semibold text-slate-900'
                  : 'shrink-0 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900'
              }
              aria-current={active ? 'page' : undefined}
            >
              {t(item.labelKey)}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
