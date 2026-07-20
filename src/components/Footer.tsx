'use client'

import React from 'react'
import Image from 'next/image'
import { Mail, Phone, Linkedin, Youtube, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from './ScheduleButton'

const companyLinks = [
  { nameKey: 'about' as const, href: '/about' as const },
  { nameKey: 'insights' as const, href: '/insights' as const },
  { nameKey: 'faq' as const, href: '/faq' as const },
  { nameKey: 'contact' as const, href: '/contact' as const },
]

const exploreLinks = [
  { nameKey: 'useCases' as const, href: '/use-cases' as const },
  { nameKey: 'digitalEnablement' as const, href: '/services/digital' as const },
  { nameKey: 'ourWork' as const, href: '/services/portfolio' as const },
  { nameKey: 'programs' as const, href: '/programs/business-enablement' as const },
  { nameKey: 'scheduleInquiry' as const, href: '/schedule' as const },
]

const socialLinks = [
  {
    href: 'https://www.linkedin.com/company/102042431/',
    label: 'Roalla on LinkedIn',
    icon: Linkedin,
  },
  {
    href: 'https://www.youtube.com/@RoallaGroup',
    label: 'Roalla on YouTube',
    icon: Youtube,
  },
] as const

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-14 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 group mb-5">
              <Image
                src="/logo.svg"
                alt=""
                width={40}
                height={40}
                className="w-9 h-9 motion-safe:transition-transform motion-safe:group-hover:scale-105"
              />
              <span className="text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                {tCommon('companyName')}
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">{tCommon('tagline')}</p>
            <p className="mt-2 text-xs text-slate-500">{t('subtitle')}</p>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-4">
              {t('exploreLabel')}
            </p>
            <nav className="flex flex-col gap-2.5" aria-label={t('exploreLabel')}>
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-300 hover:text-white transition-colors w-fit"
                >
                  {t(link.nameKey)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-4">
              {t('companyLabel')}
            </p>
            <nav className="flex flex-col gap-2.5" aria-label={t('companyLabel')}>
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-300 hover:text-white transition-colors w-fit"
                >
                  {t(link.nameKey)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-4 lg:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-4">
              {t('contactLabel')}
            </p>
            <ul className="space-y-3 mb-6">
              <li>
                <a
                  href="mailto:sales@roalla.com"
                  className="inline-flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors group"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-4 h-4 text-primary" aria-hidden />
                  </span>
                  sales@roalla.com
                </a>
              </li>
              <li>
                <a
                  href="tel:289-838-5868"
                  className="inline-flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors group"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors">
                    <Phone className="w-4 h-4 text-primary" aria-hidden />
                  </span>
                  (289) 838-5868
                </a>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-primary/30 hover:bg-primary/10 transition-colors"
                >
                  <Icon className="w-4 h-4" aria-hidden />
                </a>
              ))}
            </div>

            <ScheduleButton
              variant="primary"
              size="sm"
              icon
              className="shadow-lg shadow-primary/10"
            >
              {tCommon('scheduleConsultationDigital')}
            </ScheduleButton>
            <p className="mt-2 text-xs text-slate-500">{tCommon('ctaSubtext')}</p>
          </div>
        </div>

        <div className="py-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-slate-500" suppressHydrationWarning>
            {t('copyright', { year: currentYear })}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="/terms"
              className="text-xs font-medium text-slate-500 hover:text-primary transition-colors w-fit"
            >
              {t('terms')}
            </Link>
            <Link
              href="/privacy"
              className="text-xs font-medium text-slate-500 hover:text-primary transition-colors w-fit"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/ai-policy"
              className="text-xs font-medium text-slate-500 hover:text-primary transition-colors w-fit"
            >
              {t('aiPolicy')}
            </Link>
            <Link
              href="/hub/login"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors w-fit"
            >
              {t('teamSignIn')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors w-fit"
            >
              {t('contact')}
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
