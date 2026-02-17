'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import { User, FileText, LayoutDashboard } from 'lucide-react'
import Image from 'next/image'

type Props = { locale: string; userName: string }

export default function DashboardContent({ locale, userName }: Props) {
  const t = useTranslations('dashboard')

  const cards = [
    {
      href: '/profile',
      title: t('profile'),
      description: t('profileDesc'),
      icon: User,
      className: 'from-blue-500 to-blue-600',
    },
    {
      href: `/${locale}/resources/request`,
      title: t('requestAccess'),
      description: t('requestAccessDesc'),
      icon: FileText,
      className: 'from-emerald-500 to-emerald-600',
    },
    {
      href: `/${locale}/resources/portal`,
      title: t('viewPortal'),
      description: t('viewPortalDesc'),
      icon: LayoutDashboard,
      className: 'from-violet-500 to-violet-600',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="block">
            <Image src="/logo.svg" alt="ROALLA" width={120} height={40} className="h-10 w-auto" />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-400 mb-10">{t('welcome', { name: userName })}</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ href, title, description, icon: Icon, className }) => (
            <NextLink
              key={href}
              href={href}
              className="block p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${className} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-semibold text-lg mb-1">{title}</h2>
              <p className="text-gray-400 text-sm">{description}</p>
            </NextLink>
          ))}
        </div>
      </main>
    </div>
  )
}
