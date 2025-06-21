'use client'

import React, { useState } from 'react'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { ThemeToggleButton } from './ThemeToggleButton'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-secondary-100">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold gradient-text">Roalla Business Enablement Group</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Contact Info & Theme Toggle */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:289-838-5868"
              className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm">289-838-5868</span>
            </a>
            <a
              href="mailto:sales@roalla.com"
              className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200"
            >
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-sm">sales@roalla.com</span>
            </a>
            <ThemeToggleButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="px-3 py-2 space-y-2">
                  <a
                    href="tel:289-838-5868"
                    className="flex items-center text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">289-838-5868</span>
                  </a>
                  <a
                    href="mailto:sales@roalla.com"
                    className="flex items-center text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">sales@roalla.com</span>
                  </a>
                </div>
                <div className="px-3 py-2">
                   <ThemeToggleButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 