'use client'

import React from 'react'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'

export type ServiceStat = { value: string; label: string; icon?: LucideIcon }

type ServicePageHeroProps = {
  eyebrow: string
  title: string
  subtitle: string
  subtitleHighlight?: string
  primaryCta: React.ReactNode
  secondaryCta?: React.ReactNode
  stats: ServiceStat[]
  variant?: 'consulting' | 'digital'
}

export function ServicePageHero({
  eyebrow,
  title,
  subtitle,
  subtitleHighlight,
  primaryCta,
  secondaryCta,
  stats,
  variant = 'consulting',
}: ServicePageHeroProps) {
  const subtitleParts = subtitleHighlight ? subtitle.split(subtitleHighlight) : [subtitle]
  const hasHighlight = subtitleHighlight && subtitleParts.length > 1
  const accentGradient =
    variant === 'digital'
      ? 'bg-gradient-to-br from-slate-50 via-white to-primary/10'
      : 'bg-gradient-to-br from-slate-50 via-white to-primary/[0.06]'

  return (
    <Reveal
      as="header"
      className={`relative overflow-hidden rounded-2xl border border-slate-300 ${accentGradient} px-6 py-10 lg:px-12 lg:py-14 mb-8 shadow-md`}
    >
      <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-primary/[0.08] blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-primary/[0.04] blur-3xl" aria-hidden />

      <div className="relative max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark mb-4">{eyebrow}</p>
        <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-bold text-slate-900 leading-tight tracking-tight">
          {title}
        </h1>
        <p className="mt-5 text-lg md:text-xl text-slate-700 leading-relaxed max-w-3xl">
          {hasHighlight ? (
            <>
              {subtitleParts[0]}
              <span className="text-slate-900 font-semibold">{subtitleHighlight}</span>
              {subtitleParts[1]}
            </>
          ) : (
            subtitle
          )}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {primaryCta}
          {secondaryCta}
        </div>
      </div>

      <dl className="relative mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Reveal
              key={stat.label}
              delayMs={i * 50}
              className="rounded-xl border border-slate-300 bg-white px-5 py-4 text-center shadow-sm"
            >
              {Icon && <Icon className="w-5 h-5 text-primary-dark mx-auto mb-2" aria-hidden />}
              <dt className="text-2xl md:text-3xl font-serif font-bold text-slate-900 tabular-nums">{stat.value}</dt>
              <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-600">{stat.label}</dd>
            </Reveal>
          )
        })}
      </dl>
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
  items: { id: string; label: string }[]
}

export function ServiceAnchorNav({ label, items }: ServiceAnchorNavProps) {
  return (
    <nav aria-label={label} className="mb-12 max-w-4xl mx-auto">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 mb-3 text-center">{label}</p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 hover:border-primary hover:bg-primary/5 hover:text-primary-dark transition-colors shadow-sm"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
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

export const servicePrimaryLinkClass =
  'inline-flex w-full items-center justify-center rounded-lg bg-primary-dark hover:bg-primary-darker text-white font-semibold py-2.5 px-4 text-sm transition-colors shadow-md hover:shadow-lg'
