'use client'

import React from 'react'
import { Mail, Phone, Linkedin, Youtube } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from './ScheduleButton'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')

  type FooterHref = '/' | '/services' | '/services/workshops' | '/services/digital' | '/about' | '/contact' | '/digital-creations' | '/assessment' | '/faq' | '/schedule'
  const quickLinks: { nameKey: 'businessEnablement' | 'workshops' | 'websitesAndDigital' | 'ourWork' | 'assessment' | 'faq' | 'contact' | 'about'; href: FooterHref }[] = [
    { nameKey: 'businessEnablement', href: '/services' },
    { nameKey: 'workshops', href: '/services/workshops' },
    { nameKey: 'websitesAndDigital', href: '/services/digital' },
    { nameKey: 'ourWork', href: '/digital-creations' },
    { nameKey: 'assessment', href: '/assessment' },
    { nameKey: 'faq', href: '/faq' },
    { nameKey: 'contact', href: '/contact' },
    { nameKey: 'about', href: '/about' },
  ]

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{tCommon('companyName')}</p>
            <p className="text-xs text-slate-600 mt-0.5">{tCommon('tagline')}</p>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-label="Footer links">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-700 hover:text-primary-dark transition-colors whitespace-nowrap">
                {t(link.nameKey)}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
            <ScheduleButton
              variant="primary"
              size="sm"
              className="shadow-sm"
              sublabel={tCommon('ctaSubtext')}
              sublabelClassName="text-slate-500"
            >
              {tCommon('scheduleConsultation')}
            </ScheduleButton>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <a href="mailto:sales@roalla.com" className="flex items-center gap-1.5 text-slate-700 hover:text-primary-dark transition-colors" aria-label="Email us">
                <Mail className="w-4 h-4 text-primary-dark" />
                <span className="hidden sm:inline">sales@roalla.com</span>
              </a>
              <a href="tel:289-838-5868" className="flex items-center gap-1.5 text-slate-700 hover:text-primary-dark transition-colors" aria-label="Call us">
                <Phone className="w-4 h-4 text-primary-dark" />
                <span>289-838-5868</span>
              </a>
              <a href="https://www.linkedin.com/company/102042431/" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-primary-dark transition-colors" aria-label="Roalla on LinkedIn">
                <Linkedin className="w-4 h-4 text-primary-dark" />
              </a>
              <a href="https://www.youtube.com/@RoallaGroup" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-primary-dark transition-colors" aria-label="Roalla on YouTube">
                <Youtube className="w-4 h-4 text-primary-dark" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-slate-600 text-xs">
          <p suppressHydrationWarning>{t('copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
