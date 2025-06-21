'use client'

import React, { useState } from 'react'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { ThemeToggleButton } from './ThemeToggleButton'
import Link from 'next/link'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-background/95 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 shadow-lg border-b transition-all duration-300">
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
                <Link href="/#services" className="text-muted-foreground hover:text-primary font-medium px-3 py-2 rounded-md text-sm transition-colors">Services</Link>
                <Link href="/#about" className="text-muted-foreground hover:text-primary font-medium px-3 py-2 rounded-md text-sm transition-colors">About</Link>
                <Link href="/#testimonials" className="text-muted-foreground hover:text-primary font-medium px-3 py-2 rounded-md text-sm transition-colors">Testimonials</Link>
                <Link href="/#contact" className="text-muted-foreground hover:text-primary font-medium px-3 py-2 rounded-md text-sm transition-colors">Contact</Link>
              </nav>
              <ThemeToggleButton />
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <ThemeToggleButton />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-secondary inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
            <Link href="/#services" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/#about" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/#testimonials" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>Testimonials</Link>
            <Link href="/#contact" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header 