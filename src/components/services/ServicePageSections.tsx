'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export type ServiceStat = { value: string; label: string }

type ServicePageHeroProps = {
  eyebrow: string
  title: string
  subtitle: string
  subtitleHighlight?: string
  primaryCta: React.ReactNode
  secondaryCta?: React.ReactNode
  stats: ServiceStat[]
}

export function ServicePageHero({
  eyebrow,
  title,
  subtitle,
  subtitleHighlight,
  primaryCta,
  secondaryCta,
  stats,
}: ServicePageHeroProps) {
  const subtitleParts = subtitleHighlight ? subtitle.split(subtitleHighlight) : [subtitle]
  const hasHighlight = subtitleHighlight && subtitleParts.length > 1

  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="border-b border-slate-200 pb-12 mb-12"
    >
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 mb-4">{eyebrow}</p>
        <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-bold text-slate-900 leading-tight tracking-tight">
          {title}
        </h1>
        <p className="mt-5 text-base md:text-lg text-slate-600 leading-relaxed">
          {hasHighlight ? (
            <>
              {subtitleParts[0]}
              <span className="text-slate-900 font-medium">{subtitleHighlight}</span>
              {subtitleParts[1]}
            </>
          ) : (
            subtitle
          )}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {primaryCta}
          {secondaryCta}
        </div>
      </div>
      <dl className="mt-10 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border border-slate-200 rounded-lg bg-slate-50/50">
        {stats.map((stat) => (
          <div key={stat.label} className="px-6 py-5 text-center">
            <dt className="text-2xl font-serif font-semibold text-slate-900 tabular-nums">{stat.value}</dt>
            <dd className="mt-1 text-xs uppercase tracking-wider text-slate-500">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </motion.header>
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
          ? 'bg-white border-l-2 border-l-primary'
          : 'bg-slate-50/80'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500 mb-2">{consultingLabel}</p>
      <p className="text-sm text-slate-700 leading-relaxed">{consultingDesc}</p>
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
          ? 'bg-white border-l-2 border-l-primary'
          : 'bg-slate-50/80'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500 mb-2">{buildingLabel}</p>
      <p className="text-sm text-slate-700 leading-relaxed">{buildingDesc}</p>
      {!buildingActive && buildingLinkText && (
        <span className="mt-4 inline-flex items-center text-sm font-medium text-slate-600 group-hover:text-primary">
          {buildingLinkText}
          <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
        </span>
      )}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto mb-10 rounded-lg border border-slate-200 overflow-hidden grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200"
    >
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
    </motion.div>
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
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500 mb-3 text-center">{label}</p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 hover:border-slate-300 hover:text-slate-900 transition-colors"
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
      {description && <p className="mt-2 text-slate-600 max-w-2xl text-sm md:text-base leading-relaxed">{description}</p>}
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
    <motion.aside
      id="cta"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mt-16 rounded-lg border border-slate-800 bg-slate-900 px-8 py-12 md:px-14 md:py-16 text-center"
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 mb-4">{badge}</p>
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">{title}</h2>
      <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
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
    </motion.aside>
  )
}

export const serviceCardClass =
  'relative bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-colors flex flex-col scroll-mt-28'

export const serviceSecondaryButtonClass =
  'inline-flex items-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-colors'

export const servicePrimaryLinkClass =
  'inline-flex w-full items-center justify-center rounded-md bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 text-sm transition-colors'
