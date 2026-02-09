import React from 'react'
import { Mail, Phone, Linkedin, Youtube } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Resource Centre', href: '/resources' },
    { name: 'Digital Creations', href: '/digital-creations' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
    { name: 'Trust Centre', href: '/trust' },
  ]

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Roalla Business Enablement Group</p>
            <p className="text-xs text-gray-400 mt-0.5">Empowering your business for a digital-first world.</p>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-label="Footer links">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary-light transition-colors whitespace-nowrap">
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-sm flex-shrink-0 flex-wrap">
            <a href="mailto:sales@roalla.com" className="flex items-center gap-1.5 hover:text-primary-light transition-colors" aria-label="Email us">
              <Mail className="w-4 h-4 text-primary-light" />
              <span className="hidden sm:inline">sales@roalla.com</span>
            </a>
            <a href="tel:289-838-5868" className="flex items-center gap-1.5 hover:text-primary-light transition-colors" aria-label="Call us">
              <Phone className="w-4 h-4 text-primary-light" />
              <span>289-838-5868</span>
            </a>
            <a href="https://www.linkedin.com/company/102042431/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary-light transition-colors" aria-label="Roalla on LinkedIn">
              <Linkedin className="w-4 h-4 text-primary-light" />
            </a>
            <a href="https://www.youtube.com/@RoallaGroup" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary-light transition-colors" aria-label="Roalla on YouTube">
              <Youtube className="w-4 h-4 text-primary-light" />
            </a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700 text-center text-gray-400 text-xs">
          <p suppressHydrationWarning>&copy; {currentYear} Roalla Business Enablement Group. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 