'use client'

import React from 'react'
import { ArrowRight, ArrowDown, Briefcase, CheckCircle2, type LucideIcon } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import BrowserFrame from '../digital/BrowserFrame'
import { portfolioImageAlts, portfolioItems } from '@/lib/digitalPortfolio'

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
  tertiaryLink?: { href: '/assessment' | '/digital-creations' | '/services' | '/services/digital'; label: string }
  stats: ServiceStat[]
  statsNote?: string
  variant?: 'consulting' | 'digital'
  visual?: React.ReactNode
  className?: string
}

const heroGlassTile =
  'rounded-xl border border-white/10 bg-white/[0.07] backdrop-blur-sm px-4 py-3'

export function ConsultingHeroVisual({
  proofTitle,
  proofSubtitle,
  outcomes,
  caseLines,
}: {
  proofTitle: string
  proofSubtitle: string
  outcomes: string[]
  caseLines?: string[]
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-md p-5 sm:p-6 shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5 text-primary-light" aria-hidden />
        </div>
        <div>
          <h2 className="text-base font-serif font-bold text-white">{proofTitle}</h2>
          <p className="text-sm text-slate-300 mt-0.5">{proofSubtitle}</p>
        </div>
      </div>
      <ul className="space-y-3">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex items-start gap-2.5 text-sm text-slate-200 leading-snug">
            <CheckCircle2 className="w-4 h-4 text-primary-light shrink-0 mt-0.5" aria-hidden />
            {outcome}
          </li>
        ))}
      </ul>
      {caseLines && caseLines.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
          {caseLines.map((line) => (
            <p key={line} className="text-xs text-slate-400 leading-relaxed italic">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export function DigitalHeroVisual({
  proofLabel,
  websiteCaption,
  platformCaption,
}: {
  proofLabel: string
  websiteCaption: string
  platformCaption: string
}) {
  const website = portfolioItems.find((p) => p.id === 'ken-effect')!
  const platform = portfolioItems.find((p) => p.id === 'business-cocoon')!

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">{proofLabel}</p>
      <div className="space-y-3">
        <a
          href={website.tryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <BrowserFrame
            imageUrl={website.imageUrl}
            imageAlt={portfolioImageAlts['ken-effect']}
            domain={website.domain}
            priority
            className="group-hover:shadow-card-hover transition-shadow duration-300"
          />
          <p className="mt-2 text-sm text-slate-300 line-clamp-2">{websiteCaption}</p>
        </a>
        <a
          href={platform.tryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block group lg:translate-x-6"
        >
          <BrowserFrame
            imageUrl={platform.imageUrl}
            imageAlt={portfolioImageAlts['business-cocoon']}
            domain={platform.domain}
            className="group-hover:shadow-card-hover transition-shadow duration-300"
          />
          <p className="mt-2 text-sm text-slate-300 line-clamp-2 lg:pl-6">{platformCaption}</p>
        </a>
      </div>
    </div>
  )
}

export function PortfolioHeroVisual({ proofLabel }: { proofLabel: string }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">{proofLabel}</p>
      <div className="grid grid-cols-2 gap-2.5">
        {portfolioItems.map((item, i) => (
          <a
            key={item.id}
            href={item.tryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <BrowserFrame
              imageUrl={item.imageUrl}
              imageAlt={portfolioImageAlts[item.id]}
              domain={item.domain}
              brandPreview={item.brandPreview}
              priority={i < 2}
              className="group-hover:shadow-card-hover transition-shadow duration-300"
            />
          </a>
        ))}
      </div>
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

  return (
    <Reveal
      as="header"
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light mb-4">{eyebrow}</p>
          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-bold text-white leading-tight tracking-tight">
            {title}
          </h1>
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
          {journeyLine && (
            <p className="mt-3 text-sm font-medium text-primary-light/90 max-w-2xl leading-relaxed">{journeyLine}</p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {primaryCta}
            {secondaryCta}
          </div>
          {ctaSubtext && (
            <p className="mt-3 text-sm text-slate-400 max-w-xl leading-relaxed">{ctaSubtext}</p>
          )}
          {tertiaryLink && (
            <p className="mt-2">
              <Link
                href={tertiaryLink.href}
                className="text-sm text-primary-light/90 hover:text-white underline underline-offset-4 transition-colors"
              >
                {tertiaryLink.label}
              </Link>
            </p>
          )}

          <dl className={`mt-8 grid ${statsGridClass} gap-3`}>
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <Reveal key={stat.label} delayMs={i * 50} className={heroGlassTile}>
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
          {statsNote && (
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-2xl">{statsNote}</p>
          )}
        </div>

        {visual && (
          <Reveal delayMs={120} className="hidden lg:block">
            {visual}
          </Reveal>
        )}
      </div>

      {visual && (
        <Reveal delayMs={100} className="lg:hidden px-6 pb-10">
          {visual}
        </Reveal>
      )}
    </Reveal>
  )
}

type ServiceLaneCompareProps = {
  activeLane: 'consulting' | 'building'
  consultingLabel: string
  consultingDesc: string
  buildingLabel: string
  buildingDesc: string
  consultingHref?: '/services'
  buildingHref?: '/services/digital'
  consultingLinkText?: string
  buildingLinkText?: string
}

export function ServiceLaneCompare({
  activeLane,
  consultingLabel,
  consultingDesc,
  buildingLabel,
  buildingDesc,
  consultingHref = '/services',
  buildingHref = '/services/digital',
  consultingLinkText,
  buildingLinkText,
}: ServiceLaneCompareProps) {
  const consultingActive = activeLane === 'consulting'
  const buildingActive = activeLane === 'building'

  const consultingCell = (
    <div
      className={`p-6 lg:p-7 h-full ${
        consultingActive
          ? 'bg-white border-l-4 border-l-primary shadow-sm'
          : 'bg-slate-100/90'
      }`}
    >
      <p className={`text-xs font-semibold uppercase tracking-[0.15em] mb-2 ${consultingActive ? 'text-primary-dark' : 'text-slate-500'}`}>{consultingLabel}</p>
      <p className={`text-sm leading-relaxed ${consultingActive ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{consultingDesc}</p>
      {!consultingActive && consultingLinkText && (
        <span className="mt-4 inline-flex items-center text-sm font-medium text-slate-600 group-hover:text-primary">
          {consultingLinkText}
          <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
        </span>
      )}
    </div>
  )

  const buildingCell = (
    <div
      className={`p-6 lg:p-7 h-full ${
        buildingActive
          ? 'bg-white border-l-4 border-l-primary shadow-sm'
          : 'bg-slate-100/90'
      }`}
    >
      <p className={`text-xs font-semibold uppercase tracking-[0.15em] mb-2 ${buildingActive ? 'text-primary-dark' : 'text-slate-500'}`}>{buildingLabel}</p>
      <p className={`text-sm leading-relaxed ${buildingActive ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{buildingDesc}</p>
      {!buildingActive && buildingLinkText && (
        <span className="mt-4 inline-flex items-center text-sm font-medium text-slate-600 group-hover:text-primary">
          {buildingLinkText}
          <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
        </span>
      )}
    </div>
  )

  return (
    <Reveal className="max-w-4xl mx-auto mb-10 rounded-lg border border-slate-300 overflow-hidden grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-300 shadow-sm">
      {consultingActive ? (
        consultingCell
      ) : (
        <Link href={consultingHref} className="group block hover:bg-slate-50 transition-colors">
          {consultingCell}
        </Link>
      )}
      {buildingActive ? (
        buildingCell
      ) : (
        <Link href={buildingHref} className="group block hover:bg-slate-50 transition-colors">
          {buildingCell}
        </Link>
      )}
    </Reveal>
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

type ServicePageCTAProps = {
  badge: string
  title: string
  subtitle: string
  qualifier?: string
  primaryCta: React.ReactNode
  secondaryCta?: React.ReactNode
  ctaSubtext?: string
  confidentiality?: { href: '/contact'; label: string }
  links?: { href: '/services' | '/services/digital' | '/digital-creations' | '/assessment'; label: string }[]
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
  return (
    <Reveal
      as="aside"
      className="mt-16 rounded-xl border border-slate-700 bg-slate-900 px-8 py-12 md:px-14 md:py-16 text-center shadow-xl"
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
      {confidentiality && (
        <p className="mt-6 text-sm text-slate-400">
          <Link href={confidentiality.href} className="underline underline-offset-2 hover:text-white transition-colors">
            {confidentiality.label}
          </Link>
        </p>
      )}
      {links && links.length > 0 && (
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center underline underline-offset-2 hover:text-white transition-colors"
            >
              {link.label}
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Link>
          ))}
        </div>
      )}
    </Reveal>
  )
}

export const serviceCardClass =
  'relative bg-white rounded-xl border border-slate-300 shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all duration-300 flex flex-col scroll-mt-28'

export const serviceSecondaryButtonClass =
  'inline-flex items-center rounded-md border-2 border-slate-400 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-primary-dark hover:text-primary-dark transition-colors'

export const serviceHeroSecondaryButtonClass =
  'inline-flex items-center rounded-md border-2 border-white/25 bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/15 transition-colors'

export const servicePrimaryLinkClass =
  'inline-flex w-full items-center justify-center rounded-lg bg-primary-dark hover:bg-primary-darker text-white font-semibold py-2.5 px-4 text-sm transition-colors shadow-md hover:shadow-lg'
