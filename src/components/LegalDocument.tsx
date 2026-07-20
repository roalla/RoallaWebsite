'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type LegalDocKey = 'terms' | 'privacy' | 'aiPolicy'

type LegalDocumentProps = {
  doc: LegalDocKey
  sectionCount: number
}

export default function LegalDocument({ doc, sectionCount }: LegalDocumentProps) {
  const t = useTranslations(`legal.${doc}`)
  const tLegal = useTranslations('legal')

  const sections = Array.from({ length: sectionCount }, (_, i) => {
    const n = i + 1
    return {
      title: t(`s${n}Title`),
      body: t(`s${n}Body`),
    }
  })

  return (
    <article className="max-w-3xl mx-auto pb-16 lg:pb-24">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-3">
          {tLegal('eyebrow')}
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3">{t('title')}</h1>
        <p className="text-sm text-slate-500">{t('lastUpdated')}</p>
        <div className="mt-4 space-y-3 text-slate-600 leading-relaxed">
          {t('intro')
            .split('\n\n')
            .map((para, idx) => (
              <p key={`intro-${idx}`}>{para}</p>
            ))}
        </div>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">{section.title}</h2>
            <div className="space-y-3 text-slate-600 leading-relaxed text-[15px]">
              {section.body.split('\n\n').map((para, idx) => (
                <p key={`${section.title}-${idx}`}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <aside className="mt-12 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="mb-2">{tLegal('relatedLabel')}</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label={tLegal('relatedLabel')}>
          {doc !== 'terms' ? (
            <Link href="/terms" className="link-action font-medium">
              {tLegal('termsLink')}
            </Link>
          ) : null}
          {doc !== 'privacy' ? (
            <Link href="/privacy" className="link-action font-medium">
              {tLegal('privacyLink')}
            </Link>
          ) : null}
          {doc !== 'aiPolicy' ? (
            <Link href="/ai-policy" className="link-action font-medium">
              {tLegal('aiPolicyLink')}
            </Link>
          ) : null}
          <Link href="/contact" className="link-action font-medium">
            {tLegal('contactLink')}
          </Link>
        </nav>
      </aside>
    </article>
  )
}
