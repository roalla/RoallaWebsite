'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import ScheduleButton from '../CalendlyButton'

export default function HomeHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-white via-primary/5 to-primary/10 overflow-hidden">
      {/* Subtle grid / shape background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-gray-900 leading-tight"
          >
            Strategic operational insight for{' '}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              measurable growth
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-xl text-gray-700 max-w-2xl"
          >
            Fractional COO and business consulting that delivers clarity, efficiency, and results. We work alongside you to implement change—not just recommend it.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <ScheduleButton variant="primary" size="lg" icon>
              Schedule a Free Consultation
            </ScheduleButton>
            <Link
              href="/services"
              className="inline-flex items-center font-semibold text-gray-700 hover:text-primary transition-colors"
            >
              Explore our services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-sm text-gray-500"
          >
            30+ years experience · 500+ projects · 100% client focused
          </motion.p>
        </div>
      </div>
    </section>
  )
}
