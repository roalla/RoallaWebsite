'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Award, Shield, GraduationCap, Briefcase, CheckCircle2, Star } from 'lucide-react'

const credentialIcons = [Award, GraduationCap, Briefcase, Shield] as const
const credentialColors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-green-500 to-green-600', 'from-orange-500 to-orange-600'] as const

interface TrustIndicatorsProps {
  variant?: 'default' | 'elevated'
}

const TrustIndicators = ({ variant = 'default' }: TrustIndicatorsProps) => {
  const t = useTranslations('trustIndicators')
  const credentials = [
    { title: t('certified'), description: t('certifiedDesc'), icon: credentialIcons[0], color: credentialColors[0] },
    { title: t('education'), description: t('educationDesc'), icon: credentialIcons[1], color: credentialColors[1] },
    { title: t('experience'), description: t('experienceDesc'), icon: credentialIcons[2], color: credentialColors[2] },
    { title: t('confidential'), description: t('confidentialDesc'), icon: credentialIcons[3], color: credentialColors[3] },
  ]
  const expertise = [t('exp1'), t('exp2'), t('exp3'), t('exp4'), t('exp5'), t('exp6'), t('exp7'), t('exp8')]

  return (
    <section id="trust" className={`section-padding py-20 lg:py-28 relative ${variant === 'elevated' ? 'bg-surface-elevated' : 'bg-black'}`}>
      {variant === 'elevated' && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-white mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {credentials.map((credential, index) => (
            <motion.div
              key={credential.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-surface-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${credential.color} rounded-lg flex items-center justify-center mb-4`}>
                <credential.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{credential.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{credential.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-surface-card rounded-2xl p-8 md:p-12 shadow-xl border border-white/10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Star className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-3xl font-bold text-white">{t('areasTitle')}</h3>
              </div>
              <p className="text-lg text-gray-300 mb-6">
                {t('areasDesc')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {expertise.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-gray-300 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustIndicators
