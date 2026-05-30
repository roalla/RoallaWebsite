'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

const faqKeys = ['faq1', 'faq2', 'faq3'] as const

export default function ServiceMiniFAQ({ namespace }: { namespace: 'services' | 'digitalBuilds' }) {
  const t = useTranslations(namespace)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden">
      {faqKeys.map((key, index) => {
        const isOpen = openIndex === index
        return (
          <div key={key}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-slate-900 text-sm">{t(`${key}Q` as `${typeof key}Q`)}</span>
              <ChevronDown
                className={`w-5 h-5 text-primary-dark shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-4 text-sm text-slate-600 leading-relaxed">{t(`${key}A` as `${typeof key}A`)}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
