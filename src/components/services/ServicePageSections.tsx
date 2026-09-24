'use client'

import React from 'react'
import {
  ArrowRight,
  ArrowDown,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Cpu,
  Globe,
  Images,
  Layers,
  MonitorSmartphone,
  Package,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'

export type ServiceStat = { value: string; label: string; icon?: LucideIcon }

type ServicePageHeroProps = {
  eyebrow: string
  title: string
  subtitle: string
  subtitleHighlight?: string
  journeyLine?: string
  primaryCta: React.ReactNode
  secondaryCta?: React.ReactNode
  ctaSubtext?: string
  tertiaryLink?: { href: '/assessment' | '/services/portfolio' | '/programs/business-enablement' | '/programs/technology-advisory' | '/services/digital'; label: string }
  stats: ServiceStat[]
  statsNote?: string
  variant?: 'consulting' | 'digital'
  visual?: React.ReactNode
  className?: string
}

const heroGlassTile =
  'rounded-xl border border-white/10 bg-white/[0.07] backdrop-blur-sm px-4 py-3 motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.12] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]'

export function ConsultingHeroVisual({
  proofTitle,
  proofSubtitle,
  outcomes,
  caseLines,
  icon: Icon = Briefcase,
}: {
  proofTitle: string
  proofSubtitle: string
  outcomes: string[]
  caseLines?: string[]
  icon?: LucideIcon
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-md p-5 sm:p-6 shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
      <Reveal when="mount" delayMs={160} className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary-light" aria-hidden />
        </div>
        <div>
          <h2 className="text-base font-serif font-bold text-white">{proofTitle}</h2>
          <p className="text-sm text-slate-300 mt-0.5">{proofSubtitle}</p>
        </div>
      </Reveal>
      <ul className="space-y-3">
        {outcomes.map((outcome, i) => (
          <Reveal
            as="li"
            when="mount"
            key={outcome}
            delayMs={240 + i * 75}
            className="flex items-start gap-2.5 rounded-lg border border-transparent px-2 py-1.5 -mx-2 text-sm text-slate-200 leading-snug motion-safe:transition-all motion-safe:duration-300 hover:border-white/10 hover:bg-white/[0.06]"
          >
            <CheckCircle2 className="w-4 h-4 text-primary-light shrink-0 mt-0.5" aria-hidden />
            {outcome}
          </Reveal>
        ))}
      </ul>
      {caseLines && caseLines.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
          {caseLines.map((line, i) => (
            <Reveal
              when="mount"
              key={line}
              delayMs={480 + i * 60}
              as="p"
              className="text-xs text-slate-400 leading-relaxed italic"
            >
              {line}
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

export function ServicePageHero({
  eyebrow,
  title,
  subtitle,
  subtitleHighlight,
  journeyLine,
  primaryCta,
  secondaryCta,
  ctaSubtext,
  tertiaryLink,
  stats,
  statsNote,
  variant = 'consulting',
  visual,
  className = '',
}: ServicePageHeroProps) {
  const subtitleParts = subtitleHighlight ? subtitle.split(subtitleHighlight) : [subtitle]
  const hasHighlight = subtitleHighlight && subtitleParts.length > 1
  const statsGridClass = stats.length >= 4 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'
  const bgClass =
    variant === 'digital'
      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
      : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'

  const statsBaseDelay = 300

  return (
    <header
      className={`relative overflow-hidden rounded-2xl border border-slate-700/80 ${bgClass} mb-8 shadow-xl ${className}`}
    >
      <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06),transparent_55%)]"
        aria-hidden
      />

      <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center px-6 py-10 lg:px-12 lg:py-14">
        <div>
          <Reveal when="mount" delayMs={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light mb-4">{eyebrow}</p>
          </Reveal>
          <Reveal when="mount" delayMs={50}>
            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-bold text-white leading-tight tracking-tight">
              {title}
            </h1>
          </Reveal>
          <Reveal when="mount" delayMs={100}>
            <p className="mt-5 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
              {hasHighlight ? (
                <>
                  {subtitleParts[0]}
                  <span className="text-white font-semibold">{subtitleHighlight}</span>
                  {subtitleParts[1]}
                </>
              ) : (
                subtitle
              )}
            </p>
          </Reveal>
          {journeyLine && (
            <Reveal when="mount" delayMs={140}>
              <p className="mt-3 text-sm font-medium text-primary-light/90 max-w-2xl leading-relaxed">{journeyLine}</p>
            </Reveal>
          )}
          <Reveal when="mount" delayMs={200} className="mt-8 flex flex-wrap items-center gap-3">
            {primaryCta}
            {secondaryCta}
          </Reveal>
          {ctaSubtext && (
            <Reveal when="mount" delayMs={240}>
              <p className="mt-3 text-sm text-slate-400 max-w-xl leading-relaxed">{ctaSubtext}</p>
            </Reveal>
          )}
          {tertiaryLink && (
            <Reveal when="mount" delayMs={260}>
              <p className="mt-2">
                <Link
                  href={tertiaryLink.href}
                  className="text-sm text-primary-light/90 hover:text-white underline underline-offset-4 transition-colors"
                >
                  {tertiaryLink.label}
                </Link>
              </p>
            </Reveal>
          )}

          {stats.length > 0 && (
            <dl className={`mt-8 grid ${statsGridClass} gap-3`}>
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <Reveal key={stat.label} when="mount" delayMs={statsBaseDelay + i * 75} className={heroGlassTile}>
                    <div className="flex items-center gap-2.5">
                      {Icon && <Icon className="w-4 h-4 text-primary-light shrink-0" aria-hidden />}
                      <div>
                        <dt className="text-xl md:text-2xl font-serif font-bold text-white tabular-nums leading-none">
                          {stat.value}
                        </dt>
                        <dd className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                          {stat.label}
                        </dd>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </dl>
          )}
          {statsNote && (
            <Reveal when="mount" delayMs={statsBaseDelay + stats.length * 75 + 40}>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-2xl">{statsNote}</p>
            </Reveal>
          )}
        </div>

        {visual && <div>{visual}</div>}
      </div>
    </header>
  )
}

type ServiceAnchorNavProps = {
  label?: string
  items?: { id: string; label: string }[]
}

type ServiceAnchorNavGroup = {
  groupLabel?: string
  items: { id: string; label: string }[]
}

type ServiceAnchorNavPropsExtended = ServiceAnchorNavProps & {
  groups?: ServiceAnchorNavGroup[]
}

const anchorJumpLinkClass =
  'inline-flex items-center gap-1.5 rounded-lg border-2 border-primary/35 bg-white px-4 py-2.5 text-sm font-semibold text-primary-dark shadow-sm hover:bg-primary hover:border-primary hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

const anchorNavLabelClass =
  'text-xs font-semibold uppercase tracking-wider text-primary-dark mb-3'

export function ServiceAnchorNav({ label, items, groups }: ServiceAnchorNavPropsExtended) {
  const hasGroups = groups && groups.length > 0

  return (
    <nav
      aria-label={label ?? groups?.[0]?.groupLabel}
      className="mb-12 max-w-4xl mx-auto rounded-xl border border-primary/15 bg-primary/[0.04] p-5 sm:p-6"
    >
      {hasGroups ? (
        groups.map((group, groupIndex) => (
          <div
            key={group.groupLabel ?? group.items[0]?.id}
            className={groupIndex > 0 ? 'mt-6 pt-6 border-t border-primary/10' : undefined}
          >
            {group.groupLabel && (
              <p className={`${anchorNavLabelClass} text-center sm:text-left`}>{group.groupLabel}</p>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              {group.items.map((item) => (
                <a key={item.id} href={`#${item.id}`} className={anchorJumpLinkClass}>
                  {item.label}
                  <ArrowDown className="w-4 h-4 shrink-0 opacity-80" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        ))
      ) : (
        <>
          {label && <p className={`${anchorNavLabelClass} text-center sm:text-left`}>{label}</p>}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            {(items ?? []).map((item) => (
              <a key={item.id} href={`#${item.id}`} className={anchorJumpLinkClass}>
                {item.label}
                <ArrowDown className="w-4 h-4 shrink-0 opacity-80" aria-hidden />
              </a>
            ))}
          </div>
        </>
      )}
    </nav>
  )
}

export function PillarBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/[0.08] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
      {label}
    </span>
  )
}

export const pillarSectionClass = 'scroll-mt-28 mb-16 pt-4 border-t border-slate-200 first:border-t-0 first:pt-0'

export function PillarSectionHeader({
  pillarTitle,
  intro,
  startHere,
  phaseRange,
}: {
  pillarTitle: string
  intro: string
  startHere?: string
  phaseRange?: string
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 tracking-tight">{pillarTitle}</h2>
        {phaseRange && (
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{phaseRange}</span>
        )}
      </div>
      <p className="text-slate-700 leading-relaxed text-sm md:text-base">{intro}</p>
      {startHere && <p className="mt-2 text-sm font-medium text-primary-dark">{startHere}</p>}
    </div>
  )
}

export function ServiceSectionHeading({
  eyebrow,
  title,
  description,
  className = '',
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={`mb-8 ${className}`}>
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500 mb-2">{eyebrow}</p>
      )}
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 tracking-tight">{title}</h2>
      {description && <p className="mt-2 text-slate-700 max-w-2xl text-sm md:text-base leading-relaxed">{description}</p>}
    </div>
  )
}

type ServiceCtaHref =
  | '/programs/business-enablement'
  | '/programs/technology-advisory'
  | '/programs/workshops'
  | '/services/digital'
  | '/services/digital-events'
  | '/services/portfolio'
  | '/assessment'
  | '/website-design'
  | '/website-package'
  | '/contact'

type ServiceCtaLink = {
  href: ServiceCtaHref
  label: string
  title?: string
  hint?: string
}

const pathIcons: Partial<Record<ServiceCtaHref, LucideIcon>> = {
  '/programs/business-enablement': Compass,
  '/programs/technology-advisory': Cpu,
  '/programs/workshops': Users,
  '/services/digital': MonitorSmartphone,
  '/services/digital-events': CalendarDays,
  '/services/portfolio': Images,
  '/assessment': ClipboardCheck,
  '/website-design': Globe,
  '/website-package': Package,
  '/contact': Shield,
}

const pathCardClass =
  'group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white/[0.09] hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)]'

function PathCard({ href, label, title, hint, className = '' }: ServiceCtaLink & { className?: string }) {
  const Icon = pathIcons[href] ?? ArrowRight
  const heading = title ?? label

  return (
    <Link href={href} className={`${pathCardClass} ${className}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/15 text-primary-light transition-colors group-hover:border-primary/50 group-hover:bg-primary/25">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">{heading}</span>
        {hint && <span className="mt-0.5 block text-xs leading-snug text-slate-400">{hint}</span>}
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary-light" aria-hidden />
    </Link>
  )
}

type ServicePageCTAProps = {
  badge: string
  title: string
  subtitle: string
  qualifier?: string
  primaryCta: React.ReactNode
  secondaryCta?: React.ReactNode
  ctaSubtext?: string
  confidentiality?: ServiceCtaLink
  links?: ServiceCtaLink[]
}

export function ServicePageCTA({
  badge,
  title,
  subtitle,
  qualifier,
  primaryCta,
  secondaryCta,
  ctaSubtext,
  confidentiality,
  links,
}: ServicePageCTAProps) {
  const tCommon = useTranslations('common')
  const hasPaths = (links && links.length > 0) || confidentiality

  return (
    <Reveal
      as="aside"
      className="mt-16 rounded-xl border border-slate-700 bg-slate-900 px-6 py-12 sm:px-8 md:px-14 md:py-16 text-center shadow-xl"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light mb-4">{badge}</p>
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">{title}</h2>
      <p className="mt-4 text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      {qualifier && (
        <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">{qualifier}</p>
      )}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        {primaryCta}
        {secondaryCta}
      </div>
      {ctaSubtext && (
        <p className="mt-4 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">{ctaSubtext}</p>
      )}
      {hasPaths && (
        <div className="mt-10 border-t border-white/10 pt-8 text-left">
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {tCommon('continueExploring')}
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {links?.map((link) => (
              <PathCard key={link.href} {...link} />
            ))}
            {confidentiality && (
              <PathCard
                {...confidentiality}
                className={(links?.length ?? 0) % 2 === 0 ? 'sm:col-span-2' : ''}
              />
            )}
          </div>
        </div>
      )}
    </Reveal>
  )
}

export const serviceCardClass =
  'group relative h-full bg-white rounded-xl border border-slate-300 shadow-card hover:shadow-card-hover hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col'

export const serviceCardIconMotionClass =
  'transition-transform duration-300 group-hover:scale-105'

export const serviceMiniTileClass =
  'group rounded-lg border border-slate-300 bg-white p-5 shadow-sm hover:shadow-card-hover hover:border-primary/40 hover:-translate-y-1 transition-all duration-300'

export const serviceSecondaryButtonClass =
  'inline-flex items-center rounded-md border-2 border-slate-400 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-primary-dark hover:text-primary-dark transition-colors'

export const serviceHeroSecondaryButtonClass =
  'inline-flex items-center rounded-md border-2 border-white/25 bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/15 transition-colors'

export const servicePrimaryLinkClass =
  'inline-flex w-full items-center justify-center rounded-lg bg-primary-dark hover:bg-primary-darker text-white font-semibold py-2.5 px-4 text-sm transition-colors shadow-md hover:shadow-lg'
