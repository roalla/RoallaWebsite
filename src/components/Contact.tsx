'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Mail, Phone, MapPin } from 'lucide-react'
import ScheduleButton from './ScheduleButton'
import Reveal from './motion/Reveal'

const Contact = () => {
  const t = useTranslations('contact')
  return (
    <section id="contact" className="section-padding bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-slate-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </Reveal>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Reveal delayMs={100} className="bg-white rounded-xl p-8 shadow-card border border-slate-200 text-center hover:shadow-card-hover hover:border-primary/25 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{t('email')}</h4>
              <p className="text-slate-500 mb-3 text-sm">{t('generalInquiries')}</p>
              <a href="mailto:sales@roalla.com" className="text-primary hover:text-primary-dark font-semibold text-lg transition-colors">
                sales@roalla.com
              </a>
            </Reveal>

            <Reveal delayMs={200} className="bg-white rounded-xl p-8 shadow-card border border-slate-200 text-center hover:shadow-card-hover hover:border-primary/25 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{t('phone')}</h4>
              <p className="text-slate-500 mb-3 text-sm">{t('hours')}</p>
              <a href="tel:+12898385868" className="text-primary hover:text-primary-dark font-semibold text-lg transition-colors">
                (289) 838-5868
              </a>
            </Reveal>

            <Reveal delayMs={300} className="bg-white rounded-xl p-8 shadow-card border border-slate-200 text-center hover:shadow-card-hover hover:border-primary/25 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{t('location')}</h4>
              <p className="text-slate-500 mb-1">{t('burlington')}</p>
              <p className="text-slate-500 text-sm">{t('servingGlobally')}</p>
            </Reveal>
          </div>

          <Reveal delayMs={400} className="text-center">
            <ScheduleButton variant="primary" size="lg" icon>
              {t('cta')}
            </ScheduleButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Contact
