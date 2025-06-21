'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import CalendlyButton from './CalendlyButton'

const Hero = () => {
  return (
    <section id="home" className="relative bg-white pt-32 pb-24 lg:pt-48 lg:pb-32">
      <div className="absolute inset-0 bg-grid-gray-200/50 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="block text-gray-900">Empowering Your Business</span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold gradient-text">
            Business Enablement Solutions
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-700">
            Transform your business with strategic consulting, process optimization, and growth solutions tailored to your unique needs.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <CalendlyButton variant="primary" size="lg" icon>
              Get Started Today
            </CalendlyButton>
            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary inline-flex items-center justify-center"
            >
              Explore Services
            </motion.a>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { text: "Strategic Planning", icon: CheckCircle },
              { text: "Process Optimization", icon: CheckCircle },
              { text: "Growth Solutions", icon: CheckCircle }
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="flex items-center justify-center space-x-2 text-gray-700"
              >
                <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero 