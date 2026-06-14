'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Collapse from '../motion/Collapse'

const faqKeys = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5'] as const

export default function ServiceMiniFAQ({ namespace }: { namespace: 'services' | 'digitalBuilds' | 'workshops' | 'digitalEvents' }) {
  const t = useTranslations(namespace)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-slate-300 border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm">
      {faqKeys.map((key, index) => {
        const isOpen = openIndex === index
        return (
          <div key={key}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className={`w-full px-6 py-4 text-left flex items-center justify-between gap-4 transition-colors ${
                isOpen ? 'bg-primary/[0.06]' : 'hover:bg-slate-50'
              }`}
              aria-expanded={isOpen}
            >
              <span className="font-bold text-slate-900 text-sm">{t(`${key}Q` as `${typeof key}Q`)}</span>
              <ChevronDown
                className={`w-5 h-5 text-primary-dark shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>
            <Collapse open={isOpen}>
              <p className="px-6 pb-4 text-sm text-slate-700 leading-relaxed border-l-4 border-primary ml-6">{t(`${key}A` as `${typeof key}A`)}</p>
            </Collapse>
          </div>
        )
      })}
    </div>
  )
}
