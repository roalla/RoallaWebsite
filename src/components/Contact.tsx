'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Mail, Phone, MapPin } from 'lucide-react'
import ScheduleButton from './CalendlyButton'

const Contact = () => {
  const t = useTranslations('contact')
  return (
    <section id="contact" className="section-padding bg-black py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-white mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-surface-card rounded-xl p-8 shadow-lg border border-white/10 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mx-auto mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t('email')}</h4>
              <p className="text-gray-400 mb-3 text-sm">{t('generalInquiries')}</p>
              <a href="mailto:sales@roalla.com" className="text-primary hover:text-primary-dark font-semibold text-lg transition-colors">
                sales@roalla.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-surface-card rounded-xl p-8 shadow-lg border border-white/10 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t('phone')}</h4>
              <p className="text-gray-400 mb-3 text-sm">{t('hours')}</p>
              <a href="tel:+12898385868" className="text-primary hover:text-primary-dark font-semibold text-lg transition-colors">
                (289) 838-5868
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-surface-card rounded-xl p-8 shadow-lg border border-white/10 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t('location')}</h4>
              <p className="text-gray-400 mb-1">{t('burlington')}</p>
              <p className="text-gray-400 text-sm">{t('servingGlobally')}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <ScheduleButton variant="primary" size="lg" icon>
              {t('cta')}
            </ScheduleButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact 