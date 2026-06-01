'use client'

import React from 'react'
import Reveal from '../motion/Reveal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Briefcase,
  Globe,
  GraduationCap,
  ArrowRight,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Layout,
  Layers,
  Sparkles,
  Palette,
  LineChart,
  Timer,
  Lightbulb,
} from 'lucide-react'
import { HomeBrandJourneyTeaser } from '../services/BrandJourneyTeaser'

const consultingKeys = ['strategicPlanning', 'processOptimization', 'teamDevelopment', 'dataAnalytics'] as const
const consultingIcons = [Target, TrendingUp, Users, BarChart3]

const digitalKeys = ['websitesLabel', 'platformsLabel', 'brandingLabel'] as const
const digitalIcons = [Layout, Layers, Sparkles]

const workshopKeys = ['brandingWorkshop', 'salesWorkshop', 'productivityWorkshop', 'ideationWorkshop'] as const
const workshopIcons = [Palette, LineChart, Timer, Lightbulb]

export default function HomeWhatWeDo() {
  const t = useTranslations('home.whatWeDo')
  const consultingItems = consultingKeys.map((key, i) => ({ icon: consultingIcons[i], label: t(key) }))
  const digitalItems = digitalKeys.map((key, i) => ({ icon: digitalIcons[i], label: t(key) }))
  const workshopItems = workshopKeys.map((key, i) => ({ icon: workshopIcons[i], label: t(key) }))

  return (
    <section id="services" className="py-16 lg:py-24 bg-slate-50 relative scroll-mt-24">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>
        <HomeBrandJourneyTeaser />

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Business Enablement */}
          <Reveal className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-card hover:shadow-card-hover hover:border-primary/25 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">{t('businessEnablementTitle')}</h3>
                <p className="mt-1 text-slate-600 text-sm leading-relaxed">{t('businessEnablementDesc')}</p>
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('consultingIncludes')}</p>
            <ul className="grid grid-cols-2 gap-3 mb-4 flex-1">
              {consultingItems.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm text-slate-700">
                  <item.icon className="w-4 h-4 text-primary shrink-0" aria-hidden />
                  {item.label}
                </li>
              ))}
            </ul>
            <ul className="space-y-2 mb-8 border-t border-slate-100 pt-4">
              {(['consultingOutcome1', 'consultingOutcome2', 'consultingOutcome3'] as const).map((key) => (
                <li key={key} className="text-xs text-slate-600 leading-relaxed pl-3 border-l-2 border-primary/30">
                  {t(key)}
                </li>
              ))}
            </ul>
            <Link
              href="/services"
              className="inline-flex items-center text-primary font-semibold hover:underline hover:-translate-y-px transition-all duration-200 mt-auto"
            >
              {t('exploreBusinessEnablement')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Reveal>

          {/* Workshops */}
          <Reveal delayMs={60} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-card hover:shadow-card-hover hover:border-primary/25 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">{t('workshopsTitle')}</h3>
                <p className="mt-1 text-slate-600 text-sm leading-relaxed">{t('workshopsDesc')}</p>
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('workshopsIncludes')}</p>
            <ul className="grid grid-cols-2 gap-3 mb-8 flex-1">
              {workshopItems.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm text-slate-700">
                  <item.icon className="w-4 h-4 text-primary shrink-0" aria-hidden />
                  {item.label}
                </li>
              ))}
            </ul>
            <Link
              href="/services/workshops"
              className="inline-flex items-center text-primary font-semibold hover:underline hover:-translate-y-px transition-all duration-200 mt-auto"
            >
              {t('exploreWorkshops')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Reveal>

          {/* Digital Creations */}
          <Reveal delayMs={80} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-card hover:shadow-card-hover hover:border-primary/25 transition-all duration-300 lg:col-span-2 xl:col-span-1">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">{t('websitesAndDigitalTitle')}</h3>
                <p className="mt-1 text-slate-600 text-sm leading-relaxed">{t('websitesAndDigitalDesc')}</p>
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('digitalIncludes')}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {digitalItems.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm text-slate-700">
                  <item.icon className="w-4 h-4 text-primary shrink-0" aria-hidden />
                  {item.label}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-auto">
              <Link
                href="/services/digital"
                className="inline-flex items-center text-primary font-semibold hover:underline hover:-translate-y-px transition-all duration-200"
              >
                {t('exploreWebsitesAndDigital')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/digital-creations"
                className="inline-flex items-center text-slate-600 font-medium text-sm hover:text-primary hover:underline transition-colors"
              >
                {t('viewOurWork')}
                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
