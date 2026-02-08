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

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Roalla Business Enablement Group</h3>
            <p className="text-gray-300">Empowering your business for a digital-first world.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/#services" className="hover:text-primary-light transition-colors">Services</Link></li>
              <li><Link href="/#about" className="hover:text-primary-light transition-colors">About</Link></li>
              <li><Link href="/#contact" className="hover:text-primary-light transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary-light" />
                <a href="mailto:sales@roalla.com" className="hover:text-primary-light transition-colors">sales@roalla.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-primary-light" />
                <a href="tel:289-838-5868" className="hover:text-primary-light transition-colors">289-838-5868</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright - suppressHydrationWarning: year can differ server vs client (timezone) */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p suppressHydrationWarning>&copy; {currentYear} Roalla Business Enablement Group. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 