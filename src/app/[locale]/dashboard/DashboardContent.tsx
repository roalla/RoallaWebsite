'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import { FileText, LayoutDashboard, ArrowRight, ShieldCheck, Sparkles, Clock3 } from 'lucide-react'
import Image from 'next/image'

type Props = { locale: string; userName: string }

export default function DashboardContent({ locale, userName }: Props) {
  const t = useTranslations('dashboard')
  const [portalApproved, setPortalApproved] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    let cancelled = false
    fetch('/api/resources/verify-access?session=1', { credentials: 'include' })
      .then((res) => {
        if (cancelled) return
        setPortalApproved(res.ok)
      })
      .catch(() => {
        if (!cancelled) setPortalApproved(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const cards = [
    {
      href: `/${locale}/resources/request`,
      title: t('requestAccess'),
      description: t('requestAccessDesc'),
      icon: FileText,
      className: 'from-emerald-500 to-emerald-600',
    },
    {
      href: portalApproved ? `/${locale}/resources/portal` : `/${locale}/resources/request`,
      title: t('viewPortal'),
      description:
        portalApproved === null
          ? 'Checking access status...'
          : portalApproved
            ? t('viewPortalDesc')
            : 'Access pending approval. Submit a request or contact your Roalla advisor.',
      icon: LayoutDashboard,
      className: portalApproved ? 'from-violet-500 to-violet-600' : 'from-amber-500 to-amber-600',
      pending: portalApproved === false,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(34,197,94,0.12),transparent_30%)]" />

      <header className="relative border-b border-white/20 bg-black/70 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="block" aria-label="Go to home page">
            <Image src="/logo.svg" alt="ROALLA" width={120} height={40} className="h-10 w-auto" priority />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-3 py-2 text-sm text-gray-100 hover:bg-white/10 hover:text-white transition-colors"
          >
            {t('backToHome')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-12 lg:py-16">
        <section className="rounded-2xl border border-white/20 bg-black/70 shadow-2xl p-8 lg:p-10 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary mb-5">
            <ShieldCheck className="w-4 h-4" />
            Secure Workspace
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">{t('title')}</h1>
          <p className="text-gray-200 text-base lg:text-lg">{t('welcome', { name: userName })}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-gray-100">
              <Sparkles className="w-4 h-4 text-primary" />
              Fast access to your most-used tools
            </span>
          </div>
        </section>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ href, title, description, icon: Icon, className, pending }) => (
            <NextLink
              key={href}
              href={href}
              className="group block p-6 rounded-2xl bg-black/60 border border-white/20 hover:bg-black/75 hover:border-primary/60 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${className} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-semibold text-lg mb-2">{title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed min-h-[40px]">{description}</p>
              {pending && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                  <Clock3 className="w-3.5 h-3.5" />
                  Approval Required
                </div>
              )}
              <div className="mt-4 inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-sm text-primary font-semibold">
                {pending ? 'Request Access' : 'Open'}
                <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </NextLink>
          ))}
        </div>
      </main>
    </div>
  )
}
