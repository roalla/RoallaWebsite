import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import {
  ecosystemCtas,
  ecosystemDirectoryGroups,
  ecosystemLogos,
  type EcosystemKey,
} from '@/lib/technologyEcosystem'

type GroupId = (typeof ecosystemDirectoryGroups)[number]['id']

type Props = {
  groupId: GroupId
  showHeading?: boolean
}

export default async function PartnersDirectoryList({ groupId, showHeading = true }: Props) {
  const t = await getTranslations('partnersPlatforms')
  const tEco = await getTranslations('home.technologyEcosystem')
  const group = ecosystemDirectoryGroups.find((entry) => entry.id === groupId)
  if (!group) return null

  return (
    <section aria-labelledby={`${group.id}-heading`}>
      {showHeading ? (
        <div className="max-w-3xl">
          <h2 id={`${group.id}-heading`} className="font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
            {t(group.titleKey)}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{t(group.descriptionKey)}</p>
        </div>
      ) : (
        <h2 id={`${group.id}-heading`} className="sr-only">
          {t(group.titleKey)}
        </h2>
      )}
      <ul className={`${showHeading ? 'mt-8' : ''} divide-y divide-slate-200 border-y border-slate-200`}>
        {(group.keys as readonly EcosystemKey[]).map((key) => {
          const logo = ecosystemLogos[key]
          const cta = ecosystemCtas[key]
          return (
            <li
              id={key}
              key={key}
              className="scroll-mt-28 group grid gap-5 py-7 transition hover:bg-slate-50/80 sm:grid-cols-[11rem_1fr] sm:items-start sm:gap-8 lg:py-8"
            >
              <div className="flex h-16 w-full max-w-[11rem] items-center justify-center rounded-xl bg-white px-3 ring-1 ring-slate-200">
                {logo ? (
                  <Image
                    src={logo.src}
                    alt=""
                    width={logo.width}
                    height={logo.height}
                    className={logo.className}
                    unoptimized
                  />
                ) : (
                  <span className="text-base font-extrabold tracking-tight text-slate-900">
                    {tEco(`${key}.wordmark`)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                  {tEco(`${key}.relationship`)}
                </p>
                <h3 className="mt-1 font-serif text-xl font-bold text-slate-950">{tEco(`${key}.name`)}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{tEco(`${key}.description`)}</p>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  <span className="font-semibold text-slate-700">{t('businessNeedLabel')}:</span>{' '}
                  {tEco(`${key}.need`)}
                </p>
                {cta?.type === 'external' ? (
                  <a
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary-dark hover:underline"
                  >
                    {tEco(`${key}.cta`)}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </a>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-8 text-sm leading-6 text-slate-500">{t('organizationsNote')}</p>
    </section>
  )
}
