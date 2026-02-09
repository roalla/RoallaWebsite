import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    services: [
      { name: 'Strategic Planning', href: '#services' },
      { name: 'Business Optimization', href: '#services' },
      { name: 'Leadership Development', href: '#services' },
      { name: 'Growth Strategy', href: '#services' },
      { name: 'Innovation Consulting', href: '#services' },
      { name: 'Risk Management', href: '#services' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Team', href: '#about' },
      { name: 'Case Studies', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#contact' }
    ],
    resources: [
      { name: 'Blog', href: '#' },
      { name: 'Whitepapers', href: '#' },
      { name: 'Webinars', href: '#' },
      { name: 'Tools & Templates', href: '#' },
      { name: 'Industry Insights', href: '#' },
      { name: 'Newsletter', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR Compliance', href: '#' }
    ]
  }

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ]

  const quickLinks = [
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Resource Centre', href: '/resources' },
    { name: 'Digital Creations', href: '/digital-creations' },
    { name: 'Assessment', href: '/assessment' },
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
          <div className="flex items-center gap-4 text-sm flex-shrink-0">
            <a href="mailto:sales@roalla.com" className="flex items-center gap-1.5 hover:text-primary-light transition-colors">
              <Mail className="w-4 h-4 text-primary-light" />
              <span className="hidden sm:inline">sales@roalla.com</span>
            </a>
            <a href="tel:289-838-5868" className="flex items-center gap-1.5 hover:text-primary-light transition-colors">
              <Phone className="w-4 h-4 text-primary-light" />
              <span>289-838-5868</span>
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