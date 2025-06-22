'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import CalendlyButton from './CalendlyButton'

const Hero = () => {
  return (
    <section className="bg-white text-gray-900">
      <div className="container-custom section-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold leading-tight text-gray-900 mb-6">
            <span className="gradient-text">Empowering</span> Your Business For a Digital-First World
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-8">
            We provide expert consulting in strategy, technology, and operations to help your business thrive in today's competitive landscape.
          </p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CalendlyButton 
              variant="primary" 
              size="lg" 
            >
              Get Started
            </CalendlyButton>
            <motion.a 
              href="#about" 
              className="btn-secondary"
              whileHover={{ y: -2 }}
            >
              Learn More <ArrowRight className="w-5 h-5 ml-2" />
            </motion.a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Strategic Planning</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Business Optimization</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Leadership Development</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero 