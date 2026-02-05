'use client'

import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { ArrowRight, TrendingUp, Award, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import ScheduleButton from './CalendlyButton'

interface AnimatedCounterProps {
  value: string
  duration?: number
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 2 }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      // Handle special cases like "24/7" or "100%"
      if (value.includes('/') || value === '100%') {
        if (ref.current) {
          ref.current.textContent = value
        }
        return
      }

      // Extract number from value (e.g., "30+" -> 30)
      const numValue = parseInt(value.replace(/\D/g, '')) || 0
      const suffix = value.replace(/\d/g, '')
      
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5 }
      })

      // Animate counter
      let start = 0
      const end = numValue
      const increment = end / (duration * 60) // 60fps
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          start = end
          clearInterval(timer)
        }
        if (ref.current) {
          ref.current.textContent = Math.floor(start) + suffix
        }
      }, 1000 / 60)

      return () => clearInterval(timer)
    }
  }, [isInView, value, duration, controls])

  return <span ref={ref}>{value}</span>
}

const Hero = () => {
  const stats = [
    { icon: Award, value: '30+', label: 'Years Experience' },
    { icon: Users, value: '500+', label: 'Projects Completed' },
    { icon: TrendingUp, value: '100%', label: 'Client Focused' },
    { icon: BarChart3, value: '24/7', label: 'Support Available' },
  ]

  return (
    <section id="home" className="relative bg-gradient-to-br from-white via-blue-50/30 to-white pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-gray-900 leading-tight mb-6">
              Empowering Your Business with{' '}
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Strategic Operational Insight
              </span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
              Expert fractional COO and business consulting services to drive growth, streamline operations, and enhance profitability.
            </p>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your business with data-driven strategies and proven methodologies from industry experts.
            </p>
          </motion.div>

          <motion.div 
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ScheduleButton variant="primary" size="lg" icon>
              Schedule a Free Consultation
            </ScheduleButton>
            <Link 
              href="/#services" 
              className="btn-secondary inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 py-4 px-8 text-lg hover:shadow-lg"
            >
              Our Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                <AnimatedCounter value={stat.value} />
              </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero 