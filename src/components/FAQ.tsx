'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const FAQ = () => {
  const t = useTranslations('faq')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqKeys = [0, 1, 2, 3, 4, 5, 6, 7] as const
  const faqs = faqKeys.map((i) => ({
    question: t(`q${i}`),
    answer: t(`a${i}`),
  }))

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="section-padding bg-black py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-primary mr-3" />
            <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-white">
              {t('title')}
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-surface-card rounded-xl shadow-lg border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-lg font-semibold text-white pr-8">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-6 h-6 text-primary" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0">
                        <p className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-lg text-gray-300 mb-4">
              {t('stillHaveQuestions')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-200"
            >
              {t('contactUs')}
              <ChevronDown className="ml-2 w-5 h-5 rotate-[-90deg]" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
