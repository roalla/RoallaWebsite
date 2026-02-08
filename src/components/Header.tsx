'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import ScheduleButton from './CalendlyButton'
import UserMenu from './UserMenu'

const Header = () => {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMenu()
    }
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'Resources', href: '/#resources' },
    { name: 'Digital Creations', href: '/#digital-creations' },
    { name: 'About', href: '/#about' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Contact', href: '/#contact' }
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 shadow-md backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between gap-4 h-16 lg:h-20">
          {/* Logo - fixed width so it never pushes nav */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
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
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-200"
                  priority
                />
              </div>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200 truncate">
                  Roalla Business Enablement Group
                </h1>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - takes remaining space, can shrink so it never overlaps right block */}
          <div className="hidden lg:flex items-center justify-center min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center justify-center gap-6 xl:gap-8 flex-wrap">
              {navigation.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 relative group whitespace-nowrap flex-shrink-0"
                  onClick={closeMenu}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Desktop Actions - Login or avatar + dropdown */}
          <div className="hidden lg:flex items-center justify-end space-x-4 flex-shrink-0 min-w-[200px] xl:min-w-[260px]">
            {mounted ? (
              session ? (
                <UserMenu />
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary transition-colors whitespace-nowrap"
                >
                  Login
                </Link>
              )
            ) : (
              <span className="text-sm font-medium text-gray-400 whitespace-nowrap" aria-hidden>Login</span>
            )}
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <ScheduleButton variant="primary" size="md" icon>
                Schedule Consultation
              </ScheduleButton>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleMenu}
              onKeyDown={handleKeyDown}
              className="mobile-nav-toggle p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                {navigation.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </motion.a>
                ))}
                {mounted ? (
                  session ? (
                    <div className="px-3 py-2 border-t border-gray-100">
                      <UserMenu />
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-50 transition-colors duration-200"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                  )
                ) : (
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-500"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                )}
                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navigation.length * 0.1 }}
                  className="pt-4"
                >
                  <ScheduleButton variant="primary" size="md" icon>
                    Schedule Consultation
                  </ScheduleButton>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header 