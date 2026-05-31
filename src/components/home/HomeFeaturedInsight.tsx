'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Lightbulb, Target, BarChart3 } from 'lucide-react'
import Reveal from '../motion/Reveal'

const insightIcons = [Lightbulb, Target, BarChart3]
const insightLinks = ['/services', '/about', '/faq'] as const

export default function HomeFeaturedInsight() {
  const t = useTranslations('home.featuredInsight')
  const insights = [
    { title: t('article1Title'), description: t('article1Description'), href: insightLinks[0] },
    { title: t('article2Title'), description: t('article2Description'), href: insightLinks[1] },
    { title: t('article3Title'), description: t('article3Description'), href: insightLinks[2] },
  ]
  return (
    <section className="py-16 lg:py-24 bg-surface-elevated relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 mb-4">
            {t('badge')}
          </span>
          <h2 className="text-2xl font-serif font-bold text-white">{t('title')}</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((insight, i) => {
            const Icon = insightIcons[i]
            return (
              <Reveal key={insight.title} delayMs={i * 80}>
                <Link
                  href={insight.href}
                  className="group block rounded-xl border border-white/10 p-6 lg:p-8 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300 bg-black/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                        {insight.title}
                      </h3>
                      <p className="mt-2 text-gray-400 text-sm">{insight.description}</p>
                      <span className="mt-3 inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                        {t('readMore')}
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
