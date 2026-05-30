'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { CheckCircle, Award, Clock, Heart, Users } from 'lucide-react'

const valueIcons = [CheckCircle, Heart, Clock, Award] as const

const About = () => {
  const t = useTranslations('about')
  const values = [
    { title: t('excellence'), description: t('excellenceDesc'), icon: valueIcons[0] },
    { title: t('integrity'), description: t('integrityDesc'), icon: valueIcons[1] },
    { title: t('commitment'), description: t('commitmentDesc'), icon: valueIcons[2] },
    { title: t('innovation'), description: t('innovationDesc'), icon: valueIcons[3] },
  ]

  return (
    <section id="about" className="section-padding bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-slate-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="lg:pr-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-6">{t('ourStory')}</h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              {t('story1')}
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t('story2')}
            </p>
          </div>
          <div>
            <div className="w-full h-80 bg-slate-50 border border-slate-200 rounded-xl shadow-card flex items-center justify-center">
              <div className="text-center">
                <Users className="w-24 h-24 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">{t('ourTeam')}</h3>
                <p className="text-slate-600 mt-2">{t('teamSubtitle')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-card border border-slate-200 hover:shadow-card-hover hover:border-primary/25 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2 text-lg">{value.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary via-primary-dark to-primary rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('missionTitle')}
          </h3>
          <p className="text-xl text-white/95 max-w-4xl mx-auto leading-relaxed">
            &quot;{t('missionQuote')}&quot;
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
