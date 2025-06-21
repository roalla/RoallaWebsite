'use client'

import React, { useState } from 'react'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { ThemeToggleButton } from './ThemeToggleButton'
import Link from 'next/link'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 shadow-lg border-b border-gray-200 dark:border-gray-600 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold gradient-text">
              Roalla Business Enablement Group
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <nav className="flex space-x-4">
                <Link href="/#services" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium px-3 py-2 rounded-md text-sm transition-colors">Services</Link>
                <Link href="/#about" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium px-3 py-2 rounded-md text-sm transition-colors">About</Link>
                <Link href="/#testimonials" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium px-3 py-2 rounded-md text-sm transition-colors">Testimonials</Link>
                <Link href="/#contact" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium px-3 py-2 rounded-md text-sm transition-colors">Contact</Link>
              </nav>
              <ThemeToggleButton />
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <ThemeToggleButton />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-100 dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-600">
            <Link href="/#services" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/#about" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/#testimonials" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>Testimonials</Link>
            <Link href="/#contact" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header 