import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'
import PartnersBrandLockup from '@/components/partners/PartnersBrandLockup'
import { Link } from '@/i18n/navigation'

export type PartnersHeroCta =
  | {
      label: string
      href:
        | '/services/technology-advisory'
        | '/services/digital'
        | '/tools/technology-decision-brief'
        | '/partners/evaluation-standard'
        | '/partners/compensation'
        | '/terms'
    }
  | {
      label: string
      href: {
        pathname: '/contact'
        query: { intent: 'consulting'; focus: 'technology' }
      }
    }

type Props = {
  eyebrow: string
  title: string
  description: string
  imageSrc: string
  imagePriority?: boolean
  tone?: 'dark' | 'slate'
  primaryCta: PartnersHeroCta
  secondaryCta?: PartnersHeroCta
}

export default async function PartnersSectionHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imagePriority = true,
  tone = 'dark',
  primaryCta,
  secondaryCta,
}: Props) {
  const tCommon = await getTranslations('common')
  const t = await getTranslations('partnersPlatforms')
  const isSlate = tone === 'slate'

  return (
    <header
      data-header-tone="dark"
      className={
        isSlate
          ? 'relative isolate overflow-hidden bg-[#12151a] px-4 pb-14 pt-28 text-white sm:px-6 lg:px-8 lg:pb-16 lg:pt-32'
          : 'relative isolate overflow-hidden bg-[#090b0e] px-4 pb-14 pt-28 text-white sm:px-6 lg:px-8 lg:pb-16 lg:pt-32'
      }
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={imagePriority}
        sizes="100vw"
        className={isSlate ? '-z-30 object-cover object-center opacity-30' : '-z-30 object-cover object-center opacity-40'}
      />
      <div
        className={
          isSlate
            ? 'absolute inset-0 -z-20 bg-gradient-to-r from-[#0c1016] via-[#0c1016]/94 to-[#0c1016]/70'
            : 'absolute inset-0 -z-20 bg-gradient-to-r from-[#050608] via-[#050608]/92 to-[#050608]/55'
        }
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-transparent to-black/70" aria-hidden />

      <div className="mx-auto max-w-7xl">
        <Reveal when="mount" className="max-w-3xl">
          <PartnersBrandLockup
            companyName={tCommon('companyName')}
            label={t('brandAdvisorLabel')}
            size="lg"
            tone="dark"
          />
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-primary-light">{eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={primaryCta.href}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-primary-light"
            >
              {primaryCta.label}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline"
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </Reveal>
      </div>
    </header>
  )
}
