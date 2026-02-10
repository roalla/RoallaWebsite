'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { usePathname as useNextPathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import ScheduleButton from './CalendlyButton'
import { authSlotPlaceholder } from './HeaderAuthSlot'

const HeaderAuthSlot = dynamic(() => import('./HeaderAuthSlot').then((m) => m.default), {
  ssr: false,
  loading: () => authSlotPlaceholder,
})

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
  const scrollTick = useRef<number | null>(null)
  const previousMenuOpen = useRef(false)
  const [localeDropdownOpen, setLocaleDropdownOpen] = useState(false)

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

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open)
  }

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const pathname = usePathname() ?? '/'
  const fullPathname = useNextPathname() ?? ''
  const isLocaleRoute = fullPathname.startsWith('/en') || fullPathname.startsWith('/fr')
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const locale = useLocale()

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

  type NavHref = '/' | '/services' | '/resources' | '/digital-creations'
  const navigation: { nameKey: 'home' | 'services' | 'resourceCentre' | 'digitalCreations'; href: NavHref }[] = [
    { nameKey: 'home', href: '/' },
    { nameKey: 'services', href: '/services' },
    { nameKey: 'resourceCentre', href: '/resources' },
    { nameKey: 'digitalCreations', href: '/digital-creations' },
  ]

  const noMotion = {
    initial: false,
    animate: false,
    transition: { duration: 0 },
  }
  const motionProps = prefersReducedMotion
    ? noMotion
    : {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5 },
      }
  const motionNavItem = (index: number) =>
    prefersReducedMotion
      ? noMotion
      : {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: index * 0.1 },
        }
  const motionCta = prefersReducedMotion
    ? noMotion
    : {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, delay: 0.6 },
      }
  const motionMobileItem = (index: number) =>
    prefersReducedMotion
      ? noMotion
      : {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.3, delay: index * 0.1 },
        }
  const motionMobileCta = prefersReducedMotion
    ? noMotion
    : {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.3, delay: navigation.length * 0.1 },
      }
  const menuTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: 'easeInOut' as const }
  const backdropTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }
  const iconTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
        isScrolled ? 'bg-white/80 shadow-md backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      {/* Skip to main content - visible on focus for keyboard/screen reader users */}
      <a href="#main-content" className="skip-link">
        {tCommon('skipToContent')}
      </a>

      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between gap-4 h-16 lg:h-20">
          {/* Logo - fixed width so it never pushes nav */}
          <motion.div
            {...motionProps}
            className="flex-shrink-0 min-w-0 max-w-[45%] lg:max-w-[280px]"
          >
            <Link
              href="/"
              className="flex items-center space-x-3 group min-w-0"
              onClick={closeMenu}
              aria-label="Go to homepage"
            >
              <div className="flex-shrink-0">
                <Image
                  src="/logo.svg"
                  alt="Roalla Business Enablement Group Logo"
                  width={40}
                  height={40}
                  className={`w-10 h-10 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`}
                  priority
                />
              </div>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200 truncate">
                  {tCommon('companyName')}
                </h1>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center justify-center gap-6 xl:gap-8 flex-wrap">
              {navigation.map((item, index) => {
                const active = isActive(item.href)
                return (
                  <motion.div key={item.nameKey} {...motionNavItem(index)}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`font-medium transition-colors duration-200 relative group whitespace-nowrap flex-shrink-0 block ${
                        active ? 'text-primary' : 'text-gray-700 hover:text-primary'
                      }`}
                      onClick={closeMenu}
                    >
                      {t(item.nameKey)}
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                          active ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center justify-end space-x-4 flex-shrink-0 min-w-[200px] xl:min-w-[260px]">
            {isLocaleRoute && (
              <div className="relative flex items-center" ref={localeDropdownDesktopRef}>
                <button
                  type="button"
                  onClick={() => setLocaleDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200 rounded-lg pl-2.5 pr-2 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${localeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {localeDropdownOpen && (
                    <motion.div
                      role="listbox"
                      aria-labelledby="locale-dropdown-desktop"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 py-1 min-w-[120px] bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={locale === 'en'}
                        onClick={() => handleLocaleSelect('en')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 first:rounded-t-lg"
                      >
                        <CanadianFlagIcon className="w-5 h-[10px] flex-shrink-0" />
                        <span>EN</span>
                      </button>
                      <button
                        type="button"
                        role="option"
                        aria-selected={locale === 'fr'}
                        onClick={() => handleLocaleSelect('fr')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 last:rounded-b-lg"
                      >
                        <QuebecFlagIcon className="w-5 h-[10px] flex-shrink-0" />
                        <span>FR</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <HeaderAuthSlot />
            <motion.div {...motionCta}>
              <ScheduleButton variant="primary" size="md" icon>
                {tCommon('scheduleConsultation')}
              </ScheduleButton>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              onKeyDown={handleNavButtonKeyDown}
              className="mobile-nav-toggle p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={prefersReducedMotion ? false : { rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={prefersReducedMotion ? undefined : { rotate: 90, opacity: 0 }}
                    transition={iconTransition}
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={prefersReducedMotion ? false : { rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={prefersReducedMotion ? undefined : { rotate: -90, opacity: 0 }}
                    transition={iconTransition}
                  >
                    <Menu className="w-6 h-6 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - focus trap container */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
              transition={menuTransition}
              onKeyDown={handleMenuKeyDown}
              className="lg:hidden overflow-hidden fixed left-0 right-0 z-50 shadow-lg top-[calc(4rem+env(safe-area-inset-top,0px))] flex flex-col"
              style={{ maxHeight: 'calc(100vh - 4rem - env(safe-area-inset-top, 0px))' }}
            >
              <div className="flex-1 overflow-y-auto px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                {navigation.map((item, index) => {
                  const active = isActive(item.href)
                  return (
                    <motion.div key={item.nameKey} {...motionMobileItem(index)}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={`block px-3 py-3 min-h-[44px] flex items-center rounded-md text-base font-medium transition-colors duration-200 ${
                          active
                            ? 'text-primary bg-primary/10'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                        }`}
                        onClick={(e) => handleMobileNavClick(e, item.href)}
                      >
                        {t(item.nameKey)}
                      </Link>
                    </motion.div>
                  )
                })}
                {isLocaleRoute && (
                  <div className="px-3 py-3 border-t border-gray-100 relative" ref={localeDropdownMobileRef}>
                    <span className="block text-xs font-medium text-gray-500 mb-1.5">Language</span>
                    <button
                      type="button"
                      onClick={() => setLocaleDropdownOpen((o) => !o)}
                      className="w-full flex items-center gap-2 text-base font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      <ChevronDown className={`w-5 h-5 text-gray-500 ml-auto transition-transform ${localeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {localeDropdownOpen && (
                        <motion.div
                          role="listbox"
                          aria-labelledby="locale-dropdown-mobile"
                          initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-3 right-3 top-full mt-1 py-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                        >
                          <button
                            type="button"
                            role="option"
                            aria-selected={locale === 'en'}
                            onClick={() => handleLocaleSelect('en')}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-base font-medium text-gray-800 hover:bg-gray-50 first:rounded-t-lg"
                          >
                            <CanadianFlagIcon className="w-6 h-4 flex-shrink-0" />
                            <span>EN</span>
                          </button>
                          <button
                            type="button"
                            role="option"
                            aria-selected={locale === 'fr'}
                            onClick={() => handleLocaleSelect('fr')}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-base font-medium text-gray-800 hover:bg-gray-50 last:rounded-b-lg"
                          >
                            <QuebecFlagIcon className="w-6 h-4 flex-shrink-0" />
                            <span>FR</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <div className="px-3 py-3 min-h-[44px] flex items-center border-t border-gray-100">
                  <HeaderAuthSlot variant="mobile" onNavigate={closeMenu} />
                </div>
              </div>
              {/* Sticky CTA at bottom of mobile menu */}
              <div className="flex-shrink-0 p-3 bg-white border-t border-gray-200">
                <motion.div {...motionMobileCta}>
                  <ScheduleButton
                    variant="primary"
                    size="md"
                    icon
                    className="w-full justify-center"
                  >
                    {tCommon('scheduleConsultation')}
                  </ScheduleButton>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop - cursor-pointer to show it's clickable */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 bg-black/20 z-30 lg:hidden cursor-pointer"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
