'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Target, Rocket, CheckCircle, ArrowRight } from 'lucide-react'

const HowWeWork = () => {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Discovery & Assessment',
      description: 'We begin with a comprehensive assessment of your business, understanding your goals, challenges, and opportunities.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '02',
      icon: Target,
      title: 'Strategic Planning',
      description: 'Together, we develop a customized strategy aligned with your vision and market dynamics.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      number: '03',
      icon: Rocket,
      title: 'Implementation & Support',
      description: 'We work alongside your team to implement solutions, providing ongoing support and optimization.',
      color: 'from-green-500 to-green-600'
    },
    {
      number: '04',
      icon: CheckCircle,
      title: 'Continuous Improvement',
      description: 'Regular reviews and adjustments ensure your business stays on track and adapts to changing conditions.',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <section id="how-we-work" className="section-padding bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-6">
            How We Work
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            A proven methodology that delivers results through collaboration, expertise, and commitment.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connection Line (hidden on mobile, shown on desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary to-primary-dark z-0" style={{ width: 'calc(100% - 4rem)', transform: 'translateX(2rem)' }}>
                    <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
                  </div>
                )}

                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-200 mb-2">{step.number}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-700 mb-6">
            Ready to get started? Let's discuss how we can help transform your business.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default HowWeWork
