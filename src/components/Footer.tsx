'use client'

import React from 'react'
import { Mail, Phone, Linkedin, Youtube } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')

  type FooterHref = '/' | '/services' | '/services/digital' | '/about' | '/contact' | '/digital-creations' | '/assessment' | '/faq' | '/schedule'
  const quickLinks: { nameKey: 'businessEnablement' | 'websitesAndDigital' | 'ourWork' | 'faq' | 'contact' | 'about'; href: FooterHref }[] = [
    { nameKey: 'businessEnablement', href: '/services' },
    { nameKey: 'websitesAndDigital', href: '/services/digital' },
    { nameKey: 'ourWork', href: '/digital-creations' },
    { nameKey: 'faq', href: '/faq' },
    { nameKey: 'contact', href: '/contact' },
    { nameKey: 'about', href: '/about' },
  ]

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{tCommon('companyName')}</p>
            <p className="text-xs text-slate-500 mt-0.5">{tCommon('tagline')}</p>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-label="Footer links">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary transition-colors whitespace-nowrap">
                {t(link.nameKey)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-sm flex-shrink-0 flex-wrap">
            <a href="mailto:sales@roalla.com" className="flex items-center gap-1.5 hover:text-primary transition-colors" aria-label="Email us">
              <Mail className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">sales@roalla.com</span>
            </a>
            <a href="tel:289-838-5868" className="flex items-center gap-1.5 hover:text-primary transition-colors" aria-label="Call us">
              <Phone className="w-4 h-4 text-primary" />
              <span>289-838-5868</span>
            </a>
            <a href="https://www.linkedin.com/company/102042431/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors" aria-label="Roalla on LinkedIn">
              <Linkedin className="w-4 h-4 text-primary" />
            </a>
            <a href="https://www.youtube.com/@RoallaGroup" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors" aria-label="Roalla on YouTube">
              <Youtube className="w-4 h-4 text-primary" />
            </a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 text-center text-slate-400 text-xs">
          <p suppressHydrationWarning>{t('copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
