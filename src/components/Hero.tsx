'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import ScheduleButton from './CalendlyButton'

const Hero = () => {
  return (
    <section id="home" className="relative bg-white pt-32 pb-20 lg:pt-48 lg:pb-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-gray-900 leading-tight">
            Empowering Your Business with Strategic Insight
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600">
            At Roalla, we provide expert business consulting services to drive growth, streamline operations, and enhance profitability.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <ScheduleButton variant="primary" size="lg" icon>
              Schedule a Free Consultation
            </ScheduleButton>
            <Link 
              href="/#services" 
              className="btn-secondary inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 py-4 px-8 text-lg"
            >
              Our Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 