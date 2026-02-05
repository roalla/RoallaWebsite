'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, Shield, GraduationCap, Briefcase, CheckCircle2, Star } from 'lucide-react'

const TrustIndicators = () => {
  const credentials = [
    {
      icon: Award,
      title: 'Certified Professionals',
      description: 'Our team holds industry-recognized certifications and credentials in business consulting and financial management.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: GraduationCap,
      title: 'Advanced Education',
      description: 'Team members with advanced degrees in business, finance, and strategic management from leading institutions.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Briefcase,
      title: '30+ Years Experience',
      description: 'Decades of combined experience helping businesses achieve their strategic and financial goals.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Shield,
      title: 'Confidential & Secure',
      description: 'We maintain the highest standards of confidentiality and data security for all client information.',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const expertise = [
    'Fractional COO Services',
    'Strategic Business Planning',
    'Financial Analysis & Reporting',
    'Process Optimization',
    'Risk Management',
    'Growth Strategy Development',
    'Operational Excellence',
    'Technology Integration'
  ]

  return (
    <section id="trust" className="section-padding bg-gradient-to-br from-gray-50 to-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-6">
            Why Choose Roalla
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Trusted expertise, proven methodologies, and unwavering commitment to your success.
          </p>
        </motion.div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {credentials.map((credential, index) => (
            <motion.div
              key={credential.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${credential.color} rounded-lg flex items-center justify-center mb-4`}>
                <credential.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{credential.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{credential.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Expertise Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Star className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-3xl font-bold text-gray-900">Areas of Expertise</h3>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                Our comprehensive expertise spans multiple domains of business consulting and financial management.
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
                  <span className="text-gray-700 font-medium">{item}</span>
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
