'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'
import {
  FileText,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock3,
  CheckCircle2,
  CalendarClock,
  Bell,
  HelpCircle,
  Star,
  StarOff,
  FolderOpen,
  Download,
  Eye,
  ExternalLink,
} from 'lucide-react'

type Props = { locale: string; userName: string }
type PortalResource = {
  id: string
  title: string
  type: string
  color?: string | null
  createdAt?: string
}

const PINNED_RESOURCES_KEY = 'dashboard_pinned_resources'

type DashboardSummary = {
  access: {
    status: string
    fullAccess: boolean
    requestedAt: string
    updatedAt: string
  } | null
  activity: {
    lastLoginAt: string | null
    accountCreatedAt: string | null
    lastPortalActionAt: string | null
    lastPortalAction: string | null
  }
  portal: {
    bundlesRedeemed: number
    lastBundleRedeemedAt: string | null
    grantedItemsCount: number
  }
  recentActions: Array<{
    action: string
    at: string
    resourceId: string | null
    articleId: string | null
    itemTitle: string | null
  }>
}

function formatDateTime(value: string | null): string {
  if (!value) return 'Not yet'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Not yet'
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function humanizeAction(action: string): string {
  if (action === 'download') return 'Downloaded'
  if (action === 'view') return 'Viewed'
  if (action === 'link_click') return 'Opened link'
  return action.replace(/_/g, ' ')
}

function getActionMeta(action: string): {
  labelClass: string
  icon: React.ComponentType<{ className?: string }>
} {
  if (action === 'download') {
    return {
      labelClass: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
      icon: Download,
    }
  }
  if (action === 'view') {
    return {
      labelClass: 'border-blue-400/30 bg-blue-500/10 text-blue-300',
      icon: Eye,
    }
  }
  if (action === 'link_click') {
    return {
      labelClass: 'border-violet-400/30 bg-violet-500/10 text-violet-300',
      icon: ExternalLink,
    }
  }
  return {
    labelClass: 'border-white/20 bg-white/10 text-gray-300',
    icon: FileText,
  }
}

export default function DashboardContent({ locale, userName }: Props) {
  const t = useTranslations('dashboard')
  const [portalApproved, setPortalApproved] = React.useState<boolean | null>(null)
  const [resources, setResources] = React.useState<PortalResource[]>([])
  const [pinnedIds, setPinnedIds] = React.useState<string[]>([])
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null)

  React.useEffect(() => {
    let cancelled = false
    setPinnedIds(JSON.parse(localStorage.getItem(PINNED_RESOURCES_KEY) || '[]') as string[])

    fetch('/api/dashboard/summary', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setSummary(data as DashboardSummary)
      })
      .catch(() => {
        if (!cancelled) setSummary(null)
      })

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

  React.useEffect(() => {
    if (!portalApproved) return
    let cancelled = false
    fetch('/api/resources/portal/content?session=1', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { resources: [] }))
      .then((data) => {
        if (cancelled) return
        const rs: PortalResource[] = (data.resources || []).map((r: {
          id: string
          title: string
          type?: string
          color?: string
          createdAt?: string
        }) => ({
          id: r.id,
          title: r.title,
          type: r.type || 'Resource',
          color: r.color || 'from-violet-500 to-indigo-600',
          createdAt: r.createdAt,
        }))
        rs.sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return tb - ta
        })
        setResources(rs)
      })
      .catch(() => {
        if (!cancelled) setResources([])
      })
    return () => {
      cancelled = true
    }
  }, [portalApproved])

  const togglePin = (resourceId: string) => {
    setPinnedIds((prev) => {
      const next = prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
      localStorage.setItem(PINNED_RESOURCES_KEY, JSON.stringify(next))
      return next
    })
  }

  const recentResources = resources.slice(0, 5)
  const pinnedResources = resources.filter((r) => pinnedIds.includes(r.id))
  const recommendation = portalApproved === null
    ? {
        title: 'Checking your access status',
        description: 'We are confirming your portal permissions.',
        href: '#',
        cta: 'Please wait',
      }
    : portalApproved && resources.length === 0
      ? {
          title: 'Your access is active',
          description: 'No resources are assigned yet. Redeem a code in the portal to unlock content.',
          href: `/${locale}/resources/portal`,
          cta: 'Open Portal',
        }
      : portalApproved
        ? {
            title: 'Continue where you left off',
            description: 'Jump into the portal and review newly added guides and tools.',
            href: `/${locale}/resources/portal`,
            cta: 'Open Portal',
          }
        : {
            title: 'Complete access setup',
            description: 'Your portal access is pending. Submit or re-submit your request now.',
            href: `/${locale}/resources/request`,
            cta: 'Request Access',
          }

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
              Fast access to your most-used tools and updates
            </span>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-white/20 bg-black/60 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Portal Access Status</p>
            <div className="flex items-center gap-2">
              {portalApproved ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Clock3 className="w-5 h-5 text-amber-300" />}
              <p className="font-semibold text-white">
                {portalApproved ? 'Approved' : portalApproved === false ? 'Pending approval' : 'Checking'}
              </p>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              {portalApproved ? 'You can access your resource portal now.' : 'Request or approval is required before viewing protected files.'}
            </p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
            <p className="text-xs uppercase tracking-wide text-primary/90 mb-2">Recommended Next Step</p>
            <p className="font-semibold text-white mb-2">{recommendation.title}</p>
            <p className="text-sm text-gray-200 mb-4">{recommendation.description}</p>
            <NextLink
              href={recommendation.href}
              className="inline-flex items-center rounded-md border border-primary/40 bg-primary/20 px-3 py-1.5 text-sm text-primary font-semibold"
            >
              {recommendation.cta}
              <ArrowRight className="w-4 h-4 ml-1" />
            </NextLink>
          </div>
          <div className="rounded-2xl border border-white/20 bg-black/60 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">My Activity</p>
            <div className="space-y-1.5 text-sm text-gray-300">
              <p>Last login: <span className="text-white">{formatDateTime(summary?.activity.lastLoginAt ?? null)}</span></p>
              <p>Last portal activity: <span className="text-white">{formatDateTime(summary?.activity.lastPortalActionAt ?? null)}</span></p>
              <p>Bundles redeemed: <span className="text-white">{summary?.portal.bundlesRedeemed ?? 0}</span></p>
              <p>Granted items: <span className="text-white">{summary?.portal.grantedItemsCount ?? 0}</span></p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/20 bg-black/60 p-5 mb-8">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-3">
            <NextLink
              href={portalApproved ? `/${locale}/resources/portal` : `/${locale}/resources/request`}
              className="inline-flex items-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              {portalApproved ? 'Open Portal' : 'Request Portal Access'}
            </NextLink>
            <NextLink
              href={`/${locale}/resources/request`}
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-100 hover:bg-white/10 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Request Access
            </NextLink>
            <NextLink
              href={`/${locale}/schedule`}
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-100 hover:bg-white/10 transition-colors"
            >
              <CalendarClock className="w-4 h-4 mr-2" />
              Schedule Consultation
            </NextLink>
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

        <section className="mt-8 rounded-2xl border border-white/20 bg-black/60 p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold text-white">Recently Added Resources</h2>
            <NextLink
              href={portalApproved ? `/${locale}/resources/portal` : `/${locale}/resources/request`}
              className="text-sm text-primary hover:text-primary/80 inline-flex items-center"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </NextLink>
          </div>
          {portalApproved ? (
            recentResources.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {recentResources.map((resource) => {
                  const isPinned = pinnedIds.includes(resource.id)
                  return (
                    <div key={resource.id} className="rounded-xl border border-white/15 bg-black/40 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white font-medium">{resource.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{resource.type}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => togglePin(resource.id)}
                          className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 p-1.5 text-gray-200 hover:bg-white/10"
                          aria-label={isPinned ? 'Unpin resource' : 'Pin resource'}
                        >
                          {isPinned ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No resources have been assigned yet.</p>
            )
          ) : (
            <p className="text-sm text-gray-400">Recent resources appear here after your access is approved.</p>
          )}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/20 bg-black/60 p-6">
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Pinned Resources</h3>
            </div>
            {pinnedResources.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-200">
                {pinnedResources.map((resource) => (
                  <li key={resource.id} className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 flex items-center justify-between">
                    <span>{resource.title}</span>
                    <button
                      type="button"
                      onClick={() => togglePin(resource.id)}
                      className="text-xs text-primary hover:text-primary/80"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Pin items from the recent resources section for quick access.</p>
            )}
          </div>

          <div className="rounded-2xl border border-white/20 bg-black/60 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Announcements</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="rounded-lg border border-white/15 bg-black/40 px-3 py-2">
                {summary?.portal.lastBundleRedeemedAt
                  ? `Latest bundle redeemed ${formatDateTime(summary.portal.lastBundleRedeemedAt)}.`
                  : 'Redeem a bundle or training code to unlock additional content.'}
              </li>
              <li className="rounded-lg border border-white/15 bg-black/40 px-3 py-2">
                {summary?.access?.status === 'approved'
                  ? 'Your access is approved. New resources will appear automatically based on your grants.'
                  : 'Your portal request is pending or not submitted. Request access to unlock protected files.'}
              </li>
              <li className="rounded-lg border border-white/15 bg-black/40 px-3 py-2">Need broader access for your team? Contact Roalla for organization-level setup.</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/20 bg-black/60 p-6">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Help & Support</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            Need help with approvals, access, or finding the right resource? We can help quickly.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:sales@roalla.com"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-100 hover:bg-white/10 transition-colors"
            >
              Email Support
            </a>
            <NextLink
              href={`/${locale}/faq`}
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-100 hover:bg-white/10 transition-colors"
            >
              View FAQ
            </NextLink>
            <NextLink
              href={`/${locale}/contact`}
              className="inline-flex items-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              Contact Roalla
            </NextLink>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/20 bg-black/60 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Recent Activity Timeline</h3>
          {summary?.recentActions && summary.recentActions.length > 0 ? (
            <ul className="space-y-2">
              {summary.recentActions.map((entry, idx) => (
                <li key={`${entry.at}-${idx}`} className="rounded-lg border border-white/15 bg-black/40 px-3 py-2">
                  {(() => {
                    const meta = getActionMeta(entry.action)
                    const ActionIcon = meta.icon
                    return (
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">
                            {humanizeAction(entry.action)}
                            {entry.itemTitle ? `: ${entry.itemTitle}` : ''}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(entry.at)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${meta.labelClass}`}>
                          <ActionIcon className="w-3.5 h-3.5" />
                          {humanizeAction(entry.action)}
                        </span>
                      </div>
                    )
                  })()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No recent activity yet. Your first portal actions will appear here.</p>
          )}
        </section>
      </main>
    </div>
  )
}
