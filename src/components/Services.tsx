'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Lightbulb,
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import ScheduleButton from './CalendlyButton'

const serviceIcons = [Target, TrendingUp, Users, BarChart3, Lightbulb, Zap] as const

const Services = () => {
  const t = useTranslations('services')
  const services = [
    { title: t('s0Title'), desc: t('s0Desc'), features: [t('s0F1'), t('s0F2'), t('s0F3')], icon: serviceIcons[0] },
    { title: t('s1Title'), desc: t('s1Desc'), features: [t('s1F1'), t('s1F2'), t('s1F3')], icon: serviceIcons[1] },
    { title: t('s2Title'), desc: t('s2Desc'), features: [t('s2F1'), t('s2F2'), t('s2F3')], icon: serviceIcons[2] },
    { title: t('s3Title'), desc: t('s3Desc'), features: [t('s3F1'), t('s3F2'), t('s3F3')], icon: serviceIcons[3] },
    { title: t('s4Title'), desc: t('s4Desc'), features: [t('s4F1'), t('s4F2'), t('s4F3')], icon: serviceIcons[4] },
    { title: t('s5Title'), desc: t('s5Desc'), features: [t('s5F1'), t('s5F2'), t('s5F3')], icon: serviceIcons[5] },
  ]

  return (
    <section id="services" className="section-padding bg-white py-20 lg:py-28">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-6">{t('title')}</h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-700 leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
              </div>

              <p className="text-gray-700 text-base leading-relaxed mb-6 min-h-[3rem]">{service.desc}</p>

              <ul className="space-y-3 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="inline-flex items-center mt-6 text-primary font-semibold hover:text-primary-dark transition-colors duration-200 group-hover:underline"
              >
                {t('learnMore')}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary via-primary-dark to-primary rounded-2xl p-10 md:p-16 mt-20 text-center shadow-2xl"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('ctaTitle')}
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <ScheduleButton variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-50">
            {t('ctaButton')}
          </ScheduleButton>
        </motion.div>
      </div>
    </section>
  )
}

export default Services 