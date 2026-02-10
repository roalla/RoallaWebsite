'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Award, GraduationCap, Briefcase, Shield } from 'lucide-react'

const itemKeys = ['certified', 'education', 'experience', 'confidential'] as const
const itemIcons = [Award, GraduationCap, Briefcase, Shield]

export default function HomeTrustedBy() {
  const t = useTranslations('home.trustedBy')
  const items = itemKeys.map((key, i) => ({ icon: itemIcons[i], label: t(key) }))
  return (
    <section className="py-12 lg:py-16 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8"
        >
          {t('title')}
        </motion.p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-gray-800 font-medium">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
