import { getTranslations } from 'next-intl/server'
import PartnersRelationshipMatrix from '@/components/partners/PartnersRelationshipMatrix'
import { ecosystemDirectoryGroups } from '@/lib/technologyEcosystem'

type Props = {
  groupId?: (typeof ecosystemDirectoryGroups)[number]['id']
  telarusOnly?: boolean
  defaultOpen?: boolean
}

export default async function PartnersProcurementMatrix({
  groupId,
  telarusOnly = false,
  defaultOpen = false,
}: Props) {
  const t = await getTranslations('partnersPlatforms')

  return (
    <details
      className="group/matrix mb-10 rounded-xl border border-slate-200 bg-white open:shadow-sm"
      open={defaultOpen || undefined}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 marker:content-none [&::-webkit-details-marker]:hidden sm:px-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{t('matrixProcurementLabel')}</p>
          <p className="mt-1 font-serif text-xl font-bold text-slate-950">{t('matrixTitle')}</p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{t('matrixProcurementHint')}</p>
        </div>
        <span
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition group-open/matrix:rotate-45"
          aria-hidden
        >
          +
        </span>
      </summary>
      <div className="border-t border-slate-200 px-4 py-5 sm:px-5">
        <PartnersRelationshipMatrix groupId={groupId} telarusOnly={telarusOnly} />
      </div>
    </details>
  )
}
