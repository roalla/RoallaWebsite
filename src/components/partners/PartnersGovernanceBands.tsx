import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ECOSYSTEM_DISCLOSURE_EFFECTIVE,
  ECOSYSTEM_DISCLOSURE_VERSION,
} from '@/lib/ecosystem-governance'
import Reveal from '@/components/motion/Reveal'

type Props = {
  variant?: 'full' | 'compact'
}

export default async function PartnersGovernanceBands({ variant = 'full' }: Props) {
  const t = await getTranslations('partnersPlatforms')

  return (
    <div className={variant === 'full' ? 'space-y-8' : 'space-y-6'}>
      <Reveal className="border border-slate-200 bg-slate-50 px-5 py-6 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('independenceEyebrow')}</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-slate-950">{t('independenceTitle')}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{t('independenceBody')}</p>
      </Reveal>

      <Reveal delayMs={60} className="border border-slate-200 bg-white px-5 py-6 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('securityEyebrow')}</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-slate-950">{t('securityTitle')}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{t('securityBody')}</p>
      </Reveal>

      <Reveal delayMs={100} className="border-t border-slate-200 pt-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{t('disclosureVersionEyebrow')}</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {t('disclosureVersionBody', {
            version: ECOSYSTEM_DISCLOSURE_VERSION,
            date: ECOSYSTEM_DISCLOSURE_EFFECTIVE,
          })}
        </p>
        <Link href="/terms" className="mt-3 inline-flex text-sm font-semibold text-primary-dark hover:underline">
          {t('termsLink')}
        </Link>
      </Reveal>
    </div>
  )
}
