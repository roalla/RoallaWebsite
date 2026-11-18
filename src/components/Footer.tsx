'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, Linkedin, Youtube } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { CLIENT_PORTAL_URL, SOCIAL_LINKS, SSO_HOME_URL } from '@/lib/site'

const FOOTER_ATMOSPHERE_SRC = '/images/Hero/roalla-hero-homepage-desktop-2.webp'

const companyLinks = [
  { nameKey: 'about' as const, href: '/about' as const },
  { nameKey: 'insights' as const, href: '/insights' as const },
  { nameKey: 'partners' as const, href: '/partners' as const },
  { nameKey: 'contact' as const, href: '/contact' as const },
]

const exploreLinks = [
  { nameKey: 'solutions' as const, href: '/solutions' as const },
  { nameKey: 'digitalEnablement' as const, href: '/services/digital' as const },
  { nameKey: 'programs' as const, href: '/services/business-advisory' as const },
  { nameKey: 'ourWork' as const, href: '/services/portfolio' as const },
  { nameKey: 'aiAutomation' as const, href: '/services/ai-agents' as const },
  { nameKey: 'security' as const, href: '/services/security-risk-compliance' as const },
]

const socialLinks = [
  {
    href: SOCIAL_LINKS.linkedin,
    labelKey: 'linkedinAria' as const,
    Icon: Linkedin,
  },
  {
    href: SOCIAL_LINKS.youtube,
    labelKey: 'youtubeAria' as const,
    Icon: Youtube,
  },
] as const

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')
  const closeRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const el = closeRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEntered(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <footer data-header-tone="dark" className="relative isolate overflow-hidden bg-slate-950 text-slate-300">
      <div className="absolute inset-0 -z-20" aria-hidden>
        <Image
          src={FOOTER_ATMOSPHERE_SRC}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/85 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/55 to-slate-950/70" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={closeRef}
          className={`border-b border-white/10 py-12 sm:py-14 lg:py-16 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${
            entered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-3 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
          }`}
        >
          <p className="font-serif text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {t('closeTitle')}
          </p>
          <div
            className={`mt-5 h-px w-20 origin-left bg-gradient-to-r from-brand-gold via-brand-gold/80 to-transparent motion-safe:transition-all motion-safe:delay-150 motion-safe:duration-700 ${
              entered
                ? 'scale-x-100 opacity-100'
                : 'scale-x-50 opacity-0 motion-reduce:scale-x-100 motion-reduce:opacity-100'
            }`}
            aria-hidden
          />
        </div>

        <div className="grid grid-cols-1 gap-12 py-12 lg:grid-cols-12 lg:gap-14 lg:py-14">
          <div className="lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <Image
                src="/roalla-logo-2027.svg"
                alt=""
                width={44}
                height={44}
                className="h-10 w-10 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
              />
              <span className="font-serif text-2xl font-bold tracking-[-0.02em] text-white transition-colors group-hover:text-brand-gold">
                {tCommon('companyName')}
              </span>
            </Link>
            <div className="mt-4 h-px w-14 bg-brand-gold/80" aria-hidden />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300">{tCommon('tagline')}</p>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold/90">
              {t('subtitle')}
            </p>
          </div>

          <div className="hidden lg:col-span-1 lg:flex lg:justify-center" aria-hidden>
            <div className="h-full w-px bg-gradient-to-b from-brand-gold/50 via-brand-gold/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-7 lg:gap-8">
            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {t('exploreLabel')}
              </p>
              <nav className="flex flex-col gap-3" aria-label={t('exploreLabel')}>
                {exploreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit text-sm text-slate-300 transition-colors hover:text-brand-gold"
                  >
                    {t(link.nameKey)}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {t('companyLabel')}
              </p>
              <nav className="flex flex-col gap-3" aria-label={t('companyLabel')}>
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit text-sm text-slate-300 transition-colors hover:text-brand-gold"
                  >
                    {t(link.nameKey)}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {t('contactLabel')}
              </p>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/contact"
                    className="text-base font-medium text-white underline-offset-4 transition-colors hover:text-brand-gold hover:underline"
                  >
                    {t('sendMessage')}
                  </Link>
                </li>
              </ul>

              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map(({ href, labelKey, Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(labelKey)}
                    className="group inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-300 transition-all duration-300 hover:border-brand-gold/60 hover:bg-brand-gold/10 hover:text-brand-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.45)] motion-safe:hover:-translate-y-1 motion-safe:hover:scale-110 motion-reduce:transition-colors"
                  >
                    <Icon
                      className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:scale-110"
                      aria-hidden
                    />
                  </a>
                ))}
              </div>

              <div className="mt-8 border-t border-brand-gold/40 pt-5">
                <Link
                  href="/contact"
                  className="group inline-flex min-h-12 items-center gap-2 rounded-lg border border-brand-gold/70 px-5 py-3 text-sm font-semibold text-brand-gold transition-colors hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold-light"
                >
                  {tCommon('scheduleConsultationDigital')}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{tCommon('ctaSubtext')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-xs tracking-wide text-slate-500" suppressHydrationWarning>
            {t('copyright', { year: currentYear })}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
            <Link
              href="/terms"
              className="w-fit text-xs text-slate-500 transition-colors hover:text-brand-gold"
            >
              {t('terms')}
            </Link>
            <Link
              href="/privacy"
              className="w-fit text-xs text-slate-500 transition-colors hover:text-brand-gold"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/ai-policy"
              className="w-fit text-xs text-slate-500 transition-colors hover:text-brand-gold"
            >
              {t('aiPolicy')}
            </Link>
            <a
              href={CLIENT_PORTAL_URL}
              className="inline-flex w-fit items-center gap-1 text-xs text-slate-500 transition-colors hover:text-brand-gold"
              aria-label={t('clientPortalAria')}
            >
              {t('clientPortal')}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
            <a
              href={SSO_HOME_URL}
              className="inline-flex w-fit items-center gap-1 text-xs text-slate-500 transition-colors hover:text-brand-gold"
            >
              {t('teamSignIn')}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-1 text-xs text-slate-500 transition-colors hover:text-brand-gold"
            >
              {t('contact')}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
