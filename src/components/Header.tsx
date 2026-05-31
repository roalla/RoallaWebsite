'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, ChevronDown, Briefcase, Globe } from 'lucide-react'
import Image from 'next/image'
import { usePathname as useNextPathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import ScheduleButton from './ScheduleButton'

/** Canadian flag: red bands, white centre, red maple leaf (simplified) */
function CanadianFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" className={className} aria-hidden>
      <rect width="24" height="12" fill="#fff" />
      <rect width="6" height="12" fill="#D52B1E" />
      <rect x="18" width="6" height="12" fill="#D52B1E" />
      <path
        fill="#D52B1E"
        d="M12 10.2L10.2 6.8 11.2 3.8 12 1.8 12.8 3.8 13.8 6.8 12 10.2z"
      />
    </svg>
  )
}

/** Quebec flag (Fleurdelisé): blue #002395, white cross, four white fleurs-de-lis (dots at small size) */
function QuebecFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden>
      <rect width="24" height="16" fill="#002395" />
      <rect x="9" y="0" width="6" height="16" fill="#fff" />
      <rect x="0" y="5" width="24" height="6" fill="#fff" />
      <circle cx="4" cy="3" r="1.2" fill="#fff" />
      <circle cx="20" cy="3" r="1.2" fill="#fff" />
      <circle cx="4" cy="13" r="1.2" fill="#fff" />
      <circle cx="20" cy="13" r="1.2" fill="#fff" />
    </svg>
  )
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusables(container: HTMLElement | null): HTMLElement[] {
  if (!container) return []
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const localeDropdownDesktopRef = useRef<HTMLDivElement>(null)
  const localeDropdownMobileRef = useRef<HTMLDivElement>(null)
  const servicesDropdownDesktopRef = useRef<HTMLDivElement>(null)
  const scrollTick = useRef<number | null>(null)
  const previousMenuOpen = useRef(false)
  const [localeDropdownOpen, setLocaleDropdownOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [servicesMobileExpanded, setServicesMobileExpanded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = () => setPrefersReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const handleScroll = () => {
      if (scrollTick.current !== null) return
      scrollTick.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 10)
        scrollTick.current = null
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTick.current !== null) cancelAnimationFrame(scrollTick.current)
    }
  }, [mounted])

  useEffect(() => {
    if (!isMenuOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (isMenuOpen && previousMenuOpen.current === false) {
      const focusables = getFocusables(mobileMenuRef.current)
      const first = focusables[0]
      if (first) {
        requestAnimationFrame(() => first.focus())
      }
    }
    if (!isMenuOpen && previousMenuOpen.current === true) {
      menuButtonRef.current?.focus()
    }
    previousMenuOpen.current = isMenuOpen
  }, [isMenuOpen])

  useEffect(() => {
    if (!localeDropdownOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const inDesktop = localeDropdownDesktopRef.current?.contains(target)
      const inMobile = localeDropdownMobileRef.current?.contains(target)
      if (!inDesktop && !inMobile) setLocaleDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [localeDropdownOpen])

  useEffect(() => {
    if (!servicesDropdownOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (!servicesDropdownDesktopRef.current?.contains(target)) {
        setServicesDropdownOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setServicesDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [servicesDropdownOpen])

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open)
  }

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    setServicesMobileExpanded(false)
  }, [])

  const pathname = usePathname() ?? '/'
  const fullPathname = useNextPathname() ?? ''
  const isLocaleRoute = fullPathname.startsWith('/en') || fullPathname.startsWith('/fr')
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const headerCtaLabel =
    pathname === '/services'
      ? tCommon('scheduleConsultationConsulting')
      : pathname === '/services/digital' || pathname === '/digital-creations'
        ? tCommon('scheduleConsultationDigital')
        : tCommon('scheduleConsultation')
  const headerCtaSubtext = tCommon('ctaSubtext')

  const handleLocaleSelect = useCallback(
    (newLocale: 'en' | 'fr') => {
      setLocaleDropdownOpen(false)
      // Full page navigation for both EN and FR so locale and content update in one click; avoids double /fr/fr or /en/en
      const segment = pathname === '/' ? '' : pathname.startsWith('/') ? pathname : `/${pathname}`
      window.location.href = `/${newLocale}${segment}`
    },
    [pathname]
  )

  const handleMobileNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      closeMenu()
      if (pathname === '/' && href === '/') {
        e.preventDefault()
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
      }
    },
    [closeMenu, pathname]
  )

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMenu()
      return
    }
    if (e.key !== 'Tab' || !mobileMenuRef.current) return
    const focusables = getFocusables(mobileMenuRef.current)
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const handleNavButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeMenu()
  }

  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/'
      return pathname === href || pathname.startsWith(href + '/')
    },
    [pathname]
  )

  type ServiceNavHref = '/services' | '/services/digital'

  const serviceLinks: {
    nameKey: 'businessEnablement' | 'websitesAndDigital'
    descKey: 'businessEnablementDesc' | 'websitesAndDigitalDesc'
    href: ServiceNavHref
    icon: typeof Briefcase
  }[] = [
    { nameKey: 'businessEnablement', descKey: 'businessEnablementDesc', href: '/services', icon: Briefcase },
    { nameKey: 'websitesAndDigital', descKey: 'websitesAndDigitalDesc', href: '/services/digital', icon: Globe },
  ]

  const isServicesActive = pathname === '/services' || pathname.startsWith('/services/')

  const dropdownPanelClass = (open: boolean) =>
    `dropdown-panel ${open ? 'dropdown-panel-open' : 'dropdown-panel-closed'}`

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-40 transition-shadow duration-300 pt-[env(safe-area-inset-top)] bg-black/90 backdrop-blur-md border-b border-white/10 ${
        isScrolled ? 'shadow-lg shadow-black/40' : 'shadow-md shadow-black/20'
      }`}
    >
      {/* Skip to main content - visible on focus for keyboard/screen reader users */}
      <a href="#main-content" className="skip-link">
        {tCommon('skipToContent')}
      </a>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between gap-6 h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 min-w-0 max-w-[140px] sm:max-w-[200px]">
            <Link
              href="/"
              className="flex items-center space-x-2 sm:space-x-3 group min-w-0"
              onClick={closeMenu}
              aria-label="Go to homepage"
            >
              <div className="flex-shrink-0">
                <Image
                  src="/logo.svg"
                  alt="Roalla Business Enablement Group Logo"
                  width={40}
                  height={40}
                  className={`w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`}
                  priority
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-white group-hover:text-primary transition-colors duration-200 truncate">
                  {tCommon('companyName')}
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center min-w-0 flex-1 px-4">
            <div className="flex items-center justify-center gap-8 xl:gap-10">
              <div>
                <Link
                  href="/"
                  aria-current={isActive('/') ? 'page' : undefined}
                  className={`text-sm xl:text-base font-medium transition-colors duration-200 relative group whitespace-nowrap block py-2 ${
                    isActive('/') ? 'text-primary' : 'text-gray-300 hover:text-primary'
                  }`}
                  onClick={closeMenu}
                >
                  {t('home')}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              </div>

              <div className="relative" ref={servicesDropdownDesktopRef}>
                <button
                  type="button"
                  onClick={() => setServicesDropdownOpen((o) => !o)}
                  aria-expanded={servicesDropdownOpen}
                  aria-haspopup="menu"
                  id="services-dropdown-desktop"
                  className={`text-sm xl:text-base font-medium transition-colors duration-200 relative group whitespace-nowrap flex items-center gap-1 py-2 rounded-md px-1 -mx-1 ${
                    isServicesActive || servicesDropdownOpen
                      ? 'text-primary'
                      : 'text-gray-300 hover:text-primary'
                  } ${servicesDropdownOpen ? 'bg-white/5' : ''}`}
                >
                  {t('services')}
                  <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      isServicesActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
                <div
                  role="menu"
                  aria-labelledby="services-dropdown-desktop"
                  aria-hidden={!servicesDropdownOpen}
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[min(100vw-2rem,320px)] overflow-hidden rounded-xl bg-zinc-950 border border-white/10 shadow-2xl shadow-black/60 z-50 ${dropdownPanelClass(servicesDropdownOpen)}`}
                >
                      <div className="px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {t('servicesMenuLabel')}
                        </p>
                      </div>
                      <div className="p-1.5">
                        {serviceLinks.map((item) => {
                          const active = isActive(item.href)
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              role="menuitem"
                              aria-current={active ? 'page' : undefined}
                              onClick={() => {
                                setServicesDropdownOpen(false)
                                closeMenu()
                              }}
                              className={`group flex gap-3 rounded-lg px-3 py-3 transition-colors ${
                                active ? 'bg-primary/10' : 'hover:bg-white/5'
                              }`}
                            >
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                  active
                                    ? 'bg-primary/20 text-primary'
                                    : 'bg-white/5 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                                }`}
                              >
                                <Icon className="h-4 w-4" aria-hidden />
                              </div>
                              <div className="min-w-0 text-left">
                                <p className={`text-sm font-semibold leading-snug ${active ? 'text-primary' : 'text-white'}`}>
                                  {t(item.nameKey)}
                                </p>
                                <p className="mt-0.5 text-xs leading-snug text-slate-400 group-hover:text-slate-300">
                                  {t(item.descKey)}
                                </p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                </div>
              </div>

              <div>
                <Link
                  href="/digital-creations"
                  aria-current={isActive('/digital-creations') ? 'page' : undefined}
                  className={`text-sm xl:text-base font-medium transition-colors duration-200 relative group whitespace-nowrap block py-2 ${
                    isActive('/digital-creations') ? 'text-primary' : 'text-gray-300 hover:text-primary'
                  }`}
                  onClick={closeMenu}
                >
                  {t('ourWork')}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      isActive('/digital-creations') ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center justify-end gap-3 flex-shrink-0">
            {isLocaleRoute && (
              <div className="relative flex items-center" ref={localeDropdownDesktopRef}>
                <button
                  type="button"
                  onClick={() => setLocaleDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  aria-expanded={localeDropdownOpen}
                  aria-haspopup="listbox"
                  aria-label="Select language"
                  id="locale-dropdown-desktop"
                >
                  {locale === 'en' ? (
                    <CanadianFlagIcon className="w-5 h-[10px] flex-shrink-0" />
                  ) : (
                    <QuebecFlagIcon className="w-5 h-[10px] flex-shrink-0" />
                  )}
                  <span>{locale === 'en' ? 'EN' : 'FR'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${localeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  role="listbox"
                  aria-labelledby="locale-dropdown-desktop"
                  aria-hidden={!localeDropdownOpen}
                  className={`absolute right-0 top-full mt-2 py-1 min-w-[120px] bg-zinc-950 rounded-lg shadow-2xl shadow-black/60 border border-white/10 z-50 ${dropdownPanelClass(localeDropdownOpen)}`}
                >
                      <button
                        type="button"
                        role="option"
                        aria-selected={locale === 'en'}
                        onClick={() => handleLocaleSelect('en')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium text-white hover:bg-white/10 first:rounded-t-lg"
                      >
                        <CanadianFlagIcon className="w-5 h-[10px] flex-shrink-0" />
                        <span>EN</span>
                      </button>
                      <button
                        type="button"
                        role="option"
                        aria-selected={locale === 'fr'}
                        onClick={() => handleLocaleSelect('fr')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium text-white hover:bg-white/10 last:rounded-b-lg"
                      >
                        <QuebecFlagIcon className="w-5 h-[10px] flex-shrink-0" />
                        <span>FR</span>
                      </button>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <ScheduleButton
                variant="primary"
                size="sm"
                icon
                className="!py-2.5 !px-5 !text-sm"
                hoverHint={headerCtaSubtext}
              >
                {headerCtaLabel}
              </ScheduleButton>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              onKeyDown={handleNavButtonKeyDown}
              className="mobile-nav-toggle p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" aria-hidden />
              ) : (
                <Menu className="w-6 h-6 text-white" aria-hidden />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - focus trap container */}
        {isMenuOpen && (
            <div
              id="mobile-menu"
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              onKeyDown={handleMenuKeyDown}
              className="lg:hidden overflow-hidden fixed left-0 right-0 z-50 shadow-lg top-[calc(4rem+env(safe-area-inset-top,0px))] flex flex-col mobile-menu-panel mobile-menu-panel-open"
              style={{ maxHeight: 'calc(100vh - 4rem - env(safe-area-inset-top, 0px))' }}
            >
              <div className="flex-1 overflow-y-auto px-2 pt-2 pb-3 space-y-1 bg-black border-t border-white/10">
                <div>
                  <Link
                    href="/"
                    aria-current={isActive('/') ? 'page' : undefined}
                    className={`block px-3 py-3 min-h-[44px] flex items-center rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive('/')
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-300 hover:text-primary hover:bg-white/5'
                    }`}
                    onClick={(e) => handleMobileNavClick(e, '/')}
                  >
                    {t('home')}
                  </Link>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setServicesMobileExpanded((o) => !o)}
                    aria-expanded={servicesMobileExpanded}
                    className={`w-full flex items-center justify-between px-3 py-3 min-h-[44px] rounded-md text-base font-medium transition-colors duration-200 ${
                      isServicesActive
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-300 hover:text-primary hover:bg-white/5'
                    }`}
                  >
                    {t('services')}
                    <ChevronDown className={`w-5 h-5 transition-transform ${servicesMobileExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    className={`collapse-grid ${servicesMobileExpanded ? 'collapse-grid-open' : 'collapse-grid-closed'}`}
                  >
                    <div className="overflow-hidden min-h-0">
                        {serviceLinks.map((item) => {
                          const active = isActive(item.href)
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              aria-current={active ? 'page' : undefined}
                              className={`flex gap-3 pl-5 pr-3 py-3 min-h-[44px] rounded-md transition-colors duration-200 ${
                                active
                                  ? 'text-primary bg-primary/10'
                                  : 'text-gray-300 hover:text-primary hover:bg-white/5'
                              }`}
                              onClick={(e) => handleMobileNavClick(e, item.href)}
                            >
                              <Icon className="h-4 w-4 shrink-0 mt-0.5 opacity-70" aria-hidden />
                              <span>
                                <span className="block text-base font-medium">{t(item.nameKey)}</span>
                                <span className="block text-xs text-slate-500 mt-0.5">{t(item.descKey)}</span>
                              </span>
                            </Link>
                          )
                        })}
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    href="/digital-creations"
                    aria-current={isActive('/digital-creations') ? 'page' : undefined}
                    className={`block px-3 py-3 min-h-[44px] flex items-center rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive('/digital-creations')
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-300 hover:text-primary hover:bg-white/5'
                    }`}
                    onClick={(e) => handleMobileNavClick(e, '/digital-creations')}
                  >
                    {t('ourWork')}
                  </Link>
                </div>
                {isLocaleRoute && (
                  <div className="px-3 py-3 border-t border-white/10 relative" ref={localeDropdownMobileRef}>
                    <span className="block text-xs font-medium text-gray-400 mb-1.5">Language</span>
                    <button
                      type="button"
                      onClick={() => setLocaleDropdownOpen((o) => !o)}
                      className="w-full flex items-center gap-2 text-base font-medium text-white bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      aria-expanded={localeDropdownOpen}
                      aria-haspopup="listbox"
                      aria-label="Select language"
                      id="locale-dropdown-mobile"
                    >
                      {locale === 'en' ? (
                        <CanadianFlagIcon className="w-6 h-4 flex-shrink-0" />
                      ) : (
                        <QuebecFlagIcon className="w-6 h-4 flex-shrink-0" />
                      )}
                      <span>{locale === 'en' ? 'EN' : 'FR'}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${localeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div
                      role="listbox"
                      aria-labelledby="locale-dropdown-mobile"
                      aria-hidden={!localeDropdownOpen}
                      className={`absolute left-3 right-3 top-full mt-1 py-1 bg-zinc-950 rounded-lg shadow-2xl shadow-black/60 border border-white/10 z-50 ${dropdownPanelClass(localeDropdownOpen)}`}
                    >
                          <button
                            type="button"
                            role="option"
                            aria-selected={locale === 'en'}
                            onClick={() => handleLocaleSelect('en')}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-base font-medium text-white hover:bg-white/10 first:rounded-t-lg"
                          >
                            <CanadianFlagIcon className="w-6 h-4 flex-shrink-0" />
                            <span>EN</span>
                          </button>
                          <button
                            type="button"
                            role="option"
                            aria-selected={locale === 'fr'}
                            onClick={() => handleLocaleSelect('fr')}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-base font-medium text-white hover:bg-white/10 last:rounded-b-lg"
                          >
                            <QuebecFlagIcon className="w-6 h-4 flex-shrink-0" />
                            <span>FR</span>
                          </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Sticky CTA at bottom of mobile menu */}
              <div className="flex-shrink-0 p-3 bg-black border-t border-white/10">
                <ScheduleButton
                  variant="primary"
                  size="md"
                  icon
                  block
                  className="justify-center"
                  hoverHint={headerCtaSubtext}
                >
                  {headerCtaLabel}
                </ScheduleButton>
              </div>
            </div>
          )}
      </nav>

      {/* Backdrop - cursor-pointer to show it's clickable */}
      {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden cursor-pointer transition-opacity duration-200"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
    </header>
  )
}

export default Header
